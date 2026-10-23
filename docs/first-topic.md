# Your first topic

A topic holds one piece of work: its goal, the plan its session follows towards it, the canvas the session writes, the questions it asks you and the threads you hold with it.

## Open the page

Open the address `namp start` printed, `http://localhost:4321/__session/`. It opens on Home, a briefing across your topics since you left:

- **Needs you**: only what waits for you to act, such as a question to answer, a goal to accept or a session that is blocked. A click opens it whole in the drawer at the right, where you answer it, and **Open in topic** takes you to it in its topic.
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

A topic opens on its **Overview**. The switcher in its top bar, which names the view you are on, lists its other views: its canvas and every other document, and **Files** for a topic on a project. `[` and `]` step through them. From the top, the Overview shows:

- **Needs you**, what waits for you in this topic;
- its work as a timeline, over **Today**, **2 hours** or the **Week**, a line for you, the session and each session it started: click a bar to see it in the drawer;
- **Since you were here**, everything else that happened, the newest first: work started and done, decisions the session took, messages and what they led to, changes to the canvas. On your first visit it shows **The last 7 days**.

Where the work is going sits in the lane at the right of the page, on every view of the topic, a card per subject:

- **Threads**, how many asks wait for you, and the newest;
- **Goal**, its state and how many of its criteria are met, such as 2 / 3, and its title;
- **Plan**, what runs now and how many items are planned;
- **Squad**, the sessions its session started that run or ran today, or that it works alone;
- **Pull request**, for a topic on a project on GitHub;
- **Documents**, how many the topic works on.

Click a card to open its subject whole in the drawer at the right, and again to hide it: the goal with each criterion and what shows it holds, the whole plan as a checklist, done and dropped checked off in place, who works on the topic, and each document with the changes you have not seen yet. `{` and `}` step through the subjects. The button under the cards folds them into pills, small squares with the same click; in a narrow window they are pills by themselves, and on a phone a row above the page.

Nothing on the Overview asks you to mark it read: once it has been in view, it counts as seen, and the next time you come back the record starts after it. Click a piece of work to see where it came from and what it did, and a reference to a thread, a part of the canvas or a decision to unfold it in place. **Fold all** folds them again.

When the session decides something without asking you, it says so in the record, with what it chose and why. If you would have chosen otherwise, press **Overrule**: the decision comes back to you as a question.

## Answer a question

When a session needs a decision, it asks you a question: a title, its context, numbered choices with the one it recommends marked, and **Your own answer** last. A question shows where the session links it on the canvas, under Needs you, and in its thread.

Pick a choice with a click, or its number once the question has the focus, or type your own answer, then send it with the arrow or Ctrl+Enter, Cmd+Enter on a Mac. The session gets it at once and goes on. To change your mind, pick another choice.

## The conversation

A topic's conversation opens in the drawer at the right of its page, from **Threads**, the first card of its lane. **Needs you** lists the threads waiting for you to act. **All** lists every thread, the sessions' talk among themselves included. `j` and `k` move between the threads, and `Esc` hides the drawer.

## Archive a topic

When the work is done, **Archive the topic**, from the **More** menu, ⋯ at the right of its top bar. It leaves Home and the topic list for **Archived**, linked under your topics in the sidebar, where it stays readable as it was: its canvas, its threads, its plan and its record. **Reopen** brings it back to work in, and **Delete** removes it for good.
