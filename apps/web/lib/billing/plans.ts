export type BillingPlanId = "free_trial" | "basic" | "basic_plus" | "pro" | "premium";

export type BillingPlan = {
  id: BillingPlanId;
  name: string;
  monthlyCredits: number;
  siteLimit: number;
  dodoProductEnv?: string;
};

export const BILLING_PLANS: Record<BillingPlanId, BillingPlan> = {
  free_trial: {
    id: "free_trial",
    name: "Free Trial",
    monthlyCredits: 100,
    siteLimit: 1,
  },
  basic: {
    id: "basic",
    name: "Basic",
    monthlyCredits: 1500,
    siteLimit: 2,
    dodoProductEnv: "DODO_PRODUCT_BASIC",
  },
  basic_plus: {
    id: "basic_plus",
    name: "Basic Plus",
    monthlyCredits: 2500,
    siteLimit: 4,
    dodoProductEnv: "DODO_PRODUCT_BASIC_PLUS",
  },
  pro: {
    id: "pro",
    name: "Pro",
    monthlyCredits: 6000,
    siteLimit: 7,
    dodoProductEnv: "DODO_PRODUCT_PRO",
  },
  premium: {
    id: "premium",
    name: "Premium",
    monthlyCredits: 25000,
    siteLimit: 30,
    dodoProductEnv: "DODO_PRODUCT_PREMIUM",
  },
};

export const PAID_BILLING_PLANS = Object.values(BILLING_PLANS).filter(
  (plan) => plan.id !== "free_trial",
);

export const normalizeBillingPlanId = (plan: string | null | undefined): BillingPlanId => {
  if (plan === "free" || !plan) return "free_trial";
  if (plan === "starter") return "basic";
  if (plan === "agency") return "premium";
  return plan in BILLING_PLANS ? (plan as BillingPlanId) : "free_trial";
};

export const getBillingPlan = (plan: string | null | undefined): BillingPlan =>
  BILLING_PLANS[normalizeBillingPlanId(plan)];

export const getDodoProductIdForPlan = (planId: BillingPlanId) => {
  const envName = BILLING_PLANS[planId].dodoProductEnv;
  return envName ? process.env[envName] : undefined;
};

export const getBillingPlanFromDodoProductId = (productId: string | null | undefined) =>
  PAID_BILLING_PLANS.find((plan) => getDodoProductIdForPlan(plan.id) === productId)?.id;
