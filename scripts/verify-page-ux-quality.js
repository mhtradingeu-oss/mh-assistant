#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ROOT = process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '..');
const CC_DIR = path.join(ROOT, 'public/control-center');
const PAGES_DIR = path.join(CC_DIR, 'pages');
const STANDARD_UI = path.join(CC_DIR, 'ui/page-standard.js');
const INDEX_HTML = path.join(CC_DIR, 'index.html');
const STYLES = path.join(CC_DIR, 'styles.css');

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
  home: 'home.js',
  setup: 'setup.js',
  library: 'library.js',
  integrations: 'integrations.js',
  'ai-command': 'ai-command.js',
  workflows: 'workflows.js',
  'campaign-studio': 'campaign-studio.js',
  'content-studio': 'content-studio-workspace.js',
  'media-studio': 'media-studio-workspace.js',
  publishing: 'publishing.js',
  'ads-manager': 'ads-manager.js',
  insights: 'insights.js',
  research: 'research.js',
  settings: 'settings.js'
};

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function rel(filePath) {
  return path.relative(ROOT, filePath);
}

function escRe(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function objectKey(route) {
  return route.includes('-') ? `"${route}"` : route;
}

function findRouteArray(source, constName, route) {
  const constStart = source.indexOf(`const ${constName}`);
  if (constStart < 0) return '';
  const afterConst = source.slice(constStart);
  const key = escRe(objectKey(route));
  const match = new RegExp(`${key}\\s*:\\s*\\[([\\s\\S]*?)\\n\\s*\\]`, 'm').exec(afterConst);
  return match ? match[1] : '';
}

function findRouteObject(source, constName, route) {
  const constStart = source.indexOf(`const ${constName}`);
  if (constStart < 0) return '';
  const afterConst = source.slice(constStart);
  const key = escRe(objectKey(route));
  const match = new RegExp(`${key}\\s*:\\s*\\{([\\s\\S]*?)\\n\\s*\\}`, 'm').exec(afterConst);
  return match ? match[1] : '';
}

function parseSidebarRoutes(indexSource) {
  const routes = [];
  const re = /class="nav-item(?:[^"]*)"\s+data-route="([^"]+)"/g;
  let match = re.exec(indexSource);
  while (match) {
    routes.push(match[1]);
    match = re.exec(indexSource);
  }
  return routes;
}

function checkSyntax(filePath) {
  const proc = cp.spawnSync('node', ['--check', filePath], { encoding: 'utf8' });
  return {
    file: rel(filePath),
    pass: proc.status === 0,
    stderr: (proc.stderr || '').trim()
  };
}

function result(pass, code, message, details = {}) {
  return { pass: Boolean(pass), code, message, ...details };
}

function listControlCenterFiles() {
  const pageFiles = Object.values(PAGE_TO_FILE).map((file) => path.join(PAGES_DIR, file));
  return [
    path.join(CC_DIR, 'app.js'),
    path.join(CC_DIR, 'router.js'),
    path.join(CC_DIR, 'index.html'),
    path.join(CC_DIR, 'styles.css'),
    STANDARD_UI,
    ...pageFiles
  ].filter((file) => fs.existsSync(file));
}

function main() {
  const standardSource = read(STANDARD_UI);
  const stylesSource = read(STYLES);
  const indexSource = read(INDEX_HTML);
  const files = listControlCenterFiles();
  const checks = [];

  const genericPhrases = [
    'What Can I Do Now?',
    'What Can AI Do Here?',
    'State Feedback'
  ];
  const genericHits = [];
  files.forEach((file) => {
    const source = read(file);
    genericPhrases.forEach((phrase) => {
      if (source.includes(phrase)) genericHits.push({ file: rel(file), phrase });
    });
  });
  checks.push(result(
    genericHits.length === 0,
    'no_generic_repeated_bottom_blocks',
    genericHits.length ? 'Generic repeated bottom blocks remain.' : 'No generic repeated bottom blocks remain.',
    { generic_hits: genericHits }
  ));

  const missingActionPages = [];
  const weakActionPages = [];
  REQUIRED_PAGES.forEach((route) => {
    const block = findRouteArray(standardSource, 'ROUTE_ACTIONS', route);
    const labels = [...block.matchAll(/label:\s*"([^"]+)"/g)].map((item) => item[1]);
    if (!block) missingActionPages.push(route);
    if (block && new Set(labels).size < 3) weakActionPages.push(route);
  });
  checks.push(result(
    missingActionPages.length === 0 && weakActionPages.length === 0,
    'page_specific_power_actions',
    missingActionPages.length || weakActionPages.length
      ? 'Some pages are missing page-specific power actions.'
      : 'Every page has page-specific power actions.',
    { missing_action_pages: missingActionPages, weak_action_pages: weakActionPages }
  ));

  const missingAiPages = [];
  const weakAiPages = [];
  REQUIRED_PAGES.forEach((route) => {
    const block = findRouteObject(standardSource, 'ROUTE_AI', route);
    const promptCount = [...block.matchAll(/"[^"]+"/g)].length;
    if (!block) missingAiPages.push(route);
    if (block && (!/title:\s*"/.test(block) || !/description:\s*"/.test(block) || promptCount < 4)) weakAiPages.push(route);
  });
  checks.push(result(
    missingAiPages.length === 0 && weakAiPages.length === 0,
    'contextual_ai_actions',
    missingAiPages.length || weakAiPages.length
      ? 'Some pages are missing contextual AI actions.'
      : 'Every page has contextual AI actions.',
    { missing_ai_pages: missingAiPages, weak_ai_pages: weakAiPages }
  ));

  const missingHeaderPages = [];
  REQUIRED_PAGES.forEach((route) => {
    const routeCopy = findRouteObject(standardSource, 'ROUTE_COPY', route);
    const pagePath = path.join(PAGES_DIR, PAGE_TO_FILE[route]);
    const pageSource = fs.existsSync(pagePath) ? read(pagePath) : '';
    const hasStandardHeader = routeCopy && /title:\s*"/.test(routeCopy) && /description:\s*"/.test(routeCopy);
    const hasHomeHeader = route === 'home' && /Executive Command Center/.test(pageSource);
    if (!hasStandardHeader && !hasHomeHeader) missingHeaderPages.push(route);
  });
  checks.push(result(
    missingHeaderPages.length === 0 && /data-ui-role="page-header"/.test(standardSource),
    'clean_header_defined',
    missingHeaderPages.length
      ? 'Some pages are missing clean header copy.'
      : 'Every page has clean header copy.',
    { missing_header_pages: missingHeaderPages }
  ));

  const hardcodedHits = [];
  const projectPattern = /\b(hairoticmen|beauty-of-spirit|iwrite|smartaccounting)\b/gi;
  files.forEach((file) => {
    const source = read(file);
    const matches = source.match(projectPattern);
    if (matches) hardcodedHits.push({ file: rel(file), matches: Array.from(new Set(matches.map((m) => m.toLowerCase()))) });
  });
  checks.push(result(
    hardcodedHits.length === 0,
    'no_hardcoded_project_name',
    hardcodedHits.length ? 'Hardcoded project names found in Control Center UI.' : 'No hardcoded project names found in Control Center UI.',
    { hardcoded_hits: hardcodedHits }
  ));

  const sidebarRoutes = parseSidebarRoutes(indexSource);
  const duplicateRoutes = sidebarRoutes.filter((route, index) => sidebarRoutes.indexOf(route) !== index);
  checks.push(result(
    duplicateRoutes.length === 0,
    'no_duplicate_sidebar_items',
    duplicateRoutes.length ? 'Duplicate sidebar items found.' : 'No duplicate sidebar items found.',
    { duplicate_routes: Array.from(new Set(duplicateRoutes)) }
  ));

  const rawJsonHits = [];
  const rawJsonUiPattern = /<pre\b|class=["'][^"']*(?:raw-json|json-dump)/i;
  files
    .filter((file) => file.endsWith('.js') || file.endsWith('.html'))
    .forEach((file) => {
      const source = read(file);
      if (rawJsonUiPattern.test(source)) rawJsonHits.push(rel(file));
    });
  checks.push(result(
    rawJsonHits.length === 0,
    'no_raw_json_primary_ui',
    rawJsonHits.length ? 'Raw JSON or preformatted primary UI detected.' : 'No raw JSON primary UI detected.',
    { raw_json_hits: rawJsonHits }
  ));

  const responsiveRequirements = [
    '@media',
    '.std-main-grid',
    '.kpi-grid',
    '.dashboard-grid',
    'grid-template-columns',
    'minmax(0, 1fr)'
  ];
  const missingResponsive = responsiveRequirements.filter((needle) => !stylesSource.includes(needle));
  checks.push(result(
    missingResponsive.length === 0,
    'responsive_classes_exist',
    missingResponsive.length ? 'Responsive layout classes are missing.' : 'Responsive layout classes exist.',
    { missing_responsive: missingResponsive }
  ));

  const syntaxTargets = [
    path.join(CC_DIR, 'app.js'),
    path.join(CC_DIR, 'router.js'),
    STANDARD_UI,
    ...Object.values(PAGE_TO_FILE).map((file) => path.join(PAGES_DIR, file))
  ].filter((file) => fs.existsSync(file));
  const syntax = syntaxTargets.map(checkSyntax);
  const syntaxFailures = syntax.filter((item) => !item.pass);
  checks.push(result(
    syntaxFailures.length === 0,
    'js_syntax_passes',
    syntaxFailures.length ? 'JavaScript syntax errors found.' : 'JavaScript syntax passes.',
    { syntax_failures: syntaxFailures }
  ));

  const passed = checks.filter((item) => item.pass).length;
  const score = Number(((passed / checks.length) * 10).toFixed(1));
  const payload = {
    timestamp: new Date().toISOString(),
    pages_checked: REQUIRED_PAGES,
    verification_result: {
      passed: passed === checks.length,
      checks
    },
    ux_quality_score: score
  };

  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  if (passed !== checks.length) process.exitCode = 1;
}

main();
