create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro', 'agency')),
  credits_remaining integer not null default 100 check (credits_remaining >= 0),
  monthly_credits integer not null default 100 check (monthly_credits >= 0),
  status text not null default 'active' check (status in ('active', 'trialing', 'past_due', 'canceled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  type text not null check (type in ('grant', 'consume', 'adjustment', 'refund')),
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  credits_used integer not null default 0 check (credits_used >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.domains (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  site_id uuid references public.sites(id) on delete cascade,
  domain text not null,
  status text not null default 'pending' check (status in ('pending', 'verified', 'active', 'failed')),
  verification_token text not null default encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz not null default now(),
  unique(domain)
);

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

alter table public.subscriptions enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.usage_events enable row level security;
alter table public.domains enable row level security;

drop policy if exists "Users can read own subscriptions" on public.subscriptions;
create policy "Users can read own subscriptions"
on public.subscriptions for select
using (auth.uid() = user_id);

drop policy if exists "Users can read own credit transactions" on public.credit_transactions;
create policy "Users can read own credit transactions"
on public.credit_transactions for select
using (auth.uid() = user_id);

drop policy if exists "Users can read own usage events" on public.usage_events;
create policy "Users can read own usage events"
on public.usage_events for select
using (auth.uid() = user_id);

drop policy if exists "Users can read own domains" on public.domains;
create policy "Users can read own domains"
on public.domains for select
using (auth.uid() = user_id);

drop policy if exists "Users can create own domains" on public.domains;
create policy "Users can create own domains"
on public.domains for insert
with check (
  auth.uid() = user_id
  and (
    site_id is null
    or exists (
      select 1 from public.sites
      where sites.id = domains.site_id
      and sites.user_id = auth.uid()
    )
  )
);

drop policy if exists "Users can update own domains" on public.domains;
create policy "Users can update own domains"
on public.domains for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

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
    status
  )
  values (
    target_user_id,
    'free',
    100,
    100,
    'active'
  )
  on conflict (user_id) do nothing;

  select *
  into subscription
  from public.subscriptions
  where user_id = target_user_id;

  return subscription;
end;
$$;

create or replace function public.consume_user_credits(
  target_user_id uuid,
  credits integer,
  event_type text,
  description text default null
)
returns public.subscriptions
language plpgsql
security definer set search_path = public
as $$
declare
  subscription public.subscriptions;
begin
  if credits <= 0 then
    raise exception 'Credits must be greater than zero.';
  end if;

  perform public.ensure_user_subscription(target_user_id);

  select *
  into subscription
  from public.subscriptions
  where user_id = target_user_id
  for update;

  if subscription.status not in ('active', 'trialing') then
    raise exception 'Subscription is not active.';
  end if;

  if subscription.credits_remaining < credits then
    raise exception 'Not enough credits remaining.';
  end if;

  update public.subscriptions
  set credits_remaining = credits_remaining - credits
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
    -credits,
    'consume',
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
    credits
  );

  return subscription;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);

  perform public.ensure_user_subscription(new.id);

  return new;
end;
$$;
