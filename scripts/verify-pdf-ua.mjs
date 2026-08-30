import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const edition = "reader";
const pdf = path.join(root, "output", "human-rendering-ebook.pdf");
const result = spawnSync(
  "verapdf",
  ["--format", "json", "--flavour", "ua1", "--maxfailuresdisplayed", "10", pdf],
  {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  },
);
if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(result.status ?? 1);
}

let report;
try {
  report = JSON.parse(result.stdout);
} catch (error) {
  console.error(`Could not parse veraPDF output: ${error.message}`);
  console.error(result.stderr);
  process.exit(1);
}

const validation = report?.report?.jobs?.[0]?.validationResult?.[0];
if (!validation?.compliant) {
  const failures = validation?.details?.ruleSummaries
    ?.filter(({ ruleStatus }) => ruleStatus === "FAILED")
    .map(
      ({ clause, testNumber, description, failedChecks }) =>
        `${clause}-${testNumber}: ${description} (${failedChecks})`,
    )
    .join("\n");
  console.error(
    `veraPDF reports that the ${edition} edition is not PDF/UA-1 compliant.\n${failures ?? "No rule details returned."}`,
  );
  process.exit(1);
}

console.log(
  `veraPDF confirmed ${edition} PDF/UA-1 compliance: ${validation.details.passedRules} rules and ${validation.details.passedChecks} checks passed.`,
);
