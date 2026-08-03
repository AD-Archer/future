# FLUX 🛸

An interdimensional **You Ship, We Ship** landing page for Hack Club — build something
from the future (or something to build *your* future), ship it open-source, and cash your
**Flurbos** for real gear. Rick-and-Morty-flavored, portal-green, parody-safe.

Built with **Svelte 5 + Vite**, run with **`just`**.

## Quick start

```bash
just          # list all recipes
just dev      # fire up the site + API (site → http://localhost:5173)
just build    # compress into a microverse (production build → dist/)
just start    # run the built site + API (server → http://localhost:8787)
just preview  # preview the production build
just clean    # schwifty reset (nuke node_modules + build output)
```

`just dev` / `just build` auto-install deps on first run.

## Where to edit things

Almost all copy + config lives in one place:

| What | File |
|------|------|
| Program name, min hours, currency, links | [src/lib/data.js](src/lib/data.js) → `CONFIG` |
| The three "dimensions" you can build | `BUILD_FLAVORS` |
| The 5 steps | `STEPS` |
| Flurbos reward shop | `REWARDS` |
| Ship-list requirements | `REQUIREMENTS` |
| FAQ | `FAQ` |
| Colors, fonts, background/texture | [src/app.css](src/app.css) (`:root` vars) |
| Page layout + sections | [src/App.svelte](src/App.svelte) |
| Swirling portal visual | [src/lib/Portal.svelte](src/lib/Portal.svelte) |
| Airtable backend config | [server/config/airtable.js](server/config/airtable.js) |
| Airtable browser client | [src/lib/api/airtable.js](src/lib/api/airtable.js) |

## Airtable backend

The browser never talks to Airtable directly. It calls local `/api/airtable/...`
routes, and `server/index.js` uses `AIRTABLE_API_TOKEN` from `.env`.

```bash
cp .env.example .env
# fill in AIRTABLE_API_TOKEN and AIRTABLE_THINGONDESK_BASE_ID when ready
just dev
```

Configured starting points:

| Key | Base | Table |
|-----|------|-------|
| `unified.approvedProjects` | Unified YSWS Projects DB (`app3A5kJwYqxMLOgh`) | Approved Projects (`tblzWWGUYHVH7Zyqf`) |
| `thingondesk` | Set with `AIRTABLE_THINGONDESK_BASE_ID` | Add tables in `server/config/airtable.js` |

Frontend helpers live in `src/lib/api/airtable.js`:

```js
listAirtableRecords('unified', 'approvedProjects')
createAirtableRecord('unified', 'approvedProjects', { Email: 'builder@example.com' })
updateAirtableRecord('unified', 'approvedProjects', 'rec...', { Email: 'new@example.com' })
deleteAirtableRecord('unified', 'approvedProjects', 'rec...')
```

## Notes

- **Not affiliated** with Adult Swim / Dan Harmon / Justin Roiland — it's an original
  parody vibe (portal green, Flurbos, the multiverse) with no lifted IP or assets.
- Fonts (Bungee / Familjen Grotesk / Space Mono) load from Google Fonts.
- Respects `prefers-reduced-motion`.
- Deploy the `dist/` folder anywhere static (like `beest.hackclub.com`).
