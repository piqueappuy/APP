(()=>{
  const previousFit=fitSessionText;
  fitSessionText=function(){
    previousFit();
    if(innerWidth<601){
      document.querySelectorAll('.professional-discover-section .professional-card-created span, .professional-active-section .professional-card-created span').forEach(element=>element.style.setProperty('font-size','12px','important'));
      return;
    }
    const set=(element,styles)=>{
      if(!element)return;
      Object.entries(styles).forEach(([property,value])=>element.style.setProperty(property,value,'important'));
    };
    const sections=[
      ['.professional-discover-section','.discover-heading','.professional-discover-title','.professional-pique-filters','.professional-card-discover'],
      ['.professional-active-section:not(.professional-coordinating-section):not(.professional-profile-active-section)','.quote-requests-heading.stacked','.professional-applications-review-title','.professional-filters-inline','.matching-request']
    ];
    sections.forEach(([sectionSelector,headingSelector,titleSelector,filtersSelector,cardSelector])=>{
    const section=document.querySelector(sectionSelector);
    if(!section)return;
    set(section.querySelector(headingSelector),{
      'display':'grid',
      'grid-template-columns':'minmax(0,1fr)',
      'grid-template-rows':'auto auto',
      'gap':'12px',
      'justify-items':'center',
      'margin-bottom':'20px'
    });
    set(section.querySelector(titleSelector),{
      'grid-column':'1',
      'grid-row':'1',
      'width':'100%',
      'text-align':'center'
    });
    set(section.querySelector(filtersSelector),{
      'grid-column':'1',
      'grid-row':'2',
      'justify-self':'center',
      'justify-content':'center',
      'margin':'0'
    });
    section.querySelectorAll(cardSelector).forEach(card=>{
      const left=card.querySelector(':scope > .quote-request-left');
      set(left,{'gap':'10px'});
      set(card,{'row-gap':'10px'});
      [':scope > .quote-status-row',':scope > h3',':scope > .professional-details-tag',':scope > .pique-meta-tags'].forEach(selector=>set(left?.querySelector(selector),{'margin':'0'}));
    });
    });
    const discover=document.querySelector('.professional-discover-section');
    set(discover?.querySelector('.professional-discover-title'),{'font-size':'clamp(24px,2.5vw,32px)','line-height':'1.15'});
    if(innerWidth>=1200)set(document.querySelector('.professional-active-section:not(.professional-coordinating-section):not(.professional-profile-active-section) .professional-applications-review-title'),{'font-size':'32px'});
    if(innerWidth<900)set(document.querySelector('.professional-active-section:not(.professional-coordinating-section):not(.professional-profile-active-section) .professional-applications-review-title'),{'font-size':'24px'});
    if(innerWidth<900)document.querySelectorAll('.professional-active-section .quote-send, .professional-active-section .quote-send span').forEach(element=>set(element,{'font-size':'18px'}));
    document.querySelectorAll('.professional-discover-section .professional-card-discover, .professional-active-section:not(.professional-coordinating-section) .matching-request:is(.professional-card-pending,.professional-card-quoted,.professional-card-applied)').forEach(card=>{
      const tags=card.querySelector('.quote-request-left > .quote-request-tags, .quote-request-controls > .pique-meta-tags');
      const zone=tags?.querySelector('.pique-meta-tag:nth-child(2)');
      const headerDate=card.querySelector('.quote-status-row .professional-card-created');
      if(!tags||!zone||!headerDate)return;
      if(innerWidth<900){
        const desktopDate=tags.querySelector('.professional-laptop-date-tag');
        if(desktopDate){
          if(desktopDate.dataset.generatedDateTag==='true')desktopDate.remove();
          else{desktopDate.classList.remove('professional-laptop-date-tag');desktopDate.style.setProperty('display','none','important');}
        }
        set(headerDate,{'display':'inline-flex'});
        set(headerDate.querySelector('span'),{'font-size':'12px','line-height':'1.1'});
        set(tags,{'grid-template-columns':'repeat(2,minmax(0,1fr))'});
        return;
      }
      let dateTag=[...tags.querySelectorAll('.pique-meta-tag')].find(tag=>tag.querySelector('.meta-label')?.textContent.trim()==='CREADO'&&!tag.classList.contains('professional-meta-last-guard'));
      if(!dateTag){
        dateTag=zone.cloneNode(true);
        dateTag.classList.add('professional-laptop-date-tag');
        dateTag.dataset.generatedDateTag='true';
        dateTag.querySelector('.meta-label').textContent='CREADO';
        dateTag.querySelector('.meta-value').textContent=headerDate.querySelector('span')?.textContent||'';
        const calendar=headerDate.querySelector('svg');
        if(calendar)dateTag.querySelector('.meta-icon svg')?.replaceWith(calendar.cloneNode(true));
        tags.appendChild(dateTag);
      }else{
        dateTag.classList.add('professional-laptop-date-tag');
      }
      set(headerDate,{'display':'none'});
      set(tags,{'display':'grid','grid-template-columns':'repeat(3,minmax(0,1fr))','grid-template-rows':'auto','gap':'7px','width':'100%'});
      set(dateTag,{'display':'grid','grid-column':'3','grid-row':'1','width':'100%','min-width':'0','max-width':'100%','height':getComputedStyle(zone).height,'min-height':getComputedStyle(zone).height,'margin':'0'});
    });
  };
  const previousValueFit=fitOpenPiqueValues;
  fitOpenPiqueValues=function(){
    previousValueFit();
    if(innerWidth>340)return;
    document.querySelectorAll('.professional-active-section .professional-card-pending').forEach(card=>{
      if(!card.querySelector('[data-quote-price-value]'))return;
      card.querySelectorAll('.quote-slider-head > b').forEach(label=>{
        label.style.setProperty('font-size','11px','important');
        label.style.setProperty('white-space','normal','important');
        label.style.setProperty('line-height','1.1','important');
      });
    });
  };
  scheduleSessionFit();
})();
