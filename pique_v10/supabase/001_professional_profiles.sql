-- PIQUE · Perfil profesional
-- Ejecutar en Supabase > SQL Editor.

create table if not exists public.professional_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null check (char_length(first_name) between 1 and 50),
  last_name text not null check (char_length(last_name) between 1 and 70),
  bio text not null check (char_length(bio) between 20 and 700),
  neighborhoods text[] not null default '{}',
  trades text[] not null default '{}',
  avatar_path text,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.professional_work_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.professional_profiles(user_id) on delete cascade,
  storage_path text not null,
  position smallint not null default 0 check (position between 0 and 2),
  created_at timestamptz not null default now(),
  unique (user_id, position)
);

alter table public.professional_profiles enable row level security;
alter table public.professional_work_photos enable row level security;

drop policy if exists "professional profile owner read" on public.professional_profiles;
create policy "professional profile owner read"
  on public.professional_profiles for select
  to authenticated using (auth.uid() = user_id);

drop policy if exists "professional profile owner insert" on public.professional_profiles;
create policy "professional profile owner insert"
  on public.professional_profiles for insert
  to authenticated with check (auth.uid() = user_id);

drop policy if exists "professional profile owner update" on public.professional_profiles;
create policy "professional profile owner update"
  on public.professional_profiles for update
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "professional profile owner delete" on public.professional_profiles;
create policy "professional profile owner delete"
  on public.professional_profiles for delete
  to authenticated using (auth.uid() = user_id);

drop policy if exists "work photos owner read" on public.professional_work_photos;
create policy "work photos owner read"
  on public.professional_work_photos for select
  to authenticated using (auth.uid() = user_id);

drop policy if exists "work photos owner insert" on public.professional_work_photos;
create policy "work photos owner insert"
  on public.professional_work_photos for insert
  to authenticated with check (auth.uid() = user_id);

drop policy if exists "work photos owner update" on public.professional_work_photos;
create policy "work photos owner update"
  on public.professional_work_photos for update
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "work photos owner delete" on public.professional_work_photos;
create policy "work photos owner delete"
  on public.professional_work_photos for delete
  to authenticated using (auth.uid() = user_id);

-- Storage bucket privado para fotos profesionales.
insert into storage.buckets (id, name, public)
values ('professional-media', 'professional-media', false)
on conflict (id) do nothing;

drop policy if exists "professional media owner read" on storage.objects;
create policy "professional media owner read"
  on storage.objects for select to authenticated
  using (bucket_id = 'professional-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "professional media owner insert" on storage.objects;
create policy "professional media owner insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'professional-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "professional media owner update" on storage.objects;
create policy "professional media owner update"
  on storage.objects for update to authenticated
  using (bucket_id = 'professional-media' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'professional-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "professional media owner delete" on storage.objects;
create policy "professional media owner delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'professional-media' and (storage.foldername(name))[1] = auth.uid()::text);
