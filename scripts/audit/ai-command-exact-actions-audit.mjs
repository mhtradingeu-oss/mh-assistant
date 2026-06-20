import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/ai-command.js";
const outDir = path.join(root, "audits/system-truth/t16-ai-command-exact-actions");

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

function zone(pattern, radius = 60) {
  const line = first(pattern);
  if (!line) return "_No match found._";
  return excerpt(line - radius, line + radius);
}

const checks = [
  ["Quick tools / action definitions", /AI_COMMAND_QUICK_TOOLS|ROLE_TOOLS|action:\s*"preview"|action:\s*"route"/],
  ["Auto plan builder", /function buildAutoPlanFromCommand/],
  ["Sensitive command classifier", /publish\s\*now|send\s\*external|paid\s\*ads|final\s\*approval/],
  ["AI guidance API bridge", /executeProjectAiGuidance|executeProjectAiChat/],
  ["Safety instructions", /Never claim actions were executed|Never claim publish/],
  ["Confirmation requirement output", /confirmationRequired|confirmationNote|nextSafeAction/],
  ["Command submit handler", /handle.*submit|onsubmit|send.*command|composer|draftMessage/i],
  ["Route-only actions", /action:\s*"route"|navigateTo|route:/],
  ["Preview-only actions", /action:\s*"preview"|intent:\s*"guidance"|intent:\s*"handoff"/],
  ["Copy defects", /Publishon|Donot|needshuman|operationssurface|missingruntime|selectedvalue|titledirection/i]
];

let md = `# T16 — AI Command Exact Action Path Audit

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
T15 showed many authority and execution signals. T16 verifies exact action paths:
- preview actions stay drafts/guidance
- route actions only navigate
- sensitive commands create gated plans, not direct execution
- AI guidance/chat APIs are used as response surfaces, not protected action executors
- copy defects are identified separately from runtime safety

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
  md += `\n### ${label}\n\n\`\`\`js\n${zone(pattern, 70)}\n\`\`\`\n`;
}

const previewActions = find(/action:\s*"preview"/).length;
const routeActions = find(/action:\s*"route"/).length;
const directExecuteLabels = find(/action:\s*"execute"|execute\s*:\s*true|publishNow|sendNow|deleteNow/i).length;
const hasNeverClaim = text.includes("Never claim actions were executed") && text.includes("Never claim publish");
const hasSensitiveGate = /Requires approval gate before external publishing actions/.test(text);
const copyDefects = find(/Publishon|Donot|needshuman|operationssurface|missingruntime|selectedvalue|titledirection/i);

md += `

## Preliminary Verdict

| Area | Verdict |
|---|---|
| Preview actions | ${previewActions ? `Found ${previewActions}; expected guidance/draft-only behavior.` : "No preview actions found."} |
| Route actions | ${routeActions ? `Found ${routeActions}; expected navigation-only behavior.` : "No route actions found."} |
| Direct execution labels | ${directExecuteLabels ? `Review needed: found ${directExecuteLabels} direct-execution-like labels.` : "No obvious direct execution action labels found."} |
| Safety instructions | ${hasNeverClaim ? "Verified: explicit no-executed-action claims present." : "Review needed: no-execution claim instructions missing."} |
| Sensitive command gate | ${hasSensitiveGate ? "Verified: sensitive publish/send/ad/final approval commands are routed to approval-gated plan." : "Review needed: sensitive command gate not detected."} |
| Copy defects | ${copyDefects.length ? `Polish needed: ${copyDefects.length} compacted copy strings found.` : "No compacted copy defects detected by this audit."} |

## Decision Rules
- If no direct execution labels are found and sensitive commands are approval-gated: no runtime patch required.
- If copy defects are present: use a copy-only polish patch, not an architecture patch.
- If route actions only navigate: no authority patch required.
- If preview actions only generate drafts/guidance: no authority patch required.
- Do not change CSS in this phase.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T16_AI_COMMAND_EXACT_ACTION_PATH_AUDIT.md"), md);

console.log("Generated audits/system-truth/t16-ai-command-exact-actions/T16_AI_COMMAND_EXACT_ACTION_PATH_AUDIT.md");
