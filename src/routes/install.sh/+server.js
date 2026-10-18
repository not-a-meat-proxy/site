import script from "./install.sh?raw";

// The installer, public (README, Routes), with the site that serves it as its default: the
// origin of the request, its protocol from PROTOCOL_HEADER behind Railway's proxy, as the page's
// command says it, so that command installs from the site it was copied from. NAMP_SITE still
// names another site.
const DEFAULT = 'site="${NAMP_SITE:-https://namp.cloudgt.dev}"\n';
if (script.split(DEFAULT).length !== 2) throw new Error(`install.sh has no single default line ${DEFAULT.trim()}`);

// An origin the script can hold in double quotes: a scheme, a host and a port, nothing the shell
// expands.
const ORIGIN = /^https?:\/\/[A-Za-z0-9.-]+(:\d+)?$/;

export function GET({ url }) {
  const site = ORIGIN.test(url.origin) ? url.origin : "https://namp.cloudgt.dev";
  return new Response(script.replace(DEFAULT, () => `site="\${NAMP_SITE:-${site}}"\n`), {
    headers: { "content-type": "text/x-shellscript; charset=utf-8", "cache-control": "no-cache" },
  });
}
