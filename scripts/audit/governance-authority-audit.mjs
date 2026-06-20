import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/governance.js";
const outDir = path.join(root, "audits/system-truth/t39-governance-authority");

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
  ["Imported/backend API calls", /\bfetch\s*\(|api\.|await\s+\w+\(|createProject|updateProject|decideProject|deleteProject|approve|reject/i],
  ["Approval decision signals", /approve|approved|reject|rejected|decision|decide|pending|review/i],
  ["Governance policy/action wording", /governance|policy|rule|approval|authority|compliance|risk|override|permission/i],
  ["Confirmation gates", /window\.confirm|confirm\(/i],
  ["Dangerous/direct actions", /delete|archive|disconnect|reconnect|sync|publish|send|approve|reject|override|disable|reset/i],
  ["Event handlers", /onclick|addEventListener|onchange|oninput|keydown|submit/i],
  ["Project/task/handoff writes", /createProjectTask|createProjectHandoff|updateProjectGovernancePolicy|decideProjectApproval|createProjectApproval|saveProject/i],
  ["Routing/handoff", /navigateTo|destination_page|source_page|handoff|route/i],
  ["Local/session storage", /localStorage|sessionStorage/i],
  ["Copy defect candidates", /ControlCenter|governanceapproval|needsreview|reviewready|approvalqueue|riskreview|policyblock/i]
];

let md = `# T39 — Governance Runtime Authority + Approval Decision Safety Audit

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Why This Page Is Next
T38 rebaseline ranked Governance as the highest remaining open frontend risk candidate.

T38 signals:
- Score: 440.5
- Priority: P0
- Lines: 1490
- API/write signals: 102
- Authority words: 714
- Confirmations: 4

## Purpose
Verify whether Governance:
- approves/rejects items directly
- mutates governance policy or approval state
- uses explicit confirmation gates for sensitive decisions
- routes approvals/tasks/handoffs correctly
- renders dynamic approval/policy content safely
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

const hasBackendCall = /\bfetch\s*\(|api\.|await\s+\w+\(|createProject|updateProject|decideProject|deleteProject/i.test(text);
const hasApprovalDecision = /decideProjectApproval|approve|reject|decision/i.test(text);
const hasConfirm = /window\.confirm|confirm\(/.test(text);
const hasPolicyWrite = /updateProjectGovernancePolicy|policy_rules|approval_owners|settings_bridge/i.test(text);
const hasHandoff = /createProjectHandoff|destination_page|source_page|handoff/i.test(text);
const hasStorage = /localStorage|sessionStorage/.test(text);
const hasDangerous = /delete|archive|disconnect|reconnect|sync|publish|send|approve|reject|override|disable|reset/i.test(text);

md += `

## Preliminary Verdict

| Area | Verdict |
|---|---|
| Backend/API/write signals | ${hasBackendCall ? "Found - focused proof required" : "Not found"} |
| Approval decision signals | ${hasApprovalDecision ? "Found - focused proof required" : "Not found"} |
| Confirmation gates | ${hasConfirm ? "Found" : "Not found"} |
| Governance policy write signals | ${hasPolicyWrite ? "Found - focused proof required" : "Not found"} |
| Handoff/routing signals | ${hasHandoff ? "Found" : "Not found"} |
| Local/session storage | ${hasStorage ? "Found - verify scope" : "Not found"} |
| Dangerous/direct wording | ${hasDangerous ? "Found - determine wording vs execution" : "Not found"} |

## Decision Guidance
- If Governance approves/rejects backend approval items, every decision path must require explicit confirmation.
- If policy writes exist, verify confirmation and backend authority.
- If handoffs/tasks are created, verify whether they are review-only or durable mutations.
- If dangerous terms are only labels/statuses, no patch is required.
- Do not patch from T39 alone.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T39_GOVERNANCE_RUNTIME_AUTHORITY_AUDIT.md"), md);

console.log("Generated audits/system-truth/t39-governance-authority/T39_GOVERNANCE_RUNTIME_AUTHORITY_AUDIT.md");
