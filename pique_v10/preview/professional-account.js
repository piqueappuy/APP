let professionalAccount=null, professionalDraft={}, professionalStep=0;
try { professionalAccount=JSON.parse(localStorage.getItem('pique-professional-v1')||'null'); } catch {}
function professionalStart(){
  professionalDraft=professionalAccount?JSON.parse(JSON.stringify(professionalAccount)):{firstName:'',lastName:'',bio:'',trades:[],zones:'',photo:'',workPhotos:[]};
  professionalStep=0;go('ofrecer');render();
}
let accountTab='personal',accountTabOwner=null,accountTabProfessionalAvailable=false;
function accountView(){
  if(typeof authAccountPanel==='function'&&(!authReady||authUser)){
    const ownProfile=authUser&&professionalAccount?.remote&&professionalAccount?.active&&professionalAccount?.user_id===authUser.id;
    if(accountTabOwner!==authUser?.id||(ownProfile&&!accountTabProfessionalAvailable)){accountTab=ownProfile?'professional':'personal';accountTabOwner=authUser?.id;}
    accountTabProfessionalAvailable=Boolean(ownProfile);
    if(!ownProfile)accountTab='personal';
    const tabs=ownProfile?`<div class="account-tabs" role="tablist" aria-label="Tipo de perfil">${[['personal','PERFIL SOLICITANTE'],['professional','PERFIL PROFESIONAL']].map(([id,label])=>`<button type="button" role="tab" id="account-tab-${id}" aria-selected="${accountTab===id}" aria-controls="account-panel" data-account-tab="${id}">${label}</button>`).join('')}</div>`:'';
    const content=accountTab==='professional'?`${professionalDashboard()}${professionalSelfCard(professionalAccount)}<a class="btn requester-open full profile-my-piques-button" href="#pedidos"><svg viewBox="0 0 50 65" aria-hidden="true"><path fill="#0860ff" stroke="none" d="M3 60V27C3 12 13 2 26 2s23 10 23 24-10 24-24 24h-8L7 63c-2 2-4 1-4-3Z"/><path d="m18 27 7 7 12-13" fill="none" stroke="white" stroke-width="5"/></svg><span>VER MIS PIQUES</span></a>`:(authUser?requesterPiquesHeader()+requesterSelfCard():authAccountPanel());
    return `${tabs}<div id="account-panel" ${ownProfile?`role="tabpanel" aria-labelledby="account-tab-${accountTab}"`:''}>${content}</div>`;
  }
  const p=professionalAccount;
  return `${typeof authAccountPanel==='function'?authAccountPanel():''}<section class="panel">
  <div class="person"><div class="avatar large">${p?esc(p.firstName.slice(0,1)):'V'}</div><div><h3>${p?esc(p.firstName+' '+p.lastName):'VISITANTE'}</h3><p class="muted small">${p?'PERFIL PROFESIONAL ACTIVO EN ESTA DEMO':'TODAVÍA NO TENÉS UN PERFIL PROFESIONAL'}</p></div></div>
  <p class="gap">Ofrecé tus servicios y mostrales a los demás qué sabés hacer.</p>
  <button class="btn primary full gap" data-professional-start>${p?'EDITAR MIS SERVICIOS':'OFRECER MIS SERVICIOS'}</button>
  ${p?'<a class="btn full gap" href="#mi-profesional">VER MI PERFIL PROFESIONAL</a>':''}
  <p class="demo-notice">PERFIL DE DEMOSTRACIÓN DEL DISPOSITIVO. SE GUARDA SOLO EN ESTE NAVEGADOR Y TODAVÍA NO ESTÁ ASOCIADO A TU CUENTA NI PUBLICADO PARA OTROS USUARIOS.</p></section>`;
}
function professionalSelfCard(p){
  const firstTrade=p.trades?.[0]||'Otros servicios';
  const trades=(p.trades||[]).map(t=>`<span class="professional-service-pill">${categoryEmoji(t)} ${esc(t)}</span>`).join('');
  const zones=(p.neighborhoods?.length?p.neighborhoods:String(p.zones||'').split('·')).map(z=>String(z).trim()).filter(Boolean).map(z=>`<span class="professional-zone-pill">📍 ${esc(z)}</span>`).join('');
  const completion=[Boolean(p.firstName?.trim()&&p.lastName?.trim()),Boolean(p.photo),Boolean(p.trades?.length),Boolean(zones),Boolean(p.bio?.trim())];
  const progress=Math.round(completion.reduce((sum,done)=>sum+(done?20:0),0));
  return `<section class="professional-profile-card ${categoryThemeClass(firstTrade)}"><div class="professional-profile-cover"><div class="professional-profile-heading"><h2>${esc(p.firstName||'')} ${esc(p.lastName||'')}</h2></div><div class="professional-profile-services"><div class="professional-profile-field"><h3>RUBROS OFRECIDOS</h3><div class="professional-service-pills">${trades||'<span class="professional-profile-muted">Agregá tus rubros</span>'}</div></div><div class="professional-profile-field"><h3>ZONAS DE TRABAJO</h3><div class="professional-service-pills">${zones||'<span class="professional-profile-muted">Agregá tus zonas</span>'}</div></div></div><span class="professional-profile-emoji" aria-hidden="true">🧰</span></div><div class="professional-profile-body"><div class="professional-profile-progress"><div class="professional-progress-heading"><div><h3>AVANCE DEL PERFIL</h3><p>Completá tus datos para avanzar con la validación.</p></div><strong>${progress}%</strong></div><div class="professional-progress-track" role="progressbar" aria-label="Avance del perfil profesional" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><span style="width:${progress}%"></span></div><small>EL AVANCE MIDE LOS DATOS COMPLETADOS; NO CONFIRMA IDENTIDAD.</small></div><div class="professional-profile-about"><h3>SOBRE MÍ</h3><p>${esc(p.bio||'Contales a tus clientes qué servicios ofrecés y cómo trabajás.')}</p></div><button type="button" class="professional-profile-edit" data-professional-start><span aria-hidden="true">✏️</span> EDITAR PERFIL PROFESIONAL</button><button type="button" class="professional-profile-deactivate" data-professional-deactivate><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v9M6.3 5.8a9 9 0 1 0 11.4 0"/></svg><span>DESACTIVAR PERFIL PROFESIONAL</span></button></div></section>`;
}
function professionalPreview(p,includeWork=true){
  return `<section class="panel professional-preview"><div class="pro-review-columns"><div class="person pro-review-person">${p.photo?`<img class="pro-photo" src="${esc(p.photo)}" alt="Foto de perfil">`:`<div class="avatar large">${esc((p.firstName||'').slice(0,1)+(p.lastName||'').slice(0,1))}</div>`}<div><h2>${esc(p.firstName||'')}<br>${esc(p.lastName||'')}</h2></div></div>
  <div class="pro-review-details"><h3>RUBROS</h3><div class="trade-tags">${(p.trades||[]).map(t=>`<span class="trade-tag">${esc(t)}</span>`).join('')}</div>
  <h3>ZONAS DE TRABAJO</h3><div class="pro-zone-tags">${(p.neighborhoods?.length?p.neighborhoods:String(p.zones||'').split('·')).map(z=>String(z).trim()).filter(Boolean).map(z=>`<span class="pro-zone-tag">📍 ${esc(z)}</span>`).join('')}</div></div></div>
  <div class="pro-review-about"><h3>SOBRE MÍ</h3><p class="pro-bio">${esc(p.bio||'')}</p></div></section>
  ${includeWork?professionalWorkGallery(p):''}`;
}
function professionalWorkGallery(p){return `<section class="panel professional-preview pro-review-work"><h3>TRABAJOS REALIZADOS</h3>${p.workPhotos?.length?`<div class="work-gallery">${p.workPhotos.map(src=>`<img src="${esc(src)}" alt="Trabajo realizado">`).join('')}</div>`:'<p class="small muted">TODAVÍA NO AGREGASTE FOTOS.</p>'}</section>`;}
function professionalForm(){
  if(authUser){professionalDraft.firstName=authUser.user_metadata?.first_name||'';professionalDraft.lastName=authUser.user_metadata?.last_name||'';}
  const p=professionalDraft;
  return `${back('cuenta','MI PERFIL')}<div class="page-head"><span class="eyebrow">PASO ${professionalStep+1} DE 2</span><h1>${['TU PRESENTACIÓN','ASÍ SE VERÁ TU PERFIL'][professionalStep]}</h1></div>
  <form id="professional-form"><div class="panel">${professionalStep===0?`

  <fieldset class="pro-trades"><legend>RUBROS QUE OFRECÉS</legend><p class="hint trades-hint">SELECCIONÁ UNO O VARIOS RUBROS.</p><div class="professional-category-grid">${categories.map(t=>{const [symbol,tone]=categoryDesign[t]||['grid','gray'];return `<label class="category selectable-trade"><input type="checkbox" name="trades" value="${esc(t)}" ${(p.trades||[]).includes(t)?'checked':''}><span class="trade-check" aria-hidden="true">✓</span><span class="category-icon filled tone-${tone}" aria-hidden="true">${svg(symbol)}</span><span class="trade-name">${esc(t)}</span></label>`;}).join('')}</div></fieldset>
  <label class="field">SOBRE MÍ<textarea name="bio" required minlength="20" maxlength="700" placeholder="Contá tu experiencia y cómo trabajás">${esc(p.bio||'')}</textarea></label>
  <label class="field">FOTO DE PERFIL (OPCIONAL)<input type="file" name="photo" accept="image/jpeg,image/png,image/webp"><span class="hint">JPG, PNG O WEBP. MÁXIMO 1 MB.</span></label>
  ${p.photo?'<p class="small">✓ FOTO GUARDADA. PODÉS REEMPLAZARLA.</p><button type="button" class="link" data-remove-photo>QUITAR FOTO</button>':''}
  ${professionalZonePicker(p)}
  <label class="field">FOTOS DE TRABAJOS (OPCIONAL)<input type="file" name="workPhotos" accept="image/jpeg,image/png,image/webp" multiple><span class="hint">HASTA 3 FOTOS, MÁXIMO 1 MB CADA UNA. LA NUEVA SELECCIÓN REEMPLAZA LAS ANTERIORES.</span></label>
  ${p.workPhotos?.length?`<p class="small">✓ ${p.workPhotos.length} FOTOS GUARDADAS</p><button type="button" class="link" data-remove-work>QUITAR FOTOS</button>`:''}
  `:'<p>REVISÁ TU PRESENTACIÓN ANTES DE ACTIVARLA.</p>'}
  <p id="professional-error" class="error" role="alert"></p></div>
  ${professionalStep===1?professionalPreview(p):''}
  <div class="form-actions">${professionalStep?'<button class="btn" type="button" data-professional-back>ANTERIOR</button>':''}<button class="btn primary" type="submit">${professionalStep===1?'ACTIVAR PERFIL DE PRUEBA':'CONTINUAR'}</button></div>
  <p class="demo-notice">Los datos se guardan en este dispositivo. Activarlo no publica el perfil ni permite recibir solicitudes reales todavía.</p></form>`;
}
function captureProfessional(form){
  const d=new FormData(form);
  for(const k of ['firstName','lastName','bio','zones'])if(d.has(k))professionalDraft[k]=String(d.get(k)).trim();
  if(professionalStep===0)professionalDraft.trades=d.getAll('trades');
}
async function readProfessionalPhotos(files,max){
  if(files.length>max)throw Error('ELEGÍ HASTA '+max+' FOTO(S).');
  return Promise.all([...files].map(file=>{
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>1024*1024)throw Error('USÁ JPG, PNG O WEBP DE HASTA 1 MB POR FOTO.');
    return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('NO SE PUDO LEER LA FOTO.'));r.readAsDataURL(file);});
  }));
}
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.accountTab&&hasActiveProfessional()){
    accountTab=b.dataset.accountTab==='professional'?'professional':'personal';render();
    document.getElementById(`account-tab-${accountTab}`)?.focus();return;
  }
  if(b.hasAttribute('data-professional-start'))professionalStart();
  if(b.hasAttribute('data-professional-back')){captureProfessional(document.getElementById('professional-form'));professionalStep--;render();}
  if(b.hasAttribute('data-remove-photo')||b.hasAttribute('data-remove-work')){
    captureProfessional(document.getElementById('professional-form'));
    if(b.hasAttribute('data-remove-photo'))professionalDraft.photo='';else professionalDraft.workPhotos=[];
    render();
  }
});
document.addEventListener('submit',async e=>{
  if(e.target.id!=='professional-form')return;e.preventDefault();
  const form=e.target;captureProfessional(form);
  const button=form.querySelector('[type=submit]');button.disabled=true;
  try{
    if(professionalStep===0){
      if(!professionalDraft.firstName||!professionalDraft.lastName||professionalDraft.bio.length<20)throw Error('COMPLETÁ NOMBRE, APELLIDO Y UNA DESCRIPCIÓN DE AL MENOS 20 CARACTERES.');
      if(!professionalDraft.trades.length)throw Error('ELEGÍ AL MENOS UN RUBRO.');
      if(form.elements.photo.files.length)professionalDraft.photo=(await readProfessionalPhotos(form.elements.photo.files,1))[0];
      if(!professionalDraft.zones)throw Error('INDICÁ TU ZONA DE TRABAJO.');
      if(form.elements.workPhotos.files.length)professionalDraft.workPhotos=await readProfessionalPhotos(form.elements.workPhotos.files,3);
    }
    if(professionalStep<1){professionalStep++;render();window.scrollTo({top:0});}
    else{
      const saved={...professionalDraft,active:true};
      try{localStorage.setItem('pique-professional-v1',JSON.stringify(saved));}catch{throw Error('NO SE PUDO GUARDAR. PROBÁ CON MENOS FOTOS O FOTOS MÁS PEQUEÑAS.');}
      if(typeof saveRemoteProfessional==='function'&&authUser)await saveRemoteProfessional(saved);
      professionalAccount={...saved,remote:Boolean(authUser)};go('mi-profesional');toast(authUser?'PERFIL GUARDADO EN TU CUENTA.':'PERFIL DE PRUEBA ACTIVADO EN ESTE NAVEGADOR.');
    }
  }catch(error){form.querySelector('#professional-error').textContent=error.message;}
  finally{button.disabled=false;}
});

function requesterSelfCard(){
 const meta=authUser.user_metadata||{};
 const name=[meta.first_name,meta.last_name].filter(Boolean).join(' ')||meta.full_name||meta.name||'TU CUENTA';
 const logo=document.querySelector('.nav-pique-logo')?.outerHTML||'';
 const zone=meta.zone||meta.neighborhood||(professionalAccount?.user_id===authUser.id?professionalAccount.neighborhoods?.join(' · '):'')||'ZONA SIN INDICAR';
 return `<section class="panel requester-self-card"><div class="requester-card-heading"><span class="requester-card-icon" aria-hidden="true">${svg('person')}</span><h2>${esc(name)}</h2></div><div class="requester-card-details"><div class="requester-card-detail"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><div><small>ZONA</small><span>${esc(zone)}</span></div></div><div class="requester-card-detail"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg><div><small>CORREO</small><span>${esc(authUser.email||'')}</span></div></div></div>${!hasActiveProfessional()?`<button type="button" class="btn requester-open full profile-activate-button" data-professional-start><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 7V4h8v3M12 11v6M9 14h6"/></svg><span>ACTIVAR PERFIL PROFESIONAL</span></button>`:''}</section><a class="btn requester-open full profile-my-piques-button" href="#pedidos">${logo}<span>VER MIS PIQUES</span></a>`;
}

document.addEventListener('click',async e=>{const button=e.target.closest('[data-professional-deactivate]');if(!button||button.disabled||!authUser||!authClient)return;button.disabled=true;try{const userId=authUser.id;const result=await authClient.from('professional_profiles').update({active:false}).eq('user_id',userId).select('user_id,active').single();if(result.error)throw result.error;if(result.data?.active!==false)throw Error('not deactivated');if(authUser?.id!==userId)return;professionalAccount.active=false;localStorage.setItem('pique-professional-v1',JSON.stringify(professionalAccount));accountTab='personal';piquesTab='personal';providers=providers.filter(p=>p.id!==userId);render();toast('PERFIL PROFESIONAL DESACTIVADO.');}catch(error){button.disabled=false;toast('NO SE PUDO DESACTIVAR EL PERFIL. VOLVÉ A INTENTAR.');}});
