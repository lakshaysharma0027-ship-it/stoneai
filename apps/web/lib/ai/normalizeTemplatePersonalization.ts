import type { TemplateSchema } from "@/lib/templateSchemas";
import type { TemplatePersonalizationResponse } from "@/lib/ai/structuredSchemas";

export const mergePersonalizedTemplateSchema = (
  base: TemplateSchema,
  personalized: TemplateSchema,
): TemplateSchema => ({
  id: base.id,
  sections: base.sections.map((section) => {
    const updated =
      personalized.sections.find((candidate) => candidate.id === section.id) ??
      personalized.sections.find((candidate) => candidate.type === section.type);

    if (!updated?.content) return section;

    return {
      ...section,
      content: {
        ...section.content,
        ...updated.content,
      },
    };
  }),
});

export const normalizeTemplatePersonalization = (
  raw: unknown,
  base: TemplateSchema,
  businessName: string,
): TemplatePersonalizationResponse => {
  const candidate = (raw && typeof raw === "object" ? raw : {}) as Partial<TemplatePersonalizationResponse>;
  const schema = candidate.websiteSchema ?? base;
  const merged = mergePersonalizedTemplateSchema(base, {
    id: base.id,
    sections: schema.sections ?? base.sections,
  });

  const htmlSlots =
    candidate.htmlSlots && typeof candidate.htmlSlots === "object"
      ? Object.fromEntries(
          Object.entries(candidate.htmlSlots).filter(
            ([, value]) => typeof value === "string" && value.trim().length > 0,
          ),
        )
      : {};

  return {
    projectName: candidate.projectName?.trim() || businessName,
    seo: {
      title: candidate.seo?.title?.trim() || businessName,
      description:
        candidate.seo?.description?.trim() ||
        `Personal portfolio for ${businessName}.`,
    },
    websiteSchema: merged as TemplatePersonalizationResponse["websiteSchema"],
    htmlSlots,
  };
};
