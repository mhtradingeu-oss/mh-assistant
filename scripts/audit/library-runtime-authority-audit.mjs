import fs from "fs";
import path from "path";

const root = process.cwd();
const filePath = path.join(root, "public/control-center/pages/library.js");
const outDir = path.join(root, "audits/system-truth/t96-library-runtime-authority");

const text = fs.readFileSync(filePath, "utf8");
const lines = text.split(/\r?\n/);

function find(pattern) {
  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
  return lines
    .map((line, index) => ({ line: index + 1, text: line }))
    .filter((entry) => regex.test(entry.text));
}

function renderList(items, limit = 260) {
  if (!items.length) return "- none";
  return items
    .slice(0, limit)
    .map((item) => `- L${item.line}: \`${item.text.trim().replaceAll("`", "\\`")}\``)
    .join("\n");
}

const findings = {
  file: "public/control-center/pages/library.js",
  total_lines: lines.length,

  imports: find(/^import\s/),
  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/),

  backend_api_signals: find(/fetchProject|createProject|saveProject|updateProject|deleteProject|listProject|asset|library|source|upload|file|registry|handoff|approval|task|api/i),
  library_asset_signals: find(/library|asset|source|file|folder|document|preview|catalog|registry|brand|upload|drop|picker/i),
  source_return_signals: find(/setSharedAiSource|getSharedLibrarySourceBridge|clearSharedLibrarySourceBridge|Use as Source|source bridge|returnTarget|ai-command/i),
  save_storage_signals: find(/save|saved|persist|localStorage|sessionStorage|setItem|getItem|draft|cache|record|write/i),
  upload_import_signals: find(/upload|import|drop|file picker|choose file|attach|attachment|read file|FileReader|formData/i),
  destructive_signals: find(/delete|remove|archive|clear|disconnect|reset|overwrite/i),
  handoff_signals: find(/handoff|setSharedHandoff|getSharedHandoff|destination_page|route_target|send to|route to/i),
  approval_signals: find(/approval|approve|approved|review|needs_review|reject|governance/i),
  task_signals: find(/task|createProjectTask|todo|follow-up|next action/i),
  confirmation_signals: find(/confirm\(/),
  access_key_signals: find(/access key|MH_CONTROL_CENTER_WRITE_KEY|isAccessKeyFailure|write key|credential|token/i),
  navigation_signals: find(/navigateTo|location\.hash|data-route|route/i),
  disabled_or_readonly_signals: find(/disabled|read-only|readonly|locked|future|preview|draft|not configured|requires|guard/i),
  risky_terms: find(/publish|approve|send|execute|generate|provider|save|task|handoff|library|approval|delete|archive|sync|import|credential|token|access key|review|source|upload|asset|file|governance/i)
};

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "library-runtime-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

const riskNotes = [];

if (findings.backend_api_signals.length) {
  riskNotes.push("Library contains backend/API/library/source/asset signals. Exact paths must separate read-only display, local preview, and durable backend mutation.");
}

if (findings.upload_import_signals.length) {
  riskNotes.push("Library contains upload/import/file-picker signals. Need classify whether files are actually persisted or only selected/previewed.");
}

if (findings.source_return_signals.length) {
  riskNotes.push("Library contains AI Command source return flow signals. Need confirm this is shared context only unless backend source records are changed.");
}

if (findings.destructive_signals.length) {
  riskNotes.push("Library contains remove/delete/archive/clear signals. Destructive paths must be confirmed if they mutate backend or durable records.");
}

if (findings.confirmation_signals.length) {
  riskNotes.push("Confirmation dialogs exist and must be mapped to exact authority-sensitive actions.");
} else {
  riskNotes.push("No confirmation dialogs found. This is acceptable only if mutation paths are absent or delegated to guarded backend surfaces.");
}

const md = `# T96 — Library Runtime Authority Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of \`public/control-center/pages/library.js\`.

## Why Library Is Next
T88 ranked Library as the next highest remaining open active page after AI Command and Tool Dock were closed.

Library is a high-value authority surface because it can manage assets, source-of-truth materials, previews, selected sources, upload/import flows, and AI Command source return flow.

## File Summary
- File: \`public/control-center/pages/library.js\`
- Lines: ${findings.total_lines}
- Imports: ${findings.imports.length}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- Backend/API signals: ${findings.backend_api_signals.length}
- Library/asset/source signals: ${findings.library_asset_signals.length}
- Source return flow signals: ${findings.source_return_signals.length}
- Save/storage signals: ${findings.save_storage_signals.length}
- Upload/import/file signals: ${findings.upload_import_signals.length}
- Destructive signals: ${findings.destructive_signals.length}
- Handoff signals: ${findings.handoff_signals.length}
- Approval/governance signals: ${findings.approval_signals.length}
- Task signals: ${findings.task_signals.length}
- Confirmation signals: ${findings.confirmation_signals.length}
- Access-key/credential signals: ${findings.access_key_signals.length}
- Navigation signals: ${findings.navigation_signals.length}
- Disabled/read-only/draft/guard signals: ${findings.disabled_or_readonly_signals.length}
- Risky terms: ${findings.risky_terms.length}

## Initial Risk Notes
${riskNotes.map((note) => `- ${note}`).join("\n")}

## Imports
${renderList(findings.imports)}

## Render Writes
${renderList(findings.render_writes)}

## Event Bindings
${renderList(findings.event_bindings)}

## Backend / API Signals
${renderList(findings.backend_api_signals)}

## Library / Asset / Source Signals
${renderList(findings.library_asset_signals)}

## Source Return Flow Signals
${renderList(findings.source_return_signals)}

## Save / Storage Signals
${renderList(findings.save_storage_signals)}

## Upload / Import / File Signals
${renderList(findings.upload_import_signals)}

## Destructive Signals
${renderList(findings.destructive_signals)}

## Handoff Signals
${renderList(findings.handoff_signals)}

## Approval / Governance Signals
${renderList(findings.approval_signals)}

## Task Signals
${renderList(findings.task_signals)}

## Confirmation Signals
${renderList(findings.confirmation_signals)}

## Access-Key / Credential Signals
${renderList(findings.access_key_signals)}

## Navigation Signals
${renderList(findings.navigation_signals)}

## Disabled / Read-only / Draft / Guard Signals
${renderList(findings.disabled_or_readonly_signals)}

## Risky Terms
${renderList(findings.risky_terms)}

## Required Manual Classification
Before any patch, classify exact user-facing Library paths into:

1. Asset/library display only
2. Asset preview only
3. Source selection for AI Command only
4. Upload/import/file picker
5. Save asset/source record
6. Edit metadata
7. Delete/remove/archive/clear asset
8. Library → AI Command source return
9. Library → Content/Media/Publishing handoff
10. Governance/review/approval flags
11. Local state/cache only
12. Unknown / needs deeper inspection

## Decision Rule
- If Library mutates durable asset/source records without confirmation, patch.
- If upload/import persists files without confirmation, patch.
- If delete/remove/archive mutates durable records without confirmation, patch.
- If AI Command source return is shared context only, document and close that path.
- If Library is mostly projection plus local/source bridge, close or patch narrowly.
- Do not redesign Library in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T96_LIBRARY_RUNTIME_AUTHORITY_AUDIT.md"),
  md
);

console.log("Generated T96 Library authority audit");
console.log(`Lines: ${findings.total_lines}`);
console.log(`Backend/API signals: ${findings.backend_api_signals.length}`);
console.log(`Confirmation signals: ${findings.confirmation_signals.length}`);
