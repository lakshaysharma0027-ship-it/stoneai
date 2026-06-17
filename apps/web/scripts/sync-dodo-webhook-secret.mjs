import DodoPayments from "dodopayments";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");
const webhookUrl =
  process.env.STONEAI_WEBHOOK_URL ?? "https://app.stoneai.in/api/webhooks/dodo";

const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY,
  environment: process.env.DODO_ENVIRONMENT === "test_mode" ? "test_mode" : "live_mode",
});

let webhookId = null;
for await (const hook of client.webhooks.list()) {
  if (hook.url === webhookUrl) {
    webhookId = hook.id;
    break;
  }
}

if (!webhookId) {
  console.error("Webhook not found for", webhookUrl);
  process.exit(1);
}

const secret = await client.webhooks.retrieveSecret(webhookId);
const env = readFileSync(envPath, "utf8");
const updated = env.replace(/DODO_WEBHOOK_SECRET=.*/m, `DODO_WEBHOOK_SECRET=${secret.secret}`);
writeFileSync(envPath, updated);
console.log(`Updated DODO_WEBHOOK_SECRET for webhook ${webhookId}`);
