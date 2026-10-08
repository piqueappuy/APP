-- PIQUE · Profesionales pueden descubrir y cotizar piques abiertos de sus rubros
-- Ejecutar en Supabase > SQL Editor DESPUÉS de 004_quote_requests.sql.

-- 1) Un profesional activo puede leer piques abiertos de cualquiera de sus rubros.
drop policy if exists "professional can read matching open services" on public.service_requests;
create policy "professional can read matching open services"
  on public.service_requests for select
  to authenticated
  using (
    status = 'proposals'
    and selected_provider is null
    and user_id <> auth.uid()
    and exists (
      select 1
      from public.professional_profiles pp
      where pp.user_id = auth.uid()
        and pp.active = true
        and service_requests.category = any(pp.trades)
    )
  );

-- 2) El profesional puede crear SU propia cotización sobre un pique abierto
--    solamente cuando el rubro pertenece a su perfil activo.
drop policy if exists "professional can create matching quote" on public.quote_requests;
create policy "professional can create matching quote"
  on public.quote_requests for insert
  to authenticated
  with check (
    auth.uid() = professional_id
    and status = 'quoted'
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
