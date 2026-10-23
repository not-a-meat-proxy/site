// Where the reader is on a docs page, read as namp's plan reads where its work is: the section in view is
// the last whose heading has passed the top third of the window, the first before any has, and the last
// once the page's end is in sight. Read from IntersectionObserver as a heading crosses that line, never on
// each scroll.

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
 * `end` being what shows the page has been read to its end. Returns what stops it.
 * @param {HTMLElement} article
 * @param {Element | undefined} end
 * @param {(index: number) => void} change
 */
export function inView(article, end, change) {
  if (!article || typeof IntersectionObserver !== "function") return () => {};
  const headings = [...article.querySelectorAll("h2")];
  if (!headings.length) return () => {};
  let atEnd = false;
  const read = () => {
    if (atEnd && scrollY > 0) return change(headings.length - 1);
    const line = innerHeight / 3;
    const passed = headings.findLastIndex((h) => h.getBoundingClientRect().top <= line);
    change(Math.max(0, passed));
  };
  const crossing = new IntersectionObserver(read, { rootMargin: "0px 0px -67% 0px" });
  headings.forEach((h) => crossing.observe(h));
  const ending = new IntersectionObserver(
    ([entry]) => {
      atEnd = entry.isIntersecting;
      read();
    },
    { threshold: 1 },
  );
  if (end) ending.observe(end);
  return () => {
    crossing.disconnect();
    ending.disconnect();
  };
}
