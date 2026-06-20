import fs from "fs";
import path from "path";

const root = process.cwd();
const pagesDir = path.join(root, "public/control-center/pages");
const outDir = path.join(root, "audits/system-truth/t55-remaining-frontend-risk");

const closedTargets = new Map([
  ["workflows.js", "Workflows"],
  ["publishing.js", "Publishing"],
  ["library.js", "Library"],
  ["ai-command.js", "AI Command"],
  ["ai-command/tool-dock.js", "AI Command Tool Dock"],
  ["integrations.js", "Integrations"],
  ["settings.js", "Settings"],
  ["media-studio-workspace.js", "Media Studio Workspace"],
  ["governance.js", "Governance"],
  ["operations-centers.js", "Operations Centers"],
  ["content-studio-workspace.js", "Content Studio Workspace"]
]);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".js")) out.push(full);
  }
  return out;
}

function count(text, regex) {
  return (text.match(regex) || []).length;
}

function priority(score) {
  if (score >= 75) return "P0";
  if (score >= 40) return "P1";
  if (score >= 20) return "P2";
  return "P3";
}

const files = walk(pagesDir).sort();

const rows = files.map((full) => {
  const rel = path.relative(root, full);
  const pageRel = path.relative(pagesDir, full).replaceAll(path.sep, "/");
  const text = fs.readFileSync(full, "utf8");
  const lines = text.split(/\r?\n/).length;

  const innerHtml = count(text, /\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML/g);
  const events = count(text, /onclick|addEventListener|onchange|oninput|keydown|submit/g);
  const apiSignals = count(text, /\bfetch\s*\(|api\.|await\s+\w+\(|createProject|updateProject|deleteProject|saveProject|syncProject|importProject|decideProject|generate|publish|send|approval|task/gi);
  const authorityWords = count(text, /approve|approval|publish|send|sync|import|delete|archive|disconnect|reconnect|execute|run|generate|override|policy|governance|credential|provider|task|handoff/gi);
  const confirmation = count(text, /window\.confirm|confirm\(/g);
  const storage = count(text, /localStorage|sessionStorage/g);
  const escapeEvidence = count(text, /escapeHtml|textContent|sanitize|asString/g);

  const score = Number((
    innerHtml * 3.5 +
    events * 1.2 +
    apiSignals * 2.2 +
    authorityWords * 0.28 +
    storage * 2 +
    Math.max(0, 8 - confirmation) * 0.8 -
    Math.min(escapeEvidence, 40) * 0.12
  ).toFixed(1));

  return {
    rel,
    pageRel,
    closed: closedTargets.has(pageRel),
    closedLabel: closedTargets.get(pageRel) || "",
    lines,
    innerHtml,
    events,
    apiSignals,
    authorityWords,
    confirmation,
    storage,
    escapeEvidence,
    score,
    priority: priority(score)
  };
});

const openRows = rows.filter((row) => !row.closed).sort((a, b) => b.score - a.score);
const closedRows = rows.filter((row) => row.closed).sort((a, b) => b.score - a.score);
const next = openRows[0];

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "t55-remaining-frontend-risk.json"),
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      closedTargets: Array.from(closedTargets.entries()),
      nextCandidate: next || null,
      rows
    },
    null,
    2
  )
);

function table(rowsToRender) {
  return rowsToRender.map((row, index) => (
    `| ${index + 1} | ${row.priority} | ${row.score} | \`${row.rel}\` | ${row.lines} | ${row.innerHtml} | ${row.events} | ${row.apiSignals} | ${row.authorityWords} | ${row.confirmation} | ${row.storage} | ${row.escapeEvidence} |`
  )).join("\n");
}

const md = `# T55 — Remaining Frontend Risk Rebaseline After Content Studio Closeout

## Status
Audit-only. No production files changed.

## Purpose
Rebaseline remaining frontend page risk after closing Content Studio runtime authority.

## Closed Targets
${Array.from(closedTargets.values()).map((label) => `- ${label}`).join("\n")}

## Counts
- Total page JS files: ${rows.length}
- Closed targets excluded from next-page ranking: ${closedRows.length}
- Remaining open page JS files: ${openRows.length}

## Next Candidate
- File: \`${next?.rel || "n/a"}\`
- Priority: ${next?.priority || "n/a"}
- Score: ${next?.score || "n/a"}
- Lines: ${next?.lines || "n/a"}
- innerHTML: ${next?.innerHtml || "n/a"}
- Events: ${next?.events || "n/a"}
- API/write signals: ${next?.apiSignals || "n/a"}
- Authority words: ${next?.authorityWords || "n/a"}
- Confirmations: ${next?.confirmation || "n/a"}
- Storage: ${next?.storage || "n/a"}
- Escape evidence: ${next?.escapeEvidence || "n/a"}

## Closed Targets Snapshot

| Rank | Priority | Score | File | Lines | innerHTML | Events | API/write signals | Authority words | Confirmations | Storage | Escape evidence |
|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|
${table(closedRows)}

## Remaining Open Page Ranking

| Rank | Priority | Score | File | Lines | innerHTML | Events | API/write signals | Authority words | Confirmations | Storage | Escape evidence |
|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|
${table(openRows.slice(0, 25))}

## Suggested Next Step
Start with the highest remaining P0/P1 page from the open ranking, audit-only first.

## Notes
This score is a heuristic prioritization model, not a security verdict.
Use exact focused audits before any patch.
Do not patch from T55 alone.
`;

fs.writeFileSync(
  path.join(outDir, "T55_REMAINING_FRONTEND_RISK_REBASELINE.md"),
  md
);

console.log("Generated audits/system-truth/t55-remaining-frontend-risk/T55_REMAINING_FRONTEND_RISK_REBASELINE.md");
