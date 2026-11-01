// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// GitHub Actions sets GITHUB_ACTIONS=true — used here to detect the GitHub
// Pages preview build vs. the eventual sybildigitallearning.com production
// build, so both can share this one config file.
const isGithubPagesBuild = process.env.GITHUB_ACTIONS === 'true';

// https://astro.build/config
// Addresses from the previous site keep working: Astro writes a static redirect
// page for each (GitHub Pages cannot run server redirect rules; on the
// production host, add real 301s for the same pairs).
const basePath = isGithubPagesBuild ? '/sybil-homepage' : '';
const legacyRedirects = {
    '/radiography-physics': basePath + '/courses/radiography-physics/',
    '/ultrasound-physics': basePath + '/courses/ultrasound-physics/',
    '/nuclear-medicine': basePath + '/courses/nuclear-medicine/',
    '/mri-basic-physics': basePath + '/courses/mri-basic-physics/',
    '/ct-physics': basePath + '/courses/ct-physics/',
    '/fluoroscopy-physics': basePath + '/courses/fluoroscopy-physics/',
    '/mammography-physics': basePath + '/courses/mammography-physics/',
    '/radiation-biology-safety-dose': basePath + '/courses/radiation-biology-safety-dose/',
    '/contact-us': basePath + '/contact/',
};

export default defineConfig({
  redirects: legacyRedirects,
  // TODO(karen): confirm final production domain before launch
  site: isGithubPagesBuild ? 'https://alphacrewdev.github.io' : 'https://sybildigitallearning.com',
  base: isGithubPagesBuild ? '/sybil-homepage' : '/',
  vite: {
    plugins: [tailwindcss()]
  },

  // Review, account-entry and confirmation pages stay out of the sitemap (and are noindex).
  integrations: [react(), sitemap({
      filter: (page) =>
        !['/preview/', '/my-courses/', '/contact/thank-you/', '/404'].some((p) => page.includes(p)),
    })]
});