import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { openAIProvider } from "@/lib/ai/providers/openai";
import type { OpenAIWebsiteGenerationInput } from "@/lib/ai/providers/openai";
import type { TemplateSchema } from "@/lib/templateSchemas";
import type { StoredProject } from "@/lib/projects";
import { aiPersistenceService } from "@/services/ai/aiPersistenceService";
import { getCreditCost } from "@/lib/billing/credits";
import { creditService } from "@/services/billing/creditService";
import { planLimitService } from "@/services/billing/planLimitService";

type ProjectRow = {
  id: string;
  name: string;
  template_id: "generated";
  website_schema: TemplateSchema;
  created_at: string;
  updated_at: string;
};

const toStoredProject = (project: ProjectRow): StoredProject => ({
  id: project.id,
  name: project.name,
  templateId: project.template_id,
  websiteSchema: project.website_schema,
  createdAt: new Date(project.created_at).getTime(),
  updatedAt: new Date(project.updated_at).getTime(),
});

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<OpenAIWebsiteGenerationInput>;
    const prompt = payload.prompt?.trim();
    const businessName = payload.businessName?.trim();
    const description = payload.description?.trim();

    if (!prompt || !businessName || !description) {
      return NextResponse.json(
        { error: "Business name, description, and prompt are required." },
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
      return NextResponse.json({ error: "You must be logged in to generate websites." }, { status: 401 });
    }

    const creditCost = getCreditCost("generate_website");
    const subscription = await creditService.ensureSubscription(supabase, user.id);
    try {
      planLimitService.assertHasCredits(subscription, creditCost, "generate websites");
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "You are out of credits." },
        { status: 402 },
      );
    }

    const generated = await openAIProvider.generateWebsite({
      prompt,
      businessName,
      description,
      industry: payload.industry ?? "Auto",
      style: payload.style ?? "Premium",
      colorPreference: payload.colorPreference,
      websiteType: payload.websiteType,
    });

    await creditService.consumeCredits(supabase, {
      userId: user.id,
      eventType: "generate_website",
      description: "Generate Website",
    });

    const projectId = crypto.randomUUID();
    const { data, error } = await supabase
      .from("projects")
      .insert({
        id: projectId,
        user_id: user.id,
        name: generated.data.projectName,
        template_id: "generated",
        website_schema: generated.data.websiteSchema,
      })
      .select("id,name,template_id,website_schema,created_at,updated_at")
      .single();

    if (error) throw error;

    await aiPersistenceService.recordHistory(supabase, {
      userId: user.id,
      projectId,
      prompt,
      generatedSchema: generated.data.websiteSchema,
      generationType: "generate",
    });
    await aiPersistenceService.recordUsage(supabase, {
      userId: user.id,
      projectId,
      requestType: "generate",
      usage: generated.usage,
    });

    return NextResponse.json({
      project: toStoredProject(data as ProjectRow),
      websiteSchema: generated.data.websiteSchema,
      seo: generated.data.seo,
    });
  } catch (error) {
    console.error("[StoneAI OpenAI generate] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not generate website." },
      { status: 500 },
    );
  }
}
