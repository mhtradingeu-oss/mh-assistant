import fs from "fs";
import path from "path";

const root = process.cwd();
const pagesDir = path.join(root, "public/control-center/pages");
const outDir = path.join(root, "audits/system-truth/t71-remaining-frontend-risk-after-core-surfaces");

const closedTargets = new Set([
  "public/control-center/pages/workflows.js",
  "public/control-center/pages/publishing.js",
  "public/control-center/pages/library.js",
  "public/control-center/pages/ai-command.js",
  "public/control-center/pages/ai-command/tool-dock.js",
  "public/control-center/pages/integrations.js",
  "public/control-center/pages/settings.js",
  "public/control-center/pages/media-studio/workspace.js",
  "public/control-center/pages/governance.js",
  "public/control-center/pages/operations-centers.js",
  "public/control-center/pages/content-studio/workspace.js",
  "public/control-center/pages/campaign-studio.js",

  // Closed after T61
  "public/control-center/pages/home.js",
  "public/control-center/pages/setup.js",
  "public/control-center/pages/customer-center.js",
  "public/control-center/pages/insights.js"
]);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(full);
    }
  }

  return files;
}

function countMatches(text, regex) {
  return [...text.matchAll(regex)].length;
}

function classifyPriority(relativePath, score) {
  if (score >= 70) return "P0";
  if (score >= 35) return "P1";
  if (score >= 12) return "P2";
  return "P3";
}

const files = walk(pagesDir);

const rows = files.map((file) => {
  const rel = path.relative(root, file);
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/).length;

  const innerHTML = countMatches(text, /innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/g);
  const events = countMatches(text, /addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/g);
  const apiWrites = countMatches(text, /POST|PUT|PATCH|DELETE|create|update|delete|save|send|reply|assign|resolve|close|reopen|escalate|handoff|execute|approve|publish|sync|import|generate|archive/gi);
  const authorityWords = countMatches(text, /publish|approve|send|execute|sync|import|delete|archive|credential|token|secret|customer|ticket|reply|assign|provider|governance|handoff|workflow|campaign|ad|ads|insight|analytics|learning/gi);
  const confirmations = countMatches(text, /confirm\(/g);
  const storage = countMatches(text, /localStorage|sessionStorage/g);
  const disabled = countMatches(text, /disabled|read-only|locked|future|protected|handoff-only|projection/gi);
  const escapeEvidence = countMatches(text, /escapeHtml|safeText|textContent/g);

  const score =
    innerHTML * 8 +
    events * 2 +
    apiWrites * 2.4 +
    authorityWords * 0.85 +
    storage * 3 -
    confirmations * 3 -
    disabled * 0.8 -
    Math.min(escapeEvidence, 50) * 0.25;

  return {
    file: rel,
    closed: closedTargets.has(rel),
    lines,
    innerHTML,
    events,
    apiWrites,
    authorityWords,
    confirmations,
    storage,
    disabled,
    escapeEvidence,
    score: Number(Math.max(score, 0).toFixed(1)),
    priority: classifyPriority(rel, score)
  };
});

const openRows = rows
  .filter((row) => !row.closed)
  .sort((a, b) => b.score - a.score || b.lines - a.lines);

const closedRows = rows
  .filter((row) => row.closed)
  .sort((a, b) => a.file.localeCompare(b.file));

fs.mkdirSync(outDir, { recursive: true });

const result = {
  status: "audit-only",
  total_page_js_files: rows.length,
  closed_excluded_count: closedRows.length,
  remaining_open_count: openRows.length,
  closed_excluded: closedRows,
  remaining_open_ranked: openRows,
  next_candidate: openRows[0] || null
};

fs.writeFileSync(
  path.join(outDir, "t71-remaining-frontend-risk-after-core-surfaces.json"),
  JSON.stringify(result, null, 2)
);

function table(rows) {
  if (!rows.length) return "| Rank | File | Priority | Score | Lines | Events | Writes | Authority Words |\n|---:|---|---|---:|---:|---:|---:|---:|\n";
  return [
    "| Rank | File | Priority | Score | Lines | Events | Writes | Authority Words |",
    "|---:|---|---|---:|---:|---:|---:|---:|",
    ...rows.map((row, index) =>
      `| ${index + 1} | \`${row.file}\` | ${row.priority} | ${row.score} | ${row.lines} | ${row.events} | ${row.apiWrites} | ${row.authorityWords} |`
    )
  ].join("\n");
}

const md = `# T71 — Remaining Frontend Risk Rebaseline After Core Surfaces

## Status
Audit-only. No production files changed.

## Baseline
This rebaseline excludes the runtime-authority surfaces already reviewed and closed through T70.

## Counts
- Total page JS files: ${rows.length}
- Closed/excluded files: ${closedRows.length}
- Remaining open files: ${openRows.length}

## Next Candidate
${openRows[0] ? `- File: \`${openRows[0].file}\`
- Priority: ${openRows[0].priority}
- Score: ${openRows[0].score}
- Lines: ${openRows[0].lines}` : "- none"}

## Remaining Open Ranking
${table(openRows.slice(0, 30))}

## Closed / Excluded Surfaces
${closedRows.map((row) => `- \`${row.file}\``).join("\n")}

## Decision Rule
Take the next candidate from this ranking and perform a focused runtime-authority audit before any patch.
`;

fs.writeFileSync(
  path.join(outDir, "T71_REMAINING_FRONTEND_RISK_AFTER_CORE_SURFACES.md"),
  md
);

console.log("Generated audits/system-truth/t71-remaining-frontend-risk-after-core-surfaces/T71_REMAINING_FRONTEND_RISK_AFTER_CORE_SURFACES.md");
