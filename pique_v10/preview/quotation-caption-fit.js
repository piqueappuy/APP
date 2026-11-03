/* Corrección V10: las tarjetas de descubrimiento se ajustan todas con CSS.
   Se quitaron los ajustes JS antiguos que modificaban SOLO la primera tarjeta
   del carrusel (querySelector y ancho calc(76% - 18px)). */

(()=>{const previous=fitOpenPiqueValues;fitOpenPiqueValues=function(){previous();document.querySelectorAll('.professional-card-pending').forEach(card=>{if(innerWidth>600){const values=[...card.querySelectorAll('.pique-meta-tag:not(:last-child) .meta-value')];values.forEach(e=>e.style.removeProperty('font-size'));const detail=card.querySelector('.details-tag-value');if(detail&&values.length)detail.style.setProperty('font-size',getComputedStyle(values[0]).fontSize,'important');}const reference=card.querySelector('.pique-meta-tag:not(:last-child) .meta-value');card.querySelectorAll('.quote-slider-head>b').forEach(label=>{label.querySelectorAll('br').forEach(br=>br.replaceWith(document.createTextNode(' ')));let size=reference?parseFloat(getComputedStyle(reference).fontSize):14;label.style.setProperty('font-size',size+'px','important');const twoLines=innerWidth>375&&innerWidth<=899;label.style.setProperty('white-space',twoLines?'normal':'nowrap','important');while(size>8&&(twoLines?label.clientHeight>parseFloat(getComputedStyle(label).lineHeight)*2+1:label.scrollWidth>label.clientWidth)){size-=.25;label.style.setProperty('font-size',size+'px','important');}});if(innerWidth>375&&innerWidth<=899){const labels=[...card.querySelectorAll(".quote-slider-head>b")];const common=Math.min(...labels.map(e=>parseFloat(getComputedStyle(e).fontSize)));labels.forEach(e=>e.style.setProperty("font-size",common+"px","important"));}});};scheduleSessionFit();})();

(()=>{const previous=fitSessionText;fitSessionText=function(){previous();const reference=document.querySelector('.professional-card-quoted .unified-quoting-badge');const referenceStyle=reference?getComputedStyle(reference):null;document.querySelectorAll(".unified-quoting-badge").forEach(e=>{const quoted=!!e.closest('.professional-card-quoted');const available=!!e.closest('.professional-card-discover');const applied=!!e.closest('.professional-application-layout');const label=applied?'POSTULADO':quoted?'COTIZADO':available?'DISPONIBLE':'COTIZANDO';e.classList.toggle('is-quoted',quoted);e.classList.toggle('is-applied',applied);if(applied){['display','align-items','justify-content','box-sizing','font-size','font-weight','line-height','letter-spacing','padding','min-height','height','border-radius','white-space','flex','flex-shrink','width','min-width','max-width'].forEach(property=>e.style.removeProperty(property));}if(quoted){e.style.setProperty('background','linear-gradient(135deg,#0f9f6e 0%,#18bd7d 100%)','important');e.style.setProperty('border-color','rgba(183,255,222,.78)','important');e.style.setProperty('color','#fff','important');e.style.setProperty('box-shadow','0 5px 14px rgba(3,91,62,.25)','important');}else if(applied){e.style.setProperty('background','linear-gradient(135deg,#e6aa22 0%,#f5c94a 100%)','important');e.style.setProperty('border-color','rgba(255,239,185,.9)','important');e.style.setProperty('color','#fff','important');e.style.setProperty('box-shadow','0 4px 11px rgba(140,94,0,.24)','important');}if(e.textContent!==label)e.textContent=label;});};scheduleSessionFit();})();


(()=>{const previous=fitSessionText;fitSessionText=function(){previous();const set=(el,props)=>{if(!el)return;Object.entries(props).forEach(([k,v])=>el.style.setProperty(k,v,'important'));};const mobile=innerWidth<=425,tablet=innerWidth>425&&innerWidth<900;document.querySelectorAll('.professional-discover-section>.quote-requests-heading.discover-heading,.professional-active-section>.quote-requests-heading.stacked').forEach(h=>set(h,mobile?{display:'grid','grid-template-columns':'minmax(0,1fr)','grid-template-rows':'auto auto','row-gap':'14px','column-gap':'0','align-items':'start','margin-bottom':'18px'}:{display:'grid','grid-template-columns':'minmax(0,1fr) auto','grid-template-rows':'auto','column-gap':'24px','row-gap':'0','align-items':'center','margin-bottom':'24px'}));document.querySelectorAll('.professional-discover-title,.professional-applications-review-title').forEach(h=>set(h,{width:'100%','max-width':'100%','font-size':mobile?'clamp(11px,3.35vw,15px)':'clamp(18px,2.1vw,28px)','line-height':'1.1','white-space':'nowrap','text-align':mobile?'center':'left',overflow:'visible',margin:'0'}));document.querySelectorAll('.professional-pique-filters,.professional-filters-inline').forEach(h=>set(h,mobile?{'grid-column':'1','grid-row':'2','justify-self':'center',margin:'0'}:{'grid-column':'2','grid-row':'1','justify-self':'end',margin:'0'}));document.querySelectorAll('.matching-request :is(.professional-details-tag,.pique-meta-tag)').forEach(tag=>{const icon=tag.querySelector('.details-tag-icon,.meta-icon');const svg=tag.querySelector('.details-tag-icon,.meta-icon svg');if(icon&&!icon.matches('svg'))set(icon,{width:'46px','min-width':'46px',height:'100%',display:'flex','align-items':'center','justify-content':'center','border-right':'1px solid rgba(188,224,255,.92)',padding:'0','box-sizing':'border-box'});set(svg,{width:'24px',height:'24px','min-width':'24px','min-height':'24px','max-width':'24px','max-height':'24px',display:'block',margin:'auto'});});document.querySelectorAll('.matching-request .professional-details-tag').forEach(tag=>{const icon=tag.querySelector('.details-tag-icon'),copy=tag.querySelector('.details-tag-copy');set(tag,{display:'grid','grid-template-columns':'46px minmax(0,1fr)','align-items':'stretch'});set(icon,{width:'24px',height:'24px','min-width':'24px','min-height':'24px','max-width':'24px','max-height':'24px',padding:'0',border:'0',margin:'auto'});set(copy,{'border-left':'1px solid rgba(188,224,255,.92)',padding:'0 12px',display:'flex','flex-direction':'column','justify-content':'center'});});if(innerWidth<900){document.querySelectorAll('.professional-card-quoted').forEach(card=>{const left=card.querySelector('.quote-request-left'),status=card.querySelector('.quote-status-row'),title=card.querySelector('h3'),details=card.querySelector('.professional-details-tag'),tags=card.querySelector('.quote-request-tags');set(left,{display:'flex','flex-direction':'column','justify-content':'flex-start','align-items':'stretch',position:'relative',height:'auto','min-height':'0',gap:'0',overflow:'visible'});set(status,{position:'static',order:'1',margin:'0 0 18px',width:'100%','justify-content':'space-between','align-items':'center'});set(title,{position:'static',order:'2',margin:'0 0 12px',width:'100%','font-size':mobile?'clamp(17px,5vw,21px)':'clamp(18px,2.8vw,22px)','line-height':'1.08'});set(details,{position:'static',order:'3',margin:'0 0 10px',width:'100%','min-height':'58px'});set(tags,{position:'static',order:'4',display:'grid','grid-template-columns':'repeat(2,minmax(0,1fr))','grid-template-rows':'58px','grid-auto-rows':'58px',gap:'8px',width:'100%',height:'58px','min-height':'58px',margin:'0',padding:'0',transform:'none'});const chips=[...tags.children];chips.forEach(ch=>set(ch,{position:'static',inset:'auto',display:'flex',width:'100%','min-width':'0',height:'58px','min-height':'58px',margin:'0',transform:'none',translate:'none','grid-row':'auto','grid-column':'auto'}));const date=chips.find(ch=>ch.querySelector('.meta-label')?.textContent.trim().toUpperCase()==='CREADO');set(date,{position:'absolute',top:'0',right:'0',left:'auto',width:'auto','min-width':'0',height:'28px','min-height':'28px',padding:'0 4px',margin:'0',border:'0',background:'transparent','box-shadow':'none',transform:'none',translate:'none'});});}};scheduleSessionFit();})();

(()=>{const previous=fitSessionText;fitSessionText=function(){previous();const heads=[...document.querySelectorAll('.professional-discover-title,.professional-applications-review-title')];if(!heads.length)return;let size=innerWidth<=425?15:innerWidth<900?18:Math.min(28,Math.max(18,innerWidth*.021));heads.forEach(h=>h.style.setProperty('font-size',size+'px','important'));while(size>11&&heads.some(h=>h.scrollWidth>h.clientWidth+1)){size-=.25;heads.forEach(h=>h.style.setProperty('font-size',size+'px','important'));}};scheduleSessionFit();})();


(()=>{const previous=fitSessionText;fitSessionText=function(){previous();if(innerWidth<=425||innerWidth>=900)return;const meta=[...document.querySelectorAll('.matching-request .meta-value')].filter(e=>!e.closest('.pique-meta-tag:last-child')),details=[...document.querySelectorAll('.matching-request .details-tag-value')];let size=14;[...meta,...details].forEach(e=>e.style.setProperty('font-size',size+'px','important'));while(size>11&&meta.some(e=>e.scrollWidth>e.clientWidth+1)){size-=.25;[...meta,...details].forEach(e=>e.style.setProperty('font-size',size+'px','important'));}};scheduleSessionFit();})();

(()=>{const normalize=()=>{if(innerWidth<=425||innerWidth>=900)return;document.querySelectorAll('.professional-card-quoted').forEach(card=>{card.style.setProperty('grid-template-columns','minmax(0,1.2fr) minmax(0,.8fr)','important');card.querySelectorAll('.quote-request-tags>.pique-meta-tag:not(:last-child)').forEach(tag=>{const icon=tag.querySelector('.meta-icon'),svg=tag.querySelector('.meta-icon svg'),copy=tag.querySelector('.meta-copy'),value=tag.querySelector('.meta-value');if(icon){icon.style.setProperty('width','36px','important');icon.style.setProperty('min-width','36px','important');icon.style.setProperty('display','flex','important');icon.style.setProperty('align-items','center','important');icon.style.setProperty('justify-content','center','important');}if(svg){svg.style.setProperty('width','24px','important');svg.style.setProperty('height','24px','important');svg.style.setProperty('margin','auto','important');}if(copy)copy.style.setProperty('padding','0 6px','important');if(value){value.style.setProperty('font-size','11px','important');value.style.setProperty('white-space','nowrap','important');}});});};const a=fitSessionText;fitSessionText=function(){a();normalize();};const b=fitOpenPiqueValues;fitOpenPiqueValues=function(){b();normalize();};scheduleSessionFit();})();


/* Final tablet normalization for quoted professional cards. */
(()=>{const previous=fitSessionText;fitSessionText=function(){previous();if(innerWidth<=425||innerWidth>=900)return;const set=(el,props)=>{if(!el)return;Object.entries(props).forEach(([k,v])=>el.style.setProperty(k,v,'important'));};document.querySelectorAll('.professional-card-quoted').forEach(card=>{const left=card.querySelector('.quote-request-left'),controls=card.querySelector('.quote-request-controls'),status=card.querySelector('.quote-status-row'),title=card.querySelector('h3'),details=card.querySelector('.professional-details-tag'),tags=card.querySelector('.quote-request-tags');set(card,{'grid-template-columns':'minmax(0,1.3fr) 1px minmax(224px,.8fr)','grid-template-areas':'"heading heading heading" "left divider right" "footer footer footer"',gap:'12px 14px','align-items':'stretch'});set(left,{display:'flex','flex-direction':'column','justify-content':'flex-start','align-items':'stretch',position:'relative',height:'auto','min-height':'0',gap:'0',overflow:'visible','grid-area':'left','min-width':'0'});set(controls,{'grid-area':'right','min-width':'0'});set(status,{display:'flex',position:'static',inset:'auto',order:'1',width:'100%','justify-content':'space-between','align-items':'center',margin:'0 0 16px',transform:'none'});set(title,{display:'block',position:'static',inset:'auto',order:'2',width:'100%',height:'auto','min-height':'0',margin:'0 0 12px','font-size':'clamp(18px,2.6vw,22px)','line-height':'1.08','white-space':'normal',overflow:'visible','text-overflow':'clip',transform:'none'});set(details,{display:'grid',position:'static',inset:'auto',order:'3',width:'100%',height:'58px','min-height':'58px',margin:'0 0 10px','grid-template-columns':'46px minmax(0,1fr)',transform:'none'});set(tags,{display:'grid',position:'static',inset:'auto',order:'4',width:'100%',height:'58px','min-height':'58px',margin:'0',padding:'0','grid-template-columns':'repeat(2,minmax(0,1fr))','grid-template-rows':'58px','grid-auto-rows':'58px',gap:'8px',transform:'none'});const chips=[...tags.querySelectorAll(':scope>.pique-meta-tag')];chips.forEach((chip,index)=>{if(index===chips.length-1)return;set(chip,{display:'flex',position:'static',inset:'auto',width:'100%','min-width':'0',height:'58px','min-height':'58px',margin:'0',transform:'none',translate:'none','grid-row':'1','grid-column':String(index+1)});});const date=chips.find(ch=>ch.querySelector('.meta-label')?.textContent.trim().toUpperCase()==='CREADO');set(date,{display:'flex',position:'absolute',top:'0',right:'0',left:'auto',width:'auto','min-width':'0',height:'28px','min-height':'28px',padding:'0 4px',margin:'0',border:'0',background:'transparent','box-shadow':'none',transform:'none',translate:'none'});set(date?.querySelector('.meta-icon'),{display:'flex',width:'24px','min-width':'24px',height:'28px','min-height':'28px','align-items':'center','justify-content':'center',padding:'0',border:'0'});set(date?.querySelector('.meta-icon svg'),{display:'block',width:'18px',height:'18px','min-width':'18px','min-height':'18px',margin:'auto'});set(date?.querySelector('.meta-copy'),{display:'flex','align-items':'center','justify-content':'center',height:'28px',padding:'0',margin:'0',border:'0'});date?.querySelectorAll('.meta-label,.meta-time').forEach(e=>e.style.setProperty('display','none','important'));set(date?.querySelector('.meta-date'),{display:'block','font-size':'12px','line-height':'18px','white-space':'nowrap',margin:'0'});});};scheduleSessionFit();})();

/* Keep quoted-tablet geometry after both fitting passes. */
(()=>{const normalize=()=>{if(innerWidth<=425||innerWidth>=900)return;const set=(el,props)=>{if(!el)return;Object.entries(props).forEach(([k,v])=>el.style.setProperty(k,v,'important'));};document.querySelectorAll('.professional-card-quoted').forEach(card=>{set(card,{'grid-template-columns':'minmax(0,1.3fr) 1px minmax(224px,.8fr)','grid-template-areas':'"heading heading heading" "left divider right" "footer footer footer"',gap:'12px 14px'});const tags=card.querySelector('.quote-request-tags'),details=card.querySelector('.professional-details-tag');set(details,{width:'100%',height:'58px','min-height':'58px'});set(tags,{display:'grid',width:'100%',height:'58px','min-height':'58px','grid-template-columns':'repeat(2,minmax(0,1fr))','grid-template-rows':'58px','grid-auto-rows':'58px',gap:'8px'});const chips=[...tags?.querySelectorAll(':scope>.pique-meta-tag')||[]],date=chips.find(ch=>ch.querySelector('.meta-label')?.textContent.trim().toUpperCase()==='CREADO'),regular=chips.filter(ch=>ch!==date);regular.forEach((chip,index)=>set(chip,{position:'static',inset:'auto',width:'100%',height:'58px','min-height':'58px','grid-row':'1','grid-column':String(index+1),margin:'0',transform:'none',translate:'none'}));set(date,{display:'flex',position:'absolute',top:'0',right:'0',left:'auto',width:'auto','min-width':'0',height:'28px','min-height':'28px',padding:'0 4px',margin:'0',border:'0',background:'transparent','box-shadow':'none',transform:'none',translate:'none','grid-row':'auto','grid-column':'auto'});set(date?.querySelector('.meta-icon'),{display:'flex',width:'24px','min-width':'24px',height:'28px','min-height':'28px','align-items':'center','justify-content':'center',padding:'0',border:'0'});set(date?.querySelector('.meta-icon svg'),{display:'block',width:'18px',height:'18px','min-width':'18px','min-height':'18px','max-width':'18px','max-height':'18px',margin:'auto'});set(date?.querySelector('.meta-copy'),{display:'flex','align-items':'center','justify-content':'center',height:'28px',padding:'0',margin:'0',border:'0'});date?.querySelectorAll('.meta-label,.meta-time').forEach(e=>e.style.setProperty('display','none','important'));set(date?.querySelector('.meta-date'),{display:'block','font-size':'12px','line-height':'18px','white-space':'nowrap',margin:'0'});});};const session=fitSessionText;fitSessionText=function(){session();normalize();};const values=fitOpenPiqueValues;fitOpenPiqueValues=function(){values();normalize();};scheduleSessionFit();})();

/* V12 - Fecha al lado de DISPONIBLE; RUBRO/ZONA quedan en dos columnas. */
(()=>{
  const set=(el,props)=>{if(!el)return;Object.entries(props).forEach(([k,v])=>el.style.setProperty(k,v,'important'));};
  const hideDateChip=chip=>{
    if(!chip)return;
    set(chip,{display:'none',position:'absolute',width:'0',height:'0',overflow:'hidden',margin:'0',padding:'0',border:'0','grid-column':'auto','grid-row':'auto',inset:'auto',transform:'none'});
  };
  const alignProfessionalDate=()=>{
    document.querySelectorAll('.professional-discover-section .matching-request,.professional-active-section:not(.professional-coordinating-section) .matching-request').forEach(card=>{
      const tags=card.querySelector('.quote-request-tags,.pique-meta-tags');
      const chips=[...tags?.querySelectorAll(':scope > .pique-meta-tag')||[]];
      const dateChip=chips.find(ch=>ch.querySelector('.meta-date')||ch.querySelector('.meta-label')?.textContent.trim().toUpperCase()==='CREADO');
      chips.filter(ch=>ch===dateChip||chips.indexOf(ch)>=2).forEach(hideDateChip);
      set(tags,{display:'grid','grid-template-columns':'repeat(2,minmax(0,1fr))','grid-auto-flow':'row'});
      let row=card.querySelector('.quote-status-row');
      if(!row)return;
      let created=row.querySelector('.professional-card-created');
      if(!created){
        const dateText=dateChip?.querySelector('.meta-date')?.textContent.trim()||dateChip?.querySelector('.meta-value')?.childNodes[0]?.textContent.trim();
        if(dateText){
          created=document.createElement('span');
          created.className='professional-card-created';
          created.setAttribute('aria-label','Publicado el '+dateText);
          created.innerHTML=(typeof svg==='function'?svg('calendar'):'')+'<span>'+dateText+'</span>';
          row.appendChild(created);
        }
      }
      const badge=row.querySelector('.deadline-tag');
      const badgeHeight=innerWidth<900?20:(badge?.getBoundingClientRect().height||20);
      set(row,{
        display:'flex',
        'flex-direction':'row',
        'justify-content':'space-between',
        'align-items':'center',
        'flex-wrap':'nowrap',
        width:'100%',
        'max-width':'100%',
        'min-width':'0',
        position:'relative',
        inset:'auto',
        transform:'none',
        margin:'0 0 12px'
      });
      set(created,{
        display:'inline-flex',
        'align-items':'center',
        'justify-content':'flex-end',
        gap:'5px',
        position:'static',
        inset:'auto',
        flex:'0 0 auto',
        'margin-left':'auto',
        padding:'0',
        width:'auto',
        'min-width':'0',
        'box-sizing':'border-box',
        height:badgeHeight+'px',
        'min-height':badgeHeight+'px',
        color:'#cfe5ff',
        background:'transparent',
        border:'0',
        'border-radius':'0',
        'box-shadow':'none',
        'font-size':innerWidth<=425?'14px':innerWidth<900?'17px':'12px',
        'line-height':innerWidth<900?'20px':'16px',
        'font-family':'Nunito, Arial, sans-serif',
        'font-weight':'700',
        'letter-spacing':'.2px',
        'white-space':'nowrap',
        'grid-column':'auto',
        'grid-row':'auto',
        transform:'none'
      });
    });
  };
  const oldSessionFit=fitSessionText;
  fitSessionText=function(){oldSessionFit();alignProfessionalDate();};
  const oldValueFit=fitOpenPiqueValues;
  fitOpenPiqueValues=function(){oldValueFit();alignProfessionalDate();};
  scheduleSessionFit();
})();

