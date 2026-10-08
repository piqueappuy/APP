-- Availability and visit progress, accessible only to the selected participants.
create table public.pique_coordination (
 request_id uuid primary key references public.service_requests(id) on delete cascade,
 proposed_by uuid not null references auth.users(id),
 slots timestamptz[] not null,
 note text not null default '' check (length(note)<=500),
 state text not null default 'proposed' check (state in ('proposed','confirmed','on_way','arrived','finished','resolved','issue')),
 appointment_at timestamptz,
 arrival_minutes integer check (arrival_minutes between 1 and 240),
 version integer not null default 1,
 updated_at timestamptz not null default now(),
 check (cardinality(slots) between 1 and 3)
);
alter table public.pique_coordination enable row level security;
create policy "selected participants read coordination" on public.pique_coordination for select to authenticated using (exists(select 1 from public.service_requests s where s.id=request_id and (s.user_id=auth.uid() or s.selected_provider=auth.uid()::text)));
create policy "selected participants create coordination" on public.pique_coordination for insert to authenticated with check (exists(select 1 from public.service_requests s where s.id=request_id and s.status='selected' and (s.user_id=auth.uid() or s.selected_provider=auth.uid()::text)));
create policy "selected participants update coordination" on public.pique_coordination for update to authenticated using (exists(select 1 from public.service_requests s where s.id=request_id and (s.user_id=auth.uid() or s.selected_provider=auth.uid()::text))) with check (exists(select 1 from public.service_requests s where s.id=request_id and (s.user_id=auth.uid() or s.selected_provider=auth.uid()::text)));
grant select,insert,update on public.pique_coordination to authenticated;
revoke all on public.pique_coordination from anon;

create function public.validate_pique_coordination() returns trigger language plpgsql security invoker set search_path='' as $$
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
 new.updated_at:=now();
 return new;
end $$;
create trigger validate_coordination before insert or update on public.pique_coordination for each row execute function public.validate_pique_coordination();
revoke execute on function public.validate_pique_coordination() from public,anon;

create function public.confirm_pique_completion(p_request_id uuid,p_version integer) returns void language plpgsql security invoker set search_path='' as $$
begin
 update public.pique_coordination set state='resolved' where request_id=p_request_id and version=p_version and state='finished';
 if not found then raise exception 'La coordinación cambió. Actualizá la vista.'; end if;
 update public.service_requests set status='completed',completed_at=now() where id=p_request_id and user_id=auth.uid() and status='selected';
 if not found then raise exception 'No se pudo finalizar'; end if;
end $$;
revoke execute on function public.confirm_pique_completion(uuid,integer) from public,anon;
grant execute on function public.confirm_pique_completion(uuid,integer) to authenticated;
