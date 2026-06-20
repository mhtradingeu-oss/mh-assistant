import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/operations-centers.js";
const outDir = path.join(root, "audits/system-truth/t46-operations-centers-exact-actions");

const text = fs.readFileSync(path.join(root, file), "utf8");
const lines = text.split(/\r?\n/);

function excerpt(start, end) {
  const s = Math.max(1, start);
  const e = Math.min(lines.length, end);
  const out = [];
  for (let i = s; i <= e; i++) {
    out.push(`${String(i).padStart(5, " ")}: ${lines[i - 1]}`);
  }
  return out.join("\n");
}

function find(pattern) {
  return lines
    .map((line, index) => ({ line: index + 1, text: line }))
    .filter((item) => pattern.test(item.text));
}

function first(pattern) {
  return find(pattern)[0]?.line || null;
}

function zone(pattern, radius = 70) {
  const line = first(pattern);
  if (!line) return "_No match found._";
  return excerpt(line - radius, line + radius);
}

function block(label, pattern, radius = 85) {
  return `\n### ${label}\n\n\`\`\`js\n${zone(pattern, radius)}\n\`\`\`\n`;
}

const checks = [
  ["Task Center renderer", /function renderTaskCenter\(/],
  ["Task Center live refresh", /fetchProjectTaskCenter|reloadProjectData/],
  ["Task mutation disabled copy", /Task mutations remain deferred|disabled: future mutation safety pass/],
  ["Task copy-only actions", /taskCenterCopySummaryBtn|taskCenterCopyHandoffBtn|navigator\.clipboard|execCommand\("copy"\)/],
  ["Task route actions", /renderRouteAction|data-ops-route|bindRouteButtons/],
  ["Task AI prompt route", /data-ops-ai-open|data-ops-ai-prompt|savePromptToQuickCommand|navigateTo\("ai-command"\)/],
  ["Queue renderer", /function renderQueue|queueSessions|queue_center|queueCenter/i],
  ["Queue action handlers", /queue.*addEventListener|data-queue|queue.*onclick|Queue/i],
  ["Job renderer", /function renderJob|jobSessions|job_center|jobCenter/i],
  ["Job action handlers", /job.*addEventListener|data-job|job.*onclick|Job/i],
  ["Notification renderer", /function renderNotification|notificationSessions|notification_center|notificationCenter/i],
  ["Notification action handlers", /notification.*addEventListener|data-notification|notification.*onclick|Notification/i],
  ["Customer operations renderer", /customerOps|customer-operations|Customer Operations|customer/i],
  ["Potential backend mutations", /createProject|updateProject|deleteProject|saveProject|syncProject|importProject|decideProject|sendProject|resolve|assign|complete|archive|delete|publish|approve|reject/i],
  ["Confirmation gates", /window\.confirm|confirm\(/],
  ["Disabled sensitive buttons", /disabled>.*(?:Update|Reassign|Change|Delete|Resolve|Assign|Complete|Send|Publish|Approve|Reject)|disabled: future mutation safety pass/i],
  ["Copy defects", /ControlCenter|customerops|notificationcenter|operationscenter|sendnow|markread|followup|needsreview/i]
];

let md = `# T46 — Operations Centers Exact Action Path Proof

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
T45 showed high signal volume in Operations Centers. T46 verifies exact action paths and separates:
- read-only refresh
- copy-only actions
- route-only actions
- AI prompt-only actions
- disabled future mutations
- real backend mutations, if any
- confirmation requirements, if any

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
`;

for (const [label, pattern] of checks) {
  const hits = find(pattern);
  md += `| ${label} | ${hits[0]?.line || "n/a"} | ${hits.length} |\n`;
}

md += `

## Focused Evidence
`;

for (const [label, pattern] of checks) {
  md += block(label, pattern);
}

const mutationPatterns = [
  /createProject(?!.*Handoff)/,
  /updateProject/,
  /deleteProject/,
  /saveProject/,
  /syncProject/,
  /importProject/,
  /decideProject/,
  /sendProject/,
  /resolve[A-Z]/,
  /assign[A-Z]/,
  /complete[A-Z]/,
  /archive[A-Z]/,
  /publish[A-Z]/,
  /approve[A-Z]/,
  /reject[A-Z]/
];

const mutationHits = mutationPatterns.flatMap((pattern) => find(pattern));
const hasMutationHits = mutationHits.length > 0;
const hasDisabledMutationCopy = /Task mutations remain deferred|disabled: future mutation safety pass|No task creation, owner assignment, status change, approval, publishing, or backend execution is performed/.test(text);
const hasRefreshOnly = /fetchProjectTaskCenter|reloadProjectData/.test(text);
const hasCopyOnly = /navigator\.clipboard|execCommand\("copy"\)/.test(text);
const hasAiRouteOnly = /savePromptToQuickCommand|navigateTo\("ai-command"\)/.test(text);
const hasConfirm = /window\.confirm|confirm\(/.test(text);

md += `

## Preliminary Verdict

| Area | Verdict |
|---|---|
| Potential real backend mutation hits | ${hasMutationHits ? `Found ${mutationHits.length} - inspect focused zones` : "Not found"} |
| Disabled mutation copy exists | ${hasDisabledMutationCopy ? "Found" : "Not found"} |
| Read/refresh-only behavior | ${hasRefreshOnly ? "Found" : "Not found"} |
| Copy-only behavior | ${hasCopyOnly ? "Found" : "Not found"} |
| AI route/prompt-only behavior | ${hasAiRouteOnly ? "Found" : "Not found"} |
| Confirmation gates | ${hasConfirm ? "Found" : "Not found"} |

## Decision Guidance
- If all sensitive mutations are disabled/copy-only/route-only/read-only, no runtime patch is needed.
- If any real backend mutation exists without confirmation, add a minimal confirmation gate only after this proof.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "T46_OPERATIONS_CENTERS_EXACT_ACTION_PATH_PROOF.md"),
  md
);

console.log("Generated audits/system-truth/t46-operations-centers-exact-actions/T46_OPERATIONS_CENTERS_EXACT_ACTION_PATH_PROOF.md");
