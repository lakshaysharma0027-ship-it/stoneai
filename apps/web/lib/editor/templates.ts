import type { Website, WebsiteTemplate } from "./schema";
import {
  cloneWebsite,
  createComponent,
  createPage,
  createSection,
  createWebsite,
  nowIso,
} from "./websiteFactory";

const buildLaunchTemplate = (): Website => {
  const website = createWebsite("template-launchpad", {
    title: "Launchpad",
    description: "A focused launch site for early product validation.",
  });
  const page = createPage(website.id, "Home", 0, "home");

  const navbar = createSection("navbar", 0, "Navbar");
  navbar.components = [
    createComponent("logo", "Logo", { text: "Launchpad", imageSrc: null }, 0),
    createComponent(
      "navbarLinks",
      "Navigation links",
      {
        links: [
          { id: "launch-nav-features", label: "Features", href: "#features" },
          { id: "launch-nav-pricing", label: "Pricing", href: "#pricing" },
          { id: "launch-nav-contact", label: "Contact", href: "#contact" },
        ],
      },
      1,
    ),
  ];

  const hero = createSection("hero", 1, "Hero");
  hero.components = [
    createComponent(
      "text",
      "Headline",
      {
        text: { raw: "Launch your product with a site your team can edit" },
        semanticRole: "heading",
      },
      0,
    ),
    createComponent(
      "text",
      "Subheadline",
      {
        text: {
          raw: "StoneAI turns a clear prompt into structured website content, then keeps edits simple inside the editor.",
        },
        semanticRole: "body",
      },
      1,
    ),
    createComponent(
      "button",
      "Primary action",
      {
        id: "launch-hero-cta",
        label: "Start building",
        href: "#contact",
        variant: "primary",
        openInNewTab: false,
      },
      2,
    ),
  ];
  hero.styles.background = { color: "#f8fafc" };

  const features = createSection("features", 2, "Features");
  features.components = [
    createComponent(
      "text",
      "Heading",
      {
        text: { raw: "Built for content-led website workflows" },
        semanticRole: "heading",
      },
      0,
    ),
    createComponent(
      "featureList",
      "Features",
      {
        columns: 3,
        iconStyle: "filled",
        items: [
          {
            id: "launch-feature-ai",
            title: "AI-first creation",
            description: "Generate complete website JSON from a positioning prompt.",
          },
          {
            id: "launch-feature-editing",
            title: "Focused editing",
            description: "Adjust text, colors, spacing, images, and section order.",
          },
          {
            id: "launch-feature-publish",
            title: "Ready to publish",
            description: "Keep the content model aligned with deployment and domains.",
          },
        ],
      },
      1,
    ),
  ];

  const pricing = createSection("pricing", 3, "Pricing");
  pricing.components = [
    createComponent(
      "text",
      "Heading",
      { text: { raw: "Choose a plan when you are ready" }, semanticRole: "heading" },
      0,
    ),
    createComponent(
      "pricingTable",
      "Pricing tiers",
      {
        currency: "USD",
        billingToggle: true,
        tiers: [
          {
            id: "launch-pricing-starter",
            name: "Starter",
            price: 19,
            priceAnnual: 190,
            description: "For one editable website.",
            features: ["Website editor", "Template library", "Hosted publishing"],
            cta: {
              id: "launch-pricing-starter-cta",
              label: "Select Starter",
              href: "#contact",
              variant: "secondary",
              openInNewTab: false,
            },
            highlighted: false,
          },
          {
            id: "launch-pricing-growth",
            name: "Growth",
            price: 49,
            priceAnnual: 490,
            description: "For teams running multiple campaigns.",
            features: ["Multiple projects", "AI revisions", "Custom domains"],
            cta: {
              id: "launch-pricing-growth-cta",
              label: "Select Growth",
              href: "#contact",
              variant: "primary",
              openInNewTab: false,
            },
            highlighted: true,
          },
        ],
      },
      1,
    ),
  ];

  const contact = createSection("contact", 4, "Contact");
  contact.components = [
    createComponent(
      "text",
      "Heading",
      { text: { raw: "Tell us what you want to launch" }, semanticRole: "heading" },
      0,
    ),
    createComponent(
      "contactForm",
      "Contact form",
      {
        submitLabel: "Send request",
        fields: [
          {
            id: "launch-contact-email",
            label: "Work email",
            type: "email",
            required: true,
          },
          {
            id: "launch-contact-message",
            label: "Project brief",
            type: "textarea",
            required: true,
          },
        ],
      },
      1,
    ),
  ];

  const footer = createSection("footer", 5, "Footer");
  footer.components = [
    createComponent("logo", "Footer logo", { text: "Launchpad", imageSrc: null }, 0),
    createComponent(
      "text",
      "Legal",
      {
        text: { raw: "© Launchpad. All rights reserved." },
        semanticRole: "legal",
      },
      1,
    ),
  ];
  footer.styles.background = { color: "#080808" };
  footer.styles.typography = { color: "#f8fafc" };

  page.sections = [navbar, hero, features, pricing, contact, footer];
  website.pages = [page];
  website.updatedAt = nowIso();

  return website;
};

export const websiteTemplates: WebsiteTemplate[] = [
  {
    templateId: "launchpad",
    name: "Launchpad",
    category: "startup",
    thumbnail: "/templates/launchpad.png",
    websiteJson: buildLaunchTemplate(),
  },
];

export type TemplateService = {
  listTemplates: () => WebsiteTemplate[];
  getTemplate: (templateId: string) => WebsiteTemplate | null;
  createWebsiteFromTemplate: (
    templateId: string,
    projectId: string,
  ) => Website | null;
};

export const templateService: TemplateService = {
  listTemplates: () => websiteTemplates.map((template) => cloneWebsite(template)),

  getTemplate: (templateId) =>
    websiteTemplates.find((template) => template.templateId === templateId) ??
    null,

  createWebsiteFromTemplate: (templateId, projectId) => {
    const template = templateService.getTemplate(templateId);
    if (!template) return null;

    const website = cloneWebsite(template.websiteJson);
    const timestamp = nowIso();
    website.id = crypto.randomUUID();
    website.projectId = projectId;
    website.createdAt = timestamp;
    website.updatedAt = timestamp;
    website.version = 1;
    website.pages = website.pages.map((page) => ({
      ...page,
      id: crypto.randomUUID(),
      websiteId: website.id,
      sections: page.sections.map((section) => ({
        ...section,
        id: crypto.randomUUID(),
        components: section.components.map((component) => ({
          ...component,
          id: crypto.randomUUID(),
        })),
      })),
    }));

    return website;
  },
};
