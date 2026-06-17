import type { BillingPlanId } from "./plans";
import {
  calculatePlanMonthlyCredits,
  FREE_TRIAL_DAYS,
  PLAN_ACTION_LIMITS,
  PLAN_MONTHLY_PRICES,
} from "./planLimits";

export const formatCredits = (value: number) => value.toLocaleString("en-US");

export const formatPlanLimit = (value: number, uploadLabel = "Upload") =>
  value === 0 ? uploadLabel : String(value);

export const ANNUAL_MONTHLY_PRICES: Record<Exclude<BillingPlanId, "free_trial">, number> = {
  basic: 12,
  basic_plus: 20,
  pro: 40,
  premium: 80,
};

export const buildPlanFeatureRows = () => {
  const ids = Object.keys(PLAN_ACTION_LIMITS) as BillingPlanId[];

  return [
    {
      name: "Credits / period",
      values: Object.fromEntries(ids.map((id) => [id, formatCredits(calculatePlanMonthlyCredits(id))])) as Record<
        BillingPlanId,
        string
      >,
    },
    {
      name: "Websites",
      values: Object.fromEntries(ids.map((id) => [id, String(PLAN_ACTION_LIMITS[id].websites)])) as Record<
        BillingPlanId,
        string
      >,
    },
    {
      name: "AI images (Nano Banana)",
      values: Object.fromEntries(
        ids.map((id) => [id, formatPlanLimit(PLAN_ACTION_LIMITS[id].images, "Upload only")]),
      ) as Record<BillingPlanId, string>,
    },
    {
      name: "AI videos (Veo)",
      values: Object.fromEntries(
        ids.map((id) => [id, formatPlanLimit(PLAN_ACTION_LIMITS[id].videos, "Upload only")]),
      ) as Record<BillingPlanId, string>,
    },
    {
      name: "Your own image/video upload",
      values: Object.fromEntries(ids.map((id) => [id, true])) as Record<BillingPlanId, boolean>,
    },
    {
      name: "AI edits",
      values: Object.fromEntries(
        ids.map((id) => [id, PLAN_ACTION_LIMITS[id].aiEdits || false]),
      ) as Record<BillingPlanId, string | boolean>,
    },
    {
      name: "Trial length",
      values: {
        free_trial: `${FREE_TRIAL_DAYS} days`,
        basic: false,
        basic_plus: false,
        pro: false,
        premium: false,
      },
    },
    {
      name: "Monthly price",
      values: {
        free_trial: "Free",
        basic: `$${PLAN_MONTHLY_PRICES.basic}`,
        basic_plus: `$${PLAN_MONTHLY_PRICES.basic_plus}`,
        pro: `$${PLAN_MONTHLY_PRICES.pro}`,
        premium: `$${PLAN_MONTHLY_PRICES.premium}`,
      },
    },
  ];
};
