<script>
  // namp's Needs you, live over the hero's screenshot where the Overview's own is, its heading as namp's
  // Overview.svelte draws it: the count of the asks and, beside it, the petrol bubble of what waits for
  // reading (ReadCount.svelte), then a headline per ask, as namp's Home lists them, then the reply. Its topics are demo topics, and say so. The headlines arrive one by
  // one as the page loads, by transform and opacity alone in the room they already hold, and stand still
  // for a browser asking for reduced motion (app.css). The first question carries its choices, as namp's
  // question does where it is answered in place: picking one, by a click or its number key, answers it, and
  // it folds out of Needs you as an answered ask leaves it, the count one less. `show` is how many of the
  // demo's asks it lists, from the first; `onanswer` is told just before an answered ask folds out.
  import { tick } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { slide } from "svelte/transition";
  import Headline from "./Headline.svelte";
  import { asks, reply } from "./demo.js";
  import { needWords } from "./headline.js";

  /** @import { Ask, Choice } from "./demo.js" */

  /** @type {{ show?: number, onanswer?: () => void }} */
  let { show = asks.length, onanswer } = $props();

  /** @type {Record<string, string>} */
  let answered = $state({});
  let open = $derived(asks.slice(0, show).filter((a) => !(a.id in answered)));
  let said = $state("");
  /** @type {HTMLElement | undefined} */
  let heading = $state();

  // Whether this browser asks for reduced motion, as namp's motion.js reads it.
  const still = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // An answered ask folds away: its height to nothing, the asks under it closing up; at once with reduced motion.
  /** @param {Element} node */
  const fold = (node) => slide(node, { duration: still() ? 0 : 240, easing: cubicOut });

  // What a headline shows of an ask.
  /** @param {Ask} a */
  const shown = ({ label, who, at, subject, text }) => ({ label, who, at, subject, text });

  /** @param {Ask} a @param {Choice} c */
  async function pick(a, c) {
    onanswer?.();
    answered[a.id] = c.text;
    said = `Answered: ${c.text}. ${needWords(open.length)}`;
    // The focus was on a choice that is gone: it goes to the heading, where the count says what is left.
    await tick();
    heading?.focus();
  }

  // A number key picks that choice while the question has the focus, as in namp.
  /** @param {Ask} a @param {KeyboardEvent} e */
  function keys(a, e) {
    if (e.ctrlKey || e.metaKey || e.altKey || !/^[1-9]$/.test(e.key)) return;
    const c = a.choices?.[Number(e.key) - 1];
    if (!c) return;
    e.preventDefault();
    pick(a, c);
  }
</script>

<section class="needs-you" aria-labelledby="needs-you">
  <div class="top">
    <h2 id="needs-you" tabindex="-1" bind:this={heading}>
      Needs you <span class="c ask"><span data-needs-count>{open.length}</span><span class="vh">{" "}{open.length > 1 ? "asks" : "ask"},{" "}</span></span><span class="n replied" title="1 reply or heads-up to read">1<span class="vh">{" "}reply or heads-up to read</span></span>
    </h2>
    <p class="demo">demo topics</p>
  </div>
  <div class="list">
    {#each open as a, i (a.id)}
      <div class="item" style:--i={i} out:fold>
        {#if a === asks[0] && a.choices}
          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <Headline {...shown(a)} tone="ask" role="group" aria-label="Question, {a.who}" onkeydown={(/** @type {KeyboardEvent} */ e) => keys(a, e)} data-question={a.id}>
            <div class="choices">
              {#each a.choices as c, n (c.text)}
                <button type="button" class="choice" class:rec={c.recommended} onclick={() => pick(a, c)} data-choice={n + 1}>
                  <span class="num">{n + 1}</span><span class="choice-text">{c.text}</span>{#if c.recommended}<span class="tag">Recommended</span>{/if}
                </button>
              {/each}
            </div>
          </Headline>
        {:else}
          {@const r = a.choices?.find((c) => c.recommended)}
          <Headline {...shown(a)} tone="ask" rec={r ? { word: "Recommended", text: r.text } : null} />
        {/if}
      </div>
    {/each}
    <div class="item" style:--i={show}>
      <Headline {...reply} tone="replied" />
    </div>
  </div>
  <p class="said" aria-live="polite">{said}</p>
</section>

<style>
  /* On the page's ground, as namp's Home lays it: no frame of its own, its asks lifted from the ground. */
  .needs-you {
    background: var(--bg);
  }

  .top {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--sp-1) var(--sp-4);
    margin-bottom: var(--sp-3);
  }

  /* The Overview's heading: smaller than Home's, its counts close beside it. */
  h2 {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    margin: 0;
    font-size: var(--fs-lg);
    line-height: 1.25;
    letter-spacing: -0.01em;
  }

  h2:focus {
    outline: none;
  }

  h2:focus-visible {
    outline: 2px solid var(--accent);
  }

  /* The asks' count, a 20px box on the ask's apricot, as the Overview's tally. */
  .c.ask {
    display: inline-grid;
    place-items: center;
    box-sizing: border-box;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: var(--r-xs);
    background: var(--ask-count);
    color: var(--on-ask);
    font-size: var(--fs-xs);
    font-weight: var(--fw-strong);
    font-variant-numeric: tabular-nums;
  }

  /* What waits for reading, an outlined petrol bubble as tall as the asks' box. */
  .n.replied {
    display: inline-grid;
    place-items: center;
    box-sizing: border-box;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: var(--r-xs);
    box-shadow: inset 0 0 0 1px var(--accent);
    color: var(--accent-ink);
    font: var(--fw-strong) var(--fs-xs) / 1 var(--cond);
  }

  .demo {
    margin: 0;
    color: var(--muted);
    font-size: var(--fs-sm);
  }

  /* Each headline holds its room from the first paint and arrives in it, one after another. */
  .item {
    padding-bottom: var(--sp-4);
    animation: arrive-row 520ms var(--ease-out) both;
    animation-delay: calc(450ms + var(--i) * 140ms);
  }

  .item:last-child {
    padding-bottom: 0;
  }

  @keyframes arrive-row {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
  }

  /* The question's choices, as namp's: a ring with the choice's number, the recommended one's in the accent. */
  .choices {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: var(--sp-2) 0 var(--sp-1) -10px;
  }

  .choice {
    display: flex;
    align-items: baseline;
    gap: var(--sp-2);
    padding: 6px 10px;
    border: 1px solid transparent;
    border-radius: var(--r-md);
    background: none;
    color: var(--ink);
    font-size: var(--fs-sm);
    text-align: left;
  }

  /* On a touch screen a choice is 44px tall to tap, its ring's 22px and 10px above and below. */
  @media (pointer: coarse) {
    .choice {
      padding-block: 10px;
    }
  }

  .choice:hover {
    border-color: transparent;
    background: var(--hover);
  }

  .num {
    display: inline-grid;
    flex: none;
    place-items: center;
    align-self: center;
    width: 22px;
    height: 22px;
    border-radius: var(--r-round);
    box-shadow: inset 0 0 0 1.5px var(--line-strong);
    color: var(--muted);
    font-size: var(--fs-xs);
    font-weight: var(--fw-strong);
  }

  .choice.rec .num {
    box-shadow: inset 0 0 0 1.5px var(--accent);
    color: var(--accent-ink);
  }

  .choice:active .num {
    background: var(--accent);
    box-shadow: none;
    color: var(--on-accent);
  }

  /* The choice's words take their own width, so Recommended stands right after them, as namp's Question has it,
     however wide the card. */
  .choice-text {
    min-width: 0;
  }

  .tag {
    flex: none;
    color: var(--ok-ink);
    font-size: var(--fs-xs);
    font-weight: var(--fw-strong);
    white-space: nowrap;
  }

  /* Said to a screen reader alone. */
  .said,
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
