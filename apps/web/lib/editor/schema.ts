export const WEBSITE_SCHEMA_VERSION = 1;

export type ISODateString = string;
export type EntityId = string;
export type DeviceMode = "desktop" | "tablet" | "mobile";
export type EditorMode = "design" | "preview";
export type Visibility = "visible" | "hidden";

export type SectionType =
  | "navbar"
  | "hero"
  | "features"
  | "pricing"
  | "testimonials"
  | "faq"
  | "cta"
  | "contact"
  | "gallery"
  | "stats"
  | "logos"
  | "footer"
  | "custom";

export type ComponentType =
  | "text"
  | "richText"
  | "button"
  | "image"
  | "linkList"
  | "featureList"
  | "pricingTable"
  | "testimonialList"
  | "faqList"
  | "contactForm"
  | "navbarLinks"
  | "logo";

export type RichText = {
  raw: string;
};

export type Cta = {
  id: EntityId;
  label: string;
  href: string;
  variant: "primary" | "secondary" | "ghost";
  openInNewTab: boolean;
};

export type WebsiteSEO = {
  title: string;
  description: string;
  noIndex: boolean;
  canonicalUrl?: string;
};

export type WebsiteMeta = {
  title: string;
  description: string;
  favicon: string | null;
  socialImage: string | null;
  lang: string;
  templateId?: string;
  renderMode?: "cinematic_scroll" | "schema";
  cinematicExperience?: import("@/lib/cinematic/types").CinematicExperience;
};

export type TypographyToken = {
  fontFamily: string;
  headingFontFamily?: string;
  baseSize: string;
};

export type ColorTokens = {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  muted: string;
};

export type GlobalStyles = {
  colors: ColorTokens;
  typography: TypographyToken;
  radius: string;
};

export type SectionStyles = {
  layout?: {
    display?: "block" | "flex" | "grid";
    flexDirection?: "row" | "column";
    alignItems?: string;
    justifyContent?: string;
    maxWidth?: string;
  };
  spacing?: {
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    gap?: string;
  };
  background?: {
    color?: string;
    image?: string;
  };
  typography?: {
    color?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: "left" | "center" | "right";
    lineHeight?: string;
    letterSpacing?: string;
  };
  border?: {
    color?: string;
    width?: string;
    radius?: string;
  };
};

export type ComponentStyles = {
  typography?: {
    color?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: "left" | "center" | "right";
    lineHeight?: string;
    letterSpacing?: string;
  };
  background?: {
    color?: string;
  };
  border?: {
    color?: string;
    width?: string;
    radius?: string;
  };
  spacing?: {
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
  };
};

export type TextComponentProps = {
  text: RichText;
  semanticRole?: "eyebrow" | "heading" | "body" | "caption" | "legal";
};

export type ButtonComponentProps = Cta;

export type ImageComponentProps = {
  src: string;
  alt: string;
  objectFit: "cover" | "contain";
};

export type LinkListComponentProps = {
  links: Array<{ id: EntityId; label: string; href: string }>;
};

export type FeatureListComponentProps = {
  columns: 2 | 3 | 4;
  iconStyle: "filled" | "outline" | "none";
  items: Array<{
    id: EntityId;
    icon?: string;
    imageSrc?: string;
    title: string;
    description: string;
  }>;
};

export type PricingTableComponentProps = {
  currency: string;
  billingToggle: boolean;
  tiers: Array<{
    id: EntityId;
    name: string;
    price: number;
    priceAnnual?: number;
    description?: string;
    features: string[];
    cta: Cta;
    highlighted: boolean;
  }>;
};

export type TestimonialListComponentProps = {
  displayStyle: "grid" | "carousel" | "masonry";
  items: Array<{
    id: EntityId;
    quote: string;
    author: string;
    role?: string;
    avatar?: string | null;
  }>;
};

export type FAQListComponentProps = {
  items: Array<{ id: EntityId; question: string; answer: string }>;
};

export type ContactFormComponentProps = {
  submitLabel: string;
  fields: Array<{
    id: EntityId;
    label: string;
    type: "text" | "email" | "textarea";
    required: boolean;
  }>;
};

export type LogoComponentProps = {
  text: string;
  imageSrc: string | null;
};

export type ComponentPropsByType = {
  text: TextComponentProps;
  richText: TextComponentProps;
  button: ButtonComponentProps;
  image: ImageComponentProps;
  linkList: LinkListComponentProps;
  featureList: FeatureListComponentProps;
  pricingTable: PricingTableComponentProps;
  testimonialList: TestimonialListComponentProps;
  faqList: FAQListComponentProps;
  contactForm: ContactFormComponentProps;
  navbarLinks: LinkListComponentProps;
  logo: LogoComponentProps;
};

export type WebsiteComponent<TType extends ComponentType = ComponentType> = {
  id: EntityId;
  type: TType;
  name: string;
  props: ComponentPropsByType[TType];
  styles: ComponentStyles;
  order: number;
  visibility: Visibility;
  locked: boolean;
};

export type SectionSettings = {
  layoutVariant?: string;
  backgroundImage?: string;
};

export type Section = {
  id: EntityId;
  type: SectionType;
  name: string;
  components: WebsiteComponent[];
  styles: SectionStyles;
  settings: SectionSettings;
  visibility: Visibility;
  order: number;
  locked: boolean;
};

export type Page = {
  id: EntityId;
  websiteId: EntityId;
  name: string;
  slug: string;
  sections: Section[];
  seo: WebsiteSEO;
  order: number;
  visibility: Visibility;
};

export type Website = {
  id: EntityId;
  projectId: EntityId;
  schemaVersion: typeof WEBSITE_SCHEMA_VERSION;
  name: string;
  slug: string;
  meta: WebsiteMeta;
  pages: Page[];
  globalStyles: GlobalStyles;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  version: number;
};

export type WebsiteSnapshot = {
  website: Website;
  activePageId: EntityId | null;
  actionLabel: string;
  timestamp: ISODateString;
};

export type ProjectStatus = "draft" | "published" | "archived";

export type Project = {
  id: EntityId;
  ownerId: EntityId;
  name: string;
  websiteId: EntityId;
  status: ProjectStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type DeploymentStatus = "queued" | "building" | "ready" | "failed";

export type Deployment = {
  id: EntityId;
  projectId: EntityId;
  websiteVersion: number;
  status: DeploymentStatus;
  url: string | null;
  errorMessage: string | null;
  createdAt: ISODateString;
};

export type DomainStatus = "pending" | "verified" | "misconfigured";

export type Domain = {
  id: EntityId;
  projectId: EntityId;
  hostname: string;
  status: DomainStatus;
  verificationToken: string;
  createdAt: ISODateString;
};

export type TemplateCategory =
  | "startup"
  | "saas"
  | "portfolio"
  | "agency"
  | "local-business";

export type WebsiteTemplate = {
  templateId: EntityId;
  name: string;
  category: TemplateCategory;
  thumbnail: string;
  websiteJson: Website;
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P];
};

export type EditorMessage = {
  role: "user" | "ai";
  content: string;
  ts: string;
};
