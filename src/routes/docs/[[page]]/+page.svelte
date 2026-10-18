<script>
  import { copyText } from "$lib/clipboard.js";

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
    margin: 0 0 1rem;
    font: 700 clamp(2.4rem, 5vw, 3.5rem) / 1 var(--display);
    font-variation-settings: "wdth" 85;
    letter-spacing: -0.03em;
  }

  /* The paragraph under the title says what the page is for. */
  article :global(h1 + p) {
    margin-bottom: 2rem;
    color: var(--muted);
    font-size: 1.15rem;
    line-height: 1.5;
    text-wrap: pretty;
  }

  article :global(h2) {
    margin: 2.5rem 0 0.6rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--line);
    font: 650 clamp(1.45rem, 2.2vw, 1.75rem) / 1.15 var(--display);
    letter-spacing: -0.015em;
    scroll-margin-top: 1rem;
  }

  article :global(h3) {
    margin: 1.75rem 0 0.4rem;
    font: 600 1.2rem/1.3 var(--display);
    scroll-margin-top: 1rem;
  }

  /* A heading's link, seen when the heading is pointed at or the link has the focus, and always
     on a screen with no pointer to hover. */
  article :global(.anchor) {
    color: var(--line);
    font-weight: 500;
    text-decoration: none;
    opacity: 0;
  }

  article :global(:is(h2, h3):hover .anchor),
  article :global(.anchor:focus-visible) {
    opacity: 1;
  }

  article :global(.anchor:hover) {
    color: var(--teal);
  }

  @media (hover: none) {
    article :global(.anchor) {
      opacity: 1;
    }
  }

  article :global(p),
  article :global(ul),
  article :global(ol) {
    margin: 0 0 1rem;
    text-wrap: pretty;
  }

  article :global(ul),
  article :global(ol) {
    padding-left: 1.3rem;
  }

  article :global(li + li) {
    margin-top: 0.35rem;
  }

  article :global(ol > li::marker) {
    font: 600 1rem var(--display);
    color: var(--muted);
  }

  article :global(strong) {
    font-weight: 600;
  }

  article :global(:not(pre) > code) {
    padding: 0.05rem 0.3rem;
    border: 1px solid var(--line);
    border-radius: 5px;
    background: #fff;
    overflow-wrap: anywhere;
  }

  /* A command reads as the front page's install command: ink, with its Copy at the right. What a
     command prints sits lighter, with no Copy. Both wrap rather than scroll, so a phone shows it whole. */
  article :global(.code) {
    display: flex;
    align-items: stretch;
    margin: 0 0 1.25rem;
    border: 1px solid var(--ink);
    border-radius: 10px;
    background: var(--ink);
    overflow: hidden;
  }

  article :global(.code pre) {
    flex: 1;
    min-width: 0;
    margin: 0;
    padding: 0.8rem 1rem;
    color: #e9f3f4;
    font-size: 0.9rem;
    line-height: 1.55;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  article :global(.code code) {
    font-size: inherit;
  }

  article :global(.code.output) {
    border-color: var(--line);
    background: #fff;
  }

  article :global(.code.output pre) {
    color: var(--ink);
    font-size: 0.85rem;
  }

  article :global(.copy) {
    flex: none;
    width: 5rem;
    border: 0;
    border-left: 1px solid rgb(255 255 255 / 0.15);
    background: var(--teal);
    color: #fff;
    font: 500 0.95rem var(--sans);
    cursor: pointer;
  }

  article :global(.copy:hover) {
    background: var(--teal-deep);
  }

  /* A note to heed, in the amber the front page keeps for what waits for the reader. */
  article :global(blockquote) {
    margin: 0 0 1.25rem;
    padding: 0.75rem 1rem;
    border-left: 3px solid var(--amber);
    background: #fbf1e6;
  }

  article :global(blockquote p:last-child) {
    margin-bottom: 0;
  }

  .turn {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    max-width: 42rem;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--line);
  }

  .turn a {
    display: flex;
    flex-direction: column;
    padding: 0.75rem 1rem;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: #fff;
    font: 600 1.05rem/1.3 var(--display);
    text-decoration: none;
  }

  .turn a:hover {
    border-color: var(--teal);
  }

  .turn span {
    color: var(--muted);
    font: 400 0.85rem var(--sans);
  }

  .next {
    grid-column: 2;
    text-align: right;
  }

  @media (max-width: 40rem) {
    article :global(.code) {
      flex-direction: column;
    }

    article :global(.code pre) {
      padding: 0.75rem 0.85rem;
      font-size: 0.82rem;
    }

    article :global(.copy) {
      width: auto;
      padding: 0.6rem;
      border-left: 0;
      border-top: 1px solid rgb(255 255 255 / 0.15);
    }
  }
</style>
