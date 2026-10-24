<script module>
  // The one ResizeObserver of every headline's text, as namp's Headline has it: a report reads each text's
  // heights before any headline fades, so no fade changed lays the page out again for the next text's read.
  /** @type {Map<Element, (over: boolean) => void>} */
  const told = new Map();
  /** @type {ResizeObserver | null} */
  let seen = null;

  /**
   * Tells `tell` whether `el`'s text runs past its box, as laid out, at each of its reports.
   * @param {HTMLElement} el
   * @param {(over: boolean) => void} tell
   */
  function watch(el, tell) {
    if (typeof ResizeObserver === "undefined") return;
    seen ??= new ResizeObserver((entries) => {
      const over = entries.map(({ target }) => /** @type {const} */ ([target, target.scrollHeight > target.clientHeight + 1]));
      for (const [target, o] of over) told.get(target)?.(o);
    });
    told.set(el, tell);
    seen.observe(el);
    return () => {
      told.delete(el);
      seen?.unobserve(el);
      if (!told.size) (seen?.disconnect(), (seen = null));
    };
  }
</script>

<script>
  // A headline of namp's Home Needs you, ported from namp's ui/src/lib/Headline.svelte, its card: what it
  // is, who and when, its subject, the first 2 lines of its text, each line its own, the end of the second
  // faded when more follows, and a question's recommended choice on a line. Its flag at its left edge takes
  // its tone's colour, the ask's orange, `ask`, or the petrol accent for what waits for reading, `replied`,
  // on the tone's fade, lifted from the ground. In namp a headline is a button opening its ask; here it
  // opens nothing, so it is no control: `children` add what the visitor can do in it, a question's choices.
  // Its subject wraps where namp's keeps to a line, as the card is narrower than namp's Home column.
  import { headLines } from "./headline.js";

  /** @type {{ label: string, who: string, at: string, subject: string, text: string, tone?: string, rec?: { word: string, text: string } | null, children?: import("svelte").Snippet, [attr: string]: any }} */
  let { label, who, at, subject, text, tone = "replied", rec = null, children, ...attrs } = $props();
  let all = $derived(headLines(text));
  let lines = $derived(all.slice(0, 2));
  // Whether the text runs past its 2 lines, which fades the end of the second: always with a third line,
  // else as its 2 lines wrap, measured as the headlines' ResizeObserver reports it.
  let over = $state(false);
  let clamped = $derived(all.length > 2 || over);

  /** @param {HTMLElement} el */
  function clamp(el) {
    void lines;
    return watch(el, (o) => (over = o));
  }
</script>

<div class="card headline {tone}" {...attrs}>
  <span class="head"><span class="kind">{label}</span><span class="who">{who}</span><time class="when" datetime={at}>{at}</time></span>
  <span class="subject">{subject}</span>
  {#if lines.length}<span class="what" class:clamped {@attach clamp}>{#each lines as l, i (i)}<span class="line">{l}</span>{" "}{/each}</span>{/if}
  {#if rec}<span class="rec"><span class="rec-word">{rec.word}:</span> <span class="rec-choice">{rec.text}</span></span>{/if}
  {@render children?.()}
</div>

<style>
  .headline {
    --tone: var(--accent);
    --tone-fill: linear-gradient(90deg, var(--accent-soft), var(--surface) 55%);
    --tone-ink: var(--accent-ink);
  }

  .headline.ask {
    --tone: var(--ask);
    --tone-fill: var(--ask-fill);
    --tone-ink: var(--ask-ink);
  }

  .kind {
    color: var(--tone-ink);
    font-weight: var(--fw-strong);
  }

  /* The text's first 2 lines, each of its lines starting one of its own, the end of the second fading out
     when more follows, rather than an ellipsis that reads as a fourth dot after a period. */
  .what {
    display: block;
    max-height: 2lh;
    overflow: hidden;
    overflow-wrap: anywhere;
  }

  .what.clamped {
    --fade: linear-gradient(to left, transparent, var(--mask) 4em);
    mask:
      linear-gradient(var(--mask), var(--mask)) top / 100% calc(100% - 1lh) no-repeat,
      var(--fade) bottom / 100% 1lh no-repeat;
  }

  .line {
    display: block;
  }

  .rec {
    display: block;
    overflow: hidden;
    color: var(--ink-2);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .rec-word {
    color: var(--muted);
  }

  .rec-choice {
    color: var(--ink);
    font-weight: var(--fw-strong);
  }

  /* The card: the tone's flag at its left edge, on the tone's fade, lifted from the ground. */
  .card {
    display: block;
    position: relative;
    min-width: 0;
    padding: var(--sp-3) var(--sp-5) var(--sp-4) calc(var(--flag) + var(--sp-4));
    background: var(--tone-fill);
    box-shadow: var(--shadow-lift);
    color: var(--ink);
    text-align: left;
  }

  .card::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: var(--flag);
    background: var(--tone);
  }

  .head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 0;
    color: var(--ink-2);
    font-size: var(--fs-sm);
    line-height: 1.3;
  }

  /* The dot between two parts ends the first, so a line that wraps never starts with one. */
  .head > :not(:last-child)::after {
    content: "·";
    margin: 0 7px;
    color: var(--muted);
  }

  .when {
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }

  .subject {
    display: block;
    margin-top: var(--sp-1);
    font-size: var(--fs-md);
    font-weight: var(--fw-strong);
    line-height: 1.35;
    text-wrap: pretty;
  }

  :is(.what, .rec) {
    max-width: 72ch;
    margin-top: 2px;
    font-size: var(--fs-md);
    line-height: 1.45;
  }

  .what {
    color: var(--ink-2);
  }

  @media (max-width: 760px) {
    .card {
      padding: var(--sp-3) var(--sp-4) var(--sp-3) calc(var(--flag) + var(--sp-3));
    }
  }
</style>
