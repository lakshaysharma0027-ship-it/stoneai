export type ContentBlock =
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; id: string; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "cta"; variant: "top" | "middle" | "bottom" }
  | { type: "comparison"; headers: string[]; rows: string[][] }
  | { type: "internal-link"; slug: string; label: string }
  | { type: "internal-href"; href: string; label: string }
  | { type: "pros-cons"; stoneai: { pros: string[]; cons: string[] }; competitor: { name: string; pros: string[]; cons: string[] } };

export type FAQItem = {
  question: string;
  answer: string;
};

export type BlogAuthor = {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
};

export type BlogCategory = {
  slug: string;
  name: string;
  description: string;
};

export type BlogArticle = {
  slug: string;
  seoTitle: string;
  metaDescription: string;
  title: string;
  excerpt: string;
  category: string;
  authorId: string;
  publishedAt: string;
  updatedAt: string;
  featured?: boolean;
  trending?: boolean;
  readingTimeMinutes?: number;
  relatedSlugs: string[];
  faq: FAQItem[];
  content: ContentBlock[];
  tags?: string[];
};

export type AlternativePage = {
  slug: string;
  competitor: string;
  seoTitle: string;
  metaDescription: string;
  title: string;
  subtitle: string;
  heroDescription: string;
  comparisonHeaders: string[];
  comparisonRows: string[][];
  features: { title: string; description: string }[];
  faq: FAQItem[];
  relatedArticleSlugs: string[];
  content: ContentBlock[];
  prosCons?: {
    stoneai: { pros: string[]; cons: string[] };
    competitor: { pros: string[]; cons: string[] };
  };
};

export type IndustryPage = {
  slug: string;
  name: string;
  seoTitle: string;
  metaDescription: string;
  title: string;
  subtitle: string;
  heroDescription: string;
  templateSlug?: string;
  stats: { label: string; value: string }[];
  features: { title: string; description: string }[];
  faq: FAQItem[];
  relatedArticleSlugs: string[];
  relatedAlternativeSlugs: string[];
  content: ContentBlock[];
};

export type TemplateSeoPage = {
  slug: string;
  name: string;
  seoTitle: string;
  metaDescription: string;
  title: string;
  subtitle: string;
  previewGradient: string;
  features: { title: string; description: string }[];
  useCases: string[];
  faq: FAQItem[];
  relatedArticleSlugs: string[];
  content: ContentBlock[];
};
