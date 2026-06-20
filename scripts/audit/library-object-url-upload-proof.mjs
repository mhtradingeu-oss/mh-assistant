import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/library.js";
const outDir = path.join(root, "audits/system-truth/t12-library-proof");

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

const checks = [
  ["URL.createObjectURL", /URL\.createObjectURL/],
  ["URL.revokeObjectURL", /URL\.revokeObjectURL/],
  ["protected URL cache", /libraryProtectedUrlCache/],
  ["revoke helper", /function revokeLibraryProtectedUrl|revokeLibraryProtectedUrl\(/],
  ["object URL open", /window\.open\(objectUrl/],
  ["object URL download", /anchor\.href = objectUrl/],
  ["fallbackMarkup definition", /fallbackMarkup/],
  ["upload API", /uploadProjectAsset/],
  ["file input", /input.*file|type=["']file|files\[/i],
  ["drop event", /drop|dragover|drop-zone/i],
];

let md = `# T12 — Library Object URL + Upload Proof Audit

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
T11 identified remaining P1 review areas. T12 verifies whether those are true patch requirements or already covered by object URL cleanup, protected media fetch, trusted fallback markup, and backend upload delegation.

## Signal Map
| Signal | First Line | Count |
|---|---:|---:|
`;

for (const [label, pattern] of checks) {
  const hits = find(pattern);
  md += `| ${label} | ${hits[0]?.line || "n/a"} | ${hits.length} |\n`;
}

const zones = [
  ["Object URL lifecycle zone", first(/function revokeLibraryProtectedUrl|URL\.revokeObjectURL|URL\.createObjectURL/) || 360, 80],
  ["Protected media object URL fetch zone", first(/async function getProtectedAssetObjectUrl/) || 404, 90],
  ["Open/download object URL action zone", first(/window\.open\(objectUrl|anchor\.href = objectUrl/) || 450, 70],
  ["Protected preview hydration + fallbackMarkup zone", first(/function hydrateProtectedAssetPreview/) || 1351, 130],
  ["File upload/drop handler zone", first(/uploadProjectAsset|drop|dragover|type=["']file/i) || 2850, 150],
];

md += `

## Evidence Zones
`;

for (const [title, line, radius] of zones) {
  md += `\n### ${title}\n\n\`\`\`js\n${excerpt(line - radius, line + radius)}\n\`\`\`\n`;
}

const hasCreate = find(/URL\.createObjectURL/).length > 0;
const hasRevoke = find(/URL\.revokeObjectURL/).length > 0;
const hasCache = find(/libraryProtectedUrlCache/).length > 0;
const hasProtectedFetch = find(/fetchProtectedMediaBlob|requiresProtectedMediaFetch|getProtectedAssetObjectUrl/).length > 0;
const hasUploadApi = find(/uploadProjectAsset/).length > 0;

md += `

## Preliminary Verdict

| Area | Verdict |
|---|---|
| Object URL lifecycle | ${hasCreate && hasRevoke && hasCache ? "Likely covered: createObjectURL is paired with cache/revoke evidence." : "Needs patch review: missing create/revoke/cache evidence."} |
| Protected preview fetch | ${hasProtectedFetch ? "Likely covered: protected media fetch helpers exist." : "Needs patch review: no protected fetch helper evidence."} |
| Open/download object URL | ${hasProtectedFetch && hasRevoke ? "Likely acceptable, but should be verified by exact code path." : "Needs patch review."} |
| Upload path | ${hasUploadApi ? "Likely backend-delegated via uploadProjectAsset; verify handler validation." : "Needs patch review: no uploadProjectAsset evidence."} |

## Decision Checklist
- If object URLs are cached and revoked: no cleanup patch needed.
- If open/download only use protected/fetched object URLs or safe preview URLs: no URL guard patch needed.
- If fallbackMarkup is produced by trusted render helper with escaped content: no innerHTML patch needed.
- If upload/drop delegates to uploadProjectAsset with type/catalog context: no upload patch needed.
- If any of the above is false, patch narrowly.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T12_LIBRARY_OBJECT_URL_UPLOAD_PROOF_AUDIT.md"), md);

console.log("Generated audits/system-truth/t12-library-proof/T12_LIBRARY_OBJECT_URL_UPLOAD_PROOF_AUDIT.md");
