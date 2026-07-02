import fs from "fs";
import path from "path";

const root = process.cwd();
const homePath = path.join(root, "public/control-center/pages/home.js");
const outDir = path.join(root, "audits/system-truth/t62-home-runtime-authority");

const text = fs.readFileSync(homePath, "utf8");
const lines = text.split(/\r?\n/);

function find(pattern) {
  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
  return lines
    .map((line, index) => ({ line: index + 1, text: line }))
    .filter((entry) => regex.test(entry.text));
}

const findings = {
  file: "public/control-center/pages/home.js",
  total_lines: lines.length,

  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown/),
  backend_write_signals: find(/POST|PUT|PATCH|DELETE|createProject|updateProject|deleteProject|saveProject|syncProject|importProject|execute|publish|send|approve|reject|archive|disconnect|reconnect|generate/i),
  navigation_signals: find(/navigateTo|location\.hash|href\s*=|data-route|route/i),
  ai_handoff_signals: find(/AI|ai|assistant|team|command|handoff|prompt/i),
  storage_signals: find(/localStorage|sessionStorage/),
  confirmation_signals: find(/confirm\(/),
  projection_signals: find(/readiness|overview|operations|snapshot|project|state|context/i)
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "home-runtime-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

function renderList(items, limit = 80) {
  if (!items.length) return "- none";
  return items.slice(0, limit).map((item) => `- L${item.line}: \`${item.text.trim().replaceAll("`", "\\`")}\``).join("\n");
}

const riskNotes = [];

if (findings.backend_write_signals.length === 0) {
  riskNotes.push("No obvious backend mutation/write signal was found.");
} else {
  riskNotes.push("Backend/write-like terms exist and must be classified as projection/navigation/action-copy before patching.");
}

if (findings.confirmation_signals.length === 0) {
  riskNotes.push("No confirmation dialogs found. This is acceptable only if Home has no destructive/write actions.");
}

if (findings.storage_signals.length === 0) {
  riskNotes.push("No browser storage usage found.");
}

if (findings.render_writes.length <= 2) {
  riskNotes.push("Home appears to use a limited render surface, not many scattered DOM writes.");
}

const md = `# T62 — Home Runtime Authority Focused Audit

## Status
Audit-only. No production files changed.

## Scope
Focused audit of \`public/control-center/pages/home.js\` after T61 ranked Home as the highest remaining open frontend file.

## Why Home Ranked High
T61 used a heuristic model. Home has many projection, readiness, AI, operations, and action-copy terms. This does not automatically mean Home owns backend authority.

## File Summary
- File: \`public/control-center/pages/home.js\`
- Lines: ${findings.total_lines}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- Backend/write-like signals: ${findings.backend_write_signals.length}
- Navigation signals: ${findings.navigation_signals.length}
- AI/handoff signals: ${findings.ai_handoff_signals.length}
- Storage signals: ${findings.storage_signals.length}
- Confirmation signals: ${findings.confirmation_signals.length}

## Initial Risk Notes
${riskNotes.map((note) => `- ${note}`).join("\n")}

## Render Writes
${renderList(findings.render_writes)}

## Event Bindings
${renderList(findings.event_bindings)}

## Backend / Write-like Signals
${renderList(findings.backend_write_signals)}

## Navigation Signals
${renderList(findings.navigation_signals)}

## AI / Handoff Signals
${renderList(findings.ai_handoff_signals, 120)}

## Storage Signals
${renderList(findings.storage_signals)}

## Confirmation Signals
${renderList(findings.confirmation_signals)}

## Required Manual Classification
Before any patch, classify every Home action into one of:

1. Navigation only
2. AI context handoff only
3. Projection/read-only refresh
4. Draft/local-only
5. Backend mutation/write
6. Unknown / needs deeper inspection

## Decision Rule
- If Home actions are only navigation/projection/AI-context, close T62 as safe with no runtime patch.
- If any backend mutation exists without clear confirmation/backend authority, create a narrow T63 patch.
- Do not redesign Home in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T62_HOME_RUNTIME_AUTHORITY_FOCUSED_AUDIT.md"),
  md
);

console.log("Generated audits/system-truth/t62-home-runtime-authority/T62_HOME_RUNTIME_AUTHORITY_FOCUSED_AUDIT.md");
