import type { BlogCategory } from "@/lib/blog/types";

export const categories: BlogCategory[] = [
  {
    slug: "comparisons",
    name: "Comparisons",
    description: "Head-to-head comparisons of StoneAI vs leading AI and no-code website builders.",
  },
  {
    slug: "alternatives",
    name: "Alternatives",
    description: "Best alternatives to Lovable, Framer, Bolt, and other popular website tools.",
  },
  {
    slug: "guides",
    name: "Guides",
    description: "Step-by-step guides for building, launching, and optimizing websites with AI.",
  },
  {
    slug: "roundups",
    name: "Roundups",
    description: "Curated lists of the best AI website builders, landing page tools, and templates.",
  },
  {
    slug: "industry",
    name: "Industry",
    description: "AI website builders tailored for real estate, agencies, restaurants, and more.",
  },
  {
    slug: "pricing",
    name: "Pricing",
    description: "Pricing breakdowns, ROI analysis, and cost comparisons for website builders.",
  },
  {
    slug: "trends",
    name: "Trends",
    description: "Website design trends, AI disruption, and the future of web experiences.",
  },
];

export const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c]));
