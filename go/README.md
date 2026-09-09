# /go/<name> — campaign redirects

One folder per channel/persona, each an instant redirect to the App Store campaign link
(App Store Connect → Analytics → Acquisition → Campaigns). The bio holds the short address;
the campaign token lives here, so a token change never touches a bio.

| path | campaign (ct=) | used in |
|---|---|---|
| /go/maya | ugc-maya | @maya.collects Instagram bio (TikTok bio points at the Instagram until 1,000 followers) |
