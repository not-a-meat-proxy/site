# Your first topic

A topic holds one piece of work: its goal, the plan its session follows towards it, the canvas the session writes, the questions it asks you and the threads you hold with it.

## Open the page

Open the address `namp start` printed, `http://localhost:4321/__session/`. It opens on the topic you last had open, else on the first one waiting for you, else on the first in the sidebar. On your very first visit, that is the **NAMP session**, the session you talk to about all your work: it starts topics for you and takes what they hand it.

The rail at the left goes to **Topics**, **Projects**, **Machines**, **Agents** and **Settings**. Topics carries the count of what waits for you to act across every topic, and a petrol dot while replies wait for your reading.

Beside the rail, the sidebar lists your topics, the NAMP session pinned at the top. Each row shows its session's sign: an arc turning while it works, an orange **?** while it needs you, a red triangle while it is in trouble. Then its goal's progress ring, and its count of asks.

Press `⌘K`, `Ctrl+K` off a Mac, from anywhere to go to a topic: the palette lists them all, those waiting for you first. Type to find one, or step into it with the right arrow to reach its questions, threads, documents, decisions and plan.

## Start a topic

Press **+ New topic**, at the top of the sidebar, and fill in:

- **Machine**, once herdr has another machine saved: **Local**, this computer, or the one the session runs on.
- **Project** or **Folder**, where the session works. A project is a git clone you register once in Projects: each topic on it works in a worktree of its own, on a new branch named after the topic, which **Worktree from** starts from the project's default branch unless you pick another. A folder is any absolute path.
- **Title**, the topic's name, and its **Goal**, in one line: what the work is meant to reach.
- **Brief**: how the session should work towards it, and what it should produce.
- **Runs as**, **Skills** and **Siblings**: the agent the session runs as, its skills and the sessions it may start for parts of the work. On a project, **Tools** adds the MCP servers it may use. The defaults are a good start.

Then start it. NAMP starts the session and opens its topic. Its first move is to propose the goal: the canvas bar reads **Goal to accept**, and the **Goal** section turns the colour of what waits for you, with **Accept** and **Refuse** under its title. Click **Goal to accept** to read it whole in the drawer first, with what met looks like and its criteria. The session starts the work once you accept it.

## Read a topic

A topic opens on its canvas, where you last left it. On your first visit it opens at the first thing that waits for you, or at its top. The switcher in its top bar names the view you are on, and its menu has two groups: **The topic**, with **Files** for a topic on a project, **Record** and its pull request, then **Documents**, with its first canvas as **Canvas** and every other document. `[` and `]` step through them, and the topic's title in the top bar brings you back to its canvas.

The canvas bar, under the top bar, stays in view over the canvas. It counts the asks on this canvas, what waits for you to act, and its arrows, `n` and `N` or F8 and Shift+F8, step through them, `1/6`, each step opening the ask in the drawer. Then it steps through the replies waiting for your reading on this canvas, counted apart by a petrol bubble. Once this canvas has no step left, `n` goes on to the next ask wherever it waits. While the goal waits for you, the bar names it at its left, **Goal to accept**, **Goal reworded** or **Goal met?**: click it to answer it in the drawer. The green **?** shows where questions were answered. While the session is in trouble, blocked or not running, the bar says so at its left: click it for what to do.

**Timeline**, at the bar's right, opens the topic's work under it, over **Today**, **2 hours** or the **Week**, a line for you, the session and each session it started: click a bar to see it in the drawer.

An ask on the canvas is a mark in the column at the page's left edge, an orange **?** level with the text it is about, with a count when several share it, such as `?6`. A speech bubble marks a thread going on there, petrol while a reply in it waits for you. Click a mark to open it in the drawer. The outline in the sidebar counts each heading's asks too.

Over the canvas's title, **Since you were here** counts what came since your last visit, such as `3 done · 1 decided · 4 changes · Everything`. Each count opens what it counts, and **Everything** the Record view. On your first visit it counts **The last 7 days**, and when nothing came in, it says so: **Nothing new since you were here** or **Nothing new in the last 7 days**.

Nothing asks you to mark the topic read: once the Since you were here line has been wholly in view for a second, it counts as seen, and the next time you come back it counts from there.

Where the work is going sits in the side column, between the sidebar and the canvas, on every view of the topic. Its pills, one per subject, show or hide that subject's section, several at once:

- **Threads**, the topic's inbox: every thread of the topic, sorted into sections, described under [The inbox](#the-inbox);
- **Goal**, its state, how many of its criteria are met, such as 2 / 3, and its title;
- **Work**, the topic's session and each session it started that runs now, with what it works on, then how far the plan is, such as `Plan 4 of 9 done`;
- **Pull request**, for a topic on a project on GitHub, with **Merge** once it is ready;
- **Documents**, how many the topic works on.

A pill hidden still says what waits: a number for what blocks you, a dot for what you have to read. The icon at the end of a section's head opens its subject whole in the drawer at the right: the goal with each criterion and what shows it holds; the work as **Plan**, the whole plan as a checklist, or **Squad**, who works on the topic, by **People** or as their **Day**; and each document with the changes you have not seen yet. `{` and `}` step through the subjects. On a phone, the canvas bar holds the subjects instead: **Threads** opens the inbox as a sheet, and an icon each opens the others.

**Record**, after Files in the switcher, is the topic's whole record, the newest first: work started and done, decisions the session took, messages and what they led to, changes to the canvas. Its filters, All, Work, Decisions, Conversation and Changes, each count their rows. Click a piece of work to see where it came from and what it did.

A link you follow, to a thread, a part of the canvas or a decision, opens as a layer over the page, which stays where you read it. Each one more opens beside the last, and short of room they narrow together. A document's layer has **Put in the middle**, to read it in the canvas's place. Close it, or press `Esc`, to come back to the link.

When the session decides something without asking you, it says so in the record, with what it chose and why. If you would have chosen otherwise, press **Overrule**: the decision comes back to you as a question.

## Answer a question

When a session needs a decision, it asks you a question: a title, its context, numbered choices with the one it recommends marked, and **Reply** last. A question shows as its mark on the canvas, in the inbox under Needs you, and in its thread, and opens whole in the drawer.

Pick a choice with a click, or its number once the question has the focus, then send it with the round arrow or Ctrl+Enter, Cmd+Enter on a Mac. The session gets it at once and goes on, and the question's mark leaves the canvas. To change your mind, pick another choice.

**Reply** writes to the session instead, without answering: the question stays open, its choices still there, and reads **With the session** until the session replies. It is off your count meanwhile. The session may then settle it for you, **Resolved** with the answer you agreed on, or **Withdrawn** with why.

A session can also ask inside a thread you are both in: the question shows at its message there, and you answer it from that thread's reply box.

## The inbox

**Threads**, the first section of the side column, is the topic's one list of threads, each in one section:

- **Pinned**: the threads you pinned, on top.
- **Needs you**: the threads that ask you to act, a question or a goal, first, then those holding a reply or a heads-up for you to read, or where you wrote last and the session answered.
- **Working**: the threads you take part in that a session is on now.
- **Snoozed**, **Settled** and **Others**, folded at the foot with their count: the threads you put off until later, those you are done with, and the sessions' talk among themselves.

A row reads its title and its age, then in bold what came while you were away, such as **Reply to read** or **2 new**. Hover it to **Pin**, **Snooze** or **Settle** it. A settled thread comes back by itself once something in it waits for you again. Click a row to open its thread in the drawer, over the canvas, which keeps its place. `j` and `k` open the next or previous row, and `Esc` hides the drawer.

To write to a session from any page, press **+** in the inbox's head, the pencil in the top bar, **New message**, or `m`. The box opens over the page with the current topic's session mentioned first, or the NAMP session's off a topic. Send it with Ctrl+Enter, Cmd+Enter on a Mac: it goes as a thread to the first topic it mentions, and the page stays where it was.

## Where a session runs

**Machines**, on the rail, shows where your topics run: **Local**, this computer, first, then each machine herdr saved, with whether it answers and its topics. Each machine picks its **Runtime**, **herdr** or **hc**, what runs its sessions: herdr until you pick hc. A change takes effect at each session's next start there.

**Focus**, at the right of a topic's top bar, brings its session's terminal to the front in herdr. On hc, which has no window of its own, it gives the command to attach a terminal to the session, with **Copy the command**:

```sh
namp attach <topic>
```

`namp attach` works with the page or the server down too. Alone, it lists the sessions you can attach to, a sibling named `<topic>:<sibling>`.

## Archive a topic

When the work is done, **Archive the topic**, from the **More** menu, ⋯ at the right of its top bar. It first names what it stops, the servers and processes the topic started. The topic leaves the topic list for **Archived**, linked under your topics in the sidebar, where it stays readable as it was: its canvas, its threads, its plan and its record. **Reopen** brings it back to work in, and **Delete** removes it for good.
