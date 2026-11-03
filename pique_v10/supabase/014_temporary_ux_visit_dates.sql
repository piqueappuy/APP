-- Temporary UX/UI review. Restore guard_agreed_visit_day from 013 after review.
create or replace function public.guard_agreed_visit_day()
returns trigger language plpgsql security invoker set search_path='' as $$
begin
 -- Date and deadline checks temporarily suspended; state/ownership guards remain.
 return new;
end $$;