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
        card.querySelectorAll('.details-tag-label,.meta-label').forEach(label => set(label, 'font-size', '12px'));
        card.querySelectorAll('.details-tag-value,.meta-value').forEach(value => {
          set(value, 'font-size', '14px');
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
            set(person, 'gap', '12px 16px');
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
              let nameBlock = identity.querySelector(':scope > [data-chosen-name-block]');
              if (name && !nameBlock) {
                nameBlock = document.createElement('div');
                nameBlock.dataset.chosenNameBlock = '';
                identity.insertBefore(nameBlock, name);
                nameBlock.append(name);
              }
              if (nameBlock) {
                set(nameBlock, 'display', 'flex'); set(nameBlock, 'flex-direction', 'column');
                set(nameBlock, 'justify-content', 'center'); set(nameBlock, 'gap', '5px');
                set(nameBlock, 'min-width', '0');
                let ratingLine = nameBlock.querySelector('[data-chosen-rating-line]');
                if (!ratingLine) {
                  ratingLine = document.createElement('span');
                  ratingLine.dataset.chosenRatingLine = '';
                  const sourceIcon = person.querySelector('.combined-opinions-count svg');
                  if (sourceIcon) ratingLine.append(sourceIcon.cloneNode(true));
                  ratingLine.append(document.createElement('span'));
                  nameBlock.append(ratingLine);
                }
                const opinions = person.querySelector('.combined-opinions-count')?.textContent?.trim() || '';
                ratingLine.querySelector('span').textContent = opinions;
                set(ratingLine, 'display', 'inline-flex'); set(ratingLine, 'align-items', 'center');
                set(ratingLine, 'gap', '4px'); set(ratingLine, 'font-size', '12px');
                set(ratingLine, 'font-weight', '700'); set(ratingLine, 'line-height', '1.2');
                set(ratingLine, 'color', '#e5f2ff'); set(ratingLine, 'white-space', 'nowrap');
                const opinionsIcon = ratingLine.querySelector('svg');
                if (opinionsIcon) { set(opinionsIcon, 'display', 'block'); set(opinionsIcon, 'width', '12px'); set(opinionsIcon, 'height', '12px'); set(opinionsIcon, 'fill', 'none'); set(opinionsIcon, 'stroke', 'currentColor'); }
                const adjacentScore = identity.querySelector('.name-adjacent-rating');
                if (adjacentScore) set(adjacentScore, 'display', 'inline-flex');
                identity.querySelectorAll('.chosen-inline-score').forEach(node => set(node, 'display', 'none'));
              }
            }
            if (zone) { set(zone, 'grid-column', '2'); set(zone, 'grid-row', '1'); set(zone, 'align-self', 'center'); }
            if (profile) {
              set(profile, 'grid-column', '1 / -1'); set(profile, 'grid-row', '2'); set(profile, 'width', '100%');
              set(profile, 'font-size', '16px');
              profile.querySelectorAll('span').forEach(label => set(label, 'font-size', '16px'));
            }
            const reference = professional.closest('.order')?.querySelector('.validation-meta-item');
            if (reference) {
              const referenceStyle = getComputedStyle(reference);
              const tagHeight = `${reference.getBoundingClientRect().height}px`;
              const labelSize = getComputedStyle(reference.querySelector('.meta-label')).fontSize;
              const valueSize = getComputedStyle(reference.querySelector('.meta-value')).fontSize;
              // These original nodes carry many legacy rules and pseudo separators.
              // Render clean cards using the same geometry as the tags above.
              [zone, rating].filter(Boolean).forEach(node => set(node, 'display', 'none'));
              const cards = [
                ['zone', 'BARRIO', zone?.querySelector('.meta-value')?.textContent?.trim() || '', zone?.querySelector('svg')]
              ];
              cards.forEach(([kind, labelText, valueText, sourceIcon], index) => {
                let card = person.querySelector(`:scope > [data-chosen-card="${kind}"]`);
                if (!card) {
                  card = document.createElement('div');
                  card.dataset.chosenCard = kind;
                  const iconCell = document.createElement('span');
                  const copy = document.createElement('span');
                  const label = document.createElement('small');
                  const value = document.createElement('strong');
                  iconCell.append(sourceIcon?.cloneNode(true) || document.createElement('span'));
                  copy.append(label, value);
                  card.append(iconCell, copy);
                  person.append(card);
                }
                const [iconCell, copy] = card.children;
                const [label, value] = copy.children;
                label.textContent = labelText;
                value.textContent = valueText;
                set(card, 'grid-column', '2'); set(card, 'grid-row', '1');
                set(card, 'display', 'grid'); set(card, 'grid-template-columns', '40px minmax(0,1fr)');
                set(card, 'box-sizing', 'border-box'); set(card, 'width', '100%'); set(card, 'height', tagHeight);
                ['background','border','border-radius','box-shadow'].forEach(key => set(card, key, referenceStyle.getPropertyValue(key)));
                set(iconCell, 'display', 'grid'); set(iconCell, 'place-items', 'center');
                set(iconCell, 'height', '100%'); set(iconCell, 'border-right', '1px solid rgba(215,232,255,.65)');
                const icon = iconCell.querySelector('svg');
                if (icon) { set(icon, 'display', 'block'); set(icon, 'width', '18px'); set(icon, 'height', '18px'); set(icon, 'fill', 'none'); set(icon, 'stroke', 'white'); set(icon, 'stroke-width', '2'); }
                set(copy, 'display', 'flex'); set(copy, 'flex-direction', 'column'); set(copy, 'justify-content', 'center');
                set(copy, 'gap', '2px'); set(copy, 'padding', '0 8px'); set(copy, 'min-width', '0');
                set(label, 'display', 'block'); set(label, 'font-size', labelSize); set(label, 'line-height', '1.2'); set(label, 'font-weight', '400'); set(label, 'color', 'white');
                set(value, 'display', 'block'); set(value, 'font-size', valueSize); set(value, 'line-height', '1.2'); set(value, 'font-weight', '900'); set(value, 'color', 'white');
                set(value, 'white-space', 'nowrap'); set(value, 'overflow', 'hidden'); set(value, 'text-overflow', 'ellipsis');
              });
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
        professional.querySelectorAll('[data-chosen-card]').forEach(card => card.remove());
        professional.querySelectorAll('.chosen-provider-location,.chosen-rating').forEach(node => node.style.removeProperty('display'));
        professional.querySelectorAll('[data-chosen-name-block]').forEach(block => {
          const identity = block.parentElement;
          const name = block.querySelector('.chosen-professional-name');
          if (name) identity.insertBefore(name, block);
          block.remove();
          identity.querySelectorAll('.name-adjacent-rating,.chosen-inline-score').forEach(node => node.style.removeProperty('display'));
        });
        professional.querySelectorAll('.professional-profile-button').forEach(button => {
          ['grid-column','grid-row','width','font-size'].forEach(key => button.style.removeProperty(key));
          button.querySelectorAll('span').forEach(label => label.style.removeProperty('font-size'));
        });
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
