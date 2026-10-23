<script>
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>Not in the docs · namp docs</title>
</svelte:head>

<!-- A page the docs don't have, in the docs' own frame: what happened, and the way back. -->
<article>
  {#if page.status === 404}
    <h1>No such page in the docs</h1>
    <p>The page at <code>{page.url.pathname}</code> may have moved: every page the docs hold is in their list of pages, and the <a href="/docs">Overview</a> says what each is for.</p>
  {:else}
    <h1>This page didn't load</h1>
    <p>Something went wrong on the site's side. Try again, or start from the <a href="/docs">Overview</a>.</p>
  {/if}
</article>

<style>
  article {
    grid-column: column;
    grid-row: 1;
    min-width: 0;
  }

  h1 {
    margin: 0 0 var(--sp-3);
    font-size: var(--fs-2xl);
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  p {
    margin: 0;
    color: var(--ink-2);
    font-size: var(--fs-lg);
    line-height: 1.5;
    text-wrap: pretty;
  }

  code {
    overflow-wrap: anywhere;
  }
</style>
