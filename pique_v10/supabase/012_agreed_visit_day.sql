create or replace function public.guard_agreed_visit_day()
returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if new.state='arrived' and old.state is distinct from new.state then
  if new.appointment_at is null or (clock_timestamp() at time zone 'America/Montevideo')::date < (new.appointment_at at time zone 'America/Montevideo')::date then
   raise exception 'La llegada solo puede registrarse desde el día acordado';
  end if;
 end if;
 if new.state in ('on_way','arrived','finished') and old.state is distinct from new.state and new.appointment_at+interval '24 hours'<=clock_timestamp() then
  raise exception 'El plazo acordado de 24 horas ya venció';
 end if;
 return new;
end $$;
revoke all on function public.guard_agreed_visit_day() from public;
create trigger guard_agreed_visit_day before update on public.pique_coordination
for each row execute function public.guard_agreed_visit_day();
