-- Production readiness: trial expiry, payment-gated grants, credit refunds

alter table public.subscriptions
add column if not exists trial_ends_at timestamptz;

create or replace function public.refund_user_credits(
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
    raise exception 'Refund credits must be greater than zero.';
  end if;

  select *
  into subscription
  from public.subscriptions
  where user_id = target_user_id
  for update;

  if not found then
    raise exception 'Subscription not found.';
  end if;

  update public.subscriptions
  set credits_remaining = least(credits_remaining + credits, monthly_credits)
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
    'refund',
    coalesce(description, event_type)
  );

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
    trial_ends_at = case
      when target_plan = 'free_trial' then now() + interval '3 days'
      else null
    end,
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
  normalized_status := coalesce(target_status, 'pending');

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

  should_grant := target_event_type in (
    'payment.succeeded',
    'subscription.active',
    'subscription.renewed',
    'subscription.plan_changed'
  );

  if should_grant then
    normalized_status := case
      when normalized_plan = 'free_trial' then 'trialing'
      when normalized_status in ('active', 'trialing') then normalized_status
      else 'active'
    end;
  elsif normalized_status = 'pending' then
    normalized_status := 'pending';
  elsif normalized_status in ('canceled', 'cancelled', 'expired') then
    normalized_status := 'canceled';
  elsif normalized_status in ('on_hold', 'failed', 'past_due') then
    normalized_status := 'past_due';
  end if;

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

  if should_grant then
    update public.subscriptions
    set
      credits_remaining = public.plan_monthly_credits(normalized_plan),
      current_period_start = now(),
      status = case
        when normalized_plan = 'free_trial' then 'trialing'
        else coalesce(normalized_status, 'active')
      end,
      trial_ends_at = case
        when normalized_plan = 'free_trial' then now() + interval '3 days'
        else trial_ends_at
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
  end if;

  return subscription;
end;
$$;
