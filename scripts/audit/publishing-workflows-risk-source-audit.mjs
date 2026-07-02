import fs from "fs";
import path from "path";

const root = process.cwd();
const outDir = path.join(root, "audits/system-truth/t3-risk-source");

const targets = [
  "public/control-center/pages/publishing.js",
  "public/control-center/pages/workflows.js"
];

const patterns = [
  ["AutoMode / automation", /AutoMode|autoMode|startAutoMode|subscribeAutoMode|createAutoModeController|runAutomationPlan|approveCurrentGate|skipCurrentStep|resumeAutoMode/i],
  ["Execution / mutation verbs", /execute|publish|approve|reject|fail|schedule|runWorkflow|startWorkflow|dispatch|submit|save|update|delete|archive/i],
  ["Confirmation gates", /confirm\s*\(|confirmation|Are you sure|approval required|requires approval|gate/i],
  ["Backend/API calls", /fetchProject|executeProject|updateProject|saveProject|refreshProject|uploadProject|api\.|context\./i],
  ["Frontend authority words", /owner_role|route_permissions|permission|policy|governance|approval_status|status\s*=|mode\s*=|role/i],
  ["Timers/listeners", /addEventListener|setTimeout|setInterval|requestAnimationFrame/i],
  ["DOM writes", /innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/i],
  ["AI handoff / context", /AI|ai-|assistant|handoff|context|prompt|command/i]
];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function linesOf(text, regex) {
  return text
    .split(/\r?\n/)
    .map((line, index) => ({ line: index + 1, text: line }))
    .filter(item => regex.test(item.text));
}

function excerpt(text, center, radius = 6) {
  const lines = text.split(/\r?\n/);
  const start = Math.max(1, center - radius);
  const end = Math.min(lines.length, center + radius);
  const out = [];
  for (let i = start; i <= end; i++) {
    out.push(`${String(i).padStart(5, " ")}: ${lines[i - 1]}`);
  }
  return out.join("\n");
}

function classifyLine(lineText) {
  if (/startAutoMode|runAutomationPlan|approveCurrentGate|skipCurrentStep|resumeAutoMode/i.test(lineText)) {
    return "P0-check: active automation execution/control reference";
  }
  if (/publish|approve|reject|fail|schedule|execute|delete|archive/i.test(lineText) && !/confirm/i.test(lineText)) {
    return "P1-check: mutation/execution path; verify backend authority and confirmation";
  }
  if (/confirm\s*\(/i.test(lineText)) {
    return "Safety-positive: confirmation gate exists";
  }
  if (/innerHTML\s*=/i.test(lineText)) {
    return "P2-check: DOM rewrite; verify sanitized/static rendering";
  }
  if (/addEventListener|setTimeout|setInterval|requestAnimationFrame/i.test(lineText)) {
    return "P2-check: lifecycle/listener/timer management";
  }
  return "Review";
}

const reportParts = [];
const json = {};

for (const file of targets) {
  const text = read(file);
  const allLines = text.split(/\r?\n/);
  const fileReport = {
    file,
    lines: allLines.length,
    sections: {}
  };

  reportParts.push(`# ${file}`);
  reportParts.push("");
  reportParts.push(`- Lines: ${allLines.length}`);
  reportParts.push("");

  for (const [label, regex] of patterns) {
    const hits = linesOf(text, regex);
    fileReport.sections[label] = hits.map(hit => ({
      line: hit.line,
      text: hit.text.trim(),
      classification: classifyLine(hit.text)
    }));

    reportParts.push(`## ${label}`);
    reportParts.push(`Hits: ${hits.length}`);
    reportParts.push("");

    if (!hits.length) {
      reportParts.push("_No hits._");
      reportParts.push("");
      continue;
    }

    reportParts.push("| Line | Classification | Code |");
    reportParts.push("|---:|---|---|");
    for (const hit of hits.slice(0, 120)) {
      reportParts.push(`| ${hit.line} | ${classifyLine(hit.text)} | \`${hit.text.trim().replaceAll("|", "\\|")}\` |`);
    }
    if (hits.length > 120) {
      reportParts.push(`| ... | Truncated | ${hits.length - 120} more hits not shown |`);
    }
    reportParts.push("");
  }

  const criticalHits = linesOf(text, /startAutoMode|runAutomationPlan|approveCurrentGate|skipCurrentStep|resumeAutoMode|publish|approve|reject|fail|schedule|execute/i);
  reportParts.push("## Focused Excerpts Around Critical Hits");
  reportParts.push("");

  for (const hit of criticalHits.slice(0, 30)) {
    reportParts.push(`### ${file}:${hit.line}`);
    reportParts.push("```js");
    reportParts.push(excerpt(text, hit.line, 5));
    reportParts.push("```");
    reportParts.push("");
  }

  json[file] = fileReport;
}

const summary = `# T3 — Publishing + Workflows Risk Source Audit

## Status
Audit-only. No production files changed.

## Purpose
The terminal baseline identified Publishing and Workflows as the highest P0 risk pages because of AutoMode and execution-related references. This audit extracts exact source lines and classifies them for manual decision.

## Scope
- public/control-center/pages/publishing.js
- public/control-center/pages/workflows.js

## Decision Rules
- Do not remove AutoMode references blindly.
- Do not change publish/workflow execution paths without confirming backend authority and confirmation gates.
- Treat active automation control references as P0-check.
- Treat publish/approve/reject/fail/schedule/execute paths as P1-check unless already clearly protected.
- Treat confirm() as safety-positive, not a risk.
- Treat innerHTML/listeners/timers as lifecycle/rendering review items.

## Next Decision
After reviewing this report, choose one small fix:
1. Documentation-only closeout if references are compatibility-only.
2. Add/verify confirmation gate if a mutation path lacks confirmation.
3. Isolate AutoMode startup if any implicit execution remains.
4. Move lifecycle listeners/timers to registry only if leak risk is proven.

---

${reportParts.join("\n")}
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T3_PUBLISHING_WORKFLOWS_RISK_SOURCE_AUDIT.md"), summary);
fs.writeFileSync(path.join(outDir, "t3-publishing-workflows-risk-source.json"), JSON.stringify(json, null, 2));

console.log("Generated:");
console.log("audits/system-truth/t3-risk-source/T3_PUBLISHING_WORKFLOWS_RISK_SOURCE_AUDIT.md");
console.log("audits/system-truth/t3-risk-source/t3-publishing-workflows-risk-source.json");
