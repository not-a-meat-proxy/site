<script>
  import { copyText } from "#lib/clipboard.js";

  let { data } = $props();

  let at = $derived(data.pages.findIndex((page) => page.path === data.page.path));
  let previous = $derived(data.pages[at - 1]);
  let next = $derived(data.pages[at + 1]);

  // A command's Copy: copied, it says so for two seconds; with no clipboard at all, the command is
  // selected, for the reader to copy.
  async function copy(event) {
    const button = event.target.closest("[data-copy]");
    if (!button) return;
    const code = button.parentElement.querySelector("code");
    if (await copyText(code.textContent)) {
      button.textContent = "Copied";
      setTimeout(() => (button.textContent = "Copy"), 2000);
    } else {
      getSelection().selectAllChildren(code);
    }
  }
</script>

<svelte:head>
  <title>{data.page.slug ? `${data.page.title} · namp docs` : "namp docs"}</title>
  <meta name="description" content={data.page.description} />
</svelte:head>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions:
     the clicks are the Copy buttons', which take Enter and Space themselves. -->
<article onclick={copy}>
  {@html data.page.html}
</article>

<nav class="turn" aria-label="Previous and next page">
  {#if previous}
    <a class="previous" href={previous.path}><span>Previous</span>{previous.title}</a>
  {/if}
  {#if next}
    <a class="next" href={next.path}><span>Next</span>{next.title}</a>
  {/if}
</nav>

<style>
  article {
    max-width: 42rem;
  }

  article :global(h1) {
    margin: 0 0 var(--sp-3);
    font-size: var(--fs-2xl);
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  /* The paragraph under the title says what the page is for. */
  article :global(h1 + p) {
    margin-bottom: var(--sp-8);
    color: var(--muted);
    font-size: var(--fs-lg);
    line-height: 1.45;
    text-wrap: pretty;
  }

  article :global(h2) {
    margin: var(--sp-10) 0 var(--sp-3);
    padding-top: var(--sp-5);
    border-top: 1px solid var(--line);
    font-size: var(--fs-xl);
    line-height: 1.25;
    letter-spacing: -0.01em;
    scroll-margin-top: var(--sp-4);
  }

  article :global(h3) {
    margin: var(--sp-6) 0 var(--sp-2);
    font-size: var(--fs-lg);
    line-height: 1.3;
    scroll-margin-top: var(--sp-4);
  }

  /* A heading's link, seen when the heading is pointed at or the link has the focus, and always
     on a screen with no pointer to hover. */
  article :global(.anchor) {
    color: var(--faint);
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

  article :global(strong) {
    font-weight: var(--fw-strong);
  }

  article :global(:not(pre) > code) {
    overflow-wrap: anywhere;
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

  .turn {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--sp-4);
    max-width: 42rem;
    margin-top: var(--sp-12);
    padding-top: var(--sp-6);
    border-top: 1px solid var(--line);
  }

  .turn a {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: var(--sp-3) var(--sp-4);
    border: 1px solid var(--edge);
    border-radius: var(--r-ctl);
    background: var(--surface);
    color: var(--ink);
    font: var(--fw-strong) var(--fs-lg)/1.3 var(--cond);
    text-decoration: none;
    transition: background var(--dur), border-color var(--dur);
  }

  .turn a:hover {
    border-color: var(--muted);
    background: var(--hover);
  }

  .turn span {
    color: var(--muted);
    font: var(--fw-normal) var(--fs-sm) var(--font);
  }

  .next {
    grid-column: 2;
    text-align: right;
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
