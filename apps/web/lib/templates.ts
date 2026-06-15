import { getTemplateSchemaById, type TemplateSchema } from "./templateSchemas";

export type TemplateId =
  | "saascandy"
  | "pixelize"
  | "crypto"
  | "dsign"
  | "generated"
  | "velox-showroom"
  | "nexus"
  | "stone-archive"
  | "chen-lei"
  | "noir-restaurant"
  | "chronos-infinitum"
  | "sketchbook-3d"
  | "the-last-library";

export type TemplateMetadata = {
  id: TemplateId;
  name: string;
  category: string;
  description: string;
  previewImage: string;
  galleryImages: readonly string[];
  sourceFolder: string;
  htmlPath?: string;
  schema: TemplateSchema;
};

const templateMetadata = [
  {
    id: "velox-showroom",
    name: "Velox Showroom",
    category: "Portfolio",
    description:
      "Cinematic automotive gallery with Three.js scroll choreography, gold accents, and immersive product storytelling.",
    previewImage: "/templates/previews/velox-showroom.jpg",
    galleryImages: ["/templates/previews/velox-showroom.jpg"],
    sourceFolder: "stoneai-templates/velox-showroom",
    htmlPath: "/template-demos/velox-showroom.html",
  },
  {
    id: "nexus",
    name: "Nexus",
    category: "SaaS",
    description:
      "Cosmic-scale intelligence landing page with WebGL nebula scenes, chrome typography, and scroll-driven narrative.",
    previewImage: "/templates/previews/nexus.jpg",
    galleryImages: ["/templates/previews/nexus.jpg"],
    sourceFolder: "stoneai-templates/nexus",
    htmlPath: "/template-demos/nexus.html",
  },
  {
    id: "stone-archive",
    name: "Stone Archive",
    category: "Portfolio",
    description:
      "Immersive 3D portfolio archive with scroll-reactive identity panels, forge sections, and cinematic HUD typography.",
    previewImage: "/templates/previews/stone-archive.jpg",
    galleryImages: ["/templates/previews/stone-archive.jpg"],
    sourceFolder: "stoneai-templates/stone-archive",
    htmlPath: "/template-demos/stone-archive.html",
  },
  {
    id: "chen-lei",
    name: "Chen Lei",
    category: "Agency",
    description:
      "Creative technologist portfolio with WebGL ground plane, monospace editorial type, and precision motion design.",
    previewImage: "/templates/previews/chen-lei.jpg",
    galleryImages: ["/templates/previews/chen-lei.jpg"],
    sourceFolder: "stoneai-templates/chen-lei",
    htmlPath: "/template-demos/chen-lei.html",
  },
  {
    id: "noir-restaurant",
    name: "NOIR",
    category: "Ecommerce",
    description:
      "Fine dining experience with gold-shimmer loading, editorial serif typography, and atmospheric reservation flow.",
    previewImage: "/templates/previews/noir-restaurant.jpg",
    galleryImages: ["/templates/previews/noir-restaurant.jpg"],
    sourceFolder: "stoneai-templates/noir-restaurant",
    htmlPath: "/template-demos/noir-restaurant.html",
  },
  {
    id: "chronos-infinitum",
    name: "ÆTHER",
    category: "Design",
    description:
      "Architects of time — cosmic canvas chapters, gold celestial cursor, and poetic scroll-driven storytelling.",
    previewImage: "/templates/previews/chronos-infinitum.jpg",
    galleryImages: ["/templates/previews/chronos-infinitum.jpg"],
    sourceFolder: "stoneai-templates/chronos-infinitum",
    htmlPath: "/template-demos/chronos-infinitum.html",
  },
  {
    id: "sketchbook-3d",
    name: "Inside My Mind",
    category: "Creator",
    description:
      "Interactive 3D sketchbook world with hand-drawn typography, playful HUD overlays, and exploratory navigation.",
    previewImage: "/templates/previews/sketchbook-3d.jpg",
    galleryImages: ["/templates/previews/sketchbook-3d.jpg"],
    sourceFolder: "stoneai-templates/sketchbook-3d",
    htmlPath: "/template-demos/sketchbook-3d.html",
  },
  {
    id: "the-last-library",
    name: "The Last Library",
    category: "Creator",
    description:
      "Literary universe with starfield canvas, floating book spines, and screen-based narrative exploration.",
    previewImage: "/templates/previews/the-last-library.jpg",
    galleryImages: ["/templates/previews/the-last-library.jpg"],
    sourceFolder: "stoneai-templates/the-last-library",
    htmlPath: "/template-demos/the-last-library.html",
  },
  {
    id: "saascandy",
    name: "SaaSCandy",
    category: "SaaS",
    description: "Modern SaaS landing page with polished product sections.",
    previewImage: "/templates/saascandy.jpg",
    galleryImages: ["/templates/saascandy.jpg"],
    sourceFolder: "template-1/SaasCandy-Nextjs-Tailwind-main",
  },
  {
    id: "pixelize",
    name: "Pixelize",
    category: "Agency",
    description: "Creative agency layout for services, work, and pricing.",
    previewImage: "/templates/pixelize.jpg",
    galleryImages: ["/templates/pixelize.jpg"],
    sourceFolder: "template-2/pixelize-nextjs-main",
  },
  {
    id: "crypto",
    name: "Crypto",
    category: "Fintech",
    description: "Crypto product homepage with conversion-focused sections.",
    previewImage: "/templates/crypto.jpg",
    galleryImages: ["/templates/crypto.jpg"],
    sourceFolder: "template-4/crypto-tailwind-nextjs-free-main",
  },
  {
    id: "dsign",
    name: "Dsign",
    category: "Design",
    description: "Design studio website for portfolios and service teams.",
    previewImage: "/templates/dsign.jpg",
    galleryImages: ["/templates/dsign.jpg"],
    sourceFolder: "template-3/dsign-tailwind-nextjs-free-main",
  },
  {
    id: "generated",
    name: "Generated",
    category: "AI",
    description: "Rules-generated StoneAI website schema.",
    previewImage: "/templates/previews/nexus.jpg",
    galleryImages: ["/templates/previews/nexus.jpg"],
    sourceFolder: "stoneai-generated",
  },
] as const;

export const templates = templateMetadata.map((template) => {
  const schema = getTemplateSchemaById(template.id);
  if (!schema) {
    throw new Error(`Missing template schema for "${template.id}".`);
  }

  return { ...template, schema };
}) satisfies TemplateMetadata[];

export const getProjectTemplateById = (templateId: string | null | undefined) =>
  templates.find((template) => template.id === templateId) ?? null;

/** @deprecated Use getProjectTemplateById */
export const getTemplateById = getProjectTemplateById;
