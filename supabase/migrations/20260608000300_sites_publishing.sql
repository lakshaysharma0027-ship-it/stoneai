create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'unpublished')),
  published_schema jsonb not null,
  seo_title text,
  seo_description text,
  favicon_url text,
  open_graph_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(slug),
  unique(project_id)
);

create table if not exists public.site_analytics (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  page_views integer not null default 0,
  unique_visitors integer not null default 0,
  last_visit timestamptz,
  publish_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(site_id)
);

drop trigger if exists sites_set_updated_at on public.sites;
create trigger sites_set_updated_at
before update on public.sites
for each row execute function public.set_updated_at();

drop trigger if exists site_analytics_set_updated_at on public.site_analytics;
create trigger site_analytics_set_updated_at
before update on public.site_analytics
for each row execute function public.set_updated_at();

alter table public.sites enable row level security;
alter table public.site_analytics enable row level security;

drop policy if exists "Published sites are publicly readable" on public.sites;
create policy "Published sites are publicly readable"
on public.sites for select
using (status = 'published');

drop policy if exists "Users can read own sites" on public.sites;
create policy "Users can read own sites"
on public.sites for select
using (auth.uid() = user_id);

drop policy if exists "Users can create own sites" on public.sites;
create policy "Users can create own sites"
on public.sites for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.projects
    where projects.id = sites.project_id
    and projects.user_id = auth.uid()
  )
);

drop policy if exists "Users can update own sites" on public.sites;
create policy "Users can update own sites"
on public.sites for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own sites" on public.sites;
create policy "Users can delete own sites"
on public.sites for delete
using (auth.uid() = user_id);

drop policy if exists "Site analytics are publicly writable" on public.site_analytics;
create policy "Site analytics are publicly writable"
on public.site_analytics for insert
with check (
  exists (
    select 1 from public.sites
    where sites.id = site_analytics.site_id
    and sites.status = 'published'
  )
);

drop policy if exists "Site analytics are publicly updatable" on public.site_analytics;
create policy "Site analytics are publicly updatable"
on public.site_analytics for update
using (
  exists (
    select 1 from public.sites
    where sites.id = site_analytics.site_id
    and sites.status = 'published'
  )
)
with check (
  exists (
    select 1 from public.sites
    where sites.id = site_analytics.site_id
    and sites.status = 'published'
  )
);

drop policy if exists "Users can read analytics for own sites" on public.site_analytics;
create policy "Users can read analytics for own sites"
on public.site_analytics for select
using (
  exists (
    select 1 from public.sites
    where sites.id = site_analytics.site_id
    and sites.user_id = auth.uid()
  )
);

create or replace function public.record_site_page_view(target_site_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.site_analytics (
    site_id,
    page_views,
    unique_visitors,
    last_visit,
    publish_date
  )
  select
    sites.id,
    1,
    0,
    now(),
    sites.updated_at
  from public.sites
  where sites.id = target_site_id
  and sites.status = 'published'
  on conflict (site_id) do update set
    page_views = public.site_analytics.page_views + 1,
    last_visit = now(),
    updated_at = now();
end;
$$;
