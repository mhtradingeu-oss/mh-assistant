import fs from "fs";
import path from "path";

const root = process.cwd();
const target = path.join(root, "public/control-center/pages/home.js");
const outDir = path.join(root, "audits/system-truth/t136-home-exact-action-paths");

const content = fs.readFileSync(target, "utf8");
const lines = content.split(/\r?\n/);

const terms = [
  "publish",
  "approval",
  "handoff",
  "navigateTo",
  "confirm",
  "window.confirm",
  "createProjectHandoff",
  "createProjectApproval",
  "createProjectTask",
  "executeProjectAiCommand",
  "setSharedHandoff",
  "setSharedAiDraft",
  "saveProject",
  "addEventListener",
  ".onclick",
  "onclick",
  "data-",
  "href",
  "route"
];

function snippets(term, radius = 4) {
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

const importedAuthorityCalls = [
  "createProjectHandoff",
  "createProjectApproval",
  "createProjectTask",
  "executeProjectAiCommand",
  "saveProject",
  "setSharedHandoff",
  "setSharedAiDraft"
];

const importFindings = importedAuthorityCalls.map((term) => ({
  term,
  count: results[term]?.length || 0
}));

const eventFindings = [
  ...results[".onclick"],
  ...results["onclick"],
  ...results["addEventListener"]
];

const navigationFindings = results.navigateTo || [];
const publishMentions = results.publish || [];
const approvalMentions = results.approval || [];
const handoffMentions = results.handoff || [];
const confirmMentions = results.confirm || [];

const summary = {
  file: "public/control-center/pages/home.js",
  total_lines: lines.length,
  imported_authority_calls: importFindings,
  event_binding_count: eventFindings.length,
  navigateTo_count: navigationFindings.length,
  publish_mentions: publishMentions.length,
  approval_mentions: approvalMentions.length,
  handoff_mentions: handoffMentions.length,
  confirm_mentions: confirmMentions.length
};

fs.writeFileSync(
  path.join(outDir, "T136_HOME_EXACT_ACTION_PATHS.json"),
  JSON.stringify({ summary, results }, null, 2)
);

function tableRows(findings) {
  return findings.map((item) => `| ${item.term} | ${item.count} |`).join("\n");
}

function section(title, findings, limit = 12) {
  const rows = findings.slice(0, limit).map((match) => {
    const excerpt = match.excerpt
      .map((entry) => `${entry.line}: ${entry.text}`)
      .join("\n");
    return [
      `### ${match.term} at line ${match.line}`,
      "",
      "```js",
      excerpt,
      "```",
      ""
    ].join("\n");
  }).join("\n");

  return [
    `## ${title}`,
    "",
    findings.length ? rows : "No matches.",
    ""
  ].join("\n");
}

const md = [
  "# T136 — Home Exact Action Path Audit",
  "",
  "## Status",
  "Generated.",
  "",
  "## Scope",
  "- `public/control-center/pages/home.js`",
  "",
  "## Why this audit exists",
  "T135 identified `home.js` as the highest remaining open runtime-risk file.",
  "",
  "This audit does not patch anything. It inspects exact action paths to determine whether the score is caused by real authority actions or by UI labels/navigation text.",
  "",
  "## Summary",
  "",
  `- Total lines: ${summary.total_lines}`,
  `- Event bindings: ${summary.event_binding_count}`,
  `- navigateTo calls: ${summary.navigateTo_count}`,
  `- publish mentions: ${summary.publish_mentions}`,
  `- approval mentions: ${summary.approval_mentions}`,
  `- handoff mentions: ${summary.handoff_mentions}`,
  `- confirm mentions: ${summary.confirm_mentions}`,
  "",
  "## Imported / Direct Authority Call Counts",
  "",
  "| Term | Count |",
  "|---|---:|",
  tableRows(importFindings),
  "",
  section("Navigation Findings", navigationFindings),
  section("Event Binding Findings", eventFindings),
  section("Publish Mentions", publishMentions),
  section("Approval Mentions", approvalMentions),
  section("Handoff Mentions", handoffMentions),
  section("Confirmation Mentions", confirmMentions),
  section("Shared Handoff / AI Draft Findings", [
    ...(results.setSharedHandoff || []),
    ...(results.setSharedAiDraft || [])
  ]),
  section("Backend Authority Call Findings", [
    ...(results.createProjectHandoff || []),
    ...(results.createProjectApproval || []),
    ...(results.createProjectTask || []),
    ...(results.executeProjectAiCommand || []),
    ...(results.saveProject || [])
  ]),
  "## Decision Placeholder",
  "",
  "Classify after human review:",
  "",
  "- Safe / route-only",
  "- Needs confirmation copy",
  "- Needs shared handoff guard",
  "- Needs backend authority guard",
  "- Needs no patch",
  ""
].join("\n");

fs.writeFileSync(path.join(outDir, "T136_HOME_EXACT_ACTION_PATHS_AUDIT.md"), md);

console.log(JSON.stringify(summary, null, 2));
