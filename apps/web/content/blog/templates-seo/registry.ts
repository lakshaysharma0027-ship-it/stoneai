import type { TemplateSeoPage } from "@/lib/blog/types";
import { realEstateTemplate } from "./real-estate";
import { saasTemplate } from "./saas";
import { agencyTemplate } from "./agency";
import { restaurantTemplate } from "./restaurant";
import { portfolioTemplate } from "./portfolio";

const pages: TemplateSeoPage[] = [
  realEstateTemplate,
  saasTemplate,
  agencyTemplate,
  restaurantTemplate,
  portfolioTemplate,
];

export function getAllTemplateSeoPages(): TemplateSeoPage[] {
  return pages;
}

export function getTemplateSeoBySlug(slug: string): TemplateSeoPage | undefined {
  return pages.find((p) => p.slug === slug);
}

export function getAllTemplateSeoSlugs(): string[] {
  return pages.map((p) => p.slug);
}
