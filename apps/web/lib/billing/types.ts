import type { BillingPlanId } from "./plans";

export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled";

export type CustomerSubscription = {
  id: string;
  userId: string;
  plan: BillingPlanId;
  creditsRemaining: number;
  monthlyCredits: number;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
};

export type CheckoutRequest = {
  userId: string;
  plan: BillingPlanId;
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutSession = {
  id: string;
  url: string;
};

export type BillingProvider = {
  createCheckout: (request: CheckoutRequest) => Promise<CheckoutSession>;
  createSubscription: (input: {
    userId: string;
    plan: BillingPlanId;
    externalCustomerId?: string;
    externalSubscriptionId?: string;
  }) => Promise<CustomerSubscription>;
  cancelSubscription: (input: {
    userId: string;
    subscriptionId: string;
  }) => Promise<CustomerSubscription>;
  syncSubscription: (input: {
    userId: string;
    externalSubscriptionId: string;
  }) => Promise<CustomerSubscription>;
};
