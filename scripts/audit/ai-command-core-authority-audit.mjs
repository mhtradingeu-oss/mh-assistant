import fs from "fs";
import path from "path";

const root = process.cwd();
const filePath = path.join(root, "public/control-center/pages/ai-command.js");
const outDir = path.join(root, "audits/system-truth/t89-ai-command-core-authority");

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
  file: "public/control-center/pages/ai-command.js",
  total_lines: lines.length,

  imports: find(/^import\s/),
  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/),

  ai_execution_signals: find(/executeProjectAiCommand|execute|run|generate|provider|model|AI|ai command|prompt|assistant|agent/i),
  backend_api_signals: find(/fetchProject|createProject|saveProject|updateProject|deleteProject|executeProject|listProject|decideProject|createProjectApproval|createProjectHandoff|createProjectTask|approval|handoff|task|library|publishing|campaign|media/i),
  command_send_signals: find(/send|submit|dispatch|execute|runCommand|handleCommand|command|quickCommand|prompt/i),
  approval_signals: find(/approval|approve|approved|decideProjectApproval|createProjectApproval|review|needs_review|reject|governance/i),
  handoff_signals: find(/handoff|createProjectHandoff|setSharedHandoff|getSharedHandoff|destination_page|route_target|send to|route to/i),
  task_signals: find(/task|createProjectTask|todo|follow-up|next action/i),
  save_storage_signals: find(/save|saved|localStorage|sessionStorage|setItem|getItem|history|draft|persist|cache/i),
  destructive_or_execution_signals: find(/delete|archive|execute|publish|send|sync|import|submit|run|dispatch|trigger|start|generate|approve|reject/i),
  confirmation_signals: find(/confirm\(/),
  access_key_signals: find(/access key|MH_CONTROL_CENTER_WRITE_KEY|isAccessKeyFailure|write key|credential|token/i),
  navigation_signals: find(/navigateTo|location\.hash|data-route|route/i),
  disabled_or_readonly_signals: find(/disabled|read-only|readonly|locked|future|preview|draft|not configured|requires|guard/i),
  risky_terms: find(/publish|approve|send|execute|generate|provider|save|task|handoff|library|approval|delete|archive|sync|import|credential|token|access key|review|source|governance/i)
};

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "ai-command-core-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

const riskNotes = [];

if (findings.ai_execution_signals.length) {
  riskNotes.push("AI Command contains heavy AI execution signals. Exact command submission paths must classify real backend execution vs prompt preparation.");
}

if (findings.backend_api_signals.length) {
  riskNotes.push("AI Command contains backend API/handoff/task/approval signals. Exact action paths must classify mutations and confirmation coverage.");
}

if (findings.approval_signals.length) {
  riskNotes.push("AI Command contains approval/governance signals. Approval creation/decision paths must be guarded.");
}

if (findings.handoff_signals.length) {
  riskNotes.push("AI Command contains handoff signals. Backend handoff creation must be confirmed or clearly handoff-only.");
}

if (findings.task_signals.length) {
  riskNotes.push("AI Command contains task signals. Backend task creation must be confirmed.");
}

if (findings.confirmation_signals.length === 0) {
  riskNotes.push("No confirmation dialogs found in AI Command. This is high risk unless mutations are delegated to guarded helper modules.");
} else {
  riskNotes.push("Confirmation dialogs exist and must be mapped to exact authority-sensitive actions.");
}

const md = `# T89 — AI Command Core Surface Authority Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of \`public/control-center/pages/ai-command.js\`.

## Why AI Command Is Critical
AI Command is the central command surface of MH-OS. It may execute AI commands, prepare prompts, route work to teams, create handoffs, create tasks, request approvals, surface governance decisions, and connect multiple operating surfaces.

Because T88 ranked AI Command as the highest remaining open risk, this page must be audited before any further UI improvement or smart-app finalization work.

## File Summary
- File: \`public/control-center/pages/ai-command.js\`
- Lines: ${findings.total_lines}
- Imports: ${findings.imports.length}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- AI execution signals: ${findings.ai_execution_signals.length}
- Backend/API signals: ${findings.backend_api_signals.length}
- Command send/submit signals: ${findings.command_send_signals.length}
- Approval/governance signals: ${findings.approval_signals.length}
- Handoff signals: ${findings.handoff_signals.length}
- Task signals: ${findings.task_signals.length}
- Save/storage/history signals: ${findings.save_storage_signals.length}
- Destructive/execution signals: ${findings.destructive_or_execution_signals.length}
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

## AI Execution Signals
${renderList(findings.ai_execution_signals)}

## Backend / API Signals
${renderList(findings.backend_api_signals)}

## Command Send / Submit Signals
${renderList(findings.command_send_signals)}

## Approval / Governance Signals
${renderList(findings.approval_signals)}

## Handoff Signals
${renderList(findings.handoff_signals)}

## Task Signals
${renderList(findings.task_signals)}

## Save / Storage / History Signals
${renderList(findings.save_storage_signals)}

## Destructive / Execution Signals
${renderList(findings.destructive_or_execution_signals)}

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
Before any patch, classify exact user-facing action paths into:

1. Prompt preparation only
2. AI backend execution
3. Local command history save
4. Backend command/history save
5. Approval request creation
6. Approval decision
7. Task creation
8. Handoff creation
9. Library/Content/Media/Publishing/Campaign routing
10. Governance escalation
11. Navigation only
12. Unknown / needs deeper inspection

## Decision Rule
- If AI execution can run without intentional operator action, patch.
- If backend mutation exists without confirmation or clear command intent, patch.
- If approval/task/handoff creation lacks confirmation, patch.
- If AI Command delegates to already-guarded surfaces only, document and close.
- Do not redesign AI Command in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T89_AI_COMMAND_CORE_AUTHORITY_AUDIT.md"),
  md
);

console.log("Generated audits/system-truth/t89-ai-command-core-authority/T89_AI_COMMAND_CORE_AUTHORITY_AUDIT.md");
console.log(`Lines: ${findings.total_lines}`);
console.log(`AI execution signals: ${findings.ai_execution_signals.length}`);
console.log(`Backend/API signals: ${findings.backend_api_signals.length}`);
console.log(`Confirmation signals: ${findings.confirmation_signals.length}`);
