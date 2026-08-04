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
// kind: 'all' | 'ideas' | 'projects'. Not shipped yet, so callers must tolerate
// a 404 here without treating it as a broken page.
export const fetchExamples = (kind = 'all') => get(`/examples?kind=${kind}`)

/**
 * Ideas and shipped projects arrive as two lists with different shapes. Fold
 * them into one so the page renders a single grid. Only `ideas` has a
 * documented shape, so `projects` is read through the same tolerant lookups.
 */
export function normalizeExamples(payload) {
  const one = (raw, kind) => {
    const effortRaw = raw.effortHint ?? raw.effort ?? raw.hours ?? null
    const hours = Number.parseFloat(effortRaw)
    const effort = Number.isFinite(hours) ? hours : null

    return {
      id: raw.id ?? raw.projectId ?? `${kind}:${raw.title ?? raw.name ?? ''}`,
      kind,
      title: String(raw.title ?? raw.name ?? '').trim(),
      description: String(raw.description ?? raw.summary ?? '').trim(),
      image: raw.imageUrl ?? raw.image ?? '',
      link: raw.linkUrl ?? raw.url ?? raw.demoUrl ?? raw.repoUrl ?? '',
      credit: String(raw.credit ?? raw.author ?? '').trim(),
      effort,
      // an effort hint may be a number of hours or free text like "a weekend"
      effortLabel: effort !== null ? `~${effort} hrs` : String(effortRaw ?? '').trim(),
      tags: (raw.tags ?? []).filter(Boolean).map(String)
    }
  }

  const list = [
    ...(payload?.ideas ?? []).map((raw) => one(raw, 'idea')),
    ...(payload?.projects ?? []).map((raw) => one(raw, 'project'))
  ]

  return sortExamples(list.filter((e) => e.title))
}

// Quickest builds first, so the list opens on something you could start tonight.
// Anything without an effort hint sinks to the bottom rather than to the top.
export function sortExamples(list = []) {
  const rank = (e) => (e.effort ?? Number.MAX_SAFE_INTEGER)
  return [...list].sort((a, b) => rank(a) - rank(b) || a.title.localeCompare(b.title))
}

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
  const [program, prizes, rules, faq, news, events, examples] = await Promise.allSettled([
    fetchProgram(),
    fetchPrizes(),
    fetchRules(),
    fetchFaq(),
    fetchNews(),
    fetchEvents(),
    fetchExamples()
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
    examples: normalizeExamples(value(examples)),
    // `examples` is deliberately absent: the endpoint does not exist yet, and a
    // 404 there is expected rather than a fault worth reporting.
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
