import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "content");
const pdf = path.join(root, "output", "human-rendering-ebook.pdf");
const info = spawnSync("pdfinfo", [pdf], { encoding: "utf8" });
if (info.status !== 0) {
  console.error(info.stderr);
  process.exit(info.status ?? 1);
}
const pages = Number(info.stdout.match(/^Pages:\s+(\d+)/m)?.[1]);
const size = info.stdout.match(/^Page size:\s+(.+)$/m)?.[1] ?? "";
const title = info.stdout.match(/^Title:\s+(.+)$/m)?.[1]?.trim();
const author = info.stdout.match(/^Author:\s+(.+)$/m)?.[1]?.trim();
const tagged = info.stdout.match(/^Tagged:\s+(.+)$/m)?.[1]?.trim();
if (pages < 100) {
  console.error(`Expected at least 100 pages, got ${pages}.`);
  process.exit(1);
}
if (!size.includes("595.276 x 841.89")) {
  console.error(`Expected A4 page size, got ${size}.`);
  process.exit(1);
}
if (title !== "The Human Rendering Pipeline" || author !== "Morten D.") {
  console.error(`Unexpected PDF metadata: title=${title}, author=${author}.`);
  process.exit(1);
}
if (tagged !== "yes") {
  console.error(`Expected a tagged accessible PDF, got Tagged: ${tagged}.`);
  process.exit(1);
}
const metadata = spawnSync("pdfinfo", ["-meta", pdf], { encoding: "utf8" });
if (metadata.status !== 0 || !metadata.stdout.includes('pdfuaid:part="1"')) {
  console.error(
    "Expected PDF/UA-1 identification in the document XMP metadata.",
  );
  process.exit(1);
}
const text = spawnSync("pdftotext", [pdf, "-"], { encoding: "utf8" });
if (text.status !== 0) {
  console.error(text.stderr);
  process.exit(text.status ?? 1);
}
const normalizedText = text.stdout.replaceAll(/\s+/g, " ");
const required = [
  "The Human Rendering Pipeline",
  "The complete function-interaction atlas",
  "The sixteen developmental type patterns",
  "Cognitive functions as social dynamics",
  "Connections beyond type",
  "The Meridian renderer rewrite",
  "Production scenarios",
  "Diagram plates",
  "Alphabetical index",
  "Nazareth Editions",
];
const missing = required.filter((heading) => !normalizedText.includes(heading));
if (missing.length) {
  console.error(`Missing required book sections: ${missing.join(", ")}`);
  process.exit(1);
}
const manuscript = await readFile(path.join(contentDir, "manuscript.md"), "utf8");
if (!manuscript.includes("MBTI Physics for Graphics Programmers"))
  process.exit(1);
const atlas = await readFile(path.join(contentDir, "interaction-atlas.md"), "utf8");
const leadSections = ["Se", "Si", "Ne", "Ni", "Ti", "Te", "Fi", "Fe"].filter(
  (fn) => atlas.includes(`## ${fn} leading`),
);
const receiverRows =
  atlas.match(/^\| \*\*(Se|Si|Ne|Ni|Ti|Te|Fi|Fe)\*\*\s+\|/gm) ?? [];
if (leadSections.length !== 8 || receiverRows.length !== 64) {
  console.error(
    `Expected 8 lead sections and 64 receiver rows; got ${leadSections.length} and ${receiverRows.length}.`,
  );
  process.exit(1);
}
const typeAtlas = await readFile(path.join(contentDir, "type-atlas.md"), "utf8");
const typeCodes = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];
const missingTypes = typeCodes.filter(
  (type) => !typeAtlas.includes(`## ${type} —`),
);
const casebookLabels = [
  "Baseline",
  "Developmental arc",
  "Loop",
  "Grip",
  "Common interpersonal misread",
  "Recovery sequence",
  "Graphics-team scenario",
  "Exercise",
];
const incompleteLabels = casebookLabels.filter(
  (label) =>
    (
      typeAtlas.match(
        new RegExp(
          `\\*\\*${label.replaceAll(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}(?:\\.| —[^*]+\\.)?\\*\\*`,
          "g",
        ),
      ) ?? []
    ).length !== 16,
);
if (missingTypes.length || incompleteLabels.length) {
  console.error(
    `Developmental casebook incomplete. Missing types: ${missingTypes.join(", ") || "none"}; inconsistent labels: ${incompleteLabels.join(", ") || "none"}.`,
  );
  process.exit(1);
}
const longitudinalCase = await readFile(
  path.join(contentDir, "longitudinal-case-study.md"),
  "utf8",
);
const caseStages =
  longitudinalCase.match(/^<section class="longitudinal-stage">$/gm) ?? [];
const caseWords =
  longitudinalCase.match(/\b[\p{L}\p{N}][\p{L}\p{N}'-]*\b/gu) ?? [];
const requiredCaseElements = [
  "success contract",
  "function-interaction atlas",
  "permutation crisis",
  "ship gate",
  "Retrospective",
  "Transfer exercise",
];
const missingCaseElements = requiredCaseElements.filter(
  (element) => !longitudinalCase.includes(element),
);
if (
  caseStages.length !== 11 ||
  caseWords.length < 4000 ||
  missingCaseElements.length
) {
  console.error(
    `Longitudinal case incomplete: ${caseStages.length} stages, ${caseWords.length} words, missing ${missingCaseElements.join(", ") || "nothing"}.`,
  );
  process.exit(1);
}
const generated = await readFile(
  path.join(root, "output", "human-rendering-ebook.md"),
  "utf8",
);
const readerFacingEditorialPhrases = [
  "source material",
  "source archive",
  "research archive",
  "reader edition",
  "editorial source note",
  "supplied research materials",
  "audit edition",
  "developmental architectures",
  "temporary stack reweighting",
  "developmental case models",
];
const editorialLeaks = readerFacingEditorialPhrases.filter((phrase) =>
  generated.toLowerCase().includes(phrase),
);
if (editorialLeaks.length) {
  console.error(
    `Reader-facing editorial language remains: ${editorialLeaks.join(", ")}.`,
  );
  process.exit(1);
}
const tocEntries = generated.match(/class="toc-entry"/g) ?? [];
const indexEntries = generated.match(/class="index-entry"/g) ?? [];
const indexAnchors = generated.match(/class="index-anchor"/g) ?? [];
if (
  tocEntries.length < 20 ||
  indexEntries.length < 45 ||
  indexAnchors.length < 100
) {
  console.error(
    `Navigation generation incomplete: ${tocEntries.length} TOC entries, ${indexEntries.length} index terms, ${indexAnchors.length} locators.`,
  );
  process.exit(1);
}
const destinations = spawnSync("pdfinfo", ["-dests", pdf], {
  encoding: "utf8",
});
const requiredDestinations = [
  "1-the-questions-beneath-consciousness",
  "14-the-complete-function-interaction-atlas",
  "20-the-meridian-renderer-rewrite",
  "alphabetical-index",
  "notes-and-sources",
];
if (
  destinations.status !== 0 ||
  requiredDestinations.some((id) => !destinations.stdout.includes(`\"${id}\"`))
) {
  console.error("Expected linked PDF destinations were not generated.");
  process.exit(1);
}
const css = await readFile(path.join(root, "styles", "book.css"), "utf8");
if (
  !css.includes("bookmark-level: 1") ||
  !css.includes("bookmark-level: 2") ||
  !css.includes("string-set: chapter")
) {
  console.error("Bookmark or running-header rules are missing.");
  process.exit(1);
}
const pdfDebug = spawnSync(
  "gs",
  [
    "-dPDFDEBUG",
    "-dFirstPage=1",
    "-dLastPage=1",
    "-o",
    "/dev/null",
    "-sDEVICE=nullpage",
    pdf,
  ],
  { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
);
if (
  pdfDebug.status !== 0 ||
  !`${pdfDebug.stdout}\n${pdfDebug.stderr}`.includes("/Outlines")
) {
  console.error("The rendered PDF has no bookmark outline dictionary.");
  process.exit(1);
}
const structure = spawnSync("pdfinfo", ["-struct", pdf], { encoding: "utf8" });
if (
  structure.status !== 0 ||
  !structure.stdout.includes("Document") ||
  !structure.stdout.includes("H1") ||
  !structure.stdout.includes("Table")
) {
  console.error(
    "The PDF accessibility structure tree is missing document, heading, or table tags.",
  );
  process.exit(1);
}
const runningHeaders = text.stdout.match(/HUMAN ENGINEERING\s*·\s*II/g) ?? [];
if (runningHeaders.length < pages - 10) {
  console.error(
    `Expected running headers throughout the book; found ${runningHeaders.length} on ${pages} pages.`,
  );
  process.exit(1);
}
const tocText = spawnSync(
  "pdftotext",
  ["-f", "7", "-l", "8", "-layout", pdf, "-"],
  { encoding: "utf8" },
);
if (
  tocText.status !== 0 ||
  !/1\. The questions beneath consciousness\s+\.{3,}\s*9/.test(
    tocText.stdout,
  ) ||
  !/Alphabetical index\s+\.{3,}\s*\d+/.test(tocText.stdout)
) {
  console.error("Page-numbered contents did not render as expected.");
  process.exit(1);
}
console.log(
  `Verified ${pages} tagged PDF/UA A4 pages, 16 complete developmental profiles, publication metadata, ${tocEntries.length} TOC links, a PDF bookmark outline, running headers, and ${indexEntries.length} indexed concepts across ${indexAnchors.length} locators.`,
);
