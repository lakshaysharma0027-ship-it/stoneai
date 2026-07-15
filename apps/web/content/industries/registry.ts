import type { IndustryPage } from "@/lib/blog/types";
import { industryPages } from "./all";

const pages: IndustryPage[] = industryPages;

export function getAllIndustries(): IndustryPage[] {
  return pages;
}

export function getIndustryBySlug(slug: string): IndustryPage | undefined {
  return pages.find((p) => p.slug === slug);
}

export function getAllIndustrySlugs(): string[] {
  return pages.map((p) => p.slug);
}
