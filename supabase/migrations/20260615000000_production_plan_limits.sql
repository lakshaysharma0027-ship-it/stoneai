-- Production plan limits, pending trial status, and credit cost alignment

alter table public.subscriptions
drop constraint if exists subscriptions_status_check;

alter table public.subscriptions
add constraint subscriptions_status_check
check (status in ('pending', 'active', 'trialing', 'past_due', 'canceled'));

create or replace function public.plan_monthly_credits(plan_id text)
returns integer
language sql
immutable
as $$
  select case plan_id
    when 'basic' then 250
    when 'basic_plus' then 500
    when 'pro' then 1400
    when 'premium' then 3250
    else 100
  end;
$$;

create or replace function public.plan_site_limit(plan_id text)
returns integer
language sql
immutable
as $$
  select case plan_id
    when 'basic' then 1
    when 'basic_plus' then 2
    when 'pro' then 4
    when 'premium' then 10
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
    0,
    100,
    'pending',
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
    status = case
      when target_plan = 'free_trial' then 'trialing'
      else 'active'
    end,
    current_period_start = now(),
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

create or replace function public.sync_dodo_subscription(
  target_event_id text,
  target_event_type text,
  target_user_id uuid,
  target_plan text,
  target_status text,
  external_customer_id text,
  external_subscription_id text,
  external_product_id text,
  target_renewal_date timestamptz,
  target_billing_cycle text,
  cancel_at_period_end boolean,
  event_payload jsonb
)
returns public.subscriptions
language plpgsql
security definer set search_path = public
as $$
declare
  subscription public.subscriptions;
  normalized_plan text;
  normalized_status text;
  should_grant boolean;
begin
  normalized_plan := coalesce(target_plan, 'free_trial');
  normalized_status := coalesce(target_status, 'active');

  perform public.ensure_user_subscription(target_user_id);

  insert into public.billing_events (
    event_id,
    event_type,
    user_id,
    customer_id,
    subscription_id,
    plan,
    status,
    payload
  )
  values (
    target_event_id,
    target_event_type,
    target_user_id,
    external_customer_id,
    external_subscription_id,
    normalized_plan,
    normalized_status,
    event_payload
  )
  on conflict (event_id) do nothing;

  update public.subscriptions
  set
    plan = normalized_plan,
    monthly_credits = public.plan_monthly_credits(normalized_plan),
    status = normalized_status,
    customer_id = coalesce(external_customer_id, customer_id),
    subscription_id = coalesce(external_subscription_id, subscription_id),
    product_id = coalesce(external_product_id, product_id),
    renewal_date = coalesce(target_renewal_date, renewal_date),
    current_period_end = coalesce(target_renewal_date, current_period_end),
    billing_cycle = coalesce(target_billing_cycle, billing_cycle),
    cancel_at_period_end = coalesce(cancel_at_period_end, public.subscriptions.cancel_at_period_end),
    last_synced_at = now(),
    updated_at = now()
  where user_id = target_user_id
  returning *
  into subscription;

  should_grant := target_event_type in (
    'checkout.completed',
    'payment.succeeded',
    'subscription.created',
    'subscription.active',
    'subscription.renewed',
    'subscription.plan_changed'
  );

  if should_grant then
    update public.subscriptions
    set
      credits_remaining = public.plan_monthly_credits(normalized_plan),
      current_period_start = now(),
      status = case
        when normalized_plan = 'free_trial' and normalized_status in ('active', 'trialing', 'pending') then 'trialing'
        when normalized_status in ('active', 'trialing') then normalized_status
        else status
      end
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
      public.plan_monthly_credits(normalized_plan),
      'grant',
      'Dodo ' || target_event_type
    );

    insert into public.usage_events (
      user_id,
      event_type,
      credits_used
    )
    values (
      target_user_id,
      target_event_type,
      0
    );
  end if;

  return subscription;
end;
$$;
