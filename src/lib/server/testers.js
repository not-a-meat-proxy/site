import { tokenHash } from "../token.js";

// The testers of testers.json, read again once they are older than ttl, a minute unless
// TESTERS_TTL_MS says less, so a tester added or revoked counts within a minute. A read that
// fails keeps the testers already read, and fails the check only when none were ever read.
export function testers({ load, ttl, now = Date.now }) {
  let byHash = null;
  let readAt = 0;
  let reading = null;

  async function refresh() {
    try {
      const file = await load();
      byHash = new Map((file?.testers ?? []).map((t) => [t.token_sha256, t]));
      readAt = now();
    } catch (err) {
      if (!byHash) throw err;
      console.error(`testers.json: ${err.message}, keeping the testers read before`);
      readAt = now();
    } finally {
      reading = null;
    }
  }

  return {
    // The tester the token belongs to, null for an unknown or revoked one.
    async check(token) {
      if (!byHash || now() - readAt >= ttl) await (reading ??= refresh());
      const tester = byHash.get(tokenHash(token));
      return tester && !tester.revoked ? tester : null;
    },
  };
}
