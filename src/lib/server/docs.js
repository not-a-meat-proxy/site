import MarkdownIt from "markdown-it";

// The docs for testers: one Markdown file of docs/ per page, read and rendered when the site is
// built, so a page needs nothing at run time. Its title is its first heading.
const files = import.meta.glob("/docs/*.md", { query: "?raw", import: "default", eager: true });

// The pages in the sidebar's order, by the slug of their address under /docs, the overview's empty.
const order = [
  ["", "index"],
  ["install", "install"],
  ["first-topic", "first-topic"],
  ["backup", "backup"],
  ["update", "update"],
  ["report-an-issue", "report-an-issue"],
];

const markdown = new MarkdownIt({ html: false, linkify: true });

// An id for each heading below the title, from its words, and a link to it after them, so a section
// can be linked to.
function slug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

markdown.core.ruler.push("heading_ids", (state) => {
  const used = new Set();
  let n = 0;
  state.tokens.forEach((token, i) => {
    if (token.type !== "heading_open" || token.tag === "h1") return;
    const text = state.tokens[i + 1].children.map((child) => child.content).join("");
    let id = slug(text);
    for (let n = 2; used.has(id); n++) id = `${slug(text)}-${n}`;
    used.add(id);
    token.attrSet("id", id);
    if (token.tag === "h2") token.meta = { n: ++n };
    state.tokens[i + 2].meta = { id, text };
  });
});

// A section's mark, in the margin level with its heading on a wide screen and before it on a phone: its
// number and namp's plan sign (ui/src/lib/overview/PlanSign.svelte), all three of the sign's shapes drawn
// and [data-sign] showing one, so a section's state changes as the reader passes it with nothing moving
// round it. The first section is the one in view when the page opens at its top.
const sign = `<svg class="ps" viewBox="0 0 16 16" aria-hidden="true"><g class="planned"><circle cx="8" cy="8" r="6" /></g><g class="running"><circle class="track" cx="8" cy="8" r="6" /><path class="arc" d="M8 2a6 6 0 0 1 5.2 9" /></g><g class="done"><circle cx="8" cy="8" r="6.5" /><path d="m5.2 8.3 1.9 1.9 3.8-4.1" /></g></svg>`;

markdown.renderer.rules.heading_open = (tokens, i, options, env, self) => {
  const open = self.renderToken(tokens, i, options);
  const n = tokens[i].meta?.n;
  if (!n) return open;
  return `${open}<span class="mark" data-sign="${n === 1 ? "running" : "planned"}" aria-hidden="true"><span class="n">§${n}</span>${sign}</span>`;
};

markdown.renderer.rules.heading_close = (tokens, i) => {
  const { id, text } = tokens[i].meta ?? {};
  const link = id ? ` <a class="anchor" href="#${id}" aria-label="Link to ${markdown.utils.escapeHtml(text)}">#</a>` : "";
  return `${link}</${tokens[i].tag}>\n`;
};

// Inline code stays whole on its line, as a command is typed; one too long for a phone's line, an address
// or a path, may break anywhere.
markdown.renderer.rules.code_inline = (tokens, i) => {
  const { content } = tokens[i];
  return `<code${content.length > 24 ? ' class="long"' : ""}>${markdown.utils.escapeHtml(content)}</code>`;
};

// A command, fenced as sh, gets a Copy button, which the page wires; what a command prints, fenced
// as text, gets none.
markdown.renderer.rules.fence = (tokens, i) => {
  const { content, info } = tokens[i];
  const code = `<pre><code>${markdown.utils.escapeHtml(content.replace(/\n$/, ""))}</code></pre>`;
  if (info.trim() !== "sh") return `<div class="code output">${code}</div>\n`;
  return `<div class="code">${code}<button type="button" class="copy" data-copy>Copy</button></div>\n`;
};

function render(slug, file) {
  const source = files[`/docs/${file}.md`];
  if (source === undefined) throw new Error(`docs/${file}.md is missing`);
  const tokens = markdown.parse(source, {});
  const title = tokens.find((token, i) => token.type === "inline" && tokens[i - 1]?.tag === "h1")?.content;
  if (!title) throw new Error(`docs/${file}.md has no title`);
  const description = tokens.find((token, i) => token.type === "inline" && tokens[i - 1]?.type === "paragraph_open")?.content ?? "";
  const sections = tokens.filter((token) => token.type === "heading_close" && token.tag === "h2").map((token) => token.meta);
  // The opening, the title and what comes before the first section, apart from the rest, for On this page
  // to sit between them on a narrow screen.
  const first = tokens.findIndex((token) => token.type === "heading_open" && token.tag === "h2");
  const lede = (first < 0 ? tokens.length : first) - 1;
  const html = (part) => markdown.renderer.render(part, markdown.options, {});
  return {
    slug,
    path: slug ? `/docs/${slug}` : "/docs",
    title,
    description: description.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/`/g, ""),
    sections,
    opening: html(tokens.slice(0, lede + 1)),
    html: html(tokens.slice(lede + 1)),
  };
}

export const pages = order.map(([slug, file]) => render(slug, file));

// The page at /docs/<slug>, or undefined.
export function page(slug = "") {
  return pages.find((page) => page.slug === slug);
}
