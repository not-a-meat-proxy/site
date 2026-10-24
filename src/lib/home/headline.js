// What a headline of Needs you shows, as namp's ui/src/lib/headline.js has it: a text as its lines, each
// line its own, a list item's or a quote's marker and a heading's hashes left off, blank lines and a
// fenced block dropped, so 2 lines are 2 lines of words.

/** @param {string | null | undefined} md */
export function headLines(md) {
  /** @type {string[]} */
  const out = [];
  let fence = "";
  for (const raw of (md || "").split("\n")) {
    const l = raw.trim();
    const mark = /^(```|~~~)/.exec(l)?.[1];
    if (fence) {
      if (mark === fence) fence = "";
      continue;
    }
    if (mark) {
      fence = mark;
      continue;
    }
    const words = l.replace(/!\[[^\]]*\]\([^)]*\)/g, "").trim().replace(/^(?:>\s*)+/, "").replace(/^(?:[-*+]|\d+[.)])\s+(?:\[[ xX]\]\s+)?/, "").replace(/^#{1,6}\s+/, "");
    if (words) out.push(words);
  }
  return out;
}

// How many things need you, in namp's Home's words.
/** @param {number} n */
export const needWords = (n) => (n ? `${n} ${n > 1 ? "things need" : "thing needs"} you.` : "Nothing needs you.");
