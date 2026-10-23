// The demo topics of the home page's Needs you: synthetic, as the hero's screenshot of the Recurring
// invoices topic is, its topics the screenshot's sidebar shows. Three asks, in the order namp's Home
// lists them, then a reply waiting for reading, each as namp's Home headlines it (headline.js in namp):
// a question its title, the first lines of its context and its recommended choice, a goal its proposed
// title alone, a reply its thread's subject and the first lines of its text.

/** @typedef {{ text: string, recommended?: boolean }} Choice */
/** @typedef {{ id: string, label: string, who: string, at: string, subject: string, text: string, choices?: Choice[] }} Ask */

/** @type {Ask[]} */
export const asks = [
  {
    id: "invoice-day",
    label: "Question",
    who: "Recurring invoices",
    at: "13:36",
    subject: "When a schedule's day is the 31st, which day does it go out in a shorter month?",
    text: "A template set to the 31st has no such day in April, June, September, November and February. The first two choices keep one invoice a month.",
    choices: [
      { text: "The month's last day: 30 April, 28 or 29 February", recommended: true },
      { text: "The 1st of the next month" },
      { text: "Skip the months without a 31st" },
    ],
  },
  {
    id: "csv-goal",
    label: "Goal",
    who: "CSV import of clients",
    at: "13:12",
    subject: "A client list imports from a CSV file, each bad row named with its line",
    text: "",
  },
  {
    id: "tax-rate",
    label: "Question",
    who: "Tax rates by region",
    at: "12:58",
    subject: "A region changes its rate mid-month: which rate does an invoice take?",
    text: "Two regions change their rate on the 15th. An invoice can be dated before the change and sent after it.",
    choices: [
      { text: "The rate on the invoice's date", recommended: true },
      { text: "The rate on the day it is sent" },
    ],
  },
];

/** @type {{ id: string, label: string, who: string, at: string, subject: string, text: string }} */
export const reply = {
  id: "sign-in-links",
  label: "Reply",
  who: "Client portal sign-in",
  at: "11:40",
  subject: "Sign-in links expire after 15 minutes",
  text: "Done as you asked: the expiry is a setting now, 15 minutes unless you change it.\nThe tests pass, and links sent before the next deploy keep working until they expire.",
};
