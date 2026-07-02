import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/ai-command.js";
const outDir = path.join(root, "audits/system-truth/t15-ai-command-authority");

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

function zone(pattern, radius = 45) {
  const line = first(pattern);
  if (!line) return "_No match found._";
  return excerpt(line - radius, line + radius);
}

const signals = {
  innerHTML: find(/\.innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  actions: find(/onclick\s*=|addEventListener|dispatch|command|action|execute|run|approve|confirm/i),
  confirmations: find(/confirm\(|window\.confirm|approval|governance|requiresApproval|approval_required/i),
  backendApi: find(/api\.|fetch\(|await\s+\w+|loadProjectData|reloadProjectData|execute|orchestr/i),
  providerTeam: find(/provider|team|agent|assistant|model|ai team|handoff|media|publishing|workflow/i),
  promises: find(/autonomous|24\/7|execute|publish|optimize|generate|launch|campaign|decision|recommend|done|completed/i),
  authorityRisk: find(/publish|approve|delete|archive|send|execute|run|auto|workflow|provider|media|external/i),
  escapeEvidence: find(/escapeHtml|textContent|sanitize|asString/i)
};

function table(title, rows, limit = 120) {
  let md = `\n## ${title}\n\n| Line | Code |\n|---:|---|\n`;
  for (const hit of rows.slice(0, limit)) {
    md += `| ${hit.line} | \`${hit.text.trim().replaceAll("|", "\\|")}\` |\n`;
  }
  if (rows.length > limit) {
    md += `\n_Trimmed: ${rows.length - limit} additional matches not shown._\n`;
  }
  return md;
}

const focusZones = [
  ["Imports / dependencies", /^import\s+/],
  ["Route export / page metadata", /export const|route|meta/i],
  ["Main render zone", /function render|root\.innerHTML|container\.innerHTML/i],
  ["Command input / chat zone", /textarea|input|message|prompt|chat|composer/i],
  ["Action binding zone", /onclick|addEventListener|bind/i],
  ["Provider / AI team zone", /provider|team|agent|assistant|model/i],
  ["Media / publishing handoff zone", /media|publishing|workflow|handoff/i],
  ["Governance / approval zone", /governance|approval|confirm/i]
];

let md = `# T15 — AI Command Runtime Authority + UX Safety Audit

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
AI Command is the main smart operating surface. This audit verifies whether it behaves as a safe command center:
- no fake execution claims
- no frontend-only authority over protected actions
- clear backend/provider/team handoff
- clear confirmations for sensitive actions
- international-grade UX surface readiness

## Summary Counts

| Signal | Count |
|---|---:|
`;

for (const [key, rows] of Object.entries(signals)) {
  md += `| ${key} | ${rows.length} |\n`;
}

md += `
## Initial Decision
Do not patch yet. Use this audit to decide if AI Command needs:
- runtime authority wording patch
- provider/team handoff clarity patch
- confirmation gate patch
- UX density/polish patch
- or closeout/no patch

## Risk Questions
1. Does AI Command make claims that imply autonomous execution without backend authority?
2. Do sensitive actions require confirmation or governance approval?
3. Are provider/team/media/publishing handoffs visible and honest?
4. Are user inputs escaped before rendering?
5. Does the page guide the user with Next Best Action instead of vague AI promises?
`;

md += table("innerHTML / HTML Rendering Signals", signals.innerHTML, 140);
md += table("Action / Command Signals", signals.actions, 160);
md += table("Confirmation / Governance Signals", signals.confirmations, 140);
md += table("Backend / API Signals", signals.backendApi, 160);
md += table("Provider / Team / Handoff Signals", signals.providerTeam, 160);
md += table("Execution Promise / UX Claim Signals", signals.promises, 160);
md += table("Authority Risk Signals", signals.authorityRisk, 160);
md += table("Escaping / Text Safety Evidence", signals.escapeEvidence, 120);

md += `\n## Focus Zones\n`;

for (const [title, pattern] of focusZones) {
  md += `\n### ${title}\n\n\`\`\`js\n${zone(pattern, 55)}\n\`\`\`\n`;
}

md += `
## Decision Checklist
- If AI Command only prepares/guides and does not execute protected actions directly: likely safe.
- If it claims publish/execute/optimize without backend result or governance boundary: patch wording.
- If any destructive/external action exists without confirmation: patch local confirmation.
- If provider/team handoff is unclear: patch UX copy, not backend.
- If innerHTML renders unescaped user/project content: patch escaping at smallest boundary.
- If page is mostly safe but not international-grade: defer to UX polish phase.
- Do not change CSS in this phase.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T15_AI_COMMAND_RUNTIME_AUTHORITY_UX_SAFETY_AUDIT.md"), md);

console.log("Generated audits/system-truth/t15-ai-command-authority/T15_AI_COMMAND_RUNTIME_AUTHORITY_UX_SAFETY_AUDIT.md");
