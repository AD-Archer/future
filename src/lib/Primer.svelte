<script>
  // For anyone who has never done a Hack Club YSWS and does not yet know what
  // "ship" means here. It sits directly above the shop because three of the
  // four rows are the terms the shop runs on: who can claim, how many there
  // are, and what makes hours count.
  //
  // A definition list, not another row of icon cards — these are the terms of
  // the thing, and terms belong in a spec plate.
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

<section class="col" id="new-here">
  <div class="window">
    <header class="titlebar">
      <h2>New here?</h2>
      <span class="sep" aria-hidden="true"></span>
      <p>The whole deal in four lines.</p>
    </header>

    <div class="panel-body">
      <dl class="facts">
        {#each FACTS as f}
          <div class="fact">
            <dt>{f.term}</dt>
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
          <a href={hackatimeUrl} data-analytics="CTA: Click" data-analytics-placement="primer-hackatime">What is Hackatime?</a>
        {/if}
      </p>
    </div>
  </div>
</section>

<style>
  .facts { margin: 0; }

  /* the term column is fixed, so all four statements start on one axis and the
     block reads as a plate of terms rather than four stacked paragraphs */
  .fact {
    display: grid;
    grid-template-columns: 130px minmax(0, 1fr);
    gap: 18px;
    align-items: baseline;
    padding: 12px 0;
  }
  .fact + .fact { border-top: 1px solid var(--panel-line); }
  dt {
    font-size: var(--t-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--link);
  }
  dd { margin: 0; font-size: var(--t-sm); color: var(--ink-2); max-width: 62ch; }

  .tail {
    margin-top: 16px;
    padding-top: 13px;
    border-top: 1px solid var(--panel-line);
    font-size: var(--t-sm);
    color: var(--ink-3);
    max-width: 72ch;
  }
  .tail a { color: var(--link); }
  .tail a:hover { text-decoration: underline; }

  @media (max-width: 600px) {
    /* the term becomes an eyebrow above its statement; a 130px column would
       leave the text about twelve characters wide on a phone */
    .fact { grid-template-columns: minmax(0, 1fr); gap: 4px; }
  }
</style>
