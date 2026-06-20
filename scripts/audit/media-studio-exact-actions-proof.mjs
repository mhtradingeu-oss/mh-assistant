import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/media-studio-workspace.js";
const outDir = path.join(root, "audits/system-truth/t34-media-studio-exact-actions");

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

const bindStart = Math.max(1, first(/function bindMediaStudio|function bindMedia|bindMediaStudio/) || 2600);
const bindEnd = Math.min(lines.length, bindStart + 900);

const checks = [
  ["Imported provider/job APIs", /brandCheckMedia|createProjectApproval|createProjectHandoff|createProjectTask|decideProjectApproval|generateMediaCampaignPack|generateMediaImage|generateMediaVideoBrief|generateMediaVoiceScript|improveMediaPrompt|saveProjectMediaJob/],
  ["bindMediaStudio block", /function bindMediaStudio|bindMediaStudio\(/],
  ["data media action handlers", /data-media-action|data-media-studio-action|data-media-generator|data-media-/],
  ["generate image call", /generateMediaImage\(/],
  ["generate video brief call", /generateMediaVideoBrief\(/],
  ["generate voice script call", /generateMediaVoiceScript\(/],
  ["generate campaign pack call", /generateMediaCampaignPack\(/],
  ["improve prompt call", /improveMediaPrompt\(/],
  ["brand check call", /brandCheckMedia\(/],
  ["save media job call", /saveProjectMediaJob\(/],
  ["create approval call", /createProjectApproval\(/],
  ["decide approval call", /decideProjectApproval\(/],
  ["create handoff call", /createProjectHandoff\(/],
  ["create task call", /createProjectTask\(/],
  ["confirmation gates", /window\.confirm|confirm\(/],
  ["governance/approval route", /navigateTo\("governance"\)|destination_page:\s*"governance"|approval/i],
  ["publishing route/handoff", /navigateTo\("publishing"\)|destination_page:\s*"publishing"|sent_to_publishing|publishing_ready/i],
  ["localStorage write/read", /localStorage\.setItem|localStorage\.getItem|localStorage\.removeItem/],
  ["file/object URL signals", /FileReader|FormData|Blob|URL\.createObjectURL|URL\.revokeObjectURL|input.*file|drop|drag/i],
  ["error handling", /catch \(error\)|showError|isAccessKeyFailure/]
];

let md = `# T34 — Media Studio Exact Action + Provider Job Proof

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
T33 showed Media Studio has provider/job APIs, job signals, storage, and zero confirmation gates. T34 verifies exact action paths:
- which actions call provider/job APIs
- whether generation jobs are started directly
- whether save/handoff/approval actions are backend-owned
- whether confirmation/governance gates are missing
- whether local storage is draft-only
- whether file/object URL paths need safety review

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

const providerCalls = [
  "generateMediaImage",
  "generateMediaVideoBrief",
  "generateMediaVoiceScript",
  "generateMediaCampaignPack",
  "improveMediaPrompt",
  "brandCheckMedia"
].filter((name) => text.includes(`${name}(`));

const mutatingCalls = [
  "saveProjectMediaJob",
  "createProjectApproval",
  "decideProjectApproval",
  "createProjectHandoff",
  "createProjectTask"
].filter((name) => text.includes(`${name}(`));

const hasConfirm = /window\.confirm|confirm\(/.test(text);
const hasLocalStorageWrites = /localStorage\.setItem/.test(text);
const hasObjectUrls = /URL\.createObjectURL|URL\.revokeObjectURL/.test(text);
const hasFileSignals = /FileReader|FormData|Blob|input.*file|drop|drag/i.test(text);
const hasGovernanceRoute = /navigateTo\("governance"\)|destination_page:\s*"governance"/.test(text);
const hasPublishingRoute = /navigateTo\("publishing"\)|destination_page:\s*"publishing"|sent_to_publishing/.test(text);

md += `

## Verdict

| Area | Verdict |
|---|---|
| Provider generation/prep calls | ${providerCalls.length ? `Found: ${providerCalls.join(", ")}` : "Not found"} |
| Mutating backend calls | ${mutatingCalls.length ? `Found: ${mutatingCalls.join(", ")}` : "Not found"} |
| Confirmation gates | ${hasConfirm ? "Found" : "Not found"} |
| Local storage writes | ${hasLocalStorageWrites ? "Found - verify draft-only scope" : "Not found"} |
| File input/upload signals | ${hasFileSignals ? "Found - focused file safety proof may be required" : "Not found"} |
| Object URL lifecycle | ${hasObjectUrls ? "Found - verify revoke lifecycle" : "Not found"} |
| Governance route/handoff | ${hasGovernanceRoute ? "Found" : "Review needed"} |
| Publishing route/handoff | ${hasPublishingRoute ? "Found" : "Review needed"} |

## Decision Guidance
- If provider generation APIs are user-triggered without confirmation, add a minimal confirmation gate before generation/provider-backed actions.
- If approval decisions are possible without confirmation, patch immediately.
- If handoff/task creation is review-only and backend-owned, confirmation may be optional unless it mutates durable workflow state.
- If localStorage is draft-only, no patch may be needed.
- If object URLs are created without revocation, patch preview lifecycle.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T34_MEDIA_STUDIO_EXACT_ACTION_PROVIDER_JOB_PROOF.md"), md);

console.log("Generated audits/system-truth/t34-media-studio-exact-actions/T34_MEDIA_STUDIO_EXACT_ACTION_PROVIDER_JOB_PROOF.md");
