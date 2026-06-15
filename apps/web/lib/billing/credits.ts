export type CreditEventType =
  | "generate_website"
  | "ai_edit"
  | "media_image_generate"
  | "media_image_edit"
  | "media_video_generate"
  | "subscription_monthly_grant"
  | "subscription_plan_change"
  | "future_ai_feature";

export const CREDIT_COSTS: Record<CreditEventType, number> = {
  generate_website: 100,
  ai_edit: 50,
  media_image_generate: 25,
  media_image_edit: 25,
  media_video_generate: 50,
  subscription_monthly_grant: 0,
  subscription_plan_change: 0,
  future_ai_feature: 1,
};

export const getCreditCost = (eventType: CreditEventType) =>
  CREDIT_COSTS[eventType];
