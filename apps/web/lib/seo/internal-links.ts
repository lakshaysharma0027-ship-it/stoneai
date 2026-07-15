/** Topical cluster map for internal linking across blog, alternatives, industries, templates. */
export const SEO_CLUSTERS = {
  aiWebsiteBuilder: {
    hub: "/blog/best-ai-website-builders-2026",
    articles: [
      "how-to-build-website-with-ai",
      "how-to-launch-a-website-fast",
      "best-website-builders-for-small-businesses",
    ],
    alternatives: ["lovable", "framer", "bolt", "webflow"],
    industries: ["startups", "saas", "agencies"],
    product: ["/signup", "/pricing", "/features"],
  },
  alternatives: {
    hub: "/blog/best-lovable-alternatives",
    articles: [
      "stoneai-vs-lovable",
      "stoneai-vs-framer",
      "stoneai-vs-bolt",
      "stoneai-vs-webflow",
      "best-framer-alternatives",
      "best-bolt-alternatives",
    ],
    alternatives: ["lovable", "framer", "bolt", "webflow", "wix", "squarespace", "wordpress", "v0"],
    product: ["/signup"],
  },
  threeD: {
    hub: "/blog/best-3d-website-builders",
    articles: [
      "how-to-create-interactive-3d-websites",
      "future-of-3d-websites",
      "how-to-create-animated-websites",
      "best-interactive-website-examples",
    ],
    alternatives: ["3d-website-builder"],
    industries: ["architects", "real-estate", "portfolio", "photographers"],
    templates: ["portfolio", "real-estate"],
    product: ["/signup"],
  },
  industry: {
    hub: "/ai-website-builder-for/real-estate",
    articles: [
      "ai-website-builder-real-estate",
      "ai-website-builder-agencies",
      "ai-website-builder-restaurants",
      "best-ai-website-builder-for-saas",
    ],
    industries: [
      "real-estate",
      "restaurants",
      "agencies",
      "dentists",
      "lawyers",
      "consultants",
      "startups",
      "saas",
      "freelancers",
      "nonprofits",
    ],
    templates: ["real-estate", "saas", "agency", "restaurant", "portfolio"],
    product: ["/signup", "/templates"],
  },
} as const;

export const PRIORITY_INTERNAL_LINKS = {
  product: [
    { href: "/signup", label: "Start building free" },
    { href: "/pricing", label: "View pricing" },
    { href: "/features", label: "Explore features" },
    { href: "/templates", label: "Browse templates" },
  ],
  seo: [
    { href: "/blog", label: "StoneAI Blog" },
    { href: "/alternatives/lovable", label: "Lovable alternative" },
    { href: "/alternatives/framer", label: "Framer alternative" },
    { href: "/alternatives/3d-website-builder", label: "3D website builder" },
    { href: "/ai-website-builder-for/saas", label: "AI website builder for SaaS" },
  ],
} as const;

export function industryPath(slug: string) {
  return `/ai-website-builder-for/${slug}`;
}

export function alternativePath(slug: string) {
  return `/alternatives/${slug}`;
}

export function templatePath(slug: string) {
  return `/templates/${slug}`;
}

export function blogPath(slug: string) {
  return `/blog/${slug}`;
}
