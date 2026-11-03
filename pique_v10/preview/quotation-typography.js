/* Keep quotation titles at the shared readable scale above phone widths. */
(()=>{
 const fitBeforeQuotation=fitSessionText;
 fitSessionText=function(){
  fitBeforeQuotation();
  if(innerWidth<=600)document.querySelectorAll('.order-pending .request-title,.professional-card-pending>.quote-request-left>h3').forEach(title=>{title.style.removeProperty('font-size');title.style.setProperty('white-space','normal','important');});
  // Las tarjetas profesionales ya traen su estado y fecha en esta fila.
  document.querySelectorAll('.order-pending.requester-photo-card .pique-state-row').forEach(row=>{
   if(row.children.length===1&&row.firstElementChild.classList.contains('unified-quoting-badge'))return;
   const badge=document.createElement('span');
   badge.className='deadline-tag deadline-quote unified-quoting-badge';
   badge.textContent='COTIZANDO';
   row.replaceChildren(badge);
  });
  document.querySelectorAll('.order-pending.requester-photo-card>.requester-application-title').forEach(title=>{
   if(title.firstChild?.nodeType===3&&title.firstChild.nodeValue!=='¡EN BUSQUEDA DE UN ')title.firstChild.nodeValue='¡EN BUSQUEDA DE UN ';
   const word=title.querySelector('.postulation-logo-word');
   if(word?.lastChild?.nodeType===3&&word.lastChild.nodeValue!=='IQUE!')word.lastChild.nodeValue='IQUE!';
   title.style.removeProperty('font-size');
   title.style.setProperty('white-space','nowrap','important');
   title.style.setProperty('flex-wrap','nowrap','important');
   let size=innerWidth<=425?22:32;
   title.style.setProperty('font-size',size+'px','important');
   while(title.scrollWidth>title.clientWidth&&size>1){size-=.5;title.style.setProperty('font-size',size+'px','important');}
  });
  if(innerWidth<=600){
   document.querySelectorAll('.order-pending.requester-photo-card,.matching-request.professional-card-pending').forEach(card=>{
    const values=[...card.querySelectorAll('.pique-meta-tags>.pique-meta-tag:not(:last-child)>.meta-copy>.meta-value')];
    let shared=Infinity;
    values.forEach(value=>{
     value.style.removeProperty('font-size');
     let size=parseFloat(getComputedStyle(value).fontSize);
     while(value.scrollWidth>value.clientWidth&&size>9){size-=.25;value.style.setProperty('font-size',size+'px','important');}
     shared=Math.min(shared,size);
    });
    if(Number.isFinite(shared))values.forEach(value=>value.style.setProperty('font-size',shared+'px','important'));
   });
  }
  if(innerWidth<=600)return;
  document.querySelectorAll('.professional-card-pending>.quote-request-left>h3').forEach(title=>{
   title.style.removeProperty('font-size');
   title.style.setProperty('white-space',innerWidth<=899?'nowrap':'normal','important');
   if(innerWidth<=899){
    let size=parseFloat(getComputedStyle(title).fontSize);
    while(title.scrollWidth>title.clientWidth&&size>9){size-=.25;title.style.setProperty('font-size',size+'px','important');}
   }
  });
 };
 scheduleSessionFit();
})();
