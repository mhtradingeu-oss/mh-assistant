import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/campaign-studio.js";
const outDir = path.join(root, "audits/system-truth/t56-campaign-studio-authority");

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

function first(pattern) {
  return find(pattern)[0]?.line || null;
}

function zone(label, pattern, radius = 80) {
  const line = first(pattern);
  if (!line) {
    return `\n### ${label}\n\n_No match found._\n`;
  }
  return `\n### ${label}\n\n\`\`\`js\n${excerpt(line - radius, line + radius)}\n\`\`\`\n`;
}

const checks = [
  ["HTML render / innerHTML", /\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML/i],
  ["Escape / safe rendering evidence", /escapeHtml|textContent|safe\(|sanitize|asString/i],
  ["Imported/backend API calls", /\bfetch\s*\(|api\.|await\s+\w+\(|createProject|updateProject|deleteProject|saveProject|syncProject|importProject|executeProject|generate|publish|send|approval|task/i],
  ["Campaign planning signals", /campaign|plan|objective|audience|budget|channel|schedule|timeline|launch|calendar/i],
  ["Publishing/send signals", /publish|send|schedule|post|external|channel|facebook|instagram|tiktok|youtube|email|ads/i],
  ["Task/handoff writes", /createProjectTask|createProjectHandoff|destination_page|source_page|handoff|task/i],
  ["Approval/governance signals", /approval|approve|governance|review|risk|policy/i],
  ["Provider/job/ad signals", /provider|job|run|trigger|start|stop|retry|cancel|ads|adset|campaign/i],
  ["Confirmation gates", /window\.confirm|confirm\(/i],
  ["Event handlers", /onclick|addEventListener|onchange|oninput|keydown|submit/i],
  ["Storage signals", /localStorage|sessionStorage/i],
  ["Routing/handoff", /navigateTo|destination_page|source_page|handoff|route/i],
  ["Copy defect candidates", /CampaignStudio|campaignstudio|postnow|sendnow|publishnow|needsreview|launchnow|adcampaign/i]
];

let md = `# T56 — Campaign Studio Runtime Authority Audit

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Why This Page Is Next
T55 rebaseline ranked Campaign Studio as the highest remaining open frontend risk candidate.

T55 signals:
- Score: 254.2
- Priority: P0
- Lines: 2023
- innerHTML: 1
- Events: 12
- API/write signals: 90
- Authority words: 131
- Confirmations: 0
- Storage: 0
- Escape evidence: 165

## Purpose
Verify whether Campaign Studio:
- creates or mutates campaign data
- creates tasks or handoffs
- triggers publishing/sending/scheduling
- creates ad/provider actions
- routes to Publishing/Content/Media/Governance safely
- uses explicit confirmation gates for sensitive actions
- renders dynamic content safely
- needs runtime patch or closeout

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
`;

for (const [label, pattern] of checks) {
  const hits = find(pattern);
  md += `| ${label} | ${hits[0]?.line || "n/a"} | ${hits.length} |\n`;
}

md += `\n## Evidence Zones\n`;

for (const [label, pattern] of checks) {
  md += zone(label, pattern);
}

const hasBackendCall = /\bfetch\s*\(|api\.|await\s+\w+\(|createProject|updateProject|deleteProject|saveProject|syncProject|importProject/i.test(text);
const hasPublishSend = /publish|send|schedule|external|facebook|instagram|tiktok|youtube|email|ads/i.test(text);
const hasTaskOrHandoff = /createProjectTask|createProjectHandoff|destination_page|source_page|handoff|task/i.test(text);
const hasApproval = /approval|approve|governance|review|risk|policy/i.test(text);
const hasProviderJob = /provider|job|run|trigger|start|stop|retry|cancel|ads|adset/i.test(text);
const hasConfirm = /window\.confirm|confirm\(/.test(text);
const hasStorage = /localStorage|sessionStorage/.test(text);

md += `

## Preliminary Verdict

| Area | Verdict |
|---|---|
| Backend/API/write signals | ${hasBackendCall ? "Found - focused proof required" : "Not found"} |
| Publish/send/schedule/ad signals | ${hasPublishSend ? "Found - focused proof required" : "Not found"} |
| Task/handoff signals | ${hasTaskOrHandoff ? "Found - focused proof required" : "Not found"} |
| Approval/governance signals | ${hasApproval ? "Found - focused proof required" : "Not found"} |
| Provider/job/ad execution signals | ${hasProviderJob ? "Found - focused proof required" : "Not found"} |
| Confirmation gates | ${hasConfirm ? "Found" : "Not found"} |
| Storage signals | ${hasStorage ? "Found - verify scope" : "Not found"} |

## Decision Guidance
- If Campaign Studio can publish/send/schedule/create ads or mutate backend campaign data, exact proof is required before any patch.
- If actions are route-only, copy-only, prompt-only, read-only, or disabled, document and close if safe.
- If sensitive backend writes exist without confirmation, add minimal confirmation gates only after focused proof.
- Do not patch from T56 alone.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "T56_CAMPAIGN_STUDIO_RUNTIME_AUTHORITY_AUDIT.md"),
  md
);

console.log("Generated audits/system-truth/t56-campaign-studio-authority/T56_CAMPAIGN_STUDIO_RUNTIME_AUTHORITY_AUDIT.md");
