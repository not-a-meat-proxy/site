<script>
  import Address from "#lib/Address.svelte";
  import GitHub from "#lib/GitHub.svelte";
  import Theme from "#lib/Theme.svelte";
  import NeedsYou from "#lib/home/NeedsYou.svelte";
  import Sign from "#lib/home/Sign.svelte";
  import { copyText } from "#lib/clipboard.js";

  // The hero's screenshots, from a trial server of namp at v0.5.0's tag, whose interface v0.5.1 ships unchanged, by theme: wide, and below 40rem the phone's.
  // One alt for both, as a <picture> takes one, so it says what each shows.
  const alt =
    "A topic in namp: its session asks which day an invoice set for the 31st goes out in a shorter month, and recommends the month's last day. On a wide screen the topic's Overview shows that question under Needs you, the session and three sibling sessions on today's timeline, and the lane of its threads, goal, plan, squad and documents; on a phone, the question answered in its thread.";

  const shots = {
    dark: {
      wide: { src: "/shots/hero-wide-dark.webp", width: 1600, height: 1000 },
      phone: { src: "/shots/hero-phone-dark.webp", width: 780, height: 975 },
      alt,
    },
    light: {
      wide: { src: "/shots/hero-wide-light.webp", width: 1600, height: 1000 },
      phone: { src: "/shots/hero-phone-light.webp", width: 780, height: 975 },
      alt,
    },
  };

  let { data } = $props();

  const lede = "Scale your impact with agent sessions, without losing the thread.";

  // What you gain, each a row as namp draws its record's: at its left the band of who starts that work, as
  // namp's bands mean it, and namp's sign for it. A session asks the next decision and keeps the page of its
  // goal and decisions, its own; work split across sessions is a task's; your machines are yours.
  const gains = [
    { term: "One thing at a time", text: "The next decision a session needs, the most urgent first.", band: "own", sign: "ask" },
    { term: "Back in, in seconds", text: "Goal, decisions and what waits for you, on one page.", band: "own", sign: "goal" },
    { term: "Good practice, built in", text: "Agents for a role, work split across sessions, goals you check.", band: "task", sign: "work" },
    { term: "Your machines, your work", text: "No namp service in between. Nothing leaves unless you choose.", band: "you", sign: "done" },
  ];

  // The address Ask for an invite writes to, shown for a visitor with no mail app: none when
  // INVITE_CONTACT is a link rather than an address.
  let address = $derived(data.contact?.startsWith("mailto:") ? decodeURIComponent(data.contact.slice(7).split("?")[0]) : null);

  let command = $derived(data.tester ? `curl -fsSL ${data.site}/install.sh | sh -s -- ${data.tester.token}` : "");
  let copied = $state(false);
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

<!-- The call, with the docs beside it in the hero: a plain button, the invite the only filled one. -->
{#snippet ask(docs)}
  <div class="ask">
    <div class="actions">
      {#if data.contact}<a class="button primary" href={data.contact}>Get an invite</a>{/if}
      {#if docs}<a class="button" href="/docs">Read the docs</a>{/if}
    </div>
    {#if address}
      <p class="write"><span>or write to</span> <Address {address} /></p>
    {/if}
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
        <!-- Wrapped in its box so it reads whole: between its words, none broken but the token,
             which fills the lines after them. Copy still takes it as one line. -->
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
    <!-- The app at work, its Overview bleeding off the page's right edge, and over its left part namp's
         Needs you, live. -->
    <div class="stage">
      <!-- One picture per theme, the theme's shown by [data-theme] and the other's not displayed. Both lazy, so
           the browser fetches only the one it lays out, the hidden theme's never: it starts once the page's first
           layout, a moment later than an eager image, hidden by the screenshot's arrival. -->
      <figure class="shot">
        {#each Object.entries(shots) as [name, shot] (name)}
          <picture class="for-{name}">
            <source media="(max-width: 40rem)" srcset={shot.phone.src} width={shot.phone.width} height={shot.phone.height} />
            <img src={shot.wide.src} width={shot.wide.width} height={shot.wide.height} alt={shot.alt} loading="lazy" />
          </picture>
        {/each}
      </figure>
      <NeedsYou />
    </div>
  </section>

  <section class="more grid">
    <div class="why">
      <h2>Agents work in parallel. You don't.</h2>
      <p class="cost">Run a few agent sessions at once and you become their relay, approving work you've lost track of.</p>
    </div>

    <ul class="gains">
      {#each gains as gain (gain.term)}
        <li class="gain o-{gain.band}">
          <Sign kind={gain.sign} />
          <h3>{gain.term}</h3>
          <p>{gain.text}</p>
        </li>
      {/each}
    </ul>

    <p class="needs">
      Runs on macOS (Apple Silicon) or Linux (x86-64, ARM64) with <a href="https://github.com/herdrdev/herdr">herdr</a>, and
      runs <a href="https://claude.com/claude-code">Claude Code</a> sessions today.
    </p>

    <div id="install" class="close" class:tester={data.tester}>
      {#if data.tester}
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
      {:else}
        <p class="how">Each tester gets a personal invite link. It shows your install command on this page, and every update comes through it.</p>
        {#if data.contact}{@render ask(false)}{/if}
      {/if}
    </div>
  </section>
</main>

<footer>
  <p>namp is an alpha: expect rough edges, and say which ones you hit.</p>
  <a href="/docs">Read the docs</a>
</footer>

<style>
  /* The screenshot bleeds off the page's right edge and arrives from the right (arrive): clipped here, it
     never widens the page into a sideways scroll. On main, as body's overflow would pass to the viewport. */
  main {
    overflow-x: clip;
  }

  /* The theme and the repo, at the page's top right, over the hero rather than in a bar of its own. */
  .corner {
    display: flex;
    gap: var(--sp-1);
    position: absolute;
    top: clamp(var(--sp-3), 2.5vh, var(--sp-6));
    right: calc(var(--gutter) - var(--sp-2));
    z-index: 2;
  }

  main > section,
  footer {
    padding-inline: var(--gutter);
  }

  /* The page's one grid: 12 columns between the gutters, every block of the page starting on its lines. On a
     narrower screen each block takes the whole width. */
  .grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: var(--sp-6);
  }

  .grid > * {
    grid-column: 1 / -1;
  }

  /* The first screen: what namp is and the call in columns 1 to 5, the app at work from column 6 to past the
     page's edge, sized by what they show, so the next section shows below them. Its top clears the corner.
     Side by side from 72rem, where Needs you's 4 columns still hold its choices on a line or two; stacked
     below. */
  .hero {
    align-items: center;
    row-gap: var(--sp-10);
    padding-block: clamp(72px, 10vh, 104px) clamp(var(--sp-12), 8vh, 88px);
  }

  @media (min-width: 72rem) {
    .pitch {
      grid-column: 1 / 6;
    }

    .stage {
      grid-column: 6 / -1;
    }
  }

  /* The one display size, above namp's 32px headline: the site's name, in the condensed cut. */
  h1 {
    max-width: 9ch;
    margin: 0 0 var(--sp-6);
    color: var(--ink);
    font: var(--fw-strong) var(--fs-display) / 0.92 var(--cond);
    letter-spacing: -0.02em;
  }

  .lede {
    margin: 0 0 var(--sp-8);
    color: var(--ink-2);
    font-size: var(--fs-xl);
    line-height: 1.4;
  }

  /* Each clause on a line of its own when it fits; when it doesn't, it wraps evenly, never leaving a word alone. */
  .lede span {
    display: inline-block;
    text-wrap: balance;
  }

  .ask {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: var(--sp-3);
  }

  /* The hero's calls stand a step taller than a control in the app, in the same cut and corners. */
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-3);
  }

  .actions .button {
    padding: 11px var(--sp-5);
    font-size: var(--fs-body);
  }

  /* Under a tester's command, the docs as a plain link: Copy stays the one thing to do. */
  .after {
    display: inline-block;
    margin-top: var(--sp-4);
    font-weight: var(--fw-medium);
  }

  .write {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--sp-1) var(--sp-2);
    margin: 0;
    color: var(--muted);
    font-size: var(--fs-md);
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

  .command code .token {
    display: inline;
  }

  .command button {
    flex: none;
    min-width: 72px;
  }

  /* The stage: the screenshot running past the page's right edge, and Needs you laid over its left part. Both
     in one cell, so the stage is as tall as the taller of them and nothing under it is overlapped. */
  .stage {
    display: grid;
    grid-template: auto / minmax(0, 1fr);
    margin-right: calc(-1 * var(--gutter));
  }

  .stage > :global(*) {
    grid-area: 1 / 1;
  }

  /* The screenshot sits on the ground as the app does, a surface's corners and a hairline, no shadow, for it
     neither lifts nor floats; Needs you, over it, floats. */
  .shot {
    width: var(--shot-w, 100%);
    margin: 0 0 0 var(--shot-in, 0);
    animation: arrive 900ms var(--ease-out) both 150ms;
  }

  .shot img {
    display: block;
    width: 100%;
    height: auto;
    border: 1px solid var(--line);
    border-radius: var(--r-md);
  }

  .stage :global(.needs-you) {
    z-index: 1;
    align-self: start;
    width: var(--ny-w, 100%);
    animation: arrive 900ms var(--ease-out) both 250ms;
  }

  @keyframes arrive {
    from {
      opacity: 0;
      transform: translateX(2rem);
    }
  }

  /* Side by side, Needs you takes the stage's first 4 columns, a column being the stage less the gutter it runs
     into, in 7. Under it lies the app's Topics sidebar alone, the first quarter of the screenshot (400 of its
     1600px), and the screenshot at 0.72 of its size at least, so its words read (about 10px), or larger where
     the stage lets its Overview end, at 1190px where the lane starts, by the page's edge. What runs past the
     edge is more of the app: the timeline's end and the lane. Both start on the stage's top line, which the
     pitch shares. The screenshot starts where the Overview does, at 390px, the sidebar cut away, so Needs
     you keeps the height of its rows and the page's ground shows under it once an answered question folds
     away. In the stage's own width (cqw), which both read. */
  @media (min-width: 72rem) {
    .hero {
      align-items: start;
    }

    .stage {
      container-type: inline-size;
    }

    .stage > :global(*) {
      --ny-w: calc((100cqw - var(--gutter) + var(--sp-6)) / 7 * 4 - var(--sp-6));
      --shot-w: max(calc((100cqw - var(--ny-w)) * 1600 / 790), 1152px);
      --shot-in: calc(var(--ny-w) - var(--shot-w) * 400 / 1600);
    }

    .shot img {
      clip-path: inset(0 0 0 calc(100% * 390 / 1600) round var(--r-md));
    }
  }

  /* Stacked, on a tablet or a phone, Needs you, then the screenshot under it, Needs you covering its top: on a
     tablet down to its 330th px, between the app's own Needs you and its Work today, and across to its 1185th,
     between the Overview and its lane, so its edges cut no line; on a phone the shot of the question answered
     in its thread, from where the session's reply starts. */
  @media (max-width: 71.99rem) {
    .stage {
      --w: max(100% - var(--sp-12), 40rem);
      grid-template: auto auto / minmax(0, 1fr);
    }

    .stage :global(.needs-you) {
      grid-area: 1 / 1;
      width: calc(var(--sp-12) + var(--w) * 1185 / 1600);
    }

    .shot {
      grid-area: 2 / 1;
      width: var(--w);
      margin: calc(var(--w) * -330 / 1600) 0 0 var(--sp-12);
    }
  }

  /* Then why, what you gain, what it needs, and the call again, on the hero's grid, sections apart by 40px as
     in namp. */
  .more {
    row-gap: var(--sp-10);
    padding-block: var(--sp-12) var(--sp-10);
    border-top: 1px solid var(--line);
  }

  @media (min-width: 64rem) {
    .why {
      grid-column: 1 / 6;
    }

    .gains,
    .needs {
      grid-column: 6 / -1;
    }

    .needs {
      margin-block-start: calc(-1 * var(--sp-6));
    }
  }

  h2 {
    margin: 0 0 var(--sp-3);
    font-size: var(--fs-2xl);
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  .cost {
    max-width: 48rem;
    margin: 0;
    color: var(--muted);
    font-size: var(--fs-lg);
    line-height: 1.45;
    text-wrap: pretty;
  }

  /* What you gain, as namp's rows between hairlines: who it comes from as a band at the row's left, namp's
     sign, the gain and its line. */
  .gains {
    display: grid;
    grid-template-columns: calc(var(--band) + 14px - var(--sp-3)) 14px max-content minmax(0, 1fr);
    column-gap: var(--sp-3);
    margin: 0;
    padding: 0;
    border-top: 1px solid var(--line);
    list-style: none;
  }

  /* Every row on the list's columns, the titles in one as wide as the longest, the lines a step apart from it. */
  .gain {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    align-items: baseline;
    row-gap: 2px;
    position: relative;
    padding: var(--sp-3) var(--sp-4) var(--sp-3) 0;
    border-bottom: 1px solid var(--line);
  }

  .gain::before {
    content: "";
    position: absolute;
    top: 16px;
    left: 0;
    width: var(--band);
    height: var(--mark-h);
    background: var(--line-strong);
  }

  .gain.o-you::before {
    background: var(--band-you);
  }

  .gain.o-own::before {
    background: var(--band-own);
  }

  .gain.o-task::before {
    background: var(--band-task);
  }

  .gain > :global(.sign) {
    grid-column: 2;
    align-self: start;
    margin-top: 5px;
  }

  h3 {
    margin: 0;
    font-size: var(--fs-lg);
    line-height: 1.3;
  }

  .gain h3 {
    margin-right: var(--sp-5);
  }

  .gain p {
    margin: 0;
    color: var(--muted);
    line-height: 1.5;
  }

  .needs {
    margin-inline: 0;
    margin-block-end: 0;
    color: var(--muted);
    font-size: var(--fs-md);
  }

  /* The call again, between hairlines, on the hero's lines: why ask in columns 1 to 5, the invite at column 6;
     for a tester the steps in columns 1 to 5, what to know at column 6. */
  .close {
    row-gap: var(--sp-5);
    padding-top: var(--sp-8);
    border-top: 1px solid var(--line);
  }

  @media (min-width: 64rem) {
    .close {
      display: grid;
      grid-template-columns: subgrid;
      align-items: center;
    }

    .close > * {
      grid-column: 1 / 6;
    }

    .close > .ask,
    .close > .know {
      grid-column: 6 / -1;
    }

    .close.tester {
      align-items: start;
    }

    .close.tester .install {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 63.99rem) {
    .close {
      display: flex;
      flex-direction: column;
      align-items: start;
    }
  }

  .how {
    max-width: 36rem;
    margin: 0;
    font-size: var(--fs-lg);
    line-height: 1.4;
  }

  .install {
    margin: 0;
    font-size: var(--fs-xl);
    line-height: 1.25;
    letter-spacing: -0.01em;
  }

  .close.tester p {
    margin: 0 0 var(--sp-3);
  }

  ol {
    margin: 0;
    padding-left: 22px;
  }

  ol li::marker {
    color: var(--muted);
    font: var(--fw-strong) var(--fs-body) var(--cond);
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
  }

  .notes :global(ul) {
    margin: 0;
    padding-left: 20px;
  }

  footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--sp-2) var(--sp-8);
    padding-block: var(--sp-6) var(--sp-10);
    color: var(--muted);
    font-size: var(--fs-md);
  }

  footer a {
    font-weight: var(--fw-medium);
  }

  footer p {
    margin: 0;
  }

  /* On a phone, tighter steps between the hero's parts, and a gain's line under its name. */
  @media (max-width: 40rem) {
    .grid {
      column-gap: var(--sp-4);
    }

    .hero {
      row-gap: var(--sp-8);
      padding-block: 72px var(--sp-10);
    }

    h1 {
      margin-bottom: var(--sp-5);
    }

    .lede {
      margin-bottom: var(--sp-6);
      font-size: var(--fs-lg);
    }

    /* The phone's shot, 780 by 975, under Needs you to its 590th px, so what shows starts with the owner's
       answer in its thread; it stops at the gutter, as the panel over it does. */
    .stage :global(.needs-you) {
      width: calc(100% - var(--gutter));
    }

    .shot {
      --w: calc(100% - var(--gutter) - var(--sp-8));
      width: var(--w);
      margin: calc(var(--w) * -975 / 780 * 590 / 975) 0 0 var(--sp-8);
    }

    .gains {
      grid-template-columns: calc(var(--band) + 14px - var(--sp-3)) 14px minmax(0, 1fr);
    }

    .gain h3 {
      margin-right: 0;
    }

    .gain p {
      grid-column: 3;
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
