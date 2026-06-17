import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");
const projectRef = process.env.SUPABASE_PROJECT_REF ?? "aajwfpikldlangtmnnhd";

const result = spawnSync(
  "npx",
  ["supabase", "projects", "api-keys", "--project-ref", projectRef, "-o", "json"],
  { encoding: "utf8", shell: true },
);

if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(result.status ?? 1);
}

const keys = JSON.parse(result.stdout);
const serviceRole = keys.find((key) => key.name === "service_role")?.api_key;
if (!serviceRole) {
  console.error("service_role key not found");
  process.exit(1);
}

const env = readFileSync(envPath, "utf8");
const updated = env.replace(/SUPABASE_SERVICE_ROLE_KEY=.*/m, `SUPABASE_SERVICE_ROLE_KEY=${serviceRole}`);
writeFileSync(envPath, updated);
console.log("Updated SUPABASE_SERVICE_ROLE_KEY in .env.local");
