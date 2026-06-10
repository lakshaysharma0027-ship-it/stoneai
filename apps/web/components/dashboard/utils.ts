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
  return "draft";
};

export const getProjectSite = (projectId: string, publishedSites: PublishedSiteRow[]) =>
  publishedSites.find((site) => site.project_id === projectId) ?? null;

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
    media: "media",
    "ai-website": "generate",
    images: "generate",
    videos: "generate",
    domains: "domains",
    analytics: "analytics",
    billing: "billing",
    settings: "settings",
    credits: "billing",
  };
  const key = hash.replace(/^#/, "").toLowerCase();
  return map[key] ?? null;
};
