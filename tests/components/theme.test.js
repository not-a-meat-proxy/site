// The theme, Dark or Light: app.html's head script picks it before the first paint, the kept choice over
// the system's setting; a button at the top of the front page and of the docs toggles it, both its icons
// drawn so CSS shows the theme's; the hero shows the theme's screenshots.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { createRawSnippet, tick } from "svelte";
import Page from "../../src/routes/+page.svelte";
import Docs from "../../src/routes/docs/+layout.svelte";
import { KEY } from "../../src/lib/theme.svelte.js";

const SRC = resolve(import.meta.dirname, "../../src");
const html = readFileSync(resolve(SRC, "app.html"), "utf8");
const css = readFileSync(resolve(SRC, "app.css"), "utf8");
const visitor = { contact: "mailto:invites@example.com", site: "https://namp.example", invalid: false, tester: null, release: null };

describe("the head script", () => {
  const head = html.slice(0, html.indexOf("</head>"));
  const script = head.match(/<script>([\s\S]*?)<\/script>/)[1];

  // The theme and color-scheme the script sets on <html>, given what localStorage holds and the system.
  function run({ kept, system, throws = false }) {
    const root = { dataset: {}, style: {} };
    runInNewContext(script, {
      document: { documentElement: root },
      localStorage: {
        getItem(key) {
          if (throws) throw new Error("SecurityError");
          return key === KEY ? (kept ?? null) : null;
        },
      },
      matchMedia: (query) => ({ matches: query === "(prefers-color-scheme: light)" && system === "light" }),
    });
    return [root.dataset.theme, root.style.colorScheme];
  }

  test("runs before any stylesheet or %sveltekit.head%", () => {
    const at = head.indexOf("<script>");
    expect(at).toBeGreaterThan(0);
    expect(head.indexOf(`rel="stylesheet"`)).toBe(-1);
    expect(at).toBeLessThan(head.indexOf("<link"));
    expect(at).toBeLessThan(head.indexOf("%sveltekit.head%"));
  });

  test("takes the kept choice over the system's setting", () => {
    expect(run({ kept: "light", system: "dark" })).toEqual(["light", "light"]);
    expect(run({ kept: "dark", system: "light" })).toEqual(["dark", "dark"]);
  });

  test("with no choice kept, follows the system's setting", () => {
    expect(run({ system: "light" })).toEqual(["light", "light"]);
    expect(run({ system: "dark" })).toEqual(["dark", "dark"]);
  });

  test("ignores a kept value that is no theme, and a localStorage that throws", () => {
    expect(run({ kept: "system", system: "light" })).toEqual(["light", "light"]);
    expect(run({ throws: true, system: "light" })).toEqual(["light", "light"]);
    expect(run({ throws: true, system: "dark" })).toEqual(["dark", "dark"]);
  });
});

describe("the palettes", () => {
  // A rule's declarations, by its selector.
  function block(selector) {
    const at = css.indexOf(`${selector} {`);
    expect(at).toBeGreaterThan(-1);
    return css.slice(at + selector.length + 2, css.indexOf("}", at)).replace(/\s+/g, " ").trim();
  }

  test("are keyed on data-theme, the system's Light only for a page with none, the same values", () => {
    const light = block(':root[data-theme="light"]');
    expect(light).toContain("color-scheme: light;");
    expect(block(":root:not([data-theme])")).toBe(light);
  });
});

describe("the theme button", () => {
  const pages = [{ path: "/docs/install", title: "Install namp", sections: [] }];
  const children = createRawSnippet(() => ({ render: () => "<h1>Install namp</h1>" }));

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "dark";
  });

  afterEach(cleanup);

  function button() {
    const buttons = [...document.querySelectorAll("button.theme")];
    expect(buttons).toHaveLength(1);
    return buttons[0];
  }

  // Both icons, the sun shown in Dark and the moon in Light by app.css.
  function icons(el) {
    return [...el.querySelectorAll("svg")].map((svg) => [svg.classList[0], svg.getAttribute("aria-hidden")]);
  }

  test("on the front page, sits beside GitHub's mark at the top, both icons drawn", async () => {
    render(Page, { data: visitor });
    await tick();
    const el = button();
    expect(el.closest(".corner").querySelector("a.github")).not.toBeNull();
    expect(icons(el)).toEqual([["for-dark", "true"], ["for-light", "true"]]);
  });

  test("on a docs page, sits in the shell's header beside GitHub's mark, both icons drawn", async () => {
    render(Docs, { data: { pages }, children });
    await tick();
    const el = button();
    expect(el.closest("header")).not.toBeNull();
    expect(el.parentElement.querySelector("a.github")).not.toBeNull();
    expect(icons(el)).toEqual([["for-dark", "true"], ["for-light", "true"]]);
  });

  test("says what a click gives, toggles the theme and keeps the choice", async () => {
    render(Page, { data: visitor });
    await tick();
    const el = button();
    expect([el.getAttribute("aria-label"), el.getAttribute("title")]).toEqual(["Switch to Light", "Switch to Light"]);

    await fireEvent.click(el);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement.style.colorScheme).toBe("light");
    expect(localStorage.getItem(KEY)).toBe("light");
    expect([el.getAttribute("aria-label"), el.getAttribute("title")]).toEqual(["Switch to Dark", "Switch to Dark"]);

    await fireEvent.click(el);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(KEY)).toBe("dark");
  });

  test("toggles still when localStorage throws", async () => {
    const setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error("QuotaExceededError");
    };
    try {
      render(Page, { data: visitor });
      await tick();
      await fireEvent.click(button());
      expect(document.documentElement.dataset.theme).toBe("light");
    } finally {
      Storage.prototype.setItem = setItem;
    }
  });
});

describe("the canvas page's screenshots", () => {
  afterEach(cleanup);

  test("on the second screen, one picture per theme, lazy so the hidden one is not fetched", async () => {
    render(Page, { data: visitor });
    await tick();
    const pictures = [...document.querySelectorAll(".tour picture")];
    expect(
      pictures.map((p) => [
        p.classList[0],
        p.querySelector("img").getAttribute("src"),
        p.querySelector("img").getAttribute("loading"),
        Boolean(p.querySelector("img").getAttribute("alt")),
      ]),
    ).toEqual([
      ["for-dark", "/shots/tour-dark.webp", "lazy", true],
      ["for-light", "/shots/tour-light.webp", "lazy", true],
    ]);
  });
});
