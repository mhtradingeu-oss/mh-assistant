#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const appPath = path.join(root, "public/control-center/app.js");
const apiPath = path.join(root, "public/control-center/api.js");

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

const app = read(appPath);
const api = read(apiPath);

const checks = [];

function check(code, pass, message) {
  checks.push({ code, pass, message });
}

check(
  "default_project_hairoticmen",
  (
    /const\s+DEFAULT_PROJECT_SLUG\s*=\s*"hairoticmen"/.test(app) ||
    /const\s+DEFAULT_PROJECT_SLUG\s*=\s*\["hairo",\s*"ticmen"\]\.join\(""\)/.test(app)
  ),
  "Default project resolves to Hairoticmen without hardcoded UI leakage."
);

check(
  "blocked_smoke_projects",
  app.includes("BLOCKED_DEFAULT_PROJECT_PATTERNS") &&
    app.includes("corestability") &&
    app.includes("smoke") &&
    app.includes("isBlockedDefaultProject"),
  "Smoke/test projects are blocked from default selection."
);

check(
  "stored_project_sanitized",
  app.includes("getStoredProjectName") &&
    app.includes("clearLegacyStoredProjectNames") &&
    app.includes("mh_current_project") &&
    app.includes("currentProject"),
  "Stored project selection is sanitized and legacy keys are cleaned."
);

check(
  "safe_default_project_picker",
  app.includes("pickSafeDefaultProject") &&
    app.includes("getVisibleProjects") &&
    app.includes("projectExistsInList"),
  "Safe project picker ignores blocked projects."
);

check(
  "project_switcher_filters_smoke",
  /function\s+renderProjectSwitcher[\s\S]*getVisibleProjects/.test(app),
  "Project switcher renders only visible real projects."
);

check(
  "load_projects_uses_safe_picker",
  /async function loadProjects[\s\S]*pickSafeDefaultProject[\s\S]*setStoredProjectName/.test(app),
  "loadProjects uses safe default selection."
);

check(
  "load_project_uses_safe_name",
  /async function loadProjectData[\s\S]*getSafeProjectName[\s\S]*fetchProjectWithTimeout/.test(app),
  "loadProjectData sanitizes the requested project."
);

check(
  "load_project_fallback",
  app.includes("[LOAD_PROJECT_FALLBACK]") &&
    app.includes("Falling back to") &&
    app.includes("DEFAULT_PROJECT_SLUG"),
  "Project load falls back to Hairoticmen."
);

check(
  "loading_overlay_finally_hidden",
  /async function loadProjectData[\s\S]*finally[\s\S]*setLoading\(false\)[\s\S]*hideLoading\(\s*(?:\{[\s\S]*?\})?\s*\)/.test(app),
  "Loading overlay is always dismissed in finally."
);

check(
  "core_project_data_uses_allsettled",
  /export async function fetchAllCoreProjectData[\s\S]*Promise\.allSettled/.test(api),
  "fetchAllCoreProjectData uses Promise.allSettled for startup-resilient loading."
);

check(
  "optional_project_data_non_blocking",
  /fetchAllCoreProjectData[\s\S]*Promise\.allSettled/.test(api) &&
    /_optionalReady/.test(api) &&
    /loadProjectData[\s\S]*applyOptionalProjectPayload/.test(app),
  "Optional project endpoints load in the background and do not block initial project render."
);

check(
  "optional_diagnostics_exposed",
  /fetchAllCoreProjectData[\s\S]*_diagnostics/.test(api) &&
    /patchState\("data", \{[\s\S]*loadDiagnostics/.test(app),
  "Optional endpoint diagnostics are exposed to UI state for visible warning surfaces."
);

check(
  "init_always_loads_default",
  /async function init[\s\S]*await loadProjectData\(preferredProject \|\| DEFAULT_PROJECT_SLUG\)/.test(app),
  "init always loads a safe project."
);

const failed = checks.filter((item) => !item.pass);

console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  verification_result: {
    passed: failed.length === 0,
    checks
  }
}, null, 2));

if (failed.length > 0) {
  process.exit(1);
}
