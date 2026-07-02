import fs from "fs";
import path from "path";

const root = process.cwd();
const filePath = path.join(root, "public/control-center/pages/publishing.js");
const outDir = path.join(root, "audits/system-truth/t100-publishing-runtime-authority");

const text = fs.readFileSync(filePath, "utf8");
const lines = text.split(/\r?\n/);

function find(pattern) {
  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
  return lines
    .map((line, index) => ({ line: index + 1, text: line }))
    .filter((entry) => regex.test(entry.text));
}

function renderList(items, limit = 280) {
  if (!items.length) return "- none";
  return items
    .slice(0, limit)
    .map((item) => `- L${item.line}: \`${item.text.trim().replaceAll("`", "\\`")}\``)
    .join("\n");
}

const findings = {
  file: "public/control-center/pages/publishing.js",
  total_lines: lines.length,

  imports: find(/^import\s/),
  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/),

  backend_api_signals: find(/fetchProject|createProject|saveProject|updateProject|deleteProject|executeProject|listProject|publish|schedule|channel|approval|handoff|task|api|sync|import/i),
  publish_schedule_signals: find(/publish|publishing|schedule|scheduled|channel|post|caption|payload|go live|release|calendar/i),
  approval_governance_signals: find(/approval|approve|approved|review|needs_review|reject|governance|risk|claim|compliance/i),
  handoff_signals: find(/handoff|setSharedHandoff|getSharedHandoff|destination_page|route_target|send to|route to/i),
  save_storage_signals: find(/save|saved|persist|localStorage|sessionStorage|setItem|getItem|draft|cache|record|write/i),
  destructive_or_execution_signals: find(/delete|archive|execute|publish|send|sync|import|submit|run|dispatch|trigger|start|generate|approve|reject|schedule/i),
  confirmation_signals: find(/confirm\(/),
  access_key_signals: find(/access key|MH_CONTROL_CENTER_WRITE_KEY|isAccessKeyFailure|write key|credential|token/i),
  navigation_signals: find(/navigateTo|location\.hash|data-route|route/i),
  disabled_or_readonly_signals: find(/disabled|read-only|readonly|locked|future|preview|draft|not configured|requires|guard|blocked/i),
  risky_terms: find(/publish|approve|send|execute|generate|provider|save|task|handoff|library|approval|delete|archive|sync|import|credential|token|access key|review|source|schedule|channel|governance/i)
};

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "publishing-runtime-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

const riskNotes = [];

if (findings.publish_schedule_signals.length) {
  riskNotes.push("Publishing contains publish/schedule/channel/payload signals. Exact action paths must separate preview/draft from live publishing or scheduling.");
}

if (findings.backend_api_signals.length) {
  riskNotes.push("Publishing contains backend/API-like signals. Need classify durable mutations, approvals, handoffs, and external channel actions.");
}

if (findings.approval_governance_signals.length) {
  riskNotes.push("Publishing contains approval/governance signals. Need verify publish/schedule actions are gated by review/approval state.");
}

if (findings.confirmation_signals.length) {
  riskNotes.push("Confirmation dialogs exist and must be mapped to exact authority-sensitive actions.");
} else {
  riskNotes.push("No confirmation dialogs found. This is high risk if publishing/scheduling/backend mutations exist.");
}

const md = `# T100 — Publishing Runtime Authority Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of \`public/control-center/pages/publishing.js\`.

## Why Publishing Is Next
After AI Command, Tool Dock, and Library were closed, T88 ranks Publishing as the next high-risk active surface.

Publishing is a critical authority surface because it may prepare channel payloads, schedules, approval packages, publishing drafts, or external release actions.

## File Summary
- File: \`public/control-center/pages/publishing.js\`
- Lines: ${findings.total_lines}
- Imports: ${findings.imports.length}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- Backend/API signals: ${findings.backend_api_signals.length}
- Publish/schedule/channel signals: ${findings.publish_schedule_signals.length}
- Approval/governance signals: ${findings.approval_governance_signals.length}
- Handoff signals: ${findings.handoff_signals.length}
- Save/storage signals: ${findings.save_storage_signals.length}
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

## Backend / API Signals
${renderList(findings.backend_api_signals)}

## Publish / Schedule / Channel Signals
${renderList(findings.publish_schedule_signals)}

## Approval / Governance Signals
${renderList(findings.approval_governance_signals)}

## Handoff Signals
${renderList(findings.handoff_signals)}

## Save / Storage Signals
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
Before any patch, classify exact user-facing Publishing paths into:

1. Publishing dashboard display only
2. Payload/package preview only
3. Schedule draft only
4. Save publishing draft
5. Create or update durable publishing record
6. Request approval / governance review
7. Approve/reject publishing item
8. Send/publish/go-live action
9. Channel/integration sync
10. Handoff to Content/Media/Governance/Workflows
11. Local state/cache only
12. Unknown / needs deeper inspection

## Decision Rule
- If live publish/send/schedule exists without confirmation and approval guard, patch.
- If durable publishing record changes exist without confirmation, patch.
- If actions are preview/draft/local only, document and close.
- If Publishing delegates authority to backend/governance APIs, verify the frontend messaging does not claim execution beyond what occurred.
- Do not redesign Publishing in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T100_PUBLISHING_RUNTIME_AUTHORITY_AUDIT.md"),
  md
);

console.log("Generated T100 Publishing authority audit");
console.log(`Lines: ${findings.total_lines}`);
console.log(`Backend/API signals: ${findings.backend_api_signals.length}`);
console.log(`Publish/schedule signals: ${findings.publish_schedule_signals.length}`);
console.log(`Confirmation signals: ${findings.confirmation_signals.length}`);
