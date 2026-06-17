import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Website } from "@/lib/editor/schema";
import { buildCinematicWebsiteZip } from "@/lib/export/buildCinematicZip";

type RouteProps = { params: Promise<{ projectId: string }> };

export const maxDuration = 300;

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

    const { data: websiteRow, error: websiteError } = await supabase
      .from("websites")
      .select("website")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (websiteError) throw websiteError;

    const website = (websiteRow as { website?: Website } | null)?.website;
    const experience = website?.meta.cinematicExperience;

    if (!website || !experience) {
      return NextResponse.json(
        { error: "Cinematic website not found for this project." },
        { status: 404 },
      );
    }

    const { data: project } = await supabase
      .from("projects")
      .select("name")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .maybeSingle();

    const projectName = (project as { name?: string } | null)?.name ?? website.name ?? "stoneai-site";
    const zipBuffer = await buildCinematicWebsiteZip(projectName, experience);
    const filename = `${projectName.replace(/[^\w\-]+/g, "-") || "stoneai-site"}.zip`;

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[StoneAI export zip] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not export website." },
      { status: 500 },
    );
  }
}
