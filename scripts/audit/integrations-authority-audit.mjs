import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/integrations.js";
const outDir = path.join(root, "audits/system-truth/t20-integrations-authority");

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

const signals = {
  rendering: find(/\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML/i),
  reconnect: find(/reconnect|repair integration|repair.*connection/i),
  disconnect: find(/disconnect/i),
  sync: find(/\bsync\b|import-history|importHistory|test connection|testConnection/i),
  credentials: find(/credential|api key|secret|token|client id|client secret|store url|consumer key|consumer secret/i),
  governance: find(/governance|approval|approval_required|governance_approval_required|approval_id/i),
  confirmations: find(/window\.confirm|confirm\s*\(/i),
  backendActions: find(/api\.|await\s+\w+|connect|disconnect|reconnect|sync|test|import/i),
  navigation: find(/navigateTo\(|route/i),
  escapeEvidence: find(/escapeHtml|textContent|asString|sanitize/i)
};

const focus = [
  ["Imports / backend functions", /^import\s+/],
  ["Provider catalog / supported ids", /UNSUPPORTED_INTEGRATION_IDS|INTEGRATION|provider/i],
  ["Credentials form / fields", /credential|api key|secret|token|store url|consumer key|consumer secret/i],
  ["Reconnect / repair action", /reconnect|repair integration|repair.*connection/i],
  ["Governance approval path", /governance_approval_required|approval_id|navigateTo\("governance"\)/i],
  ["Disconnect confirmation", /Confirm integration disconnect|window\.confirm/i],
  ["Sync / import / test actions", /\bsync\b|import-history|test connection|testConnection/i],
  ["Main render", /root\.innerHTML|renderIntegrations|build.*markup/i],
  ["Action binding", /onclick|addEventListener|onchange|bind/i]
];

let md = `# T20 — Integrations Runtime Authority + Provider Action Safety Audit

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Why This Page Is Next
T19 ranked Integrations as the highest remaining risk candidate:
- P0 review
- risk score: 80.1
- authority words: high
- provider actions: reconnect, disconnect, sync, credentials, external systems
- governance approval is expected to own sensitive actions

## Purpose
Verify whether Integrations safely handles provider authority:
- reconnect/repair must be backend-governed
- disconnect must require explicit confirmation
- sync/import/test actions must be routed through backend authority
- missing credentials must be visible but not leaked
- governance approval required responses must navigate to Governance
- frontend must not fake provider connection success

## Summary Counts

| Signal | Count |
|---|---:|
`;

for (const [key, rows] of Object.entries(signals)) {
  md += `| ${key} | ${rows.length} |\n`;
}

md += `

## High-Level Preliminary Decision
Do not patch yet. T20 only determines whether Integrations needs:
- confirmation patch
- governance approval visibility patch
- provider credential clarity patch
- reconnect/sync authority patch
- or closeout/no patch

## Signal Details
`;

for (const [title, rows] of Object.entries(signals)) {
  md += `\n### ${title}\n\n`;
  md += rows.length
    ? table(rows.slice(0, 60), [
        { label: "Line", value: r => r.line },
        { label: "Code", value: r => `\`${r.text.trim()}\`` }
      ])
    : "_No matches._\n";
}

md += `\n## Focus Zones\n`;

for (const [title, pattern] of focus) {
  md += `\n### ${title}\n\n\`\`\`js\n${zone(pattern, 80)}\n\`\`\`\n`;
}

const hasDisconnectConfirm = /Confirm integration disconnect|window\.confirm/.test(text);
const hasGovernanceApprovalPath = /governance_approval_required/.test(text) && /navigateTo\("governance"\)/.test(text);
const hasReconnect = /reconnect|repair integration|repair.*connection/i.test(text);
const hasEscaping = /escapeHtml|textContent/.test(text);
const hasMainRender = /root\.innerHTML/.test(text);

md += `

## Preliminary Verdict

| Area | Verdict |
|---|---|
| Main render path | ${hasMainRender ? "Found" : "Review needed"} |
| Escaping evidence | ${hasEscaping ? "Found" : "Review needed"} |
| Reconnect / repair behavior | ${hasReconnect ? "Found - requires focused proof" : "Not found"} |
| Governance approval path | ${hasGovernanceApprovalPath ? "Found" : "Review needed"} |
| Disconnect confirmation | ${hasDisconnectConfirm ? "Found" : "Review needed"} |

## Decision Rules
- If reconnect/repair creates or respects governance approval: safe enough, may close or polish.
- If disconnect has explicit confirmation: likely safe, verify exact backend path.
- If sync/import/test actions can mutate state without confirmation or governance: focused patch required.
- If missing credential display is unclear: UX/copy patch only.
- If sensitive provider data is rendered unsafely: safety patch required.
- Do not change CSS in this phase.
- Do not change backend authority in this phase.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T20_INTEGRATIONS_RUNTIME_AUTHORITY_AUDIT.md"), md);

console.log("Generated audits/system-truth/t20-integrations-authority/T20_INTEGRATIONS_RUNTIME_AUTHORITY_AUDIT.md");
