(async()=>{
 const status=document.getElementById('callback-status');
 try{
  const params=new URLSearchParams(location.hash.slice(1));
  const recovery=params.get('type')==='recovery';
  if(params.has('error')||new URLSearchParams(location.search).has('error'))throw Error('expired');
  const config=window.PIQUE_SUPABASE;
  const client=window.supabase.createClient(config.url,config.publishableKey);
  const {data,error}=await client.auth.getSession();
  // Remove tokens and errors from the address bar even on failed verification.
  history.replaceState(null,'',location.pathname);
  if(error||!data.session)throw Error('session missing');
  location.replace('./'+(recovery?'#actualizar-clave':'#inicio'));
 }catch{
  history.replaceState(null,'',location.pathname);
  status.textContent='EL ENLACE VENCIÓ O NO SE PUDO VERIFICAR. VOLVÉ A INGRESAR O PEDÍ UN NUEVO ENLACE DE RECUPERACIÓN.';
 }
})();
