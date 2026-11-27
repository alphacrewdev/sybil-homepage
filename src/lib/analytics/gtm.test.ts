// Run with `npm test` (Node's built-in test runner; Node >= 22.18 strips the TypeScript types).
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseContainerId, resolveAnalytics, startGtm, type GtmDocument, type GtmWindow } from "./gtm.ts";

function fakePage() {
  const scripts: { async: boolean; src: string; onerror: (() => void) | null }[] = [];
  const win: GtmWindow = {};
  const doc: GtmDocument = {
    createElement: () => ({ async: false, src: "", onerror: null }) as unknown as HTMLScriptElement,
    head: { appendChild: (s) => scripts.push(s as unknown as (typeof scripts)[number]) },
  };
  const entries = () => (win.dataLayer ?? []).map((a) => (typeof a === "object" && a && "length" in a ? Array.from(a as ArrayLike<unknown>) : a));
  return { win, doc, scripts, entries };
}

test("parseContainerId accepts only GTM container ids", () => {
  assert.equal(parseContainerId(" gtm-n5b8b2zc "), "GTM-N5B8B2ZC");
  assert.equal(parseContainerId("GTM-ABCD"), "GTM-ABCD");
  for (const bad of [undefined, null, "", "  ", "G-ABC12345", "UA-1-1", "GTM-", "GTM-ABC", "GTM-AB CD", "GTM-<script>", "GTM-ABCDEFGHIJKLM", 42]) {
    assert.equal(parseContainerId(bad), null, String(bad));
  }
});

test("only one analytics path: GTM wins over direct GA4 when both are set", () => {
  assert.deepEqual(resolveAnalytics({ gtmId: "GTM-N5B8B2ZC", gaId: "G-J8BGPNBPW3", preview: false }), { provider: "gtm", id: "GTM-N5B8B2ZC" });
  assert.deepEqual(resolveAnalytics({ gtmId: "GTM-N5B8B2ZC", gaId: undefined, preview: false }), { provider: "gtm", id: "GTM-N5B8B2ZC" });
});

test("only the GA4 id set: the existing direct GA4 path is kept", () => {
  assert.deepEqual(resolveAnalytics({ gtmId: undefined, gaId: "G-J8BGPNBPW3", preview: false }), { provider: "ga4", id: "G-J8BGPNBPW3" });
  // An invalid GTM id counts as unset, so it cannot switch GA4 off by accident.
  assert.deepEqual(resolveAnalytics({ gtmId: "not-a-container", gaId: "G-J8BGPNBPW3", preview: false }), { provider: "ga4", id: "G-J8BGPNBPW3" });
});

test("nothing configured, invalid ids, or a preview build: no analytics at all", () => {
  assert.equal(resolveAnalytics({ gtmId: undefined, gaId: undefined, preview: false }), null);
  assert.equal(resolveAnalytics({ gtmId: "GTM-", gaId: "UA-1-1", preview: false }), null);
  assert.equal(resolveAnalytics({ gtmId: "GTM-N5B8B2ZC", gaId: "G-J8BGPNBPW3", preview: true }), null);
});

test("startGtm loads gtm.js once, async, with consent defaults set before the container", () => {
  const p = fakePage();
  assert.equal(startGtm({ containerId: "GTM-N5B8B2ZC", win: p.win, doc: p.doc, now: () => 123 }), true);
  assert.equal(startGtm({ containerId: "GTM-N5B8B2ZC", win: p.win, doc: p.doc }), false, "no second load");
  assert.equal(p.scripts.length, 1);
  assert.equal(p.scripts[0].async, true);
  assert.equal(p.scripts[0].src, "https://www.googletagmanager.com/gtm.js?id=GTM-N5B8B2ZC");
  assert.deepEqual(p.entries(), [
    ["consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" }],
    { "gtm.start": 123, event: "gtm.js" },
  ]);
});

test("option B (ads) grants all four consent types", () => {
  const p = fakePage();
  startGtm({ containerId: "GTM-N5B8B2ZC", win: p.win, doc: p.doc, policy: { revision: 1, ads: true } });
  assert.deepEqual(p.entries()[0], [
    "consent",
    "default",
    { analytics_storage: "granted", ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" },
  ]);
});

test("invalid container id: no script, no dataLayer", () => {
  const p = fakePage();
  assert.equal(startGtm({ containerId: "G-J8BGPNBPW3", win: p.win, doc: p.doc }), false);
  assert.equal(p.scripts.length, 0);
  assert.equal(p.win.dataLayer, undefined);
});

test("a blocked gtm.js or a throwing document never propagates into the page", () => {
  const p = fakePage();
  startGtm({ containerId: "GTM-N5B8B2ZC", win: p.win, doc: p.doc });
  assert.doesNotThrow(() => p.scripts[0].onerror!());
  assert.equal(p.scripts.length, 1, "nothing retries");
  const q = fakePage();
  const doc = { ...q.doc, createElement: () => { throw new Error("CSP / blocked"); } } as GtmDocument;
  assert.doesNotThrow(() => startGtm({ containerId: "GTM-N5B8B2ZC", win: q.win, doc }));
});
