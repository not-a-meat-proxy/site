// A release's notes images on the front page, as +page.svelte's <style> lays them: any image the notes bring
// stands within the column and the screen, a phone's shot at a phone's size, and images stand apart, a run of
// them further still from what follows. happy-dom lays nothing out, so this reads the rules themselves.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "../../src/routes/+page.svelte"), "utf8").split("<style>")[1];
/** @param {string} sel */
const rule = (sel) => css.match(new RegExp(`\\n\\s*${sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`))?.[1] ?? "";
const steps = { "--sp-3": 12, "--sp-6": 24, "--sp-10": 40 };
/** @param {string} decls */
const top = (decls) => steps[decls.match(/margin(?:-top)?: var\((--sp-\d+)\)/)?.[1]];

describe("a notes image", () => {
  test("is the column's width at most and 80% of the screen's height, its width following its height", () => {
    const img = rule(".notes :global(img)");
    expect(img).toMatch(/max-width: 100%;/);
    expect(img).toMatch(/max-height: 80svh;/);
    expect(img).toMatch(/width: auto;/);
    expect(img).toMatch(/height: auto;/);
  });

  test("stands further from the next image than a paragraph's lines, and a run further still from what follows", () => {
    const apart = top(rule(".notes :global(p:has(> img:only-child))"));
    const after = top(rule(".notes :global(p:has(> img:only-child) + :not(p:has(> img:only-child)))"));
    expect(apart).toBeGreaterThan(steps["--sp-3"]);
    expect(after).toBeGreaterThan(apart);
  });
});
