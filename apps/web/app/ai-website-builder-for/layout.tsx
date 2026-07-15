import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import "@/components/blog/blog.css";

export const metadata: Metadata = {
  title: "AI Website Builder by Industry",
  description: "StoneAI builds industry-specific websites with AI — real estate, SaaS, agencies, restaurants, and more.",
  robots: { index: false, follow: true },
};

export default function IndustryLayout({ children }: { children: React.ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>;
}
