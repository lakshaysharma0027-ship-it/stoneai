import type { MetadataRoute } from "next";
import { getAllArticleSlugs } from "@/lib/blog/registry";
import { getAllAlternativeSlugs } from "@/content/blog/alternatives/registry";
import { getAllTemplateSeoSlugs } from "@/content/blog/templates-seo/registry";
import { categories } from "@/content/blog/categories";
import { STONEAI_SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPaths = [
    "",
    "/pricing",
    "/features",
    "/templates",
    "/blog",
    "/faq",
    "/about",
    "/contact",
    "/docs",
    "/privacy",
    "/terms",
    "/login",
    "/signup",
  ];

  const blogArticles = getAllArticleSlugs().map((slug) => ({
    url: `${STONEAI_SITE_URL}/blog/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogCategories = categories.map((cat) => ({
    url: `${STONEAI_SITE_URL}/blog/category/${cat.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const alternatives = getAllAlternativeSlugs().map((slug) => ({
    url: `${STONEAI_SITE_URL}/alternatives/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const templateSeo = getAllTemplateSeoSlugs().map((slug) => ({
    url: `${STONEAI_SITE_URL}/templates/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticPaths.map((path) => ({
      url: `${STONEAI_SITE_URL}${path}`,
      lastModified,
      changeFrequency: (path === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: path === "" ? 1 : path === "/pricing" || path === "/blog" ? 0.9 : 0.7,
    })),
    ...blogArticles,
    ...blogCategories,
    ...alternatives,
    ...templateSeo,
  ];
}
