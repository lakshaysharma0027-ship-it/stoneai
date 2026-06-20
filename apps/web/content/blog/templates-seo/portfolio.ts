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

export const portfolioTemplate: TemplateSeoPage = {
  slug: "portfolio",
  name: "Portfolio",
  seoTitle: "AI Portfolio Website Template — Projects, Case Studies & Personal Brand | StoneAI",
  metaDescription:
    "Build a stunning portfolio website with StoneAI. Project galleries, about pages, skills sections, testimonials, and contact forms—for designers, developers, photographers, and freelancers.",
  title: "Portfolio Website Template to Showcase Work and Win Better Clients",
  subtitle:
    "Present projects, tell your story, and make hiring you the obvious next step—with a site that looks as good as your best deliverable.",
  previewGradient:
    "linear-gradient(135deg, #0c0a09 0%, #44403c 40%, #fafaf9 100%)",
  features: [
    {
      title: "Project gallery grids",
      description:
        "Filterable or categorized layouts for case studies, photography series, design systems, and code projects.",
    },
    {
      title: "Case study deep dives",
      description:
        "Role, tools, process, and outcome sections that explain your thinking—not just screenshots in a grid.",
    },
    {
      title: "About and skills",
      description:
        "Bio, expertise tags, availability status, and download links for résumé or media kit.",
    },
    {
      title: "Contact and booking",
      description:
        "Inquiry forms, Calendly embeds, and email CTAs placed after proof so serious clients know how to reach you.",
    },
  ],
  useCases: [
    "UX and product designers",
    "Photographers and videographers",
    "Freelance developers",
    "Illustrators and artists",
    "Copywriters and content strategists",
    "Creative directors consulting independently",
  ],
  faq: [
    {
      question: "Can I build a personal portfolio with StoneAI?",
      answer:
        "Yes. Describe your discipline, style, target clients, and featured projects in a prompt. StoneAI generates a portfolio site with work index, project detail pages, about, and contact sections. Replace placeholders with your real work in the visual editor.",
    },
    {
      question: "How many projects should I include?",
      answer:
        "Quality beats quantity. Most effective portfolios highlight six to twelve strong pieces with two or three deep case studies. The template supports expanding over time—add projects as you ship without redesigning the site.",
    },
    {
      question: "Is StoneAI good for creative portfolios vs Behance or Dribbble?",
      answer:
        "Behance and Dribbble are great for discovery inside their networks. Your own domain is where you close deals—custom URL, full case study narrative, contact forms, and SEO for '[your name] designer.' StoneAI gets you live on your domain fast.",
    },
    {
      question: "Can developers showcase technical projects?",
      answer:
        "Yes. Project pages support architecture summaries, tech stack lists, GitHub links, and live demo buttons. Generate a developer-focused portfolio by describing your stack and project types in the prompt.",
    },
  ],
  relatedArticleSlugs: [
    "best-landing-page-builders",
    "stoneai-vs-framer",
    "stoneai-vs-lovable",
    "ai-website-builder-pricing-guide",
  ],
  content: [
    ctaTop(),
    p(
      "Your portfolio is not a archive—it is a sales tool. Hiring managers, startup founders, and agency producers decide in under a minute whether to email you, pass you to a colleague, or keep scrolling. A scattered Linktree, outdated PDF, or generic template site signals you do not invest in your own craft. That perception costs projects.",
    ),
    p(
      "StoneAI's portfolio website template helps creatives and freelancers launch a polished personal site in hours. Describe your discipline, aesthetic, ideal clients, and standout projects—StoneAI generates work galleries, case study pages, about and skills sections, testimonials, and contact modules tuned for independent professionals.",
    ),
    p(
      "This page explains template structure, positioning strategies by craft, and workflows to keep your portfolio current as your body of work grows.",
    ),
    h2("portfolio-purpose", "What a Great Portfolio Must Communicate"),
    p(
      "Visitors ask three questions quickly: Can this person do work at our level? Have they solved problems like ours? Are they available and easy to hire? Strong portfolios answer with curated projects, concise case study narratives, credible testimonials, and clear contact paths—not endless grids of every sketch since college.",
    ),
    p(
      "The StoneAI template enforces hierarchy. The homepage features three to six hero projects. Case studies explain context, your role, constraints, process, and outcomes. About pages humanize you without autobiography novels. Contact sections appear after proof when motivation to reach out is highest.",
    ),
    h3("curate-ruthlessly", "Curate Ruthlessly"),
    ul([
      "Lead with work that matches the clients you want next—not everything you have ever made",
      "Write case studies for process and decisions, not just final pixels",
      "Include metrics when possible: conversion lift, timeline saved, users onboarded",
      "Show range only if range is your selling point; otherwise go deep on a niche",
      "Update availability and location so buyers know you are taking projects",
    ]),
    link("stoneai-vs-framer", "StoneAI vs Framer for designer portfolios"),
    h2("template-layout", "Portfolio Template Layout"),
    h3("work-index", "Work Index and Project Cards"),
    p(
      "The work index uses responsive grids with project titles, categories, and hover states that invite clicks. Filters or tags help photographers separate weddings from editorial, or designers separate product from brand. Each card links to a detail page with full narrative—not a lightbox that dies on mobile.",
    ),
    h3("case-study-pages", "Case Study Pages"),
    p(
      "Detail templates include overview, challenge, approach, deliverables, results, and image galleries. UX designers add user flows and research snippets. Developers add architecture diagrams and stack callouts. Photographers use full-bleed sequences. Writers embed long-form samples. You adapt sections in the editor per project.",
    ),
    h3("about-contact", "About, Skills, and Contact"),
    p(
      "About pages cover background, values, collaboration style, and tools. Skills sections list Figma, React, Lightroom, or copy disciplines—whatever your buyers search for. Contact forms capture project type, budget range, and timeline so you filter serious inquiries. Optional Calendly links speed intro calls.",
    ),
    ctaMiddle(),
    h2("by-discipline", "Tailoring the Template to Your Craft"),
    p(
      "Product designers emphasize problem framing and before-after UI. Brand designers showcase identity systems across touchpoints. Photographers prioritize image performance and minimal chrome. Developers balance screenshots with repo links and technical writeups. Illustrators let work dominate with generous whitespace. StoneAI adjusts visual tone from your prompt—minimal, bold, playful, editorial.",
    ),
    ul([
      "Designers: Figma prototypes, design system pages, accessibility notes",
      "Developers: live demos, GitHub links, performance or scale highlights",
      "Photographers: client lists, print shop, licensing inquiry forms",
      "Writers: long-form samples, niche expertise, newsletter signup",
      "Multidisciplinary: tabbed or tagged index to separate service lines",
    ]),
    h2("launch-process", "Launch Your Portfolio in an Afternoon"),
    ol([
      "Select six to ten best projects; gather exports, captions, and outcome notes.",
      "Write a StoneAI prompt with name, role, style keywords, target clients, and page list.",
      "Generate the site and replace placeholder projects with real work first—structure second.",
      "Draft two deep case studies; shorten others to card plus detail lite.",
      "Add testimonials from past clients or managers—even short LinkedIn quotes help.",
      "Set contact form notifications and add calendar link if you take discovery calls.",
      "Publish on yourname.com and update email signature, LinkedIn, and résumé links.",
    ]),
    h3("keep-fresh", "Keeping the Portfolio Fresh"),
    p(
      "Stale portfolios imply stale skills. After each major project, duplicate a case study template in StoneAI, swap content, and add to the index. Retire weak older work. The site grows with your career without annual redesigns.",
    ),
    h2("full-time-vs-freelance", "Portfolios for Full-Time Roles and Freelance Clients"),
    p(
      "Job seekers need portfolios that scan quickly for recruiters—clear role titles, project scope, and outcomes in the first screen. Freelancers need contact paths and availability signals. The same StoneAI template supports both: toggle emphasis in your prompt and add or remove pricing, résumé download, and booking modules in the editor.",
    ),
    p(
      "If you are transitioning from employment to consulting, publish case studies from employment work only with approval—or anonymize client names while keeping process and results visible. A live site signals seriousness before you hand notice.",
    ),
    link("best-landing-page-builders", "Best landing page builders for freelancers"),
    h2("design-and-brand", "Your Site Is a Portfolio Piece"),
    p(
      "If you sell visual craft, the portfolio chrome must match. StoneAI provides cinematic layouts, refined typography, and optional 3D accents without weeks in Webflow. Minimalists get whitespace and grid precision. Bold personalities get motion-friendly hero treatments. The site itself demonstrates taste before visitors open project one.",
    ),
    p(
      "AI-generated placeholder imagery helps during initial launch when project exports need cropping or retouching. Replace with final assets on your timeline—the layout remains.",
    ),
    h3("seo-and-discovery", "SEO and Personal Brand"),
    p(
      "Ranking for your name is table stakes—claim your domain early. Beyond that, niche pages like 'fintech product designer' or 'Austin wedding photographer' capture intent. Blog posts or notes on process internal-link to case studies. The template's semantic structure supports long-term organic discovery alongside direct outreach.",
    ),
    h2("freelance-business", "Portfolios That Support Freelance Business Goals"),
    p(
      "Freelancers need portfolios that qualify leads. Optional rate indicators, project minimums, and 'currently booking for Q3' banners reduce mismatched inquiries. Service pages describe retainers vs one-off projects. Testimonials address reliability and communication—top concerns for remote hires.",
    ),
    h3("speaking-and-press", "Speaking, Press, and Social Proof Beyond Clients"),
    p(
      "Conference talks, podcast appearances, and press mentions belong on your about or dedicated press page. They signal industry recognition that project screenshots alone cannot convey. Link to recordings and articles; let hiring managers see you as a thought partner, not just a pair of hands.",
    ),
    h3("niche-positioning", "Niche Down to Raise Rates"),
    p(
      "Generalist portfolios attract generalist budgets. Pages titled 'Fintech product design' or 'SaaS onboarding flows' attract buyers with specific problems and higher willingness to pay. StoneAI lets you generate vertical landing pages that sit alongside your main work index—each optimized for a keyword cluster you want to own.",
    ),
    h3("collaboration-style", "Showing How You Collaborate"),
    p(
      "Hiring managers want to know how you work with product, engineering, and stakeholders—not just what you shipped. Case studies that mention workshops, critique sessions, and iteration cycles reduce perceived risk for long engagements. A short 'how I work' section on your about page complements project proof with process clarity.",
    ),
    p(
      "Your portfolio is never finished—it is the public record of your career trajectory. The StoneAI template lowers the cost of keeping that record current so you publish new work while it is still relevant, not eighteen months later when styles have moved on.",
    ),
    link("ai-website-builder-pricing-guide", "What a professional portfolio site should cost"),
    h2("start-showcasing", "Showcase Your Best Work This Weekend"),
    p(
      "Sign up for StoneAI, generate the portfolio template from your creative brief, upload projects, and publish. Send the live URL in your next proposal instead of a ZIP of PNGs. A credible personal site raises rates because buyers perceive lower risk.",
    ),
    p(
      "Whether you are landing your first freelance clients or repositioning for senior roles, the template gives you gallery architecture and case study scaffolding so you spend time making work—not fighting layout tools.",
    ),
    p(
      "Ship the portfolio update the same week you finish the project. Momentum matters—buyers hire the creative whose recent work they can see, not the one still 'updating their site.'",
    ),
    p(
      "Link your portfolio from email signature, LinkedIn featured section, proposal cover pages, and conference speaker bios. One canonical URL beats scattered Behance links that age at different speeds.",
    ),
    p(
      "Review analytics quarterly: which case studies get the most time on page, which contact paths convert. Double down on the work that attracts the clients you want next, and retire projects that pull inquiries below your target rate.",
    ),
    p(
      "The best portfolios feel intentional: fewer projects, stronger stories, and a clear point of view about the problems you solve. StoneAI gives you the structure; curation and narrative are what turn visitors into clients.",
    ),
    link("stoneai-vs-lovable", "StoneAI vs Lovable for personal sites"),
    ctaBottom(),
  ],
};
