import type { ComponentType, SectionType } from "@/lib/editor/schema";

export type AICapabilityMap = {
  canAddSection: boolean;
  canRemoveSection: boolean;
  canModifyText: boolean;
  canModifyStyles: boolean;
  allowedPropPaths: string[];
  forbiddenPropPaths: string[];
};

export type SectionRegistryEntry = {
  type: SectionType;
  displayName: string;
  icon: string;
  aiCapabilities: AICapabilityMap;
};

export type ComponentRegistryEntry = {
  type: ComponentType;
  displayName: string;
  icon: string;
};

const sectionCapabilities: AICapabilityMap = {
  canAddSection: true,
  canRemoveSection: true,
  canModifyText: true,
  canModifyStyles: true,
  allowedPropPaths: ["name", "components", "styles", "settings", "visibility"],
  forbiddenPropPaths: ["id", "order", "locked"],
};

const sectionEntries: SectionRegistryEntry[] = [
  { type: "navbar", displayName: "Navbar", icon: "page", aiCapabilities: sectionCapabilities },
  { type: "hero", displayName: "Hero", icon: "layers", aiCapabilities: sectionCapabilities },
  { type: "features", displayName: "Features", icon: "component", aiCapabilities: sectionCapabilities },
  { type: "pricing", displayName: "Pricing", icon: "component", aiCapabilities: sectionCapabilities },
  { type: "testimonials", displayName: "Testimonials", icon: "component", aiCapabilities: sectionCapabilities },
  { type: "faq", displayName: "FAQ", icon: "page", aiCapabilities: sectionCapabilities },
  { type: "cta", displayName: "CTA", icon: "sparkle", aiCapabilities: sectionCapabilities },
  { type: "contact", displayName: "Contact", icon: "page", aiCapabilities: sectionCapabilities },
  { type: "gallery", displayName: "Gallery", icon: "assets", aiCapabilities: sectionCapabilities },
  { type: "stats", displayName: "Stats", icon: "component", aiCapabilities: sectionCapabilities },
  { type: "logos", displayName: "Logos", icon: "star", aiCapabilities: sectionCapabilities },
  { type: "footer", displayName: "Footer", icon: "page", aiCapabilities: sectionCapabilities },
  { type: "custom", displayName: "Custom", icon: "component", aiCapabilities: sectionCapabilities },
];

const componentEntries: ComponentRegistryEntry[] = [
  { type: "text", displayName: "Text", icon: "type" },
  { type: "richText", displayName: "Rich text", icon: "type" },
  { type: "button", displayName: "Button", icon: "radius" },
  { type: "image", displayName: "Image", icon: "assets" },
  { type: "linkList", displayName: "Links", icon: "link" },
  { type: "featureList", displayName: "Feature list", icon: "component" },
  { type: "pricingTable", displayName: "Pricing table", icon: "component" },
  { type: "testimonialList", displayName: "Testimonials", icon: "component" },
  { type: "faqList", displayName: "FAQ list", icon: "page" },
  { type: "contactForm", displayName: "Contact form", icon: "page" },
  { type: "navbarLinks", displayName: "Navigation links", icon: "link" },
  { type: "logo", displayName: "Logo", icon: "star" },
];

class ComponentRegistryClass {
  private sections = new Map<SectionType, SectionRegistryEntry>();
  private components = new Map<ComponentType, ComponentRegistryEntry>();

  constructor() {
    sectionEntries.forEach((entry) => this.sections.set(entry.type, entry));
    componentEntries.forEach((entry) => this.components.set(entry.type, entry));
  }

  resolve(type: SectionType): SectionRegistryEntry {
    const entry = this.sections.get(type);
    if (!entry) {
      throw new Error(`No section registry entry found for "${type}".`);
    }
    return entry;
  }

  resolveComponent(type: ComponentType): ComponentRegistryEntry {
    const entry = this.components.get(type);
    if (!entry) {
      throw new Error(`No component registry entry found for "${type}".`);
    }
    return entry;
  }

  listAll(): SectionRegistryEntry[] {
    return Array.from(this.sections.values());
  }

  listComponents(): ComponentRegistryEntry[] {
    return Array.from(this.components.values());
  }
}

export const ComponentRegistry = new ComponentRegistryClass();
