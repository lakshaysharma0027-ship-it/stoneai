import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildTemplateSiteHtml } from "@/lib/templates/templateSiteHtml";
import type { PipelineMetadata } from "@/lib/pipeline/types";

type RouteProps = { params: Promise<{ projectId: string }> };

export async function GET(_request: Request, { params }: RouteProps) {
  try {
    const { projectId } = await params;
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && userError.message !== "Auth session missing!") throw userError;
    if (!user) {
      return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    }

    const { data: project, error } = await supabase
      .from("projects")
      .select("template_id,pipeline_metadata")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const metadata = (project as { pipeline_metadata?: PipelineMetadata }).pipeline_metadata;
    const templateId =
      metadata?.templateId ?? (project as { template_id?: string }).template_id ?? null;

    if (!templateId || metadata?.renderMode !== "template_html") {
      return NextResponse.json({ error: "This project is not a template website." }, { status: 400 });
    }

    const html = await buildTemplateSiteHtml(templateId, {
      replacementImageUrl: metadata.templateReplacementImageUrl,
      contentOverrides: metadata.templateContentOverrides,
    });

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[StoneAI template-html] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load template website." },
      { status: 500 },
    );
  }
}
