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

export const agencyTemplate: TemplateSeoPage = {
  slug: "agency",
  name: "Agency",
  seoTitle: "AI Agency Website Template — Portfolio, Services & Client Proof | StoneAI",
  metaDescription:
    "Create a professional agency website with StoneAI. Service pages, case studies, team bios, process sections, and lead forms—built for digital, creative, and marketing agencies.",
  title: "Agency Website Template That Wins Clients Before the Pitch Deck",
  subtitle:
    "Showcase services, case studies, and team expertise with a site that proves you practice what you preach.",
  previewGradient:
    "linear-gradient(135deg, #18181b 0%, #7c3aed 45%, #ec4899 100%)",
  features: [
    {
      title: "Service and capability pages",
      description:
        "Structured offerings for branding, web, paid media, SEO, and retainers—each with outcomes, deliverables, and CTAs.",
    },
    {
      title: "Case study layouts",
      description:
        "Challenge, approach, results storytelling with metrics placeholders, client logos, and visual project galleries.",
    },
    {
      title: "Team and culture sections",
      description:
        "Humanize your agency with leadership bios, hiring CTAs, and values blocks that attract talent and clients.",
    },
    {
      title: "Process and proof",
      description:
        "Timeline or step-based 'how we work' sections paired with testimonials that reduce sales cycle friction.",
    },
  ],
  useCases: [
    "Digital marketing agencies",
    "Branding and design studios",
    "Web development shops",
    "SEO and content agencies",
    "Social media management firms",
    "Full-service creative consultancies",
  ],
  faq: [
    {
      question: "Should an agency use StoneAI for its own website?",
      answer:
        "Absolutely. Agencies are judged by their own web presence. StoneAI lets you launch a polished agency site quickly—then use the same platform to deliver client projects faster. Your site becomes a live proof point for the workflow you sell.",
    },
    {
      question: "Can I showcase multiple case studies?",
      answer:
        "Yes. The template includes case study index and detail layouts with problem, solution, results, and imagery sections. Duplicate and customize pages per client vertical without rebuilding site architecture.",
    },
    {
      question: "How do agencies use StoneAI for client delivery?",
      answer:
        "Many agencies generate client sites from briefs in StoneAI, refine in the visual editor, and publish under client domains. The agency template on your own domain demonstrates speed, design quality, and modern production—supporting premium positioning.",
    },
    {
      question: "Does the template support contact and discovery forms?",
      answer:
        "Lead capture forms, discovery call schedulers, and project inquiry fields are built into contact and service pages. Connect forms to your CRM or scheduling tool before launch.",
    },
  ],
  relatedArticleSlugs: [
    "ai-website-builder-agencies",
    "best-landing-page-builders",
    "stoneai-vs-framer",
    "stoneai-vs-lovable",
  ],
  content: [
    ctaTop(),
    p(
      "Agencies sell transformation, but prospects judge capability on the first impression—your homepage. Ironically, many agencies postpone their own rebrand for years because client work always comes first. The site stays outdated, case studies rot in PDF decks, and new business reps send prospects to a portfolio that does not reflect current quality.",
    ),
    p(
      "StoneAI's agency website template fixes that bottleneck. Generate a multi-page site with services, case studies, process, team, careers, and contact sections from a single prompt. Refine layouts in the visual editor, publish to your domain, and demonstrate the same AI-accelerated workflow you can offer clients.",
    ),
    p(
      "Below is a practical breakdown of template sections, positioning strategies for different agency types, and workflows that turn your site into a consistent new-business asset.",
    ),
    h2("agency-site-goals", "What Prospects Look for on an Agency Website"),
    p(
      "Buyers are not browsing for fun—they are building a shortlist. They want proof you have solved problems like theirs, clarity on services and pricing signals, confidence in your process, and a team they would trust on a kickoff call. Vague 'we are passionate about innovation' copy does not survive comparison to an agency that shows metrics, logos, and named case studies.",
    ),
    p(
      "The StoneAI agency template structures proof early. Logo bars and testimonial snippets appear on the homepage. Service pages speak to outcomes—pipeline growth, brand recall, conversion lift—not deliverable laundry lists without context. Case studies follow a narrative arc prospects can map to their own situation.",
    ),
    h3("credibility-signals", "Credibility Signals That Shorten Sales Cycles"),
    ul([
      "Named clients and verticals you specialize in—not 'various industries'",
      "Quantified results where possible: CPA down, MQLs up, launch timeline met",
      "Clear service packaging: audit, retainer, project, workshop",
      "Transparent process: discovery, strategy, execution, reporting",
      "Team faces and roles so buyers know who leads the account",
    ]),
    link("ai-website-builder-agencies", "AI website builder guide for agency client delivery"),
    h2("template-breakdown", "Agency Template Sections Explained"),
    h3("services-pages", "Services and Positioning Pages"),
    p(
      "Each service page follows a consistent pattern: who it is for, problems solved, deliverables, timeline expectations, and CTA to book a discovery call. Digital agencies split paid media, SEO, content, and CRO. Design studios emphasize brand systems, web, and campaign creative. Dev shops highlight platforms, integrations, and maintenance. You generate the set from your prompt, then tighten language to match your positioning wedge.",
    ),
    h3("case-studies", "Case Studies That Sell"),
    p(
      "Case study templates include client context, challenge, approach, deliverables, and results with metric callouts. Visual galleries showcase before-and-after creative, landing pages, or dashboard screenshots. Even three strong case studies outperform twenty tiny logo tiles. StoneAI gives you the scaffolding—your team supplies the wins.",
    ),
    h3("about-process-team", "About, Process, and Team"),
    p(
      "The about page tells why the agency exists and which clients you refuse—clarity attracts better fits. Process sections demystify engagement: kickoff, research, build, launch, optimize. Team pages put names and titles to the people on sales calls. Careers sections help recruiting when you are growing.",
    ),
    ctaMiddle(),
    h2("agency-types", "Tailoring the Template to Your Agency Model"),
    p(
      "Boutique branding agencies emphasize visual portfolio grids and manifesto copy. Performance marketing agencies lead with benchmarks and channel expertise. SEO agencies highlight audit samples and organic growth charts. Full-service shops balance breadth with vertical focus pages—healthcare, fintech, ecommerce—to capture niche search intent.",
    ),
    ul([
      "Replace stock case study names with anonymized or approved client stories",
      "Add industry landing pages for your top three revenue verticals",
      "Embed video showreels or Loom walkthroughs in hero or case study sections",
      "Link to live client sites you built with StoneAI as meta proof",
      "Publish thought leadership posts that internal-link to service pages",
    ]),
    h2("workflow", "Launch Your Agency Site in One Day"),
    ol([
      "Audit competitors: note what proof and CTAs they use on home and service pages.",
      "Write a StoneAI prompt with agency name, services, verticals, tone, and required pages.",
      "Generate the site and fix mobile layout issues first—prospects often browse on phones between meetings.",
      "Upload real project imagery; replace AI placeholders with approved client work.",
      "Add two to four case studies even if pages are initially short—you can expand later.",
      "Connect contact forms and calendar links for discovery calls.",
      "Publish and send the URL in outbound sequences the same week.",
    ]),
    h3("dogfooding", "Dogfooding StoneAI with Client Work"),
    p(
      "The strongest agency pitch is a live example. When prospects ask how you ship fast, show your site and a recent client launch built the same way. StoneAI becomes both your storefront and your production line—margins improve because standard marketing sites no longer consume developer weeks.",
    ),
    h2("client-onboarding", "From New Business Win to Client Site Delivery"),
    p(
      "The same StoneAI workflow that powers your agency site can power client delivery. After you win the pitch, feed the client brief into StoneAI, generate their marketing site, and present a live preview during the kickoff call. Clients experience momentum immediately; your team avoids the dead air between contract signature and first design mockup.",
    ),
    p(
      "Standardize prompts per vertical—restaurant, SaaS, professional services—so account managers produce consistent quality without designer bottlenecks on every project. Senior creatives review and elevate; juniors or strategists handle first-pass generation and copy edits.",
    ),
    link("stoneai-vs-framer", "StoneAI vs Framer for agency client sites"),
    h2("design-differentiation", "Looking Like the Creative Partner You Claim to Be"),
    p(
      "Agencies cannot sell premium creative while running a generic template. StoneAI delivers cinematic layouts, bold typography, and optional 3D sections that feel bespoke. Your own site should be the piece in the portfolio that makes art directors pause. AI generation is the starting point; your taste in the editor is the differentiator.",
    ),
    p(
      "Integrated AI imagery helps when case study assets are under NDA—generate abstract brand visuals and campaign concepts that communicate capability without revealing client identity.",
    ),
    h3("content-and-seo", "Content Strategy for Inbound Leads"),
    p(
      "Service pages target commercial intent keywords. Blog posts and guides capture top-of-funnel searches and internal-link to contact pages. The template's heading structure supports SEO best practices. Agencies that publish consistently—even one article monthly—compound organic leads while outbound runs in parallel.",
    ),
    h2("pricing-positioning", "Aligning Your Site with How You Charge"),
    p(
      "Some agencies publish starting prices or package tiers to filter leads. Others hide pricing and force discovery calls. The template supports both: pricing tables for productized services, or 'request a quote' modules for custom retainers. Match the site to your sales motion so form submissions arrive pre-qualified.",
    ),
    h3("new-business-playbook", "Using Your Site in New Business Conversations"),
    p(
      "Account executives should send prospects to specific service pages—not the homepage—based on discovery notes. A fintech lead gets the fintech case study and paid media service page. A rebrand lead gets the branding portfolio and process page. StoneAI's structure makes those deep links credible because every page stands alone with proof and CTAs.",
    ),
    h3("hiring-and-culture", "Careers Pages That Recruit While You Sleep"),
    p(
      "Top talent evaluates your site before applying. Careers sections with role summaries, culture photos, and benefits signals matter as much as client proof. Agencies growing past twenty people use the same StoneAI workflow for careers refreshes as for client work—no separate microsite on a subdomain that looks like an afterthought.",
    ),
    h3("retainer-vs-project", "Positioning Retainers vs One-Off Projects"),
    p(
      "Agencies stuck in project-only mode chase revenue every quarter. Retainer positioning on your site—ongoing SEO, creative support, growth partnerships—signals stability to buyers comparing vendors. Dedicated retainer pages explain scope, reporting cadence, and typical engagement length. Prospects self-select into the model that fits, reducing mismatched discovery calls.",
    ),
    p(
      "The agencies winning retainers in 2026 pair outbound with inbound authority. Your site is the hub: case studies for sales, service pages for SEO, careers for hiring, and blog posts that prove you understand client industries deeply.",
    ),
    link("best-landing-page-builders", "Best landing page builders for agency lead gen"),
    h2("get-started", "Rebuild Your Agency Site This Week"),
    p(
      "Sign up for StoneAI, generate the agency template from your positioning brief, and refine in the visual editor. Publish to your domain before the next proposal goes out. A current, proof-rich site raises win rates—even when the deck stays the same.",
    ),
    p(
      "Then reuse the workflow on client projects. Your agency site is not just marketing—it is the prototype for how you deliver in 2026.",
    ),
    p(
      "Prospects notice when your own property looks dated while you pitch modernization. Closing that gap with StoneAI takes one focused day and pays back on the next proposal you send.",
    ),
    p(
      "Winning agencies treat the website as a living case study: update it when you ship a notable client launch, publish a new vertical focus page, or hire a practice lead. Stale agency sites undermine premium positioning faster than almost any other signal.",
    ),
    p(
      "Block one morning per quarter for a site refresh: new case study, updated team photo, revised service packaging. Small consistent updates beat annual redesigns that never ship because client work always wins the calendar.",
    ),
    p(
      "Your agency site is the first deliverable in every pitch. Make it one you would proudly put in a case study—because for many prospects, it is the only sample they review before the call.",
    ),
    link("stoneai-vs-lovable", "StoneAI vs Lovable for agency deliverables"),
    ctaBottom(),
  ],
};
