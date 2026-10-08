-- PIQUE · Solicitudes de cotización dirigidas a profesionales
-- Ejecutar en Supabase > SQL Editor después de 001, 002 y 003.

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid not null references public.service_requests(id) on delete cascade,
  customer_id uuid not null references auth.users(id) on delete cascade,
  professional_id uuid not null references public.professional_profiles(user_id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','quoted','accepted','rejected','cancelled')),
  created_at timestamptz not null default now(),
  unique (service_request_id, professional_id),
  check (customer_id <> professional_id)
);

alter table public.quote_requests enable row level security;

drop policy if exists "customer can create quote requests" on public.quote_requests;
create policy "customer can create quote requests"
  on public.quote_requests for insert
  to authenticated
  with check (
    auth.uid() = customer_id
    and exists (
      select 1 from public.service_requests sr
      where sr.id = service_request_id and sr.user_id = auth.uid()
    )
  );

drop policy if exists "participants can read quote requests" on public.quote_requests;
create policy "participants can read quote requests"
  on public.quote_requests for select
  to authenticated
  using (auth.uid() = customer_id or auth.uid() = professional_id);

drop policy if exists "participants can update quote requests" on public.quote_requests;
create policy "participants can update quote requests"
  on public.quote_requests for update
  to authenticated
  using (auth.uid() = customer_id or auth.uid() = professional_id)
  with check (auth.uid() = customer_id or auth.uid() = professional_id);

-- El profesional puede leer únicamente los pedidos que le enviaron para cotizar.
drop policy if exists "professional can read requested service" on public.service_requests;
create policy "professional can read requested service"
  on public.service_requests for select
  to authenticated
  using (
    exists (
      select 1 from public.quote_requests qr
      where qr.service_request_id = service_requests.id
        and qr.professional_id = auth.uid()
    )
  );
