import { NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { subscriptionSyncService } from "@/services/billing/subscriptionSyncService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DodoWebhookPayload = {
  id?: string;
  type?: string;
  event_type?: string;
  data?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

const implementedEvents = new Set([
  "checkout.completed",
  "payment.succeeded",
  "payment.failed",
  "subscription.created",
  "subscription.updated",
  "subscription.cancelled",
  "subscription.active",
  "subscription.renewed",
  "subscription.plan_changed",
  "subscription.failed",
  "subscription.on_hold",
  "subscription.expired",
]);

const getWebhookSecret = () =>
  process.env.DODO_WEBHOOK_SECRET ?? process.env.DODO_PAYMENTS_WEBHOOK_KEY;

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
    const eventType = payload.type ?? payload.event_type ?? "unknown";
    const eventId = payload.id ?? webhookHeaders["webhook-id"];

    if (!implementedEvents.has(eventType)) {
      console.info("[StoneAI Dodo webhook] ignored verified event", { eventType });
      return NextResponse.json({ received: true, ignored: true });
    }

    const supabase = createSupabaseAdminClient();
    const result = await subscriptionSyncService.syncFromPayload(supabase, {
      eventId,
      eventType,
      payload: payload as Record<string, unknown>,
    });

    return NextResponse.json({ received: true, result });
  } catch (error) {
    console.error("[StoneAI Dodo webhook] verification or processing failed", error);
    return NextResponse.json({ error: "Invalid Dodo webhook." }, { status: 401 });
  }
}
