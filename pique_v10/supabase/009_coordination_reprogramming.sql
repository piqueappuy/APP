alter table public.pique_coordination add column ever_confirmed boolean not null default false;
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
    if old.state<>'confirmed' or actor::text<>s.selected_provider or new.arrival_minutes is null then raise exception 'Solo el profesional puede avisar que está en camino'; end if;
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

update public.pique_coordination set ever_confirmed=true where state<>'proposed';
create or replace function public.guard_pique_lifecycle() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if new.created_at is distinct from old.created_at or new.user_id is distinct from old.user_id then raise exception 'Immutable request origin'; end if;
 if old.status in ('archived','completed') and new is distinct from old then raise exception 'Request is closed'; end if;
 if ((old.urgency in ('Hoy','Ahora') and old.created_at+interval '24 hours'<=clock_timestamp()) or (old.urgency='Esta semana' and old.created_at+interval '7 days'<=clock_timestamp())) and old.status<>'completed'
 and not (old.status='selected' and exists(select 1 from public.pique_coordination c where c.request_id=old.id and c.ever_confirmed)) then
  if new.status<>'archived' then raise exception 'Request expired'; end if;
  new.archived_at=case when old.urgency in ('Hoy','Ahora') then old.created_at+interval '24 hours' else old.created_at+interval '7 days' end;
 end if;
 if new.status='completed' and old.status<>'completed' then
  if old.selected_provider is null or auth.uid() is distinct from old.user_id then raise exception 'Only owner may complete assigned request'; end if;
  new.completed_at=clock_timestamp();
 elsif new.completed_at is distinct from old.completed_at then raise exception 'Invalid completion date';
 end if;
 return new;
end $$;
