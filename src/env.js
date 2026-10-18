import { defineEnvVars } from "@sveltejs/kit/env";

// The variables the routes read through $app/env, each read when the server starts.
export const variables = defineEnvVars({
  // Where Ask for an invite goes, unset when there is none.
  INVITE_CONTACT: { schema: (value) => value },
});
