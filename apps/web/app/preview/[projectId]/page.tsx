import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Website } from "@/lib/editor/schema";
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

  const { data, error } = await supabase
    .from("websites")
    .select("website")
    .eq("project_id", projectId)
    .maybeSingle();

  if (error) throw error;
  const website = (data as { website?: unknown } | null)?.website;
  if (!isWebsite(website)) notFound();

  return <WebsiteRenderer website={website} />;
}
