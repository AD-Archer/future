---
name: FUTURE
description: A Hack Club landing page built as a bright, glossy, early-2000s interface.
colors:
  sky-1: "#0d4a94"
  sky-2: "#2f86d4"
  sky-3: "#7cc0e6"
  sky-4: "#a3d5ef"
  panel: "#ffffff"
  panel-2: "#f1f8fd"
  panel-3: "#eef6fc"
  panel-edge: "#9cc3de"
  panel-line: "#d3e6f3"
  bar-1: "#f2f9fe"
  bar-2: "#c9e2f6"
  bar-3: "#b2d5ee"
  bar-4: "#e3f2fc"
  bar-edge: "#8fb9d6"
  ink: "#16324a"
  ink-2: "#47657e"
  ink-3: "#52718a"
  ink-on-gel: "#0e2c46"
  ink-on-gel-green: "#12360a"
  blue-hi: "#86d3ff"
  blue-lo: "#1476c8"
  blue-edge: "#0e5794"
  green-hi: "#bcec72"
  green-lo: "#3a8418"
  green-edge: "#275f10"
  accent: "#1476c8"
  link: "#1268b4"
  bar-gel-top: "#2472b4"
  win-red: "#e0483e"
  win-red-hi: "#ffa39c"
  win-amber: "#e0a112"
  win-amber-hi: "#ffdc8a"
  win-green: "#3ba337"
  win-green-hi: "#93e08f"
  sun-core: "rgba(255, 251, 224, 0.6)"
  sun-halo: "rgba(255, 248, 205, 0.24)"
  scroll-hi: "#a9d4ef"
  scroll-lo: "#4d95c8"
  bar-gel-top: "#2f86cf"
typography:
  display:
    fontFamily: "Source Sans 3, Lucida Grande, Tahoma, Verdana, sans-serif"
    fontSize: "clamp(2.1rem, 5vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Source Sans 3, Lucida Grande, Tahoma, Verdana, sans-serif"
    fontSize: "clamp(1.6rem, 3vw, 2.3rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Source Sans 3, Lucida Grande, Tahoma, Verdana, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.12
  body:
    fontFamily: "Source Sans 3, Lucida Grande, Tahoma, Verdana, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Source Sans 3, Lucida Grande, Tahoma, Verdana, sans-serif"
    fontSize: "0.84rem"
    fontWeight: 700
    letterSpacing: "0.05em"
  data:
    fontFamily: "Share Tech Mono, ui-monospace, monospace"
    fontSize: "0.76rem"
    letterSpacing: "0.08em"
    fontFeature: "tabular-nums"
rounded:
  xs: "3px"
  sm: "6px"
  md: "10px"
  lg: "14px"
  pill: "999px"
spacing:
  measure: "68ch"
  pad: "clamp(16px, 4vw, 32px)"
  stack: "clamp(40px, 6vw, 76px)"
components:
  button-primary:
    backgroundColor: "{colors.green-lo}"
    textColor: "{colors.ink-on-gel-green}"
    rounded: "{rounded.pill}"
    padding: "13px 30px"
  button-blue:
    backgroundColor: "{colors.blue-lo}"
    textColor: "{colors.ink-on-gel}"
    rounded: "{rounded.pill}"
    padding: "13px 30px"
  chip:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "clamp(18px, 2.6vw, 28px)"
  titlebar:
    backgroundColor: "{colors.bar-2}"
    textColor: "{colors.ink}"
    padding: "11px 18px"
    height: "48px"
  card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 12px 12px"
---

# Design System: FUTURE

## Overview

**Creative North Star: "The Aqua Desktop"**

FUTURE is an early-2000s interface: a bright sky wallpaper with white glossy windows
sitting on it, pinstriped title bars, gel lozenge buttons, and dark text throughout.
The reference points are Mac OS X Aqua, Windows XP Luna, and the Web 2.0 badge — not
a cinematic scene.

The single most important fact about this era is that **it is a light aesthetic**.
Aqua, Luna and Web 2.0 were pale chrome with dark type, and the shine sat on top of
them. Dark panels with white type is a modern convention. An earlier version of this
page was a dark, canvas-driven underwater environment, and it read as contemporary
and cinematic no matter how much period texture went onto it; going light fixed in
one change what four rounds of detail could not.

It is also deliberately simple. There is no canvas, no scroll-driven effect, no
per-section environment. The sky is a gradient with drifting CSS clouds, the sections
are windows, and the shine is one repeated recipe.

**Key Characteristics:**
- Light chrome, dark type, gloss on top.
- One gloss recipe (`.gel`) for every raised thing on the page.
- Windows with pinstriped title bars for all content; open sky only for the hero.
- One green gel for actions; blue gel for everything else raised.
- Reflections under objects — the most 2005 device there is.

## Colors

A blue sky ramp behind white panels, with two gel colours and dark ink.

### Primary
- **Gel Green** (`#bcec72` → `#3a8418`, label `#12360a`): the action colour. Primary
  buttons, selected chips, the "featured" ribbon, the open state of a disclosure.
- **Gel Blue** (`#86d3ff` → `#1476c8`, label `#0e2c46`): every other raised bead —
  icon plinths, step numerals, price tags, secondary buttons.

### Secondary
- **Link** (`#1268b4`): inline links and text actions.

### Neutral
- **Sky ramp** — the page sky is pale throughout: `#2f86d4` → `#7cc0e6` → `#a3d5ef`,
  with stops in **pixels** (0 / 420 / 1100). The hero paints its own deep `#0d4a94`
  ground on top of it.
- **Panel chrome** — white to `#f1f8fd`, edged `#b4d2e8`, ruled `#dcebf6`.
- **Title bar** — `#f2f9fe` → `#d2e7f7` / `#c0dcf1` → `#e3f2fc`, edged `#a5c7e0`.
- **Ink** at three strengths: `#16324a`, `#47657e`, `#52718a`.
- **Browser surfaces** — selection rides `green-hi` on `ink`; the scrollbar thumb is
  `#a9d4ef` → `#4d95c8` on a `panel-line` track; focus rings are `accent` at 2px.
- **Sun** — `rgba(255,251,224,.6)` core to `rgba(255,248,205,.24)` halo, upper left of
  the sky layer.

### Named Rules
**The Light Ground Rule.** This era is light. Panels are white, type is dark, and the
gloss sits on top. A dark panel with white type is not this aesthetic, however much
gloss is applied to it.

**The Hero Owns Its Ground Rule.** White type appears only in the hero, and the hero
paints the deep blue it needs rather than relying on the page sky. Percentage gradient
stops on a document whose length changes are a trap: shortening one section slid the
hero out of its deep band and took the headline from 7:1 to 4.6:1. Page-sky stops are
in pixels; the hero's ground is its own element, solid to 94% and fading out below the
last line.

**The Dark Label Rule.** Gel labels are dark, not white. A gel is a *light* lozenge and
its label sits mid-gradient where the bead is brightest; white measured 2.5:1 there.
Aqua set dark labels on light gel for the same reason.

## Typography

**One family:** Source Sans 3 (fallback Lucida Grande, Tahoma, Verdana) at 300–700.
**Data:** Share Tech Mono, tabular figures.

One humanist family across the whole page is what this era's interfaces actually did —
Segoe UI and Lucida Grande each carried an entire OS. Weight and size do the work a
second face would otherwise do.

### Hierarchy
Every size is a `--t-*` token; there are no literal font sizes in the source outside
the two root body sizes.

- **Hero** (`--t-hero`, 700, `clamp(2.1rem, 5vw, 3.6rem)`): the headline and the close.
- **H2** (`--t-h2`, 700, `clamp(1.6rem, 3vw, 2.3rem)`): status pages and section heads.
- **Lede** (`--t-lede`, `clamp(1rem, 1.3vw, 1.14rem)`): the hero's supporting line.
- **LG** (`--t-lg`, 1.5rem): plate fallback glyphs.
- **H3** (`--t-h3`, 1.2rem, 700): title-bar headings and card names.
- **Body** (17px root, 16px below 520px), **SM** (0.92rem), **XS** (0.84rem),
  **Micro** (0.76rem): running copy down to ribbons and the ticker.

### Named Rules
**The Eight-Step Rule.** Every size in the source is a `--t-*` token. A literal
`font-size` is drift by definition.

**The Scoped Selector Rule.** Never style a bare element inside a component. Svelte's
scoping class gives `p` the same specificity as a global `.foo p`, so the component
wins on source order and silently overrides the system. Scope to a class.

## Layout

**One measure, `.col` (1080px), for the entire page.** Every window lines up on the
same two edges. Reading width is capped *inside* the panels with `--measure` (68ch)
rather than by narrowing the panel — two alternating column widths made the left and
right edges jump in and out five times on the way down, which is what makes a page
feel unsettled even when each section is fine on its own.

Sections stack on one rhythm token, `clamp(40px, 6vw, 76px)`. Breakpoints at 860px
(hero collapses), 760px (control-panel row stacks) and 640px (card grids go 2-up).

Every grid opens on its first ten tiles and reveals the rest behind a **View all**
button, at every width. The clip is a CSS `nth-child` rule rather than a sliced
array, so nothing tracks the viewport and a resize needs no rerender.

## Elevation & Depth

Everything raised is a glass bead; everything behind it is flat. Panels cast one close
downward shadow (`--drop`) and carry a white inner top line. Nested surfaces do *not*
get a second drop shadow — cards inside a window are recessed wells with a hairline
border and an inner highlight only, because two stacked shadows is how a light page
starts looking muddy.

### Shadow Vocabulary
- **Drop** (`0 1px 2px rgba(16,58,96,.16), 0 8px 22px rgba(16,58,96,.16)`): panels and windows.
- **Gel** (`inset 0 1px 0 rgba(255,255,255,.9), inset 0 -1px 2px rgba(0,0,0,.2), 0 1px 2px rgba(10,40,70,.3), 0 5px 12px rgba(10,40,70,.2)`): every bead.
- **Gel pressed** (`inset 0 2px 4px rgba(0,0,0,.28)`): `:active`, with a 1px nudge down.
- **Well** (`inset 0 1px 0 #fff` plus a 1px border): cards inside a panel.

## Shapes

Soft rectangles and true circles. Radii are `xs` 3px (focus rings), `sm` 6px, `md` 10px (cards), `lg` 14px
(panels and windows), `pill` 999px (every button, chip, tag, ribbon and bead). Icons
are drawn SVG at 2.2–3.4 stroke, round caps, `currentColor` so they inherit their
bead's label colour.

## Components

### Gel (the recipe)
The one thing to get right. A glass bead: bright top half, saturated bottom half, a
**hard break between them at 48%**, a thin dark rim, a white inner line, and a close
drop shadow. Buttons, chips, icon plinths, step numerals, price tags, ribbons and
disclosure toggles are all this recipe at different sizes and colours. Override with
`--gel-hi`, `--gel-lo`, `--gel-edge`, `--gel-ink`.

### Title bar
A fine 1px horizontal pinstripe over a soft bead, with the section name at `--t-h3`, a
2px etched `.sep`, a supporting line, and an optional right-aligned action. The
pinstripe is the most period-specific texture in the system.

### Window
A title bar welded to a white body (`.panel-body`). Every content section is one.

### Splash (the header)
The page's header is the application's own splash window, not a landing-page hero
band: decorative window caps, the mark on its reflection, the headline, one primary
action, and a status bar. The mark reads as an app icon and the page already speaks in
title bars, so a splash is the honest opening; image-left/headline-right is the answer
every landing page gives. The caps are chrome rather than controls — `aria-hidden`,
no hover, no pointer cursor, the same standing as the pinstripe texture. The status bar
reports the terms (free, ages, where) rather than repeating the brand line.

### Tile (shared)
One geometry, in `app.css`, for every grid on the page. `.tile-grid` is a centred flex
wrap on a fixed 190px basis, so a short last row centres instead of hanging left.
`.plate-well` is a hard 4:3 box with the image **absolutely placed inside it** —
`aspect-ratio` alone lets a tall photo grow the plate, which is what made the grids
look ragged. The name gets a fixed two-line box and the description rides on the plate
as a one-line `.plate-cap` strip, never in the card's flow, so no card can be taller
than its neighbour.

### Control-panel row
Three items across with a big glossy icon each and hairline dividers between — no
boxes. Three identical icon-heading-text cards is the laziest structure available and
reads as a generic template; the divider row is what this era actually shipped.

### Mark
The dolphin with a mirrored fade beneath it (`-webkit-box-reflect`). The mask runs from
the edge touching the object outward, so the strong stop comes **first** — reversed, it
paints a ghost of the mark far below it. The reflection paints outside the box and adds
no layout height, so every caller must reserve room for it. The reflection is
the single most 2005 device there is, and it is what makes a flat drawing sit *on* the
page rather than float over it. Chromium and WebKit get it; elsewhere the mark simply
stands on its own, which is a fine outcome rather than a broken one.

## Do's and Don'ts

### Do:
- **Do** build every raised thing from `.gel`. It is the whole look.
- **Do** keep type dark and grounds light.
- **Do** put every section in a panel or window, all on the one `.col` measure. The
  hero is the only thing that sits on open sky.
- **Do** cap reading width with `--measure` inside a panel, never by narrowing it.
- **Do** use a `--t-*` token for every font size.
- **Do** scope component selectors to a class.
- **Do** give icons `currentColor` so they follow their bead's label.

### Don't:
- **Don't** set white type on the sky. Nothing does any more; the header is a window.
- **Don't** size the sky's stops in percentages. The document's length changes.
- **Don't** wrap three peer items in three identical cards. Use the control-panel row.
- **Don't** let a plate size itself from its image; place the image inside a fixed box.
- **Don't** use white labels on gel. They measure ~2.5:1.
- **Don't** stack a drop shadow on a surface that already sits inside one.
- **Don't** reach for canvas, scroll effects or per-section environments. The page is a
  gradient, some clouds, and windows — keeping it that way is a requirement, not an
  omission.
