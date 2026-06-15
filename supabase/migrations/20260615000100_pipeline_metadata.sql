alter table public.projects
add column if not exists pipeline_metadata jsonb not null default '{}'::jsonb;
