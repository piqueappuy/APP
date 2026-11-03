// The legacy request-detail rules use very high specificity. Keep this one
// mobile card aligned with the requester home card after each route render.
(() => {
  const app = document.getElementById('app');
  if (!app) return;
  let scheduled = false;
  const put = (el, rules) => {
    if (!el) return;
    for (const [key, value] of Object.entries(rules)) {
      if (el.style.getPropertyValue(key) !== value || el.style.getPropertyPriority(key) !== 'important')
        el.style.setProperty(key, value, 'important');
    }
  };
  const enforceProposalSummaryText = () => {
    const cards = app.querySelectorAll('.proposal-request-summary,.request-detail-home-card,.requester-photo-card');
    cards.forEach(card => {
      const targets = [...card.querySelectorAll('.details-tag-label,.details-tag-value')];
      card.querySelectorAll('.pique-meta-tag,.labeled-meta-tag').forEach(tag => {
        const label = tag.querySelector('.meta-label')?.textContent.trim().toUpperCase();
        if (label === 'RUBRO' || label === 'ZONA') targets.push(...tag.querySelectorAll('.meta-label,.meta-value'));
      });
      targets.forEach(el => {
        if (matchMedia('(max-width: 600px)').matches) put(el, {'font-size':'10px'});
        else if (matchMedia('(min-width: 601px) and (max-width: 899px)').matches && card.matches('.proposal-request-summary')) put(el, {'font-size':'12px'});
        else el.style.removeProperty('font-size');
      });
    });
  };
  const previousFitOpenPiqueValues = window.fitOpenPiqueValues;
  if (typeof previousFitOpenPiqueValues === 'function') {
    window.fitOpenPiqueValues = function (...args) {
      const result = previousFitOpenPiqueValues.apply(this, args);
      enforceProposalSummaryText();
      return result;
    };
  }
  const update = () => {
    scheduled = false;
    enforceProposalSummaryText();
    const tablet = matchMedia('(min-width: 601px) and (max-width: 899px)').matches;
    app.querySelectorAll('.requester-search-section :is(.requester-slider,.history-card-list) > .order-pending').forEach(card => {
      const textNodes = [...card.querySelectorAll('.details-tag-label,.details-tag-value')];
      card.querySelectorAll('.pique-meta-tag').forEach(tag => {
        const label = tag.querySelector('.meta-label')?.textContent.trim().toUpperCase();
        if (label === 'RUBRO' || label === 'ZONA') textNodes.push(...tag.querySelectorAll('.meta-label,.meta-value'));
      });
      textNodes.forEach(node => {
        if (tablet) put(node, {'font-size':'12px'});
        else node.style.removeProperty('font-size');
      });
    });
    if (matchMedia('(max-width: 600px)').matches) {
      app.querySelectorAll('.requester-search-section :is(.requester-slider,.history-card-list) > .order-pending').forEach(card => {
        put(card, {'width':'min(395px, calc(100vw - 30px))','max-width':'none','justify-self':'center','align-self':'center','position':'relative','left':'50%','transform':'translateX(calc(-50% + 4px))','margin-left':'0px','margin-right':'0px','box-sizing':'border-box'});
        const action = card.querySelector('.pending-order-action .btn');
        put(action, {'font-size':'15.36px'});
        put(action?.querySelector('span'), {'font-size':'15.36px','line-height':'1','white-space':'nowrap'});
      });
    } else {
      app.querySelectorAll('.requester-search-section :is(.requester-slider,.history-card-list) > .order-pending').forEach(card => {
        ['width','max-width','justify-self','align-self','position','left','transform','margin-left','margin-right','box-sizing'].forEach(name => card.style.removeProperty(name));
        const action = card.querySelector('.pending-order-action .btn');
        action?.style.removeProperty('font-size');
        action?.querySelector('span')?.style.removeProperty('font-size');
        action?.querySelector('span')?.style.removeProperty('line-height');
        action?.querySelector('span')?.style.removeProperty('white-space');
      });
    }
    app.querySelectorAll('.request-detail-home-card, .order-pending').forEach(card => {
      const hint = card.querySelector('.received-responses-hint');
      const row = card.querySelector('.pique-state-row');
      const badge = row?.querySelector('.unified-quoting-badge');
      if (!hint || !badge) return;
      if (hint.parentElement !== row) row.appendChild(hint);
      const badgeRect = badge.getBoundingClientRect();
      const badgeStyle = getComputedStyle(badge);
      const narrow = matchMedia('(max-width: 600px)').matches;
      put(row, {'display':'flex','align-items':'center','flex-wrap':'nowrap','gap':narrow?'6px':'8px'});
      put(hint, {'display':'inline-flex','align-items':'center','justify-content':'center','position':'static','left':'auto','top':'auto','grid-column':'auto','grid-row':'auto','order':'0','align-self':'center','flex':'0 1 auto','width':'max-content','max-width':`calc(100% - ${badgeRect.width+(narrow?6:8)}px)`,'height':`${badgeRect.height}px`,'min-height':'0px','box-sizing':'border-box','margin':'0px','padding':narrow?'3px 5px':badgeStyle.padding,'font-family':badgeStyle.fontFamily,'font-size':narrow?'9px':badgeStyle.fontSize,'font-weight':badgeStyle.fontWeight,'line-height':badgeStyle.lineHeight,'white-space':'nowrap','overflow':'hidden','text-overflow':'ellipsis','border-radius':'999px','border':'1px solid #ffdf82','background':'linear-gradient(135deg, #e6aa22, #f5c94a)','color':'#0754b8','box-shadow':'0 4px 11px rgba(140, 94, 0, .24)'});
      put(hint.querySelector('svg'), {'display':'none'});
      put(hint.querySelector('span'), {'min-width':'0px','overflow':'hidden','text-overflow':'ellipsis','white-space':'nowrap'});
    });
    const summary = app.querySelector('.proposal-request-summary');
    const summaryZone = [...(summary?.querySelectorAll('.pique-meta-tag') || [])].find(tag => tag.querySelector('.meta-label')?.textContent.trim().toUpperCase() === 'ZONA');
    const copyTextSize = (source, target) => {
      if (!source || !target) return;
      const style = getComputedStyle(source);
      put(target, {'font-size':style.fontSize,'line-height':style.lineHeight,'font-weight':style.fontWeight});
    };
    if (summaryZone) {
      const sourceLabel = summaryZone.querySelector('.meta-label');
      const sourceValue = summaryZone.querySelector('.meta-value');
      app.querySelectorAll('.proposal-board .professional-photo-proposal .provider-zones').forEach(zone => {
        copyTextSize(sourceLabel, zone.querySelector('.meta-label'));
        copyTextSize(sourceValue, zone.querySelector('.meta-value'));
      });
    }
    const actionTextSize = innerWidth >= 601 ? 'clamp(12px, 2vw, 14px)' : '15.36px';
    app.querySelectorAll('.proposal-board .professional-photo-proposal .proposal-request-quotation:not(.quote-awaiting),.proposal-board .professional-photo-proposal .proposal-profile-footer > .btn').forEach(button => {
      put(button, {'font-size':actionTextSize});
      put(button.querySelector('.mobile-proposal-action-label'), {'font-size':actionTextSize});
    });
    if (matchMedia('(min-width: 601px)').matches) {
      if (matchMedia('(min-width: 900px)').matches) {
        put(app.querySelector('.proposal-board .options-heading'), {'font-size':'28px','line-height':'1.2'});
        app.querySelectorAll('.request-detail-home-card').forEach(card => {
          const hint = card.querySelector('.received-responses-hint');
          if (!hint) return;
          put(card, {'display':'grid','grid-template-columns':'minmax(0, 1fr)','grid-template-rows':'auto auto','align-items':'center','row-gap':'12px'});
          put(card.querySelector('.request-description'), {'grid-column':'1','grid-row':'1','width':'100%','min-width':'0px'});
          put(card.querySelector('.pique-card-divider'), {'display':'none'});
          put(card.querySelector('.request-facts'), {'grid-column':'1 / -1','grid-row':'2','width':'100%','min-width':'0px'});
        });
        app.querySelectorAll('.request-detail-home-card .pique-meta-tag').forEach(tag => {
          put(tag, {'display':'grid','grid-template-columns':'40px minmax(0, 1fr)','align-items':'stretch','gap':'0px','padding':'0px'});
          put(tag.querySelector('.meta-icon'), {'display':'grid','place-items':'center','position':'relative','width':'40px','height':'100%','margin':'0px','padding':'0px','flex':'none'});
          put(tag.querySelector('.meta-icon svg'), {'display':'block','width':'18px','height':'18px','margin':'0px'});
          put(tag.querySelector('.meta-copy'), {'display':'flex','flex-direction':'column','justify-content':'center','height':'100%','padding':'4px 8px','gap':'3px'});
        });
        app.querySelectorAll('.proposal-board .professional-photo-proposal').forEach(proposal => {
          put(proposal, {'display':'flex','flex-direction':'column','gap':'12px','height':'auto','min-height':'0px'});
          put(proposal.querySelector('.proposal-top'), {'display':'block','height':'auto','min-height':'0px','width':'100%','padding-right':'0px','border-right':'0px'});
          put(proposal.querySelector('.proposal-person-data'), {'display':'grid','grid-template-columns':'minmax(0,1fr) minmax(190px,34%)','grid-template-rows':'52px','align-items':'center','column-gap':'14px','row-gap':'0px','width':'100%','height':'52px','min-height':'52px','margin':'0px','padding':'0px'});
          put(proposal.querySelector('.proposal-person-data > .person'), {'grid-column':'1','grid-row':'1','align-self':'center','width':'100%','min-width':'0px','height':'52px','margin':'0px'});
          put(proposal.querySelector('.proposal-provider-meta'), {'display':'flex','grid-column':'2','grid-row':'1','align-items':'stretch','width':'100%','min-width':'0px','height':'52px','min-height':'52px','margin':'0px','padding':'0px 0px 0px 14px','box-sizing':'border-box','border-left':'1px solid rgba(215,232,255,.72)'});
          const zone = proposal.querySelector('.provider-zones');
          put(zone, {'display':'grid','grid-template-columns':'40px minmax(0, 1fr)','align-items':'stretch','gap':'0px','width':'100%','height':'52px','min-height':'52px','margin':'0px','padding':'0px'});
          put(zone?.querySelector('.meta-icon'), {'display':'grid','grid-column':'1','grid-row':'1','place-items':'center','width':'40px','height':'100%','margin':'0px','padding':'0px'});
          put(zone?.querySelector('.meta-copy'), {'display':'flex','grid-column':'2','grid-row':'1','flex-direction':'column','justify-content':'center','justify-self':'stretch','width':'100%','min-width':'0px','height':'100%','gap':'3px','padding':'4px 8px','box-sizing':'border-box','border-left':'1px solid rgba(215,232,255,.65)'});
          put(proposal.querySelector('.proposal-profile-footer'), {'border-top':'0px','width':'100%','padding-top':'0px','margin':'0px'});
          [proposal.querySelector('.proposal-request-quotation'),proposal.querySelector('.proposal-profile-footer .btn')].forEach(button => {
            put(button, {'display':'flex','flex-direction':'row','align-items':'center','justify-content':'center','gap':'8px','text-align':'center','width':'100%','max-width':'none','margin':'0px','box-sizing':'border-box'});
            button?.querySelectorAll('span').forEach(span => put(span, {'display':'inline','width':'auto','white-space':'nowrap'}));
            put(button?.querySelector('svg'), {'width':'18px','height':'18px','flex':'0 0 18px'});
          });
        });
        app.querySelectorAll('.proposal-board .professional-photo-proposal').forEach(proposal => {
          const decisions = proposal.querySelector(':scope > .quotation-decisions');
          if (!decisions || !proposal.querySelector('.proposal-top.has-price')) return;
          const priceColumn = proposal.querySelector('.price-column');
          [[priceColumn?.querySelector('.price-tag'),'PRECIO ACORDADO',0],[priceColumn?.querySelector('.quote-estimate'),'TIEMPO ESTIMADO',1]].forEach(([hint,label,index]) => {
            if (!hint) return;
            hint.classList.add('quote-slider','quote-sent-hint');
            let head = hint.querySelector(':scope > .quote-slider-head');
            if (!head) {
              const value = hint.querySelector('strong')?.textContent?.trim() || '—';
              head = document.createElement('span'); head.className = 'quote-slider-head';
              const captionNode = document.createElement('b'); captionNode.textContent = label;
              const amountNode = document.createElement('strong'); amountNode.textContent = value;
              head.append(captionNode,amountNode); hint.replaceChildren(head);
            }
            const caption = head.querySelector('b'), amount = head.querySelector('strong');
            if (caption) caption.textContent = label;
            put(hint, {'display':'flex','flex-direction':'column','align-items':'center','justify-content':'center','flex':'1 1 0','min-width':'104px','min-height':'78px','margin':'0px','padding':'8px','box-sizing':'border-box','border':'1px solid rgba(190,220,255,.72)','border-radius':'11px','background':'rgba(13,76,186,.2)','box-shadow':'inset 3px 0 #8fc5ff,inset 0 0 0 1px rgba(255,255,255,.48)'});
            put(head, {'display':'grid','grid-template-columns':'minmax(0,1fr)','grid-template-rows':'auto auto','align-items':'center','align-content':'center','justify-content':'stretch','row-gap':'3px','width':'100%','height':'100%','min-height':'0px','margin':'0px','text-align':'center'});
            put(caption, {'display':'flex','align-items':'center','justify-content':'center','width':'100%','margin':'0px','font-size':'12px','line-height':'1.15','font-weight':'800','color':'#fff','text-align':'center','white-space':'normal'});
            put(amount, {'display':'flex','align-items':'center','justify-content':'center','width':'100%','margin':'0px','font-size':'24px','line-height':'1','font-weight':'950','letter-spacing':'-.4px','color':index===0?'#8ff0c9':'#d7e8ff','text-align':'center','white-space':'nowrap'});
          });
          put(priceColumn, {'gap':'8px','align-items':'stretch','transform':'translateY(6px)'});
          decisions.querySelectorAll(':scope > .btn').forEach(button => {
            const accept = button.classList.contains('quote-accept');
            put(button, {'font-size':'13px','color':'#fff','border':accept?'1px solid rgba(158,255,207,.9)':'1px solid rgba(255,174,179,.92)','background':accept?'linear-gradient(135deg,rgba(36,191,119,.86),rgba(15,139,82,.78))':'linear-gradient(135deg,rgba(229,75,87,.86),rgba(174,45,57,.78))','box-shadow':accept?'inset 0 0 0 1px rgba(255,255,255,.2),0 3px 10px rgba(9,93,59,.2)':'inset 0 0 0 1px rgba(255,255,255,.2),0 3px 10px rgba(113,24,35,.2)'});
            button.querySelectorAll('svg').forEach(icon => put(icon, {'display':'none'}));
            button.querySelectorAll('span').forEach(label => put(label, {'font-size':'13px','white-space':'nowrap','text-align':'center'}));
          });
        });
      }
      if (matchMedia('(max-width: 899px)').matches) {
        app.querySelectorAll('.request-detail-home-card').forEach(card => {
          put(card.querySelector('.pique-state-row .deadline-tag'), {'font-size':'12px'});
          put(card, {'gap':'10px'});
          put(card.querySelector('.request-description'), {'gap':'8px'});
          put(card.querySelector('.pique-state-row'), {'margin':'0px'});
          put(card.querySelector('.request-title-single'), {'margin':'0px'});
          card.querySelectorAll('.pique-meta-tag .meta-copy').forEach(copy => put(copy, {'gap':'3px'}));
        });
        app.querySelectorAll('.proposal-board .professional-photo-proposal').forEach(proposal => {
          const decisions = proposal.querySelector(':scope > .quotation-decisions');
          if (decisions && proposal.querySelector('.proposal-top.has-price')) {
            const top = proposal.querySelector('.proposal-top');
            put(proposal, {'display':'grid','grid-template-columns':'repeat(2,minmax(0,1fr))','grid-template-rows':'auto 52px','column-gap':'10px','row-gap':'12px','height':'auto','min-height':'0px','align-items':'stretch'});
            const profileFooter = proposal.querySelector('.proposal-profile-footer');
            if (profileFooter?.parentElement === proposal) top.appendChild(profileFooter);
            const compactHints = matchMedia('(max-width: 600px)').matches;
            const hintHeight = compactHints ? '74px' : '80px';
            const columnHeight = `${Number.parseInt(hintHeight,10)*2+4}px`;
            const identityHeight = compactHints ? '40px' : '52px';
            put(top, {'display':'grid','grid-template-columns':'minmax(0,1fr)','grid-template-rows':`${identityHeight} 52px 52px`,'row-gap':'4px','align-content':'start','grid-column':'1','grid-row':'1','align-self':'stretch','width':'100%','height':columnHeight,'min-height':columnHeight,'margin':'0px','padding':'0px','border-right':'0px','position':'relative'});
            put(top.querySelector('.proposal-person-data'), {'display':'contents'});
            put(top.querySelector('.person'), {'grid-column':'1','grid-row':'1','width':'100%','height':identityHeight,'min-height':identityHeight,'margin':'0px'});
            put(top.querySelector('.proposal-provider-meta'), {'display':'block','grid-column':'1','grid-row':'2','width':'100%','height':'52px','min-height':'52px','margin':'0px'});
            put(top.querySelector('.provider-zones'), {'width':'100%','max-width':'100%','height':'52px','min-height':'52px','max-height':'52px','align-self':'stretch','margin':'0px','box-sizing':'border-box'});
            const priceColumn = proposal.querySelector(':scope > .price-column') || top.querySelector('.price-column');
            if (priceColumn?.parentElement === top) proposal.insertBefore(priceColumn, decisions);
            const quoteHints = [
              [priceColumn.querySelector('.price-tag'),'PRECIO ACORDADO',0],
              [priceColumn.querySelector('.quote-estimate'),'TIEMPO ESTIMADO',1]
            ];
            quoteHints.forEach(([hint,label,index]) => {
              if (!hint) return;
              hint.classList.add('quote-slider','quote-sent-hint');
              let head = hint.querySelector(':scope > .quote-slider-head');
              if (!head) {
                const value = hint.querySelector('strong')?.textContent?.trim() || '—';
                head = document.createElement('span'); head.className = 'quote-slider-head';
                const initialCaption = document.createElement('b'); initialCaption.textContent = label;
                const initialAmount = document.createElement('strong'); initialAmount.textContent = value;
                head.append(initialCaption,initialAmount); hint.replaceChildren(head);
              }
              const caption = head.querySelector('b'), amount = head.querySelector('strong');
              if (caption) caption.textContent = label;
              put(hint, {'display':'flex','align-items':'center','justify-content':'center','width':'100%','height':hintHeight,'min-height':hintHeight,'max-height':hintHeight,'margin':'0px','padding':'10px 8px','box-sizing':'border-box','border':'1px solid rgba(190,220,255,.72)','border-radius':'11px','background':'rgba(13,76,186,.2)','box-shadow':'inset 3px 0 #8fc5ff,inset 0 0 0 1px rgba(255,255,255,.48)'});
              put(head, {'display':'grid','grid-template-columns':'minmax(0,1fr)','grid-template-rows':'auto auto','align-items':'center','align-content':'center','justify-content':'stretch','row-gap':'2px','width':'100%','height':'100%','min-height':'0px','margin':'0px','text-align':'center'});
              put(caption, {'display':'flex','grid-column':'1','grid-row':'1','align-items':'center','justify-content':'center','width':'100%','margin':'0px','font-size':compactHints?'11px':'12px','line-height':'1.15','font-weight':'800','color':'#fff','text-align':'center','white-space':'normal'});
              put(amount, {'display':'flex','grid-column':'1','grid-row':'2','align-items':'center','justify-content':'center','width':'100%','margin':'0px','font-size':compactHints?'24px':'28px','line-height':'1','font-weight':'950','letter-spacing':'-.4px','color':index===0?'#8ff0c9':'#d7e8ff','text-align':'center','white-space':'nowrap'});
            });
            put(priceColumn, {'display':'grid','grid-template-columns':'minmax(0,1fr)','grid-auto-rows':hintHeight,'grid-column':'2','grid-row':'1','align-self':'stretch','align-content':'space-between','position':'relative','inset':'auto','width':'100%','height':columnHeight,'min-height':columnHeight,'margin':'0px','padding':'0px','padding-left':'0px','border-left':'0px','gap':'4px'});
            put(decisions, {'display':'grid','grid-template-columns':'repeat(2,minmax(0,1fr))','grid-template-rows':'52px','grid-column':'1 / -1','grid-row':'2','width':'100%','min-width':'0px','gap':'8px','margin':'0px','padding':'0px','align-items':'stretch'});
            decisions.querySelectorAll(':scope > .btn').forEach(button => {
              const accept = button.classList.contains('quote-accept');
              put(button, {'display':'flex','flex-direction':'row','width':'100%','min-width':'0px','height':'52px','min-height':'52px','margin':'0px','padding':'5px 8px','gap':'6px','font-size':'13px','white-space':'normal','color':'#fff','border':accept?'1px solid rgba(158,255,207,.9)':'1px solid rgba(255,174,179,.92)','background':accept?'linear-gradient(135deg,rgba(36,191,119,.86),rgba(15,139,82,.78))':'linear-gradient(135deg,rgba(229,75,87,.86),rgba(174,45,57,.78))','box-shadow':accept?'inset 0 0 0 1px rgba(255,255,255,.2),0 3px 10px rgba(9,93,59,.2)':'inset 0 0 0 1px rgba(255,255,255,.2),0 3px 10px rgba(113,24,35,.2)'});
            });
            decisions.querySelectorAll(':scope > .btn span').forEach(label => put(label, {'display':'block','width':'auto','max-width':'100%','font-size':compactHints?'12px':'13px','line-height':'1.1','white-space':'normal','text-align':'left'}));
            decisions.querySelectorAll(':scope > .btn svg').forEach(icon => put(icon, {'width':'18px','height':'18px','flex':'0 0 18px'}));
            put(profileFooter, {'grid-column':'1','grid-row':'3','align-self':'stretch','width':'100%','height':'52px','min-height':'52px','margin':'0px','padding':'0px','padding-top':'0px','border-top':'0px'});
            const profileButton = profileFooter?.querySelector(':scope > .btn');
            put(profileButton, {'display':'flex','align-items':'center','justify-content':'center','gap':'6px','width':'100%','height':'52px','min-height':'52px','margin':'0px','font-size':'15.36px','white-space':'nowrap'});
            put(profileButton?.querySelector('span'), {'font-size':'15.36px','line-height':'1','white-space':'nowrap','text-align':'center'});
            return;
          }
          if (decisions) {
            put(proposal, {'display':'grid','grid-template-columns':'repeat(2,minmax(0,1fr))','grid-template-rows':'112px 52px','column-gap':'10px','row-gap':'8px','height':'auto','min-height':'0px','align-items':'stretch'});
            put(proposal.querySelector('.proposal-top'), {'display':'block','grid-column':'1','grid-row':'1','width':'100%','height':'100%','min-height':'0px'});
            put(proposal.querySelector('.proposal-person-data'), {'display':'flex','flex-direction':'column','justify-content':'space-between','width':'100%','height':'100%','min-height':'0px'});
            put(proposal.querySelector('.provider-zones'), {'width':'100%','max-width':'100%'});
            put(decisions, {'display':'flex','flex-direction':'column','grid-column':'2','grid-row':'1','width':'100%','min-width':'0px','gap':'6px','margin':'0px','padding':'0px','align-items':'stretch'});
            decisions.querySelectorAll(':scope > .btn').forEach(button => put(button, {'display':'flex','flex-direction':'row','width':'100%','min-width':'0px','height':'52px','min-height':'52px','margin':'0px','padding':'5px 8px','gap':'6px','font-size':'12px','white-space':'normal'}));
            decisions.querySelectorAll(':scope > .btn span').forEach(label => put(label, {'display':'block','width':'auto','max-width':'100%','font-size':'12px','line-height':'1.1','white-space':'normal','text-align':'left'}));
            decisions.querySelectorAll(':scope > .btn svg').forEach(icon => put(icon, {'width':'18px','height':'18px','flex':'0 0 18px'}));
            put(proposal.querySelector(':scope > .proposal-profile-footer'), {'grid-column':'1 / -1','grid-row':'2','width':'100%','height':'52px','min-height':'0px','margin':'0px','padding':'0px'});
            put(proposal.querySelector(':scope > .proposal-profile-footer > .btn'), {'width':'100%','height':'52px','margin':'0px'});
            return;
          }
          put(proposal, {'display':'grid','grid-template-columns':'repeat(2,minmax(0,1fr))','grid-template-rows':'52px 52px','column-gap':'12px','row-gap':'8px','height':'auto','min-height':'0px','align-items':'stretch'});
          put(proposal.querySelector('.proposal-top'), {'display':'block','grid-column':'1','grid-row':'1 / 3','width':'100%','height':'100%','min-height':'0px'});
          put(proposal.querySelector('.proposal-person-data'), {'display':'flex','flex-direction':'column','justify-content':'space-between','width':'100%','height':'100%','min-height':'0px'});
          put(proposal.querySelector('.provider-zones'), {'width':'100%','max-width':'100%'});
          put(proposal.querySelector(':scope > .proposal-request-quotation'), {'grid-column':'2','grid-row':'1','width':'100%','height':'52px','margin':'0px'});
          put(proposal.querySelector(':scope > .proposal-profile-footer'), {'grid-column':'2','grid-row':'2','width':'100%','height':'52px','min-height':'0px','margin':'0px','padding':'0px'});
          put(proposal.querySelector(':scope > .proposal-profile-footer > .btn'), {'width':'100%','height':'52px','margin':'0px'});
          const requestButton = proposal.querySelector(':scope > .proposal-request-quotation');
          const requestTextSize = innerWidth >= 601 ? 'clamp(12px, 2vw, 14px)' : '15.36px';
          put(requestButton, {'font-size':requestTextSize});
          put(requestButton?.querySelector('.mobile-proposal-action-label'), {'font-size':requestTextSize});
          const profileButton = proposal.querySelector(':scope > .proposal-profile-footer > .btn');
          const profileTextSize = innerWidth >= 601 ? 'clamp(12px, 2vw, 14px)' : '15.36px';
          put(profileButton, {'font-size':profileTextSize});
          put(profileButton?.querySelector('.mobile-proposal-action-label'), {'font-size':profileTextSize});
          put(proposal.querySelector(':scope > .proposal-request-quotation'), {'font-weight':'800'});
          put(proposal.querySelector(':scope > .proposal-request-quotation .mobile-proposal-action-label'), {'font-weight':'800'});
        });
        put(app.querySelector('.proposal-board .options-heading'), {'font-size':'24px','line-height':'1.2'});
      }
      return;
    }
    const small = matchMedia('(max-width: 360px)').matches;
    app.querySelectorAll('.request-detail-home-card').forEach(card => {
      put(card, {'display':'flex','flex-direction':'column','align-items':'stretch','gap':'8px','width':'calc(100% + 26px)','max-width':'none','height':'auto','min-height':'0px','margin':'0 -13px 20px','padding':'16px 12px 14px','position':'relative'});
      put(card.querySelector('.request-description'), {'display':'contents','position':'static'});
      put(card.querySelector('.request-facts'), {'display':'contents','position':'static'});
      put(card.querySelector('.pique-card-divider'), {'display':'none'});
      put(card.querySelector('.pique-state-row'), {'order':'1','left':'0px','top':'auto','width':'100%','max-width':'none','margin':'0 0 2px','padding':'0px'});
      put(card.querySelector('.deadline-tag'), {'background':'linear-gradient(110deg, rgba(80, 171, 255, .24), rgba(109, 230, 237, .2))','border':'1px solid rgba(157, 225, 255, .25)','color':'#c5f5ff','padding':'0 6px','height':'20px','box-sizing':'border-box'});
      const hasResponseHint = !!card.querySelector('.received-responses-hint');
      put(card.querySelector('.request-title-single'), {'order':'2','display':'block','position':'relative','left':'0px','top':'auto','width':hasResponseHint?'calc(100% - 84px)':'100%','max-width':'none','height':'auto','min-height':'0px','margin':'0px','padding':'0px','font-size':small?'14px':'18px','line-height':'1','white-space':'nowrap','overflow':'hidden','text-overflow':'ellipsis'});
      put(card.querySelector('.search-details-tag'), {'order':'3','display':'grid','position':'relative','left':'0px','top':'auto','width':'100%','max-width':'none','height':'auto','min-height':small?'54px':'52px','grid-template-columns':small?'28px minmax(0, 1fr)':'36px minmax(0, 1fr)','margin':'0px','padding':'0px'});
      put(card.querySelector('.details-tag-value'), {'font-size':small?'11px':'12px','line-height':'1.15'});
      put(card.querySelector('.pique-meta-tags'), {'order':'4','display':'grid','position':'relative','left':'0px','top':'auto','width':'100%','max-width':'none','height':'auto','min-height':'0px','grid-template-columns':'repeat(2, minmax(0, 1fr))','gap':'6px','margin':'0px','padding':'0px'});
      card.querySelectorAll('.pique-meta-tag').forEach((tag, index) => {
        if (index === 2) { put(tag, {'display':'none'}); return; }
        put(tag, {'display':'grid','position':'relative','left':'0px','top':'auto','transform':'none','width':'100%','max-width':'none','min-width':'0px','height':small?'48px':'50px','min-height':small?'48px':'50px','grid-template-columns':small?'28px minmax(0, 1fr)':'36px minmax(0, 1fr)','margin':'0px','padding':'0px'});
        put(tag.querySelector('.meta-icon'), {'width':small?'28px':'36px','min-width':small?'28px':'36px','height':'100%','display':'grid','place-items':'center'});
        put(tag.querySelector('.meta-copy'), {'width':'100%','min-width':'0px','height':'100%','padding':small?'5px 1px 5px 6px':'5px 8px','gap':'4px'});
      });
      const date = card.querySelector('.pique-meta-tag:last-child .meta-date');
      if (date && !card.querySelector(':scope > .detail-mobile-date')) {
        const text = document.createElement('span');
        text.className = 'detail-mobile-date';
        text.textContent = date.textContent;
        card.appendChild(text);
      }
      const titleRect = card.querySelector('.request-title-single')?.getBoundingClientRect();
      const dateTop = hasResponseHint && titleRect ? `${titleRect.top-card.getBoundingClientRect().top+(titleRect.height-20)/2}px` : '16px';
      put(card.querySelector(':scope > .detail-mobile-date'), {'display':'flex','align-items':'center','position':'absolute','top':dateTop,'right':'12px','height':'20px','z-index':'2','color':'white','font-family':'Nunito, Arial, sans-serif','font-size':small?'11.5px':'14px','font-weight':'800','line-height':'20px'});
    });
    enforceProposalSummaryText();
    const board = app.querySelector('.proposal-board');
    if (!board) return;
    put(board, {'width':'calc(100% + 26px)','max-width':'none','margin':'0 -13px','padding':'0px','background':'transparent','border':'0px','border-radius':'0px','box-shadow':'none'});
    const proposalSummary = app.querySelector('.proposal-request-summary') || board.previousElementSibling;
    put(proposalSummary, {'width':'calc(100% + 26px)','max-width':'none','margin-left':'-13px','margin-right':'-13px','box-sizing':'border-box','position':'relative','isolation':'isolate','overflow':'hidden','background':'#0751c2'});
    const referencePhoto = getComputedStyle(board.querySelector('.professional-photo-proposal') || board).getPropertyValue('--discover-photo').trim();
    if (proposalSummary) {
      const photo = referencePhoto || "url('assets/otros-servicios-background.png')";
      put(proposalSummary, {'background-image':`linear-gradient(rgba(7,78,190,.82),rgba(7,78,190,.82)),${photo}`,'background-position':'center right','background-size':'cover'});
    }
    const heading = board.querySelector('.options-heading');
    put(heading, {'display':'block','width':'100%','max-width':'none','margin':'12px 0 14px','padding':'0px','font-family':'Nunito, Arial, sans-serif','font-size':small?'16px':'20px','font-weight':'900','line-height':'1.15','text-align':'center','white-space':'nowrap','overflow-wrap':'normal'});
    if (heading) {
      let size = small ? 16 : 20;
      while (heading.scrollWidth > heading.clientWidth && size > 10) {
        size -= .25;
        put(heading, {'font-size':`${size}px`});
      }
    }
    const sorter = board.querySelector('.sorter');
    put(sorter, {'display':'grid','grid-template-columns':'repeat(3, minmax(0, 1fr))','gap':'6px','width':'100%','max-width':'none','margin':'0 0 14px','padding':'0px'});
    sorter?.querySelectorAll('button').forEach(button => put(button, {'display':'flex','align-items':'center','justify-content':'center','gap':'3px','width':'100%','min-width':'0px','height':'40px','padding':'5px 2px','font-family':'Nunito, Arial, sans-serif','font-size':small?'9px':'11px','font-weight':'800','line-height':'1','white-space':'nowrap'}));
    put(board.querySelector('.proposals'), {'display':'block','width':'100%','max-width':'none','margin':'0px','padding':'0px'});
    board.querySelectorAll('.professional-photo-proposal').forEach(proposal => {
      put(proposal, {'display':'grid','grid-template-columns':'minmax(0, 1fr)','grid-template-rows':'auto auto auto','row-gap':'8px','width':'100%','max-width':'none','height':'auto','min-height':'0px','margin':'0px','padding':'12px','position':'relative','overflow':'hidden','background':'#0751c2','border-left':'0px'});
      put(proposal.querySelector('.proposal-top'), {'display':'block','width':'100%','max-width':'none','height':'auto','min-height':'0px','margin':'0px','padding':'0px'});
      put(proposal.querySelector('.proposal-person-data'), {'display':'grid','grid-template-columns':'repeat(2, minmax(0, 1fr))','grid-template-rows':'36px','align-items':'stretch','column-gap':'6px','row-gap':'0px','width':'100%','max-width':'none','height':'36px','min-height':'36px','margin':'0px','padding':'0px'});
      put(proposal.querySelector('.person'), {'display':'flex','align-items':'center','gap':'5px','width':'100%','min-width':'0px','height':'36px','margin':'0px','padding':'0px'});
      put(proposal.querySelector('.person .avatar'), {'width':'36px','height':'36px','min-width':'36px','min-height':'36px','flex':'0 0 36px'});
      put(proposal.querySelector('.person-copy'), {'display':'flex','flex-direction':'column','justify-content':'center','align-self':'center','gap':'2px','min-width':'0px','width':'100%'});
      put(proposal.querySelector('.proposal-reputation'), {'margin':'0px'});
      put(proposal.querySelector('.proposal-provider-meta'), {'display':'block','grid-column':'2','grid-row':'1','width':'100%','min-width':'0px','height':'36px','margin':'0px','padding':'0px'});
      const zone = proposal.querySelector('.provider-zones');
      put(zone, {'display':'grid','grid-template-columns':small?'28px minmax(0, 1fr)':'36px minmax(0, 1fr)','position':'relative','width':'100%','max-width':'none','height':'36px','min-height':'36px','margin':'0px','padding':'0 0 0 4px','box-sizing':'border-box','border':'0px','border-radius':'0px','background':'transparent','box-shadow':'none'});
      if (zone && !zone.querySelector(':scope > .mobile-zone-separator')) {
        const separator = document.createElement('span');
        separator.className = 'mobile-zone-separator';
        separator.setAttribute('aria-hidden', 'true');
        zone.appendChild(separator);
      }
      put(zone?.querySelector(':scope > .mobile-zone-separator'), {'display':'block','position':'absolute','left':'0px','top':'50%','width':'1px','height':small?'18px':'20px','background':'rgba(215, 232, 255, .65)','transform':'translateY(-50%)','pointer-events':'none'});
      put(zone?.querySelector('.meta-icon'), {'display':'grid','place-items':'center','width':small?'28px':'36px','min-width':small?'28px':'36px','height':'100%','margin':'0px','padding':'0px'});
      put(zone?.querySelector('.meta-icon svg'), {'display':'block','width':small?'18px':'20px','height':small?'18px':'20px','margin':'0px','transform':'translateX(1px)'});
      put(zone?.querySelector('.meta-copy'), {'display':'flex','flex-direction':'column','justify-content':'center','align-items':'flex-start','width':'100%','min-width':'0px','height':'100%','gap':'2px','margin':'0px','padding':small?'5px 1px 5px 6px':'5px 8px','border-left':'0px'});
      copyTextSize(summaryZone?.querySelector('.meta-label'), zone?.querySelector('.meta-label'));
      copyTextSize(summaryZone?.querySelector('.meta-value'), zone?.querySelector('.meta-value'));
      [proposal.querySelector('.proposal-request-quotation'),proposal.querySelector('.proposal-profile-footer a')].forEach(button => {
        const buttonFontSize = '15.36px';
        put(button, {'display':'flex','align-items':'center','justify-content':'center','width':'100%','max-width':'none','min-width':'0px','height':'48px','min-height':'48px','margin':'0px','padding':'5px 8px','gap':'6px','font-size':buttonFontSize,'line-height':'1','white-space':'nowrap'});
        put(button?.querySelector('.mobile-proposal-action-label'), {'display':'inline','font-size':buttonFontSize,'line-height':'1','white-space':'nowrap'});
        put(button?.querySelector('.mobile-action-break'), {'display':'none'});
      });
      put(proposal.querySelector('.proposal-profile-footer'), {'width':'100%','max-width':'none','height':'48px','min-height':'48px','margin':'0px','padding':'0px'});
      const decisions = proposal.querySelector(':scope > .quotation-decisions');
      const top = proposal.querySelector('.proposal-top');
      if (decisions && top?.classList.contains('has-price')) {
        const priceColumn = top.querySelector('.price-column');
        const quoteHints = [[priceColumn?.querySelector('.price-tag'),'PRECIO ACORDADO',0],[priceColumn?.querySelector('.quote-estimate'),'TIEMPO ESTIMADO',1]];
        quoteHints.forEach(([hint,label,index]) => {
          if (!hint) return;
          hint.classList.add('quote-slider','quote-sent-hint');
          let head = hint.querySelector(':scope > .quote-slider-head');
          if (!head) {
            const value = hint.querySelector('strong')?.textContent?.trim() || '—';
            head = document.createElement('span'); head.className = 'quote-slider-head';
            const captionNode = document.createElement('b'); captionNode.textContent = label;
            const amountNode = document.createElement('strong'); amountNode.textContent = value;
            head.append(captionNode,amountNode); hint.replaceChildren(head);
          }
          const caption = head.querySelector('b'), amount = head.querySelector('strong');
          if (caption) caption.textContent = label;
          put(hint, {'display':'flex','flex-direction':'column','align-items':'center','justify-content':'center','width':'100%','height':'74px','min-height':'74px','max-height':'74px','margin':'0px','padding':'10px 8px','box-sizing':'border-box','border':'1px solid rgba(190,220,255,.72)','border-radius':'11px','background':'rgba(13,76,186,.2)','box-shadow':'inset 3px 0 #8fc5ff,inset 0 0 0 1px rgba(255,255,255,.48)'});
          put(head, {'display':'grid','grid-template-columns':'minmax(0,1fr)','grid-template-rows':'auto auto','align-items':'center','align-content':'center','justify-content':'stretch','row-gap':'2px','width':'100%','height':'100%','min-height':'0px','margin':'0px','text-align':'center'});
          put(caption, {'display':'flex','grid-column':'1','grid-row':'1','align-items':'center','justify-content':'center','width':'100%','margin':'0px','font-size':'11px','line-height':'1.15','font-weight':'800','color':'#fff','text-align':'center','white-space':'normal'});
          put(amount, {'display':'flex','grid-column':'1','grid-row':'2','align-items':'center','justify-content':'center','width':'100%','margin':'0px','font-size':'24px','line-height':'1','font-weight':'950','letter-spacing':'-.4px','color':index===0?'#8ff0c9':'#d7e8ff','text-align':'center','white-space':'nowrap'});
        });
        put(priceColumn, {'display':'grid','grid-template-columns':'repeat(2,minmax(0,1fr))','grid-template-rows':'74px','align-items':'stretch','width':'100%','height':'74px','min-height':'74px','margin':'8px 0 0','padding':'0px','padding-left':'0px','border-left':'0px','gap':'8px'});
        put(decisions, {'display':'grid','grid-template-columns':'repeat(2,minmax(0,1fr))','grid-template-rows':'52px','width':'100%','min-width':'0px','gap':'8px','margin':'0px','padding':'0px','align-items':'stretch'});
        decisions.querySelectorAll(':scope > .btn').forEach(button => {
          const accept = button.classList.contains('quote-accept');
          put(button, {'display':'flex','flex-direction':'row','align-items':'center','justify-content':'center','width':'100%','min-width':'0px','height':'52px','min-height':'52px','margin':'0px','padding':'3px 5px','gap':'0px','font-size':'13px','white-space':'nowrap','color':'#fff','border':accept?'1px solid rgba(158,255,207,.9)':'1px solid rgba(255,174,179,.92)','background':accept?'linear-gradient(135deg,rgba(36,191,119,.86),rgba(15,139,82,.78))':'linear-gradient(135deg,rgba(229,75,87,.86),rgba(174,45,57,.78))','box-shadow':accept?'inset 0 0 0 1px rgba(255,255,255,.2),0 3px 10px rgba(9,93,59,.2)':'inset 0 0 0 1px rgba(255,255,255,.2),0 3px 10px rgba(113,24,35,.2)'});
        });
        decisions.querySelectorAll(':scope > .btn span').forEach(label => {
          put(label, {'display':'block','flex':'0 0 auto','min-width':'0px','width':'100%','max-width':'100%','font-size':'13px','line-height':'1','white-space':'nowrap','text-align':'center','letter-spacing':'-.35px'});
        });
        decisions.querySelectorAll(':scope > .btn svg').forEach(icon => put(icon, {'display':'none'}));
        const profileFooter = proposal.querySelector(':scope > .proposal-profile-footer');
        put(profileFooter, {'width':'100%','max-width':'none','height':'52px','min-height':'52px','margin':'0px','padding':'0px','padding-top':'0px','border-top':'0px'});
        const profileButton = profileFooter?.querySelector(':scope > .btn');
        put(profileButton, {'display':'flex','align-items':'center','justify-content':'center','gap':'6px','width':'100%','height':'52px','min-height':'52px','margin':'0px','font-size':'15.36px','white-space':'nowrap'});
        put(profileButton?.querySelector('span'), {'font-size':'15.36px','line-height':'1','white-space':'nowrap','text-align':'center'});
      }
    });
  };
  new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }).observe(app, {childList:true, subtree:true});
  addEventListener('resize', update);
  update();
})();
