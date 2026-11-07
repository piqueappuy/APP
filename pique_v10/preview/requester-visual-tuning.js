(() => {
  const set = (node, key, value) => {
    if (node.style.getPropertyValue(key) !== value || node.style.getPropertyPriority(key) !== 'important') {
      node.style.setProperty(key, value, 'important');
    }
  };

  function tune() {
    const width = window.innerWidth;
    const desktop = width >= 900;
    const tablet = width > 600 && width < 900;
    const filterSize = desktop ? '14px' : tablet ? '12px' : '11px';
    const filterHeight = desktop ? '44px' : tablet ? '40px' : '38px';

    document.querySelectorAll('#app .requester-home-section.requester-search-section .requester-search-title').forEach(title => {
      set(title, 'font-size', desktop ? '32px' : tablet ? '26px' : '22px');
      set(title, 'line-height', '1.15');
      set(title, 'font-weight', '900');
    });

    document.querySelectorAll('#app .requester-home-section.requester-search-section .requester-filters > button').forEach(button => {
      set(button, 'font-size', filterSize);
      set(button, 'min-height', filterHeight);
      set(button, 'padding', desktop ? '10px 18px' : tablet ? '9px 14px' : '8px 12px');
    });

    if (desktop) {
      document.querySelectorAll('#app .requester-home-section.requester-search-section .requester-photo-card').forEach(card => {
        const title = card.querySelector('.request-title, h3[data-fit-card-title]');
        if (title) {
          set(title, 'font-size', '21px');
          set(title, 'line-height', '1.12');
        }
        card.querySelectorAll('.deadline-tag').forEach(tag => set(tag, 'font-size', '11px'));
        card.querySelectorAll('.request-date,.created-date,.order-date').forEach(date => set(date, 'font-size', '12px'));
        card.querySelectorAll('.details-tag-label,.meta-label').forEach(label => set(label, 'font-size', '10px'));
        card.querySelectorAll('.details-tag-value,.meta-value').forEach(value => {
          set(value, 'font-size', '12px');
          set(value, 'line-height', '1.2');
        });
      });
    }

    document.querySelectorAll('#app .order.order-completed.requester-report-finished .order-professional, #app .selected-professional-section.completed-order-link .order-professional').forEach(professional => {
      const summary = professional.querySelector(':scope > .requester-agreed-summary');
      if (!summary) return;
      if (desktop) {
        // Keep the professional in the first column; give only the hints a full-width row below.
        if (summary.parentElement !== professional) professional.append(summary);
        set(professional, 'display', 'grid');
        set(professional, 'grid-template-columns', 'repeat(2,minmax(0,1fr))');
        set(professional, 'column-gap', '12px');
        set(professional, 'row-gap', '12px');
        professional.querySelectorAll(':scope > .coordination-professional-heading,:scope > .professional-caption').forEach(heading => set(heading, 'grid-column', '1 / -1'));
        const person = professional.querySelector(':scope > .chosen-person,:scope > .detail-professional-data');
        if (person) set(person, 'grid-column', '1');
        set(summary, 'grid-column', '1 / -1');
        set(summary, 'width', '100%');
        set(summary, 'display', 'grid');
        set(summary, 'grid-template-columns', 'repeat(2,minmax(0,1fr))');
        set(summary, 'gap', '12px');
      } else {
        ['display','grid-template-columns','column-gap','row-gap'].forEach(key => professional.style.removeProperty(key));
        professional.querySelectorAll(':scope > .coordination-professional-heading,:scope > .professional-caption,:scope > .chosen-person,:scope > .detail-professional-data').forEach(node => node.style.removeProperty('grid-column'));
        ['grid-column','width','display','grid-template-columns','gap'].forEach(key => summary.style.removeProperty(key));
      }
    });

    document.querySelectorAll('#app .requester-report-finished .requester-validation-title').forEach(title => {
      set(title, 'text-align', 'center');
      set(title, 'font-weight', '900');
    });

    document.querySelectorAll('#app .order.order-completed.requester-report-finished .coordination-actions').forEach(actions => {
      set(actions, 'display', 'grid');
      set(actions, 'grid-template-columns', 'repeat(2,minmax(0,1fr))');
      set(actions, 'gap', '12px');
      actions.querySelectorAll('button').forEach((button, index) => {
        set(button, 'min-height', '54px');
        set(button, 'border-radius', '8px');
        set(button, 'display', 'flex');
        set(button, 'align-items', 'center');
        set(button, 'justify-content', 'center');
        set(button, 'gap', '8px');
        set(button, 'background', index === 0 ? 'rgba(20,145,91,.46)' : 'rgba(197,55,69,.46)');
        set(button, 'border', index === 0 ? '1px solid rgba(129,229,177,.8)' : '1px solid rgba(255,160,167,.8)');
        set(button, 'color', '#fff');
        set(button, 'box-shadow', 'inset 0 1px 0 rgba(255,255,255,.22)');
        const icon = button.querySelector('svg');
        if (icon) {
          set(icon, 'display', 'block');
          set(icon, 'width', '20px');
          set(icon, 'height', '20px');
          set(icon, 'fill', 'none');
          set(icon, 'stroke', 'currentColor');
          set(icon, 'stroke-width', '1.8');
        }
      });
    });

    document.querySelectorAll('#app .order.order-completed.requester-report-finished .chosen-person, #app .selected-professional-section.completed-order-link .chosen-person').forEach(person => {
      const zone = person.querySelector('.chosen-provider-location .meta-value');
      const opinions = person.querySelector('.combined-opinions-count');
      if (!zone || !opinions) return;
      const zoneSize = getComputedStyle(zone).fontSize;
      set(opinions, 'font-size', zoneSize);
      set(opinions, 'line-height', getComputedStyle(zone).lineHeight);
    });
  }

  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tune);
  };
  new MutationObserver(schedule).observe(document.getElementById('app'), { childList: true, subtree: true });
  window.addEventListener('resize', schedule, { passive: true });
  document.addEventListener('DOMContentLoaded', schedule, { once: true });
  schedule();
})();
