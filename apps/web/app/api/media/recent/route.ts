import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext } from "@/lib/api/auth";
import type { PipelineMediaSlot } from "@/lib/media/pipelineMediaCapabilities";
import { recentMediaService } from "@/services/media/recentMediaService";

const isSlot = (value: string): value is PipelineMediaSlot =>
  value === "first" || value === "last" || value === "video";

export async function GET(request: Request) {
  try {
    const { supabase, user } = await getAuthenticatedRequestContext();
    if (!user) {
      return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    }

    const slotParam = new URL(request.url).searchParams.get("slot") ?? "first";
    if (!isSlot(slotParam)) {
      return NextResponse.json({ error: "Invalid slot." }, { status: 400 });
    }

    const media = await recentMediaService.listForSlot(supabase, user.id, slotParam);
    return NextResponse.json({ media, slot: slotParam });
  } catch (error) {
    console.error("[StoneAI recent media] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load recent media." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getAuthenticatedRequestContext();
    if (!user) {
      return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    }

    const payload = (await request.json()) as {
      mediaType?: "image" | "video";
      capability?: string;
      prompt?: string;
      assetUrl?: string;
    };

    if (!payload.assetUrl?.trim() || !payload.mediaType || !payload.capability) {
      return NextResponse.json({ error: "Missing media fields." }, { status: 400 });
    }

    await recentMediaService.record(supabase, user.id, {
      mediaType: payload.mediaType,
      capability: payload.capability,
      prompt: payload.prompt?.trim() || "Uploaded asset",
      assetUrl: payload.assetUrl.trim(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[StoneAI recent media record] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not record media." },
      { status: 500 },
    );
  }
}
