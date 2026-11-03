(()=>{
  const previousPolish=polishQuotedCards;
  polishQuotedCards=function(){
    previousPolish();
    if(innerWidth>600)return;
    const set=(element,styles)=>{
      if(!element)return;
      Object.entries(styles).forEach(([property,value])=>element.style.setProperty(property,value,'important'));
    };
    document.querySelectorAll('.professional-active-section:not(.professional-coordinating-section) .professional-card-pending').forEach(card=>{
      const controls=card.querySelector(':scope > .quote-request-controls');
      const hints=controls?.querySelectorAll(':scope > .quote-slider:not(.quote-sent-hint)');
      if(hints?.length!==2)return;
      set(controls,{
        'display':'grid',
        'grid-template-columns':'repeat(2,minmax(0,1fr))',
        'grid-template-rows':'auto auto',
        'column-gap':'7px',
        'row-gap':'9px',
        'width':'100%',
        'min-width':'0',
        'padding':'0',
        'justify-items':'stretch'
      });
      hints.forEach((hint,index)=>{
        set(hint,{
          'grid-area':'auto',
          'grid-column':String(index+1),
          'grid-row':'1',
          'width':'100%',
          'min-width':'0',
          'max-width':'none',
          'margin':'0',
          'box-sizing':'border-box',
          'padding':innerWidth<=340?'8px 4px':'10px 8px'
        });
        set(hint.querySelector('.quote-slider-head'),{'width':'100%','min-width':'0'});
        set(hint.querySelector('input[type="range"]'),{'width':'100%','min-width':'0','max-width':'100%'});
      });
      set(controls.querySelector(':scope > .quote-send'),{
        'grid-area':'auto',
        'grid-column':'1 / -1',
        'grid-row':'2',
        'width':'100%',
        'min-width':'0',
        'margin':'0'
      });
    });
  };
  scheduleSessionFit();
})();
