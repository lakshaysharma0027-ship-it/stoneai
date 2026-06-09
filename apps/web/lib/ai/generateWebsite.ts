import type { SectionType } from "@/lib/editor/schema";
import { getSectionDefinition } from "@/lib/sections";
import type { GeneratedSectionContent } from "@/lib/sections";
import type { TemplateSectionSchema } from "@/lib/templateSchemas";
import { parseWebsitePrompt } from "./promptParser";
import type {
  GeneratedComponent,
  GeneratedPage,
  GeneratedSection,
  GeneratedWebsite,
  GenerateWebsiteRequest,
  GenerateWebsiteResponse,
} from "./schema";

const toKebab = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "generated-site";

const titleFromPrompt = (prompt: string, industry: string) => {
  const compact = prompt.replace(/\s+/g, " ").trim();
  if (!compact) return `${industry} Website`;
  const words = compact.split(" ").slice(0, 6).join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const inferOffer = (prompt: string, industry: string) =>
  prompt.trim() || `${industry} business`;

const componentsForSection = (
  type: SectionType,
  content: TemplateSectionSchema["content"],
): GeneratedComponent[] => {
  const components: GeneratedComponent[] = [];
  if (content?.heading) {
    components.push({
      id: `${type}-heading`,
      type: "text",
      content: { text: content.heading, semanticRole: "heading" },
    });
  }
  if (content?.body) {
    components.push({
      id: `${type}-body`,
      type: "text",
      content: { text: content.body, semanticRole: "body" },
    });
  }
  if (content?.buttonLabel) {
    components.push({
      id: `${type}-button`,
      type: "button",
      content: { label: content.buttonLabel, href: "#" },
    });
  }
  return components;
};

const personalizeSection = (
  type: SectionType,
  index: number,
  prompt: string,
  industry: string,
  style: string,
): TemplateSectionSchema => {
  const definition = getSectionDefinition(type);
  if (!definition) {
    throw new Error(`Missing section definition for ${type}.`);
  }

  const offer = inferOffer(prompt, industry);
  const content: GeneratedSectionContent = structuredClone(definition.defaultContent);

  if (type === "hero") {
    content.heading = `${offer}: a ${style.toLowerCase()} ${industry.toLowerCase()} website`;
    content.body = `Generated from your prompt, this draft frames the offer, proof, and next step for ${offer}.`;
    content.buttonLabel = industry === "Portfolio" ? "View work" : "Start now";
  }

  if (type === "features") {
    content.heading = `Why ${offer} stands out`;
  }

  if (type === "pricing") {
    content.heading = industry === "Agency" ? "Engagement options" : "Plans for every stage";
  }

  if (type === "contact") {
    content.heading = `Talk to ${offer}`;
  }

  if (type === "footer" || type === "navbar") {
    content.logo = titleFromPrompt(prompt, industry);
  }

  return {
    id: `${type}-${index + 1}`,
    type,
    content,
  };
};

export const generateWebsite = (
  request: GenerateWebsiteRequest,
): GenerateWebsiteResponse => {
  const parsed = parseWebsitePrompt(request);
  const title = titleFromPrompt(parsed.normalizedPrompt, parsed.industry);
  const sections = parsed.sections.map((type, index) =>
    personalizeSection(type, index, parsed.normalizedPrompt, parsed.industry, parsed.style),
  );

  const generatedSections: GeneratedSection[] = sections.map((section) => ({
    id: section.id,
    type: section.type,
    content: section.content ?? {},
    components: componentsForSection(section.type, section.content),
  }));
  const page: GeneratedPage = {
    id: "home",
    name: "Home",
    slug: "home",
    sections: generatedSections,
  };
  const website: GeneratedWebsite = {
    id: toKebab(title),
    name: title,
    prompt: parsed.normalizedPrompt,
    industry: parsed.industry,
    style: parsed.style,
    pages: [page],
  };

  return {
    website,
    websiteSchema: {
      id: "generated",
      sections,
    },
  };
};
