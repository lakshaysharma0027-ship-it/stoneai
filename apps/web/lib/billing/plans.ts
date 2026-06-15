import { calculatePlanMonthlyCredits } from "./planLimits";

export type BillingPlanId = "free_trial" | "basic" | "basic_plus" | "pro" | "premium";

export type BillingPlan = {
  id: BillingPlanId;
  name: string;
  monthlyCredits: number;
  siteLimit: number;
  dodoProductEnv?: string;
};

const buildPlan = (
  id: BillingPlanId,
  name: string,
  siteLimit: number,
  dodoProductEnv?: string,
): BillingPlan => ({
  id,
  name,
  monthlyCredits: calculatePlanMonthlyCredits(id),
  siteLimit,
  dodoProductEnv,
});

export const BILLING_PLANS: Record<BillingPlanId, BillingPlan> = {
  free_trial: buildPlan("free_trial", "Free Trial", 1, "DODO_PRODUCT_FREE_TRIAL"),
  basic: buildPlan("basic", "Basic", 1, "DODO_PRODUCT_BASIC"),
  basic_plus: buildPlan("basic_plus", "Basic Plus", 2, "DODO_PRODUCT_BASIC_PLUS"),
  pro: buildPlan("pro", "Pro", 4, "DODO_PRODUCT_PRO"),
  premium: buildPlan("premium", "Premium", 10, "DODO_PRODUCT_PREMIUM"),
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
  PAID_BILLING_PLANS.find((plan) => getDodoProductIdForPlan(plan.id) === productId)?.id ??
  (getDodoProductIdForPlan("free_trial") === productId ? "free_trial" : undefined);
