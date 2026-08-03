import { createServer } from 'node:http'
import { readAirtableEnv } from './config/airtable.js'
import { AirtableClient } from './lib/airtable/client.js'
import { loadDotEnv, sendError, sendJson, serveStatic } from './lib/http.js'
import { handleAirtableRoute } from './routes/airtable.js'

await loadDotEnv()

const config = readAirtableEnv()
const client = new AirtableClient(config)
const port = Number(process.env.PORT || 8787)

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)

    if (url.pathname === '/api/health') {
      sendJson(res, 200, {
        ok: true,
        airtableConfigured: config.missing.length === 0,
        missing: config.missing
      })
      return
    }

    if (url.pathname.startsWith('/api/airtable')) {
      await handleAirtableRoute(req, res, { client, config })
      return
    }

    await serveStatic(req, res)
  } catch (error) {
    sendError(res, error)
  }
})

server.listen(port, () => {
  console.log(`FLUX API listening on http://localhost:${port}`)
})
