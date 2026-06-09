export type BillingPlanId = "free" | "starter" | "pro" | "agency";

export type BillingPlan = {
  id: BillingPlanId;
  name: string;
  monthlyCredits: number;
};

export const BILLING_PLANS: Record<BillingPlanId, BillingPlan> = {
  free: {
    id: "free",
    name: "Free",
    monthlyCredits: 100,
  },
  starter: {
    id: "starter",
    name: "Starter",
    monthlyCredits: 1000,
  },
  pro: {
    id: "pro",
    name: "Pro",
    monthlyCredits: 5000,
  },
  agency: {
    id: "agency",
    name: "Agency",
    monthlyCredits: 25000,
  },
};

export const getBillingPlan = (plan: string | null | undefined): BillingPlan =>
  BILLING_PLANS[(plan ?? "free") as BillingPlanId] ?? BILLING_PLANS.free;
