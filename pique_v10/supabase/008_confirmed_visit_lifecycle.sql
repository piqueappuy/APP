create or replace function public.guard_pique_lifecycle() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if new.created_at is distinct from old.created_at or new.user_id is distinct from old.user_id then raise exception 'Immutable request origin'; end if;
 if old.status in ('archived','completed') and new is distinct from old then raise exception 'Request is closed'; end if;
 if ((old.urgency in ('Hoy','Ahora') and old.created_at+interval '24 hours'<=clock_timestamp()) or (old.urgency='Esta semana' and old.created_at+interval '7 days'<=clock_timestamp())) and old.status<>'completed'
 and not (old.status='selected' and exists(select 1 from public.pique_coordination c where c.request_id=old.id and c.state<>'proposed')) then
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
