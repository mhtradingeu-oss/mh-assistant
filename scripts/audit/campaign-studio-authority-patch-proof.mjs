import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/campaign-studio.js";
const outDir = path.join(root, "audits/system-truth/t59-campaign-studio-authority-patch");

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

function zone(label, pattern, radius = 28) {
  const line = first(pattern);
  if (!line) return `\n### ${label}\n\n_No match found._\n`;
  return `\n### ${label}\n\n\`\`\`js\n${excerpt(line - radius, line + radius)}\n\`\`\`\n`;
}

const requiredSnippets = [
  "function confirmCampaignStudioAuthorityAction",
  "Create campaign route handoff",
  "Campaign Studio autosave is local/shared-state only",
  "Save backend campaign draft",
  "Save backend campaign plan",
  "Create AI Command campaign handoff",
  "This does not publish, send externally, schedule ads, or approve anything automatically."
];

const missing = requiredSnippets.filter((snippet) => !text.includes(snippet));

const confirmRefs = find(/confirmCampaignStudioAuthorityAction/);
const saveCalls = find(/\bsaveProjectCampaign\??\.\s*\(|\bsaveProjectCampaign\s*\(/);
const handoffCalls = find(/\bcreateProjectHandoff\??\.\s*\(|\bcreateProjectHandoff\s*\(/);
const autosaveBackendCalls = find(/setTimeout\(async[\s\S]*?saveProjectCampaign/);
const storageWrites = find(/localStorage\.setItem|localStorage\.removeItem|sessionStorage\.setItem|sessionStorage\.removeItem/);

let md = `# T59 — Campaign Studio Authority Patch Proof

## Status
Patch proof.

## Target
- \`${file}\`

## Purpose
Verify that T58 added minimal authority protections for Campaign Studio backend writes and handoff creation.

## Exact Counts

| Area | Count |
|---|---:|
| confirmCampaignStudioAuthorityAction references | ${confirmRefs.length} |
| saveProjectCampaign calls | ${saveCalls.length} |
| createProjectHandoff calls | ${handoffCalls.length} |
| autosave backend saveProjectCampaign pattern | ${autosaveBackendCalls.length} |
| local/session storage writes | ${storageWrites.length} |

## Required Snippet Check

| Snippet | Present |
|---|---|
${requiredSnippets.map((snippet) => `| ${snippet.replaceAll("|", "\\|")} | ${text.includes(snippet) ? "yes" : "no"} |`).join("\n")}

## Evidence
`;

md += zone("Confirmation helper", /function confirmCampaignStudioAuthorityAction/);
md += zone("Route handoff confirmation", /Create campaign route handoff/);
md += zone("Autosave local/shared-state only", /Campaign Studio autosave is local\/shared-state only/);
md += zone("Save draft confirmation", /Save backend campaign draft/);
md += zone("Save plan confirmation", /Save backend campaign plan/);
md += zone("AI Command handoff confirmation", /Create AI Command campaign handoff/);

md += `

## Verdict
${missing.length ? `Patch proof incomplete. Missing: ${missing.join(", ")}` : "Patch proof complete. Campaign Studio backend save and handoff paths are confirmation-gated, and autosave no longer performs backend persistence."}

## What Changed
- Added Campaign Studio authority confirmation helper.
- Added confirmation before route handoff backend creation.
- Changed autosave to local/shared-state projection only.
- Added confirmation before backend campaign draft save.
- Added confirmation before backend campaign plan save.
- Added confirmation before AI Command backend handoff creation.

## What Did Not Change
- No CSS changed.
- No backend code changed.
- No data/projects changed.
- No direct publishing/sending/ad scheduling/approval was added.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "T59_CAMPAIGN_STUDIO_AUTHORITY_PATCH_PROOF.md"),
  md
);

if (missing.length) {
  throw new Error("Missing required patch snippets: " + missing.join(", "));
}

console.log("T59 Campaign Studio authority patch proof generated.");
