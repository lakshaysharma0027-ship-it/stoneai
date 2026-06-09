import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { siteId } = await context.params;
    const payload = (await request.json()) as { status?: "draft" | "published" | "unpublished" };
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && userError.message !== "Auth session missing!") throw userError;
    if (!user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    if (!payload.status) return NextResponse.json({ error: "Status is required." }, { status: 400 });

    const { data, error } = await supabase
      .from("sites")
      .update({ status: payload.status })
      .eq("id", siteId)
      .eq("user_id", user.id)
      .select("id,slug,status,updated_at")
      .single();

    if (error) throw error;

    if (payload.status !== "published") {
      const { error: domainError } = await supabase
        .from("domains")
        .update({ status: "verified" })
        .eq("site_id", siteId)
        .eq("user_id", user.id)
        .eq("status", "active");

      if (domainError) throw domainError;
    }

    return NextResponse.json({ site: data });
  } catch (error) {
    console.error("[StoneAI site update] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update site." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { siteId } = await context.params;
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && userError.message !== "Auth session missing!") throw userError;
    if (!user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });

    const { error } = await supabase.from("sites").delete().eq("id", siteId).eq("user_id", user.id);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[StoneAI site delete] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not delete site." },
      { status: 500 },
    );
  }
}
