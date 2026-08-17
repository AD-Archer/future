<script>
  import { TRACKS } from '../data.js'
</script>

<section class="col" id="brief">
  <div class="window">
    <header class="titlebar">
      <h2>What can you make</h2>
    </header>

    <!-- A control-panel row, not three cards. Boxes around three identical
         icon-heading-text blocks is the laziest structure there is; hairline
         dividers and one big glossy icon each is what this era actually shipped. -->
    <div class="panel-body ways">
      {#each TRACKS as t}
        <article class="way">
          <span class="icon gel" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              {#if t.icon === 'cad'}
                <path d="M16 4 27 10.2v12.6L16 29 5 22.8V10.2Z" />
                <path d="M5 10.2 16 16.5l11-6.3M16 16.5V29" />
              {:else if t.icon === 'code'}
                <path d="M11.5 9.5 5 16l6.5 6.5M20.5 9.5 27 16l-6.5 6.5M18.5 7l-5 18" />
              {:else}
                <rect x="4" y="10.5" width="24" height="13" rx="2.5" />
                <rect x="11" y="14.5" width="10" height="5" rx="1" />
                <path d="M9.5 10.5V6M16 10.5V6M22.5 10.5V6" />
              {/if}
            </svg>
          </span>
          <h3>{t.title}</h3>
          <p>{t.body}</p>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .ways {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    padding: clamp(20px, 2.6vw, 30px) 0;
  }

  .way {
    display: grid;
    justify-items: center;
    align-content: start;
    text-align: center;
    padding: 4px clamp(14px, 2vw, 26px);
  }
  /* a hairline between, the way a control panel separates its groups */
  .way + .way { border-left: 1px solid var(--panel-line); }

  .icon {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    padding: 0;
  }
  .icon svg { width: 34px; height: 34px; }

  .way h3 { margin-top: 14px; font-size: var(--t-h3); }
  .way p {
    margin-top: 6px;
    max-width: 30ch;
    font-size: var(--t-sm);
    color: var(--ink-2);
  }

  @media (max-width: 760px) {
    .ways { grid-template-columns: minmax(0, 1fr); padding-block: 8px; }
    .way { padding-block: 20px; }
    .way + .way { border-left: none; border-top: 1px solid var(--panel-line); }
  }
</style>
