import type { TemplateSchema } from "@/lib/templateSchemas";

export const isInlineDataUrl = (value?: string | null): value is string =>
  Boolean(value?.startsWith("data:"));

export type PreservedSchemaMedia = {
  heroImage?: string;
  heroBackgroundImage?: string;
  heroVideo?: string;
};

export const extractInlineMediaFromSchema = (schema: TemplateSchema): PreservedSchemaMedia => {
  const hero = schema.sections.find((section) => section.type === "hero");
  const preserved: PreservedSchemaMedia = {};

  if (!hero?.content) return preserved;

  if (isInlineDataUrl(hero.content.image)) {
    preserved.heroImage = hero.content.image;
  }
  if (isInlineDataUrl(hero.content.backgroundImage)) {
    preserved.heroBackgroundImage = hero.content.backgroundImage;
  }
  if (isInlineDataUrl(hero.content.video)) {
    preserved.heroVideo = hero.content.video;
  }

  return preserved;
};

export const stripInlineMediaFromSchema = (schema: TemplateSchema): TemplateSchema => {
  const next = structuredClone(schema);
  const hero = next.sections.find((section) => section.type === "hero");

  if (hero?.content) {
    if (isInlineDataUrl(hero.content.image)) {
      delete hero.content.image;
    }
    if (isInlineDataUrl(hero.content.backgroundImage)) {
      delete hero.content.backgroundImage;
    }
    if (isInlineDataUrl(hero.content.video)) {
      delete hero.content.video;
    }
  }

  return next;
};

export const restoreInlineMediaToSchema = (
  schema: TemplateSchema,
  preserved: PreservedSchemaMedia,
): TemplateSchema => {
  const next = structuredClone(schema);
  const hero = next.sections.find((section) => section.type === "hero");

  if (!hero?.content) return next;

  if (preserved.heroImage) {
    hero.content.image = preserved.heroImage;
  }
  if (preserved.heroBackgroundImage) {
    hero.content.backgroundImage = preserved.heroBackgroundImage;
  }
  if (preserved.heroVideo) {
    hero.content.video = preserved.heroVideo;
  }

  return next;
};

export const sanitizeStoredUpload = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (isInlineDataUrl(trimmed)) return null;
  return trimmed;
};
