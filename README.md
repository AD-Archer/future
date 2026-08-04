# FUTURE 🌐

A Hack Club **You Ship, We Ship** landing page: build the future of your childhood.
Any vision counts — the future of 1920, the future of 2010, or the one being imagined
right now. Build a real piece of it, ship it open-source, and spend your logged hours in
the shop. Frutiger Aero: live sky, smoked glass, glossy everything.

Static **Svelte 5 + Vite** site, run with **`just`**. Onboarding, the shop and all
program content live in **Stern** — this repo is the front page.

## Quick start

```bash
just          # list all recipes
just dev      # http://localhost:5173
just build    # static production build → dist/
just preview  # preview the production build
just clean    # nuke node_modules + build output
```

`just dev` / `just build` auto-install deps on first run. There is no server to run:
deploy `dist/` anywhere static.

## The backend is Stern

Everything that changes often is read at runtime from Stern's public content API
(no key, CORS open, edge-cached ~60s), so edits in Stern appear here within a minute:

| What | Endpoint |
|------|----------|
| Program, images, accent, hours shipped | `/api/public/programs/future` |
| The live shop | `/api/public/programs/future/prizes` |
| Rules, project types, AI cap | `/api/public/programs/future/rules` |
| FAQ | `/api/public/programs/future/faq` |
| News | `/api/public/programs/future/news` |
| Events | `/api/public/programs/future/events` |

Client: [src/lib/api/stern.js](src/lib/api/stern.js). Prizes are sorted by hours gate
first, then price. Each endpoint fails independently, so one outage degrades one
section instead of the page.

Every call to action points at **<https://stern.hackclub.com/future/welcome>**.

## Link previews

`index.html` carries a full Open Graph + Twitter card set, and `public/og.jpg` is the
1200×630 preview image (~92KB). Crawlers do not run JS and will not resolve a relative
`og:image`, so the absolute origin is substituted into `%SITE_URL%` at build time by a
small plugin in [vite.config.js](vite.config.js):

```bash
just build                                    # defaults to https://future.hackclub.com
SITE_URL=https://future.hackclub.com just build   # or set it explicitly per deploy
```

Set `SITE_URL` to whatever the site is actually served from, or the previews will point
at the wrong host. To redraw the card after a copy or palette change, edit
[tools/og-card.html](tools/og-card.html) (plain HTML using the same tokens) and run:

```bash
npm i -D playwright-core   # once; the browser comes from npx playwright install chromium
node tools/og-card.mjs     # renders at 2x, downsamples to 1200×630, writes public/og.jpg
```

## Where to edit things

| What | File |
|------|------|
| Program name, links, currency fallback | [src/lib/data.js](src/lib/data.js) → `CONFIG` |
| The three worlds (sky, palette, copy) | `WORLDS` + `:root[data-world]` in app.css |
| The three tracks, five steps, the rules | `TRACKS`, `STEPS`, `RULES` |
| Colours, glass, type, buttons | [src/app.css](src/app.css) |
| Page layout + sections | [src/App.svelte](src/App.svelte) |
| Live sky (clouds, sun, bubbles) | [src/lib/Sky.svelte](src/lib/Sky.svelte) |
| The glossy world | [src/lib/Orb.svelte](src/lib/Orb.svelte) |
| Water on the glass | [src/lib/Droplets.svelte](src/lib/Droplets.svelte) |

## Notes

- The world switcher recolours the whole page by animating registered CSS custom
  properties (`@property`), the only way to transition a colour inside a gradient.
  Adding a world means adding a `WORLDS` entry and a `[data-world]` block.
- Two glass tiers: `.bar` (hard specular midline, for title bars and capsules) and
  `.pane` (soft, for long blocks of text). A section is a `.window` = bar + pane.
- Fonts (Titillium Web / Mulish / Share Tech Mono) load from Google Fonts.
- Respects `prefers-reduced-motion`: the sky freezes and nothing animates.
