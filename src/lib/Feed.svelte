<script>
  // News and events share a shape: a titled entry, an optional date, a body.
  // One component, two callers.
  let {
    id = '',
    title = '',
    sub = '',
    items = [],
    titleKey = 'title',
    dateKey = 'publishedAt'
  } = $props()

  const entryTitle = (e) => e[titleKey] || e.title || e.name || ''
  const entryBody = (e) => e.body || e.content || e.description || ''
  const entryDate = (e) => {
    const raw = e[dateKey]
    if (!raw) return ''
    const d = new Date(raw)
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString()
  }
</script>

<section class="col" {id}>
  <div class="window">
    <header class="titlebar">
      <h2>{title}</h2>
      <span class="sep" aria-hidden="true"></span>
      <p>{sub}</p>
    </header>

    <div class="panel-body">
      {#each items as item}
        <article class="entry">
          <h3>{entryTitle(item)}</h3>
          {#if entryDate(item)}<p class="when hud">{entryDate(item)}</p>{/if}
          {#if entryBody(item)}<p class="body">{entryBody(item)}</p>{/if}
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .entry { padding: 14px 0; }
  .entry + .entry { border-top: 1px solid var(--panel-line); }
  h3 { font-size: var(--t-h3); }
  .when { margin-top: 3px; }
  .body { margin-top: 6px; font-size: var(--t-sm); color: var(--ink-2); max-width: 66ch; }
</style>
