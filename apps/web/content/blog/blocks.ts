import type { ContentBlock } from "@/lib/blog/types";

export const ctaTop = (): ContentBlock => ({ type: "cta", variant: "top" });
export const ctaMiddle = (): ContentBlock => ({ type: "cta", variant: "middle" });
export const ctaBottom = (): ContentBlock => ({ type: "cta", variant: "bottom" });

export const h2 = (id: string, text: string): ContentBlock => ({ type: "h2", id, text });
export const h3 = (id: string, text: string): ContentBlock => ({ type: "h3", id, text });
export const p = (text: string): ContentBlock => ({ type: "p", text });
export const ul = (items: string[]): ContentBlock => ({ type: "ul", items });
export const ol = (items: string[]): ContentBlock => ({ type: "ol", items });
export const link = (slug: string, label: string): ContentBlock => ({ type: "internal-link", slug, label });
export const href = (path: string, label: string): ContentBlock => ({ type: "internal-href", href: path, label });

export const prosCons = (
  stoneai: { pros: string[]; cons: string[] },
  competitor: { name: string; pros: string[]; cons: string[] },
): ContentBlock => ({ type: "pros-cons", stoneai, competitor });

export const comparison = (headers: string[], rows: string[][]): ContentBlock => ({
  type: "comparison",
  headers,
  rows,
});
