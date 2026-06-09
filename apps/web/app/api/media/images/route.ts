import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext } from "@/lib/api/auth";
import type { ImageCapability } from "@/lib/media/types";
import { mediaService } from "@/services/media/mediaService";

const capabilities: ImageCapability[] = [
  "prompt",
  "edit_uploaded",
  "background_replacement",
  "product_enhancement",
  "hero_image",
  "marketing_asset",
];

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getAuthenticatedRequestContext();
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to generate images." }, { status: 401 });
    }

    const payload = (await request.json()) as {
      prompt?: string;
      capability?: ImageCapability;
      inputImageBase64?: string;
      inputMimeType?: string;
      aspectRatio?: string;
    };
    const prompt = payload.prompt?.trim();
    const capability = payload.capability ?? "prompt";

    if (!prompt) return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    if (!capabilities.includes(capability)) {
      return NextResponse.json({ error: "Unsupported image capability." }, { status: 400 });
    }

    const media = await mediaService.generateImage(supabase, user.id, {
      prompt,
      capability,
      inputImageBase64: payload.inputImageBase64,
      inputMimeType: payload.inputMimeType,
      aspectRatio: payload.aspectRatio,
    });

    return NextResponse.json({ media });
  } catch (error) {
    console.error("[StoneAI image generation] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not generate image." },
      { status: error instanceof Error && error.message.includes("credits") ? 402 : 500 },
    );
  }
}
