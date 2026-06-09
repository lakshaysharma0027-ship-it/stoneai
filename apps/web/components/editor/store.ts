"use client";

import { create } from "zustand";
import { editorPersistence } from "@/lib/editor/persistence";
import { projectStorage } from "@/lib/projects";
import type { TemplateSchema } from "@/lib/templateSchemas";
import type {
  DeepPartial,
  DeviceMode,
  EditorMessage,
  EditorMode,
  EntityId,
  Page,
  Section,
  SectionType,
  Website,
  WebsiteComponent,
  WebsiteMeta,
  WebsiteSnapshot,
} from "@/lib/editor/schema";
import {
  cloneWebsite,
  createComponent,
  createPage as createWebsitePage,
  createSection,
  createWebsite as createProjectWebsite,
  nowIso,
  reorderComponents,
  reorderSections,
  slugify,
} from "@/lib/editor/websiteFactory";
import type { LeftTab, RightTab } from "./types";

type EditorState = {
  device: DeviceMode;
  editorMode: EditorMode;
  leftTab: LeftTab;
  rightTab: RightTab;
  selectedSectionId: EntityId | null;
  selectedComponentId: EntityId | null;
  hoveredSectionId: EntityId | null;
  zoom: number;
  showGrid: boolean;
  aiOpen: boolean;
  aiInput: string;
  messages: EditorMessage[];
  aiTyping: boolean;
  leftWidth: number;
  rightWidth: number;
  bottomHeight: number;
  website: Website | null;
  activePageId: EntityId | null;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;
  past: WebsiteSnapshot[];
  future: WebsiteSnapshot[];
  maxHistoryLength: number;
  setDevice: (device: DeviceMode) => void;
  setEditorMode: (editorMode: EditorMode) => void;
  setLeftTab: (leftTab: LeftTab) => void;
  setRightTab: (rightTab: RightTab) => void;
  setSelectedId: (sectionId: EntityId) => void;
  selectSection: (sectionId: EntityId | null) => void;
  selectComponent: (componentId: EntityId | null) => void;
  clearSelection: () => void;
  hoverSection: (sectionId: EntityId | null) => void;
  setZoom: (updater: number | ((zoom: number) => number)) => void;
  setShowGrid: (showGrid: boolean) => void;
  setAiOpen: (aiOpen: boolean) => void;
  setAiInput: (aiInput: string) => void;
  updateWebsiteSettings: (settings: {
    name?: string;
    slug?: string;
    seoTitle?: string;
    seoDescription?: string;
    faviconUrl?: string;
    openGraphImageUrl?: string;
  }) => void;
  initializeProject: (
    projectId: EntityId,
    meta?: Partial<WebsiteMeta>,
    schema?: TemplateSchema | null,
    persistedWebsite?: Website | null,
  ) => void;
  loadWebsite: (projectId: EntityId) => Website | null;
  saveWebsite: () => Promise<void>;
  createWebsite: (projectId: EntityId, meta?: Partial<WebsiteMeta>) => Website;
  createPage: (
    websiteId: EntityId,
    config?: Partial<Pick<Page, "name" | "slug">>,
  ) => Page;
  setActivePage: (pageId: EntityId) => void;
  addSection: (
    pageId: EntityId,
    type: SectionType,
    position?: number,
  ) => Section | null;
  removeSection: (sectionId: EntityId) => void;
  duplicateSection: (sectionId: EntityId) => Section | null;
  moveSection: (sectionId: EntityId, targetIndex: number) => void;
  moveSectionUp: (sectionId: EntityId) => void;
  moveSectionDown: (sectionId: EntityId) => void;
  updateSection: (sectionId: EntityId, patch: DeepPartial<Section>) => void;
  updateComponent: (
    componentId: EntityId,
    patch: DeepPartial<WebsiteComponent>,
  ) => void;
  saveDraft: () => Promise<void>;
  undo: () => void;
  redo: () => void;
  checkpoint: (actionLabel: string) => void;
  clearHistory: () => void;
  sendMessage: () => Promise<void>;
};

let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

const displayTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const makeSnapshot = (
  website: Website,
  activePageId: EntityId | null,
  actionLabel: string,
): WebsiteSnapshot => ({
  website: cloneWebsite(website),
  activePageId,
  actionLabel,
  timestamp: nowIso(),
});

const findSection = (
  website: Website,
  sectionId: EntityId,
): { page: Page; section: Section; index: number } | null => {
  for (const page of website.pages) {
    const index = page.sections.findIndex((section) => section.id === sectionId);
    const section = page.sections[index];
    if (section) return { page, section, index };
  }

  return null;
};

const findComponent = (
  website: Website,
  componentId: EntityId,
): {
  page: Page;
  section: Section;
  component: WebsiteComponent;
  componentIndex: number;
} | null => {
  for (const page of website.pages) {
    for (const section of page.sections) {
      const componentIndex = section.components.findIndex(
        (component) => component.id === componentId,
      );
      const component = section.components[componentIndex];
      if (component) return { page, section, component, componentIndex };
    }
  }

  return null;
};

const deepMerge = <T>(target: T, source: DeepPartial<T>): T => {
  if (
    !target ||
    !source ||
    typeof target !== "object" ||
    typeof source !== "object" ||
    Array.isArray(target) ||
    Array.isArray(source)
  ) {
    return source as T;
  }

  const output = { ...(target as Record<string, unknown>) };
  Object.entries(source as Record<string, unknown>).forEach(([key, value]) => {
    output[key] = deepMerge(output[key], value as DeepPartial<unknown>);
  });

  return output as T;
};

const withUpdatedTimestamp = (website: Website): Website => ({
  ...website,
  updatedAt: nowIso(),
  version: website.version + 1,
});

const scheduleAutoSave = (website: Website) => {
  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    editorPersistence.saveWebsite(website);
    void editorPersistence.saveWebsiteRemote(website).catch((error: unknown) => {
      console.error("[StoneAI editor store] remote autosave failed", error);
    });
  }, 350);
};

const normalizeWebsite = (website: Website): Website => ({
  ...website,
  pages: website.pages.map((page) => ({
    ...page,
    sections: page.sections.map((section) => ({
      ...section,
      components: section.components.map((component) => ({
        ...component,
        styles: component.styles ?? {},
      })),
    })),
  })),
});

const textValue = (component: WebsiteComponent) => {
  const props = component.props as { text?: { raw?: string } };
  return props.text?.raw;
};

const websiteToTemplateSchema = (website: Website): TemplateSchema => ({
  id: "generated",
  sections: (website.pages[0]?.sections ?? []).map((section) => {
    const content: NonNullable<TemplateSchema["sections"][number]["content"]> = {};

    section.components.forEach((component) => {
      if (component.type === "text" || component.type === "richText") {
        const value = textValue(component);
        if (!value) return;
        if (component.name === "Headline" || component.name === "Heading") {
          content.heading = content.heading ?? value;
        } else if (component.name === "Legal") {
          content.footerLegal = value;
        } else {
          content.body = content.body ?? value;
        }
      }

      if (component.type === "button") {
        content.buttonLabel = (component.props as { label?: string }).label ?? content.buttonLabel;
      }

      if (component.type === "logo") {
        const props = component.props as { text?: string; imageSrc?: string | null };
        content.logo = props.text ?? content.logo;
        content.logoImage = props.imageSrc ?? content.logoImage;
      }

      if (component.type === "image") {
        const props = component.props as { src?: string };
        content.image = props.src ?? content.image;
      }

      if (component.type === "featureList") {
        content.features = (component.props as { items?: NonNullable<typeof content.features> }).items;
      }

      if (component.type === "pricingTable") {
        const tiers = (component.props as {
          tiers?: Array<{
            id: string;
            name: string;
            price: number;
            description?: string;
            features: string[];
            highlighted?: boolean;
          }>;
        }).tiers;
        content.pricing = tiers?.map((tier) => ({
          id: tier.id,
          name: tier.name,
          price: tier.price,
          description: tier.description ?? "",
          features: tier.features,
          highlighted: tier.highlighted,
        }));
      }

      if (component.type === "testimonialList") {
        content.testimonials = (component.props as { items?: NonNullable<typeof content.testimonials> }).items;
      }

      if (component.type === "faqList") {
        content.faqs = (component.props as { items?: NonNullable<typeof content.faqs> }).items;
      }

      if (component.type === "contactForm") {
        content.submitLabel = (component.props as { submitLabel?: string }).submitLabel ?? content.submitLabel;
      }
    });

    if (section.settings.backgroundImage) {
      content.backgroundImage = section.settings.backgroundImage;
    }

    return {
      id: section.id,
      type: section.type,
      content,
    };
  }),
});

const applyTemplateSchema = (
  website: Website,
  schema: TemplateSchema | null | undefined,
  force = false,
): Website => {
  if (!schema) {
    return website;
  }

  const hasSections = (website.pages[0]?.sections.length ?? 0) > 0;
  if (!force && hasSections && website.meta.templateId === schema.id) {
    return website;
  }

  const page = website.pages[0] ?? createWebsitePage(website.id, "Home", 0, "home");
  const sections = schema.sections.map((section, index) => {
    const created = {
      ...createSection(section.type, index),
      id: section.id,
    };
    const content = section.content;
    if (!content) return created;

    if (content.backgroundImage) {
      created.settings = {
        ...created.settings,
        backgroundImage: content.backgroundImage,
      };
      created.styles = {
        ...created.styles,
        background: {
          ...created.styles.background,
          image: content.backgroundImage,
        },
      };
    }

    created.components = created.components.map((component): WebsiteComponent => {
      if (
        component.type === "text" &&
        component.name === "Headline" &&
        content.heading
      ) {
        return {
          ...component,
          props: { ...component.props, text: { raw: content.heading } },
        } as WebsiteComponent;
      }

      if (
        component.type === "text" &&
        component.name === "Subheadline" &&
        content.body
      ) {
        return {
          ...component,
          props: { ...component.props, text: { raw: content.body } },
        } as WebsiteComponent;
      }

      if (
        component.type === "text" &&
        component.name === "Heading" &&
        content.heading
      ) {
        return {
          ...component,
          props: { ...component.props, text: { raw: content.heading } },
        } as WebsiteComponent;
      }

      if (
        component.type === "text" &&
        component.name === "Legal" &&
        content.footerLegal
      ) {
        return {
          ...component,
          props: { ...component.props, text: { raw: content.footerLegal } },
        } as WebsiteComponent;
      }

      if (
        component.type === "button" &&
        content.buttonLabel
      ) {
        return {
          ...component,
          props: { ...component.props, label: content.buttonLabel },
        } as WebsiteComponent;
      }

      if (component.type === "logo" && content.logo) {
        const props = component.props as { text: string; imageSrc: string | null };
        return {
          ...component,
          props: {
            ...props,
            text: content.logo,
            imageSrc: content.logoImage ?? props.imageSrc,
          },
        } as WebsiteComponent;
      }

      if (component.type === "featureList" && content.features) {
        return {
          ...component,
          props: { ...component.props, items: content.features },
        } as WebsiteComponent;
      }

      if (component.type === "pricingTable" && content.pricing) {
        return {
          ...component,
          props: {
            ...component.props,
            tiers: content.pricing.map((tier) => ({
              ...tier,
              cta: {
                id: `${tier.id}-cta`,
                label: `Choose ${tier.name}`,
                href: "#",
                variant: tier.highlighted ? "primary" : "secondary",
                openInNewTab: false,
              },
              highlighted: tier.highlighted ?? false,
            })),
          },
        } as WebsiteComponent;
      }

      if (component.type === "testimonialList" && content.testimonials) {
        return {
          ...component,
          props: { ...component.props, items: content.testimonials },
        } as WebsiteComponent;
      }

      if (component.type === "faqList" && content.faqs) {
        return {
          ...component,
          props: { ...component.props, items: content.faqs },
        } as WebsiteComponent;
      }

      if (component.type === "contactForm" && content.submitLabel) {
        return {
          ...component,
          props: { ...component.props, submitLabel: content.submitLabel },
        } as WebsiteComponent;
      }

      return component;
    });

    if (content.image) {
      created.components.push(
        createComponent(
          "image",
          "Template image",
          { src: content.image, alt: `${section.type} image`, objectFit: "contain" },
          created.components.length,
        ),
      );
    }

    if (content.gallery) {
      content.gallery.forEach((item) => {
        created.components.push(
          createComponent(
            "image",
            "Gallery image",
            { src: item.src, alt: item.alt, objectFit: "cover" },
            created.components.length,
          ),
        );
      });
    }

    return created;
  });
  const pages =
    website.pages.length === 0
      ? [{ ...page, sections }]
      : website.pages.map((candidate, index) =>
          index === 0 ? { ...candidate, sections } : candidate,
        );

  const hydrated = withUpdatedTimestamp({
    ...website,
    meta: {
      ...website.meta,
      templateId: schema.id,
    },
    pages,
  });

  return hydrated;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  device: "desktop",
  editorMode: "design",
  leftTab: "layers",
  rightTab: "layout",
  selectedSectionId: null,
  selectedComponentId: null,
  hoveredSectionId: null,
  zoom: 0.72,
  showGrid: true,
  aiOpen: false,
  aiInput: "",
  messages: [],
  aiTyping: false,
  leftWidth: 248,
  rightWidth: 280,
  bottomHeight: 260,
  website: null,
  activePageId: null,
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,
  past: [],
  future: [],
  maxHistoryLength: 100,

  setDevice: (device) => set({ device }),
  setEditorMode: (editorMode) => set({ editorMode }),
  setLeftTab: (leftTab) => set({ leftTab }),
  setRightTab: (rightTab) => set({ rightTab }),
  setSelectedId: (sectionId) =>
    set({ selectedSectionId: sectionId || null, selectedComponentId: null }),
  selectSection: (selectedSectionId) =>
    set({ selectedSectionId, selectedComponentId: null }),
  selectComponent: (selectedComponentId) => set({ selectedComponentId }),
  clearSelection: () =>
    set({ selectedSectionId: null, selectedComponentId: null }),
  hoverSection: (hoveredSectionId) => set({ hoveredSectionId }),
  setZoom: (updater) =>
    set((state) => ({
      zoom: typeof updater === "function" ? updater(state.zoom) : updater,
    })),
  setShowGrid: (showGrid) => set({ showGrid }),
  setAiOpen: (aiOpen) => set({ aiOpen }),
  setAiInput: (aiInput) => set({ aiInput }),
  updateWebsiteSettings: (settings) => {
    const state = get();
    if (!state.website) return;
    state.checkpoint("site-settings");

    set((current) => {
      if (!current.website) return current;

      const website = withUpdatedTimestamp({
        ...current.website,
        name: settings.name?.trim() || current.website.name,
        slug: settings.slug ? slugify(settings.slug) : current.website.slug,
        meta: {
          ...current.website.meta,
          title: settings.seoTitle?.trim() || current.website.meta.title,
          description: settings.seoDescription?.trim() ?? current.website.meta.description,
          favicon: settings.faviconUrl?.trim() || null,
          socialImage: settings.openGraphImageUrl?.trim() || null,
        },
        pages: current.website.pages.map((page, index) =>
          index === 0
            ? {
                ...page,
                seo: {
                  ...page.seo,
                  title: settings.seoTitle?.trim() || page.seo.title,
                  description: settings.seoDescription?.trim() ?? page.seo.description,
                },
              }
            : page,
        ),
      });
      scheduleAutoSave(website);

      return { website, isDirty: true };
    });
  },

  initializeProject: (projectId, meta = {}, schema = null, persistedWebsite = null) => {
    const current = get().website;
    if (current?.projectId === projectId) {
      return;
    }

    const restored = persistedWebsite ? normalizeWebsite(persistedWebsite) : get().loadWebsite(projectId);
    if (restored) {
      const hydrated = applyTemplateSchema(restored, schema);
      if (hydrated !== restored) {
        set({
          website: hydrated,
          activePageId: hydrated.pages[0]?.id ?? null,
          isDirty: false,
        });
        editorPersistence.saveWebsite(hydrated);
        void editorPersistence.saveWebsiteRemote(hydrated).catch((error: unknown) => {
          console.error("[StoneAI editor store] remote hydrate save failed", error);
        });
      }
      return;
    }

    const website = applyTemplateSchema(get().createWebsite(projectId, meta), schema);
    set({
      website,
      activePageId: website.pages[0]?.id ?? null,
      selectedSectionId: null,
      selectedComponentId: null,
      isDirty: false,
      past: [],
      future: [],
    });
    set({ isDirty: false, past: [], future: [] });
    const initialized = get().website;
    if (initialized) {
      editorPersistence.saveWebsite(initialized);
      void editorPersistence.saveWebsiteRemote(initialized).catch((error: unknown) => {
        console.error("[StoneAI editor store] remote initial save failed", error);
      });
    }
  },

  loadWebsite: (projectId) => {
    const restoredWebsite = editorPersistence.loadWebsite(projectId);
    const website = restoredWebsite ? normalizeWebsite(restoredWebsite) : null;
    if (!website) {
      return null;
    }

    set({
      website,
      activePageId: website.pages[0]?.id ?? null,
      selectedSectionId: null,
      selectedComponentId: null,
      isDirty: false,
      lastSavedAt: nowIso(),
      past: [],
      future: [],
    });

    return website;
  },

  saveWebsite: async () => {
    const { website } = get();
    if (!website) return;

    set({ isSaving: true });
    editorPersistence.saveWebsite(website);
    await editorPersistence.saveWebsiteRemote(website);
    await projectStorage.touchRemote(website.projectId);
    projectStorage.touch(website.projectId);
    set({ isSaving: false, isDirty: false, lastSavedAt: nowIso() });
  },

  createWebsite: (projectId, meta = {}) => {
    const website = createProjectWebsite(projectId, meta);

    set({
      website,
      activePageId: null,
      selectedSectionId: null,
      selectedComponentId: null,
      isDirty: true,
    });

    return website;
  },

  createPage: (websiteId, config = {}) => {
    const current = get().website;
    const page = createWebsitePage(
      websiteId,
      config.name ?? "New Page",
      current?.pages.length ?? 0,
      config.slug ?? slugify(config.name ?? "New Page"),
    );

    set((state) => {
      if (!state.website || state.website.id !== websiteId) return state;

      const website = withUpdatedTimestamp({
        ...state.website,
        pages: [...state.website.pages, page],
      });
      scheduleAutoSave(website);

      return {
        website,
        activePageId: page.id,
        isDirty: true,
      };
    });

    return page;
  },

  setActivePage: (activePageId) =>
    set({
      activePageId,
      selectedSectionId: null,
      selectedComponentId: null,
    }),

  addSection: (pageId, type, position) => {
    const state = get();
    const page = state.website?.pages.find((candidate) => candidate.id === pageId);
    if (!state.website || !page) return null;

    const section = createSection(type, page.sections.length);
    state.checkpoint(`add-section-${type}`);

    set((current) => {
      if (!current.website) return current;

      const pages = current.website.pages.map((candidate) => {
        if (candidate.id !== pageId) return candidate;

        const sections = [...candidate.sections];
        const index = Math.max(
          0,
          Math.min(position ?? sections.length, sections.length),
        );
        sections.splice(index, 0, section);
        reorderSections(sections);

        return { ...candidate, sections };
      });
      const website = withUpdatedTimestamp({ ...current.website, pages });
      scheduleAutoSave(website);

      return {
        website,
        selectedSectionId: section.id,
        selectedComponentId: null,
        isDirty: true,
      };
    });

    return section;
  },

  removeSection: (sectionId) => {
    const state = get();
    if (!state.website || !findSection(state.website, sectionId)) return;

    state.checkpoint("remove-section");

    set((current) => {
      if (!current.website) return current;

      const pages = current.website.pages.map((page) => {
        const sections = page.sections.filter(
          (section) => section.id !== sectionId,
        );
        reorderSections(sections);
        return { ...page, sections };
      });
      const website = withUpdatedTimestamp({ ...current.website, pages });
      scheduleAutoSave(website);

      return {
        website,
        selectedSectionId:
          current.selectedSectionId === sectionId
            ? null
            : current.selectedSectionId,
        selectedComponentId: null,
        isDirty: true,
      };
    });
  },

  duplicateSection: (sectionId) => {
    const state = get();
    if (!state.website) return null;

    const found = findSection(state.website, sectionId);
    if (!found) return null;

    const duplicate: Section = {
      ...cloneWebsite(found.section),
      id: crypto.randomUUID(),
      order: found.index + 1,
      locked: false,
      components: found.section.components.map((component) => ({
        ...cloneWebsite(component),
        id: crypto.randomUUID(),
      })),
    };

    state.checkpoint("duplicate-section");

    set((current) => {
      if (!current.website) return current;

      const pages = current.website.pages.map((page) => {
        if (page.id !== found.page.id) return page;

        const sections = [...page.sections];
        sections.splice(found.index + 1, 0, duplicate);
        reorderSections(sections);

        return { ...page, sections };
      });
      const website = withUpdatedTimestamp({ ...current.website, pages });
      scheduleAutoSave(website);

      return {
        website,
        selectedSectionId: duplicate.id,
        selectedComponentId: null,
        isDirty: true,
      };
    });

    return duplicate;
  },

  moveSection: (sectionId, targetIndex) => {
    const state = get();
    if (!state.website || !findSection(state.website, sectionId)) return;

    state.checkpoint("move-section");

    set((current) => {
      if (!current.website) return current;

      const pages = current.website.pages.map((page) => {
        const fromIndex = page.sections.findIndex(
          (section) => section.id === sectionId,
        );
        if (fromIndex < 0) return page;

        const sections = [...page.sections];
        const [section] = sections.splice(fromIndex, 1);
        if (!section) return page;

        const index = Math.max(0, Math.min(targetIndex, sections.length));
        sections.splice(index, 0, section);
        reorderSections(sections);

        return { ...page, sections };
      });
      const website = withUpdatedTimestamp({ ...current.website, pages });
      scheduleAutoSave(website);

      return { website, isDirty: true };
    });
  },

  moveSectionUp: (sectionId) => {
    const { website } = get();
    if (!website) return;
    const found = findSection(website, sectionId);
    if (!found || found.index === 0) return;
    get().moveSection(sectionId, found.index - 1);
  },

  moveSectionDown: (sectionId) => {
    const { website } = get();
    if (!website) return;
    const found = findSection(website, sectionId);
    if (!found || found.index >= found.page.sections.length - 1) return;
    get().moveSection(sectionId, found.index + 1);
  },

  updateSection: (sectionId, patch) => {
    const state = get();
    if (!state.website || !findSection(state.website, sectionId)) return;
    state.checkpoint("update-section");

    set((current) => {
      if (!current.website) return current;

      const pages = current.website.pages.map((page) => ({
        ...page,
        sections: page.sections.map((section) =>
          section.id === sectionId ? deepMerge(section, patch) : section,
        ),
      }));
      const website = withUpdatedTimestamp({ ...current.website, pages });
      scheduleAutoSave(website);

      return { website, isDirty: true };
    });
  },

  updateComponent: (componentId, patch) => {
    const state = get();
    if (!state.website || !findComponent(state.website, componentId)) return;
    state.checkpoint("update-component");

    set((current) => {
      if (!current.website) return current;

      const pages = current.website.pages.map((page) => ({
        ...page,
        sections: page.sections.map((section) => {
          const components = section.components.map((component) =>
            component.id === componentId ? deepMerge(component, patch) : component,
          );
          reorderComponents(components);
          return { ...section, components };
        }),
      }));
      const website = withUpdatedTimestamp({ ...current.website, pages });
      scheduleAutoSave(website);

      return { website, isDirty: true };
    });
  },

  saveDraft: async () => {
    await get().saveWebsite();
  },

  checkpoint: (actionLabel) => {
    const { website, activePageId, past, maxHistoryLength } = get();
    if (!website) return;

    set({
      past: [
        ...past.slice(Math.max(0, past.length - maxHistoryLength + 1)),
        makeSnapshot(website, activePageId, actionLabel),
      ],
      future: [],
    });
  },

  undo: () => {
    const { website, activePageId, past, future } = get();
    if (!website || past.length === 0) return;

    const previous = past[past.length - 1];
    if (!previous) return;
    scheduleAutoSave(previous.website);

    set({
      website: previous.website,
      activePageId: previous.activePageId,
      past: past.slice(0, -1),
      future: [makeSnapshot(website, activePageId, "undo"), ...future],
      selectedSectionId: null,
      selectedComponentId: null,
      isDirty: true,
    });
  },

  redo: () => {
    const { website, activePageId, past, future } = get();
    if (!website || future.length === 0) return;

    const next = future[0];
    if (!next) return;
    scheduleAutoSave(next.website);

    set({
      website: next.website,
      activePageId: next.activePageId,
      past: [...past, makeSnapshot(website, activePageId, "redo")],
      future: future.slice(1),
      selectedSectionId: null,
      selectedComponentId: null,
      isDirty: true,
    });
  },

  clearHistory: () => set({ past: [], future: [] }),

  sendMessage: async () => {
    const { aiInput, website } = get();
    const content = aiInput.trim();
    if (!content) return;

    const userMessage: EditorMessage = {
      role: "user",
      content,
      ts: displayTime(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      aiInput: "",
      aiTyping: true,
    }));

    if (!website) {
      set((state) => ({
        messages: [
          ...state.messages,
          {
            role: "ai",
            content: "Open a project before asking StoneAI to edit it.",
            ts: displayTime(),
          },
        ],
        aiTyping: false,
      }));
      return;
    }

    try {
      const response = await fetch("/api/ai/edit-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: website.projectId,
          instruction: content,
          websiteSchema: websiteToTemplateSchema(website),
        }),
      });
      const payload = (await response.json()) as
        | { summary: string; websiteSchema: TemplateSchema }
        | { error?: string };

      if (!response.ok || !("websiteSchema" in payload)) {
        throw new Error("error" in payload && payload.error ? payload.error : "StoneAI could not apply that edit.");
      }

      const current = get().website;
      if (!current) return;

      get().checkpoint("ai-edit");
      const updated = applyTemplateSchema(current, payload.websiteSchema, true);
      editorPersistence.saveWebsite(updated);
      await editorPersistence.saveWebsiteRemote(updated);
      await projectStorage.touchRemote(updated.projectId);

      set((state) => ({
        website: updated,
        activePageId: updated.pages[0]?.id ?? state.activePageId,
        selectedSectionId: null,
        selectedComponentId: null,
        isDirty: false,
        lastSavedAt: nowIso(),
        messages: [
          ...state.messages,
          {
            role: "ai",
            content: payload.summary,
            ts: displayTime(),
          },
        ],
        aiTyping: false,
      }));
    } catch (error) {
      console.error("[StoneAI editor AI] edit failed", error);
      set((state) => ({
        messages: [
          ...state.messages,
          {
            role: "ai",
            content: error instanceof Error ? error.message : "StoneAI could not apply that edit.",
            ts: displayTime(),
          },
        ],
        aiTyping: false,
      }));
    }
  },
}));
