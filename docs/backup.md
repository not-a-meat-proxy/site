# Back up your data

namp keeps your topics, threads, answers and settings in its data folder, on your machine. It backs that folder up into a git repository you name in Settings, and pushes it to a remote you pick, such as a private repository on GitHub.

## Nothing is backed up at first

A fresh install backs up nothing: its data folder is no git repository, and namp commits and pushes nothing until you name a repository in **Settings**, under **Backup**. Settings says so under **Repository**:

```text
No repository: nothing is committed or pushed.
```

**Folders**, above it in Settings, shows where the data folder is: `~/.local/share/namp` unless you point namp at another.

## Turn it on

In **Backup**, type the repository's path in **Repository** and press **Save**. A path may start with `~`. Under the field, Settings says what it finds at that path, and looks again every few seconds while it is open. The repository can be one of three.

### A new repository, pushed to a private remote

The usual way. First make an empty private repository to push to, on GitHub or anywhere you can push from this machine, with no README: a remote that holds commits already rejects the first push. Then:

1. Type a path where nothing is yet, or an empty folder, such as `~/namp-backup`, and press **Save**. Settings says `There is no folder at /Users/you/namp-backup.`
2. Press **Create the repository**. It runs `git init` there, on `main`, and Settings says `On main, not pushed anywhere: add a remote to push to.`
3. In **Push to**, paste the remote's address, such as `git@github.com:you/namp-backup.git`, and press **Add**. namp adds it as `origin` and backs up at once, the first push setting the branch's upstream.

Settings then says where the backup goes, the remote's address under it:

```text
On main, pushes to origin/main.
```

namp pushes with your git, from a server with no terminal to type a password in: the remote has to take a `git push` from this machine as it is, through an SSH key or a credential helper that asks for nothing.

### A clone of this data folder's backup

When the folder you backed up into is gone from this machine, its remote still holds the backup: clone it, and name the clone. namp takes it as long as its last commit is the last one namp made from this data folder, and goes on from there.

A clone of any other backup, such as one another machine pushed, is refused: committing this data folder over it would remove every topic this one lacks. To bring that backup's topics here, [restore it](#restore-it-on-another-machine) instead.

### The data folder itself

Type the data folder's own path. Settings says it `is not a git repository yet` and offers **Create the repository**, then **Push to**, as for a new repository. The data folder then holds its history itself, in `.git`. It is the only folder holding files that namp makes a repository of.

## What Settings says

What the backup takes:

- `There is no folder at ...` or `... is not a git repository yet.`: **Create the repository** makes one there.
- `On main, not pushed anywhere: add a remote to push to.`: it commits, on this machine only. **Push to** adds a remote.
- `On main, pushes to origin from the next backup, which sets origin/main as its upstream.`: a remote not pushed to yet, which the next backup pushes to.
- `On main, pushes to origin/main.`: the backup commits and pushes.

In red, what it does not take, and commits nothing into:

- `... is not a git repository, and holds files: pick an empty folder or a repository.`, or `... is a file, not a folder.`
- `... is inside the repository at ..., not its top.`: name the repository's top folder, or a path outside it.
- `... is inside the data folder: pick a folder outside it.`, or `... holds the data folder`.
- `... holds no namp backup: its last commit has no .gitignore of namp's.`: another project's repository, whose files namp never replaces.
- `... holds another data folder's backup: its last commit is not the last namp made from this data folder.`: a clone of another machine's backup, or one that took commits from elsewhere since. The line goes on to say how to restore it, or to pick an empty repository.
- `... is not on a branch: check one out there.`

Until the repository is ready, the settings under it are off and **Back up now** is not there.

## What is backed up, and when

Everything in the data folder that its `.gitignore` keeps in: your topics with their canvases, threads and images, your projects, settings and agents. namp writes that `.gitignore` and keeps it current: it leaves out locks, temporary files and the build folders a session makes, such as `node_modules/` and `target/`, and keeps the lines you add. A file deleted from the data folder is deleted in the next commit. In a repository of its own, the files there are brought to each commit, so that folder reads as your data folder at the last backup.

namp commits what changed, its message naming the topics touched:

- every 10 minutes, which **Every** changes, from 1 to 1440;
- when namp stops cleanly, as when you kill the `pid` that `namp start` printed;
- when you press **Back up now**, in Settings.

Nothing changed is no commit. Each commit is then pushed. **Commit by itself** off leaves the commits to **Back up now**, and **Push after each commit** off keeps them on this machine. Under the switches, **Last commit and push** shows git's last result for each, with its time.

## When it fails

A commit or a push that fails shows on Home as a notice, at the top of the Digest: **The backup's commit failed**, or **push**, then git's reason, with **Back up now** and **Backup settings**. namp goes on working meanwhile. Most often:

- git does not know who you are, `unable to auto-detect email address`. Tell it once:

  ```sh
  git config --global user.name "Your Name"
  git config --global user.email you@example.com
  ```

- the remote rejects the push, `[rejected]`, as it holds commits the backup has not: a remote made with a README, or pushed to from elsewhere.
- the remote refuses this machine: its SSH key or credentials are missing.

Fix the cause, then press **Back up now**: the notice goes once a backup succeeds.

## Restore it on another machine

[Install namp](/docs/install) there, start it, and clone your backup's remote:

```sh
git clone git@github.com:you/namp-backup.git ~/namp-data
```

Then point namp at the clone: in **Settings**, under **Folders**, type `~/namp-data` in `data_dir`, press **Save**, then **Restart**. namp comes back on that folder, your topics, threads and answers with it.

Last, in **Backup**: **Repository** came back with your settings, and names the path of the old machine, which Settings marks as missing or in red. Replace it with the same `~/namp-data` and press **Save**, rather than creating a repository there: the clone is the data folder itself now, and Settings says `On main, pushes to origin/main.` The backup goes on in the same history, to the same remote.
