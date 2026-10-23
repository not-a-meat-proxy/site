// The home page's Needs you, namp's own over the hero's screenshot: its demo topics say so, its asks are
// counted with the reply beside them, and picking a choice of the first question, by a click or by its
// number key, answers it: it folds out of Needs you and the count goes down by one.
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { tick } from "svelte";
import Page from "../../src/routes/+page.svelte";

const visitor = { contact: "mailto:invites@example.com", site: "https://namp.example", invalid: false, tester: null, release: null };

// A browser asking for reduced motion, so a fold is done at once, with no animation to wait for.
beforeEach(() => vi.stubGlobal("matchMedia", (q) => ({ matches: q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} })));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const count = () => document.querySelector("[data-needs-count]").textContent;
const subjects = () => [...document.querySelectorAll(".needs-you .subject")].map((el) => el.textContent);
const question = () => document.querySelector("[data-question]");

async function page() {
  render(Page, { data: visitor });
  await tick();
}

describe("Needs you on the home page", () => {
  test("shows three asks and a reply from demo topics, says they are, and counts the asks with the reply apart", async () => {
    await page();
    expect(document.querySelector(".hero .needs-you")).not.toBeNull();
    expect(document.querySelector(".needs-you .demo").textContent).toBe("demo topics");
    expect([...document.querySelectorAll(".needs-you .kind")].map((el) => el.textContent)).toEqual(["Question", "Goal", "Question", "Reply"]);
    expect(count()).toBe("3");
    expect(document.querySelector(".needs-you .n.replied").firstChild.textContent).toBe("1");
    // A screen reader hears what each count counts.
    expect(document.querySelector("#needs-you").textContent.replace(/\s+/g, " ").trim()).toBe("Needs you 3 asks, 1 reply to read");
    expect([...document.querySelectorAll(".needs-you .ask")].length).toBe(3 + 1);
    expect(subjects()[0]).toBe("When a schedule's day is the 31st, which day does it go out in a shorter month?");
  });

  test("the first question carries its choices as buttons, numbered, the recommended one marked", async () => {
    await page();
    const choices = [...question().querySelectorAll("button.choice")];
    expect(choices.map((b) => [b.type, b.querySelector(".num").textContent, b.querySelector(".choice-text").textContent, !!b.querySelector(".tag")])).toEqual([
      ["button", "1", "The month's last day: 30 April, 28 or 29 February", true],
      ["button", "2", "The 1st of the next month", false],
      ["button", "3", "Skip the months without a 31st", false],
    ]);
    // The other question shows its recommended choice on a line, as namp's Home does.
    expect(document.querySelectorAll(".needs-you span.rec")[0].textContent).toBe("Recommended: The rate on the invoice's date");
  });

  test("a click on a choice folds the question away and lowers the count, the focus on the heading", async () => {
    await page();
    await fireEvent.click(question().querySelectorAll("button.choice")[1]);
    await vi.waitFor(() => expect(question()).toBeNull());
    expect(count()).toBe("2");
    expect(subjects()).toHaveLength(3);
    expect(subjects()[0]).toMatch(/^A client list imports/);
    expect(document.activeElement.id).toBe("needs-you");
    expect(document.querySelector(".needs-you .said").textContent).toBe("Answered: The 1st of the next month. 2 things need you.");
  });

  test("by the keyboard, a choice's number key picks it while the question has the focus", async () => {
    await page();
    const first = question().querySelector("button.choice");
    first.focus();
    expect(document.activeElement).toBe(first);
    await fireEvent.keyDown(first, { key: "4" });
    expect(question()).not.toBeNull();
    await fireEvent.keyDown(first, { key: "1", ctrlKey: true });
    expect(question()).not.toBeNull();
    await fireEvent.keyDown(first, { key: "1" });
    await vi.waitFor(() => expect(question()).toBeNull());
    expect(count()).toBe("2");
    expect(document.querySelector(".needs-you .said").textContent).toBe("Answered: The month's last day: 30 April, 28 or 29 February. 2 things need you.");
  });

  test("by the keyboard, the number key picks its choice whichever choice has the focus", async () => {
    await page();
    const first = question().querySelector("button.choice");
    first.focus();
    await fireEvent.keyDown(first, { key: "3" });
    await vi.waitFor(() => expect(question()).toBeNull());
    expect(document.querySelector(".needs-you .said").textContent).toBe("Answered: Skip the months without a 31st. 2 things need you.");
  });
});
