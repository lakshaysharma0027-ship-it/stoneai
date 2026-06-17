import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { templateSchemaToWebsite } from "@/lib/editor/applyTemplateSchema";
import type { Website } from "@/lib/editor/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TemplateSchema } from "@/lib/templateSchemas";
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

  let website: Website | null = isWebsite((websiteRow as { website?: unknown } | null)?.website)
    ? ((websiteRow as { website: Website }).website)
    : null;

  if (!website) {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("name,website_schema")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (projectError) throw projectError;
    const schema = (project as { website_schema?: TemplateSchema; name?: string } | null)?.website_schema;
    if (!schema) notFound();

    website = templateSchemaToWebsite(
      projectId,
      (project as { name?: string }).name ?? "Generated Website",
      schema,
    );
  }

  return <WebsiteRenderer website={website} />;
};
