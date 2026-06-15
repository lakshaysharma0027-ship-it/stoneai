import type { SupabaseClient } from "@supabase/supabase-js";
import { bedrockProvider } from "@/lib/ai/providers/bedrock";
import { getCreditCost } from "@/lib/billing/credits";
import {
  planHasFeature,
} from "@/lib/billing/planFeatures";
import { normalizeBillingPlanId } from "@/lib/billing/plans";
import { PLAN_ACTION_LIMITS } from "@/lib/billing/planLimits";
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
import { aiPersistenceService } from "@/services/ai/aiPersistenceService";
import { creditService } from "@/services/billing/creditService";
import { planLimitService } from "@/services/billing/planLimitService";
import { googleMediaProvider } from "@/services/media/providers/google";

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
      (planHasFeature(planId, "first_image_prompt") && input.firstImagePrompt?.trim()
        ? getCreditCost("media_image_generate")
        : 0) +
      (planHasFeature(planId, "last_image_prompt") && input.lastImagePrompt?.trim()
        ? getCreditCost("media_image_generate")
        : 0) +
      (planHasFeature(planId, "veo") && input.veoPrompt?.trim()
        ? getCreditCost("media_video_generate")
        : 0);

    planLimitService.assertHasCredits(subscription, totalCredits, "run the generation pipeline");

    if (planHasFeature(planId, "first_image_prompt") && input.firstImagePrompt?.trim()) {
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

    if (planHasFeature(planId, "last_image_prompt") && input.lastImagePrompt?.trim()) {
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

    if (
      planHasFeature(planId, "veo") &&
      input.veoPrompt?.trim() &&
      heroImageUrl
    ) {
      await planLimitService.assertWithinActionLimit(supabase, {
        userId,
        subscription,
        action: "videos",
      });
      const heroBase64 = heroImageUrl.startsWith("data:")
        ? heroImageUrl.split(",")[1]
        : undefined;
      const videoResult = await googleMediaProvider.generateVideo({
        prompt: input.veoPrompt.trim(),
        capability: "hero_video",
        aspectRatio: "16:9",
        durationSeconds: 6,
        inputImageBase64: heroBase64,
        inputMimeType: "image/png",
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

    if (template?.schema && input.templateId) {
      websiteSchema = structuredClone(template.schema) as TemplateSchema;
      if (heroImageUrl) {
        websiteSchema = injectHeroImage(websiteSchema, heroImageUrl);
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
  },

  async editWebsite(
    supabase: SupabaseClient,
    userId: string,
    input: PipelineEditRequest,
  ) {
    const subscription = await creditService.ensureSubscription(supabase, userId);
    const planId = normalizeBillingPlanId(subscription.plan);

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
