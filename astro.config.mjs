// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// GitHub Actions sets GITHUB_ACTIONS=true — used here to detect the GitHub
// Pages preview build vs. the eventual sybildigitallearning.com production
// build, so both can share this one config file.
const isGithubPagesBuild = process.env.GITHUB_ACTIONS === 'true';

const excludeFromSitemap = [
  '/preview/', '/contact/thank-you/', '/my-courses/', '/contact-us/', '/login/', '/my-account/',
];
// Old course URLs (the pages now live under /courses/).
const legacyCourse = /\/(radiography-physics|ultrasound-physics|nuclear-medicine|mri-basic-physics|ct-physics|fluoroscopy-physics|mammography-physics|radiation-biology-safety-dose)\/$/;
const inSitemap = (page) =>
  !excludeFromSitemap.some((p) => page.includes(p)) && !(legacyCourse.test(page) && !page.includes('/courses/'));

// https://astro.build/config
export default defineConfig({
  // TODO(karen): confirm final production domain before launch
  site: isGithubPagesBuild ? 'https://alphacrewdev.github.io' : 'https://sybildigitallearning.com',
  base: isGithubPagesBuild ? '/sybil-homepage' : '/',
  vite: {
    plugins: [tailwindcss()]
  },

  // Keep review builds, confirmations, account hand-offs and the static
  // redirect stand-ins for old WordPress addresses out of the sitemap.
  integrations: [react(), sitemap({ filter: inSitemap })]
});