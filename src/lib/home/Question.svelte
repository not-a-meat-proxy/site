<script>
  // A question in its thread in the drawer, ported from namp's ui/src/lib/Question.svelte and the rules
  // app.css gives it there: its title, its context, its choices numbered, the recommended one's ring in the
  // accent and tagged at the row's end, Your own answer last, and Discard under them at the right. A number
  // key picks a choice while the question has the focus, as in namp; a click picks it too. Here the pick is
  // the answer, as Enter sends it in namp's reply box, and `onpick` is told. Your own answer and Discard are
  // shown as namp shows them and do nothing: the demo has no session to read them.
  /** @import { Ask, Choice } from "./demo.js" */

  /** @type {{ q: Ask, onpick: (c: Choice) => void }} */
  let { q, onpick } = $props();

  /** @type {Choice | null} */
  let picked = $state(null);
  /** @type {HTMLDivElement | undefined} */
  let root = $state();

  /** @param {Choice} c */
  function pick(c) {
    if (picked) return;
    picked = c;
    onpick(c);
  }

  /** @param {KeyboardEvent} e */
  function keys(e) {
    if (e.ctrlKey || e.metaKey || e.altKey || !/^[1-9]$/.test(e.key)) return;
    const c = q.choices[Number(e.key) - 1];
    if (!c) return;
    e.preventDefault();
    pick(c);
  }

  // Where the focus goes when this question comes up after another, as namp's arrive() takes it.
  export const focus = () => root?.focus({ preventScroll: true });
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
<div class="question-box" tabindex="0" role="group" aria-label="Question, {q.who}" bind:this={root} onkeydown={keys} data-question={q.id}>
  <strong class="title">{q.title}</strong>
  <p class="ctx">{q.context}</p>
  <div class="choices">
    {#each q.choices as c, i (c.text)}
      <button type="button" class="choice" class:rec={c.recommended} class:picked={picked === c} onclick={() => pick(c)} data-choice={i + 1}>
        <span class="num">{i + 1}</span><span class="choice-text">{c.text}</span>{#if c.recommended}<span class="tag">Recommended</span>{/if}
      </button>
    {/each}
    <span class="choice free-choice" aria-hidden="true"><span class="num">{q.choices.length + 1}</span><span class="choice-text">Your own answer</span></span>
  </div>
  <div class="question-acts" aria-hidden="true"><span class="link">Discard</span></div>
</div>

<style>
  .question-box {
    border-radius: var(--r-sm);
    font-size: var(--fs-body);
    line-height: 1.55;
    outline: none;
  }

  .title {
    font-weight: var(--fw-strong);
  }

  .ctx {
    margin: 0;
  }

  /* namp's app.css .choices and .choice: rows on hover's tint, in the condensed cut. */
  .choices {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: var(--sp-2) 0 var(--sp-1);
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
    font: var(--fw-medium) var(--fs-sm) / 1.2 var(--cond);
    text-align: left;
  }

  button.choice:hover {
    border-color: transparent;
    background: var(--hover);
  }

  /* On a touch screen a choice is 44px tall to tap, its ring's 22px and 10px above and below. */
  @media (pointer: coarse) {
    .choice {
      padding-block: 10px;
    }
  }

  .choice.rec {
    font-weight: var(--fw-strong);
  }

  .choice.picked {
    background: color-mix(in srgb, var(--accent) 9%, var(--surface));
  }

  /* Look D's keys: a ring with the choice's number, the recommended one's in the accent, the one picked filled.
     The numbers are the accent's ink, as namp turns them while the question has the focus. */
  .num {
    display: inline-grid;
    flex: none;
    place-items: center;
    align-self: center;
    width: 22px;
    height: 22px;
    border-radius: var(--r-round);
    box-shadow: inset 0 0 0 1.5px var(--line-strong);
    color: var(--accent-ink);
    font: var(--fw-strong) var(--fs-xs) / 1 var(--cond);
  }

  .choice.rec .num {
    box-shadow: inset 0 0 0 1.5px var(--accent);
  }

  .choice.picked .num {
    background: var(--accent);
    box-shadow: none;
    color: var(--on-accent);
  }

  /* A choice's words take the row, Recommended at its end, never overrun, however narrow the drawer. */
  .choice-text {
    flex: 1;
    min-width: 0;
  }

  .free-choice .choice-text {
    color: var(--muted);
  }

  .tag {
    flex: none;
    color: var(--ok-ink);
    font-size: var(--fs-xs);
    font-weight: var(--fw-strong);
  }

  .question-acts {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--sp-1);
  }

  .link {
    padding: 2px 0;
    color: var(--muted);
    font: var(--fw-medium) var(--fs-sm) / 1.2 var(--cond);
  }
</style>
