<script>
  import { page } from "$app/state";
  import GitHub from "#lib/GitHub.svelte";
  import Theme from "#lib/Theme.svelte";
</script>

<svelte:head>
  <title>{page.status === 404 ? "Not found" : "Didn't load"} · namp</title>
</svelte:head>

<!-- A page the site doesn't have, or one that failed, in the front page's frame: what happened, and the way back.
     The docs answer their own (docs/+error.svelte). -->
<div class="corner">
  <Theme />
  <GitHub />
</div>

<main>
  {#if page.status === 404}
    <h1>No such page</h1>
    <p>Nothing on namp's site lives at <code>{page.url.pathname}</code>.</p>
  {:else}
    <h1>This page didn't load</h1>
    <p>Something went wrong on the site's side. Try again in a minute.</p>
  {/if}
  <nav aria-label="Ways back">
    <a href="/">The front page</a>
    <a href="/docs">Read the docs</a>
  </nav>
</main>

<style>
  /* The theme and the repo where the front page has them. */
  .corner {
    display: flex;
    gap: var(--sp-1);
    position: absolute;
    top: clamp(var(--sp-3), 2.5vh, var(--sp-6));
    right: calc(var(--gutter) - var(--sp-2));
  }

  /* On the front page's left line and its hero's top, at the docs' reading measure. */
  main {
    max-width: calc(64ch + 2 * var(--gutter));
    padding: clamp(72px, 10vh, 104px) var(--gutter) var(--sp-12);
  }

  h1 {
    margin: 0 0 var(--sp-3);
    color: var(--ink);
    font: var(--fw-strong) var(--fs-2xl) / 1.15 var(--cond);
    letter-spacing: -0.01em;
  }

  p {
    margin: 0 0 var(--sp-8);
    color: var(--ink-2);
    font-size: var(--fs-lg);
    line-height: 1.5;
    text-wrap: pretty;
  }

  code {
    overflow-wrap: anywhere;
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-6);
    font: var(--fw-strong) var(--fs-body) var(--cond);
  }
</style>
