import { afterAll, beforeAll, expect, test } from "vitest";
import { tokenHash } from "../src/lib/token.js";
import { SIGNATURE, fakeS3 } from "./s3.js";
import { eventually, startSite, tester } from "./site.js";

// `just tester add/revoke/list` against a fake S3, and the site seeing each change.
let s3, site, env;

beforeAll(async () => {
  s3 = await fakeS3();
  env = { ...s3.env, NAMP_SITE: "https://namp.example" };
  site = await startSite({ ...s3.env, TESTERS_TTL_MS: "200" });
});

afterAll(async () => {
  await site?.stop();
  await s3?.close();
});

const invite = (stdout) => /^https:\/\/namp\.example\/i\/([A-Za-z0-9_-]+)$/m.exec(stdout)?.[1];

test("add prints the invite link once and keeps only the token's hash", async () => {
  const run = await tester(env, "add", "carol");
  expect(run.status).toBe(0);
  const token = invite(run.stdout);
  expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
  expect(Buffer.from(token, "base64url")).toHaveLength(32);
  const stored = s3.objects.get("testers.json").toString();
  expect(stored).not.toContain(token);
  const [carol] = s3.json("testers.json").testers;
  expect(carol).toEqual({ name: "carol", token_sha256: tokenHash(token), created: expect.any(String), revoked: null });
  expect(new Date(carol.created).toISOString()).toBe(carol.created);
  expect((await tester(env, "list")).stdout).not.toContain(token);
});

test("the site lets a new tester in and shuts a revoked one out within its reread", async () => {
  const token = invite((await tester(env, "add", "dave")).stdout);
  const latest = () => site.get("/api/latest", { authorization: `Bearer ${token}` });
  await eventually(async () => expect((await latest()).status).toBe(404));

  const revoke = await tester(env, "revoke", "dave");
  expect(revoke.status).toBe(0);
  expect(s3.json("testers.json").testers.find((t) => t.name === "dave").revoked).toEqual(expect.any(String));
  await eventually(async () => expect((await latest()).status).toBe(403));
});

test("list shows each tester and whether their invite holds", async () => {
  await tester(env, "add", "erin");
  await tester(env, "revoke", "erin");
  const { status, stdout } = await tester(env, "list");
  expect(status).toBe(0);
  expect(stdout).toMatch(/^carol\tadded \S+\tactive$/m);
  expect(stdout).toMatch(/^erin\tadded \S+\trevoked \S+$/m);
});

test("refuses a second invite for a name, a bad name, an unknown revoke and a wrong command", async () => {
  await tester(env, "add", "frank");
  for (const args of [["add", "frank"], ["add", "fr ank"], ["revoke", "nobody"], ["remove", "frank"], []]) {
    const run = await tester(env, ...args);
    expect(run.status, args.join(" ")).toBe(1);
    expect(run.stderr).toMatch(/^tester: /);
  }
});

test("list says so when there are no testers", async () => {
  const empty = await fakeS3();
  expect((await tester(empty.env, "list")).stdout).toBe("no testers yet: just tester add <name>\n");
  await empty.close();
});

test("says in one line what the bucket answered when it refuses or cannot be reached", async () => {
  const refusing = await fakeS3();
  refusing.refuse();
  const readOnly = await fakeS3();
  readOnly.refuse("PUT");
  const unreachable = { ...refusing.env, S3_ENDPOINT: "http://127.0.0.1:1" };
  const hint = "; check the S3_* values, as doppler run -- just tester ... gives them from a clone linked to namp/prd\n";
  for (const [env, args, request, error] of [
    [refusing.env, ["list"], "GET testers.json", SIGNATURE.join(": ")],
    [refusing.env, ["add", "gina"], "GET testers.json", SIGNATURE.join(": ")],
    [refusing.env, ["revoke", "gina"], "GET testers.json", SIGNATURE.join(": ")],
    [readOnly.env, ["add", "gina"], "PUT testers.json", SIGNATURE.join(": ")],
    [unreachable, ["list"], "GET testers.json", "ConnectionRefused: an unexpected error has occurred"],
  ]) {
    const run = await tester(env, ...args);
    expect(run.status, args.join(" ")).toBe(1);
    expect(run.stdout).toBe("");
    expect(run.stderr).toBe(`tester: ${request} on the bucket failed: ${error}${hint}`);
  }
  await refusing.close();
  await readOnly.close();
});
