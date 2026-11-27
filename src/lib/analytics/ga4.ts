/**
 * GA4 page analytics for the public website (B12 — public-site GA4).
 *
 * Same privacy contract as the authenticated SDL platform's GA4 slice, adapted to this static
 * multi-page Astro site: every navigation is a full page load, so each page sends exactly one
 * `page_view`, built from the page's *build-time* route path — never from `location.href`, the
 * query string or the hash.
 *
 * Scope: `page_view` only. No custom events, no `user_id`, no identity, no form or search values,
 * no custom dimensions. Google signals and ad personalization are off; ad consent types are denied.
 *
 * Activation: dormant unless `PUBLIC_GA_MEASUREMENT_ID` holds a valid GA4 id (`G-XXXXXXX`) at
 * build time. With no (or an invalid) id, BaseLayout renders no analytics script at all — gtag.js
 * is never requested and nothing is sent. There is no consent mechanism on this site today, so
 * setting the id IS the activation decision and requires the operator/client consent-policy
 * decision first (see docs/GA4-ACTIVATION-CHECKLIST.md).
 *
 * Failure safety: gtag.js is injected async. If it is blocked or fails, nothing retries or polls,
 * and nothing here can throw into the page.
 *
 * This file has no Astro/Vite dependencies so it can be unit-tested with `node --test`.
 */

const MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{4,20}$/;
const GTAG_SRC = "https://www.googletagmanager.com/gtag/js";
const INIT_FLAG = "__sybilGa4Initialized";

/** Exactly the parameters a page_view may carry. Nothing else is ever sent. */
export interface SanitizedPageView {
  page_location: string;
  page_title: string;
  page_referrer: string;
}

type GtagFn = (...args: unknown[]) => void;

export interface AnalyticsWindow {
  dataLayer?: unknown[];
  gtag?: GtagFn;
  location: { origin: string };
  [INIT_FLAG]?: boolean;
}

export interface AnalyticsDocument {
  referrer: string;
  createElement(tag: "script"): HTMLScriptElement;
  head: { appendChild(node: HTMLScriptElement): unknown };
}

export interface PageInfo {
  /** The page's own route path, known at build time (e.g. `/courses/ct-physics/`). */
  path: string;
  /** The page's static, public title (e.g. `About | Sybil Digital Learning`). */
  title: string;
}

/** A trimmed, valid GA4 measurement id, or null. */
export function parseMeasurementId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim().toUpperCase();
  return MEASUREMENT_ID_PATTERN.test(id) ? id : null;
}

/**
 * A route path safe to report: path only (query and hash dropped even if a caller passes them),
 * always starting with `/`. Anything unparseable reports as `/`.
 */
export function sanitizePath(path: unknown): string {
  if (typeof path !== "string") return "/";
  const cut = path.split(/[?#]/, 1)[0].trim();
  if (!cut.startsWith("/") || cut.startsWith("//")) return "/";
  return cut;
}

/**
 * The referrer reduced to its origin only (or "" when absent/unparseable). Same-site referrers
 * would otherwise carry the previous page's query string, or an arbitrary mistyped 404 path.
 */
export function sanitizeReferrer(referrer: unknown): string {
  if (typeof referrer !== "string" || !referrer) return "";
  try {
    const { protocol, origin } = new URL(referrer);
    return protocol === "http:" || protocol === "https:" ? origin : "";
  } catch {
    return "";
  }
}

/** Pure: build the only payload a page_view may carry. */
export function buildPageView(page: PageInfo, origin: string, referrer: string): SanitizedPageView {
  return {
    page_location: `${origin}${sanitizePath(page.path)}`,
    page_title: typeof page.title === "string" ? page.title.slice(0, 120) : "",
    page_referrer: sanitizeReferrer(referrer),
  };
}

export interface Ga4Deps {
  measurementId: unknown;
  page: PageInfo;
  win: AnalyticsWindow;
  doc: AnalyticsDocument;
}

/**
 * Initialize GA4 once for this document and send its single page_view.
 * Returns true when it initialized, false when dormant, already initialized, or on any error.
 */
export function startGa4({ measurementId, page, win, doc }: Ga4Deps): boolean {
  try {
    const id = parseMeasurementId(measurementId);
    if (!id || win[INIT_FLAG]) return false;
    win[INIT_FLAG] = true;

    const view = buildPageView(page, win.location.origin, doc.referrer);

    win.dataLayer = win.dataLayer ?? [];
    const dataLayer = win.dataLayer;
    // The standard gtag shim: it must push the `arguments` object itself.
    win.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      dataLayer.push(arguments);
    };
    const gtag = win.gtag;

    gtag("js", new Date());
    // Ad storage / ad signals are never needed — deny them outright.
    gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    gtag("config", id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      // Override gtag's own document.location / document.title / document.referrer defaults.
      ...view,
    });
    gtag("event", "page_view", view);

    const script = doc.createElement("script");
    script.async = true;
    script.src = `${GTAG_SRC}?id=${encodeURIComponent(id)}`;
    // Blocked or failed: stay silent. No retry, no polling; queued calls are simply never sent.
    script.onerror = () => {};
    doc.head.appendChild(script);
    return true;
  } catch {
    // Analytics must never affect the page.
    return false;
  }
}
