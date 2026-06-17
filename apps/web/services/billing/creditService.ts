import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreditEventType } from "@/lib/billing/credits";
import { getCreditCost } from "@/lib/billing/credits";
import type { CustomerSubscription } from "@/lib/billing/types";
import { normalizeBillingPlanId, type BillingPlanId } from "@/lib/billing/plans";

type SubscriptionRow = {
  id: string;
  user_id: string;
  plan: string;
  credits_remaining: number;
  monthly_credits: number;
  status: CustomerSubscription["status"];
  customer_id: string | null;
  subscription_id: string | null;
  product_id: string | null;
  renewal_date: string | null;
  current_period_start: string | null;
  trial_ends_at: string | null;
  billing_cycle: "monthly" | "yearly";
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};

const toSubscription = (row: SubscriptionRow): CustomerSubscription => ({
  id: row.id,
  userId: row.user_id,
  plan: normalizeBillingPlanId(row.plan),
  creditsRemaining: row.credits_remaining,
  monthlyCredits: row.monthly_credits,
  status: row.status,
  customerId: row.customer_id,
  subscriptionId: row.subscription_id,
  productId: row.product_id,
  renewalDate: row.renewal_date,
  currentPeriodStart: row.current_period_start,
  trialEndsAt: row.trial_ends_at,
  billingCycle: row.billing_cycle,
  cancelAtPeriodEnd: row.cancel_at_period_end,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const creditService = {
  async ensureSubscription(
    supabase: SupabaseClient,
    userId: string,
  ): Promise<CustomerSubscription> {
    const { data, error } = await supabase.rpc("ensure_user_subscription", {
      target_user_id: userId,
    });

    if (error) throw error;
    return toSubscription(data as SubscriptionRow);
  },

  async allocateMonthlyCredits(
    supabase: SupabaseClient,
    input: {
      userId: string;
      plan: BillingPlanId;
      eventType: CreditEventType;
      description: string;
    },
  ): Promise<CustomerSubscription> {
    const { data, error } = await supabase.rpc("allocate_subscription_credits", {
      target_user_id: input.userId,
      target_plan: input.plan,
      event_type: input.eventType,
      description: input.description,
    });

    if (error) throw error;
    return toSubscription(data as SubscriptionRow);
  },

  async consumeCredits(
    supabase: SupabaseClient,
    input: {
      userId: string;
      eventType: CreditEventType;
      description: string;
    },
  ): Promise<CustomerSubscription> {
    const credits = getCreditCost(input.eventType);
    const { data, error } = await supabase.rpc("consume_user_credits", {
      target_user_id: input.userId,
      credits,
      event_type: input.eventType,
      description: input.description,
    });

    if (error) throw error;
    return toSubscription(data as SubscriptionRow);
  },

  async refundCredits(
    supabase: SupabaseClient,
    input: {
      userId: string;
      eventType: CreditEventType;
      description: string;
    },
  ): Promise<CustomerSubscription> {
    const credits = getCreditCost(input.eventType);
    const { data, error } = await supabase.rpc("refund_user_credits", {
      target_user_id: input.userId,
      credits,
      event_type: input.eventType,
      description: input.description,
    });

    if (error) throw error;
    return toSubscription(data as SubscriptionRow);
  },
};
