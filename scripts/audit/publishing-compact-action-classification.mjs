import fs from "fs";
import path from "path";

const root = process.cwd();
const file = path.join(root, "public/control-center/pages/publishing.js");
const outDir = path.join(root, "audits/system-truth/t102-publishing-compact-action-classification");

const text = fs.readFileSync(file, "utf8");
const lines = text.split(/\r?\n/);

function lineNoOf(pattern, start = 1) {
  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
  for (let i = Math.max(0, start - 1); i < lines.length; i += 1) {
    if (regex.test(lines[i])) return i + 1;
  }
  return null;
}

function excerptAround(pattern, radius = 18, start = 1) {
  const line = lineNoOf(pattern, start);
  if (!line) return { line: null, text: "_Not found._" };
  const from = Math.max(1, line - radius);
  const to = Math.min(lines.length, line + radius);
  return {
    line,
    text: lines.slice(from - 1, to).map((value, index) => {
      const current = from + index;
      return `${String(current).padStart(5, " ")}: ${value}`;
    }).join("\n")
  };
}

function containsBetween(startPattern, endPattern, checks) {
  const start = lineNoOf(startPattern);
  const end = endPattern ? lineNoOf(endPattern, start ? start + 1 : 1) : null;
  if (!start) return {};
  const to = end || Math.min(lines.length, start + 120);
  const block = lines.slice(start - 1, to - 1).join("\n");
  const result = {};
  for (const [key, regex] of Object.entries(checks)) {
    result[key] = regex.test(block);
  }
  result.start = start;
  result.end = to;
  return result;
}

const actions = [
  {
    id: "save-draft",
    label: "Save publishing draft",
    start: /const saveDraftButtons/,
    end: /const scheduleBtn/,
    expected: "Local draft persistence"
  },
  {
    id: "schedule",
    label: "Queue for Manual Publishing",
    start: /const scheduleBtn/,
    end: /Array\.from\(document\.querySelectorAll\("\[data-publishing-action\]"\)/,
    expected: "Backend schedule/reschedule or local fallback"
  },
  {
    id: "queue-row-actions",
    label: "Queue row actions",
    start: /Array\.from\(document\.querySelectorAll\("\[data-publishing-action\]"\)/,
    end: /const approveBtn/,
    expected: "Review/schedule/publish/pause/retry actions"
  },
  {
    id: "approve",
    label: "Approve current item",
    start: /const approveBtn/,
    end: /const failBtn/,
    expected: "Approval/readiness backend mutation or local fallback"
  },
  {
    id: "fail",
    label: "Mark failed",
    start: /const failBtn/,
    end: /const loadHandoffBtn/,
    expected: "Fail status backend mutation or local fallback"
  },
  {
    id: "load-handoff",
    label: "Load workflow output",
    start: /const loadHandoffBtn/,
    end: /const pushAiBtn/,
    expected: "Load shared handoff into local form"
  },
  {
    id: "push-ai",
    label: "Send publishing context to AI",
    start: /const pushAiBtn/,
    end: /const autoPrepareBtn/,
    expected: "Shared AI draft/handoff context only"
  },
  {
    id: "auto-prepare",
    label: "Auto-prepare publishing plan",
    start: /const autoPrepareBtn/,
    end: /const autoStopBtn/,
    expected: "Auto Mode start"
  },
  {
    id: "auto-stop",
    label: "Stop Auto Mode",
    start: /const autoStopBtn/,
    end: /const autoApproveBtn/,
    expected: "Auto Mode stop/state control"
  },
  {
    id: "auto-approve",
    label: "Approve automation step",
    start: /const autoApproveBtn/,
    end: /const autoSkipBtn/,
    expected: "Auto Mode approval gate"
  },
  {
    id: "auto-skip",
    label: "Skip automation step",
    start: /const autoSkipBtn/,
    end: /function renderPublishingPage|export const publishingRoute|^}/,
    expected: "Auto Mode skip gate"
  }
];

const checks = {
  confirm: /confirmPublishingBackendAction|window\.confirm|confirm\(/,
  backendSchedule: /reschedulePublishingItem/,
  backendApprove: /approvePublishingItem/,
  backendPublish: /publishPublishingItem/,
  backendFail: /failPublishingItem/,
  autoStart: /startAutoMode/,
  autoApprove: /approveCurrentGate/,
  autoSkip: /skipCurrentStep/,
  sharedAiDraft: /setSharedAiDraft/,
  sharedHandoff: /setSharedHandoff/,
  localStorage: /localStorage|saveLocalDraft|updateLocalDraft|persistDraft/,
  validation: /validateBuilder|guardPublishingAssetBlockers|approvalStatus|blocker/,
  navigateAi: /navigateTo\("ai-command"\)/
};

const rows = actions.map((action) => {
  const result = containsBetween(action.start, action.end, checks);
  return { ...action, ...result };
});

const findings = {
  file: "public/control-center/pages/publishing.js",
  generated_at: new Date().toISOString(),
  actions: rows
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "publishing-compact-action-classification.json"), JSON.stringify(findings, null, 2));

function yes(value) {
  return value ? "yes" : "no";
}

const table = rows.map((row) => (
  `| ${row.label} | L${row.start || "n/a"}-L${row.end || "n/a"} | ${row.expected} | ${yes(row.confirm)} | ${yes(row.validation)} | ${yes(row.backendSchedule || row.backendApprove || row.backendPublish || row.backendFail)} | ${yes(row.sharedAiDraft || row.sharedHandoff)} | ${yes(row.autoStart || row.autoApprove || row.autoSkip)} | ${yes(row.localStorage)} |`
)).join("\n");

const riskRows = rows.filter((row) => {
  const backend = row.backendSchedule || row.backendApprove || row.backendPublish || row.backendFail;
  const auto = row.autoStart || row.autoApprove || row.autoSkip;
  return (backend || auto) && !row.confirm;
});

let md = `# T102 — Publishing Compact Action Classification

## Status
Audit-only. No production files changed.

## Purpose
T101 was intentionally broad. T102 removes duplication and classifies only exact user-facing actions.

## Action Classification Table

| Action | Lines | Expected classification | Confirmation | Validation/guard | Backend mutation | Shared context | Auto Mode | Local storage |
|---|---:|---|---|---|---|---|---|---|
${table}

## Preliminary Risk Result
`;

if (riskRows.length) {
  md += `
Potential missing confirmations or unclear gates:

${riskRows.map((row) => `- ${row.label} at L${row.start || "n/a"}-L${row.end || "n/a"}`).join("\n")}

These require exact source review before patching.
`;
} else {
  md += `
No obvious backend/auto action without confirmation was detected by compact classification.

Continue with source excerpts and closeout if manual review confirms the same.
`;
}

md += `

## Exact Source Excerpts

`;

for (const action of actions) {
  const ex = excerptAround(action.start, 32);
  md += `### ${action.label}

Starts around: L${ex.line || "n/a"}

\`\`\`js
${ex.text}
\`\`\`

`;
}

md += `## Decision Rule
- If backend schedule/publish/approve/fail paths are confirmation-gated and validation-gated, close without patch.
- If Auto Mode start/approve/skip is confirmation-gated or backend approval-gated, close without patch.
- If any backend or Auto Mode action lacks confirmation, patch narrowly.
- Do not duplicate T100/T101 content.
- Do not redesign Publishing.
`;

fs.writeFileSync(path.join(outDir, "T102_PUBLISHING_COMPACT_ACTION_CLASSIFICATION.md"), md);

console.log("Generated T102 compact Publishing classification");
console.log(`Actions classified: ${rows.length}`);
console.log(`Potential unclear/missing confirmation rows: ${riskRows.length}`);
if (riskRows.length) {
  riskRows.forEach((row) => console.log(`- ${row.label}: L${row.start || "n/a"}-L${row.end || "n/a"}`));
}
