import fs from "fs";
import path from "path";

const root = process.cwd();
const filePath = path.join(root, "public/control-center/pages/campaign-studio.js");
const outDir = path.join(root, "audits/system-truth/t119-campaign-studio-runtime-authority");

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
  file: "public/control-center/pages/campaign-studio.js",
  total_lines: lines.length,

  imports: find(/^import\s/),
  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/),

  backend_api_signals: find(/fetchProject|createProject|saveProject|updateProject|deleteProject|campaign|task|workflow|handoff|approval|publishing|api/i),
  campaign_mutation_signals: find(/create|update|delete|archive|save|submit|approve|reject|publish|queue|schedule|launch|send|sync|import|execute|run|trigger|start|stop|retry|complete|resolve/i),
  publishing_authority_signals: find(/publish|publishing|queue|schedule|approval|governance|claim|brand safety|ready|blocked|launch/i),
  handoff_signals: find(/handoff|setSharedHandoff|getSharedHandoff|setSharedAiDraft|destination_page|route_target|send to|route to/i),
  ai_signals: find(/AI|ai-command|prompt|assistant|generate|guidance|recommendation/i),
  confirmation_signals: find(/confirm\(/),
  local_storage_signals: find(/localStorage|sessionStorage|setItem|getItem|draft|cache|persist/i),
  navigation_signals: find(/navigateTo|location\.hash|data-route|route/i),
  disabled_or_readonly_signals: find(/disabled|read-only|readonly|locked|future|preview|draft|not configured|requires|guard|blocked/i),
  risky_terms: find(/campaign|publish|queue|schedule|launch|send|approval|governance|handoff|workflow|task|execute|run|trigger|delete|archive|AI|prompt/i)
};

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "campaign-studio-runtime-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

const riskNotes = [];

if (findings.campaign_mutation_signals.length) {
  riskNotes.push("Campaign Studio contains campaign mutation or execution-like signals. Exact runtime actions must be classified.");
}

if (findings.publishing_authority_signals.length) {
  riskNotes.push("Campaign Studio contains publishing/approval/governance signals. Need verify no publishing authority is bypassed.");
}

if (findings.handoff_signals.length) {
  riskNotes.push("Campaign Studio contains handoff signals. Need classify local/shared handoffs versus durable backend handoffs.");
}

if (findings.confirmation_signals.length) {
  riskNotes.push("Confirmation dialogs exist and must be mapped to authority-sensitive campaign actions.");
} else {
  riskNotes.push("No confirmation dialogs found. This is high risk if durable campaign/publishing mutations exist.");
}

const md = `# T119 — Campaign Studio Runtime Authority Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of \`public/control-center/pages/campaign-studio.js\`.

## Why Campaign Studio Is Next
After Settings was closed, Campaign Studio is the next high-risk active surface from the remaining T88 ranking.

Campaign Studio may contain campaign planning, publishing readiness, task/workflow routing, AI prompt generation, content/media handoffs, and possible durable campaign updates.

## File Summary
- File: \`public/control-center/pages/campaign-studio.js\`
- Lines: ${findings.total_lines}
- Imports: ${findings.imports.length}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- Backend/API signals: ${findings.backend_api_signals.length}
- Campaign mutation signals: ${findings.campaign_mutation_signals.length}
- Publishing/approval/governance signals: ${findings.publishing_authority_signals.length}
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

## Campaign Mutation Signals
${renderList(findings.campaign_mutation_signals)}

## Publishing / Approval / Governance Signals
${renderList(findings.publishing_authority_signals)}

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
Before any patch, classify exact Campaign Studio paths into:

1. Campaign display/read-only
2. Local/session draft only
3. Durable campaign save/update
4. Campaign-to-content/media/publishing handoff
5. Durable backend handoff creation
6. AI prompt/guidance only
7. Task/workflow creation or routing
8. Publishing queue/schedule/launch action
9. Approval/governance decision or bypass risk
10. Disabled future action
11. Unknown / needs deeper inspection

## Decision Rule
- If durable campaign save/update exists without confirmation, patch.
- If publishing queue/schedule/launch exists, it must route to Publishing/Governance authority or be confirmation-gated.
- If durable handoff/task/workflow creation exists without confirmation, patch.
- If AI guidance is prompt/navigation only, document and close.
- If actions are local/session/shared-context only, document and close.
- Do not redesign Campaign Studio in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T119_CAMPAIGN_STUDIO_RUNTIME_AUTHORITY_AUDIT.md"),
  md
);

console.log("Generated T119 Campaign Studio authority audit");
console.log(`Lines: ${findings.total_lines}`);
console.log(`Campaign mutation signals: ${findings.campaign_mutation_signals.length}`);
console.log(`Publishing authority signals: ${findings.publishing_authority_signals.length}`);
console.log(`Confirmation signals: ${findings.confirmation_signals.length}`);
