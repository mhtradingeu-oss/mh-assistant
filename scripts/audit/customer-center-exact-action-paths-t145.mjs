import fs from "fs";
import path from "path";

const root = process.cwd();
const target = path.join(root, "public/control-center/pages/customer-center.js");
const outDir = path.join(root, "audits/system-truth/t145-customer-center-exact-action-paths");

const content = fs.readFileSync(target, "utf8");
const lines = content.split(/\r?\n/);

const terms = [
  "createProjectHandoff",
  "createProjectApproval",
  "createProjectTask",
  "executeProjectAiCommand",
  "saveProject",
  "saveProjectContentItem",
  "saveProjectMediaItem",
  "setSharedHandoff",
  "setSharedAiDraft",
  "navigateTo",
  "confirm",
  "window.confirm",
  "provider",
  "sync",
  "import",
  "customer",
  "handoff",
  "approval",
  "publish",
  "email",
  "message",
  "send",
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
  "saveProjectContentItem",
  "saveProjectMediaItem",
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
  file: "public/control-center/pages/customer-center.js",
  total_lines: lines.length,
  authority_counts: authorityCounts,
  event_binding_count: eventFindings.length,
  navigateTo_count: results.navigateTo?.length || 0,
  createProjectHandoff_count: results.createProjectHandoff?.length || 0,
  setSharedHandoff_count: results.setSharedHandoff?.length || 0,
  setSharedAiDraft_count: results.setSharedAiDraft?.length || 0,
  executeProjectAiCommand_count: results.executeProjectAiCommand?.length || 0,
  provider_mentions: results.provider?.length || 0,
  sync_mentions: results.sync?.length || 0,
  import_mentions: results.import?.length || 0,
  send_mentions: results.send?.length || 0,
  email_mentions: results.email?.length || 0,
  handoff_mentions: results.handoff?.length || 0,
  confirm_mentions: results.confirm?.length || 0
};

fs.writeFileSync(
  path.join(outDir, "T145_CUSTOMER_CENTER_EXACT_ACTION_PATHS.json"),
  JSON.stringify({ summary, results }, null, 2)
);

function rows(items) {
  return items.map((item) => `| ${item.term} | ${item.count} |`).join("\n");
}

function section(title, findings, limit = 18) {
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
  "# T145 — Customer Center Exact Action Path Audit",
  "",
  "## Status",
  "Generated.",
  "",
  "## Scope",
  "- `public/control-center/pages/customer-center.js`",
  "",
  "## Why this audit exists",
  "T135 identified `customer-center.js` as the next highest open runtime-risk file after Setup.",
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
  `- setSharedAiDraft calls: ${summary.setSharedAiDraft_count}`,
  `- executeProjectAiCommand calls: ${summary.executeProjectAiCommand_count}`,
  `- provider mentions: ${summary.provider_mentions}`,
  `- sync mentions: ${summary.sync_mentions}`,
  `- import mentions: ${summary.import_mentions}`,
  `- send mentions: ${summary.send_mentions}`,
  `- email mentions: ${summary.email_mentions}`,
  `- handoff mentions: ${summary.handoff_mentions}`,
  `- confirm mentions: ${summary.confirm_mentions}`,
  "",
  "## Authority Call Counts",
  "",
  "| Term | Count |",
  "|---|---:|",
  rows(authorityCounts),
  "",
  section("Backend / Shared Authority Findings", [
    ...(results.createProjectHandoff || []),
    ...(results.createProjectApproval || []),
    ...(results.createProjectTask || []),
    ...(results.executeProjectAiCommand || []),
    ...(results.saveProject || []),
    ...(results.saveProjectContentItem || []),
    ...(results.saveProjectMediaItem || []),
    ...(results.setSharedHandoff || []),
    ...(results.setSharedAiDraft || [])
  ]),
  section("Navigation Findings", results.navigateTo || []),
  section("Event Binding Findings", eventFindings),
  section("Confirmation Findings", results.confirm || []),
  section("Provider / Sync / Import Findings", [
    ...(results.provider || []),
    ...(results.sync || []),
    ...(results.import || [])
  ]),
  section("Send / Email / Message Findings", [
    ...(results.send || []),
    ...(results.email || []),
    ...(results.message || [])
  ]),
  section("Handoff Mentions", results.handoff || []),
  "## Decision Placeholder",
  "",
  "Classify after human review:",
  "",
  "- Safe / customer overview route-only",
  "- Needs confirmation before shared handoff",
  "- Needs confirmation before provider/customer sync",
  "- Needs confirmation before send/email action",
  "- Needs backend authority guard",
  "- Needs no patch",
  ""
].join("\n");

fs.writeFileSync(path.join(outDir, "T145_CUSTOMER_CENTER_EXACT_ACTION_PATHS_AUDIT.md"), md);

console.log(JSON.stringify(summary, null, 2));
