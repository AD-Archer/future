/**
 * Stern descriptions are written by hand, and a lot of them are just the title
 * typed again — "DJI Mini 4K" described as "DJI Mini 4K", "Frutiger Aero Plush
 * Toy" as "Frutiger Aero Plush Toy". Rendering those costs a card a whole block
 * of height and tells the reader nothing it hasn't already said.
 *
 * The test is deliberately strict: a description survives if it contains even
 * one word the title does not. That keeps the short-but-useful ones ("8G+128G",
 * "Enhanced Atomic Ice / Transparent") and only drops the true echoes.
 */
const words = (s) => new Set(String(s ?? '').toLowerCase().match(/[a-z0-9]+/g) ?? [])

export function novelBlurb(title, description) {
  const text = String(description ?? '').trim()
  if (!text) return ''

  const known = words(title)
  for (const word of words(text)) {
    if (!known.has(word)) return text
  }
  return ''
}
