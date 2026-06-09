import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Webhook } from "standardwebhooks";
import { BILLING_PLANS, type BillingPlanId } from "@/lib/billing/plans";
import type { SubscriptionStatus } from "@/lib/billing/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DodoWebhookPayload = {
  type?: string;
  event_type?: string;
  data?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

const getWebhookSecret = () =>
  process.env.DODO_WEBHOOK_SECRET ?? process.env.DODO_PAYMENTS_WEBHOOK_KEY;

const getString = (value: unknown) => (typeof value === "string" ? value : undefined);

const getMetadata = (payload: DodoWebhookPayload) => {
  const data = payload.data ?? {};
  const metadata = payload.metadata ?? data.metadata;
  const customData = data.custom_data ?? data.customData;

  return {
    ...(typeof metadata === "object" && metadata ? metadata : {}),
    ...(typeof customData === "object" && customData ? customData : {}),
  } as Record<string, unknown>;
};

const getPlan = (metadata: Record<string, unknown>): BillingPlanId | undefined => {
  const plan = getString(metadata.stoneai_plan) ?? getString(metadata.plan);
  return plan && plan in BILLING_PLANS ? (plan as BillingPlanId) : undefined;
};

const getStatus = (eventType: string): SubscriptionStatus | undefined => {
  if (["subscription.active", "subscription.renewed", "subscription.plan_changed"].includes(eventType)) {
    return "active";
  }

  if (["subscription.failed", "subscription.on_hold"].includes(eventType)) {
    return "past_due";
  }

  if (["subscription.cancelled", "subscription.expired"].includes(eventType)) {
    return "canceled";
  }

  return undefined;
};

const syncSubscription = async (payload: DodoWebhookPayload) => {
  const eventType = payload.type ?? payload.event_type ?? "unknown";
  const metadata = getMetadata(payload);
  const userId =
    getString(metadata.stoneai_user_id) ??
    getString(metadata.user_id) ??
    getString(metadata.userId);
  const plan = getPlan(metadata);
  const status = getStatus(eventType);

  if (!userId || (!plan && !status)) {
    console.info("[StoneAI Dodo webhook] verified event received", {
      eventType,
      hasUserId: Boolean(userId),
      hasPlan: Boolean(plan),
      hasStatus: Boolean(status),
    });
    return;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn("[StoneAI Dodo webhook] missing Supabase admin env; event verified but not synced", {
      eventType,
      userId,
    });
    return;
  }

  const updates: Record<string, string | number> = {};

  if (plan) {
    updates.plan = plan;
    updates.monthly_credits = BILLING_PLANS[plan].monthlyCredits;
  }

  if (status) {
    updates.status = status;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  const { error } = await supabase
    .from("subscriptions")
    .update(updates)
    .eq("user_id", userId);

  if (error) throw error;
};

export async function POST(request: Request) {
  const secret = getWebhookSecret();

  if (!secret) {
    return NextResponse.json({ error: "Missing Dodo webhook secret." }, { status: 500 });
  }

  const webhookHeaders = {
    "webhook-id": request.headers.get("webhook-id") ?? "",
    "webhook-signature": request.headers.get("webhook-signature") ?? "",
    "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
  };

  if (!webhookHeaders["webhook-id"] || !webhookHeaders["webhook-signature"] || !webhookHeaders["webhook-timestamp"]) {
    return NextResponse.json({ error: "Missing Dodo webhook headers." }, { status: 400 });
  }

  const rawPayload = await request.text();

  try {
    const payload = new Webhook(secret).verify(rawPayload, webhookHeaders) as DodoWebhookPayload;
    await syncSubscription(payload);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[StoneAI Dodo webhook] verification or processing failed", error);
    return NextResponse.json({ error: "Invalid Dodo webhook." }, { status: 401 });
  }
}
