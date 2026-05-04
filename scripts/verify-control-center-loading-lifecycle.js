#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const appPath = path.join(root, "public/control-center/app.js");

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

  check(
    checks,
    "load_token_active_guard",
    /let\s+activeProjectLoadToken\s*=\s*""/.test(app) &&
      /function\s+isActiveProjectLoadToken\(token\)/.test(app) &&
      /const\s+loadToken\s*=\s*createProjectLoadToken\(/.test(app) &&
      /activeProjectLoadToken\s*=\s*loadToken/.test(app),
    "loadProjectData uses an active load token guard."
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
    /function hideLoading\([\s\S]*overlay\.style\.display\s*=\s*"none"/.test(app) &&
      /function hideLoading\([\s\S]*overlay\.style\.pointerEvents\s*=\s*"none"/.test(app),
    "hideLoading force-clears display and pointer events."
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

  const showLoadingCalls = app.match(/showLoading\(/g) || [];
  const subscribeBlocks = app.match(/subscribe\([\s\S]*?\n\}\);/g) || [];
  const subscribeHasShowLoading = subscribeBlocks.some((block) => /showLoading\(/.test(block));

  check(
    checks,
    "show_loading_only_explicit_load_actions",
    showLoadingCalls.length >= 2 &&
      /showLoading\([\s\S]*explicitLoad:\s*true/.test(app) &&
      !subscribeHasShowLoading,
    "No subscribe/render path calls showLoading without explicit load action."
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
