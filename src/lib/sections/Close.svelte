<script>
  import Brand from '../Brand.svelte'
  import { CONFIG } from '../data.js'
  let { welcomeUrl = '', slackUrl = '' } = $props()
</script>

<section class="col close" id="signup">
  <div class="panel close-panel">
    <h2>Go build the future.</h2>
    <p>
      Free, open to every teenager on earth, and the only requirement is that you finish.
      Bring an idea, leave with hardware.
    </p>
    <div class="actions">
      <a href={welcomeUrl} class="gel btn" data-analytics="CTA: Click"
        data-analytics-placement="footer-onboarding">Sign up now</a>
      <a href={slackUrl} class="gel btn btn-blue" data-analytics="CTA: Click"
        data-analytics-placement="footer-slack">Join the Slack</a>
    </div>
  </div>
</section>

<footer class="col">
  <div class="panel foot">
    <div class="foot-top">
      <Brand size={34} />
      <nav>
        <a href={welcomeUrl} data-analytics="CTA: Click" data-analytics-placement="footer-onboarding">get onboarded</a>
        <a href={CONFIG.programUrl} data-analytics="CTA: Click" data-analytics-placement="footer-program">program</a>
        <a href={slackUrl} data-analytics="CTA: Click" data-analytics-placement="footer-slack">slack</a>
        <a href={CONFIG.hackatimeUrl} data-analytics="CTA: Click" data-analytics-placement="footer-hackatime">hackatime</a>
        <a href="https://ysws.hackclub.com/" data-analytics="CTA: Click" data-analytics-placement="footer-ysws">all ysws</a>
        <a href="https://hackclub.com" data-analytics="CTA: Click" data-analytics-placement="footer-hack-club">hack club</a>
      </nav>
    </div>
    <p class="fine">
      A Hack Club YSWS · made by teenagers, for teenagers ·
      <a class="archer" href={CONFIG.archer.url} target="_blank" rel="noopener"
        data-analytics="CTA: Click" data-analytics-placement="archer-slack">part of {CONFIG.archer.name}</a>
    </p>
  </div>
</footer>

<style>
  .close { padding-block: clamp(20px, 3vw, 34px) clamp(18px, 2.4vw, 26px); }

  /* The closing call sits in a panel like everything else, which also makes
     the hero the only place on the page that sets white type on the sky. */
  .close-panel {
    padding: clamp(38px, 5.5vw, 68px) var(--pad);
    text-align: center;
  }
  .close-panel h2 { font-size: var(--t-hero); }
  .close-panel p {
    max-width: 48ch;
    margin: 14px auto 26px;
    font-size: var(--t-lede);
    color: var(--ink-2);
  }
  .actions { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }

  .foot { padding: 18px 22px; margin-bottom: clamp(24px, 4vw, 44px); }
  .foot-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    flex-wrap: wrap;
  }
  nav { display: flex; gap: 16px; flex-wrap: wrap; }
  nav a {
    font-size: var(--t-xs);
    font-weight: 600;
    color: var(--ink-2);
  }
  nav a:hover { color: var(--link); }

  .fine {
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid var(--panel-line);
    font-size: var(--t-xs);
    color: var(--ink-3);
  }
  .archer { color: var(--link); }
  .archer:hover { text-decoration: underline; }
</style>
