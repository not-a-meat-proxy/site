// The front page's ways out besides the invite: the docs from the hero, a plain button beside
// "Get an invite" or under a tester's command, and the site's repo from GitHub's mark, on the
// front page and in the docs' header.
import { afterEach, describe, expect, test } from "vitest";
import { cleanup, render } from "@testing-library/svelte";
import { createRawSnippet, tick } from "svelte";
import Page from "../../src/routes/+page.svelte";
import Docs from "../../src/routes/docs/+layout.svelte";

const site = "https://namp.example";
const visitor = { contact: "mailto:invites@example.com", site, invalid: false, tester: null, release: null };
const repo = "https://github.com/not-a-meat-proxy/site";

afterEach(cleanup);

// The hero's links and buttons beside the app, in the order they show.
function hero() {
  return [...document.querySelectorAll(".hero .pitch a, .hero .pitch button")].map((el) => [el.textContent.trim(), el.className]);
}

describe("the hero", () => {
  test("shows Read the docs beside Get an invite, the invite the only filled button", async () => {
    render(Page, { data: visitor });
    await tick();
    const actions = [...document.querySelectorAll(".hero .actions a")];
    expect(actions.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Get an invite", "mailto:invites@example.com"],
      ["Read the docs", "/docs"],
    ]);
    expect(actions[0].classList.contains("primary")).toBe(true);
    expect(actions[1].classList.contains("primary")).toBe(false);
  });

  test("with no contact, shows Read the docs alone", async () => {
    render(Page, { data: { ...visitor, contact: null } });
    await tick();
    const actions = [...document.querySelectorAll(".hero .actions a")];
    expect(actions.map((a) => [a.textContent, a.getAttribute("href"), a.className.includes("primary")])).toEqual([
      ["Read the docs", "/docs", false],
    ]);
    expect(document.querySelector(".hero").textContent).not.toContain("Get an invite");
  });

  test("for a tester, shows Read the docs under the install command as a plain link, after its Copy", async () => {
    render(Page, { data: { ...visitor, tester: { name: "carol", token: "t".repeat(43) } } });
    await tick();
    expect(hero().map(([text]) => text)).toEqual(["Copy", "Read the docs"]);
    const docs = document.querySelector('.hero a[href="/docs"]');
    expect(docs.classList.contains("button")).toBe(false);
    expect(document.querySelector(".hero .command").compareDocumentPosition(docs)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  test("leaves the docs out of the call again further down", async () => {
    render(Page, { data: visitor });
    await tick();
    expect(document.querySelector(".close").textContent).not.toContain("Read the docs");
  });
});

describe("the GitHub link", () => {
  function github() {
    const links = [...document.querySelectorAll("a.github")];
    expect(links).toHaveLength(1);
    return links[0];
  }

  test("on the front page, goes to the site's repo, named for it, its mark drawn inline", async () => {
    render(Page, { data: visitor });
    await tick();
    const link = github();
    expect(link.getAttribute("href")).toBe(repo);
    expect(link.getAttribute("aria-label")).toBe("namp's site on GitHub");
    expect(link.querySelector("svg[aria-hidden='true'] path")).not.toBeNull();
    expect(link.querySelector("img")).toBeNull();
  });

  test("on a docs page, sits in the header and goes to the same repo", async () => {
    const pages = [{ path: "/docs/install", title: "Install namp", sections: [] }];
    const children = createRawSnippet(() => ({ render: () => "<h1>Install namp</h1>" }));
    render(Docs, { data: { pages }, children });
    await tick();
    const link = github();
    expect(link.closest("header")).not.toBeNull();
    expect(link.getAttribute("href")).toBe(repo);
    expect(link.getAttribute("aria-label")).toBe("namp's site on GitHub");
  });
});
