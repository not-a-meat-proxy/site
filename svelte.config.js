import adapter from "@sveltejs/adapter-node";

// One Node server, run by bun (server.js): the page, install.sh and the routes that check tokens.
// The tests build it into a folder of their own, SITE_OUT.
export default {
  kit: {
    adapter: adapter({ out: process.env.SITE_OUT || "build", precompress: false }),
  },
};
