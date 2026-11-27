/**
 * Google Tag Manager loader for the public website, and the "exactly one analytics path" rule.
 *
 * Activation: dormant unless `PUBLIC_GTM_CONTAINER_ID` holds a valid container id (`GTM-XXXXXXX`) at build time.
 * Never on preview builds. Even when configured, gtm.js is requested ONLY after the visitor accepts analytics
 * cookies (consent.ts); there is deliberately no `<noscript>` iframe, since a visitor without JavaScript can never
 * see the banner or accept.
 *
 * Exactly one path loads: when a GTM id is set, the direct GA4 path (ga4.ts) does not, because the container
 * already carries the GA4 tag. Loading both would count every visit twice.
 *
 * What the container sends is configured in Tag Manager / GA4, not here: docs/GTM-ACTIVATION-CHECKLIST.md.
 *
 * This file has no Astro/Vite dependencies so it can be unit-tested with `node --test`.
 */
import { grantedConsentState, CONSENT_POLICY, type ConsentPolicy } from "./consent.ts";
import { parseMeasurementId } from "./ga4.ts";

const CONTAINER_ID_PATTERN = /^GTM-[A-Z0-9]{4,12}$/;
const GTM_SRC = "https://www.googletagmanager.com/gtm.js";
const INIT_FLAG = "__sybilGtmInitialized";

/** A trimmed, valid GTM container id, or null. */
export function parseContainerId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim().toUpperCase();
  return CONTAINER_ID_PATTERN.test(id) ? id : null;
}

export type AnalyticsSetup = { provider: "gtm"; id: string } | { provider: "ga4"; id: string } | null;

/**
 * PURE: which single analytics path this build uses. GTM wins over direct GA4; preview builds get none;
 * invalid ids count as unset.
 */
export function resolveAnalytics({ gtmId, gaId, preview }: { gtmId: unknown; gaId: unknown; preview: boolean }): AnalyticsSetup {
  if (preview) return null;
  const gtm = parseContainerId(gtmId);
  if (gtm) return { provider: "gtm", id: gtm };
  const ga = parseMeasurementId(gaId);
  return ga ? { provider: "ga4", id: ga } : null;
}

type GtagFn = (...args: unknown[]) => void;

export interface GtmWindow {
  dataLayer?: unknown[];
  gtag?: GtagFn;
  [INIT_FLAG]?: boolean;
}

export interface GtmDocument {
  createElement(tag: "script"): HTMLScriptElement;
  head: { appendChild(node: HTMLScriptElement): unknown };
}

export interface GtmDeps {
  containerId: unknown;
  win: GtmWindow;
  doc: GtmDocument;
  policy?: ConsentPolicy;
  now?: () => number;
}

/**
 * Load the container once for this document. Call ONLY after the visitor accepted.
 * Sets the Consent Mode defaults (what Accept grants under the policy) before gtm.js runs.
 * Returns true when it initialized, false when the id is invalid, already initialized, or on any error.
 */
export function startGtm({ containerId, win, doc, policy = CONSENT_POLICY, now = Date.now }: GtmDeps): boolean {
  try {
    const id = parseContainerId(containerId);
    if (!id || win[INIT_FLAG]) return false;
    win[INIT_FLAG] = true;

    win.dataLayer = win.dataLayer ?? [];
    const dataLayer = win.dataLayer;
    win.gtag =
      win.gtag ??
      function gtag() {
        // The standard gtag shim: it must push the `arguments` object itself.
        // eslint-disable-next-line prefer-rest-params
        dataLayer.push(arguments);
      };
    win.gtag("consent", "default", grantedConsentState(policy));
    dataLayer.push({ "gtm.start": now(), event: "gtm.js" });

    const script = doc.createElement("script");
    script.async = true;
    script.src = `${GTM_SRC}?id=${encodeURIComponent(id)}`;
    // Blocked or failed: stay silent. No retry, no polling.
    script.onerror = () => {};
    doc.head.appendChild(script);
    return true;
  } catch {
    // Analytics must never affect the page.
    return false;
  }
}
