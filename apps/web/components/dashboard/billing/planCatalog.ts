import type { BillingPlanId } from "../types";
import { calculatePlanMonthlyCredits, PLAN_ACTION_LIMITS, PLAN_MONTHLY_PRICES } from "@/lib/billing/planLimits";
import { buildPlanFeatureRows } from "@/lib/billing/planDisplay";

export type PlanCatalogEntry = {
  id: BillingPlanId;
  name: string;
  monthlyPrice: number | null;
  credits: number;
  sites: number;
  images: number;
  videos: number;
  aiEdits: number;
};

export const PLAN_CATALOG: PlanCatalogEntry[] = [
  {
    id: "free_trial",
    name: "Free Trial",
    monthlyPrice: null,
    credits: calculatePlanMonthlyCredits("free_trial"),
    sites: PLAN_ACTION_LIMITS.free_trial.websites,
    images: PLAN_ACTION_LIMITS.free_trial.images,
    videos: PLAN_ACTION_LIMITS.free_trial.videos,
    aiEdits: PLAN_ACTION_LIMITS.free_trial.aiEdits,
  },
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: PLAN_MONTHLY_PRICES.basic,
    credits: calculatePlanMonthlyCredits("basic"),
    sites: PLAN_ACTION_LIMITS.basic.websites,
    images: PLAN_ACTION_LIMITS.basic.images,
    videos: PLAN_ACTION_LIMITS.basic.videos,
    aiEdits: PLAN_ACTION_LIMITS.basic.aiEdits,
  },
  {
    id: "basic_plus",
    name: "Basic Plus",
    monthlyPrice: PLAN_MONTHLY_PRICES.basic_plus,
    credits: calculatePlanMonthlyCredits("basic_plus"),
    sites: PLAN_ACTION_LIMITS.basic_plus.websites,
    images: PLAN_ACTION_LIMITS.basic_plus.images,
    videos: PLAN_ACTION_LIMITS.basic_plus.videos,
    aiEdits: PLAN_ACTION_LIMITS.basic_plus.aiEdits,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: PLAN_MONTHLY_PRICES.pro,
    credits: calculatePlanMonthlyCredits("pro"),
    sites: PLAN_ACTION_LIMITS.pro.websites,
    images: PLAN_ACTION_LIMITS.pro.images,
    videos: PLAN_ACTION_LIMITS.pro.videos,
    aiEdits: PLAN_ACTION_LIMITS.pro.aiEdits,
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: PLAN_MONTHLY_PRICES.premium,
    credits: calculatePlanMonthlyCredits("premium"),
    sites: PLAN_ACTION_LIMITS.premium.websites,
    images: PLAN_ACTION_LIMITS.premium.images,
    videos: PLAN_ACTION_LIMITS.premium.videos,
    aiEdits: PLAN_ACTION_LIMITS.premium.aiEdits,
  },
];

export const PLAN_FEATURE_ROWS = buildPlanFeatureRows();

export const formatPlanPrice = (price: number | null) =>
  price === null ? "Free" : `$${price}/mo`;
