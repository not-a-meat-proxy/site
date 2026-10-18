import { spawn } from "node:child_process";
import { request } from "node:http";
import { resolve } from "node:path";
import { inject } from "vitest";

const SITE = resolve(import.meta.dirname, "..");

// The built site run by bun, as Railway runs it, against the bucket env names. `log` holds the lines
// it printed, `get` asks it without following redirects, over http as Railway's proxy says it was,
// and `asHost` with the Host and protocol a request to another name would carry.
export async function startSite(env) {
  const build = inject("build");
  const child = spawn("bun", ["server.js"], {
    cwd: SITE,
    env: { ...process.env, PROTOCOL_HEADER: "x-forwarded-proto", ...env, SITE_BUILD: build, PORT: "0", HOST: "127.0.0.1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const log = [];
  let output = "";
  const port = await new Promise((done, fail) => {
    const read = (chunk) => {
      output += chunk;
      log.splice(0, log.length, ...output.split("\n").filter(Boolean));
      const listening = /site listening on (\d+)/.exec(output);
      if (listening) done(Number(listening[1]));
    };
    child.stdout.on("data", read);
    child.stderr.on("data", read);
    child.on("exit", (code) => fail(new Error(`the site exited ${code}: ${output}`)));
  });
  const url = `http://127.0.0.1:${port}`;
  return {
    url,
    log,
    get: (path, headers = {}) => fetch(url + path, { headers: { "x-forwarded-proto": "http", ...headers }, redirect: "manual" }),
    asHost: (path, host, proto) => ask(port, path, { host, "x-forwarded-proto": proto }),
    stop: () => new Promise((done) => (child.exitCode !== null ? done() : (child.once("exit", done), child.kill("SIGTERM")))),
  };
}

// A GET with headers fetch keeps to itself, Host among them: its status, headers and body.
function ask(port, path, headers) {
  return new Promise((done, fail) => {
    const req = request({ host: "127.0.0.1", port, path, headers }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => done({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on("error", fail);
    req.end();
  });
}

// `just tester ...`, as the recipe runs it from the repo's top, against the bucket env names. Never
// spawnSync: the fake S3 answers from this process.
export function tester(env, ...args) {
  const child = spawn("bun", ["scripts/tester.ts", ...args], { cwd: SITE, env: { ...process.env, ...env } });
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => (stdout += chunk));
  child.stderr.on("data", (chunk) => (stderr += chunk));
  return new Promise((done) => child.on("close", (status) => done({ status, stdout, stderr })));
}

// Waits until check() holds, rather than sleeping a guess.
export async function eventually(check, ms = 10000) {
  const until = Date.now() + ms;
  for (;;) {
    try {
      return await check();
    } catch (err) {
      if (Date.now() > until) throw err;
      await new Promise((done) => setTimeout(done, 50));
    }
  }
}
