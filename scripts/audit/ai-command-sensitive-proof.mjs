import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/ai-command.js";
const outDir = path.join(root, "audits/system-truth/t17-ai-command-sensitive-proof");

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

function zoneByLine(line, radius = 70) {
  if (!line) return "_No match found._";
  return excerpt(line - radius, line + radius);
}

const sensitiveLine = first(/publish\\s\*now|send\\s\*external|paid\\s\*ads|final\\s\*approval|Requires approval gate before external publishing actions/);
const autoPlanLine = first(/function buildAutoPlanFromCommand/);
const workflowLine = first(/targetPage:\s*"workflows"|Prepare workflow from AI command/);
const safeInstructionLine = first(/Never claim actions were executed|Never claim publish/);
const confirmationLine = first(/confirmationRequired|confirmationNote/);

const sensitiveZone = zoneByLine(sensitiveLine, 90);
const autoPlanZone = zoneByLine(autoPlanLine, 100);
const workflowZone = zoneByLine(workflowLine, 80);

const hasSensitiveClassifier = /publish\\s\*now|send\\s\*external|paid\\s\*ads|final\\s\*approval|Requires approval gate before external publishing actions/.test(text);
const hasApprovalReason = text.includes("Requires approval gate before external publishing actions.");
const hasWorkflowTarget = text.includes('targetPage: "workflows"');
const hasNoExecutionInstruction = text.includes("Never claim actions were executed") && text.includes("Never claim publish");
const hasConfirmationNote = text.includes("Execution, approvals, and publishing require explicit confirmation in the owning workspace.");

let md = `# T17 — AI Command Sensitive Command Proof

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
T16 verified preview/route action patterns but did not detect the sensitive command classifier due regex mismatch. T17 directly verifies whether sensitive user commands are converted into approval-gated plans rather than direct execution.

## Final Findings
| Area | Line | Verdict |
|---|---:|---|
| buildAutoPlanFromCommand | ${autoPlanLine || "n/a"} | ${autoPlanLine ? "Found" : "Missing"} |
| Sensitive command classifier | ${sensitiveLine || "n/a"} | ${hasSensitiveClassifier ? "Verified" : "Review needed"} |
| Approval-gated reason | ${sensitiveLine || "n/a"} | ${hasApprovalReason ? "Verified" : "Review needed"} |
| Workflow target handoff | ${workflowLine || "n/a"} | ${hasWorkflowTarget ? "Verified" : "Review needed"} |
| No-executed-action instruction | ${safeInstructionLine || "n/a"} | ${hasNoExecutionInstruction ? "Verified" : "Review needed"} |
| Confirmation note | ${confirmationLine || "n/a"} | ${hasConfirmationNote ? "Verified" : "Review needed"} |

## Evidence

### buildAutoPlanFromCommand
\`\`\`js
${autoPlanZone}
\`\`\`

### Sensitive classifier / approval gate
\`\`\`js
${sensitiveZone}
\`\`\`

### Workflow handoff proof
\`\`\`js
${workflowZone}
\`\`\`

## Decision
${hasSensitiveClassifier && hasApprovalReason && hasWorkflowTarget && hasNoExecutionInstruction && hasConfirmationNote
  ? "No runtime authority patch is required for AI Command sensitive commands. Sensitive intent is converted into a gated workflow/approval plan, not direct external execution."
  : "Patch review required only for the unverified item above. Do not patch broadly."}

## Constraints
- No production code changed.
- No CSS changed.
- No backend authority changed.
- No data/projects changed.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T17_AI_COMMAND_SENSITIVE_COMMAND_PROOF.md"), md);

console.log("Generated audits/system-truth/t17-ai-command-sensitive-proof/T17_AI_COMMAND_SENSITIVE_COMMAND_PROOF.md");
