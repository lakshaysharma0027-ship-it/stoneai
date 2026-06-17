/** Dodo events that confirm payment and may grant credits / activate trial. */
export const PAYMENT_CONFIRMED_GRANT_EVENTS = new Set([
  "payment.succeeded",
  "subscription.active",
  "subscription.renewed",
  "subscription.plan_changed",
]);

export const shouldGrantCreditsForEvent = (eventType: string) =>
  PAYMENT_CONFIRMED_GRANT_EVENTS.has(eventType);
