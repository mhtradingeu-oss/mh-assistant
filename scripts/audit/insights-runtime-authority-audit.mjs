import fs from "fs";
import path from "path";

const root = process.cwd();
const filePath = path.join(root, "public/control-center/pages/insights.js");
const outDir = path.join(root, "audits/system-truth/t68-insights-runtime-authority");

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
  file: "public/control-center/pages/insights.js",
  total_lines: lines.length,

  imports: find(/^import\s/),
  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/),
  api_signals: find(/fetch|api\.|context\.|insight|analytics|metric|learning|recommendation|report|dashboard|trend/i),
  write_signals: find(/POST|PUT|PATCH|DELETE|create|update|delete|save|send|export|publish|sync|import|generate|execute|approve|archive|refresh|run/i),
  confirmation_signals: find(/confirm\(/),
  storage_signals: find(/localStorage|sessionStorage/),
  navigation_signals: find(/navigateTo|location\.hash|data-route|route/i),
  ai_signals: find(/AI|ai|assistant|prompt|suggest|recommendation|guidance|handoff/i),
  disabled_or_readonly_signals: find(/disabled|read-only|readonly|protected|future|coming soon|not available|preview|projection/i),
  risky_terms: find(/publish|send|approve|execute|generate|export|sync|import|delete|archive|refresh|run|provider|campaign|customer|crm|learning|recommendation/i)
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "insights-runtime-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

const riskNotes = [];

if (findings.write_signals.length) {
  riskNotes.push("Insights contains write-like terms. They must be classified as read-only analytics, refresh-only, AI handoff, export/download, or backend mutation.");
} else {
  riskNotes.push("No write-like signals found.");
}

if (findings.confirmation_signals.length === 0) {
  riskNotes.push("No confirmation dialogs found. This is acceptable only if Insights has no publish/send/export/mutation action.");
}

if (findings.storage_signals.length) {
  riskNotes.push("Browser storage exists and must be classified as preference/draft-only or durable authority.");
} else {
  riskNotes.push("No browser storage usage found.");
}

const md = `# T68 — Insights Runtime Authority Focused Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of \`public/control-center/pages/insights.js\`.

## Why Insights Is Next
T61 ranked Insights after Home, Setup, and Customer Center among remaining open frontend files. Insights may include analytics, recommendations, learning signals, refresh actions, AI guidance, reports, and possible export/generate wording. These must be classified before any patch.

## File Summary
- File: \`public/control-center/pages/insights.js\`
- Lines: ${findings.total_lines}
- Imports: ${findings.imports.length}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- API/analytics signals: ${findings.api_signals.length}
- Write-like signals: ${findings.write_signals.length}
- Confirmation signals: ${findings.confirmation_signals.length}
- Storage signals: ${findings.storage_signals.length}
- Navigation signals: ${findings.navigation_signals.length}
- AI/handoff signals: ${findings.ai_signals.length}
- Disabled/read-only/projection signals: ${findings.disabled_or_readonly_signals.length}
- Risky terms: ${findings.risky_terms.length}

## Initial Risk Notes
${riskNotes.map((note) => `- ${note}`).join("\n")}

## Imports
${renderList(findings.imports)}

## Render Writes
${renderList(findings.render_writes)}

## Event Bindings
${renderList(findings.event_bindings)}

## API / Analytics Signals
${renderList(findings.api_signals)}

## Write-like Signals
${renderList(findings.write_signals)}

## Confirmation Signals
${renderList(findings.confirmation_signals)}

## Storage Signals
${renderList(findings.storage_signals)}

## Navigation Signals
${renderList(findings.navigation_signals)}

## AI / Handoff Signals
${renderList(findings.ai_signals)}

## Disabled / Read-only / Projection Signals
${renderList(findings.disabled_or_readonly_signals)}

## Risky Terms
${renderList(findings.risky_terms)}

## Required Manual Classification
Before any patch, classify Insights actions into:

1. Read-only analytics projection
2. Refresh/read-only reload
3. Navigation only
4. AI context handoff only
5. Export/download action
6. Backend analytics mutation
7. Learning/recommendation write
8. Unknown / needs deeper inspection

## Decision Rule
- If Insights is read-only analytics/projection plus AI handoff, close with no patch.
- If refresh only reloads read-only data, close with no patch or copy-only clarification.
- If any export/generate/save/sync action mutates backend or creates records without confirmation, create a narrow T69 patch.
- Do not redesign Insights in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T68_INSIGHTS_RUNTIME_AUTHORITY_FOCUSED_AUDIT.md"),
  md
);

console.log("Generated audits/system-truth/t68-insights-runtime-authority/T68_INSIGHTS_RUNTIME_AUTHORITY_FOCUSED_AUDIT.md");
