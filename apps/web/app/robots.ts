import type { MetadataRoute } from "next";
import { STONEAI_SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/blog/",
          "/alternatives/",
          "/templates/",
          "/ai-website-builder-for/",
          "/press",
          "/media-kit",
          "/company",
        ],
        disallow: [
          "/dashboard",
          "/editor/",
          "/preview/",
          "/embed/",
          "/api/",
          "/auth/",
          "/projects",
          "/login",
          "/verify-email",
          "/reset-password",
          "/forgot-password",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: ["/blog/", "/alternatives/", "/ai-website-builder-for/", "/press", "/company"],
        disallow: ["/api/", "/dashboard"],
      },
    ],
    sitemap: `${STONEAI_SITE_URL}/sitemap.xml`,
    host: STONEAI_SITE_URL,
  };
}
