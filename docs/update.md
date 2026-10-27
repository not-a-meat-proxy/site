# Update namp

`namp update` moves your install to the latest release, from the site you installed from, with your invite.

## Check for a new release

```sh
namp update --check
```

```text
namp 0.9.0 is out, this is 0.8.0: namp update installs it.
```

When you have the latest, it says `namp 0.9.0 is the latest release.` It only checks: it changes nothing.

## Update

```sh
namp update
```

```text
namp 0.9.0 is installed in /Users/you/.local/bin/namp, in place of 0.8.0.
The server on port 4321 runs 0.9.0 now: http://localhost:4321/__session/
```

It downloads the release for your machine, checks its sha256, and puts the new namp in place of the old one. When you have the latest already, it says so and changes nothing.

## What happens to a running server

When namp's server runs on port 4321, `namp update` restarts it on the new version. A page you have open picks the server up again without a reload, and your topics, threads and answers stay as they were. The first time it needs a part the update replaced, it reloads by itself, never over something you are typing: a part that still does not load says so in its place, with **Reload**.

A server on another port is restarted with `namp update --port <port>`. When none runs, the update says so, and the next `namp start` runs the new version:

```text
No server runs on port 4321: namp start starts it.
```

The release notes of the latest version are on namp's front page, opened through your invite link.

## If your server backed up its data folder

Before 0.2.0, namp committed and pushed its data folder by itself whenever that folder was a git repository. From 0.2.0, it backs up only into the repository named in **Settings**, under **Backup**, which the update leaves empty: a server that was backing up stops, and nothing on Home says so.

To go on in the same history, type the data folder's path in **Repository**, `~/.local/share/namp` unless you moved it, and press **Save**. Settings then says where it pushes. [Back up your data](/docs/backup) says the rest.
