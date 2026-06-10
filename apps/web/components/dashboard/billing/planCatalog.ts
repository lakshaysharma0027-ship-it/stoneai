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
  { id: "basic", name: "Basic", monthlyPrice: 20, credits: 1500, sites: 2 },
  { id: "basic_plus", name: "Basic Plus", monthlyPrice: 32, credits: 2500, sites: 4 },
  { id: "pro", name: "Pro", monthlyPrice: 48, credits: 6000, sites: 7 },
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
      basic: "2",
      basic_plus: "4",
      pro: "7",
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
    name: "Nano Banana",
    values: {
      free_trial: false,
      basic: "Basic",
      basic_plus: "Enhanced",
      pro: "Full",
      premium: "Full",
    },
  },
  {
    name: "Veo access",
    values: {
      free_trial: false,
      basic: false,
      basic_plus: "5 videos/mo",
      pro: "20 videos/mo",
      premium: "Unlimited",
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
    name: "Publishing",
    values: {
      free_trial: true,
      basic: true,
      basic_plus: true,
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
      pro: true,
      premium: true,
    },
  },
];

export const formatPlanPrice = (price: number | null) =>
  price === null ? "Free" : `$${price}/mo`;
