import fs from "fs";
import path from "path";

const root = process.cwd();

const closedTargets = new Set([
  "public/control-center/pages/workflows.js",
  "public/control-center/pages/publishing.js",
  "public/control-center/pages/library.js",
  "public/control-center/pages/ai-command.js",
  "public/control-center/pages/ai-command/tool-dock.js",
  "public/control-center/pages/integrations.js",
  "public/control-center/pages/settings.js"
]);

const pageDirs = [
  "public/control-center/pages"
];

function walk(dir) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  const out = [];
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(rel));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      out.push(rel);
    }
  }
  return out;
}

function count(pattern, text) {
  return (text.match(pattern) || []).length;
}

function classifyPriority(score) {
  if (score >= 70) return "P0";
  if (score >= 40) return "P1";
  if (score >= 20) return "P2";
  return "P3";
}

function pageMetrics(file) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  const lines = text.split(/\r?\n/).length;

  const innerHtml = count(/\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML/g, text);
  const events = count(/onclick|addEventListener|onchange|oninput|keydown|submit/g, text);
  const apiSignals = count(/\bfetch\s*\(|api\.|await\s+\w+\(|saveProject|updateProject|deleteProject|publish|send|sync|disconnect|reconnect/g, text);
  const authorityWords = count(/publish|send|approve|delete|archive|disconnect|reconnect|sync|import|export|governance|approval|workflow|automation|provider|credential|token|secret|billing|admin|permission|policy/gi, text);
  const confirmation = count(/window\.confirm|confirm\(/g, text);
  const storage = count(/localStorage|sessionStorage/g, text);
  const escape = count(/escapeHtml|textContent|safe\(|sanitize|asString/g, text);

  const score =
    innerHtml * 3.5 +
    events * 1.2 +
    apiSignals * 2.2 +
    authorityWords * 0.28 +
    storage * 2 +
    Math.max(0, 8 - confirmation) * 0.8 -
    Math.min(escape, 40) * 0.12;

  return {
    file,
    lines,
    innerHtml,
    events,
    apiSignals,
    authorityWords,
    confirmation,
    storage,
    escape,
    score: Number(score.toFixed(1)),
    priority: classifyPriority(score)
  };
}

const allPages = pageDirs.flatMap(walk).sort();
const openPages = allPages.filter((file) => !closedTargets.has(file));
const closedPages = allPages.filter((file) => closedTargets.has(file));

const ranked = openPages
  .map(pageMetrics)
  .sort((a, b) => b.score - a.score);

const closedRanked = closedPages
  .map(pageMetrics)
  .sort((a, b) => b.score - a.score);

const outDir = path.join(root, "audits/system-truth/t32-remaining-frontend-risk");
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "t32-remaining-frontend-risk.json"),
  JSON.stringify({ closedTargets: [...closedTargets], closedRanked, ranked }, null, 2)
);

function mdTable(rows) {
  let md = "| Rank | Priority | Score | File | Lines | innerHTML | Events | API/write signals | Authority words | Confirmations | Storage | Escape evidence |\n";
  md += "|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|\n";
  rows.forEach((row, index) => {
    md += `| ${index + 1} | ${row.priority} | ${row.score} | \`${row.file}\` | ${row.lines} | ${row.innerHtml} | ${row.events} | ${row.apiSignals} | ${row.authorityWords} | ${row.confirmation} | ${row.storage} | ${row.escape} |\n`;
  });
  return md;
}

const md = `# T32 — Remaining Frontend Risk Rebaseline After Closeouts

## Status
Audit-only. No production files changed.

## Purpose
Rebaseline remaining frontend page risk after closing:
- Workflows
- Publishing
- Library
- AI Command
- AI Command Tool Dock
- Integrations
- Settings

## Counts
- Total page JS files: ${allPages.length}
- Closed targets excluded from next-page ranking: ${closedPages.length}
- Remaining open page JS files: ${openPages.length}

## Closed Targets Snapshot
${mdTable(closedRanked)}

## Remaining Open Page Ranking
${mdTable(ranked.slice(0, 20))}

## Suggested Next Step
Start with the highest remaining P1/P2 page from the open ranking, but audit-only first.

## Notes
This score is a heuristic prioritization model, not a security verdict.
Use exact focused audits before any patch.
Do not patch from T32 alone.
`;

fs.writeFileSync(
  path.join(outDir, "T32_REMAINING_FRONTEND_RISK_REBASELINE.md"),
  md
);

console.log("Generated audits/system-truth/t32-remaining-frontend-risk/T32_REMAINING_FRONTEND_RISK_REBASELINE.md");
