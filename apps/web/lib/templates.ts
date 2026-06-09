import { getTemplateSchemaById, type TemplateSchema } from "./templateSchemas";

export type TemplateId = "saascandy" | "pixelize" | "crypto" | "dsign" | "generated";

export type TemplateMetadata = {
  id: TemplateId;
  name: string;
  category: string;
  description: string;
  previewImage: string;
  galleryImages: readonly string[];
  sourceFolder: string;
  schema: TemplateSchema;
};

const templateMetadata = [
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
    previewImage: "/templates/saascandy.jpg",
    galleryImages: ["/templates/saascandy.jpg"],
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

export const getTemplateById = (templateId: string | null | undefined) =>
  templates.find((template) => template.id === templateId) ?? null;
