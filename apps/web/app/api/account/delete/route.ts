import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function DELETE() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && userError.message !== "Auth session missing!") throw userError;
    if (!user) {
      return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    }

    const admin = createSupabaseAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);

    if (error) throw error;

    await supabase.auth.signOut();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[StoneAI account delete] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not delete account." },
      { status: 500 },
    );
  }
}
