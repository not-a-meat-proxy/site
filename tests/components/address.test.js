// The invite address's chip: for a visitor with no mail app, a button that copies the
// address and says so for two seconds, the plain address when no clipboard takes it.
import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render } from "@testing-library/svelte";
import { tick } from "svelte";
import Address from "../../src/lib/Address.svelte";

const address = "invites@example.com";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function clipboard(writeText) {
  vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
}

describe("the address chip", () => {
  test("is a button named for what it copies, showing the address and a copy icon", async () => {
    render(Address, { address });
    await tick();
    const chip = document.querySelector("button.chip");
    expect(chip.getAttribute("aria-label")).toBe(`Copy ${address}`);
    expect(chip.textContent.trim()).toBe(address);
    expect(chip.querySelector("svg")).not.toBeNull();
    expect(document.querySelector("[aria-live]").textContent).toBe("");
  });

  test("copies the address, says Copied for two seconds, then goes back", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn(async () => {});
    clipboard(writeText);
    render(Address, { address });
    await tick();
    document.querySelector("button.chip").click();
    await vi.advanceTimersByTimeAsync(0);
    expect(writeText).toHaveBeenCalledWith(address);
    expect(document.querySelector("[aria-live]").textContent).toBe("Copied");
    expect(document.querySelector("button.chip").classList.contains("copied")).toBe(true);
    await vi.advanceTimersByTimeAsync(2000);
    expect(document.querySelector("[aria-live]").textContent).toBe("");
  });

  test("with no clipboard at all, turns back into the plain address, selected", async () => {
    clipboard(async () => {
      throw new Error("denied");
    });
    document.execCommand = () => false;
    render(Address, { address });
    await tick();
    document.querySelector("button.chip").click();
    await vi.waitFor(() => expect(document.querySelector("button.chip")).toBeNull());
    const plain = document.querySelector(".chip.plain");
    expect(plain.textContent).toBe(address);
    expect(getSelection().toString()).toBe(address);
  });
});
