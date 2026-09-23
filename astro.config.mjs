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
export default defineConfig({
  // TODO(karen): confirm final production domain before launch
  site: isGithubPagesBuild ? 'https://alphacrewdev.github.io' : 'https://sybildigitallearning.com',
  base: isGithubPagesBuild ? '/sybil-homepage' : '/',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), sitemap()]
});