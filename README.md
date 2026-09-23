# Sybil Digital Learning — Public Website

Marketing site (homepage + secondary pages) for Sybil Digital Learning,
built by AlphaCrew Studio. This is **separate from the authenticated
platform** (React/Firebase, built elsewhere) — this repo is public,
mostly-static, and links out to the app for login.

## Stack

- [Astro](https://astro.build) (static output) — fast, SEO-forward, ships
  React only where actually interactive
- Tailwind CSS v4 (CSS-first config, see `src/styles/global.css`)
- React (`@astrojs/react`) — used only for the course catalog filter island
- `@astrojs/sitemap`

See `docs/Homepage-Build-Prompt.md` for the full design rationale (why
Astro, the visual system, page structure) and `docs/Sybil-Homepage-Questionnaire.html`
for the open content questions this build is waiting on from the client.

## Structure

```
src/
  layouts/BaseLayout.astro     nav + footer shell, meta/SEO, theme init
  components/                  Nav, Hero, TrustBar, Differentiators,
                                ModalityPath, CourseCatalog (React island),
                                AudienceSplit, InstructorBio, Footer,
                                BracketFrame (signature visual device),
                                PagePlaceholder (stub-page template)
  content/homepage.ts          all copy/data — single source, TODO(karen)
                                marks everything still pending real content
  pages/                       index, about, courses, program-directors,
                                contact
```

## Content status

Real content (hero copy, bios, testimonials, branding, imagery) is pending
from the client — see the questionnaire in `docs/`. Everything is wired
through `src/content/homepage.ts` so swapping in real copy/assets doesn't
require touching components. Grep the codebase for `TODO(karen)` to find
every pending item.

## Commands

| Command           | Action                                      |
| :----------------- | :------------------------------------------ |
| `npm install`       | Install dependencies                         |
| `npm run dev`       | Dev server at `localhost:4321`               |
| `npm run build`     | Production build to `./dist/`                |
| `npm run preview`   | Preview the production build locally         |

## Deploy

Recommended: Firebase Hosting, same project as the authenticated app
(multi-site config) — avoids the current Namecheap/Firebase DNS split.
Not yet configured in this repo.
