<script>
  // Reusable rules block. Drop it in any YSWS site:
  //   <Rules label="the rules" title="..." intro="..." items={[{tag, text, mark?}]} />
  let { label = 'the rules', title = 'The rules.', intro = '', items = [] } = $props()

  // Split a rule's text around its optional highlighted phrase.
  function parts(item) {
    if (!item.mark) return [{ text: item.text, mark: false }]
    const i = item.text.indexOf(item.mark)
    if (i === -1) return [{ text: item.text, mark: false }]
    return [
      { text: item.text.slice(0, i), mark: false },
      { text: item.mark, mark: true },
      { text: item.text.slice(i + item.mark.length), mark: false }
    ]
  }
</script>

<section class="window">
  <header class="bar rules-bar">
    <h2>{title}</h2>
    <span class="sep" aria-hidden="true"></span>
    {#if intro}<p class="rules-intro">{intro}</p>{/if}
    <span class="rules-count label">{items.length} checks</span>
  </header>

  <ol class="pane rules-list">
    {#each items as item}
      <li class="rule">
        <span class="tick" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 12.5 10 17.5 19 7" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
        <span class="rule-tag label">{item.tag}</span>
        <p class="rule-text">
          {#each parts(item) as p}{#if p.mark}<mark>{p.text}</mark>{:else}{p.text}{/if}{/each}
        </p>
      </li>
    {/each}
  </ol>
</section>

<style>
  .rules-bar {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 12px 20px;
    min-height: 52px;
  }
  .rules-bar h2 { font-size: 1.5rem; font-weight: 300; white-space: nowrap; }
  .rules-intro { margin: 0; font-size: 0.98rem; color: var(--ink-2); max-width: 60ch; }
  .rules-count { margin-left: auto; white-space: nowrap; }

  .rules-list { list-style: none; margin: 0; padding: 8px 26px 16px; }

  .rule {
    display: grid;
    grid-template-columns: 30px minmax(88px, auto) 1fr;
    gap: 6px 16px;
    align-items: center;
    padding: 15px 6px;
    border-radius: var(--r-sm);
    transition: background 0.25s, transform 0.25s var(--ease);
  }
  .rule + .rule { border-top: 1px solid rgba(255, 255, 255, 0.14); }
  .rule:hover { background: rgba(255, 255, 255, 0.08); transform: translateX(5px); }

  .tick {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: radial-gradient(circle at 36% 24%, #fff 1%, var(--lime) 16%, var(--grass) 58%, var(--grass-dk) 100%);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.3), inset 0 2px 2px rgba(255, 255, 255, 0.75);
  }
  .tick svg { width: 16px; height: 16px; }

  .rule-tag {
    justify-self: start;
    padding: 4px 10px;
    border-radius: var(--r-pill);
    font-size: 0.62rem;
    color: var(--ink);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0.08) 49.6%, rgba(255, 255, 255, 0.02) 50%);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.34), inset 0 -1px 0 rgba(0, 0, 0, 0.3);
    white-space: nowrap;
  }

  .rule-text { margin: 0; font-size: 1.02rem; line-height: 1.55; color: var(--ink); }
  .rule-text mark {
    padding: 1px 8px;
    border-radius: var(--r-pill);
    color: var(--pill-tx);
    font-weight: 700;
    text-shadow: none;
    background-image:
      linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.18) 49.6%, rgba(255, 255, 255, 0) 50%),
      linear-gradient(180deg, var(--pill-hi) 0%, var(--pill-lo) 100%);
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }

  @media (max-width: 960px) {
    .rules-bar { flex-wrap: wrap; gap: 10px 16px; }
    .rules-bar .sep { display: none; }
    .rules-count { margin-left: 0; }
  }
  @media (max-width: 640px) {
    .rules-list { padding-inline: 14px; }
    .rule { grid-template-columns: 26px 1fr; }
    .rule-tag { grid-column: 2; grid-row: 1; }
    .tick { grid-column: 1; grid-row: 1; }
    .rule-text { grid-column: 1 / 3; }
  }
</style>
