import fs from "fs";
import path from "path";

const root = process.cwd();
const pagesDir = path.join(root, "public/control-center/pages");
const outDir = path.join(root, "audits/system-truth/t127-frontend-runtime-risk-rebaseline");

const closedFiles = new Set([
  "setup.js",
  "customer-center.js",
  "insights.js",
  "media-studio.js",
  "content-studio.js",
  "research.js",
  "ai-command.js",
  "ai-command/tool-dock.js",
  "library.js",
  "publishing.js",
  "governance.js",
  "operations-centers.js",
  "workflows.js",
  "settings.js",
  "campaign-studio.js",
  "integrations.js"
]);

const riskPatterns = [
  { name: "backend_api", weight: 9, regex: /fetchProject|createProject|saveProject|updateProject|deleteProject|Project[A-Z]|api\./gi },
  { name: "mutation", weight: 8, regex: /create|update|delete|archive|save|submit|approve|reject|publish|queue|schedule|launch|send|sync|import|connect|disconnect|reconnect|execute|run|trigger|start|stop|retry|complete|resolve/gi },
  { name: "provider_integration", weight: 8, regex: /integration|provider|connector|credential|token|secret|api key|webhook|oauth|sync|import|reconnect|disconnect/gi },
  { name: "publishing_governance", weight: 8, regex: /publish|publishing|approval|governance|policy|brand safety|claim|risk|override|freeze/gi },
  { name: "handoff_task_workflow", weight: 7, regex: /handoff|task|workflow|job|queue|notification|setSharedHandoff|createProjectHandoff/gi },
  { name: "ai_execution", weight: 6, regex: /AI|ai-command|assistant|prompt|generate|agent|automation|auto mode/gi },
  { name: "confirmation", weight: -6, regex: /confirm\(/gi },
  { name: "disabled_readonly", weight: -3, regex: /disabled|read-only|readonly|future|preview|not configured|guard|blocked|requires approval/gi }
];

function walk(dir) {
  const out = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      out.push(...walk(full));
    } else if (item.isFile() && item.name.endsWith(".js")) {
      out.push(full);
    }
  }
  return out;
}

function countMatches(text, regex) {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

function relative(file) {
  return path.relative(pagesDir, file).replaceAll(path.sep, "/");
}

const files = walk(pagesDir);

const rows = files.map((file) => {
  const rel = relative(file);
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/).length;

  const signals = {};
  let score = 0;

  for (const pattern of riskPatterns) {
    const count = countMatches(text, new RegExp(pattern.regex.source, pattern.regex.flags));
    signals[pattern.name] = count;
    score += count * pattern.weight;
  }

  if (closedFiles.has(rel)) {
    score -= 10000;
  }

  return {
    file: rel,
    lines,
    closed: closedFiles.has(rel),
    score,
    signals
  };
}).sort((a, b) => b.score - a.score);

const openRows = rows.filter((row) => !row.closed);
const openPositive = openRows.filter((row) => row.score > 0);
const topOpen = openPositive.slice(0, 30);

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "frontend-runtime-risk-rebaseline-t127.json"),
  JSON.stringify({ generated_at: new Date().toISOString(), rows }, null, 2)
);

function table(items) {
  if (!items.length) return "| Rank | File | Score | Lines | Main signals |\n|---:|---|---:|---:|---|\n| - | none | 0 | 0 | - |";
  const header = "| Rank | File | Score | Lines | Main signals |\n|---:|---|---:|---:|---|";
  const body = items.map((row, index) => {
    const main = Object.entries(row.signals)
      .filter(([, value]) => value > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key, value]) => `${key}:${value}`)
      .join(", ");
    return `| ${index + 1} | \`${row.file}\` | ${row.score} | ${row.lines} | ${main || "-"} |`;
  }).join("\n");
  return `${header}\n${body}`;
}

const md = `# T127 — Fresh Frontend Runtime Risk Rebaseline

## Status
Audit-only. No production files changed.

## Purpose
Create a fresh runtime-risk ranking after closing the major authority surfaces:

- Setup
- Customer Center
- Insights
- Media Studio
- Content Studio
- Research
- AI Command main
- AI Command Tool Dock
- Library
- Publishing
- Governance
- Operations Centers
- Workflows
- Settings
- Campaign Studio
- Integrations

## Summary
- Total page JS files scanned: ${rows.length}
- Closed files excluded from active ranking: ${rows.filter((row) => row.closed).length}
- Open files remaining: ${openRows.length}
- Open files with positive runtime risk score: ${openPositive.length}

## Top Open Runtime Risk Files
${table(topOpen)}

## Closed Files
${table(rows.filter((row) => row.closed).sort((a, b) => a.file.localeCompare(b.file)))}

## Decision Rule
Continue with the highest open positive-risk page unless it is:

1. helper-only,
2. already covered by a parent surface,
3. string-only referenced,
4. unused/dead file,
5. or better handled by a duplicate/dead-code cleanup pass.

If the top remaining files are low-risk helpers, run an ownership/usage audit before patching.

## Next Step
Use this rebaseline to choose T128.
`;

fs.writeFileSync(
  path.join(outDir, "T127_FRONTEND_RUNTIME_RISK_REBASELINE.md"),
  md
);

console.log("Generated T127 frontend runtime risk rebaseline");
console.log(`Total page JS files: ${rows.length}`);
console.log(`Closed files: ${rows.filter((row) => row.closed).length}`);
console.log(`Open files: ${openRows.length}`);
console.log(`Open positive risk: ${openPositive.length}`);
console.log("Top open:");
topOpen.slice(0, 12).forEach((row, index) => {
  console.log(`${index + 1}. ${row.file} score=${row.score}`);
});
