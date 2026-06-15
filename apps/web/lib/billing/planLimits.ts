import { CREDIT_COSTS } from "./credits";
import type { BillingPlanId } from "./plans";

export type PlanActionLimits = {
  websites: number;
  images: number;
  videos: number;
  aiEdits: number;
};

export const FREE_TRIAL_DAYS = 3;

export const PLAN_ACTION_LIMITS: Record<BillingPlanId, PlanActionLimits> = {
  free_trial: { websites: 1, images: 0, videos: 0, aiEdits: 0 },
  basic: { websites: 1, images: 2, videos: 1, aiEdits: 1 },
  basic_plus: { websites: 2, images: 4, videos: 2, aiEdits: 2 },
  pro: { websites: 4, images: 16, videos: 6, aiEdits: 6 },
  premium: { websites: 10, images: 20, videos: 15, aiEdits: 20 },
};

export const PLAN_MONTHLY_PRICES: Record<Exclude<BillingPlanId, "free_trial">, number> = {
  basic: 15,
  basic_plus: 25,
  pro: 50,
  premium: 100,
};

export const calculatePlanMonthlyCredits = (planId: BillingPlanId): number => {
  const limits = PLAN_ACTION_LIMITS[planId];
  return (
    limits.websites * CREDIT_COSTS.generate_website +
    limits.images * CREDIT_COSTS.media_image_generate +
    limits.videos * CREDIT_COSTS.media_video_generate +
    limits.aiEdits * CREDIT_COSTS.ai_edit
  );
};

export type UsageAction = keyof PlanActionLimits;

export const USAGE_ACTION_LABELS: Record<UsageAction, string> = {
  websites: "Websites generated",
  images: "Images generated",
  videos: "Videos generated",
  aiEdits: "AI edits used",
};
