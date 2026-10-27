// The home page's hero, namp's drawer live over the shot of a topic's canvas page: open on Threads at Needs
// you, in the thread of the 31st question, with every word, time and count the shot shows. Picking a choice,
// by a click or by its number key, answers it: it folds out and the topic's D4 question comes up, the counts
// one less, and once both are answered the drawer shows what is left, the pull request's review.
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { tick } from "svelte";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Page from "../../src/routes/+page.svelte";
import { hero, WIDE } from "../../src/lib/home/places.js";

const visitor = { contact: "mailto:invites@example.com", site: "https://namp.example", invalid: false, tester: null, release: null };

// A browser asking for reduced motion, so a fold is done at once, with no animation to wait for.
beforeEach(() => vi.stubGlobal("matchMedia", (q) => ({ matches: q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} })));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

// A component's own rules, as its <style> writes them: happy-dom lays nothing out.
const style = (path) => readFileSync(resolve(import.meta.dirname, "../..", path), "utf8").split("<style>")[1];
/** @param {string} css @param {string} sel */
const rule = (css, sel) => css.match(new RegExp(`(?:^|\\n)\\s*${sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`))?.[1] ?? "";

const drawer = () => document.querySelector(".hero .drawer");
const text = (sel) => drawer().querySelector(sel)?.textContent.replace(/\s+/g, " ").trim();
const question = () => document.querySelector("[data-question]");
const choices = () => [...question().querySelectorAll("button.choice")];

async function page() {
  render(Page, { data: visitor });
  await tick();
}

describe("the drawer on the home page", () => {
  test("shows the shot's heads: Threads with what needs you, the filters with their counts, and says it is a demo topic", async () => {
    await page();
    expect(drawer()).not.toBeNull();
    expect(text("#threads")).toBe("Threads 3 waiting for you");
    expect([...drawer().querySelectorAll(".filter")].map((f) => f.textContent.replace(/\s+/g, " ").trim())).toEqual(["Needs you 3", "With you 6", "Sessions 3"]);
    expect(drawer().querySelector(".filter.on").textContent).toMatch(/^Needs you/);
    expect(text(".demo")).toBe("demo topic");
  });

  test("opens on the 31st question whole, as the shot has it: its sender, time, title, context, numbered choices and Recommended", async () => {
    await page();
    expect(text(".who")).toBe("Recurring invoices14:36");
    expect(text(".ag-chip")).toBe("TO");
    expect(text(".question-box .title")).toBe("When a schedule's day is the 31st, which day does it go out in a shorter month?");
    expect(text(".question-box .ctx")).toBe("A template set to the 31st has no such day in April, June, September, November and February. The first two choices keep one invoice a month.");
    expect(choices().map((b) => [b.type, b.querySelector(".num").textContent, b.querySelector(".choice-text").textContent, !!b.querySelector(".tag")])).toEqual([
      ["button", "1", "The month's last day: 30 April, 28 or 29 February", true],
      ["button", "2", "The 1st of the next month", false],
      ["button", "3", "Skip the months without a 31st", false],
    ]);
    expect(text(".free-choice .choice-text")).toBe("Your own answer");
    expect(text(".question-acts")).toBe("Discard");
    expect(text(".reply .box")).toBe("Press 1 to 3 in the question, or type your own answer");
  });

  test("a choice's words take the row and Recommended stands at its end, as in namp's drawer", () => {
    const css = style("src/lib/home/Question.svelte");
    expect(rule(css, ".choice")).toMatch(/display: flex/);
    expect(rule(css, ".choice-text")).toMatch(/flex: 1/);
    expect(rule(css, ".tag")).toMatch(/flex: none/);
  });

  test("lies where the shot's drawer is: its width the shot's from the drawer's edge, the canvas page behind it from the same edge, and Light's page fading by the ground alone", async () => {
    await page();
    const spot = document.querySelector(".hero .spot");
    expect(spot.style.getPropertyValue("--drawer")).toBe(String(WIDE.w - hero.drawer));
    expect(spot.style.getPropertyValue("--w")).toBe(String(WIDE.w));
    const css = style("src/routes/+page.svelte");
    expect(rule(css, ".lit")).toMatch(/width: min\(100%, calc\(var\(--drawer\) \* var\(--u\)\)\);/);
    expect(rule(css, ".backdrop")).toMatch(/background: var\(--wide\) right top \/ calc\(var\(--w\) \* var\(--u\)\) auto no-repeat;/);
    expect(css.match(/--shade: [^;]+;/g)).toEqual(["--shade: var(--dim);", "--shade: transparent;", "--shade: transparent;"]);
    expect(rule(css, ".backdrop::after")).toMatch(/linear-gradient\(var\(--shade\), var\(--shade\)\)/);
  });

  test("a click on a choice folds the question out and brings the D4 question up, the counts one less, the focus on it", async () => {
    await page();
    await fireEvent.click(choices()[1]);
    await vi.waitFor(() => expect(question().dataset.question).toBe("no-time-zone"));
    expect(document.querySelectorAll(".thread:not(.ghost) [data-question]")).toHaveLength(1);
    expect(text("[data-count]")).toBe("2");
    expect(text("[data-needs]")).toBe("2");
    expect(text(".who")).toBe("Recurring invoices14:12");
    expect(text(".question-box .title")).toBe("A client has no time zone set: whose 09:00 does its invoice go out at?");
    expect(text(".question-box .ctx")).toBe("9 of the 112 clients on a monthly template have no time zone. Their address names a country, not always a zone.");
    expect(choices().map((b) => [b.querySelector(".choice-text").textContent, !!b.querySelector(".tag")])).toEqual([
      ["The account's own time zone, until the client sets one", true],
      ["The zone of the client's country, the capital's for a country with several", false],
      ["UTC", false],
    ]);
    expect(document.activeElement).toBe(question());
    expect(text(".said")).toBe("Answered: The 1st of the next month. 2 waiting for you, next: A client has no time zone set: whose 09:00 does its invoice go out at?");
  });

  test("once both are answered, the drawer shows what is left, the review, and the focus is on its title", async () => {
    await page();
    await fireEvent.click(choices()[0]);
    await vi.waitFor(() => expect(question().dataset.question).toBe("no-time-zone"));
    await fireEvent.click(choices()[0]);
    await vi.waitFor(() => expect(question()).toBeNull());
    expect(text("[data-count]")).toBe("1");
    expect(text("[data-needs]")).toBe("1");
    expect(drawer().querySelector(".thread-head")).toBeNull();
    expect(text(".reply .box")).toBe("Message the session. @ mentions a topic, Ctrl+Enter sends.");
    expect(text(".row .where")).toBe("Review·#42 Recurring invoices: the scheduler makes each due invoice once");
    expect(text(".row .what")).toBe("Your review is requested.");
    expect(document.activeElement.id).toBe("threads");
    expect(text(".said")).toBe("Answered: The account's own time zone, until the client sets one. 1 waiting for you.");
  });

  test("the hero keeps the room the drawer held as what it shows changes, so nothing round it moves, on a wide screen to the end", async () => {
    await page();
    const lit = document.querySelector(".hero .lit");
    lit.getBoundingClientRect = () => ({ height: 702.5 });
    expect(lit.style.getPropertyValue("--held")).toBe("");
    await fireEvent.click(choices()[0]);
    await vi.waitFor(() => expect(question().dataset.question).toBe("no-time-zone"));
    expect(lit.style.getPropertyValue("--held")).toBe("702.5px");
    await fireEvent.click(choices()[0]);
    await vi.waitFor(() => expect(question()).toBeNull());
    expect(lit.classList.contains("fit")).toBe(false);
    expect(rule(style("src/routes/+page.svelte"), ".lit")).toMatch(/min-height: max\(calc\(var\(--shown\) \* var\(--u\)\), var\(--held, 0px\)\);/);
  });

  test("on a phone, once the last question is answered, the drawer fits what is left, the page under it closing up", async () => {
    vi.stubGlobal("matchMedia", (q) => ({ matches: q.includes("reduce") || q.includes("max-width: 40rem"), media: q, addEventListener() {}, removeEventListener() {} }));
    await page();
    const lit = document.querySelector(".hero .lit");
    lit.getBoundingClientRect = () => ({ height: 640 });
    await fireEvent.click(choices()[0]);
    await vi.waitFor(() => expect(question().dataset.question).toBe("no-time-zone"));
    expect(lit.classList.contains("fit")).toBe(false);
    expect(lit.style.getPropertyValue("--held")).toBe("640px");
    await fireEvent.click(choices()[0]);
    await vi.waitFor(() => expect(question()).toBeNull());
    expect(lit.classList.contains("fit")).toBe(true);
    const phone = style("src/routes/+page.svelte").split("@media (max-width: 40rem)")[1];
    expect(rule(phone, ".lit")).toMatch(/min-height: var\(--held, 0px\);\s*transition: min-height 240ms/);
    expect(rule(phone, ".lit.fit")).toMatch(/min-height: 0;/);
    expect(rule(phone, ".hero")).toMatch(/min-height: 0;\s*padding-block: 72px 0;/);
  });

  test("a picked choice shows picked, its ring filled, in the moment before the question folds out", async () => {
    vi.stubGlobal("matchMedia", (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
    vi.useFakeTimers();
    try {
      await page();
      await fireEvent.click(choices()[1]);
      expect(choices().map((b) => b.classList.contains("picked"))).toEqual([false, true, false]);
      await fireEvent.click(choices()[0]);
      expect(choices().map((b) => b.classList.contains("picked"))).toEqual([false, true, false]);
      // The fold itself at once, so no animation is left running once the test is done.
      vi.stubGlobal("matchMedia", (q) => ({ matches: q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} }));
      await vi.advanceTimersByTimeAsync(180);
      expect(text("[data-count]")).toBe("2");
    } finally {
      vi.useRealTimers();
    }
  });

  test("the question shows the site's one focus ring when the keyboard reaches it, never hiding it", () => {
    expect(rule(style("src/lib/home/Question.svelte"), ".question-box")).not.toMatch(/outline/);
    expect(readFileSync(resolve(import.meta.dirname, "../../src/app.css"), "utf8")).toMatch(/:focus-visible \{\s*outline: 2px solid var\(--accent\);\s*outline-offset: 2px;/);
  });

  test("every question's thread lies unseen in the live one's place, so the drawer is as tall for D4's question as for the 31st's", async () => {
    await page();
    const cell = drawer().querySelector(".threads");
    const ghosts = [...cell.querySelectorAll(":scope > .thread.ghost")];
    expect(ghosts.map((g) => g.querySelector("[data-question]").dataset.question)).toEqual(["invoice-day", "no-time-zone"]);
    expect(ghosts.every((g) => g.inert && g.getAttribute("aria-hidden") === "true")).toBe(true);
    expect(cell.querySelectorAll(":scope > .thread:not(.ghost)")).toHaveLength(1);
    const css = style("src/lib/home/Drawer.svelte");
    expect(rule(css, ".threads")).toMatch(/display: grid;/);
    expect(rule(css, ".threads > .thread")).toMatch(/grid-area: 1 \/ 1;/);
    expect(rule(css, ".ghost")).toMatch(/visibility: hidden;/);
    await fireEvent.click(choices()[0]);
    await vi.waitFor(() => expect(question().dataset.question).toBe("no-time-zone"));
    expect(drawer().querySelectorAll(".threads > .thread.ghost")).toHaveLength(2);
  });

  test("by the keyboard, a choice's number key picks it while the question has the focus", async () => {
    await page();
    question().focus();
    await fireEvent.keyDown(question(), { key: "4" });
    expect(question().dataset.question).toBe("invoice-day");
    await fireEvent.keyDown(question(), { key: "1", ctrlKey: true });
    expect(question().dataset.question).toBe("invoice-day");
    await fireEvent.keyDown(question(), { key: "1" });
    await vi.waitFor(() => expect(question().dataset.question).toBe("no-time-zone"));
    expect(text("[data-count]")).toBe("2");
    expect(text(".said")).toMatch(/^Answered: The month's last day: 30 April, 28 or 29 February\. 2 waiting for you/);
  });

  test("by the keyboard, the number key picks its choice whichever choice has the focus", async () => {
    await page();
    choices()[0].focus();
    await fireEvent.keyDown(choices()[0], { key: "3" });
    await vi.waitFor(() => expect(question().dataset.question).toBe("no-time-zone"));
    expect(text(".said")).toMatch(/^Answered: Skip the months without a 31st\./);
  });
});
