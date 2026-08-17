<script>
  import { trackEvent } from '../insight.js'

  let { items = [], loading = false, slackUrl = '' } = $props()
  let open = $state(0)

  const toggle = (i) => {
    const next = open === i ? -1 : i
    open = next
    trackEvent('FAQ: Toggle', {
      index: i,
      state: next === i ? 'open' : 'close',
      question: items[i]?.question
    })
  }
</script>

<section class="col" id="faq">
  <div class="window">
    <header class="titlebar">
      <h2>Questions</h2>
      <span class="sep" aria-hidden="true"></span>
      <p>Anything missing, ask in the Slack.</p>
    </header>

    <div class="panel-body">
      {#if loading}
        <div aria-hidden="true">
          {#each [86, 68, 76, 58, 72] as w}
            <div class="row"><div class="skeleton" style="width:{w}%;height:1.1em"></div></div>
          {/each}
        </div>
      {:else if items.length}
        {#each items as item, i}
          <div class="qa" class:open={open === i}>
            <button class="q" onclick={() => toggle(i)} aria-expanded={open === i}>
              <span>{item.question}</span>
              <span aria-hidden="true"></span>
              <span class="sign gel" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                  <path d="M5 12h14" />
                  {#if open !== i}<path d="M12 5v14" />{/if}
                </svg>
              </span>
            </button>
            {#if open === i}<p class="a">{item.answer}</p>{/if}
          </div>
        {/each}
      {:else}
        <p class="msg">
          Questions could not be loaded. Ask in <a href={slackUrl}>the Slack</a> and
          someone will answer.
        </p>
      {/if}
    </div>
  </div>
</section>

<style>
  .row { padding: 14px 0; }
  .row + .row { border-top: 1px solid var(--panel-line); }

  .qa + .qa { border-top: 1px solid var(--panel-line); }

  .q {
    width: 100%;
    display: grid;
    grid-template-columns: minmax(0, var(--measure)) 1fr 26px;
    align-items: center;
    gap: 14px;
    padding: 14px 2px;
    background: none;
    border: none;
    text-align: left;
    font-size: var(--t-body);
    font-weight: 600;
    color: var(--ink);
  }
  .q:hover { color: var(--link); }

  .sign {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    padding: 0;
  }
  .sign svg { width: 13px; height: 13px; }
  .qa.open .sign {
    --gel-hi: var(--green-hi);
    --gel-lo: var(--green-lo);
    --gel-edge: var(--green-edge);
  }

  .a {
    padding: 0 40px 16px 2px;
    font-size: var(--t-sm);
    color: var(--ink-2);
    max-width: var(--measure);
  }

  .msg { color: var(--ink-2); }
  .msg a { color: var(--link); text-decoration: underline; }
</style>
