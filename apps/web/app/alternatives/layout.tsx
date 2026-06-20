import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import "@/components/blog/blog.css";

export const metadata: Metadata = {
  title: "Alternatives",
  description: "Compare StoneAI to Lovable, Framer, Bolt, and other AI website builders.",
  robots: { index: true, follow: true },
};

export default function AlternativesLayout({ children }: { children: React.ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>;
}
