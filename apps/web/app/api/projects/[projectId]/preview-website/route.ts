import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loadProjectWebsite } from "@/lib/sites/loadProjectWebsite";

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

    const website = await loadProjectWebsite(supabase, user.id, projectId);
    if (!website) {
      return NextResponse.json(
        { error: "Website not found. Try regenerating this project." },
        { status: 404 },
      );
    }

    return NextResponse.json({ website });
  } catch (error) {
    console.error("[StoneAI preview-website] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load preview." },
      { status: 500 },
    );
  }
}
