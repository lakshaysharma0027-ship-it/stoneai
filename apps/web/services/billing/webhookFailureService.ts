import type { SupabaseClient } from "@supabase/supabase-js";

export const webhookFailureService = {
  async record(
    supabase: SupabaseClient,
    input: {
      eventId?: string;
      eventType: string;
      payload: Record<string, unknown>;
      errorMessage: string;
    },
  ) {
    if (input.eventId) {
      const { data: existing } = await supabase
        .from("billing_webhook_failures")
        .select("id, retry_count")
        .eq("event_id", input.eventId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("billing_webhook_failures")
          .update({
            retry_count: ((existing as { retry_count: number }).retry_count ?? 0) + 1,
            error_message: input.errorMessage,
            payload: input.payload,
          })
          .eq("id", (existing as { id: string }).id);
        return;
      }
    }

    await supabase.from("billing_webhook_failures").insert({
      event_id: input.eventId ?? null,
      event_type: input.eventType,
      payload: input.payload,
      error_message: input.errorMessage,
      retry_count: 1,
    });
  },

  async markResolved(supabase: SupabaseClient, eventId: string) {
    await supabase
      .from("billing_webhook_failures")
      .update({ resolved_at: new Date().toISOString() })
      .eq("event_id", eventId);
  },
};
