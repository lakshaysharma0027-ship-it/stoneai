import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PipelineEditRequest } from "@/lib/pipeline/types";
import type { TemplateSchema } from "@/lib/templateSchemas";
import { pipelineService } from "@/services/ai/pipelineService";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<PipelineEditRequest>;
    const projectId = payload.projectId?.trim();
    const instruction = payload.instruction?.trim();

    if (!projectId || !instruction || !payload.websiteSchema) {
      return NextResponse.json(
        { error: "Project, instruction, and current website schema are required." },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && userError.message !== "Auth session missing!") throw userError;
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to edit websites." }, { status: 401 });
    }

    const result = await pipelineService.editWebsite(supabase, user.id, {
      projectId,
      instruction,
      websiteSchema: payload.websiteSchema as TemplateSchema,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[StoneAI pipeline edit] failed", error);
    const message = error instanceof Error ? error.message : "Could not edit website.";
    const status = message.includes("Premium") || message.includes("edits remaining") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
