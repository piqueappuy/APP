/* Shared availability and visit progress. All writes are checked by database RLS
   and the transition trigger; version checks prevent overwriting another reply. */
let coordinationOwner=null,coordinationRows=new Map(),coordinationLoaded=false,coordinationLoading=false,coordinationError=false;
const coordinationBusy=new Set();
const selectedVisitSlots=new Map();
let piqueCustomerOwner=null;const piqueCustomers=new Map();
const coordinationLabels={proposed:'HORARIOS PROPUESTOS',confirmed:'COORDINADO',on_way:'EN CAMINO',arrived:'EN EL LUGAR',finished:'TERMINADO',resolved:'PIQUE RESUELTO',issue:'REVISAR EL RESULTADO'};
function visitDayReached(appointment,now=Date.now()){if(!appointment||!Number.isFinite(Date.parse(appointment)))return false;const day=value=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Montevideo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value));return day(now)>=day(appointment);}
function coordinationDate(value){return new Intl.DateTimeFormat('es-UY',{timeZone:'America/Montevideo',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(value));}
function coordinationOrder(id){return userOrders().find(o=>o.id===id)||matchingRequests.find(o=>o.id===id&&o.quoteStatus==='accepted')||(typeof professionalResolvedPiques!=='undefined'?professionalResolvedPiques.find(o=>o.id===id):null);}
// Refresh only ongoing pique sections; never replace an open form.
function refreshOngoingPiquesView(){
 if(!authReady||!authUser||!['inicio','pedidos'].includes(route().name))return;
 if(app.querySelector('form, details[open]')||(app.contains(document.activeElement)&&document.activeElement.matches('input,textarea,select,[contenteditable="true"]')))return;
 const next=document.createElement('template');next.innerHTML=route().name==='inicio'?home():piquesView();
 for(const selector of ['.requester-coordinating-section','.requester-execution-section','.professional-coordinating-section','.professional-profile-process']){
  const updated=[...next.content.querySelectorAll(selector)];
  [...app.querySelectorAll(selector)].forEach((section,index)=>{const replacement=updated[index];if(replacement&&section.innerHTML!==replacement.innerHTML)section.replaceWith(replacement);});
 }
 applySectionLogoCounts();scheduleSessionFit();requestAnimationFrame(syncExecutionColumnHeight);
}
async function refreshCoordination(){
 const owner=authUser?.id;
 if(coordinationOwner!==owner){coordinationOwner=owner;coordinationRows=new Map();coordinationLoaded=false;coordinationError=false;}
 if(!owner||!authClient||coordinationLoading)return;
 coordinationLoading=true;
 try{
  const {data,error}=await authClient.from('pique_coordination').select('*');
  if(error)throw error;
  if(authUser?.id!==owner)return;
  const previous=JSON.stringify([...coordinationRows.values()]);
  const notices=(data||[]).filter(r=>coordinationRows.has(r.request_id)&&r.version>coordinationRows.get(r.request_id).version);
  coordinationRows=new Map((data||[]).map(r=>[r.request_id,r]));
  const changed=!coordinationLoaded||previous!==JSON.stringify(data||[]);
  coordinationLoaded=true;coordinationError=false;
  if(changed)refreshOngoingPiquesView();
  if(notices.length&&!coordinationBusy.size)toast(coordinationLabels[notices[0].state]+'. REVISÁ LA COORDINACIÓN DEL PIQUE.');
 }catch(error){if(authUser?.id===owner){const first=!coordinationLoaded;coordinationError=true;coordinationLoaded=true;if(first)refreshOngoingPiquesView();}console.warn('PIQUE: coordinación no disponible',error.code);}
 finally{coordinationLoading=false;}
}
function coordinationForm(o,row){
 const min=new Date(Date.now()-3*3600000).toISOString().slice(0,16);
 return `<form class="availability-form" data-availability="${esc(o.id)}" data-version="${row?.version||0}"><p class="coordination-note professional-arrival-note availability-intro">PROPONÉ HASTA TRES HORARIOS PARA LA VISITA.</p><div class="availability-slots">${[0,1,2].map((n)=>`<label>OPCIÓN ${n+1}${n?' · OPCIONAL':''}<input type="datetime-local" name="slot${n}" min="${min}" ${n?'':'required'} aria-label="Horario ${n+1}"></label>`).join('')}</div><button class="btn primary full" type="submit">${svg('clock')}<span>PROPONER HORARIOS</span></button></form>`;
}
function agreedVisitHint(o){
 if(coordinationOwner!==authUser?.id)return '';
 const visit=coordinationRows.get(o.id);
 return visit?.appointment_at?`<div class="confirmed-visit agreed-visit-summary"><small>FECHA Y HORARIO ACORDADO</small><strong>${esc(coordinationDate(visit.appointment_at))}</strong></div>`:'';
}
function coordinationPanel(o){
 if(!authUser||!o||o.status==='completed')return '';
 if(coordinationOwner!==authUser.id||!coordinationLoaded)return '<section class="coordination-panel"><p role="status">CARGANDO COORDINACIÓN…</p></section>';
 if(coordinationError)return '<section class="coordination-panel"><p>NO PUDIMOS CARGAR LA COORDINACIÓN.</p><button class="btn" data-coordination-refresh>VOLVER A INTENTAR</button></section>';
 const row=coordinationRows.get(o.id),customer=o.user_id===authUser.id,professional=o.selected_provider===authUser.id;
 if(!customer&&!professional)return '';
 let body='';
 if(!row)body=coordinationForm(o,null);
 else if(row.state==='proposed'){
  const mine=row.proposed_by===authUser.id;
  const options=row.slots.map((t,n)=>mine?`<div class="availability-option availability-detail"><small>OPCIÓN ${n+1}</small><span>${esc(coordinationDate(t))}</span></div>`:`<button class="availability-option" type="button" aria-pressed="false" data-select-visit-slot="${esc(o.id)}" data-slot="${esc(t)}"><small>OPCIÓN ${n+1}</small><span>${esc(coordinationDate(t))}</span></button>`).join('');
  body=`${mine?'':'<p class="coordination-note professional-arrival-note">ELEGÍ EL HORARIO QUE TE SIRVA Y CONFIRMÁ TU ELECCIÓN.</p>'}<div class="availability-options availability-options-compact">${options}</div>${mine?`<div class="availability-waiting" role="status">${svg('clock')}<span>AGUARDANDO ELECCIÓN</span></div>`:`<button type="button" class="btn requester-open full confirm-visit-choice" data-coordination-action="confirm-selection" data-request="${esc(o.id)}" disabled>${svg('check')}<span>CONFIRMAR HORARIO</span></button>`}`;

 }else{
  body=`<ol class="visit-steps">${['confirmed','on_way','arrived','finished'].map((s,i)=>`<li class="${['confirmed','on_way','arrived','finished','resolved'].indexOf(row.state)>=i?'done':''}">${esc(coordinationLabels[s])}</li>`).join('')}</ol>`;
  if(row.state==='confirmed')body+=professional?`<div class="visit-action-row"><button class="btn primary full" data-coordination-action="on_way" data-request="${esc(o.id)}">${svg('truck')}<span>ESTOY EN CAMINO</span></button><details class="reschedule-visit"><summary>REPROGRAMAR VISITA</summary>${coordinationForm(o,row)}</details></div>`:'<p class="coordination-note professional-arrival-note">EL PROFESIONAL TE AVISARÁ CUANDO ESTÉ EN CAMINO.</p>';
  if(row.state==='on_way')body+=professional?`<button class="btn primary full" data-coordination-action="arrived" data-request="${esc(o.id)}" ${visitDayReached(row.appointment_at)?'':'disabled aria-disabled="true"'}>${svg('check')}<span>LLEGUÉ AL LUGAR</span></button>`:'<p class="coordination-note professional-arrival-note">EL PROFESIONAL TE AVISARÁ CUANDO LLEGUE A TU DIRECCIÓN.</p>';
  if(row.state==='arrived')body+=professional?`<button class="btn primary full" data-open-completion="1" data-request="${esc(o.id)}">${svg('check')}<span>TERMINÉ EL TRABAJO</span></button>`:'<p class="coordination-note professional-arrival-note">EL PROFESIONAL YA ESTÁ EN EL LUGAR.</p>';
  if(row.state==='finished')body+=customer?`<p class="coordination-note professional-arrival-note">EL PROFESIONAL INDICÓ QUE RESOLVIÓ TU PIQUE.</p><div class="coordination-actions"><button class="btn primary" data-coordination-action="resolved" data-request="${esc(o.id)}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg><span>CONFIRMAR</span></button><button class="btn" data-coordination-action="issue" data-request="${esc(o.id)}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/></svg><span>RECHAZAR</span></button></div>`:'<p class="coordination-note professional-arrival-note completion-waiting">ESPERANDO LA CONFIRMACIÓN DEL SOLICITANTE.</p>';
  if(row.state==='issue'||(row.state==='confirmed'&&!professional))body+=`<details class="reschedule-visit"><summary>${row.state==='issue'?'COORDINAR UNA NUEVA VISITA':'REPROGRAMAR VISITA'}</summary>${coordinationForm(o,row)}</details>`;
 }
 if(['finished','resolved','issue'].includes(row?.state)&&row.completion_photos?.length&&!o.hideCompletionEvidence)body+=`<section class="completion-evidence"><div class="completion-photo-column"><h3>FOTOS DEL TRABAJO</h3>${completionGallery(o,row)}</div><div class="completion-comment-column"><h3 class="completion-comment-heading">COMENTARIO</h3><p class="completion-comment">${esc(row.completion_comment)}</p></div></section>`;
 return `<section class="coordination-panel ${row?.state==='finished'?'finished-report-panel':''}">${professional?(row?.state==='finished'?(o.hideCompletionEvidence?'':`<h2 class="professional-progress-title validation-progress-title">¡ESTAMOS VALIDANDO EL <span class="progress-pique-word">${document.querySelector('.nav-pique-logo')?.outerHTML||''}IQUE!</span></h2>`):row&&['confirmed','on_way','arrived'].includes(row.state)?`<h2 class="professional-progress-title">¡DALE EL PRÓXIMO PASO A TU <span class="progress-pique-word">${document.querySelector('.nav-pique-logo')?.outerHTML||''}IQUE!</span></h2>`:''):!row||['proposed','finished'].includes(row.state)?'':'<h2>¡MIRÁ CÓMO AVANZA TU PIQUE!</h2>'}${row&&!['proposed','confirmed','on_way','arrived','finished'].includes(row.state)?`<span class="coordination-state">${esc(coordinationLabels[row.state])}</span>`:''}${body}</section>`;
}
function completionEvidenceOnly(o){const row=coordinationRows.get(o.id);if(!row?.completion_photos?.length)return '';return `<section class="completion-evidence"><div class="completion-photo-column"><h3>FOTOS DEL TRABAJO</h3>${completionGallery(o,row)}</div><div class="completion-comment-column"><h3 class="completion-comment-heading">COMENTARIO</h3><p class="completion-comment">${esc(row.completion_comment)}</p></div></section>`;}
function hasAgreedSchedule(o){return coordinationOwner===authUser?.id&&Boolean(coordinationRows.get(o.id)?.appointment_at);}
function customerPiqueDetails(o){
 const owner=authUser?.id;if(piqueCustomerOwner!==owner){piqueCustomerOwner=owner;piqueCustomers.clear();}
 if(!piqueCustomers.has(o.id)){piqueCustomers.set(o.id,null);void authClient.rpc('pique_customer',{p_request_id:o.id}).then(({data,error})=>{if(authUser?.id!==owner)return;piqueCustomers.set(o.id,error?{}:data||{});refreshOngoingPiquesView();});}
 const person=piqueCustomers.get(o.id);if(person===null)return '<p class="small muted">CARGANDO SOLICITANTE…</p>';
 const name=[person?.first_name,person?.last_name].filter(Boolean).join(' ')||'SOLICITANTE';const initials=name.split(/\s+/).map(n=>n[0]).slice(0,2).join('');
 return `<div class="pique-customer-details"><div class="person"><div class="avatar">${esc(initials)}</div><strong><span>${esc(name.split(/\s+/)[0])}</span><span>${esc(name.split(/\s+/).slice(1).join(' '))}</span></strong></div><span class="pique-meta-tag">📍 ${esc(String(o.zone||'').replace(/,?\s*MONTEVIDEO\s*$/i,''))}</span></div>`;
}
function coordinationView(o){
 const visit=coordinationRows.get(o.id);
 return `${back('cuenta','VOLVER AL PERFIL')}<section class="panel requester-photo-card selected-request-card professional-pique-detail ${visit?.state==='finished'?'professional-report-finished':''} ${categoryThemeClass(o.category)}">${visit?.state==='finished'?'':coordinationPanel(o)}${selectedPiqueDetails({...o,selected:o.selected||o.selected_provider})}${visit?.state==='finished'?'<p class="coordination-note professional-arrival-note detail-confirmation-hint">ESPERANDO LA CONFIRMACIÓN DEL SOLICITANTE.</p>':''}<section class="selected-professional-section"><div class="proposal-top has-price"><div class="proposal-person-data"><h2 class="customer-column-heading">${svg('person')}<span>SOLICITANTE</span></h2>${customerPiqueDetails(o)}</div><div class="price-column"><span class="price-tag"><small>PRECIO ACORDADO</small><strong>${o.quotedPrice!=null?money(o.quotedPrice):'SIN ESPECIFICAR'}</strong></span><span class="quote-estimate"><small>TIEMPO ESTIMADO</small><strong>${o.estimatedMinutes!=null?quoteTimeLabel(o.estimatedMinutes):'SIN ESPECIFICAR'}</strong></span></div></div><div class="pique-schedule-footer"><div class="confirmed-visit agreed-visit-summary"><small>HORARIO<br>ACORDADO</small><strong>${visit?.appointment_at?esc(coordinationDate(visit.appointment_at)):'SIN COORDINAR'}</strong></div><div class="confirmed-visit agreed-visit-summary"><small>HORARIO<br>LLEGADA</small><strong>${visit?.arrived_at||visit?.arrival_at?esc(coordinationDate(visit.arrived_at||visit.arrival_at)):'SIN REGISTRO'}</strong></div><div class="confirmed-visit agreed-visit-summary"><small>HORARIO<br>FINALIZACIÓN</small><strong>${['finished','resolved','issue'].includes(visit?.state)?esc(coordinationDate(visit.completed_at||visit.finished_at||visit.updated_at)):'PENDIENTE'}</strong></div></div></section>${['finished','resolved','issue'].includes(visit?.state)?completionEvidenceOnly(o):''}</section>`;
}

async function coordinationSave(id,payload,version){
 const owner=authUser?.id;if(!owner||coordinationBusy.has(id))return;
 coordinationBusy.add(id);
 try{
  let result;
  if(payload.state==='resolved')result=await authClient.rpc('confirm_pique_completion',{p_request_id:id,p_version:version});
  else if(!version)result=await authClient.from('pique_coordination').insert({request_id:id,...payload}).select('*').single();
  else result=await authClient.from('pique_coordination').update(payload).eq('request_id',id).eq('version',version).select('*').single();
  if(result.error)throw result.error;
  if(authUser?.id!==owner)return;
  const saved=result.data||{...coordinationRows.get(id),...payload,version:version+1};
  coordinationOwner=owner;coordinationLoaded=true;coordinationError=false;coordinationRows.set(id,saved);
  if(payload.state==='resolved'){const order=userOrders().find(o=>o.id===id);if(order)order.status='completed';if(typeof openPiqueReview==='function')void openPiqueReview(id);}
  render();toast(payload.state==='proposed'?'HORARIOS ENVIADOS. AGUARDANDO ELECCIÓN.':'COORDINACIÓN ACTUALIZADA.');
  void Promise.allSettled([loadRemoteOrders(),loadMatchingRequests()]).then(()=>{if(authUser?.id===owner){render();void refreshCoordination();}});
 }catch(error){if(authUser?.id===owner){render();void refreshCoordination();toast('NO SE PUDO GUARDAR. REVISÁ LOS HORARIOS O SI LA OTRA PERSONA YA RESPONDIÓ.');}console.warn('PIQUE: coordinación',error.code);}
 finally{coordinationBusy.delete(id);}
}
app.addEventListener('submit',async e=>{
 const completion=e.target.closest('[data-completion]');if(completion){e.preventDefault();const button=completion.querySelector('button');try{if(!completion.elements.photos.files.length||!completion.elements.comment.value.trim())throw Error('AGREGÁ FOTOS Y UN COMENTARIO.');button.disabled=true;const photos=await readProfessionalPhotos(completion.elements.photos.files,3);await coordinationSave(completion.dataset.completion,{state:'finished',completion_photos:photos,completion_comment:completion.elements.comment.value.trim()},Number(completion.dataset.version));}catch(error){toast(error.message);}finally{button.disabled=false;}return;}
 const form=e.target.closest('[data-availability]');if(!form)return;e.preventDefault();
 const slots=[0,1,2].map(n=>form.elements[`slot${n}`].value).filter(Boolean).map(t=>new Date(t+'-03:00').toISOString());
 if(!slots.length||new Set(slots).size!==slots.length||slots.some(t=>Date.parse(t)<=Date.now())){toast('ELEGÍ ENTRE UNO Y TRES HORARIOS FUTUROS DIFERENTES.');return;}
 form.querySelector('button').disabled=true;
 await coordinationSave(form.dataset.availability,{state:'proposed',proposed_by:authUser.id,slots,note:'',appointment_at:null,arrival_minutes:null},Number(form.dataset.version));
});
app.addEventListener('click',async e=>{
 const reprogram=e.target.closest('[data-open-reprogram]');if(reprogram)sessionStorage.setItem('pique-open-reprogram',reprogram.dataset.openReprogram);
 if(e.target.closest('[data-coordination-refresh]')){await refreshCoordination();render();return;}
 const option=e.target.closest('[data-select-visit-slot]');
 if(option){const id=option.dataset.selectVisitSlot,row=coordinationRows.get(id);if(!row||row.state!=='proposed'||row.proposed_by===authUser?.id||!row.slots.includes(option.dataset.slot))return;selectedVisitSlots.set(id,{slot:option.dataset.slot,version:row.version,owner:authUser.id});const panel=option.closest('.coordination-panel');panel.querySelectorAll('[data-select-visit-slot]').forEach(el=>{const selected=el===option;el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',String(selected));});panel.querySelector('.confirm-visit-choice').disabled=false;return;}
 const finish=e.target.closest('[data-open-completion]');if(finish){const id=finish.dataset.request,row=coordinationRows.get(id);if(!row||row.state!=='arrived')return;const form=document.createElement('form');form.className='completion-form';finish.closest('.coordination-panel').classList.add('completing-work');form.dataset.completion=id;form.dataset.version=row.version;form.innerHTML='<h3 class="completion-section-title">REGISTRÁ EL TRABAJO TERMINADO</h3><label class="field completion-photo-field"><span class="completion-field-heading"><span>FOTOS DEL TRABAJO TERMINADO</span><span class="hint">ENTRE UNA Y TRES FOTOS. HASTA 1 MB POR FOTO.</span></span><span class="completion-file-picker"><input type="file" name="photos" accept="image/jpeg,image/png,image/webp" multiple required><span class="completion-file-status" aria-live="polite">NINGÚN ARCHIVO<br>SELECCIONADO</span></span></label><label class="field"><span class="completion-comment-heading">COMENTARIO</span><textarea name="comment" required maxlength="1000" rows="3" placeholder="Contá qué trabajo realizaste"></textarea></label><button class="btn full completion-send" type="submit"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg><span>ENVIAR INFORME</span></button>';const section=finish.closest('.professional-coordinating-section,.professional-profile-process');const heading=section?.querySelector('.pique-section-title h2,.profile-process-heading h2');if(heading){heading.textContent='REGISTRÁ EL TRABAJO TERMINADO';form.querySelector('.completion-section-title').hidden=true;}finish.replaceWith(form);return;}
 const b=e.target.closest('[data-coordination-action]');if(!b)return;
 const id=b.dataset.request,row=coordinationRows.get(id);if(!row)return;
 const action=b.dataset.coordinationAction,payload={state:action==='confirm-selection'?'confirmed':action};
 if(action==='arrived'&&!visitDayReached(row.appointment_at)){toast('PODÉS REGISTRAR LA LLEGADA DESDE EL DÍA ACORDADO.');return;}
 if(action==='confirm-selection'){const choice=selectedVisitSlots.get(id);if(!choice||choice.owner!==authUser?.id||choice.version!==row.version||row.state!=='proposed'||!row.slots.includes(choice.slot)){toast('VOLVÉ A ELEGIR UN HORARIO.');render();return;}payload.appointment_at=choice.slot;}

 b.disabled=true;await coordinationSave(id,payload,row.version);
});
function acceptedQuoteNotices(){return authUser&&matchingRequestsOwner===authUser.id?matchingRequests.filter(o=>o.quoteStatus==='accepted').map(o=>({id:'accepted:'+o.id,order:o})):[];}
function unreadAcceptedQuoteCount(){const read=readApplicationNotices();return acceptedQuoteNotices().filter(n=>!read.has(n.id)).length;}
function professionalQuoteNotices(){return authUser&&matchingRequestsOwner===authUser.id?matchingRequests.filter(o=>o.quoteStatus==='pending'&&!o.hasProfessionalQuote):[];}
function applicationNotices(){return authUser?userOrders().flatMap(o=>(o.quotes||[]).filter(q=>q.status==='applied'||(q.status==='quoted'&&q.quoted_price!=null)).map(q=>({id:q.status==='quoted'?'quote:'+q.id:q.id,order:o,quote:q,kind:q.status}))):[];}
function readApplicationNotices(){try{return new Set(JSON.parse(localStorage.getItem('pique-notifications-read:'+authUser?.id)||'[]'));}catch{return new Set();}}
function unreadApplicationCount(){const read=readApplicationNotices();return applicationNotices().filter(n=>!read.has(n.id)).length;}
app.addEventListener('click',e=>{const link=e.target.closest('[data-application-notice]');if(!link||!authUser)return;const read=readApplicationNotices();read.add(link.dataset.applicationNotice);localStorage.setItem('pique-notifications-read:'+authUser.id,JSON.stringify([...read]));});
let refreshingApplications=false;
async function refreshApplicationNotices(){if(!authUser||refreshingApplications)return;refreshingApplications=true;const owner=authUser.id;try{await Promise.allSettled([loadRemoteOrders(),loadMatchingRequests()]);if(authUser?.id===owner)refreshOngoingPiquesView();}finally{refreshingApplications=false;}}
const renderWithoutCoordination=render;
render=function(){const draftOwner=authUser?.id;const completionDrafts=[...app.querySelectorAll('[data-completion]')];const availabilityDrafts=[...app.querySelectorAll('[data-availability]')].map(form=>({id:form.dataset.availability,version:form.dataset.version,values:[0,1,2].map(n=>form.elements['slot'+n]?.value||'')}));renderWithoutCoordination();if(authUser?.id===draftOwner)for(const form of completionDrafts){const row=coordinationRows.get(form.dataset.completion);if(row?.state!=='arrived'||String(row.version)!==form.dataset.version)continue;const button=[...app.querySelectorAll('[data-open-completion]')].find(b=>b.dataset.request===form.dataset.completion);if(button){const panel=button.closest('.coordination-panel');panel.classList.add('completing-work');button.replaceWith(form);const section=panel.closest('.professional-coordinating-section,.professional-profile-process');const heading=section?.querySelector('.pique-section-title h2,.profile-process-heading h2');if(heading){heading.textContent='REGISTRÁ EL TRABAJO TERMINADO';form.querySelector('.completion-section-title').hidden=true;}}}if(authUser?.id===draftOwner)for(const draft of availabilityDrafts){const form=[...app.querySelectorAll('[data-availability]')].find(f=>f.dataset.availability===draft.id&&f.dataset.version===draft.version);if(form)draft.values.forEach((value,n)=>{if(form.elements['slot'+n])form.elements['slot'+n].value=value;});}if(route().name==='coordinar'&&sessionStorage.getItem('pique-open-reprogram')===route().args[0]){const details=app.querySelector('.reschedule-visit');if(details)details.open=true;}const badge=document.querySelector('.notification-count');if(badge){const count=authUser&&coordinationOwner===authUser.id?[...coordinationRows.values()].filter(r=>r.state!=='resolved').length:0;const total=count+unreadApplicationCount()+professionalQuoteNotices().length+unreadAcceptedQuoteCount();badge.textContent=total;badge.hidden=!total;}if(coordinationOwner!==authUser?.id||!coordinationLoaded)void refreshCoordination();};
notifications=function(){
 const rows=coordinationOwner===authUser?.id?[...coordinationRows.values()].sort((a,b)=>Date.parse(b.updated_at)-Date.parse(a.updated_at)):[];
 const applications=applicationNotices(),read=readApplicationNotices(),quoteNotices=professionalQuoteNotices(),accepted=acceptedQuoteNotices();
 return `${back()}${pageHead('NOVEDADES','NOTIFICACIONES','EL AVANCE DE TUS PIQUES, EN UN LUGAR.')}<div class="panel">${accepted.map(n=>`<a class="notification-item ${read.has(n.id)?'':'notification-unread'}" data-application-notice="${esc(n.id)}" href="#coordinar/${encodeURIComponent(n.order.id)}"><h3>${svg('check')} COTIZACIÓN ACEPTADA</h3><p>ACEPTARON TU COTIZACIÓN PARA ${esc(n.order.title||n.order.description)}. COORDINÁ LA VISITA.</p></a>`).join('')}${quoteNotices.map(o=>`<a class="notification-item notification-unread" href="#inicio" data-quote-alert-target="${esc(o.id)}"><h3>${svg('message')} SOLICITUD DE COTIZACIÓN</h3><p>TE SOLICITARON UNA COTIZACIÓN PARA ${esc(o.title||o.description)}.</p></a>`).join('')}${applications.map(n=>`<a class="notification-item ${read.has(n.id)?'':'notification-unread'}" data-application-notice="${esc(n.id)}" href="#propuestas/${encodeURIComponent(n.order.id)}"><h3>${svg(n.kind==='quoted'?'message':'person')} ${n.kind==='quoted'?'COTIZACIÓN RECIBIDA':'NUEVA POSTULACIÓN'}</h3><p>${n.kind==='quoted'?`RECIBISTE UNA COTIZACIÓN DE ${money(n.quote.quoted_price)} PARA`:'UN PROFESIONAL SE POSTULÓ A'} ${esc(n.order.title||n.order.description)}.</p></a>`).join('')}${rows.length?rows.map(row=>{const o=coordinationOrder(row.request_id);return `<a class="notification-item" href="#coordinar/${esc(row.request_id)}"><h3>${esc(coordinationLabels[row.state])}</h3><p>${esc(o?.title||'TU PIQUE')} · ${esc(coordinationDate(row.updated_at))}</p></a>`;}).join(''):applications.length||quoteNotices.length||accepted.length?'':`<p class="coordination-note">${svg('info')} TODAVÍA NO TENÉS NOTIFICACIONES.</p>`}</div>`;
};
setInterval(()=>{if(authUser&&!document.hidden){void refreshCoordination();void refreshApplicationNotices();}},15000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){void refreshCoordination();void refreshApplicationNotices();}});

function completionGallery(o,row){return '<div class="completion-photos">'+row.completion_photos.map((src,i)=>'<button type="button" class="completion-photo-tile" data-work-photo="'+esc(o.id)+'" data-photo-index="'+i+'" aria-label="Ampliar foto '+(i+1)+'"><img src="'+esc(src)+'" alt="Foto '+(i+1)+' del trabajo terminado" loading="lazy"><span>FOTO '+(i+1)+' · AMPLIAR</span></button>').join('')+'</div>';}
app.addEventListener('click',e=>{
 const tile=e.target.closest('[data-work-photo],[data-public-work-photo]');if(!tile)return;
 const row=tile.dataset.publicWorkPhoto?providers.flatMap(p=>p.resolvedPiques||[]).find(work=>work.id===tile.dataset.publicWorkPhoto):coordinationRows.get(tile.dataset.workPhoto);const src=row?.completion_photos?.[Number(tile.dataset.photoIndex)];if(!src)return;
 const dialog=document.createElement('dialog');dialog.className='work-photo-dialog';
 dialog.innerHTML='<button type="button" class="work-photo-close" aria-label="Cerrar foto">×</button><img alt="Foto ampliada del trabajo" src="'+esc(src)+'">';
 document.body.append(dialog);dialog.addEventListener('close',()=>{dialog.remove();tile.focus();});dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});dialog.showModal();
});

document.addEventListener('change',e=>{if(!e.target.matches('.completion-form input[type="file"]'))return;const status=e.target.closest('.completion-file-picker')?.querySelector('.completion-file-status');if(status){const count=e.target.files.length;status.textContent=count?count+' '+(count===1?'FOTO SELECCIONADA':'FOTOS SELECCIONADAS'):'NINGÚN ARCHIVO SELECCIONADO';}});

function piqueScheduleFooter(o){const visit=coordinationRows.get(o.id);if(!visit?.appointment_at)return '';const arrival=visit.arrived_at||visit.arrival_at;const finished=visit.finished_at||visit.completed_at||(['finished','resolved','issue'].includes(visit.state)?visit.updated_at:null);return '<div class="pique-schedule-footer">'+[['ACORDADO',visit.appointment_at],['LLEGADA',arrival],['FINALIZACIÓN',finished]].map(([label,time])=>'<div class="confirmed-visit agreed-visit-summary"><small>HORARIO<br>'+label+'</small><strong>'+(time?esc(coordinationDate(time)):'SIN REGISTRO')+'</strong></div>').join('')+'</div>';}
