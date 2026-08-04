// Loaded lazily, never statically. Content blockers refuse any request whose
// URL looks like analytics, and the tracker package's path carries both
// "analytics" and "plausible" — as a static import a blocked response takes the
// whole module graph down with it, which in dev means a blank white page. This
// file is named `insight` for the same reason: `analytics.js` gets eaten on
// sight. Everything below already treats tracking as optional; the import has
// to be optional too.
let track = null

const DEFAULT_DOMAIN = 'future.hackclub.com'
const DEFAULT_HOST = 'https://plausible.adarcher.app'

let initialized = false
let ready = false
let context = {}
let sectionObserver = null
const observedSections = new WeakSet()
const seenSections = new Set()

const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN || DEFAULT_DOMAIN
const host = (import.meta.env.VITE_PLAUSIBLE_HOST || DEFAULT_HOST).replace(/\/+$/, '')

export function setAnalyticsContext(next = {}) {
  context = { ...context, ...cleanProps(next) }
}

export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  load()
}

async function load() {
  try {
    const tracker = await import('@plausible-analytics/tracker')

    tracker.init({
      domain,
      endpoint: `${host}/api/event`,
      autoCapturePageviews: true,
      outboundLinks: true,
      fileDownloads: true,
      formSubmissions: true,
      captureOnLocalhost: import.meta.env.VITE_PLAUSIBLE_CAPTURE_LOCALHOST === 'true',
      logging: import.meta.env.DEV,
      customProperties: () => ({
        site: 'future',
        ...context,
        embedded: window.self === window.top ? 'no' : 'yes'
      })
    })

    track = tracker.track
    ready = true
    attachClickTracking()
    observeSections()
  } catch {
    // Blocked, offline, or failed to start. The page carries on without it.
  }
}

export function refreshAnalyticsSections() {
  if (ready) observeSections()
}

export function trackEvent(name, props = {}, options = {}) {
  if (!ready || !track) return

  try {
    track(name, {
      props: cleanProps(props),
      interactive: options.interactive
    })
  } catch {
    // Analytics must never take a user interaction down with it.
  }
}

function cleanProps(props) {
  return Object.fromEntries(
    Object.entries(props)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => [key, cleanPropValue(String(value))])
  )
}

function cleanPropValue(value, maxLength = 80) {
  const collapsed = value.replace(/\s+/g, ' ').trim()
  return collapsed.length > maxLength
    ? `${collapsed.slice(0, maxLength - 1)}…`
    : collapsed
}

function attachClickTracking() {
  const onClick = (event) => {
    if (event.type === 'auxclick' && event.button !== 1) return

    const target = event.target
    if (!(target instanceof Element)) return

    const marked = target.closest('[data-analytics]')
    if (marked) {
      const name = marked.dataset.analytics
      if (name) trackEvent(name, datasetProps(marked))
      return
    }

    const link = target.closest('a[href]')
    if (!link) return

    let url
    try {
      url = new URL(link.href, window.location.href)
    } catch {
      return
    }

    if (url.host !== window.location.host || !url.protocol.startsWith('http')) return

    trackEvent('Link: Click', {
      from: normalizePath(window.location.pathname),
      to: normalizePath(url.pathname),
      label: linkLabel(link),
      hash: url.hash
    })
  }

  document.addEventListener('click', onClick, true)
  document.addEventListener('auxclick', onClick, true)
}

function observeSections() {
  if (!('IntersectionObserver' in window)) return

  if (!sectionObserver) {
    sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const section = entry.target.dataset.analyticsSection || entry.target.id
          if (!section || seenSections.has(section)) continue
          seenSections.add(section)
          trackEvent('Section: View', { section }, { interactive: false })
          sectionObserver.unobserve(entry.target)
        }
      },
      { threshold: 0.4 }
    )
  }

  document.querySelectorAll('section[id], [data-analytics-section]').forEach((section) => {
    if (observedSections.has(section)) return
    observedSections.add(section)
    sectionObserver.observe(section)
  })
}

function datasetProps(element) {
  const props = {}
  for (const [key, value] of Object.entries(element.dataset)) {
    if (key === 'analytics' || !key.startsWith('analytics') || !value) continue
    const name = key.slice('analytics'.length)
    props[name.charAt(0).toLowerCase() + name.slice(1)] = value
  }
  return props
}

function linkLabel(link) {
  return cleanPropValue(link.getAttribute('aria-label') || link.textContent || '') || '(unlabelled)'
}

function normalizePath(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}
