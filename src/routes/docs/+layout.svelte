<script>
  import { afterNavigate, goto } from "$app/navigation";
  import { page } from "$app/state";
  import { tick } from "svelte";
  import GitHub from "#lib/GitHub.svelte";
  import Theme from "#lib/Theme.svelte";

  let { data, children } = $props();

  let at = $derived(data.pages.findIndex((doc) => doc.path === page.url.pathname));
  let open = $derived(data.pages[at]);

  // The phone's menu: the shell in namp's drawer, over a scrim. Closed by Esc, the scrim, its close button
  // or a page picked, the focus going back to the menu button.
  // Its pages are drawn the first time it opens, the shell beside the page holding them till then.
  let drawer = $state();
  let menu = $state();
  let drawn = $state(false);

  async function show() {
    drawn = true;
    drawer.showModal();
    await tick();
    drawer.querySelector("[aria-current='page']")?.focus();
  }

  function hide() {
    if (drawer?.open) drawer.close();
  }

  // The dialog's own Esc and the browser's back to the focus are taken here too, so they hold where a
  // browser's dialog does neither.
  function keydown(event) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    hide();
  }

  afterNavigate(hide);

  // [ and ]: the page before and the one after, as namp's [ and ] step its views, as long as no text field
  // has them, no key is held with them and the menu is closed.
  function step(event) {
    if ((event.key !== "[" && event.key !== "]") || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target.closest?.("input, textarea, select, [contenteditable]") || drawer?.open) return;
    const to = data.pages[at + (event.key === "]" ? 1 : -1)];
    if (at < 0 || !to) return;
    event.preventDefault();
    goto(to.path);
  }
</script>

<svelte:window onkeydown={step} />

<!-- The faces a docs page paints in besides the start faces app.html preloads: its pages' rows, its strong
     words and its code, so none swaps in once the page shows. -->
<svelte:head>
  <link rel="preload" href="/fonts/FiraSansCondensed-Regular.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
  <link rel="preload" href="/fonts/FiraSans-SemiBold.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
  <link rel="preload" href="/fonts/FiraMono-Regular.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<!-- The shell's name, its theme and repository, and every page as namp's sidebar rows, the open one light. -->
{#snippet shell(close)}
  <header>
    <a class="brand" href="/">namp</a>
    <a class="section" href="/docs">Docs</a>
    <span class="end">
      <Theme />
      <GitHub />
      {#if close}
        <button type="button" class="icon" onclick={hide} aria-label="Close the menu">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" /></svg>
        </button>
      {/if}
    </span>
  </header>

  <nav class="pages" aria-label="Docs">
    <ul>
      {#each data.pages as doc (doc.path)}
        <li><a href={doc.path} aria-current={doc.path === page.url.pathname ? "page" : undefined}>{doc.title}</a></li>
      {/each}
    </ul>
  </nav>
{/snippet}

<div class="docs">
  <div class="side shell">{@render shell(false)}</div>

  <!-- On a phone, a bar over the page: the docs' name, the open page's title and the menu. -->
  <div class="bar shell">
    <a class="brand" href="/">namp</a>
    <a class="section" href="/docs">Docs</a>
    {#if open?.path !== "/docs"}<span class="title">{open?.title}</span>{/if}
    <button type="button" class="icon menu" bind:this={menu} onclick={show} aria-label="The docs' pages" aria-haspopup="dialog">
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" /></svg>
    </button>
  </div>

  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions:
       a click on the dialog itself is one on its scrim; Esc closes it from the keyboard. -->
  <dialog class="drawer shell" aria-label="The docs' pages" bind:this={drawer} onclick={(event) => event.target === drawer && hide()} onkeydown={keydown} onclose={() => menu?.focus()}>
    <div class="inside">
      {#if drawn}{@render shell(true)}{/if}
    </div>
  </dialog>

  <main>
    <div class="page">
      {@render children()}

      <footer>
        <p>namp is an alpha: expect rough edges, and <a href="/docs/report-an-issue">say which ones you hit</a>.</p>
      </footer>
    </div>
  </main>
</div>

<style>
  /* The shell beside the page on a wide screen, as namp's own sidebar sits; on a phone a bar over the page and
     a drawer. */
  .docs {
    --bar-h: 52px;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto 1fr;
    min-height: 100svh;
  }

  header {
    display: flex;
    align-items: baseline;
    gap: var(--sp-2);
  }

  .brand {
    color: var(--ink);
    font: var(--fw-strong) var(--fs-xl)/1 var(--cond);
    letter-spacing: -0.01em;
    text-decoration: none;
  }

  .section {
    color: var(--muted);
    font: var(--fw-medium) var(--fs-lg)/1 var(--cond);
    text-decoration: none;
  }

  .brand:hover,
  .section:hover {
    color: var(--accent-ink);
  }

  .end {
    display: flex;
    gap: var(--sp-1);
    align-self: center;
    margin: calc(-1 * var(--sp-2)) calc(-1 * var(--sp-2)) calc(-1 * var(--sp-2)) auto;
  }

  /* An icon button as the theme's: no edge, in a target large enough for a thumb. */
  .icon {
    display: inline-flex;
    padding: var(--sp-2);
    border: 0;
    border-radius: var(--r-sm);
    background: none;
    color: var(--ink-2);
  }

  .icon:hover {
    background: var(--hover);
    color: var(--ink);
  }

  .icon svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.4;
    stroke-linecap: round;
  }

  .pages {
    margin-top: var(--sp-6);
  }

  .pages ul {
    display: grid;
    gap: var(--sp-1);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* A page: a slim rectangle on the shell, as a topic is in namp's sidebar; the open one light. */
  .pages a {
    display: flex;
    align-items: center;
    min-height: 34px;
    padding: 6px 10px 6px var(--sp-3);
    border-radius: var(--r-xs);
    background: var(--bay-strip);
    box-shadow: inset 0 0 0 1px transparent;
    color: var(--bay-ink);
    font: var(--fw-normal) var(--fs-md)/1.25 var(--cond);
    text-decoration: none;
    transition: box-shadow var(--dur);
  }

  .pages a:hover {
    box-shadow: inset 0 0 0 1px var(--bay-line);
  }

  .pages a[aria-current="page"] {
    background: var(--bay-on);
    color: var(--bay-on-ink);
    font-weight: var(--fw-medium);
  }

  /* The page: its column and the footer under it on one grid, the column centred in the space beside the
     shell, the margin at its left holding the sections' marks and the track at its right On this page. */
  main {
    min-width: 0;
    container: page / inline-size;
  }

  .page {
    display: grid;
    grid-template-columns: [full-start] minmax(var(--gutter), 1fr) [column-start] minmax(0, 64ch) [column-end] minmax(var(--gutter), 1fr) [full-end];
    align-content: start;
    padding: var(--sp-6) 0 var(--sp-8);
  }

  footer {
    grid-column: column;
    grid-row: 3;
    margin-top: var(--sp-12);
    padding-top: var(--sp-5);
    border-top: 1px solid var(--line);
    color: var(--muted);
    font-size: var(--fs-md);
  }

  footer p {
    margin: 0;
  }

  .side {
    display: none;
  }

  /* On a phone, the bar stays at the top as the page scrolls, the menu at its right. */
  .bar {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    height: var(--bar-h);
    padding: 0 var(--sp-2) 0 var(--gutter);
  }

  .bar .brand {
    font-size: var(--fs-lg);
  }

  .bar .section {
    font-size: var(--fs-md);
  }

  .bar .title {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    color: var(--ink-2);
    font: var(--fw-normal) var(--fs-md)/1.2 var(--cond);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bar .title::before {
    content: "/";
    margin-right: var(--sp-2);
    color: var(--muted);
  }

  .menu {
    margin-left: auto;
  }

  /* namp's drawer over a narrow window: from the right edge, over a scrim, in its time and easing, the
     shadow of what floats. */
  .drawer {
    position: fixed;
    inset: 0 0 0 auto;
    width: min(320px, calc(100vw - var(--sp-12)));
    max-width: none;
    height: 100dvh;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    box-shadow: var(--shadow-2);
    transform: translateX(100%);
    transition:
      transform var(--dur-drawer) var(--ease-out),
      overlay var(--dur-drawer) allow-discrete,
      display var(--dur-drawer) allow-discrete;
  }

  .drawer[open] {
    transform: none;
  }

  .drawer::backdrop {
    background: var(--dim);
    opacity: 0;
    transition:
      opacity var(--dur-drawer) var(--ease-out),
      overlay var(--dur-drawer) allow-discrete,
      display var(--dur-drawer) allow-discrete;
  }

  .drawer[open]::backdrop {
    opacity: 1;
  }

  @starting-style {
    .drawer[open] {
      transform: translateX(100%);
    }

    .drawer[open]::backdrop {
      opacity: 0;
    }
  }

  .inside {
    height: 100%;
    overflow-y: auto;
    padding: var(--sp-4) var(--sp-4) var(--sp-8) var(--sp-5);
  }

  .inside header {
    align-items: center;
    min-height: var(--sp-10);
  }

  :global(html:has(.drawer[open])) {
    overflow: hidden;
  }

  /* On a wide screen, the shell at the left, kept in sight while the page scrolls, its graphite the page's
     whole height. */
  @media (min-width: 52.01rem) {
    .docs {
      --bar-h: 0px;
      grid-template-columns: 280px minmax(0, 1fr);
      background: linear-gradient(to right, var(--bay-side) 280px, transparent 280px);
    }

    .bar,
    .drawer {
      display: none;
    }

    .side {
      display: block;
      position: sticky;
      top: 0;
      align-self: start;
      height: 100svh;
      overflow-y: auto;
      padding: var(--sp-6) var(--sp-4) var(--sp-8);
      scrollbar-color: var(--bay-line) var(--bay-side);
    }

    header {
      padding: 0 0 0 var(--sp-1);
    }

    .side {
      grid-row: 1 / 3;
    }

    main {
      grid-column: 2;
      grid-row: 1 / 3;
    }

    .page {
      padding-top: 56px;
    }
  }

  /* With room for it, the margin takes the sections' marks: as wide as a mark and its gap to the column. */
  @container page (min-width: 40rem) {
    .page {
      grid-template-columns: [full-start] minmax(96px, 1fr) [column-start] minmax(0, 64ch) [column-end] minmax(96px, 1fr) [full-end];
    }
  }
</style>
