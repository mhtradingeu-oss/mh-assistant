import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/settings.js";
const outDir = path.join(root, "audits/system-truth/t29-settings-authority");

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

const checks = [
  ["HTML render / innerHTML", /\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML/i],
  ["Escape / safe rendering evidence", /escapeHtml|textContent|safe\(|sanitize|asString/i],
  ["Settings save/update actions", /save|update|persist|apply|submit|set[A-Z]|write/i],
  ["Governance / approval policy wording", /governance|approval|policy|rule|permission|authority/i],
  ["Confirmations", /window\.confirm|confirm\(/i],
  ["Backend/API calls", /\bfetch\s*\(|api\.|await\s+\w+\(/i],
  ["Dangerous/direct actions", /delete|archive|disconnect|reconnect|sync|publish|send|approve|disable|reset/i],
  ["Event handlers", /onclick|addEventListener|onchange|oninput|keydown|submit/i],
  ["Local/session storage", /localStorage|sessionStorage/i],
  ["Project data writes", /projectData|data\/projects|reloadProjectData|saveProject|updateProject/i],
  ["Navigation / route handoff", /navigateTo|window\.location|location\./i],
  ["Copy defect candidates", /ControlCenter|theintegration|needsreview|reviewready|governanceapproval|settingspanel|savechanges/i]
];

let md = `# T29 — Settings Runtime Authority + Governance Safety Audit

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Why This Page Is Next
After closing Integrations and AI Command Tool Dock, T19 ranked Settings as the next remaining P1 review candidate.

## Purpose
Verify whether Settings:
- writes runtime/project/governance state directly
- requires confirmations before sensitive changes
- uses backend authority correctly
- avoids direct dangerous actions
- renders dynamic content safely
- needs runtime patch or only UX/copy polish

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

const hasInnerHtml = /\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML/.test(text);
const hasEscape = /escapeHtml|textContent|safe\(|sanitize|asString/.test(text);
const hasConfirm = /window\.confirm|confirm\(/.test(text);
const hasBackendCall = /\bfetch\s*\(|api\.|await\s+\w+\(/.test(text);
const hasGovernance = /governance|approval|policy|rule|permission|authority/i.test(text);
const hasDanger = /delete|archive|disconnect|reconnect|sync|publish|send|approve|disable|reset/i.test(text);
const hasStorage = /localStorage|sessionStorage/.test(text);
const hasProjectWrites = /saveProject|updateProject|projectData|reloadProjectData/i.test(text);

md += `

## Preliminary Verdict

| Area | Verdict |
|---|---|
| HTML rendering exists | ${hasInnerHtml ? "Found - render safety proof may be required" : "Not found"} |
| Escape/safe rendering evidence | ${hasEscape ? "Found" : "Review needed"} |
| Confirmation evidence | ${hasConfirm ? "Found" : "Not found"} |
| Backend/API calls | ${hasBackendCall ? "Found or possible - focused proof required" : "Not found"} |
| Governance/policy surface | ${hasGovernance ? "Found - authority proof required" : "Not found"} |
| Dangerous/direct action wording | ${hasDanger ? "Found - determine wording vs execution" : "Not found"} |
| Local/session storage | ${hasStorage ? "Found - verify scope" : "Not found"} |
| Project/write signals | ${hasProjectWrites ? "Found - focused proof required" : "Not found"} |

## Decision Guidance
- If Settings only edits local preferences and safe UI configuration, no runtime patch is required.
- If Settings changes governance/policy/project behavior, verify backend authority and confirmation gates.
- If dangerous terms are only labels/help text, no patch is required.
- If sensitive actions can be triggered without confirmation/governance, create a minimal authority patch.
- Do not patch from T29 alone.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T29_SETTINGS_RUNTIME_AUTHORITY_AUDIT.md"), md);

console.log("Generated audits/system-truth/t29-settings-authority/T29_SETTINGS_RUNTIME_AUTHORITY_AUDIT.md");
