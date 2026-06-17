import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { bedrockProvider } from "@/lib/ai/providers/bedrock";
import type { TemplateSchema } from "@/lib/templateSchemas";
import { aiPersistenceService } from "@/services/ai/aiPersistenceService";
import { getCreditCost } from "@/lib/billing/credits";
import { planHasFeature } from "@/lib/billing/planFeatures";
import { normalizeBillingPlanId } from "@/lib/billing/plans";
import type { PipelineMetadata } from "@/lib/pipeline/types";
import { creditService } from "@/services/billing/creditService";
import { planLimitService } from "@/services/billing/planLimitService";

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
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "You must be logged in to edit websites." }, { status: 401 });
    }

    const subscription = await creditService.ensureSubscription(supabase, user.id);
    const planId = normalizeBillingPlanId(subscription.plan);

    try {
      planLimitService.assertSubscriptionActive(subscription);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Subscription not active." },
        { status: 402 },
      );
    }

    if (!planHasFeature(planId, "ai_website_edit")) {
      return NextResponse.json(
        { error: "AI website edits are not included on your current plan." },
        { status: 403 },
      );
    }

    try {
      await planLimitService.assertWithinActionLimit(supabase, {
        userId: user.id,
        subscription,
        action: "aiEdits",
      });
      planLimitService.assertHasCredits(subscription, getCreditCost("ai_edit"), "edit with AI");
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Plan limit reached." },
        { status: 402 },
      );
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id,name,pipeline_metadata")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const metadata = ((project as { pipeline_metadata?: PipelineMetadata }).pipeline_metadata ??
      {}) as PipelineMetadata;

    const edited = await bedrockProvider.editWebsite({
      website: {
        id: projectId,
        name: (project as { name?: string }).name ?? "Generated Website",
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
      description: "AI website edit",
    });

    const nextMetadata: PipelineMetadata = {
      ...metadata,
      aiEditsUsed: (metadata.aiEditsUsed ?? 0) + 1,
    };

    const { error: updateError } = await supabase
      .from("projects")
      .update({
        website_schema: edited.data.websiteSchema,
        pipeline_metadata: nextMetadata,
      })
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

    return NextResponse.json({
      ...edited.data,
      aiEditsUsed: nextMetadata.aiEditsUsed,
    });
  } catch (error) {
    console.error("[StoneAI Bedrock edit] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not edit website." },
      { status: 500 },
    );
  }
}
