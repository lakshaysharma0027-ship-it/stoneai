export const TEMPLATE_CATEGORIES = [
  "SaaS",
  "Startup",
  "Agency",
  "Portfolio",
  "Ecommerce",
  "Creator",
  "Fintech",
  "Design",
] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

/** Single source of truth for a StoneAI template in the gallery and homepage. */
export type TemplateCatalogEntry = {
  /** Stable slug used across routes, storage, and editor mapping. */
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  featured: boolean;
  badge?: string;
  /** Public path to the standalone HTML demo. */
  htmlPath: string;
  /** Desktop preview thumbnail for cards and modals. */
  previewImage: string;
  /** Optional mobile preview; falls back to previewImage. */
  mobilePreviewImage?: string;
  /** Card fallback background color. */
  bgColor: string;
  pages: number;
  components: number;
  uses: number;
  updatedAt: string;
};

export type NanoBananaGalleryItem = {
  id: string;
  src: string;
  alt: string;
  prompt: string;
};

export type VeoShowcaseItem = {
  id: string;
  title: string;
  description: string;
  /** Set when a real video asset is available. */
  videoSrc?: string;
  posterSrc?: string;
  placeholder?: boolean;
};
