/* TCGVendr — tcgvendr.com interaction layer. Shared by every page.
   Progressive enhancement: without JS the page renders fully (reveal states
   are only armed once the `.js` class lands). */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  /* ---- theme toggle: persists, updates label + browser chrome color ---- */
  var toggleBtn = document.getElementById('theme-toggle');
  var metaTheme = document.getElementById('meta-theme');
  function syncTheme() {
    var t = root.dataset.theme;
    if (metaTheme) metaTheme.setAttribute('content', t === 'light' ? '#f4f1ea' : '#0d0f13');
    if (toggleBtn) toggleBtn.setAttribute('aria-label', t === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  }
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try { localStorage.setItem('tcgv-theme', next); } catch (e) {}
      syncTheme();
    });
  }
  syncTheme();

  /* ---- mobile menu ---- */
  var menuBtn = document.getElementById('menu-btn');
  var menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    function setMenu(open) {
      menu.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    menuBtn.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  }

  /* ---- scroll reveals ---- */
  var reveals = document.querySelectorAll('.reveal');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  reveals.forEach(function (el) { io.observe(el); });
})();
