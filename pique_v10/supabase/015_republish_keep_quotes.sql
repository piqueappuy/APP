create or replace function public.republish_pique(p_request_id uuid) returns uuid
language plpgsql security definer set search_path='' as $$
declare original public.service_requests; new_id uuid:=gen_random_uuid(); actor uuid:=auth.uid();
begin
 if actor is null then raise exception 'Ingresá para republicar';end if;
 select * into original from public.service_requests where id=p_request_id for update;
 if original.id is null or original.user_id<>actor then raise exception 'No autorizado';end if;
 if original.status<>'archived' then raise exception 'Solo se puede republicar un pique archivado';end if;
 insert into public.service_requests(id,user_id,category,title,description,zone,urgency,status,coordination_history)
 values(new_id,actor,original.category,original.title,original.description,original.zone,original.urgency,'proposals',
 original.coordination_history||jsonb_build_array(jsonb_build_object('reason','republished','original_request_id',original.id,'recorded_at',clock_timestamp())));
 insert into public.quote_requests(service_request_id,customer_id,professional_id,status,quoted_price,estimated_minutes,quoted_at)
 select new_id,actor,professional_id,case when status='accepted' then 'quoted' else status end,quoted_price,estimated_minutes,quoted_at
 from public.quote_requests where service_request_id=original.id;
 return new_id;
end $$;
revoke all on function public.republish_pique(uuid) from public,anon;
grant execute on function public.republish_pique(uuid) to authenticated;