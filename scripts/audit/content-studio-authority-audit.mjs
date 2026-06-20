import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/content-studio-workspace.js";
const outDir = path.join(root, "audits/system-truth/t50-content-studio-authority");

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
    .filter((item) => pattern.test(item.text));
}

function first(pattern) {
  return find(pattern)[0]?.line || null;
}

function zone(pattern, radius = 90) {
  const line = first(pattern);
  if (!line) return "_No match found._";
  return excerpt(line - radius, line + radius);
}

const checks = [
  ["HTML render / innerHTML", /\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML/i],
  ["Escape / safe rendering evidence", /escapeHtml|textContent|safe\(|sanitize|asString/i],
  ["Imported/backend API calls", /\bfetch\s*\(|api\.|await\s+\w+\(|createProject|updateProject|deleteProject|saveProject|syncProject|importProject|generate|publish|send|approval|task/i],
  ["Content generation signals", /generate|draft|compose|content|caption|post|copy|variant|idea|brief|prompt|AI/i],
  ["Publishing/send signals", /publish|send|schedule|post now|external|channel|facebook|instagram|tiktok|youtube|email/i],
  ["Task/handoff writes", /createProjectTask|createProjectHandoff|destination_page|source_page|handoff|task/i],
  ["Provider/job signals", /provider|job|run|trigger|start|stop|retry|cancel|render|media|asset/i],
  ["Confirmation gates", /window\.confirm|confirm\(/i],
  ["Event handlers", /onclick|addEventListener|onchange|oninput|keydown|submit/i],
  ["Storage signals", /localStorage|sessionStorage/i],
  ["Routing/handoff", /navigateTo|destination_page|source_page|handoff|route/i],
  ["Copy defect candidates", /ContentStudio|contentstudio|postnow|sendnow|publishnow|needsreview|AIcontent|contentdraft/i]
];

let md = `# T50 — Content Studio Workspace Runtime Authority Audit

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Why This Page Is Next
T49 rebaseline ranked Content Studio Workspace as the highest remaining open frontend risk candidate.

T49 signals:
- Score: 533.5
- Priority: P0
- Lines: 2404
- innerHTML: 1
- Events: 14
- API/write signals: 179
- Authority words: 392
- Confirmations: 0
- Storage: 4
- Escape evidence: 180

## Purpose
Verify whether Content Studio Workspace:
- generates content directly
- saves drafts or mutates project data
- creates tasks or handoffs
- publishes/sends/schedules external content
- uses provider/job actions
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

md += `

## Evidence Zones
`;

for (const [label, pattern] of checks) {
  md += `\n### ${label}\n\n\`\`\`js\n${zone(pattern, 90)}\n\`\`\`\n`;
}

const hasBackendCall = /\bfetch\s*\(|api\.|await\s+\w+\(|createProject|updateProject|deleteProject|saveProject|syncProject|importProject/i.test(text);
const hasGenerate = /generate|draft|compose|variant|idea|brief|prompt|AI/i.test(text);
const hasPublishSend = /publish|send|schedule|external|channel|facebook|instagram|tiktok|youtube|email/i.test(text);
const hasTaskOrHandoff = /createProjectTask|createProjectHandoff|destination_page|source_page|handoff|task/i.test(text);
const hasProviderJob = /provider|job|run|trigger|start|stop|retry|cancel|render|media|asset/i.test(text);
const hasConfirm = /window\.confirm|confirm\(/.test(text);
const hasStorage = /localStorage|sessionStorage/.test(text);

md += `

## Preliminary Verdict

| Area | Verdict |
|---|---|
| Backend/API/write signals | ${hasBackendCall ? "Found - focused proof required" : "Not found"} |
| Content generation/draft signals | ${hasGenerate ? "Found - focused proof required" : "Not found"} |
| Publish/send/schedule signals | ${hasPublishSend ? "Found - focused proof required" : "Not found"} |
| Task/handoff signals | ${hasTaskOrHandoff ? "Found - focused proof required" : "Not found"} |
| Provider/job signals | ${hasProviderJob ? "Found - focused proof required" : "Not found"} |
| Confirmation gates | ${hasConfirm ? "Found" : "Not found"} |
| Storage signals | ${hasStorage ? "Found - verify scope" : "Not found"} |

## Decision Guidance
- If Content Studio can publish/send/schedule or mutate drafts, exact proof is required before any patch.
- If actions are route-only, copy-only, prompt-only, or disabled, document and close if safe.
- If sensitive backend writes exist without confirmation, add minimal confirmation gates only after focused proof.
- Do not patch from T50 alone.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "T50_CONTENT_STUDIO_WORKSPACE_RUNTIME_AUTHORITY_AUDIT.md"),
  md
);

console.log("Generated audits/system-truth/t50-content-studio-authority/T50_CONTENT_STUDIO_WORKSPACE_RUNTIME_AUTHORITY_AUDIT.md");
