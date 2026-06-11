import type { Metadata } from "next";
import { STONEAI_DEFAULT_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: STONEAI_DEFAULT_DESCRIPTION,
  alternates: { canonical: "/pricing" },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
