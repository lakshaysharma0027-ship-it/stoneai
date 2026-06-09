import type { SupabaseClient } from "@supabase/supabase-js";
import {
  STONEAI_APP_HOSTS,
  normalizeDomainName,
  STONEAI_ROOT_DOMAIN,
} from "@/lib/domains/config";

const appHostnames = new Set(["localhost", "127.0.0.1", "::1"]);

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64) || "site";

export const normalizeRequestHost = (host: string | null) =>
  normalizeDomainName(host ?? "");

export const isStoneAIAppHost = (hostname: string) =>
  !hostname ||
  appHostnames.has(hostname) ||
  hostname === STONEAI_ROOT_DOMAIN ||
  STONEAI_APP_HOSTS.includes(hostname) ||
  hostname === `www.${STONEAI_ROOT_DOMAIN}`;

export const getStoneAISubdomainSlug = (hostname: string) => {
  const suffix = `.${STONEAI_ROOT_DOMAIN}`;
  if (!hostname.endsWith(suffix) || isStoneAIAppHost(hostname)) return null;

  const slug = hostname.slice(0, -suffix.length);
  if (!slug || slug.includes(".")) return null;

  return normalizeSlug(slug);
};

export const resolveHostnameToSlug = async (
  supabase: SupabaseClient,
  hostname: string,
) => {
  const normalizedHost = normalizeRequestHost(hostname);
  const subdomainSlug = getStoneAISubdomainSlug(normalizedHost);
  if (subdomainSlug) return subdomainSlug;
  if (isStoneAIAppHost(normalizedHost)) return null;

  const { data, error } = await supabase
    .from("domains")
    .select("site_id,sites(slug,status)")
    .eq("domain", normalizedHost)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;
  const site = Array.isArray(data?.sites) ? data.sites[0] : data?.sites;
  if (!site || site.status !== "published") return null;

  return normalizeSlug(site.slug);
};
