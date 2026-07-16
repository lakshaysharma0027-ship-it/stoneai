export const STONEAI_ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_STONEAI_ROOT_DOMAIN ?? "stoneai.in";

export const STONEAI_APP_DOMAIN =
  process.env.NEXT_PUBLIC_STONEAI_APP_HOST ?? "app.stoneai.in";

export const STONEAI_SITE_URL = `https://${STONEAI_ROOT_DOMAIN}`;

export const STONEAI_APP_URL = `https://${STONEAI_APP_DOMAIN}`;

export const STONEAI_CONTACT_EMAIL = "contact@stoneai.in";

export const STONEAI_X_URL = "https://x.com/StoneAIusa";

export const STONEAI_DEFAULT_DESCRIPTION =
  "StoneAI is an AI website builder that turns ideas into live sites in minutes. Generate, edit, and publish premium websites with 3D visuals, custom domains, and no code.";

export const STONEAI_COMPANY = {
  name: "StoneAI",
  legalName: "StoneAI",
  url: STONEAI_SITE_URL,
  appUrl: STONEAI_APP_URL,
  email: STONEAI_CONTACT_EMAIL,
  xUrl: STONEAI_X_URL,
  locations: "New York, USA + New Delhi, IN",
} as const;

export type StoneAIFounder = {
  name: string;
  role: string;
  image: string;
  bio: string;
  focus: string[];
};

export const STONEAI_FOUNDERS: readonly StoneAIFounder[] = [
  {
    name: "Aurnav Sharma",
    role: "Co-founder",
    image: "/team/aurnav-sharma.jpg",
    bio: "Aurnav architects StoneAI's core generation engine — from prompt-to-layout pipelines and visual editing systems to the infrastructure that ships sites to production in seconds. He obsesses over making AI output feel handcrafted, not templated.",
    focus: ["AI generation pipelines", "Visual editor architecture", "Publishing infrastructure"],
  },
  {
    name: "Lakshay Sharma",
    role: "Co-founder",
    image: "/team/lakshay-sharma.jpg",
    bio: "Lakshay leads product and platform engineering at StoneAI, building the workflows founders and agencies rely on every day — credits, domains, media generation, and the dashboard that ties it all together. He ships fast and thinks in systems.",
    focus: ["Product engineering", "Platform & integrations", "Media generation workflows"],
  },
] as const;
