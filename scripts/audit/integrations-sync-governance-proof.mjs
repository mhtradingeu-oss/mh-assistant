import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/integrations.js";
const outDir = path.join(root, "audits/system-truth/t22-integrations-sync-governance");

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

const exactActionBlockStart = Math.max(1, first(/async function persistPrimary/) || 1450);
const exactActionBlockEnd = Math.min(lines.length, 1665);

const checks = [
  ["testProjectIntegration call", /await testProjectIntegration|testProjectIntegration\(/],
  ["syncProjectIntegration call", /await syncProjectIntegration|syncProjectIntegration\(/],
  ["importProjectIntegrationHistory call", /await importProjectIntegrationHistory|importProjectIntegrationHistory\(/],
  ["disconnectProjectIntegration call", /await disconnectProjectIntegration|disconnectProjectIntegration\(/],
  ["connectProjectIntegration call", /await connectProjectIntegration|connectProjectIntegration\(/],
  ["reconnectProjectIntegration call", /await reconnectProjectIntegration|reconnectProjectIntegration\(/],
  ["sync branch", /type === "sync"|action === "sync"/],
  ["test branch", /type === "test"|action === "test"/],
  ["import branch", /type === "import-history"|action === "import-history"/],
  ["governance approval required handling", /governance_approval_required|approval_id|navigateTo\("governance"\)/],
  ["disconnect confirmation", /Confirm integration disconnect|window\.confirm/],
  ["reload after action", /reloadProjectData/],
  ["success messages", /backend sync started|connection test|import|connected|reconnected|disconnected/i],
  ["error handling", /catch \(error\)|showError/]
];

let md = `# T22B — Integrations Exact Sync / Test / Import Block Proof

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Why T22B Exists
The first T22 report did not detect the provider action handler name, even though it found sync/test/import backend function references. T22B inspects the exact action block directly.

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
`;

for (const [label, pattern] of checks) {
  const hits = find(pattern);
  md += `| ${label} | ${hits[0]?.line || "n/a"} | ${hits.length} |\n`;
}

md += `

## Exact Action Block: persist/connect/reconnect/disconnect/sync/test/import

\`\`\`js
${excerpt(exactActionBlockStart, exactActionBlockEnd)}
\`\`\`

## Focused Evidence Zones
`;

for (const [label, pattern] of checks) {
  md += `\n### ${label}\n\n\`\`\`js\n${zone(pattern, 80)}\n\`\`\`\n`;
}

const hasTest = /await testProjectIntegration|testProjectIntegration\(/.test(text);
const hasSync = /await syncProjectIntegration|syncProjectIntegration\(/.test(text);
const hasImport = /await importProjectIntegrationHistory|importProjectIntegrationHistory\(/.test(text);
const hasReconnect = /await reconnectProjectIntegration|reconnectProjectIntegration\(/.test(text);
const hasDisconnectConfirm = /Confirm integration disconnect/.test(text) && /window\.confirm/.test(text);
const hasDisconnect = /await disconnectProjectIntegration|disconnectProjectIntegration\(/.test(text);
const hasGovernance = /governance_approval_required/.test(text) && /navigateTo\("governance"\)/.test(text);
const hasReload = /reloadProjectData/.test(text);
const hasErrors = /catch \(error\)|showError/.test(text);
const hasProviderActionConfirm =
  /Confirm integration sync|Confirm backend sync|Confirm integration test|Confirm import history/i.test(text);

md += `

## Verdict

| Area | Verdict |
|---|---|
| Test connection backend path | ${hasTest ? "Verified backend function exists" : "Review needed"} |
| Sync backend path | ${hasSync ? "Verified backend function exists" : "Review needed"} |
| Import history backend path | ${hasImport ? "Verified backend function exists" : "Review needed"} |
| Reconnect backend path | ${hasReconnect ? "Verified" : "Review needed"} |
| Disconnect confirmation | ${hasDisconnectConfirm ? "Verified" : "Review needed"} |
| Disconnect backend path | ${hasDisconnect ? "Verified" : "Review needed"} |
| Governance approval route | ${hasGovernance ? "Verified for reconnect path" : "Review needed"} |
| Reload after actions | ${hasReload ? "Verified" : "Review needed"} |
| Error handling | ${hasErrors ? "Verified" : "Review needed"} |
| Explicit confirmation for sync/test/import | ${hasProviderActionConfirm ? "Found" : "Not found"} |

## Engineering Decision Needed
If sync/test/import are backend-governed read/import jobs and backend owns governance, a frontend confirmation patch may be optional.
If sync/import can trigger external writes, expensive jobs, or provider-side mutations, add a small confirmation gate before these actions.

Recommended next step after reviewing T22B:
- If backend action block proves only backend-owned jobs: close Integrations authority.
- If sync/import/test lack confirmation and are potentially mutating: patch minimal confirmation + governance handling.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T22_INTEGRATIONS_SYNC_IMPORT_TEST_GOVERNANCE_PROOF.md"), md);

console.log("Generated audits/system-truth/t22-integrations-sync-governance/T22_INTEGRATIONS_SYNC_IMPORT_TEST_GOVERNANCE_PROOF.md");
