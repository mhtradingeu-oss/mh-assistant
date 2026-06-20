import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/ai-command/tool-dock.js";
const outDir = path.join(root, "audits/system-truth/t26-ai-command-tool-dock");

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

function zone(pattern, radius = 80) {
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
  ["HTML render / innerHTML", /\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML/i],
  ["Selected source render", /selectedNode\.innerHTML|mhos-tool-drawer-selected-source/i],
  ["Select options render", /select\.innerHTML|options\.map/i],
  ["Escape evidence", /escapeHtml|textContent|asString/i],
  ["Publish / send / execute wording", /\bpublish\b|\bsend\b|\bexecute\b|\bapproval\b|\bads\b|\bgovernance\b/i],
  ["Do not execute safeguards", /Do not publish|Do not send|Do not execute|do not publish|do not route|before review/i],
  ["Destination handoff", /destinations:|frontendOwnerPage|chat-preview|publishing|governance|ads-manager|media-studio|content-studio/i],
  ["Action ids", /id:\s*"|action:\s*"|label:\s*"/i],
  ["Event handlers", /onclick|addEventListener|onchange|oninput|keydown/i],
  ["Backend/API calls", /\bfetch\s*\(|api\.|await\s+\w+\(/i],
  ["Window/navigation", /navigateTo|window\.|location\./i],
  ["Dangerous direct actions", /delete|archive|disconnect|reconnect|syncProject|publishProject|sendEmail|runWorkflow|approve/i],
  ["Copy defects candidates", /askor|ControlCenter|theintegration|publishblockers|syncactions|liveoperating|needsreview|reviewready/i]
];

let md = `# T26 — AI Command Tool Dock Authority + Handoff Safety Audit

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Why This Page Is Next
T19 ranked AI Command Tool Dock as the next remaining P1 review candidate after Integrations was closed.

T19 signals:
- Risk score: 57.6
- innerHTML: 4
- authority words: 70
- confirmations: 42
- likely prompt/template/handoff risk rather than direct execution risk

## Purpose
Verify whether Tool Dock is:
- a safe prompt/template/handoff surface
- not a direct execution surface
- not publishing, sending, approving, or running backend actions directly
- using escaped rendering for dynamic content
- clearly routing ownership to the correct workspace
- only needing UX/copy polish, if anything

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
  md += `\n### ${label}\n\n\`\`\`js\n${zone(pattern, 80)}\n\`\`\`\n`;
}

const hasInnerHtml = /\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML/.test(text);
const hasEscape = /escapeHtml|textContent|asString/.test(text);
const hasNoExecute = /Do not publish|Do not send|Do not execute|do not publish|do not route|before review/i.test(text);
const hasDestinations = /destinations:|frontendOwnerPage/.test(text);
const hasBackendCall = /\bfetch\s*\(|api\.|await\s+\w+\(/.test(text);
const hasDangerousDirect = /disconnectProject|reconnectProject|syncProject|publishProject|sendEmail|runWorkflow|approveProject|deleteProject/i.test(text);
const hasCopyDefects = /askor|ControlCenter|theintegration|publishblockers|syncactions|liveoperating|needsreview|reviewready/i.test(text);

md += `

## Preliminary Verdict

| Area | Verdict |
|---|---|
| HTML rendering exists | ${hasInnerHtml ? "Found - needs exact render safety review" : "Not found"} |
| Escaping evidence | ${hasEscape ? "Found" : "Review needed"} |
| Do-not-execute safeguards | ${hasNoExecute ? "Found" : "Review needed"} |
| Destination handoff model | ${hasDestinations ? "Found" : "Review needed"} |
| Direct backend/API calls | ${hasBackendCall ? "Found or possible - focused proof required" : "Not found"} |
| Dangerous direct project/provider actions | ${hasDangerousDirect ? "Found - patch may be required" : "Not found"} |
| Copy defects candidates | ${hasCopyDefects ? "Found - UX/copy polish likely needed" : "Not found"} |

## Decision Guidance
- If Tool Dock only builds prompts/templates and routes destinations, no runtime authority patch is needed.
- If Tool Dock directly calls backend/project/provider actions, focused patch may be required.
- If innerHTML is limited to escaped/controlled local markup, no safety patch is needed.
- If copy defects are user-visible, schedule UX/copy polish after authority closeout.
- Do not patch from T26 alone.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T26_AI_COMMAND_TOOL_DOCK_AUTHORITY_AUDIT.md"), md);

console.log("Generated audits/system-truth/t26-ai-command-tool-dock/T26_AI_COMMAND_TOOL_DOCK_AUTHORITY_AUDIT.md");
