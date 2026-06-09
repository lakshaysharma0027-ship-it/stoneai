import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicSiteUrl } from "@/lib/sites/siteResolver";

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && userError.message !== "Auth session missing!") throw userError;
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to view sites." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("sites")
      .select("id,project_id,slug,status,seo_title,seo_description,favicon_url,open_graph_image_url,created_at,updated_at,site_analytics(page_views,unique_visitors,last_visit,publish_date)")
      .order("updated_at", { ascending: false });

    if (error) throw error;
    const origin = new URL(request.url).origin;

    return NextResponse.json({
      sites: (data ?? []).map((site) => ({
        ...site,
        public_url: getPublicSiteUrl((site as { slug: string }).slug, origin),
      })),
    });
  } catch (error) {
    console.error("[StoneAI sites] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load sites." },
      { status: 500 },
    );
  }
}
