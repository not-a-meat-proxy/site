#!/bin/sh
# namp's installer:
#
#   curl -fsSL https://namp.cloudgt.dev/install.sh | sh -s -- <token>
#
# It installs the latest release for this machine from the site, with the token of your invite:
# the archive downloaded through the site's /download, checked against the sha256 /api/latest
# gives, and namp put in ~/.local/bin, NAMP_INSTALL_DIR another folder. The site and the token go
# to ~/.config/namp/install.json, which namp update reads. The site is the one that served this
# script, whose route puts its own origin in the default below, and NAMP_SITE names another.
# POSIX sh, with curl or wget, sha256sum or shasum, and tar.

set -eu

site="${NAMP_SITE:-https://namp.cloudgt.dev}"
site="${site%/}"
dir="${NAMP_INSTALL_DIR:-$HOME/.local/bin}"
token="${1:-}"

say() { printf '%s\n' "$*"; }
fail() {
	printf 'namp install: %s\n' "$*" >&2
	exit 1
}

[ -n "$token" ] || fail "no token. Run the command of your invite: curl -fsSL $site/install.sh | sh -s -- <token>"

os="$(uname -s)"
cpu="$(uname -m)"
case "$os/$cpu" in
Linux/x86_64 | Linux/amd64) target=x86_64-unknown-linux-musl ;;
Linux/aarch64 | Linux/arm64) target=aarch64-unknown-linux-musl ;;
Darwin/arm64 | Darwin/aarch64) target=aarch64-apple-darwin ;;
*) fail "no release is built for $os on $cpu: namp runs on Linux x86_64 or arm64, and on macOS on Apple silicon." ;;
esac

if command -v curl >/dev/null 2>&1; then
	fetch=curl
elif command -v wget >/dev/null 2>&1; then
	fetch=wget
else
	fail "curl or wget is needed to download namp."
fi
if command -v sha256sum >/dev/null 2>&1; then
	sum() { sha256sum "$1" | cut -d ' ' -f 1; }
elif command -v shasum >/dev/null 2>&1; then
	sum() { shasum -a 256 "$1" | cut -d ' ' -f 1; }
else
	fail "sha256sum or shasum is needed to check the download."
fi
command -v tar >/dev/null 2>&1 || fail "tar is needed to unpack the download."

tmp="$(mktemp -d "${TMPDIR:-/tmp}/namp-install.XXXXXX")"
trap 'rm -rf "$tmp"' EXIT
trap 'exit 1' HUP INT TERM

# get <url> <file> [token]: the body of a GET in <file>, no redirect followed, and on stdout its
# status, then the Location it redirects to. The token goes only to the site, never to the bucket
# a download redirects to, whose presigned link is its own authorization.
get() {
	if [ "$fetch" = curl ]; then
		if [ -n "${3:-}" ]; then
			curl -sS -o "$2" -w '%{http_code} %{redirect_url}' -H "Authorization: Bearer $3" "$1"
		else
			curl -sS -o "$2" -w '%{http_code} %{redirect_url}' "$1"
		fi
	else
		# wget keeps the body of an error with --content-on-error, and names the status and the
		# Location in its log: wget 1 on stderr, in the headers -S prints, indented; wget2 on stdout,
		# in those headers or as "HTTP response 302 Found" and "URL '...' not followed", its -q
		# hiding them all.
		if [ -n "${3:-}" ]; then
			wget -S --max-redirect=0 --content-on-error -O "$2" --header "Authorization: Bearer $3" "$1" >"$tmp/headers" 2>&1 || true
		else
			wget -S --max-redirect=0 --content-on-error -O "$2" "$1" >"$tmp/headers" 2>&1 || true
		fi
		status="$(sed -n -e 's/^ *HTTP\/[0-9.]* \([0-9][0-9][0-9]\).*/\1/p' -e 's/^HTTP response \([0-9][0-9][0-9]\) .*/\1/p' "$tmp/headers" | tail -n 1)"
		location="$(tr -d '\r' <"$tmp/headers" | sed -n -e 's/^ *[Ll]ocation: *//p' -e "s/^URL '\(.*\)' not followed.*/\1/p" | sed 's/ \[following\]$//' | head -n 1)"
		printf '%s %s' "${status:-000}" "$location"
	fi
}

# refused <url> <status> <file>: the site's own line when it refused the token, else the status.
# The site starts its lines with "namp: " for whoever reads them from curl; fail says it once.
refused() {
	line="$(head -n 1 "$3" 2>/dev/null || true)"
	line="${line#namp: }"
	case "$2" in
	401 | 403) [ -n "$line" ] && fail "$line" ;;
	000) fail "cannot reach $1." ;;
	esac
	fail "$1 answered $2${line:+: $line}"
}

answer="$(get "$site/api/latest" "$tmp/latest.json" "$token")" || fail "cannot reach $site/api/latest."
status="${answer%% *}"
[ "$status" = 200 ] || refused "$site/api/latest" "$status" "$tmp/latest.json"

# latest.json, its lines joined, read by key: the version and tag at its top, the sha256 in the
# target's own object.
json="$(tr -d '\n\r' <"$tmp/latest.json")"
field() { printf '%s' "$2" | sed -n 's/.*"'"$1"'"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p'; }
version="$(field version "$json")"
tag="$(field tag "$json")"
built="$(printf '%s' "$json" | sed -n 's/.*"'"$target"'"[[:space:]]*:[[:space:]]*{\([^}]*\)}.*/\1/p')"
want="$(field sha256 "$built" | tr 'A-F' 'a-f')"
[ -n "$version" ] && [ -n "$tag" ] || fail "$site/api/latest names no version."
[ -n "$want" ] || fail "the release $tag has no build for $target."

say "Downloading namp $version for $target."
url="$site/download/$tag/$target"
archive="$tmp/namp-$version-$target.tar.gz"
answer="$(get "$url" "$archive" "$token")" || fail "cannot reach $url."
hops=0
while :; do
	status="${answer%% *}"
	location="${answer#* }"
	case "$status" in
	200) break ;;
	301 | 302 | 303 | 307 | 308) ;;
	*) refused "$url" "$status" "$archive" ;;
	esac
	[ -n "$location" ] && [ "$location" != "$answer" ] || fail "$url redirects nowhere."
	hops=$((hops + 1))
	[ "$hops" -le 5 ] || fail "the download of $tag redirects too many times."
	case "$location" in
	http://* | https://*) url="$location" ;;
	/*) url="$(printf '%s' "$url" | sed 's|^\(https*://[^/]*\).*|\1|')$location" ;;
	*) fail "$url redirects to $location, which is no link." ;;
	esac
	answer="$(get "$url" "$archive")" || fail "cannot reach the download."
done

got="$(sum "$archive")"
[ "$got" = "$want" ] || fail "the archive's sha256 is $got, not $want as $site/api/latest says: nothing was installed."

mkdir "$tmp/unpacked"
tar -xzf "$archive" -C "$tmp/unpacked" || fail "the archive does not unpack."
[ -f "$tmp/unpacked/namp" ] || fail "the archive holds no namp."
chmod 755 "$tmp/unpacked/namp"
case "$("$tmp/unpacked/namp" --version 2>/dev/null || true)" in
"namp $version ("*) ;;
*) fail "the namp downloaded does not run on this machine as namp $version." ;;
esac

# Written beside the one there and renamed over it, never changed in place: macOS ends a signed
# binary changed in place, a running one included.
mkdir -p "$dir"
cp "$tmp/unpacked/namp" "$dir/.namp.$$"
chmod 755 "$dir/.namp.$$"
mv -f "$dir/.namp.$$" "$dir/namp" || {
	rm -f "$dir/.namp.$$"
	fail "cannot install namp in $dir."
}

config="$HOME/.config/namp"
mkdir -p "$config"
escape() { printf '%s' "$1" | sed 's/[\\"]/\\&/g'; }
(
	umask 077
	printf '{"site": "%s", "token": "%s"}\n' "$(escape "$site")" "$(escape "$token")" >"$config/install.json.$$"
)
chmod 600 "$config/install.json.$$"
mv -f "$config/install.json.$$" "$config/install.json"

say "namp $version is installed in $dir/namp."

missing=0
if ! command -v herdr >/dev/null 2>&1; then
	missing=1
	say ""
	say "namp runs its sessions in herdr, which is not installed: get it from https://github.com/herdrdev/herdr"
fi
if ! command -v claude >/dev/null 2>&1; then
	missing=1
	say ""
	say "namp's sessions are Claude Code's, which is not installed: get it with"
	say "  curl -fsSL https://claude.ai/install.sh | bash"
fi

say ""
case ":$PATH:" in
*":$dir:"*) run=namp ;;
*)
	run="$dir/namp"
	say "$dir is not on your PATH: add it in your shell's profile, or run namp as $run."
	say ""
	;;
esac
if [ "$missing" = 0 ]; then
	say "Start namp from a herdr pane with:"
else
	say "Once they are there, start namp from a herdr pane with:"
fi
say "  $run start"
say "and open the link it prints. $run update moves it to a newer release."
