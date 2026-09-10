#!/bin/sh
# usage: gen-go.sh <dir> <ct>
dir=$1; ct=$2
url="https://apps.apple.com/app/apple-store/id6778956833?pt=129011221&ct=${ct}&mt=8"
cat > "$dir/index.html" <<EOF
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>TCGVendr</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="#08080A">
<link rel="icon" href="/favicon.svg?v=5" type="image/svg+xml">
<link rel="canonical" href="${url}">
<style>
@font-face{font-family:"Schibsted Grotesk";font-weight:800;font-display:swap;src:url(/fonts/schibsted-grotesk-800.woff2) format("woff2")}
@font-face{font-family:"Hanken Grotesk";font-weight:400;font-display:swap;src:url(/fonts/hanken-grotesk-400.woff2) format("woff2")}
@font-face{font-family:"Hanken Grotesk";font-weight:600;font-display:swap;src:url(/fonts/hanken-grotesk-600.woff2) format("woff2")}
:root{color-scheme:dark;--bg:#08080A;--ink:#fff;--ink-2:#A7AEB8;--ink-3:#7A8390;--line:rgba(255,255,255,.10)}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.5 "Hanken Grotesk",-apple-system,system-ui,sans-serif;-webkit-font-smoothing:antialiased;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px max(24px,env(safe-area-inset-left)) max(32px,env(safe-area-inset-bottom));touch-action:manipulation}
.icon{width:96px;height:96px;border-radius:22px;display:block;margin:0 auto 26px;box-shadow:0 0 0 1px var(--line)}
h1{font:800 32px/1.05 "Schibsted Grotesk",-apple-system,system-ui,sans-serif;letter-spacing:-.02em;margin:0 0 12px}
p{margin:0;color:var(--ink-2);max-width:30ch}
.btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;max-width:320px;height:54px;margin:34px auto 0;border-radius:100px;background:var(--ink);color:#08080A;font:700 16px "Schibsted Grotesk",-apple-system,system-ui,sans-serif;letter-spacing:-.01em;text-decoration:none;transition:background .18s}
.btn:active{background:#dfe3e8}
.btn svg{width:18px;height:18px;flex:none}
.sub{margin-top:14px;font-size:14px;color:var(--ink-3)}
.hint{position:fixed;left:0;right:0;bottom:max(20px,env(safe-area-inset-bottom));font-size:13px;color:var(--ink-3);padding:0 24px}
[hidden]{display:none!important}
</style>
</head>
<body>
<img class="icon" src="/apple-touch-icon.png?v=4" width="96" height="96" alt="">
<h1>TCGVendr</h1>
<p>Card shows, vendor tables, and what your cards actually sold for.</p>
<a class="btn" href="${url}">
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.37 12.64c-.02-2.1 1.72-3.11 1.8-3.16-.98-1.43-2.5-1.63-3.04-1.65-1.3-.13-2.53.76-3.19.76-.66 0-1.67-.74-2.75-.72-1.41.02-2.72.82-3.44 2.09-1.47 2.55-.38 6.32 1.05 8.39.7 1.01 1.53 2.15 2.62 2.11 1.05-.04 1.45-.68 2.72-.68s1.63.68 2.74.66c1.13-.02 1.85-1.03 2.54-2.05.8-1.17 1.13-2.3 1.15-2.36-.03-.01-2.2-.85-2.2-3.39zM14.28 6.46c.58-.7.97-1.68.86-2.66-.83.03-1.85.56-2.45 1.26-.54.62-1.01 1.62-.88 2.57.93.07 1.88-.47 2.47-1.17z"/></svg>
Open in App Store
</a>
<div class="sub">Free for iPhone</div>
<div class="hint" id="hint" hidden>Not opening? Tap ⋯ and choose Open in browser.</div>
<script>
(function(){
  var url="${url}";
  // Instagram / Facebook / Threads / TikTok web views drop an automatic
  // navigation to apps.apple.com (blank page) but honor a user tap, so those
  // get this page and the button. Everyone else redirects on load.
  var inApp=/Instagram|FBAN|FBAV|FB_IAB|Barcelona|TikTok|musical_ly|BytedanceWebview/i.test(navigator.userAgent);
  if(inApp){document.getElementById("hint").hidden=false;}
  else{location.replace(url);}
})();
</script>
</body>
</html>
EOF
