import fs from "fs";
import path from "path";

const root = process.cwd();
const pagesDir = path.join(root, "public/control-center/pages");

const closedFiles = new Set([
  "ai-command.js",
  "ai-command/tool-dock.js",
  "media-studio.js",
  "content-studio.js",
  "research.js",
  "library.js",
  "publishing.js",
  "governance.js",
  "operations-centers.js",
  "workflows.js",
  "settings.js",
  "campaign-studio.js",
  "integrations.js",
  "media-studio-workspace.js",
  "content-studio-workspace.js"
]);

const riskTerms = [
  "executeProjectAiCommand",
  "createProjectHandoff",
  "createProjectApproval",
  "createProjectTask",
  "saveProject",
  "saveProjectContentItem",
  "saveProjectMediaItem",
  "publish",
  "approval",
  "handoff",
  "provider",
  "sync",
  "import",
  "disconnect",
  "reconnect",
  "credential",
  "setSharedHandoff",
  "setSharedAiDraft",
  "navigateTo",
  "window.confirm",
  "confirm"
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    if (entry.isFile() && entry.name.endsWith(".js")) out.push(p);
  }
  return out;
}

function count(content, term) {
  return (content.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
}

const files = walk(pagesDir);

const rows = files.map((file) => {
  const rel = path.relative(pagesDir, file);
  const content = fs.readFileSync(file, "utf8");
  const metrics = Object.fromEntries(riskTerms.map((term) => [term, count(content, term)]));
  const weighted =
    metrics.executeProjectAiCommand * 120 +
    metrics.createProjectHandoff * 100 +
    metrics.createProjectApproval * 100 +
    metrics.createProjectTask * 90 +
    metrics.saveProjectContentItem * 80 +
    metrics.saveProjectMediaItem * 80 +
    metrics.saveProject * 60 +
    metrics.publish * 60 +
    metrics.approval * 45 +
    metrics.handoff * 35 +
    metrics.provider * 30 +
    metrics.sync * 25 +
    metrics.import * 25 +
    metrics.disconnect * 25 +
    metrics.reconnect * 25 +
    metrics.credential * 25 +
    metrics.setSharedHandoff * 45 +
    metrics.setSharedAiDraft * 45 +
    metrics.navigateTo * 15 -
    metrics["window.confirm"] * 35 -
    metrics.confirm * 10;

  return {
    file: rel,
    closed: closedFiles.has(rel),
    score: Math.max(0, weighted),
    metrics
  };
}).sort((a, b) => b.score - a.score || a.file.localeCompare(b.file));

const open = rows.filter((row) => !row.closed);
const openPositive = open.filter((row) => row.score > 0);

const summary = {
  total_page_js_files: files.length,
  closed_files: rows.filter((row) => row.closed).length,
  open_files: open.length,
  open_positive_risk_files: openPositive.length,
  top_open_risks: openPositive.slice(0, 20).map((row) => ({
    file: row.file,
    score: row.score,
    metrics: row.metrics
  }))
};

const outDir = path.join(root, "audits/system-truth/t135-frontend-runtime-risk-rebaseline");
fs.writeFileSync(path.join(outDir, "T135_FRONTEND_RUNTIME_RISK_REBASELINE.json"), JSON.stringify({ summary, rows }, null, 2));

const md = [
  "# T135 — Fresh Frontend Runtime Risk Rebaseline",
  "",
  "## Status",
  "Generated.",
  "",
  "## Baseline",
  "- Media Workspace closed at `70a6640`.",
  "- Content Workspace closed at `3ab22f2`.",
  "",
  "## Summary",
  "",
  `- Total page JS files: ${summary.total_page_js_files}`,
  `- Closed files: ${summary.closed_files}`,
  `- Open files: ${summary.open_files}`,
  `- Open positive-risk files: ${summary.open_positive_risk_files}`,
  "",
  "## Top Open Runtime Risk Files",
  "",
  "| Rank | File | Score |",
  "|---:|---|---:|",
  ...summary.top_open_risks.map((row, index) => `| ${index + 1} | \`${row.file}\` | ${row.score} |`),
  "",
  "## Decision",
  "Use this rebaseline to select the next exact runtime authority audit target.",
  "",
  "Do not patch from this rebaseline alone. Run an exact action-path audit first."
].join("\n");

fs.writeFileSync(path.join(outDir, "T135_FRONTEND_RUNTIME_RISK_REBASELINE.md"), md);

console.log(JSON.stringify(summary, null, 2));
