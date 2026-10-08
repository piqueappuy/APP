-- PIQUE · Flujo de postulación previa a la cotización
-- Ejecutar en Supabase > SQL Editor DESPUÉS de 005_professional_marketplace_requests.sql.

-- 1) Agrega el estado "applied" a quote_requests.
alter table public.quote_requests
  drop constraint if exists quote_requests_status_check;

alter table public.quote_requests
  add constraint quote_requests_status_check
  check (status in ('applied','pending','quoted','accepted','rejected','cancelled'));

-- 2) El profesional puede POSTULARSE a un pique abierto de uno de sus rubros.
drop policy if exists "professional can apply to matching service" on public.quote_requests;
create policy "professional can apply to matching service"
  on public.quote_requests for insert
  to authenticated
  with check (
    auth.uid() = professional_id
    and status = 'applied'
    and exists (
      select 1
      from public.service_requests sr
      join public.professional_profiles pp on pp.user_id = auth.uid()
      where sr.id = service_request_id
        and sr.user_id = customer_id
        and sr.user_id <> auth.uid()
        and sr.status = 'proposals'
        and sr.selected_provider is null
        and pp.active = true
        and sr.category = any(pp.trades)
    )
  );

-- 3) Ya no se permite crear una cotización directa desde el marketplace.
-- La cotización solo puede enviarse actualizando una solicitud existente en estado pending.
drop policy if exists "professional can create matching quote" on public.quote_requests;

-- La policy de UPDATE existente permite al profesional actualizar su propia fila.
-- La aplicación fuerza la transición pending -> quoted al enviar la cotización.
