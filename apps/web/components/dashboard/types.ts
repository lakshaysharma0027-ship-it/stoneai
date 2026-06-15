import type { WebsiteIndustry, WebsiteStyle } from "@/lib/ai";

export type DashboardView =
  | "overview"
  | "projects"
  | "generate-website"
  | "website-ready"
  | "generate-image"
  | "generate-video"
  | "templates"
  | "domains"
  | "analytics"
  | "billing"
  | "settings"
  /** @deprecated aliases */
  | "generate"
  | "media"
  | "team";

export type BillingPlanId = "free_trial" | "basic" | "basic_plus" | "pro" | "premium";

export type PublishedSiteRow = {
  id: string;
  project_id: string;
  slug: string;
  status: "draft" | "published" | "unpublished";
  seo_title: string | null;
  updated_at: string;
  public_url: string;
  site_analytics?: Array<{
    page_views: number;
    unique_visitors: number;
    last_visit: string | null;
    publish_date: string | null;
  }>;
};

export type BillingSummary = {
  subscription: {
    plan: BillingPlanId;
    creditsRemaining: number;
    monthlyCredits: number;
    status: "active" | "trialing" | "past_due" | "canceled";
    subscriptionId: string | null;
    renewalDate: string | null;
    billingCycle: "monthly" | "yearly";
    cancelAtPeriodEnd: boolean;
  };
  plan: { id: BillingPlanId; name: string; monthlyCredits: number; siteLimit: number };
};

export type MediaGenerationRow = {
  id: string;
  media_type: "image" | "video";
  capability: string;
  prompt: string;
  status: "pending" | "processing" | "completed" | "failed";
  credits_used: number;
  asset_url: string | null;
  error_message: string | null;
  created_at: string;
};

export type CustomDomainRow = {
  id: string;
  siteId: string | null;
  domain: string;
  status: "pending" | "verified" | "active" | "failed";
  verificationToken: string;
  verificationType: "txt" | "cname";
  verificationHost: string;
  verificationValue: string;
  verifiedAt: string | null;
  lastCheckedAt: string | null;
  failureReason: string | null;
  createdAt: string;
};

export type AiHistoryRow = {
  id: string;
  project_id: string | null;
  prompt: string;
  generation_type: string | null;
  created_at: string;
};

export type CreditTransactionRow = {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
};

export type ProjectStatus = "live" | "draft" | "building" | "failed";

export type GenerateFormState = {
  businessName: string;
  prompt: string;
  description: string;
  industry: WebsiteIndustry | "Auto";
  style: WebsiteStyle;
  colorPreference: string;
  websiteType: string;
};

export type PipelineFormState = {
  templateId: string | null;
  businessName: string;
  websitePrompt: string;
  firstImagePrompt: string;
  lastImagePrompt: string;
  veoPrompt: string;
  presetHeroImageId: string;
};

export const PLAN_CARDS = [
  { id: "free_trial" as const, name: "Free Trial", credits: 100, sites: 1 },
  { id: "basic" as const, name: "Basic", credits: 1500, sites: 1 },
  { id: "basic_plus" as const, name: "Basic Plus", credits: 2500, sites: 2 },
  { id: "pro" as const, name: "Pro", credits: 6000, sites: 5 },
  { id: "premium" as const, name: "Premium", credits: 25000, sites: 30 },
];

export const normalizeView = (view: DashboardView): DashboardView => {
  if (view === "generate" || view === "media") return "generate-website";
  if (view === "team") return "settings";
  return view;
};

export const VIEW_TITLES: Record<string, string> = {
  overview: "Overview",
  projects: "Projects",
  "generate-website": "Create Website",
  "website-ready": "Website Ready",
  "generate-image": "Image Generation",
  "generate-video": "Video Generation",
  templates: "Templates",
  domains: "Domains",
  analytics: "Analytics",
  billing: "Billing",
  settings: "Settings",
};
