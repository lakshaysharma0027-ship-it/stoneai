import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreditEventType } from "@/lib/billing/credits";
import { getCreditCost } from "@/lib/billing/credits";
import type { CustomerSubscription } from "@/lib/billing/types";

type SubscriptionRow = {
  id: string;
  user_id: string;
  plan: CustomerSubscription["plan"];
  credits_remaining: number;
  monthly_credits: number;
  status: CustomerSubscription["status"];
  created_at: string;
  updated_at: string;
};

const toSubscription = (row: SubscriptionRow): CustomerSubscription => ({
  id: row.id,
  userId: row.user_id,
  plan: row.plan,
  creditsRemaining: row.credits_remaining,
  monthlyCredits: row.monthly_credits,
  status: row.status,
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
};
