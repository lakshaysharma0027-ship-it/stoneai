import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: Request) {
  try {
    const payload = (await request.json()) as { displayName?: string };
    const displayName = payload.displayName?.trim();

    if (!displayName || displayName.length < 2) {
      return NextResponse.json(
        { error: "Display name must be at least 2 characters." },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && userError.message !== "Auth session missing!") throw userError;
    if (!user) {
      return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: displayName })
      .eq("id", user.id);

    if (profileError) throw profileError;

    const admin = createSupabaseAdminClient();
    const { error: authError } = await admin.auth.admin.updateUserById(user.id, {
      user_metadata: { full_name: displayName },
    });

    if (authError) throw authError;

    return NextResponse.json({ displayName });
  } catch (error) {
    console.error("[StoneAI profile update] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update profile." },
      { status: 500 },
    );
  }
}
