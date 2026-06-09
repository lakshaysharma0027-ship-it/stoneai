import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && userError.message !== "Auth session missing!") throw userError;
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to view AI history." }, { status: 401 });
    }

    let query = supabase
      .from("ai_generation_history")
      .select("id,project_id,prompt,generated_schema,generation_type,created_at")
      .order("created_at", { ascending: false });

    if (projectId) query = query.eq("project_id", projectId);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ history: data ?? [] });
  } catch (error) {
    console.error("[StoneAI AI history] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load AI history." },
      { status: 500 },
    );
  }
}
