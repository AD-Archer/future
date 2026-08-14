# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are Hack Club teens deciding whether to join **You Ship We Ship**
and start shipping a project. This page is the front door: it has to sell the
idea fast and hand off cleanly to Stern (`stern.hackclub.com/future/welcome`)
for onboarding. Not designed primarily for parents/teachers, though it must
still read as legitimate to an adult glancing over a teen's shoulder.

## Product Purpose

Future is a Hack Club "You Ship We Ship" program: build a real piece of
*the future as your childhood imagined it* — the future of 1920, of 2010, or
the one being imagined right now — ship it open-source, and earn shop credit
for the hours logged. The page's job is to get a visiting teen to understand
the premise in seconds and click through to start.

## Positioning

Any era's future, on your terms: unlike a fixed-theme build challenge, Future
doesn't hand contestants a single future to build toward. The visitor picks
which imagined future speaks to them, then ships a real piece of it. Program
mechanics (tracks, hour logging, shop) are shared with other Hack Club YSWS
programs — the differentiator is entirely in the open-ended premise and world
selection, not in novel program mechanics.

## Operating Context

- Static **Svelte 5 + Vite** site; `just dev` / `just build` / `just preview`.
- No backend of its own — program content (hours shipped, live shop/prizes,
  rules, FAQ, news, events) is read at runtime from Stern's public content API
  (`src/lib/api/stern.js`), edge-cached ~60s, each endpoint failing
  independently so one outage degrades one section rather than the page.
- Every call to action points at `https://stern.hackclub.com/future/welcome`.
- Self-hosted Plausible analytics (`plausible.adarcher.app`) tracks
  pageviews, engagement, outbound links, world selection, FAQ opens, example
  filters/sorts, shop/prize clicks, CTA placement, and content-load status.
- `index.html` carries full Open Graph/Twitter card metadata; `public/og.jpg`
  is rendered from `tools/og-card.html` via `tools/og-card.mjs`.

## Capabilities and Constraints

- Three "worlds" (visual themes tied to imagined futures) currently drive
  sky/palette/copy via `WORLDS` + `:root[data-world]` in `app.css`, animated
  through registered CSS custom properties (`@property`) so colors can
  transition inside a gradient. Adding a world means adding a `WORLDS` entry
  and a matching `[data-world]` block.
- Respects `prefers-reduced-motion`: the sky freezes and nothing animates —
  this must be preserved in any redesign.
- Program name, links, currency fallback live in `CONFIG`
  (`src/lib/data.js`); tracks/steps/rules live in `TRACKS`, `STEPS`, `RULES`
  in the same file.
- Fonts currently load from Google Fonts (Titillium Web / Mulish / Share Tech
  Mono) — open to change as part of the redesign.

## Brand Commitments

**Frutiger Aero is a locked brand commitment, not up for replacement.** The
redesign works *inside* this identity — live sky, smoked glass, glossy
everything — raising craft and execution rather than swapping the aesthetic
for something else. Two glass tiers are part of this system: `.bar` (hard
specular midline, for title bars/capsules) and `.pane` (soft, for long text
blocks); a section is a `.window` = bar + pane. Hack Club brand/name applies
throughout.

## Evidence on Hand

- `README.md` documents the current architecture, content-editing map, and
  Frutiger Aero direction in detail — treat as authoritative background, not
  binding on layout/copy decisions being redesigned now.
- No testimonials, press, case studies, or user research on file — do not
  fabricate any.
- Existing copy in `src/lib/data.js` / `App.svelte` is real program content
  (tracks, steps, rules) and must be preserved as fact; only its presentation
  is in scope for the redesign unless the user says otherwise.

## Product Principles

- Sell the premise (any era's future, your terms) before anything else —
  world selection is the hook, not a footnote.
- One outage in one Stern endpoint must never break the whole page; each
  section fails and degrades independently.
- Every path through the page should end at the same CTA:
  `stern.hackclub.com/future/welcome`.
- Motion and gloss serve the Frutiger Aero identity; `prefers-reduced-motion`
  is a hard requirement, not an enhancement.
- Craft bar is Hack Club teen-facing: playful and glossy is on-brand; sloppy
  or generic is not.

## Accessibility & Inclusion

`prefers-reduced-motion` must be honored (freeze the sky, disable animation).
No other accessibility requirement has been confirmed beyond standard web a11y
practice.
