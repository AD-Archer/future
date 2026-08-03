<script>
  import Sky from './lib/Sky.svelte'
  import Orb from './lib/Orb.svelte'
  import Droplets from './lib/Droplets.svelte'
  import Reveal from './lib/Reveal.svelte'
  import Rules from './lib/Rules.svelte'
  import StatusPage from './lib/StatusPage.svelte'
  import { CONFIG, WORLDS, TRACKS, STEPS, REWARDS, RULES, FAQ } from './lib/data.js'

  let openFaq = $state(0)
  let worldIndex = $state(0)
  let locationState = $state(readLocation())
  let runtimeError = $state('')
  let stage = $state()

  let world = $derived(WORLDS[worldIndex])
  const maxCost = Math.max(...REWARDS.map((r) => r.cost))

  const toggle = (i) => (openFaq = openFaq === i ? -1 : i)
  const validPaths = new Set(['/', '/index.html', '/404', '/error'])

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

<!-- Hack Club flag, hung from the top-left corner -->
<a class="flag" href={CONFIG.flagUrl} target="_blank" rel="noopener" aria-label="Hack Club">
  <img src="/branding/flag-orpheus-top.svg" alt="Hack Club" width="150" height="85" />
</a>

<main class="wrap stack">
  <!-- ───────────────────────── HERO ───────────────────────── -->
  <section class="window hero" id="top">
    <header class="bar hero-bar">
      <span class="brand"><span class="brand-dot" aria-hidden="true"></span>{CONFIG.name}<sup>®</sup></span>
      <span class="sep" aria-hidden="true"></span>
      <span class="hero-kicker label">Hack Club · You Ship, We Ship By Archer</span>
      <a class="hero-bar-cta btn-text" href={CONFIG.slackUrl}>Slack →</a>
    </header>

    <div class="pane hero-pane" bind:this={stage}>
      <Droplets count={9} seed={4} opacity={0.55} />

      <div class="hero-figure" aria-hidden="true">
        <Orb size={390} />
      </div>

      <div class="hero-copy">
        <h1>Build the future<br />you want to see.</h1>
        <p class="lede">
          Not a prediction a preference. Pick the world you would rather live in,
          build a piece of its technology, and we ship you the hardware to keep going.
        </p>

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
            <p class="world-tag"><em>{world.kicker}</em> {world.tag}</p>
            <p class="hud world-hud">▸ {world.hud}</p>
          {/key}
        </div>

        <div class="cta-row">
          <a href={CONFIG.signupUrl} class="btn">Start building</a>
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
        <p class="sec-sub">Pick one, or do all three whatever you build has to come from the world you chose.</p>
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
      </div>
    </section>
  </Reveal>

  <!-- ───────────────────────── DROPS / SHOP ───────────────────────── -->
  <Reveal>
    <section class="window" id="drops">
      <header class="bar sec-bar">
        <h2>The shop</h2>
        <span class="sep" aria-hidden="true"></span>
        <p class="sec-sub">
          One tracked hour is one drop. Stack them up and spend them on real gear,
          shipped anywhere we can post a parcel.
        </p>
      </header>

      <div class="pane shop">
        <Droplets count={9} seed={21} opacity={0.4} />
        <div class="shop-head label">
          <span>part</span><span>item</span><span class="shop-note">spec</span><span class="shop-cost">cost</span>
        </div>
        {#each REWARDS as r}
          <div class="shop-row">
            <span class="mono shop-code">{r.code}</span>
            <span class="shop-name">{r.name}</span>
            <span class="shop-note">{r.note}</span>
            <span class="shop-cost">
              <span class="price">{r.cost}<svg class="drop-glyph" viewBox="0 0 24 32" aria-hidden="true"><path d="M12 1C12 1 3 14 3 21a9 9 0 0 0 18 0C21 14 12 1 12 1Z" /><ellipse cx="9" cy="20" rx="2.4" ry="3.4" class="drop-spec" /></svg></span>
              <span class="meter" aria-hidden="true"><span style="width:{(r.cost / maxCost) * 100}%"></span></span>
            </span>
          </div>
        {/each}
      </div>
    </section>
  </Reveal>

  <!-- ───────────────────────── RULES ───────────────────────── -->
  <Reveal>
    <div id="rules">
      <Rules label={RULES.label} title={RULES.title} intro={RULES.intro} items={RULES.items} />
    </div>
  </Reveal>

  <!-- ───────────────────────── FAQ ───────────────────────── -->
  <Reveal>
    <section class="window" id="faq">
      <header class="bar sec-bar">
        <h2>Questions</h2>
        <span class="sep" aria-hidden="true"></span>
        <p class="sec-sub">Anything missing? Ask in the Slack someone answers within the hour.</p>
      </header>

      <div class="pane faq">
        {#each FAQ as item, i}
          <div class="qa" class:open={openFaq === i}>
            <button class="qa-q" onclick={() => toggle(i)} aria-expanded={openFaq === i}>
              <span class="qa-text">{item.q}</span>
              <span class="qa-sign" aria-hidden="true">{openFaq === i ? '–' : '+'}</span>
            </button>
            {#if openFaq === i}
              <p class="qa-a">{item.a}</p>
            {/if}
          </div>
        {/each}
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
          <a href={CONFIG.signupUrl} class="btn">Sign up now</a>
          <a href={CONFIG.slackUrl} class="btn btn-glass">Join the Slack</a>
        </div>
      </div>
    </section>
  </Reveal>

  <footer class="bar footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="brand"><span class="brand-dot" aria-hidden="true"></span>{CONFIG.name}<sup>®</sup></span>
        <p class="label">build the future · ship the future · spend the {CONFIG.currency.toLowerCase()}</p>
        <a class="archer label" href={CONFIG.archer.url} target="_blank" rel="noopener">
          ↳ part of the {CONFIG.archer.name} YSWS join on Slack
        </a>
      </div>
      <nav class="footer-links label">
        <a href={CONFIG.slackUrl}>slack</a>
        <a href={CONFIG.hackatimeUrl}>hackatime</a>
        <a href={CONFIG.rudderUrl}>rudder</a>
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
  .flag img { width: 138px; height: auto; filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.36)); }
  .flag:hover { transform: rotate(3deg) translateY(3px); }

  /* ── PAGE STACK ── */
  .stack {
    display: grid;
    gap: clamp(18px, 2.6vw, 30px);
    padding-top: clamp(84px, 9vw, 116px);
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
  .sec-sub { margin: 0; font-size: 0.98rem; color: var(--ink-2); max-width: 68ch; }
  .hero-kicker { flex: 1; }
  .hero-bar-cta { margin-left: auto; padding-block: 8px; }

  /* ── HERO ── */
  .hero-pane {
    display: grid;
    grid-template-columns: 380px minmax(0, 1fr);
    align-items: center;
    gap: clamp(20px, 3vw, 46px);
    padding: clamp(24px, 3.4vw, 44px);
    overflow: hidden;
  }
  .hero-figure {
    --mx: 0;
    --my: 0;
    justify-self: center;
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
  .picker { margin-top: 26px; animation: rise 0.9s 0.2s var(--ease) both; }
  .picker-label { display: block; margin-bottom: 9px; }
  .segment {
    position: relative;
    display: inline-grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    min-width: min(100%, 420px);
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
    padding: 9px 14px;
    border: none;
    background: none;
    font-family: var(--display);
    font-size: 0.94rem;
    font-weight: 600;
    color: var(--ink-2);
    text-shadow: var(--etch);
    transition: color 0.3s;
    white-space: nowrap;
  }
  .seg.on { color: var(--pill-tx); text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35); }
  .world-tag {
    margin: 15px 0 0;
    max-width: 56ch;
    font-size: 1rem;
    animation: fade-up 0.5s var(--ease) both;
  }
  .world-tag em { font-style: normal; font-weight: 700; color: var(--accent); }
  .world-hud { margin: 7px 0 0; animation: fade-up 0.5s 0.08s var(--ease) both; }

  .cta-row { display: flex; align-items: center; gap: 20px; margin-top: 26px; flex-wrap: wrap; }
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
  .track:hover .badge { animation: nudge 0.6s var(--ease); }

  /* ── STEPS ── */
  .steps { padding: 10px 26px 16px; }
  .rail {
    position: absolute;
    left: 50px;
    top: 44px;
    bottom: 44px;
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
    transition: transform 0.28s var(--ease);
  }
  .step + .step { border-top: 1px solid rgba(255, 255, 255, 0.14); }
  .step:hover { transform: translateX(5px); }
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
  .step:hover .bubble { background: radial-gradient(circle at 36% 24%, #fff 1%, var(--lime) 16%, var(--grass) 58%, var(--grass-dk) 100%); }
  .step h3 { font-size: 1.14rem; font-weight: 600; }
  .step p { margin: 6px 0 0; color: var(--ink-2); max-width: 64ch; }

  /* ── SHOP ── */
  .shop { padding: 6px 26px 18px; overflow: hidden; }
  .shop-head,
  .shop-row {
    display: grid;
    grid-template-columns: 70px 1.25fr 1.5fr 130px;
    align-items: center;
    gap: 18px;
    padding: 14px 6px;
  }
  .shop-head { padding-top: 16px; border-bottom: 2px solid rgba(255, 255, 255, 0.2); }
  .shop-row {
    position: relative;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: var(--r-sm);
    transition: background 0.25s, transform 0.25s var(--ease);
  }
  .shop-row:last-child { border-bottom: none; }
  .shop-row:hover { background: rgba(255, 255, 255, 0.08); transform: translateX(5px); }
  .shop-code { color: var(--ink-3); font-size: 0.84rem; }
  .shop-name { font-family: var(--display); font-weight: 600; font-size: 1.04rem; text-shadow: var(--etch); }
  .shop-note { color: var(--ink-2); font-size: 0.94rem; text-shadow: var(--etch); }
  .shop-cost { display: grid; gap: 7px; justify-items: end; }
  .price {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-family: var(--display);
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--accent);
    text-shadow: var(--etch);
  }
  .drop-glyph { width: 0.5em; height: 0.68em; fill: var(--accent); }
  .drop-glyph .drop-spec { fill: rgba(255, 255, 255, 0.8); }
  .meter {
    display: block;
    width: 100%;
    height: 6px;
    border-radius: var(--r-pill);
    background: rgba(0, 0, 0, 0.32);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }
  .meter span {
    display: block;
    height: 100%;
    border-radius: var(--r-pill);
    background: linear-gradient(90deg, var(--aqua-lt), var(--aqua));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }
  .shop-row:hover .meter span { background: linear-gradient(90deg, var(--lime), var(--grass)); }

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
  @keyframes nudge {
    0% { transform: translateY(0) scale(1); }
    45% { transform: translateY(-6px) scale(1.06); }
    100% { transform: translateY(0) scale(1); }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 960px) {
    .hero-pane { grid-template-columns: 1fr; }
    .hero-figure { grid-row: 1; width: min(74%, 280px); }
    .tracks { grid-template-columns: 1fr; }
    .track + .track { box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.14); }
    .sec-bar { flex-wrap: wrap; gap: 10px 16px; }
    .sec-bar .sep { display: none; }
  }
  @media (max-width: 640px) {
    .flag { left: 12px; }
    .flag img { width: 104px; }
    .stack { padding-top: 84px; }
    .hero-bar { flex-wrap: wrap; padding-block: 12px; }
    .hero-bar .sep,
    .hero-kicker { display: none; }
    .hero-bar-cta { margin-left: 0; }
    .shop { padding-inline: 14px; }
    .shop-head { display: none; }
    .shop-row {
      grid-template-columns: 1fr 112px;
      gap: 2px 14px;
      padding: 14px 4px;
    }
    .shop-code { grid-column: 1; grid-row: 1; }
    .shop-name { grid-column: 1; grid-row: 2; }
    .shop-note { grid-column: 1; grid-row: 3; }
    .shop-cost { grid-column: 2; grid-row: 1 / 4; align-content: center; }
    .steps { padding-inline: 14px; }
    .rail { left: 36px; }
    .step { grid-template-columns: 40px 1fr; gap: 14px; }
    .bubble { width: 38px; height: 38px; font-size: 0.86rem; }
    .segment { grid-auto-flow: row; grid-auto-columns: auto; border-radius: var(--r-md); }
    .knob { display: none; }
    .seg { border-radius: var(--r-pill); border: 1px solid transparent; }
    .seg.on {
      border-color: var(--pill-ln);
      background-image: linear-gradient(180deg, var(--pill-hi) 0%, var(--pill-lo) 100%);
    }
  }
</style>
