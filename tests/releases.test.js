import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { newToken, tokenHash } from "../src/lib/token.js";
import { SIGNATURE, fakeS3 } from "./s3.js";
import { request } from "node:http";
import { startSite } from "./site.js";

// A release's notes images, as namp's `just publish` puts them in the bucket beside notes.md: served
// to a tester only, and shown in the front page's notes.
const alice = newToken();
const bob = newToken();
const webp = Buffer.from("RIFF\x10\x00\x00\x00WEBPVP8 fake", "latin1");
const png = Buffer.from("\x89PNG\r\n\x1a\nfake", "latin1");
const notes = "releases/v0.6.0/notes.md";

let s3, site;

beforeAll(async () => {
  s3 = await fakeS3();
  s3.put("testers.json", {
    testers: [
      { name: "alice", token_sha256: tokenHash(alice), created: "2026-10-16T12:00:00Z", revoked: null },
      { name: "bob", token_sha256: tokenHash(bob), created: "2026-10-16T12:00:00Z", revoked: "2026-10-16T13:00:00Z" },
    ],
  });
  s3.put("latest.json", { version: "0.6.0", tag: "v0.6.0", date: "2026-10-25", notes, targets: {} });
  s3.put(notes, "## What's new\n");
  s3.put("releases/v0.6.0/beside-dark.webp", webp);
  s3.put("releases/v0.6.0/beside-light.png", png);
  site = await startSite(s3.env);
});

afterAll(async () => {
  await site?.stop();
  await s3?.close();
});

const cookie = (token) => ({ cookie: `namp_invite=${token}` });

// The answer to path as it is written, with no client normalising its dots: status and body.
function raw(path, headers) {
  return new Promise((done, fail) => {
    const req = request(`${site.url}${path}`, { headers }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => done({ status: res.statusCode, body }));
    });
    req.on("error", fail);
    req.end();
  });
}

async function missing(res) {
  expect(res.status).toBe(404);
  expect(await res.text()).toBe("namp: no such image\n");
}

describe("/releases/<tag>/<name>", () => {
  test("answers a tester's invite cookie with the image, its type from its extension", async () => {
    for (const [name, type, body] of [["beside-dark.webp", "image/webp", webp], ["beside-light.png", "image/png", png]]) {
      const res = await site.get(`/releases/v0.6.0/${name}`, cookie(alice));
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toBe(type);
      expect(res.headers.get("cache-control")).toBe("private, max-age=86400");
      expect(res.headers.get("x-content-type-options")).toBe("nosniff");
      expect(Buffer.from(await res.arrayBuffer())).toEqual(body);
    }
  });

  test("answers 404 with no cookie", async () => {
    await missing(await site.get("/releases/v0.6.0/beside-dark.webp"));
  });

  test("answers 404 to an unknown or a revoked cookie, and to a Bearer token", async () => {
    await missing(await site.get("/releases/v0.6.0/beside-dark.webp", cookie(newToken())));
    await missing(await site.get("/releases/v0.6.0/beside-dark.webp", cookie(bob)));
    await missing(await site.get("/releases/v0.6.0/beside-dark.webp", { authorization: `Bearer ${alice}` }));
  });

  test.each(["v0.6", "latest", "v0.6.0-rc.1", "0.6.0", "V0.6.0"])("answers 404 to the tag %s", async (tag) => {
    s3.put(`releases/${tag}/beside-dark.webp`, webp);
    try {
      await missing(await site.get(`/releases/${tag}/beside-dark.webp`, cookie(alice)));
    } finally {
      s3.objects.delete(`releases/${tag}/beside-dark.webp`);
    }
  });

  test.each(["Beside-dark.webp", "-beside.webp", "beside.gif", "beside.svg", "beside_dark.png", "beside.webp.png.txt", "beside dark.png"])(
    "answers 404 to the name %s",
    async (name) => {
      s3.put(`releases/v0.6.0/${name}`, png);
      try {
        await missing(await site.get(`/releases/v0.6.0/${encodeURIComponent(name)}`, cookie(alice)));
      } finally {
        s3.objects.delete(`releases/v0.6.0/${name}`);
      }
    },
  );

  test("answers 404 to an image the bucket doesn't have", async () => {
    await missing(await site.get("/releases/v0.6.0/nowhere.webp", cookie(alice)));
    await missing(await site.get("/releases/v0.5.0/beside-dark.webp", cookie(alice)));
  });

  test.each([
    "/releases/v0.6.0/..",
    "/releases/v0.6.0/%2e%2e",
    "/releases/v0.6.0/..%2ftesters.json",
    "/releases/v0.6.0/%2e%2e%2f%2e%2e%2ftesters.json",
    "/releases/..%2f..%2ftesters.json/x.png",
    "/releases/v0.6.0/../../testers.json",
    "/releases/v0.6.0/beside-dark.webp/..",
  ])("answers 404 to %s, and reads no key of the bucket for it", async (path) => {
    const before = s3.requests.length;
    const res = await raw(path, cookie(alice));
    expect(res.status).toBe(404);
    expect(res.body).not.toContain("token_sha256");
    expect(s3.requests.slice(before).filter((r) => r !== "GET /testers.json")).toEqual([]);
  });

  test.each(["notes.md", "namp-0.6.0-aarch64-apple-darwin.tar.gz"])("answers 404 to another key of the bucket, releases/v0.6.0/%s", async (name) => {
    s3.put(`releases/v0.6.0/${name}`, "not an image");
    const before = s3.requests.length;
    try {
      await missing(await site.get(`/releases/v0.6.0/${name}`, cookie(alice)));
    } finally {
      if (name !== "notes.md") s3.objects.delete(`releases/v0.6.0/${name}`);
    }
    expect(s3.requests.slice(before).filter((r) => r !== "GET /testers.json")).toEqual([]);
  });

  test("answers 503 when the bucket refuses, and logs the S3 error", async () => {
    await site.get("/releases/v0.6.0/beside-dark.webp", cookie(alice));
    s3.refuse("GET");
    let res;
    try {
      res = await site.get("/releases/v0.6.0/beside-dark.webp", cookie(alice));
    } finally {
      s3.refuse(false);
    }
    expect(res.status).toBe(503);
    expect(await res.text()).toBe("namp: the release store is not answering; try again in a minute\n");
    expect(site.log).toContain(`bucket: GET releases/v0.6.0/beside-dark.webp: ${SIGNATURE.join(": ")}`);
  });
});

describe("the front page's notes", () => {
  // The notes of the page a tester sees for the body of notes.md.
  async function rendered(body) {
    s3.put(notes, body);
    try {
      return await (await site.get("/", cookie(alice))).text();
    } finally {
      s3.put(notes, "## What's new\n");
    }
  }

  test("show a <tag>/<name> image from /releases/<tag>/<name>, with its alt text, loaded lazily and opening whole in a tab", async () => {
    const page = await rendered("![The drawer beside a canvas](v0.6.0/beside-dark.webp)\n\n![In Light](v0.6.0/beside-light.png \"Light\")\n");
    expect(page).toContain(
      '<a href="/releases/v0.6.0/beside-dark.webp" target="_blank" rel="noopener"><img src="/releases/v0.6.0/beside-dark.webp" alt="The drawer beside a canvas" loading="lazy"></a>',
    );
    expect(page).toContain(
      '<a href="/releases/v0.6.0/beside-light.png" target="_blank" rel="noopener"><img src="/releases/v0.6.0/beside-light.png" alt="In Light" title="Light" loading="lazy"></a>',
    );
    expect((await site.get("/releases/v0.6.0/beside-dark.webp", cookie(alice))).status).toBe(200);
  });

  test.each([
    ["an absolute URL", "https://evil.example/x.png"],
    ["a protocol-relative URL", "//evil.example/v0.6.0/x.png"],
    ["a parent path", "../x.png"],
    ["a root path", "/x.png"],
    ["a root path to a release", "/releases/v0.6.0/beside-dark.webp"],
    ["a data: URI", "data:image/png;base64,iVBORw0KGgo="],
    ["a bad tag", "latest/beside-dark.webp"],
    ["a bad name", "v0.6.0/beside.svg"],
    ["a deeper path", "v0.6.0/beside-dark.webp/x.png"],
    ["a query", "v0.6.0/beside-dark.webp?x=1"],
    ["a dot path", "v0.6.0/../testers.png"],
  ])("show %s as its alt text alone, escaped", async (_, src) => {
    const page = await rendered(`Before ![A *bold* <b>alt</b> & "more"](${src}) after\n`);
    expect(page).toContain('<p>Before A bold &lt;b&gt;alt&lt;/b&gt; &amp; &quot;more&quot; after</p>');
    expect(page).not.toMatch(/<img[^>]*(evil|x\.png|testers|beside|data:)/);
  });
});
