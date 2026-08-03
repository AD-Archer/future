<script>
  let { children, delay = 0 } = $props()
  let el = $state()

  $effect(() => {
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('in')
            io.unobserve(el)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  })
</script>

<div class="reveal" bind:this={el} style="transition-delay:{delay}ms">
  {@render children()}
</div>
