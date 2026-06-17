import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext } from "@/lib/api/auth";
import { mediaService } from "@/services/media/mediaService";

export async function GET(
  _request: Request,
  context: { params: Promise<{ generationId: string }> },
) {
  try {
    const { generationId } = await context.params;
    const { supabase, user } = await getAuthenticatedRequestContext();
    if (!user) {
      return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    }

    const media = await mediaService.pollVideoStatus(supabase, user.id, generationId);
    return NextResponse.json({ media });
  } catch (error) {
    console.error("[StoneAI video poll] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not poll video status." },
      { status: 500 },
    );
  }
}
