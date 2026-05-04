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

function check(checks, code, pass, message) {
  checks.push({ code, pass: Boolean(pass), message });
}

function main() {
  const appPath = path.join(ROOT, 'public/control-center/app.js');
  const indexPath = path.join(ROOT, 'public/control-center/index.html');
  const stylesPath = path.join(ROOT, 'public/control-center/styles.css');

  const app = read(appPath);
  const index = read(indexPath);
  const styles = read(stylesPath);
  const checks = [];

  check(
    checks,
    'delegated_click_handler_exists',
    /function\s+bindDelegatedClickRouting\(/.test(app) &&
      /document\.addEventListener\("click",\s*\(event\)\s*=>/.test(app) &&
      /window\.__mhControlCenterDelegatedClickBound/.test(app),
    'App installs one delegated click routing handler on document.'
  );

  check(
    checks,
    'sidebar_routes_mapped',
    /const\s+sidebarRouteMap\s*=\s*\{[\s\S]*home:[\s\S]*setup:[\s\S]*library:[\s\S]*integrations:[\s\S]*"ai-command":[\s\S]*workflows:[\s\S]*publishing:/.test(app) &&
      /data-route="home"\s+data-page="home"/.test(index) &&
      /data-route="setup"\s+data-page="setup"/.test(index) &&
      /data-route="library"\s+data-page="library"/.test(index) &&
      /data-route="integrations"\s+data-page="integrations"/.test(index) &&
      /data-route="ai-command"\s+data-page="ai-command"/.test(index) &&
      /data-route="workflows"\s+data-page="workflows"/.test(index) &&
      /data-route="publishing"\s+data-page="publishing"/.test(index),
    'Sidebar core routes are explicitly mapped and exposed via data-route/data-page.'
  );

  check(
    checks,
    'action_buttons_have_mappings',
    /function\s+executeMappedAction\(/.test(app) &&
      /actionName\s*===\s*"search"/.test(app) &&
      /actionName\s*===\s*"send-ai-command"/.test(app) &&
      /actionName\s*===\s*"refresh-project"/.test(app) &&
      /"open-campaign-studio":\s*"campaign-studio"/.test(app) &&
      /"open-publishing":\s*"publishing"/.test(app) &&
      /id="runSearchBtn"[\s\S]*data-action="search"/.test(index) &&
      /id="runQuickCommandBtn"[\s\S]*data-action="send-ai-command"/.test(index) &&
      /id="refreshAllBtn"[\s\S]*data-action="refresh-project"/.test(index) &&
      /id="openAiBtn"[\s\S]*data-action="open-ai-command"/.test(index) &&
      /id="newCampaignBtn"[\s\S]*data-action="open-campaign-studio"/.test(index) &&
      /id="scheduleBtn"[\s\S]*data-action="open-publishing"/.test(index),
    'Top/action controls have delegated handlers or explicit data-action mappings.'
  );

  check(
    checks,
    'click_diagnostic_writes_storage',
    /const\s+LAST_CLICK_STORAGE_KEY\s*=\s*"mh-control-center-last-click"/.test(app) &&
      /function\s+installClickDiagnosticCapture\(/.test(app) &&
      /document\.addEventListener\("click",[\s\S]*capture:\s*true/.test(app) &&
      /safeStorageSet\(LAST_CLICK_STORAGE_KEY,\s*JSON\.stringify\(payload\)\)/.test(app) &&
      /formatLastClickSummary\(/.test(app),
    'Capture-phase click diagnostics persist mh-control-center-last-click and render in startup trace metadata.'
  );

  check(
    checks,
    'overlays_do_not_intercept_normal_clicks',
    /#startupUnlockBar,[\s\S]*#startupTracePanel,[\s\S]*#startupStepBanner,[\s\S]*pointer-events:\s*none/.test(styles) &&
      /#startupUnlockBar button,[\s\S]*#startupTracePanel button,[\s\S]*pointer-events:\s*auto/.test(styles) &&
      /\.loading-overlay\[aria-hidden="true"\],[\s\S]*\.loading-overlay:not\(\.is-visible\),[\s\S]*\.loading-overlay\[hidden\][\s\S]*pointer-events:\s*none\s*!important/.test(styles),
    'Startup/debug bars are non-intercepting, button controls stay interactive, and hidden loading overlays cannot capture clicks.'
  );

  check(
    checks,
    'no_permanent_pointer_none_on_shell_controls',
    !/\.app-shell\s*\{[^}]*pointer-events\s*:\s*none/.test(styles) &&
      !/\.sidebar\s*\{[^}]*pointer-events\s*:\s*none/.test(styles) &&
      !/\.nav-item\s*\{[^}]*pointer-events\s*:\s*none/.test(styles) &&
      !/\.btn\s*\{[^}]*pointer-events\s*:\s*none/.test(styles),
    'Main app shell/sidebar/nav/buttons have no permanent pointer-events:none styling.'
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
