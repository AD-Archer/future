async function request(path, options = {}) {
  const response = await fetch(`/api/airtable${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || `Request failed with ${response.status}`)
  }

  return payload
}

export function getAirtableConfig() {
  return request('')
}

export function listAirtableRecords(baseKey, tableKey, options = {}) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(options)) {
    if (!value) continue
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item))
    } else {
      params.set(key, value)
    }
  }

  return request(`/${baseKey}/${tableKey}${params.size ? `?${params}` : ''}`)
}

export function createAirtableRecord(baseKey, tableKey, fields, options = {}) {
  return request(`/${baseKey}/${tableKey}`, {
    method: 'POST',
    body: JSON.stringify({ fields, ...options })
  })
}

export function updateAirtableRecord(baseKey, tableKey, recordId, fields, options = {}) {
  return request(`/${baseKey}/${tableKey}/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields, ...options })
  })
}

export function deleteAirtableRecord(baseKey, tableKey, recordId) {
  return request(`/${baseKey}/${tableKey}/${recordId}`, {
    method: 'DELETE'
  })
}
