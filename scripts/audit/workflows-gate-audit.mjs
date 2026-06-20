import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/workflows.js";
const outDir = path.join(root, "audits/system-truth/t4-workflows-gates");
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

const critical = find(/runAutomationPlan|startAutoMode|resumeAutoMode|approveCurrentGate|skipCurrentStep|window\.confirm|confirm\s*\(|addEventListener\(["']click|\.onclick\s*=|data-workflow|workflow.*Btn|button/i);

const zones = [
  { title: "Automation imports / top authority references", start: 1, end: 80 },
  { title: "Workflow action binding zone", start: 1560, end: 1785 },
  { title: "Post-action / render route zone", start: 1786, end: 1880 }
];

const riskLines = find(/runAutomationPlan|startAutoMode|resumeAutoMode|approveCurrentGate|skipCurrentStep/i);

function classifyAround(lineNumber) {
  const local = excerpt(Math.max(1, lineNumber - 18), Math.min(lines.length, lineNumber + 18));
  const hasConfirm = /confirm\s*\(|window\.confirm/.test(local);
  const hasClickBinding = /addEventListener\(["']click|\.onclick\s*=|button|Btn|data-/.test(local);
  const hasAwait = /await\s+/.test(lines[lineNumber - 1] || "");
  const hasTryCatch = /try\s*\{|catch\s*\(/.test(local);

  if (!hasClickBinding) return "P0: execution call not clearly tied to explicit click in local excerpt";
  if (!hasConfirm && /runAutomationPlan|startAutoMode|resumeAutoMode/.test(lines[lineNumber - 1])) {
    return "P0: explicit execution call lacks local confirmation evidence";
  }
  if (!hasTryCatch) return "P1: execution call needs error-handling review";
  if (hasAwait && hasClickBinding) return "P1: explicit user-triggered execution path; verify confirmation/authority contract";
  return "Review";
}

let md = `# T4 — Workflows Automation Execution Gate Audit

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
The T3 scan showed Workflows has direct automation execution calls. This audit checks whether these calls are user-triggered, confirmed, error-handled, and aligned with Backend Authority / Frontend Projection doctrine.

## Critical Calls
| Line | Code | Classification |
|---:|---|---|
`;

for (const hit of riskLines) {
  md += `| ${hit.line} | \`${hit.text.trim().replaceAll("|", "\\|")}\` | ${classifyAround(hit.line)} |\n`;
}

md += `\n## Confirmation / Click / Button Signal Lines\n`;
md += `| Line | Code |\n|---:|---|\n`;
for (const hit of critical.slice(0, 180)) {
  md += `| ${hit.line} | \`${hit.text.trim().replaceAll("|", "\\|")}\` |\n`;
}

md += `\n## Focus Zones\n`;
for (const zone of zones) {
  md += `\n### ${zone.title}\n\n\`\`\`js\n${excerpt(zone.start, zone.end)}\n\`\`\`\n`;
}

md += `\n## Decision Checklist

Use this checklist before any fix:

- If execution is not tied to explicit user click: fix immediately.
- If execution is tied to click but lacks confirmation: add confirmation.
- If confirmation exists but copy is unclear: improve copy only.
- If frontend starts automation that backend should own: document migration path, do not rewrite blindly.
- If error handling is missing: add safe error handling.
- If all gates are present: close as compatibility risk, no runtime change.

## Recommended Next Step
Review this file manually and choose one smallest safe patch.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T4_WORKFLOWS_AUTOMATION_EXECUTION_GATE_AUDIT.md"), md);

console.log("Generated audits/system-truth/t4-workflows-gates/T4_WORKFLOWS_AUTOMATION_EXECUTION_GATE_AUDIT.md");
