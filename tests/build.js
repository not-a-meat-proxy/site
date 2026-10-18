import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// The site built once for every test file, into a folder of its own rather than build/, which a
// deploy builds: the files start it with tests/site.js. SvelteKit's files go in a folder of their
// own too, inside the project so that they resolve its packages, never in the .svelte-kit of a
// running `just dev` (vite.config.js).
export default function setup({ provide }) {
  const dir = mkdtempSync(join(tmpdir(), "namp-site-"));
  const out = join(dir, "build");
  mkdirSync("node_modules/.cache", { recursive: true });
  const kit = mkdtempSync("node_modules/.cache/site-kit-");
  const clean = () => {
    rmSync(dir, { recursive: true, force: true });
    rmSync(kit, { recursive: true, force: true });
  };
  try {
    execFileSync("bun", ["--bun", "vite", "build", "--logLevel", "error"], { env: { ...process.env, SITE_OUT: out, SITE_KIT: kit }, stdio: "pipe" });
  } catch (err) {
    clean();
    throw new Error(`the site's build failed:\n${err.stdout}${err.stderr}`);
  }
  provide("build", out);
  return clean;
}
