import type { Metadata } from "next";
import { STONEAI_DEFAULT_DESCRIPTION, STONEAI_SITE_URL } from "@/lib/site";

const OG_IMAGE = {
  url: "/brand/og-image.png",
  width: 1200,
  height: 630,
  alt: "StoneAI — AI Website Builder",
} as const;

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type,
      siteName: "StoneAI",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function buildArticleMetadata({
  seoTitle,
  metaDescription,
  slug,
  publishedAt,
  updatedAt,
}: {
  seoTitle: string;
  metaDescription: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
}): Metadata {
  return {
    ...buildPageMetadata({
      title: seoTitle,
      description: metaDescription,
      path: `/blog/${slug}`,
      type: "article",
    }),
    openGraph: {
      title: seoTitle,
      description: metaDescription,
      url: `/blog/${slug}`,
      type: "article",
      siteName: "StoneAI",
      publishedTime: publishedAt,
      modifiedTime: updatedAt,
      images: [OG_IMAGE],
    },
  };
}

export const DEFAULT_OG = OG_IMAGE;
export const SITE_URL = STONEAI_SITE_URL;
export const DEFAULT_DESCRIPTION = STONEAI_DEFAULT_DESCRIPTION;
