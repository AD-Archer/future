<script>
  import { trackEvent } from './insight.js'
  import { novelBlurb } from './text.js'

  // Build ideas and shipped projects from Stern, in one grid.
  //   <Examples items={api.examples} />
  // `items` arrives already folded and sorted by normalizeExamples().
  let { items = [] } = $props()

  let tag = $state('')
  let open = $state(false)
  const CLIP = 8

  let brokenImages = $state(new Set())
  const markBroken = (id) => (brokenImages = new Set(brokenImages).add(id))

  const chooseTag = (next) => {
    tag = tag === next ? '' : next
    open = false // a new filter is a new list; re-clip it on phones
    trackEvent('Examples: Filter', { tag: tag || 'all' })
  }

  // A tag earns a chip only if it actually splits the set: it has to appear on
  // more than one item and not on every item. Offering one chip per tag meant
  // seven filters for five ideas, four of them from a single entry — more
  // controls than content, which is worse than no filter at all.
  let tags = $derived.by(() => {
    const counts = new Map()
    for (const item of items) {
      for (const t of item.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
    }
    return [...counts.entries()]
      .filter(([, n]) => n > 1 && n < items.length)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([t, n]) => ({ t, n }))
  })

  let shown = $derived(tag ? items.filter((i) => i.tags.includes(tag)) : items)

  // no sort control: the list arrives quickest-first from normalizeExamples(),
  // and every current item has no effort hint at all, so a sort would have been
  // a dead control sitting next to the filters
  const footLine = (item) =>
    [item.effortLabel, item.credit ? `via ${item.credit}` : ''].filter(Boolean).join(' · ')
</script>

{#if items.length}
  <section class="window" id="ideas">
    <header class="bar sec-bar">
      <h2>Things to build</h2>
      <span class="sep" aria-hidden="true"></span>
      <p class="sec-sub">
        Just a few ideas to get you started, you should not try to build these exactly, add your own spin.
      </p>
    </header>

    <div class="pane body">
      {#if tags.length > 1}
        <div class="chips filters" role="group" aria-label="Filter by tag">
          <button type="button" class="chip" class:on={tag === ''} onclick={() => chooseTag('')}>
            everything
          </button>
          {#each tags as { t, n }}
            <button type="button" class="chip" class:on={tag === t} onclick={() => chooseTag(t)}>
              {t}<span class="chip-n">{n}</span>
            </button>
          {/each}
        </div>
      {/if}

      {#if shown.length}
        <!-- flex, not grid tracks: a last row of one has to sit under the middle
             of the row above it, and 1fr columns pin that orphan to the left -->
        <ul class="grid" class:clipped={!open}>
          {#each shown as item (item.id)}
            {@const spec = novelBlurb(item.title, item.description)}
            {@const foot = footLine(item)}
            <li class="card" class:linked={!!item.link}>
              <svelte:element
                this={item.link ? 'a' : 'div'}
                class="tile"
                href={item.link || undefined}
                target={item.link ? '_blank' : undefined}
                rel={item.link ? 'noopener' : undefined}
                data-analytics={item.link ? 'Example: Open' : undefined}
                data-analytics-kind={item.link ? item.kind : undefined}
                data-analytics-item={item.link ? item.title : undefined}
              >
                <div class="thumb">
                  {#if item.image && !brokenImages.has(item.id)}
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      referrerpolicy="no-referrer"
                      onerror={() => markBroken(item.id)}
                    />
                  {:else}
                    <span class="plate" aria-hidden="true">{item.title.slice(0, 1)}</span>
                  {/if}

                  <!-- the lead tag anchors the tile, the same way the hour price
                       anchors a shop tile; the rest are reachable by filter -->
                  {#if item.tags.length}
                    <span class="lead label">{item.tags[0]}</span>
                  {/if}

                  {#if item.kind === 'project'}<span class="ribbon label">shipped</span>{/if}

                  <!-- on the plate, never in the card's flow, so description
                       length can't change how tall the card is -->
                  {#if spec}<span class="spec"><span class="spec-t">{spec}</span></span>{/if}
                </div>

                <div class="card-body">
                  <h3>{item.title}</h3>
                  <p class="foot hud">{foot}</p>
                </div>
              </svelte:element>
            </li>
          {/each}
        </ul>

        {#if !open && shown.length > CLIP}
          <div class="more-row">
            <button type="button" class="btn btn-glass btn-sm"
              onclick={() => { open = true; trackEvent('Examples: Show More', { tag: tag || 'all', total: shown.length }) }}>
              Show {shown.length - CLIP} more
            </button>
          </div>
        {/if}
      {:else}
        <p class="msg">
          Nothing tagged “{tag}”.
          <button type="button" class="link" onclick={() => chooseTag('')}>Show everything</button>
        </p>
      {/if}
    </div>
  </section>
{/if}

<style>
  .sec-bar {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 12px 20px;
    min-height: 52px;
  }
  .sec-bar h2 { font-size: 1.5rem; font-weight: 300; white-space: nowrap; }
  .sec-sub { margin: 0; font-size: 0.98rem; color: var(--ink-2); max-width: 62ch; }

  .body { padding: 18px 26px 24px; }

  .filters {
    justify-content: center;
    padding-bottom: 16px;
    margin-bottom: 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  }

  /* ── CARDS ── */
  .grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  /* a fixed basis rather than a share of the row, so cards keep one size
     whether the row holds four of them or one */
  .card {
    flex: 0 1 218px;
    border-radius: var(--r-md);
    background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0.03) 46%, rgba(0, 0, 0, 0.12) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 rgba(0, 0, 0, 0.35),
      0 6px 14px rgba(0, 0, 0, 0.22);
    overflow: hidden;
    transition: transform 0.24s var(--ease), box-shadow 0.24s var(--ease);
  }
  /* only the ones that go somewhere get the lift — an idea with no reference
     link should not pretend to be clickable */
  .card.linked:hover {
    transform: translateY(-3px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.44),
      inset 0 -1px 0 rgba(0, 0, 0, 0.35),
      0 14px 24px rgba(0, 0, 0, 0.3);
  }
  .tile { display: grid; grid-template-rows: auto 1fr; height: 100%; }

  .thumb {
    position: relative;
    display: grid;
    place-items: center;
    aspect-ratio: 4 / 3;
    min-height: 0;
    overflow: hidden;
    padding: 14px;
    background:
      radial-gradient(120% 90% at 50% 0%, rgba(255, 255, 255, 0.2), transparent 62%),
      rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.45), inset 0 -1px 0 rgba(255, 255, 255, 0.16);
  }
  /* clear the label strip, but only where there is one */
  .thumb:has(.spec) { padding-bottom: 46px; }
  .thumb img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.45));
  }
  .plate {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    font-family: var(--display);
    font-size: 1.5rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    background: radial-gradient(circle at 34% 24%, #fff 1%, var(--aqua-lt) 14%, var(--aqua) 48%, var(--aqua-dk) 100%);
    box-shadow: 0 8px 14px rgba(0, 0, 0, 0.4), inset 0 -3px 6px rgba(0, 0, 0, 0.3), inset 0 2px 3px rgba(255, 255, 255, 0.85);
  }

  /* the lead tag, in the aqua bubble language used across the page */
  .lead {
    position: absolute;
    top: 9px;
    left: 9px;
    z-index: 2;
    max-width: calc(100% - 18px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 3px 10px 4px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: var(--r-pill);
    font-size: 0.56rem;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 20, 40, 0.6);
    background-image:
      linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.14) 49.6%, rgba(255, 255, 255, 0) 50%),
      radial-gradient(130% 160% at 28% 0%, var(--aqua-lt) 0%, var(--aqua) 46%, var(--aqua-dk) 100%);
    box-shadow:
      0 5px 10px rgba(0, 0, 0, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.7),
      inset 0 -2px 4px rgba(0, 0, 0, 0.3);
  }

  .ribbon {
    position: absolute;
    top: 9px;
    right: 9px;
    z-index: 2;
    padding: 4px 10px;
    border-radius: var(--r-pill);
    font-size: 0.56rem;
    color: var(--pill-tx);
    text-shadow: none;
    background-image:
      linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.18) 49.6%, rgba(255, 255, 255, 0) 50%),
      linear-gradient(180deg, var(--pill-hi) 0%, var(--pill-lo) 100%);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.35);
  }

  /* ── SPEC LABEL ──
     Same strip as the shop tiles: own fill and hairline rather than a soft
     scrim, or the text disappears against a dark image. No backdrop-filter —
     nesting one inside the pane's own drops the sibling chips out of the
     composite entirely. */
  .spec {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    padding: 8px 11px 9px;
    border-top: 1px solid rgba(255, 255, 255, 0.16);
    background-image:
      linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 60%),
      linear-gradient(180deg, rgba(5, 17, 28, 0.9) 0%, rgba(3, 11, 19, 0.96) 100%);
  }
  .spec-t {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    font-size: 0.78rem;
    line-height: 1.42;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: var(--etch);
  }
  .card.linked:hover .spec-t {
    -webkit-line-clamp: 7;
    line-clamp: 7;
  }

  .card-body { padding: 11px 13px 13px; }
  /* a fixed two-line box, so one- and two-line titles agree on card height */
  .card-body h3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    min-height: 2.5em;
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.25;
  }
  .foot { margin: 6px 0 0; min-height: 1.1em; font-size: 0.66rem; }

  .msg { margin: 8px 4px; color: var(--ink-2); text-align: center; }
  .link {
    padding: 0;
    border: none;
    background: none;
    color: var(--accent);
    font: inherit;
    text-decoration: underline;
  }

  @media (max-width: 960px) {
    .sec-bar { flex-wrap: wrap; gap: 10px 16px; }
    .sec-bar .sep { display: none; }
  }
  @media (max-width: 640px) {
    .body { padding: 14px 14px 18px; }
    .grid { gap: 12px; }
    /* two per row on a phone, still centred when the last row holds one */
    .card { flex: 0 1 calc(50% - 6px); }
    .card-body { padding: 10px 11px 12px; }
    .card-body h3 { font-size: 0.9rem; }
    .thumb:has(.spec) { padding-bottom: 42px; }
    .spec { padding: 7px 9px 8px; }
    .spec-t { font-size: 0.72rem; }
  }
</style>
