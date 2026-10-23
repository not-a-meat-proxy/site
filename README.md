# namp's site

The front site of [namp](https://namp.cloudgt.dev): the page that says what namp is, the docs for
its testers, the installer, and the routes that hand a tester the latest release. It is a
SvelteKit app run by bun, reading its releases and its testers from a private S3 bucket. Bugs,
ideas and questions about namp and this site go in this repo's issues.

The code is public to read, but no license is granted: all rights are reserved.

## Working on it

The tools come from `mise.toml` and the commands from the `justfile`; `just` lists them.

- `just setup` installs the tools and the packages, and turns on the commit-msg hook, which refuses
  a subject that isn't a Conventional Commit (`scripts/conventional.sh`).
- `just test` runs the tests: the built server against a fake S3, the tester script, the commit
  rule and the page's components. They need no bucket and no secret.
- `just dev` serves the site with hot reload, against the bucket of the `S3_*` variables.
- `bun run build`, then `PORT=3000 ORIGIN=http://localhost:3000 bun server.js`, runs the built
  server as Railway does, against the bucket of the `S3_*` variables. Without `ORIGIN` or
  `PROTOCOL_HEADER`, the server takes every request as https, so a plain-http run would put
  `https://` in the installer's default site. On Railway, the Dockerfile sets
  `PROTOCOL_HEADER=x-forwarded-proto`.
- `just tester add <name>` adds a tester and prints their invite link once, `just tester revoke
  <name>` ends it, and `just tester list` shows them. It reads and writes the bucket of the `S3_*`
  variables, which `doppler run -- just tester list` gives from a clone set up with Doppler.
- `just lint` lints the workflow and the shell scripts.

`main` takes changes only through a pull request, merged by squash, its title the commit's
subject: a Conventional Commit, `type(scope): a prose sentence`.

## Design

The design skill impeccable, v4.7.0 (tag skill-v4.7.0, commit aeeb3d8, engine v0.1.16), is
vendored under `.claude/` as namp vendors it: the skill in `.claude/skills/impeccable/` and its
four agents in `.claude/agents/impeccable-*.md`, as `npx impeccable install --providers=claude
--scope=project` writes them, unmodified, under the Apache-2.0 licence (NOTICE.md). Its hooks, in
`.claude/settings.json`, run `scripts/impeccable hook` on SessionStart, after each Edit or Write,
and on Stop.

The engine is not committed (`.gitignore`): the launcher downloads it once per machine into
`~/.impeccable/bin/0.1.16/`, checked against the release's sha256, and that download is the only
connection impeccable makes. The rest is switched off in `.claude/settings.json`'s `env` and in
`.impeccable/config.json`: `DO_NOT_TRACK=1` and `IMPECCABLE_NO_TELEMETRY=1`, with `"telemetry":
false`, stop its telemetry; `IMPECCABLE_API_TIMEOUT=0` stops the roll, the GET of /api/roll; and
`IMPECCABLE_NO_UPDATE_CHECK=1`, with `"updateCheck": false`, stops the daily version check.
`.impeccable/` keeps only `config.json` and the `design.json` sidecar in git, and none of it goes
into the image (`.dockerignore`).

To update it: `npx impeccable update` from this folder, with `HOME` pointed at a scratch folder,
then move the hooks it writes into `.claude/settings.local.json` back into `.claude/settings.json`
and update the version here and in NOTICE.md.

## Routes

Every answer sends `Referrer-Policy: no-referrer`.

- `GET /` is the front page. With the invite cookie of a tester, it shows their install command
  and the latest release with its notes.
- `GET /install.sh` is the installer, public, read from the bucket's `install.sh` with its default
  site swapped for the origin of the request, so the command a tester copies installs from the
  site it came from. It answers with `cache-control: no-cache`, or 503 with one plain-text line
  while the bucket has no installer, or one without its default-site line exactly once.
- `GET /i/<token>` sets the `namp_invite` cookie to the token (HttpOnly, Secure, SameSite=Lax, a
  year) and redirects to `/`. An unknown or revoked token sets nothing and redirects to
  `/?invite=invalid`, which says so.
- `GET /api/latest` answers `latest.json`.
- `GET /download/<tag>/<target>` answers 302 to a presigned link of the archive, valid 5 minutes,
  and logs the tester, the tag and the target.

The last two take the token as `Authorization: Bearer <token>` or as the invite cookie. They
answer 401 with no token and 403 with a revoked or unknown one, each as one plain-text line.
A bucket that fails to answer gets one plain-text line of 503 on `/install.sh`, `/api/latest` and
`/download`, and its error goes to the log.

## The bucket

- `releases/v<version>/namp-<version>-<target>.tar.gz`, a release's archive for each target:
  `x86_64-unknown-linux-musl`, `aarch64-unknown-linux-musl` and `aarch64-apple-darwin`.
- `releases/v<version>/notes.md`, a release's notes, in Markdown.
- `latest.json`, the latest release: its version, tag, commit, date, notes key, and each target's
  archive key, sha256 and size.
- `testers.json`, the testers: `{"testers":[{"name","token_sha256","created","revoked"}]}`. A
  token is 32 random bytes in base64url with no padding, and only its sha256 is kept; `revoked`
  is null until `just tester revoke`.
- `install.sh`, the installer, holding exactly one line
  `site="${NAMP_SITE:-https://namp.cloudgt.dev}"`, which `/install.sh` swaps for its origin.

namp's release process writes the releases, `latest.json` and `install.sh`; `just tester` writes
`testers.json`. The site only reads.

## Variables

- `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`: the
  bucket.
- `S3_VIRTUAL_HOSTED_STYLE=1` puts the bucket in the host rather than the path, as a Railway
  bucket wants. `S3_ENDPOINT` stays the bare endpoint, and the site adds the bucket to it.
- `INVITE_CONTACT`: where "Get an invite" goes, an email address or a link. The button shows
  only when it is set, and `just dev` sets a placeholder when it is not.
- `PORT`: the port the server listens on, 3000 by default.

## Deploying

Railway deploys the service from this repo's `main` through its GitHub integration, with Wait
for CI on: once the `test` and `commits` checks of `.github/workflows/test.yml` pass, it builds
the `Dockerfile`, as `railway.json` pins, and checks that `/` answers before it switches over.
The workflow runs on GitHub's runners with no secrets; the variables live in Railway.
