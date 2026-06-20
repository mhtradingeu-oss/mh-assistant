import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/ai-command/tool-dock.js";
const outDir = path.join(root, "audits/system-truth/t27-ai-command-tool-dock-proof");

const text = fs.readFileSync(path.join(root, file), "utf8");
const lines = text.split(/\r?\n/);

function excerpt(start, end) {
  const s = Math.max(1, start);
  const e = Math.min(lines.length, end);
  const out = [];
  for (let i = s; i <= e; i++) {
    out.push(`${String(i).padStart(5, " ")}: ${lines[i - 1]}`);
  }
  return out.join("\n");
}

function find(pattern) {
  return lines
    .map((line, index) => ({ line: index + 1, text: line }))
    .filter(item => pattern.test(item.text));
}

function first(pattern) {
  return find(pattern)[0]?.line || null;
}

function zone(pattern, radius = 70) {
  const line = first(pattern);
  if (!line) return "_No match found._";
  return excerpt(line - radius, line + radius);
}

function table(rows, columns) {
  let md = `| ${columns.map(c => c.label).join(" | ")} |\n`;
  md += `| ${columns.map(() => "---").join(" | ")} |\n`;
  rows.forEach((row, index) => {
    md += `| ${columns.map(c => String(c.value(row, index)).replaceAll("|", "\\|")).join(" | ")} |\n`;
  });
  return md;
}

const checks = [
  ["All innerHTML assignments", /\.innerHTML\s*=/],
  ["Selected source escapeHtml usage", /selectedNode\.innerHTML|escapeHtml\(name\)|escapeHtml\(type\)|escapeHtml\(path\)/],
  ["Select option render safety", /select\.innerHTML|options\.map|escapeHtml|safe\(/],
  ["Direct backend/API calls", /\bfetch\s*\(|api\.|await\s+\w+\(/],
  ["Dangerous direct action terms", /delete|archive|disconnect|reconnect|syncProject|publishProject|sendEmail|runWorkflow|approve/i],
  ["Tool template safeguards", /Do not publish|Do not send|Do not execute|Do not route|before review|review-ready/i],
  ["Handoff destinations", /frontendOwnerPage|destinations:|chat-preview|publishing|governance|ads-manager|media-studio|content-studio/i],
  ["Window usage", /window\.|location\.|navigateTo/i],
  ["Library source mutation", /clearSharedAiSource|getSelectedLibrarySource|setSharedAiSource/i]
];

let md = `# T27 — AI Command Tool Dock Render + Direct Action Proof

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
T26 showed Tool Dock is likely a prompt/template/handoff surface, but flagged:
- 4 innerHTML assignments
- 2 dangerous direct action term hits
- 0 backend/API calls

T27 verifies whether those findings are safe and whether a runtime patch is needed.

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
`;

for (const [label, pattern] of checks) {
  const hits = find(pattern);
  md += `| ${label} | ${hits[0]?.line || "n/a"} | ${hits.length} |\n`;
}

md += `

## Evidence Zones
`;

for (const [label, pattern] of checks) {
  md += `\n### ${label}\n\n\`\`\`js\n${zone(pattern, 90)}\n\`\`\`\n`;
}

const innerHtmlHits = find(/\.innerHTML\s*=/);
const hasBackendCall = /\bfetch\s*\(|api\.|await\s+\w+\(/.test(text);
const hasProjectDanger = /disconnectProject|reconnectProject|syncProject|publishProject|sendEmail|runWorkflow|approveProject|deleteProject/i.test(text);
const hasEscapeInSelectedSource =
  /selectedNode\.innerHTML[\s\S]{0,600}escapeHtml\(name\)/.test(text) &&
  /selectedNode\.innerHTML[\s\S]{0,800}escapeHtml\(type\)/.test(text);
const hasSafeToolList =
  /data-aicmd-tool-dock-template="\$\{safe\(tool\.template\)\}"/.test(text) ||
  /data-aicmd-tool-dock-template=.*safe\(tool\.template\)/.test(text);
const hasNoExecute = /Do not publish|Do not send|Do not execute|before review|review-ready/i.test(text);

md += `

## Verdict

| Area | Verdict |
|---|---|
| innerHTML count | ${innerHtmlHits.length} |
| selected source dynamic escaping | ${hasEscapeInSelectedSource ? "Verified" : "Review needed"} |
| tool list safe attributes/templates | ${hasSafeToolList ? "Verified" : "Review needed"} |
| backend/API calls | ${hasBackendCall ? "Found - review required" : "Not found"} |
| dangerous project/provider direct calls | ${hasProjectDanger ? "Found - patch may be required" : "Not found"} |
| do-not-execute safeguards | ${hasNoExecute ? "Verified" : "Review needed"} |

## Engineering Decision
- If backend/API calls are not found and dangerous direct project/provider calls are not found, Tool Dock does not require runtime authority patch.
- If innerHTML uses escaped dynamic values or static local markup, no XSS patch is required.
- If remaining issues are only copy/spacing/user-visible text, schedule UX/copy polish later.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T27_AI_COMMAND_TOOL_DOCK_RENDER_DIRECT_ACTION_PROOF.md"), md);

console.log("Generated audits/system-truth/t27-ai-command-tool-dock-proof/T27_AI_COMMAND_TOOL_DOCK_RENDER_DIRECT_ACTION_PROOF.md");
