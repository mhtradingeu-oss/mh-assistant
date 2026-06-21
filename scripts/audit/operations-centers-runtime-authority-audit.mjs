import fs from "fs";
import path from "path";

const root = process.cwd();
const filePath = path.join(root, "public/control-center/pages/operations-centers.js");
const outDir = path.join(root, "audits/system-truth/t108-operations-centers-runtime-authority");

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
  file: "public/control-center/pages/operations-centers.js",
  total_lines: lines.length,

  imports: find(/^import\s/),
  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/),

  backend_api_signals: find(/fetchProject|createProject|saveProject|updateProject|deleteProject|executeProject|sync|import|notification|customer|operation|session|task|handoff|approval|api/i),
  operations_signals: find(/operation|operations|customer|notification|support|session|workflow|task|ticket|message|inbox|center|queue/i),
  execution_mutation_signals: find(/execute|run|send|sync|import|create|update|delete|archive|resolve|complete|submit|trigger|start|stop|retry|approve|reject|assign/i),
  handoff_signals: find(/handoff|setSharedHandoff|getSharedHandoff|destination_page|route_target|send to|route to/i),
  ai_signals: find(/AI|ai-command|prompt|assistant|generate|guidance|recommendation/i),
  confirmation_signals: find(/confirm\(/),
  access_key_signals: find(/access key|MH_CONTROL_CENTER_WRITE_KEY|isAccessKeyFailure|write key|credential|token/i),
  save_storage_signals: find(/save|saved|persist|localStorage|sessionStorage|setItem|getItem|draft|cache|record|write/i),
  navigation_signals: find(/navigateTo|location\.hash|data-route|route/i),
  disabled_or_readonly_signals: find(/disabled|read-only|readonly|locked|future|preview|draft|not configured|requires|guard|blocked/i),
  risky_terms: find(/execute|run|send|sync|import|customer|notification|operation|workflow|task|handoff|approval|delete|archive|resolve|complete|retry|credential|token|access key|AI|prompt/i)
};

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "operations-centers-runtime-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

const riskNotes = [];

if (findings.operations_signals.length) {
  riskNotes.push("Operations Centers contains customer/notification/operation/session signals. Exact runtime actions must be classified.");
}

if (findings.backend_api_signals.length) {
  riskNotes.push("Operations Centers contains backend/API-like signals. Need separate read-only dashboards from durable operations mutations.");
}

if (findings.execution_mutation_signals.length) {
  riskNotes.push("Operations Centers contains execution/mutation terms. Need verify whether actions only prepare local/session drafts or mutate backend state.");
}

if (findings.confirmation_signals.length) {
  riskNotes.push("Confirmation dialogs exist and must be mapped to authority-sensitive operations.");
} else {
  riskNotes.push("No confirmation dialogs found. This is high risk if backend mutation or execution paths exist.");
}

const md = `# T108 — Operations Centers Runtime Authority Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of \`public/control-center/pages/operations-centers.js\`.

## Why Operations Centers Is Next
After Governance was closed, Operations Centers is the next high-risk active surface from the remaining T88 ranking.

Operations Centers may contain customer operations, notification operations, sessions, workflows, queues, support actions, AI recommendations, and cross-page handoffs.

## File Summary
- File: \`public/control-center/pages/operations-centers.js\`
- Lines: ${findings.total_lines}
- Imports: ${findings.imports.length}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- Backend/API signals: ${findings.backend_api_signals.length}
- Operations/customer/notification signals: ${findings.operations_signals.length}
- Execution/mutation signals: ${findings.execution_mutation_signals.length}
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

## Operations / Customer / Notification Signals
${renderList(findings.operations_signals)}

## Execution / Mutation Signals
${renderList(findings.execution_mutation_signals)}

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
Before any patch, classify exact Operations Centers paths into:

1. Dashboard display only
2. Customer operations session local state
3. Notification operations local state
4. Backend customer operation mutation
5. Backend notification/task/workflow mutation
6. AI prompt/guidance only
7. Shared handoff only
8. Send/execute/sync/import action
9. Archive/delete/resolve/complete action
10. Local/session storage only
11. Unknown / needs deeper inspection

## Decision Rule
- If send/execute/sync/import/resolve/complete/archive/delete paths mutate backend without confirmation, patch.
- If actions are local session/draft/shared-context only, document and close.
- If AI guidance is prompt/navigation only, document and close.
- If backend authority exists, verify frontend messaging does not overclaim.
- Do not redesign Operations Centers in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T108_OPERATIONS_CENTERS_RUNTIME_AUTHORITY_AUDIT.md"),
  md
);

console.log("Generated T108 Operations Centers authority audit");
console.log(`Lines: ${findings.total_lines}`);
console.log(`Backend/API signals: ${findings.backend_api_signals.length}`);
console.log(`Execution/mutation signals: ${findings.execution_mutation_signals.length}`);
console.log(`Confirmation signals: ${findings.confirmation_signals.length}`);
