<script>
  // namp's drawer, live, where the hero's screenshot has it: open on the thread of the question the canvas's
  // gutter mark opened, as namp v0.20.0 draws a thread, the drawer holding no list of the topic's threads.
  // Ported from namp's ui/src/lib/Drawer.svelte, DrawerTitle.svelte and ThreadDocs.svelte, its heads: the
  // thread's name and its close; Show in, Pin and who has read it; the place it is pinned to on the canvas.
  // Then the question's message as Thread.svelte draws it, its sender's chip, name, time and new dot over
  // the question (Question.svelte), with the reply box under it (Compose.svelte). Answering it, by a click or
  // a number key, folds it out and brings the topic's next question up; once both are answered the drawer
  // shows Needs you across the topics, the pull request's review left as a headline row (Headline.svelte).
  // What the demo cannot do, its heads' buttons and its boxes, is drawn and does nothing.
  import { tick } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { slide } from "svelte/transition";
  import Question from "./Question.svelte";
  import { asks, canvas, review } from "./demo.js";

  /** @import { Choice } from "./demo.js" */

  /** @type {{ onanswer?: (open: number) => void }} */
  let { onanswer } = $props();

  let at = $state(0);
  let now = $derived(asks[at] ?? null);
  // What needs you: the questions still open and the review.
  let left = $derived(asks.length - at + 1);
  let said = $state("");
  /** @type {HTMLElement | undefined} */
  let heading = $state();
  /** @type {{ focus: () => void } | undefined} */
  let question = $state();

  // Whether this browser asks for reduced motion, as namp's motion.js reads it.
  const still = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // An answered question folds away, its height to nothing; at once with reduced motion.
  /** @param {Element} node */
  const fold = (node) => slide(node, { duration: still() ? 0 : 240, easing: cubicOut });
  // What comes up after it rises into the room it leaves, as namp's rows arrive.
  /** @param {Element} node */
  const rise = (node) => ({
    delay: still() ? 0 : 200,
    duration: still() ? 0 : 420,
    easing: cubicOut,
    css: (/** @type {number} */ t) => `opacity: ${t}; transform: translateY(${(1 - t) * 10}px)`,
  });

  /** @param {Choice} c */
  async function pick(c) {
    // The choice shows picked a moment, its ring filled, before the question folds out.
    if (!still()) await new Promise((done) => setTimeout(done, 180));
    // Told how many questions are still open once this one is answered.
    onanswer?.(asks.length - at - 1);
    at += 1;
    // A sentence ends once: a title that asks ends on its own question mark.
    said = `Answered: ${c.text}. ${left} waiting for you${now ? `, next: ${now.title}` : ""}`.replace(/(?<![.?!])$/, ".");
    // The focus was on a choice that is gone: it goes to the next question, as namp brings it up, or to the
    // drawer's title, which counts what is left.
    await tick();
    (now ? question : heading)?.focus();
  }
</script>

<section class="drawer" aria-labelledby="drawer-title">
  <div class="heads">
    {#if now}
      <!-- The thread's head, its name and its close, then its icons and who has read it, then the place it is
           pinned to, each a bar on a hairline. -->
      <div class="drawer-head title-head" out:fold>
        <h2 id="drawer-title" class="pick" tabindex="-1" bind:this={heading} title={now.title}>
          <svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 4.5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H7l-3 2.5v-2.5h0a2 2 0 0 1-1.5-2z" /></svg>
          <span class="name" data-thread-title>{now.title}</span><span class="vh">, {left} waiting for you</span>
        </h2>
        <span class="act end" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M5.5 5.5l9 9M14.5 5.5l-9 9" /></svg></span>
      </div>
      <div class="drawer-head thread-head" aria-hidden="true" out:fold>
        <span class="act"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="5.5" /><circle cx="10" cy="10" r="1.8" class="fill" /><path d="M10 1.5v3M10 15.5v3M1.5 10h3M15.5 10h3" /></svg></span>
        <span class="act mark"><svg viewBox="0 0 16 16"><path d="M9.8 2.5 13.5 6.2l-2.3.9-2.4 2.4.3 2.8-1 1-2.4-2.4L3 13.5M5.7 7.4 3.3 6.4l1-1 2.8.3 2.4-2.4z" /></svg></span>
        <span class="demo end">demo topic</span>
        <span class="chip">RI<span class="badge"><svg viewBox="0 0 16 16"><path d="M3 8.5l3 3 7-7" /></svg></span></span>
      </div>
      <div class="docs" aria-hidden="true" out:fold>
        <span class="doc own"
          ><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="5.5" /><circle cx="10" cy="10" r="1.8" class="fill" /><path d="M10 1.5v3M10 15.5v3M1.5 10h3M15.5 10h3" /></svg
          ><span class="doc-name">{canvas}</span><span class="sep">›</span><span class="doc-heading" data-thread-place>{now.place}</span></span
        >
      </div>
    {:else}
      <div class="drawer-head title-head" in:rise>
        <h2 id="drawer-title" class="needs" tabindex="-1" bind:this={heading}><strong>Needs you</strong> <span class="muted">in every topic</span></h2>
        <span class="act end" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M4 10h11.5M10.5 4.5 16 10l-5.5 5.5" /></svg></span>
      </div>
    {/if}
  </div>

  {#if now}
    <!-- The thread in the room of the tallest of the topic's questions, each laid unseen in the one place, so the
         drawer is as tall for the next question as for this one and nothing round it moves. -->
    <div class="threads">
      {#key now.id}
        <div class="thread" in:rise out:fold>{@render thread(now, true)}</div>
      {/key}
      {#each asks as q (q.id)}
        <div class="thread ghost" aria-hidden="true" inert>{@render thread(q, false)}</div>
      {/each}
    </div>
  {:else}
    <div class="listing" in:rise>
      <p class="hint">What needs you: a question to answer, a goal or a notice to act on, then a reply or a heads-up to read. <span class="keys">n opens the next ask, Esc hides.</span></p>
      <div class="group">
        <span class="group-name">{canvas} <span class="muted">· this topic</span></span>
        <div class="row fresh">
          <span class="where"><span class="kind">{review.kind}</span><span class="sep">·</span><span class="subject">{review.subject}</span></span>
          <span class="what">{review.text}</span>
        </div>
      </div>
    </div>
  {/if}
  <p class="said vh" aria-live="polite">{said}</p>
</section>

{#snippet thread(q, live)}
  <div class="msg question-msg">
    <span class="mark" aria-hidden="true"><span class="ag-chip" style:--h={q.hue}>{q.chip}<svg viewBox="0 0 12 12"><path d="M6 1v10M1.3 6h9.4M2.6 2.6l6.8 6.8M9.4 2.6 2.6 9.4" /></svg></span></span>
    <span class="who">{q.who}<time class="time" datetime={q.at}>{q.at}</time><span class="new" title="New since your last visit"></span></span>
    <div class="text">
      {#if live}<Question {q} onpick={pick} bind:this={question} />{:else}<Question {q} onpick={() => {}} />{/if}
    </div>
  </div>
  <div class="reply" aria-hidden="true">
    <span class="box">Press 1 to {q.choices.length} in the question, or reply{@render send()}</span>
  </div>
{/snippet}

{#snippet send()}<span class="send"><svg viewBox="0 0 16 16"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" /></svg></span>{/snippet}

<style>
  /* namp's app.css .drawer: the surface, a hairline at its left, 12px in. */
  .drawer {
    --hue-soft: 30% 26%;
    --hue-ink: 60% 80%;
    padding: 0 12px;
    border-left: 1px solid var(--line);
    background: var(--surface);
    color: var(--ink);
    font-size: var(--fs-md);
    line-height: 1.55;
  }

  :global([data-theme="light"]) .drawer {
    --hue-soft: 45% 90%;
    --hue-ink: 45% 30%;
  }

  @media (prefers-color-scheme: light) {
    :global(:root:not([data-theme])) .drawer {
      --hue-soft: 45% 90%;
      --hue-ink: 45% 30%;
    }
  }

  /* The heads, each a bar on a hairline across the drawer. */
  .heads {
    margin: 0 -12px 10px;
  }

  .drawer-head {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    padding: 0 12px;
    border-bottom: 1px solid var(--line);
    font-size: var(--fs-sm);
  }

  .end {
    margin-left: auto;
  }

  /* DrawerTitle.svelte: the subject's icon in the accent, its name, the count of what needs you, the caret. */
  .title-head {
    min-height: 52px;
    padding: 0 8px 0 16px;
  }

  .pick {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    height: 34px;
    margin: 0;
    color: var(--ink);
    font: var(--fw-strong) var(--fs-lg) / 1 var(--cond);
    letter-spacing: 0;
  }

  .pick:focus {
    outline: none;
  }

  .pick:focus-visible {
    outline: 2px solid var(--accent);
    border-radius: var(--r-sm);
  }

  .pick svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .pick .name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pick {
    min-width: 0;
  }

  .pick .icon {
    width: 18px;
    height: 18px;
    color: var(--accent-ink);
  }

  /* The heads' icons, 18px in a 30px place, in muted strokes. */
  .act {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    color: var(--muted);
  }

  .act svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.7;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .act svg .fill {
    fill: currentColor;
    stroke: none;
  }

  /* The pin, Marks.svelte's 14px icon in the same place. */
  .act.mark svg {
    width: 14px;
    height: 14px;
    stroke-width: 1.5;
  }

  /* Where namp's thread head has room, the demo says it is one. */
  .demo {
    margin-right: var(--sp-2);
    color: var(--muted);
    font-size: var(--fs-xs);
    white-space: nowrap;
  }

  /* ThreadDocs.svelte: under the thread's head, the place it is pinned to, a reference with the target's icon
     in the accent, the canvas's title, then the heading. */
  .docs {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-1) var(--sp-2);
    padding: var(--sp-2) 12px;
    border-bottom: 1px solid var(--line);
  }

  .doc {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    max-width: 100%;
    padding: 3px var(--sp-2);
    border: 1px solid var(--line);
    border-radius: var(--r-xs);
    font-size: var(--fs-sm);
    line-height: 1.3;
  }

  .doc svg {
    flex: none;
    width: 14px;
    height: 14px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    color: var(--accent-ink);
  }

  .doc svg .fill {
    fill: currentColor;
    stroke: none;
  }

  .doc-name {
    flex: none;
  }

  .doc .sep {
    flex: none;
  }

  .doc-heading {
    min-width: 0;
    overflow: hidden;
    color: var(--ink-2);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Needs you across the topics, its head as namp's: Needs you, then its reach in muted. */
  .needs {
    margin: 0;
    font: var(--fw-normal) var(--fs-sm) / 1.3 var(--font);
  }

  .needs:focus {
    outline: none;
  }

  .needs:focus-visible {
    outline: 2px solid var(--accent);
    border-radius: var(--r-sm);
  }

  .muted {
    color: var(--muted);
  }

  /* A topic's group of what needs you, under its name. */
  .group {
    padding-top: var(--sp-2);
    border-top: 1px solid var(--line);
  }

  .group-name {
    display: block;
    padding: var(--sp-1) 0;
    color: var(--ink);
    font: var(--fw-strong) var(--fs-sm) / 1.3 var(--cond);
  }

  .thread-head {
    gap: var(--sp-1);
    min-height: 48px;
    padding: 0 8px;
  }

  /* Who read the thread: the owner's initials on the done green, its check at the corner. */
  .chip {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    margin-right: var(--sp-1);
    border: 1px solid var(--ok);
    border-radius: var(--r-round);
    background: var(--ok);
    color: var(--on-accent);
    font: var(--fw-strong) var(--fs-2xs) / 1 var(--font);
  }

  .badge {
    display: flex;
    position: absolute;
    right: -3px;
    bottom: -3px;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
    border-radius: var(--r-round);
    background: var(--surface);
    color: var(--ok-ink);
  }

  .badge svg {
    width: 9px;
    height: 9px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  /* Thread.svelte's question message, across the drawer's width, with the look namp gives a question that has
     the focus, as the gutter mark opening it gives it: the accent's faint tint, a line above and below. */
  .msg {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0 var(--sp-2);
    margin: 0 -12px;
    padding: 10px 12px;
    border-block: 1px solid color-mix(in srgb, var(--accent) 40%, var(--surface));
    background: color-mix(in srgb, var(--accent) 4%, var(--surface));
  }

  .mark {
    display: flex;
    align-items: center;
    height: 24px;
  }

  /* AgentChip.svelte: the session's initials and its sign on its own hue. */
  .ag-chip {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 3px;
    height: 18px;
    padding: 0 5px;
    border-radius: var(--r-xs);
    background: hsl(var(--h) var(--hue-soft));
    color: hsl(var(--h) var(--hue-ink));
    font: var(--fw-medium) var(--fs-2xs) / 1 var(--cond);
    white-space: nowrap;
  }

  .ag-chip svg {
    width: 9px;
    height: 9px;
    opacity: 0.8;
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linecap: round;
  }

  .who {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    font-size: var(--fs-sm);
    font-weight: var(--fw-strong);
    line-height: 24px;
  }

  .time {
    color: var(--muted);
    font-size: var(--fs-xs);
    font-weight: var(--fw-normal);
    font-variant-numeric: tabular-nums;
  }

  .who .new {
    width: 7px;
    height: 7px;
    border-radius: var(--r-round);
    background: var(--accent);
  }

  .text {
    grid-column: 1 / -1;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  /* Every question's thread in one cell, the unseen ones holding its height at the tallest's. */
  .threads {
    display: grid;
  }

  .threads > .thread {
    grid-area: 1 / 1;
    align-self: start;
  }

  .ghost {
    visibility: hidden;
  }

  /* Compose.svelte's box, its placeholder in it and its round arrow at the bottom right. */
  .reply {
    margin-top: 14px;
    padding: 10px 0 12px;
  }

  .box {
    display: block;
    position: relative;
    box-sizing: border-box;
    min-height: calc(2.8em + 14px);
    padding: 6px 40px 6px 8px;
    border: 1px solid var(--edge);
    border-radius: var(--r-md);
    background: var(--surface);
    color: var(--muted);
    font-size: var(--fs-md);
    line-height: 1.4;
  }

  .send {
    display: inline-flex;
    position: absolute;
    right: 6px;
    bottom: 6px;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 28px;
    height: 28px;
    border: 1px solid var(--edge);
    border-radius: var(--r-round);
    color: var(--muted);
  }

  .send svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .hint {
    margin: 6px 0 var(--sp-2);
    color: var(--muted);
    font-size: var(--fs-xs);
  }

  .keys {
    white-space: nowrap;
  }

  /* ThreadRow.svelte's headline row of what needs you: the ask's flag at its left, on its fade, lifted. */
  .row {
    display: block;
    position: relative;
    margin: 6px 0;
    padding: 8px 10px 8px calc(var(--flag) + 10px);
    background: var(--ask-fill);
    box-shadow: var(--shadow-lift);
    font: var(--fw-medium) var(--fs-sm) / 1.2 var(--cond);
  }

  .row::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: var(--flag);
    background: var(--ask);
  }

  .where {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    color: var(--ink-2);
    font-size: var(--fs-xs);
  }

  .kind {
    flex: none;
    color: var(--ask-ink);
    font-weight: var(--fw-strong);
  }

  .sep {
    color: var(--muted);
  }

  .subject {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .what {
    display: block;
    color: var(--ink-2);
    font: var(--fs-sm) / 1.4 var(--font);
  }

  /* Said to a screen reader alone. */
  .vh {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
