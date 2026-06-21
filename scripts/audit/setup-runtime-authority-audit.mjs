import fs from "fs";
import path from "path";

const root = process.cwd();
const setupPath = path.join(root, "public/control-center/pages/setup.js");
const outDir = path.join(root, "audits/system-truth/t63-setup-runtime-authority");

const text = fs.readFileSync(setupPath, "utf8");
const lines = text.split(/\r?\n/);

function find(pattern) {
  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
  return lines
    .map((line, index) => ({ line: index + 1, text: line }))
    .filter((entry) => regex.test(entry.text));
}

function renderList(items, limit = 140) {
  if (!items.length) return "- none";
  return items
    .slice(0, limit)
    .map((item) => `- L${item.line}: \`${item.text.trim().replaceAll("`", "\\`")}\``)
    .join("\n");
}

const findings = {
  file: "public/control-center/pages/setup.js",
  total_lines: lines.length,

  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown|pointerup|mouseup|click/),
  save_write_signals: find(/save|submit|updateProject|saveProject|createProject|persist|write|POST|PUT|PATCH|DELETE/i),
  backend_api_signals: find(/fetch|api\.|context\.|saveProject|updateProject|loadProject|refreshProject|projectData|projectName/i),
  confirmation_signals: find(/confirm\(/),
  storage_signals: find(/localStorage|sessionStorage/),
  focus_workaround_signals: find(/keepSetupFieldFocused|focus|selection|pointerup|mouseup/i),
  navigation_signals: find(/navigateTo|location\.hash|data-route|route/i),
  disabled_or_future_signals: find(/disabled|future|coming soon|not available|read-only|protected/i),
  risky_terms: find(/delete|archive|publish|send|approve|reject|sync|import|disconnect|reconnect|execute|run|credential|secret|token|key/i)
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "setup-runtime-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

const riskNotes = [];

if (findings.save_write_signals.length) {
  riskNotes.push("Setup contains save/write-like signals. These must be classified as expected project setup save flow or risky mutation.");
} else {
  riskNotes.push("No save/write-like signals found.");
}

if (findings.confirmation_signals.length === 0) {
  riskNotes.push("No confirmation dialogs found. This may be acceptable for normal setup save if the save is explicit and non-destructive.");
} else {
  riskNotes.push("Confirmation dialogs exist and should be checked for critical actions.");
}

if (findings.storage_signals.length) {
  riskNotes.push("Browser storage exists. Classify whether it is draft UX only or durable authority.");
} else {
  riskNotes.push("No browser storage usage found.");
}

if (findings.focus_workaround_signals.length) {
  riskNotes.push("Focus/pointer workaround exists. Check whether it is still necessary and whether it affects normal text selection or copy/paste.");
}

const md = `# T63 — Setup Runtime Authority Focused Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of \`public/control-center/pages/setup.js\` after T61 ranked Setup as the next highest remaining open frontend file.

## File Summary
- File: \`public/control-center/pages/setup.js\`
- Lines: ${findings.total_lines}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- Save/write-like signals: ${findings.save_write_signals.length}
- Backend/API/context signals: ${findings.backend_api_signals.length}
- Confirmation signals: ${findings.confirmation_signals.length}
- Storage signals: ${findings.storage_signals.length}
- Focus workaround signals: ${findings.focus_workaround_signals.length}
- Navigation signals: ${findings.navigation_signals.length}
- Disabled/future/read-only signals: ${findings.disabled_or_future_signals.length}
- Risky terms: ${findings.risky_terms.length}

## Initial Risk Notes
${riskNotes.map((note) => `- ${note}`).join("\n")}

## Render Writes
${renderList(findings.render_writes)}

## Event Bindings
${renderList(findings.event_bindings)}

## Save / Write-like Signals
${renderList(findings.save_write_signals)}

## Backend / API / Context Signals
${renderList(findings.backend_api_signals)}

## Confirmation Signals
${renderList(findings.confirmation_signals)}

## Storage Signals
${renderList(findings.storage_signals)}

## Focus / Pointer Workaround Signals
${renderList(findings.focus_workaround_signals)}

## Navigation Signals
${renderList(findings.navigation_signals)}

## Disabled / Future / Read-only Signals
${renderList(findings.disabled_or_future_signals)}

## Risky Terms
${renderList(findings.risky_terms)}

## Required Manual Classification
Before any patch, classify Setup actions into:

1. Explicit normal setup save
2. Draft/local-only state
3. Navigation only
4. Read-only projection/help
5. Backend mutation requiring confirmation
6. Risky credential/secret handling
7. Focus/listener UX workaround
8. Unknown / needs deeper inspection

## Decision Rule
- If Setup only performs explicit setup save plus local draft UX, close as safe or add copy-only clarification.
- If Setup mutates backend settings without clear operator intent, create a narrow T64 confirmation/copy patch.
- If focus workaround can break text selection/copy/paste, create a narrow UX patch only after evidence.
- Do not redesign Setup in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T63_SETUP_RUNTIME_AUTHORITY_FOCUSED_AUDIT.md"),
  md
);

console.log("Generated audits/system-truth/t63-setup-runtime-authority/T63_SETUP_RUNTIME_AUTHORITY_FOCUSED_AUDIT.md");
