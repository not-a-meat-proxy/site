import { pages } from "$lib/server/docs.js";

// The docs are built into files with the site: no bucket, no cookie, the same for everyone.
export const prerender = true;

// The sidebar: each page's title and address, and its sections.
export function load() {
  return { pages: pages.map(({ path, title, sections }) => ({ path, title, sections })) };
}
