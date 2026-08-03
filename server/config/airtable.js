const REQUIRED_ENV = ['AIRTABLE_API_TOKEN']

export function readAirtableEnv(env = process.env) {
  const missing = REQUIRED_ENV.filter((key) => !env[key])

  return {
    token: env.AIRTABLE_API_TOKEN,
    missing,
    bases: {
      unified: {
        id: env.AIRTABLE_UNIFIED_BASE_ID || 'app3A5kJwYqxMLOgh',
        label: 'Unified YSWS Projects DB',
        tables: {
          approvedProjects: {
            id: 'tblzWWGUYHVH7Zyqf',
            label: 'Approved Projects',
            defaultFields: ['Record ID', 'ID', 'Email', 'Playable URL', 'Code URL']
          }
        }
      },
      thingondesk: {
        id: env.AIRTABLE_THINGONDESK_BASE_ID || '',
        label: 'Thingondesk',
        tables: {}
      }
    }
  }
}

export function publicAirtableConfig(config) {
  return {
    missing: config.missing,
    bases: Object.fromEntries(
      Object.entries(config.bases).map(([key, base]) => [
        key,
        {
          label: base.label,
          configured: Boolean(base.id),
          tables: Object.fromEntries(
            Object.entries(base.tables).map(([tableKey, table]) => [
              tableKey,
              {
                label: table.label,
                fields: table.defaultFields || []
              }
            ])
          )
        }
      ])
    )
  }
}
