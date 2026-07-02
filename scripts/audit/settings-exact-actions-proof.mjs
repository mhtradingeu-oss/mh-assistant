import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/settings.js";
const outDir = path.join(root, "audits/system-truth/t30-settings-exact-actions");

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

const actionBlockStart = Math.max(1, first(/function bindSettingsActionButtons/) || 1835);
const actionBlockEnd = Math.min(lines.length, 1985);

const checks = [
  ["Imported durable APIs", /saveProjectTeam|updateProjectGovernancePolicy|fetchProjectGovernancePolicy|fetchProjectTeam/],
  ["Action binding", /data-settings-action|bindSettingsActionButtons|addEventListener\("click"/],
  ["save-all branch", /action === "save-all"|data-settings-action="save-all"/],
  ["save confirmation", /Confirm settings save|window\.confirm/],
  ["governance payload mapping", /mapSettingsToGovernancePolicy|governancePayload/],
  ["team payload mapping", /mapSettingsToTeamPayload|teamPayload/],
  ["durable write calls", /await Promise\.all|saveProjectTeam|updateProjectGovernancePolicy/],
  ["handoff after save", /createProjectHandoff|destination_page: "governance"|governance_policy/],
  ["reload after save", /reloadProjectData/],
  ["restore defaults branch", /action === "restore-defaults"|data-settings-action="restore-defaults"/],
  ["review critical branch", /action === "review-critical"|data-settings-action="review-critical"/],
  ["open governance branch", /action === "open-governance"|navigateTo\("governance"\)/],
  ["focus section branch", /action === "focus-section"|scrollIntoView/],
  ["error handling", /catch \(error\)|showError/],
  ["direct dangerous external calls", /publishProject|sendEmail|runWorkflow|syncProject|disconnectProject|reconnectProject|deleteProject|approveProject/i]
];

let md = `# T30 — Settings Exact Action + Durable Write Proof

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
T29 showed Settings can write durable team/governance records. T30 verifies exact action handling:
- save-all
- restore-defaults
- review-critical
- open-governance
- focus-section
- durable write confirmation
- backend authority use
- whether any patch is required

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
`;

for (const [label, pattern] of checks) {
  const hits = find(pattern);
  md += `| ${label} | ${hits[0]?.line || "n/a"} | ${hits.length} |\n`;
}

md += `

## Exact Action Block

\`\`\`js
${excerpt(actionBlockStart, actionBlockEnd)}
\`\`\`

## Focused Evidence Zones
`;

for (const [label, pattern] of checks) {
  md += `\n### ${label}\n\n\`\`\`js\n${zone(pattern, 85)}\n\`\`\`\n`;
}

const hasSaveConfirm = /Confirm settings save/.test(text) && /window\.confirm/.test(text);
const hasDurableWrites = /saveProjectTeam/.test(text) && /updateProjectGovernancePolicy/.test(text);
const hasPromiseAll = /await Promise\.all/.test(text);
const hasHandoff = /createProjectHandoff/.test(text) && /destination_page: "governance"/.test(text);
const hasRestoreBranch = /action === "restore-defaults"/.test(text);
const hasRestoreDurableWrite = /action === "restore-defaults"[\s\S]{0,900}(saveProjectTeam|updateProjectGovernancePolicy|await Promise\.all)/.test(text);
const hasRestoreConfirm = /action === "restore-defaults"[\s\S]{0,900}window\.confirm/.test(text);
const hasDangerousDirect = /publishProject|sendEmail|runWorkflow|syncProject|disconnectProject|reconnectProject|deleteProject|approveProject/i.test(text);
const hasOpenGovernance = /action === "open-governance"[\s\S]{0,500}navigateTo\("governance"\)/.test(text);

md += `

## Verdict

| Area | Verdict |
|---|---|
| Save confirmation before durable writes | ${hasSaveConfirm ? "Verified" : "Review needed"} |
| Durable write APIs present | ${hasDurableWrites ? "Verified" : "Review needed"} |
| Durable writes grouped | ${hasPromiseAll ? "Verified" : "Review needed"} |
| Governance handoff after save | ${hasHandoff ? "Verified" : "Review needed"} |
| Restore defaults branch exists | ${hasRestoreBranch ? "Found" : "Not found"} |
| Restore defaults writes durable data | ${hasRestoreDurableWrite ? "Found - patch may be required" : "Not found in restore branch window"} |
| Restore defaults confirmation | ${hasRestoreConfirm ? "Found" : "Not found"} |
| Open Governance route handoff | ${hasOpenGovernance ? "Verified" : "Review needed"} |
| Dangerous external direct actions | ${hasDangerousDirect ? "Found - review required" : "Not found"} |

## Decision Guidance
- If save-all is the only durable write and it has confirmation, no runtime patch is required.
- If restore-defaults only changes local form/session and marks dirty, no runtime patch is required.
- If restore-defaults writes durable settings without confirmation, add minimal confirmation.
- If dangerous terms are only policy labels/options, no patch is required.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T30_SETTINGS_EXACT_ACTION_DURABLE_WRITE_PROOF.md"), md);

console.log("Generated audits/system-truth/t30-settings-exact-actions/T30_SETTINGS_EXACT_ACTION_DURABLE_WRITE_PROOF.md");
