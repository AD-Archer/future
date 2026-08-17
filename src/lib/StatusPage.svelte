<script>
  // 404 and 500. Same world, one screen, and the way back is the only control.
  import Sky from './Sky.svelte'
  import Mark from './Mark.svelte'
  import Brand from './Brand.svelte'
  import { CONFIG } from './data.js'

  let {
    code = '404',
    title = 'Nothing was built here.',
    body = 'These coordinates come back empty.',
    detail = ''
  } = $props()
</script>

<svelte:head>
  <title>{code} · {CONFIG.name}</title>
</svelte:head>

<Sky />

<main class="shell col">
  <div class="figure"><Mark size={200} /></div>

  <div class="window">
    <header class="titlebar">
      <Brand size={24} href="/" label="FUTURE, home" />
      <span class="sep" aria-hidden="true"></span>
      <p class="code hud">Error {code}</p>
    </header>

    <div class="panel-body">
      <h1>{title}</h1>
      <p class="body-text">{body}</p>
      {#if detail}<p class="detail mono">{detail}</p>{/if}
      <div class="actions">
        <a class="gel btn" href="/" data-analytics="CTA: Click" data-analytics-placement="status-home">Back to {CONFIG.name}</a>
        <a class="gel btn btn-blue" href={CONFIG.slackUrl} data-analytics="CTA: Click" data-analytics-placement="status-slack">Join the Slack</a>
      </div>
    </div>
  </div>
</main>

<style>
  .shell {
    min-height: 100svh;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: 22px;
    padding-block: clamp(60px, 10vh, 120px);
  }
  .window { width: 100%; }

  h1 { font-size: var(--t-h2); }
  .body-text { margin-top: 10px; max-width: 46ch; color: var(--ink-2); }

  .detail {
    max-width: 56ch;
    margin-top: 14px;
    padding: 10px 12px;
    border-radius: var(--r-sm);
    border: 1px solid var(--panel-edge);
    background: #fff;
    color: var(--ink-2);
    font-size: var(--t-xs);
    overflow-wrap: anywhere;
  }

  .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
  .code { white-space: nowrap; }
</style>
