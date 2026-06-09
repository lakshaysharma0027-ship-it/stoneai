import type { SupabaseClient } from "@supabase/supabase-js";
import { getCreditCost } from "@/lib/billing/credits";
import type { GenerateImageInput, GenerateVideoInput } from "@/lib/media/types";
import { creditService } from "@/services/billing/creditService";
import { planLimitService } from "@/services/billing/planLimitService";
import { googleMediaProvider } from "@/services/media/providers/google";

const provider = googleMediaProvider;

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
    const credits = getCreditCost(input.capability === "prompt" ? "media_image_generate" : "media_image_edit");
    const subscription = await creditService.ensureSubscription(supabase, userId);
    planLimitService.assertHasCredits(subscription, credits, "generate images");

    const model = process.env.GOOGLE_NANO_BANANA_MODEL ?? "gemini-2.5-flash-image-preview";
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
      await creditService.consumeCredits(supabase, {
        userId,
        eventType: input.capability === "prompt" ? "media_image_generate" : "media_image_edit",
        description: `Image generation: ${input.capability}`,
      });
      const result = await provider.generateImage(input);
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
  },

  async generateVideo(
    supabase: SupabaseClient,
    userId: string,
    input: GenerateVideoInput,
  ) {
    const credits = getCreditCost("media_video_generate");
    const subscription = await creditService.ensureSubscription(supabase, userId);
    planLimitService.assertHasCredits(subscription, credits, "generate videos");

    const model = process.env.GOOGLE_VEO_MODEL ?? "veo-3.1-generate-preview";
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
      await creditService.consumeCredits(supabase, {
        userId,
        eventType: "media_video_generate",
        description: `Video generation: ${input.capability}`,
      });
      const result = await provider.generateVideo(input);
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
  },
};
