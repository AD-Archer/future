<script>
  // Page orchestration only. Every section owns its own markup and styles;
  // shop derivation lives in lib/shop.js. Nothing here but data loading,
  // routing and composition.
  import Sky from './lib/Sky.svelte'
  import Ticker from './lib/Ticker.svelte'
  import Reveal from './lib/Reveal.svelte'
  import StatusPage from './lib/StatusPage.svelte'

  import Hero from './lib/sections/Hero.svelte'
  import Tracks from './lib/sections/Tracks.svelte'
  import Protocol from './lib/sections/Protocol.svelte'
  import Shop from './lib/sections/Shop.svelte'
  import Faq from './lib/sections/Faq.svelte'
  import Close from './lib/sections/Close.svelte'

  import Examples from './lib/Examples.svelte'
  import Primer from './lib/Primer.svelte'
  import Feed from './lib/Feed.svelte'

  import { loadContent } from './lib/api/stern.js'
  import { initAnalytics, refreshAnalyticsSections, trackEvent } from './lib/insight.js'
  import { CONFIG } from './lib/data.js'

  let locationState = $state(readLocation())
  let runtimeError = $state('')

  // everything that changes often lives in Stern, not in this repo
  let api = $state({
    loading: true,
    failures: [],
    program: null,
    currency: null,
    prizes: [],
    rules: null,
    faq: [],
    news: [],
    events: [],
    examples: []
  })

  let coinName = $derived(api.currency?.name ?? CONFIG.currency)

  // how long the program runs, straight off the schedule in the program payload
  const DAY = 86400000
  // Read in UTC: the schedule lands on midnight UTC, so formatting it locally
  // would shift the date back a day for anyone west of Greenwich. Months are
  // spelled out here rather than via Intl, whose "short" September is "Sept".
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const fmtDate = (d) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`

  let run = $derived.by(() => {
    const sch = api.program?.schedule
    if (!sch?.startsAt || !sch?.endsAt) return null

    const start = new Date(sch.startsAt)
    const end = new Date(sch.endsAt)
    const now = new Date()
    const total = Math.max(1, Math.round((end - start) / DAY))

    return {
      start,
      end,
      total,
      day: Math.min(total, Math.max(1, Math.floor((now - start) / DAY) + 1)),
      left: Math.max(0, Math.ceil((end - now) / DAY)),
      until: Math.max(0, Math.ceil((start - now) / DAY)),
      started: sch.hasStarted,
      ended: sch.hasEnded
    }
  })

  let ticker = $derived.by(() => {
    const out = []
    if (run) {
      const window = `runs ${fmtDate(run.start)} to ${fmtDate(run.end)}`
      if (run.ended) {
        out.push('this run has ended', `it ran ${run.total} days`, window)
      } else if (run.started) {
        out.push(
          `day ${run.day} of ${run.total}`,
          run.left === 0 ? 'closes today' : `${run.left} day${run.left === 1 ? '' : 's'} left`,
          window
        )
      } else {
        out.push(
          run.until === 0 ? 'opens today' : `opens in ${run.until} day${run.until === 1 ? '' : 's'}`,
          window
        )
      }
    }
    if (typeof api.program?.hoursShipped === 'number') {
      out.push(`${api.program.hoursShipped} hours shipped`)
    }
    if (out.length) out.push('build the future of your childhood')
    return out
  })

  const validPaths = new Set(['/', '/index.html', '/404', '/error'])

  function readLocation() {
    return { pathname: window.location.pathname }
  }

  function normalizePath(pathname) {
    return pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname
  }

  let status = $derived.by(() => {
    const pathname = normalizePath(locationState.pathname)

    if (runtimeError || pathname === '/error') {
      return {
        code: '500',
        title: 'This future stopped compiling.',
        body: 'Something on this page failed mid-render. Try again while we patch it.',
        detail: runtimeError
      }
    }

    if (pathname === '/404' || !validPaths.has(pathname)) {
      return {
        code: '404',
        title: 'Nothing was built here.',
        body: 'These coordinates come back empty. FUTURE is still one jump ahead of you.'
      }
    }

    return null
  })

  $effect(() => {
    initAnalytics()
  })

  $effect(() => {
    if (!api.loading) refreshAnalyticsSections()
  })

  $effect(() => {
    loadContent()
      .then((c) => {
        api = { ...c, loading: false }
        trackEvent('Content: Loaded', {
          status: c.failures.length ? 'partial' : 'complete',
          failed: c.failures.join(',')
        }, { interactive: false })
      })
      .catch((err) => {
        api = { ...api, loading: false, failures: [err.message] }
        trackEvent('Content: Loaded', { status: 'failed', failed: 'all' }, { interactive: false })
      })
  })

  $effect(() => {
    const syncLocation = () => (locationState = readLocation())
    const captureError = (event) => {
      runtimeError = event.error?.message || event.message || 'Unknown runtime error'
    }
    const captureRejection = (event) => {
      runtimeError = event.reason?.message || String(event.reason || 'Unhandled promise rejection')
    }

    window.addEventListener('popstate', syncLocation)
    window.addEventListener('hashchange', syncLocation)
    window.addEventListener('error', captureError)
    window.addEventListener('unhandledrejection', captureRejection)

    return () => {
      window.removeEventListener('popstate', syncLocation)
      window.removeEventListener('hashchange', syncLocation)
      window.removeEventListener('error', captureError)
      window.removeEventListener('unhandledrejection', captureRejection)
    }
  })
</script>

{#if status}
  <StatusPage {...status} />
{:else}
  <Ticker items={ticker} header />

  <a class="flag" href={CONFIG.flagUrl} target="_blank" rel="noopener" aria-label="Hack Club"
    data-analytics="CTA: Click" data-analytics-placement="hack-club-flag">
    <img src="/branding/flag-orpheus-top.svg" alt="Hack Club" width="150" height="85" />
  </a>

  <Hero slackUrl={CONFIG.slackUrl} welcomeUrl={CONFIG.welcomeUrl} />

  <main class="stack">
    <!-- Clouds start where the hero ends. Anchored to the section stack rather
         than the viewport because the hero is far taller when it stacks on a
         phone, and a cloud behind the lede took it to 1.1:1. -->
    <Sky />

    <Reveal><Tracks /></Reveal>

    {#if api.examples.length}
      <Reveal><Examples items={api.examples} /></Reveal>
    {/if}

    <Reveal><Protocol welcomeUrl={CONFIG.welcomeUrl} /></Reveal>

    <Reveal>
      <Primer
        slackUrl={CONFIG.slackUrl}
        hackatimeUrl={CONFIG.hackatimeUrl}
        welcomeUrl={CONFIG.welcomeUrl}
      />
    </Reveal>

    <Reveal>
      <Shop prizes={api.prizes} loading={api.loading} {coinName} />
    </Reveal>


    {#if api.news.length}
      <Reveal>
        <Feed
          id="news"
          title="Latest news"
          sub="From the people running the program."
          items={api.news}
        />
      </Reveal>
    {/if}

    {#if api.events.length}
      <Reveal>
        <Feed
          id="events"
          title="What's coming up"
          sub="Still to come on the schedule."
          items={api.events}
          dateKey="startsAt"
          titleKey="name"
        />
      </Reveal>
    {/if}

    <Reveal>
      <Faq items={api.faq} loading={api.loading} slackUrl={CONFIG.slackUrl} />
    </Reveal>
  </main>

  <Close welcomeUrl={CONFIG.welcomeUrl} slackUrl={CONFIG.slackUrl} />
{/if}

<style>
  /* Hung from the top of the page, not pinned to the viewport: fixed, it
     permanently covered the top-left of every section you scrolled past. */
  .flag {
    position: absolute;
    top: 0;
    left: 20px;
    z-index: 300;
    line-height: 0;
    transform-origin: top center;
    transition: transform 0.3s var(--ease);
  }
  .flag img { width: 172px; height: auto; filter: drop-shadow(0 8px 14px rgba(6, 40, 74, 0.4)); }
  .flag:hover { transform: rotate(3deg) translateY(3px); }

  /* one rhythm for the whole page, with more room above a heading than below */
  .stack {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: clamp(40px, 6vw, 76px);
  }

  @media (max-width: 640px) {
    .flag { left: 10px; }
    .flag img { width: 130px; }
  }
</style>
