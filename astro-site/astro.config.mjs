// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vre23.github.io',
  base: '/apolloiq-website-preview',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
});
