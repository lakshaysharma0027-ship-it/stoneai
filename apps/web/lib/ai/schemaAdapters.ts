import type { Website, WebsiteComponent } from "@/lib/editor/schema";
import type { TemplateSchema, TemplateSectionSchema } from "@/lib/templateSchemas";

const textFromComponent = (component: WebsiteComponent) => {
  if (component.type !== "text" && component.type !== "richText") return null;
  const props = component.props as { text?: { raw?: string } };
  return props.text?.raw ?? null;
};

export const websiteToTemplateSchema = (website: Website): TemplateSchema => {
  const page = website.pages[0];

  return {
    id: "generated",
    sections:
      page?.sections.map((section): TemplateSectionSchema => {
        const content: TemplateSectionSchema["content"] = {};

        section.components.forEach((component) => {
          const text = textFromComponent(component);
          if (
            text &&
            component.name.toLowerCase().includes("headline") &&
            !content.heading
          ) {
            content.heading = text;
          }
          if (
            text &&
            component.name.toLowerCase().includes("subheadline") &&
            !content.body
          ) {
            content.body = text;
          }
          if (component.type === "button") {
            const props = component.props as { label?: string };
            content.buttonLabel = props.label;
          }
          if (component.type === "logo") {
            const props = component.props as { text?: string; imageSrc?: string | null };
            content.logo = props.text;
            content.logoImage = props.imageSrc ?? undefined;
          }
          if (component.type === "featureList") {
            const props = component.props as { items?: NonNullable<TemplateSectionSchema["content"]>["features"] };
            content.features = props.items;
          }
          if (component.type === "pricingTable") {
            const props = component.props as {
              tiers?: Array<{
                id: string;
                name: string;
                price: number;
                description?: string;
                features: string[];
                highlighted?: boolean;
              }>;
            };
            content.pricing = props.tiers?.map((tier) => ({
              id: tier.id,
              name: tier.name,
              price: tier.price,
              description: tier.description ?? "",
              features: tier.features,
              highlighted: tier.highlighted,
            }));
          }
          if (component.type === "testimonialList") {
            const props = component.props as { items?: NonNullable<TemplateSectionSchema["content"]>["testimonials"] };
            content.testimonials = props.items;
          }
          if (component.type === "faqList") {
            const props = component.props as { items?: NonNullable<TemplateSectionSchema["content"]>["faqs"] };
            content.faqs = props.items;
          }
          if (component.type === "contactForm") {
            const props = component.props as { submitLabel?: string };
            content.submitLabel = props.submitLabel;
          }
        });

        return {
          id: section.id,
          type: section.type,
          content,
        };
      }) ?? [],
  };
};
