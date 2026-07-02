import fs from "fs";
import path from "path";

const root = process.cwd();
const filePath = path.join(root, "public/control-center/pages/governance.js");
const outDir = path.join(root, "audits/system-truth/t104-governance-runtime-authority");

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
  file: "public/control-center/pages/governance.js",
  total_lines: lines.length,

  imports: find(/^import\s/),
  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/),

  backend_api_signals: find(/fetchProject|createProject|saveProject|updateProject|deleteProject|decideProject|approval|governance|policy|risk|source|handoff|task|api/i),
  approval_decision_signals: find(/approval|approve|approved|reject|rejected|decision|decide|pending|needs approval|governance|review/i),
  mutation_signals: find(/approve|reject|decide|update|save|delete|archive|resolve|submit|create|send|sync|import|execute/i),
  handoff_signals: find(/handoff|setSharedHandoff|getSharedHandoff|destination_page|route_target|send to|route to/i),
  source_evidence_signals: find(/source|evidence|proof|claim|document|library|reference|attachment|audit trail/i),
  confirmation_signals: find(/confirm\(/),
  access_key_signals: find(/access key|MH_CONTROL_CENTER_WRITE_KEY|isAccessKeyFailure|write key|credential|token/i),
  save_storage_signals: find(/save|saved|persist|localStorage|sessionStorage|setItem|getItem|draft|cache|record|write/i),
  navigation_signals: find(/navigateTo|location\.hash|data-route|route/i),
  disabled_or_readonly_signals: find(/disabled|read-only|readonly|locked|future|preview|draft|not configured|requires|guard|blocked/i),
  risky_terms: find(/approve|reject|decision|governance|approval|risk|policy|source|evidence|claim|publish|send|execute|save|delete|archive|handoff|task|credential|token|access key/i)
};

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "governance-runtime-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

const riskNotes = [];

if (findings.approval_decision_signals.length) {
  riskNotes.push("Governance contains approval/decision signals. Exact approve/reject/decision paths must be classified.");
}

if (findings.backend_api_signals.length) {
  riskNotes.push("Governance contains backend/API-like signals. Need separate read-only queue hydration from durable governance decisions.");
}

if (findings.source_evidence_signals.length) {
  riskNotes.push("Governance contains source/evidence/proof signals. Need verify evidence intake is stored safely and not treated as approval by itself.");
}

if (findings.confirmation_signals.length) {
  riskNotes.push("Confirmation dialogs exist and must be mapped to exact approval-sensitive actions.");
} else {
  riskNotes.push("No confirmation dialogs found. This is high risk if approval/rejection/backend decision paths exist.");
}

const md = `# T104 — Governance Runtime Authority Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of \`public/control-center/pages/governance.js\`.

## Why Governance Is Next
After Publishing was closed, Governance is the next high-risk active surface from the remaining T88 ranking.

Governance is a critical authority surface because it may approve, reject, decide, resolve, or mutate approval records and source-evidence state.

## File Summary
- File: \`public/control-center/pages/governance.js\`
- Lines: ${findings.total_lines}
- Imports: ${findings.imports.length}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- Backend/API signals: ${findings.backend_api_signals.length}
- Approval/decision signals: ${findings.approval_decision_signals.length}
- Mutation signals: ${findings.mutation_signals.length}
- Handoff signals: ${findings.handoff_signals.length}
- Source/evidence signals: ${findings.source_evidence_signals.length}
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

## Approval / Decision Signals
${renderList(findings.approval_decision_signals)}

## Mutation Signals
${renderList(findings.mutation_signals)}

## Handoff Signals
${renderList(findings.handoff_signals)}

## Source / Evidence Signals
${renderList(findings.source_evidence_signals)}

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
Before any patch, classify exact Governance paths into:

1. Governance queue display only
2. Approval detail/review only
3. Source/evidence intake
4. Save evidence/source note
5. Approve decision
6. Reject decision
7. Resolve/close governance item
8. Request more evidence
9. Handoff to Library/AI/Publishing/Workflows
10. Local state/cache only
11. Backend approval mutation
12. Unknown / needs deeper inspection

## Decision Rule
- If approve/reject/resolve decisions mutate backend without confirmation, patch.
- If source/evidence intake creates durable records without confirmation or clear status messaging, patch.
- If actions are read-only, local-only, or shared context only, document and close.
- If Governance delegates decision authority to backend APIs, verify frontend messages do not overclaim.
- Do not redesign Governance in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T104_GOVERNANCE_RUNTIME_AUTHORITY_AUDIT.md"),
  md
);

console.log("Generated T104 Governance authority audit");
console.log(`Lines: ${findings.total_lines}`);
console.log(`Backend/API signals: ${findings.backend_api_signals.length}`);
console.log(`Approval/decision signals: ${findings.approval_decision_signals.length}`);
console.log(`Confirmation signals: ${findings.confirmation_signals.length}`);
