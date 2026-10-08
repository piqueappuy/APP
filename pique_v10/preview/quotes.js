let professionalUnfulfilled=[],professionalHistoryOwner=null;
let professionalResolvedCount=null,professionalResolvedOwner=null,professionalResolvedPiques=[];
// PIQUE quote workflow extension.
// IMPORTANT: auth.js remains untouched from the known-working 8765 build.

async function loadMatchingRequests(){
 matchingRequests=[];matchingRequestsError=false;matchingRequestsOwner=null;professionalResolvedCount=null;professionalResolvedOwner=null;professionalResolvedPiques=[];professionalUnfulfilled=[];professionalHistoryOwner=null;
 if(!hasActiveProfessional())return;
 const id=authUser.id;
 const trades=(professionalAccount.trades||[]).filter(Boolean);
 if(!trades.length){matchingRequestsOwner=id;return;}
 try{
  const requests=await authClient.from('service_requests')
    .select('*')
    .eq('status','proposals')
    .is('selected_provider',null)
    .neq('user_id',id)
    .in('category',trades)
    .order('created_at',{ascending:false});
  if(requests.error)throw requests.error;
  if(authUser?.id!==id)return;
  const rows=(requests.data||[]).filter(o=>!orderIsArchived(o));
  const requestIds=rows.map(row=>row.id);
  let quoteRows=[];
  if(requestIds.length){
   const quotes=await authClient.from('quote_requests')
     .select('id,service_request_id,status,quoted_price,estimated_minutes,created_at')
     .eq('professional_id',id)
     .in('service_request_id',requestIds);
   if(quotes.error)throw quotes.error;
   quoteRows=quotes.data||[];
  }
  if(authUser?.id!==id)return;
  matchingRequests=rows.map(row=>{
   const quote=quoteRows.find(q=>q.service_request_id===row.id)||null;
   return {
    ...row,
    createdAt:row.created_at,
    quoteRequestId:quote?.id||null,
    quoteStatus:quote?.status||'available',
    quotedPrice:quote?.quoted_price??null,
    estimatedMinutes:quote?.estimated_minutes??null,
    hasProfessionalQuote:Boolean(quote&&['quoted','accepted'].includes(quote.status)),
    hasApplication:Boolean(quote&&quote.status==='applied'),
    canQuote:Boolean(quote&&quote.status==='pending')
   };
  });
  const history=await authClient.from('quote_requests').select('service_request_id,status,quoted_price,estimated_minutes,service_requests(*,pique_coordination(state,ever_confirmed,updated_at))').eq('professional_id',id);
  if(authUser?.id!==id)return;
  if(!history.error){const entries=history.data||[];professionalUnfulfilled=[...new Map(entries.filter(q=>q.service_requests&&(q.status==='rejected'||(['applied','pending','quoted','accepted'].includes(q.status)&&orderIsArchived(q.service_requests)))).map(q=>[q.service_request_id,{...q.service_requests,createdAt:q.service_requests.created_at,unfulfilledReason:q.status==='rejected'?'COTIZACIÓN O POSTULACIÓN RECHAZADA':null}])).values()];professionalHistoryOwner=id;matchingRequests.push(...entries.filter(q=>q.status==='accepted'&&q.service_requests?.status==='selected'&&!orderIsArchived(q.service_requests)).map(q=>({...q.service_requests,createdAt:q.service_requests.created_at,quoteStatus:'accepted',hasProfessionalQuote:true,quotedPrice:q.quoted_price,estimatedMinutes:q.estimated_minutes})));professionalResolvedPiques=[...new Map(entries.filter(q=>q.status==='accepted'&&q.service_requests?.status==='completed').map(q=>[q.service_request_id,{...q.service_requests,createdAt:q.service_requests.created_at,quotedPrice:q.quoted_price,estimatedMinutes:q.estimated_minutes}])).values()];professionalResolvedCount=professionalResolvedPiques.length;professionalResolvedOwner=id;}
  matchingRequestsOwner=id;
 }catch(error){
  if(authUser?.id===id)matchingRequestsError=true;
  console.warn('PIQUE: no se pudieron cargar piques para el profesional',error);
 }
}

const sendingQuotes=new Set();
async function sendProfessionalQuote(button){
 const userId=authUser?.id,orderId=button.dataset.orderId;
 const row=matchingRequests.find(o=>o.id===orderId);
 const key=row?.quoteRequestId||`new:${orderId}`;
 if(!hasActiveProfessional()||matchingRequestsOwner!==userId||!row||row.hasProfessionalQuote||row.quoteStatus!=='pending'||!row.quoteRequestId||sendingQuotes.has(key))return;
 const card=button.closest('.matching-request');
 const price=Number(card.querySelector('[data-quote-price]').value),minutes=Number(card.querySelector('[data-quote-time]').value);
 if(!Number.isInteger(price)||price<500||price>20000||price%500||!Number.isInteger(minutes)||minutes<30||minutes>480||minutes%30)return;
 sendingQuotes.add(key);button.disabled=true;button.textContent='ENVIANDO…';
 try{
  const result=await authClient.from('quote_requests')
   .update({status:'quoted',quoted_price:price,estimated_minutes:minutes,quoted_at:new Date().toISOString()})
   .eq('id',row.quoteRequestId).eq('professional_id',userId).eq('status','pending').select('id').single();
  if(result.error||!result.data)throw result.error||new Error('No se guardó la cotización');
  if(authUser?.id!==userId)return;
  row.quoteStatus='quoted';row.hasProfessionalQuote=true;row.canQuote=false;row.quotedPrice=price;row.estimatedMinutes=minutes;
  render();toast('COTIZACIÓN ENVIADA.');
 }catch(error){
  if(authUser?.id===userId){button.disabled=false;button.textContent='ENVIAR COTIZACIÓN';toast('NO SE PUDO ENVIAR. VOLVÉ A INTENTAR.');}
  console.warn('PIQUE: no se pudo enviar la cotización',error);
 }finally{sendingQuotes.delete(key);}
}

const sendingApplications=new Set();
async function applyToPique(button){
 const userId=authUser?.id,orderId=button.dataset.applyOrder;
 const row=matchingRequests.find(o=>o.id===orderId);
 const key=`apply:${orderId}`;
 if(!hasActiveProfessional()||matchingRequestsOwner!==userId||!row||row.quoteStatus!=='available'||sendingApplications.has(key))return;
 sendingApplications.add(key);button.disabled=true;button.textContent='ENVIANDO…';
 try{
  const {data,error}=await authClient.from('quote_requests')
   .insert({service_request_id:row.id,customer_id:row.user_id,professional_id:userId,status:'applied'})
   .select('id').single();
  if(error||!data)throw error||new Error('No se guardó la postulación');
  if(authUser?.id!==userId)return;
  row.quoteRequestId=data.id;row.quoteStatus='applied';row.hasApplication=true;
  render();toast('POSTULACIÓN ENVIADA.');
 }catch(error){
  if(authUser?.id===userId){
   // A retry can hit the unique (service_request_id, professional_id) key after
   // the first request was saved but its response was lost. Reconcile before
   // reporting failure so the UI reflects the authoritative server state.
   let recovered=null;
   try{
    const lookup=await authClient.from('quote_requests').select('id,status,quoted_price,estimated_minutes').eq('service_request_id',orderId).eq('professional_id',userId).maybeSingle();
    if(!lookup.error)recovered=lookup.data;
   }catch{}
   if(recovered){
    row.quoteRequestId=recovered.id;row.quoteStatus=recovered.status;
    row.hasApplication=recovered.status==='applied';
    row.hasProfessionalQuote=['quoted','accepted'].includes(recovered.status);
    row.canQuote=recovered.status==='pending';
    row.quotedPrice=recovered.quoted_price;row.estimatedMinutes=recovered.estimated_minutes;
    render();
    toast(recovered.status==='applied'?'YA TE HABÍAS POSTULADO A ESTE PIQUE.':'YA TENÍAS UNA SOLICITUD PARA ESTE PIQUE.');
   }else{
    button.disabled=false;button.textContent='POSTULAR';
    const code=error?.code||error?.status;
    const message=String(error?.message||'').replace(/\s+/g,' ').slice(0,110);
    toast(error?.code==='42501'?`SUPABASE RECHAZÓ LA POSTULACIÓN (42501). PERFIL ACTIVO Y RUBRO: ${professionalAccount.trades.join(', ')}.`:error?.code==='23505'?'YA EXISTE UNA POSTULACIÓN PARA ESTE PIQUE; RECARGÁ LA PÁGINA.':`NO SE PUDO POSTULAR${code?` (${code})`:''}.${message?` ${message}`:' REVISÁ TU CONEXIÓN Y VOLVÉ A INTENTAR.'}`);
   }
  }
  console.warn('PIQUE: no se pudo enviar la postulación',JSON.stringify({code:error?.code,status:error?.status,message:error?.message,details:error?.details,hint:error?.hint}));
 }finally{sendingApplications.delete(key);}
}

async function requestQuote(orderId,professionalId){
 if(!authClient||!authUser){toast('INGRESÁ A TU CUENTA PARA SOLICITAR UNA COTIZACIÓN.');go('ingresar');return;}
 const order=orders.find(o=>o.id===orderId);
 if(!order||order.user_id!==authUser.id){toast('NO PUDIMOS IDENTIFICAR ESTE PEDIDO.');return;}
 try{
  const userId=authUser.id;
  let {data,error}=await authClient.from('quote_requests').insert({service_request_id:orderId,customer_id:userId,professional_id:professionalId,status:'pending'}).select('id,service_request_id,professional_id,status,quoted_price,estimated_minutes').single();
  if(error){
   if(error.code!=='23505')throw error;
   const existing=await authClient.from('quote_requests').select('id,service_request_id,professional_id,status,quoted_price,estimated_minutes').eq('service_request_id',orderId).eq('customer_id',userId).eq('professional_id',professionalId).single();
   if(existing.error)throw existing.error;
   data=existing.data;
  }
  if(authUser?.id!==userId)return;
  if(!data)throw new Error('No se pudo confirmar la solicitud');
  order.quotes=[...(order.quotes||[]).filter(q=>q.professional_id!==professionalId),data];
  order.quoteProfessionals=order.quotes.filter(q=>['pending','quoted','accepted'].includes(q.status)).map(q=>q.professional_id);
  render();
  toast(data.status==='pending'?'COTIZACIÓN SOLICITADA. EL PROFESIONAL YA PUEDE VER TU PEDIDO.':data.status==='quoted'?'YA TENÉS UNA COTIZACIÓN DE ESTE PROFESIONAL.':'ESTA SOLICITUD YA EXISTE. REVISÁ SU ESTADO EN LA TARJETA.');
 }catch(error){
  console.warn('PIQUE: no se pudo solicitar la cotización',error);
  toast('NO SE PUDO ENVIAR LA SOLICITUD. VOLVÉ A INTENTAR.');
 }
}

async function loadRemoteProviders(){
 if(!authClient)return;
 try{
  const {data,error}=await authClient.from('professional_profiles').select('*').eq('active',true);
  if(error)throw error;
  providers=await Promise.all((data||[]).map(async p=>({
   id:p.user_id,
   realReviews:typeof professionalReviews==='function'?await professionalReviews(p.user_id):[],resolvedPiques:await publicProfessionalResolvedPiques(p.user_id),workPhotos:await publicProfessionalWorkPhotos(p.user_id),bio:p.bio||'',photo:p.avatar_path?(await authClient.storage.from('professional-media').createSignedUrl(p.avatar_path,3600)).data?.signedUrl||'':'',
   trades:p.trades||[],
   neighborhoods:p.neighborhoods||[],
   zones:p.zones||(p.neighborhoods||[]).join(' · '),
   name:`${p.first_name||''} ${p.last_name||''}`.trim(),
   initials:`${(p.first_name||'P')[0]}${(p.last_name||'')[0]||''}`.toUpperCase(),
   rating:5,reviews:0,price:0,time:0,arrival:'A coordinar',distance:'',years:0,verified:false
  }))); 
  render();
 }catch(e){console.warn('PIQUE: no se pudieron cargar profesionales',e);}
}

async function loadRemoteOrders(){
 if(!authClient||!authUser)return;
 const userId=authUser.id;
 try{
  const {data,error}=await authClient.from('service_requests').select('*,pique_coordination(state,ever_confirmed)').eq('user_id',userId).order('created_at',{ascending:false});
  if(error)throw error;
  if(authUser?.id!==userId)return;
  const quotes=await authClient.from('quote_requests').select('id,service_request_id,professional_id,status,quoted_price,estimated_minutes').eq('customer_id',userId);
  if(quotes.error)console.warn('PIQUE: no se pudieron cargar cotizaciones',quotes.error);
  if(authUser?.id!==userId)return;
  const quoteRows=quotes.data||[];
  const remote=(data||[]).filter(o=>o.user_id===userId).map(o=>({
   ...o,
   createdAt:o.created_at,
   selected:o.selected_provider,
   quotes:quoteRows.filter(q=>q.service_request_id===o.id),
   quoteProfessionals:quoteRows.filter(q=>q.service_request_id===o.id&&['pending','quoted','accepted'].includes(q.status)).map(q=>q.professional_id)
  }));
  orders=[...remote,...orders.filter(o=>o.user_id!==userId)];
 }catch(error){console.warn('PIQUE: no se pudieron cargar los pedidos',error);}
}

const decidingApplications=new Set();
async function decideApplication(button){
 const id=button.dataset.applicationDecision,decision=button.dataset.decision,userId=authUser?.id;
 if(!userId||decidingApplications.has(id)||!['pending','rejected'].includes(decision))return;
 decidingApplications.add(id);
 const group=button.parentElement;group.querySelectorAll('button').forEach(b=>b.disabled=true);
 try{
  const {data,error}=await authClient.from('quote_requests')
   .update({status:decision})
   .eq('id',id).eq('customer_id',userId).eq('status','applied').select('id').single();
  if(error||!data)throw error||new Error('No se pudo actualizar la postulación');
  if(authUser?.id!==userId)return;
  await loadRemoteOrders();render();
  toast(decision==='pending'?'POSTULACIÓN ACEPTADA. AHORA PUEDE COTIZAR.':'POSTULACIÓN RECHAZADA.');
 }catch(error){
  if(authUser?.id===userId){group.querySelectorAll('button').forEach(b=>b.disabled=false);toast('NO SE PUDO GUARDAR. VOLVÉ A INTENTAR.');}
  console.warn('PIQUE: no se pudo responder la postulación',error);
 }finally{decidingApplications.delete(id);}
}

const decidingQuotes=new Set();
async function decideQuote(button){
 const id=button.dataset.quoteDecision,decision=button.dataset.decision,userId=authUser?.id;
 if(!userId||decidingQuotes.has(id)||!['accepted','rejected'].includes(decision))return;
 decidingQuotes.add(id);
 const buttons=button.parentElement.querySelectorAll('button');buttons.forEach(b=>b.disabled=true);
 try{
  const {error}=await authClient.rpc('respond_to_quote',{quote_id:id,decision});
  if(error)throw error;
  if(authUser?.id!==userId)return;
  await loadRemoteOrders();render();
 }catch(error){
  if(authUser?.id===userId){buttons.forEach(b=>b.disabled=false);toast('NO SE PUDO GUARDAR. VOLVÉ A INTENTAR.');}
  console.warn('PIQUE: no se pudo responder la cotización',error);
 }finally{decidingQuotes.delete(id);}
}

async function publicProfessionalWorkPhotos(userId){
 const result=await authClient.from('professional_work_photos').select('storage_path,position').eq('user_id',userId).order('position');
 if(result.error)return [];
 const urls=await Promise.all((result.data||[]).map(async row=>(await authClient.storage.from('professional-media').createSignedUrl(row.storage_path,3600)).data?.signedUrl||''));
 return urls.filter(Boolean);
}

async function publicProfessionalResolvedPiques(userId){
 const result=await authClient.rpc('professional_completed_work_v2',{p_professional_id:userId});
 if(result.error){console.warn('PIQUE: historial público no disponible',result.error.code);return [];}
 return result.data||[];
}
