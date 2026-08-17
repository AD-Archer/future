<script>
  import { trackEvent } from './insight.js'
  import { novelBlurb } from './text.js'

  // Build ideas and shipped projects from Stern, in one grid.
  // `items` arrives already folded and sorted by normalizeExamples().
  let { items = [] } = $props()

  let tag = $state('')
  let open = $state(false)
  // two full rows at the widest layout; the CSS clip in app.css matches
  const CLIP = 10

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

  const footLine = (item) =>
    [item.effortLabel, item.credit ? `via ${item.credit}` : ''].filter(Boolean).join(' · ')
</script>

{#if items.length}
  <section class="col" id="ideas">
    <div class="window">
      <header class="titlebar">
        <h2>Things to build</h2>
        <span class="sep" aria-hidden="true"></span>
      </header>

      <div class="panel-body">
        {#if tags.length > 1}
          <div class="chips">
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
          <ul class="tile-grid" class:clipped={!open}>
            {#each shown as item, i (item.id)}
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
                  <div class="plate-well">
                    {#if item.image && !brokenImages.has(item.id)}
                      <img src={item.image} alt={item.title} loading={i < CLIP ? 'eager' : 'lazy'} decoding="async"
                        referrerpolicy="no-referrer" onerror={() => markBroken(item.id)} />
                    {:else}
                      <span class="letter" aria-hidden="true">{item.title.slice(0, 1)}</span>
                    {/if}

                    {#if item.tags.length}<span class="lead gel">{item.tags[0]}</span>{/if}
                    {#if item.kind === 'project'}<span class="ribbon gel">shipped</span>{/if}
                    {#if spec}<span class="plate-cap">{spec}</span>{/if}
                  </div>

                  <div class="card-body">
                    <h3>{item.title}</h3>
                    {#if foot}<p class="meta hud">{foot}</p>{/if}
                  </div>
                </svelte:element>
              </li>
            {/each}
          </ul>

          {#if !open && shown.length > CLIP}
            <div class="more-row">
              <button type="button" class="gel btn btn-blue btn-sm"
                onclick={() => { open = true; trackEvent('Examples: Show More', { tag: tag || 'all', total: shown.length }) }}>
                View all {shown.length}
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
    </div>
  </section>
{/if}

<style>
  .chips { padding-bottom: 16px; margin-bottom: 18px; border-bottom: 1px solid var(--panel-line); }



  .lead, .ribbon {
    position: absolute;
    top: 7px;
    padding: 3px 9px;
    font-size: var(--t-micro);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    max-width: calc(100% - 16px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .lead { left: 7px; }
  .ribbon {
    right: 7px;
    --gel-hi: var(--green-hi);
    --gel-lo: var(--green-lo);
    --gel-edge: var(--green-edge);
  }


  .msg { color: var(--ink-2); text-align: center; }
  .link { padding: 0; border: none; background: none; font: inherit; color: var(--link); text-decoration: underline; }

</style>
