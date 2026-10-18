import { error } from "@sveltejs/kit";
import { page, pages } from "$lib/server/docs.js";

// Every page of docs/, the overview at /docs itself.
export function entries() {
  return pages.map(({ slug }) => ({ page: slug }));
}

export function load({ params }) {
  const found = page(params.page ?? "");
  if (!found) error(404, "No such page in the docs");
  return { page: found };
}
