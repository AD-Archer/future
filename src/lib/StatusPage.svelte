<script>
  import Sky from './Sky.svelte'
  import Orb from './Orb.svelte'
  import Droplets from './Droplets.svelte'
  import { CONFIG, WORLDS } from './data.js'

  let {
    code = '404',
    eyebrow = 'no such place',
    title = 'Nothing was built here.',
    body = 'These coordinates come back as open sky.',
    detail = ''
  } = $props()

  const world = WORLDS[0]
</script>

<svelte:head>
  <title>{code} · {CONFIG.name}</title>
</svelte:head>

<main class="shell">
  <Sky atmos={world.atmos} />

  <a class="flag" href={CONFIG.flagUrl} target="_blank" rel="noopener" aria-label="Hack Club">
    <img src="/branding/flag-orpheus-top.svg" alt="Hack Club" width="150" height="85" />
  </a>

  <section class="window wrap status" aria-labelledby="status-title">
    <header class="bar status-bar">
      <span class="brand"><img class="brand-logo" src="/Logo.svg" alt={CONFIG.name} /></span>
      <span class="sep" aria-hidden="true"></span>
      <span class="label">{eyebrow} · {code}</span>
    </header>

    <div class="pane status-pane">
      <Droplets count={8} seed={6} opacity={0.5} />

      <div class="figure" aria-hidden="true">
        <Orb size={280} />
        <span class="code mono">{code}</span>
      </div>

      <div class="copy">
        <h1 id="status-title">{title}</h1>
        <p class="body-text">{body}</p>
        {#if detail}
          <p class="detail mono">{detail}</p>
        {/if}
        <div class="actions">
          <a class="btn" href="/">Back to {CONFIG.name}</a>
          <a class="btn btn-glass" href={CONFIG.slackUrl}>Join the Slack</a>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  .shell {
    position: relative;
    min-height: 100svh;
    display: grid;
    align-items: center;
    padding: clamp(116px, 13vw, 160px) 0 clamp(30px, 5vw, 54px);
  }

  .flag {
    position: fixed;
    top: 0;
    left: 22px;
    z-index: 5;
    line-height: 0;
  }
  .flag img { width: 196px; height: auto; filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.4)); }

  .brand {
    display: inline-flex;
    align-items: center;
    flex: 0 0 auto;
  }
  .brand-logo {
    width: auto;
    height: clamp(30px, 4vw, 42px);
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.45));
  }

  .status-bar {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 12px 20px;
    min-height: 52px;
  }

  .status-pane {
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr);
    align-items: center;
    gap: clamp(20px, 3vw, 44px);
    padding: clamp(24px, 3.4vw, 44px);
    overflow: hidden;
  }

  .figure { position: relative; justify-self: center; }
  .code {
    position: absolute;
    top: -6px;
    left: 0;
    font-size: 3.2rem;
    line-height: 1;
    color: var(--ink);
    opacity: 0.22;
  }

  h1 {
    max-width: 18ch;
    font-size: clamp(2.1rem, 4.4vw, 3.4rem);
    font-weight: 200;
  }

  .body-text {
    max-width: 44ch;
    margin: 18px 0 0;
    font-size: 1.08rem;
    color: var(--ink-2);
  }

  .detail {
    max-width: 56ch;
    margin: 16px 0 0;
    padding: 11px 13px;
    border-radius: var(--r-sm);
    border-left: 3px solid var(--accent);
    background: rgba(0, 0, 0, 0.3);
    color: var(--ink-2);
    font-size: 0.8rem;
    overflow-wrap: anywhere;
  }

  .actions { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 28px; }

  @media (max-width: 900px) {
    .status-pane { grid-template-columns: 1fr; }
    .figure { grid-row: 1; width: min(68%, 240px); }
    .status-bar { flex-wrap: wrap; gap: 10px 16px; }
    .status-bar .sep { display: none; }
  }

  @media (max-width: 560px) {
    .flag { left: 12px; }
    .flag img { width: 138px; }
    .code { font-size: 2.4rem; }
  }
</style>
