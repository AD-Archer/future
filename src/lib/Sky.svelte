<script>
  // Clouds. Two banks of soft blobs drifting across a fixed layer, blurred
  // into cumulus. No canvas, no rAF, no scroll listener — this era's skies
  // were a wallpaper, and a wallpaper is what this is.
  // The layer is anchored below the hero by its parent, so these are measured
  // from the first section down. A cloud drifting behind a paragraph changes
  // its contrast every few seconds, which is not something you can test your
  // way out of — so no cloud ever shares space with the hero's copy.
  const BANK = [
    { t: 4, s: 300, o: 0.8, d: 150 },
    { t: 16, s: 190, o: 0.55, d: 210 },
    { t: 29, s: 250, o: 0.45, d: 175 },
    { t: 44, s: 160, o: 0.36, d: 240 },
    { t: 58, s: 220, o: 0.3, d: 195 }
  ]
</script>

<div class="sky" aria-hidden="true">
  {#each [0, 1] as pass}
    {#each BANK as c, i}
      <span
        class="cloud"
        style="
          top:{c.t + pass * 4}%;
          width:{c.s}px;
          height:{c.s * 0.42}px;
          opacity:{c.o * (pass ? 0.55 : 1)};
          animation-duration:{c.d + pass * 40}s;
          animation-delay:-{i * 37 + pass * 23}s;
        "
      ></span>
    {/each}
  {/each}
</div>

<style>
  .sky {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
  }

  /* a cumulus is three overlapping blobs, blurred — one ellipse reads as a
     smudge and gives the whole page away */
  .cloud {
    position: absolute;
    left: 0;
    border-radius: 50%;
    background:
      radial-gradient(circle at 30% 62%, #fff 0%, rgba(255, 255, 255, 0.86) 42%, rgba(255, 255, 255, 0) 68%),
      radial-gradient(circle at 62% 40%, #fff 0%, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0) 66%),
      radial-gradient(circle at 82% 66%, #fff 0%, rgba(255, 255, 255, 0.8) 38%, rgba(255, 255, 255, 0) 64%);
    filter: blur(6px);
    animation-name: drift;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes drift {
    from { transform: translateX(-40vw); }
    to { transform: translateX(120vw); }
  }

  @media (prefers-reduced-motion: reduce) {
    .cloud { animation: none; transform: translateX(24vw); }
  }
</style>
