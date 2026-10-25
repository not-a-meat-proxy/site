import { INVITE_CONTACT } from "$app/env/private";
import { COOKIE, check } from "#lib/server/access.js";
import { releaseImage, text } from "#lib/server/bucket.js";
import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt({ html: false, linkify: true });

// A notes image linked as <tag>/<name>, as namp's docs/releases/<tag>.md links its own, shows from
// /releases/<tag>/<name>, loaded as it comes near, and opens whole in a tab of its own, its text too small
// to read at the notes' width; any other image shows as its alt text alone.
markdown.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const alt = self.renderInlineAsText(token.children, options, env);
  const [tag, name, ...rest] = token.attrGet("src").split("/");
  if (rest.length || !releaseImage(tag, name)) return markdown.utils.escapeHtml(alt);
  const src = `/releases/${tag}/${name}`;
  token.attrSet("src", src);
  token.attrSet("alt", alt);
  token.attrSet("loading", "lazy");
  return `<a href="${src}" target="_blank" rel="noopener">${self.renderToken(tokens, idx, options)}</a>`;
};

// Where Ask for an invite goes: INVITE_CONTACT as a link, or an address written to.
function contact() {
  const to = INVITE_CONTACT?.trim();
  if (!to) return null;
  return /^(https?:|mailto:)/.test(to) ? to : to.includes("@") ? `mailto:${to}` : null;
}

// The latest release and its notes, when it has some, or null before the first.
async function latest() {
  const raw = await text("latest.json");
  if (raw === null) return null;
  const release = JSON.parse(raw);
  const notes = release.notes ? await text(release.notes) : null;
  return { version: release.version, date: release.date, notes: notes ? markdown.render(notes) : null };
}

// The front page: what namp is to anyone, and to a tester with the invite cookie their install
// command and the latest release.
export async function load({ cookies, url, setHeaders }) {
  const page = { contact: contact(), site: url.origin, invalid: url.searchParams.has("invite") };
  const token = cookies.get(COOKIE);
  if (!token) return page;
  setHeaders({ "cache-control": "private, no-store" });
  let tester = null;
  try {
    tester = await check(token);
  } catch (err) {
    console.error(`bucket: ${err.message}`);
    return { ...page, down: true };
  }
  if (!tester) {
    cookies.delete(COOKIE, { path: "/" });
    return { ...page, invalid: true };
  }
  try {
    return { ...page, tester: { name: tester.name, token }, release: await latest() };
  } catch (err) {
    console.error(`bucket: ${err.message}`);
    return { ...page, tester: { name: tester.name, token }, release: null, down: true };
  }
}
