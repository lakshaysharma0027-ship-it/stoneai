import type { WebsiteIndustry, WebsiteStyle } from "@/lib/ai";

export const WEBSITE_TYPE_OPTIONS = [
  "Landing page",
  "Portfolio",
  "Blog",
  "E-commerce",
  "SaaS",
  "Agency",
] as const;

export const INDUSTRY_OPTIONS: Array<{ label: string; value: WebsiteIndustry | "Auto" }> = [
  { label: "Auto-detect", value: "Auto" },
  { label: "Technology", value: "AI" },
  { label: "Finance", value: "Startup" },
  { label: "Healthcare", value: "SaaS" },
  { label: "Education", value: "Portfolio" },
  { label: "Creative", value: "Agency" },
  { label: "Retail", value: "Ecommerce" },
];

export const STYLE_OPTIONS: Array<{ label: string; value: WebsiteStyle }> = [
  { label: "Premium dark", value: "Premium" },
  { label: "Clean minimal", value: "Minimal" },
  { label: "Bold & modern", value: "Bold" },
  { label: "Playful", value: "Editorial" },
  { label: "Corporate", value: "Technical" },
];

export const COLOR_SWATCHES = [
  { id: "mono", label: "Monochrome premium", className: "color-swatch--mono" },
  { id: "indigo", label: "Indigo", className: "color-swatch--indigo" },
  { id: "emerald", label: "Emerald", className: "color-swatch--emerald" },
  { id: "amber", label: "Amber", className: "color-swatch--amber" },
  { id: "red", label: "Red", className: "color-swatch--red" },
  { id: "blue", label: "Blue", className: "color-swatch--blue" },
  { id: "purple", label: "Purple", className: "color-swatch--purple" },
  { id: "gradient", label: "Warm gradient", className: "color-swatch--gradient" },
] as const;

export const ASPECT_RATIO_OPTIONS = [
  { id: "16:9", label: "16:9 Landscape", preview: "ratio-pill-preview--16-9" },
  { id: "9:16", label: "9:16 Portrait", preview: "ratio-pill-preview--9-16" },
  { id: "1:1", label: "1:1 Square", preview: "ratio-pill-preview--1-1" },
  { id: "21:9", label: "21:9 Wide", preview: "ratio-pill-preview--21-9" },
  { id: "4:5", label: "4:5 Social", preview: "ratio-pill-preview--4-5" },
] as const;

export const VIDEO_ASPECT_RATIO_OPTIONS = [
  { id: "16:9", label: "16:9 Landscape", preview: "ratio-pill-preview--16-9" },
  { id: "9:16", label: "9:16 Vertical", preview: "ratio-pill-preview--9-16" },
  { id: "1:1", label: "1:1 Square", preview: "ratio-pill-preview--1-1" },
] as const;

export const IMAGE_STYLE_TILES = [
  { id: "dark", label: "Dark cinematic", emoji: "🌑", className: "style-tile-thumb--dark" },
  { id: "minimal", label: "Clean minimal", emoji: "☁️", className: "style-tile-thumb--minimal" },
  { id: "neon", label: "Neon glow", emoji: "✨", className: "style-tile-thumb--neon" },
  { id: "warm", label: "Warm natural", emoji: "🌅", className: "style-tile-thumb--warm" },
] as const;

export const IMAGE_PROMPT_IDEAS = [
  "Futuristic dashboard interface, dark theme, purple accent lights, floating cards, ultra-realistic 3D",
  "Minimal hero background, smooth gradient mesh, soft light, abstract shapes, high-end SaaS vibe",
  "Aerial cityscape at night, neon reflections on wet streets, cinematic color grade, 8K",
] as const;

export const DURATION_OPTIONS = [5, 8, 10, 15] as const;
