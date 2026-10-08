let authClient=null,authUser=null,authReady=false,authUnavailable=false,authBusy=false;
const authRoutes=['ingresar','registro','recuperar','actualizar-clave'];
function authError(error){
 const code=error?.code;
 if(code==='invalid_credentials')return 'CORREO O CONTRASEÑA INCORRECTOS.';
 if(code==='email_not_confirmed')return 'CONFIRMÁ TU CORREO ANTES DE INGRESAR.';
 if(code==='weak_password')return 'ELEGÍ UNA CONTRASEÑA MÁS SEGURA, DE AL MENOS 8 CARACTERES.';
 if(code==='over_email_send_rate_limit'||code==='over_request_rate_limit')return 'SE ALCANZÓ EL LÍMITE DE INTENTOS. ESPERÁ UNOS MINUTOS Y VOLVÉ A PROBAR.';
 if(code==='same_password')return 'ELEGÍ UNA CONTRASEÑA DIFERENTE A LA ANTERIOR.';
 return 'NO SE PUDO COMPLETAR LA OPERACIÓN. REVISÁ TU CONEXIÓN Y VOLVÉ A INTENTAR.';
}
function authCallbackUrl(){return new URL('auth-callback.html',location.href).href;}
async function loadRemoteProfessional(){
  if(!authClient||!authUser)return;
  const userId=authUser.id;
  professionalAccount=null;
  try{
    const {data,error}=await authClient.from('professional_profiles').select('*').eq('user_id',userId).maybeSingle();
    if(authUser?.id!==userId)return;
    if(error)throw error;
    if(typeof professionalAccount!=='undefined'){
      if(data){
        const signed=async(path)=>{
          if(!path)return '';
          const result=await authClient.storage.from('professional-media').createSignedUrl(path,3600);
          return result.error?'':result.data?.signedUrl||'';
        };
        const avatar=await signed(data.avatar_path);
        const photoRows=await authClient.from('professional_work_photos').select('storage_path,position').eq('user_id',userId).order('position');
        const workUrls=photoRows.error?[]:await Promise.all((photoRows.data||[]).map(row=>signed(row.storage_path)));
        if(authUser?.id!==userId)return;
        professionalAccount={...data,firstName:data.first_name,lastName:data.last_name,neighborhoods:data.neighborhoods||[],trades:data.trades||[],zones:(data.neighborhoods||[]).join(' · '),photo:avatar,workPhotos:workUrls.filter(Boolean),active:data.active,remote:true};
      }else{
        // A profile from the old browser-only demo must never look active for a logged-in user.
        professionalAccount=null;
        localStorage.removeItem('pique-professional-v1');
      }
      if(professionalAccount){
      localStorage.setItem('pique-professional-v1',JSON.stringify(professionalAccount));
      }
    }
    await loadMatchingRequests();
  }catch(error){console.warn('PIQUE: no se pudo cargar el perfil profesional',error);}
}
let matchingRequests=[],matchingRequestsOwner=null,matchingRequestsError=false;
function hasActiveProfessional(){return !!(authUser&&professionalAccount?.active&&professionalAccount.user_id===authUser.id);}
async function loadMatchingRequests(){
 matchingRequests=[];matchingRequestsOwner=null;matchingRequestsError=false;
 if(!hasActiveProfessional())return;
 const id=authUser.id;
 try{
  const {data,error}=await authClient.from('service_requests').select('*').eq('status','proposals').is('selected_provider',null).neq('user_id',id).in('category',professionalAccount.trades||[]).order('created_at',{ascending:false});
  if(error)throw error;
  if(authUser?.id!==id)return;
  matchingRequests=(data||[]).map(o=>({...o,createdAt:o.created_at}));matchingRequestsOwner=id;
 }catch(error){if(authUser?.id===id)matchingRequestsError=true;}
}
async function loadRemoteProviders(){
 if(!authClient)return;
 try{const {data,error}=await authClient.from('professional_profiles').select('*').eq('active',true);if(error)throw error;providers=(data||[]).map(p=>({id:p.user_id,trades:p.trades||[],name:`${p.first_name||''} ${p.last_name||''}`.trim(),initials:`${(p.first_name||'P')[0]}${(p.last_name||'')[0]||''}`.toUpperCase(),rating:5,reviews:0,price:0,time:0,arrival:'A coordinar',distance:'',years:0,verified:false}));render();}catch(e){console.warn('PIQUE: no se pudieron cargar profesionales',e);}
}
async function loadRemoteOrders(){
 if(!authClient||!authUser)return;
 const userId=authUser.id;
 try{
  const {data,error}=await authClient.from('service_requests').select('*').eq('user_id',userId).order('created_at',{ascending:false});
  if(error)throw error;
  if(authUser?.id!==userId)return;
  const remote=(data||[]).filter(o=>o.user_id===userId).map(o=>({...o,createdAt:o.created_at,selected:o.selected_provider}));
  orders=[...remote,...orders.filter(o=>o.user_id!==userId)];
 }catch(error){console.warn('PIQUE: no se pudieron cargar los pedidos',error);}
}
async function saveRemoteProfessional(profile){
  if(!authClient||!authUser)return;
  const mediaPath=async(dataUrl,kind,index=0)=>{
    if(!dataUrl||!String(dataUrl).startsWith('data:'))return null;
    const response=await fetch(dataUrl);const blob=await response.blob();
    const ext=blob.type==='image/png'?'png':blob.type==='image/webp'?'webp':'jpg';
    const path=`${authUser.id}/${kind}-${index}-${Date.now()}.${ext}`;
    const {error}=await authClient.storage.from('professional-media').upload(path,blob,{contentType:blob.type,upsert:false});
    if(error)throw error;return path;
  };
  const avatarPath=await mediaPath(profile.photo,'avatar');
  const workPaths=await Promise.all((profile.workPhotos||[]).map((photo,i)=>mediaPath(photo,'work',i)));
  const payload={user_id:authUser.id,first_name:profile.firstName,last_name:profile.lastName,bio:profile.bio,neighborhoods:profile.neighborhoods||[],trades:profile.trades||[],avatar_path:avatarPath||profile.avatar_path||null,active:true,updated_at:new Date().toISOString()};
  const {error}=await authClient.from('professional_profiles').upsert(payload,{onConflict:'user_id'});
  if(error)throw error;
  if(workPaths.length){
    await authClient.from('professional_work_photos').delete().eq('user_id',authUser.id);
    const {error:photoError}=await authClient.from('professional_work_photos').insert(workPaths.map((storage_path,position)=>({user_id:authUser.id,storage_path,position})));
    if(photoError)throw photoError;
  }
}
function authAccountPanel(){
 if(!authReady)return '<section class="panel auth-panel"><p role="status">COMPROBANDO SESIÓN…</p></section>';
 if(authUser)return `<section class="panel auth-panel"><span class="eyebrow">SESIÓN INICIADA</span><div class="session-row"><h3>${esc([authUser.user_metadata?.first_name,authUser.user_metadata?.last_name].filter(Boolean).join(' ').trim()||'TU CUENTA')}</h3><p class="auth-email">${esc(authUser.email||'')}</p></div><button class="btn primary full gap" data-professional-start>${typeof professionalAccount!=='undefined'&&professionalAccount?.remote&&professionalAccount?.active&&professionalAccount?.user_id===authUser.id?'EDITAR PERFIL PROFESIONAL':'ACTIVAR PERFIL PROFESIONAL'}</button><p class="error" id="signout-error" role="alert"></p></section>`;
 return `<section class="panel auth-panel"><h2>TU CUENTA PIQUE</h2><p class="gap">Ingresá o creá tu cuenta con correo y contraseña.</p><a class="btn primary full gap" href="#ingresar">INGRESAR</a><a class="btn full gap" href="#registro">CREAR CUENTA</a>${authUnavailable?'<p class="error gap">NO PUDIMOS CONECTAR CON EL SERVICIO DE ACCESO. RECARGÁ PARA REINTENTAR.</p>':''}</section>`;
}
function authView(mode){
 const signup=mode==='registro',reset=mode==='recuperar',update=mode==='actualizar-clave';
 const title=signup?'CREÁ TU CUENTA':reset?'RECUPERÁ TU ACCESO':update?'NUEVA CONTRASEÑA':'INGRESÁ A PIQUE';
 if(update&&(!authReady||!authUser))return `${back('ingresar','INGRESAR')}<section class="panel"><h1>NUEVA CONTRASEÑA</h1><p class="gap">${authReady?'ABRÍ EL ENLACE DE RECUPERACIÓN QUE RECIBISTE POR CORREO.':'COMPROBANDO EL ENLACE…'}</p><a class="btn gap" href="#recuperar">PEDIR OTRO ENLACE</a></section>`;
 return `${pageHead('TU CUENTA',title,'')}<section class="panel">
 <form id="auth-form" data-mode="${mode}">
 ${signup?'<div class="professional-name-row"><label class="field">NOMBRE<input name="firstName" required maxlength="50" autocomplete="given-name"></label><label class="field">APELLIDO<input name="lastName" required maxlength="70" autocomplete="family-name"></label></div>':''}
 ${update?'':'<label class="field">CORREO<input class="auth-input" name="email" type="email" required maxlength="254" autocomplete="email" inputmode="email" autocapitalize="none" spellcheck="false"></label>'}
 ${reset?'':`<label class="field"><span class="password-label-row"><span>CONTRASEÑA</span>${!signup&&!update?'<a class="auth-forgot" href="#recuperar">OLVIDÉ MI CONTRASEÑA</a>':''}</span><input class="auth-input" name="password" type="password" required ${signup||update?'minlength="8"':''} maxlength="128" autocomplete="${signup||update?'new-password':'current-password'}"></label>`}
 ${signup||update?'<label class="field">REPETÍ LA CONTRASEÑA<input class="auth-input" name="confirmPassword" type="password" required minlength="8" maxlength="128" autocomplete="new-password"></label><p class="hint">USÁ AL MENOS 8 CARACTERES.</p>':''}
 <p id="auth-error" class="error gap" role="alert"></p><p id="auth-status" class="auth-status gap" role="status"></p>
 <button class="btn primary full gap" type="submit" ${!authReady||authUnavailable?'disabled':''}>${signup?'CREAR CUENTA':reset?'ENVIAR ENLACE':update?'GUARDAR CONTRASEÑA':'INGRESAR'}</button>
 </form>
 ${!signup&&!reset&&!update?'<a class="btn full gap" href="#registro">CREAR CUENTA</a>':''}
 ${signup?'<a class="link gap" href="#ingresar">YA TENGO CUENTA</a>':''}
 ${authUnavailable?'<p class="error gap">SERVICIO NO DISPONIBLE. RECARGÁ PARA REINTENTAR.</p>':''}
 <p class="demo-notice">El acceso usa tu cuenta real de PIQUE. Los pedidos y el perfil profesional siguen siendo una prueba local, todavía sin sincronización con tu cuenta.</p>
 </section>`;
}
async function initializeAuth(){
 try{
  if(!window.supabase)throw Error('SDK unavailable');
  const config=window.PIQUE_SUPABASE;
  authClient=window.supabase.createClient(config.url,config.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
  authClient.auth.onAuthStateChange((event,session)=>{
   const changed=authUser?.id!==session?.user?.id;
   authUser=session?.user||null;
   if(changed){
    professionalAccount=null;
    localStorage.removeItem('pique-professional-v1');
    if(authReady&&!authBusy&&authUser)setTimeout(async()=>{await Promise.all([loadRemoteProfessional(),loadRemoteOrders()]);render();},0);
   }
   const headerSignout=document.getElementById('auth-header-signout');if(headerSignout)headerSignout.hidden=!authUser;
   if(event==='PASSWORD_RECOVERY')location.hash='#actualizar-clave';
   // Avoid replacing a form while credentials are being entered.
   if(authReady&&!authBusy&&!['ingresar','registro','recuperar','actualizar-clave'].includes(route().name))setTimeout(()=>render(),0);
  });
  const {data,error}=await authClient.auth.getSession();if(error)throw error;
  authUser=data.session?.user||null;
  const headerSignout=document.getElementById('auth-header-signout');if(headerSignout)headerSignout.hidden=!authUser;
  if(typeof professionalAccount!=='undefined'){professionalAccount=null;localStorage.removeItem('pique-professional-v1');}
  await loadRemoteProfessional();
  await loadRemoteOrders();
  await loadRemoteProviders();
 }catch{authUnavailable=true;}
 authReady=true;
 render();
}
document.addEventListener('submit',async e=>{
 if(e.target.id!=='auth-form')return;e.preventDefault();
 if(authBusy||!authClient||!authReady)return;
 const form=e.target,mode=form.dataset.mode,data=new FormData(form);
 const errorEl=form.querySelector('#auth-error'),status=form.querySelector('#auth-status'),button=form.querySelector('[type=submit]');
 errorEl.textContent='';status.textContent='';
 const email=String(data.get('email')||'').trim(),password=String(data.get('password')||'');
 if((mode==='registro'||mode==='actualizar-clave')&&(password.length<8||password!==data.get('confirmPassword'))){errorEl.textContent='LAS CONTRASEÑAS DEBEN COINCIDIR Y TENER AL MENOS 8 CARACTERES.';return;}
 authBusy=true;button.disabled=true;button.textContent='PROCESANDO…';
 try{
  let result;
  if(mode==='registro'){
   result=await authClient.auth.signUp({email,password,options:{emailRedirectTo:authCallbackUrl(),data:{first_name:String(data.get('firstName')||'').trim(),last_name:String(data.get('lastName')||'').trim()}}});
   if(result.error)throw result.error;
   if(result.data.session){authUser=result.data.user;await Promise.all([loadRemoteProfessional(),loadRemoteOrders()]);go('cuenta');render();}
   else status.textContent='REVISÁ TU CORREO PARA CONFIRMAR EL REGISTRO. SI YA TENÉS CUENTA, INGRESÁ O RECUPERÁ TU CONTRASEÑA.';
  }else if(mode==='ingresar'){
   result=await authClient.auth.signInWithPassword({email,password});if(result.error)throw result.error;
   authUser=result.data.user;await Promise.all([loadRemoteProfessional(),loadRemoteOrders()]);go('inicio');render();
  }else if(mode==='recuperar'){
   result=await authClient.auth.resetPasswordForEmail(email,{redirectTo:authCallbackUrl()});if(result.error)throw result.error;
   status.textContent='SI EL CORREO CORRESPONDE A UNA CUENTA, RECIBIRÁS UN ENLACE PARA RECUPERAR EL ACCESO.';
  }else if(mode==='actualizar-clave'){
   result=await authClient.auth.updateUser({password});if(result.error)throw result.error;
   status.textContent='CONTRASEÑA ACTUALIZADA. YA PODÉS VOLVER A MI PERFIL.';
  }
  form.querySelectorAll('input[type=password]').forEach(input=>input.value='');
 }catch(error){errorEl.textContent=authError(error);}
 finally{authBusy=false;button.disabled=false;button.textContent=mode==='registro'?'CREAR CUENTA':mode==='recuperar'?'ENVIAR ENLACE':mode==='actualizar-clave'?'GUARDAR CONTRASEÑA':'INGRESAR';}
});
window.piqueSignOut=async()=>{try{if(authClient)await authClient.auth.signOut({scope:'local'});authUser=null;location.hash='#ingresar';render();}finally{authBusy=false;}};
document.addEventListener('click',async e=>{
 const b=e.target.closest('[data-auth-signout]');if(!b||authBusy)return;
 b.disabled=true;authBusy=true;
 try{await window.piqueSignOut();}
 catch(error){const out=document.getElementById('signout-error');if(out)out.textContent=authError(error);}
 finally{authBusy=false;b.disabled=false;}
});
