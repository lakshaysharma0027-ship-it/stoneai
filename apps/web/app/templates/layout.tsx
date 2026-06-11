import type { Metadata } from "next";
import { STONEAI_DEFAULT_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Templates",
  description: STONEAI_DEFAULT_DESCRIPTION,
  alternates: { canonical: "/templates" },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
