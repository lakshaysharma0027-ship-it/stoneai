-- Webhook dead-letter log for Dodo retry diagnostics

create table if not exists public.billing_webhook_failures (
  id uuid primary key default gen_random_uuid(),
  event_id text,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  error_message text not null,
  retry_count integer not null default 0,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists billing_webhook_failures_event_id_idx
  on public.billing_webhook_failures (event_id)
  where event_id is not null;

alter table public.billing_webhook_failures enable row level security;
