// Shop presentation logic, out of the page component so App.svelte can stay
// an orchestrator. Nothing here touches the DOM or Svelte — it is all pure
// derivation from a Stern prize payload.

// Brackets, not a slider: the useful question is "what can I reach with the
// hours I have", and round numbers answer it faster than a range control.
// Only hour-priced items belong in a band; anything else has no hour value.
const hours = (p) => (p.priceType === 'hours' && typeof p.price === 'number' ? p.price : null)

export const BANDS = [
  { id: 'all', label: 'everything', match: () => true },
  { id: 'low', label: 'under 25 hrs', match: (p) => hours(p) !== null && hours(p) < 25 },
  { id: 'mid', label: '25–75 hrs', match: (p) => hours(p) !== null && hours(p) >= 25 && hours(p) <= 75 },
  { id: 'high', label: 'over 75 hrs', match: (p) => hours(p) !== null && hours(p) > 75 },
  { id: 'featured', label: 'featured', match: (p) => p.isFeatured }
]

export const bandById = (id) => BANDS.find((b) => b.id === id) ?? BANDS[0]

// A band with nothing in it is not a choice, so it never becomes a chip.
export function usableBands(prizes) {
  return BANDS.map((b) => ({ ...b, n: prizes.filter(b.match).length })).filter(
    (b) => b.id === 'all' || b.n > 0
  )
}

// The price is the card's anchor, so the numeral and its unit are set apart:
// big figure, small-caps unit. priceType decides that unit — these prizes are
// priced in *hours*, not the program currency, so never assume coins.
export function priceParts(p, coinName) {
  if (p.priceType === 'free' || !p.price) return { n: 'Free', u: '' }
  if (p.priceType === 'hours') return { n: String(p.price), u: 'hrs' }
  if (p.priceType === 'currency') return { n: String(p.price), u: coinName }
  return { n: String(p.price), u: p.priceType ?? '' }
}

// Most Stern descriptions are just the product name typed again ("DJI Mini
// 4K" / "DJI Mini 4K"). Those tell a reader nothing, so drop any description
// that adds no word the name doesn't already have, and keep the rest.
const words = (s) => new Set(s.toLowerCase().match(/[a-z0-9]+/g) ?? [])
export function blurb(p) {
  const d = (p.description ?? '').trim()
  if (!d) return ''
  const known = words(p.name)
  for (const w of words(d)) if (!known.has(w)) return d
  return ''
}

export function stockLabel(p) {
  if (p.stock === null || p.stock === undefined) return ''
  return p.stock > 0 ? `${p.stock} left` : 'out of stock'
}

// One line for everything conditional, so a card never grows a whole extra
// row just because one item happens to track stock.
export const metaLine = (p) =>
  [
    stockLabel(p),
    p.minHoursRequired > 0 ? `unlocks at ${p.minHoursRequired} hrs` : '',
    p.estimatedShip ? `ships ${p.estimatedShip}` : ''
  ]
    .filter(Boolean)
    .join(' · ')
