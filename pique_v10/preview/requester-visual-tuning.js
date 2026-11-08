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

    document.querySelectorAll('#app .requester-agreed-summary .validation-hint-track').forEach(track => set(track, 'display', 'none'));
    document.querySelectorAll('#app .validation-meta-item, #app .pique-meta-tag.labeled-meta-tag').forEach(tag => {
      if (tag.querySelector('.meta-label')?.textContent.trim().toUpperCase() !== 'CREADO') return;
      const date = tag.querySelector('.meta-date');
      const time = tag.querySelector('.meta-time');
      if (!date || !time) return;
      let divider = tag.querySelector('[data-created-divider]');
      if (!divider) {
        divider = document.createElement('span');
        divider.dataset.createdDivider = '';
        divider.setAttribute('aria-hidden', 'true');
        divider.textContent = '|';
        time.before(divider);
      }
      set(divider, 'display', getComputedStyle(time).display === 'none' ? 'none' : 'inline');
      set(divider, 'margin', '0 5px');
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
        // Keep the provider actions in one row and the agreed hints below.
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
            const oneRow = width >= 1000;
            set(person, 'width', '100%');
            set(person, 'grid-template-columns', oneRow ? 'max-content minmax(0,1fr) max-content' : 'max-content minmax(0,1fr)');
            set(person, 'grid-template-rows', oneRow ? 'auto' : 'auto auto');
            set(person, 'gap', '12px');
            const identity = person.querySelector('.chosen-identity');
            const zone = person.querySelector('.chosen-provider-location');
            const rating = person.querySelector('.chosen-rating');
            const profile = person.querySelector('.professional-profile-button');
            if (identity) {
              set(identity, 'grid-column', '1');
              set(identity, 'grid-row', '1');
              set(identity, 'display', 'grid');
              set(identity, 'grid-template-columns', '32px max-content');
              set(identity, 'grid-template-rows', '17px 12px');
              set(identity, 'column-gap', '10px');
              set(identity, 'row-gap', '3px');
              set(identity, 'height', '32px'); set(identity, 'min-height', '32px'); set(identity, 'max-height', '32px');
              set(identity, 'padding', '0');
              set(identity, 'align-items', 'center');
              set(identity, 'align-self', 'center');
              const avatar = identity.querySelector('.avatar');
              if (avatar) {
                set(avatar, 'grid-column', '1'); set(avatar, 'grid-row', '1 / 3');
                set(avatar, 'width', '32px'); set(avatar, 'height', '32px'); set(avatar, 'align-self', 'center');
                set(avatar, 'min-width', '0'); set(avatar, 'min-height', '0');
              }
              const name = identity.querySelector('.chosen-professional-name');
              if (name) {
                set(name, 'font-size', '17px'); set(name, 'line-height', '17px');
                set(name, 'height', '17px'); set(name, 'min-height', '0');
                set(name, 'margin', '0'); set(name, 'padding', '0');
                set(name, 'grid-column', '2'); set(name, 'grid-row', '1'); set(name, 'align-self', 'center');
              }
              let nameBlock = identity.querySelector(':scope > [data-chosen-name-block]');
              if (name && !nameBlock) {
                nameBlock = document.createElement('div');
                nameBlock.dataset.chosenNameBlock = '';
                identity.insertBefore(nameBlock, name);
                nameBlock.append(name);
              }
              if (nameBlock) {
                set(nameBlock, 'display', 'contents');
                let ratingLine = nameBlock.querySelector('[data-chosen-rating-line]');
                if (!ratingLine) {
                  ratingLine = document.createElement('span');
                  ratingLine.dataset.chosenRatingLine = '';
                  const scoreGroup = document.createElement('span');
                  scoreGroup.dataset.chosenScore = '';
                  const scoreIcon = person.querySelector('.combined-rating-score svg');
                  if (scoreIcon) scoreGroup.append(scoreIcon.cloneNode(true));
                  scoreGroup.append(document.createElement('span'));
                  const divider = document.createElement('span');
                  divider.dataset.chosenDivider = '';
                  divider.setAttribute('aria-hidden', 'true');
                  const opinionsGroup = document.createElement('span');
                  opinionsGroup.dataset.chosenOpinions = '';
                  const opinionsIcon = person.querySelector('.combined-opinions-count svg');
                  if (opinionsIcon) opinionsGroup.append(opinionsIcon.cloneNode(true));
                  opinionsGroup.append(document.createElement('span'));
                  ratingLine.append(scoreGroup, divider, opinionsGroup);
                  nameBlock.append(ratingLine);
                }
                const score = person.querySelector('.combined-rating-score')?.textContent?.trim() || '';
                const opinions = person.querySelector('.combined-opinions-count')?.textContent?.trim() || '';
                const scoreGroup = ratingLine.querySelector('[data-chosen-score]');
                const opinionsGroup = ratingLine.querySelector('[data-chosen-opinions]');
                const divider = ratingLine.querySelector('[data-chosen-divider]');
                scoreGroup.querySelector('span').textContent = score;
                opinionsGroup.querySelector('span').textContent = opinions;
                set(ratingLine, 'display', 'inline-flex'); set(ratingLine, 'align-items', 'center');
                set(ratingLine, 'grid-column', '2'); set(ratingLine, 'grid-row', '2');
                set(ratingLine, 'gap', '8px'); set(ratingLine, 'font-size', '12px');
                set(ratingLine, 'font-weight', '700'); set(ratingLine, 'line-height', '12px');
                set(ratingLine, 'height', '12px'); set(ratingLine, 'min-height', '0');
                set(ratingLine, 'color', '#e5f2ff'); set(ratingLine, 'white-space', 'nowrap');
                [scoreGroup, opinionsGroup].forEach(group => {
                  set(group, 'display', 'inline-flex'); set(group, 'align-items', 'center'); set(group, 'gap', '4px');
                  const icon = group.querySelector('svg');
                  if (icon) { set(icon, 'display', 'block'); set(icon, 'width', '12px'); set(icon, 'height', '12px'); }
                });
                const star = scoreGroup.querySelector('svg');
                if (star) { set(star, 'fill', '#ffd05a'); set(star, 'stroke', '#ffd05a'); }
                const message = opinionsGroup.querySelector('svg');
                if (message) { set(message, 'fill', 'none'); set(message, 'stroke', 'currentColor'); }
                set(scoreGroup, 'display', score ? 'inline-flex' : 'none');
                set(divider, 'display', score ? 'block' : 'none'); set(divider, 'height', '12px');
                set(divider, 'border-left', '1px solid rgba(215,232,255,.7)');
                const adjacentScore = identity.querySelector('.name-adjacent-rating');
                if (adjacentScore) set(adjacentScore, 'display', 'none');
                identity.querySelectorAll('.chosen-inline-score').forEach(node => set(node, 'display', 'none'));
              }
            }
            if (zone) { set(zone, 'grid-column', '2'); set(zone, 'grid-row', '1'); set(zone, 'align-self', 'center'); }
            if (profile) {
              set(profile, 'grid-column', oneRow ? '3' : '1 / -1');
              set(profile, 'grid-row', oneRow ? '1' : '2');
              set(profile, 'width', oneRow ? 'max-content' : '100%');
              set(profile, 'align-self', 'center'); set(profile, 'white-space', 'nowrap');
              set(profile, 'min-width', '0'); set(profile, 'max-width', '100%');
              set(profile, 'padding', '0 12px'); set(profile, 'margin', '0');
              set(profile, 'height', '34px'); set(profile, 'min-height', '34px'); set(profile, 'max-height', '34px');
              set(profile, 'font-size', '16px');
              profile.querySelectorAll('span').forEach(label => set(label, 'font-size', '16px'));
            }
            const reference = professional.closest('.order')?.querySelector('.validation-meta-item');
            if (reference) {
              const labelSize = getComputedStyle(reference.querySelector('.meta-label')).fontSize;
              const valueSize = getComputedStyle(reference.querySelector('.meta-value')).fontSize;
              // These original nodes carry many legacy rules and pseudo separators.
              // Render clean cards using the same geometry as the tags above.
              [zone, rating].filter(Boolean).forEach(node => set(node, 'display', 'none'));
              const cards = [
                ['zone', 'ZONA', zone?.querySelector('.meta-value')?.textContent?.trim() || '', zone?.querySelector('svg')]
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
                set(card, 'display', 'grid'); set(card, 'grid-template-columns', '22px minmax(0,1fr)');
                set(card, 'column-gap', '6px'); set(card, 'align-self', 'center');
                set(card, 'box-sizing', 'border-box'); set(card, 'width', '100%'); set(card, 'height', 'auto');
                set(card, 'max-width', 'none');
                set(card, 'justify-self', 'stretch');
                set(card, 'background', 'transparent'); set(card, 'border', '0');
                set(card, 'border-left', '1px solid rgba(215,232,255,.7)');
                set(card, 'padding-left', '10px');
                set(card, 'border-radius', '0'); set(card, 'box-shadow', 'none');
                set(iconCell, 'display', 'grid'); set(iconCell, 'place-items', 'center');
                set(iconCell, 'height', '100%'); set(iconCell, 'border-right', '0');
                const icon = iconCell.querySelector('svg');
                if (icon) { set(icon, 'display', 'block'); set(icon, 'width', '18px'); set(icon, 'height', '18px'); set(icon, 'fill', 'none'); set(icon, 'stroke', 'white'); set(icon, 'stroke-width', '2'); }
                set(copy, 'display', 'flex'); set(copy, 'flex-direction', 'column'); set(copy, 'justify-content', 'center');
                set(copy, 'gap', '2px'); set(copy, 'padding', '0'); set(copy, 'min-width', '0');
                set(label, 'display', 'block'); set(label, 'font-size', labelSize); set(label, 'line-height', '1.2'); set(label, 'font-weight', '400'); set(label, 'color', 'white');
                set(value, 'display', 'block'); set(value, 'font-size', valueSize); set(value, 'line-height', '1.2'); set(value, 'font-weight', '900'); set(value, 'color', 'white');
                set(value, 'white-space', 'nowrap'); set(value, 'overflow', 'hidden'); set(value, 'text-overflow', 'ellipsis');
              });
              const zoneCopy = person.querySelector('[data-chosen-card="zone"] > span:last-child');
              if (profile && zoneCopy) {
                const contentHeight = `${Math.ceil(zoneCopy.getBoundingClientRect().height)}px`;
                ['height', 'min-height', 'max-height'].forEach(key => set(profile, key, contentHeight));
              }
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
          ['display','grid-template-columns','grid-template-rows','column-gap','row-gap','align-items','align-self','height','min-height','max-height','padding'].forEach(key => identity.style.removeProperty(key));
          ['grid-column','grid-row','align-self','width','height','min-width','min-height'].forEach(key => identity.querySelector('.avatar')?.style.removeProperty(key));
          ['grid-column','grid-row','align-self','font-size','line-height','height','min-height','margin','padding'].forEach(key => name?.style.removeProperty(key));
          identity.querySelectorAll('.name-adjacent-rating,.chosen-inline-score').forEach(node => node.style.removeProperty('display'));
        });
        professional.querySelectorAll('.professional-profile-button').forEach(button => {
          ['grid-column','grid-row','width','min-width','max-width','font-size','align-self','white-space','padding','margin','height','min-height','max-height'].forEach(key => button.style.removeProperty(key));
          button.querySelectorAll('span').forEach(label => label.style.removeProperty('font-size'));
        });
        ['display','grid-template-columns','grid-template-rows','column-gap','row-gap'].forEach(key => professional.style.removeProperty(key));
        professional.querySelectorAll(':scope > .coordination-professional-heading,:scope > .professional-caption,:scope > .chosen-person,:scope > .detail-professional-data').forEach(node => {node.style.removeProperty('grid-column');node.style.removeProperty('grid-row');});
        professional.querySelectorAll(':scope > .chosen-person').forEach(node => {['width','grid-template-columns','grid-template-rows','gap'].forEach(key => node.style.removeProperty(key));});
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
