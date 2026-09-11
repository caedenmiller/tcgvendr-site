#!/usr/bin/env python3
"""Regenerate /go/<dir>/index.html.  usage: python3 gen.py <dir> <ct>
The movers strip reads ../data/movers.json (baked by scripts/website-tables.py)."""
import json, sys, os, html
dir_, ct = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__))
url = f"https://apps.apple.com/app/apple-store/id6778956833?pt=129011221&ct={ct}&mt=8"
movers = json.load(open(os.path.join(here, "..", "data", "movers.json")))
def tile(m):
    up = m["pct"] >= 0
    price = f"${m['price']:,.0f}" if m["price"] >= 100 else f"${m['price']:,.2f}"
    return (f'<li class="t"><div class="ta"><img src="/cards/{m["id"]}.webp?v={m["id"]}" loading="lazy" decoding="async" alt=""></div>'
            f'<div class="tb"><b>{html.escape(m["name"])}</b><span class="tp">{price}</span>'
            f'<span class="tt {"up" if up else "down"}">{"+" if up else ""}{m["pct"]:.1f}%</span></div></li>')
tiles = "".join(tile(m) for m in movers["gainers"][:8] + movers["losers"][:4])
page = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>TCGVendr</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="#08080A">
<link rel="icon" href="/favicon.svg?v=5" type="image/svg+xml">
<link rel="canonical" href="{url}">
<link rel="preconnect" href="https://apps.apple.com">
<meta name="apple-itunes-app" content="app-id=6778956833">
<style>
@font-face{{font-family:"Schibsted Grotesk";font-weight:800;font-display:swap;src:url(/fonts/schibsted-grotesk-800.woff2) format("woff2")}}
@font-face{{font-family:"Hanken Grotesk";font-weight:400;font-display:swap;src:url(/fonts/hanken-grotesk-400.woff2) format("woff2")}}
@font-face{{font-family:"Hanken Grotesk";font-weight:600;font-display:swap;src:url(/fonts/hanken-grotesk-600.woff2) format("woff2")}}
@font-face{{font-family:"Hanken Grotesk";font-weight:700;font-display:swap;src:url(/fonts/hanken-grotesk-700.woff2) format("woff2")}}
:root{{color-scheme:dark;--bg:#08080A;--ink:#fff;--ink-2:#A7AEB8;--ink-3:#7A8390;--line:rgba(255,255,255,.12);--mint:#28D8B0;--coral:#F06068;--disp:"Schibsted Grotesk",-apple-system,system-ui,sans-serif;--text:"Hanken Grotesk",-apple-system,system-ui,sans-serif}}
*{{box-sizing:border-box}}
html,body{{height:100%}}
body{{margin:0;background:var(--bg);color:var(--ink);font:17px/1.5 var(--text);-webkit-font-smoothing:antialiased;display:flex;flex-direction:column;min-height:100%;touch-action:manipulation}}
.strip{{padding-top:max(18px,env(safe-area-inset-top))}}
.eyebrow{{font:800 11px/1 var(--disp);letter-spacing:.2em;text-transform:uppercase;color:var(--ink-3);padding:0 24px;margin:0 0 10px}}
.scroll{{overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x proximity;scrollbar-width:none;-webkit-overflow-scrolling:touch;scroll-padding:0 24px}}
.scroll::-webkit-scrollbar{{display:none}}
.list{{list-style:none;margin:0;padding:1px 24px;display:flex;gap:8px;width:max-content}}
.t{{flex:0 0 88px;scroll-snap-align:start;border:1px solid var(--line);border-radius:10px;overflow:hidden;display:flex;flex-direction:column}}
.ta{{aspect-ratio:5/7;padding:6px 6px 0;display:flex;align-items:flex-end;justify-content:center}}
.ta img{{width:auto;height:auto;max-width:100%;max-height:100%}}
.tb{{display:grid;gap:1px;padding:6px 7px 7px}}
.tb b{{font:700 11px/1.25 var(--disp);letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.tp{{font:800 12.5px/1.2 var(--disp);letter-spacing:-.02em;margin-top:3px}}
.tt{{font-size:10.5px;font-weight:600;line-height:1.3}}
.tt.up{{color:var(--mint)}}.tt.down{{color:var(--coral)}}
main{{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px max(24px,env(safe-area-inset-left)) max(56px,env(safe-area-inset-bottom))}}
.icon{{width:96px;height:96px;border-radius:22px;display:block;margin:0 auto 24px;box-shadow:0 0 0 1px var(--line)}}
h1{{font:700 26px/1 var(--text);letter-spacing:.14em;text-transform:uppercase;margin:0 0 16px}}
p{{margin:0;color:var(--ink-2);max-width:30ch}}
.badge{{display:inline-flex;align-items:center;gap:10px;margin-top:30px;height:60px;padding:0 20px 0 16px;border-radius:12px;background:#000;border:1px solid rgba(255,255,255,.55);color:#fff;text-decoration:none;text-align:left;font-family:-apple-system,"SF Pro Text",system-ui,sans-serif;transition:border-color .18s}}
.badge:active{{border-color:#fff}}
.badge svg{{width:26px;height:26px;flex:none;margin-top:-2px}}
.badge small{{display:block;font-size:11px;line-height:1;letter-spacing:.01em;margin-bottom:3px}}
.badge b{{display:block;font-size:22px;line-height:1;font-weight:600;letter-spacing:-.01em}}
.sub{{margin-top:16px;font-size:14px;color:var(--ink-3)}}
.stars{{color:var(--ink);letter-spacing:.08em;margin-right:6px}}
.foot{{position:fixed;left:0;right:0;bottom:max(20px,env(safe-area-inset-bottom));font-size:13px;color:var(--ink-3);padding:0 24px;text-align:center}}
@keyframes in{{from{{opacity:0;transform:translateY(6px)}}to{{opacity:1;transform:none}}}}
.wrap{{animation:in .32s ease-out both}}
@media(prefers-reduced-motion:reduce){{.wrap{{animation:none}}}}
[hidden]{{display:none!important}}
</style>
</head>
<body>
<div class="strip wrap">
<div class="eyebrow">This week's top movers</div>
<div class="scroll"><ul class="list">{tiles}</ul></div>
</div>
<main class="wrap">
<img class="icon" src="/go/icon.png?v=1" width="96" height="96" alt="">
<h1>TCGVendr</h1>
<p>The portfolio and card show app. Know the floor before you walk it.</p>
<a class="badge" href="{url}" aria-label="Download on the App Store">
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.37 12.64c-.02-2.1 1.72-3.11 1.8-3.16-.98-1.43-2.5-1.63-3.04-1.65-1.3-.13-2.53.76-3.19.76-.66 0-1.67-.74-2.75-.72-1.41.02-2.72.82-3.44 2.09-1.47 2.55-.38 6.32 1.05 8.39.7 1.01 1.53 2.15 2.62 2.11 1.05-.04 1.45-.68 2.72-.68s1.63.68 2.74.66c1.13-.02 1.85-1.03 2.54-2.05.8-1.17 1.13-2.3 1.15-2.36-.03-.01-2.2-.85-2.2-3.39zM14.28 6.46c.58-.7.97-1.68.86-2.66-.83.03-1.85.56-2.45 1.26-.54.62-1.01 1.62-.88 2.57.93.07 1.88-.47 2.47-1.17z"/></svg>
<span><small>Download on the</small><b>App Store</b></span>
</a>
<div class="sub" id="sub"><span class="stars" aria-label="5 stars">★★★★★</span>5.0 on the App Store · Free</div>
</main>
<div class="foot" id="hint" hidden>Not opening? Tap ⋯ and choose Open in browser.</div>
<script>
(function(){{
  var url="{url}";
  if(/Android/i.test(navigator.userAgent)){{
    document.querySelector(".badge").hidden=true;
    document.getElementById("sub").textContent="iPhone only right now";
    return;
  }}
  // Instagram / Facebook / Threads / TikTok web views drop an automatic
  // navigation to apps.apple.com (blank page) but honor a user tap, so those
  // get this page and the badge. Everyone else redirects on load.
  var inApp=/Instagram|FBAN|FBAV|FB_IAB|Barcelona|TikTok|musical_ly|BytedanceWebview/i.test(navigator.userAgent);
  if(inApp){{document.getElementById("hint").hidden=false;}}
  else{{location.replace(url);}}
}})();
</script>
</body>
</html>
'''
open(os.path.join(here, dir_, "index.html"), "w").write(page)
print(dir_, ct, len(movers["gainers"][:8] + movers["losers"][:4]), "tiles")
