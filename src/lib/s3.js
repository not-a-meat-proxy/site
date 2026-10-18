// The bucket's S3 client, from the S3_* variables (README), for the site and `just tester`.
// S3_VIRTUAL_HOSTED_STYLE=1 puts the bucket in the host, as a Railway Bucket made today wants: bun
// does so only when the endpoint already names it, so the endpoint becomes S3_ENDPOINT with the
// bucket as its first label, as namp's release publishing does. A local S3 such as MinIO takes the default, the
// bucket in the path.
export function s3(env = process.env) {
  const virtual = env.S3_VIRTUAL_HOSTED_STYLE === "1";
  const endpoint = new URL(env.S3_ENDPOINT);
  if (virtual) endpoint.hostname = `${env.S3_BUCKET}.${endpoint.hostname}`;
  return new Bun.S3Client({
    endpoint: endpoint.origin,
    bucket: env.S3_BUCKET,
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    region: env.S3_REGION,
    virtualHostedStyle: virtual,
  });
}
