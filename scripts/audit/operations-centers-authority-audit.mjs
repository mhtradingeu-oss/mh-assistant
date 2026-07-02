import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/operations-centers.js";
const outDir = path.join(root, "audits/system-truth/t45-operations-centers-authority");

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

function zone(pattern, radius = 90) {
  const line = first(pattern);
  if (!line) return "_No match found._";
  return excerpt(line - radius, line + radius);
}

const checks = [
  ["HTML render / innerHTML", /\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML/i],
  ["Escape / safe rendering evidence", /escapeHtml|textContent|safe\(|sanitize|asString/i],
  ["Imported/backend API calls", /\bfetch\s*\(|api\.|await\s+\w+\(|createProject|updateProject|deleteProject|saveProject|syncProject|importProject|send|notify|notification|customer|task|handoff/i],
  ["Customer operations signals", /customer|crm|lead|order|ticket|support|reply|draft|email|message|outreach|follow[- ]?up/i],
  ["Notification operations signals", /notification|alert|inbox|read|unread|send|broadcast|remind|notify/i],
  ["Task/handoff writes", /createProjectTask|createProjectHandoff|destination_page|source_page|handoff|task/i],
  ["Execution/action wording", /approve|publish|send|sync|import|delete|archive|disconnect|reconnect|execute|run|trigger|start|stop|resolve|assign|complete/i],
  ["Confirmation gates", /window\.confirm|confirm\(/i],
  ["Event handlers", /onclick|addEventListener|onchange|oninput|keydown|submit/i],
  ["Storage signals", /localStorage|sessionStorage/i],
  ["Routing/handoff", /navigateTo|destination_page|source_page|handoff|route/i],
  ["Copy defect candidates", /ControlCenter|customerops|notificationcenter|operationscenter|sendnow|markread|followup|needsreview/i]
];

let md = `# T45 — Operations Centers Runtime Authority Audit

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Why This Page Is Next
T44 rebaseline ranked Operations Centers as the highest remaining open frontend risk candidate.

T44 signals:
- Score: 798.7
- Priority: P0
- Lines: 2268
- innerHTML: 5
- Events: 26
- API/write signals: 274
- Authority words: 523
- Confirmations: 1
- Escape evidence: 268

## Purpose
Verify whether Operations Centers:
- performs customer/support/notification actions directly
- creates tasks or handoffs
- sends, resolves, assigns, completes, triggers, or syncs operations
- uses explicit confirmation gates for sensitive actions
- renders dynamic customer/notification/operations content safely
- needs runtime patch or closeout

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

const hasBackendCall = /\bfetch\s*\(|api\.|await\s+\w+\(|createProject|updateProject|deleteProject|saveProject|syncProject|importProject/i.test(text);
const hasCustomerOps = /customer|crm|lead|order|ticket|support|reply|draft|email|message|outreach|follow[- ]?up/i.test(text);
const hasNotificationOps = /notification|alert|inbox|read|unread|send|broadcast|remind|notify/i.test(text);
const hasTaskOrHandoff = /createProjectTask|createProjectHandoff|destination_page|source_page|handoff|task/i.test(text);
const hasConfirm = /window\.confirm|confirm\(/.test(text);
const hasStorage = /localStorage|sessionStorage/.test(text);
const hasDangerous = /approve|publish|send|sync|import|delete|archive|disconnect|reconnect|execute|run|trigger|start|stop|resolve|assign|complete/i.test(text);

md += `

## Preliminary Verdict

| Area | Verdict |
|---|---|
| Backend/API/write signals | ${hasBackendCall ? "Found - focused proof required" : "Not found"} |
| Customer operations signals | ${hasCustomerOps ? "Found - focused proof required" : "Not found"} |
| Notification operations signals | ${hasNotificationOps ? "Found - focused proof required" : "Not found"} |
| Task/handoff signals | ${hasTaskOrHandoff ? "Found - focused proof required" : "Not found"} |
| Confirmation gates | ${hasConfirm ? "Found" : "Not found"} |
| Storage signals | ${hasStorage ? "Found - verify scope" : "Not found"} |
| Sensitive action wording | ${hasDangerous ? "Found - determine wording vs execution" : "Not found"} |

## Decision Guidance
- If customer outreach, notification send, task creation, resolve/assign/complete, or backend mutation exists, exact action proof is required before any patch.
- If actions are draft-only or route-only, document and close if safe.
- If sensitive backend writes exist without confirmation, add minimal confirmation gates only after focused proof.
- Do not patch from T45 alone.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T45_OPERATIONS_CENTERS_RUNTIME_AUTHORITY_AUDIT.md"), md);

console.log("Generated audits/system-truth/t45-operations-centers-authority/T45_OPERATIONS_CENTERS_RUNTIME_AUTHORITY_AUDIT.md");
