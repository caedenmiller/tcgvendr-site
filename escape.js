/* TikTok's in-app browser refuses every App Store link from a personal
   account ("Action can't be completed", TikTok policy since March 2023), so the
   bio link (tcgvendr.com) can't reach the store from inside TikTok. On an
   iPhone inside TikTok, a tap on any App Store link instead shows a sheet with
   the way out: ⋯ then Open in browser, or search the App Store by name.
   The tap first LOADS /go/tiktok/ (a real navigation), which opens with the
   sheet up, so Open in browser hands Safari that page and Safari redirects
   straight to the App Store (ct=tiktok).
   Tried and failed on Caeden's phone 10-20: the x-safari-https one-tap jump,
   and history.replaceState to /go/tiktok/ (TikTok's Open in browser uses the
   last LOADED address, so the homepage came back).
   Loaded on every page and every /go page; does nothing anywhere else. */
(function () {
  var ua = navigator.userAgent;
  if (!/TikTok|musical_ly|BytedanceWebview|trill_/i.test(ua)) return;
  if (!/iPhone|iPad|iPod/i.test(ua)) return;

  var LANDING = '/go/tiktok/';
  var onLanding = location.pathname === LANDING;
  var sheet = null;
  // /go pages redirect to the store on their own once in Safari: no step 3
  var onGo = location.pathname.indexOf('/go/') === 0;


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
  }

  function hide() {
    sheet.classList.remove('on');
    // came here from one of our pages: Got it goes back there
    if (onLanding && document.referrer.indexOf(location.origin) === 0 && history.length > 1) {
      history.back();
      return;
    }
    setTimeout(function () { sheet.hidden = true; }, 220);
  }

  if (onLanding) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
    else show();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="apps.apple.com"]');
    if (!a) return;
    e.preventDefault();
    // /go pages already redirect in Safari: just show the sheet there.
    // Everywhere else, load the landing page so it becomes the address
    // TikTok's Open in browser hands to Safari.
    if (onGo) show();
    else window.location.href = LANDING;
  }, true);
})();
