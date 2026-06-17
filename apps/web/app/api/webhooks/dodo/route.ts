import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Webhook } from "standardwebhooks";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { subscriptionSyncService } from "@/services/billing/subscriptionSyncService";
import { webhookFailureService } from "@/services/billing/webhookFailureService";

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

const getString = (value: unknown) => (typeof value === "string" ? value : undefined);

const getData = (payload: DodoWebhookPayload) =>
  (payload.data && typeof payload.data === "object" ? payload.data : payload) as Record<string, unknown>;

const getAnonClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !publishableKey) throw new Error("Missing Supabase environment variables.");
  return createClient(supabaseUrl, publishableKey, { auth: { persistSession: false } });
};

const syncWithRpcFallback = async (
  payload: DodoWebhookPayload,
  eventId: string,
  eventType: string,
) => {
  const userId = subscriptionSyncService.resolveUserId(payload as Record<string, unknown>);
  const plan = subscriptionSyncService.resolvePlan(payload as Record<string, unknown>);
  const data = getData(payload);
  const statusValue = getString(data.status);
  const status =
    statusValue === "on_hold" || statusValue === "failed"
      ? "past_due"
      : statusValue === "cancelled" || statusValue === "expired"
        ? "canceled"
        : statusValue === "pending"
          ? "pending"
          : statusValue === "trialing"
            ? "trialing"
            : statusValue === "active"
              ? "active"
              : undefined;

  if (!userId) return { synced: false, reason: "missing_user_id" };

  const supabase = getAnonClient();
  const { data: result, error } = await supabase.rpc("sync_dodo_subscription", {
    target_event_id: eventId,
    target_event_type: eventType,
    target_user_id: userId,
    target_plan: plan ?? "free_trial",
    target_status: status ?? "pending",
    external_customer_id: getString(data.customer_id) ?? getString((data.customer as Record<string, unknown> | undefined)?.customer_id) ?? null,
    external_subscription_id: getString(data.subscription_id) ?? null,
    external_product_id: getString(data.product_id) ?? null,
    target_renewal_date: getString(data.next_billing_date) ?? null,
    target_billing_cycle:
      getString(data.payment_frequency_interval) === "Year" ||
      getString(data.subscription_period_interval) === "Year"
        ? "yearly"
        : "monthly",
    cancel_at_period_end:
      typeof data.cancel_at_next_billing_date === "boolean" ? data.cancel_at_next_billing_date : null,
    event_payload: payload,
  });

  if (error) throw error;
  return { synced: true, result };
};

const processWebhook = async (
  payload: DodoWebhookPayload,
  eventId: string,
  eventType: string,
) => {
  const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createSupabaseAdminClient()
    : getAnonClient();

  const result = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? await subscriptionSyncService.syncFromPayload(supabase, {
        eventId,
        eventType,
        payload: payload as Record<string, unknown>,
      })
    : await syncWithRpcFallback(payload, eventId, eventType);

  await webhookFailureService.markResolved(supabase, eventId);
  return result;
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

  let payload: DodoWebhookPayload;
  try {
    payload = new Webhook(secret).verify(rawPayload, webhookHeaders) as DodoWebhookPayload;
  } catch (error) {
    console.error("[StoneAI Dodo webhook] verification failed", error);
    return NextResponse.json({ error: "Invalid Dodo webhook signature." }, { status: 401 });
  }

  const eventType = payload.type ?? payload.event_type ?? "unknown";
  const eventId = payload.id ?? webhookHeaders["webhook-id"];

  if (!implementedEvents.has(eventType)) {
    console.info("[StoneAI Dodo webhook] ignored verified event", { eventType });
    return NextResponse.json({ received: true, ignored: true });
  }

  try {
    const result = await processWebhook(payload, eventId, eventType);
    return NextResponse.json({ received: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed.";
    console.error("[StoneAI Dodo webhook] processing failed", { eventId, eventType, message });

    try {
      const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
        ? createSupabaseAdminClient()
        : getAnonClient();
      await webhookFailureService.record(supabase, {
        eventId,
        eventType,
        payload: payload as Record<string, unknown>,
        errorMessage: message,
      });
    } catch (recordError) {
      console.error("[StoneAI Dodo webhook] failed to record dead-letter", recordError);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
