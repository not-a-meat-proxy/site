<script>
  // The invite address, for a visitor with no mail app to take the mailto: a chip that copies it.
  // Server-rendered, and with JS off, it's the plain address, there to select.
  import { onMount, tick } from "svelte";
  import { copyText } from "./clipboard.js";

  let { address } = $props();

  let ready = $state(false);
  let copied = $state(false);
  let failed = $state(false);
  let plain = $state();

  onMount(() => (ready = true));

  async function copy() {
    if (await copyText(address)) {
      copied = true;
      setTimeout(() => (copied = false), 2000);
      return;
    }
    // No clipboard at all: the plain address comes back, selected, for the visitor to copy.
    failed = true;
    await tick();
    getSelection().selectAllChildren(plain);
  }
</script>

{#if ready && !failed}
  <button type="button" class="chip" class:copied onclick={copy} aria-label="Copy {address}">
    <span>{address}</span>
    {#if copied}
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" /></svg>
    {:else}
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
        <path d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" />
      </svg>
    {/if}
  </button>
  <span class="done" aria-live="polite">{copied ? "Copied" : ""}</span>
{:else}
  <span class="chip plain" bind:this={plain}>{address}</span>
{/if}

<style>
  /* The same box with or without JS, so nothing moves when it arrives. */
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.2rem 0.55rem 0.2rem 0.65rem;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--paper);
    color: var(--ink);
    font: 500 0.95rem/1.5 var(--sans);
  }

  .plain {
    user-select: all;
  }

  button {
    cursor: pointer;
  }

  button:hover {
    border-color: var(--teal);
    background: #fff;
  }

  svg {
    width: 1rem;
    height: 1rem;
    fill: none;
    stroke: var(--teal);
    stroke-width: 1.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .copied svg {
    stroke-width: 1.8;
  }

  .done {
    color: var(--teal-deep);
    font-size: 0.875rem;
  }
</style>
