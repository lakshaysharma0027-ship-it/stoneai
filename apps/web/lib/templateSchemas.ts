import type { SectionType } from "./editor/schema";
import type { TemplateId } from "./templates";

type TemplateFeature = {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
};

export type TemplateSectionSchema = {
  id: string;
  type: SectionType;
  content?: {
    heading?: string;
    body?: string;
    buttonLabel?: string;
    logo?: string;
    logoImage?: string;
    image?: string;
    backgroundImage?: string;
    video?: string;
    gallery?: Array<{ id: string; src: string; alt: string }>;
    features?: TemplateFeature[];
    pricing?: Array<{
      id: string;
      name: string;
      price: number;
      description: string;
      features: string[];
      highlighted?: boolean;
    }>;
    testimonials?: Array<{
      id: string;
      quote: string;
      author: string;
      role?: string;
    }>;
    faqs?: Array<{ id: string; question: string; answer: string }>;
    footerLegal?: string;
    submitLabel?: string;
  };
};

export type TemplateSchema = {
  id: TemplateId;
  sections: TemplateSectionSchema[];
};

export const templateSchemas = [
  {
    id: "saascandy",
    sections: [
      {
        id: "hero-1",
        type: "hero",
        content: {
          heading: "Scale your SaaS with a site built to convert",
          body: "SaaSCandy gives product teams a polished landing page for features, pricing, FAQs, and launch-ready positioning.",
          buttonLabel: "Start free",
          image: "/template-assets/saascandy/hero.png",
          backgroundImage: "/template-assets/saascandy/hero-background.svg",
        },
      },
      {
        id: "features-1",
        type: "features",
        content: {
          heading: "Everything a growing product needs",
          features: [
            {
              id: "saas-feature-1",
              title: "Fast onboarding",
              description: "Guide new users from signup to value with focused sections.",
              imageSrc: "/template-assets/saascandy/feature-1.svg",
            },
            {
              id: "saas-feature-2",
              title: "Conversion blocks",
              description: "Showcase benefits, proof, and pricing without extra setup.",
              imageSrc: "/template-assets/saascandy/feature-2.webp",
            },
            {
              id: "saas-feature-3",
              title: "Clean editing",
              description: "Keep copy and layout structured for quick iteration.",
              imageSrc: "/template-assets/saascandy/feature-3.webp",
            },
          ],
        },
      },
      {
        id: "pricing-1",
        type: "pricing",
        content: {
          heading: "Simple plans for every stage",
          pricing: [
            {
              id: "saas-plan-starter",
              name: "Starter",
              price: 19,
              description: "For validating a new product.",
              features: ["One website", "Template sections", "Basic support"],
            },
            {
              id: "saas-plan-growth",
              name: "Growth",
              price: 49,
              description: "For teams scaling acquisition.",
              features: ["Unlimited edits", "AI revisions", "Priority support"],
              highlighted: true,
            },
          ],
        },
      },
      {
        id: "faq-1",
        type: "faq",
        content: {
          heading: "Questions before launch",
          faqs: [
            {
              id: "saas-faq-1",
              question: "Can I edit every section?",
              answer: "Yes. Text, structure, and section order stay editable inside StoneAI.",
            },
            {
              id: "saas-faq-2",
              question: "Is this ready for a SaaS launch?",
              answer: "The template includes the core landing-page sections SaaS teams typically need.",
            },
          ],
        },
      },
      {
        id: "footer-1",
        type: "footer",
        content: {
          logo: "SaaSCandy",
          logoImage: "/template-assets/saascandy/logo.svg",
          footerLegal: "(c) SaaSCandy. All rights reserved.",
        },
      },
    ],
  },
  {
    id: "pixelize",
    sections: [
      {
        id: "hero-1",
        type: "hero",
        content: {
          heading: "Design work that makes digital brands feel alive",
          body: "Pixelize is a sharp agency template for services, case studies, testimonials, and conversion-focused proposals.",
          buttonLabel: "View work",
          image: "/template-assets/pixelize/hero.webp",
          backgroundImage: "/template-assets/pixelize/hero-background.svg",
        },
      },
      {
        id: "features-1",
        type: "features",
        content: {
          heading: "Creative services with measurable outcomes",
          features: [
            {
              id: "pixel-feature-1",
              title: "Brand systems",
              description: "Build a visual language that carries across every touchpoint.",
              imageSrc: "/template-assets/pixelize/feature-1.svg",
            },
            {
              id: "pixel-feature-2",
              title: "Web experiences",
              description: "Turn campaigns and services into fast, polished pages.",
              imageSrc: "/template-assets/pixelize/feature-2.svg",
            },
            {
              id: "pixel-feature-3",
              title: "Launch support",
              description: "Move from concept to published site with a clear workflow.",
              imageSrc: "/template-assets/pixelize/feature-3.svg",
            },
          ],
        },
      },
      {
        id: "testimonials-1",
        type: "testimonials",
        content: {
          heading: "Trusted by ambitious creative teams",
          testimonials: [
            {
              id: "pixel-testimonial-1",
              quote: "Pixelize helped us turn scattered ideas into a site clients understand instantly.",
              author: "Maya Chen",
              role: "Studio Founder",
            },
            {
              id: "pixel-testimonial-2",
              quote: "The structure made our services feel premium without slowing the launch.",
              author: "Jon Bell",
              role: "Growth Lead",
            },
          ],
        },
      },
      {
        id: "pricing-1",
        type: "pricing",
        content: {
          heading: "Packages for every creative brief",
          pricing: [
            {
              id: "pixel-plan-1",
              name: "Sprint",
              price: 1200,
              description: "A focused landing page package.",
              features: ["Creative direction", "Responsive layout", "Launch handoff"],
            },
            {
              id: "pixel-plan-2",
              name: "Studio",
              price: 3200,
              description: "A broader brand and website system.",
              features: ["Brand kit", "Multi-section site", "Priority collaboration"],
              highlighted: true,
            },
          ],
        },
      },
      {
        id: "contact-1",
        type: "contact",
        content: {
          heading: "Tell us about your next launch",
          submitLabel: "Send brief",
        },
      },
      {
        id: "footer-1",
        type: "footer",
        content: {
          logo: "Pixelize",
          logoImage: "/template-assets/pixelize/logo.svg",
          footerLegal: "(c) Pixelize Studio. All rights reserved.",
        },
      },
    ],
  },
  {
    id: "crypto",
    sections: [
      {
        id: "hero-1",
        type: "hero",
        content: {
          heading: "A modern homepage for crypto products",
          body: "Crypto gives fintech teams a direct way to explain wallets, trading, security, and pricing in one landing page.",
          buttonLabel: "Get started",
          image: "/template-assets/crypto/hero.png",
          backgroundImage: "/template-assets/crypto/hero-background.png",
        },
      },
      {
        id: "features-1",
        type: "features",
        content: {
          heading: "Built for trust, speed, and adoption",
          features: [
            {
              id: "crypto-feature-1",
              title: "Secure by design",
              description: "Communicate safety and reliability with clear product blocks.",
              imageSrc: "/template-assets/crypto/feature-1.svg",
            },
            {
              id: "crypto-feature-2",
              title: "Market-ready sections",
              description: "Explain trading, wallets, and portfolio tools quickly.",
              imageSrc: "/template-assets/crypto/feature-2.svg",
            },
            {
              id: "crypto-feature-3",
              title: "Conversion flow",
              description: "Guide visitors from product promise to signup.",
              imageSrc: "/template-assets/crypto/feature-3.svg",
            },
          ],
        },
      },
      {
        id: "pricing-1",
        type: "pricing",
        content: {
          heading: "Plans for every portfolio",
          pricing: [
            {
              id: "crypto-plan-basic",
              name: "Basic",
              price: 0,
              description: "For exploring the platform.",
              features: ["Wallet overview", "Market watchlist", "Community access"],
            },
            {
              id: "crypto-plan-pro",
              name: "Pro",
              price: 29,
              description: "For active crypto teams.",
              features: ["Advanced signals", "Portfolio tools", "Priority support"],
              highlighted: true,
            },
          ],
        },
      },
      {
        id: "faq-1",
        type: "faq",
        content: {
          heading: "Crypto product questions",
          faqs: [
            {
              id: "crypto-faq-1",
              question: "Can this explain a wallet or exchange?",
              answer: "Yes. The sections are structured around common fintech product messaging.",
            },
            {
              id: "crypto-faq-2",
              question: "Can I change the pricing model?",
              answer: "Yes. Pricing tiers and feature lists are editable in the canvas.",
            },
          ],
        },
      },
      {
        id: "footer-1",
        type: "footer",
        content: {
          logo: "Crypto",
          logoImage: "/template-assets/crypto/logo.svg",
          footerLegal: "(c) Crypto. All rights reserved.",
        },
      },
    ],
  },
  {
    id: "dsign",
    sections: [
      {
        id: "hero-1",
        type: "hero",
        content: {
          heading: "A refined portfolio for design studios",
          body: "Dsign presents creative services, proof, and contact paths for studios that want a focused digital presence.",
          buttonLabel: "Start a project",
          image: "/template-assets/dsign/hero.svg",
          backgroundImage: "/template-assets/dsign/hero-background.svg",
        },
      },
      {
        id: "features-1",
        type: "features",
        content: {
          heading: "Services shaped around thoughtful design",
          features: [
            {
              id: "dsign-feature-1",
              title: "Identity design",
              description: "Create a recognizable system for your brand or studio.",
              imageSrc: "/template-assets/dsign/feature-1.svg",
            },
            {
              id: "dsign-feature-2",
              title: "Digital products",
              description: "Design clean interfaces for web and product experiences.",
              imageSrc: "/template-assets/dsign/feature-2.svg",
            },
            {
              id: "dsign-feature-3",
              title: "Creative direction",
              description: "Align campaigns, assets, and launch pages around one idea.",
              imageSrc: "/template-assets/dsign/feature-3.svg",
            },
          ],
        },
      },
      {
        id: "testimonials-1",
        type: "testimonials",
        content: {
          heading: "What clients say",
          testimonials: [
            {
              id: "dsign-testimonial-1",
              quote: "The site finally feels like the studio we wanted clients to see.",
              author: "Elena Park",
              role: "Creative Director",
            },
            {
              id: "dsign-testimonial-2",
              quote: "Dsign gave our portfolio a clear story and a smoother inquiry flow.",
              author: "Ravi Mehta",
              role: "Founder",
            },
          ],
        },
      },
      {
        id: "contact-1",
        type: "contact",
        content: {
          heading: "Let's shape your next design project",
          submitLabel: "Send inquiry",
        },
      },
      {
        id: "footer-1",
        type: "footer",
        content: {
          logo: "Dsign",
          logoImage: "/template-assets/dsign/logo.png",
          footerLegal: "(c) Dsign Studio. All rights reserved.",
        },
      },
    ],
  },
  {
    id: "generated",
    sections: [],
  },
  {
    id: "velox-showroom",
    sections: [
      {
        id: "hero-1",
        type: "hero",
        content: {
          heading: "Automotive excellence, rendered in motion",
          body: "Velox Showroom pairs cinematic scroll choreography with premium product storytelling for luxury automotive brands.",
          buttonLabel: "Explore collection",
        },
      },
      {
        id: "gallery-1",
        type: "gallery",
        content: {
          heading: "Featured machines",
          gallery: [
            { id: "v1", src: "/gallery/nano-banana/product-lifestyle.png", alt: "Velox featured vehicle" },
          ],
        },
      },
      {
        id: "footer-1",
        type: "footer",
        content: { logo: "VELOX", footerLegal: "(c) Velox Showroom. All rights reserved." },
      },
    ],
  },
  {
    id: "nexus",
    sections: [
      {
        id: "hero-1",
        type: "hero",
        content: {
          heading: "Intelligence at cosmic scale",
          body: "Nexus presents AI infrastructure with nebula-grade visuals, chrome typography, and enterprise-grade clarity.",
          buttonLabel: "Launch platform",
        },
      },
      {
        id: "features-1",
        type: "features",
        content: {
          heading: "Built for frontier teams",
          features: [
            { id: "n1", title: "Orbital compute", description: "Scale inference across distributed nodes." },
            { id: "n2", title: "Signal routing", description: "Route models with precision and observability." },
            { id: "n3", title: "Mission control", description: "Operate deployments from a single command layer." },
          ],
        },
      },
      {
        id: "footer-1",
        type: "footer",
        content: { logo: "NEXUS", footerLegal: "(c) Nexus Intelligence. All rights reserved." },
      },
    ],
  },
  {
    id: "stone-archive",
    sections: [
      {
        id: "hero-1",
        type: "hero",
        content: {
          heading: "The Stone Archive",
          body: "An immersive portfolio archive with scroll-reactive identity panels and cinematic HUD typography.",
          buttonLabel: "Enter archive",
        },
      },
      {
        id: "stats-1",
        type: "stats",
        content: {
          heading: "Archive metrics",
          body: "Projects indexed across design, engineering, and creative technology.",
        },
      },
      {
        id: "footer-1",
        type: "footer",
        content: { logo: "STONE ARCHIVE", footerLegal: "(c) Stone Archive. All rights reserved." },
      },
    ],
  },
  {
    id: "chen-lei",
    sections: [
      {
        id: "hero-1",
        type: "hero",
        content: {
          heading: "Creative technologist",
          body: "Chen Lei blends code, motion, and editorial design into precise digital experiences.",
          buttonLabel: "View work",
        },
      },
      {
        id: "gallery-1",
        type: "gallery",
        content: {
          heading: "Selected projects",
          gallery: [
            { id: "c1", src: "/gallery/nano-banana/glass-dashboard.png", alt: "Chen Lei project preview" },
          ],
        },
      },
      {
        id: "footer-1",
        type: "footer",
        content: { logo: "CHEN LEI", footerLegal: "(c) Chen Lei Studio. All rights reserved." },
      },
    ],
  },
  {
    id: "noir-restaurant",
    sections: [
      {
        id: "hero-1",
        type: "hero",
        content: {
          heading: "Fine dining reimagined",
          body: "NOIR pairs editorial serif typography with atmospheric reservation flows for luxury hospitality.",
          buttonLabel: "Reserve a table",
        },
      },
      {
        id: "gallery-1",
        type: "gallery",
        content: {
          heading: "The experience",
          gallery: [
            { id: "nr1", src: "/gallery/nano-banana/product-lifestyle.png", alt: "NOIR dining atmosphere" },
          ],
        },
      },
      {
        id: "footer-1",
        type: "footer",
        content: { logo: "NOIR", footerLegal: "(c) NOIR Restaurant. All rights reserved." },
      },
    ],
  },
  {
    id: "chronos-infinitum",
    sections: [
      {
        id: "hero-1",
        type: "hero",
        content: {
          heading: "Architects of time",
          body: "ÆTHER explores cosmic narrative through gold celestial motion and poetic scroll chapters.",
          buttonLabel: "Begin journey",
        },
      },
      {
        id: "features-1",
        type: "features",
        content: {
          heading: "Temporal craft",
          features: [
            { id: "a1", title: "Celestial motion", description: "Canvas-driven chapters with immersive depth." },
            { id: "a2", title: "Editorial rhythm", description: "Poetic pacing across every scroll sequence." },
            { id: "a3", title: "Gold accents", description: "Refined palette for luxury design studios." },
          ],
        },
      },
      {
        id: "footer-1",
        type: "footer",
        content: { logo: "ÆTHER", footerLegal: "(c) ÆTHER Studio. All rights reserved." },
      },
    ],
  },
  {
    id: "sketchbook-3d",
    sections: [
      {
        id: "hero-1",
        type: "hero",
        content: {
          heading: "Inside my mind",
          body: "A playful 3D sketchbook world with hand-drawn typography and exploratory navigation.",
          buttonLabel: "Enter sketchbook",
        },
      },
      {
        id: "gallery-1",
        type: "gallery",
        content: {
          heading: "Sketch pages",
          gallery: [
            { id: "s1", src: "/gallery/nano-banana/holographic-workspace.png", alt: "Sketchbook scene" },
          ],
        },
      },
      {
        id: "footer-1",
        type: "footer",
        content: { logo: "SKETCHBOOK", footerLegal: "(c) Inside My Mind. All rights reserved." },
      },
    ],
  },
  {
    id: "the-last-library",
    sections: [
      {
        id: "hero-1",
        type: "hero",
        content: {
          heading: "The Last Library",
          body: "A literary universe with starfield canvas, floating book spines, and narrative screen flows.",
          buttonLabel: "Open the library",
        },
      },
      {
        id: "features-1",
        type: "features",
        content: {
          heading: "Curated volumes",
          features: [
            { id: "l1", title: "Starfield index", description: "Navigate stories across a living catalog." },
            { id: "l2", title: "Spine archive", description: "Color-coded volumes with tactile presence." },
            { id: "l3", title: "Reader screens", description: "Screen-based narrative exploration." },
          ],
        },
      },
      {
        id: "footer-1",
        type: "footer",
        content: { logo: "THE LAST LIBRARY", footerLegal: "(c) The Last Library. All rights reserved." },
      },
    ],
  },
] as const satisfies TemplateSchema[];

export const getTemplateSchemaById = (
  templateId: string | null | undefined,
): TemplateSchema | null =>
  templateSchemas.find((schema) => schema.id === templateId) ?? null;
