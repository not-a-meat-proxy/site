<script>
  import Address from "#lib/Address.svelte";
  import GitHub from "#lib/GitHub.svelte";
  import { copyText } from "#lib/clipboard.js";

  let { data } = $props();

  const lede = "Scale your impact with agents, without losing the thread.";

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
  <title>namp: scale your impact with agents, without losing the thread</title>
  <meta name="description" content={lede} />
</svelte:head>

<!-- The call, with the docs beside it in the hero: a lighter button, the invite the only filled one. -->
{#snippet ask(docs)}
  <div class="ask">
    <div class="actions">
      {#if data.contact}<a class="button" href={data.contact}>Get an invite</a>{/if}
      {#if docs}<a class="button quiet" href="/docs">Read the docs</a>{/if}
    </div>
    {#if address}
      <p class="write"><span>or write to</span> <Address {address} /></p>
    {/if}
  </div>
{/snippet}

<GitHub class="corner" />

<main>
  <section class="hero">
    <div>
      <p class="stage">Private alpha</p>
      <h1>Not A Meat Proxy.</h1>
      <p class="lede">{lede}</p>
      {#if data.tester}
        <p class="open">Install namp, {data.tester.name}</p>
        <!-- Wrapped in its box so it reads whole: between its words, none broken but the token,
             which fills the lines after them. Copy still takes it as one line. -->
        <div class="command">
          <code bind:this={shown}>{#each command.split(" ") as word, i}{i ? " " : ""}<span class:token={word === data.tester.token}>{word}</span>{/each}</code>
          <button type="button" onclick={copy}>{copied ? "Copied" : "Copy"}</button>
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
    <figure class="shot">
      <picture>
        <source media="(max-width: 40rem)" srcset="/shots/topic-thread.webp" width="792" height="660" />
        <img
          src="/shots/topic.webp"
          width="1600"
          height="969"
          alt="A topic's canvas in namp: a question the session asked, with the recommended choice taken as the answer, and the session's reply in the thread beside it"
        />
      </picture>
    </figure>
  </section>

  <section class="more">
    <div>
      <h2>Agents work in parallel. You don't.</h2>
      <p class="cost">Run a few at once and you become their relay, approving work you've lost track of.</p>
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

  /* The repo, at the page's top right, over the hero rather than in a bar of its own. */
  :global(.github.corner) {
    position: absolute;
    top: clamp(0.75rem, 2.5vh, 1.5rem);
    right: calc(var(--gutter) - 0.45rem);
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
    gap: 2.5rem 4rem;
    min-height: 100svh;
    padding-block: clamp(1.5rem, 5vh, 3.5rem);
  }

  @media (min-width: 64rem) {
    .hero {
      grid-template-columns: minmax(20rem, 5fr) minmax(0, 7fr);
    }
  }

  .stage {
    display: inline-block;
    margin: 0 0 1.25rem;
    padding: 0.15rem 0.65rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    color: var(--muted);
    font-size: 0.875rem;
  }

  h1 {
    margin: 0 0 1.5rem;
    max-width: 9ch;
    font: 700 clamp(3.4rem, 7.2vw, 6.75rem) / 0.86 var(--display);
    font-variation-settings: "wdth" 80;
    letter-spacing: -0.03em;
    word-spacing: 0.04em;
    color: var(--ink);
  }

  /* Balanced, so it breaks at its comma rather than leave a word alone. */
  .lede {
    margin: 0 0 2rem;
    font: 500 clamp(1.2rem, 1.55vw, 1.4rem) / 1.35 var(--display);
    letter-spacing: -0.01em;
    text-wrap: balance;
  }

  .ask {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 0.85rem;
  }

  .button {
    display: inline-block;
    padding: 0.8rem 1.5rem;
    border-radius: 999px;
    background: var(--teal);
    color: #fff;
    font-weight: 500;
    text-decoration: none;
  }

  .button:hover {
    background: var(--teal-deep);
    color: #fff;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  /* The docs, a step back from the call: outlined, its line drawn inside so it stands as tall. */
  .button.quiet {
    background: transparent;
    box-shadow: inset 0 0 0 1px var(--line);
    color: var(--ink);
  }

  .button.quiet:hover {
    box-shadow: inset 0 0 0 1px var(--teal);
    color: var(--teal);
  }

  /* Under a tester's command, the docs as a plain link: Copy stays the one thing to do. */
  .after {
    display: inline-block;
    margin-top: 1rem;
    font-weight: 500;
  }

  .write {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem 0.5rem;
    margin: 0;
    color: var(--muted);
    font-size: 0.95rem;
  }

  .invalid {
    margin: 0 0 1rem;
    color: #a3342b;
    font-weight: 500;
  }

  .open {
    margin: 0 0 0.6rem;
    font: 600 1.2rem/1.3 var(--display);
  }

  .command {
    display: flex;
    align-items: stretch;
    border: 1px solid var(--ink);
    border-radius: 10px;
    background: var(--ink);
    overflow: hidden;
  }

  .command code {
    flex: 1;
    min-width: 0;
    padding: 0.9rem 1rem;
    color: #e9f3f4;
    font-size: 0.9rem;
    line-height: 1.5;
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
    width: 5.5rem;
    border: 0;
    border-left: 1px solid rgb(255 255 255 / 0.15);
    background: var(--teal);
    color: #fff;
    font: 500 0.95rem var(--sans);
    cursor: pointer;
  }

  .command button:hover {
    background: var(--teal-deep);
  }

  /* The screenshot sits in its column, whole, its text left as the app shows it. */
  .shot {
    margin: 0;
    animation: arrive 900ms cubic-bezier(0.2, 0.7, 0.1, 1) both 150ms;
  }

  .shot img {
    display: block;
    width: 100%;
    height: auto;
    border: 1px solid var(--line);
    border-radius: 12px;
    box-shadow: 0 24px 48px -28px rgb(23 38 43 / 0.4);
  }

  @keyframes arrive {
    from {
      opacity: 0;
      transform: translateX(2rem);
    }
  }

  /* The second screen, whole: why, what you gain, what it needs, and the call again. */
  .more {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: clamp(2rem, 6.5vh, 4rem);
    min-height: 100svh;
    padding-block: clamp(2rem, 5vh, 3.5rem);
    border-top: 1px solid var(--line);
  }

  h2 {
    margin: 0 0 0.75rem;
    font: 650 clamp(2.1rem, 4.2vw, 3.6rem) / 1.02 var(--display);
    letter-spacing: -0.025em;
    text-wrap: balance;
  }

  .cost {
    max-width: 48rem;
    margin: 0;
    color: var(--muted);
    font-size: clamp(1.1rem, 1.4vw, 1.25rem);
    line-height: 1.45;
    text-wrap: pretty;
  }

  .gains {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 1.75rem 2.5rem;
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
    padding-top: 1rem;
    border-top: 2px solid var(--ink);
  }

  h3 {
    margin: 0 0 0.35rem;
    font: 600 clamp(1.2rem, 1.6vw, 1.4rem) / 1.2 var(--display);
    letter-spacing: -0.01em;
  }

  .gains p {
    margin: 0;
    color: var(--muted);
    line-height: 1.45;
  }

  .needs {
    margin: 0;
    color: var(--muted);
    font-size: 0.95rem;
  }

  .close {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem 3rem;
    padding: 1.5rem clamp(1.25rem, 2.5vw, 2rem);
    border: 1px solid var(--line);
    border-radius: 14px;
    background: var(--paper);
  }

  .how {
    flex: 1 1 24rem;
    max-width: 36rem;
    margin: 0;
    font: 500 1.15rem/1.4 var(--display);
  }

  /* An open invite: the steps on the left, what to know beside them on a wide screen. */
  .close:has(.install) {
    display: block;
  }

  .steps {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0 3.5rem;
    margin-top: 0.75rem;
  }

  @media (min-width: 64rem) {
    .steps {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
  }

  .steps p {
    margin: 0 0 0.75rem;
  }

  ol {
    margin: 0 0 1.25rem;
    padding-left: 1.4rem;
  }

  ol li::marker {
    font: 600 1.05rem var(--display);
    color: var(--muted);
  }

  ol li + li {
    margin-top: 0.75rem;
  }

  .aside {
    color: var(--muted);
    font-size: 0.95rem;
  }

  .mac {
    padding: 0.75rem 1rem;
    border-left: 3px solid var(--amber);
    background: #fbf1e6;
    font-size: 0.95rem;
  }

  .release {
    margin-top: 1.25rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--line);
  }

  .release h4 {
    margin: 0 0 0.5rem;
    font: 600 1.2rem/1.3 var(--display);
  }

  .notes :global(h1),
  .notes :global(h2),
  .notes :global(h3) {
    margin: 0.75rem 0 0.25rem;
    font: 600 1rem/1.3 var(--display);
  }

  .notes :global(ul) {
    margin: 0;
    padding-left: 1.2rem;
  }

  footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.5rem 2rem;
    padding-block: 1.5rem 2.5rem;
    color: var(--muted);
    font-size: 0.95rem;
  }

  footer a {
    font-weight: 500;
  }

  footer p {
    margin: 0;
  }

  /* On a phone the hero still fits one screen: tighter steps between its parts. */
  @media (max-width: 40rem) {
    .hero {
      gap: 1.75rem;
      padding-block: 1.5rem;
    }

    .stage {
      margin-bottom: 1rem;
    }

    h1 {
      margin-bottom: 1.25rem;
    }

    .lede {
      margin-bottom: 1.5rem;
    }

    .shot img {
      max-width: 26rem;
    }

    .command {
      flex-direction: column;
    }

    .command code {
      padding: 0.8rem 0.85rem;
      font-size: 0.8rem;
    }

    .command button {
      width: auto;
      padding: 0.7rem;
      border-left: 0;
      border-top: 1px solid rgb(255 255 255 / 0.15);
    }
  }
</style>
