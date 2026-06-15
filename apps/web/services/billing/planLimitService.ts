import type { SupabaseClient } from "@supabase/supabase-js";
import { getBillingPlan } from "@/lib/billing/plans";
import {
  planHasFeature,
  type PlanFeature,
} from "@/lib/billing/planFeatures";
import { normalizeBillingPlanId } from "@/lib/billing/plans";
import type { CustomerSubscription } from "@/lib/billing/types";

export const planLimitService = {
  async assertCanCreateSite(
    supabase: SupabaseClient,
    input: {
      userId: string;
      subscription: CustomerSubscription;
      currentProjectId?: string;
    },
  ) {
    const plan = getBillingPlan(input.subscription.plan);
    const { count, error } = await supabase
      .from("sites")
      .select("id", { count: "exact", head: true })
      .eq("user_id", input.userId)
      .neq("project_id", input.currentProjectId ?? "00000000-0000-0000-0000-000000000000");

    if (error) throw error;
    if ((count ?? 0) >= plan.siteLimit) {
      throw new Error(`${plan.name} allows ${plan.siteLimit} published site${plan.siteLimit === 1 ? "" : "s"}. Upgrade to publish more.`);
    }
  },

  assertHasCredits(
    subscription: CustomerSubscription,
    credits: number,
    action: string,
  ) {
    if (subscription.creditsRemaining < credits) {
      throw new Error(`You need ${credits} credits to ${action}. Upgrade your plan or wait for renewal.`);
    }
  },

  assertPlanFeature(subscription: CustomerSubscription, feature: PlanFeature) {
    const planId = normalizeBillingPlanId(subscription.plan);
    if (!planHasFeature(planId, feature)) {
      const labels: Partial<Record<PlanFeature, string>> = {
        nano_banana: "Nano Banana image generation",
        first_image_prompt: "custom hero image prompts",
        last_image_prompt: "last frame image prompts",
        veo: "Veo video generation",
        ai_website_edit: "AI website edits",
      };
      throw new Error(
        `${labels[feature] ?? "This feature"} is not included on your current plan. Upgrade to unlock it.`,
      );
    }
  },
};
