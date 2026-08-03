const AIRTABLE_API = 'https://api.airtable.com/v0'

function normalizeQuery(params = {}) {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue

    if (Array.isArray(value)) {
      for (const item of value) {
        search.append(key, item)
      }
      continue
    }

    search.set(key, value)
  }

  return search.toString()
}

export class AirtableClient {
  constructor({ token, bases }) {
    this.token = token
    this.bases = bases
  }

  resolveTable(baseKey, tableKey) {
    const base = this.bases[baseKey]
    if (!base?.id) {
      throw Object.assign(new Error(`Unknown or unconfigured Airtable base: ${baseKey}`), { status: 404 })
    }

    const table = base.tables[tableKey]
    if (!table?.id) {
      throw Object.assign(new Error(`Unknown Airtable table: ${baseKey}.${tableKey}`), { status: 404 })
    }

    return { base, table }
  }

  async request({ baseKey, tableKey, recordId, method = 'GET', query, body }) {
    if (!this.token) {
      throw Object.assign(new Error('AIRTABLE_API_TOKEN is not configured'), { status: 503 })
    }

    const { base, table } = this.resolveTable(baseKey, tableKey)
    const path = [AIRTABLE_API, encodeURIComponent(base.id), encodeURIComponent(table.id), recordId ? encodeURIComponent(recordId) : '']
      .filter(Boolean)
      .join('/')
    const qs = normalizeQuery(query)
    const response = await fetch(qs ? `${path}?${qs}` : path, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })

    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
      const message = payload?.error?.message || payload?.error?.type || `Airtable returned ${response.status}`
      throw Object.assign(new Error(message), { status: response.status, payload })
    }

    return payload
  }

  listRecords(baseKey, tableKey, options = {}) {
    const { table } = this.resolveTable(baseKey, tableKey)
    const fields = options.fields?.length ? options.fields : table.defaultFields

    return this.request({
      baseKey,
      tableKey,
      query: {
        maxRecords: options.maxRecords || 20,
        view: options.view,
        filterByFormula: options.filterByFormula,
        pageSize: options.pageSize,
        offset: options.offset,
        ...(fields?.length ? { fields } : {})
      }
    })
  }

  createRecord(baseKey, tableKey, fields, options = {}) {
    return this.request({
      baseKey,
      tableKey,
      method: 'POST',
      body: {
        records: [{ fields }],
        typecast: Boolean(options.typecast)
      }
    })
  }

  updateRecord(baseKey, tableKey, recordId, fields, options = {}) {
    return this.request({
      baseKey,
      tableKey,
      recordId,
      method: 'PATCH',
      body: {
        fields,
        typecast: Boolean(options.typecast)
      }
    })
  }

  deleteRecord(baseKey, tableKey, recordId) {
    return this.request({
      baseKey,
      tableKey,
      recordId,
      method: 'DELETE'
    })
  }
}
