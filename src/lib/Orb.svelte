<script>
  // The glossy sphere: a small world, turning, with a specular highlight, an
  // orbit ring and a wet reflection underneath. The one 3D object on the page.
  //   <Orb size={320} />
  let { size = 320, spin = 26 } = $props()

  // unique gradient/clip ids so several orbs can share a page
  const uid = `orb${++counter}`

  const reduce =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
</script>

<script module>
  let counter = 0
</script>

<div class="orb" style="width:{size}px">
  <svg viewBox="0 0 400 440" role="img" aria-label="A small glossy world, turning">
    <defs>
      <radialGradient id="{uid}-body" cx="34%" cy="26%" r="82%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="20%" stop-color="var(--aqua-lt)" />
        <stop offset="62%" stop-color="var(--aqua)" />
        <stop offset="100%" stop-color="var(--aqua-dk)" />
      </radialGradient>

      <radialGradient id="{uid}-shade" cx="72%" cy="82%" r="70%">
        <stop offset="0%" stop-color="var(--deep)" stop-opacity="0.55" />
        <stop offset="60%" stop-color="var(--deep)" stop-opacity="0.06" />
        <stop offset="100%" stop-color="var(--deep)" stop-opacity="0" />
      </radialGradient>

      <radialGradient id="{uid}-spec" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
        <stop offset="70%" stop-color="#ffffff" stop-opacity="0.22" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </radialGradient>

      <radialGradient id="{uid}-halo" cx="50%" cy="50%" r="50%">
        <stop offset="55%" stop-color="var(--aqua)" stop-opacity="0.32" />
        <stop offset="100%" stop-color="var(--aqua)" stop-opacity="0" />
      </radialGradient>

      <linearGradient id="{uid}-land" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--lime)" />
        <stop offset="100%" stop-color="var(--grass)" />
      </linearGradient>

      <linearGradient id="{uid}-mirror" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--aqua)" stop-opacity="0.4" />
        <stop offset="100%" stop-color="var(--aqua)" stop-opacity="0" />
      </linearGradient>

      <clipPath id="{uid}-clip">
        <circle cx="200" cy="190" r="132" />
      </clipPath>

      <filter id="{uid}-soft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="9" />
      </filter>

      <filter id="{uid}-blur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="5" />
      </filter>

      <!-- fractal-noise cloud texture: the single thing a generic gradient
           "planet" icon always skips, and the thing that reads as Earth from
           orbit rather than a sphere primitive the moment it appears -->
      <filter id="{uid}-clouds" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.014 0.05" numOctaves="3" seed="7" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 3.6 -1.7" />
      </filter>
    </defs>

    <!-- atmospheric halo -->
    <circle cx="200" cy="190" r="186" fill="url(#{uid}-halo)" />

    <!-- orbit ring, behind -->
    <g class="ring">
      <ellipse cx="200" cy="196" rx="172" ry="52" fill="none" stroke="var(--glass-ln)" stroke-width="2" stroke-opacity="0.7" />
      <ellipse cx="200" cy="196" rx="172" ry="52" fill="none" stroke="#fff" stroke-width="6" stroke-opacity="0.28" stroke-dasharray="4 26" />
    </g>

    <!-- sphere -->
    <circle cx="200" cy="190" r="132" fill="url(#{uid}-body)" />

    <g clip-path="url(#{uid}-clip)">
      <!-- turning landmasses: two copies scrolling, so it loops seamlessly -->
      <g class="turn">
        {#each [0, 400] as offset}
          <g transform="translate({offset} 0)" fill="url(#{uid}-land)" opacity="0.92">
            <path d="M36 148 C74 126 104 150 128 138 C152 126 168 152 150 176 C132 200 96 194 70 208 C46 220 22 200 30 178 Z" />
            <path d="M186 108 C214 96 244 118 236 140 C228 162 196 158 180 142 C166 128 170 116 186 108 Z" />
            <path d="M244 196 C282 180 328 202 340 232 C350 258 316 274 288 262 C260 250 232 226 244 196 Z" />
            <path d="M92 258 C120 248 150 266 142 284 C134 302 104 300 88 288 C74 278 76 264 92 258 Z" />
          </g>
        {/each}
      </g>

      <!-- meridians -->
      <g fill="none" stroke="#fff" stroke-opacity="0.24" stroke-width="1.4">
        <ellipse cx="200" cy="190" rx="132" ry="46" />
        <ellipse cx="200" cy="190" rx="132" ry="94" />
        <ellipse cx="200" cy="190" rx="60" ry="132" />
        <ellipse cx="200" cy="190" rx="112" ry="132" />
      </g>

      <!-- cloud deck: fractal-noise texture, drifting independently of the
           land so the two layers read at different depths, the way weather
           actually scrolls faster than coastline from orbit -->
      <g class="turn-clouds" opacity="0.55">
        {#each [0, 400] as offset}
          <rect x={offset - 40} y="0" width="480" height="380" filter="url(#{uid}-clouds)" />
        {/each}
      </g>

      <!-- terminator -->
      <circle cx="200" cy="190" r="132" fill="url(#{uid}-shade)" />

      <!-- big top gloss -->
      <ellipse class="sheen" cx="168" cy="106" rx="86" ry="50" fill="url(#{uid}-spec)" filter="url(#{uid}-blur)" />

      <!-- rim light, lower right -->
      <path
        d="M200 322 A132 132 0 0 0 326 214"
        fill="none"
        stroke="var(--lime)"
        stroke-opacity="0.75"
        stroke-width="7"
        stroke-linecap="round"
        filter="url(#{uid}-blur)"
      />
    </g>

    <!-- hard glint -->
    <ellipse class="glint" cx="150" cy="96" rx="26" ry="14" fill="#fff" opacity="0.9" transform="rotate(-24 150 96)" />

    <!-- orbit ring, front + a planted flag riding the exact arc: not a
         generic orbiting satellite dot, but a marker for the real place
         you're building from — the "ship a real piece of it" premise,
         staked into the globe rather than floating past it -->
    <g class="ring">
      <path d="M28 196 A172 52 0 0 0 372 196" fill="none" stroke="#fff" stroke-width="2.5" stroke-opacity="0.85" />
      <g transform={reduce ? 'translate(330 176)' : null}>
        <circle cx="0" cy="6" r="12" fill="#fff" opacity="0.3" filter="url(#{uid}-soft)" />
        <line x1="0" y1="10" x2="0" y2="-9" stroke="#fff" stroke-width="1.6" stroke-linecap="round" />
        <path d="M0,-9 L9.5,-5.2 L0,-1.4 Z" fill="var(--lime)" stroke="#fff" stroke-width="0.6" stroke-linejoin="round" />
        <circle cx="0" cy="10" r="2.4" fill="#fff" />
        {#if !reduce}
          <animateMotion
            path="M28 196 A172 52 0 0 0 372 196"
            dur="{spin}s"
            keyPoints="0;1;0"
            keyTimes="0;0.5;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        {/if}
      </g>
    </g>

    <!-- wet reflection -->
    <ellipse cx="200" cy="352" rx="118" ry="26" fill="url(#{uid}-mirror)" filter="url(#{uid}-soft)" />
    <ellipse cx="200" cy="368" rx="62" ry="9" fill="#fff" opacity="0.32" filter="url(#{uid}-blur)" />
  </svg>
</div>

<style>
  .orb {
    position: relative;
    max-width: 100%;
    filter: drop-shadow(0 30px 42px rgba(6, 48, 79, 0.28));
    animation: float 9s ease-in-out infinite alternate;
  }

  .orb svg { width: 100%; height: auto; }

  .turn { animation: turn 38s linear infinite; }
  /* drifts faster than the land underneath it — weather outruns coastline */
  .turn-clouds { animation: turn 21s linear infinite; }
  .sheen { animation: breathe 7s ease-in-out infinite alternate; }
  .glint { animation: twinkle 5s ease-in-out infinite alternate; }

  @keyframes turn {
    from { transform: translateX(0); }
    to { transform: translateX(-400px); }
  }

  @keyframes float {
    from { transform: translateY(-8px); }
    to { transform: translateY(10px); }
  }

  @keyframes breathe {
    from { opacity: 0.75; transform: translate(-4px, -2px) scale(0.97); }
    to { opacity: 1; transform: translate(4px, 3px) scale(1.03); }
  }

  @keyframes twinkle {
    from { opacity: 0.55; }
    to { opacity: 0.95; }
  }

  @media (prefers-reduced-motion: reduce) {
    .orb,
    .turn,
    .turn-clouds,
    .sheen,
    .glint { animation: none; }
  }
</style>
