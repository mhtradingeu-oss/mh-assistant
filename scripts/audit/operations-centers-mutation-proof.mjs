import fs from "fs";
import path from "path";

const root = process.cwd();
const file = "public/control-center/pages/operations-centers.js";
const outDir = path.join(root, "audits/system-truth/t47-operations-centers-mutation-proof");

const text = fs.readFileSync(path.join(root, file), "utf8");
const lines = text.split(/\r?\n/);

function find(pattern) {
  return lines
    .map((line, index) => ({ line: index + 1, text: line }))
    .filter((item) => pattern.test(item.text));
}

function excerpt(start, end) {
  const s = Math.max(1, start);
  const e = Math.min(lines.length, end);
  const out = [];
  for (let i = s; i <= e; i++) {
    out.push(`${String(i).padStart(5, " ")}: ${lines[i - 1]}`);
  }
  return out.join("\n");
}

function zonesFor(label, pattern, radius = 35, max = 12) {
  const hits = find(pattern).slice(0, max);
  if (!hits.length) {
    return `\n### ${label}\n\n_No match found._\n`;
  }

  return `\n### ${label}\n\n` + hits.map((hit, index) => {
    return `#### Match ${index + 1} — line ${hit.line}\n\n\`\`\`js\n${excerpt(hit.line - radius, hit.line + radius)}\n\`\`\``;
  }).join("\n\n");
}

const checks = [
  ["Real project mutation APIs", /\b(createProject|updateProject|deleteProject|saveProject|syncProject|importProject|decideProject|sendProject)[A-Za-z0-9_]*\s*\(/],
  ["Context mutation callbacks", /context\.(create|update|delete|save|sync|import|decide|send|resolve|assign|complete|archive|publish|approve|reject)[A-Za-z0-9_]*\s*\(/],
  ["Fetch calls", /\bfetch\s*\(/],
  ["Refresh/read APIs", /fetchProjectTaskCenter|fetchProject|reloadProjectData|refreshTaskCenter|refresh/i],
  ["Disabled mutation controls", /disabled>.*(?:Update|Reassign|Change|Delete|Resolve|Assign|Complete|Send|Publish|Approve|Reject)|disabled: future mutation safety pass/i],
  ["Clipboard/copy only", /navigator\.clipboard|execCommand\("copy"\)|Copy Selected|Copy Handoff|copied/i],
  ["Route only", /data-ops-route|navigateTo|renderRouteAction|Opened .*\.|Open Owning Workspace/i],
  ["AI prompt only", /savePromptToQuickCommand|data-ops-ai-open|data-ops-ai-prompt|Operations prompt added|AI Command/i],
  ["Notification possible mutation labels", /mark.*read|unread|dismiss|archive|delete|notify|notification/i],
  ["Queue possible mutation labels", /queue|resolve|assign|complete|status|priority/i],
  ["Job possible mutation labels", /job|run|trigger|start|stop|retry|cancel/i],
  ["Confirmation gates", /window\.confirm|confirm\(/],
  ["Known compact copy", /atask|AIguidance|Updatestatus|Changepriority|Updatedue date|Deletetask|toreview|due_soon"\)|entity_type\|\|/]
];

let md = `# T47 — Operations Centers Targeted Mutation Proof

## Status
Audit-only. No production files changed.

## Target
- ${file}

## Purpose
T46 found many potential mutation signals. T47 narrows those down to determine whether Operations Centers performs real backend mutations or only read/refresh/copy/route/AI/disabled actions.

## Exact Counts

| Area | First Line | Count |
|---|---:|---:|
`;

for (const [label, pattern] of checks) {
  const hits = find(pattern);
  md += `| ${label} | ${hits[0]?.line || "n/a"} | ${hits.length} |\n`;
}

md += `\n## Evidence Zones\n`;

for (const [label, pattern] of checks) {
  md += zonesFor(label, pattern);
}

const realProjectMutations = find(/\b(createProject|updateProject|deleteProject|saveProject|syncProject|importProject|decideProject|sendProject)[A-Za-z0-9_]*\s*\(/);
const contextMutations = find(/context\.(create|update|delete|save|sync|import|decide|send|resolve|assign|complete|archive|publish|approve|reject)[A-Za-z0-9_]*\s*\(/);
const fetchCalls = find(/\bfetch\s*\(/);
const refreshRead = find(/fetchProjectTaskCenter|reloadProjectData|refreshTaskCenter/i);
const disabledControls = find(/disabled: future mutation safety pass/i);
const copyOnly = find(/navigator\.clipboard|execCommand\("copy"\)/);
const routeOnly = find(/data-ops-route|navigateTo/i);
const aiOnly = find(/savePromptToQuickCommand|data-ops-ai-prompt|data-ops-ai-open/i);
const confirmGates = find(/window\.confirm|confirm\(/);
const compactCopy = find(/atask|AIguidance|Updatestatus|Changepriority|Updatedue date|Deletetask|toreview|due_soon"\)|entity_type\|\|/);

md += `

## Preliminary Verdict

| Area | Verdict |
|---|---|
| Real project mutation API calls | ${realProjectMutations.length ? `Found ${realProjectMutations.length} - inspect before patch/closeout` : "Not found"} |
| Context mutation callbacks | ${contextMutations.length ? `Found ${contextMutations.length} - inspect before patch/closeout` : "Not found"} |
| Raw fetch calls | ${fetchCalls.length ? `Found ${fetchCalls.length}` : "Not found"} |
| Refresh/read behavior | ${refreshRead.length ? `Found ${refreshRead.length}` : "Not found"} |
| Disabled mutation controls | ${disabledControls.length ? `Found ${disabledControls.length}` : "Not found"} |
| Copy-only actions | ${copyOnly.length ? `Found ${copyOnly.length}` : "Not found"} |
| Route-only actions | ${routeOnly.length ? `Found ${routeOnly.length}` : "Not found"} |
| AI prompt-only actions | ${aiOnly.length ? `Found ${aiOnly.length}` : "Not found"} |
| Confirmation gates | ${confirmGates.length ? `Found ${confirmGates.length}` : "Not found"} |
| Compact copy issues | ${compactCopy.length ? `Found ${compactCopy.length} - UX/copy polish candidate` : "Not found"} |

## Decision Guidance
- If real project mutation API calls and context mutation callbacks are not found, Operations Centers likely needs no runtime authority patch.
- Refresh/read-only calls do not require confirmation.
- Clipboard/copy, route-only, and AI prompt-only actions do not require confirmation.
- Disabled future mutation controls do not require confirmation because they cannot execute.
- Compact copy issues should not block runtime authority closeout unless a production patch is otherwise required.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "T47_OPERATIONS_CENTERS_TARGETED_MUTATION_PROOF.md"),
  md
);

console.log("Generated audits/system-truth/t47-operations-centers-mutation-proof/T47_OPERATIONS_CENTERS_TARGETED_MUTATION_PROOF.md");
