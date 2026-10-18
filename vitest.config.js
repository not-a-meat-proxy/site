import { sveltekit } from "@sveltejs/kit/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import { defineConfig } from "vitest/config";

// The site's tests: the built server run by bun against a fake S3, and the
// tester script against the same fake. tests/build.js builds the site once for every file of them.
// The page's components are tested apart, compiled as for the browser, on happy-dom.
export default defineConfig({
  plugins: [sveltekit(), svelteTesting()],
  test: {
    testTimeout: 30000,
    hookTimeout: 120000,
    projects: [
      {
        extends: true,
        test: { name: "site", include: ["tests/*.test.js"], globalSetup: ["tests/build.js"] },
      },
      {
        extends: true,
        test: { name: "components", include: ["tests/components/*.test.js"], environment: "happy-dom" },
      },
    ],
  },
});
