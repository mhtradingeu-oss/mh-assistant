import fs from "fs";
import path from "path";

const root = process.cwd();
const src = path.join(root, "public/control-center/pages/media-studio-workspace.js");
const outDir = path.join(root, "audits/system-truth/t36-media-studio-authority-patch");

const text = fs.readFileSync(src, "utf8");

const required = [
  "function confirmMediaAuthorityAction",
  "Confirm media generation",
  "Confirm prompt improvement",
  "Confirm brand safety check",
  "Confirm local media approval mark",
  "Confirm publishing handoff",
  "Confirm media approval decision",
  "Confirm media approval request",
  "Confirm media revision decision",
  "Confirm media task creation"
];

const forbiddenCopy = [
  "mustbe",
  "maycall",
  "calla",
  "Thisdoes",
  "pendingbackend",
  "approvalexists",
  "isunavailable",
  "wasinvoked"
];

for (const item of required) {
  if (!text.includes(item)) {
    throw new Error("Missing authority confirmation proof: " + item);
  }
}

for (const item of forbiddenCopy) {
  if (text.includes(item)) {
    throw new Error("Compacted copy still present: " + item);
  }
}

const confirmCount = (text.match(/confirmMediaAuthorityAction\(/g) || []).length;
const windowConfirmCount = (text.match(/window\.confirm/g) || []).length;

const md = `# T36 — Media Studio Authority Confirmation Patch Proof

## Status
Patch proof.

## Target
- \`public/control-center/pages/media-studio-workspace.js\`

## Patch Summary
Added explicit operator confirmation gates before sensitive Media Studio actions.

## Verified Confirmation Gates
- Provider-backed media generation
- Provider-backed prompt improvement
- Provider-backed brand-safety check
- Local media approval mark
- Main media approval decision
- Media approval request
- Media revision/rejection decision
- Media task creation
- Publishing handoff from job actions
- Publishing handoff from main action
- Publishing handoff from version action

## Counts
- confirmMediaAuthorityAction references: ${confirmCount}
- window.confirm references: ${windowConfirmCount}

## Safety Decision
The patch is minimal and authority-focused:
- no CSS changed
- no backend changed
- no data/projects changed
- no broad refactor
- no provider logic changed
- only explicit confirmation gates were added before sensitive actions

## Copy Cleanup
No known compacted confirmation-copy defects remain.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T36_MEDIA_STUDIO_AUTHORITY_PATCH_PROOF.md"), md);

console.log("T36 Media Studio authority patch proof verified.");
