import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loadProjectWebsite } from "@/lib/sites/loadProjectWebsite";
import { WebsiteRenderer } from "@/components/sites/WebsiteRenderer";

type EmbedPageProps = {
  params: Promise<{ projectId: string }>;
};

export const metadata: Metadata = {
  title: "StoneAI Preview",
  robots: { index: false, follow: false },
};

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { projectId } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const website = await loadProjectWebsite(supabase, user.id, projectId);
  if (!website) notFound();

  return (
    <div style={{ margin: 0, padding: 0, minHeight: "100vh", background: "#050505" }}>
      <WebsiteRenderer website={website} />
    </div>
  );
}
