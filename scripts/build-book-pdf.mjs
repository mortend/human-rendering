import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { book } from "./book-config.mjs";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, "..");
const contentDir = path.join(root, "content");
const outputDir = path.join(root, "output");
const markdownPath = path.join(outputDir, `${book.slug}.md`);
const pdfPath = path.join(outputDir, `${book.slug}.pdf`);
const cssPath = path.join(root, "styles", "book.css");

function esc(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
function plainHeading(value) {
  return value
    .replace(/\s+\{#[^}]+\}\s*$/, "")
    .replaceAll(/[*_`]/g, "")
    .replaceAll(/<[^>]+>/g, "")
    .trim();
}
function slug(value) {
  return (
    plainHeading(value)
      .normalize("NFKD")
      .replaceAll(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/^-|-$/g, "") || "section"
  );
}

function addHeadingIds(markdown) {
  const used = new Map();
  const headings = [];
  const content = markdown.replace(
    /^(#{1,3})\s+(.+?)\s*$/gm,
    (line, marks, rawTitle) => {
      const existing = rawTitle.match(/\s+\{#([^}]+)\}\s*$/)?.[1];
      const base = existing ?? slug(rawTitle);
      const count = (used.get(base) ?? 0) + 1;
      used.set(base, count);
      const id = count === 1 ? base : `${base}-${count}`;
      const title = plainHeading(rawTitle);
      headings.push({ level: marks.length, title, id });
      return `${marks} ${title} {#${id}}`;
    },
  );
  return { content, headings };
}

const indexTerms = [
  ["Active inference", /\bactive inference\b/i],
  ["ADHD", /\bADHD\b/i],
  ["Agency", /\bagency\b/i],
  ["Altered states", /\baltered states?\b/i],
  ["Archetype", /\barchetyp(?:e|al|es)\b/i],
  ["Attention", /\battention\b/i],
  ["Attractor", /\battractors?\b/i],
  ["Autism", /\bautis(?:m|tic)\b/i],
  ["Bipolar states", /\bbipolar\b/i],
  ["Capture", /\bcaptur(?:e|ed|ing)\b/i],
  ["Chronic pain", /\bchronic pain\b/i],
  ["Cognitive budget", /\bcognitive budget\b/i],
  ["Cognitive functions", /\bcognitive functions?\b/i],
  ["Constraint", /\bconstraints?\b/i],
  ["Creativity", /\bcreativ(?:e|ity)\b/i],
  ["Evidence", /\bevidence\b/i],
  ["Fe", /\bFe\b/],
  ["Fi", /\bFi\b/],
  ["Function currency", /\bfunction currenc(?:y|ies)\b/i],
  ["Genius", /\bgenius\b/i],
  ["Geometry", /\bgeometry\b/i],
  ["Grip", /\bgrip\b/i],
  ["Historical figures", /\bhistorical figures?\b/i],
  ["Integration", /\bintegration\b/i],
  ["Jung", /\bJung(?:ian)?\b/i],
  ["Leadership", /\bleadership\b/i],
  ["Loop", /\bloops?\b/i],
  ["Manipulation", /\bmanipulat(?:e|ed|ion|ive)\b/i],
  ["Mary Magdalene", /\bMary Magdalene\b/i],
  ["MBTI physics", /\bMBTI physics\b/i],
  ["Meridian case study", /\bMeridian\b/i],
  ["Meta-awareness", /\bmeta-awareness\b/i],
  ["Migraine", /\bmigraine\b/i],
  ["Myth", /\bmyth(?:ic|ology|ological)?\b/i],
  ["Narcissism", /\bnarcissis(?:m|tic)\b/i],
  ["Ne", /\bNe\b/],
  ["Ni", /\bNi\b/],
  ["OCD", /\bOCD\b/],
  ["Openness", /\bopenness\b/i],
  ["Pain", /\bpain\b/i],
  ["Planetary symbolism", /\bplanet(?:s|ary)\b/i],
  ["Prediction", /\bpredict(?:ion|ive|s|ed|ing)\b/i],
  ["Projection", /\bprojection\b/i],
  ["Psychological safety", /\bpsychological safety\b/i],
  ["PTSD", /\bPTSD\b/],
  ["Reality testing", /\breality testing\b/i],
  ["Render graph", /\brender graphs?\b/i],
  ["Salience", /\bsalience\b/i],
  ["Screens", /\bscreens?\b/i],
  ["Se", /\bSe\b/],
  ["Shadow", /\bshadow\b/i],
  ["Si", /\bSi\b/],
  ["Social physics", /\bsocial physics\b/i],
  ["Stack", /\bstacks?\b/i],
  ["Symbol", /\bsymbol(?:s|ic|ism|ically)?\b/i],
  ["Te", /\bTe\b/],
  ["Ti", /\bTi\b/],
  ["Trauma", /\btrauma(?:tic)?\b/i],
  ["Type dynamics", /\btype dynamics\b/i],
  ["Vulkan", /\bVulkan\b/i],
];

function addIndexAnchors(markdown) {
  const hits = new Map(indexTerms.map(([term]) => [term, []]));
  const seenBySection = new Map();
  let section = null;
  let inFence = false;
  const lines = [];
  for (const line of markdown.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      lines.push(line);
      continue;
    }
    const heading = line.match(/^#\s+(.+?)\s+\{#([^}]+)\}\s*$/);
    if (heading) {
      section = heading[2];
      seenBySection.set(section, new Set());
      lines.push(line);
      continue;
    }
    if (/^#{2,6}\s+/.test(line)) {
      lines.push(line);
      continue;
    }
    const skip =
      !section ||
      inFence ||
      section === "alphabetical-index" ||
      section === "notes-and-sources" ||
      line.startsWith("<!--") ||
      line.trimStart().startsWith("|") ||
      !line.trim();
    if (!skip) {
      const seen = seenBySection.get(section);
      for (const [term, pattern] of indexTerms) {
        if (seen.has(term) || !pattern.test(line)) continue;
        const anchors = hits.get(term);
        const id = `idx-${slug(term)}-${anchors.length + 1}`;
        lines.push(`<span id="${id}" class="index-anchor"></span>`);
        anchors.push(id);
        seen.add(term);
      }
    }
    lines.push(line);
  }
  return { content: lines.join("\n"), hits };
}

function renderToc(headings) {
  const entries = headings.filter(
    ({ level, id }) => level === 1 && id !== "human-rendering-ebook",
  );
  return `<nav class="pdf-toc" aria-label="Table of contents">${entries.map(({ title, id }) => `<div class="toc-entry"><a href="#${id}"><span>${esc(title)}</span></a></div>`).join("\n")}</nav>`;
}

function renderIndex(hits) {
  const entries = [...hits.entries()]
    .filter(([, anchors]) => anchors.length)
    .sort(([a], [b]) => a.localeCompare(b, "en", { sensitivity: "base" }));
  return `<div class="pdf-index">${entries.map(([term, anchors]) => `<div class="index-entry"><span class="index-term">${esc(term)}</span><span class="index-pages">${anchors.map((id) => `<a href="#${id}" aria-label="Page for ${esc(term)}"></a>`).join(", ")}</span></div>`).join("\n")}</div>`;
}
const manuscriptFiles = [
  "frontmatter.md",
  "manuscript.md",
  "function-atlas.md",
  "interaction-atlas.md",
  "type-atlas.md",
  "graphics-programming-lab.md",
  "social-dynamics.md",
  "source-connections.md",
  "production-field-guide.md",
  "longitudinal-case-study.md",
  "production-cases.md",
  "diagram-plates.md",
  "glossary.md",
  "references.md",
];
const rawManuscript = (
  await Promise.all(
    manuscriptFiles.map((file) => readFile(path.join(contentDir, file), "utf8")),
  )
).join("\n\n");
const versionedManuscript = rawManuscript.replace(
  "<!-- BOOK_VERSION -->",
  `**${book.status} · Version ${book.version}**`,
);
const withHeadings = addHeadingIds(versionedManuscript);
const withIndexAnchors = addIndexAnchors(withHeadings.content);
const manuscript = withIndexAnchors.content
  .replace("<!-- GENERATED_TOC -->", renderToc(withHeadings.headings))
  .replace("<!-- GENERATED_INDEX -->", renderIndex(withIndexAnchors.hits));
const parts = [
  `<style>\n${await readFile(cssPath, "utf8")}\n</style>`,
  `<section class="cover"><div class="series">THE HUMAN ENGINEERING COLLECTION · VOLUME II</div><h1>${book.title}</h1><p class="subtitle">${book.subtitle}</p><p class="meta">${book.status} · ${book.version}<br>${book.author}</p></section>`,
  manuscript,
];
await mkdir(outputDir, { recursive: true });
const composedMarkdown = `${parts.join("\n\n")}\n`;
await writeFile(markdownPath, composedMarkdown, "utf8");
const pdfEngine = process.env.PDF_ENGINE ?? "weasyprint";
const result = spawnSync(
  "pandoc",
  [
    markdownPath,
    "-o",
    pdfPath,
    `--pdf-engine=${pdfEngine}`,
    ...(pdfEngine === "weasyprint"
      ? ["--pdf-engine-opt=--pdf-variant=pdf/ua-1"]
      : []),
    `--metadata=title:${book.title}`,
    `--metadata=version:${book.version}`,
    "--metadata=author:Morten D.",
    `--metadata=subject:${book.subtitle}`,
    `--metadata=description:${book.subtitle}`,
    "--metadata=keywords:MBTI,cognitive functions,graphics programming,social dynamics,human engineering",
    "--metadata=lang:en",
  ],
    { cwd: root, stdio: "inherit" },
);
if (result.status !== 0) process.exit(result.status ?? 1);
if (pdfEngine === "weasyprint") {
  const repair = spawnSync(
    "uv",
    ["run", path.join(dir, "repair-pdf-ua.py"), pdfPath],
    {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, UV_CACHE_DIR: path.join(dir, "tmp", "uv-cache") },
    },
  );
  if (repair.status !== 0) process.exit(repair.status ?? 1);
}
console.log(`Wrote ${pdfPath}`);
