// The front page's second screen: the gains as tabs, each showing its part of namp's Overview, moving on by
// themselves every 4 seconds while the screen is in view, until the visitor takes them in hand, and never for a
// browser asking for reduced motion.
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { tick } from "svelte";
import Tour from "../../src/lib/home/Tour.svelte";

const shots = {
  dark: { wide: { src: "/shots/hero-wide-dark.webp", width: 1600, height: 1000 } },
  light: { wide: { src: "/shots/hero-wide-light.webp", width: 1600, height: 1000 } },
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
  test("are tabs, numbered, the first chosen and alone in the tab order, each controlling the Overview", () => {
    render(Tour, { alt: "namp's Overview", shots });
    expect(document.querySelector("[role=tablist]").getAttribute("aria-orientation")).toBe("vertical");
    expect(tabs().map((t) => [t.querySelector(".term").textContent, t.querySelector(".nb").textContent, t.tabIndex, t.getAttribute("aria-controls")])).toEqual([
      ["One thing at a time", "1", 0, "overview"],
      ["Back in, in seconds", "2", -1, "overview"],
      ["Good practice, built in", "3", -1, "overview"],
      ["Your machines, your work", "4", -1, "overview"],
    ]);
    expect(document.getElementById("overview").getAttribute("role")).toBe("tabpanel");
    expect(document.getElementById("overview").getAttribute("aria-labelledby")).toBe("gain-0");
  });

  test("a click chooses one, outlines its part and says so politely", async () => {
    render(Tour, { alt: "namp's Overview", shots });
    await fireEvent.click(tabs()[2]);
    expect(chosen()).toBe(2);
    expect(document.querySelectorAll(".mark.on")).toHaveLength(1);
    expect([...document.querySelectorAll(".mark")].indexOf(document.querySelector(".mark.on"))).toBe(2);
    expect(document.getElementById("overview").getAttribute("aria-labelledby")).toBe("gain-2");
    const said = document.querySelector(".tour .said");
    expect(said.getAttribute("aria-live")).toBe("polite");
    expect(said.textContent).toBe("On the Overview: the topic's goal, plan and squad.");
  });

  test("the arrow keys, Home and End move the choice and the focus, round the ends", async () => {
    render(Tour, { alt: "namp's Overview", shots });
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

  test("your machines, with no part of its own, marks the whole Overview and its address on your machine", async () => {
    render(Tour, { alt: "namp's Overview", shots });
    await fireEvent.click(tabs()[3]);
    expect(document.querySelector(".where.on").textContent).toBe("localhost:4321");
    expect(document.querySelector(".mark.on").getAttribute("width")).toBe(String(1288 - 2));
  });
});

describe("the tour moving on by itself", () => {
  test("moves to the next gain every 4 seconds, only while in view", async () => {
    render(Tour, { alt: "namp's Overview", shots });
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
    render(Tour, { alt: "namp's Overview", shots });
    inView();
    vi.advanceTimersByTime(4000);
    await tick();
    expect(document.querySelector(".tour .said").textContent).toBe("");
  });

  test("waits while the pointer rests on the gains, and moves on a full 4 seconds after it leaves", async () => {
    render(Tour, { alt: "namp's Overview", shots });
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
    render(Tour, { alt: "namp's Overview", shots });
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
    render(Tour, { alt: "namp's Overview", shots });
    inView();
    vi.advanceTimersByTime(12000);
    await tick();
    expect(chosen()).toBe(0);
    await fireEvent.click(tabs()[1]);
    expect(chosen()).toBe(1);
  });
});

describe("on a narrow screen", () => {
  test("each gain stands over its own cut of the app, your machines over the whole Overview at its address, its outline traced as it comes into view", async () => {
    render(Tour, { alt: "namp's Overview", shots });
    const items = [...document.querySelectorAll(".list li")];
    expect(items.map((li) => [li.querySelector(".term").textContent, Boolean(li.querySelector(".cut"))])).toEqual([
      ["One thing at a time", true],
      ["Back in, in seconds", true],
      ["Good practice, built in", true],
      ["Your machines, your work", true],
    ]);
    expect(items[3].querySelector(".cut .where").textContent).toBe("localhost:4321");
    const cut = items[1].querySelector(".cut");
    expect(cut.getAttribute("style")).toContain("var(--wide)");
    expect(items[0].querySelector(".cut").getAttribute("style")).toContain("var(--phone)");
    seen[1]([{ isIntersecting: true, target: cut }]);
    expect(cut.classList.contains("seen")).toBe(true);
  });
});
