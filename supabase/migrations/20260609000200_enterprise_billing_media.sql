alter table public.subscriptions
drop constraint if exists subscriptions_plan_check;

alter table public.subscriptions
drop constraint if exists subscriptions_status_check;

update public.subscriptions
set plan = case plan
  when 'free' then 'free_trial'
  when 'starter' then 'basic'
  when 'agency' then 'premium'
  else plan
end
where plan in ('free', 'starter', 'agency');

alter table public.subscriptions
add constraint subscriptions_plan_check
check (plan in ('free_trial', 'basic', 'basic_plus', 'pro', 'premium'));

alter table public.subscriptions
alter column plan set default 'free_trial';

alter table public.subscriptions
add constraint subscriptions_status_check
check (status in ('active', 'trialing', 'past_due', 'canceled'));

alter table public.subscriptions
add column if not exists customer_id text,
add column if not exists subscription_id text,
add column if not exists product_id text,
add column if not exists renewal_date timestamptz,
add column if not exists billing_cycle text not null default 'monthly',
add column if not exists cancel_at_period_end boolean not null default false,
add column if not exists last_synced_at timestamptz,
add column if not exists current_period_start timestamptz,
add column if not exists current_period_end timestamptz;

create unique index if not exists subscriptions_customer_id_idx
on public.subscriptions(customer_id)
where customer_id is not null;

create unique index if not exists subscriptions_subscription_id_idx
on public.subscriptions(subscription_id)
where subscription_id is not null;

create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  event_id text unique,
  event_type text not null,
  user_id uuid references auth.users(id) on delete set null,
  customer_id text,
  subscription_id text,
  plan text,
  status text,
  payload jsonb not null,
  processed_at timestamptz not null default now()
);

create table if not exists public.media_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  media_type text not null check (media_type in ('image', 'video')),
  capability text not null,
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  model text not null,
  credits_used integer not null default 0 check (credits_used >= 0),
  cost_cents integer,
  duration_seconds integer,
  operation_id text,
  asset_url text,
  thumbnail_url text,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists media_generations_set_updated_at on public.media_generations;
create trigger media_generations_set_updated_at
before update on public.media_generations
for each row execute function public.set_updated_at();

create table if not exists public.admin_metric_snapshots (
  id uuid primary key default gen_random_uuid(),
  metric_key text not null,
  metric_value numeric not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.billing_events enable row level security;
alter table public.media_generations enable row level security;
alter table public.admin_metric_snapshots enable row level security;

drop policy if exists "Users can read own media generations" on public.media_generations;
create policy "Users can read own media generations"
on public.media_generations for select
using (auth.uid() = user_id);

drop policy if exists "Users can create own media generations" on public.media_generations;
create policy "Users can create own media generations"
on public.media_generations for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own media generations" on public.media_generations;
create policy "Users can update own media generations"
on public.media_generations for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.plan_monthly_credits(plan_id text)
returns integer
language sql
immutable
as $$
  select case plan_id
    when 'basic' then 1500
    when 'basic_plus' then 2500
    when 'pro' then 6000
    when 'premium' then 25000
    else 100
  end;
$$;

create or replace function public.plan_site_limit(plan_id text)
returns integer
language sql
immutable
as $$
  select case plan_id
    when 'basic' then 2
    when 'basic_plus' then 4
    when 'pro' then 7
    when 'premium' then 30
    else 1
  end;
$$;

create or replace function public.ensure_user_subscription(target_user_id uuid)
returns public.subscriptions
language plpgsql
security definer set search_path = public
as $$
declare
  subscription public.subscriptions;
begin
  insert into public.subscriptions (
    user_id,
    plan,
    credits_remaining,
    monthly_credits,
    status,
    billing_cycle
  )
  values (
    target_user_id,
    'free_trial',
    100,
    100,
    'active',
    'monthly'
  )
  on conflict (user_id) do nothing;

  select *
  into subscription
  from public.subscriptions
  where user_id = target_user_id;

  return subscription;
end;
$$;

create or replace function public.allocate_subscription_credits(
  target_user_id uuid,
  target_plan text,
  event_type text,
  description text default null
)
returns public.subscriptions
language plpgsql
security definer set search_path = public
as $$
declare
  subscription public.subscriptions;
  credits integer;
begin
  credits := public.plan_monthly_credits(target_plan);
  perform public.ensure_user_subscription(target_user_id);

  update public.subscriptions
  set
    plan = target_plan,
    monthly_credits = credits,
    credits_remaining = credits,
    status = 'active',
    updated_at = now()
  where user_id = target_user_id
  returning *
  into subscription;

  insert into public.credit_transactions (
    user_id,
    amount,
    type,
    description
  )
  values (
    target_user_id,
    credits,
    'grant',
    coalesce(description, event_type)
  );

  insert into public.usage_events (
    user_id,
    event_type,
    credits_used
  )
  values (
    target_user_id,
    event_type,
    0
  );

  return subscription;
end;
$$;
