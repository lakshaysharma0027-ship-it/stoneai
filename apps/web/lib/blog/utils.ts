import type { BlogArticle, ContentBlock } from "./types";

export function calculateReadingTime(content: ContentBlock[]): number {
  const text = content
    .map((block) => {
      switch (block.type) {
        case "h2":
        case "h3":
        case "p":
        case "blockquote":
          return block.text;
        case "ul":
        case "ol":
          return block.items.join(" ");
        case "comparison":
          return [...block.headers, ...block.rows.flat()].join(" ");
        case "internal-link":
          return block.label;
        default:
          return "";
      }
    })
    .join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function enrichArticle(article: BlogArticle): BlogArticle {
  return {
    ...article,
    readingTimeMinutes: article.readingTimeMinutes ?? calculateReadingTime(article.content),
  };
}

export function extractToc(content: ContentBlock[]) {
  return content
    .filter((b): b is Extract<ContentBlock, { type: "h2" } | { type: "h3" }> =>
      b.type === "h2" || b.type === "h3",
    )
    .map((b) => ({ id: b.id, text: b.text, level: b.type === "h2" ? 2 : 3 }));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
