<script>
  // namp's signs, as its ui/src/lib/StateSign.svelte draws them, 14px, each its own shape so none rests on
  // colour alone: a turning arc for work, a question mark for what waits for you, a check for done, and a
  // goal's ring (namp's Ring.svelte), open. Words beside a sign say what it means; the sign is not read.
  /** @type {{ kind: "work" | "ask" | "done" | "goal" }} */
  let { kind } = $props();
</script>

<span class="sign" data-sign={kind} aria-hidden="true"
  >{#if kind === "work"}<svg viewBox="0 0 14 14" class="work"><circle class="arc-track" cx="7" cy="7" r="5" /><path class="arc" d="M7 2a5 5 0 0 1 5 5" /></svg
  >{:else if kind === "ask"}<svg viewBox="0 0 14 14"><circle cx="7" cy="7" r="6.5" fill="var(--ask)" /><path d="M5.3 5.4a1.8 1.8 0 1 1 2.4 1.7c-.5.2-.7.5-.7 1v.3" stroke="var(--on-accent)" stroke-width="1.5" fill="none" stroke-linecap="round" /><circle cx="7" cy="10.4" r=".9" fill="var(--on-accent)" /></svg
  >{:else if kind === "done"}<svg viewBox="0 0 14 14"><path d="m2.8 7.4 2.7 2.7 5.7-6" stroke="var(--ok)" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round" /></svg
  >{:else}<svg viewBox="0 0 16 16" class="goal"><circle cx="8" cy="8" r="6" /></svg>{/if}</span
>

<style>
  .sign {
    display: inline-grid;
    flex: none;
    place-items: center;
    width: 14px;
    height: 14px;
  }

  svg {
    display: block;
    width: 14px;
    height: 14px;
  }

  .work {
    fill: none;
    stroke-width: 2;
    animation: spin 0.9s linear infinite;
  }

  .arc-track {
    stroke: var(--line-strong);
  }

  .arc {
    stroke: var(--accent);
    stroke-linecap: round;
  }

  .goal {
    fill: none;
    stroke: var(--ink-2);
    stroke-width: 1.5;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
