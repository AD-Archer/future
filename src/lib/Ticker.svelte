<script>
  // A marquee strip. Two identical runs slide by half the track width, so the
  // loop is seamless without measuring anything.
  //   <Ticker items={['Day 1 of 29', '29 days left']} />
  // `header` pins it across the top of the viewport as the page's only chrome
  let { items = [], speed = 46, header = false } = $props()
</script>

{#if items.length}
  <div class="ticker" class:header>
    <div class="track" style="--dur:{speed}s">
      {#each [0, 1] as copy}
        <ul class="run" aria-hidden={copy === 1 ? 'true' : null}>
          {#each items as item}
            <li>{item}</li>
          {/each}
        </ul>
      {/each}
    </div>
  </div>
{/if}

<style>
  .ticker {
    display: flex;
    align-items: center;
    height: 34px;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
    mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
  }

  /* pinned across the top: a thin gel strip, the era's status bar */
  .ticker.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 200;
    border-bottom: 1px solid rgba(6, 48, 92, 0.4);
    background-color: var(--bar-gel-top);
    background-image:
      linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.16) 47.9%, rgba(255, 255, 255, 0.02) 48%, rgba(255, 255, 255, 0.14) 100%),
      linear-gradient(180deg, var(--bar-gel-top) 0%, var(--blue-edge) 100%);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 2px 8px rgba(16, 58, 96, 0.28);
  }

  .track {
    display: flex;
    width: max-content;
    animation: slide var(--dur) linear infinite;
  }
  .ticker:hover .track,
  .ticker:focus-within .track { animation-play-state: paused; }

  .run { display: flex; align-items: center; list-style: none; margin: 0; padding: 0; }
  .run li {
    display: flex;
    align-items: center;
    padding: 0 18px;
    font-size: var(--t-micro);
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 1px 1px rgba(0, 34, 68, 0.5);
  }
  .run li::before {
    content: '';
    width: 6px;
    height: 6px;
    margin-right: 18px;
    border-radius: 50%;
    background: linear-gradient(180deg, var(--green-hi), var(--green-lo));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }

  @keyframes slide { to { transform: translateX(-50%); } }

  @media (prefers-reduced-motion: reduce) { .track { animation: none; } }
</style>
