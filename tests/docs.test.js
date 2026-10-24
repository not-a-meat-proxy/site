import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { inject } from "vitest";
import { startSite } from "./site.js";

// The docs for testers, as the build writes them and the built server serves them, with a bucket
// that never answers: they are files of the build, needing none.
const pages = [
  ["/docs", "Overview"],
  ["/docs/install", "Install namp"],
  ["/docs/first-topic", "Your first topic"],
  ["/docs/backup", "Back up your data"],
  ["/docs/update", "Update namp"],
  ["/docs/report-an-issue", "Report an issue"],
];

let site;

beforeAll(async () => {
  site = await startSite({ S3_ENDPOINT: "http://127.0.0.1:9", S3_BUCKET: "namp", S3_ACCESS_KEY_ID: "test", S3_SECRET_ACCESS_KEY: "test-secret", S3_REGION: "us-east-1" });
});

afterAll(async () => {
  await site?.stop();
});

async function html(path) {
  const res = await site.get(path);
  expect(res.status).toBe(200);
  expect(res.headers.get("content-type")).toMatch(/^text\/html/);
  return res.text();
}

describe("the docs", () => {
  test("are prerendered, each page a file of the build, and every file a page", () => {
    const built = join(inject("build"), "prerendered");
    for (const [path] of pages) expect(existsSync(join(built, `${path}.html`)), path).toBe(true);
    expect(readdirSync(join(built, "docs")).filter((name) => name.endsWith(".html")).sort()).toEqual(
      pages.slice(1).map(([path]) => `${path.slice("/docs/".length)}.html`).sort(),
    );
  });

  test.each(pages)("%s is served with no bucket, titled %s", async (path, title) => {
    const page = await html(path);
    expect(page).toContain(`<h1>${title}</h1>`);
    expect(page).toMatch(/<title>[^<]*namp docs<\/title>/);
  });

  test.each(pages)("%s links to every other page, and to the front page", async (path) => {
    const page = await html(path);
    for (const [other] of pages) expect(page).toContain(`href="${other}"`);
    expect(page).toContain('href="/"');
    expect(page).toContain(`href="${path}" aria-current="page"`);
  });

  test.each(pages)("%s gives each of its sections an id and a link to it", async (path) => {
    const page = await html(path);
    const ids = [...page.matchAll(/<h2 id="([a-z0-9-]+)">/g)].map((match) => match[1]);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(page).toContain(`<a class="anchor" href="#${id}"`);
      expect(page).toMatch(new RegExp(`<li[^>]*><a href="#${id}"[^>]*>`));
    }
  });

  test.each(pages)("%s numbers its sections in their marks, the first in view as it opens", async (path) => {
    const marks = [...(await html(path)).matchAll(/<h2 id="[a-z0-9-]+"><span class="mark" data-sign="(\w+)" aria-hidden="true"><span class="n">§(\d+)<\/span><svg class="ps"/g)];
    expect(marks.length).toBeGreaterThan(0);
    expect(marks.map((m) => Number(m[2]))).toEqual(marks.map((_, i) => i + 1));
    expect(marks.map((m) => m[1])).toEqual(marks.map((_, i) => (i ? "planned" : "running")));
  });

  test("gives a command a Copy button, and what it prints none", async () => {
    const page = await html("/docs/install");
    expect(page).toContain(
      '<div class="code"><pre><code>curl -fsSL https://namp.cloudgt.dev/install.sh | sh -s -- &lt;token&gt;</code></pre><button type="button" class="copy" data-copy>Copy</button></div>',
    );
    expect(page).toMatch(/<div class="code output"><pre><code>ready http:\/\/localhost:4321\/__session\/ {2}pid \d+<\/code><\/pre><\/div>/);
  });

  test.each(["/docs", "/docs/install", "/docs/update"])("%s links to the backup in its text, not only in the sidebar", async (path) => {
    const article = (await html(path)).match(/<article[^>]*>([\s\S]*)<\/article>/)[1];
    expect(article).toContain('href="/docs/backup"');
  });

  // namp 0.5.0 opens a topic's subjects from the lane of cards at its page's right: the Conversation
  // button and the goal's strip under the top bar are gone, and Home's briefing is no Digest.
  test.each(pages)("%s names no control namp 0.5.0 dropped", async (path) => {
    const article = (await html(path)).match(/<article[^>]*>([\s\S]*)<\/article>/)[1];
    expect(article).not.toContain("<strong>Conversation</strong>");
    expect(article).not.toMatch(/strip under the topic's top bar|the Digest|goal on one line/);
  });

  test("/docs/first-topic opens the conversation and the goal from the lane", async () => {
    const article = (await html("/docs/first-topic")).match(/<article[^>]*>([\s\S]*)<\/article>/)[1];
    expect(article).toContain("from <strong>Threads</strong>, the first card of its lane");
    for (const card of ["Threads", "Goal", "Plan", "Squad", "Pull request", "Documents"]) expect(article).toContain(`<li><strong>${card}</strong>, `);
  });

  test("keep Markdown's HTML as text", async () => {
    const page = await html("/docs/install");
    expect(page).not.toContain("<token>");
  });

  test("answer 404 for a page they don't have", async () => {
    const res = await site.get("/docs/nowhere");
    expect(res.status).toBe(404);
  });

  test("are linked from the front page", async () => {
    expect(await html("/")).toContain('href="/docs"');
  });
});
