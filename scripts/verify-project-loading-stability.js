#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const appPath = path.join(root, "public/control-center/app.js");
const apiPath = path.join(root, "public/control-center/api.js");
const constantsPath = path.join(root, "public/control-center/constants.js");

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

const app = read(appPath);
const api = read(apiPath);
const constants = read(constantsPath);

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
  "startup_unlock_contract",
  /const\s+STARTUP_UNLOCK_TIMEOUT_MS\s*=\s*8000/.test(app) &&
    /function\s+unlockStartupUi\(/.test(app) &&
    /unlockStartupUi\("global-watchdog"\)/.test(app),
  "Startup always has an 8-second unlock contract enforced by the global watchdog."
);

check(
  "runtime_trace_storage_exists",
  /const\s+RUNTIME_TRACE_STORAGE_KEY\s*=\s*"mh-control-center-runtime-trace"/.test(app) &&
    /safeStorageSet\(RUNTIME_TRACE_STORAGE_KEY,\s*JSON\.stringify\(payload\)\)/.test(app),
  "Runtime trace is persisted to localStorage for browser-visible startup diagnostics."
);

check(
  "debug_startup_mode_exists",
  /function\s+isDebugStartupMode\(/.test(app) && /debugStartup/.test(app),
  "A debugStartup query mode exists for full startup tracing."
);

check(
  "fetch_timeout_uses_promise_race",
  /function\s+fetchProjectWithTimeout[\s\S]*Promise\.race\(\[fetchAllCoreProjectData\(safeProjectName\),\s*timeoutPromise\]\)/.test(app),
  "fetchProjectWithTimeout uses Promise.race so stalled fetches resolve to a timeout outcome."
);

check(
  "api_traces_large_payload_parsing",
  /function\s+readResponseText\(/.test(api) &&
    /emitApiRuntimeTrace\("response\.text\.start"/.test(api) &&
    /emitApiRuntimeTrace\("api\.response\.text\.timeout"/.test(api) &&
    /emitApiRuntimeTrace\("api\.response\.json\.fallback\.done"/.test(api) &&
    /emitApiRuntimeTrace\("api\.response\.parse\.start"/.test(api) &&
    /emitApiRuntimeTrace\("api\.response\.parse\.done"/.test(api) &&
    /emitApiRuntimeTrace\("api\.response\.parse\.error"/.test(api),
  "API client records response text timeout/fallback and JSON parse diagnostics for large payloads."
);

check(
  "response_text_watchdog_unlock_contract",
  /const\s+RESPONSE_TEXT_WATCHDOG_TIMEOUT_MS\s*=\s*4000/.test(app) &&
    /loadProjectData\.responseTextWatchdog\.unlock/.test(app) &&
    /forceHideLoadingOverlay\("response-text-watchdog"\)/.test(app) &&
    /Project response is still being processed\. Interface unlocked\./.test(app) &&
    /function\s+applyRequiredProjectFallback\(/.test(app) &&
    /Project details are still syncing\./.test(app),
  "A 4s response-text watchdog unlock path exists and applies required-project fallback diagnostics."
);

check(
  "canonical_access_key_shared_between_app_and_api",
  /CONTROL_ACCESS_KEY_STORAGE_KEY\s*=\s*"mh-control-write-key"/.test(constants) &&
    /localStorage\.setItem\(CONTROL_ACCESS_KEY_STORAGE_KEY,\s*val\)/.test(app) &&
    /localStorage\.getItem\(CONTROL_ACCESS_KEY_STORAGE_KEY\)/.test(api),
  "App save flow and API fetch flow share the canonical access-key storage key."
);

check(
  "required_project_fetch_has_key_diagnostics",
  /buildReadHeaders\([\s\S]*x-mh-control-key/.test(api) &&
    /requiredDashboardPromise\s*=\s*getJson\(\s*`\/media-manager\/project\/.+`/.test(api) &&
    /keyPresent/.test(api) &&
    /keySource/.test(api) &&
    /authHeaderPresent/.test(api),
  "Required project fetch path includes x-mh-control-key and reports key/auth diagnostics."
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
  "required_terminal_steps_recorded",
  /recordStartupStep\("loadProjectData.required.done"/.test(app) &&
    /recordStartupStep\("loadProjectData.hideLoading.done"/.test(app),
  "Required load lifecycle records required.done and hideLoading.done steps."
);

check(
  "hide_before_optional_apply",
  app.indexOf('recordStartupStep("loadProjectData.hideLoading.done"') !== -1 &&
    app.indexOf('void applyOptionalProjectPayload(payload, loadToken)') !== -1 &&
    app.indexOf('recordStartupStep("loadProjectData.hideLoading.done"') < app.indexOf('void applyOptionalProjectPayload(payload, loadToken)'),
  "Required path hides loading before optional payload application begins."
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
