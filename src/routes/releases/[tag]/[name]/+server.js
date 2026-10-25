import { COOKIE, check, down, line } from "#lib/server/access.js";
import { bytes, releaseImage } from "#lib/server/bucket.js";

const TYPES = { webp: "image/webp", png: "image/png" };

// A release's notes image for a tester with the invite cookie, as the front page checks it, read
// from its one bucket key. Anyone else, and any tag or name there is none of, gets the same 404.
export async function GET({ cookies, params }) {
  const missing = line(404, "no such image");
  const key = releaseImage(params.tag, params.name);
  const token = cookies.get(COOKIE);
  if (!key || !token) return missing;
  let body;
  try {
    if (!(await check(token))) return missing;
    body = await bytes(key);
  } catch (err) {
    return down(err);
  }
  if (body === null) return missing;
  return new Response(body, {
    headers: {
      "content-type": TYPES[params.name.split(".").pop()],
      "cache-control": "private, max-age=86400",
      "x-content-type-options": "nosniff",
    },
  });
}
