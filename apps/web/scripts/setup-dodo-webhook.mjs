/**
 * Ensures the StoneAI Dodo webhook points at production.
 * Usage: node scripts/setup-dodo-webhook.mjs
 */
import DodoPayments from "dodopayments";

const webhookUrl =
  process.env.STONEAI_WEBHOOK_URL ?? "https://app.stoneai.in/api/webhooks/dodo";

const bearerToken = process.env.DODO_API_KEY ?? process.env.DODO_PAYMENTS_API_KEY;
if (!bearerToken) {
  console.error("Missing DODO_API_KEY.");
  process.exit(1);
}

const client = new DodoPayments({
  bearerToken,
  environment: process.env.DODO_ENVIRONMENT === "test_mode" ? "test_mode" : "live_mode",
});

const desiredEvents = [
  "payment.succeeded",
  "payment.failed",
  "subscription.active",
  "subscription.renewed",
  "subscription.updated",
  "subscription.cancelled",
  "subscription.plan_changed",
  "subscription.failed",
  "subscription.on_hold",
  "subscription.expired",
];

const existing = [];
for await (const hook of client.webhooks.list()) {
  existing.push(hook);
}

const match = existing.find((hook) => hook.url === webhookUrl);
if (match) {
  console.log(`Webhook already registered: ${match.id} → ${match.url}`);
  process.exit(0);
}

const created = await client.webhooks.create({
  url: webhookUrl,
  description: "StoneAI production billing sync",
  filter_types: desiredEvents,
});

console.log(`Created webhook ${created.id} → ${created.url}`);
if (created.secret) {
  console.log("Store this secret as DODO_WEBHOOK_SECRET in Vercel:");
  console.log(created.secret);
}
