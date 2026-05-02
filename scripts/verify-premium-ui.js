#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const CC_DIR = path.join(ROOT, "public", "control-center");
const PAGES_DIR = path.join(CC_DIR, "pages");

const FILES = {
  index: path.join(CC_DIR, "index.html"),
  app: path.join(CC_DIR, "app.js"),
  router: path.join(CC_DIR, "router.js"),
  styles: path.join(CC_DIR, "styles.css"),
  standard: path.join(CC_DIR, "ui", "page-standard.js")
};

const REQUIRED_ROUTES = [
  "home",
  "setup",
  "library",
  "integrations",
  "ai-command",
  "workflows",
  "campaign-studio",
  "content-studio",
  "media-studio",
  "publishing",
  "ads-manager",
  "insights",
  "research",
  "settings"
];

const PAGE_TO_FILE = {
  home: "home.js",
  setup: "setup.js",
  library: "library.js",
  integrations: "integrations.js",
  "ai-command": "ai-command.js",
  workflows: "workflows.js",
  "campaign-studio": "campaign-studio.js",
  "content-studio": "content-studio-workspace.js",
  "media-studio": "media-studio-workspace.js",
  publishing: "publishing.js",
  "ads-manager": "ads-manager.js",
  insights: "insights.js",
  research: "research.js",
  settings: "settings.js"
};

const TOKEN_MARKERS = [
  "--color-bg-0",
  "--color-surface-0",
  "--color-primary",
  "--color-warning",
  "--color-danger",
  "--color-success",
  "--space-1",
  "--radius-sm",
  "--shadow-sm",
  "--font-size-page",
  "--card-min-height",
  "--button-height-md"
];

const BREAKPOINTS = ["1280px", "1024px", "768px", "640px", "480px"];

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function checkSyntax(filePath) {
  const run = cp.spawnSync("node", ["--check", filePath], { encoding: "utf8" });
  return {
    file: path.relative(ROOT, filePath),
    ok: run.status === 0,
    error: (run.stderr || run.stdout || "").trim()
  };
}

function parseSidebarRoutes(indexHtml) {
  const out = [];
  const re = /data-route="([^"]+)"/g;
  let m = re.exec(indexHtml);
  while (m) {
    out.push(m[1]);
    m = re.exec(indexHtml);
  }
  return out;
}

function report(checks) {
  const passCount = checks.filter((c) => c.pass).length;
  const failed = checks.filter((c) => !c.pass);

  const payload = {
    timestamp: new Date().toISOString(),
    passed: failed.length === 0,
    score: Number(((passCount / checks.length) * 10).toFixed(1)),
    checks,
    failed
  };

  process.stdout.write(JSON.stringify(payload, null, 2) + "\n");

  if (failed.length) {
    process.exitCode = 1;
  }
}

function main() {
  const checks = [];

  const missingCoreFiles = Object.entries(FILES)
    .filter(([, filePath]) => !exists(filePath))
    .map(([key]) => key);

  checks.push({
    id: "core_files_exist",
    pass: missingCoreFiles.length === 0,
    details: { missingCoreFiles }
  });

  const indexHtml = exists(FILES.index) ? read(FILES.index) : "";
  const appJs = exists(FILES.app) ? read(FILES.app) : "";
  const routerJs = exists(FILES.router) ? read(FILES.router) : "";
  const stylesCss = exists(FILES.styles) ? read(FILES.styles) : "";
  const standardJs = exists(FILES.standard) ? read(FILES.standard) : "";

  const missingPages = REQUIRED_ROUTES.filter((route) => {
    const file = PAGE_TO_FILE[route];
    return !exists(path.join(PAGES_DIR, file));
  });

  checks.push({
    id: "all_required_pages_exist",
    pass: missingPages.length === 0,
    details: { missingPages }
  });

  const missingRouterRefs = REQUIRED_ROUTES.filter((route) => !new RegExp(`\\b${escapeRegex(route)}\\b`).test(routerJs));
  checks.push({
    id: "all_routes_renderable",
    pass: missingRouterRefs.length === 0,
    details: { missingRouterRefs }
  });

  const missingTokens = TOKEN_MARKERS.filter((token) => !stylesCss.includes(token));
  checks.push({
    id: "styles_contain_design_tokens",
    pass: missingTokens.length === 0,
    details: { missingTokens }
  });

  const missingBreakpoints = BREAKPOINTS.filter((bp) => !stylesCss.includes(`max-width: ${bp}`));
  checks.push({
    id: "responsive_breakpoints_exist",
    pass: missingBreakpoints.length === 0,
    details: { missingBreakpoints }
  });

  const sidebarRoutes = parseSidebarRoutes(indexHtml);
  const duplicateSidebarRoutes = sidebarRoutes.filter((route, idx) => sidebarRoutes.indexOf(route) !== idx);
  checks.push({
    id: "no_duplicate_sidebar_entries",
    pass: duplicateSidebarRoutes.length === 0,
    details: { duplicateSidebarRoutes: [...new Set(duplicateSidebarRoutes)] }
  });

  const hardcodedProjectHits = [];
  const projectPattern = /hairoticmen|beauty-of-spirit|iwrite|smartaccounting/gi;
  const targets = [
    ["index.html", indexHtml],
    ["app.js", appJs],
    ["router.js", routerJs],
    ["styles.css", stylesCss],
    ["page-standard.js", standardJs]
  ];

  targets.forEach(([name, source]) => {
    if (projectPattern.test(source)) hardcodedProjectHits.push(name);
    projectPattern.lastIndex = 0;
  });

  checks.push({
    id: "no_hardcoded_project_names",
    pass: hardcodedProjectHits.length === 0,
    details: { hardcodedProjectHits }
  });

  const hasStandardLayout = /data-ui-role="page-header"/.test(standardJs) &&
    /data-ui-role="kpi-cards"/.test(standardJs) &&
    /data-ui-role="status-cards"/.test(standardJs) &&
    /data-ui-role="main-work-area"/.test(standardJs);

  checks.push({
    id: "page_standard_layout_exists",
    pass: hasStandardLayout,
    details: { hasStandardLayout }
  });

  const hasAiPanel = /data-ui-role="ai-panel"/.test(standardJs);
  checks.push({
    id: "ai_panel_exists",
    pass: hasAiPanel,
    details: { hasAiPanel }
  });

  const hasKpiAndStatusCards = /metric-card/.test(standardJs) && /status-card/.test(standardJs);
  checks.push({
    id: "kpi_status_cards_exist",
    pass: hasKpiAndStatusCards,
    details: { hasKpiAndStatusCards }
  });

  const hasStatePatterns = /loading-state/.test(standardJs) && /empty-state/.test(standardJs) && /error-state/.test(standardJs);
  checks.push({
    id: "empty_loading_error_states_exist",
    pass: hasStatePatterns,
    details: { hasStatePatterns }
  });

  const syntaxTargets = [
    FILES.app,
    FILES.router,
    FILES.standard,
    ...Object.values(PAGE_TO_FILE).map((f) => path.join(PAGES_DIR, f))
  ].filter(exists);

  const syntaxResults = syntaxTargets.map(checkSyntax);
  const syntaxFailures = syntaxResults.filter((result) => !result.ok);

  checks.push({
    id: "js_syntax_passes",
    pass: syntaxFailures.length === 0,
    details: { syntaxFailures }
  });

  const overflowRiskPatterns = [/\b100vw\b/g, /overflow-x\s*:\s*visible/g];
  const overflowHits = [];
  overflowRiskPatterns.forEach((re) => {
    if (re.test(stylesCss)) overflowHits.push(re.toString());
  });

  checks.push({
    id: "no_horizontal_overflow_risk_patterns",
    pass: overflowHits.length === 0,
    details: { overflowHits }
  });

  const mobileDrawerSignals =
    /\.sidebar\.is-open/.test(stylesCss) &&
    /sidebarBackdrop/.test(indexHtml) &&
    /Escape/.test(appJs);

  checks.push({
    id: "mobile_drawer_classes_exist",
    pass: mobileDrawerSignals,
    details: { mobileDrawerSignals }
  });

  report(checks);
}

main();
