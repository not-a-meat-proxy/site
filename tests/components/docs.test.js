// A docs page's commands: Copy takes the command as it is shown and says Copied for two seconds,
// and with no clipboard at all selects the command, for the reader to copy.
import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render } from "@testing-library/svelte";
import { tick } from "svelte";
import Page from "../../src/routes/docs/[[page]]/+page.svelte";

const html = `<h1>Install namp</h1>
<div class="code"><pre><code>namp --version
claude --version</code></pre><button type="button" class="copy" data-copy>Copy</button></div>`;
const pages = [
  { path: "/docs", title: "Overview" },
  { path: "/docs/install", title: "Install namp" },
  { path: "/docs/update", title: "Update namp" },
];
const data = { pages, page: { slug: "install", path: "/docs/install", title: "Install namp", description: "", html } };

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
      ["/docs", "PreviousOverview"],
      ["/docs/update", "NextUpdate namp"],
    ]);
  });
});
