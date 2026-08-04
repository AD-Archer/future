<script>
  // A marquee strip. Two identical runs slide by half the track width, so the
  // loop is seamless without measuring anything.
  //   <Ticker items={['Day 1 of 29', '29 days left']} />
  // `header` pins it across the top of the viewport as the page's only chrome
  let { items = [], speed = 46, header = false } = $props()
</script>

{#if items.length}
  <div class="ticker bar" class:header>
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
    height: 44px;
    overflow: hidden;
    /* soften the ends so text never hard-cuts at the edge */
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
    mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
  }

  /* pinned across the top: square corners, lit edge underneath */
  .ticker.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 200;
    border-radius: 0;
    box-shadow:
      0 6px 16px rgba(0, 0, 0, 0.34),
      inset 0 1px 0 rgba(255, 255, 255, 0.28),
      inset 0 -1px 0 rgba(0, 0, 0, 0.5);
  }

  .track {
    display: flex;
    width: max-content;
    animation: slide var(--dur) linear infinite;
  }

  .ticker:hover .track,
  .ticker:focus-within .track { animation-play-state: paused; }

  .run {
    display: flex;
    align-items: center;
    gap: 0;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .run li {
    display: flex;
    align-items: center;
    padding: 0 22px;
    font-family: var(--display);
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    white-space: nowrap;
    color: var(--ink-2);
    text-shadow: var(--etch);
  }

  /* a glossy bead between entries */
  .run li::before {
    content: '';
    width: 7px;
    height: 7px;
    margin-right: 22px;
    border-radius: 50%;
    background: radial-gradient(circle at 34% 26%, #fff 6%, var(--accent) 55%, rgba(0, 0, 0, 0.6) 100%);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  @keyframes slide {
    to { transform: translateX(-50%); }
  }

  @media (prefers-reduced-motion: reduce) {
    .track { animation: none; }
  }
</style>
