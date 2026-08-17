<script>
  import { STEPS } from '../data.js'
  let { welcomeUrl = '' } = $props()
</script>

<section class="col" id="how">
  <div class="window">
    <header class="titlebar">
      <h2>The 5 steps</h2>
      <span class="sep" aria-hidden="true"></span>
    </header>

    <div class="panel-body">
      <ol class="steps">
        {#each STEPS as s}
          <li class="step">
            <span class="num gel" aria-hidden="true">{s.n}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </li>
        {/each}
      </ol>

      <a class="gel btn" href={welcomeUrl} data-analytics="CTA: Click"
        data-analytics-placement="protocol-onboarding">Start at step one</a>
    </div>
  </div>
</section>

<style>
  .steps { list-style: none; margin: 0 0 22px; padding: 0; }

  .step {
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 16px;
    align-items: start;
    padding: 15px 0;
  }
  .step + .step { border-top: 1px solid var(--panel-line); }

  .num {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    padding: 0;
    font-family: var(--mono);
    font-size: var(--t-sm);
  }

  h3 { font-size: var(--t-h3); }
  p { margin-top: 4px; font-size: var(--t-sm); color: var(--ink-2); max-width: 60ch; }

  @media (max-width: 560px) {
    .step { grid-template-columns: 36px minmax(0, 1fr); gap: 13px; }
    .num { width: 34px; height: 34px; font-size: var(--t-xs); }
  }
</style>
