import type { SectionType } from "@/lib/editor/schema";
import type { GeneratedSectionContent } from "@/lib/sections";
import type { TemplateSchema } from "@/lib/templateSchemas";

export type WebsiteIndustry =
  | "AI"
  | "Startup"
  | "Agency"
  | "Portfolio"
  | "SaaS"
  | "Ecommerce";

export type WebsiteStyle =
  | "Premium"
  | "Minimal"
  | "Bold"
  | "Editorial"
  | "Technical";

export type GeneratedComponent = {
  id: string;
  type: string;
  content: Record<string, unknown>;
};

export type GeneratedSection = {
  id: string;
  type: SectionType;
  content: GeneratedSectionContent;
  components: GeneratedComponent[];
};

export type GeneratedPage = {
  id: string;
  name: string;
  slug: string;
  sections: GeneratedSection[];
};

export type GeneratedWebsite = {
  id: string;
  name: string;
  prompt: string;
  industry: WebsiteIndustry;
  style: WebsiteStyle;
  pages: GeneratedPage[];
};

export type GenerateWebsiteRequest = {
  prompt: string;
  industry?: WebsiteIndustry | "Auto";
  style?: WebsiteStyle;
};

export type GenerateWebsiteResponse = {
  website: GeneratedWebsite;
  websiteSchema: TemplateSchema;
};

export type EditWebsiteRequest = {
  website: GeneratedWebsite;
  instruction: string;
};

export type EditWebsiteResponse = {
  website: GeneratedWebsite;
  websiteSchema: TemplateSchema;
};
