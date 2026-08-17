<script>
  import { trackEvent } from '../insight.js'
  import { CONFIG } from '../data.js'
  import { bandById, usableBands, priceParts, blurb, stockLabel, metaLine } from '../shop.js'

  let { prizes = [], loading = false, coinName = 'Coins' } = $props()

  let band = $state('all')
  let open = $state(false)
  // two full rows at the widest layout; the CSS clip in app.css matches
  const CLIP = 10

  let brokenImages = $state(new Set())
  const markBroken = (id) => (brokenImages = new Set(brokenImages).add(id))

  let bands = $derived(usableBands(prizes))
  let shown = $derived(prizes.filter(bandById(band).match))
  let anyMeta = $derived(prizes.some((p) => metaLine(p)))

  const choose = (next) => {
    if (next === band) return
    band = next
    open = false // a new filter is a new list; re-clip it on phones
    trackEvent('Shop: Filter', { band: next, results: shown.length })
  }
</script>

<section class="col" id="shop">
  <div class="window">
    <header class="titlebar">
      <h2>The shop</h2>
      <span class="sep" aria-hidden="true"></span>
      <p>Priced in tracked hours, cheapest first.</p>
      <a class="btn-text spacer" href={CONFIG.programUrl} data-analytics="CTA: Click"
        data-analytics-placement="shop-header">Full shop →</a>
    </header>

    <div class="panel-body">
      {#if loading}
        <ul class="tile-grid" aria-hidden="true">
          {#each { length: 8 } as _}
            <li class="card">
              <div class="plate-well skeleton"></div>
              <div class="card-body">
                <div class="skeleton" style="width:78%;height:1em"></div>
                <div class="skeleton" style="width:46%;height:.7em;margin-top:7px"></div>
              </div>
            </li>
          {/each}
        </ul>
      {:else if prizes.length}
        <div class="chips" role="group" aria-label="Filter by cost">
          {#each bands as b}
            <button type="button" class="chip" class:on={band === b.id} onclick={() => choose(b.id)}>
              {b.label}{#if b.id !== 'all'}<span class="chip-n">{b.n}</span>{/if}
            </button>
          {/each}
        </div>

        <ul class="tile-grid" class:clipped={!open}>
          {#each shown as p, i}
            {@const spec = blurb(p)}
            {@const price = priceParts(p, coinName)}
            <li class="card" class:sold-out={p.stock === 0}>
              <!-- the whole tile is the link: 28 copies of one button label was
                   noise, and it cost every card a row of its height -->
              <a class="tile" href={CONFIG.shopUrl}
                data-analytics="Prize: View" data-analytics-placement="shop-card"
                data-analytics-item={p.name} data-analytics-stock={stockLabel(p) || 'unlimited'}>
                <div class="plate-well">
                  {#if p.imageUrl && !brokenImages.has(p.id)}
                    <img src={p.imageUrl} alt={p.name} loading={i < CLIP ? 'eager' : 'lazy'}
                      decoding="async" onerror={() => markBroken(p.id)} />
                  {:else}
                    <span class="letter" aria-hidden="true">{p.name.trim().slice(0, 1)}</span>
                  {/if}

                  <span class="tag gel">
                    <b>{price.n}</b>{#if price.u}<i>{price.u}</i>{/if}
                  </span>

                  {#if p.isFeatured}<span class="ribbon gel">featured</span>{/if}
                  {#if spec}<span class="plate-cap">{spec}</span>{/if}
                </div>

                <div class="card-body">
                  <h3>{p.name}</h3>
                  {#if anyMeta}<p class="meta hud">{metaLine(p)}</p>{/if}
                </div>
              </a>
            </li>
          {/each}
        </ul>

        {#if !open && shown.length > CLIP}
          <div class="more-row">
            <button type="button" class="gel btn btn-blue btn-sm"
              onclick={() => { open = true; trackEvent('Shop: Show More', { band, total: shown.length }) }}>
              View all {shown.length}
            </button>
          </div>
        {/if}

        {#if !shown.length}
          <p class="msg">
            Nothing in that range yet.
            <button type="button" class="link" onclick={() => choose('all')}>Show everything</button>
          </p>
        {/if}
      {:else}
        <p class="msg">
          No items are listed right now. The shop is filled in on Stern, so check
          <a href={CONFIG.programUrl}>the program page</a> for what is live.
        </p>
      {/if}
    </div>
  </div>
</section>

<style>
  .chips { padding-bottom: 16px; margin-bottom: 18px; border-bottom: 1px solid var(--panel-line); }



  .tag {
    position: absolute;
    top: 7px;
    left: 7px;
    padding: 2px 10px 3px;
    gap: 4px;
    align-items: baseline;
    font-size: var(--t-xs);
  }
  .tag b { font-size: var(--t-body); font-variant-numeric: tabular-nums; }
  .tag i { font-style: normal; font-size: var(--t-micro); opacity: 0.9; }

  .ribbon {
    position: absolute;
    top: 7px;
    right: 7px;
    padding: 3px 9px;
    font-size: var(--t-micro);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    --gel-hi: var(--green-hi);
    --gel-lo: var(--green-lo);
    --gel-edge: var(--green-edge);
  }


  .card.sold-out .plate-well { opacity: 0.5; }
  .card.sold-out .card-body { opacity: 0.75; }


  .msg { margin: 16px 2px; color: var(--ink-2); }
  .msg a, .link { color: var(--link); text-decoration: underline; }
  .link { padding: 0; border: none; background: none; font: inherit; }

</style>
