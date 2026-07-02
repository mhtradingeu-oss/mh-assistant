import fs from "fs";
import path from "path";

const root = process.cwd();
const outDir = path.join(root, "audits/system-truth/terminal-audit");

function read(file) {
  try {
    return fs.readFileSync(path.join(root, file), "utf8");
  } catch {
    return "";
  }
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function walk(dir, exts = []) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  const results = [];
  const stack = [full];

  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const p = path.join(current, entry.name);
      const rel = path.relative(root, p);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git") continue;
        stack.push(p);
      } else if (!exts.length || exts.some(ext => entry.name.endsWith(ext))) {
        results.push(rel);
      }
    }
  }

  return results.sort();
}

function count(pattern, text) {
  const m = text.match(pattern);
  return m ? m.length : 0;
}

function grepLines(text, regex) {
  return text
    .split(/\r?\n/)
    .map((line, i) => ({ line: i + 1, text: line }))
    .filter(item => regex.test(item.text));
}

function lineCount(text) {
  if (!text) return 0;
  return text.split(/\r?\n/).length;
}

function statusFromRisk(score) {
  if (score >= 18) return "P0";
  if (score >= 10) return "P1";
  if (score >= 5) return "P2";
  return "P3";
}

function escapeMd(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

const frontendPages = walk("public/control-center/pages", [".js"]);
const frontendCore = walk("public/control-center", [".js"]).filter(file => !file.includes("/pages/"));
const cssFiles = walk("public/control-center", [".css"]);
const backendFiles = walk("runtime/orchestrator-service", [".js"]);
const dataFiles = walk("data", [".json", ".md", ".txt"]);

const pageReports = frontendPages.map(file => {
  const text = read(file);
  const apiRefs = grepLines(text, /fetchProject|executeProject|updateProject|saveProject|refreshProject|uploadProject|createProject|deleteProject/);
  const risks = {
    documentListeners: count(/document\.addEventListener/g, text),
    windowListeners: count(/window\.addEventListener/g, text),
    timers: count(/setTimeout|setInterval|requestAnimationFrame/g, text),
    autoMode: count(/AutoMode|startAutoMode|subscribeAutoMode|createAutoModeController/g, text),
    directClicks: count(/\.onclick\s*=|addEventListener\(["']click/g, text),
    innerHTML: count(/innerHTML\s*=/g, text),
    confirms: count(/confirm\s*\(/g, text),
    localStorage: count(/localStorage|sessionStorage/g, text)
  };

  const riskScore =
    risks.autoMode * 5 +
    risks.documentListeners * 4 +
    risks.windowListeners * 3 +
    risks.timers * 3 +
    risks.innerHTML * 2 +
    Math.min(risks.directClicks, 20) * 0.5 +
    Math.max(0, lineCount(text) - 1500) / 200;

  const imports = grepLines(text, /^import\s+/);
  const exports = grepLines(text, /^export\s+/);
  const hasDisableStandardLayout = /disableStandardLayout\s*:\s*true/.test(text);
  const hasRender = /render\s*\(|render\s*:/.test(text);
  const hasAi = /AI|Ai|ai-|assistant|command|team/i.test(text);
  const hasActionPanel = /Action Panel|action-panel|ActionPanel|action panel/i.test(text);
  const hasApi = apiRefs.length > 0;

  return {
    file,
    lines: lineCount(text),
    imports: imports.length,
    exports: exports.length,
    apiRefs: apiRefs.length,
    hasApi,
    hasAi,
    hasActionPanel,
    hasRender,
    hasDisableStandardLayout,
    risks,
    riskScore: Math.round(riskScore * 10) / 10,
    priority: statusFromRisk(riskScore)
  };
});

const backendRouteText = read("runtime/orchestrator-service/server.js");
const backendRoutes = grepLines(backendRouteText, /app\.(get|post|put|patch|delete)\s*\(/);
const backendCapabilityPatterns = [
  ["governance", /governance/gi],
  ["approval", /approval|approve|rejected|pending/gi],
  ["handoff", /handoff/gi],
  ["workflow", /workflow/gi],
  ["campaign", /campaign/gi],
  ["publishing", /publishing|publish/gi],
  ["learning", /learning|recommendation|insight/gi],
  ["integration", /integration|provider|connector/gi],
  ["media", /media|asset|upload/gi],
  ["security", /permission|auth|token|write_key|rate|guard/gi]
];

const backendCapabilities = backendCapabilityPatterns.map(([name, regex]) => ({
  capability: name,
  serverHits: count(regex, backendRouteText),
  libHits: backendFiles.reduce((sum, f) => sum + count(regex, read(f)), 0)
}));

const cssReports = cssFiles.map(file => {
  const text = read(file);
  return {
    file,
    lines: lineCount(text),
    topbar: count(/topbar/g, text),
    card: count(/card/g, text),
    panel: count(/panel/g, text),
    workspace: count(/workspace/g, text),
    library: count(/library/g, text),
    settings: count(/settings/g, text),
    publishing: count(/publishing/g, text),
    governance: count(/governance/g, text),
    operations: count(/operations/g, text),
    mediaQueries: count(/@media/g, text)
  };
});

const apiText = read("public/control-center/api.js");
const apiFunctions = grepLines(apiText, /export\s+async\s+function|export\s+function|async\s+function/);

const validationTargets = [
  "public/control-center/app.js",
  "public/control-center/router.js",
  "runtime/orchestrator-service/server.js"
];

const missingCore = [
  "public/control-center/app.js",
  "public/control-center/router.js",
  "public/control-center/api.js",
  "public/control-center/index.html",
  "runtime/orchestrator-service/server.js"
].filter(file => !exists(file));

const pageTable = pageReports
  .sort((a, b) => b.riskScore - a.riskScore)
  .map(p => `| ${escapeMd(p.file)} | ${p.lines} | ${p.apiRefs} | ${p.riskScore} | ${p.priority} | ${p.risks.autoMode} | ${p.risks.documentListeners + p.risks.windowListeners} | ${p.risks.timers} | ${p.risks.innerHTML} |`)
  .join("\n");

const capabilityRows = backendCapabilities.map(c => {
  const frontendHits = pageReports.filter(p => {
    const t = read(p.file);
    return new RegExp(c.capability, "i").test(t);
  }).length;

  const status =
    c.serverHits + c.libHits > 0 && frontendHits > 0 ? "partial/connected" :
    c.serverHits + c.libHits > 0 ? "backend-present / frontend-hidden-or-unclear" :
    "not-evidenced";

  return `| ${c.capability} | ${c.serverHits} | ${c.libHits} | ${frontendHits} | ${status} |`;
}).join("\n");

const cssRows = cssReports
  .sort((a, b) => b.lines - a.lines)
  .map(c => `| ${escapeMd(c.file)} | ${c.lines} | ${c.topbar} | ${c.card} | ${c.panel} | ${c.workspace} | ${c.mediaQueries} |`)
  .join("\n");

const highRiskPages = pageReports.filter(p => p.priority === "P0" || p.priority === "P1");
const largestPages = [...pageReports].sort((a, b) => b.lines - a.lines).slice(0, 12);

const auditMd = `# Terminal Full App Deep Truth Audit

## Status
Generated by terminal-only audit script.

## Repository
- Root: \`${root}\`
- Missing core files: ${missingCore.length ? missingCore.map(f => `\`${f}\``).join(", ") : "None detected"}

## Executive Truth Summary
This report is evidence-based and generated from repository scans only. It does not claim business readiness by itself. It identifies file structure, backend route presence, frontend API usage, risk patterns, CSS density, and likely areas requiring phased review.

## Current Baseline
- Frontend page files: ${frontendPages.length}
- Frontend core JS files: ${frontendCore.length}
- CSS files: ${cssFiles.length}
- Backend JS files: ${backendFiles.length}
- Backend routes detected: ${backendRoutes.length}
- API functions detected in api.js: ${apiFunctions.length}
- Data files detected: ${dataFiles.length}

## Highest Risk Frontend Pages
| Page | Lines | API refs | Risk Score | Priority | AutoMode refs | Global listeners | Timers | innerHTML |
|---|---:|---:|---:|---|---:|---:|---:|---:|
${pageTable}

## Largest Pages
${largestPages.map(p => `- \`${p.file}\` — ${p.lines} lines, risk ${p.riskScore} (${p.priority})`).join("\n")}

## Backend Capability Reality
| Capability | server.js hits | lib hits | frontend page hits | Status |
|---|---:|---:|---:|---|
${capabilityRows}

## CSS / UI Density Reality
| CSS file | Lines | topbar | card | panel | workspace | media queries |
|---|---:|---:|---:|---:|---:|---:|
${cssRows}

## Authority / Runtime Risk Indicators
High-risk indicators found by scan:
- AutoMode references: ${pageReports.reduce((s, p) => s + p.risks.autoMode, 0)}
- document/window listeners: ${pageReports.reduce((s, p) => s + p.risks.documentListeners + p.risks.windowListeners, 0)}
- timers/animation refs: ${pageReports.reduce((s, p) => s + p.risks.timers, 0)}
- innerHTML writes: ${pageReports.reduce((s, p) => s + p.risks.innerHTML, 0)}
- direct click bindings: ${pageReports.reduce((s, p) => s + p.risks.directClicks, 0)}

## What Looks Strong
- Backend route surface exists if route count is high.
- api.js appears to expose a central API layer if API function count is non-zero.
- Pages with API refs are likely connected to backend/project data.
- Evidence pack exists and can be used for phased decisions.

## What Needs Manual Review
- Any P0/P1 page in this report.
- Any page with AutoMode references.
- Any page with document/window listeners.
- Any large page above 1800 lines.
- Any CSS file with repeated page-specific selectors.
- Any capability marked backend-present / frontend-hidden-or-unclear.

## What Must Not Be Done
- Do not mass-refactor all pages.
- Do not add another global CSS layer over existing drift.
- Do not fake backend execution from frontend.
- Do not remove confirmation gates.
- Do not change IDs, data attributes, or handlers without targeted audit.
- Do not convert planned features into “complete” without backend and UI proof.

## Honest Readiness Statement
The terminal scan can prove structure, risk patterns, and evidence of capabilities. It cannot prove full product readiness without browser QA, runtime API checks, and page-by-page user-flow tests. The app should be completed phase by phase.
`;

const matrixMd = `# Terminal Capability Matrix

## Capability Matrix
| Capability | server.js hits | lib hits | frontend page hits | Status |
|---|---:|---:|---:|---|
${capabilityRows}

## Page Matrix
| Page | Lines | API refs | Has AI refs | Has Action Panel refs | disableStandardLayout | Risk | Priority |
|---|---:|---:|---|---|---|---:|---|
${pageReports
  .sort((a, b) => a.file.localeCompare(b.file))
  .map(p => `| ${escapeMd(p.file)} | ${p.lines} | ${p.apiRefs} | ${p.hasAi ? "yes" : "no"} | ${p.hasActionPanel ? "yes" : "no"} | ${p.hasDisableStandardLayout ? "yes" : "no"} | ${p.riskScore} | ${p.priority} |`)
  .join("\n")}

## Recommended Classification
- P0: audit before touching; likely authority/runtime risk.
- P1: targeted page truth audit before UX polish.
- P2: safe improvement candidate after validation.
- P3: likely low risk, but still requires normal QA.
`;

const planMd = `# Terminal Remaining Work Plan

## Rule
Continue without Codex using terminal evidence, targeted diffs, and page-by-page implementation. No broad patches.

## Phase 0 — Clean State
Goal: keep repository clean before each phase.
Commands:
\`\`\`bash
git status --short
git branch --show-current
git log --oneline -8
\`\`\`
Completion:
- Working tree clean or only intentional audit files.

## Phase 1 — Authority and Runtime Safety
Scope:
- P0/P1 pages from Terminal audit.
- AutoMode references.
- document/window listeners.
- timers.
- frontend-owned authority assumptions.

Do not touch:
- Backend authority.
- data/projects.
- CSS redesign.

Validation:
\`\`\`bash
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check runtime/orchestrator-service/server.js
\`\`\`

Completion:
- Risk source documented.
- Any fix is isolated and committed separately.

## Phase 2 — Global UI Contract and CSS Consolidation
Scope:
- CSS scan results.
- Global shell/header/action panel primitives.
- Repeated page-specific CSS blocks.

Do not:
- Add random CSS overrides.
- Fix one page by damaging global layout.

Completion:
- Global UI rules documented.
- One page at a time adopts clean primitives.

## Phase 3 — Page-by-Page Finalization
Order:
1. Home
2. Setup
3. Library
4. Integrations
5. AI Command
6. Workflows
7. Publishing
8. Operations Centers
9. Governance
10. Settings
11. Campaign Studio
12. Content Studio
13. Media Studio
14. Ads Manager
15. Insights
16. Research

For each page:
- Page truth audit
- API relationship audit
- UX final blueprint
- Safe implementation
- Browser QA
- Closeout

## Phase 4 — Missing Capability Closure
Use capability matrix to find backend-present but frontend-hidden capabilities and frontend-present but backend-missing features.

Rule:
- If backend does not exist, document missing backend.
- Do not fake execution in frontend.

## Phase 5 — Browser QA and Regression Proof
Required:
- Desktop
- Tablet
- Mobile
- Navigation
- Empty states
- Loading states
- Action confirmation
- AI handoff clarity

## Phase 6 — Release Readiness
Required:
- node checks
- route checks
- smoke tests if available
- browser QA proof
- clean git status
- release checklist

## Phase 7 — Production Operations
Required:
- service health
- logs
- backups
- rollback plan
- monitoring evidence

## Immediate Next Step
Review:
\`\`\`bash
cat audits/system-truth/terminal-audit/TERMINAL_FULL_APP_DEEP_TRUTH_AUDIT.md
cat audits/system-truth/terminal-audit/TERMINAL_CAPABILITY_MATRIX.md
cat audits/system-truth/terminal-audit/TERMINAL_REMAINING_WORK_PLAN.md
\`\`\`

Then choose the highest P0/P1 page for a targeted audit.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "TERMINAL_FULL_APP_DEEP_TRUTH_AUDIT.md"), auditMd);
fs.writeFileSync(path.join(outDir, "TERMINAL_CAPABILITY_MATRIX.md"), matrixMd);
fs.writeFileSync(path.join(outDir, "TERMINAL_REMAINING_WORK_PLAN.md"), planMd);
fs.writeFileSync(path.join(outDir, "terminal-page-risk.json"), JSON.stringify(pageReports, null, 2));
fs.writeFileSync(path.join(outDir, "terminal-backend-capabilities.json"), JSON.stringify(backendCapabilities, null, 2));
fs.writeFileSync(path.join(outDir, "terminal-css-density.json"), JSON.stringify(cssReports, null, 2));

console.log("Generated terminal audit reports:");
console.log(path.relative(root, path.join(outDir, "TERMINAL_FULL_APP_DEEP_TRUTH_AUDIT.md")));
console.log(path.relative(root, path.join(outDir, "TERMINAL_CAPABILITY_MATRIX.md")));
console.log(path.relative(root, path.join(outDir, "TERMINAL_REMAINING_WORK_PLAN.md")));
console.log(path.relative(root, path.join(outDir, "terminal-page-risk.json")));
console.log(path.relative(root, path.join(outDir, "terminal-backend-capabilities.json")));
console.log(path.relative(root, path.join(outDir, "terminal-css-density.json")));
