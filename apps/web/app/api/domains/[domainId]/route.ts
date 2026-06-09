import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { domainService } from "@/services/domains/domainService";

type DomainRouteProps = {
  params: Promise<{ domainId: string }>;
};

export async function DELETE(_request: Request, { params }: DomainRouteProps) {
  try {
    const { domainId } = await params;
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to remove domains." }, { status: 401 });
    }

    await domainService.removeDomain(supabase, {
      userId: user.id,
      domainId,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[StoneAI domains] remove failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not remove domain." },
      { status: 500 },
    );
  }
}
