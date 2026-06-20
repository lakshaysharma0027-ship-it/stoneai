import type { SupabaseClient } from "@supabase/supabase-js";
import { bedrockProvider } from "@/lib/ai/providers/bedrock";
import { getCreditCost } from "@/lib/billing/credits";
import { planHasFeature } from "@/lib/billing/planFeatures";
import { normalizeBillingPlanId } from "@/lib/billing/plans";
import { PLAN_ACTION_LIMITS } from "@/lib/billing/planLimits";
import { assertGeminiGenerationAllowed } from "@/lib/media/geminiGate";
import { nanoBananaGallery, getTemplateById } from "@/lib/template-catalog";
import type {
  PipelineEditRequest,
  PipelineGenerateRequest,
  PipelineGenerateResponse,
  PipelineMetadata,
  PipelineStageId,
} from "@/lib/pipeline/types";
import type { TemplateSchema } from "@/lib/templateSchemas";
import { aiPersistenceService } from "@/services/ai/aiPersistenceService";
import { generationLocks } from "@/services/ai/generationLocks";
import { creditService } from "@/services/billing/creditService";
import { planLimitService } from "@/services/billing/planLimitService";
import { recentMediaService } from "@/services/media/recentMediaService";
import { googleMediaProvider } from "@/services/media/providers/google";
import { resolveInlineImage } from "@/lib/media/inlineImage";
import { sanitizeStoredUpload } from "@/lib/media/schemaMedia";
import { buildScrollFrames } from "@/lib/cinematic/frameExtraction";
import {
  buildCinematicExperience,
  cinematicExperienceToWebsite,
} from "@/lib/cinematic/buildExperience";
import {
  persistCinematicExperience,
  slimCinematicMetadata,
} from "@/lib/cinematic/persistExperience";
import { DEFAULT_FRAME_COUNT } from "@/lib/cinematic/types";
import type { CinematicExperience } from "@/lib/cinematic/types";
import type { Website } from "@/lib/editor/schema";
import { rehydrateCinematicExperience } from "@/lib/cinematic/rehydrateExperience";
import { saveProjectWebsiteRecord } from "@/lib/sites/saveProjectWebsite";
import { buildPromptAttachmentContext } from "@/lib/pipeline/promptAttachments.server";
import { validatePromptAttachments } from "@/lib/pipeline/validatePromptAttachments.server";

const presetHeroById = (id?: string | null) =>
  nanoBananaGallery.find((item) => item.id === id) ?? nanoBananaGallery[0];

const templateReference = (templateId?: string | null) => {
  if (!templateId) return null;
  const template = getTemplateById(templateId);
  if (!template) return null;
  return `${template.name}: ${template.description}`;
};

const cinematicStubSchema = (
  projectName: string,
  story: string,
  heroImageUrl?: string,
  motionVideoUrl?: string,
): TemplateSchema => ({
  id: "generated",
  sections: [
    {
      id: "cinematic-hero",
      type: "hero",
      content: {
        heading: projectName,
        body: story,
        ...(heroImageUrl ? { image: heroImageUrl, backgroundImage: heroImageUrl } : {}),
        ...(motionVideoUrl ? { video: motionVideoUrl } : {}),
      },
    },
  ],
});

export const pipelineService = {
  async generate(
    supabase: SupabaseClient,
    userId: string,
    input: PipelineGenerateRequest,
  ): Promise<PipelineGenerateResponse> {
    const websitePrompt = input.websitePrompt.trim();
    const businessName = input.businessName.trim();
    const promptAttachments = input.promptAttachments ?? [];

    if (!websitePrompt || !businessName) {
      throw new Error("Website prompt and business name are required.");
    }

    validatePromptAttachments(promptAttachments, userId);

    const attachmentContext = await buildPromptAttachmentContext(promptAttachments, userId);
    const creativeBrief = attachmentContext
      ? `${websitePrompt}\n\n${attachmentContext}`
      : websitePrompt;

    const subscription = await creditService.ensureSubscription(supabase, userId);
    const planId = normalizeBillingPlanId(subscription.plan);
    const completedStages: PipelineStageId[] = ["prompt_input"];
    const projectId = crypto.randomUUID();

    planLimitService.assertSubscriptionActive(subscription);

    if (!planHasFeature(planId, "website_prompt")) {
      throw new Error("Your plan does not include website generation.");
    }

    await planLimitService.assertWithinActionLimit(supabase, {
      userId,
      subscription,
      action: "websites",
    });

    let heroImageUrl: string | undefined;
    let lastFrameImageUrl: string | undefined;
    let motionVideoUrl: string | undefined;

    const totalCredits =
      getCreditCost("generate_website") +
      (planHasFeature(planId, "first_image_prompt") &&
      input.firstImagePrompt?.trim() &&
      !input.heroImageUpload?.trim()
        ? getCreditCost("media_image_generate")
        : 0) +
      (planHasFeature(planId, "last_image_prompt") &&
      input.lastImagePrompt?.trim() &&
      !input.lastFrameImageUpload?.trim()
        ? getCreditCost("media_image_generate")
        : 0) +
      (planHasFeature(planId, "veo") &&
      input.veoPrompt?.trim() &&
      !input.motionVideoUpload?.trim()
        ? getCreditCost("media_video_generate")
        : 0);

    planLimitService.assertHasCredits(subscription, totalCredits, "run the generation pipeline");

    generationLocks.acquirePipeline(userId);
    try {
      if (planHasFeature(planId, "media_upload") && input.heroImageUpload?.trim()) {
        heroImageUrl = input.heroImageUpload.trim();
      } else if (planHasFeature(planId, "first_image_prompt") && input.firstImagePrompt?.trim()) {
        assertGeminiGenerationAllowed(subscription, "nano_banana");
        await planLimitService.assertWithinActionLimit(supabase, {
          userId,
          subscription,
          action: "images",
        });
        const imageResult = await googleMediaProvider.generateImage({
          prompt: input.firstImagePrompt.trim(),
          capability: "hero_image",
          aspectRatio: "16:9",
        });
      heroImageUrl = imageResult.assetUrl;
      if (imageResult.assetUrl) {
        await recentMediaService.record(supabase, userId, {
          mediaType: "image",
          capability: "pipeline_first_frame",
          prompt: input.firstImagePrompt.trim(),
          assetUrl: imageResult.assetUrl,
          creditsUsed: getCreditCost("media_image_generate"),
          model: process.env.GOOGLE_NANO_BANANA_MODEL ?? "gemini-2.5-flash-image",
        });
      }
      await creditService.consumeCredits(supabase, {
          userId,
          eventType: "media_image_generate",
          description: "Pipeline hero image (Nano Banana)",
        });
      } else if (planHasFeature(planId, "preset_gallery")) {
        const preset = presetHeroById(input.presetHeroImageId);
        heroImageUrl = preset?.src;
      }

      completedStages.push("image_generation");

      if (planHasFeature(planId, "media_upload") && input.lastFrameImageUpload?.trim()) {
        lastFrameImageUrl = input.lastFrameImageUpload.trim();
      } else if (planHasFeature(planId, "last_image_prompt") && input.lastImagePrompt?.trim()) {
        assertGeminiGenerationAllowed(subscription, "nano_banana");
        await planLimitService.assertWithinActionLimit(supabase, {
          userId,
          subscription,
          action: "images",
        });
        const lastFrame = await googleMediaProvider.generateImage({
          prompt: input.lastImagePrompt.trim(),
          capability: "hero_image",
          aspectRatio: "16:9",
        });
        lastFrameImageUrl = lastFrame.assetUrl;
        if (lastFrame.assetUrl) {
          await recentMediaService.record(supabase, userId, {
            mediaType: "image",
            capability: "pipeline_last_frame",
            prompt: input.lastImagePrompt.trim(),
            assetUrl: lastFrame.assetUrl,
            creditsUsed: getCreditCost("media_image_generate"),
            model: process.env.GOOGLE_NANO_BANANA_MODEL ?? "gemini-2.5-flash-image",
          });
        }
        await creditService.consumeCredits(supabase, {
          userId,
          eventType: "media_image_generate",
          description: "Pipeline last frame (Nano Banana)",
        });
      }

      if (planHasFeature(planId, "media_upload") && input.motionVideoUpload?.trim()) {
        motionVideoUrl = input.motionVideoUpload.trim();
        completedStages.push("motion_generation");
      } else if (
        planHasFeature(planId, "veo") &&
        input.veoPrompt?.trim() &&
        heroImageUrl
      ) {
        assertGeminiGenerationAllowed(subscription, "veo");
        if (!lastFrameImageUrl) {
          throw new Error(
            "Veo motion needs a first and last frame. Add a last-frame image in step 3 (upload or Nano Banana) before generating video.",
          );
        }
        await planLimitService.assertWithinActionLimit(supabase, {
          userId,
          subscription,
          action: "videos",
        });
        const firstFrame = await resolveInlineImage(heroImageUrl);
        if (!firstFrame) {
          throw new Error("Could not read the hero image for Veo video generation.");
        }
        const lastFrame = lastFrameImageUrl ? await resolveInlineImage(lastFrameImageUrl) : undefined;

        const videoResult = await googleMediaProvider.generateVideo({
          prompt: input.veoPrompt.trim(),
          capability: "hero_video",
          aspectRatio: "16:9",
          durationSeconds: 8,
          inputImageBase64: firstFrame.imageBytes,
          inputMimeType: firstFrame.mimeType,
          lastFrameImageBase64: lastFrame?.imageBytes,
          lastFrameMimeType: lastFrame?.mimeType,
        });
        motionVideoUrl = videoResult.assetUrl;
        if (videoResult.assetUrl) {
          await recentMediaService.record(supabase, userId, {
            mediaType: "video",
            capability: "pipeline_motion_video",
            prompt: input.veoPrompt.trim(),
            assetUrl: videoResult.assetUrl,
            creditsUsed: getCreditCost("media_video_generate"),
            model: "veo-3.1-lite-generate-preview",
          });
        }
        await creditService.consumeCredits(supabase, {
          userId,
          eventType: "media_video_generate",
          description: "Pipeline motion (Veo 3.1 Lite)",
        });
        completedStages.push("motion_generation");
      } else {
        completedStages.push("motion_generation");
      }

      const { frames, source: frameSource } = await buildScrollFrames({
        motionVideoUrl,
        heroImageUrl,
        lastFrameImageUrl,
        frameCount: DEFAULT_FRAME_COUNT,
      });
      completedStages.push("frame_extraction");

      if (motionVideoUrl && frameSource !== "video") {
        throw new Error(
          "Motion video was provided but scroll frames could not be extracted from it. Use MP4 or WebM under 50MB.",
        );
      }

      if (frameSource === "video" && frames.length < 12) {
        throw new Error(
          `Video frame extraction produced only ${frames.length} frames. Upload a longer MP4/WebM clip.`,
        );
      }

      const templateStyle = templateReference(input.templateId);
      const scenePlan = await bedrockProvider.generateCinematicPlan({
        prompt: creativeBrief,
        businessName,
        description: creativeBrief,
        industry: "Portfolio",
        style: "Premium",
        colorPreference: "Dark premium",
        websiteType: "Scroll-driven cinematic experience",
        templateReference: templateStyle,
        media: {
          heroImageReady: Boolean(heroImageUrl),
          lastFrameImageReady: Boolean(lastFrameImageUrl),
          motionVideoReady: Boolean(motionVideoUrl),
        },
      });

      await creditService.consumeCredits(supabase, {
        userId,
        eventType: "generate_website",
        description: "Pipeline cinematic scene build (Claude Opus)",
      });

      let cinematicExperience = buildCinematicExperience(scenePlan.data, {
        frames,
        frameSource,
        heroImageUrl,
        lastFrameImageUrl,
        motionVideoUrl,
      });

      cinematicExperience = await persistCinematicExperience(
        supabase,
        userId,
        projectId,
        cinematicExperience,
      );

      const websiteSchema = cinematicStubSchema(
        scenePlan.data.projectName,
        scenePlan.data.story,
        cinematicExperience.heroImageUrl ?? undefined,
        cinematicExperience.motionVideoUrl ?? undefined,
      );

      completedStages.push("website_build");

      const slimMeta = slimCinematicMetadata(cinematicExperience);
      const pipelineMetadata: PipelineMetadata = {
        templateId: input.templateId ?? null,
        websitePrompt,
        businessName,
        promptAttachments: promptAttachments.length ? promptAttachments : undefined,
        firstImagePrompt: input.firstImagePrompt ?? null,
        lastImagePrompt: input.lastImagePrompt ?? null,
        veoPrompt: input.veoPrompt ?? null,
        presetHeroImageId: input.presetHeroImageId ?? null,
        heroImageUpload: sanitizeStoredUpload(input.heroImageUpload),
        lastFrameImageUpload: sanitizeStoredUpload(input.lastFrameImageUpload),
        motionVideoUpload: sanitizeStoredUpload(input.motionVideoUpload),
        heroImageReady: Boolean(cinematicExperience.heroImageUrl),
        lastFrameImageReady: Boolean(cinematicExperience.lastFrameImageUrl),
        motionVideoReady: Boolean(cinematicExperience.motionVideoUrl),
        renderMode: "cinematic_scroll",
        frameSource,
        cinematicExperience: { ...cinematicExperience, frames: [] },
        aiEditsRemaining: planHasFeature(planId, "ai_website_edit")
          ? PLAN_ACTION_LIMITS[planId].aiEdits
          : 0,
        aiEditsUsed: 0,
        completedStages: [...completedStages, "website_ready"],
      };

      const { data, error } = await supabase
        .from("projects")
        .insert({
          id: projectId,
          user_id: userId,
          name: scenePlan.data.projectName || businessName,
          template_id: input.templateId ?? "generated",
          website_schema: websiteSchema,
          pipeline_metadata: pipelineMetadata,
        })
        .select("id,name")
        .single();

      if (error) throw error;

      const website = cinematicExperienceToWebsite(projectId, cinematicExperience);
      try {
        await saveProjectWebsiteRecord(supabase, userId, projectId, website);
      } catch (saveError) {
        await supabase.from("projects").delete().eq("id", projectId).eq("user_id", userId);
        throw saveError;
      }

      await aiPersistenceService.recordHistory(supabase, {
        userId,
        projectId,
        prompt: websitePrompt,
        generatedSchema: websiteSchema,
        generationType: "generate",
      });
      await aiPersistenceService.recordUsage(supabase, {
        userId,
        projectId,
        requestType: "generate",
        usage: scenePlan.usage,
      });

      return {
        projectId,
        projectName: (data as { name: string }).name,
        websiteSchema,
        pipelineMetadata: {
          ...pipelineMetadata,
          cinematicExperience: { ...slimMeta, frames: [] } as CinematicExperience,
        },
        publicPreviewPath: `/preview/${projectId}`,
      };
    } finally {
      generationLocks.releasePipeline(userId);
    }
  },

  async editWebsite(
    supabase: SupabaseClient,
    userId: string,
    input: PipelineEditRequest,
  ) {
    const subscription = await creditService.ensureSubscription(supabase, userId);
    const planId = normalizeBillingPlanId(subscription.plan);

    planLimitService.assertSubscriptionActive(subscription);

    if (!planHasFeature(planId, "ai_website_edit")) {
      throw new Error("AI website edits are not included on your current plan.");
    }

    await planLimitService.assertWithinActionLimit(supabase, {
      userId,
      subscription,
      action: "aiEdits",
    });

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id,name,pipeline_metadata")
      .eq("id", input.projectId)
      .eq("user_id", userId)
      .single();

    if (projectError || !project) {
      throw new Error("Project not found.");
    }

    const metadata = ((project as { pipeline_metadata?: PipelineMetadata }).pipeline_metadata ??
      {}) as PipelineMetadata;
    const used = metadata.aiEditsUsed ?? 0;

    const creditCost = getCreditCost("ai_edit");
    planLimitService.assertHasCredits(subscription, creditCost, "edit with AI");

    const { data: websiteRow, error: websiteError } = await supabase
      .from("websites")
      .select("website")
      .eq("project_id", input.projectId)
      .maybeSingle();

    if (websiteError) throw websiteError;

    const storedWebsite = (websiteRow as { website?: Website } | null)?.website;
    const currentExperience =
      storedWebsite?.meta.cinematicExperience ??
      metadata.cinematicExperience ??
      null;

    if (!currentExperience || metadata.renderMode !== "cinematic_scroll") {
      throw new Error("This project uses the legacy format. Regenerate with the cinematic pipeline.");
    }

    const hydratedExperience = await rehydrateCinematicExperience(
      supabase,
      userId,
      input.projectId,
      currentExperience,
    );

    const currentPlan = {
      projectName: hydratedExperience.projectName,
      story: hydratedExperience.story,
      scenes: hydratedExperience.scenes,
      seo: hydratedExperience.seo,
    };

    const edited = await bedrockProvider.editCinematicPlan({
      instruction: input.instruction,
      currentPlan,
      businessName: metadata.businessName || (project as { name?: string }).name || "Project",
    });

    await creditService.consumeCredits(supabase, {
      userId,
      eventType: "ai_edit",
      description: "Cinematic scene edit",
    });

    const updatedExperience = buildCinematicExperience(edited.data, {
      frames: hydratedExperience.frames,
      frameSource: hydratedExperience.frameSource ?? "video",
      heroImageUrl: hydratedExperience.heroImageUrl,
      lastFrameImageUrl: hydratedExperience.lastFrameImageUrl,
      motionVideoUrl: hydratedExperience.motionVideoUrl,
    });

    const websiteSchema = cinematicStubSchema(
      edited.data.projectName,
      edited.data.story,
      updatedExperience.heroImageUrl ?? undefined,
      updatedExperience.motionVideoUrl ?? undefined,
    );

    const nextMetadata: PipelineMetadata = {
      ...metadata,
      aiEditsUsed: used + 1,
      cinematicExperience: { ...slimCinematicMetadata(updatedExperience), frames: [] },
    };

    const website = cinematicExperienceToWebsite(input.projectId, updatedExperience);

    const { error: updateError } = await supabase
      .from("projects")
      .update({
        name: edited.data.projectName,
        website_schema: websiteSchema,
        pipeline_metadata: nextMetadata,
      })
      .eq("id", input.projectId);

    if (updateError) throw updateError;

    await saveProjectWebsiteRecord(supabase, userId, input.projectId, website);

    await aiPersistenceService.recordHistory(supabase, {
      userId,
      projectId: input.projectId,
      prompt: input.instruction,
      generatedSchema: websiteSchema,
      generationType: "edit",
    });
    await aiPersistenceService.recordUsage(supabase, {
      userId,
      projectId: input.projectId,
      requestType: "edit",
      usage: edited.usage,
    });

    return {
      websiteSchema,
      pipelineMetadata: nextMetadata,
    };
  },
};
