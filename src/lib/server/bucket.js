import { s3 } from "../s3.js";

// The private bucket, one client for the server's life.
let client;

export function bucket() {
  return (client ??= s3());
}

// The request's answer, or an error naming the request and the S3 error's code and message when the
// bucket refused it or did not answer, as the server logs it (access.js, down).
async function ask(request, op) {
  try {
    return await op();
  } catch (err) {
    throw new Error(`${request}: ${err.code ?? err.name}: ${err.message}`, { cause: err });
  }
}

// The object's text, or null when the bucket has no such key. A GET rather than a HEAD first,
// whose refusal carries no body, so a refusal names S3's own code.
export async function text(key) {
  return ask(`GET ${key}`, async () => {
    try {
      return await bucket().file(key).text();
    } catch (err) {
      if (err?.code === "NoSuchKey") return null;
      throw err;
    }
  });
}

// Whether the bucket holds the key.
export async function exists(key) {
  return ask(`HEAD ${key}`, () => bucket().file(key).exists());
}
