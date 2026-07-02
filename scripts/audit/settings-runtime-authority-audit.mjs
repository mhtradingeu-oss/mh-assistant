import fs from "fs";
import path from "path";

const root = process.cwd();
const filePath = path.join(root, "public/control-center/pages/settings.js");
const outDir = path.join(root, "audits/system-truth/t116-settings-runtime-authority");

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
  file: "public/control-center/pages/settings.js",
  total_lines: lines.length,

  imports: find(/^import\s/),
  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/),

  backend_api_signals: find(/fetchProject|createProject|saveProject|updateProject|deleteProject|settings|governance|policy|integration|credential|api/i),
  settings_mutation_signals: find(/save|update|sync|reset|clear|delete|create|submit|apply|persist|write|token|credential|key|policy|governance/i),
  governance_policy_signals: find(/governance|policy|approval|publish|brand safety|claim|override|freeze|risk/i),
  integration_credential_signals: find(/integration|provider|credential|token|api key|secret|access key|write key|connect|disconnect/i),
  ai_signals: find(/AI|ai-command|prompt|assistant|generate|guidance|recommendation/i),
  handoff_signals: find(/handoff|setSharedHandoff|getSharedHandoff|setSharedAiDraft|destination_page|route_target/i),
  confirmation_signals: find(/confirm\(/),
  local_storage_signals: find(/localStorage|sessionStorage|setItem|getItem|draft|cache|persist/i),
  navigation_signals: find(/navigateTo|location\.hash|data-route|route/i),
  disabled_or_readonly_signals: find(/disabled|read-only|readonly|locked|future|preview|draft|not configured|requires|guard|blocked/i),
  risky_terms: find(/settings|save|update|sync|reset|delete|credential|token|key|secret|provider|integration|governance|policy|approval|publish|override|freeze|AI|handoff/i)
};

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "settings-runtime-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

const riskNotes = [];

if (findings.settings_mutation_signals.length) {
  riskNotes.push("Settings contains save/update/sync/policy/credential signals. Exact durable mutation paths must be classified.");
}

if (findings.governance_policy_signals.length) {
  riskNotes.push("Settings may influence Governance/policy behavior. Need verify whether policy sync is local, settings-only, or routed through Governance authority.");
}

if (findings.integration_credential_signals.length) {
  riskNotes.push("Settings may reference integrations or credentials. Need confirm no credential mutation happens silently.");
}

if (findings.confirmation_signals.length) {
  riskNotes.push("Confirmation dialogs exist and must be mapped to authority-sensitive settings actions.");
} else {
  riskNotes.push("No confirmation dialogs found. This is high risk if durable Settings/Governance/credential mutations exist.");
}

const md = `# T116 — Settings Runtime Authority Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of \`public/control-center/pages/settings.js\`.

## Why Settings Is Next
After Workflows was closed, Settings is the next high-risk active surface from the remaining T88 ranking.

Settings may influence project configuration, governance policy, integrations, credentials, AI behavior, publishing readiness, and operational defaults.

## File Summary
- File: \`public/control-center/pages/settings.js\`
- Lines: ${findings.total_lines}
- Imports: ${findings.imports.length}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- Backend/API signals: ${findings.backend_api_signals.length}
- Settings mutation signals: ${findings.settings_mutation_signals.length}
- Governance/policy signals: ${findings.governance_policy_signals.length}
- Integration/credential signals: ${findings.integration_credential_signals.length}
- AI signals: ${findings.ai_signals.length}
- Handoff signals: ${findings.handoff_signals.length}
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

## Settings Mutation Signals
${renderList(findings.settings_mutation_signals)}

## Governance / Policy Signals
${renderList(findings.governance_policy_signals)}

## Integration / Credential Signals
${renderList(findings.integration_credential_signals)}

## AI Signals
${renderList(findings.ai_signals)}

## Handoff Signals
${renderList(findings.handoff_signals)}

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
Before any patch, classify exact Settings paths into:

1. Settings display/read-only
2. Local/session draft only
3. Durable Settings save/update
4. Governance policy sync/update
5. Integration/credential update
6. AI prompt/guidance only
7. Shared handoff only
8. Reset/delete/clear action
9. Navigation-only action
10. Disabled future action
11. Unknown / needs deeper inspection

## Decision Rule
- If durable settings/policy/credential mutations exist without confirmation, patch.
- If Governance policy sync exists, confirm it is explicit and does not bypass Governance authority.
- If credential/token/API-key mutation exists, require explicit confirmation and safe messaging.
- If AI guidance is prompt/navigation only, document and close.
- If actions are local/session/shared-context only, document and close.
- Do not redesign Settings in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T116_SETTINGS_RUNTIME_AUTHORITY_AUDIT.md"),
  md
);

console.log("Generated T116 Settings authority audit");
console.log(`Lines: ${findings.total_lines}`);
console.log(`Settings mutation signals: ${findings.settings_mutation_signals.length}`);
console.log(`Governance/policy signals: ${findings.governance_policy_signals.length}`);
console.log(`Confirmation signals: ${findings.confirmation_signals.length}`);
