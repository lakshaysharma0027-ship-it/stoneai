/**
 * Configure Google OAuth on Supabase Auth (hosted project).
 * Requires SUPABASE_ACCESS_TOKEN from https://supabase.com/dashboard/account/tokens
 *
 * Usage (from apps/web):
 *   node --env-file=.env.local scripts/configure-supabase-google-auth.mjs
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

const parseEnv = (content) => {
  const values = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    values[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return values;
};

const env = parseEnv(readFileSync(envPath, "utf8"));
const accessToken = process.env.SUPABASE_ACCESS_TOKEN ?? env.SUPABASE_ACCESS_TOKEN;
const projectRef = env.SUPABASE_PROJECT_REF ?? "aajwfpikldlangtmnnhd";
const clientId = process.env.GOOGLE_CLIENT_ID ?? env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? env.GOOGLE_CLIENT_SECRET;

if (!accessToken) {
  console.error("Missing SUPABASE_ACCESS_TOKEN. Create one at https://supabase.com/dashboard/account/tokens");
  process.exit(1);
}
if (!clientId || !clientSecret) {
  console.error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env.local");
  process.exit(1);
}

const body = {
  external_google_enabled: true,
  external_google_client_id: clientId,
  external_google_secret: clientSecret,
  site_url: "https://stoneai.in",
  additional_redirect_urls:
    "https://stoneai.in/auth/callback,https://www.stoneai.in/auth/callback,https://app.stoneai.in/auth/callback,http://localhost:3000/auth/callback",
};

const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/config/auth`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const text = await response.text();
if (!response.ok) {
  console.error(`Supabase auth config failed (${response.status}):`, text);
  process.exit(1);
}

console.log("Supabase Google OAuth configured successfully.");
console.log(JSON.stringify(JSON.parse(text), null, 2));
