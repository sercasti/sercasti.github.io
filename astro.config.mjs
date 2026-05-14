import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://sercasti.github.io',
  integrations: [react()],
  output: 'static',
});
