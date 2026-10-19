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
  state.tokens.forEach((token, i) => {
    if (token.type !== "heading_open" || token.tag === "h1") return;
    const text = state.tokens[i + 1].children.map((child) => child.content).join("");
    let id = slug(text);
    for (let n = 2; used.has(id); n++) id = `${slug(text)}-${n}`;
    used.add(id);
    token.attrSet("id", id);
    state.tokens[i + 2].meta = { id, text };
  });
});

markdown.renderer.rules.heading_close = (tokens, i) => {
  const { id, text } = tokens[i].meta ?? {};
  const link = id ? ` <a class="anchor" href="#${id}" aria-label="Link to ${markdown.utils.escapeHtml(text)}">#</a>` : "";
  return `${link}</${tokens[i].tag}>\n`;
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
  return {
    slug,
    path: slug ? `/docs/${slug}` : "/docs",
    title,
    description: description.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/`/g, ""),
    sections,
    html: markdown.renderer.render(tokens, markdown.options, {}),
  };
}

export const pages = order.map(([slug, file]) => render(slug, file));

// The page at /docs/<slug>, or undefined.
export function page(slug = "") {
  return pages.find((page) => page.slug === slug);
}
