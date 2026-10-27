# Your first topic

A topic holds one piece of work: its goal, the plan its session follows towards it, the canvas the session writes, the questions it asks you and the threads you hold with it.

## Open the page

Open the address `namp start` printed, `http://localhost:4321/__session/`. It opens on Home, a briefing across your topics since you left:

- **Needs you**: only what waits for you to act, such as a question to answer, a goal to accept or a session that is blocked. A question, a reply or a heads-up opens its thread as a layer beside the briefing, where you answer it. The arrow in the layer's head opens its topic. The rest opens in its topic.
- **While you were away**: what came of each topic, what was done, decided, waits on you or is blocked, each marked at its left by who started it: you, the session, or a task the session handed out.
- **Running now** and **Next**: what the sessions work on, and what their plans hold next.

The rail at the left goes to Topics, Projects, Machines, Agents and Settings, and counts what needs you on Home. **Chat**, at the top right of Home, is where you talk to the Main session.

## Start a topic

Press **New topic**, at the top right of Home, and fill in:

- **Title**, the topic's name.
- **Machine**, once herdr knows another machine: **Local**, this computer, or the one the session runs on.
- **Project** or **Folder**, where the session works. A project is a git clone you register once in Projects: each topic on it works in a worktree of its own, on a new branch named after the topic, which **Worktree from** starts from the project's default branch unless you pick another. A folder is any absolute path, its **Working directory**.
- **Runs as**, **Skills** and **Siblings**: the agent the session runs as, its skills and the sessions it may start for parts of the work. On a project, **Tools** adds the MCP servers it may use. The defaults are a good start.
- **Goal**, in one line: what the work is meant to reach.
- **Brief**: how the session should work towards it, and what it should produce.

Then press **Start the session**. namp opens the session in a new herdr tab and its topic in the page. Its first move is to propose the goal: it shows under **Needs you**, on Home and in the topic, and the topic's **Goal** card turns the colour of what waits for you. Click it to open the goal in the drawer, with what met looks like and its criteria, and press **Accept**, or **Refuse**. The session starts the work once you accept it.

## Read a topic

A topic opens on its first canvas, the document its session writes, where you left it: only your first visit opens it at the first thing waiting for you. The switcher in its top bar, which names the view you are on, lists its other views: **Files** for a topic on a project, **Record**, and every other document. `[` and `]` step through them.

A question the session links in the canvas is not in the text: it is a mark in the column at the left edge of the pane, an orange `?` in a ring beside the part of the canvas it decides, `?3` when three wait there. A speech bubble marks a thread going on, in green when it waits for you. Click a mark to open it in the drawer.

The bar under the top bar stays in view over the canvas:

- the `?` and how many questions and other asks wait on this canvas, then `1/6` as you step through them with its arrows, `n` and `N`, or F8 and Shift+F8. Each step scrolls to the ask and opens it in the drawer, ready to answer;
- `+2` for what waits for you elsewhere in the topic, such as a goal to accept, which opens Needs you in the drawer;
- a green `?` that shows, in the column of marks, where you already answered;
- **Timeline**, at its right, the topic's work over **Today**, **2 hours** or the **Week**, a line for you, the session and each session it started: click a bar to see it in the drawer;
- at its left, when the session is in trouble, such as **Failed to start**, what went wrong: click it to see what happened and what to do.

Over the canvas's title, **Since you were here** is one line counting what came since your last visit, such as `3 done · 1 decided · 4 changes · Everything`. Each count opens what it counts, and **Everything** the Record view. On your first visit it reads **The last 7 days**. In the sidebar, the canvas's outline counts the asks under each heading: click one to go there.

Where the work is going sits in the lane at the right of the page, on every view of the topic, a card per subject:

- **Threads**, how many asks wait for you, what waits outside the canvas, and your last three threads;
- **Goal**, its state and how many of its criteria are met, such as 2 / 3, and its title;
- **Work**, the topic's session and the sessions it started that run now, what each works on, and how far the plan is;
- **Pull request**, for a topic on a project on GitHub;
- **Documents**, how many the topic works on.

Click a card to open its subject whole in the drawer at the right, and again to hide it: the goal with each criterion and what shows it holds, the whole plan as a checklist, done and dropped checked off in place, and who works on the topic, under Work's **Plan** and **Squad**, and each document with the changes you have not seen yet. `{` and `}` step through the subjects. The button under the cards folds them into pills, small squares with the same click; in a narrow window they are pills by themselves, and on a phone a row above the page.

Nothing in a topic asks you to mark it read: once the Since you were here line has been in view, it counts as seen, and the next time you come back it counts from there.

**Record**, after Files in the switcher, is the topic's whole record, the newest first: work started and done, decisions the session took, messages and what they led to, changes to the canvas. Its filters, All, Work, Decisions, Conversation and Changes, each count their rows. Click a piece of work to see where it came from and what it did.

A link you follow, to a thread, a part of the canvas or a decision, opens as a layer, the page staying where you read it. It opens beside the page by default, and in a window 1000px wide or narrower it takes the drawer's place. **Followed links**, in **Settings** under **Appearance**, picks **Beside** or **Leaflet**, a column at the right. Close it, or press `Esc`, to come back to the link.

When the session decides something without asking you, it says so in the record, with what it chose and why. If you would have chosen otherwise, press **Overrule**: the decision comes back to you as a question.

## Answer a question

When a session needs a decision, it asks you a question: a title, its context, numbered choices with the one it recommends marked, and **Your own answer** last. It opens in the drawer, from its mark on the canvas, a step of the bar or Needs you, and on Home as a layer beside the briefing.

Pick a choice with a click, or its number once the question has the focus, or type your own answer, then send it with the arrow or Ctrl+Enter, Cmd+Enter on a Mac. The session gets it at once and goes on. To change your mind, pick another choice.

## The conversation

A topic's conversation opens in the drawer at the right of its page, from **Threads**, the first card of its lane. **Needs you** lists the threads waiting for you to act. **With you** lists the threads you are in, and **Sessions** the sessions' talk among themselves. `j` and `k` move between the threads, and `Esc` hides the drawer.

To write to a session from any page, press the pencil in the top bar, **New message**, or `m`. The box opens over the page with the current topic's session mentioned first, or the Main session when no topic is open. Send it with Ctrl+Enter, Cmd+Enter on a Mac: it goes as a thread to the first topic it mentions, and the page stays where it was.

## Archive a topic

When the work is done, **Archive the topic**, from the **More** menu, ⋯ at the right of its top bar. It leaves Home and the topic list for **Archived**, linked under your topics in the sidebar, where it stays readable as it was: its canvas, its threads, its plan and its record. **Reopen** brings it back to work in, and **Delete** removes it for good.
