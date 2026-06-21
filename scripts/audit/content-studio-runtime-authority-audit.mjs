import fs from "fs";
import path from "path";

const root = process.cwd();
const filePath = path.join(root, "public/control-center/pages/content-studio-workspace.js");
const outDir = path.join(root, "audits/system-truth/t80-content-studio-runtime-authority");

const text = fs.readFileSync(filePath, "utf8");
const lines = text.split(/\r?\n/);

function find(pattern) {
  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
  return lines
    .map((line, index) => ({ line: index + 1, text: line }))
    .filter((entry) => regex.test(entry.text));
}

function renderList(items, limit = 220) {
  if (!items.length) return "- none";
  return items
    .slice(0, limit)
    .map((item) => `- L${item.line}: \`${item.text.trim().replaceAll("`", "\\`")}\``)
    .join("\n");
}

const findings = {
  file: "public/control-center/pages/content-studio-workspace.js",
  total_lines: lines.length,

  imports: find(/^import\s/),
  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/),

  api_imports_and_calls: find(/createProjectApproval|createProjectHandoff|createProjectTask|decideProjectApproval|executeProjectAiCommand|fetchProjectOperations|listProjectApprovals|listProjectContentItems|listProjectEvents|listProjectHandoffs|listProjectTasks|saveProjectContentItem|isAccessKeyFailure/i),

  ai_execution_signals: find(/executeProjectAiCommand|execute|run|generate|AI|ai command|prompt|assistant|provider|access key|isAccessKeyFailure/i),
  content_save_signals: find(/saveProjectContentItem|save|localStorage|sessionStorage|draft|content item|version|publish-ready|publishing_ready/i),
  approval_signals: find(/approval|approve|approved|decideProjectApproval|createProjectApproval|review|needs_review|reject/i),
  handoff_signals: find(/handoff|createProjectHandoff|setSharedHandoff|getSharedHandoff|publishing|library|campaign|media/i),
  task_signals: find(/task|createProjectTask|listProjectTasks|todo|follow-up/i),
  destructive_or_execution_signals: find(/delete|archive|execute|publish|send|sync|import|submit|run|dispatch|trigger|start/i),
  confirmation_signals: find(/confirm\(/),
  access_key_signals: find(/access key|MH_CONTROL_CENTER_WRITE_KEY|isAccessKeyFailure/i),
  navigation_signals: find(/navigateTo|location\.hash|data-route|route/i),
  disabled_or_readonly_signals: find(/disabled|read-only|readonly|locked|future|preview|draft|not configured|requires|guard/i),
  risky_terms: find(/publish|approve|send|execute|generate|provider|save|task|handoff|library|approval|delete|archive|sync|import|credential|token|access key|decide|review/i)
};

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "content-studio-runtime-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

const riskNotes = [];

if (findings.ai_execution_signals.length) {
  riskNotes.push("Content Studio contains AI execution/generation signals. Exact action paths must classify whether these call backend execution or only prepare prompts.");
}

if (findings.content_save_signals.length) {
  riskNotes.push("Content Studio contains content save/draft signals. These must be separated into local draft and backend content item save.");
}

if (findings.approval_signals.length) {
  riskNotes.push("Content Studio contains approval signals. Approval request/decision paths must be checked for explicit operator confirmation.");
}

if (findings.handoff_signals.length) {
  riskNotes.push("Content Studio contains handoff signals. Publishing, Library, Media, or Campaign handoffs must be confirmed if they create backend records.");
}

if (findings.confirmation_signals.length === 0) {
  riskNotes.push("No confirmation dialogs found. This is only acceptable if authority-sensitive actions are disabled, draft-only, or backend-governed.");
} else {
  riskNotes.push("Confirmation dialogs exist and must be mapped to exact authority-sensitive actions.");
}

const md = `# T80 — Content Studio Runtime Authority Focused Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of \`public/control-center/pages/content-studio-workspace.js\`.

## Why Content Studio Is High Risk
Content Studio is an active routed content execution surface. It may include AI command execution, content persistence, approval requests/decisions, task creation, Library/Publishing/Media handoffs, and local draft flows. These must be classified before any patch.

## File Summary
- File: \`public/control-center/pages/content-studio-workspace.js\`
- Lines: ${findings.total_lines}
- Imports: ${findings.imports.length}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- API imports/calls: ${findings.api_imports_and_calls.length}
- AI execution signals: ${findings.ai_execution_signals.length}
- Content save/storage signals: ${findings.content_save_signals.length}
- Approval signals: ${findings.approval_signals.length}
- Handoff signals: ${findings.handoff_signals.length}
- Task signals: ${findings.task_signals.length}
- Destructive/execution signals: ${findings.destructive_or_execution_signals.length}
- Confirmation signals: ${findings.confirmation_signals.length}
- Access-key signals: ${findings.access_key_signals.length}
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

## API Imports / Calls
${renderList(findings.api_imports_and_calls)}

## AI Execution Signals
${renderList(findings.ai_execution_signals)}

## Content Save / Storage Signals
${renderList(findings.content_save_signals)}

## Approval Signals
${renderList(findings.approval_signals)}

## Handoff Signals
${renderList(findings.handoff_signals)}

## Task Signals
${renderList(findings.task_signals)}

## Destructive / Execution Signals
${renderList(findings.destructive_or_execution_signals)}

## Confirmation Signals
${renderList(findings.confirmation_signals)}

## Access-Key Signals
${renderList(findings.access_key_signals)}

## Navigation Signals
${renderList(findings.navigation_signals)}

## Disabled / Read-only / Draft / Guard Signals
${renderList(findings.disabled_or_readonly_signals)}

## Risky Terms
${renderList(findings.risky_terms)}

## Required Manual Classification
Before any patch, classify exact user-facing action paths into:

1. Local draft only
2. Backend content item save
3. AI command execution
4. Prompt/content preparation only
5. Approval creation
6. Approval decision
7. Task creation
8. Library handoff
9. Publishing handoff
10. Media/Campaign handoff
11. AI Command handoff
12. Navigation only
13. Unknown / needs deeper inspection

## Decision Rule
- If AI/backend execution can run without explicit confirmation or access-key guard clarity, create a narrow patch.
- If approval decision can happen without explicit confirmation, create a narrow patch.
- If Library/Publishing/Media handoff creates backend records without confirmation, create a narrow patch.
- If local draft save is browser/session-only, no destructive confirmation is required.
- Do not redesign Content Studio in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T80_CONTENT_STUDIO_RUNTIME_AUTHORITY_FOCUSED_AUDIT.md"),
  md
);

console.log("Generated audits/system-truth/t80-content-studio-runtime-authority/T80_CONTENT_STUDIO_RUNTIME_AUTHORITY_FOCUSED_AUDIT.md");
