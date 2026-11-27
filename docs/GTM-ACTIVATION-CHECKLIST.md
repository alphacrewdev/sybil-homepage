# GTM activation checklist (public website)

The Google Tag Manager loader ships **dormant**. It is activated by setting
`PUBLIC_GTM_CONTAINER_ID=GTM-N5B8B2ZC` (the PM's container) in the environment of the **production** build
and redeploying. With the variable unset, empty or invalid, no cookie card renders and no Google code exists
in the page.

Code: `src/lib/analytics/gtm.ts` (loader + the "only one path" rule), `consent.ts` (stored choice, banner
copy, policy), `controller.ts` (page flow), all unit-tested by `npm test`; `src/components/Analytics.astro`
(the card) and the "Cookie settings" link in `Footer.astro`.

## How it behaves

- **Nothing before Accept.** A first-time visitor sees the cookie card (bottom-right on desktop, inset on
  phones). Until they click Accept, no request goes to Google: no gtm.js, no gtag.js, no `dataLayer`.
- **Accept** loads the container once per page, with Google Consent Mode defaults set first. The choice is
  remembered in this browser (`localStorage` key `sybil.siteAnalyticsConsent`), so later pages load the
  container without asking.
- **Decline** loads nothing, now or later. Choosing Decline later in **Cookie settings** (footer) tells Google
  consent is denied on that page, removes the `_ga*` cookies, and nothing loads from the next page on.
- **No `<noscript>` iframe.** Google's standard snippet includes one. It is deliberately left out: it runs for
  visitors without JavaScript, who cannot see the card or accept, so it would track without consent.
- **Exactly one analytics path.** When `PUBLIC_GTM_CONTAINER_ID` is set, the direct GA4 path
  (`PUBLIC_GA_MEASUREMENT_ID`) does **not** load, even if it is also set: the container already carries the
  GA4 tag (`G-J8BGPNBPW3`), and loading both would count every visit twice (this is what the old WordPress
  site does). Leave `PUBLIC_GA_MEASUREMENT_ID` unset when GTM is on.
- **Never on preview builds** (the GitHub Pages review copy).

## Consent policy: option A (current) vs option B

Set in `CONSENT_POLICY` in `src/lib/analytics/consent.ts`.

| | A: `ads: false` (current) | B: `ads: true` |
|---|---|---|
| Accept grants | `analytics_storage` only; `ad_storage`, `ad_user_data`, `ad_personalization` denied | all four granted |
| Card title | Analytics cookies | Analytics and ad cookies |
| Card adds | — | "Google may also use this information for advertising." |

Switching between A and B changes the stored version (`1a` ↔ `1b`), so every visitor is asked again. Bump
`revision` for any other wording change people must agree to.

**Open question that decides A or B:** is the GA4 property linked to Google Ads? Once `sybilplatform@` has
**Editor** (or Administrator) access to the GA4 property, check Admin → **Product links → Google Ads links**.
If no Ads account is linked, A loses nothing. If one is linked, or ads are intended, switch to B. Note that
under A Google may not process the automatically collected email / phone / address, because Google files
that data under ad user data; verify in GA4 after launch if that collection matters.

## What the container collects (read from the published container, version 2, 2026-11-27)

What GTM sends is configured in Tag Manager and GA4, not in this repo. The card's wording describes this:

- One GA4 destination, `G-J8BGPNBPW3`, firing on every page. No ad tags, no custom HTML.
- **Enhanced measurement on:** page views, scrolls, outbound clicks, file downloads, form starts/submits,
  video, site search (`q, s, search, query, keyword`).
- **Automatic user-provided data collection on:** email, phone and address detected on the page are sent to
  Google hashed. Email redaction is on; Google signals is off.

Unlike the direct GA4 path, the container's GA4 tag sends full page URLs including the query string.

**Container rule:** keep the container to analytics tags. Adding any ad, remarketing or other tracking tag
requires updating the card's wording (and `CONSENT_POLICY`) first, so visitors are asked again.

## Before activating

- [ ] Decide A or B (above).
- [ ] Privacy policy (`src/pages/privacy-policy.md`, client's legal text): it refers to a "Cookie Notice"
      the site does not have, and says consent is withdrawn by contacting the company; it does not mention
      the Cookie settings link. Client to review.
- [ ] Set `PUBLIC_GTM_CONTAINER_ID` **only** for the production build of `sybildigitallearning.com`.
- [ ] If the production host sends a Content-Security-Policy, allow `script-src https://www.googletagmanager.com`
      (plus the in-page module script's hash), and `connect-src` / `img-src` for
      `https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`.
- [ ] Do not also keep the old WordPress direct gtag running against the same property after cut-over.

## Verify after deploy (GTM Preview / Tag Assistant)

- [ ] First visit: the card shows, and the browser's Network tab has no `googletagmanager.com` request.
- [ ] Accept → one `gtm.js?id=GTM-N5B8B2ZC` request; GA4 page view arrives in DebugView. No `gtag/js` request.
- [ ] Reload → no card; container loads once.
- [ ] Footer → Cookie settings → Decline → `_ga` cookies gone; next page sends nothing.
- [ ] Block `googletagmanager.com` → the site works normally, nothing retries.
