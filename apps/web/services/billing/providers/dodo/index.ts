import type {
  BillingProvider,
  CheckoutRequest,
  CheckoutSession,
  CustomerSubscription,
} from "@/lib/billing/types";

const notConfigured = () =>
  new Error("Dodo billing provider is not configured yet.");

export const dodoBillingProvider: BillingProvider = {
  async createCheckout(request: CheckoutRequest): Promise<CheckoutSession> {
    void request;
    throw notConfigured();
  },

  async createSubscription(): Promise<CustomerSubscription> {
    throw notConfigured();
  },

  async cancelSubscription(): Promise<CustomerSubscription> {
    throw notConfigured();
  },

  async syncSubscription(): Promise<CustomerSubscription> {
    throw notConfigured();
  },
};
