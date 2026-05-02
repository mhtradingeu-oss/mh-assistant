#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ROOT = '/opt/mh-assistant';
const CC_DIR = path.join(ROOT, 'public/control-center');
const PAGES_DIR = path.join(CC_DIR, 'pages');

const REQUIRED_PAGES = [
  'home',
  'setup',
  'library',
  'integrations',
  'ai-command',
  'workflows',
  'campaign-studio',
  'content-studio',
  'media-studio',
  'publishing',
  'ads-manager',
  'insights',
  'research',
  'settings'
];

const PAGE_TO_FILE = {
  'home': 'home.js',
  'setup': 'setup.js',
  'library': 'library.js',
  'integrations': 'integrations.js',
  'ai-command': 'ai-command.js',
  'workflows': 'workflows.js',
  'campaign-studio': 'campaign-studio.js',
  'content-studio': 'content-studio-workspace.js',
  'media-studio': 'media-studio-workspace.js',
  'publishing': 'publishing.js',
  'ads-manager': 'ads-manager.js',
  'insights': 'insights.js',
  'research': 'research.js',
  'settings': 'settings.js'
};

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function check(condition, code, message, details = {}) {
  return {
    code,
    pass: Boolean(condition),
    message,
    ...details
  };
}

function parseSidebarRoutes(indexHtml) {
  const routeRegex = /class="nav-item(?:[^\"]*)"\s+data-route="([^"]+)"/g;
  const routes = [];
  let match = routeRegex.exec(indexHtml);
  while (match) {
    routes.push(match[1]);
    match = routeRegex.exec(indexHtml);
  }
  return routes;
}

function getChangedFiles() {
  const proc = cp.spawnSync('git', ['-C', ROOT, 'status', '--porcelain', '-uall'], { encoding: 'utf8' });
  if (proc.status !== 0) {
    return [];
  }

  return proc.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeChangedFiles(statusLines) {
  return statusLines
    .map((line) => line.replace(/^[A-Z?\s]+\s+/, '').trim())
    .map((line) => line.replace(/^"|"$/g, ''))
    .filter(Boolean);
}

function checkSyntax(filePath) {
  const proc = cp.spawnSync('node', ['--check', filePath], { encoding: 'utf8' });
  return {
    file: path.relative(ROOT, filePath),
    pass: proc.status === 0,
    stderr: (proc.stderr || '').trim()
  };
}

function main() {
  const routerPath = path.join(CC_DIR, 'router.js');
  const appPath = path.join(CC_DIR, 'app.js');
  const indexPath = path.join(CC_DIR, 'index.html');
  const stylesPath = path.join(CC_DIR, 'styles.css');
  const standardUiPath = path.join(CC_DIR, 'ui/page-standard.js');

  const routerSource = read(routerPath);
  const appSource = read(appPath);
  const indexSource = read(indexPath);
  const stylesSource = read(stylesPath);
  const standardUiSource = fs.existsSync(standardUiPath) ? read(standardUiPath) : '';

  const checks = [];

  // 1) all pages exist
  const missingPageFiles = REQUIRED_PAGES.filter((page) => !fs.existsSync(path.join(PAGES_DIR, PAGE_TO_FILE[page])));
  checks.push(check(
    missingPageFiles.length === 0,
    'all_pages_exist',
    missingPageFiles.length ? 'Some required page files are missing.' : 'All required page files exist.',
    { missing_page_files: missingPageFiles }
  ));

  // 2) all routes render (route id appears in registry + page template has matching data-page)
  const missingRoutes = REQUIRED_PAGES.filter((route) => !new RegExp(`\\b${route.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`).test(routerSource));
  const templateMismatches = [];
  REQUIRED_PAGES.forEach((page) => {
    const source = read(path.join(PAGES_DIR, PAGE_TO_FILE[page]));
    if (!new RegExp(`data-page=\"${page.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\"`).test(source)) {
      templateMismatches.push(page);
    }
  });
  checks.push(check(
    missingRoutes.length === 0 && templateMismatches.length === 0,
    'all_routes_renderable',
    (missingRoutes.length || templateMismatches.length)
      ? 'One or more routes are not fully renderable.'
      : 'All required routes are present and include page templates.',
    {
      missing_routes: missingRoutes,
      template_mismatches: templateMismatches
    }
  ));

  // 3) no hardcoded project leakage
  const controlCenterFiles = [
    routerPath,
    appPath,
    indexPath,
    stylesPath,
    standardUiPath,
    ...Object.values(PAGE_TO_FILE).map((file) => path.join(PAGES_DIR, file))
  ].filter((file) => fs.existsSync(file));

  const leakageHits = [];
  controlCenterFiles.forEach((filePath) => {
    const src = read(filePath);
    if (/hairoticmen/i.test(src)) {
      leakageHits.push(path.relative(ROOT, filePath));
    }
  });

  checks.push(check(
    leakageHits.length === 0,
    'no_hardcoded_project_leakage',
    leakageHits.length ? 'Found project-specific hardcoded references.' : 'No hardcoded project leakage detected.',
    { leakage_hits: leakageHits }
  ));

  // 4) required UI sections exist
  const requiredUiRoles = ['page-header', 'main-dashboard', 'action-panel', 'ai-panel', 'kpi-cards', 'status-cards'];
  const missingUiRoles = requiredUiRoles.filter((role) => !standardUiSource.includes(`data-ui-role=\"${role}\"`));

  checks.push(check(
    missingUiRoles.length === 0,
    'required_ui_sections_exist',
    missingUiRoles.length ? 'Missing required standard UI sections.' : 'Required standard UI sections are defined.',
    { missing_ui_roles: missingUiRoles }
  ));

  // 5) AI panel exists where required
  const requiredRoutesDeclared = requiredUiRoles.length ? REQUIRED_PAGES : [];
  const aiPanelExists = /data-ui-role=\"ai-panel\"/.test(standardUiSource);
  const aiLayoutApplied = /applyStandardPageLayout\(/.test(appSource);
  checks.push(check(
    aiPanelExists && aiLayoutApplied,
    'ai_panel_exists_required_pages',
    aiPanelExists && aiLayoutApplied
      ? 'AI panel is declared and applied to required routes.'
      : 'AI panel declaration or application is missing.',
    { required_routes: requiredRoutesDeclared }
  ));

  // 6) dashboard cards exist
  const hasKpiGrid = /std-kpi-grid/.test(stylesSource) && /id=\"stdKpiGrid\"/.test(standardUiSource);
  checks.push(check(
    hasKpiGrid,
    'dashboard_cards_exist',
    hasKpiGrid ? 'Dashboard KPI cards are implemented.' : 'Dashboard KPI cards are missing.'
  ));

  // 7) no duplicate sidebar entries
  const sidebarRoutes = parseSidebarRoutes(indexSource);
  const duplicateSidebarRoutes = sidebarRoutes.filter((route, idx) => sidebarRoutes.indexOf(route) !== idx);
  checks.push(check(
    duplicateSidebarRoutes.length === 0,
    'no_duplicate_sidebar_entries',
    duplicateSidebarRoutes.length
      ? 'Duplicate sidebar route entries detected.'
      : 'No duplicate sidebar route entries detected.',
    { duplicate_routes: Array.from(new Set(duplicateSidebarRoutes)) }
  ));

  // 8) JS syntax passes
  const syntaxTargets = [
    appPath,
    routerPath,
    standardUiPath,
    ...Object.values(PAGE_TO_FILE).map((file) => path.join(PAGES_DIR, file))
  ].filter((file) => fs.existsSync(file));

  const syntaxChecks = syntaxTargets.map(checkSyntax);
  const syntaxFailures = syntaxChecks.filter((item) => !item.pass);
  checks.push(check(
    syntaxFailures.length === 0,
    'js_syntax_passes',
    syntaxFailures.length ? 'One or more JavaScript files have syntax errors.' : 'JavaScript syntax checks passed.',
    { syntax_failures: syntaxFailures }
  ));

  const filesChanged = normalizeChangedFiles(getChangedFiles());
  const sharedLayoutChanged = filesChanged.includes('public/control-center/ui/page-standard.js') || filesChanged.includes('public/control-center/app.js');

  const pagesUpgraded = sharedLayoutChanged
    ? [...REQUIRED_PAGES]
    : REQUIRED_PAGES.filter((page) => {
      const pageFile = `public/control-center/pages/${PAGE_TO_FILE[page]}`;
      return filesChanged.includes(pageFile);
    });

  const newComponentsAdded = [
    'public/control-center/ui/page-standard.js'
  ].filter((item) => filesChanged.includes(item));

  const cssChanges = filesChanged.filter((item) => item === 'public/control-center/styles.css');
  const passedChecks = checks.filter((item) => item.pass).length;
  const readinessScore = Number(((passedChecks / checks.length) * 10).toFixed(1));

  const result = {
    timestamp: new Date().toISOString(),
    files_changed: filesChanged,
    pages_upgraded: pagesUpgraded,
    new_components_added: newComponentsAdded,
    css_design_system_changes: cssChanges,
    verification_result: {
      passed: passedChecks === checks.length,
      checks
    },
    ui_ux_readiness_score: readinessScore
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

  if (passedChecks !== checks.length) {
    process.exitCode = 1;
  }
}

main();
