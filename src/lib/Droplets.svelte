<script>
  // Water beaded on smoked glass. Every part of a drop is drawn as *light* —
  // a faint body, a hard specular dot, and a bright lower rim — so a bead can
  // only ever lift the glass behind it, never smudge it.
  //   <Droplets count={9} seed={3} />
  import { untrack } from 'svelte'

  let { count = 8, seed = 1, opacity = 0.9 } = $props()

  const uid = `dp${++counter}`

  // the bead pattern is generated once at mount
  const [n, s] = untrack(() => [count, seed])

  function lcg(seedValue) {
    return () => ((seedValue = (seedValue * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
  }

  const r = lcg(s * 7919 + 13)
  const drops = Array.from({ length: n }, () => {
    const size = 0.7 + r() * 1.9
    return {
      x: 5 + r() * 90,
      y: 6 + r() * 88,
      rx: size,
      ry: size * (0.82 + r() * 0.26),
      rot: (r() - 0.5) * 50,
      dur: 5000 + r() * 5000,
      delay: -r() * 6000
    }
  })
</script>

<svg class="droplets" style="opacity:{opacity}" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <radialGradient id="{uid}-body" cx="36%" cy="28%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3" />
      <stop offset="55%" stop-color="#ffffff" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.16" />
    </radialGradient>
  </defs>

  {#each drops as d}
    <g class="drop" style="animation-duration:{d.dur}ms; animation-delay:{d.delay}ms">
      <g transform="rotate({d.rot} {d.x} {d.y})">
        <!-- body -->
        <ellipse cx={d.x} cy={d.y} rx={d.rx} ry={d.ry} fill="url(#{uid}-body)" />
        <!-- lower rim catching light through the bead -->
        <ellipse
          cx={d.x}
          cy={d.y}
          rx={d.rx}
          ry={d.ry}
          fill="none"
          stroke="#ffffff"
          stroke-opacity="0.34"
          stroke-width={d.rx * 0.14}
          stroke-dasharray="{d.rx * 2.6} {d.rx * 4}"
          transform="rotate(58 {d.x} {d.y})"
        />
        <!-- specular pin-prick -->
        <ellipse
          cx={d.x - d.rx * 0.34}
          cy={d.y - d.ry * 0.36}
          rx={d.rx * 0.24}
          ry={d.ry * 0.18}
          fill="#ffffff"
          fill-opacity="0.85"
        />
      </g>
    </g>
  {/each}
</svg>

<style>
  .droplets {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .drop {
    animation-name: bead;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    animation-direction: alternate;
    transform-box: fill-box;
    transform-origin: center;
  }

  @keyframes bead {
    from { transform: scale(0.92); opacity: 0.7; }
    to { transform: scale(1.08); opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    .drop { animation: none; }
  }
</style>

<script module>
  let counter = 0
</script>
