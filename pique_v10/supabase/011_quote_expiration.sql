-- Ejecutar después de 010 en Supabase > SQL Editor.
-- El plazo empieza al enviar la cotización, no al crear el pique.
create or replace function public.validate_quote_expiration()
returns trigger language plpgsql set search_path = '' as $$
begin
 if new.status = 'quoted' and old.status <> 'quoted' then
  new.quoted_at := clock_timestamp();
 elsif old.status = 'quoted' then
  if new.status = 'accepted' and old.quoted_at is not null
     and old.quoted_at + interval '24 hours' <= clock_timestamp() then
   raise exception 'La cotización venció. Solicitá una nueva.';
  end if;
  if new.status = 'quoted' then
   new.quoted_at := old.quoted_at;
  end if;
  if new.status = 'pending' then
   if old.quoted_at is null or old.quoted_at + interval '24 hours' > clock_timestamp() then
    raise exception 'La cotización todavía está vigente.';
   end if;
   new.quoted_at := null;
   new.quoted_price := null;
   new.estimated_minutes := null;
  end if;
 end if;
 return new;
end $$;
drop trigger if exists validate_quote_expiration on public.quote_requests;
create trigger validate_quote_expiration before update on public.quote_requests
for each row execute function public.validate_quote_expiration();
