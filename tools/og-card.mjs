// Regenerate public/og.jpg from tools/og-card.html.
//
//   node tools/og-card.mjs
//
// Renders the card at 2400x1260 and downsamples to 1200x630 so the light type
// stays crisp, then writes a JPEG (~90KB, well inside every crawler's limit).
// Needs a Chromium: set CHROME_PATH, or install playwright's
// (npx playwright install chromium) and it will be found in the default cache.

import { chromium } from 'playwright-core'
import { execFileSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const out = join(root, 'public', 'og.jpg')
const tmp = join(root, 'public', 'og-2x.png')

const candidates = [
  process.env.CHROME_PATH,
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].filter(Boolean)

const executablePath = candidates.find((p) => existsSync(p))
if (!executablePath) throw new Error(`No Chromium found. Tried:\n${candidates.join('\n')}`)

const browser = await chromium.launch({ executablePath })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 })
await page.goto(`file://${join(here, 'og-card.html')}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200) // let the webfonts settle
await page.screenshot({ path: tmp })
await browser.close()

// sips ships with macOS; swap for sharp or ImageMagick elsewhere
execFileSync('/usr/bin/sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '88', tmp, '--out', out])
execFileSync('/usr/bin/sips', ['--resampleWidth', '1200', out])
rmSync(tmp)

console.log(`wrote ${out}`)
