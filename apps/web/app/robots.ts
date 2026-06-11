import type { MetadataRoute } from "next";
import { STONEAI_SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/editor/", "/preview/", "/api/", "/auth/"],
      },
    ],
    sitemap: `${STONEAI_SITE_URL}/sitemap.xml`,
  };
}
