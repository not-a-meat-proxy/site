import { describe, expect, test } from "vitest";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// The one Conventional Commit rule, as the workflow's `commits` job runs it on a subject and the
// commit-msg hook on a message file.
const SITE = resolve(import.meta.dirname, "..");
const script = (subject) => spawnSync("scripts/conventional.sh", [subject], { cwd: SITE, encoding: "utf8" });

function hook(message) {
  const dir = mkdtempSync(join(tmpdir(), "namp-site-msg-"));
  try {
    writeFileSync(join(dir, "COMMIT_EDITMSG"), message);
    return spawnSync(".githooks/commit-msg", [join(dir, "COMMIT_EDITMSG")], { cwd: SITE, encoding: "utf8" });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const accepted = [
  "feat: the front page links to the docs",
  "fix(site): the installer keeps its default on a strange host",
  "feat!: the bucket holds the installer",
  'Revert "feat: the front page links to the docs"',
  "Merge branch 'main' into docs",
  "fixup! feat: the front page links to the docs",
];
const refused = ["Add the docs link", "feat:no space", "feature: the docs", "feat(two words): the docs", "feat: ", ""];

describe("conventional.sh", () => {
  test.each(accepted)("accepts %j", (subject) => {
    expect(script(subject)).toMatchObject({ status: 0, stderr: "" });
  });

  test.each(refused)("refuses %j, naming it and the types", (subject) => {
    const { status, stderr } = script(subject);
    expect(status).toBe(1);
    expect(stderr).toContain(`    ${subject}\n`);
    expect(stderr).toContain("feat, fix, perf, refactor, test, docs, build, ci, chore");
  });

  test("takes a subject as data, never running what it holds", () => {
    expect(script("feat: $(exit 1) `exit 1`").status).toBe(0);
    expect(script("$(echo feat): the docs").status).toBe(1);
  });
});

describe("the commit-msg hook", () => {
  test("checks the message's first line that is neither blank nor a comment", () => {
    expect(hook("# a comment\n\nfeat: the docs\n\nWhy, at length.\n").status).toBe(0);
    const { status, stderr } = hook("\nAdd the docs\n\nfeat: in the body\n");
    expect(status).toBe(1);
    expect(stderr).toContain("    Add the docs\n");
  });
});
