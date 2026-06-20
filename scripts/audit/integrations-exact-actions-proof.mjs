import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/integrations.js";
const outDir = path.join(root, "audits/system-truth/t21-integrations-exact-actions");

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

function table(rows, columns) {
  let md = `| ${columns.map(c => c.label).join(" | ")} |\n`;
  md += `| ${columns.map(() => "---").join(" | ")} |\n`;
  rows.forEach((row, index) => {
    md += `| ${columns.map(c => String(c.value(row, index)).replaceAll("|", "\\|")).join(" | ")} |\n`;
  });
  return md;
}

const checks = [
  ["Imported backend functions", /connectProjectIntegration|reconnectProjectIntegration|disconnectProjectIntegration|testProjectIntegration|runProjectIntegrationAction/i],
  ["persistPrimary connect/reconnect", /async function persistPrimary/],
  ["reconnect backend call", /await reconnectProjectIntegration/],
  ["governance approval handling", /governance_approval_required|approval_id|navigateTo\("governance"\)/],
  ["disconnect function", /async function disconnect/],
  ["disconnect confirmation", /Confirm integration disconnect|window\.confirm/],
  ["disconnect backend call", /await disconnectProjectIntegration/],
  ["provider action dispatcher", /async function runProviderAction|function runProviderAction|type === "sync"|type === "import-history"|type === "test"/],
  ["sync backend call", /runProjectIntegrationAction|sync triggered|backend sync started/],
  ["test connection path", /testProjectIntegration|connection test|test connection/i],
  ["secret value handling", /isSecretField|getFieldValue|type: "password"/],
  ["main root render", /root\.innerHTML/]
];

let md = `# T21 — Integrations Exact Action Path Proof

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
T20 identified Integrations as the highest remaining risk page. T21 verifies exact action paths:
- connect/reconnect
- governance approval handling
- disconnect confirmation
- sync/import/test backend action path
- secret credential handling
- render boundary

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
  md += `\n### ${label}\n\n\`\`\`js\n${zone(pattern, 95)}\n\`\`\`\n`;
}

const hasReconnectBackend = text.includes("await reconnectProjectIntegration(projectName, integrationId, payload)");
const hasGovernanceApproval = text.includes("governance_approval_required") && text.includes('navigateTo("governance")');
const hasDisconnectConfirm = text.includes("Confirm integration disconnect") && text.includes("window.confirm");
const hasDisconnectBackend = text.includes("await disconnectProjectIntegration(projectName, integrationId");
const hasSyncBackend = /runProjectIntegrationAction|backend sync started|sync triggered from the Control Center/.test(text);
const hasSecretBlank = /isSecretField\(field\).*return ""|if \(isSecretField\(field\)\) return ""/.test(text.replace(/\n/g, " "));
const hasPasswordFields = /type:\s*"password"/.test(text);

md += `

## Preliminary Verdict

| Area | Verdict |
|---|---|
| Reconnect backend authority | ${hasReconnectBackend ? "Verified" : "Review needed"} |
| Governance approval routing | ${hasGovernanceApproval ? "Verified" : "Review needed"} |
| Disconnect confirmation | ${hasDisconnectConfirm ? "Verified" : "Review needed"} |
| Disconnect backend authority | ${hasDisconnectBackend ? "Verified" : "Review needed"} |
| Sync/import/test backend authority | ${hasSyncBackend ? "Found - focused review needed for confirmation/governance policy" : "Review needed"} |
| Secret fields not prefilled | ${hasSecretBlank ? "Verified" : "Review needed"} |
| Password field typing | ${hasPasswordFields ? "Verified" : "Review needed"} |

## Decision
- If sync/import/test are backend-governed and non-destructive: no immediate runtime patch.
- If sync/import/test can mutate external provider state without confirmation/governance: patch required.
- If reconnect respects governance approval and redirects to Governance: safe enough.
- If disconnect confirmation and backend path are verified: safe enough.
- If secret fields are blank/password typed: safe enough.
- Do not patch CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T21_INTEGRATIONS_EXACT_ACTION_PATH_PROOF.md"), md);

console.log("Generated audits/system-truth/t21-integrations-exact-actions/T21_INTEGRATIONS_EXACT_ACTION_PATH_PROOF.md");
