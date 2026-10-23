<script>
  import { copyText } from "#lib/clipboard.js";
  import { inView, turn } from "#lib/docs/sections.js";

  let { data } = $props();

  let at = $derived(data.pages.findIndex((page) => page.path === data.page.path));
  let previous = $derived(data.pages[at - 1]);
  let next = $derived(data.pages[at + 1]);

  // The section in view, by its index: the first while the page shows its top, as the build draws it.
  let article = $state();
  let end = $state();
  let current = $state(0);

  // Each section's mark takes namp's plan sign for where the reader is: done above the section in view,
  // running for it, planned below. Only the attribute changes, so nothing round a mark moves; the arc
  // turns a quarter round into its place as its section comes into view, and stands still under reduced motion.
  $effect(() => {
    data.page.path;
    current = 0;
    return inView(article, end, (index) => {
      if (index === current) return;
      current = index;
      article.querySelectorAll("h2 > .mark").forEach((mark, i) => {
        const sign = i < index ? "done" : i === index ? "running" : "planned";
        if (mark.dataset.sign === sign) return;
        mark.dataset.sign = sign;
        if (sign === "running") turn(mark.querySelector(".arc"));
      });
    });
  });

  // A command's Copy: copied, it says so for two seconds, to a screen reader too; with no clipboard at all,
  // the command is selected, for the reader to copy.
  let said = $state("");

  async function copy(event) {
    const button = event.target.closest("[data-copy]");
    if (!button) return;
    const code = button.parentElement.querySelector("code");
    if (await copyText(code.textContent)) {
      button.textContent = "Copied";
      said = "Copied";
      setTimeout(() => ((button.textContent = "Copy"), (said = "")), 2000);
    } else {
      getSelection().selectAllChildren(code);
    }
  }
</script>

<svelte:head>
  <title>{data.page.slug ? `${data.page.title} · namp docs` : "namp docs"}</title>
  <meta name="description" content={data.page.description} />
</svelte:head>

<!-- On this page: the page's sections, the one in view marked as namp marks a selected row. -->
{#snippet sections()}
  <ul>
    {#each data.page.sections as section, i (section.id)}
      <li><a href="#{section.id}" aria-current={i === current ? "location" : undefined}>{section.text}</a></li>
    {/each}
  </ul>
{/snippet}

<!-- On a wide page, at the column's right; first in the reading order after the shell, as it is first in sight. -->
{#if data.page.sections.length > 1}
  <nav class="contents aside" aria-label="On this page">
    <p class="label" aria-hidden="true">On this page</p>
    {@render sections()}
  </nav>
{/if}

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions:
     the clicks are the Copy buttons', which take Enter and Space themselves. -->
<article onclick={copy} bind:this={article}>
  {@html data.page.opening}
  {#if data.page.sections.length > 1}
    <details class="contents folded">
      <summary>On this page</summary>
      {@render sections()}
    </details>
  {/if}
  {@html data.page.html}
</article>

<nav class="turn" aria-label="Previous and next page" bind:this={end}>
  {#if previous}
    <a class="previous" href={previous.path} title="Previous page ([)"><span>Previous <kbd>[</kbd></span>{previous.title}</a>
  {/if}
  {#if next}
    <a class="next" href={next.path} title="Next page (])"><span>Next <kbd>]</kbd></span>{next.title}</a>
  {/if}
</nav>

<span class="said" aria-live="polite">{said}</span>

<style>
  article,
  .turn {
    grid-column: column;
    min-width: 0;
  }

  article {
    grid-row: 1;
  }

  article :global(h1) {
    margin: 0 0 var(--sp-3);
    font-size: var(--fs-2xl);
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  /* The opening: the paragraph under the title says what the page is for. */
  article :global(h1 + p) {
    margin: 0 0 var(--sp-10);
    color: var(--ink-2);
    font-size: var(--fs-lg);
    line-height: 1.5;
    text-wrap: pretty;
  }

  article :global(h2) {
    position: relative;
    margin: var(--sp-12) 0 var(--sp-3);
    font-size: var(--fs-xl);
    line-height: 1.25;
    letter-spacing: -0.01em;
    scroll-margin-top: var(--sp-4);
  }

  article :global(h3) {
    margin: var(--sp-8) 0 var(--sp-2);
    font-size: var(--fs-lg);
    line-height: 1.3;
    scroll-margin-top: var(--sp-4);
  }

  /* A section's mark: its number and namp's plan sign, before its heading on a narrow page and in the
     margin level with it on a wide one. As tall as the heading's first line, so both centre on it. */
  article :global(.mark) {
    display: inline-flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: var(--sp-2);
    height: calc(var(--fs-xl) * 1.25);
    margin-right: var(--sp-3);
    vertical-align: top;
    color: var(--muted);
    font: var(--fw-medium) var(--fs-sm)/1 var(--cond);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0;
    user-select: none;
  }

  /* namp's plan sign (ui/src/lib/overview/PlanSign.svelte), its three shapes drawn in one place and the
     mark's state showing one: done a filled disc with a check, running a turning arc on a track, planned a
     ring. Smaller than namp's 16px, to stay under the text. */
  article :global(.ps) {
    flex: none;
    width: 14px;
    height: 14px;
    overflow: visible;
  }

  article :global(.ps :is(circle, path)) {
    fill: none;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  article :global(.ps g) {
    opacity: 0;
    transition: opacity var(--dur) var(--ease-out);
  }

  article :global(.mark[data-sign="planned"] .planned),
  article :global(.mark[data-sign="running"] .running),
  article :global(.mark[data-sign="done"] .done) {
    opacity: 1;
  }

  article :global(.ps .planned circle) {
    stroke: var(--faint);
  }

  article :global(.ps .track) {
    stroke: var(--line-strong);
  }

  article :global(.ps .arc) {
    stroke: var(--accent);
    stroke-width: 2.2;
    transform-origin: 8px 8px;
  }

  article :global(.ps .done circle) {
    fill: var(--ok);
    stroke: var(--ok);
  }

  article :global(.ps .done path) {
    stroke: var(--bg);
    stroke-width: 1.9;
  }

  /* A heading's link, seen when the heading is pointed at or the link has the focus, and always
     on a screen with no pointer to hover. */
  article :global(.anchor) {
    color: var(--muted);
    font-weight: var(--fw-medium);
    text-decoration: none;
    opacity: 0;
  }

  article :global(:is(h2, h3):hover .anchor),
  article :global(.anchor:focus-visible) {
    opacity: 1;
  }

  article :global(.anchor:hover) {
    color: var(--accent-ink);
  }

  @media (hover: none) {
    article :global(.anchor) {
      opacity: 1;
    }
  }

  article :global(p),
  article :global(ul),
  article :global(ol) {
    margin: 0 0 var(--sp-4);
    text-wrap: pretty;
  }

  article :global(ul),
  article :global(ol) {
    padding-left: 20px;
  }

  article :global(li + li) {
    margin-top: 6px;
  }

  article :global(ol > li::marker) {
    color: var(--muted);
    font: var(--fw-strong) var(--fs-body) var(--cond);
  }

  article :global(ul > li::marker) {
    color: var(--muted);
  }

  article :global(strong) {
    font-weight: var(--fw-strong);
  }

  article :global(:not(pre) > code) {
    white-space: nowrap;
  }

  article :global(:not(pre) > code.long) {
    white-space: normal;
    overflow-wrap: anywhere;
  }

  /* A key, as namp draws one. */
  :global(:is(article, .turn) kbd) {
    padding: 2px 5px;
    border: 1px solid var(--line-strong);
    border-bottom-width: 2px;
    border-radius: var(--r-xs);
    background: var(--surface);
    color: var(--muted);
    font: var(--fw-medium) var(--fs-2xs)/1 var(--mono);
  }

  article :global(table) {
    width: 100%;
    margin: 0 0 var(--sp-5);
    border-collapse: collapse;
    font-size: var(--fs-md);
  }

  article :global(:is(th, td)) {
    padding: var(--sp-2) var(--sp-3) var(--sp-2) 0;
    border-bottom: 1px solid var(--line);
    text-align: left;
    vertical-align: top;
  }

  article :global(th) {
    color: var(--muted);
    font: var(--fw-medium) var(--fs-sm) var(--cond);
  }

  /* A command reads as the front page's install command: a code block with its Copy at the right. What a
     command prints sits on the ground inside a hairline, with no Copy. Both wrap rather than scroll, so a
     phone shows it whole. */
  article :global(.code) {
    display: flex;
    align-items: start;
    gap: var(--sp-3);
    margin: 0 0 var(--sp-5);
    padding: var(--sp-2) var(--sp-2) var(--sp-2) var(--sp-4);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    background: var(--sunken);
  }

  article :global(.code pre) {
    flex: 1;
    min-width: 0;
    margin: 0;
    padding: 6px 0;
    color: var(--code-ink);
    font: var(--fs-sm)/1.65 var(--mono);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  article :global(.code.output) {
    background: none;
  }

  article :global(.code.output pre) {
    color: var(--ink-2);
  }

  article :global(.copy) {
    flex: none;
    min-width: 72px;
  }

  /* A note to heed: a strip with the ask's band at its left, as the front page's note on a Mac. */
  article :global(blockquote) {
    margin: 0 0 var(--sp-5);
    padding: var(--sp-3) var(--sp-4);
    border-left: var(--flag) solid var(--ask);
    background: var(--surface);
  }

  article :global(blockquote p:last-child) {
    margin-bottom: 0;
  }

  /* On this page: each section a row on a hairline, the one in view on a 2px accent rule in the strong
     ink, as namp marks the view it shows. */
  .contents ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .contents li {
    margin: 0;
  }

  .contents a {
    display: block;
    padding: 5px 0 5px var(--sp-3);
    border-left: 1px solid var(--line);
    color: var(--muted);
    font: var(--fw-medium) var(--fs-sm)/1.35 var(--cond);
    text-decoration: none;
    transition: color var(--dur), box-shadow var(--dur);
  }

  .contents a:hover {
    color: var(--ink);
  }

  .contents a[aria-current="location"] {
    box-shadow: inset 1px 0 0 var(--accent);
    border-left-color: var(--accent);
    color: var(--ink);
  }

  /* Under the opening on a narrow page, folded. */
  .folded {
    margin: calc(-1 * var(--sp-6)) 0 0;
    border-block: 1px solid var(--line);
  }

  .folded summary {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    min-height: 44px;
    color: var(--ink-2);
    font: var(--fw-medium) var(--fs-md)/1.2 var(--cond);
    list-style: none;
    cursor: pointer;
  }

  .folded summary::-webkit-details-marker {
    display: none;
  }

  .folded summary::after {
    content: "";
    width: 7px;
    height: 7px;
    margin: -3px 0 0 auto;
    border: solid var(--muted);
    border-width: 0 1.5px 1.5px 0;
    transform: rotate(45deg);
    transition: transform var(--dur);
  }

  .folded[open] summary::after {
    margin-top: 3px;
    transform: rotate(-135deg);
  }

  .folded ul {
    padding-bottom: var(--sp-3);
  }

  .aside {
    display: none;
  }

  /* Previous and Next: namp's rows on the column, the key that steps to each beside its word. */
  .turn {
    grid-row: 2;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--sp-4);
    margin-top: var(--sp-12);
  }

  .turn a {
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
    margin: 0 -10px;
    padding: var(--sp-2) 10px;
    border-radius: var(--r-md);
    color: var(--ink);
    font: var(--fw-strong) var(--fs-lg)/1.3 var(--cond);
    text-decoration: none;
    transition: background var(--dur);
  }

  .turn a:hover {
    background: var(--hover);
  }

  .turn span {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    color: var(--muted);
    font: var(--fw-normal) var(--fs-sm)/1.2 var(--font);
  }

  .next {
    grid-column: 2;
    align-items: end;
    text-align: right;
  }

  .said {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  /* On a narrow page each mark hangs before its heading, a wrapped heading's lines starting together. */
  @container page (max-width: 39.99rem) {
    article :global(h2) {
      margin-top: var(--sp-10);
      padding-left: var(--sp-12);
    }

    article :global(h2 > .mark) {
      position: absolute;
      top: 0;
      left: 0;
      margin: 0;
    }
  }

  /* Under a finger, each row of On this page and each Copy as tall as a thumb's target. */
  @media (pointer: coarse) {
    .contents a {
      display: flex;
      align-items: center;
      min-height: 44px;
    }

    article :global(.copy) {
      min-height: 44px;
    }
  }

  /* With room for it, each mark stands in the margin, its sign a step off the column, level with its
     heading. */
  @container page (min-width: 40rem) {
    article :global(h2 > .mark) {
      position: absolute;
      top: 0;
      right: calc(100% + var(--sp-5));
      margin: 0;
    }
  }

  /* With room for it, On this page stands at the column's right, kept in sight while the page scrolls. */
  @container page (min-width: 62rem) {
    .folded {
      display: none;
    }

    .aside {
      grid-column: column-end / full-end;
      grid-row: 1 / 3;
      display: block;
      position: sticky;
      top: var(--page-top);
      align-self: start;
      width: min(200px, 100% - var(--sp-10));
      margin-left: var(--sp-10);
      padding-top: calc(var(--fs-2xl) * 1.15 + var(--sp-3));
    }

    .aside .label {
      margin: 0 0 var(--sp-3);
      color: var(--ink);
      font: var(--fw-strong) var(--fs-sm)/1.2 var(--cond);
    }
  }

  @media (max-width: 40rem) {
    article :global(.code) {
      flex-direction: column;
      align-items: stretch;
      padding: var(--sp-2) var(--sp-2) var(--sp-2) var(--sp-3);
    }

    article :global(.code pre) {
      font-size: var(--fs-xs);
    }
  }
</style>
