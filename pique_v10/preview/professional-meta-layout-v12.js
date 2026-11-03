/* PIQUES v14 — borde externo izquierdo y único separador entre icono/texto.
   Los estilos legacy tratan el ultimo hijo de .quote-request-tags como fecha.
   Conservamos un ultimo hijo invisible para que no reposicionen ZONA. */
(() => {
  // El CSS anterior dibuja .meta-icon::after como un segundo separador,
  // incluso donde el icono ya tiene border-right. La capa importante lo anula
  // sin modificar el resto de las tarjetas de la aplicación.
  const marker = 'pique-professional-meta-separator-v25';
  if (!document.getElementById(marker)) {
    const rules = document.createElement('style');
    rules.id = marker;
    rules.textContent = `
      @layer pique-tablet-professional-fix {
        #app :is(.professional-discover-section,.professional-active-section)
          .matching-request .quote-request-tags > .pique-meta-tag.labeled-meta-tag > .meta-icon::after {
          content: none !important;
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          border: 0 !important;
          background: transparent !important;
        }

        /* El espacio ENTRE el rótulo y su valor debe ser 3px.
           No modifica los espacios entre tarjetas o campos. */
        #app :is(.professional-discover-section,.professional-active-section)
          .matching-request :is(.meta-copy,.details-tag-copy) {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          gap: 4px !important;
        }

        /* El normalizador se ejecuta después de app.js; conservar el centrado
           óptico aquí para que no lo reemplace al reconstruir las tarjetas. */
        @media (max-width: 600px) {
          #app :is(.professional-discover-section,.professional-active-section)
            .matching-request :is(.professional-details-tag,.pique-meta-tag.labeled-meta-tag) > :is(.details-tag-icon,.meta-icon) {
            display: grid !important;
            place-items: center !important;
            align-self: stretch !important;
            justify-self: stretch !important;
            width: 100% !important;
            height: 100% !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            position: static !important;
          }
          #app :is(.professional-discover-section,.professional-active-section)
            .matching-request :is(.professional-details-tag,.pique-meta-tag.labeled-meta-tag) > :is(.details-tag-icon,.meta-icon) svg {
            display: block !important;
            align-self: center !important;
            justify-self: center !important;
            margin: auto !important;
            position: static !important;
            transform: translate(1px,1px) !important;
          }
          #app :is(.professional-discover-section,.professional-active-section)
            .matching-request :is(.details-tag-copy,.meta-copy) {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: flex-start !important;
            align-self: stretch !important;
            height: 100% !important;
            min-height: 0 !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            gap: 4px !important;
            padding: 4px 10px !important;
          }
        }

        /* Igualar la tarjeta de "MIRÁ LOS TRABAJOS" con la de "REPASÁ" */
        #app .professional-discover-section .matching-request.professional-card-discover > .quote-request-left {
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-start !important;
          gap: 12px !important;
        }

        #app .professional-discover-section .matching-request.professional-card-discover > .quote-request-left > h3 {
          display: flex !important;
          align-items: center !important;
          min-height: 40px !important;
          margin-bottom: 8px !important;
          padding: 0 !important;
          font-size: clamp(18px, 2.25vw, 22px) !important;
          line-height: 1.14 !important;
          font-weight: 900 !important;
          letter-spacing: 0 !important;
        }

        @media (max-width: 425px) {
          #app .professional-active-section .matching-request:is(.professional-card-pending,.professional-card-quoted,.professional-card-applied) > .quote-request-left > h3 {
            margin: 0 0 8px !important;
          }
        }
        @media (min-width: 426px) and (max-width: 600px) {
          #app .professional-active-section .matching-request:is(.professional-card-pending,.professional-card-quoted,.professional-card-applied) > .quote-request-left > h3 {
            margin: 0 0 10px !important;
          }
        }

        #app :is(.professional-active-section .matching-request:is(.professional-card-pending,.professional-card-quoted,.professional-card-applied),.professional-discover-section .matching-request.professional-card-discover) > .quote-request-left > .quote-status-row {
          margin: 8px 0 !important;
        }

        #app .professional-discover-section .matching-request.professional-card-discover .order-description,
        #app .professional-discover-section .matching-request.professional-card-discover .professional-details-tag {
          margin: 0 !important;
        }

        @media (max-width: 600px) {
          #app .professional-discover-section .matching-request.professional-card-discover .professional-card-footer .professional-apply {
            font-size: 14px !important;
          }
        }

        #app .professional-active-all {
          margin-top: 4px !important;
          padding-top: 4px !important;
        }
        #app .professional-active-section:not(.professional-coordinating-section) > .quote-requests-heading.stacked {
          align-items: center !important;
        }
        #app .professional-active-section .professional-applications-review-title {
          display: block !important;
          align-self: center !important;
          width: 100% !important;
          text-align: center !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        #app .professional-active-section .professional-filters-inline {
          display: flex !important;
          align-self: center !important;
          justify-content: center !important;
          width: 100% !important;
        }

        @media (max-width: 600px) {
          #app :is(.professional-discover-section .quote-requests-slider > .professional-card-discover,.professional-active-section:not(.professional-coordinating-section) .quote-requests-list > .matching-request)::after {
            content: "" !important;
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            left: auto !important;
            width: 34% !important;
            border-radius: inherit !important;
            background-image: linear-gradient(90deg, rgba(7, 78, 190, .98) 0%, rgba(7, 78, 190, .84) 48%, rgba(7, 78, 190, .68) 100%), var(--discover-photo, url('assets/otros-servicios-background.png')) !important;
            background-size: cover !important;
            background-position: center right !important;
            clip-path: ellipse(100% 105% at 100% 50%) !important;
            opacity: .88 !important;
            pointer-events: none !important;
            z-index: 0 !important;
          }
          #app .professional-active-section:not(.professional-coordinating-section) .quote-requests-list > .matching-request {
            isolation: isolate !important;
          }
          #app .professional-active-section:not(.professional-coordinating-section) .quote-requests-list > .matching-request > :is(.quote-request-left,.matching-request-divider,.quote-request-controls,.professional-card-footer) {
            position: relative !important;
            z-index: 1 !important;
          }
        }

        #app .professional-active-section .professional-card-applied.professional-application-layout {
          display: grid !important;
          grid-template-columns: minmax(0,1fr) !important;
          grid-template-areas: "left" "controls" "footer" !important;
          align-items: start !important;
          row-gap: 8px !important;
          column-gap: 0 !important;
          padding: 14px 14px !important;
          box-sizing: border-box !important;
        }
        #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-left {
          grid-area: left !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: stretch !important;
          justify-content: flex-start !important;
          gap: 8px !important;
          min-width: 0 !important;
          padding: 0 !important;
        }
        #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-left > h3 {
          display: flex !important;
          align-items: center !important;
          min-height: 0 !important;
          margin: 0 0 8px !important;
          padding: 0 !important;
          font-size: 16px !important;
          line-height: 1.14 !important;
          font-weight: 900 !important;
          letter-spacing: 0 !important;
          white-space: normal !important;
          overflow-wrap: anywhere !important;
        }
        #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-left > .professional-details-tag {
          display: grid !important;
          grid-template-columns: 44px minmax(0,1fr) !important;
          align-items: stretch !important;
          width: 100% !important;
          min-height: 58px !important;
          height: 58px !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          border: 1px solid rgba(190,220,255,.72) !important;
          border-left: 3px solid #8fc5ff !important;
          border-radius: 10px !important;
          background: rgba(220,237,255,.17) !important;
          color: #fff !important;
        }
        #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-left > .professional-details-tag > .details-tag-icon,
        #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-left > .professional-details-tag > .details-tag-copy {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          min-width: 0 !important;
          height: 100% !important;
          margin: 0 !important;
          box-sizing: border-box !important;
        }
        #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-left > .professional-details-tag > .details-tag-copy {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 4px !important;
          padding: 4px 10px !important;
          border-left: 1px solid rgba(190,220,255,.72) !important;
        }
        #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-left > .professional-details-tag > .details-tag-icon,
        #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-controls > .pique-meta-tags > .pique-meta-tag > .meta-icon {
          border-right: 0 !important;
        }
        #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-left > .professional-details-tag .details-tag-label,
        #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-left > .professional-details-tag .details-tag-value {
          display: block !important;
          margin: 0 !important;
          color: #fff !important;
        }
        #app .professional-active-section .professional-card-applied.professional-application-layout > .matching-request-divider {
          display: none !important;
        }
        #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-controls {
          grid-area: controls !important;
          display: flex !important;
          align-items: stretch !important;
          align-self: start !important;
          min-width: 0 !important;
          padding: 0 !important;
        }
        #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-controls > .pique-meta-tags {
          display: flex !important;
          flex-direction: column !important;
          gap: 7px !important;
          width: 100% !important;
          margin: 0 !important;
        }
        #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-controls > .pique-meta-tags > .pique-meta-tag:last-child {
          display: none !important;
        }
        #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-controls > .pique-meta-tags > .pique-meta-tag {
          display: grid !important;
          grid-template-columns: 44px minmax(0,1fr) !important;
          align-items: stretch !important;
          width: 100% !important;
          min-width: 0 !important;
          min-height: 58px !important;
          height: 58px !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          border: 1px solid rgba(190,220,255,.72) !important;
          border-left: 3px solid #8fc5ff !important;
          border-radius: 10px !important;
          background: rgba(220,237,255,.17) !important;
          color: #fff !important;
        }
        #app .professional-active-section .professional-card-applied.professional-application-layout > .application-waiting-footer {
          grid-area: footer !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          border-top: 0 !important;
        }
        @media (min-width: 601px) {
          #app .professional-active-section .professional-card-applied.professional-application-layout {
            padding: 14px calc(28% + 6px) 14px 14px !important;
          }
        }
        #app .professional-active-section .professional-card-applied.professional-application-layout > .application-waiting-footer > .professional-application-summary {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-start !important;
          gap: 8px !important;
          width: 100% !important;
          min-height: 40px !important;
          margin: 0 !important;
          padding: 8px 12px !important;
          box-sizing: border-box !important;
          border: 1px solid #c4d9fa !important;
          border-left: 3px solid #80b4ff !important;
          border-radius: 10px !important;
          background: #edf4ff !important;
          color: #0751ca !important;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.72) !important;
          text-align: left !important;
        }
        @media (max-width: 899px) {
          #app .professional-active-section .professional-card-applied.professional-application-layout {
            grid-template-columns: minmax(0,1fr) !important;
            grid-template-areas: "left" "controls" "footer" !important;
            row-gap: 8px !important;
          }
        }
        @media (max-width: 600px) {
          #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-left > .professional-details-tag {
            grid-template-columns: 44px minmax(0,1fr) !important;
            min-height: 58px !important;
            height: 58px !important;
          }
          #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-controls > .pique-meta-tags > .pique-meta-tag {
            grid-template-columns: 44px minmax(0,1fr) !important;
            min-height: 58px !important;
            height: 58px !important;
            border-left: 1px solid rgba(190,220,255,.72) !important;
            box-shadow: inset 3px 0 0 #8fc5ff !important;
          }
          #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-left > .professional-details-tag {
            border-left: 1px solid rgba(190,220,255,.72) !important;
            box-shadow: inset 3px 0 0 #8fc5ff !important;
          }
        }
        @media (max-width: 425px) {
          #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-left > .professional-details-tag,
          #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-controls > .pique-meta-tags > .pique-meta-tag {
            grid-template-columns: 36px minmax(0,1fr) !important;
            min-height: 52px !important;
            height: 52px !important;
          }
        }
        @media (max-width: 340px) {
          #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-left > .professional-details-tag,
          #app .professional-active-section .professional-card-applied.professional-application-layout > .quote-request-controls > .pique-meta-tags > .pique-meta-tag {
            grid-template-columns: 28px minmax(0,1fr) !important;
            min-height: 46px !important;
            height: 46px !important;
          }
        }

        #app .professional-discover-section .matching-request.professional-card-discover .quote-request-tags .meta-label,
        #app .professional-active-section .matching-request .quote-request-tags .meta-label {
          font-size: 11px !important;
          line-height: 1.05 !important;
          font-weight: 700 !important;
          letter-spacing: 0 !important;
        }

        #app .professional-discover-section .matching-request.professional-card-discover .quote-request-tags .meta-value,
        #app .professional-active-section .matching-request .quote-request-tags .meta-value {
          font-size: 14px !important;
          line-height: 1.12 !important;
          font-weight: 900 !important;
          letter-spacing: 0 !important;
        }

        #app .professional-discover-section .matching-request.professional-card-discover .professional-details-tag .details-tag-label,
        #app .professional-active-section .matching-request .professional-details-tag .details-tag-label {
          font-size: 11px !important;
          line-height: 1.05 !important;
          font-weight: 700 !important;
        }

        #app .professional-discover-section .matching-request.professional-card-discover .professional-details-tag .details-tag-value,
        #app .professional-active-section .matching-request .professional-details-tag .details-tag-value {
          font-size: 14px !important;
          line-height: 1.12 !important;
          font-weight: 900 !important;
        }
      }
    `;
    document.head.appendChild(rules);
  }
  // V20: En REPASÁ, los tags también pueden estar en la columna derecha
  // (por ejemplo, POSTULADO). Aplicar las mismas propiedades inline
  // de MIRÁ sin depender de dónde se renderizan.
  const applyRepasaTagStyles = () => {
    document.querySelectorAll(
      '#app .professional-active-section:not(.professional-coordinating-section) ' +
      '.matching-request .pique-meta-tag.labeled-meta-tag'
    ).forEach(tag => {
      const label = tag.querySelector('.meta-label');
      const kind = label?.textContent.trim().toUpperCase();
      if (kind !== 'RUBRO' && kind !== 'ZONA') return;
      // Misma barra interior con relieve que DETALLES (no una línea plana).
      // Se recalcula al redimensionar para mantener escritorio intacto.
      if (window.innerWidth <= 600) {
        tag.style.setProperty('box-shadow', 'inset 3px 0 0 #8fc5ff', 'important');
      } else {
        tag.style.removeProperty('box-shadow');
      }
      const copy = tag.querySelector('.meta-copy');
      const value = tag.querySelector('.meta-value');
      const icon = tag.querySelector('.meta-icon');
      if (!copy || !value) return;
      if (icon && window.innerWidth <= 600) {
        icon.style.setProperty('border-right', '0', 'important');
      }
      Object.entries({
        display: 'flex', 'flex-direction': 'column',
        'justify-content': 'center', gap: '3px',
        padding: window.innerWidth<=340 ? '0px 6px' : '0px 12px',
        'min-width': '0px',
        'border-left': window.innerWidth<=600 ? '1px solid rgba(190,220,255,.72)' : '0'
      }).forEach(([prop, val]) => copy.style.setProperty(prop, val, 'important'));
      label.style.setProperty('display', 'block', 'important');
      label.style.setProperty('font-size', '11px', 'important');
      Object.entries({
        display: 'block', 'font-weight': '900',
        'white-space': 'nowrap', overflow: 'hidden',
        'text-overflow': 'ellipsis', 'font-size': '14px'
      }).forEach(([prop, val]) => value.style.setProperty(prop, val, 'important'));
    });
  };
  const normalize = () => {
    document.querySelectorAll(
      '.professional-discover-section .matching-request.professional-card-discover, ' +
      '.professional-active-section:not(.professional-coordinating-section) .matching-request:is(.professional-card-pending,.professional-card-quoted,.professional-card-applied)'
    ).forEach(card => {
      const left = card.querySelector(':scope > .quote-request-left');
      const status = left?.querySelector(':scope > .quote-status-row');
      const tags = left?.querySelector(':scope > .quote-request-tags');
      if (!status) return;
      if (!tags) {
        const title = left.querySelector(':scope > h3');
        if (title) {
          title.style.removeProperty('font-size');
          title.style.setProperty('white-space','normal','important');
        }
        status.style.setProperty('display','flex','important');
        status.style.setProperty('align-items','center','important');
        status.style.setProperty('justify-content','space-between','important');
        status.style.setProperty('gap','8px','important');
        status.style.setProperty('position','relative','important');
        status.style.setProperty('width','100%','important');
        const date = status.querySelector('.professional-card-created');
        if (date) {
          date.style.setProperty('display','inline-flex','important');
          date.style.setProperty('align-items','center','important');
          date.style.setProperty('gap','5px','important');
          date.style.setProperty('position','relative','important');
          date.style.setProperty('inset','auto','important');
          date.style.setProperty('margin-left','auto','important');
          date.style.setProperty('z-index','4','important');
        }
        return;
      }
      const children = [...tags.children];
      const createdTag = children.find(el => el.querySelector('.meta-label')?.textContent.trim().toUpperCase() === 'CREADO');
      const existingDate = status.querySelector('.professional-card-created');
      // Compatibilidad con versiones anteriores que dibujaban CREADO debajo.
      if (!existingDate && createdTag) {
        const date = createdTag.querySelector('.meta-date')?.textContent.trim() || '';
        const calendarIcon = createdTag.querySelector('.meta-icon svg')?.cloneNode(true);
        if (date) {
          const el = document.createElement('span');
          el.className = 'professional-card-created';
          el.setAttribute('aria-label', 'Publicado el ' + date);
          if (calendarIcon) el.appendChild(calendarIcon);
          const value = document.createElement('span');
          value.textContent = date;
          el.appendChild(value);
          status.appendChild(el);
        }
      }
      const laptopDate = createdTag?.classList.contains('professional-laptop-date-tag') && window.innerWidth >= 900;
      if (createdTag && !laptopDate) {
        createdTag.style.setProperty('display', 'none', 'important');
      } else if (!tags.querySelector(':scope > .professional-meta-last-guard')) {
        // Evita que los selectores legados :last-child saquen ZONA de la grilla.
        const guard = document.createElement('span');
        guard.className = 'pique-meta-tag labeled-meta-tag quote-chip professional-meta-last-guard';
        guard.setAttribute('aria-hidden', 'true');
        guard.style.setProperty('display', 'none', 'important');
        tags.appendChild(guard);
      }
      const realTags = [...tags.children].filter(el => (laptopDate || el !== createdTag) && !el.classList.contains('professional-meta-last-guard'));
      if (realTags.length !== (laptopDate ? 3 : 2)) return;
      tags.style.setProperty('display', 'grid', 'important');
      tags.style.setProperty('grid-template-columns', `repeat(${realTags.length},minmax(0,1fr))`, 'important');
      tags.style.setProperty('grid-template-rows', 'auto', 'important');
      tags.style.setProperty('gap', '7px', 'important');
      tags.style.setProperty('width', '100%', 'important');
      tags.style.setProperty('height', 'auto', 'important');
      tags.style.setProperty('min-height', '0', 'important');
      tags.style.setProperty('position', 'relative', 'important');
      realTags.forEach((tag,index) => {
        const rules = {
          display: 'grid', position: 'relative', inset: 'auto', transform: 'none',
          'grid-row': '1', 'grid-column': String(index + 1), 'grid-area': 'auto',
          width: '100%', 'min-width': '0', 'max-width':'100%',
          height: window.innerWidth<=340?'46px':window.innerWidth<=425?'52px':'58px', 'min-height': window.innerWidth<=340?'46px':window.innerWidth<=425?'52px':'58px', margin:'0',
          'box-sizing': 'border-box', 'grid-template-columns': (window.innerWidth<=340 ? '28px minmax(0,1fr)' : window.innerWidth<=425 ? '36px minmax(0,1fr)' : '44px minmax(0,1fr)'),
          'border-radius':'10px', 'border':'1px solid rgba(190,220,255,.72)',
          background:'rgba(220,237,255,.17)'
        };
        for (const [key,val] of Object.entries(rules)) tag.style.setProperty(key,val,'important');
        // DETALLES usa box-shadow: inset 3px 0 0 #8fc5ff.
        // Copiamos el relieve, no el separador entre icono y texto.
        if (window.innerWidth <= 600) {
          tag.style.setProperty('box-shadow','inset 3px 0 0 #8fc5ff','important');
        } else {
          tag.style.removeProperty('box-shadow');
        }
        // La barra exterior izquierda iguala la presencia visual de DETALLES,
        // sin agregar una segunda línea entre icono y texto.
        tag.style.setProperty('border-left',
          window.innerWidth >= 900 ? '3px solid #8fc5ff' : '1px solid rgba(190,220,255,.72)',
          'important');
        const icon = tag.querySelector('.meta-icon');
        if (icon) {
          icon.style.setProperty('position','relative','important');
          icon.style.setProperty('inset','auto','important');
          icon.style.setProperty('width',window.innerWidth<=340?'28px':window.innerWidth<=425?'36px':'44px','important');
          icon.style.setProperty('min-width',window.innerWidth<=340?'28px':window.innerWidth<=425?'36px':'44px','important');
          icon.style.setProperty('display','grid','important');
          icon.style.setProperty('place-items','center','important');
          icon.style.setProperty('height','100%','important');
          icon.style.setProperty('border-right', window.innerWidth <= 600 ? '0' : '1px solid rgba(190,220,255,.72)', 'important');
          const svg = icon.querySelector('svg');
          if (svg) {
            const svgSize = window.innerWidth<=340?'14px':window.innerWidth<=425?'18px':'24px';
            svg.style.setProperty('width', svgSize, 'important');
            svg.style.setProperty('height', svgSize, 'important');
            svg.style.setProperty('min-width', svgSize, 'important');
            svg.style.setProperty('min-height', svgSize, 'important');
            svg.style.setProperty('margin', 'auto', 'important');
            svg.style.setProperty('padding', '0', 'important');
            svg.style.setProperty('position', 'static', 'important');
            svg.style.setProperty('transform', 'translate(1px,1px)', 'important');
          }
        }
        const copy = tag.querySelector('.meta-copy');
        if (copy) {
          copy.style.setProperty('display','flex','important');
          copy.style.setProperty('flex-direction','column','important');
          copy.style.setProperty('justify-content','center','important');
          copy.style.setProperty('gap',window.innerWidth<=425?'3px':'4px','important');
          // MIRÁ LOS TRABAJOS: padding horizontal de 8 px en celular.
          // Mantener el padding anterior en tablet/escritorio y en REPASÁ.
          const discoverMobile = card.closest('.professional-discover-section') && window.innerWidth <= 480;
          copy.style.setProperty('padding', window.innerWidth<=600 ? (discoverMobile?'4px 10px':'4px 10px') : '0px 12px', 'important');
          copy.style.setProperty('min-width','0','important');
          copy.style.setProperty('border-left', window.innerWidth <= 600 ? '1px solid rgba(190,220,255,.72)' : '0', 'important');
        }
        const label = tag.querySelector('.meta-label');
        if (label) {
          label.style.setProperty('display','block','important');
          label.style.setProperty('font-size','11px','important');
        }
        const value = tag.querySelector('.meta-value');
        if (value) {
          value.style.setProperty('display','block','important');
          value.style.setProperty('font-size','14px','important');
          value.style.setProperty('font-weight','900','important');
          value.style.setProperty('white-space','nowrap','important');
          value.style.setProperty('overflow','hidden','important');
          value.style.setProperty('text-overflow','ellipsis','important');
        }
      });
      const title = left.querySelector(':scope > h3');
      if (title) {
        title.style.setProperty('display','flex','important');
        title.style.setProperty('align-items','center','important');
        title.style.setProperty('min-height','40px','important');
        title.style.removeProperty('margin');
        title.style.removeProperty('margin-block');
        title.style.setProperty('padding','0','important');
        title.style.setProperty('font-size','clamp(18px, 2.25vw, 22px)','important');
        title.style.setProperty('line-height','1.14','important');
        title.style.setProperty('font-weight','900','important');
      }
      const detailsCopy = left.querySelector(':scope > .order-description .details-tag-copy, :scope > .professional-details-tag .details-tag-copy');
      if (detailsCopy) {
        detailsCopy.style.setProperty('display','flex','important');
        detailsCopy.style.setProperty('flex-direction','column','important');
        detailsCopy.style.setProperty('justify-content','center','important');
        detailsCopy.style.setProperty('gap','3px','important');
      }
      const detailLabel = left.querySelector(':scope > .order-description .details-tag-label, :scope > .professional-details-tag .details-tag-label');
      if (detailLabel) {
        detailLabel.style.setProperty('font-size','11px','important');
        detailLabel.style.setProperty('line-height','1.05','important');
      }
      const detailValue = left.querySelector(':scope > .order-description .details-tag-value, :scope > .professional-details-tag .details-tag-value');
      if (detailValue) {
        detailValue.style.setProperty('font-size','14px','important');
        detailValue.style.setProperty('line-height','1.12','important');
        detailValue.style.setProperty('font-weight','900','important');
      }
      // V19: MIRÁ es la referencia visual correcta. Ajustamos SOLO REPASÁ.
      // Evitamos diferencias de separación causadas por márgenes y alturas
      // heredadas de las tarjetas de cotización (COTIZADO / COTIZANDO).
      if (card.closest('.professional-active-section') && !card.closest('.professional-coordinating-section')) {
        const reference = document.querySelector(
          '.professional-discover-section .matching-request.professional-card-discover'
        );
        const applyReference = (target, sample) => {
          if (!target) return;
          const computed = sample ? getComputedStyle(sample) : null;
          const props = ['font-size', 'font-weight', 'line-height', 'letter-spacing'];
          if (computed) props.forEach(prop => target.style.setProperty(prop, computed.getPropertyValue(prop), 'important'));
          target.style.setProperty('margin-block', '0', 'important');
          target.style.setProperty('padding-block', '0', 'important');
        };
        const targetBlocks = [
          [left.querySelector('.details-tag-copy'), reference?.querySelector('.details-tag-copy')],
          ...[...left.querySelectorAll('.quote-request-tags .meta-copy')].map((block,i) => [
            block, reference?.querySelectorAll('.quote-request-tags .meta-copy')[i]
          ])
        ];
        targetBlocks.forEach(([target, sample]) => {
          if (!target) return;
          target.style.setProperty('display', 'flex', 'important');
          target.style.setProperty('flex-direction', 'column', 'important');
          target.style.setProperty('justify-content', 'center', 'important');
          target.style.setProperty('gap', sample ? getComputedStyle(sample).gap : '3px', 'important');
          const label = target.querySelector('.meta-label,.details-tag-label');
          const value = target.querySelector('.meta-value,.details-tag-value');
          applyReference(label, sample?.querySelector('.meta-label,.details-tag-label'));
          applyReference(value, sample?.querySelector('.meta-value,.details-tag-value'));
        });
      }
      status.style.setProperty('display', 'flex', 'important');
      status.style.setProperty('align-items', 'center', 'important');
      status.style.setProperty('justify-content', 'space-between', 'important');
      status.style.setProperty('gap', '8px', 'important');
      status.style.setProperty('position','relative','important');
      status.style.setProperty('width','100%','important');
      const date = status.querySelector('.professional-card-created');
      if (date) {
        date.style.setProperty('display',laptopDate ? 'none' : 'inline-flex','important');
        date.style.setProperty('align-items','center','important');
        date.style.setProperty('gap','5px','important');
        date.style.setProperty('position','relative','important');
        date.style.setProperty('inset','auto','important');
        date.style.setProperty('margin-left','auto','important');
        date.style.setProperty('z-index','4','important');
      }
    });
    applyRepasaTagStyles();
  };
  const priorSession = window.fitSessionText;
  if (typeof priorSession === 'function') {
    window.fitSessionText = function (...args) { const result = priorSession.apply(this,args); normalize(); return result; };
  }
  const priorValue = window.fitOpenPiqueValues;
  if (typeof priorValue === 'function') {
    window.fitOpenPiqueValues = function (...args) { const result = priorValue.apply(this,args); normalize(); return result; };
  }
  // Copiar la apariencia completa de COTIZADO a POSTULACIONES: nombre,
  // separaciones, bordes, divisores, textos e iconos.
  let quotedReferenceSnapshot = null;
  const matchApplicationTypography = () => {
    const quotedReference = document.querySelector('.professional-active-section .professional-card-quoted');
    const quotedReferenceVisible = Boolean(quotedReference && quotedReference.getClientRects().length && quotedReference.getBoundingClientRect().width > 0);
    const reference = quotedReferenceVisible ? quotedReference : null;
    if (!reference && !quotedReferenceSnapshot) return;
    const readStyles = (element, properties) => {
      if (!element) return null;
      const computed = getComputedStyle(element);
      return Object.fromEntries(properties.map(prop => [prop, computed.getPropertyValue(prop)]));
    };
    const titleProps = ['font-size','font-weight','line-height','letter-spacing','color','text-shadow'];
    const badgeProps = ['display','align-items','justify-content','box-sizing','font-family','font-size','font-weight','line-height','letter-spacing','padding','min-height','height','border-width','border-style','border-radius','white-space'];
    const detailProps = ['border','border-radius','background','box-shadow','margin','grid-template-columns','align-items','gap'];
    const detailIconProps = ['display','width','height','min-width','min-height','max-width','max-height','align-self','justify-self','margin','position','transform'];
    const detailCopyProps = ['gap','padding','border-left'];
    const labelProps = ['font-size','font-weight','line-height','letter-spacing','color'];
    const valueProps = ['font-size','font-weight','line-height','letter-spacing','color'];
    const tagProps = ['border','border-radius','background','box-shadow','border-left','grid-template-columns','align-items','gap','box-sizing'];
    const copyProps = ['gap','padding','border-left'];
    const textProps = ['font-size','font-weight','line-height','letter-spacing','color','text-shadow','white-space','text-overflow'];
    const svgProps = ['width','height','min-width','min-height','max-width','max-height'];
    if (quotedReferenceVisible) {
      const quotedDetails = quotedReference.querySelector('.quote-request-left > .professional-details-tag');
      const quotedTags = quotedReference.querySelector('.quote-request-left > .quote-request-tags');
      const tags = {};
      [...(quotedTags?.querySelectorAll(':scope > .pique-meta-tag') || [])].forEach(tag => {
        const label = tag.querySelector('.meta-label')?.textContent.trim().toUpperCase();
        if (!label || label === 'CREADO') return;
        tags[label] = {
          box: readStyles(tag, tagProps),
          icon: readStyles(tag.querySelector('.meta-icon'), ['border-right']),
          copy: readStyles(tag.querySelector('.meta-copy'), copyProps),
          label: readStyles(tag.querySelector('.meta-label'), textProps),
          value: readStyles(tag.querySelector('.meta-value'), textProps),
          svg: readStyles(tag.querySelector('.meta-icon svg'), svgProps)
        };
      });
      quotedReferenceSnapshot = {
        title: readStyles(quotedReference.querySelector('.quote-request-left > h3'), titleProps),
        badge: readStyles(quotedReference.querySelector('.quote-request-left > .quote-status-row > .deadline-tag'), badgeProps),
        detail: readStyles(quotedDetails, detailProps),
        detailIcon: readStyles(quotedDetails?.querySelector('.details-tag-icon'), detailIconProps),
        detailCopy: readStyles(quotedDetails?.querySelector('.details-tag-copy'), detailCopyProps),
        detailLabel: readStyles(quotedDetails?.querySelector('.details-tag-label'), labelProps),
        detailValue: readStyles(quotedDetails?.querySelector('.details-tag-value'), valueProps),
        tagContainer: readStyles(quotedTags, ['row-gap','column-gap']),
        tags
      };
    }
    const applyStyles = (source, target, properties, snapshot) => {
      if (!source || !target) return;
      const values = snapshot || readStyles(source, properties);
      if (!values) return;
      properties.forEach(prop => { if (values[prop] !== undefined) target.style.setProperty(prop, values[prop], 'important'); });
    };
    const sourceTitle = reference?.querySelector('.quote-request-left > h3');
    const snapshot = quotedReferenceSnapshot;
    document.querySelectorAll('.professional-active-section .professional-card-applied.professional-application-layout').forEach(card => {
      const sourceBadge = reference?.querySelector('.quote-request-left > .quote-status-row > .deadline-tag');
      const targetBadge = card.querySelector('.quote-request-left > .quote-status-row > .deadline-tag');
      // El estado conserva su color amarillo, pero comparte tamaño y caja con COTIZADO.
      applyStyles(sourceBadge, targetBadge, badgeProps, snapshot?.badge);
      if (targetBadge) {
        if (!sourceBadge && !snapshot?.badge) {
          const size = 'clamp(10px, 1.9vw, 12px)';
          targetBadge.style.setProperty('font-size',size,'important');
          targetBadge.style.setProperty('font-family','Nunito, Arial, sans-serif','important');
          targetBadge.style.setProperty('font-weight','700','important');
          targetBadge.style.setProperty('line-height','16px','important');
          targetBadge.style.setProperty('letter-spacing','.25px','important');
          targetBadge.style.setProperty('padding','0 clamp(6px, 1.2vw, 8px)','important');
          targetBadge.style.setProperty('min-height','20px','important');
          targetBadge.style.setProperty('height','20px','important');
          targetBadge.style.setProperty('border-radius','999px','important');
        }
        targetBadge.style.setProperty('width','max-content','important');
        targetBadge.style.setProperty('min-width','max-content','important');
        targetBadge.style.setProperty('max-width','none','important');
        targetBadge.style.setProperty('flex','0 0 auto','important');
      }
      const targetStatusRow = card.querySelector('.quote-request-left > .quote-status-row');
      if (targetStatusRow) {
        targetStatusRow.style.setProperty('height','auto','important');
        targetStatusRow.style.setProperty('min-height','0','important');
      }
      const targetLeft = card.querySelector('.quote-request-left');
      if (targetLeft) targetLeft.style.setProperty('padding-top',matchMedia('(max-width: 600px)').matches ? '0px' : '12px','important');
      const targetTitle = card.querySelector('.quote-request-left > h3');
      if (targetTitle && (sourceTitle || snapshot?.title)) {
        const titleReference = snapshot?.title || readStyles(sourceTitle, titleProps);
        const titleStyle = {
          display: 'block', 'align-items': 'center', 'min-height': '0', padding: '0',
          'font-size': titleReference?.['font-size'], 'line-height': titleReference?.['line-height'] || '1.12',
          'font-weight': titleReference?.['font-weight'] || '900', 'white-space': 'nowrap',
          position: 'static', order: '2', width: '100%', 'letter-spacing': titleReference?.['letter-spacing'] || '-0.35px',
          color: titleReference?.color || 'rgb(255, 255, 255)', 'text-shadow': titleReference?.['text-shadow'] || 'none',
          'overflow-wrap': 'normal', overflow: 'hidden', 'text-overflow': 'ellipsis', margin: '0',
          inset: 'auto', height: 'auto', transform: 'none'
        };
        Object.entries(titleStyle).forEach(([prop,value]) => { if (value) targetTitle.style.setProperty(prop, value, 'important'); });
      }
      const sourceDetails = reference?.querySelector('.quote-request-left > .professional-details-tag');
      const targetDetails = card.querySelector('.quote-request-left > .professional-details-tag');
      applyStyles(sourceDetails, targetDetails, detailProps, snapshot?.detail);
      if (targetDetails && !sourceDetails && !snapshot?.detail) {
        const column = window.innerWidth <= 340 ? '28px' : window.innerWidth <= 425 ? '36px' : '44px';
        targetDetails.style.setProperty('grid-template-columns',`${column} minmax(0,1fr)`,'important');
        const targetCopy = targetDetails.querySelector('.details-tag-copy');
        const targetLabel = targetDetails.querySelector('.details-tag-label');
        const targetValue = targetDetails.querySelector('.details-tag-value');
        const compact = window.innerWidth <= 340;
        const mobile = window.innerWidth <= 425;
        if (targetCopy) {
          targetCopy.style.setProperty('gap',compact?'3px':mobile?'2px':'4px','important');
          targetCopy.style.setProperty('padding',compact?'5px 8px':mobile?'4px 7px':'6px 8px','important');
          targetCopy.style.setProperty('border-left','1px solid rgba(215,232,255,.65)','important');
        }
        if (targetLabel) {
          targetLabel.style.setProperty('font-size',compact?'8px':mobile?'9px':'11px','important');
          targetLabel.style.setProperty('line-height','1.1','important');
          targetLabel.style.setProperty('font-weight','700','important');
        }
        if (targetValue) {
          targetValue.style.setProperty('font-size',compact?'10px':mobile?'12px':'14px','important');
          targetValue.style.setProperty('line-height',compact?'1.15':'1.2','important');
          targetValue.style.setProperty('font-weight','900','important');
        }
      }
      applyStyles(sourceDetails?.querySelector('.details-tag-icon'), targetDetails?.querySelector('.details-tag-icon'), detailIconProps, snapshot?.detailIcon);
      applyStyles(sourceDetails?.querySelector('.details-tag-copy'), targetDetails?.querySelector('.details-tag-copy'), detailCopyProps, snapshot?.detailCopy);
      applyStyles(sourceDetails?.querySelector('.details-tag-label'), targetDetails?.querySelector('.details-tag-label'), labelProps, snapshot?.detailLabel);
      applyStyles(sourceDetails?.querySelector('.details-tag-value'), targetDetails?.querySelector('.details-tag-value'), valueProps, snapshot?.detailValue);

      const sourceTags = reference?.querySelector('.quote-request-left > .quote-request-tags');
      const targetTags = card.querySelector('.quote-request-controls > .quote-request-tags');
      if (!targetTags) return;
      applyStyles(sourceTags, targetTags, ['row-gap','column-gap'], snapshot?.tagContainer);
      [...targetTags.querySelectorAll(':scope > .pique-meta-tag')].forEach(target => {
        const label = target.querySelector('.meta-label')?.textContent.trim().toUpperCase();
        if (!label || label === 'CREADO') return;
        const source = [...(sourceTags?.querySelectorAll(':scope > .pique-meta-tag') || [])].find(tag =>
          tag.querySelector('.meta-label')?.textContent.trim().toUpperCase() === label
        );
        const cached = snapshot?.tags?.[label];
        if (!source && !cached) return;
        applyStyles(source, target, tagProps, cached?.box);
        if (!source && !cached?.box) {
          const column = window.innerWidth <= 340 ? '28px' : window.innerWidth <= 425 ? '36px' : '44px';
          target.style.setProperty('grid-template-columns',`${column} minmax(0,1fr)`,'important');
        }
        applyStyles(source?.querySelector('.meta-icon'), target.querySelector('.meta-icon'), ['border-right'], cached?.icon);
        applyStyles(source?.querySelector('.meta-copy'), target.querySelector('.meta-copy'), copyProps, cached?.copy);
        for (const selector of ['.meta-label','.meta-value']) {
          const sourceCopy = source?.querySelector(selector), targetCopy = target.querySelector(selector);
          if (!targetCopy) continue;
          const cachedText = cached?.[selector === '.meta-label' ? 'label' : 'value'];
          applyStyles(sourceCopy, targetCopy, textProps, cachedText);
        }
        const sourceSvg = source?.querySelector('.meta-icon svg'), targetSvg = target.querySelector('.meta-icon svg');
        applyStyles(sourceSvg, targetSvg, svgProps, cached?.svg);
      });
    });
  };
  const priorPolish = window.polishQuotedCards;
  if (typeof priorPolish === 'function') {
    window.polishQuotedCards = function (...args) { const result = priorPolish.apply(this,args); matchApplicationTypography(); return result; };
  }
  window.addEventListener('resize', () => requestAnimationFrame(matchApplicationTypography), {passive:true});
  const container = document.getElementById('app');
  if (container) {
    new MutationObserver(() => normalize()).observe(container, {subtree:true,childList:true});
  }
  window.addEventListener('resize', () => requestAnimationFrame(normalize), {passive:true});
  requestAnimationFrame(normalize);
})();
