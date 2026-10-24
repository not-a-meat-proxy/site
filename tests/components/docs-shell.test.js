// The docs' shell on a phone and from the keyboard: the six pages open in namp's drawer, Esc closes it and
// the focus goes back to the menu; [ and ] step to the page before and the one after, as namp's [ and ]
// step its views, but never from a text field, with Ctrl or Cmd held or with the menu open.
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { createRawSnippet, tick } from "svelte";

const { goto, at } = vi.hoisted(() => ({ goto: vi.fn(), at: { url: new URL("http://site.test/docs/install") } }));
vi.mock("$app/navigation", () => ({ goto, afterNavigate: () => {} }));
vi.mock("$app/state", () => ({ page: at }));

const { default: Docs } = await import("../../src/routes/docs/+layout.svelte");

const pages = [
  { path: "/docs", title: "Overview", sections: [] },
  { path: "/docs/install", title: "Install namp", sections: [] },
  { path: "/docs/update", title: "Update namp", sections: [] },
];
const children = createRawSnippet(() => ({ render: () => `<article><input aria-label="A field" /></article>` }));

beforeEach(() => {
  at.url = new URL("http://site.test/docs/install");
  goto.mockClear();
});
afterEach(cleanup);

async function docs() {
  render(Docs, { data: { pages }, children });
  await tick();
}

async function openMenu() {
  document.querySelector(".menu").click();
  await tick();
}

const press = (key, init = {}, target = window) => fireEvent.keyDown(target, { key, bubbles: true, ...init });

describe("the phone's menu", () => {
  test("opens the pages in the drawer, the open page focused", async () => {
    await docs();
    const drawer = document.querySelector("dialog.drawer");
    expect(drawer.open).toBe(false);
    expect(drawer.querySelector(".pages")).toBeNull();
    await openMenu();
    expect(drawer.open).toBe(true);
    expect([...drawer.querySelectorAll(".pages a")].map((a) => a.textContent)).toEqual(["Overview", "Install namp", "Update namp"]);
    expect(document.activeElement).toBe(drawer.querySelector('a[aria-current="page"]'));
  });

  test("closes on Esc, the focus back on the menu", async () => {
    await docs();
    const menu = document.querySelector(".menu");
    menu.focus();
    await openMenu();
    const drawer = document.querySelector("dialog.drawer");
    await press("Escape", {}, drawer.querySelector("a"));
    expect(drawer.open).toBe(false);
    expect(document.activeElement).toBe(menu);
  });

  test("closes from its close button and from its scrim", async () => {
    await docs();
    const drawer = document.querySelector("dialog.drawer");
    await openMenu();
    drawer.querySelector('[aria-label="Close the menu"]').click();
    expect(drawer.open).toBe(false);
    await openMenu();
    drawer.querySelector(".inside").click();
    expect(drawer.open).toBe(true);
    drawer.click();
    expect(drawer.open).toBe(false);
  });
});

describe("[ and ]", () => {
  test("step to the page before and the one after", async () => {
    await docs();
    await press("]");
    expect(goto).toHaveBeenLastCalledWith("/docs/update");
    await press("[");
    expect(goto).toHaveBeenLastCalledWith("/docs");
  });

  test("stop at the first page and the last, as Previous and Next do", async () => {
    at.url = new URL("http://site.test/docs");
    await docs();
    await press("[");
    expect(goto).not.toHaveBeenCalled();
    cleanup();
    at.url = new URL("http://site.test/docs/update");
    await docs();
    await press("]");
    expect(goto).not.toHaveBeenCalled();
  });

  test("step when typed with Option, as a French Mac types them", async () => {
    await docs();
    await press("]", { altKey: true });
    expect(goto).toHaveBeenLastCalledWith("/docs/update");
  });

  test("do nothing from a text field, with Ctrl or Cmd held, or with the menu open", async () => {
    await docs();
    await press("]", {}, document.querySelector("input"));
    await press("]", { ctrlKey: true });
    await press("]", { metaKey: true });
    await openMenu();
    await press("]");
    expect(goto).not.toHaveBeenCalled();
  });
});
