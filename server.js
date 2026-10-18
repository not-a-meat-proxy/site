// The site's server: SvelteKit's handler from the build, every answer with Referrer-Policy:
// no-referrer, the static files included, which the handler serves before any hook.
// Run by bun, whose S3 client the routes use: `bun server.js`, PORT
// picking the port, SITE_BUILD another build than ./build.
import { createServer } from "node:http";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const build = resolve(process.env.SITE_BUILD || "build");
const { handler } = await import(pathToFileURL(`${build}/handler.js`).href);

const server = createServer((req, res) => {
  res.setHeader("Referrer-Policy", "no-referrer");
  handler(req, res);
});
server.listen(Number(process.env.PORT || 3000), process.env.HOST || "0.0.0.0", () => {
  console.log(`site listening on ${server.address().port}`);
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    server.closeAllConnections();
  });
}
