// Run with `npm test` (Node's built-in test runner; Node >= 22.18 strips the TypeScript types).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  analyticsCookieNames,
  bannerCopy,
  clearAnalyticsCookies,
  consentVersion,
  cookieDomainsFor,
  parseStoredConsent,
  serializeConsent,
} from "./consent.ts";
import { createConsentController } from "./controller.ts";
import type { AnalyticsDocument, AnalyticsWindow } from "./ga4.ts";

test("stored consent round-trips and is versioned", () => {
  const raw = serializeConsent("accepted", 1000, "1a");
  assert.equal(parseStoredConsent(raw, "1a"), "accepted");
  assert.equal(parseStoredConsent(serializeConsent("declined", 1, "1a"), "1a"), "declined");
  // A policy change (new wording, or switching to ads) makes old choices stale: the card asks again.
  assert.equal(parseStoredConsent(raw, "1b"), null);
  assert.equal(parseStoredConsent(raw, "2a"), null);
  for (const bad of [null, undefined, "", "{", "null", '{"v":"1a","choice":"yes"}', "x".repeat(600), 7]) {
    assert.equal(parseStoredConsent(bad, "1a"), null, String(bad));
  }
  assert.equal(consentVersion({ revision: 1, ads: false }), "1a");
  assert.equal(consentVersion({ revision: 1, ads: true }), "1b");
});

test("banner copy matches what each path collects", () => {
  const a = bannerCopy("gtm", { revision: 1, ads: false });
  assert.equal(a.title, "Analytics cookies");
  assert.match(a.body, /email, phone number or address/);
  assert.doesNotMatch(a.body, /advertising/);
  const b = bannerCopy("gtm", { revision: 1, ads: true });
  assert.equal(b.title, "Analytics and ad cookies");
  assert.match(b.body, /advertising/);
  const ga = bannerCopy("ga4");
  assert.doesNotMatch(ga.body, /email/);
  for (const c of [a, b, ga]) assert.match(c.body, /Nothing is collected unless you accept\.$/);
});

test("cookie clean-up removes only Google Analytics cookies", () => {
  assert.deepEqual(analyticsCookieNames("_ga=1; _ga_J8BGPNBPW3=2; sybil-theme=dark; _gid=3; _gat_UA-1=4; other=5"), [
    "_ga",
    "_ga_J8BGPNBPW3",
    "_gid",
    "_gat_UA-1",
  ]);
  assert.deepEqual(cookieDomainsFor("www.sybildigitallearning.com"), ["www.sybildigitallearning.com", "sybildigitallearning.com"]);
  assert.deepEqual(cookieDomainsFor("localhost"), ["localhost"]);
  const writes: string[] = [];
  clearAnalyticsCookies({ get cookie() { return "_ga=1; keep=2"; }, set cookie(v: string) { writes.push(v); } }, "localhost");
  assert.ok(writes.length > 0 && writes.every((w) => w.startsWith("_ga=; Max-Age=0")));
});

// ── The page flow: nothing loads before Accept ──────────────────────────────────────────────────────

function fakeSite(stored: string | null = null) {
  const scripts: { src: string }[] = [];
  const store = new Map<string, string>();
  if (stored !== null) store.set("sybil.siteAnalyticsConsent", stored);
  const win = { location: { origin: "https://sybildigitallearning.com" } } as AnalyticsWindow;
  const doc = {
    referrer: "",
    cookie: "",
    createElement: () => ({ async: false, src: "", onerror: null }) as unknown as HTMLScriptElement,
    head: { appendChild: (s: HTMLScriptElement) => scripts.push(s) },
  } as unknown as AnalyticsDocument & { cookie: string };
  let visible = false;
  const banner = { show: () => { visible = true; }, hide: () => { visible = false; } };
  const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) };
  return { win, doc, scripts, store, storage, banner, visible: () => visible };
}

const page = { path: "/", title: "Home | Sybil Digital Learning" };
const policy = { revision: 1, ads: false };
const gtm = { provider: "gtm", id: "GTM-N5B8B2ZC" } as const;
const ga4 = { provider: "ga4", id: "G-J8BGPNBPW3" } as const;

function start(s: ReturnType<typeof fakeSite>, setup: typeof gtm | typeof ga4 = gtm) {
  return createConsentController({ setup, page, win: s.win, doc: s.doc, storage: s.storage, banner: s.banner, hostname: "localhost", policy, now: () => 5 });
}

test("first visit: the card shows and no Google script, dataLayer or gtag exists", () => {
  for (const setup of [gtm, ga4]) {
    const s = fakeSite();
    start(s, setup);
    assert.equal(s.visible(), true);
    assert.equal(s.scripts.length, 0);
    assert.equal(s.win.dataLayer, undefined);
    assert.equal(s.win.gtag, undefined);
  }
});

test("Accept loads exactly one script: gtm.js for GTM, gtag.js for GA4 — never both", () => {
  const s = fakeSite();
  const c = start(s, gtm);
  c.accept();
  c.accept();
  assert.equal(s.visible(), false);
  assert.deepEqual(s.scripts.map((x) => x.src), ["https://www.googletagmanager.com/gtm.js?id=GTM-N5B8B2ZC"]);
  assert.equal(parseStoredConsent(s.store.get("sybil.siteAnalyticsConsent"), "1a"), "accepted");

  const g = fakeSite();
  start(g, ga4).accept();
  assert.deepEqual(g.scripts.map((x) => x.src), ["https://www.googletagmanager.com/gtag/js?id=G-J8BGPNBPW3"]);
});

test("Decline loads nothing, now or on later pages", () => {
  const s = fakeSite();
  start(s).decline();
  assert.equal(s.scripts.length, 0);
  assert.equal(s.visible(), false);
  const next = fakeSite(s.store.get("sybil.siteAnalyticsConsent")!);
  start(next);
  assert.equal(next.scripts.length, 0);
  assert.equal(next.visible(), false);
});

test("a returning visitor who accepted loads without the card; a stale choice asks again", () => {
  const s = fakeSite(serializeConsent("accepted", 1, "1a"));
  start(s);
  assert.equal(s.visible(), false);
  assert.equal(s.scripts.length, 1);
  const stale = fakeSite(serializeConsent("accepted", 1, "0a"));
  start(stale);
  assert.equal(stale.visible(), true);
  assert.equal(stale.scripts.length, 0);
});

test("withdrawing in Cookie settings denies consent on this page and stops later pages", () => {
  const s = fakeSite(serializeConsent("accepted", 1, "1a"));
  const c = start(s);
  c.reopen();
  assert.equal(s.visible(), true);
  c.decline();
  const last = Array.from(s.win.dataLayer!.at(-1) as ArrayLike<unknown>);
  assert.deepEqual(last, ["consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" }]);
  const next = fakeSite(s.store.get("sybil.siteAnalyticsConsent")!);
  start(next);
  assert.equal(next.scripts.length, 0);
});

test("blocked storage: nothing loads until Accept, and Accept still works for this page", () => {
  const s = fakeSite();
  const throwing = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };
  const c = createConsentController({ setup: gtm, page, win: s.win, doc: s.doc, storage: throwing, banner: s.banner, hostname: "localhost", policy });
  assert.equal(s.scripts.length, 0);
  assert.equal(s.visible(), true);
  c.accept();
  assert.equal(s.scripts.length, 1);
});
