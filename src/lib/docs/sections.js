// Where the reader is on a docs page, read as namp's plan reads where its work is: the section in view is
// the last whose heading has passed a line at the top third of the window, the first before any has, unless
// the reader went to a section by its link and its heading still stands above that line. As the page's
// last screens come, the line moves down with what is left to scroll, so the last sections, too short to
// reach the top third, each come into view in turn, the last at the very end. Read from IntersectionObserver
// as a heading crosses the line, as `end`, the page's last window, shows, and as the address
// changes section, never on each scroll.

/** Whether this browser asks for reduced motion, as namp's ui/src/lib/motion.js reads it. */
export const still = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A token of app.css, else `fallback` where none is set. @param {string} name @param {string} fallback */
const token = (name, fallback) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

/** A duration token in ms. @param {string} name @param {string} fallback */
const ms = (name, fallback) => {
  const v = token(name, fallback);
  return v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000;
};

/**
 * Turns a running sign's arc a quarter round into its place, as it comes into view, in namp's drawer's
 * time and easing; nothing for a browser asking for reduced motion.
 * @param {Element} arc
 */
export function turn(arc) {
  if (still() || !arc.animate) return;
  arc.animate([{ transform: "rotate(-90deg)" }, { transform: "none" }], { duration: 2 * ms("--dur-drawer", ".2s"), easing: token("--ease-out", "ease-out") });
}

/**
 * Calls `change` with the index of the section in view among `article`'s h2s whenever it may have changed,
 * `end` being the page's last window. Returns what stops it.
 * @param {HTMLElement} article
 * @param {Element | undefined} end
 * @param {(index: number) => void} change
 */
export function inView(article, end, change) {
  if (!article || typeof IntersectionObserver !== "function") return () => {};
  const headings = [...article.querySelectorAll("h2")];
  if (!headings.length) return () => {};
  const read = () => {
    const range = document.documentElement.scrollHeight - innerHeight;
    const from = Math.max(0, range - (innerHeight * 2) / 3);
    const moved = range > from ? Math.min(1, Math.max(0, (scrollY - from) / (range - from))) : 0;
    const line = innerHeight / 3 + ((innerHeight * 2) / 3) * moved;
    const linked = headings.findIndex((h) => `#${h.id}` === decodeURIComponent(location.hash));
    const top = linked < 0 ? null : headings[linked].getBoundingClientRect().top;
    if (top !== null && top >= -1 && top <= innerHeight / 3) return change(linked);
    const passed = headings.findLastIndex((h) => h.getBoundingClientRect().top <= line);
    change(Math.max(0, passed));
  };
  const crossing = new IntersectionObserver(read, { rootMargin: "0px 0px -67% 0px" });
  headings.forEach((h) => crossing.observe(h));
  const ending = new IntersectionObserver(read, { threshold: Array.from({ length: 41 }, (_, i) => i / 40) });
  if (end) ending.observe(end);
  addEventListener("hashchange", read);
  return () => {
    crossing.disconnect();
    ending.disconnect();
    removeEventListener("hashchange", read);
  };
}
