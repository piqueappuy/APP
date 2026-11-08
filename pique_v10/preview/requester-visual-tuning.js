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
      document.querySelectorAll('#app .completion-details-button > span').forEach(label => set(label, 'font-size', '16px'));
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
        set(professional, 'grid-template-rows', 'auto auto auto');
        set(professional, 'column-gap', '12px');
        set(professional, 'row-gap', '12px');
        professional.querySelectorAll(':scope > .coordination-professional-heading,:scope > .professional-caption').forEach(heading => {
          set(heading, 'grid-column', '1 / -1');
          set(heading, 'grid-row', '1');
        });
        const person = professional.querySelector(':scope > .chosen-person,:scope > .detail-professional-data');
        if (person) {
          set(person, 'grid-column', '1 / -1');
          set(person, 'grid-row', '2');
          if (person.classList.contains('chosen-person')) {
            set(person, 'width', '100%');
            set(person, 'grid-template-columns', 'minmax(0,1fr) minmax(0,1fr)');
            set(person, 'grid-template-rows', 'auto auto');
            set(person, 'gap', '8px 16px');
            const identity = person.querySelector('.chosen-identity');
            const zone = person.querySelector('.chosen-provider-location');
            const rating = person.querySelector('.chosen-rating');
            const profile = person.querySelector('.professional-profile-button');
            if (identity) {
              set(identity, 'grid-column', '1');
              set(identity, 'grid-row', '1');
              set(identity, 'display', 'flex');
              set(identity, 'align-items', 'center');
              set(identity, 'gap', '10px');
              const name = identity.querySelector('.chosen-professional-name');
              if (name) { set(name, 'font-size', '17px'); set(name, 'line-height', '1.2'); }
            }
            if (zone) { set(zone, 'grid-column', '2'); set(zone, 'grid-row', '1'); set(zone, 'align-self', 'center'); }
            if (rating) { set(rating, 'grid-column', '2'); set(rating, 'grid-row', '2'); set(rating, 'align-self', 'center'); }
            if (profile) { set(profile, 'grid-column', '1'); set(profile, 'grid-row', '2'); }
            const reference = professional.closest('.order')?.querySelector('.validation-meta-item');
            if (reference) {
              const referenceStyle = getComputedStyle(reference);
              person.querySelectorAll('.chosen-provider-location,.combined-opinions-tag').forEach(tag => {
                ['background','border','border-radius','box-shadow','min-height','padding'].forEach(key => set(tag, key, referenceStyle.getPropertyValue(key)));
                set(tag, 'box-sizing', 'border-box');
                set(tag, 'width', '100%');
              });
              const labelSize = getComputedStyle(reference.querySelector('.meta-label')).fontSize;
              const valueSize = getComputedStyle(reference.querySelector('.meta-value')).fontSize;
              person.querySelectorAll('.chosen-provider-location .meta-label').forEach(label => set(label, 'font-size', labelSize));
              person.querySelectorAll('.chosen-provider-location .meta-value,.combined-opinions-count').forEach(value => set(value, 'font-size', valueSize));
              if (rating) set(rating, 'width', '100%');
              const opinionsTag = person.querySelector('.combined-opinions-tag');
              if (opinionsTag) { set(opinionsTag, 'display', 'flex'); set(opinionsTag, 'align-items', 'center'); }
            }
          }
        }
        set(summary, 'grid-column', '1 / -1');
        set(summary, 'grid-row', '3');
        set(summary, 'width', '100%');
        set(summary, 'display', 'grid');
        set(summary, 'grid-template-columns', 'repeat(2,minmax(0,1fr))');
        set(summary, 'gap', '12px');
      } else {
        ['display','grid-template-columns','grid-template-rows','column-gap','row-gap'].forEach(key => professional.style.removeProperty(key));
        professional.querySelectorAll(':scope > .coordination-professional-heading,:scope > .professional-caption,:scope > .chosen-person,:scope > .detail-professional-data').forEach(node => {node.style.removeProperty('grid-column');node.style.removeProperty('grid-row');});
        ['grid-column','grid-row','width','display','grid-template-columns','gap'].forEach(key => summary.style.removeProperty(key));
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
        set(button, 'background', index === 0 ? '#d9f4e6' : '#fde3e5');
        set(button, 'border', index === 0 ? '1px solid #89d6ad' : '1px solid #e69aa1');
        set(button, 'color', index === 0 ? '#08784a' : '#a3313b');
        set(button, 'box-shadow', 'inset 0 1px 0 rgba(255,255,255,.7)');
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
