import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { expect, test } from "vitest";

// The bucket's client as the site and `just tester` build it, run by bun, whose client it is.
const S3 = resolve(import.meta.dirname, "../src/lib/s3.js");

function presign(env) {
  const script = `const { s3 } = await import(${JSON.stringify(S3)}); console.log(s3().presign("releases/v0.2.0/namp.tar.gz", { expiresIn: 300 }));`;
  const child = spawn("bun", ["-e", script], {
    env: { ...process.env, S3_ENDPOINT: "https://t3.storageapi.dev", S3_BUCKET: "namp-bucket", S3_ACCESS_KEY_ID: "a", S3_SECRET_ACCESS_KEY: "s", S3_REGION: "auto", ...env },
  });
  let out = "";
  child.stdout.on("data", (chunk) => (out += chunk));
  child.stderr.on("data", (chunk) => (out += chunk));
  return new Promise((done) => child.on("close", () => done(new URL(out.trim()))));
}

test("a virtual-hosted bucket's link names the bucket in the host", async () => {
  const link = await presign({ S3_VIRTUAL_HOSTED_STYLE: "1" });
  expect(`${link.origin}${link.pathname}`).toBe("https://namp-bucket.t3.storageapi.dev/releases/v0.2.0/namp.tar.gz");
});

test("a path-style bucket's link names the bucket in the path", async () => {
  const link = await presign({});
  expect(`${link.origin}${link.pathname}`).toBe("https://t3.storageapi.dev/namp-bucket/releases/v0.2.0/namp.tar.gz");
});
