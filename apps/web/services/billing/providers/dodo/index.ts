import DodoPayments from "dodopayments";
import { getDodoProductIdForPlan } from "@/lib/billing/plans";
import type {
  BillingProvider,
  CheckoutRequest,
  CheckoutSession,
  CustomerPortalSession,
  CustomerSubscription,
} from "@/lib/billing/types";

const getDodoClient = () => {
  const bearerToken = process.env.DODO_API_KEY ?? process.env.DODO_PAYMENTS_API_KEY;
  if (!bearerToken) throw new Error("Missing DODO_API_KEY.");

  return new DodoPayments({
    bearerToken,
    environment: process.env.DODO_ENVIRONMENT === "test_mode" ? "test_mode" : "live_mode",
  });
};

export const dodoBillingProvider: BillingProvider = {
  async createCheckout(request: CheckoutRequest): Promise<CheckoutSession> {
    const productId = getDodoProductIdForPlan(request.plan);
    if (!productId) {
      throw new Error(`Missing Dodo product id for ${request.plan}.`);
    }

    const response = await getDodoClient().checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      return_url: request.successUrl,
      cancel_url: request.cancelUrl,
      customer: request.email
        ? {
            email: request.email,
            name: request.name ?? request.email,
          }
        : undefined,
      customization: {
        theme: "dark",
      },
      feature_flags: {
        redirect_immediately: true,
      },
      metadata: {
        stoneai_user_id: request.userId,
        stoneai_plan: request.plan,
      },
    });

    if (!response.checkout_url) {
      throw new Error("Dodo did not return a checkout URL.");
    }

    return {
      id: response.session_id,
      url: response.checkout_url,
    };
  },

  async createCustomerPortal(input): Promise<CustomerPortalSession> {
    const response = await getDodoClient().customers.customerPortal.create(input.customerId, {
      return_url: input.returnUrl,
    });

    if (!response.link) {
      throw new Error("Dodo did not return a customer portal URL.");
    }

    return { url: response.link };
  },

  async createSubscription(): Promise<CustomerSubscription> {
    throw new Error("Dodo subscriptions are created from checkout webhooks.");
  },

  async changeSubscriptionPlan(input): Promise<void> {
    const productId = getDodoProductIdForPlan(input.plan);
    if (!productId) {
      throw new Error(`Missing Dodo product id for ${input.plan}.`);
    }

    await getDodoClient().subscriptions.changePlan(input.subscriptionId, {
      product_id: productId,
      quantity: 1,
      proration_billing_mode: input.immediate ? "prorated_immediately" : "do_not_bill",
      effective_at: input.immediate ? "immediately" : "next_billing_date",
      metadata: {
        stoneai_plan: input.plan,
      },
    });
  },

  async cancelSubscription(): Promise<CustomerSubscription> {
    throw new Error("Cancel through the Dodo API route so StoneAI can sync local state.");
  },

  async syncSubscription(): Promise<CustomerSubscription> {
    throw new Error("Sync through the Dodo API route so StoneAI can update local state.");
  },
};
