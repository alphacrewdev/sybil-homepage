# Sybil Digital Learning — Homepage Build Prompt

Internal spec for AlphaCrew (Ricky/Ivan) or to paste directly into an AI coding
tool (Claude Code, Cursor, v0, bolt.new) to scaffold the site. Pulled from
`Sybil-Developer-Report.html` (feature spec) and the Sept 16 client meeting.

---

## Why Astro (confirmed)

- Public homepage and the authenticated platform are already architecturally
  separate (dev report: homepage on Namecheap today, app on Firebase, redirect
  on login). Astro fits that split cleanly — it doesn't need to be the same
  stack as the React app.
- Ships zero JS by default. Only the pieces that need interactivity (course
  carousel, animated stat counters, mobile nav) become React islands. Everything
  else is static HTML — fast by default, which matters for SEO and for
  residents checking the site on hospital wifi/mobile.
- Deploy target: Firebase Hosting (multi-site config), same project as the
  authenticated app. Removes the Namecheap/Firebase split called out in the
  dev report's DNS cutover section — one provider, `sybildigitallearning.com`
  static Astro build + `app.sybildigitallearning.com` (or similar) React SPA.

---

## Who this is for (context for the builder)

Sybil Digital Learning teaches radiology residents/residency programs via
professionally **animated** medical videos — not recorded PowerPoint, not
generic AI-generated content. The instructor (Karen Brown, practicing
radiologist) writes and reviews every video's content herself. This is the
core differentiator and should be felt in the design, not just stated in copy:
the site should look like it belongs to the same product that makes those
videos, not a generic course-platform template.

Two buyer types:
- **Institutional** — hospital/residency programs buy access for their
  residents (tiered per-resident pricing, flat above 12).
- **Self-pay** — individual residents buy course access directly (higher
  per-course price, no live/Q&A access with Karen).

Platform features worth reflecting visually/structurally on the homepage
(even before every feature ships): DICOM medical image viewer, interactive
whiteboard, live classes with attendance tracking, flashcards/spaced
repetition, searchable captioned video, dark mode (residents study in dark
hospital rooms — this is a real, stated UX priority, not decoration),
progress tracking dashboards, multi-institution support.

Partnerships to surface: **RadAID** (nonprofit — Sybil provides education to
their international radiology programs) and **WinSPIRE** (Sybil supports,
does not deliver education for).

---

## Tech stack

- **Astro** (latest stable) with `output: 'static'`
- **Tailwind CSS** for styling — define design tokens as CSS variables so
  light/dark mode is a data-attribute swap, not duplicated styles
- **React** via `@astrojs/react`, used only for islands: course
  catalog preview/filter, animated stat counters, mobile nav drawer
- `@astrojs/sitemap` + `astro-seo` (or hand-rolled meta component) for SEO
- View Transitions API (Astro's built-in `<ClientRouter />`) for snappy
  page-to-page nav without a full SPA
- Icons: `lucide-react` or `astro-icon` — no icon-font bloat
- Motion: CSS scroll-driven animations / Intersection Observer for reveals;
  reach for a JS animation lib (Framer Motion, GSAP) only inside islands that
  already need React, don't add one just for scroll-fade-ins

---

## Design direction — "high-tech, not cold"

The trap to avoid: making a medical-education site feel either (a) like a
generic SaaS startup landing page with gradient blobs, or (b) sterile and
clinical like a hospital intranet. Aim for **precision-instrument aesthetic**
— the visual equivalent of the product itself: technical, confident, built by
people who understand the content, not decorated by people who don't.

Concrete direction:
- **Palette**: deep navy/charcoal base + a single clinical teal accent +
  one warm accent (amber/coral) used sparingly for CTAs only. This is a
  placeholder until Karen's final brand colors land (dev report: logo/colors
  still in progress) — build with CSS variables so swapping the palette later
  is a one-file change, not a rebuild.
- **Motifs that tie back to the actual product**: subtle scan-line or
  cross-section textures (radiology nod, used sparingly, never gimmicky),
  thin-line anatomical/vector illustration style that echoes the animation
  style of the actual course videos, progress-bar/percentage motifs echoing
  the platform's own dashboard UI — this makes the marketing site and the
  product feel like one system.
- **Motion**: restrained. Scroll-triggered reveals, animated stat counters
  (once real numbers exist), smooth hover states on course cards. No
  particle effects, no parallax-for-its-own-sake. High-tech should read as
  "fast and precise," not "flashy."
- **Typography**: one strong geometric sans for headlines (confidence,
  modernity), a highly legible sans for body copy (residents are reading
  dense material — optimize for scan-ability, not personality).
- **Dark mode is not an afterthought** — it's a stated top platform
  requirement. Design in dark mode first or in parallel, not as a filter
  applied after the fact.

---

## Page structure (maps to dev report's "1.1 Public-Facing Website" spec)

1. **Nav** — Home · About/Instructor Bios · Course Catalog · Program
   Directors · Contact · Login · dark-mode toggle. Sticky, collapses to a
   drawer on mobile (React island).
2. **Hero** — one-line value prop + subline, primary CTA (TBD by Karen:
   browse courses vs. request institutional pricing), video/animation loop
   or strong static image if video isn't ready yet.
3. **Trust bar** — RadAID + WinSPIRE partnership logos, star-rating display
   (auto-shows only when average ≥ 4 — build this as a real conditional, not
   just always-visible), key stats once Karen provides them (years teaching,
   residents trained, programs served).
4. **Differentiator section** — "why Sybil" — animated, board-exam-specific,
   written and reviewed by a practicing radiologist. This is the section that
   should visually reference the actual course animation style.
5. **Course catalog preview** (React island) — card grid, filterable/
   scrollable. Launch with NukeMed live; other modalities shown as "coming
   soon" if Karen confirms she wants that (see questionnaire item D1). No
   prices here — links to the separate Course Catalog/Pricing page.
6. **Audience split CTA** — "For Residency Programs" vs. "For Individual
   Residents," each routing to the right next step (Program Directors page /
   Course Catalog).
7. **Instructor credibility section** — Karen's bio + photo (short form;
   full bio lives on About page), co-author credit if applicable.
8. **Footer** — contact email link (repeated per-page requirement — no live
   chat, ever), social links if any, legacy WordPress access link for the
   ~5-6 remaining old-platform students (low-visibility per Karen's
   preference), legal links.

---

## Performance / SEO / accessibility bar

- Lighthouse 90+ on Performance, Accessibility, Best Practices, SEO — both
  mobile and desktop
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- WCAG 2.1 AA (explicitly required elsewhere in the dev spec — hold the
  homepage to the same bar)
- `schema.org` structured data: `EducationalOrganization` + `Course` markup
  per course tile — helps organic search for board-review search terms
- GA4 (`gtag`) wired on every page and on every CTA click — dev report is
  explicit this is the only analytics tool, not Stripe Analytics
- OG/Twitter meta tags — useful for the April conference promo push too
- Mobile-first, verified on iOS Safari and Android Chrome specifically (dev
  report flags VdoCipher/Daily.co mobile quirks elsewhere — homepage should
  not be the weak link)

---

## Content status — build now, swap later

Real content is still pending from Karen (see `Sybil-Homepage-Questionnaire.html`
for the full list — hero copy, CTA priority, bios/photos, testimonials,
partnership description lines, final branding files, imagery, lead-magnet
asset). **Don't block the build on this.** Structure every section so
placeholder copy/assets can be swapped via a single content file
(`src/content/homepage.ts` or similar) without touching layout or components.
Mark every placeholder clearly:

```ts
// TODO(karen): replace with real hero copy — see questionnaire A1-A4
```

---

## The prompt (copy-paste into your AI coding tool)

```
Build a new Astro (latest) marketing homepage for a medical education
company called Sybil Digital Learning, which sells radiology board-review
video courses to residency programs and individual residents.

Stack: Astro with output: 'static', Tailwind CSS, @astrojs/react for
islands only (course catalog filter, mobile nav, animated stat counters),
@astrojs/sitemap, Astro's View Transitions router. No other JS framework.

Design brief: precision-instrument aesthetic, not generic SaaS. Deep
navy/charcoal base, one teal accent, one amber accent used only for primary
CTAs. Dark mode is a first-class requirement (CSS variables + data-theme
attribute, default to prefers-color-scheme, toggle persisted in
localStorage), not a filter added later. Subtle scan-line/cross-section
texture motifs allowed sparingly. Typography: geometric sans for headings,
highly legible sans for body. Motion: restrained scroll-reveal and hover
states only — no particles, no gimmicks. Fully responsive, mobile-first,
test at 375px, 768px, 1440px.

Build these sections in order, each its own component, content pulled from
a single typed content file (src/content/homepage.ts) so copy can be
swapped without touching components:

1. Sticky nav: Home, About/Instructor Bios, Course Catalog, Program
   Directors, Contact, Login button, dark-mode toggle. Mobile: hamburger
   → drawer (React island).
2. Hero: eyebrow label, H1 value prop, subline, primary CTA button,
   secondary CTA link, hero media slot (video OR image, swappable).
3. Trust bar: two partner logo slots (RadAID, WinSPIRE) with one-line
   descriptions, conditional star-rating badge that only renders if
   averageRating >= 4, optional stat counters (React island, animate on
   scroll into view, values from content file).
4. "Why Sybil" differentiator section: 3-column feature grid (animated
   video content / board-exam focus / built by a practicing radiologist),
   icon + heading + short body each.
5. Course catalog preview: React island, responsive card grid, each card
   = title, short description, "coming soon" badge state, status
   (available/coming-soon) driven from content file, no prices, links out
   to a separate /courses route.
6. Audience split: two-column CTA block — "For Residency Programs" →
   /program-directors, "For Individual Residents" → /courses.
7. Instructor bio strip: photo, name, short bio, credentials line.
8. Footer: contact email link (mailto, no chat widget anywhere in the
   site), legal links, small low-visibility "existing student? Access
   your previous course here" link, social icons (optional, render only
   if URLs provided).

Requirements:
- Every CTA fires a GA4 event via gtag on click.
- Add schema.org EducationalOrganization JSON-LD on the homepage and
  Course JSON-LD per course card.
- OG and Twitter card meta tags in the base layout, values from content
  file.
- WCAG 2.1 AA: semantic landmarks, alt text props required on all image
  slots, focus-visible states, color contrast checked in both themes.
- Lighthouse target 90+ on all four categories, mobile and desktop.
- Every piece of real copy/imagery that doesn't exist yet gets a clearly
  marked placeholder value in the content file with a
  // TODO(karen): ... comment explaining what's needed and why.

Do not build the authenticated app, login flow, or course player — those
already exist as a separate React/Firebase application. This build is the
public marketing site only, with a Login button linking out to that app's
URL (configurable, placeholder for now).
```
