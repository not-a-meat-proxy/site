import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { newToken, tokenHash } from "../src/lib/token.js";
import { SIGNATURE, fakeS3 } from "./s3.js";
import { execFileSync } from "node:child_process";
import { startSite } from "./site.js";

// The site's routes as the README's Routes write them, the built server against a fake S3.
const alice = newToken();
const bob = newToken();
const target = "x86_64-unknown-linux-musl";
const archive = `releases/v0.2.0/namp-0.2.0-${target}.tar.gz`;
const latest = {
  version: "0.2.0",
  tag: "v0.2.0",
  commit: "1da0fe7".padEnd(40, "0"),
  date: "2026-10-16",
  notes: "releases/v0.2.0/notes.md",
  targets: { [target]: { archive, sha256: "ab".repeat(32), size: 7 } },
};

// The installer as publish puts it in the bucket: its one default line, then the lines that use it.
const DEFAULT = 'site="${NAMP_SITE:-https://namp.cloudgt.dev}"';
const installer = `#!/bin/sh
# Installs namp from the site that served this script.
set -eu

${DEFAULT}
site="\${site%/}"
printf 'installing from %s\\n' "$site"
`;

let s3, site;

beforeAll(async () => {
  s3 = await fakeS3();
  s3.put("testers.json", {
    testers: [
      { name: "alice", token_sha256: tokenHash(alice), created: "2026-10-16T12:00:00Z", revoked: null },
      { name: "bob", token_sha256: tokenHash(bob), created: "2026-10-16T12:00:00Z", revoked: "2026-10-16T13:00:00Z" },
    ],
  });
  s3.put("latest.json", JSON.stringify(latest, null, 2));
  s3.put("releases/v0.2.0/notes.md", "## What's new\n\n- `namp update` moves you to the next release\n");
  s3.put(archive, "archive");
  s3.put("install.sh", installer);
  site = await startSite({ ...s3.env, INVITE_CONTACT: "invites@example.com" });
});

afterAll(async () => {
  await site?.stop();
  await s3?.close();
});

const cookie = (token) => ({ cookie: `namp_invite=${token}` });
const bearer = (token) => ({ authorization: `Bearer ${token}` });

async function refusal(res, status) {
  expect(res.status).toBe(status);
  expect(res.headers.get("content-type")).toMatch(/^text\/plain/);
  const body = await res.text();
  expect(body).toMatch(/^namp: .*invite.*\n$/);
  expect(body.trim().split("\n")).toHaveLength(1);
  expect(body).toContain(site.url);
}

describe("every answer", () => {
  test.each(["/", "/install.sh", "/favicon.svg", "/api/latest", `/download/v0.2.0/${target}`, `/i/${alice}`, "/nowhere"])(
    "%s sends Referrer-Policy: no-referrer",
    async (path) => {
      const res = await site.get(path);
      expect(res.headers.get("referrer-policy")).toBe("no-referrer");
    },
  );
});

describe("install.sh", () => {
  const UNPUBLISHED = "namp: the installer is not published yet; try again later\n";

  test("is served to anyone, with no token, as a shell script read from the bucket", async () => {
    const res = await site.get("/install.sh");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/x-shellscript; charset=utf-8");
    expect(res.headers.get("cache-control")).toBe("no-cache");
    expect(res.headers.get("referrer-policy")).toBe("no-referrer");
    expect(await res.text()).toBe(installer.replace(DEFAULT, `site="\${NAMP_SITE:-${site.url}}"`));
  });

  test("serves the bucket's installer as it is now, not one it read before", async () => {
    const fixed = installer.replace("installing from", "installing namp from");
    s3.put("install.sh", fixed);
    try {
      const { body } = await site.asHost("/install.sh", "a$(id)b", "https");
      expect(body).toBe(fixed);
    } finally {
      s3.put("install.sh", installer);
    }
  });

  // The bucket holding body as its installer, or none, answers one line of 503; with the installer
  // back, the next request serves it.
  async function unpublished(body) {
    const before = s3.objects.get("install.sh");
    s3.objects.delete("install.sh");
    if (body !== undefined) s3.put("install.sh", body);
    try {
      const res = await site.get("/install.sh");
      expect(res.status).toBe(503);
      expect(res.headers.get("content-type")).toMatch(/^text\/plain/);
      expect(await res.text()).toBe(UNPUBLISHED);
    } finally {
      s3.objects.set("install.sh", before);
    }
    expect((await site.get("/install.sh")).status).toBe(200);
  }

  test("answers 503 when the bucket has no installer", async () => {
    await unpublished();
  });

  test("answers 503 for an installer without its default line, or with it twice", async () => {
    await unpublished(installer.replace(DEFAULT, 'site="${NAMP_SITE:-https://elsewhere.example}"'));
    await unpublished(installer.replace(DEFAULT, `${DEFAULT}\n${DEFAULT}`));
    await unpublished("");
  });

  test.each([
    ["namp-site-x7k2.up.railway.app", "https"],
    ["namp.cloudgt.dev", "https"],
    ["localhost:3000", "http"],
  ])("served on %s installs from there by default, as the page's command says", async (host, proto) => {
    const res = await site.asHost("/install.sh", host, proto);
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("text/x-shellscript; charset=utf-8");
    expect(res.headers["referrer-policy"]).toBe("no-referrer");
    const lines = res.body.split("\n").filter((l) => l.startsWith("site="));
    expect(lines).toEqual([`site="\${NAMP_SITE:-${proto}://${host}}"`, 'site="${site%/}"']);
  });

  test("keeps its default when the Host is nothing sh can hold in quotes", async () => {
    const res = await site.asHost("/install.sh", "a$(id)b", "https");
    expect(res.body).toBe(installer);
  });

  // The script's own lines, run by sh up to the site it settles on.
  const siteOf = (body, env) =>
    execFileSync("sh", ["-c", `${body.split("\n").filter((l) => l.startsWith("site=")).join("\n")}\nprintf %s "$site"`], {
      env: { PATH: process.env.PATH, ...env },
      encoding: "utf8",
    });

  test("takes the site that served it, and NAMP_SITE over it", async () => {
    const { body } = await site.asHost("/install.sh", "namp-site-x7k2.up.railway.app", "https");
    expect(siteOf(body, {})).toBe("https://namp-site-x7k2.up.railway.app");
    expect(siteOf(body, { NAMP_SITE: "https://elsewhere.example/" })).toBe("https://elsewhere.example");
  });
});

describe("an invite link", () => {
  test("swaps its token for the invite cookie and goes to the front page", async () => {
    const res = await site.get(`/i/${alice}`);
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/");
    const set = res.headers.get("set-cookie");
    expect(set).toContain(`namp_invite=${alice}`);
    expect(set).toMatch(/HttpOnly/i);
    expect(set).toMatch(/Secure/i);
    expect(set).toMatch(/SameSite=Lax/i);
    expect(set).toMatch(/Max-Age=31536000/i);
    expect(set).toMatch(/Path=\//i);
  });

  test("of an unknown or revoked token sets no cookie and says so on the page", async () => {
    for (const token of [newToken(), bob]) {
      const res = await site.get(`/i/${token}`);
      expect(res.status).toBe(303);
      expect(res.headers.get("location")).toBe("/?invite=invalid");
      expect(res.headers.get("set-cookie")).toBeNull();
    }
    const page = await (await site.get("/?invite=invalid")).text();
    expect(page).toContain("That invite link doesn't work");
  });
});

describe("the front page", () => {
  test("shows anyone what namp is and where to ask for an invite, with no install command", async () => {
    const res = await site.get("/");
    expect(res.status).toBe(200);
    const page = await res.text();
    expect(page).not.toContain("<header");
    expect(page).toContain("Not A Meat Proxy.");
    expect(page).toContain("<title>namp: scale your impact with agent sessions, without losing the thread</title>");
    expect(page).toContain("Scale your impact with agent sessions, without losing the thread.");
    expect(page).toContain('href="mailto:invites@example.com"');
    expect(page).toContain("Get an invite");
    expect(page).not.toContain("install.sh | sh");
    expect(page).not.toContain("0.2.0");
  });

  test("shows a tester their install command, the latest release and its notes", async () => {
    const res = await site.get("/", cookie(alice));
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    const page = await res.text();
    expect(page).toContain("Install namp, alice");
    // One line in one element, its words in spans the box wraps between, which Copy takes whole.
    const shown = /<div class="command[^"]*"><code[^>]*>(.*?)<\/code>/.exec(page)[1].replace(/<[^>]*>/g, "");
    expect(shown).toBe(`curl -fsSL ${site.url}/install.sh | sh -s -- ${alice}`);
    expect(page).toContain("never by downloading namp in a browser");
    expect(page).toContain("namp 0.2.0, released 2026-10-16");
    expect(page).toContain("<code>namp update</code> moves you to the next release");
  });

  // Before JS, and without it, the address is the plain text to select, with no button: the
  // chip that copies it (tests/components/address.test.js) takes its place once the page runs.
  test("shows the address to write to as plain text, for a visitor with no mail app", async () => {
    const page = await (await site.get("/")).text();
    expect(page.match(/<span class="chip plain[^"]*"[^>]*>invites@example.com<\/span>/g)).toHaveLength(2);
    expect(page).not.toContain('aria-label="Copy invites@example.com"');
  });

  test("treats a revoked tester's cookie as no invite, and drops it", async () => {
    const res = await site.get("/", cookie(bob));
    const page = await res.text();
    expect(page).not.toContain(bob);
    expect(page).toContain("That invite link doesn't work");
    expect(res.headers.get("set-cookie")).toMatch(/namp_invite=;.*Max-Age=0/i);
  });

  test("preloads namp's start faces and serves every face itself, with their licence", async () => {
    const page = await (await site.get("/")).text();
    const preloads = [...page.matchAll(/<link rel="preload" href="([^"]+)" as="font"/g)].map((m) => m[1]);
    expect(preloads).toEqual(["/fonts/FiraSans-Regular.woff2", "/fonts/FiraSansCondensed-Medium.woff2", "/fonts/FiraSansCondensed-SemiBold.woff2"]);
    const sheets = [...page.matchAll(/<link href="([^"]+\.css)" rel="stylesheet"/g)].map((m) => new URL(m[1], `${site.url}/`));
    const faces = [];
    for (const sheet of sheets) {
      const css = await (await site.get(sheet.pathname)).text();
      for (const [, face] of css.matchAll(/url\("?([^")]+\.woff2)"?\)/g)) faces.push(new URL(face, sheet).pathname);
    }
    expect(faces).toHaveLength(14);
    for (const face of [...faces, "/fonts/OFL.txt"]) expect((await site.get(face)).status, face).toBe(200);
  });
});

describe("/api/latest", () => {
  test("answers 401 with no token", async () => {
    await refusal(await site.get("/api/latest"), 401);
  });

  test("answers 403 with an unknown or a revoked token", async () => {
    await refusal(await site.get("/api/latest", bearer(newToken())), 403);
    await refusal(await site.get("/api/latest", bearer(bob)), 403);
    await refusal(await site.get("/api/latest", cookie(bob)), 403);
  });

  test("answers latest.json for a bearer token or the cookie", async () => {
    for (const headers of [bearer(alice), cookie(alice)]) {
      const res = await site.get("/api/latest", headers);
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toBe("application/json");
      expect(await res.json()).toEqual(latest);
    }
  });
});

describe("/download/<tag>/<target>", () => {
  const path = `/download/v0.2.0/${target}`;

  test("answers 401 with no token and 403 with an unknown or a revoked one", async () => {
    await refusal(await site.get(path), 401);
    await refusal(await site.get(path, bearer(newToken())), 403);
    await refusal(await site.get(path, bearer(bob)), 403);
  });

  test("redirects a tester to a presigned link of five minutes and logs who took what", async () => {
    for (const headers of [bearer(alice), cookie(alice)]) {
      const res = await site.get(path, headers);
      expect(res.status).toBe(302);
      const location = new URL(res.headers.get("location"));
      expect(`${location.origin}${location.pathname}`).toBe(`${s3.endpoint}/namp/${archive}`);
      expect(location.searchParams.get("X-Amz-Expires")).toBe("300");
      expect(location.searchParams.get("X-Amz-Signature")).toMatch(/^[0-9a-f]{64}$/);
      expect(await (await fetch(location)).text()).toBe("archive");
    }
    expect(site.log.filter((l) => l === `download tester=alice tag=v0.2.0 target=${target}`)).toHaveLength(2);
  });

  test("answers 404 for a target, tag or archive there is none of", async () => {
    for (const other of ["/download/v0.2.0/x86_64-pc-windows-msvc", `/download/latest/${target}`, `/download/v0.1.0/${target}`]) {
      const res = await site.get(other, bearer(alice));
      expect(res.status).toBe(404);
      expect(await res.text()).toMatch(/^namp: no release .*\n$/);
    }
    expect(site.log.some((l) => l.includes("tag=v0.1.0"))).toBe(false);
  });
});

describe("when the bucket refuses", () => {
  const DOWN = "namp: the release store is not answering; try again in a minute\n";

  async function unavailable(res) {
    expect(res.status).toBe(503);
    expect(res.headers.get("content-type")).toMatch(/^text\/plain/);
    expect(await res.text()).toBe(DOWN);
  }

  test("/api/latest and /download answer one line of 503 and log the S3 error", async () => {
    await site.get("/api/latest", bearer(alice));
    s3.refuse();
    try {
      await unavailable(await site.get("/api/latest", bearer(alice)));
      await unavailable(await site.get(`/download/v0.2.0/${target}`, bearer(alice)));
    } finally {
      s3.refuse(false);
    }
    expect(site.log).toContain(`bucket: GET latest.json: ${SIGNATURE.join(": ")}`);
    expect(site.log).toContain(`bucket: HEAD ${archive}: UnknownError: an unexpected error has occurred`);
    expect(site.log.some((l) => /^\s+at /.test(l))).toBe(false);
  });

  test("/install.sh answers the same 503 and logs the S3 error", async () => {
    s3.refuse();
    try {
      await unavailable(await site.get("/install.sh"));
    } finally {
      s3.refuse(false);
    }
    expect(site.log).toContain(`bucket: GET install.sh: ${SIGNATURE.join(": ")}`);
    expect((await site.get("/install.sh")).status).toBe(200);
  });

  test("the front page still shows a tester their command, and says the release can't be shown", async () => {
    await site.get("/", cookie(alice));
    s3.refuse();
    let res;
    try {
      res = await site.get("/", cookie(alice));
    } finally {
      s3.refuse(false);
    }
    expect(res.status).toBe(200);
    const page = await res.text();
    expect(page).toContain("Install namp, alice");
    expect(page).toContain("The release store is not answering, so the release isn't shown: try again in a minute.");
    expect(page).not.toContain("No release is out yet");
  });

  test("a site that never read its testers answers 503 to a token and says so on the page", async () => {
    const down = await fakeS3();
    down.refuse();
    const fresh = await startSite(down.env);
    try {
      await unavailable(await fresh.get("/api/latest", bearer(alice)));
      await unavailable(await fresh.get(`/download/v0.2.0/${target}`, bearer(alice)));
      const res = await fresh.get("/", cookie(alice));
      expect(res.status).toBe(200);
      expect(await res.text()).toContain("The site can't check your invite: the release store is not answering. Try again in a minute.");
      expect(res.headers.get("set-cookie")).toBeNull();
      expect(fresh.log).toContain(`bucket: GET testers.json: ${SIGNATURE.join(": ")}`);
      expect(fresh.log.some((l) => /^\s+at /.test(l))).toBe(false);
    } finally {
      await fresh.stop();
      await down.close();
    }
  });
});
