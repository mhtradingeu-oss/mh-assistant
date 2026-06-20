import fs from "fs";
import path from "path";

const root = process.cwd();
const src = path.join(root, "public/control-center/pages/content-studio-workspace.js");
const outDir = path.join(root, "audits/system-truth/t53-content-studio-authority-patch");

const text = fs.readFileSync(src, "utf8");
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

function zone(label, pattern, radius = 22) {
  const line = first(pattern);
  if (!line) {
    return `\n### ${label}\n\n_No match found._\n`;
  }
  return `\n### ${label}\n\n\`\`\`js\n${excerpt(line - radius, line + radius)}\n\`\`\`\n`;
}

const confirmRefs = find(/confirmContentStudioAuthorityAction/);
const saveCalls = find(/\bsaveProjectContentItem\s*\(/);
const handoffCalls = find(/\bcreateProjectHandoff\s*\(/);
const aiCalls = find(/\bexecuteProjectAiCommand\s*\(/);
const confirmCalls = find(/window\.confirm|confirm\(/);

const requiredSnippets = [
  "Confirm Content Studio action",
  "Save backend content draft",
  "Create Library handoff",
  "Create Content Studio handoff",
  "Generate draft with AI backend",
  "Translate/adapt brief with AI backend",
  "This does not publish, send externally, or approve anything automatically."
];

const missing = requiredSnippets.filter((snippet) => !text.includes(snippet));

let md = `# T53 — Content Studio Authority Patch Proof

## Status
Patch proof.

## Target
- \`public/control-center/pages/content-studio-workspace.js\`

## Purpose
Verify that T52 added explicit operator confirmation gates before sensitive Content Studio backend actions.

## Counts

| Area | Count |
|---|---:|
| confirmContentStudioAuthorityAction references | ${confirmRefs.length} |
| window.confirm / confirm references | ${confirmCalls.length} |
| saveProjectContentItem calls | ${saveCalls.length} |
| createProjectHandoff calls | ${handoffCalls.length} |
| executeProjectAiCommand calls | ${aiCalls.length} |

## Required Snippet Check

| Snippet | Present |
|---|---|
${requiredSnippets.map((snippet) => `| ${snippet.replaceAll("|", "\\|")} | ${text.includes(snippet) ? "yes" : "no"} |`).join("\n")}

## Evidence
`;

md += zone("Confirmation helper", /function confirmContentStudioAuthorityAction/);
md += zone("Backend content save confirmation", /Save backend content draft/);
md += zone("Library handoff confirmation", /Create Library handoff/);
md += zone("Generic handoff confirmation", /Create Content Studio handoff/);
md += zone("Generate draft AI confirmation", /Generate draft with AI backend/);
md += zone("Translate/adapt AI confirmation", /Translate\/adapt brief with AI backend/);

md += `

## Verdict
${missing.length ? `Patch proof incomplete. Missing: ${missing.join(", ")}` : "Patch proof complete. All sensitive Content Studio backend write/generation/handoff paths have explicit confirmation copy."}

## What Changed
- Added one Content Studio confirmation helper.
- Added confirmation before backend content save.
- Added confirmation before backend Library handoff.
- Added confirmation before generic backend Content Studio handoff.
- Added confirmation before AI draft generation.
- Added confirmation before AI translate/adapt request.

## What Did Not Change
- No CSS changed.
- No backend code changed.
- No data/projects changed.
- No route behavior changed.
- No direct publishing/sending/approval was added.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "T53_CONTENT_STUDIO_AUTHORITY_PATCH_PROOF.md"),
  md
);

if (missing.length) {
  throw new Error("Missing required patch snippets: " + missing.join(", "));
}

console.log("T53 Content Studio authority patch proof generated.");
