type JsonRecord = Record<string, unknown>;

const asRecord = (value: unknown): JsonRecord =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : {};

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const ensureId = (item: JsonRecord, prefix: string, index: number) => {
  const id = item.id;
  if (typeof id === "string" && id.trim()) return item;
  return { ...item, id: `${prefix}-${index + 1}` };
};

const normalizeFeatures = (items: unknown, prefix: string) =>
  asArray(items).map((item, index) =>
    ensureId(asRecord(item), prefix, index),
  );

const normalizeSection = (section: unknown, index: number) => {
  const record = asRecord(section);
  const type =
    typeof record.type === "string" && record.type.trim()
      ? record.type
      : "features";
  const id =
    typeof record.id === "string" && record.id.trim()
      ? record.id
      : `${type}-${index + 1}`;

  const content = asRecord(record.content);

  if (content.features) {
    content.features = normalizeFeatures(content.features, `${id}-feature`);
  }
  if (content.testimonials) {
    content.testimonials = normalizeFeatures(content.testimonials, `${id}-testimonial`);
  }
  if (content.faqs) {
    content.faqs = normalizeFeatures(content.faqs, `${id}-faq`);
  }
  if (content.gallery) {
    content.gallery = normalizeFeatures(content.gallery, `${id}-gallery`);
  }
  if (content.pricing) {
    content.pricing = asArray(content.pricing).map((item, tierIndex) =>
      ensureId(asRecord(item), `${id}-tier`, tierIndex),
    );
  }

  return {
    ...record,
    id,
    type,
    content,
  };
};

export const normalizeWebsiteSchema = (schema: unknown) => {
  const record = asRecord(schema);
  const sections = asArray(record.sections).map(normalizeSection);

  return {
    ...record,
    id: "generated",
    sections,
  };
};

export const normalizeGeneratedWebsiteResponse = (
  raw: unknown,
  options: { fallbackProjectName: string; fallbackSeoDescription?: string },
) => {
  const record = asRecord(raw);
  const websiteSchema = normalizeWebsiteSchema(record.websiteSchema);
  const seoRecord = asRecord(record.seo);

  const projectName =
    typeof record.projectName === "string" && record.projectName.trim()
      ? record.projectName.trim()
      : options.fallbackProjectName;

  const seoDescription =
    typeof seoRecord.description === "string" && seoRecord.description.trim()
      ? seoRecord.description.trim()
      : (options.fallbackSeoDescription ?? `${projectName} — premium website by StoneAI`);

  const seoTitle =
    typeof seoRecord.title === "string" && seoRecord.title.trim()
      ? seoRecord.title.trim()
      : projectName;

  return {
    ...record,
    projectName,
    websiteSchema,
    seo: {
      title: seoTitle,
      description: seoDescription,
    },
  };
};

export const normalizeWebsiteEditResponse = (raw: unknown) => {
  const record = asRecord(raw);
  return {
    ...record,
    summary:
      typeof record.summary === "string" && record.summary.trim()
        ? record.summary.trim()
        : "Website updated.",
    websiteSchema: normalizeWebsiteSchema(record.websiteSchema),
  };
};
