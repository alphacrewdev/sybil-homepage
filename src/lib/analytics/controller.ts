/**
 * The page-side consent flow, kept free of DOM specifics so it can be unit-tested with `node --test`.
 *
 *   no choice yet → show the banner; load nothing
 *   accepted      → load the one configured analytics path (GTM or direct GA4); no banner
 *   declined      → load nothing; no banner
 *   Accept        → remember, hide the banner, load
 *   Decline       → remember, hide the banner; if Google already loaded on this page, switch Consent Mode to
 *                   denied and remove the GA cookies (a loaded script cannot be unloaded; the next page loads none)
 *   Cookie settings (reopen) → show the banner again
 */
import {
  DENIED_CONSENT_STATE,
  clearAnalyticsCookies,
  consentVersion,
  readConsent,
  writeConsent,
  CONSENT_POLICY,
  type ConsentPolicy,
  type ConsentStorage,
} from "./consent.ts";
import { startGa4, type AnalyticsDocument, type AnalyticsWindow, type PageInfo } from "./ga4.ts";
import { startGtm, type AnalyticsSetup } from "./gtm.ts";

export interface BannerView {
  show(): void;
  hide(): void;
}

export interface ConsentControllerDeps {
  setup: NonNullable<AnalyticsSetup>;
  page: PageInfo;
  win: AnalyticsWindow;
  doc: AnalyticsDocument & { cookie: string };
  storage: ConsentStorage | null;
  banner: BannerView;
  hostname: string;
  policy?: ConsentPolicy;
  now?: () => number;
}

export interface ConsentController {
  accept(): void;
  decline(): void;
  reopen(): void;
  /** Whether a Google script was requested on this page. */
  loaded(): boolean;
}

export function createConsentController(deps: ConsentControllerDeps): ConsentController {
  const { setup, page, win, doc, storage, banner, hostname, policy = CONSENT_POLICY, now = Date.now } = deps;
  const version = consentVersion(policy);
  let loaded = false;

  const load = () => {
    if (loaded) return;
    loaded =
      setup.provider === "gtm"
        ? startGtm({ containerId: setup.id, win, doc, policy, now })
        : startGa4({ measurementId: setup.id, page, win, doc });
  };

  const choice = readConsent(storage, version);
  if (choice === "accepted") load();
  else if (choice === null) banner.show();

  return {
    accept() {
      writeConsent(storage, "accepted", now(), version);
      banner.hide();
      load();
    },
    decline() {
      writeConsent(storage, "declined", now(), version);
      banner.hide();
      if (loaded) {
        try {
          win.gtag?.("consent", "update", { ...DENIED_CONSENT_STATE });
        } catch {
          // Analytics must never affect the page.
        }
      }
      clearAnalyticsCookies(doc, hostname);
    },
    reopen() {
      banner.show();
    },
    loaded: () => loaded,
  };
}
