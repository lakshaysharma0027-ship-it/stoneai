import { templateCatalog } from "./entries";
import type { TemplateCatalogEntry, TemplateCategory } from "./types";

export {
  nanoBananaGallery,
  templateCatalog,
  veoShowcaseItems,
} from "./entries";

export type {
  NanoBananaGalleryItem,
  TemplateCatalogEntry,
  TemplateCategory,
  VeoShowcaseItem,
} from "./types";

export { TEMPLATE_CATEGORIES } from "./types";

export const getTemplateById = (id: string): TemplateCatalogEntry | null =>
  templateCatalog.find((template) => template.id === id) ?? null;

export const getFeaturedTemplates = (): TemplateCatalogEntry[] =>
  templateCatalog.filter((template) => template.featured);

export const getTemplatesByCategory = (
  category: TemplateCategory | "All",
): TemplateCatalogEntry[] =>
  category === "All"
    ? templateCatalog
    : templateCatalog.filter((template) => template.category === category);

export const getTemplateCategories = (): TemplateCategory[] => {
  const categories = new Set<TemplateCategory>();
  for (const template of templateCatalog) {
    categories.add(template.category);
  }
  return [...categories].sort();
};
