import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TemplateSchema } from "@/lib/templateSchemas";
import { aiPersistenceService } from "@/services/ai/aiPersistenceService";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { historyId?: string };
    const historyId = payload.historyId?.trim();

    if (!historyId) {
      return NextResponse.json({ error: "History version is required." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && userError.message !== "Auth session missing!") throw userError;
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to restore AI history." }, { status: 401 });
    }

    const { data: history, error: historyError } = await supabase
      .from("ai_generation_history")
      .select("project_id,prompt,generated_schema")
      .eq("id", historyId)
      .single();

    if (historyError) throw historyError;
    const row = history as {
      project_id: string | null;
      prompt: string;
      generated_schema: TemplateSchema;
    };

    if (!row.project_id) {
      return NextResponse.json({ error: "This history item is not attached to a project." }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("projects")
      .update({ website_schema: row.generated_schema })
      .eq("id", row.project_id);

    if (updateError) throw updateError;

    await aiPersistenceService.recordHistory(supabase, {
      userId: user.id,
      projectId: row.project_id,
      prompt: `Restore: ${row.prompt}`,
      generatedSchema: row.generated_schema,
      generationType: "restore",
    });

    return NextResponse.json({
      projectId: row.project_id,
      websiteSchema: row.generated_schema,
    });
  } catch (error) {
    console.error("[StoneAI AI history restore] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not restore AI history." },
      { status: 500 },
    );
  }
}
