/**
 * Opt-in analytics consent for the public website (GTM + consent banner).
 *
 * Google code (GTM's gtm.js or GA4's gtag.js) may load ONLY after the visitor clicks Accept. Decline, or no
 * choice yet, means no Google script is requested, nothing is buffered and nothing is sent.
 *
 * Same model as the SDL platform's consent card (platform/src/lib/analytics/consent.ts), adapted to this static
 * multi-page site. The choice is per browser (localStorage `sybil.siteAnalyticsConsent` = `{ v, choice, at }`; the
 * platform's storage is a different origin, so the two are never shared). It is VERSIONED: when the consent
 * policy changes (`CONSENT_POLICY`), every stored choice becomes stale and the banner asks again.
 *
 * This file has no Astro/Vite dependencies so it can be unit-tested with `node --test`.
 */

/**
 * The consent policy. Changing either field re-asks every visitor.
 *
 * `ads` — what Accept grants when the GTM container loads (Google Consent Mode):
 *   false (option A, current): measurement only. `analytics_storage` granted; `ad_storage`, `ad_user_data` and
 *          `ad_personalization` denied.
 *   true  (option B): measurement and advertising, all four granted. The banner copy then names advertising.
 *          Switch to B only once it is confirmed that the GA4 property is linked to Google Ads (or ads are
 *          otherwise intended): docs/GTM-ACTIVATION-CHECKLIST.md.
 * `revision` — bump when the banner's wording changes in a way people must agree to again.
 */
export const CONSENT_POLICY = { revision: 1, ads: false } as const;

export const CONSENT_STORAGE_KEY = "sybil.siteAnalyticsConsent";

export type ConsentPolicy = { revision: number; ads: boolean };
export type ConsentChoice = "accepted" | "declined";

interface StoredConsent {
  v: string;
  choice: ConsentChoice;
  at: number;
}

/** PURE: the stored-version tag of a policy, e.g. `1a` (measurement only) or `1b` (with ads). */
export function consentVersion(policy: ConsentPolicy = CONSENT_POLICY): string {
  return `${policy.revision}${policy.ads ? "b" : "a"}`;
}

/** PURE: a stored value → the current-version choice, or null (missing, malformed or another version). */
export function parseStoredConsent(raw: unknown, version: string = consentVersion()): ConsentChoice | null {
  if (typeof raw !== "string" || raw.length === 0 || raw.length > 500) return null;
  try {
    const v = JSON.parse(raw) as Partial<StoredConsent> | null;
    if (!v || typeof v !== "object" || v.v !== version) return null;
    return v.choice === "accepted" || v.choice === "declined" ? v.choice : null;
  } catch {
    return null;
  }
}

/** PURE: the value written for a choice. */
export function serializeConsent(choice: ConsentChoice, nowMs: number, version: string = consentVersion()): string {
  return JSON.stringify({ v: version, choice, at: nowMs } satisfies StoredConsent);
}

/** PURE: the Consent Mode state Accept grants under a policy. */
export function grantedConsentState(policy: ConsentPolicy = CONSENT_POLICY): Record<string, "granted" | "denied"> {
  const ads = policy.ads ? "granted" : "denied";
  return { analytics_storage: "granted", ad_storage: ads, ad_user_data: ads, ad_personalization: ads };
}

/** Consent Mode state after a withdrawal (Decline in "Cookie settings" on a page where Google already loaded). */
export const DENIED_CONSENT_STATE = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;

/** PURE: the Google Analytics cookie names to remove on a withdrawal (never any other cookie). */
export function analyticsCookieNames(cookieHeader: unknown): string[] {
  if (typeof cookieHeader !== "string") return [];
  return cookieHeader
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((name) => name === "_ga" || /^_ga_[A-Za-z0-9]+$/.test(name) || name === "_gid" || /^_gat(_[A-Za-z0-9_-]+)?$/.test(name));
}

/** PURE: the domains a GA cookie may have been set on for this host (host, then each parent; never a bare TLD). */
export function cookieDomainsFor(hostname: string): string[] {
  const parts = hostname.split(".").filter(Boolean);
  if (parts.length < 2 || /^\d+$/.test(parts[parts.length - 1])) return [hostname];
  const out: string[] = [];
  for (let i = 0; i <= parts.length - 2; i++) out.push(parts.slice(i).join("."));
  return out;
}

/** Best-effort removal of the GA cookies on a withdrawal. Never throws. */
export function clearAnalyticsCookies(doc: { cookie: string }, hostname: string): void {
  try {
    for (const name of analyticsCookieNames(doc.cookie)) {
      doc.cookie = `${name}=; Max-Age=0; path=/`;
      for (const domain of cookieDomainsFor(hostname)) doc.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
    }
  } catch {
    // Best effort only.
  }
}

export interface ConsentStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** The current-version choice in this browser, or null. Blocked storage means "no choice". */
export function readConsent(storage: ConsentStorage | null, version: string = consentVersion()): ConsentChoice | null {
  try {
    return parseStoredConsent(storage?.getItem(CONSENT_STORAGE_KEY), version);
  } catch {
    return null;
  }
}

/** Remember a choice. Blocked storage: the choice still applies to this page load only. */
export function writeConsent(storage: ConsentStorage | null, choice: ConsentChoice, nowMs: number, version: string = consentVersion()): void {
  try {
    storage?.setItem(CONSENT_STORAGE_KEY, serializeConsent(choice, nowMs, version));
  } catch {
    // Not remembered.
  }
}

/**
 * The banner copy. It describes what the configured provider really collects, so it depends on the provider:
 * GTM carries Ricky's container (GA4 with enhanced measurement and automatic user-provided data collection);
 * direct GA4 sends only a sanitized page view per page.
 */
export function bannerCopy(provider: "gtm" | "ga4", policy: ConsentPolicy = CONSENT_POLICY): { title: string; body: string } {
  if (provider === "ga4") {
    return {
      title: "Analytics cookies",
      body: "Sybil uses Google Analytics to count which pages you visit, so we can improve the site. Nothing is collected unless you accept.",
    };
  }
  return {
    title: policy.ads ? "Analytics and ad cookies" : "Analytics cookies",
    body:
      "Sybil uses Google Analytics to see which pages you visit and what you click, so we can improve the site. " +
      (policy.ads ? "Google may also use this information for advertising. " : "") +
      "If you fill in a form, your email, phone number or address may also be shared with Google in scrambled form. " +
      "Nothing is collected unless you accept.",
  };
}
