import { down, line, tester } from "#lib/server/access.js";
import { bucket, exists } from "#lib/server/bucket.js";

const TARGETS = ["x86_64-unknown-linux-musl", "aarch64-unknown-linux-musl", "aarch64-apple-darwin"];
const TAG = /^v(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/;

// A release's archive for a tester's token: a 302 to a link of the bucket that expires in five
// minutes, and a line in the log naming who took which (README, Routes).
export async function GET(event) {
  const { tester: who, refused } = await tester(event);
  if (refused) return refused;
  const { tag, target } = event.params;
  const version = TAG.exec(tag)?.[1];
  if (!version || !TARGETS.includes(target)) return line(404, `no release ${tag} for ${target}`);
  const key = `releases/${tag}/namp-${version}-${target}.tar.gz`;
  let found;
  try {
    found = await exists(key);
  } catch (err) {
    return down(err);
  }
  if (!found) return line(404, `no release ${tag} for ${target}`);
  console.log(`download tester=${who.name} tag=${tag} target=${target}`);
  return new Response(null, { status: 302, headers: { location: bucket().presign(key, { expiresIn: 300 }), "cache-control": "no-store" } });
}
