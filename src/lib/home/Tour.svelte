<script>
  // The front page's second screen: why namp, and what you gain, each shown on the part of a topic's canvas page
  // that does it. The gains are a tablist beside the whole page, the tour's screenshot with its sidebar cut away.
  // Choosing one traces its outline round that part, dims the rest as namp dims a page under its drawer, sets
  // namp's working light going round it and brings the part's rows in as namp's rows arrive. While the section is
  // in view it moves to the next gain every 4 seconds, waiting while the pointer rests on the gains, until the
  // visitor's first click or focus on one, and never for a browser asking for reduced motion. Below 64rem each
  // gain stands over its own cut of the app, its outline traced as it scrolls into view. The screenshots'
  // addresses by theme are the page's --tour and --tour-phone-* (+page.svelte), their places in places.js.
  import { onMount } from "svelte";
  import { PHONE, tour, WIDE } from "./places.js";

  /** @type {{ alt: string, shots: Record<string, { wide: { src: string, width: number, height: number } }>, call?: import("svelte").Snippet }} */
  let { alt, shots, call } = $props();

  // Each gain on its places, the page's parts in the shot's px: a gain's parts (boxes), the rows in them that
  // arrive (rows), its cut for the narrow layout (cut), and the corner of its first part its number takes.
  const gains = [
    {
      term: "One thing at a time",
      text: "Each ask marked where it's asked, and the canvas bar steps you through them.",
      place: "the asks' marks in the gutter and the canvas bar",
      ...tour.gains.asks,
    },
    {
      term: "Good practice, built in",
      text: "A goal with criteria you check, its work split across sibling sessions.",
      place: "the lane's Goal and Work",
      ...tour.gains.lane,
    },
    {
      term: "Back in, in seconds",
      text: "Who did what today, and what was done and decided since you left.",
      place: "Timeline, and Since you were here",
      ...tour.gains.timeline,
    },
    {
      term: "Your machines, your work",
      text: "No namp service in between. Nothing leaves unless you choose.",
      place: "the whole page, which namp serves on your machine",
      ...tour.gains.page,
    },
  ];

  // The frame: the shot from past the sidebar.
  const X = tour.from;
  const W = WIDE.w - X;
  const H = WIDE.h;
  const EVERY = 4000;

  let sel = $state(0);
  // Whether the tour still moves on by itself: until the visitor's first click or focus on a gain.
  let auto = $state(true);
  // Whether the pointer rests on the gains: the tour waits, a cursor crossing them on its way to the call
  // leaving it moving.
  let over = false;
  let seen = false;
  let still = false;
  /** @type {ReturnType<typeof setInterval> | undefined} */
  let timer;
  let said = $state("");
  /** @type {HTMLElement | undefined} */
  let root = $state();
  /** @type {HTMLElement[]} */
  const tabs = $state([]);

  // A place of the shot, in the frame, in its px.
  /** @param {number[]} b */
  const frame = ([x, y, w, h]) => [x - X, y, w, h];
  // A position in the frame, in % of it.
  /** @param {number[]} b */
  const at = (b) => {
    const [x, y, w, h] = frame(b);
    return `left:${(x / W) * 100}%;top:${(y / H) * 100}%;width:${(w / W) * 100}%;height:${(h / H) * 100}%`;
  };
  // A row of the page over itself: the tour's shot, sized and placed so the box shows that row.
  /** @param {number[]} b */
  const row = ([x, y, w, h]) =>
    `${at([x, y, w, h])};--size:${(WIDE.w / w) * 100}% auto;--pos:${(x / (WIDE.w - w)) * 100}% ${(y / (WIDE.h - h)) * 100}%`;
  // A cut for the narrow layout, of the tour's wide shot or of a phone shot (shot), in its CSS px (its file is 2x
  // or 3x, sized by %). A phone shot's cut is never wider than the phone it was shot on.
  /** @param {{ shot?: string, x: number, y: number, w: number, h: number }} c */
  function cut({ shot, x, y, w, h }) {
    const of = shot ? PHONE : WIDE;
    const pos = (/** @type {number} */ o, /** @type {number} */ s, /** @type {number} */ d) => (s === d ? 0 : (o / (s - d)) * 100);
    return `aspect-ratio:${w}/${h};background-image:var(--tour${shot ? `-${shot}` : ""});background-size:${(of.w / w) * 100}% auto;background-position:${pos(x, of.w, w)}% ${pos(y, of.h, h)}%${shot ? `;max-width:${w}px` : ""}`;
  }

  /** @param {number} i @param {boolean} [told] */
  function pick(i, told = false) {
    sel = (i + gains.length) % gains.length;
    if (told) said = `On the canvas page: ${gains[sel].place}.`;
  }

  // Moves on by itself while in view, the tour not taken in hand nor waiting on the pointer, a full 4 seconds
  // after it last started.
  function run() {
    clearInterval(timer);
    if (seen && auto && !over && !still) timer = setInterval(() => pick(sel + 1), EVERY);
  }

  // The visitor took the tour in hand: it stops moving by itself, for good.
  function hold() {
    auto = false;
    run();
  }

  /** @param {boolean} on */
  function rest(on) {
    over = on;
    run();
  }

  /** @param {KeyboardEvent} e */
  function keys(e) {
    const to = { ArrowDown: sel + 1, ArrowRight: sel + 1, ArrowUp: sel - 1, ArrowLeft: sel - 1, Home: 0, End: gains.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    hold();
    pick(to, true);
    tabs[sel]?.focus();
  }

  onMount(() => {
    still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const view = new IntersectionObserver(
      ([e]) => {
        seen = e.isIntersecting;
        run();
      },
      { threshold: 0.4 },
    );
    view.observe(/** @type {HTMLElement} */ (root));
    // The narrow layout's cuts trace their outline as they come into view, once.
    const cuts = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) (e.target.classList.add("seen"), cuts.unobserve(e.target));
      },
      { threshold: 0.5 },
    );
    for (const c of root?.querySelectorAll(".cut") ?? []) cuts.observe(c);
    return () => {
      clearInterval(timer);
      view.disconnect();
      cuts.disconnect();
    };
  });
</script>

<section class="tour grid" bind:this={root} aria-labelledby="why">
  <div class="side">
    <h2 id="why">Agents work in parallel. You don't.</h2>
    <p class="cost">Run a few agent sessions at once and you become their relay, approving work you've lost track of.</p>

    <!-- The gains as tabs, each showing its part of the canvas page beside them. -->
    <div class="gains" role="tablist" aria-label="What you gain" aria-orientation="vertical" tabindex="-1" onpointerenter={() => rest(true)} onpointerleave={() => rest(false)} onfocusin={hold}>
      {#each gains as gain, i (gain.term)}
        <button
          type="button"
          role="tab"
          class="gain"
          id="gain-{i}"
          aria-selected={sel === i}
          aria-controls="canvas-page"
          tabindex={sel === i ? 0 : -1}
          bind:this={tabs[i]}
          onclick={() => (hold(), pick(i, true))}
          onkeydown={keys}
        >
          <span class="nb">{i + 1}</span>
          <span class="term">{gain.term}</span>
          <span class="text">{gain.text}</span>
        </button>
      {/each}
    </div>
    <p class="said" aria-live="polite">{said}</p>

    <!-- Below 64rem: each gain over its own cut of the app. -->
    <ol class="list">
      {#each gains as gain, i (gain.term)}
        <li>
          <span class="nb">{i + 1}</span>
          <h3 class="term">{gain.term}</h3>
          <p class="text">{gain.text}</p>
          <div class="cut" style={cut(gain.cut)} aria-hidden="true">
            <svg><rect width="100%" height="100%" rx="8" pathLength="1" /></svg>
            {#if i === gains.length - 1}<span class="where on">localhost:4321</span>{/if}
          </div>
        </li>
      {/each}
    </ol>

    {@render call?.()}
  </div>

  <div class="over" id="canvas-page" role="tabpanel" style:--x={X} style:--fw={W} style:--fh={H} style:--sw={WIDE.w} aria-labelledby="gain-{sel}">
    <figure class="frame">
      {#each Object.entries(shots) as [name, shot] (name)}
        <picture class="for-{name}">
          <img src={shot.wide.src} width={shot.wide.width} height={shot.wide.height} {alt} loading="lazy" />
        </picture>
      {/each}
    </figure>
    <svg class="marks" viewBox="0 0 {W} {H}" aria-hidden="true">
      {#each gains as gain, i (gain.term)}
        {@const boxes = gain.boxes.map(frame)}
        {#if boxes[0][2] < W}<path class="veil" class:on={sel === i} d="M0 0H{W}V{H}H0Z {boxes.map(([x, y, w, h]) => `M${x} ${y}v${h}h${w}v${-h}Z`).join(' ')}" />{/if}
        <g class="mark" class:on={sel === i}>
          {#each boxes as [x, y, w, h], n (n)}<rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} rx="8" pathLength="1" />{/each}
        </g>
      {/each}
    </svg>
    {#key sel}
      <div class="rows" aria-hidden="true">
        {#each gains[sel].rows as r, n (n)}<span class="row" style="{row(r)};--n:{n}"></span>{/each}
        {#each gains[sel].boxes as b, n (n)}<span class="glow" style={at(b)}></span>{/each}
      </div>
    {/key}
    {#each gains as gain, i (gain.term)}
      {@const [x, y, , h] = frame(gain.boxes[0])}
      <span class="badge nb" class:on={sel === i} style="left:{(x / W) * 100}%;top:{((gain.corner === "bottom" ? y + h : y) / H) * 100}%" aria-hidden="true">{i + 1}</span>
    {/each}
    <span class="where" class:on={sel === gains.length - 1} aria-hidden="true">localhost:4321</span>
  </div>
</section>

<style>
  /* A full screen at least, its two columns centred in it: the words and the call in columns 1 to 5, the page
     from column 6 as tall as the screen lets it be. */
  .tour {
    align-items: center;
    min-height: 100svh;
    padding-block: clamp(var(--sp-10), 7svh, 80px);
  }

  .side {
    grid-column: 1 / 6;
  }

  h2 {
    margin: 0 0 var(--sp-4);
    font: var(--fw-strong) var(--fs-section) / 0.95 var(--cond);
    letter-spacing: -0.02em;
    text-wrap: balance;
  }

  .cost {
    max-width: 44ch;
    margin: 0 0 var(--sp-6);
    color: var(--ink-2);
    font-size: var(--fs-lg);
    line-height: 1.45;
    text-wrap: pretty;
  }

  /* The gains, namp's choices: a ring with the number, the chosen one filled, between hairlines. */
  .gains {
    display: grid;
    margin: 0 0 var(--sp-6);
    border-top: 1px solid var(--line);
  }

  .gain {
    display: grid;
    grid-template-columns: 22px minmax(0, 1fr);
    column-gap: var(--sp-3);
    row-gap: 2px;
    align-items: baseline;
    padding: clamp(var(--sp-2), 1.3svh, var(--sp-3)) var(--sp-3);
    border: 0;
    border-bottom: 1px solid var(--line);
    border-radius: 0;
    background: none;
    color: var(--ink);
    text-align: left;
  }

  .gain:hover {
    background: var(--hover);
  }

  .gain[aria-selected="true"] {
    background: var(--surface);
  }

  .nb {
    display: inline-grid;
    place-items: center;
    align-self: center;
    width: 22px;
    height: 22px;
    border-radius: var(--r-round);
    box-shadow: inset 0 0 0 1.5px var(--line-strong);
    color: var(--muted);
    font: var(--fw-strong) var(--fs-xs) / 1 var(--cond);
  }

  .gain[aria-selected="true"] .nb {
    background: var(--accent);
    box-shadow: none;
    color: var(--on-accent);
  }

  .term {
    margin: 0;
    font: var(--fw-strong) var(--fs-xl) / 1.2 var(--cond);
  }

  .text {
    grid-column: 2;
    margin: 0;
    color: var(--muted);
    font-size: var(--fs-md);
    line-height: 1.45;
    text-wrap: pretty;
  }

  .said {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  /* The canvas page: the screenshot from past its sidebar (--x), --fw by --fh of its px, as tall as the screen's
     padding leaves, on the ground's hairline and corners. */
  .over {
    grid-column: 6 / -1;
    justify-self: end;
    position: relative;
    width: min(100%, (100svh - 2 * clamp(var(--sp-10), 7svh, 80px)) * var(--fw) / var(--fh));
    aspect-ratio: var(--fw) / var(--fh);
  }

  .frame {
    height: 100%;
    margin: 0;
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: var(--r-md);
  }

  .frame img {
    display: block;
    width: calc(100% * var(--sw) / var(--fw));
    max-width: none;
    height: auto;
    margin-left: calc(-100% * var(--x) / var(--fw));
  }

  .marks,
  .rows {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  /* The rest of the app dims as namp's page does under its drawer. */
  .veil {
    fill: var(--dim);
    fill-rule: evenodd;
    opacity: 0;
    transition: opacity 240ms var(--ease-out);
  }

  .veil.on {
    opacity: var(--veil, 1);
  }

  /* The chosen part's outline, traced along its path; leaving, it fades, then is undrawn unseen. */
  .mark {
    fill: none;
    stroke: var(--accent);
    /* In the shot's own px, its frame as wide as the screen lets it be: about 2.5px on the page. */
    stroke-width: 3;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    opacity: 0;
    transition: opacity 240ms var(--ease-out), stroke-dashoffset 0s 240ms;
  }

  .mark.on {
    stroke-dashoffset: 0;
    opacity: 1;
    transition: stroke-dashoffset 600ms var(--ease-out);
  }

  /* The part's rows, arriving one after another as namp's do, as the outline is traced: each row stays as it
     is until its turn, then clears to the ground and comes in over it. */
  .row {
    position: absolute;
    overflow: hidden;
    animation: clear 0s calc(var(--n) * 90ms) forwards;
  }

  .row::after {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--tour) var(--pos) / var(--size) no-repeat;
    animation: arrive-row 520ms var(--ease-out) calc(var(--n) * 90ms) both;
  }

  @keyframes clear {
    to {
      background-color: var(--bg);
    }
  }

  @keyframes arrive-row {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
  }

  /* Once round, the outline carries namp's working light, on the line itself: its light going round it, in
     the accent, as namp lights what a session works on (ui/src/app.css, work-turn). None under reduced motion. */
  @property --work-turn {
    syntax: "<angle>";
    inherits: false;
    initial-value: 0deg;
  }

  .glow {
    position: absolute;
  }

  .glow::after {
    content: "";
    position: absolute;
    inset: 0;
    padding: 2.5px;
    border-radius: var(--r-md);
    background: conic-gradient(from var(--work-turn), var(--accent), var(--accent-line), transparent 40%, var(--accent));
    mask:
      linear-gradient(var(--mask) 0 0) content-box exclude,
      linear-gradient(var(--mask) 0 0);
    animation:
      work-turn 2.4s linear infinite,
      arrive-glow 400ms var(--ease-out) 600ms both;
  }

  @keyframes work-turn {
    to {
      --work-turn: 360deg;
    }
  }

  @keyframes arrive-glow {
    from {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .glow {
      display: none;
    }
  }

  /* Each part's number at its corner, the chosen one's filled. */
  .badge {
    position: absolute;
    translate: -50% -50%;
    background: var(--bg);
  }

  .badge.on {
    background: var(--accent);
    box-shadow: none;
    color: var(--on-accent);
  }

  /* The page's address on your machine, where namp serves it, tagged at the middle of the frame's top edge, where a browser shows it. */
  .where {
    position: absolute;
    top: 0;
    left: 50%;
    translate: -50% -50%;
    padding: 2px var(--sp-2);
    border: 1px solid var(--accent-line);
    border-radius: var(--r-xs);
    background: var(--bg);
    color: var(--accent-ink);
    font: var(--fw-medium) var(--fs-sm) / 1.5 var(--cond);
    opacity: 0;
    transition: opacity 240ms var(--ease-out);
  }

  .where.on {
    opacity: 1;
    transition-delay: 400ms;
  }

  /* The narrow layout's list, hidden beside the page. */
  .list {
    display: none;
  }

  @media (max-width: 63.99rem) {
    .tour {
      min-height: 0;
      padding-block: var(--sp-12);
      border-top: 1px solid var(--line);
    }

    .side {
      grid-column: 1 / -1;
    }

    .gains,
    .over {
      display: none;
    }

    .list {
      display: grid;
      gap: var(--sp-8);
      margin: 0 0 var(--sp-10);
      padding: 0;
      list-style: none;
    }

    .list li {
      display: grid;
      grid-template-columns: 22px minmax(0, 1fr);
      column-gap: var(--sp-3);
      row-gap: var(--sp-1);
      align-items: baseline;
    }

    .list .cut {
      grid-column: 1 / -1;
      position: relative;
      max-width: 40rem;
      margin-top: var(--sp-3);
      border: 1px solid var(--line);
      border-radius: var(--r-md);
      background-repeat: no-repeat;
    }

    .cut svg {
      position: absolute;
      inset: -1px;
      width: calc(100% + 2px);
      height: calc(100% + 2px);
      overflow: visible;
    }

    .cut rect {
      fill: none;
      stroke: var(--accent);
      stroke-width: 2.5px;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
    }

    .cut:global(.seen) rect {
      stroke-dashoffset: 0;
      transition: stroke-dashoffset 600ms var(--ease-out);
    }
  }
</style>
