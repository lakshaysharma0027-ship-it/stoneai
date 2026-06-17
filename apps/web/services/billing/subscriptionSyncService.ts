import type { SupabaseClient } from "@supabase/supabase-js";
import {
  BILLING_PLANS,
  getBillingPlanFromDodoProductId,
  normalizeBillingPlanId,
  type BillingPlanId,
} from "@/lib/billing/plans";
import type { SubscriptionStatus } from "@/lib/billing/types";
import { shouldGrantCreditsForEvent } from "@/lib/billing/grantEvents";
import { FREE_TRIAL_DAYS } from "@/lib/billing/planLimits";
import { creditService } from "@/services/billing/creditService";

type DodoLikeSubscription = {
  subscription_id?: string;
  customer_id?: string;
  product_id?: string;
  status?: string;
  next_billing_date?: string;
  previous_billing_date?: string;
  payment_frequency_interval?: string;
  subscription_period_interval?: string;
  cancel_at_next_billing_date?: boolean;
  metadata?: Record<string, string>;
  customer?: {
    customer_id?: string;
  };
};

export type BillingEventInput = {
  eventId?: string;
  eventType: string;
  userId?: string;
  payload: Record<string, unknown>;
};

const statusMap: Record<string, SubscriptionStatus> = {
  active: "active",
  trialing: "trialing",
  pending: "pending",
  on_hold: "past_due",
  failed: "past_due",
  past_due: "past_due",
  cancelled: "canceled",
  canceled: "canceled",
  expired: "canceled",
};


const getString = (value: unknown) => (typeof value === "string" ? value : undefined);

const getData = (payload: Record<string, unknown>) =>
  (payload.data && typeof payload.data === "object" ? payload.data : payload) as Record<string, unknown>;

export const subscriptionSyncService = {
  resolveUserId(payload: Record<string, unknown>) {
    const data = getData(payload);
    const metadata = {
      ...((payload.metadata && typeof payload.metadata === "object" ? payload.metadata : {}) as Record<string, unknown>),
      ...((data.metadata && typeof data.metadata === "object" ? data.metadata : {}) as Record<string, unknown>),
      ...((data.custom_data && typeof data.custom_data === "object" ? data.custom_data : {}) as Record<string, unknown>),
    };

    return (
      getString(metadata.stoneai_user_id) ??
      getString(metadata.user_id) ??
      getString(metadata.userId)
    );
  },

  resolvePlan(payload: Record<string, unknown>): BillingPlanId | undefined {
    const data = getData(payload);
    const metadata = {
      ...((payload.metadata && typeof payload.metadata === "object" ? payload.metadata : {}) as Record<string, unknown>),
      ...((data.metadata && typeof data.metadata === "object" ? data.metadata : {}) as Record<string, unknown>),
      ...((data.custom_data && typeof data.custom_data === "object" ? data.custom_data : {}) as Record<string, unknown>),
    };
    const metadataPlan = getString(metadata.stoneai_plan) ?? getString(metadata.plan);
    if (metadataPlan) return normalizeBillingPlanId(metadataPlan);

    return getBillingPlanFromDodoProductId(getString(data.product_id));
  },

  async recordBillingEvent(supabase: SupabaseClient, input: BillingEventInput) {
    await supabase.from("billing_events").upsert(
      {
        event_id: input.eventId ?? null,
        event_type: input.eventType,
        user_id: input.userId ?? null,
        payload: input.payload,
      },
      { onConflict: "event_id" },
    );
  },

  async syncFromPayload(
    supabase: SupabaseClient,
    input: BillingEventInput,
  ) {
    const data = getData(input.payload) as DodoLikeSubscription;
    const userId = input.userId ?? this.resolveUserId(input.payload);
    const plan = this.resolvePlan(input.payload);
    const status = statusMap[data.status ?? input.eventType.replace("subscription.", "")];

    await this.recordBillingEvent(supabase, { ...input, userId });

    if (!userId) {
      return { synced: false, reason: "missing_user_id" };
    }

    const updates: Record<string, string | number | boolean | null> = {
      last_synced_at: new Date().toISOString(),
    };

    if (plan) {
      updates.plan = plan;
      updates.monthly_credits = BILLING_PLANS[plan].monthlyCredits;
    }

    const grantEvent = shouldGrantCreditsForEvent(input.eventType);
    if (status && (grantEvent || status === "past_due" || status === "canceled")) {
      updates.status = status;
    }
    if (data.customer_id ?? data.customer?.customer_id) updates.customer_id = data.customer_id ?? data.customer?.customer_id ?? null;
    if (data.subscription_id) updates.subscription_id = data.subscription_id;
    if (data.product_id) updates.product_id = data.product_id;
    if (data.next_billing_date) {
      updates.renewal_date = data.next_billing_date;
      updates.current_period_end = data.next_billing_date;
    }
    if (data.previous_billing_date) updates.current_period_start = data.previous_billing_date;
    if (data.payment_frequency_interval ?? data.subscription_period_interval) {
      const interval = data.payment_frequency_interval ?? data.subscription_period_interval;
      updates.billing_cycle = interval === "Year" ? "yearly" : "monthly";
    }
    if (typeof data.cancel_at_next_billing_date === "boolean") {
      updates.cancel_at_period_end = data.cancel_at_next_billing_date;
    }

    const subscriptionRow: Record<string, string | number | boolean | null> = {
      user_id: userId,
      billing_cycle: "monthly",
      ...updates,
    };

    if (plan) {
      subscriptionRow.monthly_credits = BILLING_PLANS[plan].monthlyCredits;
    }

    await supabase.from("subscriptions").upsert(subscriptionRow, { onConflict: "user_id" });

    if (plan && shouldGrantCreditsForEvent(input.eventType)) {
      updates.current_period_start = new Date().toISOString();
      if (plan === "free_trial") {
        updates.status = "trialing";
        updates.trial_ends_at = new Date(
          Date.now() + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000,
        ).toISOString();
      } else if (!status || status === "trialing") {
        updates.status = "active";
      }
      await creditService.allocateMonthlyCredits(supabase, {
        userId,
        plan,
        eventType: input.eventType === "subscription.plan_changed" ? "subscription_plan_change" : "subscription_monthly_grant",
        description: `Dodo ${input.eventType}`,
      });
    }

    return { synced: true, userId, plan, status };
  },
};
