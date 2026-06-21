import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/campaign-studio.js";
const outDir = path.join(root, "audits/system-truth/t57-campaign-studio-exact-actions");

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

function zonesFor(label, pattern, radius = 45, max = 12) {
  const hits = find(pattern).slice(0, max);
  if (!hits.length) return `\n### ${label}\n\n_No match found._\n`;

  return `\n### ${label}\n\n` + hits.map((hit, index) => {
    return `#### Match ${index + 1} — line ${hit.line}\n\n\`\`\`js\n${excerpt(hit.line - radius, hit.line + radius)}\n\`\`\``;
  }).join("\n\n");
}

const checks = [
  ["Function signature / injected APIs", /saveProjectCampaign|createProjectHandoff|fetchProjectInsights|fetchProjectLearning/],
  ["saveProjectCampaign calls", /\bsaveProjectCampaign\s*\(/],
  ["createProjectHandoff calls", /\bcreateProjectHandoff\s*\(/],
  ["fetchProjectInsights calls", /\bfetchProjectInsights\s*\(/],
  ["fetchProjectLearning calls", /\bfetchProjectLearning\s*\(/],
  ["Shared campaign writes", /setSharedCampaignRecord/],
  ["Shared handoff writes", /setSharedHandoff/],
  ["Local/session storage writes", /localStorage\.setItem|localStorage\.removeItem|sessionStorage\.setItem|sessionStorage\.removeItem/],
  ["Campaign save/build buttons", /campaignSaveDraftBtn|campaignBuildPlanBtn|Save campaign draft|Save campaign plan/],
  ["Refresh intelligence button", /campaignRefreshIntelligenceBtn|Refresh campaign intelligence/],
  ["Route/action buttons", /data-campaign-route|navigateTo|destination_page|source_page|handoff/],
  ["Publishing/send/ad labels", /publish|send|schedule|post|external|ads|adset|paid|launch|facebook|instagram|tiktok|youtube|email/i],
  ["Confirmation gates", /window\.confirm|confirm\(/],
  ["Disabled/review-only safety copy", /review-only|does not publish|does not send|approval|review|Governance|route|handoff|readiness/i],
  ["Copy defect candidates", /Reviewcampaign|frontendrisk|sendnow|publishnow|launchnow|postnow|adcampaign/i]
];

let md = `# T57 — Campaign Studio Exact Action Path Proof

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
T56 found Campaign Studio API/write/action signals and zero confirmation gates. T57 verifies exact action paths before any patch:
- campaign save/build actions
- backend campaign mutation
- handoff creation
- intelligence refresh/read-only calls
- route-only actions
- publishing/send/ad labels
- shared context writes

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

const saveCalls = find(/\bsaveProjectCampaign\s*\(/);
const handoffCalls = find(/\bcreateProjectHandoff\s*\(/);
const insightsCalls = find(/\bfetchProjectInsights\s*\(/);
const learningCalls = find(/\bfetchProjectLearning\s*\(/);
const sharedCampaignWrites = find(/setSharedCampaignRecord/);
const sharedHandoffWrites = find(/setSharedHandoff/);
const confirmCalls = find(/window\.confirm|confirm\(/);
const storageWrites = find(/localStorage\.setItem|localStorage\.removeItem|sessionStorage\.setItem|sessionStorage\.removeItem/);

md += `

## Preliminary Verdict

| Area | Verdict |
|---|---|
| saveProjectCampaign calls | ${saveCalls.length ? `Found ${saveCalls.length} - likely durable write, proof required` : "Not found"} |
| createProjectHandoff calls | ${handoffCalls.length ? `Found ${handoffCalls.length} - handoff write proof required` : "Not found"} |
| fetchProjectInsights calls | ${insightsCalls.length ? `Found ${insightsCalls.length} - verify read-only` : "Not found"} |
| fetchProjectLearning calls | ${learningCalls.length ? `Found ${learningCalls.length} - verify read-only` : "Not found"} |
| Shared campaign writes | ${sharedCampaignWrites.length ? `Found ${sharedCampaignWrites.length} - route/shared-state proof required` : "Not found"} |
| Shared handoff writes | ${sharedHandoffWrites.length ? `Found ${sharedHandoffWrites.length} - route/shared-state proof required` : "Not found"} |
| Confirmation gates | ${confirmCalls.length ? `Found ${confirmCalls.length}` : "Not found"} |
| Storage writes | ${storageWrites.length ? `Found ${storageWrites.length}` : "Not found"} |

## Decision Guidance
- If saveProjectCampaign or createProjectHandoff are triggered by UI without confirmation, add minimal confirmation gates only after this proof.
- If refresh intelligence calls are read-only, document as no confirmation required.
- If publish/send/ad actions are route-only/handoff-only, document and do not patch.
- Do not patch from T57 alone unless the next step explicitly decides the minimal patch.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "T57_CAMPAIGN_STUDIO_EXACT_ACTION_PATH_PROOF.md"),
  md
);

console.log("Generated audits/system-truth/t57-campaign-studio-exact-actions/T57_CAMPAIGN_STUDIO_EXACT_ACTION_PATH_PROOF.md");
