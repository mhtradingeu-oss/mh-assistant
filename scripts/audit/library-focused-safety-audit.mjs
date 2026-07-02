import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/library.js";
const outDir = path.join(root, "audits/system-truth/t11-library-focused-safety");

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

const targets = [
  ["buildPreviewUrl", /function buildPreviewUrl|buildPreviewUrl\(/],
  ["getAssetPreviewUrl", /function getAssetPreviewUrl|getAssetPreviewUrl\(/],
  ["requiresProtectedMediaFetch", /function requiresProtectedMediaFetch|requiresProtectedMediaFetch\(/],
  ["fetchProtectedMediaBlob", /function fetchProtectedMediaBlob|fetchProtectedMediaBlob\(/],
  ["getProtectedAssetObjectUrl", /function getProtectedAssetObjectUrl|getProtectedAssetObjectUrl\(/],
  ["open/download asset action", /window\.open\(objectUrl|anchor\.href = objectUrl|download/],
  ["fallbackMarkup", /fallbackMarkup/],
  ["hydrateProtectedAssetPreview", /function hydrateProtectedAssetPreview|hydrateProtectedAssetPreview\(/],
  ["upload handler", /uploadProjectAsset|handle.*upload|input.*file|FileReader|drop|dragover/i],
  ["object URL cleanup", /revokeObjectURL|createObjectURL|protectedPreviewObjectUrls/i],
];

function firstLine(pattern) {
  return find(pattern)[0]?.line || null;
}

function zoneFor(pattern, radius = 40) {
  const line = firstLine(pattern);
  if (!line) return "_No match found._";
  return excerpt(line - radius, line + radius);
}

function verdictForZone(zone) {
  const hasEscape = /escapeHtml|textContent|asString/.test(zone);
  const hasRevoke = /revokeObjectURL/.test(zone);
  const hasProtected = /requiresProtectedMediaFetch|fetchProtectedMediaBlob|getProtectedAssetObjectUrl/.test(zone);
  const hasWindowOpen = /window\.open|anchor\.href/.test(zone);
  const hasObjectUrl = /createObjectURL|objectUrl/.test(zone);
  const hasFallbackMarkup = /fallbackMarkup/.test(zone);
  const hasFileUpload = /uploadProjectAsset|input.*file|drop|dragover|FileReader/i.test(zone);

  if (hasFallbackMarkup && !hasEscape) return "P1: fallbackMarkup source needs manual safety confirmation";
  if (hasWindowOpen && hasObjectUrl && !hasProtected) return "P1: object URL open/download needs guard confirmation";
  if (hasObjectUrl && !hasRevoke) return "P1: object URL lifecycle cleanup needs confirmation";
  if (hasFileUpload && !/accept|catalog|uploadType|guard|validate|assetType/i.test(zone)) return "P1: upload/drop path needs validation confirmation";
  if (hasEscape || hasProtected || hasRevoke) return "Safety evidence present; verify exact source boundaries";
  return "Review";
}

let md = `# T11 — Library Focused Safety Verification

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
T10 showed Library has high signal density. T11 focuses only on the concrete safety surfaces that can justify a patch:
1. Preview/Object URL safety
2. fallbackMarkup/innerHTML source safety
3. File picker/drop validation
4. Object URL cleanup lifecycle

## Focused Findings
| Area | First Line | Verdict |
|---|---:|---|
`;

for (const [name, pattern] of targets) {
  const line = firstLine(pattern);
  const zone = line ? zoneFor(pattern, 35) : "";
  md += `| ${name} | ${line || "n/a"} | ${line ? verdictForZone(zone) : "No match"} |\n`;
}

md += `\n## Detailed Evidence\n`;

for (const [name, pattern] of targets) {
  md += `\n### ${name}\n\n\`\`\`js\n${zoneFor(pattern, 45)}\n\`\`\`\n`;
}

md += `
## Decision Checklist
- If Preview/Object URL path already requires protected fetch and has revoke cleanup: likely close or minor doc-only closeout.
- If fallbackMarkup is generated only by trusted render helper and escaped content: no patch.
- If upload/drop path validates upload type and delegates to backend upload API: no patch.
- If any user-controlled URL reaches iframe/window.open/download without guard: patch narrowly.
- If object URLs are not revoked on selection/change/route cleanup: patch cleanup narrowly.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T11_LIBRARY_FOCUSED_SAFETY_VERIFICATION.md"), md);

console.log("Generated audits/system-truth/t11-library-focused-safety/T11_LIBRARY_FOCUSED_SAFETY_VERIFICATION.md");
