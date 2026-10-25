# Report an issue

Bugs, ideas and questions about namp and this site go in the site's issues on GitHub, where you can follow what becomes of them.

## Get the versions

Run these three in a terminal:

```sh
namp --version
claude --version
herdr --version
```

```text
namp 0.6.0 (42f6a3a 2026-10-25)
2.1.292 (Claude Code)
herdr 0.9.3
```

namp's line names its version, the commit it was built from and that commit's date: paste it whole.

## Pick a form

Open [the new issue page](https://github.com/not-a-meat-proxy/site/issues/new/choose), signed in to GitHub, and pick:

- **Bug**, for something namp or the site did wrong. It asks for `namp --version`, your system and processor, and what happened and what you expected. The other two versions and the steps to reproduce help, and so does a screenshot.
- **Idea or question**, for anything else, with `namp --version` if you have it.

> Issues are public. Leave out your invite token, and anything of your work you would not publish: its paths, its code, its screenshots.

## What happens next

A maintainer triages your issue, and may ask you for more there. Once a fix ships, they reply on the issue naming the version that has it: [`namp update`](/docs/update) gets it.
