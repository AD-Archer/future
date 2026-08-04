<script>
  import Sky from './lib/Sky.svelte'
  import Orb from './lib/Orb.svelte'
  import Droplets from './lib/Droplets.svelte'
  import Ticker from './lib/Ticker.svelte'
  import Reveal from './lib/Reveal.svelte'
  import Rules from './lib/Rules.svelte'
  import StatusPage from './lib/StatusPage.svelte'
  import { loadContent } from './lib/api/stern.js'
  import { CONFIG, WORLDS, TRACKS, STEPS, RULES } from './lib/data.js'

  let openFaq = $state(0)
  let worldIndex = $state(0)
  let locationState = $state(readLocation())
  let runtimeError = $state('')
  let stage = $state()

  // everything that changes often lives in Stern, not in this repo
  let api = $state({
    loading: true,
    failures: [],
    program: null,
    currency: null,
    prizes: [],
    rules: null,
    faq: [],
    news: [],
    events: []
  })

  let world = $derived(WORLDS[worldIndex])
  let coinName = $derived(api.currency?.name ?? CONFIG.currency)

  // how long the program runs, straight off the schedule in the program payload
  const DAY = 86400000
  // Read in UTC: the schedule lands on midnight UTC, so formatting it locally
  // would shift the date back a day for anyone west of Greenwich. Months are
  // spelled out here rather than via Intl, whose "short" September is "Sept".
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const fmtDate = (d) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`

  let run = $derived.by(() => {
    const sch = api.program?.schedule
    if (!sch?.startsAt || !sch?.endsAt) return null

    const start = new Date(sch.startsAt)
    const end = new Date(sch.endsAt)
    const now = new Date()
    const total = Math.max(1, Math.round((end - start) / DAY))

    return {
      start,
      end,
      total,
      day: Math.min(total, Math.max(1, Math.floor((now - start) / DAY) + 1)),
      left: Math.max(0, Math.ceil((end - now) / DAY)),
      until: Math.max(0, Math.ceil((start - now) / DAY)),
      started: sch.hasStarted,
      ended: sch.hasEnded
    }
  })

  let ticker = $derived.by(() => {
    const out = []
    if (run) {
      const window = `runs ${fmtDate(run.start)} to ${fmtDate(run.end)}`
      if (run.ended) {
        out.push('this run has ended', `it ran ${run.total} days`, window)
      } else if (run.started) {
        out.push(
          `day ${run.day} of ${run.total}`,
          run.left === 0 ? 'closes today' : `${run.left} day${run.left === 1 ? '' : 's'} left`,
          window
        )
      } else {
        out.push(
          run.until === 0 ? 'opens today' : `opens in ${run.until} day${run.until === 1 ? '' : 's'}`,
          window
        )
      }
    }
    if (typeof api.program?.hoursShipped === 'number') {
      out.push(`${api.program.hoursShipped} hours shipped`)
    }
    if (out.length) out.push('build the future you want to see')
    return out
  })

  const toggle = (i) => (openFaq = openFaq === i ? -1 : i)
  const validPaths = new Set(['/', '/index.html', '/404', '/error'])

  // short enough never to wrap in a card column; the label supplies the unit
  const hoursLabel = (h) => (h ? `${h} hrs` : 'none')
  // priceType decides the unit. These prizes are priced in *hours*, not the
  // program currency, so never assume coins just because a price exists.
  function priceLabel(p) {
    if (p.priceType === 'hours') return `${p.price} hrs`
    if (p.priceType === 'currency') return `${p.price} ${coinName}`
    if (p.priceType === 'free' || !p.price) return 'Free'
    return `${p.price} ${p.priceType ?? ''}`.trim()
  }

  // a prize whose imageUrl 404s falls back to the plate, not a broken frame
  let brokenImages = $state(new Set())
  const markBroken = (id) => (brokenImages = new Set(brokenImages).add(id))

  function stockLabel(p) {
    if (p.stock === null || p.stock === undefined) return ''
    return p.stock > 0 ? `${p.stock} left` : 'out of stock'
  }

  const noteLine = (p) =>
    [stockLabel(p), p.estimatedShip ? `ships ${p.estimatedShip}` : ''].filter(Boolean).join(' · ')

  function readLocation() {
    return { pathname: window.location.pathname }
  }

  function normalizePath(pathname) {
    return pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname
  }

  let status = $derived.by(() => {
    const pathname = normalizePath(locationState.pathname)

    if (runtimeError || pathname === '/error') {
      return {
        code: '500',
        eyebrow: 'atmosphere unstable',
        title: 'This future stopped compiling.',
        body: 'Something on this page failed mid-render. Head back to the surface while we stabilise it.',
        detail: runtimeError
      }
    }

    if (pathname === '/404' || !validPaths.has(pathname)) {
      return {
        code: '404',
        eyebrow: 'no such place',
        title: 'Nothing was built here.',
        body: 'These coordinates come back as open sky. FUTURE is still one jump behind you.'
      }
    }

    return null
  })

  // paint the picked world onto the document so every token cross-fades
  $effect(() => {
    document.documentElement.dataset.world = world.id
  })

  $effect(() => {
    loadContent()
      .then((c) => (api = { ...c, loading: false }))
      .catch((err) => (api = { ...api, loading: false, failures: [err.message] }))
  })

  $effect(() => {
    const syncLocation = () => (locationState = readLocation())
    const captureError = (event) => {
      runtimeError = event.error?.message || event.message || 'Unknown runtime error'
    }
    const captureRejection = (event) => {
      runtimeError = event.reason?.message || String(event.reason || 'Unhandled promise rejection')
    }

    window.addEventListener('popstate', syncLocation)
    window.addEventListener('hashchange', syncLocation)
    window.addEventListener('error', captureError)
    window.addEventListener('unhandledrejection', captureRejection)

    return () => {
      window.removeEventListener('popstate', syncLocation)
      window.removeEventListener('hashchange', syncLocation)
      window.removeEventListener('error', captureError)
      window.removeEventListener('unhandledrejection', captureRejection)
    }
  })

  // the orb drifts against the pointer
  $effect(() => {
    if (!stage) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e) => {
      const r = stage.getBoundingClientRect()
      stage.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
      stage.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
    }
    const reset = () => {
      stage.style.setProperty('--mx', 0)
      stage.style.setProperty('--my', 0)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', reset)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', reset)
    }
  })
</script>

{#if status}
  <StatusPage {...status} />
{:else}

<Sky atmos={world.atmos} />

<!-- how long this run lasts, on a loop, pinned across the top -->
<Ticker items={ticker} header />

<!-- Hack Club flag, hung from the top-left corner, over the header -->
<a class="flag" href={CONFIG.flagUrl} target="_blank" rel="noopener" aria-label="Hack Club">
  <img src="/branding/flag-orpheus-top.svg" alt="Hack Club" width="150" height="85" />
</a>

<main class="wrap stack">
  <!-- ───────────────────────── HERO ───────────────────────── -->
  <section class="window hero" id="top">
    <header class="bar hero-bar">
      <span class="brand"><span class="brand-dot" aria-hidden="true"></span>{CONFIG.name}<sup>®</sup></span>
      <span class="sep" aria-hidden="true"></span>
      <span class="hero-kicker label">Hack Club · You Ship, We Ship by Archer</span>
      <a class="hero-bar-cta btn-text" href={CONFIG.slackUrl}>Slack →</a>
    </header>

    <div class="pane hero-pane" bind:this={stage}>
      <Droplets count={9} seed={4} opacity={0.55} />

      <div class="hero-figure">
        <div class="orb-wrap" aria-hidden="true"><Orb size={330} /></div>

        <!-- the world picker belongs to the globe, well clear of the buttons -->
        <div class="picker" style="--i:{worldIndex}">
          <span class="picker-label label">which future?</span>
          <div class="segment bar" role="radiogroup" aria-label="Pick a future">
            <span class="knob" aria-hidden="true"></span>
            {#each WORLDS as w, i}
              <button
                type="button"
                role="radio"
                aria-checked={worldIndex === i}
                class="seg"
                class:on={worldIndex === i}
                onclick={() => (worldIndex = i)}
              >
                {w.name}
              </button>
            {/each}
          </div>
          {#key world.id}
            <p class="world-tag"><em>{world.kicker}</em> · {world.tag}</p>
            <p class="hud world-hud">▸ {world.hud}</p>
          {/key}
        </div>
      </div>

      <div class="hero-copy">
        <h1>Build the future<br />you want to see.</h1>
        <p class="lede">
          Not a prediction, a preference. Pick the world you would rather live in,
          build a piece of its technology, and we ship you the hardware to keep going.
        </p>

        <div class="cta-row">
          <a href={CONFIG.welcomeUrl} class="btn">Get onboarded</a>
          <a href="#how" class="btn-text">Read the protocol →</a>
        </div>
      </div>
    </div>
  </section>

  <!-- ───────────────────────── BRIEF ───────────────────────── -->
  <Reveal>
    <section class="window" id="brief">
      <header class="bar sec-bar">
        <h2>Three ways in</h2>
        <span class="sep" aria-hidden="true"></span>
        <p class="sec-sub">Pick one, or do all three. Whatever you build has to come from the world you chose.</p>
      </header>

      <div class="pane tracks">
        {#each TRACKS as t}
          <article class="track">
            <span class="badge" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                {#if t.icon === 'tool'}
                  <path d="M20 6a6 6 0 0 0-5.6 8.1L6 22.5V26h3.5l8.4-8.4A6 6 0 1 0 20 6Zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
                {:else if t.icon === 'seed'}
                  <path d="M16 27V15m0 0c0-5 4-9 10-9 0 6-4 10-10 10Zm0 0C16 10 12 6 6 6c0 6 4 9 10 9Z" fill="none" stroke-width="2.6" stroke-linecap="round" />
                {:else}
                  <path d="M16 13a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm-6.5-4.5a9 9 0 0 0 0 15m13 0a9 9 0 0 0 0-15M5 4.5a14 14 0 0 0 0 23m22 0a14 14 0 0 0 0-23" fill="none" stroke-width="2.4" stroke-linecap="round" />
                {/if}
              </svg>
            </span>
            <h3>{t.title}</h3>
            <p>{t.body}</p>
          </article>
        {/each}
      </div>
    </section>
  </Reveal>

  <!-- ───────────────────────── PROTOCOL ───────────────────────── -->
  <Reveal>
    <section class="window" id="how">
      <header class="bar sec-bar">
        <h2>The protocol</h2>
        <span class="sep" aria-hidden="true"></span>
        <p class="sec-sub">Five steps, in order. No application essay, no interview, no fee.</p>
      </header>

      <div class="pane steps">
        <span class="rail" aria-hidden="true"></span>
        <ol class="steps-list">
          {#each STEPS as s}
            <li class="step">
              <span class="bubble" aria-hidden="true">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          {/each}
        </ol>
        <a class="btn steps-cta" href={CONFIG.welcomeUrl}>Start at step one</a>
      </div>
    </section>
  </Reveal>

  <!-- ───────────────────────── SHOP (live) ───────────────────────── -->
  <Reveal>
    <section class="window" id="shop">
      <header class="bar sec-bar">
        <h2>The shop</h2>
        <span class="sep" aria-hidden="true"></span>
        <p class="sec-sub">
          Priced in tracked hours, cheapest first. Ship enough and you pick something off
          this list.
        </p>
        <a class="sec-bar-cta btn-text" href={CONFIG.programUrl}>Full shop →</a>
      </header>

      <div class="pane shop">
        <Droplets count={8} seed={21} opacity={0.4} />

        {#if api.loading}
          <p class="msg">Loading the live shop…</p>
        {:else if api.prizes.length}
          <ul class="grid">
            {#each api.prizes as p, i}
              <li class="card" class:sold-out={p.stock === 0}>
                <div class="thumb">
                  {#if p.imageUrl && !brokenImages.has(p.id)}
                    <!-- first row eager, so thumbnails are not blank on arrival -->
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      loading={i < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                      onerror={() => markBroken(p.id)}
                    />
                  {:else}
                    <!-- no photo on this item yet: a glossy plate, not a broken frame -->
                    <span class="plate" aria-hidden="true">{p.name.trim().slice(0, 1)}</span>
                  {/if}
                  {#if p.isFeatured}<span class="ribbon label">featured</span>{/if}
                </div>

                <div class="card-body">
                  <h3>{p.name}</h3>
                  {#if p.description}<p class="card-desc">{p.description}</p>{/if}

                  <dl class="card-stats">
                    <div>
                      <dt class="label">cost</dt>
                      <dd class="price">{priceLabel(p)}</dd>
                    </div>
                    {#if p.minHoursRequired > 0}
                      <div>
                        <dt class="label">unlocks at</dt>
                        <dd class="mono">{hoursLabel(p.minHoursRequired)}</dd>
                      </div>
                    {/if}
                  </dl>


                  <!-- always rendered, so every card's footer sits on the same line -->
                  <p class="card-foot hud">{noteLine(p)}</p>

                  <a class="btn btn-glass btn-sm card-cta" href={CONFIG.shopUrl}>View on website</a>
                </div>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="msg">
            No items are listed right now. The shop is filled in on Stern, so check
            <a href={CONFIG.programUrl}>the program page</a> for what is live.
          </p>
        {/if}
      </div>
    </section>
  </Reveal>

  <!-- ───────────────────────── RULES ───────────────────────── -->
  <Reveal>
    <div id="rules">
      <Rules
        label={RULES.label}
        title={RULES.title}
        intro={RULES.intro}
        items={RULES.items}
        requirements={api.rules?.requirements}
        aiPercent={api.rules?.ai?.maxPercent}
      />
    </div>
  </Reveal>

  <!-- ───────────────────────── NEWS (live, hidden when empty) ─────────── -->
  {#if api.news.length}
    <Reveal>
      <section class="window" id="news">
        <header class="bar sec-bar">
          <h2>Latest news</h2>
          <span class="sep" aria-hidden="true"></span>
          <p class="sec-sub">Announcements from the people running the program.</p>
        </header>
        <div class="pane feed">
          {#each api.news as item}
            <article class="entry">
              {#if item.title}<h3>{item.title}</h3>{/if}
              {#if item.publishedAt}<p class="hud">{new Date(item.publishedAt).toLocaleDateString()}</p>{/if}
              {#if item.body || item.content}<p>{item.body || item.content}</p>{/if}
            </article>
          {/each}
        </div>
      </section>
    </Reveal>
  {/if}

  <!-- ───────────────────────── EVENTS (live, hidden when empty) ───────── -->
  {#if api.events.length}
    <Reveal>
      <section class="window" id="events">
        <header class="bar sec-bar">
          <h2>What's coming up</h2>
          <span class="sep" aria-hidden="true"></span>
          <p class="sec-sub">Still to come on the schedule.</p>
        </header>
        <div class="pane feed">
          {#each api.events as ev}
            <article class="entry">
              {#if ev.name || ev.title}<h3>{ev.name || ev.title}</h3>{/if}
              {#if ev.startsAt}<p class="hud">{new Date(ev.startsAt).toLocaleString()}</p>{/if}
              {#if ev.description}<p>{ev.description}</p>{/if}
            </article>
          {/each}
        </div>
      </section>
    </Reveal>
  {/if}

  <!-- ───────────────────────── FAQ (live) ───────────────────────── -->
  <Reveal>
    <section class="window" id="faq">
      <header class="bar sec-bar">
        <h2>Questions</h2>
        <span class="sep" aria-hidden="true"></span>
        <p class="sec-sub">Straight from the program. Anything missing, ask in the Slack.</p>
      </header>

      <div class="pane faq">
        {#if api.loading}
          <p class="msg">Loading questions…</p>
        {:else if api.faq.length}
          {#each api.faq as item, i}
            <div class="qa" class:open={openFaq === i}>
              <button class="qa-q" onclick={() => toggle(i)} aria-expanded={openFaq === i}>
                <span class="qa-text">{item.question}</span>
                <span class="qa-sign" aria-hidden="true">{openFaq === i ? '–' : '+'}</span>
              </button>
              {#if openFaq === i}
                <p class="qa-a">{item.answer}</p>
              {/if}
            </div>
          {/each}
        {:else}
          <p class="msg">
            Questions could not be loaded. Ask in <a href={CONFIG.slackUrl}>the Slack</a> and
            someone will answer.
          </p>
        {/if}
      </div>
    </section>
  </Reveal>

  <!-- ───────────────────────── CTA ───────────────────────── -->
  <Reveal>
    <section class="pane cta" id="signup">
      <Droplets count={12} seed={33} opacity={0.5} />
      <div class="cta-orb" aria-hidden="true"><Orb size={300} spin={30} /></div>
      <div class="cta-inner">
        <p class="label">now boarding</p>
        <h2>Go build it.</h2>
        <p class="cta-sub">
          Free, open to every teenager on earth, and the only requirement is that you finish.
          Bring an idea, leave with hardware.
        </p>
        <div class="cta-row center">
          <a href={CONFIG.welcomeUrl} class="btn">Sign up now</a>
          <a href={CONFIG.slackUrl} class="btn btn-glass">Join the Slack</a>
        </div>
      </div>
    </section>
  </Reveal>

  <footer class="pane footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="brand"><span class="brand-dot" aria-hidden="true"></span>{CONFIG.name}<sup>®</sup></span>
        <p class="label">build the future · ship the future · keep the hardware</p>
        <a class="archer label" href={CONFIG.archer.url} target="_blank" rel="noopener">
          ↳ part of the {CONFIG.archer.name} YSWS, join on Slack
        </a>
      </div>
      <nav class="footer-links label">
        <a href={CONFIG.welcomeUrl}>get onboarded</a>
        <a href={CONFIG.programUrl}>program</a>
        <a href={CONFIG.slackUrl}>slack</a>
        <a href={CONFIG.hackatimeUrl}>hackatime</a>
        <a href="https://ysws.hackclub.com/">all ysws</a>
        <a href="https://hackclub.com">hack club</a>
      </nav>
    </div>
    <p class="disclaimer label">A Hack Club YSWS · made by teenagers, for teenagers.</p>
  </footer>
</main>

{/if}

<style>
  /* ── FLAG ── */
  .flag {
    position: fixed;
    top: 0;
    left: 22px;
    z-index: 300;
    line-height: 0;
    transform-origin: top center;
    transition: transform 0.3s var(--ease);
  }
  .flag img { width: 196px; height: auto; filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.4)); }
  .flag:hover { transform: rotate(3deg) translateY(3px); }

  /* ── PAGE STACK ── */
  .stack {
    display: grid;
    /* minmax(0,1fr), not the implicit auto column, or the widest child
       (the shop table) sizes the whole stack and overflows small screens */
    grid-template-columns: minmax(0, 1fr);
    gap: clamp(16px, 2.4vw, 26px);
    padding-top: clamp(112px, 12vw, 152px);
    padding-bottom: clamp(30px, 5vw, 54px);
  }

  /* ── SHARED BARS ── */
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    font-family: var(--display);
    font-weight: 600;
    font-size: 1.18rem;
    letter-spacing: 0.06em;
    color: var(--ink);
    text-shadow: var(--etch);
  }
  .brand sup { font-size: 0.44em; font-weight: 400; top: -0.9em; color: var(--ink-3); }
  .brand-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: radial-gradient(circle at 34% 26%, #fff 4%, var(--aqua-lt) 22%, var(--aqua) 58%, var(--aqua-dk) 100%);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 -2px 3px rgba(0, 0, 0, 0.25);
  }

  .hero-bar,
  .sec-bar {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 0 20px;
    min-height: 52px;
  }
  .sec-bar { padding-block: 12px; }
  .sec-bar h2 { font-size: 1.5rem; font-weight: 300; white-space: nowrap; }
  .sec-sub { margin: 0; font-size: 0.98rem; color: var(--ink-2); max-width: 66ch; }
  .sec-bar-cta { margin-left: auto; padding-block: 8px; white-space: nowrap; }
  .hero-kicker { flex: 1; }
  .hero-bar-cta { margin-left: auto; padding-block: 8px; }

  /* ── HERO ── */
  .hero-pane {
    display: grid;
    grid-template-columns: 336px minmax(0, 1fr);
    align-items: center;
    gap: clamp(20px, 3vw, 46px);
    padding: clamp(24px, 3.4vw, 44px);
    overflow: hidden;
  }
  .hero-figure { display: grid; justify-items: center; }
  .orb-wrap {
    --mx: 0;
    --my: 0;
    width: 100%;
    transform: translate3d(calc(var(--mx) * -18px), calc(var(--my) * -14px), 0);
    transition: transform 0.6s var(--ease);
  }
  .hero-copy h1 {
    font-size: clamp(2.3rem, 4.6vw, 3.7rem);
    font-weight: 200;
    letter-spacing: -0.01em;
    animation: rise 0.9s var(--ease) both;
  }
  .lede {
    max-width: 52ch;
    margin: 18px 0 0;
    font-size: clamp(1.02rem, 1.4vw, 1.14rem);
    color: var(--ink-2);
    animation: rise 0.9s 0.1s var(--ease) both;
  }

  /* ── WORLD PICKER (the signature) ── */
  .picker {
    width: 100%;
    margin-top: 6px;
    text-align: center;
    animation: rise 0.9s 0.2s var(--ease) both;
  }
  .picker-label { display: block; margin-bottom: 8px; font-size: 0.64rem; }
  .segment {
    position: relative;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    width: 100%;
    padding: 3px;
    border-radius: var(--r-pill);
  }
  .knob {
    position: absolute;
    top: 3px;
    bottom: 3px;
    left: 3px;
    width: calc((100% - 6px) / 3);
    border-radius: var(--r-pill);
    border: 1px solid var(--pill-ln);
    background-image:
      linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.18) 49.6%, rgba(255, 255, 255, 0) 50%),
      linear-gradient(180deg, var(--pill-hi) 0%, var(--pill-lo) 100%);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.7);
    transform: translateX(calc(var(--i) * 100%));
    transition: transform 0.45s var(--ease);
  }
  .seg {
    position: relative;
    z-index: 1;
    padding: 7px 8px;
    border: none;
    background: none;
    font-family: var(--display);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--ink-2);
    text-shadow: var(--etch);
    transition: color 0.3s;
    white-space: nowrap;
  }
  .seg.on { color: var(--pill-tx); text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35); }
  .world-tag {
    margin: 12px 0 0;
    font-size: 0.9rem;
    color: var(--ink-2);
    animation: fade-up 0.5s var(--ease) both;
  }
  .world-tag em { font-style: normal; font-weight: 700; color: var(--accent); }
  .world-hud { margin: 6px 0 0; font-size: 0.68rem; animation: fade-up 0.5s 0.08s var(--ease) both; }

  .cta-row { display: flex; align-items: center; gap: 20px; margin-top: 32px; flex-wrap: wrap; }
  .cta-row.center { justify-content: center; }

  /* ── TRACKS ── */
  .tracks {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 4px;
  }
  .track {
    padding: 26px 24px 30px;
    border-radius: var(--r-md);
    transition: background 0.3s;
  }
  .track + .track { box-shadow: inset 2px 0 0 rgba(255, 255, 255, 0.14); }
  .track:hover { background: rgba(255, 255, 255, 0.07); }
  .track h3 { margin-top: 18px; font-size: 1.18rem; font-weight: 600; }
  .track p { margin: 10px 0 0; color: var(--ink-2); font-size: 0.98rem; }
  .badge {
    display: grid;
    place-items: center;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background: radial-gradient(circle at 34% 24%, #fff 1%, var(--aqua-lt) 13%, var(--aqua) 45%, var(--aqua-dk) 100%);
    box-shadow: 0 8px 14px rgba(0, 0, 0, 0.38), inset 0 -3px 6px rgba(0, 0, 0, 0.3), inset 0 2px 3px rgba(255, 255, 255, 0.85);
  }
  .badge svg {
    width: 30px;
    height: 30px;
    fill: #fff;
    stroke: #fff;
    filter: drop-shadow(0 1px 2px rgba(0, 20, 40, 0.5));
  }

  /* ── STEPS ── */
  .steps { padding: 10px 26px 24px; }
  .rail {
    position: absolute;
    left: 50px;
    top: 44px;
    bottom: 100px;
    width: 3px;
    border-radius: 3px;
    background: linear-gradient(180deg, var(--aqua-lt), var(--aqua), var(--accent));
    opacity: 0.5;
  }
  .steps-list { list-style: none; margin: 0; padding: 0; }
  .step {
    position: relative;
    display: grid;
    grid-template-columns: 48px 1fr;
    gap: 20px;
    align-items: start;
    padding: 18px 0;
  }
  .step + .step { border-top: 1px solid rgba(255, 255, 255, 0.14); }
  .bubble {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-family: var(--mono);
    font-size: 0.96rem;
    color: #fff;
    text-shadow: 0 1px 3px rgba(0, 30, 50, 0.7);
    background: radial-gradient(circle at 36% 24%, #fff 1%, var(--aqua-lt) 12%, var(--aqua) 46%, var(--aqua-dk) 100%);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.38), inset 0 -3px 6px rgba(0, 0, 0, 0.3), inset 0 2px 3px rgba(255, 255, 255, 0.8);
  }
  .step h3 { font-size: 1.14rem; font-weight: 600; }
  .step p { margin: 6px 0 0; color: var(--ink-2); max-width: 64ch; }
  .steps-cta { margin: 18px 0 0 68px; }

  /* ── SHOP ── */
  .shop { padding: 20px 26px 24px; overflow: hidden; }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(238px, 1fr));
    /* every row as tall as the tallest, so the whole grid reads as one block
       instead of rows that each find their own height */
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

  /* product plate: an inset window so photos read as objects under glass */
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
  /* max-*, not width/height: an image's intrinsic size must never grow the
     plate, or cards in a row end up with mismatched thumbnails */
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

  .card.sold-out .thumb { opacity: 0.5; }
  .card.sold-out .card-body { opacity: 0.78; }

  .card-body { display: flex; flex-direction: column; flex: 1; padding: 16px 16px 18px; }
  .card-body h3 { font-size: 1.08rem; font-weight: 600; }
  .card-desc { margin: 8px 0 0; color: var(--ink-2); font-size: 0.92rem; }

  .card-stats {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 14px;
    margin: 16px 0 0;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.14);
  }
  .card-stats div { display: grid; gap: 3px; }
  .card-stats div:last-child { justify-items: end; text-align: right; }
  .card-stats dd { margin: 0; color: var(--ink-2); font-size: 0.88rem; white-space: nowrap; }
  .card-stats { margin-top: auto; }
  .card-foot { margin: 9px 0 0; min-height: 1.1em; }
  .card-cta { width: 100%; margin-top: 12px; }

  .price {
    font-family: var(--display);
    font-weight: 700;
    font-size: 1.08rem;
    color: var(--accent);
    text-shadow: var(--etch);
    white-space: nowrap;
  }
  .msg { margin: 20px 6px 16px; color: var(--ink-2); }
  .msg a { color: var(--accent); text-decoration: underline; }

  /* ── NEWS / EVENTS ── */
  .feed { display: grid; gap: 2px; padding: 8px 26px 18px; }
  .entry { padding: 16px 6px; }
  .entry + .entry { border-top: 1px solid rgba(255, 255, 255, 0.14); }
  .entry h3 { font-size: 1.12rem; font-weight: 600; }
  .entry p { margin: 6px 0 0; color: var(--ink-2); max-width: 70ch; }

  /* ── FAQ ── */
  .faq { padding: 6px 22px 14px; }
  .qa + .qa { border-top: 1px solid rgba(255, 255, 255, 0.14); }
  .qa-q {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 32px;
    align-items: center;
    gap: 14px;
    padding: 17px 4px;
    background: none;
    border: none;
    text-align: left;
    color: var(--ink);
  }
  .qa-text { font-family: var(--display); font-weight: 600; font-size: 1.06rem; text-shadow: var(--etch); }
  .qa-sign {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    font-family: var(--display);
    font-size: 1.15rem;
    font-weight: 600;
    color: #fff;
    background: radial-gradient(circle at 36% 26%, #fff 2%, var(--aqua-lt) 18%, var(--aqua) 58%, var(--aqua-dk) 100%);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.3);
  }
  .qa.open .qa-sign { background: radial-gradient(circle at 36% 26%, #fff 2%, var(--lime) 20%, var(--grass) 64%, var(--grass-dk) 100%); }
  .qa-a {
    margin: 0;
    padding: 0 46px 20px 4px;
    color: var(--ink-2);
    max-width: 82ch;
    animation: fade-up 0.36s var(--ease) both;
  }

  /* ── CTA ── */
  .cta {
    position: relative;
    overflow: hidden;
    padding: clamp(48px, 7vw, 86px) 24px;
    text-align: center;
  }
  .cta-orb {
    position: absolute;
    top: 50%;
    left: 50%;
    width: min(72vw, 380px);
    transform: translate(-50%, -50%);
    opacity: 0.32;
  }
  .cta-inner { position: relative; z-index: 2; }
  .cta h2 { margin: 12px 0 0; font-size: clamp(2.2rem, 6vw, 4rem); font-weight: 200; }
  .cta-sub {
    max-width: 48ch;
    margin: 16px auto 30px;
    font-size: 1.1rem;
    color: var(--ink-2);
  }

  /* ── FOOTER ── */
  .footer { padding: 22px 24px 20px; }
  .footer-inner {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }
  .footer-brand .label { margin: 8px 0 0; }
  .archer { display: inline-block; margin-top: 10px; color: var(--accent); }
  .archer:hover { text-decoration: underline; }
  .footer-links { display: flex; gap: 20px; flex-wrap: wrap; }
  .footer-links a { color: var(--ink-2); transition: color 0.16s; }
  .footer-links a:hover { color: var(--accent); text-decoration: underline; }
  .disclaimer {
    position: relative;
    z-index: 1;
    margin: 22px 0 0;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.16);
    color: var(--ink-3);
  }

  /* ── MOTION ── */
  @keyframes rise {
    from { opacity: 0; transform: translateY(22px); }
    to { opacity: 1; transform: none; }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: none; }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 960px) {
    .hero-pane { grid-template-columns: minmax(0, 1fr); }
    .hero-figure { grid-row: 1; }
    .orb-wrap { width: min(62%, 240px); }
    .picker { max-width: 420px; margin-top: 14px; }
    .tracks { grid-template-columns: 1fr; }
    .track + .track { box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.14); }
    .sec-bar { flex-wrap: wrap; gap: 10px 16px; }
    .sec-bar .sep { display: none; }
    .sec-bar-cta { margin-left: 0; }
  }
  @media (max-width: 640px) {
    .flag { left: 12px; }
    .flag img { width: 138px; }
    .stack { padding-top: 106px; }
    .hero-bar { flex-wrap: wrap; padding-block: 12px; }
    .hero-bar .sep,
    .hero-kicker { display: none; }
    .hero-bar-cta { margin-left: 0; }
    .shop { padding: 16px 14px 18px; }
    /* minmax(0,…) so a track may shrink under the stats row's min-content,
       which otherwise forces a single card per row */
    .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .card-body { padding: 13px 13px 15px; }
    .card-body h3 { font-size: 1rem; }
    .card-desc { font-size: 0.86rem; }
    .card-stats { gap: 8px; margin-top: auto; padding-top: 10px; }
    .card-stats .label { font-size: 0.6rem; letter-spacing: 0.1em; }
    .card-stats dd { font-size: 0.8rem; }
    .price { font-size: 0.94rem; }
    .steps { padding-inline: 14px; }
    .rail { left: 36px; }
    .step { grid-template-columns: 40px 1fr; gap: 14px; }
    .bubble { width: 38px; height: 38px; font-size: 0.86rem; }
    .steps-cta { margin-left: 0; }
    /* stays a real segmented control, just sized to fit a phone */
    .seg { padding: 8px 4px; font-size: 0.78rem; }
  }
</style>
