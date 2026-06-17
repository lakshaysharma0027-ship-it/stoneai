import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext } from "@/lib/api/auth";
import { billingService } from "@/services/billing/billingService";
import { creditService } from "@/services/billing/creditService";

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getAuthenticatedRequestContext();
    if (!user) {
      return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    }

    const subscription = await creditService.ensureSubscription(supabase, user.id);
    if (!subscription.customerId) {
      return NextResponse.json(
        { error: "No payment profile found. Complete checkout to manage billing." },
        { status: 400 },
      );
    }

    const origin = new URL(request.url).origin;
    const portal = await billingService.createCustomerPortal({
      customerId: subscription.customerId,
      returnUrl: `${origin}/dashboard?view=billing`,
    });

    return NextResponse.json(portal);
  } catch (error) {
    console.error("[StoneAI billing portal] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not open billing portal." },
      { status: 500 },
    );
  }
}
