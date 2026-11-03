// The front page's live drawer, word for word as namp's drawer shows it in the hero's screenshot of the
// Recurring invoices topic, a demo topic of a trial server: the topic's two questions in the order its
// canvas bar steps through them, each its thread, the one on D3 opened from its gutter mark, then what is
// left once both are answered, Needs you across the topics with the review of its pull request.

/** @typedef {{ text: string, recommended?: boolean }} Choice */
/** @typedef {{ id: string, who: string, chip: string, hue: number, at: string, place: string, title: string, context: string, choices: Choice[] }} Ask */

/** @type {Ask[]} */
export const asks = [
  {
    id: "invoice-day",
    who: "Recurring invoices",
    // The topic's session, as namp's AgentChip draws a topic orchestrator: its initials on its hue.
    chip: "TO",
    hue: 287,
    at: "15:06",
    // Where its thread is pinned on the canvas, which the thread names under its head.
    place: "D3 The day of a schedule in a shorter month",
    title: "When a schedule's day is the 31st, which day does it go out in a shorter month?",
    context: "A template set to the 31st has no such day in April, June, September, November and February. The first two choices keep one invoice a month.",
    choices: [
      { text: "The month's last day: 30 April, 28 or 29 February", recommended: true },
      { text: "The 1st of the next month" },
      { text: "Skip the months without a 31st" },
    ],
  },
  {
    id: "no-time-zone",
    who: "Recurring invoices",
    chip: "TO",
    hue: 287,
    at: "15:06",
    place: "D4 A client with no time zone",
    title: "A client has no time zone set: whose 09:00 does its invoice go out at?",
    context: "9 of the 112 clients on a monthly template have no time zone. Their address names a country, not always a zone.",
    choices: [
      { text: "The account's own time zone, until the client sets one", recommended: true },
      { text: "The zone of the client's country, the capital's for a country with several" },
      { text: "UTC" },
    ],
  },
];

// The canvas the questions are on, the topic's first, named by its title.
export const canvas = "Recurring invoices";

// What needs you besides the questions: the pull request's review, a headline row of Needs you.
export const review = { kind: "Review", subject: "#42 Recurring invoices: the scheduler makes each due invoice once", text: "Your review is requested." };
