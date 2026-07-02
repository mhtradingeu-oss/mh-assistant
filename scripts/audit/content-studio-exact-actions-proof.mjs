import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/content-studio-workspace.js";
const outDir = path.join(root, "audits/system-truth/t51-content-studio-exact-actions");

const text = fs.readFileSync(path.join(root, file), "utf8");
const lines = text.split(/\r?\n/);

function find(pattern) {
  return lines
    .map((line, index) => ({ line: index + 1, text: line }))
    .filter((item) => pattern.test(item.text));
}

function excerpt(start, end) {
  const s = Math.max(1, start);
  const e = Math.min(lines.length, end);
  const out = [];
  for (let i = s; i <= e; i++) {
    out.push(`${String(i).padStart(5, " ")}: ${lines[i - 1]}`);
  }
  return out.join("\n");
}

function zonesFor(label, pattern, radius = 45, max = 10) {
  const hits = find(pattern).slice(0, max);
  if (!hits.length) return `\n### ${label}\n\n_No match found._\n`;

  return `\n### ${label}\n\n` + hits.map((hit, index) => {
    return `#### Match ${index + 1} — line ${hit.line}\n\n\`\`\`js\n${excerpt(hit.line - radius, hit.line + radius)}\n\`\`\``;
  }).join("\n\n");
}

const checks = [
  ["Imported API list", /from "\.\.\/api\.js"|createProjectApproval|createProjectHandoff|createProjectTask|decideProjectApproval|executeProjectAiCommand|saveProjectContentItem/],
  ["saveProjectContentItem calls", /\bsaveProjectContentItem\s*\(/],
  ["executeProjectAiCommand calls", /\bexecuteProjectAiCommand\s*\(/],
  ["createProjectTask calls", /\bcreateProjectTask\s*\(/],
  ["createProjectHandoff calls", /\bcreateProjectHandoff\s*\(/],
  ["createProjectApproval calls", /\bcreateProjectApproval\s*\(/],
  ["decideProjectApproval calls", /\bdecideProjectApproval\s*\(/],
  ["List/read-only API calls", /\blistProject(ContentItems|Events|Handoffs|Tasks|Approvals)\s*\(|\bfetchProjectOperations\s*\(/],
  ["Local storage writes", /localStorage\.setItem|localStorage\.removeItem|sessionStorage\.setItem|sessionStorage\.removeItem/],
  ["Shared context writes", /setSharedAiDraft|setSharedHandoff/],
  ["Button/action handlers", /addEventListener|onclick|data-content-|id="content|content.*Btn|Content.*Button/i],
  ["Publishing/send labels", /publish|send|schedule|sent_to_publishing|sent_to_media|external|channel|facebook|instagram|tiktok|youtube|email/i],
  ["Confirmation gates", /window\.confirm|confirm\(/],
  ["Disabled/review-only safety copy", /review-only|No direct publish|does not publish|handoff|approval recommended|before publishing|routing is review|Governance Review/i],
  ["Copy defect candidates", /frontendreisk|readinessquickly|planby|GovernanceReview|routingis|AIcontent|contentdraft|postnow|sendnow|publishnow/i]
];

let md = `# T51 — Content Studio Exact Action Path Proof

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
T50 found imported backend APIs and zero confirmation gates. T51 verifies exact action paths before any patch:
- saving content drafts
- AI generation command execution
- task creation
- handoff creation
- approval creation/decision
- publishing/send/schedule behavior
- local/shared state writes
- read-only APIs

## Exact Counts

| Area | First Line | Count |
|---|---:|---:|
`;

for (const [label, pattern] of checks) {
  const hits = find(pattern);
  md += `| ${label} | ${hits[0]?.line || "n/a"} | ${hits.length} |\n`;
}

md += `\n## Focused Evidence\n`;

for (const [label, pattern] of checks) {
  md += zonesFor(label, pattern);
}

const saveCalls = find(/\bsaveProjectContentItem\s*\(/);
const aiCalls = find(/\bexecuteProjectAiCommand\s*\(/);
const taskCalls = find(/\bcreateProjectTask\s*\(/);
const handoffCalls = find(/\bcreateProjectHandoff\s*\(/);
const approvalCalls = find(/\bcreateProjectApproval\s*\(/);
const decisionCalls = find(/\bdecideProjectApproval\s*\(/);
const readCalls = find(/\blistProject(ContentItems|Events|Handoffs|Tasks|Approvals)\s*\(|\bfetchProjectOperations\s*\(/);
const confirmCalls = find(/window\.confirm|confirm\(/);
const storageWrites = find(/localStorage\.setItem|localStorage\.removeItem|sessionStorage\.setItem|sessionStorage\.removeItem/);
const sharedWrites = find(/setSharedAiDraft|setSharedHandoff/);

md += `

## Preliminary Verdict

| Area | Verdict |
|---|---|
| saveProjectContentItem calls | ${saveCalls.length ? `Found ${saveCalls.length} - likely durable write, proof required` : "Not found"} |
| executeProjectAiCommand calls | ${aiCalls.length ? `Found ${aiCalls.length} - generation/provider proof required` : "Not found"} |
| createProjectTask calls | ${taskCalls.length ? `Found ${taskCalls.length} - task write proof required` : "Not found"} |
| createProjectHandoff calls | ${handoffCalls.length ? `Found ${handoffCalls.length} - handoff write proof required` : "Not found"} |
| createProjectApproval calls | ${approvalCalls.length ? `Found ${approvalCalls.length} - approval write proof required` : "Not found"} |
| decideProjectApproval calls | ${decisionCalls.length ? `Found ${decisionCalls.length} - decision write proof required` : "Not found"} |
| Read-only API calls | ${readCalls.length ? `Found ${readCalls.length}` : "Not found"} |
| Confirmation gates | ${confirmCalls.length ? `Found ${confirmCalls.length}` : "Not found"} |
| Local storage writes | ${storageWrites.length ? `Found ${storageWrites.length} - local-only proof required` : "Not found"} |
| Shared context writes | ${sharedWrites.length ? `Found ${sharedWrites.length} - route/handoff proof required` : "Not found"} |

## Decision Guidance
- If durable writes exist without confirmation, add minimal confirmation gates only after this proof.
- If AI generation executes provider/backend actions, require explicit confirmation or prove it is prompt/draft-only.
- If publish/send/schedule is route-only or handoff-only, document it.
- Do not patch from T51 alone unless the next step explicitly decides the minimal patch.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "T51_CONTENT_STUDIO_EXACT_ACTION_PATH_PROOF.md"),
  md
);

console.log("Generated audits/system-truth/t51-content-studio-exact-actions/T51_CONTENT_STUDIO_EXACT_ACTION_PATH_PROOF.md");
