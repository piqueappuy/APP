begin;
select set_config('pique.test_request',gen_random_uuid()::text,true);
select set_config('pique.test_customer',user_id::text,true),set_config('pique.test_professional',selected_provider,true) from public.service_requests where status='selected' and selected_provider is not null limit 1;
insert into public.service_requests(id,user_id,selected_provider,category,title,description,zone,urgency,status,created_at)
values(current_setting('pique.test_request')::uuid,current_setting('pique.test_customer')::uuid,current_setting('pique.test_professional'),'Electricidad','TEST COORDINATION','TEST','Centro','Hoy','selected',now());
insert into public.quote_requests(service_request_id,customer_id,professional_id,status,quoted_price,estimated_minutes)
values(current_setting('pique.test_request')::uuid,current_setting('pique.test_customer')::uuid,current_setting('pique.test_professional')::uuid,'accepted',2500,120);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('pique.test_professional'),true);
insert into public.pique_coordination(request_id,proposed_by,slots) values(current_setting('pique.test_request')::uuid,auth.uid(),array[now()+interval '1 day',now()+interval '2 days']);
do $$ begin
 begin update public.pique_coordination set state='confirmed',appointment_at=slots[1] where request_id=current_setting('pique.test_request')::uuid; raise exception 'Self-confirmation incorrectly allowed'; exception when others then if sqlerrm='Self-confirmation incorrectly allowed' then raise; end if; end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('pique.test_customer'),true);
update public.pique_coordination set state='confirmed',appointment_at=slots[1] where request_id=current_setting('pique.test_request')::uuid and version=1;
do $$ begin
 begin update public.pique_coordination set state='on_way',arrival_minutes=20 where request_id=current_setting('pique.test_request')::uuid; raise exception 'Customer travel incorrectly allowed'; exception when others then if sqlerrm='Customer travel incorrectly allowed' then raise; end if; end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('pique.test_professional'),true);
update public.pique_coordination set state='on_way',arrival_minutes=20 where request_id=current_setting('pique.test_request')::uuid and version=2;
update public.pique_coordination set state='arrived' where request_id=current_setting('pique.test_request')::uuid and version=3;
update public.pique_coordination set state='finished' where request_id=current_setting('pique.test_request')::uuid and version=4;
select set_config('request.jwt.claim.sub',current_setting('pique.test_customer'),true);
select public.confirm_pique_completion(current_setting('pique.test_request')::uuid,5);
do $$ begin
 if not exists(select 1 from public.service_requests where id=current_setting('pique.test_request')::uuid and status='completed' and completed_at is not null) then raise exception 'Completion failed'; end if;
 if not exists(select 1 from public.pique_coordination where request_id=current_setting('pique.test_request')::uuid and state='resolved' and version=6) then raise exception 'Coordination failed'; end if;
end $$;
select 'PASS: propose, opposite-party confirm, role guards, progress, atomic completion' test;
rollback;
