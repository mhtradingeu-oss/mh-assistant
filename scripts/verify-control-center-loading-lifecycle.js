#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const appPath = path.join(root, "public/control-center/app.js");
const stylesPath = path.join(root, "public/control-center/styles.css");
const apiPath = path.join(root, "public/control-center/api.js");

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
    "hide_loading_force_clears_dom",
    /function hideLoading\([\s\S]*overlay\.classList\.remove\("is-visible"\)/.test(app) &&
      /function hideLoading\([\s\S]*overlay\.setAttribute\("aria-hidden",\s*"true"\)/.test(app) &&
      /function hideLoading\([\s\S]*overlay\.style\.display\s*=\s*"none"/.test(app) &&
      /function hideLoading\([\s\S]*overlay\.style\.pointerEvents\s*=\s*"none"/.test(app),
    "hideLoading force-clears class, aria state, display, and pointer events."
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
    /const\s+OVERLAY_RECOVERY_DELAY_MS\s*=\s*3000/.test(app) &&
      /scheduleOverlayRecoveryCheck\(loadToken,\s*loadedProjectName\)/.test(loadProjectDataBody) &&
      /Project loaded, optional data may still be syncing\./.test(app),
    "Required payload success schedules browser-visible overlay recovery."
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
      /localStorage\.removeItem\(CONTROL_WRITE_KEY_STORAGE_KEY\)/.test(app) &&
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
      !/fatal-startup-steps|startup-step-banner/.test(ctrlBuildTaskBody),
    "Startup diagnostics CSS is visible and not nested inside another rule."
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
