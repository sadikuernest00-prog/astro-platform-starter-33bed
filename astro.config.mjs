import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',          // ensures a purely static build
  integrations: [react()]
});
