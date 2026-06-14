import type { MetadataRoute } from "next";
import { STONEAI_SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    "",
    "/pricing",
    "/features",
    "/templates",
    "/faq",
    "/about",
    "/contact",
    "/docs",
    "/privacy",
    "/terms",
    "/login",
    "/signup",
  ].map((path) => ({
    url: `${STONEAI_SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/pricing" ? 0.9 : 0.7,
  }));
}
