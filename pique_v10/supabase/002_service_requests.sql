create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  title text not null,
  description text not null,
  zone text not null,
  urgency text not null,
  status text not null default 'proposals',
  selected_provider text,
  created_at timestamptz not null default now()
);

alter table public.service_requests enable row level security;
create policy "users can read own requests" on public.service_requests for select using (auth.uid() = user_id);
create policy "users can create own requests" on public.service_requests for insert with check (auth.uid() = user_id);
create policy "users can update own requests" on public.service_requests for update using (auth.uid() = user_id);
