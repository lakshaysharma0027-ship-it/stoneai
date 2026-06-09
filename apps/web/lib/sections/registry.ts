import type { SectionRegistryEntry } from "./types";

const baseStyles: SectionRegistryEntry["defaultStyles"] = {
  spacing: {
    paddingTop: "80px",
    paddingRight: "24px",
    paddingBottom: "80px",
    paddingLeft: "24px",
    gap: "24px",
  },
  background: { color: "#ffffff" },
  typography: { color: "#111827", textAlign: "center" },
};

export const sectionRegistry = [
  {
    id: "section-navbar",
    type: "navbar",
    defaultContent: {
      logo: "StoneAI Site",
    },
    defaultStyles: {
      ...baseStyles,
      spacing: { ...baseStyles.spacing, paddingTop: "24px", paddingBottom: "24px" },
    },
  },
  {
    id: "section-hero",
    type: "hero",
    defaultContent: {
      heading: "Launch a sharper website in minutes",
      body: "A focused landing page generated from your business idea.",
      buttonLabel: "Get started",
    },
    defaultStyles: baseStyles,
  },
  {
    id: "section-features",
    type: "features",
    defaultContent: {
      heading: "Built for momentum",
      features: [
        { id: "feature-1", title: "Clear positioning", description: "Turn the core offer into an easy story." },
        { id: "feature-2", title: "Conversion sections", description: "Guide visitors from promise to action." },
        { id: "feature-3", title: "Editable structure", description: "Keep every generated block ready for refinement." },
      ],
    },
    defaultStyles: baseStyles,
  },
  {
    id: "section-pricing",
    type: "pricing",
    defaultContent: {
      heading: "Simple plans",
      pricing: [
        { id: "plan-starter", name: "Starter", price: 19, description: "For early launches.", features: ["Core site", "Editable sections", "Basic support"] },
        { id: "plan-growth", name: "Growth", price: 49, description: "For growing teams.", features: ["Full site", "Priority edits", "Launch support"], highlighted: true },
      ],
    },
    defaultStyles: baseStyles,
  },
  {
    id: "section-faq",
    type: "faq",
    defaultContent: {
      heading: "Common questions",
      faqs: [
        { id: "faq-1", question: "Can I edit this site?", answer: "Yes. The generated schema opens in the StoneAI editor." },
        { id: "faq-2", question: "Is AI connected yet?", answer: "Not yet. This foundation uses rules-based generation." },
      ],
    },
    defaultStyles: baseStyles,
  },
  {
    id: "section-testimonials",
    type: "testimonials",
    defaultContent: {
      heading: "Trusted by early customers",
      testimonials: [
        { id: "testimonial-1", quote: "The message clicked immediately.", author: "Alex Morgan", role: "Founder" },
        { id: "testimonial-2", quote: "We had a launch-ready structure in one pass.", author: "Priya Shah", role: "Growth Lead" },
      ],
    },
    defaultStyles: baseStyles,
  },
  {
    id: "section-footer",
    type: "footer",
    defaultContent: {
      logo: "StoneAI Site",
      footerLegal: "(c) StoneAI generated site. All rights reserved.",
    },
    defaultStyles: {
      ...baseStyles,
      spacing: { ...baseStyles.spacing, paddingTop: "48px", paddingBottom: "48px" },
    },
  },
  {
    id: "section-cta",
    type: "cta",
    defaultContent: {
      heading: "Ready to move faster?",
      body: "Turn the next idea into a polished website draft.",
      buttonLabel: "Start now",
    },
    defaultStyles: baseStyles,
  },
  {
    id: "section-contact",
    type: "contact",
    defaultContent: {
      heading: "Start a conversation",
      submitLabel: "Send message",
    },
    defaultStyles: baseStyles,
  },
  {
    id: "section-gallery",
    type: "gallery",
    defaultContent: {
      heading: "A look at the experience",
      gallery: [
        { id: "gallery-1", src: "/templates/saascandy.jpg", alt: "Generated website preview" },
        { id: "gallery-2", src: "/templates/pixelize.jpg", alt: "Generated section preview" },
      ],
    },
    defaultStyles: baseStyles,
  },
  {
    id: "section-stats",
    type: "stats",
    defaultContent: {
      heading: "Designed for measurable traction",
      features: [
        { id: "stat-1", title: "3x", description: "Faster first draft" },
        { id: "stat-2", title: "12", description: "Reusable section types" },
        { id: "stat-3", title: "1", description: "Schema-driven editor" },
      ],
    },
    defaultStyles: baseStyles,
  },
  {
    id: "section-logos",
    type: "logos",
    defaultContent: {
      heading: "Built for modern teams",
      features: [
        { id: "logo-1", title: "Northstar", description: "Launch partner" },
        { id: "logo-2", title: "Foundry", description: "Studio partner" },
        { id: "logo-3", title: "Vertex", description: "Growth partner" },
        { id: "logo-4", title: "Orbit", description: "Product partner" },
      ],
    },
    defaultStyles: baseStyles,
  },
] as const satisfies SectionRegistryEntry[];

export const getSectionDefinition = (type: SectionRegistryEntry["type"]) =>
  sectionRegistry.find((section) => section.type === type) ?? null;
