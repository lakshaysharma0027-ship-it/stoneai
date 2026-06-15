import type { BillingPlanId } from "../types";
import { calculatePlanMonthlyCredits, PLAN_ACTION_LIMITS } from "@/lib/billing/planLimits";

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
    monthlyPrice: 15,
    credits: calculatePlanMonthlyCredits("basic"),
    sites: PLAN_ACTION_LIMITS.basic.websites,
    images: PLAN_ACTION_LIMITS.basic.images,
    videos: PLAN_ACTION_LIMITS.basic.videos,
    aiEdits: PLAN_ACTION_LIMITS.basic.aiEdits,
  },
  {
    id: "basic_plus",
    name: "Basic Plus",
    monthlyPrice: 25,
    credits: calculatePlanMonthlyCredits("basic_plus"),
    sites: PLAN_ACTION_LIMITS.basic_plus.websites,
    images: PLAN_ACTION_LIMITS.basic_plus.images,
    videos: PLAN_ACTION_LIMITS.basic_plus.videos,
    aiEdits: PLAN_ACTION_LIMITS.basic_plus.aiEdits,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 50,
    credits: calculatePlanMonthlyCredits("pro"),
    sites: PLAN_ACTION_LIMITS.pro.websites,
    images: PLAN_ACTION_LIMITS.pro.images,
    videos: PLAN_ACTION_LIMITS.pro.videos,
    aiEdits: PLAN_ACTION_LIMITS.pro.aiEdits,
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 100,
    credits: calculatePlanMonthlyCredits("premium"),
    sites: PLAN_ACTION_LIMITS.premium.websites,
    images: PLAN_ACTION_LIMITS.premium.images,
    videos: PLAN_ACTION_LIMITS.premium.videos,
    aiEdits: PLAN_ACTION_LIMITS.premium.aiEdits,
  },
];

export const PLAN_FEATURE_ROWS: Array<{
  name: string;
  values: Record<BillingPlanId, string | boolean>;
}> = [
  {
    name: "Credits / period",
    values: {
      free_trial: "100",
      basic: "250",
      basic_plus: "500",
      pro: "1,400",
      premium: "3,250",
    },
  },
  {
    name: "Websites",
    values: {
      free_trial: "1",
      basic: "1",
      basic_plus: "2",
      pro: "4",
      premium: "10",
    },
  },
  {
    name: "Images",
    values: {
      free_trial: false,
      basic: "2",
      basic_plus: "4",
      pro: "16",
      premium: "20",
    },
  },
  {
    name: "Videos",
    values: {
      free_trial: false,
      basic: "1",
      basic_plus: "2",
      pro: "6",
      premium: "15",
    },
  },
  {
    name: "AI edits",
    values: {
      free_trial: false,
      basic: "1",
      basic_plus: "2",
      pro: "6",
      premium: "20",
    },
  },
  {
    name: "Custom domains",
    values: {
      free_trial: false,
      basic: true,
      basic_plus: true,
      pro: true,
      premium: true,
    },
  },
  {
    name: "Nano Banana",
    values: {
      free_trial: false,
      basic: true,
      basic_plus: true,
      pro: true,
      premium: true,
    },
  },
  {
    name: "Veo video",
    values: {
      free_trial: false,
      basic: true,
      basic_plus: true,
      pro: true,
      premium: true,
    },
  },
  {
    name: "Free hosting",
    values: {
      free_trial: true,
      basic: true,
      basic_plus: true,
      pro: true,
      premium: true,
    },
  },
  {
    name: "Priority queue",
    values: {
      free_trial: false,
      basic: false,
      basic_plus: false,
      pro: true,
      premium: true,
    },
  },
];

export const formatPlanPrice = (price: number | null) =>
  price === null ? "Free" : `$${price}/mo`;
