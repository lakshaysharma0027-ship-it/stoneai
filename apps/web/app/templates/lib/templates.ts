import {
  templateCatalog,
  type TemplateCatalogEntry,
} from "@/lib/template-catalog";

/** Gallery card shape used by the templates page and preview modal. */
export type Template = TemplateCatalogEntry & {
  desktopScreenshot: string;
  mobileScreenshot: string;
};

export const templates: Template[] = templateCatalog.map((entry) => ({
  ...entry,
  desktopScreenshot: entry.previewImage,
  mobileScreenshot: entry.mobilePreviewImage ?? entry.previewImage,
}));

export type { TemplateCatalogEntry };
