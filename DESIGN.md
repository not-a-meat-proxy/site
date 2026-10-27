---
name: namp's site
description: "The front of namp, Not A Meat Proxy, in the app's own look: what it is, the invite, the install and the testers' docs"
colors:
  # Each colour by its role, src/app.css's: Dark, the default, under the role's name.
  bay-rail: "#15171a"
  bay-side: "#1b1e21"
  bay-ink: "#dadee2"
  bay-muted: "#99a0a8"
  bay-line: "#42484f"
  bay-strip: "#272b30"
  bay-on: "#d6dbe0"
  bay-on-ink: "#15181b"
  bay-ask: "#f5995a"
  bay-work: "#58c9a1"
  bg: "#1c2225"
  surface: "#252c30"
  sunken: "#20272a"
  hover: "#2b3337"
  selected: "#323b40"
  ink: "#d8dfe2"
  ink-2: "#bcc5ca"
  muted: "#9aa5ab"
  faint: "#818b90"
  on-accent: "#0d1e19"
  line: "#333c41"
  line-strong: "#4c575e"
  edge: "#788389"
  accent: "#58c9a1"
  accent-ink: "#69cfab"
  accent-soft: "#213d35"
  accent-line: "#33705d"
  ask: "#f5883f"
  ask-ink: "#f59f63"
  ask-soft: "#3a291d"
  ask-count: "#f59f63"
  on-ask: "#1f140b"
  ask-wash: "#3e3732"
  alert: "#f060a6"
  alert-ink: "#f487bb"
  alert-soft: "#3d2130"
  ok: "#52c987"
  ok-ink: "#52c987"
  ok-soft: "#1b3529"
  band-you: "#a28bf2"
  band-own: "#5f9bf5"
  band-task: "#2cc0d8"
  code-ink: "#e2e7e9"
  dim: "rgba(8, 10, 12, .5)"
  # Light, each role as <role>-light.
  bay-rail-light: "#1d2024"
  bay-side-light: "#26292e"
  bay-ink-light: "#eceef0"
  bay-muted-light: "#a9afb6"
  bay-line-light: "#4a5057"
  bay-strip-light: "#32363c"
  bay-on-light: "#f3f6f9"
  bay-on-ink-light: "#16191c"
  bay-ask-light: "#f5995a"
  bay-work-light: "#58c9a1"
  bg-light: "#f3f6f9"
  surface-light: "#ffffff"
  sunken-light: "#ebeef2"
  hover-light: "#eceff3"
  selected-light: "#e3e8ec"
  ink-light: "#1d2227"
  ink-2-light: "#40474f"
  muted-light: "#61676f"
  faint-light: "#7c8188"
  on-accent-light: "#ffffff"
  line-light: "#dfe3e7"
  line-strong-light: "#c2c8cf"
  edge-light: "#80868d"
  accent-light: "#428069"
  accent-ink-light: "#3c7560"
  accent-soft-light: "#dcf5ea"
  accent-line-light: "#a9d7c3"
  ask-light: "#d26a30"
  ask-ink-light: "#a15633"
  ask-soft-light: "#fdebdf"
  ask-count-light: "#ffe5d7"
  on-ask-light: "#8f4a2a"
  ask-wash-light: "#f9eae2"
  alert-light: "#cb6694"
  alert-ink-light: "#a15072"
  alert-soft-light: "#ffe8f0"
  ok-light: "#539c71"
  ok-ink-light: "#3a7653"
  ok-soft-light: "#e1f7e8"
  band-you-light: "#8c7ad1"
  band-own-light: "#5588d4"
  band-task-light: "#3293a4"
  code-ink-light: "#1a1f24"
  dim-light: "rgba(12, 20, 24, .32)"
typography:
  display:
    fontFamily: '"Fira Sans Condensed", "Fira Sans", "Arial Narrow", sans-serif'
    fontSize: clamp(3.5rem, min(7.4vw, 13svh), 8.5rem)
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: -0.03em
  section:
    fontFamily: '"Fira Sans Condensed", "Fira Sans", "Arial Narrow", sans-serif'
    fontSize: clamp(2.6rem, 3.6vw, 4.4rem)
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: -0.02em
  headline:
    fontFamily: '"Fira Sans Condensed", "Fira Sans", "Arial Narrow", sans-serif'
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.01em
  title:
    fontFamily: '"Fira Sans Condensed", "Fira Sans", "Arial Narrow", sans-serif'
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.01em
  subtitle:
    fontFamily: '"Fira Sans Condensed", "Fira Sans", "Arial Narrow", sans-serif'
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: '"Fira Sans", "Helvetica Neue", Arial, sans-serif'
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
  body-list:
    fontFamily: '"Fira Sans", "Helvetica Neue", Arial, sans-serif'
    fontSize: 14px
    fontWeight: 400
  label:
    fontFamily: '"Fira Sans Condensed", "Fira Sans", "Arial Narrow", sans-serif'
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
  label-strong:
    fontFamily: '"Fira Sans Condensed", "Fira Sans", "Arial Narrow", sans-serif'
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
  meta:
    fontFamily: '"Fira Sans", "Helvetica Neue", Arial, sans-serif'
    fontSize: 13px
    fontWeight: 400
  meta-xs:
    fontFamily: '"Fira Sans", "Helvetica Neue", Arial, sans-serif'
    fontSize: 12px
    fontWeight: 500
  count:
    fontFamily: '"Fira Sans", "Helvetica Neue", Arial, sans-serif'
    fontSize: 11px
    fontWeight: 600
    fontFeature: '"tnum"'
  code:
    fontFamily: '"Fira Mono", ui-monospace, Menlo, monospace'
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.65
rounded:
  "0": "0"
  2xs: 2px
  xs: 4px
  sm: 6px
  md: 8px
  full: 999px
  round: 50%
  ctl: 4px
spacing:
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 20px
  "6": 24px
  "8": 32px
  "10": 40px
  "12": 48px
components:
  button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.ctl}"
    padding: 7px 14px
  button-hover:
    backgroundColor: "{colors.hover}"
    textColor: "{colors.ink}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-strong}"
    rounded: "{rounded.ctl}"
    padding: 7px 14px
  button-primary-hover:
    backgroundColor: "{colors.accent-ink}"
    textColor: "{colors.on-accent}"
  code-inline:
    backgroundColor: "{colors.sunken}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xs}"
    padding: 1px 5px
---

# Design System: namp's site

## Overview

**Creative North Star: "Many at Once, One at a Time"**, namp's own. The site is namp's look on a public page, close kin to the app even where it is a docs site: the same tokens, faces, shell and signs, so a visitor who installs namp finds the page they were shown. Its values live in `src/app.css`, the faces in `src/fonts.css`, and a component's own rules in its `<style>`. This file says how to use them, its frontmatter carrying `app.css`'s tokens by their roles, which `tests/components/design.test.js` keeps equal. namp's DESIGN.md, in the namp repository, is the source this one follows: a role or a rule the site takes from the app keeps its name and value there.

namp gives a person running many agent sessions the sense of working on one thing at a time. The site does the same for its visitor: one thing in front of them at a time, the app shown at work rather than claimed, and the next action plain. What matters lifts from the ground; everything else lies flat on it.

Quiet and exact: nothing decorates, and every edge, sign and tint says something. The density is carried by type, not by boxes: headings, labels and buttons in Fira Sans Condensed, the text in Fira Sans. Colour is spent only where it says something: the one accent for focus, links and the primary action, the hues of namp's signs where the app's signs show, and what waits for the reader.

**Key Characteristics:**
- A graphite shell, a step deeper than the ground, in both palettes: the docs' sidebar, as namp's.
- The page on a plain ground, its parts separated by space, then hairlines, then a tint.
- What needs the reader lifted: a fade, a shadow and a flag band, as namp's Needs you; the rest flat.
- One accent, and namp's state hues each with its own sign, used as the app uses them.
- The condensed cut for headings, labels, buttons and the shell.
- Small corners on controls, none on rows and places.

## Colors

A cool slate ground with a graphite shell, one green accent, and namp's state hues, nothing pure black and nothing pure white on Dark. Dark is the default and each role's frontmatter key is its Dark value; Light is the same role as `<role>-light`. The hex pairs below are Dark then Light.

### Primary
- **Petrol Green** (`accent`, #58c9a1 / #428069): focus, links, selection and the primary action. `accent-ink` writes words in it, `accent-soft` tints behind it, `accent-line` edges with it, `on-accent` is the ink on it.

### Secondary
- **You Violet** (`band-you`, #a28bf2 / #8c7ad1), **Session Blue** (`band-own`, #5f9bf5 / #5588d4) and **Task Cyan** (`band-task`, #2cc0d8 / #3293a4): namp's origin bands, who started a piece of work, kept with namp's values so a row the site draws as namp's takes them. The site draws no origin band today: they show only inside namp's screenshots, and no other mark may borrow their hues.

### Tertiary
- **Ask Orange** (`ask`, #f5883f / #d26a30): what waits for the reader, its sign, its flag band and, through `ask-wash`, its fade. `ask-ink` writes words in it; `ask-count` with `on-ask` fills a count.
- **Blocked Pink** (`alert`, #f060a6 / #cb6694): something that went wrong, its words in `alert-ink`.
- **Done Green** (`ok`, #52c987 / #539c71): done, a check.

### Neutral
- **Slate Ground** (`bg`, #1c2225 / #f3f6f9): the page's ground.
- **Lifted Strip** (`surface`, #252c30 / #ffffff): a strip that lifts from the ground, a control, a command box.
- **Graphite Rail** (`bay-rail`, #15171a / #1d2024) and **Graphite Sidebar** (`bay-side`, #1b1e21 / #26292e): the shell. The other `bay-*` roles are what sits on it.
- Ink by its roles, `ink`, `ink-2` and `muted` for words and `faint` for marks; lines by `line` (a hairline), `line-strong` (a quiet rule) and `edge` (a control's edge); fills by `sunken`, `hover` and `selected`.
- **Scrim** (`dim`, rgba(8, 10, 12, .5) / rgba(12, 20, 24, .32)): the scrim behind namp's drawer, a role token like the rest, so the page under it stays readable.

### Named Rules
**The Role Rule.** Read a token by its role, never a value. A new role goes into `src/app.css` with a comment, in both palettes and in the system-light block, then into this frontmatter, then is read. A role namp has keeps namp's name and value.

**The Two Palettes Rule.** Dark, the default, and Light, a soft palette of a cool grey ground, white strips lifting from it and accents at a lower chroma. `<html data-theme>` picks one, set by `app.html`'s head script before the first paint from the choice kept in the browser or else the system's setting; a visitor with no script follows the system's setting through `prefers-color-scheme`, the same values. What differs by theme, an icon or a screenshot, is drawn for both and shown by the theme, never swapped once the page loads.

**The Shell Rule.** The shell is graphite in both palettes, a step deeper than the ground, in `--bay-*`. Inside `.shell` the ground's roles read as the shell's, so a link, a ring or a control drawn there takes the shell's colours without knowing it is there. The open page in the shell's list is light, `--bay-on`.

**The No Black Rule.** Text is `--ink`, then `--ink-2` and `--muted`, each at 4.5:1 on every ground. `--faint` is for marks only, at 3:1: a sign, a stroke, a dot, a separator.

**The Signs Rule.** Where the site shows namp's signs, they keep namp's hue and shape: `--ok` and a check for done, `--ask` and a `?` for what waits, `--alert` and a warning sign for blocked, a turning arc in the accent for working. Words in a hue take its `-ink` token, never the mark's colour.

## Typography

**Display Font:** Fira Sans Condensed (with Fira Sans, Arial Narrow), for headings, labels, buttons and the shell
**Body Font:** Fira Sans (with Helvetica Neue, Arial), for the text
**Label/Mono Font:** Fira Mono (with ui-monospace, Menlo), for commands and code only

**Character:** One family in two cuts. The condensed cut carries the density where the page names and acts; the plain cut carries what you read.

### Hierarchy
- **Display** (600, clamp(3.5rem, min(7.4vw, 13svh), 8.5rem), 0.9, -0.03em, condensed): the site's own, once per site, the hero's headline. namp has no size above 32px.
- **Section** (600, clamp(2.6rem, 3.6vw, 4.4rem), 0.95, -0.02em, condensed): the front page's second screen's heading, a step under the display, so the second screen opens as a screen of its own.
- **Headline** (600, 32px, 1.15, -0.01em, condensed): a page's title, a section's on the front page.
- **Title** (600, 22px, 1.25, -0.01em, condensed): a section's heading; the hero's lede in the plain cut at 400.
- **Subtitle** (600, 18px, 1.3, condensed): a sub-heading.
- **Body** (400, 15px, 1.55): the docs and the front page's text.
- **Body list** (400, 14px): lists and the shell's pages.
- **Label** (500, 14px, 1.2, condensed) and **Label strong** (600): buttons; the primary takes strong.
- **Meta** (400, 13px) and **Meta xs** (500, 12px): an aside, a release's date, a page's sections in the shell.
- **Count** (600, 11px, tabular figures): counts and keys.
- **Code** (400, 13px, 1.65, mono): code blocks and the install command; inline code is .86em of its line.

### Named Rules
**The Self-Hosted Rule.** The faces are `src/fonts.css`'s `@font-face`, served from `static/fonts` with their licence, each a start face subset to what the pages write and a rest face fetched only for a character the start face lacks. `app.html` preloads the start faces the first screen paints in. Nothing loads from another host.

**The No Uppercase Rule.** No uppercase labels and no tracked small caps. Weights 400, 500 and 600. Times, versions and counts take tabular figures.

## Layout

Two shapes, as namp has a shell and a place. The front page has no shell: the page on its ground, between gutters of `--gutter`, 20px to 72px by the window, the theme and the repository at its top right. The docs are namp's shell and place: the graphite sidebar at the left, the docs' name, the theme, the repository and every page in it, the open one light, and the page beside it. The page's column is centred in the space beside the shell, at most 64ch, on a grid with a margin at each side. Below 52rem there is no sidebar: a sticky graphite bar sits over the page, and the pages open in namp's drawer.

The rhythm is 4px steps, `--sp-1` to `--sp-12`. Text keeps a measure of 65 to 75 characters. Sections stand apart by more space above a heading than below it. Where a column must change, it changes at a few widths only, and nothing runs wider than the screen or scrolls sideways but a code block.

### Named Rules
**The One Grid Rule.** Every block of a page starts on the same left edge and its columns share the same lines: a heading, its text, a row of points and a call line up, or they differ by a step of the grid on purpose. The front page's grid is 12 columns between the gutters, `--sp-6` apart (`--sp-4` on a phone): on the first screen what namp is and the call in columns 1 to 5, and from column 6 to the window's right edge a topic's canvas page, dimmed, with namp's drawer lit at its right; on the second the why, the gains and the call in columns 1 to 5, and the whole canvas page from column 6; for a tester, after them, the two steps in columns 1 to 5 under a heading across the grid, and what to know from column 6. Each screen is the window's height at least, its blocks centred in it; content taller than the window keeps its natural height. Under 64rem every block takes the whole width and the second screen keeps its natural height, and the first view stacks under 72rem, where the drawer would squeeze the words.

**The Steps Rule.** Space in 4px steps, `--sp-1` to `--sp-12`, and `--gutter` for the page's margin.

## Elevation & Depth

Depth is mostly tonal: the ground, a sunken fill a step under it, a strip a step over it, and the shell a step deeper frame the page with no shadow at all. A shadow says one of two things: what needs the reader lifts, and what floats is over the page. Light's shadows are the same roles, fainter, in the ink's hue instead of black.

### Shadow Vocabulary
- **Seat** (`--shadow-1`): a chosen segment, a small strip seated on the ground.
- **Lift** (`--shadow-lift`): what needs the reader, as namp's Needs you rows and lane cards.
- **Float** (`--shadow-2`): what floats over the page, the skip link and namp's drawer.

### Named Rules
**The Lift Rule.** What needs the reader lifts from the ground, as in namp: a strip on `--ask-fill`, fading from `--ask-wash` at its left to the strip by mid-row, with `--shadow-lift` and a flag band, `--flag` wide, in `--ask`; a reply waiting for reading lifts the same way in the accent, from `--accent-soft`. Everything else lies on the ground. Nothing else casts a shadow.

## Shapes

Corners are small and mean something. Controls and counts take 4px (`--r-ctl`), chips 6px, code blocks and surfaces 8px. A row and a place take none, so the page reads as rows and regions, not tiles. Round is for people, dots and rings. A flag band is a square-ended rectangle. Lines are 1px.

### Named Rules
**The No Card In Card Rule.** Separate with whitespace first, then a hairline (`--line`), then a tint (`--hover`, `--sunken`). A row has no box and no radius; a surface sits on the ground, never inside another.

## Components

Quiet and exact: nothing decorates, and every edge, sign and tint says something.

### Buttons
- **Shape:** a control's small corners (4px).
- **Default:** a strip in the condensed cut at 14px and 500, 7px by 14px, on `surface` with a 1px `edge` round it. Hovered it takes `hover` and its edge goes to `muted`, in 0.15s.
- **Primary:** `accent` with `on-accent` ink at 600, once per place: Get an invite, Copy. Hovered it takes `accent-ink`.
- **Focus:** the one ring, 2px of `accent` outside it, 2px off.

### The install command
The tester's command in a `sunken` box with a hairline (`line`), a code block's 8px corners, its words in the mono, wrapped between words so it reads whole, only the token broken, with Copy, the primary, at its right; Copied is said to a screen reader and never moves the box.

### The shell
The docs' sidebar, graphite: the name and Docs in the condensed cut, the theme and the repository at its end, then each page a row, the open one on `bay-on` with `bay-on-ink`. It sits at the left from 52rem up and stays in sight as the page scrolls.

### The phone's bar and drawer
Below 52rem, a sticky graphite bar holds the brand, Docs, the open page's title and a menu button at its right. The menu opens namp's drawer from the right, the shell inside it, over a `--dim` scrim, with `--shadow-2`, in namp's drawer time and easing. Esc, the scrim, its close button or a picked page closes it, and the focus goes back to the menu button.

### Section marks
Each h2 carries its §-number and namp's plan sign, in `muted`. When the column's container is at least 40rem, the mark stands in the margin, level with its heading. On a narrower column it hangs at the heading's left, so a wrapped heading's lines start together.

### Plan signs
namp's three: done is an `--ok` disc with a check, running is an `--accent` arc on a `--line-strong` track, and planned is a `--muted` ring. All three are drawn and one is shown, so a sign changes by crossfade only and nothing round it moves. The arc turns a quarter once on entering running, and does not move under reduced motion.

### On this page
The page's sections, each a row on a hairline, the one in view marked by an accent rule. At a container of 62rem or more it sits at the column's right and stays in sight. Narrower, it is folded under the opening.

### Previous and Next
namp's rows under the column, each with its key in a `kbd`, `[` and `]`. The `[` and `]` keys step to the page before and after, unless a text field has the focus, Ctrl or Cmd is held, or the drawer is open.

### Keys
A `kbd` as namp draws one: on `surface`, a `line-strong` edge a step deeper at its foot, its key in `muted` mono.

### Touch targets
On a coarse pointer, every control and row is at least 44px tall: the bar's links and menu, the shell's pages, the rows of On this page, its fold, each Copy, the call's address and Read the docs, and the drawer's choices.

### The drawer
The front page's first screen is a topic's canvas page in namp with namp's drawer open on a question, the drawer live (`src/lib/home/Drawer.svelte` and `Question.svelte`, ported from namp's `Drawer.svelte`, `DrawerTitle.svelte`, `Thread.svelte`, `Question.svelte` and `Compose.svelte` rather than drawn like them). The spot runs from column 6 to the window's right edge, past the gutter, where namp's drawer stands in its window. The drawer is as wide as the shot's, 672 of its px at one px per thousandth of the window's height (`--u`, 0.8px to 1.05px), its right edge on the window's, its top level with the shot's, so it lies where the shot's drawer lies; its words keep namp's own sizes. It is the shot's top 780px tall at least, as tall as what it shows needs, and its foot fades into the ground as namp's runs on down the window. Behind it, from its left, the canvas page at the same scale: its pills, its text and the D3 paragraph the question was opened from, marked, lie under namp's `--dim` with a wash of the ground over it in Dark (30%), and in Light under the wash alone (74%), with no scrim, which would leave a grey slab, so their lines are there but hardly read, fading into the ground at their left, a little under the words, at their top and at their foot. Every coordinate the page reads of a shot is in `src/lib/home/places.js`, so a retake that moves a part is an edit there.

The drawer shows what namp's shows in the shot, every word, time and count from the demo topic (`src/lib/home/demo.js`), and says it is a demo topic at the end of its filters: Threads with what needs you on `--ask-count`, the caret and Hide; the filters, Needs you chosen on the accent's rule, With you and Sessions; the thread's head with Back, Locate and who has read it; then the 31st question in the look namp gives a question with the focus, the accent's faint tint and a line above and below, its sender's chip, name, time and new dot, its title, its context, its numbered choices, the recommended one's ring in the accent and Recommended at the row's end in `--ok-ink`, Your own answer and Discard, and the reply box under it. A click on a choice or its number key, while the question has the focus, answers it: the choice shows picked a moment, the question folds out and the topic's D4 question comes up in its room, the counts one less, the focus on it. Once both are answered the drawer shows what is left of Needs you as namp does, the box to message the session, the hint, and the pull request's review as a headline row lifted on `--shadow-lift` with the ask's flag. What the demo can't do, the heads' buttons, Your own answer, Discard and the boxes, is drawn and does nothing. The drawer keeps the room it held, so nothing round the hero moves, but on a phone, once the last question is answered, it closes up to what is left in 240ms (at once under reduced motion), the page under it following the reader's own answer; and what comes up rises by transform and opacity, still under reduced motion. On a phone the canvas page is not shown: the drawer stands alone across the window on its surface, as namp shows a question on a phone, down to the second screen's hairline.

### The tour
The second screen shows what you gain on the canvas page itself (`src/lib/home/Tour.svelte`), the tour's own wide screenshot, the page with its Timeline open and the lane at its right, its sidebar cut away, framed by a hairline and a surface's 8px corners, as tall as the screen lets it be. The gains are a tablist of namp's choices: a ring with the number, the chosen one filled in the accent on `surface`, between hairlines; arrow keys, Home and End move the choice, and the choice is said politely. The four parts: the asks' marks in the gutter beside D3 and D4 with the canvas bar over the page, which counts the asks and steps through them; the lane's Goal and Work cards; Timeline with Since you were here under it; the whole page. Choosing one dims the rest of the page under `--dim` (at half strength in Light, so the lights stay on), traces an accent outline round each of its parts along its path (600ms, `--ease-out`, by `stroke-dashoffset`), brings the parts' rows in one after another as namp's rows arrive, each staying as it is until its turn, and sets namp's working light going round the outline: the accent's conic light namp turns round what a session works on (`work-turn`, 2.4s). Each gain has its number at its first part's corner. Your machines has no part of its own: its outline is the whole page's, tagged with the address namp serves it at, `localhost:4321`. While the screen is in view the tour moves on every 4 seconds, waiting while the pointer rests on the gains, until the visitor's first click or focus on one; under reduced motion it never moves, outlines appear without tracing and the light is not lit. Under 64rem the second screen starts on a hairline, and each gain stands over its own cut: one thing at a time and back in, in seconds cut from two phone shots of the page (its asks under the canvas bar, its Timeline through Since you were here), never wider than the phone they were shot on, so their smallest text stays at 9px or more; good practice from the wide shot's lane; your machines the whole page with its address; each cut's outline traced once as it comes into view. The parts, their rows and the cuts are in `places.js`.

### Inline code
A chip on `sunken` with its hairline drawn, 1px by 5px, so its padding never reads as a stray space.

### Named Rules
**The One Primary Rule.** One primary button per place, in the accent. Every other control is the default strip or a link.

**The Focus Rule.** One ring, `:focus-visible` in the accent. Never `outline: none` without a look in its place.

## Do's and Don'ts

### Do:
- **Do** read a token by its role, and add a new role to `src/app.css` in both palettes, and here, before reading it.
- **Do** show namp at work, its real screens and signs, rather than describe it.
- **Do** keep each page's blocks on one grid.
- **Do** separate with whitespace first, then a hairline, then a tint.
- **Do** keep the primary button to once per place.
- **Do** let every sign that moves stand still under reduced motion.
- **Do** set the theme before the first paint, and draw what differs by theme for both.

### Don't:
- **Don't** use black: text is `ink`, then `ink-2` and `muted`, and `faint` is for marks only.
- **Don't** put a card in a card, or a box round a row.
- **Don't** write uppercase labels.
- **Don't** cast a shadow for anything that neither lifts nor floats.
- **Don't** load a font, a script or an asset from another host.
- **Don't** invent customers, testimonials, numbers or claims.
