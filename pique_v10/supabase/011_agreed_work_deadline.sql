alter table public.service_requests add column if not exists archive_reason text;
create or replace function public.guard_pique_lifecycle() returns trigger language plpgsql security invoker set search_path='' as $$
declare visit public.pique_coordination; deadline timestamptz;
begin
 if new.created_at is distinct from old.created_at or new.user_id is distinct from old.user_id then raise exception 'Immutable request origin'; end if;
 if old.status in ('archived','completed') and new is distinct from old then raise exception 'Request is closed'; end if;
 select * into visit from public.pique_coordination where request_id=old.id;
 if old.status='selected' and visit.appointment_at is not null and visit.state in ('confirmed','on_way','arrived') then
  deadline:=visit.appointment_at+interval '24 hours';
  if deadline<=clock_timestamp() then
   if new.status<>'archived' then raise exception 'Agreed work deadline expired'; end if;
   new.archived_at:=deadline;new.archive_reason:='work_not_completed';
  end if;
 elsif old.status<>'selected' and old.status<>'completed' then
  deadline:=case when old.urgency in ('Hoy','Ahora') then old.created_at+interval '24 hours' when old.urgency='Esta semana' then old.created_at+interval '7 days' end;
  if deadline<=clock_timestamp() then
   if new.status<>'archived' then raise exception 'Request expired'; end if;
   new.archived_at:=deadline;
  end if;
 end if;
 if new.archive_reason is distinct from old.archive_reason and not(new.status='archived' and new.archive_reason='work_not_completed' and visit.state in ('confirmed','on_way','arrived') and visit.appointment_at+interval '24 hours'<=clock_timestamp()) then raise exception 'Invalid archive reason';end if;
 if new.status='completed' and old.status<>'completed' then
  if old.selected_provider is null or auth.uid() is distinct from old.user_id then raise exception 'Only owner may complete assigned request'; end if;
  new.completed_at=clock_timestamp();
 elsif new.completed_at is distinct from old.completed_at then raise exception 'Invalid completion date';
 end if;
 return new;
end $$;
select cron.schedule('archive-expired-urgent-piques','* * * * *',$job$
 update public.service_requests set status='archived',archived_at=created_at+interval '24 hours'
 where urgency in ('Hoy','Ahora') and status='proposals' and created_at+interval '24 hours'<=now();
$job$);
select cron.schedule('archive-expired-agenda-piques','* * * * *',$job$
 update public.service_requests set status='archived',archived_at=created_at+interval '7 days'
 where urgency='Esta semana' and status='proposals' and created_at+interval '7 days'<=now();
$job$);
select cron.schedule('archive-unfinished-agreed-piques','* * * * *',$job$
 update public.service_requests s set status='archived',archived_at=c.appointment_at+interval '24 hours',archive_reason='work_not_completed'
 from public.pique_coordination c
 where c.request_id=s.id and s.status='selected' and c.state in ('confirmed','on_way','arrived')
 and c.appointment_at+interval '24 hours'<=now();
$job$);
