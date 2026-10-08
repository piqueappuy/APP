create or replace function public.validate_pique_coordination() returns trigger language plpgsql security invoker set search_path='' as $$
declare s public.service_requests; actor uuid:=auth.uid();
begin
 select * into s from public.service_requests where id=new.request_id;
 if actor is null or s.id is null or s.status<>'selected' or (actor<>s.user_id and actor::text is distinct from s.selected_provider) then raise exception 'No autorizado'; end if;
 if tg_op='INSERT' then
  if new.state<>'proposed' or new.proposed_by<>actor or new.appointment_at is not null or new.arrival_minutes is not null then raise exception 'Propuesta inválida'; end if;
  new.version:=1;
 else
  if new.request_id<>old.request_id then raise exception 'Pedido inmutable'; end if;
  if new.state='proposed' then
   if old.state not in ('proposed','confirmed','issue') or new.proposed_by<>actor or new.appointment_at is not null or new.arrival_minutes is not null then raise exception 'No se puede reprogramar'; end if;
  else
   if new.slots is distinct from old.slots or new.proposed_by<>old.proposed_by then raise exception 'Horarios inmutables'; end if;
   if new.state='confirmed' then
    if old.state<>'proposed' or actor=old.proposed_by or new.appointment_at is null or not(new.appointment_at=any(old.slots)) or new.appointment_at<=now() then raise exception 'Horario inválido'; end if;
   elsif new.state='on_way' then
    if old.state<>'confirmed' or actor::text<>s.selected_provider then raise exception 'Solo el profesional puede avisar que está en camino'; end if;
   elsif new.state='arrived' then
    if old.state<>'on_way' or actor::text<>s.selected_provider then raise exception 'Transición inválida'; end if;
   elsif new.state='finished' then
    if old.state<>'arrived' or actor::text<>s.selected_provider then raise exception 'Transición inválida'; end if;
   elsif new.state in ('resolved','issue') then
    if old.state<>'finished' or actor<>s.user_id then raise exception 'Solo el solicitante puede confirmar el resultado'; end if;
   else raise exception 'Transición inválida'; end if;
   if new.state<>'confirmed' and new.appointment_at is distinct from old.appointment_at then raise exception 'Fecha inmutable'; end if;
   if new.state<>'on_way' and new.arrival_minutes is distinct from old.arrival_minutes then raise exception 'Llegada inmutable'; end if;
  end if;
  new.version:=old.version+1;
 end if;
 if new.state='proposed' and (exists(select 1 from unnest(new.slots) t where t is null or t<=now()) or new.slots is null) then raise exception 'Elegí horarios futuros'; end if;
 new.ever_confirmed:=case when tg_op='INSERT' then false else old.ever_confirmed or new.state='confirmed' end;
 new.updated_at:=now();
 return new;
end $$;


create schema if not exists pique_private;
revoke all on schema pique_private from public,anon;
grant usage on schema pique_private to authenticated;
create or replace function pique_private.customer_for_pique(p_request_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select jsonb_build_object('first_name',coalesce(u.raw_user_meta_data->>'first_name',split_part(coalesce(u.raw_user_meta_data->>'full_name',u.raw_user_meta_data->>'name','SOLICITANTE'),' ',1)),'last_name',coalesce(u.raw_user_meta_data->>'last_name','')) from public.service_requests s join auth.users u on u.id=s.user_id where s.id=p_request_id and auth.uid() is not null and (s.user_id=auth.uid() or s.selected_provider=auth.uid()::text) and s.status in ('selected','completed');
$$;
revoke all on function pique_private.customer_for_pique(uuid) from public,anon;
grant execute on function pique_private.customer_for_pique(uuid) to authenticated;
create or replace function public.pique_customer(p_request_id uuid) returns jsonb language sql security invoker set search_path='' as $$ select pique_private.customer_for_pique(p_request_id); $$;
revoke all on function public.pique_customer(uuid) from public,anon;
grant execute on function public.pique_customer(uuid) to authenticated;
