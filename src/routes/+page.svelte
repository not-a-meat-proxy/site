<script>
  import Address from "#lib/Address.svelte";
  import GitHub from "#lib/GitHub.svelte";
  import Theme from "#lib/Theme.svelte";
  import { copyText } from "#lib/clipboard.js";

  // The hero's screenshots, by theme: wide, and below 40rem the phone's.
  const shots = {
    dark: {
      wide: { src: "/shots/hero-wide-dark.webp", width: 1600, height: 1000 },
      phone: { src: "/shots/hero-phone-dark.webp", width: 800, height: 800 },
      alt: "A topic's canvas in namp, in Dark",
    },
    light: {
      wide: { src: "/shots/hero-wide-light.webp", width: 1600, height: 1000 },
      phone: { src: "/shots/hero-phone-light.webp", width: 800, height: 800 },
      alt: "A topic's canvas in namp, in Light",
    },
  };

  let { data } = $props();

  const lede = "Scale your impact with agent sessions, without losing the thread.";

  const gains = [
    { term: "One thing at a time", text: "The next decision a session needs, the most urgent first." },
    { term: "Back in, in seconds", text: "Goal, decisions and what waits for you, on one page." },
    { term: "Good practice, built in", text: "Agents for a role, work split across sessions, goals you check." },
    { term: "Your machines, your work", text: "No namp service in between. Nothing leaves unless you choose." },
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
  <section class="hero">
    <div>
      <p class="stage">Private alpha</p>
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
  </section>

  <section class="more">
    <div>
      <h2>Agents work in parallel. You don't.</h2>
      <p class="cost">Run a few agent sessions at once and you become their relay, approving work you've lost track of.</p>
    </div>

    <div class="gains">
      {#each gains as gain (gain.term)}
        <div>
          <h3>{gain.term}</h3>
          <p>{gain.text}</p>
        </div>
      {/each}
    </div>

    <p class="needs">
      Runs on macOS (Apple Silicon) or Linux (x86-64, ARM64) with <a href="https://github.com/herdrdev/herdr">herdr</a>, and
      runs <a href="https://claude.com/claude-code">Claude Code</a> sessions today.
    </p>

    <div id="install" class="close">
      {#if data.tester}
        <h3 class="install">Install namp, {data.tester.name}</h3>
        <div class="steps">
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
          <div>
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
  /* The screenshot arrives from the right (arrive): clipped here, it never widens the page into a
     sideways scroll while it moves in. On main, as body's overflow would pass to the viewport. */
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
    z-index: 1;
  }

  main > section,
  footer {
    padding-inline: var(--gutter);
  }

  /* The first screen, whole: what namp is, the app, and the call. */
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-content: center;
    align-items: center;
    gap: var(--sp-10) 64px;
    min-height: 100svh;
    padding-block: clamp(var(--sp-6), 5vh, 56px);
  }

  @media (min-width: 64rem) {
    .hero {
      grid-template-columns: minmax(20rem, 5fr) minmax(0, 7fr);
    }
  }

  .stage {
    display: inline-block;
    margin: 0 0 var(--sp-5);
    padding: 2px var(--sp-2);
    border: 1px solid var(--line-strong);
    border-radius: var(--r-sm);
    color: var(--muted);
    font: var(--fw-medium) var(--fs-sm)/1.4 var(--cond);
  }

  /* The one display size, above namp's 32px headline: the site's name, in the condensed cut. */
  h1 {
    margin: 0 0 var(--sp-6);
    max-width: 9ch;
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

  .lede span {
    display: inline-block;
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

  /* The screenshot sits in its column, whole, its text left as the app shows it: a surface's corners and
     a hairline, no shadow, for it neither lifts nor floats. */
  .shot {
    margin: 0;
    animation: arrive 900ms cubic-bezier(0.2, 0.7, 0.1, 1) both 150ms;
  }

  .shot img {
    display: block;
    width: 100%;
    height: auto;
    border: 1px solid var(--line);
    border-radius: var(--r-md);
  }

  @keyframes arrive {
    from {
      opacity: 0;
      transform: translateX(2rem);
    }
  }

  /* Then why, what you gain, what it needs, and the call again, sections apart by 40px as in namp. */
  .more {
    display: flex;
    flex-direction: column;
    gap: var(--sp-10);
    padding-block: var(--sp-12) var(--sp-10);
    border-top: 1px solid var(--line);
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

  /* What you gain: each between hairlines, side by side as the screen allows. */
  .gains {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--sp-6) var(--sp-10);
  }

  @media (min-width: 36rem) {
    .gains {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 64rem) {
    .gains {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  .gains div {
    padding-top: var(--sp-4);
    border-top: 1px solid var(--line-strong);
  }

  h3 {
    margin: 0 0 var(--sp-1);
    font-size: var(--fs-lg);
    line-height: 1.3;
  }

  .gains p {
    margin: 0;
    color: var(--muted);
    line-height: 1.5;
  }

  .needs {
    margin: 0;
    color: var(--muted);
    font-size: var(--fs-md);
  }

  .close {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-5) var(--sp-12);
    padding-top: var(--sp-8);
    border-top: 1px solid var(--line);
  }

  .how {
    flex: 1 1 24rem;
    max-width: 36rem;
    margin: 0;
    font-size: var(--fs-lg);
    line-height: 1.4;
  }

  /* An open invite: the steps on the left, what to know beside them on a wide screen. */
  .close:has(.install) {
    display: block;
  }

  .install {
    margin: 0;
    font-size: var(--fs-xl);
    line-height: 1.25;
    letter-spacing: -0.01em;
  }

  .steps {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0 56px;
    margin-top: var(--sp-4);
  }

  @media (min-width: 64rem) {
    .steps {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
  }

  .steps p {
    margin: 0 0 var(--sp-3);
  }

  ol {
    margin: 0 0 var(--sp-5);
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

  /* On a phone the hero still fits one screen: tighter steps between its parts. */
  @media (max-width: 40rem) {
    .hero {
      gap: var(--sp-8);
      padding-block: var(--sp-6);
    }

    .stage {
      margin-bottom: var(--sp-4);
    }

    h1 {
      margin-bottom: var(--sp-5);
    }

    .lede {
      margin-bottom: var(--sp-6);
      font-size: var(--fs-lg);
    }

    .shot img {
      max-width: 26rem;
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
