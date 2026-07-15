import type { IndustryPage } from "@/lib/blog/types";
import { h2, h3, p, ul, ctaTop, ctaMiddle, ctaBottom, href, comparison } from "@/content/blog/blocks";

type IndustryConfig = {
  slug: string;
  name: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  metaDescription: string;
  heroDescription: string;
  templateSlug?: string;
  stats: { label: string; value: string }[];
  painPoints: string[];
  sections: string[];
  mustHaves: string[];
  relatedArticleSlugs: string[];
  relatedAlternativeSlugs: string[];
};

function buildPage(c: IndustryConfig): IndustryPage {
  const features = [
    {
      title: "AI generation from your brief",
      description: `Describe your ${c.name.toLowerCase()} business once—StoneAI structures pages, copy, and CTAs for your buyers.`,
    },
    {
      title: "Visual editing without code",
      description: "Refine headlines, galleries, and forms in a visual editor. No developer tickets for copy changes.",
    },
    {
      title: "Publish on your domain",
      description: "Go live with HTTPS, SSL, and custom domain connection from the StoneAI dashboard.",
    },
    {
      title: "Cinematic & 3D options",
      description: `Stand out in ${c.name.toLowerCase()} with depth-driven heroes when aesthetics drive conversions.`,
    },
  ];

  const faq = [
    {
      question: `Is StoneAI good for ${c.name.toLowerCase()} websites?`,
      answer: `Yes. StoneAI generates industry-appropriate layouts, copy, and conversion sections for ${c.name.toLowerCase()} businesses—from first prompt to published site.`,
    },
    {
      question: "How fast can I launch?",
      answer: "Most businesses publish a credible site within a day, including photo uploads and copy refinement.",
    },
    {
      question: "Can I use my own domain?",
      answer: "Yes. Connect your custom domain with SSL after publishing.",
    },
    {
      question: "Does StoneAI help with SEO?",
      answer: "StoneAI structures semantic headings, meta fields, and fast-loading pages—the foundation for ranking.",
    },
  ];

  return {
    slug: c.slug,
    name: c.name,
    seoTitle: c.seoTitle,
    metaDescription: c.metaDescription,
    title: c.title,
    subtitle: c.subtitle,
    heroDescription: c.heroDescription,
    templateSlug: c.templateSlug,
    stats: c.stats,
    features,
    faq,
    relatedArticleSlugs: c.relatedArticleSlugs,
    relatedAlternativeSlugs: c.relatedAlternativeSlugs,
    content: [
      ctaTop(),
      h2("why-website", `Why ${c.name.toLowerCase()} businesses need a modern website`),
      p(c.sections[0] ?? ""),
      p(c.sections[1] ?? ""),
      href("/blog/how-to-build-website-with-ai", "How to build a website with AI"),
      h2("pain-points", "Common challenges"),
      ul(c.painPoints),
      h2("what-to-include", "What your site must include"),
      ul(c.mustHaves),
      h3("conversion", "Built to convert"),
      p(c.sections[2] ?? ""),
      comparison(
        ["Factor", "StoneAI", "Traditional build"],
        [
          ["Time to launch", "Hours–days", "Weeks"],
          ["Cost", "Subscription", "$3k–$20k+"],
          ["Updates", "Visual editor", "Developer"],
          ["3D / cinematic", "Built-in", "Custom dev"],
        ],
      ),
      ctaMiddle(),
      h2("how-stoneai-helps", `How StoneAI helps ${c.name.toLowerCase()}`),
      p(c.sections[3] ?? ""),
      p(c.sections[4] ?? ""),
      href("/alternatives/3d-website-builder", "Explore 3D website builder"),
      href("/signup", "Start building free"),
      href("/pricing", "View StoneAI pricing"),
      ...(c.templateSlug
        ? [href(`/templates/${c.templateSlug}`, `View ${c.name} template`)]
        : []),
      h2("launch-checklist", "Launch checklist"),
      ul([
        "Write a one-paragraph business brief",
        "Generate your site in StoneAI",
        "Upload photos and refine copy",
        "Add testimonials and credentials",
        "Connect your custom domain",
        "Share URL on listings and social",
      ]),
      p(c.sections[5] ?? ""),
      href("/blog/best-ai-website-builders-2026", "Best AI website builders in 2026"),
      ctaBottom(),
    ],
  };
}

const configs: IndustryConfig[] = [
  {
    slug: "real-estate",
    name: "Real Estate",
    title: "AI Website Builder for Real Estate",
    subtitle: "Listings that look as premium as the properties you sell",
    seoTitle: "AI Website Builder for Real Estate Agents & Brokers (2026)",
    metaDescription:
      "Build a real estate website with StoneAI. Property showcases, lead capture, local SEO, and cinematic 3D design for agents and brokerages.",
    heroDescription:
      "Buyers judge agents online before they call. StoneAI generates listing galleries, market positioning, and inquiry flows tailored to real estate.",
    templateSlug: "real-estate",
    stats: [
      { label: "of buyers research online first", value: "97%" },
      { label: "avg. time to publish", value: "<24h" },
      { label: "more leads with owned sites", value: "2.4×" },
    ],
    painPoints: [
      "Portal profiles look identical to every competitor",
      "Agency sites cost thousands and take weeks",
      "Poor mobile experience loses mobile searchers",
      "No clear CTA for valuations or showings",
    ],
    mustHaves: [
      "Cinematic hero with market positioning",
      "Featured listings gallery",
      "Agent bio and credentials",
      "Neighborhood guides for local SEO",
      "Contact and valuation forms",
    ],
    sections: [
      "Real estate is a visual, trust-driven business. Your website is often the first proof that you operate at the level of your listings. Generic templates signal generic service—while a cinematic, well-structured site signals market authority before the first conversation.",
      "StoneAI generates agent and brokerage sites from a short brief: your market, specialty, price band, and brand tone. You get listing sections, testimonial blocks, and lead capture—not a blank page to fill for weeks.",
      "Placement matters: inquiry forms after testimonials and beside featured listings convert better than a single contact page buried in the footer. StoneAI structures these patterns by default.",
      "Luxury markets especially benefit from cinematic 3D heroes and atmospheric photography layouts. StoneAI integrates depth and motion without hiring WebGL developers.",
      "Local SEO wins when you publish neighborhood guides with genuine insight—schools, commute, lifestyle—not keyword stuffing. StoneAI gives you the page structure; you add the market knowledge AI cannot fake.",
      "Agents who own their web presence capture leads directly instead of renting attention from portals. That equity compounds every month you rank and convert on your domain.",
    ],
    relatedArticleSlugs: ["ai-website-builder-real-estate", "best-3d-website-builders"],
    relatedAlternativeSlugs: ["real-estate-website-builder"],
  },
  {
    slug: "saas",
    name: "SaaS",
    title: "AI Website Builder for SaaS",
    subtitle: "Launch pages that convert trials and demos",
    seoTitle: "AI Website Builder for SaaS Companies (2026)",
    metaDescription:
      "Generate high-converting SaaS websites with StoneAI. Product heroes, pricing tables, social proof, and PLG-ready layouts from a prompt.",
    heroDescription:
      "PLG startups live on landing page velocity. StoneAI ships credible SaaS marketing sites with pricing, FAQ, and demo CTAs in hours.",
    templateSlug: "saas",
    stats: [
      { label: "faster than agency build", value: "10×" },
      { label: "sections generated per prompt", value: "12+" },
      { label: "typical time to live URL", value: "1 day" },
    ],
    painPoints: [
      "Engineering time spent on marketing instead of product",
      "Agency retainers before product-market fit",
      "Inconsistent messaging across launch pages",
      "Slow iteration on pricing and positioning",
    ],
    mustHaves: [
      "Clear value proposition above the fold",
      "Logo bar and social proof",
      "Feature benefits (not feature lists)",
      "Pricing or trial CTA",
      "Security and integration FAQ",
    ],
    sections: [
      "SaaS buyers decide in seconds whether your product feels credible. Your marketing site is the product demo before the product demo—a sharp hero, clear ICP messaging, and frictionless trial or demo CTAs.",
      "StoneAI generates PLG-ready structures: hero, logos, features, how-it-works, pricing, FAQ, and footer CTA. Describe your category and positioning; get a coherent page—not disconnected components to assemble.",
      "Campaign velocity separates winners: spin variant pages for segments, ads, and experiments without rebuilding from scratch each time.",
      "Dark-mode enterprise aesthetics, bright PLG simplicity, or cinematic 3D product storytelling—prompt the tone and StoneAI adapts layout and copy together.",
      "Integrate product screenshots and AI-generated visuals without stock photo hunts. Nano Banana workflows create on-brand assets inside the same workspace.",
      "Ship your pricing page the same week you finalize packaging—not the quarter after you hire an agency.",
    ],
    relatedArticleSlugs: ["ai-website-builder-startups", "best-landing-page-builders"],
    relatedAlternativeSlugs: ["ai-landing-page-builder"],
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    title: "AI Website Builder for Restaurants",
    subtitle: "Fill tables with a site as memorable as your cuisine",
    seoTitle: "AI Website Builder for Restaurants & Cafés (2026)",
    metaDescription:
      "Create a restaurant website with StoneAI. Menus, reservations, atmosphere galleries, and local SEO—generated and published fast.",
    heroDescription:
      "Discovery happens on maps and social—but reservations convert on your site. StoneAI builds menu-forward, mobile-optimized restaurant websites.",
    templateSlug: "restaurant",
    stats: [
      { label: "of diners check menus online", value: "89%" },
      { label: "mobile traffic share", value: "72%" },
      { label: "faster than template setup", value: "5×" },
    ],
    painPoints: [
      "Outdated PDF menus on slow sites",
      "No owned presence beyond delivery apps",
      "Weak local SEO for 'near me' searches",
      "Reservation links buried or broken on mobile",
    ],
    mustHaves: [
      "Atmosphere and dish photography",
      "Readable menu with categories",
      "Hours, location, and map",
      "Reservation or ordering CTA",
      "Reviews and press mentions",
    ],
    sections: [
      "Guests decide where to eat before they walk in the door. Your website must communicate atmosphere, menu highlights, and how to book—in under ten seconds on a phone.",
      "StoneAI generates restaurant-specific layouts: immersive hero, menu sections, gallery grids, and prominent reservation CTAs linked to OpenTable, Resy, or your ordering stack.",
      "Owned websites build SEO equity that Instagram posts cannot. Neighborhood keywords, hours schema, and location pages help you rank for intent-driven searches.",
      "Seasonal menu changes should take minutes in a visual editor—not emails to a developer. StoneAI keeps you in control of copy and imagery.",
      "Fine dining benefits from cinematic presentation; fast casual from clarity and speed. Prompt your positioning and StoneAI matches tone to format.",
      "Pair your site with Google Business Profile for maximum local visibility—and drive bookings to URLs you control.",
    ],
    relatedArticleSlugs: ["ai-website-builder-restaurants", "how-to-launch-a-website-fast"],
    relatedAlternativeSlugs: [],
  },
  {
    slug: "agencies",
    name: "Agencies",
    title: "AI Website Builder for Agencies",
    subtitle: "Ship client sites without burning margins",
    seoTitle: "AI Website Builder for Digital Agencies (2026)",
    metaDescription:
      "Agencies use StoneAI to deliver client websites faster—case studies, service pages, cinematic design, and publishing built in.",
    heroDescription:
      "Throughput and perception define agency success. StoneAI compresses discovery-to-delivery while keeping premium visual standards.",
    templateSlug: "agency",
    stats: [
      { label: "faster first client draft", value: "8×" },
      { label: "marginal cost per site", value: "Low" },
      { label: "client revisions in-editor", value: "Same day" },
    ],
    painPoints: [
      "Developer bottlenecks on marketing sites",
      "Low-margin WordPress maintenance",
      "Inconsistent quality across producers",
      "Slow turnaround loses pitches",
    ],
    mustHaves: [
      "Case study and results sections",
      "Service page hierarchy",
      "Team and credibility signals",
      "Clear project inquiry funnel",
      "Premium visual presentation",
    ],
    sections: [
      "Your agency site is the portfolio before the portfolio. Prospects judge whether you can deliver modern craft from your own homepage—before they read a single case study.",
      "StoneAI lets agencies generate client-ready marketing sites from written briefs, refine visually in client reviews, and publish on client domains without a dev sprint per project.",
      "Margins improve when production time drops from weeks to hours. Reinvest savings into strategy, media, and campaigns—not layout grunt work.",
      "Cinematic 3D and motion differentiate pitches: show a credible site in the discovery call, not a slide deck promise.",
      "Standardize QA with repeatable section patterns while keeping each client output unique through prompts and brand inputs.",
      "Scale delivery without scaling headcount linearly—the operational goal of every growing agency.",
    ],
    relatedArticleSlugs: ["ai-website-builder-agencies", "best-agency-website-builders"],
    relatedAlternativeSlugs: ["agency-website-builder"],
  },
  {
    slug: "dentists",
    name: "Dentists",
    title: "AI Website Builder for Dentists",
    subtitle: "Trustworthy practice sites that book appointments",
    seoTitle: "AI Website Builder for Dental Practices (2026)",
    metaDescription:
      "Build a dental practice website with StoneAI. Services, team bios, insurance info, and appointment CTAs—professional and fast.",
    heroDescription:
      "Patients choose practices that feel credible online. StoneAI generates calm, professional dental sites with booking flows.",
    stats: [
      { label: "research providers online", value: "77%" },
      { label: "prefer online booking", value: "68%" },
      { label: "launch time", value: "<1 week" },
    ],
    painPoints: [
      "Outdated sites that don't reflect modern care",
      "Missing service-specific landing pages",
      "Weak mobile experience for local search",
      "No clear insurance or new patient info",
    ],
    mustHaves: [
      "Services and treatment pages",
      "Dentist credentials and team",
      "Patient testimonials",
      "Insurance and financing info",
      "Online booking CTA",
    ],
    sections: [
      "Dental patients associate website quality with clinical quality. A dated, cluttered site raises anxiety before they ever call—while a calm, clear site builds trust.",
      "StoneAI generates practice websites with service hierarchies, team bios, testimonials, and appointment CTAs structured for healthcare marketing compliance basics.",
      "Local SEO for 'dentist near me' requires fast mobile pages, clear NAP data, and service-area relevance—not generic brochure copy.",
      "New patient flows should answer insurance, hours, and first-visit expectations upfront. StoneAI places these sections where anxious visitors look first.",
      "Update seasonal promotions and new services in the visual editor without ticketing your IT vendor.",
      "Owned web presence reduces dependence on directory listings that charge per lead.",
    ],
    relatedArticleSlugs: ["ai-website-builder-dentists", "best-website-builders-for-small-businesses"],
    relatedAlternativeSlugs: [],
  },
  {
    slug: "lawyers",
    name: "Lawyers",
    title: "AI Website Builder for Law Firms",
    subtitle: "Authority-first sites that generate consultations",
    seoTitle: "AI Website Builder for Lawyers & Law Firms (2026)",
    metaDescription:
      "Create a law firm website with StoneAI. Practice area pages, attorney bios, trust signals, and consultation CTAs—SEO-ready.",
    heroDescription:
      "Legal clients hire authority. StoneAI builds structured firm sites with practice pages, credentials, and intake flows.",
    stats: [
      { label: "start search online", value: "96%" },
      { label: "value clear practice pages", value: "84%" },
      { label: "faster than traditional build", value: "6×" },
    ],
    painPoints: [
      "Generic templates that don't convey expertise",
      "Thin practice area pages hurt SEO",
      "Slow publishing for time-sensitive matters",
      "Poor mobile experience loses local intent",
    ],
    mustHaves: [
      "Practice area landing pages",
      "Attorney profiles and bar admissions",
      "Case results and testimonials (where permitted)",
      "Consultation request forms",
      "FAQ addressing cost and process",
    ],
    sections: [
      "Legal services are sold on trust and specificity. Clients search for practice-area expertise—personal injury, family law, immigration—not a one-page firm brochure.",
      "StoneAI generates multi-page firm structures with dedicated practice area content, attorney bios, and consultation CTAs aligned to how legal buyers research.",
      "Ethical marketing still demands accuracy. Use StoneAI for structure and draft copy, then have counsel review before publishing—faster than briefing an agency from zero.",
      "Local SEO for attorneys competes on depth: substantive practice pages outperform thin doorway pages every time.",
      "Mobile-first design matters when urgent searches happen on phones. StoneAI outputs responsive layouts by default.",
      "Your website should work as intake infrastructure—not a static PDF replacement from 2012.",
    ],
    relatedArticleSlugs: ["best-ai-website-builder-for-lawyers", "cost-of-building-a-website-in-2026"],
    relatedAlternativeSlugs: [],
  },
  {
    slug: "consultants",
    name: "Consultants",
    title: "AI Website Builder for Consultants",
    subtitle: "Position expertise and capture high-value leads",
    seoTitle: "AI Website Builder for Consultants (2026)",
    metaDescription:
      "Build a consulting website with StoneAI. Offer positioning, case studies, methodology sections, and booking CTAs for independent experts.",
    heroDescription:
      "Consulting is sold on clarity and proof. StoneAI turns your expertise narrative into a credible, conversion-focused site.",
    stats: [
      { label: "check consultants online", value: "91%" },
      { label: "decision influenced by site", value: "75%" },
      { label: "time to credible launch", value: "Hours" },
    ],
    painPoints: [
      "LinkedIn alone doesn't close enterprise deals",
      "Vague positioning loses premium clients",
      "No structured case study presentation",
      "Scheduling friction on outdated sites",
    ],
    mustHaves: [
      "Sharp positioning statement",
      "Services and outcomes",
      "Case studies or client logos",
      "About and credentials",
      "Discovery call CTA",
    ],
    sections: [
      "Independent consultants compete with boutiques and platforms. Your website must articulate a specific transformation for a specific buyer—generic 'business consulting' copy converts nobody.",
      "StoneAI helps you crystallize offer, audience, and proof into structured pages: hero positioning, methodology, results, and a single clear CTA for discovery calls.",
      "Case studies don't need dozens—two deep stories outperform ten vague logos. StoneAI provides the layout; you supply the outcomes.",
      "Premium consulting brands benefit from restrained, cinematic design—not cluttered WordPress themes from 2018.",
      "Publish thought leadership on your domain to compound SEO while social posts decay in hours.",
      "Speed to market matters when you leave a firm and need leads next month, not next quarter.",
    ],
    relatedArticleSlugs: ["best-ai-website-builder-for-consultants", "ai-website-builder-vs-web-designer"],
    relatedAlternativeSlugs: [],
  },
  {
    slug: "startups",
    name: "Startups",
    title: "AI Website Builder for Startups",
    subtitle: "Launch before your competitor ships",
    seoTitle: "AI Website Builder for Startups (2026)",
    metaDescription:
      "Startup websites built with StoneAI—waitlist pages, product launches, investor-ready positioning, and fast publishing.",
    heroDescription:
      "Startups don't have six weeks for an agency. StoneAI ships credible launch pages the day you finalize positioning.",
    templateSlug: "saas",
    stats: [
      { label: "delay cost per week", value: "High" },
      { label: "typical launch time", value: "<48h" },
      { label: "pages per campaign", value: "Unlimited" },
    ],
    painPoints: [
      "Engineers building marketing pages",
      "Investor demos without a live URL",
      "Rebrands that stall on design",
      "Ad spend pointing to weak pages",
    ],
    mustHaves: [
      "Clear problem/solution framing",
      "Product visuals or mockups",
      "Waitlist or signup CTA",
      "Social proof if available",
      "FAQ for early objections",
    ],
    sections: [
      "Startups win by speed of learning—and your website is the hub for experiments. Ads, investor intros, and launch posts all need a credible destination.",
      "StoneAI lets founders ship positioning pages without pulling engineering off the product. Prompt your ICP and value prop; publish the same day.",
      "Pre-launch waitlists, post-launch pricing, and pivot rebrands all happen faster when marketing isn't blocked on design resources.",
      "Investor conversations go better with a live product story—not a Figma link that breaks on mobile.",
      "Generate variant pages for segments and campaigns to test messaging before you scale spend.",
      "Own your domain and SEO early—even pre-revenue—so traction compounds on assets you control.",
    ],
    relatedArticleSlugs: ["ai-website-builder-startups", "best-startup-website-examples"],
    relatedAlternativeSlugs: ["ai-landing-page-builder"],
  },
  {
    slug: "fitness",
    name: "Fitness",
    title: "AI Website Builder for Fitness",
    subtitle: "Gyms, trainers, and studios that convert online",
    seoTitle: "AI Website Builder for Fitness Businesses (2026)",
    metaDescription:
      "Build fitness websites with StoneAI. Class schedules, trainer bios, membership CTAs, and bold brand design for gyms and studios.",
    heroDescription:
      "Members join brands that motivate online before they step in the door. StoneAI builds high-energy fitness sites with booking CTAs.",
    stats: [
      { label: "check gyms online first", value: "82%" },
      { label: "mobile booking preference", value: "70%" },
      { label: "faster launch", value: "5×" },
    ],
    painPoints: [
      "Instagram-only presence limits SEO",
      "Schedule PDFs instead of live booking",
      "Weak differentiation in crowded markets",
      "Outdated class info loses signups",
    ],
    mustHaves: [
      "Bold brand hero",
      "Programs and class types",
      "Trainer credentials",
      "Pricing or trial offer",
      "Location and schedule CTA",
    ],
    sections: [
      "Fitness buyers purchase transformation and energy. Your site must feel as intense and credible as your floor—static templates rarely do.",
      "StoneAI generates bold, mobile-first layouts with program breakdowns, trainer bios, and trial CTAs tuned for local conversion.",
      "Studios competing on boutique experience need design that signals community—not corporate gym stock photos.",
      "Integrate booking platforms with prominent CTAs above the fold on mobile.",
      "Local SEO for 'gym near me' and 'personal trainer [city]' requires substantive location and service content.",
      "Update challenges, seasons, and pricing tiers instantly when promotions change.",
    ],
    relatedArticleSlugs: ["best-ai-website-builder-for-fitness", "how-to-launch-a-website-fast"],
    relatedAlternativeSlugs: [],
  },
  {
    slug: "coaches",
    name: "Coaches",
    title: "AI Website Builder for Coaches",
    subtitle: "Life, executive, and business coaches online",
    seoTitle: "AI Website Builder for Coaches (2026)",
    metaDescription:
      "Coaching websites with StoneAI. Offer clarity, testimonials, program pages, and discovery call booking—professional and personal.",
    heroDescription:
      "Coaching is intimate and high-trust. StoneAI builds warm, credible sites that explain your method and invite the right clients.",
    stats: [
      { label: "research coaches online", value: "88%" },
      { label: "want clear program info", value: "79%" },
      { label: "launch in under", value: "1 day" },
    ],
    painPoints: [
      "Vague 'transform your life' copy",
      "No structured program presentation",
      "Calendly link lost on ugly pages",
      "Testimonials buried or missing",
    ],
    mustHaves: [
      "Who you help and how",
      "Programs and outcomes",
      "Client stories",
      "About your credentials",
      "Book a call CTA",
    ],
    sections: [
      "Coaches sell transformation stories and methodology. Visitors need to see themselves in your copy within seconds—or they bounce to the next Instagram ad.",
      "StoneAI structures offer pages, program tiers, testimonials, and discovery CTAs so you spend time coaching, not wrestling with Squarespace.",
      "Executive coaches need restrained premium design; wellness coaches need warmth and accessibility. Prompt the tone; StoneAI adapts.",
      "SEO for coaching niches—leadership, health, career—rewards specific landing pages over generic homepages.",
      "Email list and site work together: your domain is the owned hub for nurture sequences.",
      "Launch a credible presence before your next cohort enrollment window—not after.",
    ],
    relatedArticleSlugs: ["best-ai-website-builder-for-coaches", "website-design-trends-2026"],
    relatedAlternativeSlugs: [],
  },
  {
    slug: "portfolio",
    name: "Portfolio",
    title: "AI Website Builder for Portfolios",
    subtitle: "Showcase work that wins the next client",
    seoTitle: "AI Website Builder for Portfolio Websites (2026)",
    metaDescription:
      "Portfolio websites built with StoneAI. Project galleries, case studies, and cinematic presentation for creatives and professionals.",
    heroDescription:
      "Your portfolio is your sales team. StoneAI frames your work with gallery layouts and case study depth—not generic templates.",
    templateSlug: "portfolio",
    stats: [
      { label: "hire after viewing portfolio", value: "65%" },
      { label: "bounce if slow/confusing", value: "53%" },
      { label: "faster than custom build", value: "10×" },
    ],
    painPoints: [
      "Behance/Dribbble don't close deals alone",
      "Template sameness across creatives",
      "Case studies without structure",
      "Contact friction",
    ],
    mustHaves: [
      "Positioning hero",
      "Curated project grid",
      "2–3 deep case studies",
      "Skills and tools",
      "Contact CTA",
    ],
    sections: [
      "Creatives are judged by presentation as much as output. A weak portfolio site undermines strong work—the frame matters.",
      "StoneAI generates gallery-forward layouts with case study scaffolding: challenge, approach, outcome. You supply the projects.",
      "Cinematic 3D options help motion, 3D, and brand designers signal taste immediately.",
      "Recruiters and clients skim on mobile. StoneAI keeps navigation simple and loads fast.",
      "SEO for '[discipline] portfolio' and '[city] designer' starts with an owned domain and indexable project pages.",
      "Update your site when you ship new work—minutes in the editor, not a weekend rebuild.",
    ],
    relatedArticleSlugs: ["best-portfolio-website-builders", "best-ai-website-builder-for-photographers"],
    relatedAlternativeSlugs: ["portfolio-website-builder"],
  },
  {
    slug: "architects",
    name: "Architects",
    title: "AI Website Builder for Architects",
    subtitle: "Spatial portfolios that win commissions",
    seoTitle: "AI Website Builder for Architects & Studios (2026)",
    metaDescription:
      "Architect websites with StoneAI. Project galleries, studio philosophy, cinematic 3D presentation, and inquiry flows for design firms.",
    heroDescription:
      "Architecture is visual and intellectual. StoneAI builds spatial, cinematic sites that reflect design rigor.",
    stats: [
      { label: "clients review firms online", value: "94%" },
      { label: "value project depth", value: "81%" },
      { label: "publish time", value: "Days" },
    ],
    painPoints: [
      "PDF portfolios feel dated",
      "Slow agency timelines",
      "Weak mobile project viewing",
      "No structured inquiry funnel",
    ],
    mustHaves: [
      "Hero project feature",
      "Project grid with filters",
      "Studio philosophy",
      "Awards and press",
      "Commission inquiry CTA",
    ],
    sections: [
      "Architecture firms sell spatial intelligence and taste. Your website should feel designed—not templated—with photography-forward project presentation.",
      "StoneAI supports cinematic heroes and gallery grids suited to built work, competitions, and interiors.",
      "Each project page benefits from context: site, program, materials, year—not just images.",
      "3D and motion reinforce firms pushing digital craft—without custom WebGL budgets on every refresh.",
      "International studios need fast, multilingual-ready structure; local firms need neighborhood and typology SEO.",
      "Inquiry forms should qualify budget and scope early—StoneAI places structured CTAs after proof.",
    ],
    relatedArticleSlugs: ["best-ai-website-builder-for-architects", "future-of-3d-websites"],
    relatedAlternativeSlugs: ["3d-website-builder"],
  },
  {
    slug: "photographers",
    name: "Photographers",
    title: "AI Website Builder for Photographers",
    subtitle: "Image-forward sites that book shoots",
    seoTitle: "AI Website Builder for Photographers (2026)",
    metaDescription:
      "Photography portfolio websites with StoneAI. Full-bleed galleries, package pages, and booking CTAs for wedding, commercial, and portrait photographers.",
    heroDescription:
      "Photography sites must let images breathe. StoneAI builds minimal, fast galleries with clear booking paths.",
    templateSlug: "portfolio",
    stats: [
      { label: "book via website inquiry", value: "58%" },
      { label: "need mobile-optimized galleries", value: "90%" },
      { label: "launch speed", value: "Same week" },
    ],
    painPoints: [
      "Slow image-heavy WordPress themes",
      "Packages unclear on homepage",
      "Instagram algorithm risk",
      "No SEO for local shoots",
    ],
    mustHaves: [
      "Full-bleed gallery",
      "Package or service pages",
      "About and working style",
      "Testimonials",
      "Inquiry form",
    ],
    sections: [
      "Photographers live and die by the first screen of images. StoneAI prioritizes gallery performance and minimal chrome so work dominates.",
      "Package clarity converts browsers: wedding tiers, commercial day rates, or portrait sessions should be one click deep—not hidden.",
      "Local SEO for 'wedding photographer [city]' requires indexable text alongside images—alt text, location pages, and service copy.",
      "StoneAI's image workflows help generate supporting visuals and hero loops—not just display uploads.",
      "Owned sites protect you from platform algorithm shifts that throttle reach overnight.",
      "Update galleries after each season's shoots without rebuilding the entire site.",
    ],
    relatedArticleSlugs: ["best-ai-website-builder-for-photographers", "best-interactive-website-examples"],
    relatedAlternativeSlugs: [],
  },
  {
    slug: "marketing-agencies",
    name: "Marketing Agencies",
    title: "AI Website Builder for Marketing Agencies",
    subtitle: "Performance brands need performance sites",
    seoTitle: "AI Website Builder for Marketing Agencies (2026)",
    metaDescription:
      "Marketing agency websites with StoneAI. Case studies, service lines, results metrics, and fast publishing for growth agencies.",
    heroDescription:
      "You sell growth—you need a site that proves it. StoneAI ships agency sites with proof-led structure and bold design.",
    templateSlug: "agency",
    stats: [
      { label: "RFPs check agency site", value: "86%" },
      { label: "faster client page delivery", value: "8×" },
      { label: "in-editor client revisions", value: "Yes" },
    ],
    painPoints: [
      "Irony of outdated agency sites",
      "Case studies without metrics",
      "Dev queue for campaign landers",
      "Inconsistent pitch materials",
    ],
    mustHaves: [
      "Results-led case studies",
      "Service line pages",
      "Client logos",
      "Team and culture",
      "Pitch / contact CTA",
    ],
    sections: [
      "Marketing agencies are judged harshly on their own web presence—prospects assume your client work looks like your site.",
      "StoneAI helps agencies ship proof-first layouts: metrics, client logos, methodology, and vertical-specific case studies.",
      "Campaign landing pages should not wait in a dev queue. Generate, test, publish—same week as the media buy.",
      "Bold motion and 3D signal innovation-forward shops without six-week motion sprints.",
      "SEO for 'performance marketing agency' and niche verticals needs substantive service pages, not one generic homepage.",
      "Use StoneAI for your agency site and client deliverables—the same workflow, better margins.",
    ],
    relatedArticleSlugs: ["ai-website-builder-agencies", "best-agency-website-builders"],
    relatedAlternativeSlugs: ["agency-website-builder"],
  },
  {
    slug: "interior-designers",
    name: "Interior Designers",
    title: "AI Website Builder for Interior Designers",
    subtitle: "Rooms deserve rooms on the web",
    seoTitle: "AI Website Builder for Interior Designers (2026)",
    metaDescription:
      "Interior design portfolio websites with StoneAI. Project galleries, process pages, and cinematic presentation for design studios.",
    heroDescription:
      "Interior design is tactile and visual. StoneAI builds atmospheric portfolios that feel as considered as your spaces.",
    stats: [
      { label: "clients browse portfolios first", value: "92%" },
      { label: "prefer large imagery", value: "87%" },
      { label: "time to publish", value: "<1 week" },
    ],
    painPoints: [
      "Templates that crop photography badly",
      "No process/story for high-ticket sales",
      "Slow updates for new projects",
      "Weak inquiry qualification",
    ],
    mustHaves: [
      "Full-width project photography",
      "Process and services",
      "Press and awards",
      "Testimonials",
      "Consultation request CTA",
    ],
    sections: [
      "High-ticket interior clients buy vision and process—not just pretty pictures. Your site must narrate how you think, source, and deliver.",
      "StoneAI creates photography-dominant layouts with project storytelling sections: brief, concept, materials, reveal.",
      "Atmospheric heroes and subtle motion mirror the sensory experience of your work.",
      "SEO for 'interior designer [city]' rewards localized project pages and substantive service copy.",
      "Press logos and awards belong above the fold for luxury positioning.",
      "Qualify inquiries with structured forms—budget range, timeline, scope—before the first call.",
    ],
    relatedArticleSlugs: ["best-ai-website-builder-for-interior-designers", "website-design-trends-2026"],
    relatedAlternativeSlugs: [],
  },
  {
    slug: "ecommerce",
    name: "Ecommerce",
    title: "AI Website Builder for Ecommerce Brands",
    subtitle: "Brand sites that drive Shopify and DTC growth",
    seoTitle: "AI Website Builder for Ecommerce & DTC Brands (2026)",
    metaDescription:
      "Ecommerce brand websites with StoneAI. Story-driven landers, product launches, and cinematic DTC pages that complement your store.",
    heroDescription:
      "DTC brands need story beyond product grids. StoneAI builds launch pages and brand worlds that convert cold traffic.",
    stats: [
      { label: "brand story lifts conversion", value: "23%" },
      { label: "campaign page speed", value: "Hours" },
      { label: "3D product hero option", value: "Yes" },
    ],
    painPoints: [
      "Shopify themes look generic",
      "Slow agency for campaign landers",
      "Weak storytelling for premium SKUs",
      "Ad traffic to thin product pages",
    ],
    mustHaves: [
      "Brand story hero",
      "Featured collections or products",
      "Social proof and UGC",
      "FAQ and policies summary",
      "Shop now CTA to store",
    ],
    sections: [
      "Ecommerce platforms optimize transactions; brand sites optimize desire. Cold traffic from ads often needs a narrative landing page before the cart.",
      "StoneAI generates DTC storytelling pages—founder story, materials, social proof—with CTAs into Shopify or checkout flows.",
      "Product launches and collaborations need unique pages weekly. AI generation beats waiting on design retainers.",
      "3D product heroes and cinematic loops increase dwell time for premium categories—watches, furniture, beauty.",
      "SEO for brand terms and collection keywords starts with owned content outside marketplace listings.",
      "Iterate campaign pages as fast as you iterate ad creative.",
    ],
    relatedArticleSlugs: ["best-ai-website-builder-for-ecommerce", "how-ai-is-changing-website-design"],
    relatedAlternativeSlugs: [],
  },
  {
    slug: "freelancers",
    name: "Freelancers",
    title: "AI Website Builder for Freelancers",
    subtitle: "Win clients with a site that sells your craft",
    seoTitle: "AI Website Builder for Freelancers (2026)",
    metaDescription:
      "Freelancer websites with StoneAI. Portfolio pages, service offers, testimonials, and booking CTAs—launch in hours, not weeks.",
    heroDescription:
      "Freelancers compete on trust and presentation. StoneAI builds credible personal brand sites that turn profile visitors into paying clients.",
    templateSlug: "portfolio",
    stats: [
      { label: "clients check your site first", value: "72%" },
      { label: "faster than DIY templates", value: "8×" },
      { label: "launch in under", value: "1 day" },
    ],
    painPoints: [
      "LinkedIn alone does not close deals",
      "Generic portfolio templates look identical",
      "No time to learn Webflow or Framer",
      "Rates and services buried or unclear",
    ],
    mustHaves: [
      "Clear positioning headline",
      "Services and packages",
      "Project or client proof",
      "About and credentials",
      "Book or contact CTA",
    ],
    sections: [
      "Freelancers sell expertise through presentation. A weak site sends high-budget clients to competitors with sharper personal brands—even when your work is better.",
      "StoneAI generates freelancer sites with service pages, case highlights, testimonials, and discovery CTAs. Prompt your niche—copywriter, developer, designer—and get structure tuned to how buyers evaluate freelancers.",
      "Portfolio galleries and case study sections prove outcomes, not just aesthetics. StoneAI scaffolds challenge, approach, and results so prospects understand your value fast.",
      "SEO for '[skill] freelancer' and '[city] [service]' starts with an owned domain and indexable service pages—not a link-in-bio page alone.",
      "Update offers, rates, and availability without developer help. Launch before your next outreach campaign, not after losing a lead who could not find your work.",
      "Integrated AI images help you ship polished visuals when you do not have a brand shoot budget yet.",
    ],
    relatedArticleSlugs: ["best-portfolio-website-builders", "how-to-launch-a-website-fast"],
    relatedAlternativeSlugs: ["portfolio-website-builder"],
  },
  {
    slug: "nonprofits",
    name: "Nonprofits",
    title: "AI Website Builder for Nonprofits",
    subtitle: "Mission-driven sites that inspire action",
    seoTitle: "AI Website Builder for Nonprofits & Charities (2026)",
    metaDescription:
      "Nonprofit websites with StoneAI. Tell your mission, showcase impact, accept donations, and recruit volunteers—fast, credible, and easy to maintain.",
    heroDescription:
      "Nonprofits need clarity, trust, and calls to action. StoneAI builds mission-first sites that convert visitors into donors and volunteers.",
    stats: [
      { label: "donors research online first", value: "67%" },
      { label: "trust rises with clear impact", value: "54%" },
      { label: "launch in under", value: "1 day" },
    ],
    painPoints: [
      "Outdated sites hurt credibility",
      "Volunteer-run teams lack design skills",
      "Donation flows hard to find",
      "Impact stories not visible",
    ],
    mustHaves: [
      "Mission and vision hero",
      "Programs and impact metrics",
      "Donate and volunteer CTAs",
      "Stories and testimonials",
      "Contact and transparency info",
    ],
    sections: [
      "Donors and grantmakers evaluate legitimacy in seconds. A dated or confusing website signals disorganization—even when your programs deliver real impact.",
      "StoneAI helps small nonprofit teams launch credible sites with mission copy, program pages, impact stats, and prominent donate or volunteer CTAs—without agency retainers.",
      "Storytelling sections surface beneficiary outcomes, volunteer voices, and annual highlights. Structure matters: visitors should feel the mission before they see the ask.",
      "SEO for '[cause] nonprofit [region]' and program-specific keywords helps you reach supporters searching for ways to help locally.",
      "Update campaigns, events, and fundraising drives quickly when news cycles move fast. Your site should keep pace with your mission, not lag six months behind.",
      "Accessibility and clear navigation help diverse audiences—donors, volunteers, partners—find the right next step on any device.",
    ],
    relatedArticleSlugs: ["best-website-builders-for-small-businesses", "how-to-launch-a-website-fast"],
    relatedAlternativeSlugs: [],
  },
];

export const industryPages: IndustryPage[] = configs.map(buildPage);
