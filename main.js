/* TCGVendr — tcgvendr.com interaction layer.
   Progressive enhancement: the page is fully usable with no JS (the `.js` flag
   below is what arms the hidden-then-revealed states). If GSAP is missing or the
   user prefers reduced motion, we set every final state and bail — never a blank
   headline, never a stuck reveal. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer:fine)').matches;

  /* ---- theme toggle: persists, updates label + browser chrome color ---- */
  var toggleBtn = document.getElementById('theme-toggle');
  var metaTheme = document.getElementById('meta-theme');
  function syncTheme() {
    var t = root.dataset.theme;
    metaTheme.setAttribute('content', t === 'light' ? '#f4f1ea' : '#0c0e11');
    toggleBtn.setAttribute('aria-label', t === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  }
  toggleBtn.addEventListener('click', function () {
    var next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('tcgv-theme', next); } catch (e) {}
    syncTheme();
  });
  syncTheme();

  /* ---- mobile menu ---- */
  var menuBtn = document.getElementById('menu-btn');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });

  /* ---- nav elevation on scroll ---- */
  var nav = document.getElementById('nav');
  function onScrollNav() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  var lines = document.querySelectorAll('.reveal-lines .line');
  var reveals = document.querySelectorAll('.reveal');
  var staggers = document.querySelectorAll('.stagger');
  var counts = document.querySelectorAll('.count');
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);

  function showAll() {
    lines.forEach(function (l) { l.style.transform = 'none'; });
    reveals.forEach(function (r) { r.classList.add('in'); });
    staggers.forEach(function (s) { s.classList.add('in'); });
  }

  /* ---- count-up (respects data-decimals so cents stay exact) ---- */
  function fmt(n, prefix, dec) {
    return (prefix || '') + n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  function runCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    var to = parseFloat(el.dataset.to), prefix = el.dataset.prefix || '', dec = parseInt(el.dataset.decimals || '0', 10);
    if (reduced || !window.gsap) { el.textContent = fmt(to, prefix, dec); return; }
    var obj = { v: 0 };
    window.gsap.to(obj, { v: to, duration: 1.4, ease: 'power2.out',
      onUpdate: function () { el.textContent = fmt(obj.v, prefix, dec); } });
  }

  /* ---- no-motion / no-lib path: set final states and stop ---- */
  if (reduced || !hasGSAP) {
    showAll();
    counts.forEach(runCount);
    return;
  }

  var gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);

  /* Native scroll only — no smooth-scroll library. A marketing page should feel
     as responsive as every other site; anchor jumps use CSS scroll-behavior +
     scroll-margin-top. ScrollTrigger works directly off the native scroller. */

  /* hero headline line reveal is handled by CSS (.reveal-lines) — see styles.css */

  /* ---- scroll reveals ---- */
  reveals.forEach(function (el) {
    ST.create({ trigger: el, start: 'top 88%', once: true,
      onEnter: function () { el.classList.add('in'); } });
  });
  staggers.forEach(function (el) {
    ST.create({ trigger: el, start: 'top 86%', once: true,
      onEnter: function () { el.classList.add('in'); } });
  });

  /* ---- count-ups on enter (start from 0 to avoid a flash) ---- */
  counts.forEach(function (el) {
    el.textContent = (el.dataset.prefix || '') + '0';
    ST.create({ trigger: el, start: 'top 92%', once: true, onEnter: function () { runCount(el); } });
  });

  /* ---- active nav link ---- */
  var navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(function (a) {
    var id = a.getAttribute('href');
    if (!id || id.charAt(0) !== '#') return;
    var sec = document.querySelector(id);
    if (!sec) return;
    ST.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: function (self) {
        if (self.isActive) {
          navLinks.forEach(function (x) { x.classList.remove('active'); });
          a.classList.add('active');
        }
      } });
  });

  /* ---- magnetic CTA buttons ---- */
  if (finePointer) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', (e.clientX - r.left - r.width / 2) * 0.3 + 'px');
        btn.style.setProperty('--my', (e.clientY - r.top - r.height / 2) * 0.4 + 'px');
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.setProperty('--mx', '0px');
        btn.style.setProperty('--my', '0px');
      });
    });
  }

  /* recompute trigger positions once fonts/images settle */
  window.addEventListener('load', function () { ST.refresh(); });
})();
