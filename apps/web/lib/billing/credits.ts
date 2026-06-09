export type CreditEventType =
  | "generate_website"
  | "ai_edit"
  | "future_ai_feature";

export const CREDIT_COSTS: Record<CreditEventType, number> = {
  generate_website: 25,
  ai_edit: 10,
  future_ai_feature: 1,
};

export const getCreditCost = (eventType: CreditEventType) =>
  CREDIT_COSTS[eventType];
