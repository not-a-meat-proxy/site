import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// The site built once for every test file, into a folder of its own rather than build/, which a
// deploy builds: the files start it with tests/site.js.
export default function setup({ provide }) {
  const dir = mkdtempSync(join(tmpdir(), "namp-site-"));
  const out = join(dir, "build");
  try {
    execFileSync("bun", ["--bun", "vite", "build", "--logLevel", "error"], { env: { ...process.env, SITE_OUT: out }, stdio: "pipe" });
  } catch (err) {
    throw new Error(`the site's build failed:\n${err.stdout}${err.stderr}`);
  }
  provide("build", out);
  return () => rmSync(dir, { recursive: true, force: true });
}
