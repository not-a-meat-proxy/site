# Install namp

One command from your invite installs namp, then `namp start` runs it.

## What you need

- macOS on Apple Silicon, or Linux on x86_64 or arm64.
- [herdr](https://github.com/herdrdev/herdr): namp runs its sessions in herdr's panes.
- [Claude Code](https://claude.com/claude-code), logged in: namp's sessions are Claude Code's today.
- curl or wget, tar, and sha256sum or shasum, which most systems have already.

## Run the command from your invite

Your invite link opens namp's front page with your install command on it, your token in it. Copy it from there and run it in a terminal. It reads:

```sh
curl -fsSL https://namp.cloudgt.dev/install.sh | sh -s -- <token>
```

The token is yours alone: keep it to yourself. On a Mac, install with the command, never by downloading namp in a browser: macOS stops a binary a browser downloaded from running, and this alpha isn't notarized.

It downloads the latest release for your machine, checks its sha256, and says where namp went:

```text
Downloading namp 0.5.0 for aarch64-apple-darwin.
namp 0.5.0 is installed in /Users/you/.local/bin/namp.

Start namp from a herdr pane with:
  namp start
and open the link it prints. namp update moves it to a newer release.
```

## Where it goes

- **namp itself** goes in `~/.local/bin/namp`. When that folder is not on your `PATH`, the installer says so: add it in your shell's profile, or run namp by its full path.
- **Your invite** goes in `~/.config/namp/install.json`, readable by you alone: the site you installed from and your token, which `namp update` reads.

When herdr or Claude Code is missing, the installer still installs namp and says where to get them.

### If it stops

It installs nothing when something is wrong, and says what in one line:

- `this invite is unknown or revoked`: the token was copied wrong, or the invite was revoked. Ask for a new one.
- `no release is built for ...`: namp does not run on this system or processor yet.
- `the archive's sha256 is ...`: the download was damaged. Run the command again.

## Start namp

In a herdr pane, run:

```sh
namp start
```

```text
ready http://localhost:4321/__session/  pid 48213
```

It starts namp's server in the background, on port 4321, and prints the page's address: open it in your browser. The server starts your Main session in herdr, the session you talk to in the page's Chat. Run it outside herdr and the server starts no session.

Run `namp start` again and it says it runs already, with the same address. `--port` picks another port. To stop the server, kill the `pid` it printed.

Your topics stay on this machine, and nothing is backed up until you ask: [Back up your data](/docs/backup) says how.
