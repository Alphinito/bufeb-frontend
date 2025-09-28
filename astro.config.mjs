// @ts-check
import { defineConfig } from 'astro/config';
import path from 'path';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    }
  }
});