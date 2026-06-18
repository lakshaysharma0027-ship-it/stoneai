type JsonRecord = Record<string, unknown>;

const asRecord = (value: unknown): JsonRecord =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : {};

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const ensureId = (item: JsonRecord, prefix: string, index: number) => {
  const id = item.id;
  if (typeof id === "string" && id.trim()) return item;
  return { ...item, id: `${prefix}-${index + 1}` };
};

const optionalString = (value: unknown) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
};

export const normalizeCinematicScenePlan = (
  raw: unknown,
  options: { fallbackProjectName: string; fallbackDescription?: string },
) => {
  const record = asRecord(raw);
  const rawScenes = asArray(record.scenes);
  const scenes = rawScenes.map((scene, index) => {
    const item = ensureId(asRecord(scene), "scene", index);
    const scrollStart =
      typeof item.scrollStart === "number" && Number.isFinite(item.scrollStart)
        ? Math.min(1, Math.max(0, item.scrollStart))
        : index / Math.max(1, rawScenes.length - 1);

    return {
      id: typeof item.id === "string" && item.id.trim() ? item.id.trim() : `scene-${index + 1}`,
      title: typeof item.title === "string" && item.title.trim() ? item.title.trim() : `Scene ${index + 1}`,
      subtitle: optionalString(item.subtitle),
      body: optionalString(item.body),
      scrollStart,
      ctaLabel: optionalString(item.ctaLabel),
    };
  });

  const seoRecord = asRecord(record.seo);
  const projectName =
    typeof record.projectName === "string" && record.projectName.trim()
      ? record.projectName.trim()
      : options.fallbackProjectName;

  return {
    projectName,
    story:
      typeof record.story === "string" && record.story.trim()
        ? record.story.trim()
        : `A cinematic scroll journey for ${projectName}.`,
    scenes,
    seo: {
      title:
        typeof seoRecord.title === "string" && seoRecord.title.trim()
          ? seoRecord.title.trim()
          : projectName,
      description:
        typeof seoRecord.description === "string" && seoRecord.description.trim()
          ? seoRecord.description.trim()
          : (options.fallbackDescription ?? `${projectName} — cinematic experience by StoneAI`),
    },
  };
};
