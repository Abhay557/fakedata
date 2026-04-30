/* ── Inject API page styles ── */
(function injectStyles() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'style.css';
  document.head.appendChild(link);
})();
