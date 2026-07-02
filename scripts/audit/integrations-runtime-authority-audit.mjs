import fs from "fs";
import path from "path";

const root = process.cwd();
const filePath = path.join(root, "public/control-center/pages/integrations.js");
const outDir = path.join(root, "audits/system-truth/t123-integrations-runtime-authority");

const text = fs.readFileSync(filePath, "utf8");
const lines = text.split(/\r?\n/);

function find(pattern) {
  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
  return lines
    .map((line, index) => ({ line: index + 1, text: line }))
    .filter((entry) => regex.test(entry.text));
}

function renderList(items, limit = 320) {
  if (!items.length) return "- none";
  return items
    .slice(0, limit)
    .map((item) => `- L${item.line}: \`${item.text.trim().replaceAll("`", "\\`")}\``)
    .join("\n");
}

const findings = {
  file: "public/control-center/pages/integrations.js",
  total_lines: lines.length,

  imports: find(/^import\s/),
  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/),

  backend_api_signals: find(/fetchProject|createProject|saveProject|updateProject|deleteProject|integration|provider|connector|credential|sync|import|disconnect|reconnect|api/i),
  integration_mutation_signals: find(/connect|disconnect|reconnect|sync|import|refresh|save|update|delete|reset|rotate|credential|token|key|secret|provider|execute|run|trigger/i),
  credential_signals: find(/credential|token|api key|secret|access key|write key|oauth|client id|client secret|webhook|auth/i),
  governance_signals: find(/governance|approval|policy|required|pending|override|risk|permission|gate/i),
  provider_execution_signals: find(/provider|connector|sync|import|refresh|reconnect|disconnect|webhook|woocommerce|shopify|google|meta|facebook|tiktok|mailchimp|stripe|paypal/i),
  handoff_signals: find(/handoff|setSharedHandoff|getSharedHandoff|setSharedAiDraft|destination_page|route_target/i),
  ai_signals: find(/AI|ai-command|prompt|assistant|generate|guidance|recommendation/i),
  confirmation_signals: find(/confirm\(/),
  local_storage_signals: find(/localStorage|sessionStorage|setItem|getItem|draft|cache|persist/i),
  navigation_signals: find(/navigateTo|location\.hash|data-route|route/i),
  disabled_or_readonly_signals: find(/disabled|read-only|readonly|locked|future|preview|draft|not configured|requires|guard|blocked|approval required/i),
  risky_terms: find(/integration|provider|connector|credential|token|key|secret|connect|disconnect|reconnect|sync|import|refresh|webhook|approval|governance|permission|execute|run|AI|handoff/i)
};

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "integrations-runtime-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

const riskNotes = [];

if (findings.integration_mutation_signals.length) {
  riskNotes.push("Integrations contains connector mutation signals. Exact connect/disconnect/reconnect/sync/import paths must be classified.");
}

if (findings.credential_signals.length) {
  riskNotes.push("Integrations contains credential/token/API-key signals. Need verify credentials are never exposed or silently changed.");
}

if (findings.governance_signals.length) {
  riskNotes.push("Integrations contains Governance/approval signals. Need verify protected connector actions route through approval lifecycle.");
}

if (findings.confirmation_signals.length) {
  riskNotes.push("Confirmation dialogs exist and must be mapped to authority-sensitive connector actions.");
} else {
  riskNotes.push("No confirmation dialogs found. This is high risk if connector mutations exist.");
}

const md = `# T123 — Integrations Runtime Authority Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of \`public/control-center/pages/integrations.js\`.

## Why Integrations Is Next
After Campaign Studio was closed, Integrations is the next high-risk active surface from the remaining T88 ranking.

Integrations may contain provider credentials, connector reconnect/disconnect, sync/import actions, webhooks, approval-required flows, and provider execution gates.

## File Summary
- File: \`public/control-center/pages/integrations.js\`
- Lines: ${findings.total_lines}
- Imports: ${findings.imports.length}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- Backend/API signals: ${findings.backend_api_signals.length}
- Integration mutation signals: ${findings.integration_mutation_signals.length}
- Credential signals: ${findings.credential_signals.length}
- Governance/approval signals: ${findings.governance_signals.length}
- Provider execution signals: ${findings.provider_execution_signals.length}
- Handoff signals: ${findings.handoff_signals.length}
- AI signals: ${findings.ai_signals.length}
- Confirmation signals: ${findings.confirmation_signals.length}
- Local/session storage signals: ${findings.local_storage_signals.length}
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

## Integration Mutation Signals
${renderList(findings.integration_mutation_signals)}

## Credential Signals
${renderList(findings.credential_signals)}

## Governance / Approval Signals
${renderList(findings.governance_signals)}

## Provider Execution Signals
${renderList(findings.provider_execution_signals)}

## Handoff Signals
${renderList(findings.handoff_signals)}

## AI Signals
${renderList(findings.ai_signals)}

## Confirmation Signals
${renderList(findings.confirmation_signals)}

## Local / Session Storage Signals
${renderList(findings.local_storage_signals)}

## Navigation Signals
${renderList(findings.navigation_signals)}

## Disabled / Read-only / Draft / Guard Signals
${renderList(findings.disabled_or_readonly_signals)}

## Risky Terms
${renderList(findings.risky_terms)}

## Required Manual Classification
Before any patch, classify exact Integrations paths into:

1. Integration display/read-only
2. Credential display / masked only
3. Credential save/update
4. Provider connect/reconnect
5. Provider disconnect
6. Provider sync/refresh/import
7. Webhook/test action
8. Approval-required connector action
9. AI prompt/guidance only
10. Shared handoff only
11. Disabled future action
12. Unknown / needs deeper inspection

## Decision Rule
- If credential save/update exists without confirmation, patch.
- If reconnect/disconnect/sync/import exists without confirmation or approval gate, patch.
- If protected provider actions bypass Governance approval lifecycle, patch.
- If credentials/tokens are exposed in UI or logs, patch.
- If AI guidance is prompt/navigation only, document and close.
- If actions are read-only/local/shared-context only, document and close.
- Do not redesign Integrations in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T123_INTEGRATIONS_RUNTIME_AUTHORITY_AUDIT.md"),
  md
);

console.log("Generated T123 Integrations authority audit");
console.log(`Lines: ${findings.total_lines}`);
console.log(`Integration mutation signals: ${findings.integration_mutation_signals.length}`);
console.log(`Credential signals: ${findings.credential_signals.length}`);
console.log(`Confirmation signals: ${findings.confirmation_signals.length}`);
