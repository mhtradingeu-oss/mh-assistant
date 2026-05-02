#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const childProcess = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const CONTROL_DIR = path.join(ROOT, "public", "control-center");
const STYLES_FILE = path.join(CONTROL_DIR, "styles.css");
const INDEX_FILE = path.join(CONTROL_DIR, "index.html");
const APP_FILE = path.join(CONTROL_DIR, "app.js");
const PAGE_STANDARD_FILE = path.join(CONTROL_DIR, "ui", "page-standard.js");

const REQUIRED_PAGES = [
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

const REQUIRED_PAGE_FILES = {
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

const REQUIRED_CLASSES = [
  ".app-shell",
  ".sidebar",
  ".main-shell",
  ".page-container",
  ".page-header",
  ".page-title",
  ".page-subtitle",
  ".dashboard-grid",
  ".kpi-grid",
  ".card",
  ".metric-card",
  ".status-card",
  ".action-card",
  ".ai-panel",
  ".section",
  ".section-header",
  ".toolbar",
  ".btn",
  ".btn-primary",
  ".btn-secondary",
  ".btn-ghost",
  ".badge",
  ".badge-success",
  ".badge-warning",
  ".badge-danger",
  ".empty-state",
  ".loading-state",
  ".error-state"
];

const DESIGN_TOKEN_KEYS = [
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

const REQUIRED_BREAKPOINTS = ["1280px", "1024px", "768px", "640px", "480px"];

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function fileHas(filePath, needle) {
  if (!exists(filePath)) return false;
  return read(filePath).includes(needle);
}

function parseRoutesFromIndex(indexHtml) {
  const matches = [...indexHtml.matchAll(/data-route="([^"]+)"/g)];
  return matches.map((m) => m[1]);
}

function checkJsSyntax(filePath) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mh-ui-check-"));
  const tempFile = path.join(tempDir, `${path.basename(filePath)}.mjs`);
  try {
    fs.writeFileSync(tempFile, read(filePath), "utf8");
    const result = childProcess.spawnSync(process.execPath, ["--check", tempFile], {
      encoding: "utf8"
    });
    const stderr = String(result.stderr || "").trim();
    const stdout = String(result.stdout || "").trim();

    if (result.status === 0) {
      return { ok: true };
    }

    return { ok: false, error: stderr || stdout || "Unknown syntax error" };
  } catch (error) {
    return { ok: false, error: error.message };
  } finally {
    try {
      fs.unlinkSync(tempFile);
    } catch (_) {}
    try {
      fs.rmdirSync(tempDir);
    } catch (_) {}
  }
}

function checkCssBasicValidation(css) {
  const open = (css.match(/{/g) || []).length;
  const close = (css.match(/}/g) || []).length;
  return {
    ok: open === close,
    open,
    close
  };
}

function score(found, total) {
  if (!total) return 0;
  return Math.round((found / total) * 100);
}

function run() {
  const issues = [];
  const changedFiles = [
    "public/control-center/index.html",
    "public/control-center/app.js",
    "public/control-center/styles.css",
    "public/control-center/ui/page-standard.js",
    "scripts/verify-ui-system.js"
  ];

  const pagesDir = path.join(CONTROL_DIR, "pages");
  const missingPageFiles = [];
  for (const route of REQUIRED_PAGES) {
    const file = REQUIRED_PAGE_FILES[route];
    if (!file || !exists(path.join(pagesDir, file))) {
      missingPageFiles.push(route);
    }
  }

  if (missingPageFiles.length) {
    issues.push(`Missing required page files for routes: ${missingPageFiles.join(", ")}`);
  }

  const styles = exists(STYLES_FILE) ? read(STYLES_FILE) : "";
  const pageStandard = exists(PAGE_STANDARD_FILE) ? read(PAGE_STANDARD_FILE) : "";
  const indexHtml = exists(INDEX_FILE) ? read(INDEX_FILE) : "";

  const foundTokens = DESIGN_TOKEN_KEYS.filter((key) => styles.includes(key));
  const missingTokens = DESIGN_TOKEN_KEYS.filter((key) => !styles.includes(key));
  if (missingTokens.length) {
    issues.push(`Missing design tokens: ${missingTokens.join(", ")}`);
  }

  const foundBreakpoints = REQUIRED_BREAKPOINTS.filter((bp) => styles.includes(`max-width: ${bp}`));
  const missingBreakpoints = REQUIRED_BREAKPOINTS.filter((bp) => !foundBreakpoints.includes(bp));
  if (missingBreakpoints.length) {
    issues.push(`Missing responsive breakpoints: ${missingBreakpoints.join(", ")}`);
  }

  const missingClasses = REQUIRED_CLASSES.filter((cls) => !styles.includes(cls));
  if (missingClasses.length) {
    issues.push(`Missing reusable classes in styles: ${missingClasses.join(", ")}`);
  }

  const requiredSectionMarkers = [
    'data-ui-role="page-header"',
    'data-ui-role="kpi-cards"',
    'data-ui-role="status-cards"',
    'data-ui-role="main-work-area"',
    'data-ui-role="action-panel"',
    'data-ui-role="ai-panel"'
  ];
  const missingSections = requiredSectionMarkers.filter((marker) => !pageStandard.includes(marker));
  if (missingSections.length) {
    issues.push(`Missing standard page sections: ${missingSections.join(", ")}`);
  }

  const routes = parseRoutesFromIndex(indexHtml);
  const duplicateRoutes = routes.filter((route, index) => routes.indexOf(route) !== index);
  if (duplicateRoutes.length) {
    issues.push(`Duplicate sidebar route entries: ${Array.from(new Set(duplicateRoutes)).join(", ")}`);
  }

  const hardcodedProjectPatterns = [
    /hairoticmen/gi,
    /smartaccounting/gi,
    /beauty-of-spirit/gi,
    /iwrite/gi
  ];
  const hardcodedFindings = [];
  for (const pattern of hardcodedProjectPatterns) {
    if (pattern.test(styles)) hardcodedFindings.push(`styles.css contains ${pattern}`);
    if (pattern.test(pageStandard)) hardcodedFindings.push(`page-standard.js contains ${pattern}`);
    if (exists(APP_FILE) && pattern.test(read(APP_FILE))) hardcodedFindings.push(`app.js contains ${pattern}`);
  }
  if (hardcodedFindings.length) {
    issues.push(`Hardcoded project names found: ${hardcodedFindings.join("; ")}`);
  }

  const horizontalOverflowRiskRules = ["100vw", "overflow-x: visible"];
  const hasGlobalOverflowProtection = /html[\s\S]*overflow-x:\s*hidden|body[\s\S]*overflow-x:\s*hidden/.test(styles);
  const riskClassesFound = horizontalOverflowRiskRules.filter((rule) => {
    if (rule === "100vw" && hasGlobalOverflowProtection) {
      return false;
    }
    return styles.includes(rule);
  });
  if (riskClassesFound.length) {
    issues.push(`Potential horizontal overflow rules detected: ${riskClassesFound.join(", ")}`);
  }

  const jsFilesToCheck = [APP_FILE, PAGE_STANDARD_FILE];
  const jsSyntax = jsFilesToCheck.map((file) => ({ file, ...checkJsSyntax(file) }));
  jsSyntax
    .filter((result) => !result.ok)
    .forEach((result) => issues.push(`JS syntax failed in ${path.relative(ROOT, result.file)}: ${result.error}`));

  const cssValidation = checkCssBasicValidation(styles);
  if (!cssValidation.ok) {
    issues.push(`CSS brace mismatch: open=${cssValidation.open}, close=${cssValidation.close}`);
  }

  const pageWrapperSignals = [
    "applyStandardPageLayout",
    "std-page-shell",
    'data-ui-role="ai-panel"'
  ];
  const wrapperMissing = pageWrapperSignals.filter((signal) => !pageStandard.includes(signal));
  if (wrapperMissing.length) {
    issues.push(`Standard wrapper / AI panel signals missing: ${wrapperMissing.join(", ")}`);
  }

  const designSystemReadiness = score(foundTokens.length + (REQUIRED_CLASSES.length - missingClasses.length), DESIGN_TOKEN_KEYS.length + REQUIRED_CLASSES.length);
  const responsiveReadiness = score(foundBreakpoints.length + (styles.includes(".sidebar.is-open") ? 1 : 0), REQUIRED_BREAKPOINTS.length + 1);
  const uxReadiness = score(
    requiredSectionMarkers.length - missingSections.length + (issues.filter((issue) => issue.toLowerCase().includes("hardcoded")).length ? 0 : 1),
    requiredSectionMarkers.length + 1
  );

  const report = {
    changedFiles,
    pagesUpgraded: REQUIRED_PAGES,
    designSystemReadiness,
    responsiveReadiness,
    uxReadiness,
    remainingIssues: issues
  };

  console.log("MH Assistant Control Center UI Verification");
  console.log("=".repeat(48));
  console.log(`Files changed: ${report.changedFiles.join(", ")}`);
  console.log(`Pages upgraded: ${report.pagesUpgraded.join(", ")}`);
  console.log(`Design system readiness score: ${report.designSystemReadiness}/100`);
  console.log(`Responsive readiness score: ${report.responsiveReadiness}/100`);
  console.log(`UX readiness score: ${report.uxReadiness}/100`);

  if (report.remainingIssues.length) {
    console.log("Remaining issues:");
    report.remainingIssues.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`);
    });
    process.exitCode = 1;
  } else {
    console.log("Remaining issues: none");
  }
}

run();
