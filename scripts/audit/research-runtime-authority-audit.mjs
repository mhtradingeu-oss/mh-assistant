import fs from "fs";
import path from "path";

const root = process.cwd();
const filePath = path.join(root, "public/control-center/pages/research.js");
const outDir = path.join(root, "audits/system-truth/t84-research-runtime-authority");

const text = fs.readFileSync(filePath, "utf8");
const lines = text.split(/\r?\n/);

function find(pattern) {
  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
  return lines
    .map((line, index) => ({ line: index + 1, text: line }))
    .filter((entry) => regex.test(entry.text));
}

function renderList(items, limit = 220) {
  if (!items.length) return "- none";
  return items
    .slice(0, limit)
    .map((item) => `- L${item.line}: \`${item.text.trim().replaceAll("`", "\\`")}\``)
    .join("\n");
}

const findings = {
  file: "public/control-center/pages/research.js",
  total_lines: lines.length,

  imports: find(/^import\s/),
  render_writes: find(/innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/),
  event_bindings: find(/addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/),

  api_signals: find(/fetch|createProject|saveProject|updateProject|deleteProject|execute|handoff|approval|task|research|source|library|content|campaign|api/i),
  ai_signals: find(/AI|ai|assistant|prompt|generate|execute|insight|summary|recommend/i),
  save_storage_signals: find(/save|saved|localStorage|sessionStorage|setItem|getItem|draft|persist|cache/i),
  handoff_signals: find(/handoff|setSharedHandoff|getSharedHandoff|navigateTo|destination|route/i),
  task_signals: find(/task|todo|next action|follow-up/i),
  approval_signals: find(/approval|approve|review|governance|decision/i),
  destructive_or_execution_signals: find(/delete|archive|execute|publish|send|sync|import|submit|run|dispatch|trigger|start|generate/i),
  confirmation_signals: find(/confirm\(/),
  navigation_signals: find(/navigateTo|location\.hash|data-route|route/i),
  disabled_or_readonly_signals: find(/disabled|read-only|readonly|locked|future|preview|draft|not configured|requires|guard/i),
  risky_terms: find(/publish|approve|send|execute|generate|provider|save|task|handoff|library|approval|delete|archive|sync|import|credential|token|access key|review|source/i)
};

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "research-runtime-authority-findings.json"),
  JSON.stringify(findings, null, 2)
);

const riskNotes = [];

if (findings.api_signals.length) {
  riskNotes.push("Research contains API/backend/source/library/task/handoff signals. Exact action paths must classify whether these are read-only, local, or backend mutations.");
}

if (findings.ai_signals.length) {
  riskNotes.push("Research contains AI/recommendation/generation signals. Confirm whether they execute backend AI or only prepare prompts/recommendations.");
}

if (findings.save_storage_signals.length) {
  riskNotes.push("Research contains save/storage signals. Separate local cache/draft from backend persistence.");
}

if (findings.handoff_signals.length) {
  riskNotes.push("Research contains handoff/navigation signals. Backend handoff creation must be confirmed if present.");
}

if (findings.confirmation_signals.length === 0) {
  riskNotes.push("No confirmation dialogs found. This is acceptable only if the page is read-only/projection/handoff-only.");
} else {
  riskNotes.push("Confirmation dialogs exist and must be mapped to exact authority-sensitive actions.");
}

const md = `# T84 — Research Runtime Authority Focused Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of \`public/control-center/pages/research.js\`.

## Why Research Is Next
T71 ranked \`research.js\` as the next active high-risk page after Media Studio and Content Studio. It must be classified before any patch.

## File Summary
- File: \`public/control-center/pages/research.js\`
- Lines: ${findings.total_lines}
- Imports: ${findings.imports.length}
- Render writes: ${findings.render_writes.length}
- Event bindings: ${findings.event_bindings.length}
- API/backend/source signals: ${findings.api_signals.length}
- AI signals: ${findings.ai_signals.length}
- Save/storage signals: ${findings.save_storage_signals.length}
- Handoff signals: ${findings.handoff_signals.length}
- Task signals: ${findings.task_signals.length}
- Approval/governance signals: ${findings.approval_signals.length}
- Destructive/execution signals: ${findings.destructive_or_execution_signals.length}
- Confirmation signals: ${findings.confirmation_signals.length}
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

## API / Backend / Source Signals
${renderList(findings.api_signals)}

## AI Signals
${renderList(findings.ai_signals)}

## Save / Storage Signals
${renderList(findings.save_storage_signals)}

## Handoff Signals
${renderList(findings.handoff_signals)}

## Task Signals
${renderList(findings.task_signals)}

## Approval / Governance Signals
${renderList(findings.approval_signals)}

## Destructive / Execution Signals
${renderList(findings.destructive_or_execution_signals)}

## Confirmation Signals
${renderList(findings.confirmation_signals)}

## Navigation Signals
${renderList(findings.navigation_signals)}

## Disabled / Read-only / Draft / Guard Signals
${renderList(findings.disabled_or_readonly_signals)}

## Risky Terms
${renderList(findings.risky_terms)}

## Required Manual Classification
Before any patch, classify exact user-facing action paths into:

1. Read-only research projection
2. Local filter/view state only
3. Local draft/cache only
4. Backend source/library/content persistence
5. Backend research or AI execution
6. Task creation
7. Approval/governance creation
8. Library handoff
9. Content/Campaign/AI Command handoff
10. Navigation only
11. Unknown / needs deeper inspection

## Decision Rule
- If Research is read-only/projection/handoff-only, close with no patch.
- If backend mutation exists without confirmation, create a narrow patch.
- If AI/backend execution exists without confirmation, create a narrow patch.
- If handoff creates backend records without confirmation, create a narrow patch.
- Do not redesign Research in this pass.
`;

fs.writeFileSync(
  path.join(outDir, "T84_RESEARCH_RUNTIME_AUTHORITY_FOCUSED_AUDIT.md"),
  md
);

console.log("Generated audits/system-truth/t84-research-runtime-authority/T84_RESEARCH_RUNTIME_AUTHORITY_FOCUSED_AUDIT.md");
