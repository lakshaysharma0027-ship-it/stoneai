import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getBillingPlan } from "@/lib/billing/plans";
import { creditService } from "@/services/billing/creditService";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && userError.message !== "Auth session missing!") throw userError;
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to view billing." }, { status: 401 });
    }

    const subscription = await creditService.ensureSubscription(supabase, user.id);
    const plan = getBillingPlan(subscription.plan);

    return NextResponse.json({
      subscription,
      plan,
    });
  } catch (error) {
    console.error("[StoneAI billing summary] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load billing summary." },
      { status: 500 },
    );
  }
}
