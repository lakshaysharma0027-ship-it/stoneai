import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext } from "@/lib/api/auth";
import type { VideoCapability } from "@/lib/media/types";
import { mediaService } from "@/services/media/mediaService";

const capabilities: VideoCapability[] = [
  "text_to_video",
  "image_to_video",
  "marketing_video",
  "product_showcase",
  "hero_video",
];

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getAuthenticatedRequestContext();
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to generate videos." }, { status: 401 });
    }

    const payload = (await request.json()) as {
      prompt?: string;
      capability?: VideoCapability;
      inputImageBase64?: string;
      inputMimeType?: string;
      aspectRatio?: string;
      durationSeconds?: number;
    };
    const prompt = payload.prompt?.trim();
    const capability = payload.capability ?? "text_to_video";

    if (!prompt) return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    if (!capabilities.includes(capability)) {
      return NextResponse.json({ error: "Unsupported video capability." }, { status: 400 });
    }

    const media = await mediaService.generateVideo(supabase, user.id, {
      prompt,
      capability,
      inputImageBase64: payload.inputImageBase64,
      inputMimeType: payload.inputMimeType,
      aspectRatio: payload.aspectRatio,
      durationSeconds: payload.durationSeconds,
    });

    return NextResponse.json({ media });
  } catch (error) {
    console.error("[StoneAI video generation] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not generate video." },
      { status: error instanceof Error && error.message.includes("credits") ? 402 : 500 },
    );
  }
}
