// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Placeholder domain, see SAPMALAR.md
export default defineConfig({
  site: 'https://lear.example',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [sitemap()],
  // The scroll-driven animation rules are kept exactly as written: a CSS minifier folds animation-timeline into the
  // `animation` shorthand, which browsers then read as a second animation name and drop the whole rule.
  vite: { build: { cssMinify: false } },
});
