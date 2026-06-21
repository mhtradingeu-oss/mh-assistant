import fs from "fs";
import path from "path";

const root = process.cwd();
const filePath = path.join(root, "public/control-center/pages/ai-command/tool-dock.js");
const outDir = path.join(root, "audits/system-truth/t93-ai-command-tool-dock-authority");

const text = fs.readFileSync(filePath, "utf8");
const lines = text.split(/\r?\n/);

function find(pattern) {
  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
  return lines
    .map((line, index) => ({ line: index + 1, text: line }))
    .filter((entry) => regex.test(entry.text));
}

function renderList(items, limit = 240) {
  if (!items.length) return "- none";
  return items
    .slice(0, limit)
    .map((item) => `- L${item.line}: \`${item.text.trim().replaceAll("`", "\\`")}\``)
    .join("\n");
}

const findings = {
  file: "public/control-center/pages/ai-command/tool-dock.js",
  total_lines: lines.length,

  imports: find(/^import\s/),
  exports: find(/^export\s/),
  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/),

  backend_api_signals: find(/fetchProject|createProject|saveProject|updateProject|deleteProject|executeProject|listProject|decideProject|createProjectApproval|createProjectHandoff|createProjectTask|approval|handoff|task|library|publishing|campaign|media|api/i),
  ai_execution_signals: find(/execute|run|generate|provider|model|AI|ai|prompt|assistant|tool|drawer/i),
  handoff_signals: find(/handoff|setSharedHandoff|getSharedHandoff|destination_page|route_target|send to|route to|destination/i),
  task_signals: find(/task|createProjectTask|todo|follow-up|next action/i),
  approval_signals: find(/approval|approve|approved|decideProjectApproval|createProjectApproval|review|needs_review|reject|governance/i),
  save_storage_signals: find(/save|saved|localStorage|sessionStorage|setItem|getItem|history|draft|persist|cache/i),
  source_signals: find(/source|required source|selected source|getSelectedLibrarySource|library source|asset|document|reference/i),
  destructive_or_execution_signals: find(/delete|archive|execute|publish|send|sync|import|submit|run|dispatch|trigger|start|generate|approve|reject/i),
  confirmation_signals: find(/confirm\(/),
  navigation_signals: find(/navigateTo|location\.hash|data-route|route/i),
  disabled_or_readonly_signals: find(/disabled|read-only|readonly|locked|future|preview|draft|not configured|requires|guard/i),
  risky_terms: find(/publish|approve|send|execute|generate|provider|save|task|handoff|library|approval|delete|archive|sync|import|credential|token|access key|review|source|governance/i)
};

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "ai-command-tool-dock-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

const riskNotes = [];

if (findings.backend_api_signals.length) {
  riskNotes.push("Tool Dock contains backend/API-like signals. Need exact action path classification.");
}

if (findings.ai_execution_signals.length) {
  riskNotes.push("Tool Dock contains AI/tool/generation signals. Need classify preview-only vs execution.");
}

if (findings.source_signals.length) {
  riskNotes.push("Tool Dock contains source/library/reference signals. Need classify source-required tools and whether they only prepare prompts.");
}

if (findings.confirmation_signals.length === 0) {
  riskNotes.push("No confirmation dialogs found. This is acceptable only if Tool Dock is preview/local-only or delegates execution elsewhere.");
} else {
  riskNotes.push("Confirmation dialogs exist and must be mapped to exact authority-sensitive actions.");
}

const md = `# T93 — AI Command Tool Dock Runtime Authority Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of \`public/control-center/pages/ai-command/tool-dock.js\`.

## Why Tool Dock Is Separate
T92 closed \`ai-command.js\` but explicitly excluded Tool Dock. T88 ranked Tool Dock separately as an open AI Command sub-surface.

Tool Dock can prepare tool prompts, require selected sources, open drawers, suggest destinations, and may look like execution. It must be proven preview-only or patched if it mutates backend state.

## File Summary
- File: \`public/control-center/pages/ai-command/tool-dock.js\`
- Lines: ${findings.total_lines}
- Imports: ${findings.imports.length}
- Exports: ${findings.exports.length}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- Backend/API signals: ${findings.backend_api_signals.length}
- AI/tool execution signals: ${findings.ai_execution_signals.length}
- Handoff signals: ${findings.handoff_signals.length}
- Task signals: ${findings.task_signals.length}
- Approval/governance signals: ${findings.approval_signals.length}
- Save/storage/history signals: ${findings.save_storage_signals.length}
- Source/library/reference signals: ${findings.source_signals.length}
- Destructive/execution signals: ${findings.destructive_or_execution_signals.length}
- Confirmation signals: ${findings.confirmation_signals.length}
- Navigation signals: ${findings.navigation_signals.length}
- Disabled/read-only/draft/guard signals: ${findings.disabled_or_readonly_signals.length}
- Risky terms: ${findings.risky_terms.length}

## Initial Risk Notes
${riskNotes.map((note) => `- ${note}`).join("\n")}

## Imports
${renderList(findings.imports)}

## Exports
${renderList(findings.exports)}

## Render Writes
${renderList(findings.render_writes)}

## Event Bindings
${renderList(findings.event_bindings)}

## Backend / API Signals
${renderList(findings.backend_api_signals)}

## AI / Tool Execution Signals
${renderList(findings.ai_execution_signals)}

## Handoff Signals
${renderList(findings.handoff_signals)}

## Task Signals
${renderList(findings.task_signals)}

## Approval / Governance Signals
${renderList(findings.approval_signals)}

## Save / Storage / History Signals
${renderList(findings.save_storage_signals)}

## Source / Library / Reference Signals
${renderList(findings.source_signals)}

## Destructive / Execution Signals
${renderList(findings.destructive_or_execution_signals)}

## Confirmation Signals
${renderList(findings.confirmation_signals)}

## Navigation Signals
${renderList(findings.navigation_signals)}

## Disabled / Read-only / Draft / Guard Signals
${renderList(findings.disabled_or_readonly_signals)}

## Risky Terms
${renderList(findings.risky_terms)}

## Required Manual Classification
Before any patch, classify exact paths into:

1. Tool list rendering only
2. Drawer open/close only
3. Prompt/template preparation
4. Source-required prompt preparation
5. Navigation only
6. Shared context handoff only
7. Backend AI/tool execution
8. Backend task/handoff/approval creation
9. Local save/history only
10. Unknown / needs deeper inspection

## Decision Rule
- If Tool Dock is render/drawer/prompt-prep only, close without patch.
- If it creates backend task/handoff/approval records, require confirmation or patch.
- If it executes AI/provider/tool backend, require explicit operator action and safety classification.
- Do not redesign Tool Dock in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T93_AI_COMMAND_TOOL_DOCK_RUNTIME_AUTHORITY_AUDIT.md"),
  md
);

console.log("Generated T93 Tool Dock authority audit");
console.log(`Lines: ${findings.total_lines}`);
console.log(`Backend/API signals: ${findings.backend_api_signals.length}`);
console.log(`AI/tool signals: ${findings.ai_execution_signals.length}`);
console.log(`Confirmation signals: ${findings.confirmation_signals.length}`);
