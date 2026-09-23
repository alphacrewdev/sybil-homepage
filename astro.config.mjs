// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO(karen): confirm final production domain before launch
  site: 'https://sybildigitallearning.com',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), sitemap()]
});