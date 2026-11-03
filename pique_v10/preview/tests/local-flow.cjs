// Run with: node tests/local-flow.cjs
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('path').join(__dirname,'../local-test.js'),'utf8');
const values=new Map([['pique-demo-v1','real-drafts-preserved']]);
const storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
let networkCalls=0;
function context(role){
 const button={setAttribute(){}};
 const bar={setAttribute(){},querySelectorAll(){return []},querySelector(){return button}};
 const c={console,URL,crypto:require('node:crypto').webcrypto,localStorage:storage,sessionStorage:{getItem:()=>role,setItem(){}},location:{hostname:'localhost',href:'http://localhost/prueba-local.html',hash:'#inicio',reload(){}},document:{readyState:'complete',createElement:()=>bar,body:{prepend(){}}},confirm:()=>true};
 c.window=c;c.fetch=async()=>{networkCalls++;return {}};vm.createContext(c);vm.runInContext(source,c);return c;
}
(async()=>{
 let c=context('customer'),client=c.PiqueLocalTest.client,{customer,professional,request}=c.PiqueLocalTest.ids;
 let q=await client.from('quote_requests').insert({service_request_id:request,customer_id:customer,professional_id:professional,status:'pending'}).select('*').single();assert.equal(q.error,null);
 let p=context('professional');await p.PiqueLocalTest.client.from('quote_requests').update({status:'quoted',quoted_price:2500,estimated_minutes:120}).eq('id',q.data.id);
 c=context('customer');client=c.PiqueLocalTest.client;assert.equal((await client.rpc('respond_to_quote',{quote_id:q.data.id,decision:'accepted'})).error,null);
 const schedule=await client.from('pique_coordination').insert({request_id:request,proposed_by:customer,slots:['2026-11-01T13:00:00Z'],state:'proposed'}).select('*').single();assert.equal(schedule.data.version,1);
 assert((await client.from('pique_coordination').update({state:'confirmed'}).eq('request_id',request)).error);
 p=context('professional');const pc=p.PiqueLocalTest.client;
 for(const state of ['confirmed','on_way','arrived','finished'])assert.equal((await pc.from('pique_coordination').update({state}).eq('request_id',request)).error,null);
 c=context('customer');client=c.PiqueLocalTest.client;assert.equal((await client.rpc('confirm_pique_completion',{p_request_id:request,p_version:5})).data.state,'resolved');
 assert.equal((await client.from('service_requests').select('*').eq('id',request).single()).data.status,'completed');
 await assert.rejects(()=>c.fetch('https://example.supabase.co/rest/v1/service_requests'));
 assert.equal(networkCalls,0);assert.equal(values.get('pique-demo-v1'),'real-drafts-preserved');
 console.log('PASS: two profiles, persistent full flow, invalid self-confirmation blocked, no Supabase traffic, real drafts preserved');
})().catch(e=>{console.error(e);process.exitCode=1});
