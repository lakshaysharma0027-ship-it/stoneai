import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteResolver } from "@/lib/sites/siteResolver";
import { buildTemplateSiteHtml } from "@/lib/templates/templateSiteHtml";
import { resolvePublishedTemplateSiteOptions } from "@/lib/templates/resolveTemplateSiteOptions";

type RouteProps = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    const supabase = await createSupabaseServerClient();
    const site = await siteResolver.resolveByPathSlug(supabase, slug);

    if (!site) {
      return NextResponse.json({ error: "Site not found." }, { status: 404 });
    }

    const renderMode = site.publishedSchema.meta.renderMode;
    if (renderMode !== "template_html") {
      return NextResponse.json({ error: "This site is not a template website." }, { status: 400 });
    }

    const options = await resolvePublishedTemplateSiteOptions(
      supabase,
      site.projectId,
      site.publishedSchema,
    );

    if (!options) {
      return NextResponse.json({ error: "Template configuration not found." }, { status: 404 });
    }

    const html = await buildTemplateSiteHtml(options.templateId, {
      replacementImageUrl: options.replacementImageUrl,
      contentOverrides: options.contentOverrides,
    });

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error) {
    console.error("[StoneAI public template-html] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load site." },
      { status: 500 },
    );
  }
}
