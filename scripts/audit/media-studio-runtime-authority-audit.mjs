import fs from "fs";
import path from "path";

const root = process.cwd();
const filePath = path.join(root, "public/control-center/pages/media-studio-workspace.js");
const outDir = path.join(root, "audits/system-truth/t76-media-studio-runtime-authority");

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
  file: "public/control-center/pages/media-studio-workspace.js",
  total_lines: lines.length,

  imports: find(/^import\s/),
  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/),

  api_imports_and_calls: find(/brandCheckMedia|createProjectApproval|createProjectHandoff|createProjectTask|decideProjectApproval|fetchProjectOperations|generateMediaCampaignPack|generateMediaImage|generateMediaVideoBrief|generateMediaVoiceScript|improveMediaPrompt|listProjectApprovals|listProjectContentItems|listProjectEvents|listProjectHandoffs|listProjectMediaJobs|listProjectTasks|saveProjectMediaJob|isAccessKeyFailure/i),

  generation_signals: find(/generateMedia|generate|provider|image|video|voice|campaign-pack|prompt_ready|generating|provider_not_configured|generation_error/i),
  approval_signals: find(/approval|approve|approved|decideProjectApproval|createProjectApproval|needs_review|review/i),
  handoff_signals: find(/handoff|createProjectHandoff|setSharedHandoff|getSharedHandoff|publishing|library|sent_to_publishing|sent_to_media/i),
  task_signals: find(/task|createProjectTask|listProjectTasks|todo|follow-up/i),
  save_write_signals: find(/saveProjectMediaJob|save|localStorage|sessionStorage|setItem|getItem|removeItem|MEDIA_LOCAL_DRAFTS_KEY|MEDIA_LIBRARY_LOCAL_ASSETS_KEY/i),
  destructive_or_execution_signals: find(/delete|archive|execute|publish|send|sync|import|submit|run|dispatch|trigger|start/i),
  confirmation_signals: find(/confirm\(/),
  access_key_signals: find(/access key|MH_CONTROL_CENTER_WRITE_KEY|isAccessKeyFailure|MEDIA_ACCESS_KEY_GUIDANCE/i),
  navigation_signals: find(/navigateTo|location\.hash|data-route|route/i),
  ai_signals: find(/AI|ai|assistant|prompt|setSharedAiDraft|improveMediaPrompt|suggestedPrompt/i),
  disabled_or_readonly_signals: find(/disabled|read-only|readonly|locked|future|preview|draft|provider_not_configured|not configured|requires|guard/i),
  risky_terms: find(/publish|approve|send|execute|generate|provider|save|task|handoff|library|approval|delete|archive|sync|import|credential|token|access key|brandCheck|decide|review/i)
};

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "media-studio-runtime-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

const riskNotes = [];

if (findings.generation_signals.length) {
  riskNotes.push("Media Studio contains provider/generation signals. These require exact action-path classification.");
}

if (findings.approval_signals.length) {
  riskNotes.push("Media Studio contains approval signals. Approval creation/decision paths must be checked for explicit operator confirmation.");
}

if (findings.save_write_signals.length) {
  riskNotes.push("Media Studio contains save/local draft/library persistence signals. These must be separated into local draft, backend media job save, and library handoff.");
}

if (findings.confirmation_signals.length === 0) {
  riskNotes.push("No confirmation dialogs found. This is only acceptable if authority-sensitive actions are disabled, draft-only, or governed by backend approval gates.");
} else {
  riskNotes.push("Confirmation dialogs exist and must be mapped to exact authority-sensitive actions.");
}

if (findings.access_key_signals.length) {
  riskNotes.push("Access-key handling exists and must be verified for provider-backed actions.");
}

const md = `# T76 — Media Studio Runtime Authority Focused Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of \`public/control-center/pages/media-studio-workspace.js\`.

## Why Media Studio Is High Risk
Media Studio is an active routed creative execution surface. It may include provider-backed generation, media job persistence, approvals, Library handoff, Publishing handoff, task creation, local drafts, and AI prompt improvement. These must be classified before any patch.

## File Summary
- File: \`public/control-center/pages/media-studio-workspace.js\`
- Lines: ${findings.total_lines}
- Imports: ${findings.imports.length}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- API imports/calls: ${findings.api_imports_and_calls.length}
- Generation signals: ${findings.generation_signals.length}
- Approval signals: ${findings.approval_signals.length}
- Handoff signals: ${findings.handoff_signals.length}
- Task signals: ${findings.task_signals.length}
- Save/write/storage signals: ${findings.save_write_signals.length}
- Destructive/execution signals: ${findings.destructive_or_execution_signals.length}
- Confirmation signals: ${findings.confirmation_signals.length}
- Access-key signals: ${findings.access_key_signals.length}
- Navigation signals: ${findings.navigation_signals.length}
- AI signals: ${findings.ai_signals.length}
- Disabled/read-only/draft/provider guard signals: ${findings.disabled_or_readonly_signals.length}
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

## Generation Signals
${renderList(findings.generation_signals)}

## Approval Signals
${renderList(findings.approval_signals)}

## Handoff Signals
${renderList(findings.handoff_signals)}

## Task Signals
${renderList(findings.task_signals)}

## Save / Write / Storage Signals
${renderList(findings.save_write_signals)}

## Destructive / Execution Signals
${renderList(findings.destructive_or_execution_signals)}

## Confirmation Signals
${renderList(findings.confirmation_signals)}

## Access-Key Signals
${renderList(findings.access_key_signals)}

## Navigation Signals
${renderList(findings.navigation_signals)}

## AI Signals
${renderList(findings.ai_signals)}

## Disabled / Read-only / Draft / Provider Guard Signals
${renderList(findings.disabled_or_readonly_signals)}

## Risky Terms
${renderList(findings.risky_terms)}

## Required Manual Classification
Before any patch, classify exact user-facing action paths into:

1. Local draft only
2. Backend media job save
3. Provider-backed generation
4. Prompt improvement
5. Brand check
6. Approval creation
7. Approval decision
8. Task creation
9. Library handoff / save
10. Publishing handoff
11. AI Command handoff
12. Navigation only
13. Unknown / needs deeper inspection

## Decision Rule
- If provider-backed generation can run without explicit operator confirmation or backend guard clarity, create a narrow patch.
- If approval decision can happen without explicit confirmation, create a narrow patch.
- If Library/Publishing handoff creates backend records, ensure copy and confirmation are appropriate.
- If local draft save is only browser storage, no destructive confirmation required.
- Do not redesign Media Studio in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T76_MEDIA_STUDIO_RUNTIME_AUTHORITY_FOCUSED_AUDIT.md"),
  md
);

console.log("Generated audits/system-truth/t76-media-studio-runtime-authority/T76_MEDIA_STUDIO_RUNTIME_AUTHORITY_FOCUSED_AUDIT.md");
