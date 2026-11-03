const tabs=await (await fetch('http://127.0.0.1:9333/json')).json();
const page=tabs.find(x=>x.type==='page'&&x.url.includes('qa-professional'));
const ws=new WebSocket(page.webSocketDebuggerUrl);
await new Promise((ok,bad)=>{ws.onopen=ok;ws.onerror=bad});
const expression=`(()=>{const c=document.querySelector('.professional-discover-emulated'),l=c?.querySelector('.quote-request-left'),d=c?.querySelector('.professional-details-tag'),t=c?.querySelector('.quote-request-tags'),f=c?.querySelector('.professional-card-footer'),r=e=>{const b=e?.getBoundingClientRect(),g=e?getComputedStyle(e):null;return b?{x:b.x,y:b.y,w:b.width,h:b.height,display:g.display,position:g.position,margin:g.margin,gap:g.gap,justify:g.justifyContent,align:g.alignItems,top:g.top,bottom:g.bottom,transform:g.transform}:null};return {iw:innerWidth,card:r(c),left:r(l),details:r(d),tags:r(t),footer:r(f),children:l?[...l.children].map(e=>({cls:e.className,box:r(e)})):[]}})()`;
ws.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression,returnByValue:true}}));
const out=await new Promise(ok=>ws.onmessage=e=>ok(JSON.parse(e.data)));
console.log(JSON.stringify(out.result.result.value,null,2));
ws.close();