export type Template = {
  id: number;
  name: string;
  category: string;
  description: string;
  pages: number;
  components: number;
  uses: number;
  updatedAt: string;
  featured: boolean;
  badge?: string;
  desktopScreenshot?: string;
  mobileScreenshot?: string;
  bgColor: string;
};

export const templates: Template[] = [
  {
    id: 1,
    name: "SaaSCandy",
    category: "SaaS",
    description: "Modern SaaS landing page with polished product sections.",
    pages: 5,
    components: 28,
    uses: 3800,
    updatedAt: "2026-06-08",
    featured: true,
    badge: "Featured",
    desktopScreenshot: "/templates/saascandy.jpg",
    mobileScreenshot: "/templates/saascandy.jpg",
    bgColor: "#111",
  },
  {
    id: 2,
    name: "Pixelize",
    category: "Agency",
    description: "Creative agency layout for services, work, and pricing.",
    pages: 6,
    components: 34,
    uses: 2100,
    updatedAt: "2026-06-08",
    featured: true,
    badge: "Featured",
    desktopScreenshot: "/templates/pixelize.jpg",
    mobileScreenshot: "/templates/pixelize.jpg",
    bgColor: "#0a0a0a",
  },
  {
    id: 3,
    name: "Crypto",
    category: "Fintech",
    description: "Crypto product homepage with conversion-focused sections.",
    pages: 5,
    components: 31,
    uses: 1700,
    updatedAt: "2026-06-08",
    featured: false,
    desktopScreenshot: "/templates/crypto.jpg",
    mobileScreenshot: "/templates/crypto.jpg",
    bgColor: "#111",
  },
  {
    id: 4,
    name: "Dsign",
    category: "Design",
    description: "Design studio website for portfolios and service teams.",
    pages: 5,
    components: 26,
    uses: 1400,
    updatedAt: "2026-06-08",
    featured: false,
    desktopScreenshot: "/templates/dsign.jpg",
    mobileScreenshot: "/templates/dsign.jpg",
    bgColor: "#0a0a0a",
  },
];
