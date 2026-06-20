import type { TemplateSeoPage } from "@/lib/blog/types";
import {
  h2,
  h3,
  p,
  ul,
  ol,
  ctaTop,
  ctaMiddle,
  ctaBottom,
  link,
} from "../blocks";

export const saasTemplate: TemplateSeoPage = {
  slug: "saas",
  name: "SaaS",
  seoTitle: "AI SaaS Website Template — Landing Pages, Pricing & Product Marketing | StoneAI",
  metaDescription:
    "Build a high-converting SaaS website with StoneAI. Product hero sections, feature grids, pricing tables, social proof, and demo CTAs—generated from a prompt and ready to publish.",
  title: "SaaS Website Template for Product Launches, Demos, and Growth",
  subtitle:
    "Ship a conversion-ready marketing site with pricing, features, integrations, and trust signals—before your next sprint ends.",
  previewGradient:
    "linear-gradient(135deg, #1e1b4b 0%, #4f46e5 50%, #06b6d4 100%)",
  features: [
    {
      title: "Product-led hero sections",
      description:
        "Clear value propositions, product screenshots, and demo CTAs positioned for visitors evaluating your software.",
    },
    {
      title: "Feature and benefit grids",
      description:
        "Scannable layouts that translate technical capabilities into outcomes your buyers actually care about.",
    },
    {
      title: "Pricing and plan comparison",
      description:
        "Tiered pricing tables with feature checklists, annual toggle placeholders, and enterprise contact paths.",
    },
    {
      title: "Social proof modules",
      description:
        "Logo bars, testimonial cards, and case study snippets that reduce perceived risk for new signups.",
    },
  ],
  useCases: [
    "B2B software startups",
    "Developer tools and APIs",
    "Productivity and workflow apps",
    "Fintech and compliance SaaS",
    "Vertical SaaS for industries",
    "PLG companies scaling marketing",
  ],
  faq: [
    {
      question: "Can StoneAI build a full SaaS marketing website?",
      answer:
        "Yes. The SaaS template generates homepage, features, pricing, about, integrations, and contact pages with conversion-focused layouts. Founders describe their product, audience, and pricing model in a prompt, then refine copy and visuals before publishing.",
    },
    {
      question: "Does the template include a pricing page?",
      answer:
        "The template includes tiered pricing sections with plan names, price placeholders, feature comparison rows, and CTAs for free trials, demos, and enterprise sales. You customize tiers and copy in the visual editor to match your actual packaging.",
    },
    {
      question: "How does StoneAI compare to Webflow for SaaS sites?",
      answer:
        "Webflow offers deep design control but requires more manual build time. StoneAI generates a complete site structure from a prompt and includes AI imagery and publishing. Teams that need speed to first live URL often start on StoneAI and iterate visually without a designer-developer handoff.",
    },
    {
      question: "Can I add integrations and security pages?",
      answer:
        "Yes. Generate additional pages for integrations, security, changelog, or documentation links. The visual editor lets you add sections for compliance badges, SOC 2 mentions, and partner logos common on B2B SaaS sites.",
    },
  ],
  relatedArticleSlugs: [
    "best-landing-page-builders",
    "stoneai-vs-lovable",
    "stoneai-vs-framer",
    "ai-website-builder-pricing-guide",
  ],
  content: [
    ctaTop(),
    p(
      "SaaS companies live and die by positioning. Your homepage has seconds to explain what the product does, who it is for, and why someone should start a trial instead of closing the tab. Yet early-stage teams routinely delay launch waiting for a designer, a Webflow contractor, or a founding engineer to steal cycles from the actual product.",
    ),
    p(
      "StoneAI's SaaS website template gives founders and growth teams a production-ready marketing site in minutes. Describe your product category, core workflow, ideal customer, and pricing motion—self-serve trial, demo-led sales, or hybrid—and get a multi-page site with hero sections, feature grids, pricing tables, integration showcases, and trust signals tuned for software buyers.",
    ),
    p(
      "This page breaks down what the template includes, how startups use it for launches and iterations, and the patterns that separate high-converting SaaS sites from generic AI output.",
    ),
    h2("saas-marketing-fundamentals", "What a SaaS Marketing Site Must Accomplish"),
    p(
      "Unlike brochure sites, SaaS marketing pages carry commercial intent on every screen. Visitors arrive from paid ads, Product Hunt, LinkedIn posts, or sales emails with specific questions: Does this solve my problem? Is it credible? What does it cost? Can I try it without talking to sales?",
    ),
    p(
      "The StoneAI template structures pages around those questions. The homepage leads with outcome-focused copy, not feature dumps. Feature pages group capabilities by job-to-be-done. Pricing pages make plan differences obvious. About and security pages answer procurement concerns before they stall deals.",
    ),
    h3("conversion-paths", "Mapping Self-Serve vs Sales-Led Paths"),
    p(
      "Product-led growth companies need prominent trial buttons, onboarding previews, and friction-free signup flows linked from every major section. Sales-led companies need demo request forms, ROI calculators, and customer proof aimed at committee buyers. The template supports both motions—you configure CTAs and form destinations in the editor after generation.",
    ),
    ul([
      "Primary CTA above the fold on every core page",
      "Secondary paths for enterprise and security-conscious buyers",
      "Feature pages that mirror how prospects evaluate alternatives",
      "Pricing transparency or qualified 'contact sales' fallbacks",
      "Footer navigation to docs, changelog, and status pages",
    ]),
    link("best-landing-page-builders", "Best landing page builders for SaaS conversion"),
    h2("template-structure", "Inside the SaaS Website Template"),
    h3("homepage-hero", "Homepage Hero and Product Narrative"),
    p(
      "The homepage opens with a sharp headline tied to a buyer outcome—'Close deals faster,' 'Ship invoices without spreadsheets,' 'Monitor production in one dashboard.' Supporting subcopy explains the mechanism in plain language. Product UI appears in browser frames or device mockups generated or uploaded through StoneAI. Dual CTAs separate trial users from demo seekers.",
    ),
    h3("features-integrations", "Features, Integrations, and Differentiation"),
    p(
      "Feature sections use icon grids, alternating image-text rows, and comparison callouts against manual workflows or legacy tools. Integration pages list Slack, Salesforce, HubSpot, Stripe, and category-specific connectors with logo placeholders you replace. Differentiation sections address why your approach wins—speed, accuracy, compliance, cost—without sounding like a generic buzzword salad.",
    ),
    h3("pricing-trust", "Pricing Tables and Trust Layers"),
    p(
      "Pricing pages show three to four tiers with clear upgrade paths. Annual discount callouts, usage-based notes, and enterprise contact modules handle edge cases. Trust layers—customer logos, G2-style testimonial quotes, security badges, uptime mentions—appear on pricing and homepage sections because buyers look for social proof at the moment of commercial consideration.",
    ),
    ctaMiddle(),
    h2("launch-scenarios", "How SaaS Teams Use the Template"),
    p(
      "Pre-launch startups generate a site the same week they freeze MVP scope so waitlist and beta pages look credible. Seed-stage companies refresh positioning after pivot without rehiring an agency. Series A teams spin up vertical landing pages for new segments. Developer tools add changelog and API overview pages. Fintech products add compliance-forward copy blocks suggested in the generation prompt.",
    ),
    ul([
      "Product Hunt and launch week campaigns with dedicated landing variants",
      "Paid search destination pages per keyword cluster or competitor comparison",
      "Partner co-marketing pages with joint value propositions",
      "International expansion with localized copy blocks per region",
      "Sales enablement microsites for enterprise accounts",
    ]),
    h2("workflow", "From Prompt to Published SaaS Site"),
    p(
      "Strong SaaS prompts include category, ICP, top three outcomes, pricing model, competitors to differentiate against, and required pages. Weak prompts produce generic output—you still get structure, but copy sounds interchangeable. Invest ten minutes in the brief to save an hour in editing.",
    ),
    ol([
      "Draft a positioning sentence: who, problem, outcome, why now.",
      "List pages: home, features, pricing, integrations, about, contact, optional security.",
      "Generate in StoneAI with brand colors, tone (technical, friendly, enterprise), and screenshot placeholders.",
      "Replace generic feature names with your actual product vocabulary.",
      "Wire CTAs to your trial signup, Calendly, or HubSpot forms.",
      "Add real customer logos and quotes—even two testimonials beat zero.",
      "Publish to your domain and point ad campaigns to live URLs the same day.",
    ]),
    h3("iterate-without-engineering", "Iterate Copy Without Engineering Tickets"),
    p(
      "Messaging tests should not wait for sprint capacity. Growth marketers duplicate hero sections, test headline variants, and publish campaign-specific landing pages in StoneAI while engineering ships the product. When positioning shifts after customer interviews, you update the site in hours—not quarters.",
    ),
    link("stoneai-vs-lovable", "StoneAI vs Lovable for SaaS marketing sites"),
    h2("design-quality", "Standing Out in a Sea of SaaS Sameness"),
    p(
      "Buyers are numb to purple gradients and identical three-column feature grids. StoneAI pushes beyond flat templates with cinematic depth, refined typography, and optional 3D hero treatments that signal product craft. When your software competes on user experience, your marketing site should not look like it was assembled from the same free UI kit as fifty competitors.",
    ),
    p(
      "Integrated AI imagery generates abstract visuals, dashboard concepts, and workflow illustrations aligned to your palette when screenshots are not ready. Founders launching before design maturity still publish a site that feels intentional—not a obvious placeholder.",
    ),
    h3("seo-and-content", "SEO Foundations for Organic Growth"),
    p(
      "The template includes semantic heading hierarchy, meta title and description fields, and content sections suitable for comparison articles, use case pages, and glossary entries. SaaS teams pair the marketing site with blog content linking back to feature and pricing pages. Internal links in StoneAI content blocks connect related articles without manual HTML.",
    ),
    h2("when-to-extend", "When to Extend Beyond the Marketing Site"),
    p(
      "StoneAI focuses on marketing and conversion layers—not authenticated product UI. You still build your app in your stack. The template handles everything before signup: positioning, proof, pricing, and contact. Docs, in-app onboarding, and customer portals stay in dedicated tools. That separation keeps marketing iteration fast without risking production deployments.",
    ),
    link("ai-website-builder-pricing-guide", "AI website builder pricing for startup budgets"),
    h2("start-building", "Launch Your SaaS Site Before the Next Board Meeting"),
    p(
      "Sign up for StoneAI, describe your product in one detailed prompt, and review the generated SaaS site in the visual editor. Swap in screenshots, tighten pricing copy, connect your domain, and share a live link with investors, design partners, and early customers. Speed to credible web presence is a competitive advantage—especially when every week of delay is a week competitors capture search and share of voice.",
    ),
  p(
      "Whether you are pre-revenue or scaling a growth team, the SaaS template gives you the architecture B2B buyers expect so you focus on product-market fit—not fighting layout tools.",
    ),
    link("stoneai-vs-framer", "StoneAI vs Framer for startup marketing sites"),
    ctaBottom(),
  ],
};
