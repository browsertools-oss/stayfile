import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/site.ts';
export default defineConfig({
  site: SITE.url,
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    // jSquash ships its own .wasm files; let Vite copy them instead of pre-bundling.
    optimizeDeps: { exclude: ['@jsquash/avif', '@jsquash/webp'] },
    worker: { format: 'es' },
  },
});
