import type { SupabaseClient } from "@supabase/supabase-js";
import {
  PLAN_ACTION_LIMITS,
  type PlanActionLimits,
  type UsageAction,
} from "@/lib/billing/planLimits";
import { normalizeBillingPlanId } from "@/lib/billing/plans";
import type { CustomerSubscription } from "@/lib/billing/types";

export type UsageSummary = PlanActionLimits & {
  creditsUsed: number;
  creditsRemaining: number;
  limits: PlanActionLimits;
};

const WEBSITE_EVENTS = ["generate_website"];
const IMAGE_EVENTS = ["media_image_generate", "media_image_edit"];
const VIDEO_EVENTS = ["media_video_generate"];
const AI_EDIT_EVENTS = ["ai_edit"];

const getPeriodStart = (subscription: CustomerSubscription) =>
  subscription.currentPeriodStart ?? subscription.createdAt;

export const usageService = {
  async countUsage(
    supabase: SupabaseClient,
    userId: string,
    subscription: CustomerSubscription,
  ): Promise<PlanActionLimits> {
    const periodStart = getPeriodStart(subscription);

    const [websiteResult, imageResult, videoResult, aiEditResult] = await Promise.all([
      supabase
        .from("usage_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .in("event_type", WEBSITE_EVENTS)
        .gte("created_at", periodStart),
      supabase
        .from("usage_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .in("event_type", IMAGE_EVENTS)
        .gte("created_at", periodStart),
      supabase
        .from("usage_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .in("event_type", VIDEO_EVENTS)
        .gte("created_at", periodStart),
      supabase
        .from("usage_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .in("event_type", AI_EDIT_EVENTS)
        .gte("created_at", periodStart),
    ]);

    if (websiteResult.error) throw websiteResult.error;
    if (imageResult.error) throw imageResult.error;
    if (videoResult.error) throw videoResult.error;
    if (aiEditResult.error) throw aiEditResult.error;

    return {
      websites: websiteResult.count ?? 0,
      images: imageResult.count ?? 0,
      videos: videoResult.count ?? 0,
      aiEdits: aiEditResult.count ?? 0,
    };
  },

  async getSummary(
    supabase: SupabaseClient,
    userId: string,
    subscription: CustomerSubscription,
  ): Promise<UsageSummary> {
    const used = await this.countUsage(supabase, userId, subscription);
    const limits = PLAN_ACTION_LIMITS[normalizeBillingPlanId(subscription.plan)];

    return {
      ...used,
      limits,
      creditsUsed: Math.max(subscription.monthlyCredits - subscription.creditsRemaining, 0),
      creditsRemaining: subscription.creditsRemaining,
    };
  },

  actionKeyForEvent(eventType: string): UsageAction | null {
    if (WEBSITE_EVENTS.includes(eventType)) return "websites";
    if (IMAGE_EVENTS.includes(eventType)) return "images";
    if (VIDEO_EVENTS.includes(eventType)) return "videos";
    if (AI_EDIT_EVENTS.includes(eventType)) return "aiEdits";
    return null;
  },
};
