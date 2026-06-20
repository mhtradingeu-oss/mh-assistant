import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/library.js";
const outDir = path.join(root, "audits/system-truth/t13-library-exact-path-proof");

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

const exactChecks = [
  {
    area: "Object URL creation",
    pattern: /URL\.createObjectURL/,
    expected: ["fetchProtectedMediaBlob", "libraryProtectedUrlCache.set"]
  },
  {
    area: "Object URL revocation",
    pattern: /URL\.revokeObjectURL/,
    expected: ["revokeLibraryProtectedUrl", "libraryProtectedUrlCache.delete"]
  },
  {
    area: "Open asset action",
    pattern: /window\.open\(objectUrl/,
    expected: ["getProtectedAssetObjectUrl", "noopener,noreferrer"]
  },
  {
    area: "Download asset action",
    pattern: /anchor\.href = objectUrl/,
    expected: ["getProtectedAssetObjectUrl", "anchor.download"]
  },
  {
    area: "fallbackMarkup assignment",
    pattern: /fallbackMarkup/,
    expected: ["renderUnsupportedPreviewCard", "escapeHtml"]
  },
  {
    area: "Upload delegation",
    pattern: /uploadProjectAsset/,
    expected: ["uploadProjectAsset", "uploadType"]
  },
  {
    area: "Drop/file handler",
    pattern: /drop|dragover|files\[/i,
    expected: ["files", "uploadType", "uploadProjectAsset"]
  }
];

function verdict(area, code, expected) {
  const missing = expected.filter(item => !code.includes(item));
  if (missing.length === 0) return "Verified";
  return `Review: missing nearby ${missing.join(", ")}`;
}

let md = `# T13 — Library Exact Code Path Proof

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
T12 showed Library is likely covered, but required exact code-path proof for open/download, object URL lifecycle, fallbackMarkup, and upload/drop handling.

## Exact Path Findings
| Area | First Line | Verdict |
|---|---:|---|
`;

for (const check of exactChecks) {
  const line = first(check.pattern);
  const code = line ? zone(check.pattern, 55) : "";
  md += `| ${check.area} | ${line || "n/a"} | ${line ? verdict(check.area, code, check.expected) : "No match"} |\n`;
}

md += `

## Evidence
`;

for (const check of exactChecks) {
  md += `\n### ${check.area}\n\n\`\`\`js\n${zone(check.pattern, 65)}\n\`\`\`\n`;
}

md += `
## Closeout Decision Rules
- If all areas are Verified, Library does not need a safety patch now.
- If only upload/drop remains Review because of broad matching, inspect exact handler before patch.
- If open/download uses getProtectedAssetObjectUrl and noopener/download attributes, no URL patch is needed.
- If fallbackMarkup comes from renderUnsupportedPreviewCard with escapeHtml, no innerHTML patch is needed.
- If object URLs are cached and revoked, no lifecycle patch is needed.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T13_LIBRARY_EXACT_CODE_PATH_PROOF.md"), md);

console.log("Generated audits/system-truth/t13-library-exact-path-proof/T13_LIBRARY_EXACT_CODE_PATH_PROOF.md");
