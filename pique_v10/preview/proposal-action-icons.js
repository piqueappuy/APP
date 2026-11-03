(() => {
  const fixActions = () => {
    document.querySelectorAll('.proposal-board .professional-photo-proposal > .proposal-request-quotation, .proposal-board .professional-photo-proposal > .proposal-profile-footer > .btn').forEach(action => {
      const set = (element, property, value) => element?.style.setProperty(property, value, 'important');
      set(action, 'display', 'flex');
      set(action, 'flex-direction', 'row');
      set(action, 'align-items', 'center');
      set(action, 'justify-content', 'center');
      set(action, 'gap', '7px');
      const icon = action.querySelector(':scope > svg');
      set(icon, 'display', 'block');
      set(icon, 'flex', '0 0 auto');
      const label = action.querySelector(':scope > span');
      set(label, 'display', 'inline');
      set(label, 'width', 'auto');
      set(label, 'white-space', 'nowrap');
      action.querySelectorAll('.mobile-action-break').forEach(br => set(br, 'display', 'none'));
    });
  };
  const observer = new MutationObserver(() => requestAnimationFrame(fixActions));
  observer.observe(document.getElementById('app'), {childList: true, subtree: true});
  fixActions();
})();
