
/* One immutable review per completed request, authorized by database RLS. */
async function professionalReviews(userId){
 const {data,error}=await authClient.rpc('professional_review_names',{p_professional_id:userId});
 return error?[]:data||[];
}
function publicReviews(p){const reviews=p.realReviews||[];if(!reviews.length)return publicProfileEmpty(publicProfessionalName(p)+' AÚN NO RECIBIO OPINIONES.');return reviews.map(r=>'<article class="public-review"><div class="public-review-author"><span class="requester-card-icon" aria-hidden="true">'+svg('person')+'</span><h3>'+esc(r.reviewer_name||'SOLICITANTE')+'</h3></div><p>'+esc(r.comment||'SIN COMENTARIO')+'</p></article>').join('');}

async function openPiqueReview(id){
 const owner=authUser?.id,order=userOrders().find(o=>o.id===id);
 if(!owner||!order||order.status!=='completed')return;
 const professional=order.selected||order.assigned||order.selected_provider;if(!professional)return;
 const existing=await authClient.from('pique_reviews').select('request_id').eq('request_id',id).maybeSingle();
 if(authUser?.id!==owner)return;
 if(existing.error){toast('NO SE PUDO CARGAR LA OPINIÓN. VOLVÉ A INTENTAR.');return;}
 if(existing.data){toast('YA PUBLICASTE UNA OPINIÓN PARA ESTE PIQUE.');return;}
 document.querySelector('.pique-review-dialog')?.close();
 const dialog=document.createElement('dialog');dialog.className='pique-review-dialog';
 dialog.innerHTML='<form class="pique-review-form"><button type="button" class="review-close" aria-label="Cerrar">×</button><h2>¿CÓMO SALIÓ TU PIQUE?</h2><p>Tu opinión ayuda a elegir con confianza.</p><fieldset><legend>VALORACIÓN</legend><div class="review-rating-options">'+[1,2,3,4,5].map(n=>'<label><input type="radio" name="rating" value="'+n+'" required><span>'+n+' ★</span></label>').join('')+'</div></fieldset><label class="review-comment-label">COMENTARIO <small>OPCIONAL</small><textarea name="comment" maxlength="700" rows="3" placeholder="Contá cómo fue el trabajo"></textarea></label><p class="review-error" role="alert"></p><button class="btn primary full" type="submit">'+svg('check')+' PUBLICAR OPINIÓN</button></form>';
 dialog.querySelector('.review-close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.remove());
 dialog.querySelector('form').addEventListener('submit',async e=>{
 e.preventDefault();const form=e.target,button=form.querySelector('[type=submit]'),errorText=form.querySelector('.review-error');
 if(authUser?.id!==owner){dialog.close();return;}
 button.disabled=true;errorText.textContent='';
 const {error}=await authClient.from('pique_reviews').insert({request_id:id,professional_id:professional,customer_id:owner,rating:Number(form.elements.rating.value),comment:form.elements.comment.value.trim()});
 if(error){errorText.textContent=error.code==='23505'?'YA PUBLICASTE UNA OPINIÓN PARA ESTE PIQUE.':'NO SE PUDO PUBLICAR. VOLVÉ A INTENTAR.';button.disabled=false;return;}
 piqueDetailReviews.delete(id);dialog.close();toast('GRACIAS POR COMPARTIR TU OPINIÓN.');render();void loadRemoteProviders();
 });document.body.append(dialog);dialog.showModal();
}
app.addEventListener('click',e=>{const button=e.target.closest('[data-review-pique]');if(button)void openPiqueReview(button.dataset.reviewPique);});

const piqueDetailReviews=new Map();
let piqueDetailReviewOwner=null;
const renderBeforeReviews=render;
render=function(){
 renderBeforeReviews();const current=route();if(!['propuestas','coordinar'].includes(current.name)||!authUser)return;
 if(piqueDetailReviewOwner!==authUser.id){piqueDetailReviewOwner=authUser.id;piqueDetailReviews.clear();}
 const id=current.args[0],card=app.querySelector('.selected-request-card');if(!id||!card)return;
 if(!piqueDetailReviews.has(id)){
  piqueDetailReviews.set(id,{loading:true});const owner=authUser.id;
  void authClient.from('pique_reviews').select('request_id,professional_id,rating,comment,created_at').eq('request_id',id).maybeSingle().then(({data,error})=>{if(authUser?.id!==owner)return;piqueDetailReviews.set(id,error?{error:true}:data);if(route().args[0]===id)render();});
  return;
 }
 const review=piqueDetailReviews.get(id);
 if(review?.rating){card.insertAdjacentHTML('beforeend','<section class="pique-detail-review"><div class="pique-review-score"><h3>PUNTUACIÓN</h3><strong>★ '+Number(review.rating).toFixed(1).replace('.',',')+'</strong></div><div class="pique-review-comment"><h3>OPINIÓN</h3><p>'+esc(review.comment||'SIN COMENTARIO')+'</p></div></section>');return;}
 const order=userOrders().find(o=>o.id===id);
 if(current.name==='propuestas'&&order?.status==='completed'&&!review?.loading&&!review?.error)card.insertAdjacentHTML('beforeend','<div class="pique-review-invite"><button type="button" class="btn requester-open full" data-review-pique="'+esc(id)+'">'+svg('message')+' DEJAR UNA OPINIÓN</button></div>');
};

/* Keep unsent quote controls stable across background renders. */
const renderBeforeQuoteDrafts=render;
render=function(){
 const owner=authUser?.id;
 const drafts=Array.from(app.querySelectorAll('.professional-card-pending')).map(card=>({id:card.id,price:card.querySelector('[data-quote-price]')?.value,time:card.querySelector('[data-quote-time]')?.value}));
 renderBeforeQuoteDrafts();if(authUser?.id!==owner)return;
 for(const draft of drafts){const card=document.getElementById(draft.id);if(!card?.classList.contains('professional-card-pending'))continue;const price=card.querySelector('[data-quote-price]'),time=card.querySelector('[data-quote-time]');if(price&&draft.price!=null){price.value=draft.price;card.querySelector('[data-quote-price-value]').textContent=money(Number(draft.price));}if(time&&draft.time!=null){time.value=draft.time;card.querySelector('[data-quote-time-value]').textContent=quoteTimeLabel(Number(draft.time));}}
};
