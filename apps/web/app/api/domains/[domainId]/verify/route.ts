import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { domainService } from "@/services/domains/domainService";

export const runtime = "nodejs";

type DomainRouteProps = {
  params: Promise<{ domainId: string }>;
};

export async function POST(_request: Request, { params }: DomainRouteProps) {
  try {
    const { domainId } = await params;
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && userError.message !== "Auth session missing!") throw userError;
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to verify domains." }, { status: 401 });
    }

    const domain = await domainService.verifyDomain(supabase, {
      userId: user.id,
      domainId,
    });

    return NextResponse.json({ domain });
  } catch (error) {
    console.error("[StoneAI domains] verify failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not verify domain." },
      { status: 500 },
    );
  }
}
