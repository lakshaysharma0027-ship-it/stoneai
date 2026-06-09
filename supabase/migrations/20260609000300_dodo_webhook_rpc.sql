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
    set credits_remaining = public.plan_monthly_credits(normalized_plan)
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
