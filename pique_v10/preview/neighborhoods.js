// Source: Intendencia de Montevideo, official 62-area list (2020).
// https://montevideo.gub.uy/sites/default/files/biblioteca/barriossegunporcentajedereducciondeascensos.pdf
// Copied 2026-09-26. Accents and abbreviated names expanded for display.
const montevideoNeighborhoods=[
'Parque Rodó','Palermo','Punta Carretas','Barrio Sur','Punta Gorda','Malvín','Buceo','Pocitos','Cordón','Carrasco','Ciudad Vieja','Aguada','Carrasco Norte','Paso de las Duranas','La Comercial','Colón Sureste, Abayubá','Centro','Malvín Norte','Parque Batlle, Villa Dolores','Tres Cruces','Larrañaga','Jacinto Vera','La Blanqueada','Bañados de Carrasco','Aires Puros','Prado, Nueva Savona','La Figurita','Lezica, Melilla','Brazo Oriental','Villa García, Manga Rural','Capurro, Bella Vista','Las Canteras','Atahualpa','Reducto','Tres Ombúes, Victoria','Paso de la Arena','Villa Española','Mercado Modelo, Bolívar','Villa Muñoz, Retiro','Peñarol, Lavalleja','Cerrito','Conciliación','Nuevo París','Sayago','Colón Centro y Noroeste','Castro, Pérez Castellanos','La Teja','Manga, Toledo Chico','Ituzaingó','Manga','Jardines del Hipódromo','Maroñas, Parque Guaraní','La Paloma, Tomkinson','Casabó, Pajas Blancas','Punta de Rieles, Bella Italia','Las Acacias','Piedras Blancas','Unión','Belvedere','Casavalle','Flor de Maroñas','Cerro'
].sort((a,b)=>a.localeCompare(b,'es'));
const zoneKey=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
function canonicalNeighborhood(s){return montevideoNeighborhoods.find(n=>zoneKey(n)===zoneKey(s))||'';}
function neighborhoodOptions(){return '<datalist id="montevideo-neighborhoods">'+montevideoNeighborhoods.map(n=>'<option value="'+esc(n)+'"></option>').join('')+'</datalist>';}
function professionalZonePicker(p){
 const selected=p.neighborhoods||(p.zones?[p.zones]:[]);
 return `<div class="zone-picker"><label class="field" for="zone-search">BARRIOS O ZONAS DE TRABAJO</label><p id="zones-hint" class="hint zones-hint">SELECCIONÁ VARIOS BARRIOS O TODO MONTEVIDEO.</p><div class="zone-search-row"><input id="zone-search" aria-expanded="false" aria-controls="zone-options" aria-describedby="zones-hint" placeholder="BUSCÁ UN BARRIO" autocomplete="off"></div><div id="zone-options" class="zone-options" hidden role="group" aria-label="Barrios disponibles">${zoneOptions(selected)}</div>
 <button type="button" class="trade-tag zone-all" data-zone-all aria-pressed="${selected.includes('TODO MONTEVIDEO')}">TODO MONTEVIDEO</button>
 <div class="trade-tags zone-selected">${selected.map(n=>zoneChip(n)).join('')}</div>
 <input type="hidden" name="zones" value="${esc(selected.join(' · '))}">
 <p class="error zone-error" role="alert"></p></div>`;
}
function requestZonePicker(value){
 return `<div class="zone-picker request-zone-picker"><h3 class="question-title">BARRIO O ZONA</h3><div class="zone-search-row"><span class="request-zone-tag trade-tag" ${value?'':'hidden'}>${esc(value)}</span><input id="zone-search" aria-label="Buscar barrio" aria-expanded="false" aria-controls="zone-options" placeholder="BUSCÁ UN BARRIO" autocomplete="off"><input type="hidden" name="zone" value="${esc(value)}"></div><div id="zone-options" class="zone-options" hidden>${zoneOptions([value])}</div></div>`;
}
function setZoneList(box,open){
 if(!box)return;
 box.querySelector('.zone-options').hidden=!open;
 box.querySelector('#zone-search').setAttribute('aria-expanded',String(open));
}
document.addEventListener('focusin',e=>{
 if(e.target.id==='zone-search')setZoneList(e.target.closest('.zone-picker'),true);
 document.querySelectorAll('.zone-picker').forEach(box=>{if(!box.contains(e.target))setZoneList(box,false);});
});
document.addEventListener('click',e=>{
 document.querySelectorAll('.zone-picker').forEach(box=>{
  if(!box.contains(e.target))setZoneList(box,false);
  else if(e.target.id==='zone-search')setZoneList(box,true);
 });
});
document.addEventListener('keydown',e=>{
 const box=e.target.closest('.zone-picker');if(!box)return;
 if(e.key==='Escape'){e.preventDefault();box.querySelector('#zone-search').focus();setZoneList(box,false);}
 if(e.target.id==='zone-search'&&e.key==='ArrowDown'){e.preventDefault();setZoneList(box,true);box.querySelector('.zone-option:not([hidden])')?.focus();}
 if(e.target.id==='zone-search'&&e.key==='Enter'){e.preventDefault();setZoneList(box,true);}
});
function zoneOptions(selected){return montevideoNeighborhoods.map(n=>`<button type="button" class="zone-option" data-zone-toggle="${esc(n)}" aria-pressed="${selected.includes(n)}"><span>${esc(n)}</span><span class="zone-tick" aria-hidden="true">✓</span></button>`).join('')+'<p class="small muted zone-no-results" hidden>NO SE ENCONTRARON BARRIOS.</p>';}
document.addEventListener('input',e=>{
 if(e.target.id!=='zone-search')return;
 const box=e.target.closest('.zone-picker');setZoneList(box,true);let matches=0;
 box.querySelectorAll('[data-zone-toggle]').forEach(b=>{b.hidden=!zoneKey(b.dataset.zoneToggle).includes(zoneKey(e.target.value));if(!b.hidden)matches++;});
 box.querySelector('.zone-no-results').hidden=matches>0;
});
function zoneChip(n){return `<button type="button" class="trade-tag" data-zone-remove="${esc(n)}" aria-label="Quitar ${esc(n)}">${esc(n)} ×</button>`;}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b||!(b.hasAttribute('data-zone-toggle')||b.hasAttribute('data-zone-all')||b.hasAttribute('data-zone-remove')))return;
 const box=b.closest('.zone-picker');
 if(box.classList.contains('request-zone-picker')){
  const input=box.querySelector('[name=zone]');input.value=b.dataset.zoneToggle;draft.zone=input.value;
  const tag=box.querySelector('.request-zone-tag');tag.textContent=input.value;tag.hidden=false;
  box.querySelector('#zone-search').value='';
  box.querySelectorAll('[data-zone-toggle]').forEach(option=>option.hidden=false);
  box.querySelectorAll('[data-zone-toggle]').forEach(option=>option.setAttribute('aria-pressed',String(option===b)));
  setZoneList(box,false);return;
 }
 const error=box.querySelector('.zone-error');
 let names=[...box.querySelectorAll('[data-zone-remove]')].map(x=>x.dataset.zoneRemove);error.textContent='';
 if(b.hasAttribute('data-zone-all'))names=names.includes('TODO MONTEVIDEO')?[]:['TODO MONTEVIDEO'];
 else if(b.hasAttribute('data-zone-remove'))names=names.filter(n=>n!==b.dataset.zoneRemove);
 else{const name=b.dataset.zoneToggle;names=names.filter(n=>n!=='TODO MONTEVIDEO');names=names.includes(name)?names.filter(n=>n!==name):[...names,name];}
 box.querySelectorAll('[data-zone-toggle]').forEach(button=>button.setAttribute('aria-pressed',String(names.includes(button.dataset.zoneToggle))));
 box.querySelector('[data-zone-all]').setAttribute('aria-pressed',String(names.includes('TODO MONTEVIDEO')));
 box.querySelector('.zone-selected').innerHTML=names.map(zoneChip).join('');
 box.querySelector('[name=zones]').value=names.join(' · ');
 professionalDraft.neighborhoods=names;professionalDraft.zones=names.join(' · ');
});
