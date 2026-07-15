import type { AlternativePage } from "@/lib/blog/types";
import { h2, h3, p, ul, ctaTop, ctaMiddle, ctaBottom, link, comparison, prosCons, href } from "../blocks";

export const v0Alternative: AlternativePage = {
  slug: "v0",
  competitor: "v0",
  seoTitle: "Best v0 Alternative in 2026 — StoneAI vs Vercel v0",
  metaDescription:
    "Compare StoneAI to Vercel v0 for AI website building. Get marketing-ready sites with visual editing, 3D, publishing, and domains—not just React components.",
  title: "The Best v0 Alternative for Marketing Websites",
  subtitle: "From UI components to full published sites",
  heroDescription:
    "v0 by Vercel excels at generating React UI components. StoneAI targets complete marketing websites with copy, structure, publishing, and conversion sections.",
  comparisonHeaders: ["Feature", "StoneAI", "v0"],
  comparisonRows: [
    ["Output", "Full marketing website", "UI components / code"],
    ["Visual editor", "✓ No-code", "Code preview"],
    ["Publishing + domains", "✓ Built-in", "Deploy separately"],
    ["3D / cinematic", "✓ Native", "Via custom prompts"],
    ["AI images + video", "✓ Integrated", "—"],
    ["Best for", "Founders, agencies, marketers", "Developers on Vercel"],
  ],
  features: [
    { title: "Complete site generation", description: "Hero, features, pricing, FAQ, and CTAs—not isolated components to assemble." },
    { title: "Non-developer workflow", description: "Marketers edit visually without maintaining generated React files." },
    { title: "Built-in go-live", description: "Publish with SSL and connect custom domains from one dashboard." },
    { title: "Integrated AI media", description: "Generate images and hero video inside the same workspace." },
  ],
  prosCons: {
    stoneai: {
      pros: [
        "End-to-end website generation and publishing",
        "Visual editor for non-developers",
        "3D and cinematic sections native",
        "Custom domains included",
        "AI image and video pipeline",
      ],
      cons: [
        "Less control over raw React component code",
        "Not for complex app dashboards",
        "Smaller dev-tool ecosystem than Vercel",
      ],
    },
    competitor: {
      pros: [
        "Excellent React/Tailwind component output",
        "Tight Vercel deployment integration",
        "Great for developers prototyping UI",
        "shadcn/ui compatible components",
        "Fast iteration in code view",
      ],
      cons: [
        "Not a full website builder out of the box",
        "Requires assembly and deployment knowledge",
        "No native custom domain workflow for marketers",
        "Marketing copy and SEO structure not automatic",
        "3D and media require separate tooling",
      ],
    },
  },
  faq: [
    { question: "Is StoneAI better than v0 for landing pages?", answer: "For complete landing pages with publishing and domains, yes. v0 is better when you want React components to embed in an existing Next.js app." },
    { question: "Can v0 users switch to StoneAI?", answer: "Yes. Describe your site in StoneAI and regenerate—most marketing pages rebuild in minutes." },
    { question: "Does StoneAI integrate with Vercel?", answer: "StoneAI publishes to its own edge hosting with custom domain support. Use v0 for component codegen inside Vercel apps; StoneAI for full site launches." },
    { question: "Which is faster for non-developers?", answer: "StoneAI—no code reading or deployment configuration required." },
  ],
  relatedArticleSlugs: ["best-ai-website-builders-2026", "how-to-launch-a-website-fast", "stoneai-vs-framer"],
  content: [
    ctaTop(),
    prosCons(
      { pros: ["Full-site AI generation", "Visual editing", "3D native", "Domains included", "AI media"], cons: ["Less raw code control", "Not for complex apps"] },
      { name: "v0", pros: ["Great React UI output", "Vercel integration", "Developer speed", "shadcn compatible"], cons: ["Not full sites", "Needs assembly", "Dev skills required"] },
    ),
    h2("v0-vs-stoneai", "v0 vs StoneAI: components vs websites"),
    p(
      "v0 changed how developers scaffold UI. Ask for a dashboard card or pricing section; get production-quality React. That workflow is powerful inside engineering teams. Buyers searching for a v0 alternative often need something different: a marketing website that goes live on their domain this week.",
    ),
    p(
      "StoneAI generates complete sites—structure, copy, visuals, conversion paths—and lets you edit without touching code. Publishing and SSL are included. The buyer is a founder or marketer, not a frontend engineer shipping components into a monorepo.",
    ),
    link("stoneai-vs-webflow", "StoneAI vs Webflow comparison"),
    comparison(
      ["Use case", "StoneAI", "v0"],
      [
        ["Marketing landing page", "Excellent", "Requires assembly"],
        ["React component library", "Not primary", "Excellent"],
        ["Custom domain publish", "Built-in", "Manual"],
        ["3D marketing site", "Native", "Custom prompt"],
      ],
    ),
    ctaMiddle(),
    h2("who-should-use-stoneai", "Who should choose StoneAI over v0"),
    ul([
      "Founders without a frontend hire",
      "Agencies delivering client marketing sites",
      "Marketers running paid ads to landing pages",
      "Brands needing 3D cinematic presence",
      "Teams that will not maintain generated code",
    ]),
    href("/alternatives/webflow", "Compare Webflow alternative"),
    href("/ai-website-builder-for/saas", "AI website builder for SaaS"),
    h2("migrate", "Migrate from v0 to a live marketing site"),
    p(
      "Exporting v0 components still leaves you with assembly, routing, copy, SEO, and hosting. StoneAI collapses those steps: prompt, refine, publish. Most teams have a live page within a day.",
    ),
    href("/signup", "Start building with StoneAI"),
    ctaBottom(),
  ],
};
