import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext } from "@/lib/api/auth";
import { normalizeBillingPlanId } from "@/lib/billing/plans";
import { billingService } from "@/services/billing/billingService";

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getAuthenticatedRequestContext();
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to start checkout." }, { status: 401 });
    }

    const payload = (await request.json()) as { plan?: string };
    const plan = normalizeBillingPlanId(payload.plan);

    const origin = new URL(request.url).origin;
    const checkout = await billingService.createCheckout({
      userId: user.id,
      email: user.email ?? undefined,
      name: user.user_metadata.full_name,
      plan,
      successUrl: `${origin}/dashboard?billing=success&plan=${plan}`,
      cancelUrl: `${origin}/dashboard?billing=cancelled&plan=${plan}`,
    });

    await supabase.from("billing_events").insert({
      event_type: "checkout.created",
      user_id: user.id,
      plan,
      payload: { checkoutSessionId: checkout.id, plan },
    });

    return NextResponse.json(checkout);
  } catch (error) {
    console.error("[StoneAI Dodo checkout] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create checkout." },
      { status: 500 },
    );
  }
}
