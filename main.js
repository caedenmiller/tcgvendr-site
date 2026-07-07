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

  /* ---- price count-up: money inside a reveal counts from $0 as it appears.
     Parses the value straight out of the markup, so no-JS/reduced-motion users
     simply see the real number. ---- */
  function countUpIn(scope) {
    scope.querySelectorAll('.pv,.pf-v,.pf-up').forEach(function (el) {
      if (el.dataset.counted) return;
      el.dataset.counted = '1';
      var raw = el.textContent;
      var m = raw.match(/\$([\d,]+(?:\.\d+)?)/);
      if (!m) return;
      var target = parseFloat(m[1].replace(/,/g, ''));
      var dec = (m[1].split('.')[1] || '').length;
      var before = raw.slice(0, m.index + 1);
      var after = raw.slice(m.index + m[0].length);
      var start = null, dur = 1200;
      function step(now) {
        if (start === null) start = now;
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = before + (target * eased).toLocaleString('en-US', {
          minimumFractionDigits: dec, maximumFractionDigits: dec
        }) + after;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---- scroll reveals ---- */
  /* stagger: direct .reveal children of a [data-stagger] container cascade in */
  document.querySelectorAll('[data-stagger]').forEach(function (c) {
    var i = 0;
    Array.prototype.forEach.call(c.children, function (el) {
      if (el.classList.contains('reveal')) el.style.setProperty('--d', i++);
    });
  });
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
        countUpIn(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  reveals.forEach(function (el) { io.observe(el); });
})();
