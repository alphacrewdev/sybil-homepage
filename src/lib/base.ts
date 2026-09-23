// GitHub Pages project sites are served from a /<repo-name> subpath, so every
// internal link needs that prefix. Astro's `base` config only auto-prefixes
// its own asset URLs, not hardcoded hrefs — this helper does the rest.
// Local dev and the eventual sybildigitallearning.com deploy use base "/",
// so withBase() is a no-op there.
export const base = import.meta.env.BASE_URL;

export function withBase(path: string): string {
  if (/^[a-z]+:/i.test(path) || path.startsWith("#")) return path;
  const trimmedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${trimmedBase}${path.startsWith("/") ? path : `/${path}`}`;
}
