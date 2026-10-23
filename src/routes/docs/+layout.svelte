<script>
  import { page } from "$app/state";
  import GitHub from "#lib/GitHub.svelte";

  let { data, children } = $props();
</script>

<div class="docs">
  <!-- The shell, graphite as namp's sidebar: the name, the repo and every page, the open one light with
       its sections under it. -->
  <div class="side shell">
    <header>
      <a class="brand" href="/">namp</a>
      <a class="section" href="/docs">Docs</a>
      <GitHub class="end" />
    </header>

    <nav class="pages" aria-label="Docs">
      <ul>
        {#each data.pages as doc (doc.path)}
          {@const open = doc.path === page.url.pathname}
          <li>
            <a href={doc.path} aria-current={open ? "page" : undefined}>{doc.title}</a>
            {#if open && doc.sections.length}
              <ul class="sections">
                {#each doc.sections as section (section.id)}
                  <li><a href="#{section.id}">{section.text}</a></li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    </nav>
  </div>

  <main>
    {@render children()}
  </main>

  <footer>
    <p>namp is an alpha: expect rough edges, and <a href="/docs/report-an-issue">say which ones you hit</a>.</p>
  </footer>
</div>

<style>
  /* The shell beside the page on a wide screen, over it on a phone, as namp's own sidebar sits. */
  .docs {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
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

  header :global(.github.end) {
    align-self: center;
    margin: calc(-1 * var(--sp-2)) calc(-1 * var(--sp-2)) calc(-1 * var(--sp-2)) auto;
  }

  .pages ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* A page: a slim rectangle on the shell, as a topic is in namp; the open one light. */
  .pages > ul > li > a {
    display: flex;
    align-items: center;
    min-height: 34px;
    padding: 6px var(--sp-3);
    border-radius: var(--r-xs);
    background: var(--bay-strip);
    color: var(--bay-ink);
    font: var(--fw-normal) var(--fs-md)/1.25 var(--cond);
    text-decoration: none;
    transition: box-shadow var(--dur);
  }

  .pages > ul > li > a:hover {
    box-shadow: inset 0 0 0 1px var(--bay-muted);
  }

  .pages > ul > li > a[aria-current="page"] {
    background: var(--bay-on);
    color: var(--bay-on-ink);
    font-weight: var(--fw-medium);
  }

  .sections a {
    display: block;
    padding: 3px var(--sp-2);
    border-radius: var(--r-xs);
    color: var(--muted);
    font-size: var(--fs-sm);
    line-height: 1.35;
    text-decoration: none;
  }

  .sections a:hover {
    background: var(--hover);
    color: var(--ink);
  }

  main {
    min-width: 0;
    padding: var(--sp-8) var(--gutter) var(--sp-12);
  }

  footer {
    padding: 0 var(--gutter) var(--sp-8);
    color: var(--muted);
    font-size: var(--fs-md);
  }

  footer p {
    margin: 0;
    max-width: 42rem;
    padding-top: var(--sp-5);
    border-top: 1px solid var(--line);
  }

  /* On a phone, the shell is a band over the page: the name, then the pages wrapping, all in sight. */
  @media (max-width: 52rem) {
    .side {
      padding: var(--sp-5) var(--gutter) var(--sp-4);
    }

    .pages {
      margin-top: var(--sp-4);
    }

    .pages > ul {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-1);
    }

    .pages > ul > li > a {
      min-height: 32px;
      padding-block: var(--sp-1);
    }

    .sections {
      display: none;
    }
  }

  /* On a wide screen, the shell at the left, kept in sight while the page scrolls. */
  @media (min-width: 52.01rem) {
    .docs {
      grid-template-columns: 280px minmax(0, 1fr);
      grid-template-rows: 1fr auto;
    }

    .side {
      grid-column: 1;
      grid-row: 1 / 3;
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

    .pages {
      margin-top: var(--sp-6);
    }

    .pages > ul {
      display: grid;
      gap: var(--sp-1);
    }

    .sections {
      margin: var(--sp-2) 0 var(--sp-3) var(--sp-3) !important;
      padding-left: var(--sp-2) !important;
      border-left: 1px solid var(--line);
    }

    main {
      grid-column: 2;
      grid-row: 1;
      padding: 56px clamp(var(--sp-8), 5vw, 80px) var(--sp-12);
    }

    footer {
      grid-column: 2;
      grid-row: 2;
      padding-inline: clamp(var(--sp-8), 5vw, 80px);
    }
  }
</style>
