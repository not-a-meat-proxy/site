import { createServer } from "node:http";

// A fake of the bucket's S3: path-style objects in memory, GET, HEAD and PUT, each request refused
// unless it is signed, by its Authorization header or a presigned link's query. `objects` holds what
// is in it, by key, and `requests` what came, `METHOD /key`. `refuse()` has it answer every request
// 403 as a bucket does a wrong secret, an S3 XML error, `refuse("PUT")` only each PUT, and
// `refuse(false)` none again.
export async function fakeS3(bucket = "namp") {
  const objects = new Map();
  const requests = [];
  let refusing = false;
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://s3");
    const prefix = `/${bucket}/`;
    const signed = req.headers.authorization?.startsWith("AWS4-HMAC-SHA256") || url.searchParams.has("X-Amz-Signature");
    const key = decodeURIComponent(url.pathname.slice(prefix.length));
    requests.push(`${req.method} /${key}`);
    if (refusing === true || refusing === req.method) return answer(res, 403, req.method === "HEAD" ? "" : error(...SIGNATURE));
    if (!signed || !url.pathname.startsWith(prefix)) return answer(res, 403, error("AccessDenied"));
    if (req.method === "PUT") {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      objects.set(key, Buffer.concat(chunks));
      return answer(res, 200, "");
    }
    const body = objects.get(key);
    if (body === undefined) return answer(res, 404, req.method === "HEAD" ? "" : error("NoSuchKey"));
    res.writeHead(200, { "content-length": body.length, "content-type": "application/octet-stream" });
    res.end(req.method === "HEAD" ? undefined : body);
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  const endpoint = `http://127.0.0.1:${server.address().port}`;
  return {
    objects,
    requests,
    endpoint,
    refuse: (on = true) => (refusing = on),
    put: (key, body) => objects.set(key, Buffer.from(typeof body === "string" ? body : JSON.stringify(body))),
    json: (key) => JSON.parse(objects.get(key).toString()),
    env: { S3_ENDPOINT: endpoint, S3_BUCKET: bucket, S3_ACCESS_KEY_ID: "test", S3_SECRET_ACCESS_KEY: "test-secret", S3_REGION: "us-east-1" },
    close: () => new Promise((done) => server.close(done)),
  };
}

export const SIGNATURE = ["SignatureDoesNotMatch", "The request signature we calculated does not match the signature you provided."];

function error(code, message = code) {
  return `<?xml version="1.0" encoding="UTF-8"?><Error><Code>${code}</Code><Message>${message}</Message></Error>`;
}

function answer(res, status, body) {
  res.writeHead(status, { "content-type": "application/xml", "content-length": Buffer.byteLength(body) });
  res.end(body);
}
