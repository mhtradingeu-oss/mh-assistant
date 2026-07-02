import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/media-studio-workspace.js";
const outDir = path.join(root, "audits/system-truth/t33-media-studio-authority");

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

function zone(pattern, radius = 90) {
  const line = first(pattern);
  if (!line) return "_No match found._";
  return excerpt(line - radius, line + radius);
}

const checks = [
  ["HTML render / innerHTML", /\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML/i],
  ["Escape / safe rendering evidence", /escapeHtml|textContent|safe\(|sanitize|asString/i],
  ["Provider/job/action wording", /generate|render|provider|job|media|video|image|asset|upload|export|publish|queue|run/i],
  ["Backend/API calls", /\bfetch\s*\(|api\.|await\s+\w+\(/i],
  ["Job execution signals", /start|run|execute|generate|render|queue|submit|create.*job|provider.*job/i],
  ["Confirmation gates", /window\.confirm|confirm\(/i],
  ["Governance/approval signals", /governance|approval|policy|permission|authority|review/i],
  ["Dangerous external actions", /publish|send|delete|archive|disconnect|reconnect|sync|export|approve/i],
  ["Event handlers", /onclick|addEventListener|onchange|oninput|keydown|submit/i],
  ["Storage signals", /localStorage|sessionStorage/i],
  ["File/upload signals", /FileReader|input.*file|upload|drop|drag|FormData|Blob|URL\.createObjectURL/i],
  ["Navigation/handoff", /navigateTo|location\.|window\.location|handoff|destination_page/i],
  ["Copy defect candidates", /ControlCenter|theintegration|needsreview|reviewready|mediajob|providerjob|generateasset|renderqueue/i]
];

let md = `# T33 — Media Studio Runtime Authority + Provider Job Safety Audit

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Why This Page Is Next
T32 rebaseline ranked Media Studio Workspace as the highest remaining open frontend risk candidate.

T32 signals:
- Score: 604.1
- Priority: P0
- Lines: 3659
- API/write signals: 197
- Authority words: 447
- Confirmations: 0
- Storage: 4

## Purpose
Verify whether Media Studio:
- starts provider jobs directly
- uploads or prepares files safely
- calls backend/provider APIs
- needs confirmation before expensive/mutating generation/export actions
- routes governance/approval correctly
- uses escaped rendering for dynamic content
- needs runtime patch or only UX/product polish

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

const hasBackendCall = /\bfetch\s*\(|api\.|await\s+\w+\(/.test(text);
const hasConfirm = /window\.confirm|confirm\(/.test(text);
const hasJobSignals = /start|run|execute|generate|render|queue|submit|create.*job|provider.*job/i.test(text);
const hasFileSignals = /FileReader|input.*file|upload|drop|drag|FormData|Blob|URL\.createObjectURL/i.test(text);
const hasGovernance = /governance|approval|policy|permission|authority|review/i.test(text);
const hasExternalDanger = /publish|send|delete|archive|disconnect|reconnect|sync|export|approve/i.test(text);
const hasStorage = /localStorage|sessionStorage/.test(text);

md += `

## Preliminary Verdict

| Area | Verdict |
|---|---|
| Backend/API calls | ${hasBackendCall ? "Found or possible - focused proof required" : "Not found"} |
| Job/generation signals | ${hasJobSignals ? "Found - focused proof required" : "Not found"} |
| Confirmation gates | ${hasConfirm ? "Found" : "Not found"} |
| File/upload/media object signals | ${hasFileSignals ? "Found - focused proof required" : "Not found"} |
| Governance/approval signals | ${hasGovernance ? "Found" : "Review needed"} |
| Dangerous external action wording | ${hasExternalDanger ? "Found - determine wording vs execution" : "Not found"} |
| Storage signals | ${hasStorage ? "Found - verify scope" : "Not found"} |

## Decision Guidance
- If Media Studio only prepares prompts/assets and routes jobs elsewhere, no runtime patch may be needed.
- If it starts generation/render/export/provider jobs, verify confirmation/governance gates.
- If it uses local/session storage for draft-only state, no patch may be needed.
- If storage persists sensitive provider/media data, focused patch may be required.
- If file/object URLs are created, verify revocation and safe preview handling.
- Do not patch from T33 alone.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T33_MEDIA_STUDIO_RUNTIME_AUTHORITY_AUDIT.md"), md);

console.log("Generated audits/system-truth/t33-media-studio-authority/T33_MEDIA_STUDIO_RUNTIME_AUTHORITY_AUDIT.md");
