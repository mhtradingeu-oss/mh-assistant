import fs from "fs";
import path from "path";

const root = process.cwd();
const filePath = path.join(root, "public/control-center/pages/workflows.js");
const outDir = path.join(root, "audits/system-truth/t112-workflows-runtime-authority");

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
  file: "public/control-center/pages/workflows.js",
  total_lines: lines.length,

  imports: find(/^import\s/),
  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/),

  backend_api_signals: find(/fetchProject|createProject|saveProject|updateProject|deleteProject|executeProject|runProject|workflow|automation|task|job|handoff|approval|api/i),
  workflow_execution_signals: find(/workflow|automation|execute|run|trigger|start|stop|retry|rerun|schedule|approve|publish|send|dispatch|worker/i),
  mutation_signals: find(/create|update|delete|archive|save|submit|resolve|complete|assign|sync|import|execute|run|trigger|start|stop|retry|rerun|approve|reject/i),
  handoff_signals: find(/handoff|setSharedHandoff|getSharedHandoff|destination_page|route_target|send to|route to/i),
  ai_signals: find(/AI|ai-command|prompt|assistant|generate|guidance|recommendation/i),
  confirmation_signals: find(/confirm\(/),
  access_key_signals: find(/access key|MH_CONTROL_CENTER_WRITE_KEY|isAccessKeyFailure|write key|credential|token/i),
  save_storage_signals: find(/save|saved|persist|localStorage|sessionStorage|setItem|getItem|draft|cache|record|write/i),
  navigation_signals: find(/navigateTo|location\.hash|data-route|route/i),
  disabled_or_readonly_signals: find(/disabled|read-only|readonly|locked|future|preview|draft|not configured|requires|guard|blocked/i),
  risky_terms: find(/workflow|automation|execute|run|trigger|schedule|worker|handoff|task|job|approval|publish|send|delete|archive|retry|rerun|credential|token|access key|AI|prompt/i)
};

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "workflows-runtime-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

const riskNotes = [];

if (findings.workflow_execution_signals.length) {
  riskNotes.push("Workflows contains workflow/execution/automation signals. Exact runtime actions must be classified.");
}

if (findings.backend_api_signals.length) {
  riskNotes.push("Workflows contains backend/API-like signals. Need separate read-only planning from durable workflow/job/task mutations.");
}

if (findings.confirmation_signals.length) {
  riskNotes.push("Confirmation dialogs exist and must be mapped to exact authority-sensitive actions.");
} else {
  riskNotes.push("No confirmation dialogs found. This is high risk if workflow execution or backend mutation paths exist.");
}

const md = `# T112 — Workflows Runtime Authority Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of \`public/control-center/pages/workflows.js\`.

## Why Workflows Is Next
After Operations Centers was closed, Workflows is the next high-risk active surface from the remaining T88 ranking.

Workflows may contain workflow planning, automation, job/task routing, execution-like language, handoffs, AI recommendations, and possible backend mutations.

## File Summary
- File: \`public/control-center/pages/workflows.js\`
- Lines: ${findings.total_lines}
- Imports: ${findings.imports.length}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- Backend/API signals: ${findings.backend_api_signals.length}
- Workflow/execution signals: ${findings.workflow_execution_signals.length}
- Mutation signals: ${findings.mutation_signals.length}
- Handoff signals: ${findings.handoff_signals.length}
- AI signals: ${findings.ai_signals.length}
- Confirmation signals: ${findings.confirmation_signals.length}
- Access-key/credential signals: ${findings.access_key_signals.length}
- Save/storage signals: ${findings.save_storage_signals.length}
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

## Workflow / Execution Signals
${renderList(findings.workflow_execution_signals)}

## Mutation Signals
${renderList(findings.mutation_signals)}

## Handoff Signals
${renderList(findings.handoff_signals)}

## AI Signals
${renderList(findings.ai_signals)}

## Confirmation Signals
${renderList(findings.confirmation_signals)}

## Access-Key / Credential Signals
${renderList(findings.access_key_signals)}

## Save / Storage Signals
${renderList(findings.save_storage_signals)}

## Navigation Signals
${renderList(findings.navigation_signals)}

## Disabled / Read-only / Draft / Guard Signals
${renderList(findings.disabled_or_readonly_signals)}

## Risky Terms
${renderList(findings.risky_terms)}

## Required Manual Classification
Before any patch, classify exact Workflows paths into:

1. Workflow dashboard/display only
2. Workflow planning/local draft only
3. Workflow template/step selection only
4. AI prompt/guidance only
5. Shared handoff only
6. Backend workflow creation/update
7. Backend workflow execution/run/trigger
8. Backend job/task mutation
9. Schedule/retry/rerun action
10. Disabled future action
11. Unknown / needs deeper inspection

## Decision Rule
- If execute/run/trigger/schedule/retry/rerun mutates backend without confirmation, patch.
- If create/update/delete workflow mutations exist without confirmation, patch.
- If AI guidance is prompt/navigation only, document and close.
- If workflow actions are planning/local/session/shared-context only, document and close.
- Do not redesign Workflows in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T112_WORKFLOWS_RUNTIME_AUTHORITY_AUDIT.md"),
  md
);

console.log("Generated T112 Workflows authority audit");
console.log(`Lines: ${findings.total_lines}`);
console.log(`Workflow/execution signals: ${findings.workflow_execution_signals.length}`);
console.log(`Mutation signals: ${findings.mutation_signals.length}`);
console.log(`Confirmation signals: ${findings.confirmation_signals.length}`);
