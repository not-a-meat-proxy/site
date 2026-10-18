import { down, line } from "#lib/server/access.js";
import { text } from "#lib/server/bucket.js";

// The installer, public (README, Routes), read from the bucket's install.sh (README, The bucket)
// with the site that serves it as its default: the origin of the request, its protocol from
// PROTOCOL_HEADER behind Railway's proxy, as the page's command says it, so that command installs
// from the site it was copied from. NAMP_SITE still names another site.
const DEFAULT = 'site="${NAMP_SITE:-https://namp.cloudgt.dev}"\n';

// An origin the script can hold in double quotes: a scheme, a host and a port, nothing the shell
// expands.
const ORIGIN = /^https?:\/\/[A-Za-z0-9.-]+(:\d+)?$/;

export async function GET({ url }) {
  let script;
  try {
    script = await text("install.sh");
  } catch (err) {
    return down(err);
  }
  // A file without its one default line would install from a site nobody chose: refuse it as unpublished.
  if (script === null || script.split(DEFAULT).length !== 2) return line(503, "the installer is not published yet; try again later");
  const site = ORIGIN.test(url.origin) ? url.origin : "https://namp.cloudgt.dev";
  return new Response(script.replace(DEFAULT, () => `site="\${NAMP_SITE:-${site}}"\n`), {
    headers: { "content-type": "text/x-shellscript; charset=utf-8", "cache-control": "no-cache" },
  });
}
