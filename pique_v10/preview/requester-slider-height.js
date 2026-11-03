(()=>{
  let frame=0;
  const observed=new WeakSet();
  const cardObserver=new ResizeObserver(schedule);

  function sync(){
    document.querySelectorAll('.requester-search-section .requester-search-slider').forEach(slider=>{
      const cards=[...slider.children];
      if(!cards.length)return;
      cards.forEach(card=>{
        if(!observed.has(card)){
          observed.add(card);
          cardObserver.observe(card);
        }
      });
      const left=slider.getBoundingClientRect().left;
      const active=cards.reduce((best,card)=>
        Math.abs(card.getBoundingClientRect().left-left)<Math.abs(best.getBoundingClientRect().left-left)
          ? card : best, cards[0]);
      const style=getComputedStyle(slider);
      const padding=Number.parseFloat(style.paddingTop)+Number.parseFloat(style.paddingBottom);
      const height=Math.ceil(active.getBoundingClientRect().height+padding);
      if(slider.style.height!==`${height}px`)slider.style.setProperty('height',`${height}px`,'important');
    });
  }

  function schedule(){
    if(frame)return;
    frame=requestAnimationFrame(()=>{frame=0;sync();});
  }

  document.getElementById('app')?.addEventListener('scroll',event=>{
    if(event.target.matches?.('.requester-search-slider'))schedule();
  },true);
  new MutationObserver(schedule).observe(document.getElementById('app'),{childList:true,subtree:true});
  window.addEventListener('resize',schedule);
  document.fonts.ready.then(schedule);
  schedule();
})();
