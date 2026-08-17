<script>
  import Mark from '../Mark.svelte'
  import Brand from '../Brand.svelte'
  import { CONFIG } from '../data.js'

  let { slackUrl = '', welcomeUrl = '' } = $props()
</script>

<!--
  The header is the application's own splash window, not a landing-page hero
  band. The mark reads as an app icon, the page already speaks in title bars
  and panels, and an image-left/headline-right split is the answer every
  landing page gives. A 2003 program introduced itself in a window: icon,
  name, one line about what it does, and the button that starts it.
-->
<header class="hero col" id="top">
  <span class="sun" aria-hidden="true"></span>

  <div class="window splash">
    <header class="titlebar">
      <!-- chrome, not controls: decorative caps with no hover and no cursor,
           the same way the pinstripe is a texture rather than a scrollbar -->
      <span class="caps" aria-hidden="true"><i></i><i></i><i></i></span>
      <Brand size={20} />
      <span class="sep" aria-hidden="true"></span>
      <p>You Ship, We Ship · a Hack Club program</p>
    </header>

    <div class="splash-body">
      <div class="mark-slot"><Mark size={186} /></div>

      <h1>Build the future<br />of your childhood.</h1>

      <p class="lede">
        Or the current future, or the past future? Or whatever you believe the future is, because the future is what you make it. 
      </p>

      <div class="actions">
        <a href={welcomeUrl} class="gel btn" data-analytics="CTA: Click"
          data-analytics-placement="hero-onboarding">Get onboarded</a>
        <a href="#how" class="btn-text" data-analytics="CTA: Click"
          data-analytics-placement="hero-protocol">Read the protocol →</a>
      </div>
    </div>

    <!-- a status bar reports state, so it carries the terms rather than a
         second copy of the brand line -->
    <footer class="statusbar">
      <span>Free to enter · ages 13 to 18 · anywhere on earth</span>
      <a class="spacer" href={slackUrl} data-analytics="CTA: Click"
        data-analytics-placement="hero-slack">by {CONFIG.archer.name} · ask in the Slack →</a>
    </footer>
  </div>
</header>

<style>
  .hero {
    position: relative;
    padding-top: clamp(120px, 15vh, 168px);
    padding-bottom: clamp(30px, 4vw, 48px);
  }

  /* the warm corner every wallpaper of this era had */
  .sun {
    position: absolute;
    top: -10%;
    left: 2%;
    width: 56vw;
    height: 42vh;
    z-index: 0;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle, var(--sun-core) 0%, var(--sun-halo) 38%, transparent 68%);
  }

  .splash { position: relative; z-index: 1; }

  /* ── window caps ── */
  .caps { display: flex; gap: 6px; flex: 0 0 auto; }
  .caps i {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.8),
      inset 0 -1px 1px rgba(0, 0, 0, 0.22),
      0 1px 1px rgba(16, 58, 96, 0.24);
  }
  .caps i:nth-child(1) { background: radial-gradient(circle at 34% 26%, var(--win-red-hi), var(--win-red)); }
  .caps i:nth-child(2) { background: radial-gradient(circle at 34% 26%, var(--win-amber-hi), var(--win-amber)); }
  .caps i:nth-child(3) { background: radial-gradient(circle at 34% 26%, var(--win-green-hi), var(--win-green)); }

  /* ── the splash itself ── */
  .splash-body {
    display: grid;
    justify-items: center;
    text-align: center;
    padding: clamp(30px, 4.5vw, 56px) var(--pad) clamp(28px, 4vw, 46px);
  }

  /* the reflection paints outside the mark's box, so the room it needs is
     reserved here rather than left to collide with the headline */
  .mark-slot { padding-bottom: clamp(26px, 3vw, 42px); }

  h1 {
    font-size: var(--t-hero);
    line-height: 1.06;
    letter-spacing: -0.025em;
  }

  .lede {
    max-width: 54ch;
    margin-top: 14px;
    font-size: var(--t-lede);
    color: var(--ink-2);
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: clamp(22px, 2.6vw, 30px);
    flex-wrap: wrap;
  }

  /* ── status bar ── */
  .statusbar {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    padding: 8px 18px;
    border-top: 1px solid var(--panel-edge);
    background-image: linear-gradient(180deg, var(--panel-2) 0%, var(--panel-3) 100%);
    font-size: var(--t-xs);
    color: var(--ink-3);
  }
  .statusbar a { color: var(--link); }
  .statusbar a:hover { text-decoration: underline; }

  @media (max-width: 620px) {
    /* the strapline goes, and the divider that introduced it goes with it */
    .titlebar p,
    .titlebar .sep { display: none; }
    .statusbar { justify-content: center; text-align: center; }
    .statusbar .spacer { margin-left: 0; }
  }
</style>
