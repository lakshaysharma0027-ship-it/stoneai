import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { domainService } from "@/services/domains/domainService";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && userError.message !== "Auth session missing!") throw userError;
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to view domains." }, { status: 401 });
    }

    const domains = await domainService.listDomains(supabase, user.id);
    return NextResponse.json({ domains });
  } catch (error) {
    console.error("[StoneAI domains] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load domains." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      domain?: string;
      siteId?: string | null;
      verificationType?: "txt" | "cname";
    };
    const domain = payload.domain?.trim();

    if (!domain) {
      return NextResponse.json({ error: "Domain is required." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && userError.message !== "Auth session missing!") throw userError;
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to connect domains." }, { status: 401 });
    }

    const customDomain = await domainService.createDomain(supabase, {
      userId: user.id,
      siteId: payload.siteId ?? null,
      domain,
      verificationType: payload.verificationType,
    });

    return NextResponse.json({ domain: customDomain });
  } catch (error) {
    console.error("[StoneAI domains] create failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create domain." },
      { status: 500 },
    );
  }
}
