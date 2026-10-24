<script>
  import Address from "#lib/Address.svelte";
  import GitHub from "#lib/GitHub.svelte";
  import Theme from "#lib/Theme.svelte";
  import NeedsYou from "#lib/home/NeedsYou.svelte";
  import Tour from "#lib/home/Tour.svelte";
  import { copyText } from "#lib/clipboard.js";

  // namp's screenshots, from a trial server of namp at v0.5.0's tag, whose interface v0.5.1 ships unchanged, by
  // theme: the wide one, a topic's Overview, under the hero and whole on the second screen; the phone's, the
  // question answered in its thread, among the second screen's cuts on a narrow one.
  const alt =
    "A topic's Overview in namp: under Needs you its session asks which day an invoice set for the 31st goes out in a shorter month, and recommends the month's last day; today's timeline shows the session and three sibling sessions at work; the lane holds the topic's threads, goal, plan, squad and documents.";

  const shots = {
    dark: { wide: { src: "/shots/hero-wide-dark.webp", width: 1600, height: 1000 } },
    light: { wide: { src: "/shots/hero-wide-light.webp", width: 1600, height: 1000 } },
  };

  let { data } = $props();

  const lede = "Scale your impact with agent sessions, without losing the thread.";

  // The address Ask for an invite writes to, shown for a visitor with no mail app: none when
  // INVITE_CONTACT is a link rather than an address.
  let address = $derived(data.contact?.startsWith("mailto:") ? decodeURIComponent(data.contact.slice(7).split("?")[0]) : null);

  let command = $derived(data.tester ? `curl -fsSL ${data.site}/install.sh | sh -s -- ${data.tester.token}` : "");
  let copied = $state(false);
  // The room Needs you's spot held before the first answer: it keeps it as answered asks fold out, so the hero
  // stays where it is and the Overview behind it, aligned with the panel, shows where the asks were.
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
    <!-- namp's Overview at work, dimmed, and lit in it, where the Overview's own is, namp's Needs you, live. -->
    <div class="spot" bind:this={spot} style:min-height={held ? `${held}px` : null}>
      <div class="backdrop" aria-hidden="true"></div>
      <NeedsYou onanswer={hold} />
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
  /* --wash is how much of the ground lies over the hero's dimmed Overview, and --veil how strongly the second
     screen dims the Overview round a gain's part: Light's scrim darkens a light screenshot into a grey slab, so
     there the ground takes more of it and the veil is half as strong. */
  main {
    --wide: url("/shots/hero-wide-dark.webp");
    --phone: url("/shots/hero-phone-dark.webp");
    --wash: 30%;
    --veil: 1;
    overflow-x: clip;
  }

  :global([data-theme="light"]) main {
    --wide: url("/shots/hero-wide-light.webp");
    --phone: url("/shots/hero-phone-light.webp");
    --wash: 80%;
    --veil: 0.5;
  }

  @media (prefers-color-scheme: light) {
    :global(:root:not([data-theme])) main {
      --wide: url("/shots/hero-wide-light.webp");
      --phone: url("/shots/hero-phone-light.webp");
      --wash: 80%;
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
     column 6 namp's Overview, dimmed, with Needs you lit where the Overview's own is. --u is one px of the
     screenshot on the page, the window's height in thousandths, so the Overview's 1000px take the screen. Its
     top and bottom clear the corner by as much. Side by side from 72rem; stacked below. */
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

  /* The spot: as wide as the Overview's own Needs you, 727px of the screenshot from its 430th, and on it
     Needs you, on the ground, a margin of its own round it lit. Behind it the Overview from the same place:
     past the sidebar, 392px in, and under its header, 70px down, as the 1208 by 930 it shows of it. It lies
     dimmed under namp's --dim, fading into the ground at its left and its bottom, and runs off the page's
     right edge. */
  .spot {
    position: relative;
    width: min(100%, calc(727 * var(--u)));
  }

  .backdrop {
    position: absolute;
    z-index: -1;
    top: calc(-20 * var(--u));
    left: calc(-38 * var(--u));
    width: calc(1208 * var(--u));
    /* Down to a little under Needs you, never past the screen's floor: the spot is centred in it, so the floor
       is half a screen and half the spot below the spot's middle. */
    height: min(calc(100% + 116 * var(--u)), calc(50svh + 50% + 20 * var(--u)));
    background: var(--wide) calc(-392 * var(--u)) calc(-70 * var(--u)) / calc(1600 * var(--u)) auto no-repeat;
    mask-image:
      linear-gradient(90deg, transparent, var(--mask) calc(160 * var(--u))),
      linear-gradient(transparent, var(--mask) calc(120 * var(--u)), var(--mask) calc(100% - 120 * var(--u)), transparent);
    mask-composite: intersect;
    animation: arrive 900ms var(--ease-out) both 150ms;
  }

  /* namp's scrim, and over it a wash of the ground (--wash): the Overview's lines lose their contrast in either
     theme, where the scrim alone would only darken Light's into a grey slab round the lit Needs you. */
  .backdrop::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(color-mix(in srgb, var(--bg) var(--wash), transparent) 0 0),
      linear-gradient(var(--dim), var(--dim));
  }

  @keyframes arrive {
    from {
      opacity: 0;
    }
  }

  /* Under Needs you, the ground down to the hero's floor (the hero clips it), wherever the panel ends, an answer
     shortening it included: under the panel the Overview would show as rows cut by its edge. It feathers in the
     Overview's gutter past the panel, where the Overview's right column runs on, dimmed. */
  .spot :global(.needs-you::after) {
    content: "";
    position: absolute;
    z-index: -1;
    top: 100%;
    left: calc(-64 * var(--u));
    right: calc(-40 * var(--u));
    height: 100svh;
    background: var(--bg);
    mask-image: linear-gradient(90deg, var(--mask) calc(100% - 40 * var(--u)), transparent);
    pointer-events: none;
  }

  .spot :global(.needs-you) {
    position: relative;
    margin: calc(-16 * var(--u));
    padding: calc(16 * var(--u));
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

  /* On a phone: tighter steps, the call stacked to the column's width, and Needs you alone on the ground, the
     Overview's shown on the second screen. */
  @media (max-width: 40rem) {
    :global(.grid) {
      column-gap: var(--sp-4);
    }

    .hero {
      row-gap: var(--sp-10);
      padding-block: 72px var(--sp-10);
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

    .spot :global(.needs-you) {
      margin: 0;
      padding: 0;
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
