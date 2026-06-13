import type { BillingPlanId } from "../types";

export type PlanCatalogEntry = {
  id: BillingPlanId;
  name: string;
  monthlyPrice: number | null;
  credits: number;
  sites: number;
};

export const PLAN_CATALOG: PlanCatalogEntry[] = [
  { id: "free_trial", name: "Free Trial", monthlyPrice: null, credits: 100, sites: 1 },
  { id: "basic", name: "Basic", monthlyPrice: 15, credits: 1500, sites: 1 },
  { id: "basic_plus", name: "Basic Plus", monthlyPrice: 25, credits: 2500, sites: 2 },
  { id: "pro", name: "Pro", monthlyPrice: 40, credits: 6000, sites: 5 },
  { id: "premium", name: "Premium", monthlyPrice: 160, credits: 25000, sites: 30 },
];

export const PLAN_FEATURE_ROWS: Array<{
  name: string;
  values: Record<BillingPlanId, string | boolean>;
}> = [
  {
    name: "Credits / month",
    values: {
      free_trial: "100",
      basic: "1,500",
      basic_plus: "2,500",
      pro: "6,000",
      premium: "25,000",
    },
  },
  {
    name: "Published sites",
    values: {
      free_trial: "1",
      basic: "1",
      basic_plus: "2",
      pro: "5",
      premium: "30",
    },
  },
  {
    name: "Custom domains",
    values: {
      free_trial: false,
      basic: true,
      basic_plus: true,
      pro: true,
      premium: true,
    },
  },
  {
    name: "Nano Banana Image Generation",
    values: {
      free_trial: false,
      basic: true,
      basic_plus: true,
      pro: true,
      premium: true,
    },
  },
  {
    name: "Veo 3.1 Video Generation",
    values: {
      free_trial: false,
      basic: false,
      basic_plus: true,
      pro: true,
      premium: true,
    },
  },
  {
    name: "Claude access",
    values: {
      free_trial: "Coming soon",
      basic: "Coming soon",
      basic_plus: "Coming soon",
      pro: "Coming soon",
      premium: "Coming soon",
    },
  },
  {
    name: "Priority generation queue",
    values: {
      free_trial: false,
      basic: false,
      basic_plus: false,
      pro: true,
      premium: true,
    },
  },
  {
    name: "Priority support",
    values: {
      free_trial: false,
      basic: false,
      basic_plus: false,
      pro: false,
      premium: true,
    },
  },
];

export const formatPlanPrice = (price: number | null) =>
  price === null ? "Free" : `$${price}/mo`;
