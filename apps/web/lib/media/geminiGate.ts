import type { CustomerSubscription } from "@/lib/billing/types";
import { planLimitService } from "@/services/billing/planLimitService";

/**
 * Gemini (Nano Banana / Veo) may only run after billing, credits, and plan limits
 * are enforced for the caller. Routes must call this before provider requests.
 */
export const assertGeminiGenerationAllowed = (
  subscription: CustomerSubscription,
  feature: "nano_banana" | "veo",
) => {
  planLimitService.assertSubscriptionActive(subscription);
  planLimitService.assertPlanFeature(subscription, feature);

  if (process.env.GEMINI_GENERATION_ENABLED === "false") {
    throw new Error(
      "Image and video generation is temporarily unavailable. Please try again shortly.",
    );
  }
};
