// A docs page's commands: Copy takes the command as it is shown and says Copied for two seconds,
// and with no clipboard at all selects the command, for the reader to copy. Its sections' marks and On this
// page follow the section in view.
import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render } from "@testing-library/svelte";
import { tick } from "svelte";
import Page from "../../src/routes/docs/[[page]]/+page.svelte";

const mark = (n, sign) => `<span class="mark" data-sign="${sign}" aria-hidden="true"><span class="n">§${n}</span><svg class="ps"><g class="running"><path class="arc" /></g></svg></span>`;
const opening = `<h1>Install namp</h1>\n<p>What you need.</p>`;
const html = `<h2 id="what-you-need">${mark(1, "running")}What you need</h2>
<p>A machine.</p>
<h2 id="install">${mark(2, "planned")}Install</h2>
<div class="code"><pre><code>namp --version
claude --version</code></pre><button type="button" class="copy" data-copy>Copy</button></div>
<h2 id="start">${mark(3, "planned")}Start</h2>
<p>namp start.</p>`;
const sections = [
  { id: "what-you-need", text: "What you need" },
  { id: "install", text: "Install" },
  { id: "start", text: "Start" },
];
const pages = [
  { path: "/docs", title: "Overview" },
  { path: "/docs/install", title: "Install namp" },
  { path: "/docs/update", title: "Update namp" },
];
const data = { pages, page: { slug: "install", path: "/docs/install", title: "Install namp", description: "", sections, opening, html } };

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function clipboard(writeText) {
  vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
}

describe("a docs page", () => {
  test("copies a command whole, says Copied for two seconds, then goes back", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn(async () => {});
    clipboard(writeText);
    render(Page, { data });
    await tick();
    const button = document.querySelector("[data-copy]");
    button.click();
    await vi.advanceTimersByTimeAsync(0);
    expect(writeText).toHaveBeenCalledWith("namp --version\nclaude --version");
    expect(button.textContent).toBe("Copied");
    await vi.advanceTimersByTimeAsync(2000);
    expect(button.textContent).toBe("Copy");
  });

  test("with no clipboard at all, selects the command", async () => {
    clipboard(async () => {
      throw new Error("denied");
    });
    document.execCommand = () => false;
    render(Page, { data });
    await tick();
    document.querySelector("[data-copy]").click();
    await vi.waitFor(() => expect(getSelection().toString()).toBe("namp --version\nclaude --version"));
    expect(document.querySelector("[data-copy]").textContent).toBe("Copy");
  });

  test("links to the page before it and the one after it", async () => {
    render(Page, { data });
    await tick();
    const turn = [...document.querySelectorAll(".turn a")].map((a) => [a.getAttribute("href"), a.textContent]);
    expect(turn).toEqual([
      ["/docs", "Previous [Overview"],
      ["/docs/update", "Next ]Update namp"],
    ]);
  });

  test("lists its sections under On this page, the first in view as the page opens", async () => {
    render(Page, { data });
    await tick();
    const aside = document.querySelector('nav[aria-label="On this page"]');
    expect([...aside.querySelectorAll("a")].map((a) => [a.getAttribute("href"), a.getAttribute("aria-current")])).toEqual([
      ["#what-you-need", "location"],
      ["#install", null],
      ["#start", null],
    ]);
    expect(document.querySelector("article details.folded summary").textContent).toBe("On this page");
  });

  test("marks the sections done above the one in view, running for it and planned below, as the reader scrolls", async () => {
    const observers = [];
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback) {
          this.callback = callback;
          observers.push(this);
        }
        observe() {}
        disconnect() {}
      },
    );
    render(Page, { data });
    await tick();
    const headings = [...document.querySelectorAll("article h2")];
    const scrollTo = (tops) => {
      headings.forEach((h, i) => (h.getBoundingClientRect = () => ({ top: tops[i] })));
      observers[0].callback([]);
    };
    const signs = () => headings.map((h) => h.querySelector(".mark").dataset.sign);
    const current = () => [...document.querySelectorAll('nav[aria-label="On this page"] a')].map((a) => a.getAttribute("aria-current"));

    scrollTo([-400, 100, 900]);
    await tick();
    expect(signs()).toEqual(["done", "running", "planned"]);
    expect(current()).toEqual([null, "location", null]);

    scrollTo([-900, -400, 100]);
    await tick();
    expect(signs()).toEqual(["done", "done", "running"]);
    expect(current()).toEqual([null, null, "location"]);

    scrollTo([200, 900, 1500]);
    await tick();
    expect(signs()).toEqual(["running", "planned", "planned"]);
    expect(current()).toEqual(["location", null, null]);
  });

  test("marks the last section at the page's end, but the one the reader went to by its link while it stands at the top", async () => {
    const observers = [];
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback) {
          this.callback = callback;
          observers.push(this);
        }
        observe() {}
        disconnect() {}
      },
    );
    vi.stubGlobal("scrollY", 1200);
    render(Page, { data });
    await tick();
    const headings = [...document.querySelectorAll("article h2")];
    const signs = () => headings.map((h) => h.querySelector(".mark").dataset.sign);
    headings.forEach((h, i) => (h.getBoundingClientRect = () => ({ top: [-300, 10, 200][i] })));

    observers[1].callback([{ isIntersecting: true }]);
    await tick();
    expect(signs()).toEqual(["done", "done", "running"]);

    location.hash = "#install";
    observers[0].callback([]);
    await tick();
    expect(signs()).toEqual(["done", "running", "planned"]);
    location.hash = "";
  });
});
