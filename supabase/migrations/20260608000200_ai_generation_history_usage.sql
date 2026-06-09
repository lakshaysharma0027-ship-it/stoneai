create table if not exists public.ai_generation_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  prompt text not null,
  generated_schema jsonb not null,
  generation_type text not null default 'generate',
  created_at timestamptz not null default now()
);

create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  provider text not null,
  model text not null,
  request_type text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  total_tokens integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.ai_generation_history enable row level security;
alter table public.ai_usage_events enable row level security;

drop policy if exists "Users can read own generation history" on public.ai_generation_history;
create policy "Users can read own generation history"
on public.ai_generation_history for select
using (auth.uid() = user_id);

drop policy if exists "Users can create own generation history" on public.ai_generation_history;
create policy "Users can create own generation history"
on public.ai_generation_history for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own generation history" on public.ai_generation_history;
create policy "Users can update own generation history"
on public.ai_generation_history for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read own AI usage" on public.ai_usage_events;
create policy "Users can read own AI usage"
on public.ai_usage_events for select
using (auth.uid() = user_id);

drop policy if exists "Users can create own AI usage" on public.ai_usage_events;
create policy "Users can create own AI usage"
on public.ai_usage_events for insert
with check (auth.uid() = user_id);
