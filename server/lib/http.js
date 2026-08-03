import { createReadStream, existsSync, statSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml; charset=utf-8'
}

export async function readJson(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

export function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(payload))
}

export function sendError(res, error) {
  sendJson(res, error.status || 500, {
    error: error.message || 'Unexpected server error',
    detail: error.payload?.error
  })
}

export async function serveStatic(req, res, root = 'dist') {
  const url = new URL(req.url, 'http://localhost')
  const cleanPath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '')
  const target = join(process.cwd(), root, cleanPath === '/' ? 'index.html' : cleanPath)
  const fallback = join(process.cwd(), root, 'index.html')
  const file = existsSync(target) && statSync(target).isFile() ? target : fallback

  if (!existsSync(file)) {
    sendJson(res, 404, { error: 'Build output not found. Run npm run build first.' })
    return
  }

  res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' })
  createReadStream(file).pipe(res)
}

export async function loadDotEnv(path = '.env') {
  if (!existsSync(path)) return

  const content = await readFile(path, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const [key, ...rest] = trimmed.split('=')
    if (!process.env[key]) {
      process.env[key] = rest.join('=').replace(/^["']|["']$/g, '')
    }
  }
}
