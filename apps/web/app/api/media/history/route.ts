import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext } from "@/lib/api/auth";
import { mediaService } from "@/services/media/mediaService";

export async function GET() {
  try {
    const { supabase, user } = await getAuthenticatedRequestContext();
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to view media history." }, { status: 401 });
    }

    const media = await mediaService.listHistory(supabase, user.id);
    return NextResponse.json({ media });
  } catch (error) {
    console.error("[StoneAI media history] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load media history." },
      { status: 500 },
    );
  }
}
