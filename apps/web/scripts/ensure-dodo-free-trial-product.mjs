import DodoPayments from "dodopayments";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

const bearerToken = process.env.DODO_API_KEY;
if (!bearerToken) {
  console.error("Missing DODO_API_KEY");
  process.exit(1);
}

const client = new DodoPayments({
  bearerToken,
  environment: process.env.DODO_ENVIRONMENT === "test_mode" ? "test_mode" : "live_mode",
});

let freeTrialId = process.env.DODO_PRODUCT_FREE_TRIAL;
if (!freeTrialId) {
  for await (const product of client.products.list()) {
    if (product.name?.toLowerCase().includes("free trial")) {
      freeTrialId = product.product_id;
      break;
    }
  }
}

if (!freeTrialId) {
  const created = await client.products.create({
    name: "StoneAI Free Trial",
    description: "3-day free trial with payment method required",
    tax_category: "saas",
    price: {
      type: "recurring_price",
      currency: "USD",
      discount: 0,
      tax_inclusive: false,
      payment_frequency_count: 1,
      payment_frequency_interval: "Month",
      price: 0,
      purchasing_power_parity: false,
      subscription_period_count: 1,
      subscription_period_interval: "Month",
      trial_period_days: 3,
    },
  });
  freeTrialId = created.product_id;
  console.log(`Created free trial product: ${freeTrialId}`);
} else {
  console.log(`Using existing free trial product: ${freeTrialId}`);
}

const env = readFileSync(envPath, "utf8");
const updated = env.includes("DODO_PRODUCT_FREE_TRIAL=")
  ? env.replace(/DODO_PRODUCT_FREE_TRIAL=.*/m, `DODO_PRODUCT_FREE_TRIAL=${freeTrialId}`)
  : `${env.trim()}\nDODO_PRODUCT_FREE_TRIAL=${freeTrialId}\n`;
writeFileSync(envPath, updated);
console.log("Updated .env.local with DODO_PRODUCT_FREE_TRIAL");
