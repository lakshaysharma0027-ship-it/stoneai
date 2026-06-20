/**
 * Push local .env.local values to Vercel production for the stoneai project.
 * Usage (from apps/web): node scripts/push-vercel-env.mjs
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

const REQUIRED_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "DATABASE_URL",
  "SUPABASE_PROJECT_REF",
  "SUPABASE_SERVICE_ROLE_KEY",
  "AWS_BEDROCK_API_KEY",
  "BEDROCK_CLAUDE_MODEL",
  "AWS_REGION",
  "GOOGLE_API_KEY",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_NANO_BANANA_MODEL",
  "GOOGLE_VEO_MODEL",
  "GEMINI_API_KEY",
  "GEMINI_GENERATION_ENABLED",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "NEXT_PUBLIC_STONEAI_ROOT_DOMAIN",
  "NEXT_PUBLIC_STONEAI_APP_HOST",
  "NEXT_PUBLIC_STONEAI_CUSTOM_DOMAIN_TARGET",
  "DODO_API_KEY",
  "DODO_ENVIRONMENT",
  "DODO_WEBHOOK_SECRET",
  "DODO_PRODUCT_FREE_TRIAL",
  "DODO_PRODUCT_BASIC",
  "DODO_PRODUCT_BASIC_PLUS",
  "DODO_PRODUCT_PRO",
  "DODO_PRODUCT_PREMIUM",
];

const parseEnv = (content) => {
  const values = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    values[key] = value;
  }
  return values;
};

let envContent;
try {
  envContent = readFileSync(envPath, "utf8");
} catch {
  console.error(`Missing ${envPath}`);
  process.exit(1);
}

const env = parseEnv(envContent);
const missing = REQUIRED_KEYS.filter((key) => !env[key]);
if (missing.length) {
  console.warn("Missing keys in .env.local (add before production push):");
  for (const key of missing) console.warn(`  - ${key}`);
}

for (const key of REQUIRED_KEYS) {
  const value = env[key];
  if (!value) continue;

  console.log(`Setting ${key}…`);
  const result = spawnSync(
    "npx",
    ["vercel", "env", "add", key, "production", "--force"],
    {
      input: value,
      encoding: "utf8",
      cwd: resolve(__dirname, ".."),
      shell: true,
      stdio: ["pipe", "inherit", "inherit"],
    },
  );

  if (result.status !== 0) {
    console.error(`Failed to set ${key}`);
    process.exit(result.status ?? 1);
  }
}

console.log("Vercel production env sync complete.");
