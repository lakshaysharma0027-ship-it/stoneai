import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { getAuthenticatedRequestContext } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { creditService } from "@/services/billing/creditService";
import { subscriptionSyncService } from "@/services/billing/subscriptionSyncService";

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
      return NextResponse.json({ error: "You must be logged in to sync billing." }, { status: 401 });
    }

    const subscription = await creditService.ensureSubscription(supabase, user.id);
    if (!subscription.subscriptionId) {
      return NextResponse.json({ error: "No Dodo subscription found." }, { status: 400 });
    }

    const dodoSubscription = await getDodoClient().subscriptions.retrieve(subscription.subscriptionId);
    const admin = createSupabaseAdminClient();
    const result = await subscriptionSyncService.syncFromPayload(admin, {
      eventType: "subscription.updated",
      userId: user.id,
      payload: dodoSubscription as unknown as Record<string, unknown>,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[StoneAI Dodo sync] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not sync billing." },
      { status: 500 },
    );
  }
}
