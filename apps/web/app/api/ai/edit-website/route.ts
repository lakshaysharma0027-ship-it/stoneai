import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { openAIProvider } from "@/lib/ai/providers/openai";
import type { TemplateSchema } from "@/lib/templateSchemas";
import { aiPersistenceService } from "@/services/ai/aiPersistenceService";
import { getCreditCost } from "@/lib/billing/credits";
import { creditService } from "@/services/billing/creditService";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      projectId?: string;
      instruction?: string;
      websiteSchema?: TemplateSchema;
    };
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

    const creditCost = getCreditCost("ai_edit");
    const subscription = await creditService.ensureSubscription(supabase, user.id);
    if (subscription.creditsRemaining < creditCost) {
      return NextResponse.json(
        { error: "You are out of credits. Upgrade your plan to edit with AI." },
        { status: 402 },
      );
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id,name")
      .eq("id", projectId)
      .single();

    if (projectError) throw projectError;

    const edited = await openAIProvider.editWebsite({
      website: {
        id: projectId,
        name: (project as { name?: string } | null)?.name ?? "Generated Website",
        prompt: instruction,
        industry: "Startup",
        style: "Premium",
        pages: [],
      },
      instruction,
      websiteSchema: payload.websiteSchema,
    });

    await creditService.consumeCredits(supabase, {
      userId: user.id,
      eventType: "ai_edit",
      description: "AI Edit",
    });

    const { error: updateError } = await supabase
      .from("projects")
      .update({ website_schema: edited.data.websiteSchema })
      .eq("id", projectId);

    if (updateError) throw updateError;

    await aiPersistenceService.recordHistory(supabase, {
      userId: user.id,
      projectId,
      prompt: instruction,
      generatedSchema: edited.data.websiteSchema,
      generationType: "edit",
    });
    await aiPersistenceService.recordUsage(supabase, {
      userId: user.id,
      projectId,
      requestType: "edit",
      usage: edited.usage,
    });

    return NextResponse.json(edited.data);
  } catch (error) {
    console.error("[StoneAI OpenAI edit] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not edit website." },
      { status: 500 },
    );
  }
}
