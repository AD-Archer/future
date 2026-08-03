import { publicAirtableConfig } from '../config/airtable.js'
import { readJson, sendJson } from '../lib/http.js'

function routeParts(pathname) {
  return pathname.split('/').filter(Boolean).slice(2)
}

function parseFields(searchParams) {
  const fields = searchParams.getAll('fields')
  const csv = searchParams.get('fields[]')
  return [...fields, ...(csv ? csv.split(',') : [])].filter(Boolean)
}

export async function handleAirtableRoute(req, res, { client, config }) {
  const url = new URL(req.url, 'http://localhost')
  const [baseKey, tableKey, recordId] = routeParts(url.pathname)

  if (!baseKey) {
    sendJson(res, 200, publicAirtableConfig(config))
    return true
  }

  if (!tableKey) {
    sendJson(res, 404, { error: 'Missing Airtable table key' })
    return true
  }

  if (req.method === 'GET') {
    const payload = await client.listRecords(baseKey, tableKey, {
      maxRecords: url.searchParams.get('maxRecords'),
      pageSize: url.searchParams.get('pageSize'),
      view: url.searchParams.get('view'),
      offset: url.searchParams.get('offset'),
      filterByFormula: url.searchParams.get('filterByFormula'),
      fields: parseFields(url.searchParams)
    })
    sendJson(res, 200, payload)
    return true
  }

  if (req.method === 'POST') {
    const body = await readJson(req)
    const payload = await client.createRecord(baseKey, tableKey, body.fields || body, body)
    sendJson(res, 201, payload)
    return true
  }

  if (req.method === 'PATCH' && recordId) {
    const body = await readJson(req)
    const payload = await client.updateRecord(baseKey, tableKey, recordId, body.fields || body, body)
    sendJson(res, 200, payload)
    return true
  }

  if (req.method === 'DELETE' && recordId) {
    const payload = await client.deleteRecord(baseKey, tableKey, recordId)
    sendJson(res, 200, payload)
    return true
  }

  sendJson(res, 405, { error: 'Unsupported Airtable API method' })
  return true
}
