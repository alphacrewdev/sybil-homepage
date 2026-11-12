# GA4 activation checklist — public website (B12)

GA4 code ships **dormant**. **GA4 activation requires operator/client consent-policy decision.**

It is activated by setting `PUBLIC_GA_MEASUREMENT_ID` (`G-XXXXXXX`) in the environment of the
**production** build and redeploying. With the variable unset, empty or invalid, the build output is
byte-identical to a build without analytics: no gtag.js request, no `dataLayer`, nothing sent.
**Do not set it until every gate below is done.**

Code: `src/lib/analytics/ga4.ts` (logic, unit-tested by `npm test`) and
`src/components/Analytics.astro` (rendered from `BaseLayout.astro`). The authenticated SDL platform
has its own, separate GA4 slice and checklist (TASK-023); this follows the same privacy contract.

## What the code sends (privacy contract)

One `page_view` per page load (the site is a static multi-page build — each navigation is a new
document), carrying only:

- `page_location` = current origin + the page's **build-time route path** (e.g. `/courses/ct-physics/`).
  The live URL is never read: no query string (`?intent=`, `?course=`, `?type=`), no hash, and a
  mistyped address that lands on the 404 page reports as `/404/`.
- `page_title` = the page's static public title (`CT Physics | Sybil Digital Learning`).
- `page_referrer` = the referring **origin only** (no path, no query).

Never: `user_id`, names, emails, account or Firebase ids, contact-form content, custom dimensions,
custom events. Automatic page views, Google signals and ad personalization are off; `ad_storage`,
`ad_user_data` and `ad_personalization` consent are denied by default.

Not tracked: the legacy-address redirect stand-ins (`/contact-us/`, `/login/`, old course URLs) and the
`/preview/` review page — they do not use `BaseLayout`. The GitHub Pages review copy (any build with a
non-root `base`) never loads analytics, even if the variable is set.

**Deliberate trade-off — campaign attribution.** Because the query string is never sent, `utm_*`
campaign parameters are not attributed. Do not "fix" this by passing `location.href`. If campaign
attribution is wanted later, add an explicit allowlist (`utm_source`, `utm_medium`, `utm_campaign`
only) as a reviewed follow-up.

If gtag.js is blocked or fails, the page is unaffected; nothing retries or polls.

## Gate 1 — decisions (operator/client)

- [ ] **Consent-policy decision.** The site has no cookie banner, CMP or Consent Mode integration.
      Decide whether GA4 may run without one, given GA sets the persistent pseudonymous `_ga`
      client-id cookie and derives coarse location from IP. If cookie consent is required, add a
      consent mechanism first (Consent Mode default `analytics_storage: 'denied'` + a banner that
      grants it) — a follow-up task — or leave the id unset.
- [ ] Privacy policy reviewed against the decision (it currently refers to a "Cookie Notice" that the
      site does not have).
- [ ] GA4 property + **web stream for the public site** created (decide: same property as the platform
      with a separate stream, or a separate property); measurement id supplied.

## Gate 2 — GA property / Google tag settings (code cannot enforce these)

These read the real DOM/URL and bypass the code's sanitization:

- [ ] Web stream → **Enhanced Measurement: OFF entirely** — in particular "page changes based on browser
      history events", outbound clicks (the SDL storefront links carry `?course=` / `?bundle=` ids),
      form interactions (the contact form), site search, scrolls, file downloads, video engagement.
- [ ] Google tag settings → automatic event detection OFF; **"Automatically detect user-provided data" OFF**;
      **no cross-domain linking** (to `app.sybildigitallearning.com`); no URL passthrough.
- [ ] Consider listing `app.sybildigitallearning.com` under "unwanted referrals", so visitors returning
      from the platform don't start new referral sessions.
- [ ] Data Redaction ON for email and the query parameters `email, name, intent, course, bundle, type`
      (defence in depth).
- [ ] Google signals OFF; granular location/device data OFF; data retention set to the minimum.

## Gate 3 — hosting / build

- [ ] Set `PUBLIC_GA_MEASUREMENT_ID` **only** for the production build of `sybildigitallearning.com`
      (hosting is not yet chosen — see README › Deploy). Do not add it to the GitHub Pages review build.
- [ ] If the production host sends a Content-Security-Policy, it must allow:
      `script-src https://www.googletagmanager.com` **plus the in-page loader** (Astro emits it as an in-page
      `<script type="module">` with no `src` — allow its hash, or analytics fails silently);
      `connect-src https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`;
      `img-src https://*.google-analytics.com https://*.googletagmanager.com`.
- [ ] Keep (or set) `Referrer-Policy: strict-origin-when-cross-origin` on the production host.

## Gate 4 — verification (GA DebugView) before announcing

The code never sets `debug_mode`, so hits only appear in DebugView when you connect through
**Tag Assistant** (tagassistant.google.com) or the Google Analytics Debugger extension.

- [ ] Hard-load `/` → exactly one `page_view`, location `<origin>/`.
- [ ] Home → Courses → a course page → Contact: one `page_view` each, path only.
- [ ] `/contact/?intent=program&course=ct-physics#contact-form` → location `<origin>/contact/` with no
      query/hash; submitting the form sends **no** event.
- [ ] A mistyped URL → `/404/`; a storefront "Buy" click → no outbound-click event.
- [ ] Block `googletagmanager.com` → site works normally, no retries.
