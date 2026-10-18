// The alpha testers in the bucket's testers.json: `add <name>` makes a
// token, keeps only its sha256 and prints the invite link once, `revoke <name>` ends it, `list`
// shows them. The bucket comes from the S3_* variables; NAMP_SITE names another site than
// https://namp.cloudgt.dev in the link.
import { s3 } from "../src/lib/s3.js";
import { NAME, newToken, tokenHash } from "../src/lib/token.js";

type Tester = { name: string; token_sha256: string; created: string; revoked: string | null };

const file = s3().file("testers.json");
const site = (process.env.NAMP_SITE || "https://namp.cloudgt.dev").replace(/\/+$/, "");

function fail(message: string): never {
  console.error(`tester: ${message}`);
  process.exit(1);
}

// The request's answer, or the one line saying what the bucket answered instead, its S3 error's
// code and message as Bun gives them, and where the S3_* values come from, with no stack.
async function ask<T>(request: string, op: () => Promise<T>): Promise<T> {
  try {
    return await op();
  } catch (err) {
    const { code, name, message } = err as { code?: string; name: string; message: string };
    fail(
      `${request} on the bucket failed: ${code ?? name}: ${message}; check the S3_* values, ` +
        "as doppler run -- just tester ... gives them from a clone linked to namp/prd",
    );
  }
}

// A GET rather than a HEAD first, whose refusal carries no body, so a refusal names S3's own code.
async function read(): Promise<Tester[]> {
  return ask("GET testers.json", async () => {
    try {
      return JSON.parse(await file.text()).testers;
    } catch (err) {
      if ((err as { code?: string }).code === "NoSuchKey") return [];
      throw err;
    }
  });
}

async function write(testers: Tester[]) {
  await ask("PUT testers.json", () => file.write(`${JSON.stringify({ testers }, null, 2)}\n`, { type: "application/json" }));
}

const [command, name, ...rest] = process.argv.slice(2);
if (rest.length) fail(`too many arguments: ${rest.join(" ")}`);

if (command === "add" && name) {
  if (!NAME.test(name)) fail(`${name} is not a name: letters, digits, '.', '_' and '-', 64 at most`);
  const testers = await read();
  if (testers.some((t) => t.name === name && !t.revoked)) fail(`${name} has an invite already: revoke it first`);
  const token = newToken();
  await write([...testers, { name, token_sha256: tokenHash(token), created: new Date().toISOString(), revoked: null }]);
  console.log(`${name}'s invite, shown this once: send it to them yourself`);
  console.log(`${site}/i/${token}`);
} else if (command === "revoke" && name) {
  const testers = await read();
  const tester = testers.find((t) => t.name === name && !t.revoked);
  if (!tester) fail(`no tester ${name} with an invite`);
  tester.revoked = new Date().toISOString();
  await write(testers);
  console.log(`${name}'s invite is revoked: the site refuses it within a minute`);
} else if (command === "list" && !name) {
  const testers = await read();
  if (!testers.length) console.log("no testers yet: just tester add <name>");
  for (const t of testers) console.log(`${t.name}\tadded ${t.created}\t${t.revoked ? `revoked ${t.revoked}` : "active"}`);
} else {
  fail("usage: just tester add <name> | revoke <name> | list");
}
