/* TikTok's in-app browser refuses every App Store link from a personal
   account ("Action can't be completed", TikTok policy since March 2023), so the
   bio link (tcgvendr.com) can't reach the store from inside TikTok. On an
   iPhone inside TikTok, a tap on any App Store link instead:
     1. asks iOS to open /go/tiktok/ in Safari (x-safari-https, iOS 17+). In
        Safari that page redirects straight to the App Store (ct=tiktok).
     2. if the page is still on screen a moment later, the escape didn't happen,
        so a sheet shows the manual way out: ⋯ then Open in browser, or search
        the App Store by name.
   Loaded on every page and every /go page; does nothing anywhere else. */
(function () {
  var ua = navigator.userAgent;
  if (!/TikTok|musical_ly|BytedanceWebview|trill_/i.test(ua)) return;
  if (!/iPhone|iPad|iPod/i.test(ua)) return;

  var ESCAPE = 'x-safari-https://tcgvendr.com/go/tiktok/';
  var sheet = null;
  // /go pages redirect to the store on their own once in Safari: no step 3
  var onGo = location.pathname.indexOf('/go/') === 0;

  function css() {
    var s = document.createElement('style');
    s.textContent =
      '.tt-scrim{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.72);display:flex;flex-direction:column;justify-content:flex-end;opacity:0;transition:opacity .2s ease-out;-webkit-tap-highlight-color:transparent}' +
      '.tt-scrim.on{opacity:1}' +
      '.tt-arrow{position:absolute;top:max(10px,env(safe-area-inset-top));right:14px;width:64px;height:84px;color:#fff;animation:tt-nudge 1.4s ease-in-out infinite}' +
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
      '.tt-close:active{background:rgba(255,255,255,.16)}' +
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
        '<path d="M10 80C14 46 30 22 52 8"/><path d="M34 8h18v18"/></svg>' +
      '<div class="tt-sheet">' +
        '<h2 id="tt-title">TikTok blocks App Store links</h2>' +
        '<ol class="tt-steps">' +
          '<li><span class="tt-n">1</span><span>Tap <b>⋯</b> at the top right</span></li>' +
          '<li><span class="tt-n">2</span><span>Choose <b>Open in browser</b></span></li>' +
          (onGo ? '' : '<li><span class="tt-n">3</span><span>Tap <b>Get the app</b> again</span></li>') +
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
    sheet.querySelector('.tt-close').focus({ preventScroll: true });
  }

  function hide() {
    sheet.classList.remove('on');
    setTimeout(function () { sheet.hidden = true; }, 220);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="apps.apple.com"]');
    if (!a) return;
    e.preventDefault();
    // Did the tap take us out of TikTok? Leaving hides the page; then the
    // sheet stays down. (No blur check: TikTok's own error alert may blur the
    // web view without anyone leaving.)
    var left = false;
    var mark = function () { left = true; };
    document.addEventListener('visibilitychange', mark, { once: true });
    window.addEventListener('pagehide', mark, { once: true });
    try { window.location.href = ESCAPE; } catch (err) { /* blocked: the sheet covers it */ }
    setTimeout(function () {
      document.removeEventListener('visibilitychange', mark);
      window.removeEventListener('pagehide', mark);
      if (!left && document.visibilityState === 'visible') show();
    }, 1200);
  }, true);
})();
