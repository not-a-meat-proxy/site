<script>
  import { page } from "$app/state";
  import GitHub from "#lib/GitHub.svelte";

  let { data, children } = $props();
</script>

<div class="docs">
  <header>
    <a class="brand" href="/">namp</a>
    <a class="section" href="/docs">Docs</a>
    <GitHub class="end" />
  </header>

  <!-- Every page, the one open with its sections under it. -->
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

  <main>
    {@render children()}
  </main>

  <footer>
    <p>namp is an alpha: expect rough edges, and <a href="/docs/report-an-issue">say which ones you hit</a>.</p>
  </footer>
</div>

<style>
  /* The sidebar on namp's rail grey, the page on paper beside it, as the app itself sits. */
  .docs {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    min-height: 100svh;
  }

  header {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    padding: 1.25rem var(--gutter) 0;
  }

  .brand {
    color: var(--ink);
    font: 700 1.7rem/1 var(--display);
    font-variation-settings: "wdth" 80;
    letter-spacing: -0.03em;
    text-decoration: none;
  }

  /* At the header's right on a phone, at the page's top right beside the sidebar. */
  header :global(.github.end) {
    align-self: center;
    margin: -0.45rem -0.45rem -0.45rem auto;
  }

  .section {
    color: var(--muted);
    font: 500 1.1rem/1 var(--display);
    text-decoration: none;
  }

  .brand:hover,
  .section:hover {
    color: var(--teal);
  }

  .pages ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .pages a {
    display: block;
    color: var(--ink);
    text-decoration: none;
  }

  .pages a:hover {
    color: var(--teal);
  }

  .pages a[aria-current="page"] {
    color: var(--teal-deep);
    font-weight: 600;
  }

  main {
    min-width: 0;
    padding: 2rem var(--gutter) 3rem;
    background: var(--paper);
  }

  footer {
    padding: 1.25rem var(--gutter) 2rem;
    background: var(--paper);
    color: var(--muted);
    font-size: 0.95rem;
  }

  footer p {
    margin: 0;
    max-width: 42rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--line);
  }

  /* On a phone, the pages are a row of chips under the name, wrapping, all in sight. */
  @media (max-width: 52rem) {
    .pages {
      padding: 1rem var(--gutter) 1.25rem;
    }

    .pages > ul {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    .pages a {
      padding: 0.3rem 0.75rem;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--paper);
      font-size: 0.95rem;
    }

    .pages a[aria-current="page"] {
      border-color: var(--teal);
      background: var(--teal);
      color: #fff;
    }

    .sections {
      display: none;
    }

    main {
      border-top: 1px solid var(--line);
    }
  }

  /* On a wide screen, the sidebar at the left, kept in sight while the page scrolls. */
  @media (min-width: 52.01rem) {
    .docs {
      position: relative;
      grid-template-columns: 17rem minmax(0, 1fr);
      grid-template-rows: auto 1fr auto;
    }

    header :global(.github.end) {
      position: absolute;
      top: 1.7rem;
      right: calc(clamp(2rem, 5vw, 5rem) - 0.45rem);
      margin: 0;
    }

    header {
      grid-column: 1;
      grid-row: 1;
      padding: 2rem 1.5rem 0 2rem;
    }

    .pages {
      grid-column: 1;
      grid-row: 2 / 4;
      align-self: start;
      position: sticky;
      top: 0;
      padding: 1.75rem 1.5rem 2rem 2rem;
    }

    .pages > ul > li + li {
      margin-top: 0.15rem;
    }

    .pages a {
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      margin-left: -0.75rem;
    }

    .pages a[aria-current="page"] {
      background: var(--paper);
    }

    .sections {
      margin: 0.2rem 0 0.5rem !important;
      padding-left: 0.75rem !important;
      border-left: 1px solid var(--line);
    }

    .sections a {
      padding-block: 0.2rem;
      color: var(--muted);
      font-size: 0.92rem;
      line-height: 1.35;
    }

    main {
      grid-column: 2;
      grid-row: 1 / 3;
      padding: 3.5rem clamp(2rem, 5vw, 5rem) 3rem;
      border-left: 1px solid var(--line);
    }

    footer {
      grid-column: 2;
      grid-row: 3;
      padding-inline: clamp(2rem, 5vw, 5rem);
      border-left: 1px solid var(--line);
    }
  }
</style>
