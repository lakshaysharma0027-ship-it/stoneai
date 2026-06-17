import type { SupabaseClient } from "@supabase/supabase-js";
import { bedrockProvider } from "@/lib/ai/providers/bedrock";
import { getCreditCost } from "@/lib/billing/credits";
import {
  planHasFeature,
} from "@/lib/billing/planFeatures";
import { normalizeBillingPlanId } from "@/lib/billing/plans";
import { PLAN_ACTION_LIMITS } from "@/lib/billing/planLimits";
import { assertGeminiGenerationAllowed } from "@/lib/media/geminiGate";
import { nanoBananaGallery } from "@/lib/template-catalog";
import type {
  PipelineEditRequest,
  PipelineGenerateRequest,
  PipelineGenerateResponse,
  PipelineMetadata,
  PipelineStageId,
} from "@/lib/pipeline/types";
import type { TemplateSchema } from "@/lib/templateSchemas";
import { getProjectTemplateById } from "@/lib/templates";
import { templateSchemaToWebsite } from "@/lib/editor/applyTemplateSchema";
import { aiPersistenceService } from "@/services/ai/aiPersistenceService";
import { generationLocks } from "@/services/ai/generationLocks";
import { creditService } from "@/services/billing/creditService";
import { planLimitService } from "@/services/billing/planLimitService";
import { googleMediaProvider } from "@/services/media/providers/google";
import { resolveInlineImage } from "@/lib/media/inlineImage";

const presetHeroById = (id?: string | null) =>
  nanoBananaGallery.find((item) => item.id === id) ?? nanoBananaGallery[0];

const injectHeroImage = (schema: TemplateSchema, heroImageUrl: string) => {
  const hero = schema.sections.find((section) => section.type === "hero");
  if (hero?.content) {
    hero.content.image = heroImageUrl;
    hero.content.backgroundImage = heroImageUrl;
  }
  return schema;
};

const injectMotionVideo = (schema: TemplateSchema, motionVideoUrl: string) => {
  const hero = schema.sections.find((section) => section.type === "hero");
  if (hero?.content) {
    hero.content.video = motionVideoUrl;
  }
  return schema;
};

export const pipelineService = {
  async generate(
    supabase: SupabaseClient,
    userId: string,
    input: PipelineGenerateRequest,
  ): Promise<PipelineGenerateResponse> {
    const websitePrompt = input.websitePrompt.trim();
    const businessName = input.businessName.trim();

    if (!websitePrompt || !businessName) {
      throw new Error("Website prompt and business name are required.");
    }

    const subscription = await creditService.ensureSubscription(supabase, userId);
    const planId = normalizeBillingPlanId(subscription.plan);
    const completedStages: PipelineStageId[] = ["prompt_input"];

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
      await creditService.consumeCredits(supabase, {
        userId,
        eventType: "media_video_generate",
        description: "Pipeline motion (Veo 3.1 Lite)",
      });
      completedStages.push("motion_generation");
    } else {
      completedStages.push("motion_generation");
    }

    const template = input.templateId ? getProjectTemplateById(input.templateId) : null;
    const generated = await bedrockProvider.generateWebsite({
      prompt: websitePrompt,
      businessName,
      description: websitePrompt,
      industry: "Startup",
      style: "Premium",
      colorPreference: "Cinematic premium",
      websiteType: "Cinematic landing page",
      templateId: input.templateId ?? null,
      heroImageUrl,
      lastFrameImageUrl,
      motionVideoUrl,
    });

    await creditService.consumeCredits(supabase, {
      userId,
      eventType: "generate_website",
      description: "Pipeline website build (Claude Opus)",
    });

    let websiteSchema: TemplateSchema = generated.data.websiteSchema;
    if (heroImageUrl) {
      websiteSchema = injectHeroImage(structuredClone(websiteSchema), heroImageUrl);
    }
    if (motionVideoUrl) {
      websiteSchema = injectMotionVideo(websiteSchema, motionVideoUrl);
    }

    if (template?.schema && input.templateId) {
      websiteSchema = structuredClone(template.schema) as TemplateSchema;
      if (heroImageUrl) {
        websiteSchema = injectHeroImage(websiteSchema, heroImageUrl);
      }
      if (motionVideoUrl) {
        websiteSchema = injectMotionVideo(websiteSchema, motionVideoUrl);
      }
    }

    completedStages.push("website_build");

    const pipelineMetadata: PipelineMetadata = {
      templateId: input.templateId ?? null,
      websitePrompt,
      businessName,
      firstImagePrompt: input.firstImagePrompt ?? null,
      lastImagePrompt: input.lastImagePrompt ?? null,
      veoPrompt: input.veoPrompt ?? null,
      presetHeroImageId: input.presetHeroImageId ?? null,
      heroImageUpload: input.heroImageUpload ?? null,
      lastFrameImageUpload: input.lastFrameImageUpload ?? null,
      motionVideoUpload: input.motionVideoUpload ?? null,
      heroImageUrl: heroImageUrl ?? null,
      lastFrameImageUrl: lastFrameImageUrl ?? null,
      motionVideoUrl: motionVideoUrl ?? null,
      aiEditsRemaining: planHasFeature(planId, "ai_website_edit")
        ? PLAN_ACTION_LIMITS[planId].aiEdits
        : 0,
      aiEditsUsed: 0,
      completedStages: [...completedStages, "website_ready"],
    };

    const projectId = crypto.randomUUID();
    const { data, error } = await supabase
      .from("projects")
      .insert({
        id: projectId,
        user_id: userId,
        name: generated.data.projectName || businessName,
        template_id: input.templateId ?? "generated",
        website_schema: websiteSchema,
        pipeline_metadata: pipelineMetadata,
      })
      .select("id,name")
      .single();

    if (error) throw error;

    const website = templateSchemaToWebsite(projectId, (data as { name: string }).name, websiteSchema);
    await supabase.from("websites").upsert(
      {
        project_id: projectId,
        user_id: userId,
        website,
      },
      { onConflict: "project_id" },
    );

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
      usage: generated.usage,
    });

    completedStages.push("website_ready");

    return {
      projectId,
      projectName: (data as { name: string }).name,
      websiteSchema,
      pipelineMetadata,
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

    const edited = await bedrockProvider.editWebsite({
      website: {
        id: input.projectId,
        name: (project as { name?: string }).name ?? "Generated Website",
        prompt: input.instruction,
        industry: "Startup",
        style: "Premium",
        pages: [],
      },
      instruction: input.instruction,
      websiteSchema: input.websiteSchema,
    });

    await creditService.consumeCredits(supabase, {
      userId,
      eventType: "ai_edit",
      description: "Premium AI website edit",
    });

    const nextMetadata: PipelineMetadata = {
      ...metadata,
      aiEditsUsed: used + 1,
    };

    const { error: updateError } = await supabase
      .from("projects")
      .update({
        website_schema: edited.data.websiteSchema,
        pipeline_metadata: nextMetadata,
      })
      .eq("id", input.projectId);

    if (updateError) throw updateError;

    await aiPersistenceService.recordHistory(supabase, {
      userId,
      projectId: input.projectId,
      prompt: input.instruction,
      generatedSchema: edited.data.websiteSchema,
      generationType: "edit",
    });
    await aiPersistenceService.recordUsage(supabase, {
      userId,
      projectId: input.projectId,
      requestType: "edit",
      usage: edited.usage,
    });

    return {
      websiteSchema: edited.data.websiteSchema,
      pipelineMetadata: nextMetadata,
    };
  },
};
