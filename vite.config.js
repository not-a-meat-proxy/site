import adapter from "@sveltejs/adapter-node";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

// One Node server, run by bun (server.js): the page, install.sh and the routes that check tokens.
// The tests build it into a folder of their own, SITE_OUT. SvelteKit writes the variables of the
// process that runs it into .svelte-kit: the tests keep its files elsewhere, the build in SITE_KIT
// and Vitest in a folder of its own, or they would hand a running `just dev` none, "Get an invite"
// gone until it restarts.
const kit = process.env.SITE_KIT || (process.env.VITEST ? "node_modules/.cache/site-kit-vitest" : ".svelte-kit");

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter({ out: process.env.SITE_OUT || "build", precompress: false }),
      outDir: kit,
    }),
  ],
});
