const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const context=vm.createContext({setInterval(){}});
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../quotes.js'),'utf8'),context);
const now=Date.parse('2026-10-10T12:00:00Z');
const quote={status:'quoted',quoted_at:'2026-10-09T12:00:00Z',quoted_price:2500,estimated_minutes:120};
test('valid until exactly 24h after submission',()=>{
 assert.equal(context.quoteHasExpired(quote,now-1),false);
 assert.equal(context.quoteHasExpired(quote,now),true);
 assert.equal(context.quoteHasExpired(quote,now+1),true);
});
test('expired quote becomes requestable and hides old price and estimate',()=>{
 const result=context.currentQuote(quote,now);
 assert.equal(result.status,'cancelled');
 assert.equal(result.quoted_price,null);
 assert.equal(result.estimated_minutes,null);
 assert.equal(quote.status,'quoted');
});
test('accepted and other states are preserved',()=>{
 for(const status of ['accepted','pending','applied','rejected','cancelled']){
  const row={...quote,status};assert.equal(context.currentQuote(row,now),row);
 }
});
test('creation date never substitutes an unknown submission date',()=>{
 for(const quoted_at of [null,undefined,'invalid'])assert.equal(context.quoteHasExpired({...quote,quoted_at,created_at:'2000-01-01'},now),false);
 assert.equal(context.quoteHasExpired({...quote,quoted_at:'2026-10-10T11:00:00Z',created_at:'2000-01-01'},now),false);
});
