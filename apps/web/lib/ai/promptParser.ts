import type { SectionType } from "@/lib/editor/schema";
import type { GenerateWebsiteRequest, WebsiteIndustry, WebsiteStyle } from "./schema";

const industryKeywords: Array<[WebsiteIndustry, string[]]> = [
  ["AI", ["ai", "artificial intelligence", "machine learning", "automation", "agent"]],
  ["SaaS", ["saas", "software", "subscription", "platform", "dashboard"]],
  ["Agency", ["agency", "studio", "services", "client", "creative"]],
  ["Portfolio", ["portfolio", "personal", "creator", "resume", "work"]],
  ["Ecommerce", ["ecommerce", "shop", "store", "commerce", "product catalog"]],
  ["Startup", ["startup", "launch", "founder", "venture", "new company"]],
];

const sectionMap: Record<WebsiteIndustry, SectionType[]> = {
  AI: ["navbar", "hero", "features", "stats", "pricing", "testimonials", "faq", "cta", "footer"],
  Startup: ["navbar", "hero", "features", "pricing", "testimonials", "faq", "footer"],
  Agency: ["navbar", "hero", "features", "gallery", "testimonials", "contact", "footer"],
  Portfolio: ["navbar", "hero", "gallery", "testimonials", "contact", "footer"],
  SaaS: ["navbar", "hero", "logos", "features", "pricing", "testimonials", "faq", "footer"],
  Ecommerce: ["navbar", "hero", "features", "gallery", "stats", "faq", "cta", "footer"],
};

export type ParsedPrompt = {
  industry: WebsiteIndustry;
  style: WebsiteStyle;
  sections: SectionType[];
  normalizedPrompt: string;
};

export const parseWebsitePrompt = (request: GenerateWebsiteRequest): ParsedPrompt => {
  const normalizedPrompt = request.prompt.trim();
  const haystack = normalizedPrompt.toLowerCase();
  const explicitIndustry =
    request.industry && request.industry !== "Auto" ? request.industry : null;
  const detectedIndustry =
    explicitIndustry ??
    industryKeywords.find(([, keywords]) =>
      keywords.some((keyword) => haystack.includes(keyword)),
    )?.[0] ??
    "Startup";

  return {
    industry: detectedIndustry,
    style: request.style ?? "Premium",
    sections: sectionMap[detectedIndustry],
    normalizedPrompt,
  };
};
