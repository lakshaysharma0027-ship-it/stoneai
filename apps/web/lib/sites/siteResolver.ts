import type { SupabaseClient } from "@supabase/supabase-js";
import type { Website } from "@/lib/editor/schema";
import {
  getStoneAISubdomainSlug,
  normalizeRequestHost,
  resolveHostnameToSlug,
} from "@/lib/domains/hostname";
import { STONEAI_ROOT_DOMAIN } from "@/lib/domains/config";

export type SiteStatus = "draft" | "published" | "unpublished";

export type PublishedSite = {
  id: string;
  projectId: string;
  userId: string;
  slug: string;
  status: SiteStatus;
  publishedSchema: Website;
  seoTitle: string | null;
  seoDescription: string | null;
  faviconUrl: string | null;
  openGraphImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type SiteRow = {
  id: string;
  project_id: string;
  user_id: string;
  slug: string;
  status: SiteStatus;
  published_schema: Website;
  seo_title: string | null;
  seo_description: string | null;
  favicon_url: string | null;
  open_graph_image_url: string | null;
  created_at: string;
  updated_at: string;
};

const toPublishedSite = (row: SiteRow): PublishedSite => ({
  id: row.id,
  projectId: row.project_id,
  userId: row.user_id,
  slug: row.slug,
  status: row.status,
  publishedSchema: row.published_schema,
  seoTitle: row.seo_title,
  seoDescription: row.seo_description,
  faviconUrl: row.favicon_url,
  openGraphImageUrl: row.open_graph_image_url,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const normalizeSiteSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64) || "site";

export const getPublicSiteUrl = (slug: string, origin?: string | null) => {
  const normalizedSlug = normalizeSiteSlug(slug);
  const base = origin?.replace(/\/$/, "") || "";

  try {
    const url = new URL(base);
    const hostname = normalizeRequestHost(url.host);
    if (!["localhost", "127.0.0.1", "::1"].includes(hostname)) {
      return `${url.protocol}//${normalizedSlug}.${STONEAI_ROOT_DOMAIN}`;
    }
  } catch {
    // Fall back to path URLs when the caller does not pass an absolute origin.
  }

  return `${base}/sites/${normalizedSlug}`;
};

export const siteResolver = {
  async resolveByPathSlug(
    supabase: SupabaseClient,
    slug: string,
  ): Promise<PublishedSite | null> {
    const { data, error } = await supabase
      .from("sites")
      .select("id,project_id,user_id,slug,status,published_schema,seo_title,seo_description,favicon_url,open_graph_image_url,created_at,updated_at")
      .eq("slug", normalizeSiteSlug(slug))
      .eq("status", "published")
      .maybeSingle();

    if (error) throw error;
    return data ? toPublishedSite(data as SiteRow) : null;
  },

  async resolveBySubdomain(
    supabase: SupabaseClient,
    hostname: string,
  ): Promise<PublishedSite | null> {
    const slug = getStoneAISubdomainSlug(normalizeRequestHost(hostname));
    if (!slug) return null;

    return this.resolveByPathSlug(supabase, slug);
  },

  async resolveByHostname(
    supabase: SupabaseClient,
    hostname: string,
  ): Promise<PublishedSite | null> {
    const slug = await resolveHostnameToSlug(supabase, hostname);
    if (!slug) return null;

    return this.resolveByPathSlug(supabase, slug);
  },
};
