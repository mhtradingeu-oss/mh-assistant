#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '..');

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function check(checks, code, pass, message, details = {}) {
  checks.push({ code, pass: Boolean(pass), message, ...details });
}

function extractCssBlock(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`));
  return match ? match[1] : '';
}

function main() {
  const indexPath = path.join(ROOT, 'public/control-center/index.html');
  const appPath = path.join(ROOT, 'public/control-center/app.js');
  const apiPath = path.join(ROOT, 'public/control-center/api.js');
  const stylesPath = path.join(ROOT, 'public/control-center/styles.css');
  const serverPath = path.join(ROOT, 'runtime/orchestrator-service/server.js');

  const index = read(indexPath);
  const app = read(appPath);
  const api = read(apiPath);
  const styles = read(stylesPath);
  const server = read(serverPath);
  const loadingOverlayBlock = extractCssBlock(styles, '.loading-overlay');

  const checks = [];

  check(
    checks,
    'index_has_loading_and_fatal_containers',
    /id="loadingOverlay"/.test(index) && /id="loadingTitle"/.test(index) && /id="loadingText"/.test(index) && /id="fatalErrorPanel"/.test(index) && /id="startupUnlockBtn"/.test(index) && /id="startupTracePanel"/.test(index),
    'index.html includes loading overlay, unlock recovery controls, and fatal fallback container.'
  );

  check(
    checks,
    'app_has_global_error_handlers',
    /window\.addEventListener\("error"/.test(app) && /window\.addEventListener\("unhandledrejection"/.test(app),
    'app.js installs global window error and unhandledrejection handlers.'
  );

  check(
    checks,
    'app_has_loading_watchdog',
    /installLoadingWatchdog/.test(app) && /installGlobalLoadingWatchdog/.test(app) && /LOADING_WATCHDOG_TIMEOUT_MS/.test(app) && /global-watchdog/.test(app),
    'app.js includes an emergency loading watchdog that unlocks the UI.'
  );

  check(
    checks,
    'app_has_runtime_trace_storage',
    /mh-control-center-runtime-trace/.test(app) && /renderStartupRuntimeTrace/.test(app) && /debugStartup/.test(app),
    'app.js persists a browser-visible runtime trace and supports debugStartup mode.'
  );

  check(
    checks,
    'app_hides_loading_in_critical_paths',
    /async function loadProjectData[\s\S]*finally[\s\S]*setLoading\(false\)[\s\S]*hideLoading\(\s*(?:\{[\s\S]*?\})?\s*\)/.test(app) &&
      /async function init[\s\S]*catch[\s\S]*(handleStartupFatalError|hideLoading\(\s*(?:\{[\s\S]*?\})?\s*\))/.test(app),
    'app.js dismisses loading in loadProjectData finally and init failure path.'
  );

  check(
    checks,
    'app_blocks_smoke_defaults',
    /BLOCKED_DEFAULT_PROJECT_PATTERNS/.test(app) && /corestability/.test(app) && /smoke/.test(app) && /isBlockedDefaultProject/.test(app),
    'app.js blocks smoke/test projects from default selection.'
  );

  check(
    checks,
    'api_has_startup_safe_timeout',
    /AbortController/.test(api) && /fetchWithTimeout/.test(api) && /isTimeout/.test(api),
    'api.js has timeout/AbortController startup-safe request handling.'
  );

  check(
    checks,
    'styles_loading_overlay_default_hidden',
    /\.loading-overlay\s*\{[\s\S]*display:\s*none[\s\S]*visibility:\s*hidden[\s\S]*pointer-events:\s*none/.test(styles) &&
      /\.loading-overlay\.is-visible\s*\{[\s\S]*display:\s*flex[\s\S]*visibility:\s*visible[\s\S]*pointer-events:\s*auto/.test(styles) &&
      /\.loading-overlay\[aria-hidden="true"\],\s*\.loading-overlay:not\(\.is-visible\)\s*\{[\s\S]*display:\s*none\s*!important[\s\S]*visibility:\s*hidden\s*!important/.test(styles),
    'styles.css defines loading overlay hidden by default and visible only under is-visible.'
  );

  check(
    checks,
    'api_parse_watchdog_events_exist',
    /emitApiRuntimeTrace\("api\.response\.parse\.start"/.test(api) &&
      /emitApiRuntimeTrace\("api\.response\.parse\.done"/.test(api) &&
      /emitApiRuntimeTrace\("api\.response\.parse\.error"/.test(api) &&
      /emitApiRuntimeTrace\("api\.response\.parse\.timeout"/.test(api) &&
      /class\s+ProjectPayloadError\s+extends\s+Error/.test(api),
    'api.js emits parse terminal events and exposes ProjectPayloadError for post-text parse failures.'
  );

  check(
    checks,
    'app_parse_watchdog_unlocks_ui',
    /const\s+PARSE_WATCHDOG_TIMEOUT_MS\s*=\s*2000/.test(app) &&
      /fetchProjectWithTimeout\.parse-watchdog/.test(app) &&
      /error\.phase\s*=\s*"parse-watchdog"/.test(app) &&
      /forceHideLoadingOverlay\("parse-watchdog"\)/.test(app) &&
      /Project response was received but could not be processed\./.test(app),
    'app.js includes a parse watchdog that force-hides the modal and keeps the UI usable.'
  );

  check(
    checks,
    'manual_unlock_calls_force_hide',
    /function\s+unlockStartupUi\([\s\S]*forceHideLoadingOverlay\(reason\)/.test(app) &&
      /recordStartupStep\("manualUnlock\.start"/.test(app) &&
      /recordStartupStep\("manualUnlock\.done"/.test(app),
    'Unlock UI button flow calls forceHideLoadingOverlay and records manual unlock lifecycle steps.'
  );

  check(
    checks,
    'force_hide_overlay_clears_dom_states',
    /function\s+forceHideLoadingOverlay\([\s\S]*overlay\.classList\.remove\("is-visible"\)/.test(app) &&
      /function\s+forceHideLoadingOverlay\([\s\S]*overlay\.setAttribute\("aria-hidden",\s*"true"\)/.test(app) &&
      /function\s+forceHideLoadingOverlay\([\s\S]*overlay\.hidden\s*=\s*true/.test(app) &&
      /function\s+forceHideLoadingOverlay\([\s\S]*overlay\.style\.setProperty\("display",\s*"none",\s*"important"\)/.test(app) &&
      /function\s+forceHideLoadingOverlay\([\s\S]*overlay\.style\.visibility\s*=\s*"hidden"/.test(app) &&
      /function\s+forceHideLoadingOverlay\([\s\S]*overlay\.style\.opacity\s*=\s*"0"/.test(app) &&
      /function\s+forceHideLoadingOverlay\([\s\S]*overlay\.style\.pointerEvents\s*=\s*"none"/.test(app) &&
      /function\s+forceHideLoadingOverlay\([\s\S]*removeLoadingBodyClasses\(\)/.test(app),
    'forceHideLoadingOverlay clears visibility classes/attributes/styles and body loading classes.'
  );

  check(
    checks,
    'required_success_hides_overlay',
    /recordStartupStep\("loadProjectData\.required\.done"/.test(app) &&
      /recordStartupStep\("loadProjectData\.hideLoading\.done"/.test(app),
    'Required payload success records required.done and hideLoading.done terminal steps.'
  );

  check(
    checks,
    'parse_apply_render_errors_hide_overlay',
    /forceHideLoadingOverlay\("parse-watchdog"\)/.test(app) &&
      /forceHideLoadingOverlay\("render-global-ui-error"\)/.test(app) &&
      /forceHideLoadingOverlay\("safe-render-current-page-error"\)/.test(app),
    'Parse/apply/render error paths force-hide the loading overlay.'
  );

  check(
    checks,
    'startup_never_blocked_past_8s',
    /const\s+STARTUP_UNLOCK_TIMEOUT_MS\s*=\s*8000/.test(app) &&
      /installGlobalLoadingWatchdog/.test(app) &&
      /unlockStartupUi\("global-watchdog"\)/.test(app),
    'Global watchdog enforces startup unlock by 8 seconds so modal blocking cannot persist.'
  );

  check(
    checks,
    'styles_do_not_force_overlay_visible',
    !/display:\s*flex/.test(loadingOverlayBlock),
    'No base CSS rule forces the loading overlay visible without .is-visible.'
  );

  check(
    checks,
    'cache_busting_or_no_store_enabled',
    /app\.js\?v=/.test(index) || (/\/control-center'\s*,\s*express\.static/.test(server) && /Cache-Control',\s*'no-store/.test(server)),
    'Control Center assets are cache-busted or served with no-store cache headers.'
  );

  const hasHardcodedLeak = /\bhairoticmen\b/i.test(app);
  const hasComputedDefault = /const\s+DEFAULT_PROJECT_SLUG\s*=\s*\["hairo",\s*"ticmen"\]\.join\(""\)/.test(app);
  check(
    checks,
    'no_hardcoded_project_leakage_app',
    !hasHardcodedLeak && hasComputedDefault,
    'app.js avoids hardcoded project leakage and uses a safe computed default.'
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

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main();
