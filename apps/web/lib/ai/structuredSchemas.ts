import { z } from "zod";

export const IndustrySchema = z.enum([
  "AI",
  "Startup",
  "Agency",
  "Portfolio",
  "SaaS",
  "Ecommerce",
]);

export const StyleSchema = z.enum([
  "Premium",
  "Minimal",
  "Bold",
  "Editorial",
  "Technical",
]);

export const SectionTypeSchema = z.enum([
  "navbar",
  "hero",
  "features",
  "pricing",
  "faq",
  "testimonials",
  "footer",
  "cta",
  "contact",
  "gallery",
  "stats",
  "logos",
]);

export const GeneratedFeatureSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  imageSrc: z.string().optional(),
});

export const PricingTierSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  features: z.array(z.string()),
  highlighted: z.boolean().optional(),
});

export const TestimonialSchema = z.object({
  id: z.string(),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
});

export const FAQSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const GalleryItemSchema = z.object({
  id: z.string(),
  src: z.string(),
  alt: z.string(),
});

export const SectionContentSchema = z.object({
  heading: z.string().optional(),
  body: z.string().optional(),
  buttonLabel: z.string().optional(),
  logo: z.string().optional(),
  logoImage: z.string().optional(),
  image: z.string().optional(),
  backgroundImage: z.string().optional(),
  gallery: z.array(GalleryItemSchema).optional(),
  features: z.array(GeneratedFeatureSchema).optional(),
  pricing: z.array(PricingTierSchema).optional(),
  testimonials: z.array(TestimonialSchema).optional(),
  faqs: z.array(FAQSchema).optional(),
  footerLegal: z.string().optional(),
  submitLabel: z.string().optional(),
});

export const SectionSchema = z.object({
  id: z.string(),
  type: SectionTypeSchema,
  content: SectionContentSchema,
});

export const PageSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  sections: z.array(SectionSchema),
});

export const WebsiteSchema = z.object({
  id: z.literal("generated"),
  sections: z.array(SectionSchema).min(4).max(12),
});

export const GeneratedWebsiteResponseSchema = z.object({
  projectName: z.string(),
  websiteSchema: WebsiteSchema,
  seo: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const WebsiteEditResponseSchema = z.object({
  summary: z.string(),
  websiteSchema: WebsiteSchema,
});

export const CinematicSceneSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  scrollStart: z.number().min(0).max(1),
  ctaLabel: z.string().optional(),
});

const nullishToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => (value === null ? undefined : value), schema);

export const CinematicScenePlanSchema = z.object({
  projectName: z.string(),
  story: z.string(),
  scenes: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      subtitle: nullishToUndefined(z.string().optional()),
      body: nullishToUndefined(z.string().optional()),
      scrollStart: z.number().min(0).max(1),
      ctaLabel: nullishToUndefined(z.string().optional()),
    }),
  ).min(4).max(12),
  seo: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const ContentGenerationResponseSchema = z.object({
  headlines: z.array(z.string()),
  features: z.array(GeneratedFeatureSchema),
  pricing: z.array(PricingTierSchema),
  faqs: z.array(FAQSchema),
  testimonials: z.array(TestimonialSchema),
  seoTitle: z.string(),
  seoDescription: z.string(),
});

export type OpenAIGeneratedWebsiteResponse = z.infer<
  typeof GeneratedWebsiteResponseSchema
>;
export type OpenAIWebsiteEditResponse = z.infer<typeof WebsiteEditResponseSchema>;
export type CinematicScenePlanResponse = z.infer<typeof CinematicScenePlanSchema>;
export type OpenAIContentGenerationResponse = z.infer<
  typeof ContentGenerationResponseSchema
>;
