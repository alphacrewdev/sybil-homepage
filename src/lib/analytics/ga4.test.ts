// Run with `npm test` (Node's built-in test runner; Node >= 22.18 strips the TypeScript types).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildPageView,
  parseMeasurementId,
  sanitizePath,
  sanitizeReferrer,
  startGa4,
  type AnalyticsDocument,
  type AnalyticsWindow,
} from "./ga4.ts";

const ORIGIN = "https://sybildigitallearning.com";

function fakePage(referrer = "") {
  const scripts: { async: boolean; src: string; onerror: (() => void) | null }[] = [];
  const win: AnalyticsWindow = { location: { origin: ORIGIN } };
  const doc: AnalyticsDocument = {
    referrer,
    createElement: () => ({ async: false, src: "", onerror: null }) as unknown as HTMLScriptElement,
    head: { appendChild: (s) => scripts.push(s as unknown as (typeof scripts)[number]) },
  };
  /** Every gtag call made, as plain arrays. */
  const calls = () => (win.dataLayer ?? []).map((a) => Array.from(a as ArrayLike<unknown>));
  const pageViews = () => calls().filter((c) => c[0] === "event" && c[1] === "page_view");
  return { win, doc, scripts, calls, pageViews };
}

const page = { path: "/courses/ct-physics/", title: "CT Physics | Sybil Digital Learning" };

test("parseMeasurementId accepts only GA4 ids", () => {
  assert.equal(parseMeasurementId(" g-abc12345 "), "G-ABC12345");
  for (const bad of [undefined, null, "", "  ", "UA-12345-1", "GTM-ABCDE", "G-", "G-ab c", "G-<script>", 42]) {
    assert.equal(parseMeasurementId(bad), null, String(bad));
  }
});

test("absent or invalid measurement id: no script, no dataLayer, no gtag", () => {
  for (const id of [undefined, "", "UA-1-1", "not-an-id"]) {
    const p = fakePage();
    assert.equal(startGa4({ measurementId: id, page, win: p.win, doc: p.doc }), false);
    assert.equal(p.scripts.length, 0);
    assert.equal(p.win.dataLayer, undefined);
    assert.equal(p.win.gtag, undefined);
  }
});

test("configured id: loads gtag.js once, async, and sends exactly one page_view", () => {
  const p = fakePage();
  assert.equal(startGa4({ measurementId: "G-TEST12345", page, win: p.win, doc: p.doc }), true);
  // A second include / re-run in the same document must not re-initialize or duplicate.
  assert.equal(startGa4({ measurementId: "G-TEST12345", page, win: p.win, doc: p.doc }), false);
  assert.equal(startGa4({ measurementId: "G-OTHER9999", page, win: p.win, doc: p.doc }), false);

  assert.equal(p.scripts.length, 1);
  assert.equal(p.scripts[0].async, true);
  assert.equal(p.scripts[0].src, "https://www.googletagmanager.com/gtag/js?id=G-TEST12345");
  assert.equal(p.pageViews().length, 1);
  assert.equal(p.calls().filter((c) => c[0] === "config").length, 1);
});

test("config disables automatic page views, signals and ad personalization; ad consent denied", () => {
  const p = fakePage();
  startGa4({ measurementId: "G-TEST12345", page, win: p.win, doc: p.doc });
  const config = p.calls().find((c) => c[0] === "config")!;
  assert.equal(config[1], "G-TEST12345");
  assert.deepEqual(config[2], {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: `${ORIGIN}/courses/ct-physics/`,
    page_title: "CT Physics | Sybil Digital Learning",
    page_referrer: "",
  });
  const consent = p.calls().find((c) => c[0] === "consent")!;
  assert.deepEqual(consent, ["consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" }]);
});

test("each page load (MPA navigation) sends one page_view for its own route", () => {
  const visits = [
    { path: "/", title: "Home | Sybil Digital Learning" },
    { path: "/courses/", title: "Courses | Sybil Digital Learning" },
    { path: "/contact/", title: "Contact | Sybil Digital Learning" },
  ];
  const sent = visits.map((v, i) => {
    const p = fakePage(i === 0 ? "https://www.google.com/search?q=radiology+physics" : `${ORIGIN}${visits[i - 1].path}?x=1#y`);
    startGa4({ measurementId: "G-TEST12345", page: v, win: p.win, doc: p.doc });
    assert.equal(p.pageViews().length, 1);
    return p.pageViews()[0][2];
  });
  assert.deepEqual(sent, [
    { page_location: `${ORIGIN}/`, page_title: "Home | Sybil Digital Learning", page_referrer: "https://www.google.com" },
    { page_location: `${ORIGIN}/courses/`, page_title: "Courses | Sybil Digital Learning", page_referrer: ORIGIN },
    { page_location: `${ORIGIN}/contact/`, page_title: "Contact | Sybil Digital Learning", page_referrer: ORIGIN },
  ]);
});

test("query strings, hashes and referrer paths are never transmitted", () => {
  const p = fakePage(`${ORIGIN}/contact/?intent=individual&course=ct-physics&email=a%40b.com#contact-form`);
  startGa4({
    measurementId: "G-TEST12345",
    page: { path: "/contact/?intent=program&name=Jane#contact-form", title: "Contact | Sybil Digital Learning" },
    win: p.win,
    doc: p.doc,
  });
  const everything = JSON.stringify(p.calls());
  for (const leak of ["?", "#", "intent", "course=", "email", "Jane", "a%40b", "contact-form"]) {
    assert.ok(!everything.includes(leak), `leaked ${leak}: ${everything}`);
  }
  assert.ok(!everything.includes("user_id"));
});

test("sanitizers", () => {
  assert.equal(sanitizePath("/about/?a=1#b"), "/about/");
  assert.equal(sanitizePath("//evil.example/x"), "/");
  assert.equal(sanitizePath("https://x.example/a"), "/");
  assert.equal(sanitizePath(undefined), "/");
  assert.equal(sanitizeReferrer("https://www.bing.com/search?q=secret"), "https://www.bing.com");
  assert.equal(sanitizeReferrer("javascript:alert(1)"), "");
  assert.equal(sanitizeReferrer("not a url"), "");
  assert.equal(sanitizeReferrer(""), "");
  assert.equal(buildPageView({ path: "/x/?q=1", title: "T" }, ORIGIN, "").page_location, `${ORIGIN}/x/`);
});

test("blocked gtag.js: the onerror path is silent and nothing retries", () => {
  const p = fakePage();
  startGa4({ measurementId: "G-TEST12345", page, win: p.win, doc: p.doc });
  const before = p.calls().length;
  assert.doesNotThrow(() => p.scripts[0].onerror!());
  assert.equal(p.scripts.length, 1, "no second script injected");
  assert.equal(p.calls().length, before, "no further calls queued");
});

test("a throwing document never propagates into the page", () => {
  const p = fakePage();
  const doc = { ...p.doc, createElement: () => { throw new Error("CSP / blocked"); } } as AnalyticsDocument;
  assert.doesNotThrow(() => startGa4({ measurementId: "G-TEST12345", page, win: p.win, doc }));
});
