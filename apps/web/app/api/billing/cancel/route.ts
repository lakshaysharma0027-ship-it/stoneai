import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { getAuthenticatedRequestContext } from "@/lib/api/auth";
import { creditService } from "@/services/billing/creditService";

const getDodoClient = () => {
  const bearerToken = process.env.DODO_API_KEY ?? process.env.DODO_PAYMENTS_API_KEY;
  if (!bearerToken) throw new Error("Missing DODO_API_KEY.");
  return new DodoPayments({
    bearerToken,
    environment: process.env.DODO_ENVIRONMENT === "test_mode" ? "test_mode" : "live_mode",
  });
};

export async function POST() {
  try {
    const { supabase, user } = await getAuthenticatedRequestContext();
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to cancel billing." }, { status: 401 });
    }

    const subscription = await creditService.ensureSubscription(supabase, user.id);
    if (!subscription.subscriptionId) {
      return NextResponse.json({ error: "No Dodo subscription found." }, { status: 400 });
    }

    await getDodoClient().subscriptions.update(subscription.subscriptionId, {
      cancel_at_next_billing_date: true,
      cancel_reason: "cancelled_by_customer",
    });

    const { error } = await supabase
      .from("subscriptions")
      .update({ cancel_at_period_end: true, last_synced_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ cancelled: true });
  } catch (error) {
    console.error("[StoneAI Dodo cancel] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not cancel subscription." },
      { status: 500 },
    );
  }
}
