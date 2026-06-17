import type { BillingPlanId } from "./plans";
import { normalizeBillingPlanId } from "./plans";

export type PlanFeature =
  | "template_selection"
  | "website_prompt"
  | "preset_gallery"
  | "nano_banana"
  | "media_upload"
  | "first_image_prompt"
  | "last_image_prompt"
  | "veo"
  | "ai_website_edit"
  | "custom_domain"
  | "free_hosting"
  | "priority_queue";

const FEATURE_MATRIX: Record<BillingPlanId, ReadonlySet<PlanFeature>> = {
  free_trial: new Set(["template_selection", "website_prompt", "preset_gallery", "media_upload", "free_hosting"]),
  basic: new Set([
    "template_selection",
    "website_prompt",
    "media_upload",
    "nano_banana",
    "first_image_prompt",
    "last_image_prompt",
    "veo",
    "ai_website_edit",
    "custom_domain",
    "free_hosting",
  ]),
  basic_plus: new Set([
    "template_selection",
    "website_prompt",
    "media_upload",
    "nano_banana",
    "first_image_prompt",
    "last_image_prompt",
    "veo",
    "ai_website_edit",
    "custom_domain",
    "free_hosting",
  ]),
  pro: new Set([
    "template_selection",
    "website_prompt",
    "media_upload",
    "nano_banana",
    "first_image_prompt",
    "last_image_prompt",
    "veo",
    "ai_website_edit",
    "custom_domain",
    "free_hosting",
    "priority_queue",
  ]),
  premium: new Set([
    "template_selection",
    "website_prompt",
    "media_upload",
    "nano_banana",
    "first_image_prompt",
    "last_image_prompt",
    "veo",
    "ai_website_edit",
    "custom_domain",
    "free_hosting",
    "priority_queue",
  ]),
};

const UPGRADE_HINTS: Partial<Record<PlanFeature, { plan: BillingPlanId; label: string }>> = {
  nano_banana: { plan: "basic", label: "Upgrade to Basic" },
  first_image_prompt: { plan: "basic", label: "Upgrade to Basic" },
  last_image_prompt: { plan: "basic", label: "Upgrade to Basic" },
  veo: { plan: "basic", label: "Upgrade to Basic" },
  ai_website_edit: { plan: "basic", label: "Upgrade to Basic" },
  custom_domain: { plan: "basic", label: "Upgrade to Basic" },
};

export const planHasFeature = (
  plan: string | null | undefined,
  feature: PlanFeature,
): boolean => FEATURE_MATRIX[normalizeBillingPlanId(plan)].has(feature);

export const getUpgradeHint = (feature: PlanFeature) => UPGRADE_HINTS[feature] ?? null;

export const getPlanFeatures = (plan: string | null | undefined): PlanFeature[] =>
  [...FEATURE_MATRIX[normalizeBillingPlanId(plan)]];
