import type { SupabaseClient } from "@supabase/supabase-js";
import { getCreditCost, type CreditEventType } from "@/lib/billing/credits";
import { assertGeminiGenerationAllowed } from "@/lib/media/geminiGate";
import type { GenerateImageInput, GenerateVideoInput } from "@/lib/media/types";
import { creditService } from "@/services/billing/creditService";
import { planLimitService } from "@/services/billing/planLimitService";
import { googleMediaProvider } from "@/services/media/providers/google";

const provider = googleMediaProvider;

const imageEventType = (capability: GenerateImageInput["capability"]): CreditEventType =>
  capability === "prompt" ? "media_image_generate" : "media_image_edit";

export const mediaService = {
  async listHistory(supabase: SupabaseClient, userId: string) {
    const { data, error } = await supabase
      .from("media_generations")
      .select("id,provider,media_type,capability,prompt,status,model,credits_used,cost_cents,duration_seconds,operation_id,asset_url,thumbnail_url,error_message,metadata,created_at,updated_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data ?? [];
  },

  async generateImage(
    supabase: SupabaseClient,
    userId: string,
    input: GenerateImageInput,
  ) {
    const { generationLocks } = await import("@/services/ai/generationLocks");
    generationLocks.acquireMedia(userId);
    try {
    const eventType = imageEventType(input.capability);
    const credits = getCreditCost(eventType);
    const subscription = await creditService.ensureSubscription(supabase, userId);
    assertGeminiGenerationAllowed(subscription, "nano_banana");
    await planLimitService.assertWithinActionLimit(supabase, {
      userId,
      subscription,
      action: "images",
    });
    planLimitService.assertHasCredits(subscription, credits, "generate images");

    const model = process.env.GOOGLE_NANO_BANANA_MODEL ?? "gemini-2.5-flash-image";
    const { data: row, error } = await supabase
      .from("media_generations")
      .insert({
        user_id: userId,
        provider: "google",
        media_type: "image",
        capability: input.capability,
        prompt: input.prompt,
        status: "processing",
        model,
        credits_used: credits,
      })
      .select("id")
      .single();

    if (error) throw error;
    const generationId = (row as { id: string }).id;

    try {
      const result = await provider.generateImage(input);
      await creditService.consumeCredits(supabase, {
        userId,
        eventType,
        description: `Image generation: ${input.capability}`,
      });
      const { data, error: updateError } = await supabase
        .from("media_generations")
        .update({
          status: result.status,
          asset_url: result.assetUrl ?? null,
          thumbnail_url: result.thumbnailUrl ?? result.assetUrl ?? null,
          operation_id: result.operationId ?? null,
          metadata: result.metadata ?? {},
        })
        .eq("id", generationId)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    } catch (error) {
      await supabase
        .from("media_generations")
        .update({
          status: "failed",
          error_message: error instanceof Error ? error.message : "Image generation failed.",
        })
        .eq("id", generationId);
      throw error;
    }
    } finally {
      generationLocks.releaseMedia(userId);
    }
  },

  async generateVideo(
    supabase: SupabaseClient,
    userId: string,
    input: GenerateVideoInput,
  ) {
    const { generationLocks } = await import("@/services/ai/generationLocks");
    generationLocks.acquireMedia(userId);
    try {
    const eventType: CreditEventType = "media_video_generate";
    const credits = getCreditCost(eventType);
    const subscription = await creditService.ensureSubscription(supabase, userId);
    assertGeminiGenerationAllowed(subscription, "veo");
    await planLimitService.assertWithinActionLimit(supabase, {
      userId,
      subscription,
      action: "videos",
    });
    planLimitService.assertHasCredits(subscription, credits, "generate videos");

    const model = "veo-3.1-lite-generate-preview";
    const { data: row, error } = await supabase
      .from("media_generations")
      .insert({
        user_id: userId,
        provider: "google",
        media_type: "video",
        capability: input.capability,
        prompt: input.prompt,
        status: "processing",
        model,
        credits_used: credits,
        duration_seconds: input.durationSeconds ?? 8,
      })
      .select("id")
      .single();

    if (error) throw error;
    const generationId = (row as { id: string }).id;

    try {
      const result = await provider.generateVideo(input);
      await creditService.consumeCredits(supabase, {
        userId,
        eventType,
        description: `Video generation: ${input.capability}`,
      });
      const { data, error: updateError } = await supabase
        .from("media_generations")
        .update({
          status: result.status,
          asset_url: result.assetUrl ?? null,
          operation_id: result.operationId ?? null,
          metadata: result.metadata ?? {},
        })
        .eq("id", generationId)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    } catch (error) {
      await supabase
        .from("media_generations")
        .update({
          status: "failed",
          error_message: error instanceof Error ? error.message : "Video generation failed.",
        })
        .eq("id", generationId);
      throw error;
    }
    } finally {
      generationLocks.releaseMedia(userId);
    }
  },

  async pollVideoStatus(
    supabase: SupabaseClient,
    userId: string,
    generationId: string,
  ) {
    const { data: row, error } = await supabase
      .from("media_generations")
      .select("*")
      .eq("id", generationId)
      .eq("user_id", userId)
      .single();

    if (error || !row) throw new Error("Video generation not found.");

    const record = row as {
      id: string;
      status: string;
      operation_id: string | null;
      asset_url: string | null;
      metadata: Record<string, unknown>;
    };

    if (record.status === "completed" || record.status === "failed" || !record.operation_id) {
      return row;
    }

    const { GoogleGenAI } = await import("@google/genai");
    const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GOOGLE_API_KEY.");

    const ai = new GoogleGenAI({ apiKey });
    const storedOperation = record.metadata?.operation as { name?: string } | undefined;
    const operation = await ai.operations.getVideosOperation({
      operation: (storedOperation?.name
        ? storedOperation
        : { name: record.operation_id }) as Parameters<
        typeof ai.operations.getVideosOperation
      >[0]["operation"],
    });

    if (!operation.done) {
      return row;
    }

    const videoResponse = operation.response as
      | { generatedVideos?: Array<{ video?: { uri?: string } }> }
      | undefined;
    const assetUrl = videoResponse?.generatedVideos?.[0]?.video?.uri ?? null;
    const status = assetUrl ? "completed" : "failed";

    const { data: updated, error: updateError } = await supabase
      .from("media_generations")
      .update({
        status,
        asset_url: assetUrl,
        metadata: { ...record.metadata, operation },
        error_message: assetUrl ? null : "Video generation completed without output.",
      })
      .eq("id", generationId)
      .select()
      .single();

    if (updateError) throw updateError;
    return updated;
  },
};
