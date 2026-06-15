import type { SupabaseClient } from "@supabase/supabase-js";
import { getBillingPlan } from "@/lib/billing/plans";
import {
  PLAN_ACTION_LIMITS,
  USAGE_ACTION_LABELS,
  type UsageAction,
} from "@/lib/billing/planLimits";
import {
  planHasFeature,
  type PlanFeature,
} from "@/lib/billing/planFeatures";
import { normalizeBillingPlanId } from "@/lib/billing/plans";
import type { CustomerSubscription } from "@/lib/billing/types";
import { usageService } from "@/services/billing/usageService";

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
      .eq("status", "published")
      .neq("project_id", input.currentProjectId ?? "00000000-0000-0000-0000-000000000000");

    if (error) throw error;
    if ((count ?? 0) >= plan.siteLimit) {
      throw new Error(
        `${plan.name} allows ${plan.siteLimit} published site${plan.siteLimit === 1 ? "" : "s"}. Upgrade to publish more.`,
      );
    }
  },

  assertSubscriptionActive(subscription: CustomerSubscription) {
    if (subscription.status === "pending") {
      throw new Error(
        "Add a payment method to start your free trial before using StoneAI.",
      );
    }
    if (!["active", "trialing"].includes(subscription.status)) {
      throw new Error("Your subscription is not active. Update billing to continue.");
    }
  },

  assertHasCredits(
    subscription: CustomerSubscription,
    credits: number,
    action: string,
  ) {
    this.assertSubscriptionActive(subscription);
    if (subscription.creditsRemaining < credits) {
      throw new Error(
        `You need ${credits} credits to ${action}. Upgrade your plan or wait for renewal.`,
      );
    }
  },

  assertPlanFeature(subscription: CustomerSubscription, feature: PlanFeature) {
    this.assertSubscriptionActive(subscription);
    const planId = normalizeBillingPlanId(subscription.plan);
    if (!planHasFeature(planId, feature)) {
      const labels: Partial<Record<PlanFeature, string>> = {
        nano_banana: "Nano Banana image generation",
        first_image_prompt: "custom hero image prompts",
        last_image_prompt: "last frame image prompts",
        veo: "Veo video generation",
        ai_website_edit: "AI website edits",
        custom_domain: "custom domains",
      };
      throw new Error(
        `${labels[feature] ?? "This feature"} is not included on your current plan. Upgrade to unlock it.`,
      );
    }
  },

  async assertWithinActionLimit(
    supabase: SupabaseClient,
    input: {
      userId: string;
      subscription: CustomerSubscription;
      action: UsageAction;
    },
  ) {
    this.assertSubscriptionActive(input.subscription);
    const planId = normalizeBillingPlanId(input.subscription.plan);
    const limits = PLAN_ACTION_LIMITS[planId];
    const limit = limits[input.action];
    if (limit <= 0) {
      throw new Error(
        `${USAGE_ACTION_LABELS[input.action]} is not included on your current plan. Upgrade to unlock it.`,
      );
    }

    const usage = await usageService.countUsage(supabase, input.userId, input.subscription);
    if (usage[input.action] >= limit) {
      throw new Error(
        `You have reached your ${USAGE_ACTION_LABELS[input.action].toLowerCase()} limit (${limit}) for this billing period. Upgrade to continue.`,
      );
    }
  },
};
