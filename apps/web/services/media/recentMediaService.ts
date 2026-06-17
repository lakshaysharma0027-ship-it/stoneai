import type { SupabaseClient } from "@supabase/supabase-js";
import {
  capabilitiesForSlot,
  RECENT_MEDIA_TTL_HOURS,
  type PipelineMediaSlot,
} from "@/lib/media/pipelineMediaCapabilities";

export type RecordRecentMediaInput = {
  mediaType: "image" | "video";
  capability: string;
  prompt: string;
  assetUrl: string;
  creditsUsed?: number;
  model?: string;
};

const cutoffIso = () =>
  new Date(Date.now() - RECENT_MEDIA_TTL_HOURS * 60 * 60 * 1000).toISOString();

export const recentMediaService = {
  async purgeExpired(supabase: SupabaseClient, userId: string) {
    const { error } = await supabase
      .from("media_generations")
      .delete()
      .eq("user_id", userId)
      .lt("created_at", cutoffIso());

    if (error) console.warn("[StoneAI] recent media purge failed:", error.message);
  },

  async record(
    supabase: SupabaseClient,
    userId: string,
    input: RecordRecentMediaInput,
  ) {
    if (!input.assetUrl.trim()) return;

    await recentMediaService.purgeExpired(supabase, userId);

    const { error } = await supabase.from("media_generations").insert({
      user_id: userId,
      provider: "stoneai",
      media_type: input.mediaType,
      capability: input.capability,
      prompt: input.prompt.slice(0, 500) || "Pipeline asset",
      status: "completed",
      model: input.model ?? "pipeline",
      credits_used: input.creditsUsed ?? 0,
      asset_url: input.assetUrl,
      thumbnail_url: input.mediaType === "image" ? input.assetUrl : null,
      metadata: { source: "pipeline_reuse_library" },
    });

    if (error) console.warn("[StoneAI] record recent media failed:", error.message);
  },

  async listForSlot(
    supabase: SupabaseClient,
    userId: string,
    slot: PipelineMediaSlot,
  ) {
    await recentMediaService.purgeExpired(supabase, userId);

    const capabilities = capabilitiesForSlot(slot);
    const mediaType = slot === "video" ? "video" : "image";

    const { data, error } = await supabase
      .from("media_generations")
      .select(
        "id,media_type,capability,prompt,status,asset_url,thumbnail_url,created_at",
      )
      .eq("user_id", userId)
      .eq("media_type", mediaType)
      .eq("status", "completed")
      .in("capability", [...capabilities])
      .gte("created_at", cutoffIso())
      .not("asset_url", "is", null)
      .order("created_at", { ascending: false })
      .limit(24);

    if (error) throw error;
    return data ?? [];
  },
};
