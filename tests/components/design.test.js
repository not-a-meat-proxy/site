// DESIGN.md's frontmatter carries src/app.css's tokens by their roles, which impeccable reads: each colour of
// Dark under its role and of Light as <role>-light, the radii, the spacing steps and the faces, kept equal
// both ways, so neither file drifts from the other.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { parse } from "yaml";

const ROOT = resolve(import.meta.dirname, "../..");
const css = readFileSync(resolve(ROOT, "src/app.css"), "utf8");
const md = readFileSync(resolve(ROOT, "DESIGN.md"), "utf8");
const design = parse(md.match(/^---\n([\s\S]*?)\n---\n/)[1]);

// The custom properties a block of app.css declares, the first with its selector from a place in the file.
function block(selector, from = 0) {
  const at = css.indexOf(`${selector} {`, from);
  if (at < 0) throw new Error(`app.css has no ${selector} block`);
  return Object.fromEntries([...css.slice(at, css.indexOf("}", at)).matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}

// The tokens that hold in both themes, then the palettes: Dark, the :root under its heading, and Light.
const constants = block(":root");
const dark = block(":root", css.indexOf("Dark, the default"));
const light = block(':root[data-theme="light"]');

// The colours of a block, its shadows apart: a shadow is no colour token of the frontmatter.
const colours = (vars) => Object.fromEntries(Object.entries(vars).filter(([k, v]) => /^(#|rgba?\()/.test(v) && !k.startsWith("shadow")));

describe("DESIGN.md's frontmatter", () => {
  test("holds every colour of Dark under its role, and no other", () => {
    const want = colours(dark);
    const have = Object.fromEntries(Object.entries(design.colors).filter(([k]) => !k.endsWith("-light")));
    expect(have).toEqual(want);
  });

  test("holds every colour of Light as <role>-light, and no other", () => {
    const want = Object.fromEntries(Object.entries(colours(light)).map(([k, v]) => [`${k}-light`, v]));
    const have = Object.fromEntries(Object.entries(design.colors).filter(([k]) => k.endsWith("-light")));
    expect(have).toEqual(want);
  });

  test("holds the radii and the spacing steps app.css declares", () => {
    for (const [k, v] of Object.entries(design.rounded)) {
      const value = constants[`r-${k}`];
      expect(value, `--r-${k}`).toBeDefined();
      expect(value.startsWith("var(") ? constants[value.slice(6, -1)] : value).toBe(String(v));
    }
    for (const [k, v] of Object.entries(design.spacing)) expect(constants[`sp-${k}`], `--sp-${k}`).toBe(v);
  });

  test("names the faces and sizes app.css declares", () => {
    const faces = [constants.font, constants.cond, constants.mono];
    const sizes = Object.entries(constants).filter(([k]) => k.startsWith("fs-")).map(([, v]) => v);
    for (const [role, type] of Object.entries(design.typography)) {
      expect(faces, role).toContain(type.fontFamily);
      expect(sizes, role).toContain(type.fontSize);
    }
  });

  test("references only tokens it holds", () => {
    for (const [name, props] of Object.entries(design.components)) {
      for (const value of Object.values(props)) {
        const ref = String(value).match(/^\{(\w+)\.([\w-]+)\}$/);
        if (ref) expect(design[ref[1]]?.[ref[2]], `${name}: ${value}`).toBeDefined();
      }
    }
  });
});
