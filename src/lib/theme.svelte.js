// The theme the site is shown in, Dark or Light. app.html's head script sets <html data-theme> before the
// first paint, from the choice kept in this browser or else the system's setting; this follows the system
// live until the visitor makes a choice, and keeps one when they do. The page never reads the theme to
// draw itself, for the server does not know it: what differs by theme is shown by [data-theme] in CSS.
export const KEY = "namp-site.theme";

const light = "(prefers-color-scheme: light)";

export const theme = $state({ shown: null });

// The choice, kept in memory too, so a choice holds for this page when localStorage throws.
let kept = null;
let following = false;

function read() {
  try {
    const value = localStorage.getItem(KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

// Sets the theme with no colour easing into it: transitions are off for the one frame it changes in.
function apply(value) {
  const root = document.documentElement;
  if (root.dataset.theme !== value) {
    root.classList.add("theme-switching");
    root.dataset.theme = value;
    root.style.colorScheme = value;
    getComputedStyle(root).color;
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
  }
  theme.shown = value;
}

// Reads the theme the head script set, and from then on follows the system's setting until a choice.
export function follow() {
  theme.shown = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  if (following) return;
  following = true;
  kept = read();
  matchMedia(light).addEventListener("change", (event) => {
    if (!kept && !read()) apply(event.matches ? "light" : "dark");
  });
  // A choice made in another tab of the site.
  addEventListener("storage", (event) => {
    if (event.key === KEY && (event.newValue === "dark" || event.newValue === "light")) apply((kept = event.newValue));
  });
}

// The other theme, kept as the visitor's choice.
export function toggle() {
  kept = theme.shown === "light" ? "dark" : "light";
  try {
    localStorage.setItem(KEY, kept);
  } catch {}
  apply(kept);
}
