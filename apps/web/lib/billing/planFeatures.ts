import type { BillingPlanId } from "./plans";
import { normalizeBillingPlanId } from "./plans";

export type PlanFeature =
  | "template_selection"
  | "website_prompt"
  | "preset_gallery"
  | "nano_banana"
  | "first_image_prompt"
  | "last_image_prompt"
  | "veo"
  | "ai_website_edit"
  | "priority_queue";

export const PREMIUM_AI_EDITS_PER_WEBSITE = 2;

const FEATURE_MATRIX: Record<BillingPlanId, ReadonlySet<PlanFeature>> = {
  free_trial: new Set(["template_selection", "website_prompt", "preset_gallery"]),
  basic: new Set([
    "template_selection",
    "website_prompt",
    "nano_banana",
    "first_image_prompt",
    "last_image_prompt",
  ]),
  basic_plus: new Set([
    "template_selection",
    "website_prompt",
    "nano_banana",
    "first_image_prompt",
    "last_image_prompt",
    "veo",
  ]),
  pro: new Set([
    "template_selection",
    "website_prompt",
    "nano_banana",
    "first_image_prompt",
    "last_image_prompt",
    "veo",
    "priority_queue",
  ]),
  premium: new Set([
    "template_selection",
    "website_prompt",
    "nano_banana",
    "first_image_prompt",
    "last_image_prompt",
    "veo",
    "ai_website_edit",
    "priority_queue",
  ]),
};

const UPGRADE_HINTS: Partial<Record<PlanFeature, { plan: BillingPlanId; label: string }>> = {
  nano_banana: { plan: "basic", label: "Upgrade to Basic" },
  first_image_prompt: { plan: "basic", label: "Upgrade to Basic" },
  last_image_prompt: { plan: "basic", label: "Upgrade to Basic" },
  veo: { plan: "basic_plus", label: "Upgrade to Basic Plus" },
  ai_website_edit: { plan: "premium", label: "Upgrade to Premium" },
};

export const planHasFeature = (
  plan: string | null | undefined,
  feature: PlanFeature,
): boolean => FEATURE_MATRIX[normalizeBillingPlanId(plan)].has(feature);

export const getUpgradeHint = (feature: PlanFeature) => UPGRADE_HINTS[feature] ?? null;

export const getPlanFeatures = (plan: string | null | undefined): PlanFeature[] =>
  [...FEATURE_MATRIX[normalizeBillingPlanId(plan)]];
