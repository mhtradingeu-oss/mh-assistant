import fs from "fs";
import path from "path";

const root = process.cwd();
const outDir = path.join(root, "audits/system-truth/t19-remaining-frontend-risk");

const pageDir = path.join(root, "public/control-center/pages");
const stylesDir = path.join(root, "public/control-center/styles");

const closedTargets = new Set([
  "workflows.js",
  "publishing.js",
  "library.js",
  "ai-command.js"
]);

const closedEvidence = [
  "01822c2 Add Workflows Auto Mode confirmation gates",
  "ee09063 Close Workflows Auto Mode confirmation verification",
  "d025f8b Add Publishing Auto Mode confirmation gates",
  "38c6956 Close Publishing Auto Mode confirmation verification",
  "2a737cc Close Library remaining safety review",
  "7b6fb77 Close AI Command runtime authority review"
];

function walk(dir, predicate = () => true) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full, predicate));
    } else if (predicate(full)) {
      results.push(full);
    }
  }
  return results;
}

function rel(file) {
  return path.relative(root, file);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function countMatches(text, pattern) {
  return (text.match(pattern) || []).length;
}

function lineHits(text, pattern, limit = 30) {
  const lines = text.split(/\r?\n/);
  const hits = [];
  lines.forEach((line, index) => {
    if (pattern.test(line)) {
      hits.push({
        line: index + 1,
        text: line.trim()
      });
    }
  });
  return hits.slice(0, limit);
}

const pageFiles = walk(pageDir, file => file.endsWith(".js"));
const cssFiles = walk(stylesDir, file => file.endsWith(".css"));

const pageReports = pageFiles.map(file => {
  const text = read(file);
  const name = path.basename(file);
  const closed = closedTargets.has(name);

  const metrics = {
    lines: text.split(/\r?\n/).length,
    innerHTML: countMatches(text, /\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML/g),
    directFetch: countMatches(text, /\bfetch\s*\(/g),
    apiImports: countMatches(text, /from\s+["']\.\.\/api\.js["']|from\s+["']\.\.\/\.\.\/api\.js["']/g),
    destructiveWords: countMatches(text, /\b(delete|archive|publish|send|approve|reconnect|disconnect|sync|execute|run|auto|external|budget|ads|crm|ticket|workflow)\b/gi),
    confirmations: countMatches(text, /\bconfirm\s*\(|window\.confirm|approval|governance|approval_required|requires approval/gi),
    routeOnly: countMatches(text, /navigateTo|route:|action:\s*["']route["']/g),
    previewOnly: countMatches(text, /action:\s*["']preview["']|draft|handoff|guidance/gi),
    localStorage: countMatches(text, /localStorage|sessionStorage/g),
    timers: countMatches(text, /setTimeout|setInterval|requestAnimationFrame/g),
    eventHandlers: countMatches(text, /onclick|addEventListener|onchange|oninput|onsubmit|keydown|drop|dragover/g),
    escapeEvidence: countMatches(text, /escapeHtml|textContent|sanitize|asString/g)
  };

  const rawRisk =
    metrics.innerHTML * 6 +
    metrics.directFetch * 4 +
    metrics.destructiveWords * 0.45 +
    Math.max(0, metrics.destructiveWords - metrics.confirmations) * 0.25 +
    metrics.localStorage * 1.2 +
    metrics.timers * 0.8 +
    metrics.eventHandlers * 0.25 -
    metrics.escapeEvidence * 0.08 -
    metrics.confirmations * 0.15;

  const risk = Math.max(0, Number(rawRisk.toFixed(1)));

  const category =
    closed ? "closed-high-risk" :
    risk >= 80 ? "P0 review" :
    risk >= 40 ? "P1 review" :
    risk >= 20 ? "P2 review" :
    "low";

  return {
    file: rel(file),
    name,
    closed,
    category,
    risk,
    metrics,
    keyHits: {
      authority: lineHits(text, /\b(delete|archive|publish|send|approve|reconnect|disconnect|sync|execute|run|auto|external|budget|ads|crm|ticket|workflow)\b/i, 20),
      confirmations: lineHits(text, /\bconfirm\s*\(|window\.confirm|approval|governance|approval_required|requires approval/i, 20),
      rendering: lineHits(text, /\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML/i, 20)
    }
  };
}).sort((a, b) => b.risk - a.risk);

const remaining = pageReports.filter(item => !item.closed);
const closed = pageReports.filter(item => item.closed);

const cssReports = cssFiles.map(file => {
  const text = read(file);
  return {
    file: rel(file),
    lines: text.split(/\r?\n/).length,
    important: countMatches(text, /!important/g),
    pageBlocks: countMatches(text, /Library|Publishing|AI Command|Workflows|Operations|Governance|Media Studio|Settings|Setup|Home/gi),
    duplicateLike: countMatches(text, /\.(library|publishing|ai-command|workflow|governance|media|settings|setup|home)[\w-]*/gi)
  };
}).sort((a, b) => (b.lines + b.important * 10 + b.duplicateLike) - (a.lines + a.important * 10 + a.duplicateLike));

function table(rows, columns) {
  let md = `| ${columns.map(c => c.label).join(" | ")} |\n`;
  md += `| ${columns.map(() => "---").join(" | ")} |\n`;
  rows.forEach((row, index) => {
    md += `| ${columns.map(c => String(c.value(row, index)).replaceAll("|", "\\|")).join(" | ")} |\n`;
  });
  return md;
}

let md = `# T19 — Remaining Frontend Risk Rebaseline

## Status
Audit-only. No production files changed.

## Purpose
Rebaseline remaining frontend risk after closing the highest-risk authority surfaces:
- Workflows
- Publishing
- Library
- AI Command runtime authority

## Closed Evidence
${closedEvidence.map(item => `- ${item}`).join("\n")}

## Scope
- Page files scanned: ${pageReports.length}
- CSS files scanned: ${cssReports.length}
- Closed high-risk page files excluded from next-priority decision: ${closed.length}
- Remaining page files: ${remaining.length}

## Closed High-Risk Targets
${table(closed, [
  { label: "File", value: r => r.file },
  { label: "Risk", value: r => r.risk },
  { label: "Category", value: r => r.category },
  { label: "innerHTML", value: r => r.metrics.innerHTML },
  { label: "authority words", value: r => r.metrics.destructiveWords },
  { label: "confirmations", value: r => r.metrics.confirmations }
])}

## Remaining Top Risk Pages
${table(remaining.slice(0, 20), [
  { label: "Rank", value: (_r, i) => i + 1 },
  { label: "File", value: r => r.file },
  { label: "Risk", value: r => r.risk },
  { label: "Category", value: r => r.category },
  { label: "Lines", value: r => r.metrics.lines },
  { label: "innerHTML", value: r => r.metrics.innerHTML },
  { label: "authority words", value: r => r.metrics.destructiveWords },
  { label: "confirmations", value: r => r.metrics.confirmations },
  { label: "API imports", value: r => r.metrics.apiImports },
  { label: "events", value: r => r.metrics.eventHandlers }
])}

## CSS Risk / Density Signals
${table(cssReports.slice(0, 15), [
  { label: "File", value: r => r.file },
  { label: "Lines", value: r => r.lines },
  { label: "!important", value: r => r.important },
  { label: "page blocks", value: r => r.pageBlocks },
  { label: "selector signals", value: r => r.duplicateLike }
])}

## Recommended Next Decision
`;

const top = remaining[0];
if (top) {
  md += `
The highest remaining page-risk candidate is:

- ${top.file}
- risk score: ${top.risk}
- category: ${top.category}

Recommended next step:
- If this page owns execution-like behavior, run a focused authority/safety audit.
- If it is mostly presentation/density risk, start UX/copy polish only after confirming no runtime authority issue.
`;
} else {
  md += `
No remaining page files found. Proceed to UX polish and production readiness.
`;
}

md += `
## Top Page Evidence Details
`;

for (const item of remaining.slice(0, 8)) {
  md += `\n### ${item.file}\n\n`;
  md += `Risk: ${item.risk} — ${item.category}\n\n`;
  md += `Metrics:\n\n`;
  md += table([item], [
    { label: "Lines", value: r => r.metrics.lines },
    { label: "innerHTML", value: r => r.metrics.innerHTML },
    { label: "directFetch", value: r => r.metrics.directFetch },
    { label: "authority words", value: r => r.metrics.destructiveWords },
    { label: "confirmations", value: r => r.metrics.confirmations },
    { label: "localStorage", value: r => r.metrics.localStorage },
    { label: "events", value: r => r.metrics.eventHandlers },
    { label: "escape", value: r => r.metrics.escapeEvidence }
  ]);

  md += `\nAuthority-like hits:\n\n`;
  if (item.keyHits.authority.length) {
    md += table(item.keyHits.authority, [
      { label: "Line", value: r => r.line },
      { label: "Code", value: r => `\`${r.text}\`` }
    ]);
  } else {
    md += `_No authority-like hits in sample._\n`;
  }

  md += `\nConfirmation hits:\n\n`;
  if (item.keyHits.confirmations.length) {
    md += table(item.keyHits.confirmations, [
      { label: "Line", value: r => r.line },
      { label: "Code", value: r => `\`${r.text}\`` }
    ]);
  } else {
    md += `_No confirmation hits in sample._\n`;
  }

  md += `\nRendering hits:\n\n`;
  if (item.keyHits.rendering.length) {
    md += table(item.keyHits.rendering, [
      { label: "Line", value: r => r.line },
      { label: "Code", value: r => `\`${r.text}\`` }
    ]);
  } else {
    md += `_No HTML rendering hits in sample._\n`;
  }
}

md += `
## Decision Rules
- Do not patch from this scan alone.
- Closed pages remain closed unless browser QA later proves a regression.
- If a remaining page has high authority words and low confirmations, audit it next.
- If risk is mostly CSS/innerHTML/density, schedule UX polish rather than runtime patch.
- Do not change production code in T19.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T19_REMAINING_FRONTEND_RISK_REBASELINE.md"), md);
fs.writeFileSync(path.join(outDir, "t19-remaining-frontend-risk.json"), JSON.stringify({
  closedTargets: [...closedTargets],
  pageReports,
  cssReports
}, null, 2));

console.log("Generated audits/system-truth/t19-remaining-frontend-risk/T19_REMAINING_FRONTEND_RISK_REBASELINE.md");
console.log("Generated audits/system-truth/t19-remaining-frontend-risk/t19-remaining-frontend-risk.json");
