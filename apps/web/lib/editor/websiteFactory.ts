import {
  WEBSITE_SCHEMA_VERSION,
  type ButtonComponentProps,
  type ComponentPropsByType,
  type ComponentType,
  type EntityId,
  type GlobalStyles,
  type Page,
  type Section,
  type SectionStyles,
  type SectionType,
  type Website,
  type WebsiteComponent,
  type WebsiteMeta,
} from "./schema";

export const createEntityId = (): EntityId => crypto.randomUUID();

export const nowIso = () => new Date().toISOString();

export const cloneWebsite = <T>(value: T): T => structuredClone(value);

export const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "untitled";

export const defaultGlobalStyles = (): GlobalStyles => ({
  colors: {
    background: "#ffffff",
    foreground: "#111827",
    primary: "#111827",
    secondary: "#f3f4f6",
    muted: "#6b7280",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    headingFontFamily: "Inter, system-ui, sans-serif",
    baseSize: "16px",
  },
  radius: "8px",
});

export const defaultSectionStyles = (): SectionStyles => ({
  layout: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "1120px",
  },
  spacing: {
    paddingTop: "80px",
    paddingRight: "24px",
    paddingBottom: "80px",
    paddingLeft: "24px",
    gap: "24px",
  },
  background: { color: "#ffffff" },
  typography: { color: "#111827" },
});

const emptyButton = (): ButtonComponentProps => ({
  id: createEntityId(),
  label: "",
  href: "#",
  variant: "primary",
  openInNewTab: false,
});

export function createComponent<TType extends ComponentType>(
  type: TType,
  name: string,
  props: ComponentPropsByType[TType],
  order: number,
): WebsiteComponent<TType> {
  return {
    id: createEntityId(),
    type,
    name,
    props,
    styles: {},
    order,
    visibility: "visible",
    locked: false,
  };
}

export const defaultComponentsForSection = (
  sectionType: SectionType,
): WebsiteComponent[] => {
  switch (sectionType) {
    case "navbar":
      return [
        createComponent("logo", "Logo", { text: "", imageSrc: null }, 0),
        createComponent("navbarLinks", "Navigation links", { links: [] }, 1),
        createComponent("button", "Navigation action", emptyButton(), 2),
      ];
    case "hero":
      return [
        createComponent(
          "text",
          "Headline",
          { text: { raw: "" }, semanticRole: "heading" },
          0,
        ),
        createComponent(
          "text",
          "Subheadline",
          { text: { raw: "" }, semanticRole: "body" },
          1,
        ),
        createComponent("button", "Primary action", emptyButton(), 2),
      ];
    case "features":
      return [
        createComponent(
          "text",
          "Heading",
          { text: { raw: "" }, semanticRole: "heading" },
          0,
        ),
        createComponent(
          "featureList",
          "Features",
          { columns: 3, iconStyle: "filled", items: [] },
          1,
        ),
      ];
    case "pricing":
      return [
        createComponent(
          "text",
          "Heading",
          { text: { raw: "" }, semanticRole: "heading" },
          0,
        ),
        createComponent(
          "pricingTable",
          "Pricing tiers",
          { currency: "USD", billingToggle: false, tiers: [] },
          1,
        ),
      ];
    case "testimonials":
      return [
        createComponent(
          "text",
          "Heading",
          { text: { raw: "" }, semanticRole: "heading" },
          0,
        ),
        createComponent(
          "testimonialList",
          "Testimonials",
          { displayStyle: "grid", items: [] },
          1,
        ),
      ];
    case "faq":
      return [
        createComponent(
          "text",
          "Heading",
          { text: { raw: "" }, semanticRole: "heading" },
          0,
        ),
        createComponent("faqList", "Questions", { items: [] }, 1),
      ];
    case "cta":
      return [
        createComponent(
          "text",
          "Heading",
          { text: { raw: "" }, semanticRole: "heading" },
          0,
        ),
        createComponent(
          "text",
          "Subheadline",
          { text: { raw: "" }, semanticRole: "body" },
          1,
        ),
        createComponent("button", "Primary action", emptyButton(), 2),
      ];
    case "contact":
      return [
        createComponent(
          "text",
          "Heading",
          { text: { raw: "" }, semanticRole: "heading" },
          0,
        ),
        createComponent(
          "contactForm",
          "Contact form",
          {
            submitLabel: "Send",
            fields: [
              {
                id: createEntityId(),
                label: "Email",
                type: "email",
                required: true,
              },
            ],
          },
          1,
        ),
      ];
    case "gallery":
      return [
        createComponent(
          "text",
          "Heading",
          { text: { raw: "" }, semanticRole: "heading" },
          0,
        ),
      ];
    case "stats":
      return [
        createComponent(
          "text",
          "Heading",
          { text: { raw: "" }, semanticRole: "heading" },
          0,
        ),
        createComponent(
          "featureList",
          "Stats",
          { columns: 3, iconStyle: "none", items: [] },
          1,
        ),
      ];
    case "logos":
      return [
        createComponent(
          "text",
          "Heading",
          { text: { raw: "" }, semanticRole: "heading" },
          0,
        ),
        createComponent(
          "featureList",
          "Logos",
          { columns: 4, iconStyle: "none", items: [] },
          1,
        ),
      ];
    case "footer":
      return [
        createComponent("logo", "Footer logo", { text: "", imageSrc: null }, 0),
        createComponent("linkList", "Footer links", { links: [] }, 1),
        createComponent(
          "text",
          "Legal",
          { text: { raw: "" }, semanticRole: "legal" },
          2,
        ),
      ];
    case "custom":
      return [
        createComponent(
          "richText",
          "Content",
          { text: { raw: "" }, semanticRole: "body" },
          0,
        ),
      ];
  }
};

export const createSection = (
  type: SectionType,
  order: number,
  name?: string,
): Section => ({
  id: createEntityId(),
  type,
  name: name ?? type.charAt(0).toUpperCase() + type.slice(1),
  components: defaultComponentsForSection(type),
  styles: defaultSectionStyles(),
  settings: {},
  visibility: "visible",
  order,
  locked: false,
});

export const createPage = (
  websiteId: EntityId,
  name: string,
  order: number,
  slug = slugify(name),
): Page => ({
  id: createEntityId(),
  websiteId,
  name,
  slug,
  sections: [],
  seo: {
    title: "",
    description: "",
    noIndex: false,
  },
  order,
  visibility: "visible",
});

export const createWebsite = (
  projectId: EntityId,
  meta: Partial<WebsiteMeta> = {},
): Website => {
  const timestamp = nowIso();
  const title = meta.title?.trim() || "Untitled Project";

  return {
    id: createEntityId(),
    projectId,
    schemaVersion: WEBSITE_SCHEMA_VERSION,
    name: title,
    slug: slugify(title),
    meta: {
      title,
      description: meta.description ?? "",
      favicon: meta.favicon ?? null,
      socialImage: meta.socialImage ?? null,
      lang: meta.lang ?? "en",
    },
    pages: [],
    globalStyles: defaultGlobalStyles(),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: 1,
  };
};

export const reorderSections = (sections: Section[]) => {
  sections.forEach((section, order) => {
    section.order = order;
  });
};

export const reorderComponents = (components: WebsiteComponent[]) => {
  components.forEach((component, order) => {
    component.order = order;
  });
};
