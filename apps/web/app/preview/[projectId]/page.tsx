import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import type { Website } from "@/lib/editor/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { WebsiteRenderer } from "@/components/sites/WebsiteRenderer";

type PreviewPageProps = {
  params: Promise<{ projectId: string }>;
};

export const metadata: Metadata = {
  title: "StoneAI Preview",
  robots: { index: false, follow: false },
};

const isWebsite = (value: unknown): value is Website => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Partial<Website>;
  return typeof candidate.id === "string" && Array.isArray(candidate.pages);
};

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { projectId } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: websiteRow, error: websiteError } = await supabase
    .from("websites")
    .select("website")
    .eq("project_id", projectId)
    .maybeSingle();

  if (websiteError) throw websiteError;

  const website = isWebsite((websiteRow as { website?: unknown } | null)?.website)
    ? (websiteRow as { website: Website }).website
    : null;

  if (!website) {
    notFound();
  }

  if (website.meta.renderMode !== "cinematic_scroll" || !website.meta.cinematicExperience) {
    notFound();
  }

  return <WebsiteRenderer website={website} />;
}
