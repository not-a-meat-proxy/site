import adapter from "@sveltejs/adapter-node";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

// One Node server, run by bun (server.js): the page, install.sh and the routes that check tokens.
// The tests build it into a folder of their own, SITE_OUT. The code imports src/lib as $lib.
export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter({ out: process.env.SITE_OUT || "build", precompress: false }),
      alias: { $lib: "src/lib" },
    }),
  ],
});
