// The invited view's install command: shown whole, the token too, and copied by Copy as the
// one line a terminal runs, with nothing its wrapping in the box added. The wrapping itself is seen
// in a screenshot, not here.
import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render } from "@testing-library/svelte";
import { tick } from "svelte";
import Page from "../../src/routes/+page.svelte";
import { newToken } from "../../src/lib/token.js";

// A token as `just tester add` makes one: 32 random bytes in base64url.
const token = newToken();
const site = "https://namp.example";
const command = `curl -fsSL ${site}/install.sh | sh -s -- ${token}`;
const data = { contact: null, site, invalid: false, tester: { name: "carol", token }, release: null };

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function clipboard(writeText) {
  vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
}

describe("the install command", () => {
  test("shows the whole command, token included", async () => {
    render(Page, { data });
    await tick();
    expect(token).toHaveLength(43);
    const code = document.querySelector(".command code");
    expect(code.textContent).toBe(command);
  });

  test("Copy copies it whole on one line, says Copied for two seconds, then goes back", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn(async () => {});
    clipboard(writeText);
    render(Page, { data });
    await tick();
    const button = document.querySelector(".command button");
    button.click();
    await vi.advanceTimersByTimeAsync(0);
    expect(writeText).toHaveBeenCalledWith(command);
    expect(writeText.mock.calls[0][0]).not.toMatch(/\n|\s{2}/);
    expect(button.textContent).toBe("Copied");
    await vi.advanceTimersByTimeAsync(2000);
    expect(button.textContent).toBe("Copy");
  });

  test("with no clipboard at all, selects the command whole, as one line", async () => {
    clipboard(async () => {
      throw new Error("denied");
    });
    document.execCommand = () => false;
    render(Page, { data });
    await tick();
    document.querySelector(".command button").click();
    await vi.waitFor(() => expect(getSelection().toString()).toBe(command));
  });
});
