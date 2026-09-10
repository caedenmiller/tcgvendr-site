# /go/<name> — campaign redirects

One folder per channel/persona, each a redirect to the App Store campaign link. Instant in a real
browser; inside the Instagram / Facebook / Threads / TikTok in-app browsers (user agent sniffed) the
page shows an "Open in App Store" BUTTON instead, because those web views drop an automatic
navigation to apps.apple.com (blank page) but honor a user tap. No `<meta refresh>` for that reason
(App Store Connect → Analytics → Acquisition → Campaigns). The bio holds the short address;
the campaign token lives here, so a token change never touches a bio.

| path | campaign (ct=) | used in |
|---|---|---|
| /go/maya | ugc-maya | @maya.collects Instagram bio (TikTok bio points at the Instagram until 1,000 followers) |
| /go/reddit | reddit | u/C333343 Reddit profile. Per-subreddit splits, if ever wanted, follow as /go/reddit-<sub> with ct=reddit-<sub>, leaving plain `reddit` as the profile/catch-all. |
