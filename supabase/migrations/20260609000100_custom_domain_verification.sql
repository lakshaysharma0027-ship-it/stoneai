alter table public.domains
add column if not exists verification_type text not null default 'txt'
check (verification_type in ('txt', 'cname')),
add column if not exists verification_host text,
add column if not exists verification_value text,
add column if not exists verified_at timestamptz,
add column if not exists last_checked_at timestamptz,
add column if not exists failure_reason text,
add column if not exists updated_at timestamptz not null default now();

update public.domains
set
  verification_host = coalesce(verification_host, '_stoneai.' || domain),
  verification_value = coalesce(verification_value, 'stoneai-site-verification=' || verification_token)
where verification_host is null
or verification_value is null;

alter table public.domains
alter column verification_host set not null,
alter column verification_value set not null;

drop trigger if exists domains_set_updated_at on public.domains;
create trigger domains_set_updated_at
before update on public.domains
for each row execute function public.set_updated_at();

drop policy if exists "Active domains are publicly readable" on public.domains;
create policy "Active domains are publicly readable"
on public.domains for select
using (status = 'active');

drop policy if exists "Users can delete own domains" on public.domains;
create policy "Users can delete own domains"
on public.domains for delete
using (auth.uid() = user_id);

create index if not exists domains_domain_status_idx
on public.domains (domain, status);
