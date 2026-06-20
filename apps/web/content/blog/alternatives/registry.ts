import type { AlternativePage } from "@/lib/blog/types";
import { lovableAlternative } from "./lovable";
import { framerAlternative } from "./framer";
import { boltAlternative } from "./bolt";
import { threeDWebsiteBuilder } from "./3d-website-builder";
import { aiLandingPageBuilder } from "./ai-landing-page-builder";
import { realEstateWebsiteBuilder } from "./real-estate-website-builder";
import { agencyWebsiteBuilder } from "./agency-website-builder";
import { portfolioWebsiteBuilder } from "./portfolio-website-builder";

const pages: AlternativePage[] = [
  lovableAlternative,
  framerAlternative,
  boltAlternative,
  threeDWebsiteBuilder,
  aiLandingPageBuilder,
  realEstateWebsiteBuilder,
  agencyWebsiteBuilder,
  portfolioWebsiteBuilder,
];

export function getAllAlternatives(): AlternativePage[] {
  return pages;
}

export function getAlternativeBySlug(slug: string): AlternativePage | undefined {
  return pages.find((p) => p.slug === slug);
}

export function getAllAlternativeSlugs(): string[] {
  return pages.map((p) => p.slug);
}
