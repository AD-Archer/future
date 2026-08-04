<script>
  // The wallpaper: volumetric clouds drifting across a sky, a pulsing sun
  // glare, and slow-rising water bubbles. Fixed behind everything else.
  //
  // Colours arrive as plain hex from WORLDS.atmos and are interpolated in JS
  // so the canvas cross-fades in step with the CSS token transition.
  //   <Sky atmos={world.atmos} />
  import { untrack } from 'svelte'

  let { atmos = { cloud: '#ffffff', haze: '#cdeeff', glow: '#fff8d4', bubble: '#ffffff' } } = $props()

  let canvas = $state()
  let retargetRef = null

  const rnd = (a, b) => a + Math.random() * (b - a)
  const hex = (h) => {
    const n = parseInt(h.slice(1), 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  const toRgb = (a) => ({ cloud: hex(a.cloud), haze: hex(a.haze), glow: hex(a.glow), bubble: hex(a.bubble) })

  // captured once, outside any effect, so a world change never rebuilds the scene
  const startAtmos = untrack(() => ({ ...atmos }))

  $effect(() => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let raf = 0
    let clouds = []
    let bubbles = []

    // pointer parallax, eased
    let px = 0.5
    let py = 0.5
    let cx = 0.5
    let cy = 0.5

    // ── soft puff sprite, redrawn only when the tint shifts ──────────
    const puff = document.createElement('canvas')
    puff.width = puff.height = 256
    const pctx = puff.getContext('2d')
    let puffKey = ''

    function paintPuff([r, g, b]) {
      // quantised so easing colours don't force a repaint every single frame
      const key = `${r >> 2}|${g >> 2}|${b >> 2}`
      if (key === puffKey) return
      puffKey = key
      pctx.clearRect(0, 0, 256, 256)
      // steep falloff: a bright core with a soft rim, so puffs read as cumulus
      const grad = pctx.createRadialGradient(128, 128, 0, 128, 128, 128)
      grad.addColorStop(0, `rgba(${r},${g},${b},1)`)
      grad.addColorStop(0.42, `rgba(${r},${g},${b},0.94)`)
      grad.addColorStop(0.66, `rgba(${r},${g},${b},0.44)`)
      grad.addColorStop(0.86, `rgba(${r},${g},${b},0.1)`)
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
      pctx.fillStyle = grad
      pctx.fillRect(0, 0, 256, 256)
    }

    function build() {
      // three depths: high wisps, mid banks, low fast scud
      const layers = [
        { n: 6, depth: 0.28, y: [0.02, 0.42], scale: [120, 190], speed: [0.14, 0.26], a: [0.45, 0.7] },
        { n: 5, depth: 0.6, y: [0.16, 0.7], scale: [170, 280], speed: [0.3, 0.52], a: [0.6, 0.92] },
        { n: 3, depth: 1, y: [0.52, 0.96], scale: [240, 360], speed: [0.6, 0.95], a: [0.4, 0.66] }
      ]

      clouds = []
      for (const L of layers) {
        for (let i = 0; i < L.n; i++) {
          const scale = rnd(L.scale[0], L.scale[1])
          const puffs = []
          const count = 7 + ((Math.random() * 5) | 0)
          for (let p = 0; p < count; p++) {
            // clustered low and wide, taller in the middle — a cumulus profile
            const dx = rnd(-0.62, 0.62)
            puffs.push({
              dx,
              dy: rnd(-0.05, 0.14) - 0.22 * (1 - Math.abs(dx) / 0.62),
              r: rnd(0.24, 0.46) * (1.25 - Math.abs(dx) * 0.5),
              a: rnd(0.7, 1)
            })
          }
          clouds.push({
            x: Math.random(),
            y: rnd(L.y[0], L.y[1]),
            scale,
            speed: rnd(L.speed[0], L.speed[1]),
            depth: L.depth,
            alpha: rnd(L.a[0], L.a[1]),
            bob: Math.random() * Math.PI * 2,
            puffs
          })
        }
      }

      // kept small and sparse: anything bigger reads as a smudge when it
      // drifts behind a smoked-glass pane
      bubbles = []
      for (let i = 0; i < 16; i++) {
        bubbles.push({
          x: Math.random(),
          y: Math.random(),
          r: rnd(2, 6),
          vy: rnd(0.012, 0.045),
          wob: Math.random() * Math.PI * 2,
          wobs: rnd(0.4, 1.1),
          a: rnd(0.2, 0.6),
          depth: rnd(0.3, 1)
        })
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // ── colour easing ───────────────────────────────────────────────
    const cur = toRgb(startAtmos)
    let target = toRgb(startAtmos)

    function retarget(next) {
      target = toRgb(next)
      if (reduce) {
        Object.assign(cur, toRgb(next))
        render(0)
      }
    }

    function easeColours() {
      for (const k of ['cloud', 'haze', 'glow', 'bubble']) {
        for (let i = 0; i < 3; i++) cur[k][i] += (target[k][i] - cur[k][i]) * 0.06
      }
    }

    const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`

    function render(t) {
      ctx.clearRect(0, 0, w, h)
      const shift = reduce ? 0 : 44
      const ox = (cx - 0.5) * shift
      const oy = (cy - 0.5) * shift * 0.6

      // sun glare, breathing
      const pulse = reduce ? 0.5 : 0.5 + 0.14 * Math.sin(t * 0.00035)
      const gx = w * 0.8 - ox * 0.5
      const gy = h * 0.06 - oy * 0.5
      const glare = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.62)
      glare.addColorStop(0, rgba(cur.glow, 0.5 * pulse + 0.16))
      glare.addColorStop(0.35, rgba(cur.glow, 0.14 * pulse))
      glare.addColorStop(1, rgba(cur.glow, 0))
      ctx.fillStyle = glare
      ctx.fillRect(0, 0, w, h)

      // horizon haze
      const haze = ctx.createLinearGradient(0, h * 0.42, 0, h)
      haze.addColorStop(0, rgba(cur.haze, 0))
      haze.addColorStop(1, rgba(cur.haze, 0.55))
      ctx.fillStyle = haze
      ctx.fillRect(0, h * 0.42, w, h * 0.58)

      // clouds
      paintPuff(cur.cloud)
      for (const c of clouds) {
        const bob = reduce ? 0 : Math.sin(t * 0.0002 + c.bob) * 10
        const x = c.x * (w + c.scale * 2) - c.scale + ox * c.depth
        const y = c.y * h + bob + oy * c.depth
        for (const p of c.puffs) {
          const size = c.scale * p.r * 2
          const cxp = x + p.dx * c.scale
          const cyp = y + p.dy * c.scale
          // soft body, then a tighter core pass for definition
          ctx.globalAlpha = c.alpha * p.a * 0.7
          ctx.drawImage(puff, cxp - size / 2, cyp - size / 2, size, size)
          ctx.globalAlpha = c.alpha * p.a
          ctx.drawImage(puff, cxp - size * 0.32, cyp - size * 0.34, size * 0.64, size * 0.64)
        }
      }
      ctx.globalAlpha = 1

      // rising bubbles, each with a specular pin-prick
      for (const b of bubbles) {
        const x = b.x * w + ox * b.depth * 1.4
        const y = b.y * h + oy * b.depth
        const wob = reduce ? 0 : Math.sin(t * 0.0008 * b.wobs + b.wob) * 9
        ctx.beginPath()
        ctx.arc(x + wob, y, b.r, 0, 7)
        ctx.strokeStyle = rgba(cur.bubble, b.a * 0.75)
        ctx.lineWidth = 1.1
        ctx.stroke()
        const fill = ctx.createRadialGradient(x + wob - b.r * 0.3, y - b.r * 0.4, 0, x + wob, y, b.r)
        fill.addColorStop(0, rgba(cur.bubble, b.a * 0.5))
        fill.addColorStop(1, rgba(cur.bubble, 0))
        ctx.fillStyle = fill
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x + wob - b.r * 0.32, y - b.r * 0.36, Math.max(0.7, b.r * 0.17), 0, 7)
        ctx.fillStyle = rgba(cur.bubble, Math.min(1, b.a * 1.6))
        ctx.fill()
      }
    }

    function step(t) {
      cx += (px - cx) * 0.045
      cy += (py - cy) * 0.045
      easeColours()

      for (const c of clouds) {
        c.x += (c.speed * 0.00006) / 1
        if (c.x > 1.15) c.x = -0.15
      }
      for (const b of bubbles) {
        b.y -= b.vy * 0.0016
        if (b.y < -0.05) {
          b.y = 1.05
          b.x = Math.random()
        }
      }

      render(t)
      raf = requestAnimationFrame(step)
    }

    const onMove = (e) => {
      px = e.clientX / window.innerWidth
      py = e.clientY / window.innerHeight
    }
    const onResize = () => {
      resize()
      if (reduce) render(0)
    }

    build()
    resize()

    if (reduce) {
      render(0)
    } else {
      raf = requestAnimationFrame(step)
      window.addEventListener('pointermove', onMove, { passive: true })
    }
    window.addEventListener('resize', onResize)

    // react to world changes without rebuilding the scene
    retargetRef = retarget

    return () => {
      retargetRef = null
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
    }
  })

  // world changes only retarget the colour easing — the scene keeps drifting
  $effect(() => {
    const next = atmos
    if (retargetRef) retargetRef(next)
  })
</script>

<canvas class="sky" bind:this={canvas} aria-hidden="true"></canvas>

<style>
  .sky {
    position: fixed;
    inset: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
  }
</style>
