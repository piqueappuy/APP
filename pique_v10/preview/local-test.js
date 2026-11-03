/* Offline UX sandbox: loaded only by prueba-local.html. */
(()=>{
'use strict';
if(!['localhost','127.0.0.1','[::1]'].includes(location.hostname)){document.body.textContent='Esta prueba solo funciona en localhost.';throw Error('Local only');}
window.PIQUE_LOCAL_TEST=true;
const KEY='pique-offline-flow-v1',C='11111111-1111-4111-8111-111111111111',P='22222222-2222-4222-8222-222222222222',R='33333333-3333-4333-8333-333333333333';
const now=()=>new Date().toISOString(),copy=x=>JSON.parse(JSON.stringify(x));
const users={customer:{id:C,email:'solicitante@prueba.local',user_metadata:{first_name:'Gonzalo',last_name:'Prueba'}},professional:{id:P,email:'profesional@prueba.local',user_metadata:{first_name:'Braulio',last_name:'López'}}};
const role=sessionStorage.getItem('pique-offline-role')==='professional'?'professional':'customer',user=()=>users[role];
function seed(){return {service_requests:[{id:R,user_id:C,category:'Electricidad',title:'Necesito instalar una llave térmica',description:'Instalar una llave térmica en el tablero de casa.',zone:'Aguada',urgency:'Solo cotizar',status:'proposals',selected_provider:null,created_at:now()}],professional_profiles:[{user_id:P,first_name:'Braulio',last_name:'López',bio:'Electricista de prueba para validar el flujo.',trades:['Electricidad'],neighborhoods:['Aguada'],active:true,avatar_path:null}],quote_requests:[],pique_coordination:[],pique_reviews:[],professional_work_photos:[]};}
let db;try{db=JSON.parse(localStorage.getItem(KEY));}catch{}if(!db?.service_requests)db=seed();
const save=()=>localStorage.setItem(KEY,JSON.stringify(db));save();
const fail=message=>({data:null,error:{code:'LOCAL_TEST',message}});
function visible(t,r){if(t==='quote_requests')return r.customer_id===user().id||r.professional_id===user().id;if(t==='pique_coordination')return db.service_requests.some(o=>o.id===r.request_id&&[o.user_id,o.selected_provider].includes(user().id));return true;}
function project(t,r,cols){const v=copy(r);if(t==='service_requests'&&cols.includes('pique_coordination('))v.pique_coordination=copy(db.pique_coordination.find(c=>c.request_id===r.id)||null);if(t==='quote_requests'&&cols.includes('service_requests(')){const o=db.service_requests.find(o=>o.id===r.service_request_id);v.service_requests=o?project('service_requests',o,'*,pique_coordination(state)'):null;}return cols==='*'||cols.includes('(')?v:Object.fromEntries(cols.split(',').map(k=>k.trim()).filter(Boolean).map(k=>[k,v[k]]));}
class Query{
constructor(table){this.t=table;this.filters=[];this.cols='*';this.kind='read';}
select(c='*'){this.cols=c;return this;}eq(k,v){this.filters.push(r=>r[k]===v);return this;}neq(k,v){this.filters.push(r=>r[k]!==v);return this;}is(k,v){this.filters.push(r=>(r[k]??null)===v);return this;}in(k,vs){this.filters.push(r=>vs.includes(r[k]));return this;}
order(k,o={}){this.sort=[k,o.ascending!==false];return this;}limit(n){this.max=n;return this;}
insert(p){this.kind='insert';this.p=p;return this;}update(p){this.kind='update';this.p=p;return this;}upsert(p){this.kind='upsert';this.p=p;return this;}delete(){this.kind='delete';return this;}single(){this.one=true;return this;}maybeSingle(){this.one=true;this.optional=true;return this;}
then(resolve,reject){return Promise.resolve().then(()=>this.run()).then(resolve,reject);}
run(){
if(!db[this.t])return fail('Operación no disponible en la prueba local.');
let rows=db[this.t].filter(r=>visible(this.t,r)&&this.filters.every(f=>f(r)));
if(['insert','upsert'].includes(this.kind)){rows=[];for(const input of [this.p].flat()){
const item={id:crypto.randomUUID(),created_at:now(),...copy(input)};
if(this.t==='service_requests'){if(user().id!==C)return fail('Publicá desde el solicitante.');item.user_id=C;item.selected_provider??=null;}
if(this.t==='quote_requests'&&db.quote_requests.some(q=>q.service_request_id===item.service_request_id&&q.professional_id===item.professional_id))return {data:null,error:{code:'23505'}};
if(this.t==='pique_coordination'){const o=db.service_requests.find(o=>o.id===item.request_id);if(!o||o.status!=='selected'||![o.user_id,o.selected_provider].includes(user().id))return fail('Primero elegí al profesional.');Object.assign(item,{version:1,updated_at:now(),ever_confirmed:false});}
const old=this.kind==='upsert'?db[this.t].find(r=>r.user_id===item.user_id):null;if(old){Object.assign(old,item);rows.push(old);}else{db[this.t].push(item);rows.push(item);}
}}else if(this.kind==='update'){for(const r of rows){
if(this.t==='pique_coordination'){const o=db.service_requests.find(o=>o.id===r.request_id),next=this.p.state,allowed={confirmed:['on_way'],on_way:['arrived'],arrived:['finished']};
if(next==='confirmed'&&(r.state!=='proposed'||r.proposed_by===user().id))return fail('El otro perfil confirma el horario.');
if(['on_way','arrived','finished'].includes(next)&&(o.selected_provider!==user().id||!allowed[r.state]?.includes(next)))return fail('Avanzá desde el profesional en el orden indicado.');
if(next==='issue'&&(o.user_id!==user().id||r.state!=='finished'))return fail('El solicitante valida el trabajo.');
r.version++;r.updated_at=now();if(next==='confirmed')r.ever_confirmed=true;if(next==='arrived')r.arrived_at=now();if(next==='finished')r.finished_at=now();}
Object.assign(r,copy(this.p));
}}else if(this.kind==='delete')db[this.t]=db[this.t].filter(r=>!rows.includes(r));
if(this.kind!=='read')save();if(this.sort){const [k,a]=this.sort;rows.sort((a1,b)=>String(a1[k]).localeCompare(String(b[k]))*(a?1:-1));}if(this.max)rows=rows.slice(0,this.max);
const data=rows.map(r=>project(this.t,r,this.cols));return this.one?{data:data[0]||null,error:!data.length&&!this.optional?{code:'PGRST116'}:null}:{data,error:null};
}}
async function rpc(name,args={}){
if(name==='respond_to_quote'){const q=db.quote_requests.find(q=>q.id===args.quote_id);if(!q||q.customer_id!==user().id||q.status!=='quoted')return fail('El solicitante acepta la cotización.');q.status=args.decision;if(args.decision==='accepted'){const o=db.service_requests.find(o=>o.id===q.service_request_id);o.status='selected';o.selected_provider=q.professional_id;}save();return {data:null,error:null};}
if(name==='confirm_pique_completion'){const c=db.pique_coordination.find(c=>c.request_id===args.p_request_id),o=db.service_requests.find(o=>o.id===args.p_request_id);if(!c||o?.user_id!==user().id||c.state!=='finished'||c.version!==args.p_version)return fail('El solicitante confirma el informe actual.');c.state='resolved';c.version++;c.updated_at=now();o.status='completed';save();return {data:copy(c),error:null};}
if(name==='pique_customer')return {data:{first_name:'Gonzalo',last_name:'Prueba'},error:null};
if(name==='professional_review_names')return {data:db.pique_reviews.filter(r=>r.professional_id===args.p_professional_id).map(r=>({...r,reviewer_name:'Gonzalo Prueba'})),error:null};
if(name==='professional_completed_work_v2')return {data:db.service_requests.filter(o=>o.selected_provider===args.p_professional_id&&o.status==='completed').map(o=>({...o,...db.pique_coordination.find(c=>c.request_id===o.id)})),error:null};
return fail('Acción no disponible en la prueba local.');
}
const client={from:t=>new Query(t),rpc,auth:{onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),getSession:async()=>{if(document.readyState==='loading')await new Promise(resolve=>document.addEventListener('DOMContentLoaded',resolve,{once:true}));return {data:{session:{user:copy(user())}},error:null};},signOut:async()=>{location.href='app.html#ingresar';return {error:null};},signInWithPassword:async()=>fail('Usá los botones de perfil de prueba.')},storage:{from:()=>({createSignedUrl:async()=>({data:{signedUrl:''},error:null})})}};
window.supabase={createClient:()=>client};
const fetchOriginal=window.fetch.bind(window);window.fetch=(input,opts)=>{const u=new URL(typeof input==='string'?input:input.url,location.href);if(u.hostname.endsWith('.supabase.co'))return Promise.reject(Error('Supabase está desconectado en la prueba local.'));return fetchOriginal(input,opts);};
function switchRole(next){sessionStorage.setItem('pique-offline-role',next);location.hash='#inicio';location.reload();}
const bar=document.createElement('aside');bar.className='local-test-bar';bar.setAttribute('aria-label','Controles de prueba local');bar.innerHTML='<strong>PRUEBA LOCAL · SIN SUPABASE</strong><div><button data-test-role="customer">Solicitante</button><button data-test-role="professional">Profesional</button><button data-test-reset>Reiniciar prueba</button><a href="app.html#ingresar">Salir de la prueba</a></div><p>Datos ficticios en este navegador. Publicá → cotizá → elegí → coordiná → enviá informe → validá.</p>';
bar.querySelectorAll('[data-test-role]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.testRole===role));b.onclick=()=>switchRole(b.dataset.testRole);});bar.querySelector('[data-test-reset]').onclick=()=>{localStorage.removeItem(KEY);localStorage.removeItem('pique-local-orders-v1');switchRole('customer');};document.body.prepend(bar);
window.PiqueLocalTest={client,ids:{customer:C,professional:P,request:R}};
})();
