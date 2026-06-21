import fs from "fs";
import path from "path";

const root = process.cwd();
const pagesDir = path.join(root, "public/control-center/pages");
const outDir = path.join(root, "audits/system-truth/t88-remaining-frontend-risk-after-studio-research");

const closedFiles = new Set([
  "public/control-center/pages/home.js",
  "public/control-center/pages/setup.js",
  "public/control-center/pages/customer-center.js",
  "public/control-center/pages/insights.js",
  "public/control-center/pages/media-studio-workspace.js",
  "public/control-center/pages/content-studio-workspace.js",
  "public/control-center/pages/research.js"
]);

const excludedFiles = new Set([
  "public/control-center/pages/library/catalog-readiness.js",
  "public/control-center/pages/integrations/layout.js",
  "public/control-center/pages/integrations/state.js"
]);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (!entry.isFile() || !entry.name.endsWith(".js")) return [];
    return [full];
  });
}

function count(text, regex) {
  return (text.match(regex) || []).length;
}

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

const files = walk(pagesDir)
  .map((file) => {
    const relative = rel(file);
    const text = fs.readFileSync(file, "utf8");
    const lines = text.split(/\r?\n/).length;

    const metrics = {
      file: relative,
      lines,
      imports: count(text, /^import\s/gm),
      renderWrites: count(text, /innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/g),
      eventBindings: count(text, /addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/g),
      apiCalls: count(text, /fetchProject|createProject|saveProject|updateProject|deleteProject|executeProject|listProject|decideProject|approve|approval|handoff|task|source|library|publish|sync|import/g),
      aiSignals: count(text, /AI|ai|assistant|prompt|generate|execute|provider|model|recommend/g),
      mutationSignals: count(text, /save|create|update|delete|archive|submit|send|publish|approve|reject|sync|import|execute|run|trigger/g),
      confirmationSignals: count(text, /confirm\(/g),
      storageSignals: count(text, /localStorage|sessionStorage|setItem|getItem|draft|cache/g),
      handoffSignals: count(text, /handoff|setSharedHandoff|getSharedHandoff|destination_page|route_target/g),
      approvalSignals: count(text, /approval|approve|review|governance|decision|reject/g),
      taskSignals: count(text, /task|todo|next action|follow-up/g),
      riskyTerms: count(text, /publish|approve|send|execute|generate|provider|save|task|handoff|library|approval|delete|archive|sync|import|credential|token|access key|review|source/g)
    };

    const score =
      metrics.lines * 0.02 +
      metrics.renderWrites * 10 +
      metrics.eventBindings * 7 +
      metrics.apiCalls * 8 +
      metrics.aiSignals * 2.2 +
      metrics.mutationSignals * 3 +
      metrics.storageSignals * 2 +
      metrics.handoffSignals * 5 +
      metrics.approvalSignals * 4 +
      metrics.taskSignals * 3 +
      metrics.riskyTerms * 1.5 -
      metrics.confirmationSignals * 4;

    return {
      ...metrics,
      status: closedFiles.has(relative) ? "closed" : excludedFiles.has(relative) ? "excluded_removed_or_unused" : "open",
      score: Number(score.toFixed(2))
    };
  })
  .sort((a, b) => b.score - a.score);

const openFiles = files.filter((item) => item.status === "open");
const closed = files.filter((item) => item.status === "closed");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "remaining-risk-after-studio-research.json"), JSON.stringify({ files, openFiles, closed }, null, 2));

const md = `# T88 — Remaining Frontend Risk Rebaseline After Studio + Research

## Status
Audit-only. No production files changed.

## Purpose
Rebaseline remaining active frontend runtime risk after closing:

- Media Studio
- Content Studio
- Research

## Summary
- Total page JS files scanned: ${files.length}
- Closed files: ${closed.length}
- Open files: ${openFiles.length}

## Closed / Reviewed Files
${closed.map((item) => `- ${item.file}`).join("\n")}

## Top Remaining Open Files
${openFiles.slice(0, 20).map((item, index) => `### ${index + 1}. ${item.file}

- Score: ${item.score}
- Lines: ${item.lines}
- Render writes: ${item.renderWrites}
- Event bindings: ${item.eventBindings}
- API calls/signals: ${item.apiCalls}
- AI signals: ${item.aiSignals}
- Mutation signals: ${item.mutationSignals}
- Handoff signals: ${item.handoffSignals}
- Approval signals: ${item.approvalSignals}
- Task signals: ${item.taskSignals}
- Confirmation signals: ${item.confirmationSignals}
- Risky terms: ${item.riskyTerms}
`).join("\n")}

## Decision Rule
The next runtime-authority review should start from the highest-ranked open active routed page, unless it is proven inactive, duplicate, or helper-only.
`;

fs.writeFileSync(path.join(outDir, "T88_REMAINING_FRONTEND_RISK_REBASELINE_AFTER_STUDIO_RESEARCH.md"), md);

console.log("Generated T88 rebaseline");
console.log(`Open files: ${openFiles.length}`);
console.log("Top 10:");
openFiles.slice(0, 10).forEach((item, index) => {
  console.log(`${index + 1}. ${item.file} | score=${item.score} | lines=${item.lines}`);
});
