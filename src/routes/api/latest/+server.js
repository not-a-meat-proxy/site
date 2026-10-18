import { down, line, tester } from "#lib/server/access.js";
import { text } from "#lib/server/bucket.js";

// latest.json as publish wrote it, for a tester's token (README, Routes).
export async function GET(event) {
  const { refused } = await tester(event);
  if (refused) return refused;
  let latest;
  try {
    latest = await text("latest.json");
  } catch (err) {
    return down(err);
  }
  if (latest === null) return line(404, "no release is out yet");
  return new Response(latest, { headers: { "content-type": "application/json", "cache-control": "no-store" } });
}
