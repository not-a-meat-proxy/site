// The front page's second screen: the gains as tabs, each showing its part of a topic's canvas page, moving on by
// themselves every 4 seconds while the screen is in view, until the visitor takes them in hand, and never for a
// browser asking for reduced motion.
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { tick } from "svelte";
import Tour from "../../src/lib/home/Tour.svelte";

const shots = {
  dark: { wide: { src: "/shots/tour-dark.webp", width: 1600, height: 1000 } },
  light: { wide: { src: "/shots/tour-light.webp", width: 1600, height: 1000 } },
};

/** @type {((entries: { isIntersecting: boolean, target: Element }[]) => void)[]} */
let seen;
let still;

beforeEach(() => {
  seen = [];
  still = false;
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", (q) => ({ matches: still && q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb) {
        seen.push(cb);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const tabs = () => [...document.querySelectorAll("[role=tab]")];
const chosen = () => tabs().findIndex((t) => t.getAttribute("aria-selected") === "true");
// The section scrolls into view: the first observer is the section's.
const inView = (yes = true) => seen[0]([{ isIntersecting: yes, target: document.querySelector(".tour") }]);

describe("the gains", () => {
  test("are tabs, numbered, the first chosen and alone in the tab order, each controlling the canvas page", () => {
    render(Tour, { alt: "a topic's canvas page", shots });
    expect(document.querySelector("[role=tablist]").getAttribute("aria-orientation")).toBe("vertical");
    expect(tabs().map((t) => [t.querySelector(".term").textContent, t.querySelector(".nb").textContent, t.tabIndex, t.getAttribute("aria-controls")])).toEqual([
      ["One thing at a time", "1", 0, "canvas-page"],
      ["Good practice, built in", "2", -1, "canvas-page"],
      ["Back in, in seconds", "3", -1, "canvas-page"],
      ["Your machines, your work", "4", -1, "canvas-page"],
    ]);
    expect(document.getElementById("canvas-page").getAttribute("role")).toBe("tabpanel");
    expect(document.getElementById("canvas-page").getAttribute("aria-labelledby")).toBe("gain-0");
  });

  test("a click chooses one, outlines its part and says so politely", async () => {
    render(Tour, { alt: "a topic's canvas page", shots });
    await fireEvent.click(tabs()[2]);
    expect(chosen()).toBe(2);
    expect(document.querySelectorAll(".mark.on")).toHaveLength(1);
    expect([...document.querySelectorAll(".mark")].indexOf(document.querySelector(".mark.on"))).toBe(2);
    expect(document.getElementById("canvas-page").getAttribute("aria-labelledby")).toBe("gain-2");
    const said = document.querySelector(".tour .said");
    expect(said.getAttribute("aria-live")).toBe("polite");
    expect(said.textContent).toBe("On the canvas page: Timeline, and Since you were here.");
  });

  test("the arrow keys, Home and End move the choice and the focus, round the ends", async () => {
    render(Tour, { alt: "a topic's canvas page", shots });
    tabs()[0].focus();
    await fireEvent.keyDown(tabs()[0], { key: "ArrowDown" });
    expect([chosen(), document.activeElement.id]).toEqual([1, "gain-1"]);
    await fireEvent.keyDown(tabs()[1], { key: "End" });
    expect([chosen(), document.activeElement.id]).toEqual([3, "gain-3"]);
    await fireEvent.keyDown(tabs()[3], { key: "ArrowRight" });
    expect(chosen()).toBe(0);
    await fireEvent.keyDown(tabs()[0], { key: "ArrowUp" });
    expect(chosen()).toBe(3);
    await fireEvent.keyDown(tabs()[3], { key: "Home" });
    expect([chosen(), tabs()[0].tabIndex, tabs()[3].tabIndex]).toEqual([0, 0, -1]);
  });

  test("your machines, with no part of its own, marks the whole page and its address on your machine", async () => {
    render(Tour, { alt: "a topic's canvas page", shots });
    await fireEvent.click(tabs()[3]);
    expect(document.querySelector(".where.on").textContent).toBe("localhost:4321");
    expect([...document.querySelectorAll(".mark.on rect")].map((r) => r.getAttribute("width"))).toEqual([String(1288 - 2)]);
  });
});

describe("the tour moving on by itself", () => {
  test("moves to the next gain every 4 seconds, only while in view", async () => {
    render(Tour, { alt: "a topic's canvas page", shots });
    vi.advanceTimersByTime(8000);
    await tick();
    expect(chosen()).toBe(0);
    inView();
    vi.advanceTimersByTime(4000);
    await tick();
    expect(chosen()).toBe(1);
    vi.advanceTimersByTime(4000);
    await tick();
    expect(chosen()).toBe(2);
    inView(false);
    vi.advanceTimersByTime(12000);
    await tick();
    expect(chosen()).toBe(2);
  });

  test("says nothing as it moves, so a screen reader isn't read the gains unasked", async () => {
    render(Tour, { alt: "a topic's canvas page", shots });
    inView();
    vi.advanceTimersByTime(4000);
    await tick();
    expect(document.querySelector(".tour .said").textContent).toBe("");
  });

  test("waits while the pointer rests on the gains, and moves on a full 4 seconds after it leaves", async () => {
    render(Tour, { alt: "a topic's canvas page", shots });
    inView();
    const list = document.querySelector("[role=tablist]");
    await fireEvent.pointerEnter(list);
    vi.advanceTimersByTime(12000);
    await tick();
    expect(chosen()).toBe(0);
    await fireEvent.pointerLeave(list);
    vi.advanceTimersByTime(3900);
    await tick();
    expect(chosen()).toBe(0);
    vi.advanceTimersByTime(100);
    await tick();
    expect(chosen()).toBe(1);
  });

  test.each([
    ["a focus", (list) => fireEvent.focusIn(list.querySelector("[role=tab]"))],
    ["a click", (list) => fireEvent.click(list.querySelectorAll("[role=tab]")[1])],
  ])("stops for good at the visitor's first %s on a gain", async (_, act) => {
    render(Tour, { alt: "a topic's canvas page", shots });
    inView();
    await act(document.querySelector("[role=tablist]"));
    const at = chosen();
    vi.advanceTimersByTime(12000);
    await tick();
    expect(chosen()).toBe(at);
    inView(false);
    inView();
    vi.advanceTimersByTime(12000);
    await tick();
    expect(chosen()).toBe(at);
  });

  test("never moves for a browser asking for reduced motion, where choosing still works", async () => {
    still = true;
    render(Tour, { alt: "a topic's canvas page", shots });
    inView();
    vi.advanceTimersByTime(12000);
    await tick();
    expect(chosen()).toBe(0);
    await fireEvent.click(tabs()[1]);
    expect(chosen()).toBe(1);
  });
});

describe("on a narrow screen", () => {
  test("each gain stands over its own cut of the app, your machines over the whole page at its address, its outline traced as it comes into view", async () => {
    render(Tour, { alt: "a topic's canvas page", shots });
    const items = [...document.querySelectorAll(".list li")];
    expect(items.map((li) => [li.querySelector(".term").textContent, Boolean(li.querySelector(".cut"))])).toEqual([
      ["One thing at a time", true],
      ["Good practice, built in", true],
      ["Back in, in seconds", true],
      ["Your machines, your work", true],
    ]);
    expect(items[3].querySelector(".cut .where").textContent).toBe("localhost:4321");
    const cut = items[1].querySelector(".cut");
    expect(items.map((li) => li.querySelector(".cut").getAttribute("style").match(/var\(--tour[^)]*\)/)[0])).toEqual([
      "var(--tour-phone-asks)",
      "var(--tour)",
      "var(--tour-phone-timeline)",
      "var(--tour)",
    ]);
    seen[1]([{ isIntersecting: true, target: cut }]);
    expect(cut.classList.contains("seen")).toBe(true);
  });

  test("the first cut is the phone's canvas bar over D3 and D4 with their asks' marks, the third its Timeline through Since you were here, each no wider than the phone", () => {
    render(Tour, { alt: "a topic's canvas page", shots });
    const [asks, , timeline] = [...document.querySelectorAll(".list li .cut")].map((c) => c.getAttribute("style"));
    expect(asks).toContain("aspect-ratio: 402 / 527;");
    expect(asks).toContain(`background-position: 0% ${(52 / (874 - 527)) * 100}%;`);
    expect(asks).toContain("background-size: 100% auto;");
    expect(asks).toContain("max-width: 402px;");
    expect(timeline).toContain("aspect-ratio: 402 / 465;");
    expect(timeline).toContain(`background-position: 0% ${(201 / (874 - 465)) * 100}%;`);
    expect(timeline).toContain("max-width: 402px;");
  });

  // A WebP's size from its header, whichever of its three forms it takes.
  /** @param {string} name */
  function size(name) {
    const b = readFileSync(resolve(import.meta.dirname, "../../static/shots", name));
    const kind = b.toString("ascii", 12, 16);
    if (kind === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (kind === "VP8L") return [(b.readUInt32LE(21) & 0x3fff) + 1, ((b.readUInt32LE(21) >> 14) & 0x3fff) + 1];
    return [b.readUIntLE(24, 3) + 1, b.readUIntLE(27, 3) + 1];
  }

  test.each(["dark", "light"])("the %s wide shots are at 2x, 3200 by 2000, so a cut stays sharp on a phone's screen; the page sizes them 1600 by 1000, the px their places are in", (theme) => {
    expect(size(`tour-${theme}.webp`)).toEqual([3200, 2000]);
    expect(size(`hero-wide-${theme}.webp`)).toEqual([3200, 2000]);
    expect([shots[theme].wide.width, shots[theme].wide.height]).toEqual([1600, 1000]);
  });

  test.each(["dark", "light"])("the %s phone shots are at 3x of a phone's 402 by 874, the px their cuts are in", (theme) => {
    expect(size(`tour-phone-asks-${theme}.webp`)).toEqual([1206, 2622]);
    expect(size(`tour-phone-timeline-${theme}.webp`)).toEqual([1206, 2622]);
  });
});
