<script>
  // For anyone who has never done a Hack Club YSWS and does not yet know what
  // "ship" means here. It sits directly above the shop because three of the
  // four rows are the terms the shop runs on: who can claim, how many there
  // are, and what makes hours count.
  //
  // A definition list, not another row of icon cards — these are the terms of
  // the thing, and terms belong in a spec plate. The sections either side of
  // this one already use badges and numbered steps; a third variant of the
  // same pattern would read as filler.
  let { slackUrl = '', hackatimeUrl = '', welcomeUrl = '' } = $props()

  const FACTS = [
    {
      term: 'what it is',
      body:
        'An online hackathon. There is no venue and no single weekend — you build from ' +
        'wherever you are, on your own schedule, and finish when it is finished.'
    },
    {
      term: 'who it is for',
      body: 'Anyone aged 13 to 18, anywhere on earth. Free to enter, and there is nothing to pay later.'
    },
    {
      term: 'what you get',
      body:
        'Ship a project and pick real hardware off the shop list. Prizes are unlimited ' +
        'unless a listing says otherwise, so you are not racing anybody for one.'
    },
    {
      term: 'how hours count',
      body:
        'Track your build time with Hackatime. Once your non-AI hours are approved, the ' +
        'prize you picked is yours — that approval is the only gate.'
    }
  ]
</script>

<section class="window" id="new-here">
  <header class="bar sec-bar">
    <h2>New here?</h2>
    <span class="sep" aria-hidden="true"></span>
    <p class="sec-sub">
      Read this before the shop. It is the whole deal in four lines.
    </p>
  </header>

  <div class="pane body">
    <dl class="facts">
      {#each FACTS as f}
        <div class="fact">
          <dt class="hud">{f.term}</dt>
          <dd>{f.body}</dd>
        </div>
      {/each}
    </dl>

    <p class="tail">
      Still unsure what to do first?
      {#if welcomeUrl}
        <a href={welcomeUrl} data-analytics="CTA: Click" data-analytics-placement="primer-onboarding">Get onboarded</a>{#if slackUrl}, or{/if}
      {/if}
      {#if slackUrl}
        <a href={slackUrl} data-analytics="CTA: Click" data-analytics-placement="primer-slack">ask in the Slack</a>
      {/if}
      — somebody there has already built their first one.
      {#if hackatimeUrl}
        <a class="quiet" href={hackatimeUrl} data-analytics="CTA: Click" data-analytics-placement="primer-hackatime">What is Hackatime?</a>
      {/if}
    </p>
  </div>
</section>

<style>
  .sec-bar {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 12px 20px;
    min-height: 52px;
  }
  .sec-bar h2 { font-size: 1.5rem; font-weight: 300; white-space: nowrap; }
  .sec-sub { margin: 0; font-size: 0.98rem; color: var(--ink-2); max-width: 62ch; }

  .body { padding: 6px 26px 22px; }

  .facts { margin: 0; }
  /* the term column is fixed, so all four statements start on one axis and the
     block reads as a plate of terms rather than four stacked paragraphs */
  .fact {
    display: grid;
    grid-template-columns: 148px minmax(0, 1fr);
    gap: 22px;
    align-items: baseline;
    padding: 15px 4px;
  }
  .fact + .fact { border-top: 1px solid rgba(255, 255, 255, 0.14); }
  .fact dt { padding-top: 0.24em; font-size: 0.7rem; color: var(--accent); }
  .fact dd { margin: 0; color: var(--ink-2); max-width: 66ch; text-shadow: var(--etch); }

  .tail {
    margin: 18px 0 0;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.14);
    color: var(--ink-3);
    font-size: 0.94rem;
    max-width: 74ch;
  }
  .tail a { color: var(--accent); }
  .tail a:hover { text-decoration: underline; }
  .tail .quiet { display: inline-block; margin-left: 6px; color: var(--ink-3); }
  .tail .quiet:hover { color: var(--accent); }

  @media (max-width: 960px) {
    .sec-bar { flex-wrap: wrap; gap: 10px 16px; }
    .sec-bar .sep { display: none; }
  }
  @media (max-width: 640px) {
    .body { padding: 4px 16px 18px; }
    /* the term becomes an eyebrow above its statement; a 148px column would
       leave the text about twelve characters wide on a phone */
    .fact {
      grid-template-columns: minmax(0, 1fr);
      gap: 5px;
      padding: 13px 2px;
    }
    .fact dt { padding-top: 0; }
  }
</style>
