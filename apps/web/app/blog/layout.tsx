import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import "@/components/blog/blog.css";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "AI website builder guides, comparisons, alternatives, and industry playbooks from StoneAI. Learn how to build, launch, and grow with AI.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "StoneAI Blog — AI Website Builder Guides & Comparisons",
    description:
      "Buyer-intent SEO guides for AI website builders, Lovable alternatives, Framer alternatives, and more.",
    url: "/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>;
}
