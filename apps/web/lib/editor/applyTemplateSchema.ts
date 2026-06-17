import type { TemplateSchema } from "@/lib/templateSchemas";
import type { Website, WebsiteComponent } from "./schema";
import {
  createComponent,
  createPage,
  createSection,
  createWebsite,
  nowIso,
} from "./websiteFactory";

const withUpdatedTimestamp = (website: Website): Website => ({
  ...website,
  updatedAt: nowIso(),
  version: website.version + 1,
});

export const applyTemplateSchema = (
  website: Website,
  schema: TemplateSchema | null | undefined,
  force = false,
): Website => {
  if (!schema) return website;

  const hasSections = (website.pages[0]?.sections.length ?? 0) > 0;
  if (!force && hasSections && website.meta.templateId === schema.id) {
    return website;
  }

  const page = website.pages[0] ?? createPage(website.id, "Home", 0, "home");
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
      if (component.type === "text" && component.name === "Headline" && content.heading) {
        return { ...component, props: { ...component.props, text: { raw: content.heading } } } as WebsiteComponent;
      }
      if (component.type === "text" && component.name === "Subheadline" && content.body) {
        return { ...component, props: { ...component.props, text: { raw: content.body } } } as WebsiteComponent;
      }
      if (component.type === "text" && component.name === "Heading" && content.heading) {
        return { ...component, props: { ...component.props, text: { raw: content.heading } } } as WebsiteComponent;
      }
      if (component.type === "text" && component.name === "Legal" && content.footerLegal) {
        return { ...component, props: { ...component.props, text: { raw: content.footerLegal } } } as WebsiteComponent;
      }
      if (component.type === "button" && content.buttonLabel) {
        return { ...component, props: { ...component.props, label: content.buttonLabel } } as WebsiteComponent;
      }
      if (component.type === "logo" && content.logo) {
        const props = component.props as { text: string; imageSrc: string | null };
        return {
          ...component,
          props: { ...props, text: content.logo, imageSrc: content.logoImage ?? props.imageSrc },
        } as WebsiteComponent;
      }
      if (component.type === "featureList" && content.features) {
        return { ...component, props: { ...component.props, items: content.features } } as WebsiteComponent;
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
        return { ...component, props: { ...component.props, items: content.testimonials } } as WebsiteComponent;
      }
      if (component.type === "faqList" && content.faqs) {
        return { ...component, props: { ...component.props, items: content.faqs } } as WebsiteComponent;
      }
      if (component.type === "contactForm" && content.submitLabel) {
        return { ...component, props: { ...component.props, submitLabel: content.submitLabel } } as WebsiteComponent;
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
      : website.pages.map((candidate, index) => (index === 0 ? { ...candidate, sections } : candidate));

  return withUpdatedTimestamp({
    ...website,
    meta: { ...website.meta, templateId: schema.id },
    pages,
  });
};

export const templateSchemaToWebsite = (
  projectId: string,
  name: string,
  schema: TemplateSchema,
): Website =>
  applyTemplateSchema(createWebsite(projectId, { title: name }), schema, true);
