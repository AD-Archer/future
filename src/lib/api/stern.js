// Stern's public content API — read-only, no key, CORS open to every origin.
// This is the backend: the shop, rules, FAQ, news and events all live in Stern
// and are edited there, not here. Responses are edge-cached for ~60s.
//
//   https://stern.hackclub.com/api/public/programs/future

export const PROGRAM_SLUG = 'future'
export const API_BASE = `https://stern.hackclub.com/api/public/programs/${PROGRAM_SLUG}`
export const WELCOME_URL = `https://stern.hackclub.com/${PROGRAM_SLUG}/welcome`

async function get(path = '') {
  const res = await fetch(`${API_BASE}${path}`, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`Stern ${path || '/'} responded ${res.status}`)
  return res.json()
}

export const fetchProgram = () => get()
export const fetchPrizes = () => get('/prizes')
export const fetchRules = () => get('/rules')
export const fetchFaq = () => get('/faq')
export const fetchNews = (limit = 6) => get(`/news?limit=${limit}`)
export const fetchEvents = () => get('/events?upcoming=true')

// Cheapest route in first: the hours gate decides what you can even reach,
// then price breaks ties.
export function sortPrizes(prizes = []) {
  return [...prizes].sort(
    (a, b) => (a.minHoursRequired ?? 0) - (b.minHoursRequired ?? 0) || (a.price ?? 0) - (b.price ?? 0)
  )
}

/**
 * Load everything the page renders in one pass. Every endpoint is independent,
 * so a single failure degrades one section instead of the page.
 */
export async function loadContent() {
  const [program, prizes, rules, faq, news, events] = await Promise.allSettled([
    fetchProgram(),
    fetchPrizes(),
    fetchRules(),
    fetchFaq(),
    fetchNews(),
    fetchEvents()
  ])

  const value = (r) => (r.status === 'fulfilled' ? r.value : null)
  const failed = (r, name) => (r.status === 'rejected' ? name : null)

  const prizePayload = value(prizes)
  const rulePayload = value(rules)

  return {
    program: value(program)?.program ?? null,
    currency: prizePayload?.currency ?? rulePayload?.reward ?? null,
    prizes: sortPrizes(prizePayload?.prizes ?? []),
    rules: rulePayload,
    faq: value(faq)?.faq ?? [],
    news: value(news)?.news ?? [],
    events: value(events)?.events ?? [],
    failures: [
      failed(program, 'program'),
      failed(prizes, 'prizes'),
      failed(rules, 'rules'),
      failed(faq, 'faq'),
      failed(news, 'news'),
      failed(events, 'events')
    ].filter(Boolean)
  }
}
