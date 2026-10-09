create or replace function public.pique_execution_deadline(state text,appointment timestamptz,arrival timestamptz)
returns timestamptz language sql immutable security invoker set search_path='' as $$
 select case when state='arrived' then arrival+interval '24 hours' when state in ('confirmed','on_way') then appointment+interval '24 hours' end;
$$;
create or replace function public.guard_pique_lifecycle() returns trigger language plpgsql security invoker set search_path='' as $$
declare visit public.pique_coordination; deadline timestamptz; reason text;
begin
 if new.created_at is distinct from old.created_at or new.user_id is distinct from old.user_id then raise exception 'Immutable request origin'; end if;
 if old.status in ('archived','completed') and new is distinct from old then raise exception 'Request is closed'; end if;
 select * into visit from public.pique_coordination where request_id=old.id;
 if old.status='selected' then
  deadline:=public.pique_execution_deadline(visit.state,visit.appointment_at,visit.arrived_at);
  reason:=case when visit.state='arrived' then 'work_not_completed' else 'visit_not_made' end;
  if deadline<=clock_timestamp() then
   if new.status<>'archived' then raise exception 'Execution deadline expired'; end if;
   new.archived_at:=deadline;new.archive_reason:=reason;
  end if;
 elsif old.status<>'completed' then
  deadline:=case when old.urgency in ('Hoy','Ahora') then old.created_at+interval '24 hours' when old.urgency='Esta semana' then old.created_at+interval '7 days' end;
  if deadline<=clock_timestamp() then
   if new.status<>'archived' then raise exception 'Request expired'; end if;
   new.archived_at:=deadline;
  end if;
 end if;
 if new.archive_reason is distinct from old.archive_reason then
  if old.status<>'selected' or new.status<>'archived' or deadline is null or deadline>clock_timestamp() or new.archive_reason is distinct from reason then raise exception 'Invalid archive reason'; end if;
 end if;
 if new.status='completed' and old.status<>'completed' then
  if old.selected_provider is null or auth.uid() is distinct from old.user_id then raise exception 'Only owner may complete assigned request'; end if;
  new.completed_at:=clock_timestamp();
 elsif new.completed_at is distinct from old.completed_at then raise exception 'Invalid completion date'; end if;
 return new;
end $$;
create or replace function public.guard_agreed_visit_day()
returns trigger language plpgsql security invoker set search_path='' as $$
declare deadline timestamptz;
begin
 if new.state='arrived' and old.state is distinct from new.state then
  if new.appointment_at is null or (clock_timestamp() at time zone 'America/Montevideo')::date < (new.appointment_at at time zone 'America/Montevideo')::date then
   raise exception 'La llegada solo puede registrarse desde el día acordado';
  end if;
 end if;
 deadline:=public.pique_execution_deadline(old.state,old.appointment_at,old.arrived_at);
 if old.state is distinct from new.state and deadline<=clock_timestamp() then
  raise exception 'El plazo de 24 horas ya venció';
 end if;
 return new;
end $$;
select cron.schedule('archive-unfinished-agreed-piques','* * * * *',$job$
 update public.service_requests s set status='archived',
 archived_at=public.pique_execution_deadline(c.state,c.appointment_at,c.arrived_at),
 archive_reason=case when c.state='arrived' then 'work_not_completed' else 'visit_not_made' end
 from public.pique_coordination c where c.request_id=s.id and s.status='selected'
 and public.pique_execution_deadline(c.state,c.appointment_at,c.arrived_at)<=now();
$job$);
