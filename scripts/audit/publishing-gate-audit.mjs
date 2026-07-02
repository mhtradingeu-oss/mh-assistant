import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/publishing.js";
const outDir = path.join(root, "audits/system-truth/t7-publishing-gates");

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

const criticalCalls = find(
  /startAutoMode|approveCurrentGate|skipCurrentStep|window\.confirm|confirm\s*\(|publish|schedule|failPublishingItem|completePublishingItem|recordPublishing|saveDraftLocally|buildSchedulePayload/i
);

const riskCalls = find(
  /await startAutoMode|await approveCurrentGate|await skipCurrentStep|failPublishingItem|completePublishingItem|buildSchedulePayload|saveDraftLocally/i
);

function classifyAround(lineNumber) {
  const local = excerpt(Math.max(1, lineNumber - 18), Math.min(lines.length, lineNumber + 18));
  const code = lines[lineNumber - 1] || "";
  const hasConfirm = /confirm\s*\(|window\.confirm/.test(local);
  const hasClickBinding = /onclick|addEventListener\(["']click|Btn|button|data-/.test(local);
  const hasTryCatch = /try\s*\{|catch\s*\(/.test(local);

  if (/await startAutoMode|await approveCurrentGate|await skipCurrentStep/.test(code)) {
    if (!hasConfirm) return "P0-check: Auto Mode/gate action lacks local confirmation evidence";
    return "Safety-positive: Auto Mode/gate action has local confirmation evidence";
  }

  if (/failPublishingItem|completePublishingItem|buildSchedulePayload/.test(code)) {
    if (!hasConfirm) return "P1-check: publishing mutation/schedule path needs confirmation review";
    return "Safety-positive: publishing mutation path has confirmation evidence";
  }

  if (/saveDraftLocally/.test(code)) {
    return "Low risk: local draft persistence path";
  }

  if (!hasTryCatch && /await|fail|complete|schedule|publish/i.test(code)) {
    return "P2-check: verify error handling";
  }

  return "Review";
}

let md = `# T7 — Publishing Auto Mode / Approval Gate Audit

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
Publishing was identified as a high-risk page in the terminal baseline due to Auto Mode and publishing lifecycle references. This audit checks whether sensitive publishing actions are explicit, confirmed, and aligned with Backend Authority / Frontend Projection.

## Critical Publishing Calls
| Line | Code | Classification |
|---:|---|---|
`;

for (const hit of riskCalls) {
  md += `| ${hit.line} | \`${hit.text.trim().replaceAll("|", "\\|")}\` | ${classifyAround(hit.line)} |\n`;
}

md += `

## Confirmation / Button / Publishing Signal Lines
| Line | Code |
|---:|---|
`;

for (const hit of criticalCalls.slice(0, 220)) {
  md += `| ${hit.line} | \`${hit.text.trim().replaceAll("|", "\\|")}\` |\n`;
}

md += `

## Focus Zones

### Auto Mode Binding / Controller Zone
\`\`\`js
${excerpt(120, 180)}
\`\`\`

### Publishing Plan / Validation Zone
\`\`\`js
${excerpt(560, 650)}
\`\`\`

### Main Action Binding Zone
\`\`\`js
${excerpt(1600, 1915)}
\`\`\`

## Decision Checklist
- If Auto Mode start lacks confirmation: add confirmation.
- If approve gate lacks confirmation: add confirmation.
- If skip step lacks confirmation: add confirmation.
- If fail/complete/schedule publishing action lacks confirmation: add confirmation.
- If all sensitive paths are confirmed: close as verified, no runtime patch.
- Do not change backend authority.
- Do not change CSS.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T7_PUBLISHING_AUTO_MODE_APPROVAL_GATE_AUDIT.md"), md);

console.log("Generated audits/system-truth/t7-publishing-gates/T7_PUBLISHING_AUTO_MODE_APPROVAL_GATE_AUDIT.md");
