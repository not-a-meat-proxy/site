<script>
  // Dark or Light, one click: its icon says what a click gives, a sun in Dark and a moon in Light. The
  // server does not know the theme, so both icons are drawn and [data-theme] shows one (app.css's
  // .for-dark and .for-light): nothing changes on the page once it hydrates but the label.
  import { onMount } from "svelte";
  import { follow, theme, toggle } from "#lib/theme.svelte.js";

  let { class: place = "" } = $props();

  let label = $derived(theme.shown ? `Switch to ${theme.shown === "light" ? "Dark" : "Light"}` : "Switch to Dark or Light");

  onMount(follow);
</script>

<button type="button" class="theme {place}" onclick={toggle} aria-label={label} title={label}>
  <svg class="for-dark" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
  <svg class="for-light" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
</button>

<style>
  /* A small icon button, as GitHub's mark beside it: no edge, the mark at the size of the text around it,
     in a target large enough for a thumb. */
  .theme {
    display: inline-flex;
    padding: var(--sp-2);
    border: 0;
    border-radius: var(--r-sm);
    background: none;
    color: var(--ink-2);
  }

  .theme:hover {
    background: var(--hover);
    color: var(--ink);
  }

  svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
