import { text } from "./bucket.js";
import { testers } from "./testers.js";

export const COOKIE = "namp_invite";

const known = testers({
  load: async () => JSON.parse((await text("testers.json")) ?? '{"testers": []}'),
  ttl: Math.min(Number(process.env.TESTERS_TTL_MS || 60000), 60000),
});

// The token a request carries, its Authorization: Bearer first, then the invite cookie.
export function tokenOf({ request, cookies }) {
  const auth = request.headers.get("authorization") ?? "";
  const bearer = /^Bearer\s+(\S+)\s*$/i.exec(auth);
  return bearer ? bearer[1] : cookies.get(COOKIE) || null;
}

export function check(token) {
  return known.check(token);
}

// One line of plain text, as curl and namp update print it.
export function line(status, text, headers = {}) {
  return new Response(`namp: ${text}\n`, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}

// The 503 of a bucket that refused or did not answer, its error logged for the owner.
export function down(err) {
  console.error(`bucket: ${err.message}`);
  return line(503, "the release store is not answering; try again in a minute");
}

// The tester of the request, or the 401 or 403 that refuses it (README, Routes).
export async function tester(event) {
  const token = tokenOf(event);
  const site = event.url.origin;
  if (!token) return { refused: line(401, `this needs an invite: ask for one at ${site}`, { "www-authenticate": "Bearer" }) };
  let found;
  try {
    found = await check(token);
  } catch (err) {
    return { refused: down(err) };
  }
  if (!found) return { refused: line(403, `this invite is unknown or revoked: ask for a new one at ${site}`) };
  return { tester: found, token };
}
