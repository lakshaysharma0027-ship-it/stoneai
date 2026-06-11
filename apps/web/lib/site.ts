export const STONEAI_ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_STONEAI_ROOT_DOMAIN ?? "stoneai.in";

export const STONEAI_APP_DOMAIN =
  process.env.NEXT_PUBLIC_STONEAI_APP_HOST ?? "app.stoneai.in";

export const STONEAI_SITE_URL = `https://${STONEAI_ROOT_DOMAIN}`;

export const STONEAI_APP_URL = `https://${STONEAI_APP_DOMAIN}`;

export const STONEAI_CONTACT_EMAIL = "contact@stoneai.in";

export const STONEAI_X_URL = "https://x.com/StoneAIusa";

export const STONEAI_DEFAULT_DESCRIPTION =
  "From idea to live website in minutes. AI website generation, editing, publishing, domains, and templates for premium teams.";

export const STONEAI_COMPANY = {
  name: "StoneAI",
  legalName: "StoneAI",
  url: STONEAI_SITE_URL,
  appUrl: STONEAI_APP_URL,
  email: STONEAI_CONTACT_EMAIL,
  xUrl: STONEAI_X_URL,
  locations: "New York, USA + New Delhi, IN",
} as const;
