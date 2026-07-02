import fs from "fs";
import path from "path";

const root = process.cwd();
const filePath = path.join(root, "public/control-center/pages/customer-center.js");
const outDir = path.join(root, "audits/system-truth/t67-customer-center-runtime-authority");

const text = fs.readFileSync(filePath, "utf8");
const lines = text.split(/\r?\n/);

function find(pattern) {
  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
  return lines
    .map((line, index) => ({ line: index + 1, text: line }))
    .filter((entry) => regex.test(entry.text));
}

function renderList(items, limit = 160) {
  if (!items.length) return "- none";
  return items
    .slice(0, limit)
    .map((item) => `- L${item.line}: \`${item.text.trim().replaceAll("`", "\\`")}\``)
    .join("\n");
}

const findings = {
  file: "public/control-center/pages/customer-center.js",
  total_lines: lines.length,

  imports: find(/^import\s/),
  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/),
  backend_api_signals: find(/fetch|api\.|context\.|customer|conversation|ticket|inbox|message|reply|send|status|sla|handoff|queue/i),
  write_signals: find(/POST|PUT|PATCH|DELETE|create|update|delete|save|send|reply|assign|resolve|close|reopen|escalate|handoff|execute|approve|publish|sync|import/i),
  confirmation_signals: find(/confirm\(/),
  storage_signals: find(/localStorage|sessionStorage/),
  navigation_signals: find(/navigateTo|location\.hash|data-route|route/i),
  disabled_or_readonly_signals: find(/disabled|read-only|readonly|protected|future|coming soon|not available|preview/i),
  ai_signals: find(/AI|ai|assistant|prompt|suggest|guidance|handoff/i),
  risky_terms: find(/send|reply|message|ticket|assign|resolve|close|reopen|escalate|sla|customer|conversation|email|whatsapp|telegram|publish|approve|execute|delete|archive/i)
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "customer-center-runtime-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

const riskNotes = [];

if (findings.write_signals.length) {
  riskNotes.push("Customer Center contains write-like/customer-operation terms. These must be classified as read-only projection, disabled future actions, AI handoff, or backend mutation.");
} else {
  riskNotes.push("No write-like signals found.");
}

if (findings.confirmation_signals.length === 0) {
  riskNotes.push("No confirmation dialogs found. This is acceptable only if no customer send/reply/resolve/assign action is active.");
}

if (findings.disabled_or_readonly_signals.length) {
  riskNotes.push("Read-only/disabled/protected/future copy exists and should be checked against actual handlers.");
}

const md = `# T67 — Customer Center Runtime Authority Focused Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of \`public/control-center/pages/customer-center.js\`.

## Why Customer Center Is Next
T61 ranked Customer Center after Home and Setup among remaining open frontend files. Customer Center may involve customer messages, tickets, inbox, replies, handoffs, SLA, and support operations, so it must be classified before any patch.

## File Summary
- File: \`public/control-center/pages/customer-center.js\`
- Lines: ${findings.total_lines}
- Imports: ${findings.imports.length}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- Backend/API/customer signals: ${findings.backend_api_signals.length}
- Write-like signals: ${findings.write_signals.length}
- Confirmation signals: ${findings.confirmation_signals.length}
- Storage signals: ${findings.storage_signals.length}
- Navigation signals: ${findings.navigation_signals.length}
- Disabled/read-only/future signals: ${findings.disabled_or_readonly_signals.length}
- AI/handoff signals: ${findings.ai_signals.length}
- Risky terms: ${findings.risky_terms.length}

## Initial Risk Notes
${riskNotes.map((note) => `- ${note}`).join("\n")}

## Imports
${renderList(findings.imports)}

## Render Writes
${renderList(findings.render_writes)}

## Event Bindings
${renderList(findings.event_bindings)}

## Backend / API / Customer Signals
${renderList(findings.backend_api_signals)}

## Write-like Signals
${renderList(findings.write_signals)}

## Confirmation Signals
${renderList(findings.confirmation_signals)}

## Storage Signals
${renderList(findings.storage_signals)}

## Navigation Signals
${renderList(findings.navigation_signals)}

## Disabled / Read-only / Future Signals
${renderList(findings.disabled_or_readonly_signals)}

## AI / Handoff Signals
${renderList(findings.ai_signals)}

## Risky Terms
${renderList(findings.risky_terms)}

## Required Manual Classification
Before any patch, classify Customer Center actions into:

1. Read-only customer projection
2. Navigation only
3. Disabled/future action
4. AI context handoff only
5. Backend customer mutation
6. Customer send/reply action
7. Ticket status mutation
8. Unknown / needs deeper inspection

## Decision Rule
- If Customer Center is read-only/protected with disabled future actions, close with no patch or copy-only clarification.
- If any active customer send/reply/resolve/assign action exists without explicit backend authority/confirmation, create a narrow T68 patch.
- Do not redesign Customer Center in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T67_CUSTOMER_CENTER_RUNTIME_AUTHORITY_FOCUSED_AUDIT.md"),
  md
);

console.log("Generated audits/system-truth/t67-customer-center-runtime-authority/T67_CUSTOMER_CENTER_RUNTIME_AUTHORITY_FOCUSED_AUDIT.md");
