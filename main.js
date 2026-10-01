// tcgvendr.com: reveal on scroll, nav state, mobile menu, and the "On the
// tables" strip (arrows + hiding cards from shows that have already ended).
// The page must read fine without any of this.
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* Reveal */
  var revealables = document.querySelectorAll('.reveal');
  if (reduce || !hasIO) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* Nav goes solid once the page leaves the top */
  var nav = document.getElementById('nav');
  var sentinel = document.querySelector('.nav-sentinel');
  if (nav && sentinel && hasIO) {
    new IntersectionObserver(function (entries) {
      nav.classList.toggle('solid', !entries[0].isIntersecting);
    }).observe(sentinel);
  } else if (nav) {
    nav.classList.add('solid');
  }

  /* Mobile menu */
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  if (btn && menu && nav) {
    var setOpen = function (open) {
      menu.hidden = !open;
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    btn.addEventListener('click', function () { setOpen(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setOpen(false); btn.focus(); }
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', function (m) { if (m.matches) setOpen(false); });
  }

  /* On the tables: each card carries its show's last day (data-end). Once that
     day has passed the card hides itself, and with fewer than four left the
     whole strip goes, so an old bake never advertises a past show. */
  var list = document.querySelector('[data-tiles]');
  if (list) {
    var d = new Date();
    var today = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    var live = 0;
    list.querySelectorAll('.tile').forEach(function (t) {
      var end = t.getAttribute('data-end');
      if (end && end < today) t.remove(); else live++;
    });
    var strip = list.closest('.strip');
    if (live < 4 && strip) { strip.remove(); return; }

    var prev = document.querySelector('[data-scroll="-1"]');
    var next = document.querySelector('[data-scroll="1"]');
    var sync = function () {
      if (!prev || !next) return;
      prev.disabled = list.scrollLeft < 8;
      next.disabled = list.scrollLeft + list.clientWidth > list.scrollWidth - 8;
    };
    [prev, next].forEach(function (b) {
      if (!b) return;
      b.addEventListener('click', function () {
        var step = Math.max(list.clientWidth * 0.8, 200) * Number(b.getAttribute('data-scroll'));
        list.scrollBy({ left: step, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
    var ticking = false;
    list.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; sync(); }); }
    }, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }
})();
