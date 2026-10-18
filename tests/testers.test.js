import { expect, test } from "vitest";
import { testers } from "../src/lib/server/testers.js";
import { tokenHash } from "../src/lib/token.js";

// The site's copy of testers.json, read again once a minute old.
const file = (revoked = null) => ({ testers: [{ name: "alice", token_sha256: tokenHash("t"), created: "", revoked }] });

function clock() {
  let at = 0;
  return { now: () => at, pass: (ms) => (at += ms) };
}

test("a revoke counts once the copy is a minute old, not before", async () => {
  const time = clock();
  let current = file();
  const known = testers({ load: async () => current, ttl: 60000, now: time.now });
  expect((await known.check("t")).name).toBe("alice");
  current = file("2026-10-16T13:00:00Z");
  time.pass(59999);
  expect((await known.check("t")).name).toBe("alice");
  time.pass(1);
  expect(await known.check("t")).toBeNull();
});

test("an unknown token is no tester", async () => {
  const known = testers({ load: async () => file(), ttl: 60000 });
  expect(await known.check("other")).toBeNull();
});

test("a read that fails keeps the testers read before, and fails with none", async () => {
  const time = clock();
  let fail = false;
  const known = testers({ load: async () => (fail ? Promise.reject(new Error("down")) : file()), ttl: 1000, now: time.now });
  expect((await known.check("t")).name).toBe("alice");
  fail = true;
  time.pass(1000);
  expect((await known.check("t")).name).toBe("alice");

  const never = testers({ load: async () => Promise.reject(new Error("down")), ttl: 1000 });
  await expect(never.check("t")).rejects.toThrow("down");
});

test("checks at once share one read", async () => {
  let reads = 0;
  const known = testers({ load: async () => (reads++, file()), ttl: 60000 });
  await Promise.all([known.check("t"), known.check("t"), known.check("t")]);
  expect(reads).toBe(1);
});
