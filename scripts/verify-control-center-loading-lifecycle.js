#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const appPath = path.join(root, "public/control-center/app.js");
const stylesPath = path.join(root, "public/control-center/styles.css");
const apiPath = path.join(root, "public/control-center/api.js");
const constantsPath = path.join(root, "public/control-center/constants.js");

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function check(checks, code, pass, message) {
  checks.push({ code, pass: Boolean(pass), message });
}

function main() {
  const app = read(appPath);
  const styles = read(stylesPath);
  const api = read(apiPath);
  const constants = read(constantsPath);
  
function extractFunctionBody(source, functionName) {
  const pattern = new RegExp(`(?:async\\s+)?function\\s+${functionName}\\s*\\([^)]*\\)\\s*{`);
  const match = source.match(pattern);
  if (!match || typeof match.index !== "number") return "";

  const start = source.indexOf("{", match.index);
  if (start < 0) return "";

  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === quote) {
        quote = "";
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }

    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start + 1, i);
    }
  }

  return "";
}

const checks = [];
  const loadProjectDataBody = extractFunctionBody(app, "loadProjectData");
  const requiredDoneIdx = loadProjectDataBody.indexOf('recordStartupStep("loadProjectData.required.done"');
  const hideDoneIdx = loadProjectDataBody.indexOf('recordStartupStep("loadProjectData.hideLoading.done"');
  const optionalApplyIdx = app.indexOf("void applyOptionalProjectPayload(payload, loadToken)");
  const hideRequiredIdx = loadProjectDataBody.indexOf('hideLoading({ token: loadToken, reason: "required-load-done" })');
  const renderGlobalStartIdx = loadProjectDataBody.indexOf('recordStartupStep("loadProjectData.renderGlobalUi.start"');
  const renderGlobalCatchIdx = loadProjectDataBody.indexOf('forceHideLoadingOverlay("render-global-ui-error")');
  const safeRenderStartIdx = loadProjectDataBody.indexOf('recordStartupStep("loadProjectData.safeRenderCurrentPage.start"');
  const safeRenderCatchIdx = loadProjectDataBody.indexOf('forceHideLoadingOverlay("safe-render-current-page-error")');

  check(
    checks,
    "load_token_active_guard",
    /let\s+activeProjectLoadToken\s*=\s*""/.test(app) &&
      /function\s+isActiveProjectLoadToken\(token\)/.test(app) &&
      /const\s+loadToken\s*=\s*createProjectLoadToken\(/.test(app) &&
      /activeProjectLoadToken\s*=\s*loadToken/.test(app) &&
      !/activeProjectLoadToken\s*=\s*""/.test(loadProjectDataBody),
    "loadProjectData uses an active load token guard that remains available for recovery and optional background work."
  );

  const optionalProjectPayloadBody = extractFunctionBody(app, "applyOptionalProjectPayload");

  check(
    checks,
    "optional_background_no_show_loading",
    optionalProjectPayloadBody &&
      /recordStartupStep\("loadProjectData.optional.start"/.test(optionalProjectPayloadBody) &&
      !/showLoading\(/.test(optionalProjectPayloadBody),
    "Optional background loading does not call showLoading."
  );

  check(
    checks,
    "required_done_and_hide_steps_recorded",
    requiredDoneIdx !== -1 && hideDoneIdx !== -1,
    "Required payload lifecycle records loadProjectData.required.done and loadProjectData.hideLoading.done."
  );

  check(
    checks,
    "hide_loading_before_optional_payload",
    hideRequiredIdx !== -1 && hideDoneIdx !== -1 && optionalApplyIdx !== -1 && app.indexOf('recordStartupStep("loadProjectData.hideLoading.done"') < optionalApplyIdx,
    "Required payload path hides loading before optional background payload starts."
  );

  check(
    checks,
    "render_errors_force_hide_loading",
    renderGlobalStartIdx !== -1 && renderGlobalCatchIdx !== -1 &&
      safeRenderStartIdx !== -1 && safeRenderCatchIdx !== -1,
    "renderGlobalUi and safeRenderCurrentPage error paths force-hide loading overlay."
  );

  check(
    checks,
    "hide_loading_force_clears_dom",
    /function hideLoading\([\s\S]*overlay\.classList\.remove\("is-visible"\)/.test(app) &&
      /function hideLoading\([\s\S]*overlay\.hidden\s*=\s*true/.test(app) &&
      /function hideLoading\([\s\S]*overlay\.setAttribute\("aria-hidden",\s*"true"\)/.test(app) &&
      /function hideLoading\([\s\S]*overlay\.style\.setProperty\("display",\s*"none",\s*"important"\)/.test(app) &&
      /function hideLoading\([\s\S]*overlay\.style\.visibility\s*=\s*"hidden"/.test(app) &&
      /function hideLoading\([\s\S]*overlay\.style\.opacity\s*=\s*"0"/.test(app) &&
      /function hideLoading\([\s\S]*overlay\.style\.pointerEvents\s*=\s*"none"/.test(app) &&
      /function removeLoadingBodyClasses\(/.test(app),
    "hideLoading force-clears class, aria state, display, visibility, opacity, pointer events, and body loading classes."
  );

  check(
    checks,
    "startup_unlock_watchdog_exists",
    /const\s+STARTUP_UNLOCK_TIMEOUT_MS\s*=\s*8000/.test(app) &&
      /const\s+LOADING_WATCHDOG_INTERVAL_MS\s*=\s*1000/.test(app) &&
      /function\s+installGlobalLoadingWatchdog\(/.test(app) &&
      /unlockStartupUi\("global-watchdog"\)/.test(app),
    "app.js installs a 1s global watchdog that unlocks the UI after 8 seconds."
  );

  check(
    checks,
    "unlock_ui_controls_exist",
    /function\s+bindStartupRecoveryControls\(/.test(app) &&
      /startupUnlockBtn/.test(app) &&
      /startupTraceUnlockBtn/.test(app) &&
      /Unlock UI/.test(read(path.join(root, "public/control-center/index.html"))),
    "Unlock UI controls exist in both the startup bar and debug trace panel."
  );

  check(
    checks,
    "runtime_trace_persisted",
    /const\s+RUNTIME_TRACE_STORAGE_KEY\s*=\s*"mh-control-center-runtime-trace"/.test(app) &&
      /safeStorageSet\(RUNTIME_TRACE_STORAGE_KEY,\s*JSON\.stringify\(payload\)\)/.test(app) &&
      /function\s+renderStartupRuntimeTrace\(/.test(app),
    "Runtime trace is persisted to mh-control-center-runtime-trace and rendered in-browser."
  );

  check(
    checks,
    "debug_startup_mode_exists",
    /function\s+isDebugStartupMode\(/.test(app) &&
      /debugStartup/.test(app) &&
      /startupTracePanel/.test(read(path.join(root, "public/control-center/index.html"))),
    "debugStartup query mode exposes the full in-browser startup trace panel."
  );

  check(
    checks,
    "fetch_timeout_uses_promise_race",
    /function\s+fetchProjectWithTimeout\([\s\S]*Promise\.race\(\[fetchAllCoreProjectData\(safeProjectName\),\s*timeoutPromise\]\)/.test(app),
    "fetchProjectWithTimeout uses Promise.race to guarantee a hard timeout outcome."
  );

  check(
    checks,
    "api_body_read_and_parse_diagnostics_exist",
    /function\s+readResponseText\(/.test(api) &&
      /emitApiRuntimeTrace\("response\.text\.start"/.test(api) &&
      /emitApiRuntimeTrace\("api\.response\.parse\.start"/.test(api) &&
      /emitApiRuntimeTrace\("api\.response\.parse\.done"/.test(api) &&
      /emitApiRuntimeTrace\("api\.response\.parse\.error"/.test(api) &&
      /emitApiRuntimeTrace\("api\.response\.parse\.timeout"/.test(api) &&
      /JSON\.parse\(rawText\)/.test(api),
    "api.js traces response body reads and JSON parsing for large payload diagnostics."
  );

  check(
    checks,
    "fetch_parse_watchdog_exists",
    /const\s+PARSE_WATCHDOG_TIMEOUT_MS\s*=\s*2000/.test(app) &&
      /function\s+fetchProjectWithTimeout[\s\S]*response\.text\.done/.test(app) &&
      /function\s+fetchProjectWithTimeout[\s\S]*api\.response\.parse\.done/.test(app) &&
      /function\s+fetchProjectWithTimeout[\s\S]*phase\s*=\s*"parse-watchdog"/.test(app) &&
      /loadProjectData\.parse-watchdog/.test(app) &&
      /forceHideLoadingOverlay\("parse-watchdog"\)/.test(app),
    "fetchProjectWithTimeout enforces a 2s parse watchdog after response.text.done and unlocks the UI on parse stalls."
  );

  check(
    checks,
    "manual_unlock_force_hides_overlay",
    /recordStartupStep\("manualUnlock\.start"/.test(app) &&
      /recordStartupStep\("manualUnlock\.done"/.test(app) &&
      /forceHideLoadingOverlay\("manual-unlock"\)/.test(app) &&
      /startupRuntimeState\.manualUnlockActive\s*=\s*reason\s*===\s*"manual-unlock"/.test(app) &&
      /overlay\.style\.setProperty\("display",\s*"none",\s*"important"\)/.test(app),
    "Manual Unlock always hard-hides overlay and records manual unlock trace steps."
  );

  check(
    checks,
    "force_hide_overlay_steps_recorded",
    /recordStartupStep\("forceHideLoadingOverlay\.start"/.test(app) &&
      /recordStartupStep\("forceHideLoadingOverlay\.done"/.test(app),
    "forceHideLoadingOverlay emits start/done startup trace steps."
  );

  check(
    checks,
    "styles_hidden_overlay_absolute",
    /\.loading-overlay\[aria-hidden="true"\],\s*\.loading-overlay:not\(\.is-visible\)\s*\{[\s\S]*display:\s*none\s*!important[\s\S]*visibility:\s*hidden\s*!important[\s\S]*opacity:\s*0\s*!important[\s\S]*pointer-events:\s*none\s*!important/.test(styles),
    "Hidden loading overlay CSS uses absolute !important rules for aria-hidden and non-visible states."
  );

  check(
    checks,
    "shared_canonical_key_constant_used",
    /export\s+const\s+CONTROL_ACCESS_KEY_STORAGE_KEY\s*=\s*"mh-control-write-key"/.test(constants) &&
      /from\s+"\.\/constants\.js"/.test(app) &&
      /from\s+"\.\/constants\.js"/.test(api) &&
      /localStorage\.setItem\(CONTROL_ACCESS_KEY_STORAGE_KEY,\s*val\)/.test(app),
    "Set Access Key and API fetches use the same canonical storage key constant."
  );

  check(
    checks,
    "required_requests_include_control_key_header_when_present",
    /function\s+buildReadHeaders\([\s\S]*headers\["x-mh-control-key"\]\s*=\s*keyMeta\.key/.test(api) &&
      /const\s+requiredDashboardPromise\s*=\s*getJson\([\s\S]*\/media-manager\/project\/.+/.test(api) &&
      /parseJson\(response,\s*fallbackMessage,\s*\{[\s\S]*keyPresent,[\s\S]*keySource,[\s\S]*authHeaderPresent/.test(api),
    "Required project requests include x-mh-control-key when a key exists and expose non-secret auth diagnostics."
  );

  check(
    checks,
    "missing_key_recovery_visible_and_non_blocking",
    /handleAccessKeyStartupRecovery/.test(app) &&
      /showAccessKeyModal\(\)/.test(app) &&
      /unlockStartupUi\("global-watchdog"\)/.test(app) &&
      /hideLoading\(\{\s*token:\s*loadToken,\s*reason:\s*"access-key-required"\s*\}\)/.test(app),
    "Missing key opens the access-key recovery panel and cannot leave the UI permanently modal-blocked."
  );

  check(
    checks,
    "records_last_project_load_summary",
    /const\s+LAST_PROJECT_LOAD_STORAGE_KEY\s*=\s*"mh-control-center-last-project-load"/.test(app) &&
      /function\s+recordLastProjectLoad\(/.test(app) &&
      /recordLastProjectLoad\(summary\)/.test(app),
    "Project payload success records mh-control-center-last-project-load."
  );

  check(
    checks,
    "startup_steps_recorded",
    /const\s+STARTUP_STEPS_STORAGE_KEY\s*=\s*"mh-control-center-startup-steps"/.test(app) &&
      /function\s+recordStartupStep\(/.test(app) &&
      /recordStartupStep\("loadProjectData.start"/.test(app),
    "Startup steps are recorded and persisted."
  );

  check(
    checks,
    "overlay_recovery_after_required_success",
    /const\s+OVERLAY_RECOVERY_DELAY_MS\s*=\s*10000/.test(app) &&
      /scheduleOverlayRecoveryCheck\(loadToken,\s*loadedProjectName,\s*loadStartedAtMs,\s*\(\)\s*=>\s*requiredPayloadSucceeded\)/.test(loadProjectDataBody) &&
      /if\s*\(!requiredSucceeded\)\s*\{\s*return;\s*\}/.test(app) &&
      /Project loaded, optional data may still be syncing\./.test(app),
    "Required payload success schedules a 10s hard guard that force-hides loading when optional work lags."
  );

  check(
    checks,
    "optional_404_non_blocking_warning_diagnostics",
    /Optional \$\{section\} endpoint returned 404 and was skipped\./.test(api) &&
      /warning:\s*Boolean\(isOptionalNotFound\)/.test(api) &&
      /if \(entry\?\.warning\)\s*\{[\s\S]*recordStartupStep\("loadProjectData.optional.warning"/.test(app),
    "Optional insights/learning 404 responses are recorded as non-blocking warning diagnostics."
  );

  check(
    checks,
    "api_rejects_top_level_error_payload",
    /function\s+isTopLevelErrorPayload\(/.test(api) &&
      /if\s*\(isTopLevelErrorPayload\(payload\)\)/.test(api) &&
      /const\s+message\s*=\s*String\(payload\.error\s*\|\|\s*fallbackMessage\)/.test(api),
    "api.js rejects top-level error JSON payloads instead of treating them as project data."
  );

  check(
    checks,
    "api_missing_read_key_throws_access_key_error",
    /class\s+AccessKeyError\s+extends\s+Error/.test(api) &&
      /isMissingReadKeyErrorMessage\(/.test(api) &&
      /throw\s+new\s+AccessKeyError\(message,\s*diagnostics\)/.test(api),
    "api.js throws AccessKeyError when a missing read key error is returned."
  );

  check(
    checks,
    "app_access_key_recovery_hides_loading_and_shows_key_panel",
    /function\s+handleAccessKeyStartupRecovery\(/.test(app) &&
      /hideLoading\(\{\s*token:\s*loadToken,\s*reason:\s*"access-key-required"\s*\}\)/.test(app) &&
      /forceHideLoadingOverlay\("access-key-required-force"\)/.test(app) &&
      /showAccessKeyModal\(\)/.test(app) &&
      /Project data requires a valid access key\./.test(app),
    "app.js force-hides loading and opens Set Access Key recovery flow on missing read key/auth errors."
  );

  check(
    checks,
    "app_persists_startup_and_fetch_diagnostics",
    /const\s+LAST_STARTUP_ERROR_STORAGE_KEY\s*=\s*"mh-control-center-last-startup-error"/.test(app) &&
      /const\s+FETCH_DIAGNOSTICS_STORAGE_KEY\s*=\s*"mh-control-center-fetch-diagnostics"/.test(app) &&
      /safeStorageSet\(LAST_STARTUP_ERROR_STORAGE_KEY,\s*JSON\.stringify\(/.test(app) &&
      /safeStorageSet\(FETCH_DIAGNOSTICS_STORAGE_KEY,\s*JSON\.stringify\(/.test(app),
    "app.js stores mh-control-center-last-startup-error and mh-control-center-fetch-diagnostics."
  );

  check(
    checks,
    "app_has_clear_saved_key_reload_action",
    /Clear saved key and reload/.test(app) &&
      /localStorage\.removeItem\(CONTROL_ACCESS_KEY_STORAGE_KEY\)/.test(app) &&
      /window\.location\.reload\(\)/.test(app),
    "app.js exposes a Clear saved key and reload recovery action."
  );

  const showLoadingCalls = app.match(/showLoading\(/g) || [];
  const subscribeBlocks = app.match(/subscribe\([\s\S]*?\n\}\);/g) || [];
  const subscribeHasShowLoading = subscribeBlocks.some((block) => /showLoading\(/.test(block));
  const renderGlobalUiBody = extractFunctionBody(app, "renderGlobalUi");
  const safeRenderCurrentPageBody = extractFunctionBody(app, "safeRenderCurrentPage");
  const renderPathsHaveShowLoading = [renderGlobalUiBody, safeRenderCurrentPageBody].some((body) => /showLoading\(/.test(body));

  check(
    checks,
    "show_loading_only_explicit_load_actions",
    showLoadingCalls.length >= 2 &&
      /showLoading\([\s\S]*explicitLoad:\s*true/.test(app) &&
      /if\s*\(!token\s*\|\|\s*!isActiveProjectLoadToken\(token\)\)/.test(app) &&
      !subscribeHasShowLoading &&
      !renderPathsHaveShowLoading,
    "No subscribe/render path calls showLoading without explicit load action."
  );

  const ctrlBuildTaskMatch = styles.match(/\.ctrl-build-task-btn\s*\{([\s\S]*?)\n\s*\}/);
  const ctrlBuildTaskBody = ctrlBuildTaskMatch ? ctrlBuildTaskMatch[1] : "";

  check(
    checks,
    "startup_diagnostics_css_visible",
    /\.startup-step-banner\s*\{[\s\S]*position:\s*fixed/.test(styles) &&
      /\.fatal-startup-steps\s*\{[\s\S]*white-space:\s*pre-wrap/.test(styles) &&
      /\.startup-trace-panel\.is-visible\s*\{[\s\S]*display:\s*flex/.test(styles) &&
      !/fatal-startup-steps|startup-step-banner/.test(ctrlBuildTaskBody),
    "Startup diagnostics CSS is visible, includes the trace panel, and is not nested inside another rule."
  );

  const failed = checks.filter((item) => !item.pass);
  const payload = {
    timestamp: new Date().toISOString(),
    verification_result: {
      passed: failed.length === 0,
      checks
    }
  };

  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);

  if (failed.length) {
    process.exitCode = 1;
  }
}

main();
