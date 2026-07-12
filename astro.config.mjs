import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://d123hq.github.io',
  integrations: [tailwind()],
  output: 'static',
});
