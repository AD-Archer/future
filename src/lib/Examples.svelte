<script>
  // Build ideas and shipped projects from Stern, in one grid.
  //   <Examples items={api.examples} />
  // `items` arrives already folded and sorted by normalizeExamples().
  let { items = [] } = $props()

  let tag = $state('')
  let order = $state('quickest')
  let brokenImages = $state(new Set())
  const markBroken = (id) => (brokenImages = new Set(brokenImages).add(id))

  // every tag in the set, most-used first, so the chips lead with what exists
  let tags = $derived.by(() => {
    const counts = new Map()
    for (const item of items) {
      for (const t of item.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t)
  })

  let shown = $derived.by(() => {
    const picked = tag ? items.filter((i) => i.tags.includes(tag)) : items
    const byTitle = (a, b) => a.title.localeCompare(b.title)

    // an item with no effort hint sinks to the bottom whichever way you sort,
    // because "unknown" is not the same as "smallest" or "biggest"
    const known = picked.filter((i) => i.effort !== null)
    const unknown = picked.filter((i) => i.effort === null).sort(byTitle)

    known.sort((a, b) =>
      (order === 'quickest' ? a.effort - b.effort : b.effort - a.effort) || byTitle(a, b)
    )

    return [...known, ...unknown]
  })
</script>

{#if items.length}
  <section class="window" id="ideas">
    <header class="bar sec-bar">
      <h2>Things to build</h2>
      <span class="sep" aria-hidden="true"></span>
      <p class="sec-sub">
        Starting points, not a menu. Take one, twist it into your own future, or use it to
        work out what you would rather make.
      </p>
      <span class="count label">{shown.length} of {items.length}</span>
    </header>

    <div class="pane body">
      <div class="controls">
        {#if tags.length}
          <div class="chips" role="group" aria-label="Filter by tag">
            <button type="button" class="chip" class:on={tag === ''} onclick={() => (tag = '')}>
              everything
            </button>
            {#each tags as t}
              <button
                type="button"
                class="chip"
                class:on={tag === t}
                onclick={() => (tag = tag === t ? '' : t)}
              >
                {t}
              </button>
            {/each}
          </div>
        {/if}

        <label class="sort">
          <span class="label">sort</span>
          <select bind:value={order}>
            <option value="quickest">quickest first</option>
            <option value="biggest">biggest first</option>
          </select>
        </label>
      </div>

      {#if shown.length}
        <ul class="grid">
          {#each shown as item (item.id)}
            <li class="card">
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
                {#if item.kind === 'project'}<span class="ribbon label">shipped</span>{/if}
              </div>

              <div class="card-body">
                <h3>{item.title}</h3>
                {#if item.description}<p class="desc">{item.description}</p>{/if}

                {#if item.tags.length}
                  <ul class="taglist">
                    {#each item.tags as t}
                      <li class="tag label">{t}</li>
                    {/each}
                  </ul>
                {/if}

                <p class="foot hud">
                  {item.effortLabel}{#if item.effortLabel && item.credit}{' · '}{/if}{#if item.credit}via {item.credit}{/if}
                </p>

                {#if item.link}
                  <a class="btn btn-glass btn-sm card-cta" href={item.link} target="_blank" rel="noopener">
                    {item.kind === 'project' ? 'See the build' : 'Reference'}
                  </a>
                {/if}
              </div>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="msg">Nothing tagged “{tag}”. <button type="button" class="link" onclick={() => (tag = '')}>Show everything</button></p>
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
  .count { margin-left: auto; white-space: nowrap; }

  .body { padding: 16px 26px 24px; }

  /* ── FILTERS ── */
  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    padding-bottom: 16px;
    margin-bottom: 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .chip {
    padding: 7px 14px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--r-pill);
    font-family: var(--display);
    font-size: 0.76rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-2);
    text-shadow: var(--etch);
    /* the smoked base matters: sheen alone leaves white text on a pale pill */
    background-image:
      linear-gradient(180deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0.08) 49.6%, rgba(255, 255, 255, 0) 50%),
      linear-gradient(180deg, var(--pane-1) 0%, var(--pane-2) 50%, var(--pane-3) 50.1%, var(--pane-4) 100%);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 -1px 0 rgba(0, 0, 0, 0.4);
    transition: color 0.2s, border-color 0.2s, filter 0.2s;
  }
  .chip:hover { color: var(--ink); border-color: rgba(255, 255, 255, 0.34); }
  .chip.on {
    color: var(--pill-tx);
    border-color: var(--pill-ln);
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
    background-image:
      linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.18) 49.6%, rgba(255, 255, 255, 0) 50%),
      linear-gradient(180deg, var(--pill-hi) 0%, var(--pill-lo) 100%);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }

  .sort { display: inline-flex; align-items: center; gap: 10px; }
  .sort select {
    padding: 8px 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--r-sm);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(0, 0, 0, 0.24));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
    color: var(--ink);
    font: inherit;
    font-size: 0.9rem;
  }
  .sort select option { color: #111; }

  /* ── CARDS ── */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(238px, 1fr));
    grid-auto-rows: 1fr;
    gap: 18px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .card {
    display: flex;
    flex-direction: column;
    border-radius: var(--r-md);
    background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0.03) 46%, rgba(0, 0, 0, 0.12) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 rgba(0, 0, 0, 0.35),
      0 6px 14px rgba(0, 0, 0, 0.22);
    overflow: hidden;
  }

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
    width: 62px;
    height: 62px;
    border-radius: 50%;
    font-family: var(--display);
    font-size: 1.6rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    background: radial-gradient(circle at 34% 24%, #fff 1%, var(--aqua-lt) 14%, var(--aqua) 48%, var(--aqua-dk) 100%);
    box-shadow: 0 8px 14px rgba(0, 0, 0, 0.4), inset 0 -3px 6px rgba(0, 0, 0, 0.3), inset 0 2px 3px rgba(255, 255, 255, 0.85);
  }
  .ribbon {
    position: absolute;
    top: 10px;
    right: 10px;
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

  .card-body { display: flex; flex-direction: column; flex: 1; padding: 16px 16px 18px; }
  .card-body h3 { font-size: 1.06rem; font-weight: 600; }
  .desc { margin: 8px 0 0; color: var(--ink-2); font-size: 0.92rem; }

  .taglist {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    list-style: none;
    margin: 14px 0 0;
    padding: 0;
  }
  .tag {
    padding: 3px 9px;
    border-radius: var(--r-pill);
    font-size: 0.56rem;
    color: var(--ink-2);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 49.6%, rgba(255, 255, 255, 0.01) 50%);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.26), inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  }

  .foot {
    margin: 14px 0 0;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.14);
    min-height: 1.1em;
  }
  .card-cta { width: 100%; margin-top: 12px; }
  /* pin the footer of every card to the same line */
  .foot { margin-top: auto; }

  .msg { margin: 8px 4px; color: var(--ink-2); }
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
    .count { margin-left: 0; }
  }
  @media (max-width: 640px) {
    .body { padding: 14px 14px 18px; }
    .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .card-body { padding: 13px 13px 15px; }
    .card-body h3 { font-size: 0.98rem; }
    .desc { font-size: 0.86rem; }
    .controls { justify-content: flex-start; }
  }
</style>
