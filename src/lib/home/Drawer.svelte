<script>
  // namp's drawer, live, where the hero's screenshot has it: open on Threads at Needs you, in the thread of
  // the question the canvas's gutter mark opened. Ported from namp's ui/src/lib/Drawer.svelte and
  // DrawerTitle.svelte, its heads: the subject's icon, Threads and the count of what needs you, the caret
  // and Hide; the filters, Needs you chosen; the thread's own head with Back, Locate and who has read it.
  // Then the question's message as Thread.svelte draws it, its sender's chip, name, time and new dot over
  // the question (Question.svelte), with the reply box under it (Compose.svelte). Answering it, by a click or
  // a number key, folds it out and brings the topic's next question up, the counts one less; once both are
  // answered the drawer shows what is left in Needs you, the pull request's review as a headline row
  // (ThreadRow.svelte). What the demo cannot do, its heads' buttons and its boxes, is drawn and does nothing.
  import { tick } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { slide } from "svelte/transition";
  import Question from "./Question.svelte";
  import { asks, review, sessions, withYou } from "./demo.js";

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
    said = `Answered: ${c.text}. ${left} waiting for you${now ? `, next: ${now.title}` : ""}.`;
    // The focus was on a choice that is gone: it goes to the next question, as namp brings it up, or to the
    // drawer's title, which counts what is left.
    await tick();
    (now ? question : heading)?.focus();
  }
</script>

<section class="drawer" aria-labelledby="threads">
  <div class="heads">
    <div class="drawer-head title-head">
      <h2 id="threads" class="pick" tabindex="-1" bind:this={heading}>
        <svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 4.5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H7l-3 2.5v-2.5h0a2 2 0 0 1-1.5-2z" /></svg>
        <span class="name">Threads</span>
        <span class="n ask" data-count>{left}</span><span class="vh">{" "}waiting for you</span>
        <svg class="caret" viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" /></svg>
      </h2>
      <span class="act end" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M4 10h11.5M10.5 4.5 16 10l-5.5 5.5" /></svg></span>
    </div>
    <div class="drawer-head filters-head">
      <span class="filters">
        <span class="filter on">Needs you <span class="n" data-needs>{left}</span></span>
        <span class="filter">With you <span class="n">{withYou}</span></span>
        <span class="filter">Sessions <span class="n">{sessions}</span></span>
      </span>
      <span class="demo">demo topic</span>
    </div>
    {#if now}
      <div class="drawer-head thread-head" aria-hidden="true" out:fold>
        <span class="act"><svg viewBox="0 0 20 20"><path d="M16 10H4.5M9.5 4.5 4 10l5.5 5.5" /></svg></span>
        <span class="act"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="5.5" /><circle cx="10" cy="10" r="1.8" class="fill" /><path d="M10 1.5v3M10 15.5v3M1.5 10h3M15.5 10h3" /></svg></span>
        <span class="chip end">RI<span class="badge"><svg viewBox="0 0 16 16"><path d="M3 8.5l3 3 7-7" /></svg></span></span>
      </div>
    {/if}
  </div>

  {#if now}
    {#key now.id}
      <div class="thread" in:rise out:fold>
        <div class="msg question-msg">
          <span class="mark" aria-hidden="true"><span class="ag-chip" style:--h={now.hue}>{now.chip}<svg viewBox="0 0 12 12"><path d="M6 1v10M1.3 6h9.4M2.6 2.6l6.8 6.8M9.4 2.6 2.6 9.4" /></svg></span></span>
          <span class="who">{now.who}<time class="time" datetime={now.at}>{now.at}</time><span class="new" title="New since your last visit"></span></span>
          <div class="text"><Question q={now} onpick={pick} bind:this={question} /></div>
        </div>
        <div class="reply" aria-hidden="true">
          <span class="box">Press 1 to {now.choices.length} in the question, or type your own answer{@render send()}</span>
        </div>
      </div>
    {/key}
  {:else}
    <div class="listing" in:rise>
      <div class="reply new" aria-hidden="true">
        <span class="box">Message the session. @ mentions a topic, Ctrl+Enter sends.{@render send()}</span>
      </div>
      <p class="hint">What needs you: a question to answer, a goal or a notice to act on, then a reply or a heads-up to read. <span class="keys">j and k step, Esc hides.</span></p>
      <div class="row fresh">
        <span class="where"><span class="kind">{review.kind}</span><span class="sep">·</span><span class="subject">{review.subject}</span></span>
        <span class="what">{review.text}</span>
      </div>
    </div>
  {/if}
  <p class="said vh" aria-live="polite">{said}</p>
</section>

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

  .pick .icon {
    width: 18px;
    height: 18px;
    color: var(--accent-ink);
  }

  .pick .caret {
    width: 12px;
    height: 12px;
    margin-left: -2px;
    color: var(--muted);
  }

  /* namp's .n: a count, here the asks' on the ask's apricot. */
  .n {
    display: inline-grid;
    place-items: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: var(--r-sm);
    font: var(--fw-strong) var(--fs-2xs) / 1 var(--cond);
    font-variant-numeric: tabular-nums;
  }

  .n.ask {
    background: var(--ask-count);
    color: var(--on-ask);
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

  /* The filters, Needs you chosen on the accent's rule. */
  .filters-head {
    min-height: 40px;
  }

  .filters {
    display: flex;
    align-self: stretch;
    gap: var(--sp-1);
  }

  .filter {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: -1px;
    padding: 0 8px;
    border-bottom: 2px solid transparent;
    color: var(--muted);
    font: var(--fw-medium) var(--fs-md) / 1.2 var(--cond);
    white-space: nowrap;
  }

  .filter .n {
    min-width: 0;
    padding: 0;
    background: none;
    color: var(--muted);
  }

  .filter.on {
    border-bottom-color: var(--accent);
    color: var(--ink);
    font-weight: var(--fw-strong);
  }

  .filter.on .n {
    color: var(--accent-ink);
  }

  /* Where namp's filters row has nothing, the demo says it is one. */
  .demo {
    margin-left: auto;
    color: var(--muted);
    font-size: var(--fs-xs);
    white-space: nowrap;
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

  .reply.new {
    margin-top: 0;
    padding: 0;
  }

  .reply.new .box {
    border-radius: var(--r-ctl);
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
