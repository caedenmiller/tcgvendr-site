/* TikTok's in-app browser refuses every App Store link from a personal
   account ("Action can't be completed", TikTok policy since March 2023), so the
   bio link (tcgvendr.com) can't reach the store from inside TikTok. On an
   iPhone inside TikTok, a tap on any App Store link instead shows a sheet with
   the way out: ⋯ then Open in browser, or search the App Store by name.
   While the sheet is up the address reads /go/tiktok/, so Open in browser
   lands on that page in Safari, which redirects straight to the App Store
   (ct=tiktok). Closing the sheet puts the address back.
   The x-safari-https one-tap jump was tried first and does NOT work inside
   TikTok (Caeden's phone, 10-20).
   Loaded on every page and every /go page; does nothing anywhere else. */
(function () {
  var ua = navigator.userAgent;
  if (!/TikTok|musical_ly|BytedanceWebview|trill_/i.test(ua)) return;
  if (!/iPhone|iPad|iPod/i.test(ua)) return;

  var LANDING = '/go/tiktok/';
  var original = null;
  var sheet = null;
  // /go pages redirect to the store on their own once in Safari: no step 3
  var onGo = location.pathname.indexOf('/go/') === 0;
  var canSwap = !!(window.history && history.replaceState);

  function css() {
    var s = document.createElement('style');
    s.textContent =
      '.tt-scrim{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.72);display:flex;flex-direction:column;justify-content:flex-end;opacity:0;transition:opacity .2s ease-out;-webkit-tap-highlight-color:transparent}' +
      '.tt-scrim.on{opacity:1}' +
      '.tt-arrow{position:absolute;top:max(2px,env(safe-area-inset-top));right:10px;width:56px;height:74px;color:#fff;animation:tt-nudge 1.4s ease-in-out infinite}' +
      '@keyframes tt-nudge{0%,100%{transform:translate(0,0)}50%{transform:translate(4px,-6px)}}' +
      '.tt-sheet{position:relative;background:#101013;border-top:1px solid rgba(255,255,255,.12);border-radius:20px 20px 0 0;padding:24px 24px max(24px,env(safe-area-inset-bottom));color:#fff;font:500 16px/1.45 "Plus Jakarta Sans",-apple-system,system-ui,sans-serif;transform:translateY(16px);transition:transform .24s ease-out}' +
      '.tt-scrim.on .tt-sheet{transform:none}' +
      '.tt-sheet h2{margin:0 0 16px;font-size:21px;font-weight:800;letter-spacing:-.01em;line-height:1.2}' +
      '.tt-steps{list-style:none;margin:0;padding:0;display:grid;gap:12px}' +
      '.tt-steps li{display:flex;align-items:center;gap:12px;color:#C5C9CF}' +
      '.tt-steps b{color:#fff;font-weight:700}' +
      '.tt-n{flex:none;width:28px;height:28px;border-radius:50%;background:#fff;color:#08080A;font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center}' +
      '.tt-alt{display:flex;align-items:center;gap:12px;margin-top:20px;padding-top:18px;border-top:1px solid rgba(255,255,255,.09);color:#969CA4;font-size:14px}' +
      '.tt-alt img{width:44px;height:44px;border-radius:10px;flex:none}' +
      '.tt-alt b{color:#fff;font-weight:700}' +
      '.tt-close{display:flex;width:100%;height:50px;margin-top:20px;border:0;border-radius:999px;background:rgba(255,255,255,.1);color:#fff;font:700 16px "Plus Jakarta Sans",-apple-system,system-ui,sans-serif;align-items:center;justify-content:center}' +
      '.tt-close:focus{outline:none}.tt-close:active{background:rgba(255,255,255,.16)}' +
      '@media(prefers-reduced-motion:reduce){.tt-arrow{animation:none}.tt-scrim,.tt-sheet{transition:none}}';
    document.head.appendChild(s);
  }

  function build() {
    css();
    sheet = document.createElement('div');
    sheet.className = 'tt-scrim';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-labelledby', 'tt-title');
    sheet.innerHTML =
      '<svg class="tt-arrow" viewBox="0 0 64 84" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M8 72C12 40 26 18 48 4"/><path d="M30 3h19v19"/></svg>' +
      '<div class="tt-sheet">' +
        '<h2 id="tt-title">TikTok blocks App Store links</h2>' +
        '<ol class="tt-steps">' +
          '<li><span class="tt-n">1</span><span>Tap <b>⋯</b> at the top right</span></li>' +
          '<li><span class="tt-n">2</span><span>Choose <b>Open in browser</b></span></li>' +
          (onGo || canSwap ? '' : '<li><span class="tt-n">3</span><span>Tap <b>Get the app</b> again</span></li>') +
        '</ol>' +
        '<div class="tt-alt"><img src="/go/icon.png?v=1" alt=""><span>Or search <b>TCGVendr</b> in the App Store. It’s free.</span></div>' +
        '<button class="tt-close" type="button">Got it</button>' +
      '</div>';
    sheet.addEventListener('click', function (e) {
      if (e.target === sheet || e.target.closest('.tt-close')) hide();
    });
    document.body.appendChild(sheet);
  }

  function show() {
    if (!sheet) build();
    sheet.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { sheet.classList.add('on'); }); });
    if (canSwap && !onGo && original === null) {
      original = location.pathname + location.search + location.hash;
      try { history.replaceState(history.state, '', LANDING); } catch (err) { original = null; }
    }
  }

  function hide() {
    sheet.classList.remove('on');
    if (original !== null) {
      try { history.replaceState(history.state, '', original); } catch (err) { /* keep going */ }
      original = null;
    }
    setTimeout(function () { sheet.hidden = true; }, 220);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="apps.apple.com"]');
    if (!a) return;
    e.preventDefault();
    show();
  }, true);
})();
