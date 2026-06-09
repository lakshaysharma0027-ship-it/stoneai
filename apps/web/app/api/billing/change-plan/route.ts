import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext } from "@/lib/api/auth";
import { normalizeBillingPlanId } from "@/lib/billing/plans";
import { billingService } from "@/services/billing/billingService";
import { creditService } from "@/services/billing/creditService";

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getAuthenticatedRequestContext();
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to change plans." }, { status: 401 });
    }

    const payload = (await request.json()) as { plan?: string; immediate?: boolean };
    const plan = normalizeBillingPlanId(payload.plan);
    if (plan === "free_trial") {
      return NextResponse.json({ error: "Use cancellation to return to Free Trial." }, { status: 400 });
    }

    const subscription = await creditService.ensureSubscription(supabase, user.id);
    if (!subscription.subscriptionId) {
      return NextResponse.json({ error: "No Dodo subscription found. Start checkout first." }, { status: 400 });
    }

    await billingService.changeSubscriptionPlan({
      subscriptionId: subscription.subscriptionId,
      plan,
      immediate: payload.immediate ?? true,
    });

    const updated = await creditService.allocateMonthlyCredits(supabase, {
      userId: user.id,
      plan,
      eventType: "subscription_plan_change",
      description: `Plan changed to ${plan}`,
    });

    return NextResponse.json({ subscription: updated });
  } catch (error) {
    console.error("[StoneAI Dodo change plan] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not change plan." },
      { status: 500 },
    );
  }
}
