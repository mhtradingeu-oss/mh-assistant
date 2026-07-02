import fs from "fs";
import path from "path";

const root = process.cwd();
const target = path.join(root, "public/control-center/pages/insights.js");
const outDir = path.join(root, "audits/system-truth/t138-insights-exact-action-paths");

const content = fs.readFileSync(target, "utf8");
const lines = content.split(/\r?\n/);

const terms = [
  "createProjectHandoff",
  "createProjectApproval",
  "createProjectTask",
  "executeProjectAiCommand",
  "saveProject",
  "setSharedHandoff",
  "setSharedAiDraft",
  "navigateTo",
  "confirm",
  "window.confirm",
  "publish",
  "approval",
  "handoff",
  "insight",
  "export",
  "report",
  "recommendation",
  "addEventListener",
  ".onclick",
  "onclick",
  "data-"
];

function snippets(term, radius = 5) {
  const matches = [];
  lines.forEach((line, index) => {
    if (line.includes(term)) {
      const start = Math.max(0, index - radius);
      const end = Math.min(lines.length, index + radius + 1);
      matches.push({
        term,
        line: index + 1,
        excerpt: lines.slice(start, end).map((value, offset) => ({
          line: start + offset + 1,
          text: value
        }))
      });
    }
  });
  return matches;
}

const results = Object.fromEntries(terms.map((term) => [term, snippets(term)]));

const authorityTerms = [
  "createProjectHandoff",
  "createProjectApproval",
  "createProjectTask",
  "executeProjectAiCommand",
  "saveProject",
  "setSharedHandoff",
  "setSharedAiDraft"
];

const authorityCounts = authorityTerms.map((term) => ({
  term,
  count: results[term]?.length || 0
}));

const eventFindings = [
  ...(results[".onclick"] || []),
  ...(results.onclick || []),
  ...(results.addEventListener || [])
];

const summary = {
  file: "public/control-center/pages/insights.js",
  total_lines: lines.length,
  authority_counts: authorityCounts,
  event_binding_count: eventFindings.length,
  navigateTo_count: results.navigateTo?.length || 0,
  createProjectHandoff_count: results.createProjectHandoff?.length || 0,
  setSharedHandoff_count: results.setSharedHandoff?.length || 0,
  publish_mentions: results.publish?.length || 0,
  approval_mentions: results.approval?.length || 0,
  handoff_mentions: results.handoff?.length || 0,
  confirm_mentions: results.confirm?.length || 0
};

fs.writeFileSync(
  path.join(outDir, "T138_INSIGHTS_EXACT_ACTION_PATHS.json"),
  JSON.stringify({ summary, results }, null, 2)
);

function countRows(items) {
  return items.map((item) => `| ${item.term} | ${item.count} |`).join("\n");
}

function section(title, findings, limit = 16) {
  if (!findings.length) return [`## ${title}`, "", "No matches.", ""].join("\n");

  return [
    `## ${title}`,
    "",
    ...findings.slice(0, limit).map((match) => {
      const excerpt = match.excerpt.map((entry) => `${entry.line}: ${entry.text}`).join("\n");
      return [
        `### ${match.term} at line ${match.line}`,
        "",
        "```js",
        excerpt,
        "```",
        ""
      ].join("\n");
    })
  ].join("\n");
}

const md = [
  "# T138 — Insights Exact Action Path Audit",
  "",
  "## Status",
  "Generated.",
  "",
  "## Scope",
  "- `public/control-center/pages/insights.js`",
  "",
  "## Why this audit exists",
  "T135 identified `insights.js` as the next highest open runtime-risk file after closing Home.",
  "",
  "This audit does not patch anything. It inspects exact action paths before deciding whether a patch is required.",
  "",
  "## Summary",
  "",
  `- Total lines: ${summary.total_lines}`,
  `- Event bindings: ${summary.event_binding_count}`,
  `- navigateTo calls: ${summary.navigateTo_count}`,
  `- createProjectHandoff calls: ${summary.createProjectHandoff_count}`,
  `- setSharedHandoff calls: ${summary.setSharedHandoff_count}`,
  `- publish mentions: ${summary.publish_mentions}`,
  `- approval mentions: ${summary.approval_mentions}`,
  `- handoff mentions: ${summary.handoff_mentions}`,
  `- confirm mentions: ${summary.confirm_mentions}`,
  "",
  "## Authority Call Counts",
  "",
  "| Term | Count |",
  "|---|---:|",
  countRows(authorityCounts),
  "",
  section("Backend / Shared Authority Findings", [
    ...(results.createProjectHandoff || []),
    ...(results.createProjectApproval || []),
    ...(results.createProjectTask || []),
    ...(results.executeProjectAiCommand || []),
    ...(results.saveProject || []),
    ...(results.setSharedHandoff || []),
    ...(results.setSharedAiDraft || [])
  ]),
  section("Navigation Findings", results.navigateTo || []),
  section("Event Binding Findings", eventFindings),
  section("Confirmation Findings", results.confirm || []),
  section("Publish Mentions", results.publish || []),
  section("Approval Mentions", results.approval || []),
  section("Handoff Mentions", results.handoff || []),
  "## Decision Placeholder",
  "",
  "Classify after human review:",
  "",
  "- Safe / read-only insights surface",
  "- Needs confirmation before handoff",
  "- Needs shared handoff guard",
  "- Needs backend authority guard",
  "- Needs no patch",
  ""
].join("\n");

fs.writeFileSync(path.join(outDir, "T138_INSIGHTS_EXACT_ACTION_PATHS_AUDIT.md"), md);

console.log(JSON.stringify(summary, null, 2));
