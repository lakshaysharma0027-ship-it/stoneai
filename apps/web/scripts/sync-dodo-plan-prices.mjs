/**
 * Sync Dodo subscription product prices to StoneAI plan tiers (USD cents).
 * Usage (from apps/web): node --env-file=.env.local scripts/sync-dodo-plan-prices.mjs
 */
import DodoPayments from "dodopayments";

const bearerToken = process.env.DODO_API_KEY;
if (!bearerToken) {
  console.error("Missing DODO_API_KEY");
  process.exit(1);
}

const client = new DodoPayments({
  bearerToken,
  environment: process.env.DODO_ENVIRONMENT === "test_mode" ? "test_mode" : "live_mode",
});

const recurring = (cents) => ({
  type: "recurring_price",
  currency: "USD",
  discount: 0,
  tax_inclusive: false,
  payment_frequency_count: 1,
  payment_frequency_interval: "Month",
  price: cents,
  purchasing_power_parity: false,
  subscription_period_count: 1,
  subscription_period_interval: "Month",
  trial_period_days: 0,
});

const PLAN_PRODUCTS = [
  { env: "DODO_PRODUCT_BASIC", cents: 1500, label: "Basic" },
  { env: "DODO_PRODUCT_BASIC_PLUS", cents: 2500, label: "Basic Plus" },
  { env: "DODO_PRODUCT_PRO", cents: 5000, label: "Pro" },
  { env: "DODO_PRODUCT_PREMIUM", cents: 10000, label: "Premium" },
];

for (const { env, cents, label } of PLAN_PRODUCTS) {
  const productId = process.env[env];
  if (!productId) {
    console.warn(`Skipping ${label}: missing ${env}`);
    continue;
  }

  await client.products.update(productId, { price: recurring(cents) });
  const product = await client.products.retrieve(productId);
  console.log(`${label}: ${productId} → $${(product.price?.price ?? 0) / 100}/mo`);
}

console.log("Dodo plan prices synced.");
