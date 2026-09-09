# /go/<name> — campaign redirects

One folder per channel/persona, each an instant redirect to the App Store campaign link
(App Store Connect → Analytics → Acquisition → Campaigns). The bio holds the short address;
the campaign token lives here, so a token change never touches a bio.

| path | campaign (ct=) | used in |
|---|---|---|
| /go/maya | ugc-maya | @maya.collects Instagram bio (TikTok bio points at the Instagram until 1,000 followers) |
| /go/reddit | reddit | u/C333343 Reddit profile. Per-subreddit splits, if ever wanted, follow as /go/reddit-<sub> with ct=reddit-<sub>, leaving plain `reddit` as the profile/catch-all. |
