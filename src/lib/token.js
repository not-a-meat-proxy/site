import { createHash, randomBytes } from "node:crypto";

// A tester's token is 32 random bytes in base64url with no padding, and only its sha256 is kept,
// in testers.json (README, The bucket).
export function newToken() {
  return randomBytes(32).toString("base64url");
}

export function tokenHash(token) {
  return createHash("sha256").update(token).digest("hex");
}

// What `just tester add` accepts as a name: it shows in the download log as one word.
export const NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
