<script>
  import Address from "#lib/Address.svelte";
  import GitHub from "#lib/GitHub.svelte";
  import Theme from "#lib/Theme.svelte";
  import Drawer from "#lib/home/Drawer.svelte";
  import Tour from "#lib/home/Tour.svelte";
  import { hero, WIDE } from "#lib/home/places.js";
  import { copyText } from "#lib/clipboard.js";

  // namp's screenshots, from a trial server of namp, by theme: the hero's, a topic's canvas page with namp's
  // drawer open on a question, under the live drawer; the tour's, the same page with its Timeline open, whole on
  // the second screen and cut on a narrow one. On a phone the hero is the live drawer alone.
  const alt =
    "A topic's canvas page in namp: the canvas bar counts its 2 asks and steps through them; Timeline shows today's work by the session and three sibling sessions, two questions open; Since you were here counts 2 done and 1 decided; the decisions D3 and D4 each carry an ask's mark in the gutter; the lane at the right holds the topic's threads, its goal, Work with 2 tasks running, its pull request waiting on your review and its documents.";

  const shots = {
    dark: { wide: { src: "/shots/tour-dark.webp", width: WIDE.w, height: WIDE.h } },
    light: { wide: { src: "/shots/tour-light.webp", width: WIDE.w, height: WIDE.h } },
  };

  let { data } = $props();

  const lede = "Scale your impact with agent sessions, without losing the thread.";

  // The address Ask for an invite writes to, shown for a visitor with no mail app: none when
  // INVITE_CONTACT is a link rather than an address.
  let address = $derived(data.contact?.startsWith("mailto:") ? decodeURIComponent(data.contact.slice(7).split("?")[0]) : null);

  let command = $derived(data.tester ? `curl -fsSL ${data.site}/install.sh | sh -s -- ${data.tester.token}` : "");
  let copied = $state(false);
  // The room the drawer held before the first answer: it keeps it as what it shows changes, so nothing round the
  // hero moves.
  /** @type {HTMLElement | undefined} */
  let spot = $state();
  let held = $state(0);
  const hold = () => (held ||= spot?.getBoundingClientRect().height ?? 0);
  let shown = $state();

  // Copied, or with no clipboard at all the command selected, for the tester to copy.
  async function copy() {
    if (await copyText(command)) {
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } else {
      getSelection().selectAllChildren(shown);
    }
  }
</script>

<svelte:head>
  <title>namp: scale your impact with agent sessions, without losing the thread</title>
  <meta name="description" content={lede} />
  <!-- A tester's command is in the mono, on the first screen: its face preloads with the start faces
       (app.html), so the command never reflows as it arrives. -->
  {#if data.tester}<link rel="preload" href="/fonts/FiraMono-Regular.woff2" as="font" type="font/woff2" crossorigin="anonymous" />{/if}
</svelte:head>

<!-- The call: one control in two parts, Get an invite and the address it writes to, with the address's copy, so
     a visitor with no mail app has it on show; in the hero the docs under it, as a plain link. -->
{#snippet ask(docs)}
  <div class="ask">
    {#if data.contact}
      <div class="join">
        <a class="button primary go" href={data.contact}>Get an invite</a>
        {#if address}<span class="to"><span class="or">or write to</span> <Address {address} /></span>{/if}
      </div>
    {/if}
    {#if docs}<a class="after" href="/docs">Read the docs</a>{/if}
  </div>
{/snippet}

<div class="corner">
  <Theme />
  <GitHub />
</div>

<main>
  <section class="hero grid">
    <div class="pitch">
      <h1>Not A Meat Proxy.</h1>
      <!-- In two parts, each kept whole, so a line breaks at its comma or nowhere. -->
      <p class="lede">{#each lede.split(/(?<=,) /) as part, i}{i ? " " : ""}<span>{part}</span>{/each}</p>
      {#if data.tester}
        <p class="open">Install namp, {data.tester.name}</p>
        <!-- Wrapped in its box so it reads whole: between its words, none broken, the token whole on its own
             line unless the box is narrower than it. Copy still takes it as one line. -->
        <div class="command">
          <code bind:this={shown}>{#each command.split(" ") as word, i}{i ? " " : ""}<span class:token={word === data.tester.token}>{word}</span>{/each}</code>
          <button type="button" class="primary" onclick={copy}>{copied ? "Copied" : "Copy"}</button>
        </div>
        <a class="after" href="/docs">Read the docs</a>
      {:else}
        {#if data.down}
          <p class="invalid" role="alert">The site can't check your invite: the release store is not answering. Try again in a minute.</p>
        {:else if data.invalid}
          <p class="invalid" role="alert">That invite link doesn't work: it was revoked or copied wrong. Ask for a new one.</p>
        {/if}
        {@render ask(true)}
      {/if}
    </div>
    <!-- A topic's canvas page in namp, dimmed, and lit in it, where the shot has it, namp's drawer, live. -->
    <div class="spot" style:--w={WIDE.w} style:--from={hero.from} style:--drawer={WIDE.w - hero.drawer} style:--shown={hero.shown}>
      <div class="backdrop" aria-hidden="true"></div>
      <div class="lit" bind:this={spot} style:min-height={held ? `${held}px` : null}>
        <Drawer onanswer={hold} />
      </div>
    </div>
  </section>

  <Tour {alt} {shots} call={data.tester ? undefined : visitorCall} />

  {#if data.tester}
    <section id="install" class="close grid">
      <h3 class="install">Two steps to start</h3>
      <ol>
        <li>
          <p>Run the command above in a terminal. It's yours alone: it carries your invite.</p>
          <p class="aside">
            It checks for herdr and Claude Code, puts <code>namp</code> in <code>~/.local/bin</code> and keeps your
            invite in <code>~/.config/namp</code>, so <code>namp update</code> can fetch the next release.
          </p>
        </li>
        <li>
          <p>In a herdr pane, run <code>namp start</code>, then open the page it prints.</p>
        </li>
      </ol>
      <div class="know">
        <p class="mac">
          On a Mac, install with the command, never by downloading namp in a browser: macOS stops a binary a
          browser downloaded from running, and this alpha isn't notarized.
        </p>
        {#if data.down}
          <p class="release invalid" role="alert">The release store is not answering, so the release isn't shown: try again in a minute.</p>
        {:else if data.release}
          <div class="release">
            <h4>namp {data.release.version}, released {data.release.date}</h4>
            {#if data.release.notes}
              <div class="notes">{@html data.release.notes}</div>
            {:else}
              <p>This release has no notes.</p>
            {/if}
          </div>
        {:else}
          <p class="release">No release is out yet: the command works once the first one is.</p>
        {/if}
      </div>
    </section>
  {/if}
</main>

<!-- For a visitor, the second screen ends on the call again, what an invite gives and what namp runs on. -->
{#snippet visitorCall()}
  <div class="call">
    <p class="how">Each tester gets a personal invite link. It shows your install command on this page, and every update comes through it.</p>
    {#if data.contact}{@render ask(false)}{/if}
    <p class="needs">
      Runs on macOS (Apple Silicon) or Linux (x86-64, ARM64) with <a href="https://github.com/herdrdev/herdr">herdr</a>, and
      runs <a href="https://claude.com/claude-code">Claude Code</a> sessions today.
    </p>
  </div>
{/snippet}

<style>
  /* The screenshot runs past the page's right edge: clipped here, it never widens the page into a sideways
     scroll. On main, as body's overflow would pass to the viewport. The screenshots' addresses by theme, read as
     backgrounds here and in the second screen (Tour.svelte), so only the theme's is fetched. */
  /* --wash is how much of the ground lies over the hero's dimmed canvas page, --shade the scrim under it, and
     --veil how strongly the second screen dims the page round a gain's part: Light's scrim darkens a light
     screenshot into a grey slab, so there the hero's page fades by the ground alone, its own ground then the
     page's, and the veil is half as strong. */
  main {
    --wide: url("/shots/hero-wide-dark.webp");
    --tour: url("/shots/tour-dark.webp");
    --wash: 30%;
    --shade: var(--dim);
    --veil: 1;
    overflow-x: clip;
  }

  :global([data-theme="light"]) main {
    --wide: url("/shots/hero-wide-light.webp");
    --tour: url("/shots/tour-light.webp");
    --wash: 74%;
    --shade: transparent;
    --veil: 0.5;
  }

  @media (prefers-color-scheme: light) {
    :global(:root:not([data-theme])) main {
      --wide: url("/shots/hero-wide-light.webp");
      --tour: url("/shots/tour-light.webp");
      --wash: 74%;
      --shade: transparent;
      --veil: 0.5;
    }
  }

  /* The theme and the repo, at the page's top right, on the hero's clear ground. */
  .corner {
    display: flex;
    gap: var(--sp-1);
    position: absolute;
    top: clamp(var(--sp-3), 2.5vh, var(--sp-6));
    right: calc(var(--gutter) - var(--sp-2));
    z-index: 2;
  }

  :global(main > section) {
    padding-inline: var(--gutter);
  }

  /* The page's one grid: 12 columns between the gutters, every block of the page starting on its lines. On a
     narrower screen each block takes the whole width, the second screen's (Tour.svelte) as well. */
  :global(.grid) {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: var(--sp-6);
  }

  :global(.grid > *) {
    grid-column: 1 / -1;
  }

  /* The first screen, the window's height at least: what namp is and the call in columns 1 to 5, and from
     column 6 a topic's canvas page, dimmed, with namp's drawer lit where the shot has it, at the window's right
     edge as namp's is. --u is one px of the screenshot on the page, the window's height in thousandths, so the
     shot's 1000px would take the screen. Its top and bottom clear the corner by as much. Side by side from
     72rem; stacked below. */
  .hero {
    --u: clamp(0.8px, 100svh / 1000, 1.05px);
    position: relative;
    isolation: isolate;
    overflow: clip;
    align-content: center;
    align-items: center;
    row-gap: var(--sp-10);
    min-height: 100svh;
    padding-block: 72px;
  }

  .pitch {
    position: relative;
    z-index: 1;
  }

  @media (min-width: 72rem) {
    .pitch {
      grid-column: 1 / 6;
    }

    .spot {
      grid-column: 6 / -1;
    }
  }

  /* The one display size, the site's name, in the condensed cut. */
  h1 {
    max-width: 9ch;
    margin: 0 0 var(--sp-6);
    color: var(--ink);
    font: var(--fw-strong) var(--fs-display) / 0.9 var(--cond);
    letter-spacing: -0.03em;
  }

  .lede {
    max-width: 40ch;
    margin: 0 0 var(--sp-8);
    color: var(--ink-2);
    font-size: clamp(var(--fs-lg), 1.6vw, var(--fs-xl));
    line-height: 1.35;
  }

  /* Each clause on a line of its own when it fits; when it doesn't, it wraps evenly, never leaving a word alone. */
  .lede span {
    display: inline-block;
    text-wrap: balance;
  }

  /* The call's own width decides its shape: where Get an invite and the address can't sit on one line, the
     address goes under the invite, both the column's width. */
  .ask {
    container: ask / inline-size;
    display: flex;
    flex-direction: column;
    align-items: start;
  }

  @container ask (max-width: 29.99rem) {
    .join {
      flex-direction: column;
      width: 100%;
    }

    .join .go {
      justify-content: center;
      border-radius: var(--r-md) var(--r-md) 0 0;
    }

    .to {
      justify-content: space-between;
      border-top: 0;
      border-left: 1px solid var(--edge);
      border-radius: 0 0 var(--r-md) var(--r-md);
    }
  }

  /* On a touch screen the call's address and the docs take a finger: 44px tall. */
  @media (pointer: coarse) {
    .to {
      min-height: 44px;
    }

    .after {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      margin-top: var(--sp-1);
    }
  }

  /* The call, one control in two parts: the invite, filled, and joined to its right the address it writes to,
     which copies, so the address is on show for a visitor with no mail app. */
  .join {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: stretch;
    max-width: 100%;
  }

  .join .go {
    display: flex;
    align-items: center;
    padding: 13px var(--sp-6);
    border-radius: var(--r-md) 0 0 var(--r-md);
    font-size: var(--fs-xl);
  }

  .join .go:only-child {
    border-radius: var(--r-md);
  }

  .to {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--sp-1) var(--sp-3);
    padding: var(--sp-2) var(--sp-2) var(--sp-2) var(--sp-5);
    border: 1px solid var(--edge);
    border-left: 0;
    border-radius: 0 var(--r-md) var(--r-md) 0;
    background: var(--surface);
  }

  .or {
    color: var(--muted);
    font: var(--fw-medium) var(--fs-md) var(--cond);
    white-space: nowrap;
  }

  /* The address inside the control: its chip's edge is the control's, so it shows as the address and its copy. */
  .to :global(.chip) {
    border-color: transparent;
    background: none;
    font-size: var(--fs-body);
  }

  .to :global(button.chip:hover) {
    border-color: var(--line);
    background: var(--hover);
  }

  /* The docs, a plain link under the call or a tester's command: the invite or Copy stays the one thing to do. */
  .after {
    display: inline-block;
    margin-top: var(--sp-4);
    font: var(--fw-medium) var(--fs-body) var(--cond);
  }

  .invalid {
    margin: 0 0 var(--sp-4);
    color: var(--alert-ink);
    font-weight: var(--fw-medium);
  }

  .open {
    margin: 0 0 var(--sp-3);
    font: var(--fw-strong) var(--fs-lg)/1.3 var(--cond);
  }

  /* The install command, a code block with its Copy at the right, beside its first line. */
  .command {
    display: flex;
    align-items: start;
    gap: var(--sp-3);
    padding: var(--sp-2) var(--sp-2) var(--sp-2) var(--sp-4);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    background: var(--sunken);
  }

  .command code {
    flex: 1;
    min-width: 0;
    padding: 6px 0;
    background: none;
    box-shadow: none;
    color: var(--code-ink);
    font-size: var(--fs-sm);
    line-height: 1.65;
  }

  .command code span {
    display: inline-block;
    max-width: 100%;
    word-break: break-all;
  }

  /* The token is a block of its own on the line: whole on the line after the words when it fits there, broken only
     when the box is narrower than the token itself. */
  .command code .token {
    display: inline-block;
  }

  .command button {
    flex: none;
    min-width: 72px;
  }

  /* A box too narrow to hold the token beside Copy gives the command its whole width, Copy under it at the right. */
  .pitch {
    container-type: inline-size;
  }

  @container (max-width: 30rem) {
    .command {
      flex-direction: column;
      align-items: stretch;
      gap: var(--sp-1);
    }

    .command button {
      align-self: end;
    }
  }

  /* The spot: from column 6 to the window's right edge, past the gutter, where namp's drawer stands in its
     window. At its right the drawer, as wide as the shot's (--drawer, in the shot's px, from places.js), lit and
     live; behind it, from its left, the canvas page as the shot has it beside the drawer, at the same scale and
     level with it, so the drawer lies where the shot's does. The drawer is the shot's top --shown px tall at
     least, and as tall as what it shows needs, its foot fading into the ground as namp's runs on down the
     window. */
  .spot {
    display: flex;
    justify-content: end;
    position: relative;
    margin-right: calc(-1 * var(--gutter));
  }

  .lit {
    display: flex;
    flex-direction: column;
    width: min(100%, calc(var(--drawer) * var(--u)));
    min-height: calc(var(--shown) * var(--u));
  }

  .lit :global(.drawer) {
    flex: 1;
    padding-bottom: 96px;
    mask-image: linear-gradient(var(--mask) calc(100% - 96px), transparent);
  }

  /* The canvas page left of the drawer, the shot's right edge on the window's, a little under the words at
     most and never past the page's own left edge, past the sidebar: dimmed under namp's --dim, fading into the
     ground at its left, at its top and at its foot. Its left fade starts 160 shot px left of the drawer at
     the latest (--fade), so where the drawer takes nearly the whole column, no sliver of the page shows. */
  .backdrop {
    --fade: max(0px, calc((160 + var(--drawer)) * var(--u) - 100%));
    position: absolute;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(100% + var(--sp-12), calc((var(--w) - var(--from)) * var(--u)));
    background: var(--wide) right top / calc(var(--w) * var(--u)) auto no-repeat;
    mask-image:
      linear-gradient(90deg, transparent var(--fade), var(--mask) calc(var(--fade) + 160 * var(--u))),
      linear-gradient(transparent, var(--mask) calc(64 * var(--u)), var(--mask) calc(100% - 120 * var(--u)), transparent);
    mask-composite: intersect;
    animation: arrive 900ms var(--ease-out) both 150ms;
  }

  /* namp's scrim (--shade), and over it a wash of the ground (--wash): the page's lines lose their contrast in
     either theme. Light has no scrim, which would only darken its ground into a grey slab round the lit
     drawer. */
  .backdrop::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(color-mix(in srgb, var(--bg) var(--wash), transparent) 0 0),
      linear-gradient(var(--shade), var(--shade));
  }

  @keyframes arrive {
    from {
      opacity: 0;
    }
  }

  /* A tester's two steps and the release, after the second screen, on its lines: the steps in columns 1 to 5,
     what to know from column 6. */
  .close {
    row-gap: var(--sp-5);
    padding-block: var(--sp-12);
    border-top: 1px solid var(--line);
  }

  @media (min-width: 64rem) {
    .close {
      align-items: start;
    }

    .close > * {
      grid-column: 1 / 6;
    }

    .close > .install {
      grid-column: 1 / -1;
    }

    .close > .know {
      grid-column: 6 / -1;
    }
  }

  .install {
    margin: 0;
    font-size: var(--fs-2xl);
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  .close p {
    margin: 0 0 var(--sp-3);
    text-wrap: pretty;
  }

  /* The steps' numbers stand on the heading's left line, their text in a column of its own beside them. */
  ol {
    margin: 0;
    padding: 0;
    list-style: none;
    counter-reset: step;
  }

  ol li {
    counter-increment: step;
    display: grid;
    grid-template-columns: 22px 1fr;
    align-items: first baseline;
  }

  ol li::before {
    content: counter(step) ".";
    color: var(--muted);
    font: var(--fw-strong) var(--fs-body) var(--cond);
  }

  ol li > p {
    grid-column: 2;
  }

  ol li + li {
    margin-top: var(--sp-3);
  }

  .aside {
    color: var(--muted);
    font-size: var(--fs-md);
  }

  /* A note to heed before installing: a strip with the ask's band at its left. */
  .mac {
    padding: var(--sp-3) var(--sp-4);
    border-left: var(--flag) solid var(--ask);
    background: var(--surface);
    font-size: var(--fs-md);
  }

  .release {
    margin-top: var(--sp-5);
    padding-top: var(--sp-5);
    border-top: 1px solid var(--line);
  }

  .release h4 {
    margin: 0 0 var(--sp-2);
    font-size: var(--fs-lg);
    line-height: 1.3;
  }

  .notes :global(:is(h1, h2, h3)) {
    margin: var(--sp-3) 0 var(--sp-1);
    font: var(--fw-strong) var(--fs-body)/1.3 var(--cond);
  }

  .notes {
    max-width: 70ch;
    text-wrap: pretty;
  }

  .notes :global(ul) {
    margin: 0;
    padding-left: 20px;
  }

  /* A notes image, served from /releases/<tag>/<name>: on its own line, the column's width at most and 80% of
     the screen's height, so a wide shot keeps the column and a phone's stands at a phone's size, edged as the
     hero's screenshots are. Images stand further apart than a paragraph's lines, and a run of them further
     still from what follows, so each reads as a shot of its own and the run ends before the next heading. */
  .notes :global(img) {
    display: block;
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 80svh;
    border-radius: var(--r-sm);
    box-shadow: 0 0 0 1px var(--line);
  }

  .notes :global(p:has(> img:only-child)) {
    margin: var(--sp-6) 0;
  }

  .notes :global(p:has(> img:only-child) + :not(p:has(> img:only-child))) {
    margin-top: var(--sp-10);
  }

  /* For a visitor, the second screen's call: what an invite gives, the call, what namp runs on. */
  .how {
    max-width: 44ch;
    margin: 0 0 var(--sp-3);
    color: var(--ink-2);
    font-size: var(--fs-md);
    line-height: 1.45;
  }

  .needs {
    margin: var(--sp-3) 0 0;
    color: var(--muted);
    font-size: var(--fs-sm);
  }

  /* On a phone: tighter steps, the call stacked to the column's width, and the drawer alone, the canvas page
     shown on the second screen. */
  @media (max-width: 40rem) {
    :global(.grid) {
      column-gap: var(--sp-4);
    }

    /* The drawer runs down to the second screen's hairline. */
    .hero {
      row-gap: var(--sp-10);
      padding-block: 72px 0;
    }

    h1 {
      margin-bottom: var(--sp-5);
    }

    .lede {
      margin-bottom: var(--sp-6);
    }

    .backdrop {
      display: none;
    }

    /* The drawer alone, across the window as namp shows a question on a phone, as tall as it is. */
    .spot {
      margin-inline: calc(-1 * var(--gutter));
    }

    .lit {
      width: 100%;
      min-height: 0;
    }

    .lit :global(.drawer) {
      padding-bottom: var(--sp-2);
      border-top: 1px solid var(--line);
      border-left: 0;
      mask-image: none;
    }

    .command {
      flex-direction: column;
      align-items: stretch;
      padding: var(--sp-2) var(--sp-2) var(--sp-2) var(--sp-3);
    }

    .command code {
      font-size: var(--fs-xs);
    }
  }
</style>
