export const normalizeDomainName = (domain: string) =>
  domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");

export const STONEAI_ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_STONEAI_ROOT_DOMAIN ?? "stoneai.in";

export const STONEAI_CUSTOM_DOMAIN_TARGET =
  process.env.NEXT_PUBLIC_STONEAI_CUSTOM_DOMAIN_TARGET ?? STONEAI_ROOT_DOMAIN;

export const STONEAI_APP_HOST =
  process.env.NEXT_PUBLIC_STONEAI_APP_HOST ?? `app.${STONEAI_ROOT_DOMAIN}`;

export const STONEAI_APP_HOSTS = [
  STONEAI_APP_HOST,
  ...(process.env.NEXT_PUBLIC_STONEAI_APP_HOSTS ?? "")
    .split(",")
    .map((host) => normalizeDomainName(host))
    .filter(Boolean),
];
