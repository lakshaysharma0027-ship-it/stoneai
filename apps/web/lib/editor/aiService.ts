import type { DeepPartial, Section, Website } from "./schema";
import { templateService } from "./templates";
import { createPage, createSection, createWebsite, nowIso } from "./websiteFactory";

export type GenerateWebsiteInput = {
  projectId: string;
  prompt: string;
};

export type TransformTemplateInput = {
  projectId: string;
  templateId: string;
  prompt: string;
};

export type AIChange =
  | {
      type: "update-section";
      sectionId: string;
      patch: DeepPartial<Section>;
    }
  | {
      type: "add-section";
      pageId: string;
      section: Section;
    }
  | {
      type: "remove-section";
      sectionId: string;
    };

export type ApplyAIChangesInput = {
  website: Website;
  changes: AIChange[];
};

export type AIWebsiteService = {
  generateWebsiteFromPrompt: (input: GenerateWebsiteInput) => Promise<Website>;
  transformTemplate: (input: TransformTemplateInput) => Promise<Website>;
  applyAIChanges: (input: ApplyAIChangesInput) => Promise<Website>;
};

const deriveTitleFromPrompt = (prompt: string) => {
  const normalized = prompt.trim().replace(/\s+/g, " ");
  if (!normalized) return "Untitled Project";
  return normalized.length > 64 ? normalized.slice(0, 61).trimEnd() + "..." : normalized;
};

const applySectionPatch = (
  section: Section,
  patch: DeepPartial<Section>,
): Section => ({
  ...section,
  ...patch,
  components: patch.components
    ? (patch.components as Section["components"])
    : section.components,
  styles: patch.styles ? { ...section.styles, ...patch.styles } : section.styles,
  settings: patch.settings
    ? { ...section.settings, ...patch.settings }
    : section.settings,
});

export const mockAIWebsiteService: AIWebsiteService = {
  async generateWebsiteFromPrompt({ projectId, prompt }) {
    const title = deriveTitleFromPrompt(prompt);
    const website = createWebsite(projectId, {
      title,
      description: prompt.trim(),
    });
    const page = createPage(website.id, "Home", 0, "home");

    page.sections = [
      createSection("navbar", 0),
      createSection("hero", 1),
      createSection("features", 2),
      createSection("contact", 3),
      createSection("footer", 4),
    ];

    website.pages = [page];
    website.updatedAt = nowIso();
    return website;
  },

  async transformTemplate({ projectId, templateId, prompt }) {
    const website =
      templateService.createWebsiteFromTemplate(templateId, projectId) ??
      (await mockAIWebsiteService.generateWebsiteFromPrompt({
        projectId,
        prompt,
      }));

    website.meta.description = prompt.trim();
    website.updatedAt = nowIso();
    return website;
  },

  async applyAIChanges({ website, changes }) {
    let nextWebsite = structuredClone(website);

    changes.forEach((change) => {
      if (change.type === "update-section") {
        nextWebsite = {
          ...nextWebsite,
          pages: nextWebsite.pages.map((page) => ({
            ...page,
            sections: page.sections.map((section) =>
              section.id === change.sectionId
                ? applySectionPatch(section, change.patch)
                : section,
            ),
          })),
        };
      }

      if (change.type === "add-section") {
        nextWebsite = {
          ...nextWebsite,
          pages: nextWebsite.pages.map((page) =>
            page.id === change.pageId
              ? { ...page, sections: [...page.sections, change.section] }
              : page,
          ),
        };
      }

      if (change.type === "remove-section") {
        nextWebsite = {
          ...nextWebsite,
          pages: nextWebsite.pages.map((page) => ({
            ...page,
            sections: page.sections.filter(
              (section) => section.id !== change.sectionId,
            ),
          })),
        };
      }
    });

    nextWebsite.updatedAt = nowIso();
    nextWebsite.version += 1;
    return nextWebsite;
  },
};
