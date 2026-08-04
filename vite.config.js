import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// Crawlers do not run JS and will not resolve a relative og:image, so the link
// preview tags need an absolute origin baked in at build time. Override it per
// deploy: SITE_URL=https://example.com npm run build
const SITE_URL = (process.env.SITE_URL || 'https://future.hackclub.com').replace(/\/+$/, '')

const siteUrl = () => ({
  name: 'future-site-url',
  transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL)
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), siteUrl()],
  server: {
    port: 5173,
    host: true
  }
})
