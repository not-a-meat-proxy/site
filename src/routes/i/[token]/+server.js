import { COOKIE, check } from "$lib/server/access.js";
import { redirect } from "@sveltejs/kit";

// An invite link: its token swapped for the invite cookie, then the plain front page, so the token
// leaves the address bar. A link that names no tester sets nothing and says so on the page.
export async function GET({ params, cookies }) {
  let valid = false;
  try {
    valid = !!(await check(params.token));
  } catch (err) {
    console.error(`testers.json: ${err.message}`);
  }
  if (!valid) redirect(303, "/?invite=invalid");
  cookies.set(COOKIE, params.token, { path: "/", httpOnly: true, secure: true, sameSite: "lax", maxAge: 365 * 24 * 60 * 60 });
  redirect(303, "/");
}
