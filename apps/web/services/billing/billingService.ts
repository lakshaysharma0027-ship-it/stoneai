import type { BillingProvider } from "@/lib/billing/types";
import { dodoBillingProvider } from "@/services/billing/providers/dodo";

export const billingService: BillingProvider = dodoBillingProvider;
