// tcgvendr.com — reveal on scroll, sticky-nav state, mobile menu.
// No theme switching: the site is dark only (see the note at the top of styles.css).
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Stagger: give each child of a [data-stagger] group an index so the CSS
     transition-delay can fan them out. */
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      if (!child.style.getPropertyValue('--i')) child.style.setProperty('--i', i);
    });
  });

  /* Reveal. Without IntersectionObserver (or with reduced motion) everything
     is simply shown — the page must never depend on JS to be readable. */
  var revealables = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* Phone carousels (history, scan on phones): the dots follow the snap. */
  document.querySelectorAll('[data-phones]').forEach(function (track) {
    var dots = track.parentElement.querySelectorAll('.phone-dots span');
    if (!dots.length) return;
    var ticking = false;
    var update = function () {
      ticking = false;
      var slides = track.children;
      if (!slides.length) return;
      var step = slides[0].offsetWidth + (slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft - slides[0].offsetWidth : 0);
      var i = Math.min(dots.length - 1, Math.max(0, Math.round(track.scrollLeft / step)));
      dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
    };
    track.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
  });

  /* Top movers: Gainers | Losers swap the baked lists. */
  document.querySelectorAll('[data-movers-toggle]').forEach(function (seg) {
    var lists = seg.closest('section').querySelectorAll('.tc-movers');
    seg.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var set = btn.getAttribute('data-set');
        seg.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        lists.forEach(function (ul) { ul.hidden = ul.getAttribute('data-set') !== set; if (!ul.hidden) ul.parentElement.scrollLeft = 0; });
      });
    });
  });

  /* Nav gets a hairline once the page has moved. */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile menu. */
  var btn = document.getElementById('menu-btn');
  if (btn && nav) {
    var close = function () {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open menu');
    };
    btn.addEventListener('click', function () {
      var open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('.mobile-menu a').forEach(function (a) {
      a.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { close(); btn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target)) close();
    });
  }
})();
