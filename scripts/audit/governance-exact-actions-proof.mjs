import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/governance.js";
const outDir = path.join(root, "audits/system-truth/t40-governance-exact-actions");

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

function zone(pattern, radius = 85) {
  const line = first(pattern);
  if (!line) return "_No match found._";
  return excerpt(line - radius, line + radius);
}

const bindStart = Math.max(1, first(/function bindGovernance/) || 1260);
const bindEnd = Math.min(lines.length, bindStart + 320);

const checks = [
  ["Imported Governance APIs", /createProjectApproval|decideProjectApproval|fetchProjectGovernance|updateProjectGovernancePolicy/],
  ["bindGovernance block", /function bindGovernance/],
  ["decision button binding", /data-governance-decision|confirmGovernanceDecision|decideProjectApproval/],
  ["decision confirmation", /confirmGovernanceDecision|Confirm Governance decision|window\.confirm/],
  ["approval decision backend call", /decideProjectApproval\(/],
  ["request approval binding", /data-governance-request-approval|createProjectApproval/],
  ["request approval confirmation", /Confirm.*approval request|window\.confirm|confirm\(/],
  ["policy save binding", /save-policy|data-governance-policy|data-governance-owner/],
  ["policy confirmation", /Confirm backend Governance policy save|updateProjectGovernancePolicy|window\.confirm/],
  ["policy backend write", /updateProjectGovernancePolicy\(/],
  ["refresh action", /action === "refresh"|refreshGovernance/],
  ["AI handoff/routing", /data-governance-open-ai|setSharedAiDraft|navigateTo\("ai-command"\)/],
  ["copy compact issues", /RecordHigh-Risk|decisionsshould|selectedItem\.entity_id \|\|selectedItem\.id|is-missing'\}|': 'is-missing'/]
];

let md = `# T40 — Governance Exact Decision + Policy Write Proof

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
T39 showed Governance has approval decisions, policy writes, backend calls, and confirmations. T40 verifies exact action paths:
- approval decision submit
- approval request creation
- durable governance policy save
- refresh-only actions
- AI handoff/routing
- whether confirmation gates protect sensitive backend writes
- whether copy-only defects exist

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
`;

for (const [label, pattern] of checks) {
  const hits = find(pattern);
  md += `| ${label} | ${hits[0]?.line || "n/a"} | ${hits.length} |\n`;
}

md += `

## Main Binding / Action Block

\`\`\`js
${excerpt(bindStart, bindEnd)}
\`\`\`

## Focused Evidence Zones
`;

for (const [label, pattern] of checks) {
  md += `\n### ${label}\n\n\`\`\`js\n${zone(pattern, 90)}\n\`\`\`\n`;
}

const hasDecisionCall = /decideProjectApproval\(/.test(text);
const hasDecisionConfirm = /confirmGovernanceDecision/.test(text);
const hasRequestApproval = /createProjectApproval\(/.test(text);
const hasPolicyWrite = /updateProjectGovernancePolicy\(/.test(text);
const hasPolicyConfirm = /Confirm backend Governance policy save/.test(text);
const hasRefresh = /action === "refresh"/.test(text);
const hasAiRoute = /navigateTo\("ai-command"\)|setSharedAiDraft/.test(text);
const hasCompactCopy = /RecordHigh-Risk|decisionsshould|selectedItem\.entity_id \|\|selectedItem\.id/.test(text);

md += `

## Verdict

| Area | Verdict |
|---|---|
| Approval decision backend call | ${hasDecisionCall ? "Found" : "Not found"} |
| Approval decision confirmation | ${hasDecisionConfirm ? "Found" : "Not found"} |
| Approval request creation | ${hasRequestApproval ? "Found - verify confirmation requirement" : "Not found"} |
| Governance policy durable write | ${hasPolicyWrite ? "Found" : "Not found"} |
| Governance policy confirmation | ${hasPolicyConfirm ? "Found" : "Not found"} |
| Refresh-only action | ${hasRefresh ? "Found" : "Not found"} |
| AI routing/handoff | ${hasAiRoute ? "Found" : "Not found"} |
| Compact copy issues | ${hasCompactCopy ? "Found - copy polish candidate" : "Not found"} |

## Decision Guidance
- If createProjectApproval has no confirmation, add a minimal confirmation gate before creating approval requests.
- If decideProjectApproval is protected by confirmGovernanceDecision, no patch needed for that path.
- If updateProjectGovernancePolicy is protected by explicit policy save confirmation, no patch needed for that path.
- Compact copy issues may be fixed only if touching this file for a required patch, or later in UX/copy polish.
- Do not patch from T40 alone unless exact missing confirmation is confirmed.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T40_GOVERNANCE_EXACT_DECISION_POLICY_WRITE_PROOF.md"), md);

console.log("Generated audits/system-truth/t40-governance-exact-actions/T40_GOVERNANCE_EXACT_DECISION_POLICY_WRITE_PROOF.md");
