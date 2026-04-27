#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BASE = '/opt/mh-assistant';
const HOST = String(process.env.P2_VERIFY_HOST || 'http://127.0.0.1:3000').replace(/\/$/, '');
const CONTROL_KEY = String(process.env.MH_CONTROL_CENTER_WRITE_KEY || '').trim();

function fail(message) {
  throw new Error(message);
}

async function request(url, options = {}) {
  const response = await fetch(url, options);
  let body = null;
  try {
    body = await response.json();
  } catch (error) {
    body = null;
  }

  return {
    status: response.status,
    ok: response.ok,
    body
  };
}

async function checkReadinessShape(results) {
  const response = await request(`${HOST}/readyz`);

  if (!response.body || typeof response.body !== 'object') {
    fail('readyz did not return JSON object');
  }

  const ready = response.body.ready;
  const checks = response.body.checks;

  if (typeof ready !== 'boolean') {
    fail('readyz.ready is not boolean');
  }

  if (!checks || typeof checks !== 'object') {
    fail('readyz.checks is missing or invalid');
  }

  const missingEnv = Array.isArray(response.body.missing_required_env)
    ? response.body.missing_required_env
    : [];

  if (missingEnv.length > 0 && ready !== false) {
    fail('readyz.ready should be false when required env is missing');
  }

  results.push({
    check: 'readiness_shape',
    pass: true,
    status: response.status,
    ready,
    missing_required_env: missingEnv
  });
}

async function checkGlobalErrorHandler(results) {
  const response = await fetch(`${HOST}/telegram-command`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: '{"text": "broken"'
  });

  let body = null;
  try {
    body = await response.json();
  } catch (error) {
    body = null;
  }

  if (response.status < 400) {
    fail(`global error check expected non-2xx, got ${response.status}`);
  }

  if (!body || typeof body !== 'object') {
    fail('global error handler did not return JSON');
  }

  if (body.ok !== false) {
    fail('global error handler should return ok=false');
  }

  if (!body.error || typeof body.error.code !== 'string' || typeof body.error.message !== 'string') {
    fail('global error handler shape missing error.code or error.message');
  }

  if (typeof body.error.stack !== 'undefined') {
    fail('global error handler leaked stack to client response');
  }

  results.push({
    check: 'global_error_handler_shape',
    pass: true,
    status: response.status,
    error_code: body.error.code
  });
}

function checkSecretLeakageGuards(results) {
  const serverPath = path.join(BASE, 'runtime/orchestrator-service/server.js');
  const tokenManagerPath = path.join(BASE, 'runtime/orchestrator-service/lib/integrations/token-manager.js');

  const serverSource = fs.readFileSync(serverPath, 'utf8');
  const tokenManagerSource = fs.readFileSync(tokenManagerPath, 'utf8');

  const hasRawUpstreamLeak = /error:\s*error\.response\?\.data\b/.test(serverSource)
    || /details:\s*error\.response\?\.data\b/.test(serverSource);
  const tokenManagerLogs = /console\.(log|info|warn|error)/.test(tokenManagerSource);

  if (hasRawUpstreamLeak) {
    fail('server.js still contains raw upstream error payload responses');
  }

  if (tokenManagerLogs) {
    fail('token-manager should not log to console directly');
  }

  results.push({
    check: 'secret_safety_scan',
    pass: true,
    raw_upstream_error_leaks: false,
    token_manager_console_logs: false
  });
}

async function checkRateLimiting(results) {
  if (!CONTROL_KEY) {
    results.push({
      check: 'rate_limit_telegram',
      pass: true,
      skipped: true,
      reason: 'MH_CONTROL_CENTER_WRITE_KEY not set in verifier environment'
    });
    return;
  }

  let hit429 = false;

  for (let i = 0; i < 55; i += 1) {
    const response = await request(`${HOST}/telegram-command`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-mh-control-key': CONTROL_KEY
      },
      body: JSON.stringify({ text: '/unknown_phase4_check' })
    });

    if (response.status === 429) {
      hit429 = true;
      break;
    }
  }

  if (!hit429) {
    fail('rate limiter did not return 429 for /telegram-command under burst traffic');
  }

  results.push({
    check: 'rate_limit_telegram',
    pass: true,
    hit_429: true
  });
}

async function main() {
  const results = [];

  await checkReadinessShape(results);
  await checkGlobalErrorHandler(results);
  checkSecretLeakageGuards(results);
  await checkRateLimiting(results);

  const summary = {
    host: HOST,
    timestamp: new Date().toISOString(),
    passed: results.every((item) => item.pass),
    checks: results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);

  if (!summary.passed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
