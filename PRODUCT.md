# Product

<!-- impeccable:product-schema 1 -->

The product record impeccable reads before design work on namp's site. Its facts come from namp's
own PRODUCT.md, this repository's README.md and docs, and the owner's answers in the
site-design-pass topic; namp's PRODUCT.md wins on what namp is.

## Platform

web

## Users

Two visitors, served in this order:

- A developer who runs agent sessions and has heard of namp, from the owner, a link or the
  repository. They decide within a minute whether namp is worth asking an invite for. The first
  view is theirs.
- A tester of the private alpha, who arrives by their invite link. They install namp with the
  command the page shows them, run `namp start`, and then read the docs while they learn it. They
  read on a desktop most often, on a phone sometimes.

## Product Purpose

The site is namp's front: it says what namp is and why it matters, hands an invited tester their
install command and the latest release with its notes, serves the installer and the releases, and
holds the docs written for the testers. Success: a visitor who runs several agent sessions wants
to try namp and asks for an invite; a tester goes from their link to `namp start` without help;
a docs page answers its reader's question on the first read.

## Positioning

namp's own: a local, harness-agnostic place where you stay the operator of your agent sessions,
not their relay, a meat proxy, with the ways of working built into the tool: agents defined for a
role, a topic split into tasks for sibling sessions, goals with criteria a person checks,
timelines. It is not a chat client and not a terminal multiplexer.

## Operating Context

- `/`, the front page: what namp is, the app, and Get an invite, which writes to
  `INVITE_CONTACT`. With a tester's invite cookie, the same page shows their install command, the
  two steps to start and the latest release with its notes.
- `/i/<token>`, a tester's invite link: it sets the cookie and opens the front page.
- `/docs`, six pages from `docs/*.md`, written for the testers and kept in step with each
  release of namp.
- `/install.sh`, `/api/latest` and `/download/<tag>/<target>`, which namp's installer and
  `namp update` read.
- A SvelteKit app run by bun, deployed by Railway from `main`, reading its releases and testers
  from a private S3 bucket.

## Capabilities and Constraints

- namp runs on macOS (Apple Silicon) or Linux (x86-64, ARM64) with herdr, and runs Claude Code
  sessions today. Say *agent sessions*; name Claude Code only where it is today's fact.
- A private alpha: no public download, no pricing, no sign-up. An invite is asked for by mail.
- The site loads nothing from another host: its fonts are self-hosted, and it has no analytics
  and no trackers.
- The hero's screenshots are retaken from a trial server of namp at each release, and the docs'
  words are checked against each release.
- Tested by Vitest: the built server against a fake S3, the tester script, and the page's
  components on happy-dom. How a page looks is checked by screenshots.
- Colours, sizes and radii come from `src/app.css`, which DESIGN.md's frontmatter mirrors.

## Brand Commitments

- The name: namp, Not A Meat Proxy, written in lower case.
- The site looks like namp: namp's DESIGN.md is its design's first version, so the site reads as
  close kin to the app, docs included.
- Plain words written for the person.

## Evidence on Hand

- The screenshots in `static/shots/`, of namp at the release, each in Dark and Light, from a trial
  server: the hero's wide shot of a topic's canvas page with the drawer open on a question, the
  tour's wide shot of the same page with Timeline open, and the tour's two phone shots, its asks
  under the canvas bar and its Timeline. The topic is a synthetic demo whose session asks which
  day an invoice set for the 31st goes out in a shorter month.
- The app itself, which may be shown still or moving: screenshots and, where it helps, a short
  recording or a faithful live rendering of the app at work, its demo content synthetic and
  plainly so.
- The docs, and the repository on GitHub.
- No customers, testimonials, metrics, tester counts or press, and none may be invented.

## Product Principles

1. Show namp at work rather than claim it.
2. A visitor's attention is as scarce as namp's owner's: one thing at a time, the next action plain.
3. A tester's path from their link to a running namp is never in doubt.
4. Nothing reaches a third party.
5. The site is as considered as the app it presents.
