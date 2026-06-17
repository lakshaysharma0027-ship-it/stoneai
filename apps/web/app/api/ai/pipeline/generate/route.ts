import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PipelineGenerateRequest } from "@/lib/pipeline/types";
import { pipelineService } from "@/services/ai/pipelineService";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<PipelineGenerateRequest>;
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && userError.message !== "Auth session missing!") throw userError;
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to generate websites." }, { status: 401 });
    }

    const result = await pipelineService.generate(supabase, user.id, {
      templateId: payload.templateId ?? null,
      websitePrompt: payload.websitePrompt ?? "",
      businessName: payload.businessName ?? "",
      firstImagePrompt: payload.firstImagePrompt,
      lastImagePrompt: payload.lastImagePrompt,
      veoPrompt: payload.veoPrompt,
      presetHeroImageId: payload.presetHeroImageId,
      heroImageUpload: payload.heroImageUpload,
      lastFrameImageUpload: payload.lastFrameImageUpload,
      motionVideoUpload: payload.motionVideoUpload,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[StoneAI pipeline generate] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not complete generation pipeline." },
      {
        status:
          error instanceof Error &&
          (error.message.includes("credits") ||
            error.message.includes("payment method") ||
            error.message.includes("trial") ||
            error.message.includes("subscription"))
            ? 402
            : 500,
      },
    );
  }
}
