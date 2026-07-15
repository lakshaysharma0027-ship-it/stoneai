import { getTemplateById } from "@/lib/templates";
import type { StoredProject } from "@/lib/projects";
import type { ProjectStatus, PublishedSiteRow, CustomDomainRow } from "./types";

export const formatUpdatedAt = (timestamp: number | string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));

export const formatShortDate = (timestamp: number | string) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));

export const projectInitials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "P";

export const getProjectStatus = (
  project: StoredProject,
  publishedSites: PublishedSiteRow[],
): ProjectStatus => {
  const site = publishedSites.find((s) => s.project_id === project.id);
  if (site?.status === "published") return "live";
  if (site?.status === "unpublished") return "draft";
  return "draft";
};

export const getProjectSite = (projectId: string, publishedSites: PublishedSiteRow[]) =>
  publishedSites.find((site) => site.project_id === projectId) ?? null;

export const getProjectPreviewUrl = (
  projectId: string,
  publishedSites: PublishedSiteRow[],
  project?: StoredProject | null,
) => {
  const metadata = (project as { pipelineMetadata?: { renderMode?: string } } | null | undefined)
    ?.pipelineMetadata;
  if (metadata?.renderMode === "template_html") {
    const site = getProjectSite(projectId, publishedSites);
    if (site?.status === "published" && site.public_url) {
      return site.public_url;
    }
    return `/api/projects/${projectId}/template-html`;
  }

  const site = getProjectSite(projectId, publishedSites);
  if (site?.status === "published" && site.public_url) {
    return site.public_url;
  }
  return `/preview/${projectId}`;
};

/** Same-origin embed route for dashboard iframes (avoids cross-origin iframe blocks). */
export const getProjectEmbedUrl = (projectId: string) => `/embed/${projectId}`;

export const getProjectDomain = (
  projectId: string,
  publishedSites: PublishedSiteRow[],
  domains: CustomDomainRow[],
) => {
  const site = getProjectSite(projectId, publishedSites);
  if (!site) return null;
  return domains.find((domain) => domain.siteId === site.id) ?? null;
};

export const getProjectTraffic = (projectId: string, publishedSites: PublishedSiteRow[]) => {
  const site = getProjectSite(projectId, publishedSites);
  return site?.site_analytics?.[0]?.page_views ?? null;
};

export const getTemplateName = (project: StoredProject) =>
  getTemplateById(project.templateId)?.name ?? "Unknown";

export const hashToView = (hash: string): string | null => {
  const map: Record<string, string> = {
    overview: "overview",
    projects: "projects",
    "published-sites": "analytics",
    templates: "templates",
    media: "generate-image",
    "ai-website": "generate-website",
    images: "generate-image",
    videos: "generate-video",
    generate: "generate-website",
    domains: "domains",
    analytics: "analytics",
    billing: "billing",
    settings: "settings",
    credits: "billing",
  };
  const key = hash.replace(/^#/, "").toLowerCase();
  return map[key] ?? null;
};

/** Build 7-day activity buckets from project updatedAt timestamps (real data). */
export const buildProjectActivitySparkline = (projects: StoredProject[]): number[] => {
  const buckets = Array.from({ length: 7 }, () => 0);
  const now = Date.now();
  for (const project of projects) {
    const daysAgo = Math.floor((now - project.updatedAt) / (1000 * 60 * 60 * 24));
    if (daysAgo >= 0 && daysAgo < 7) {
      buckets[6 - daysAgo] = (buckets[6 - daysAgo] ?? 0) + 1;
    }
  }
  return buckets;
};

export const buildCreditUsageSparkline = (
  transactions: Array<{ amount: number; created_at: string }>,
): number[] => {
  const buckets = Array.from({ length: 7 }, () => 0);
  const now = Date.now();
  for (const txn of transactions) {
    if (txn.amount >= 0) continue;
    const daysAgo = Math.floor((now - new Date(txn.created_at).getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo >= 0 && daysAgo < 7) {
      buckets[6 - daysAgo] = (buckets[6 - daysAgo] ?? 0) + Math.abs(txn.amount);
    }
  }
  return buckets;
};

const PROJECT_GRADIENTS = [
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
  "linear-gradient(135deg, #312e81 0%, #4c1d95 100%)",
  "linear-gradient(135deg, #06b6d4, #0891b2)",
  "linear-gradient(135deg, #f59e0b, #d97706)",
  "linear-gradient(135deg, #164e63 0%, #0e7490 100%)",
  "linear-gradient(135deg, #78350f 0%, #b45309 100%)",
];

const PROJECT_CARD_THUMB_COUNT = 3;

const hashProjectId = (projectId: string, modulo: number) => {
  let hash = 0;
  for (let i = 0; i < projectId.length; i += 1) {
    hash = (hash + projectId.charCodeAt(i)) % modulo;
  }
  return hash;
};

export const getProjectGradientIndex = (projectId: string) =>
  hashProjectId(projectId, PROJECT_GRADIENTS.length);

export const getProjectCardThumbIndex = (projectId: string) =>
  hashProjectId(projectId, PROJECT_CARD_THUMB_COUNT);

export const chipClassForStatus = (status: ProjectStatus | string) => {
  const s = status.toLowerCase();
  if (s === "live" || s === "published" || s === "completed" || s === "active") return "dash-chip-live";
  if (s === "building" || s === "processing" || s === "pending") return "dash-chip-build";
  if (s === "failed" || s === "error") return "dash-chip-failed";
  return "dash-chip-draft";
};
