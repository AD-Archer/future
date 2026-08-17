<script>
  // The lockup: the mark, then the name. Used in the footer and status pages.
  let { size = 34, name = 'FUTURE', href = '', label = '' } = $props()
</script>

<svelte:element
  this={href ? 'a' : 'span'}
  class="brand"
  href={href || undefined}
  aria-label={label || undefined}
  style="--mark:{size}px"
>
  <img class="mark" src="/dolphin.webp" alt="" width="500" height="500" />
  <span class="word">{name}</span>
</svelte:element>

<style>
  .brand {
    display: inline-flex;
    align-items: center;
    gap: calc(var(--mark) * 0.24);
    flex: 0 0 auto;
    line-height: 1;
  }
  .mark {
    width: var(--mark);
    height: var(--mark);
    filter: drop-shadow(0 1px 2px rgba(12, 52, 90, 0.35));
  }
  .word {
    font-size: calc(var(--mark) * 0.46);
    font-weight: 700;
    letter-spacing: 0.28em;
    margin-right: -0.28em;
    color: var(--ink);
    white-space: nowrap;
  }
  a.brand:hover .word { color: var(--link); }
</style>
