/* PIQUES: actualizar el diseño cuando cambia el tamaño (móvil/tablet/escritorio).
   Algunas rutinas de ajuste inyectan estilos inline; al cruzar un breakpoint
   hay que recrear la vista para descartar los cálculos de la anterior. */
(()=>{
 'use strict';
 const BREAKPOINTS=[425,480,560,600,700,899];
 const tier=width=>BREAKPOINTS.findIndex(limit=>width<=limit)===-1
  ?BREAKPOINTS.length:BREAKPOINTS.findIndex(limit=>width<=limit);
 let currentTier=tier(window.innerWidth);
 let frame=0;

 function snapshot(app){
  const fields=[...app.querySelectorAll('input,textarea,select')].filter(el=>el.type!=='file'&&el.type!=='password');
  const activeIndex=fields.indexOf(document.activeElement);
  const inputs=fields.map(el=>({
   type:el.type,name:el.name||'',value:el.value,checked:el.checked,
   selection:typeof el.selectionStart==='number'? [el.selectionStart,el.selectionEnd]:null
  }));
  const sliders=[...app.querySelectorAll('.quote-requests-slider,.quote-requests-list,.requester-slider,.dashboard-slider')].map(el=>el.scrollLeft);
  return {inputs,sliders,activeIndex,x:window.scrollX,y:window.scrollY};
 }

 function restore(app,state){
  const fields=[...app.querySelectorAll('input,textarea,select')].filter(el=>el.type!=='file'&&el.type!=='password');
  fields.forEach((el,i)=>{
   const old=state.inputs[i];
   if(!old||el.type!==old.type||(el.name||'')!==old.name)return;
   if(el.type==='checkbox'||el.type==='radio')el.checked=old.checked;
   else if(el.value!==old.value)el.value=old.value;
   // Actualiza el precio/tiempo visible sin enviar ni guardar una cotización.
   if(el.matches('[data-quote-price],[data-quote-time]'))el.dispatchEvent(new Event('input',{bubbles:true}));
  });
  const sliders=app.querySelectorAll('.quote-requests-slider,.quote-requests-list,.requester-slider,.dashboard-slider');
  sliders.forEach((el,i)=>{if(state.sliders[i]!=null)el.scrollLeft=state.sliders[i];});
  if(state.activeIndex>=0&&fields[state.activeIndex]){
   const el=fields[state.activeIndex];
   el.focus({preventScroll:true});
   const selection=state.inputs[state.activeIndex]?.selection;
   if(selection&&typeof el.setSelectionRange==='function'){
    try{el.setSelectionRange(...selection);}catch{} // No todos los tipos permiten selección.
   }
  }
  window.scrollTo(state.x,state.y);
 }

 function onViewportChange(){
  const next=tier(window.innerWidth);
  if(next===currentTier)return;
  currentTier=next;
  cancelAnimationFrame(frame);
  frame=requestAnimationFrame(()=>{
   const app=document.getElementById('app');
   if(!app||typeof render!=='function')return;
   const state=snapshot(app);
   if(typeof capture==='function')capture();
   render(); // Sin recarga de página, conservando el estado de la aplicación.
   restore(app,state);
   if(typeof scheduleSessionFit==='function')scheduleSessionFit();
   requestAnimationFrame(()=>{
    window.scrollTo(state.x,state.y);
   });
  });
 }

 window.addEventListener('resize',onViewportChange,{passive:true});
 window.addEventListener('orientationchange',onViewportChange,{passive:true});
 window.visualViewport?.addEventListener('resize',onViewportChange,{passive:true});
})();
