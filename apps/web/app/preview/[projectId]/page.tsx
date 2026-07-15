import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loadProjectWebsite } from "@/lib/sites/loadProjectWebsite";
import { WebsiteRenderer } from "@/components/sites/WebsiteRenderer";

type PreviewPageProps = {
  params: Promise<{ projectId: string }>;
};

export const metadata: Metadata = {
  title: "StoneAI Preview",
  robots: { index: false, follow: false },
};

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { projectId } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const website = await loadProjectWebsite(supabase, user.id, projectId);
  if (!website) notFound();

  if (website.meta.renderMode === "template_html" && website.meta.templateId) {
    redirect(`/api/projects/${projectId}/template-html`);
  }

  return <WebsiteRenderer website={website} />;
}
