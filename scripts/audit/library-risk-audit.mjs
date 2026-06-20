import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/library.js";
const outDir = path.join(root, "audits/system-truth/t10-library-risk");

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

function nearby(line, radius = 18) {
  return excerpt(line - radius, line + radius);
}

const signals = {
  innerHTML: find(/\.innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  eventBinding: find(/addEventListener|onclick\s*=|onchange\s*=|oninput\s*=/),
  timers: find(/setTimeout|setInterval|clearTimeout|clearInterval|requestAnimationFrame/),
  preview: find(/preview|renderPreview|DocumentPreview|iframe|objectURL|createObjectURL|URL\.createObjectURL|revokeObjectURL/i),
  filePicker: find(/file picker|filePicker|input.*file|type=["']file|readAs|FileReader|upload|drop|dragover|dropzone|drop-zone/i),
  storage: find(/localStorage|sessionStorage|indexedDB|cache|persist/i),
  apiCalls: find(/await\s+\w+|api\.|fetch\(|loadProjectData|saveProjectData|upload|delete|remove|archive/i),
  unsafeTerms: find(/dangerously|rawHtml|sanitize|escapeHtml|trusted|untrusted|blob:|data:/i),
};

function classifyInnerHTML(hit) {
  const zone = nearby(hit.line, 12);
  if (/escapeHtml|sanitize|map\(|join\("|join\('|\bhtml\b|render/i.test(zone)) {
    return "Review: likely render-template innerHTML, verify escaping and source ownership";
  }
  return "P1-check: innerHTML without nearby escaping/render evidence";
}

function classifyPreview(hit) {
  const zone = nearby(hit.line, 18);
  if (/canAttemptDocumentPreview|getAssetPreviewUrl|escapeHtml|fallback|revokeObjectURL/i.test(zone)) {
    return "Review: preview path has helper/fallback evidence";
  }
  return "P1-check: preview/file URL path needs safety review";
}

function classifyFilePicker(hit) {
  const zone = nearby(hit.line, 18);
  if (/preventDefault|accept=|escapeHtml|upload|metadata|fallback/i.test(zone)) {
    return "Review: file picker/drop path needs focused verification";
  }
  return "P1-check: file picker/drop path lacks nearby guard evidence";
}

function table(title, rows, classifier = null, limit = 120) {
  let md = `\n## ${title}\n\n| Line | Code | Classification |\n|---:|---|---|\n`;
  for (const hit of rows.slice(0, limit)) {
    const clean = hit.text.trim().replaceAll("|", "\\|");
    const cls = classifier ? classifier(hit) : "Review";
    md += `| ${hit.line} | \`${clean}\` | ${cls} |\n`;
  }
  if (rows.length > limit) {
    md += `\n_Trimmed: ${rows.length - limit} additional matches not shown._\n`;
  }
  return md;
}

let md = `# T10 — Library Deep Risk Audit

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
Library is one of the highest-risk frontend pages because of size, preview/file handling, timers, and repeated innerHTML usage. This audit identifies whether the risk is actual runtime danger or mostly render-template density.

## Summary Counts
| Signal | Count |
|---|---:|
`;

for (const [key, rows] of Object.entries(signals)) {
  md += `| ${key} | ${rows.length} |\n`;
}

md += `
## Initial Decision
Do not patch yet. Use this audit to decide if Library needs:
- Preview/file safety patch
- innerHTML escaping consolidation
- timer cleanup
- UX-only polish
- or closeout/no patch
`;

md += table("innerHTML / HTML Injection Signals", signals.innerHTML, classifyInnerHTML, 160);
md += table("Preview / Document Rendering Signals", signals.preview, classifyPreview, 140);
md += table("File Picker / Upload / Drop Signals", signals.filePicker, classifyFilePicker, 140);
md += table("Timer Signals", signals.timers, null, 100);
md += table("Storage Signals", signals.storage, null, 100);
md += table("API / Mutation / Async Signals", signals.apiCalls, null, 160);
md += table("Unsafe / Trust Boundary Terms", signals.unsafeTerms, null, 120);

const focusTerms = [
  ["Render Preview Zone", /function renderPreview|renderPreview\(/i],
  ["Asset Preview URL Zone", /getAssetPreviewUrl|canAttemptDocumentPreview/i],
  ["Drop Zone / Upload Zone", /drop|drop-zone|upload|file/i],
  ["Main Render Zone", /function render|root\.innerHTML|container\.innerHTML/i],
  ["Selection / Action Binding Zone", /selected|bind|onclick|addEventListener/i],
];

md += `\n## Focus Zones\n`;

for (const [title, pattern] of focusTerms) {
  const first = find(pattern)[0];
  if (first) {
    md += `\n### ${title}\n\n\`\`\`js\n${nearby(first.line, 35)}\n\`\`\`\n`;
  } else {
    md += `\n### ${title}\n\n_No direct match found._\n`;
  }
}

md += `
## Decision Checklist
- If preview URLs can load arbitrary unsafe URL/data/blob without guard: patch preview guard.
- If file picker/drop accepts unsafe unsupported inputs without validation: patch input guard.
- If innerHTML uses unescaped user/project/source content: patch escaping at the smallest render boundary.
- If timers can leak or duplicate subscriptions on route changes: patch cleanup only.
- If findings are mostly template rendering with escapeHtml: close as verified and move to next risk.
- Do not touch CSS in this phase.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T10_LIBRARY_DEEP_RISK_AUDIT.md"), md);

console.log("Generated audits/system-truth/t10-library-risk/T10_LIBRARY_DEEP_RISK_AUDIT.md");
