import type { BillingPlanId } from "./plans";

export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled";

export type CustomerSubscription = {
  id: string;
  userId: string;
  plan: BillingPlanId;
  creditsRemaining: number;
  monthlyCredits: number;
  status: SubscriptionStatus;
  customerId: string | null;
  subscriptionId: string | null;
  productId: string | null;
  renewalDate: string | null;
  billingCycle: "monthly" | "yearly";
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CheckoutRequest = {
  userId: string;
  email?: string;
  name?: string;
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
  changeSubscriptionPlan: (input: {
    subscriptionId: string;
    plan: BillingPlanId;
    immediate?: boolean;
  }) => Promise<void>;
  cancelSubscription: (input: {
    userId: string;
    subscriptionId: string;
  }) => Promise<CustomerSubscription>;
  syncSubscription: (input: {
    userId: string;
    externalSubscriptionId: string;
  }) => Promise<CustomerSubscription>;
};
