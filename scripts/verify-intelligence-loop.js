#!/usr/bin/env node
'use strict';

/**
 * Phase 5: Intelligence + Optimization Loop Verification Script
 *
 * Tests:
 *  1. Record execution feedback
 *  2. Performance summary generation
 *  3. Optimization recommendations generation
 *  4. Learning memory update verification
 *  5. Smart suggestions generation
 *  6. Incremental persistence (history not overwritten)
 */

const fs = require('fs');
const path = require('path');

if (process.env.ALLOW_MUTATING_TESTS !== '1') {
  console.error('Refusing to run mutating intelligence loop verification. Set ALLOW_MUTATING_TESTS=1 to record feedback and optimization data.');
  process.exit(1);
}

const { app } = require('../runtime/orchestrator-service/server');

const EXTERNAL_HOST = String(process.env.MH_HOST || '').trim();
const TEST_PROJECT = String(process.env.MH_PROJECT || 'hairoticmen').trim().toLowerCase();
const DATA_BASE = path.join(process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '..'), 'data', 'projects');

let HOST = EXTERNAL_HOST ? EXTERNAL_HOST.replace(/\/$/, '') : '';
let embeddedServer = null;

async function bootHost() {
  if (HOST) return HOST;

  await new Promise((resolve, reject) => {
    embeddedServer = app.listen(0, '127.0.0.1', (error) => {
      if (error) {
        reject(error);
        return;
      }

      const address = embeddedServer.address();
      const port = typeof address === 'object' && address ? address.port : 3000;
      HOST = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  return HOST;
}

async function stopHost() {
  if (!embeddedServer) return;
  await new Promise((resolve) => {
    embeddedServer.close(() => resolve());
  });
}

async function req(method, url, body) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${HOST}${url}`, options);
  let json = null;
  try {
    json = await response.json();
  } catch (_) {
    json = null;
  }

  return {
    status: response.status,
    ok: response.ok,
    body: json
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function pass(results, check, details = {}) {
  results.push({
    check,
    pass: true,
    ...details
  });
}

function fail(results, check, reason) {
  results.push({
    check,
    pass: false,
    reason
  });
}

function getProjectPath(...parts) {
  return path.join(DATA_BASE, TEST_PROJECT, ...parts);
}

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return fallback;
  }
}

function sampleFeedbackPayloads() {
  const now = Date.now();
  return [
    {
      project: TEST_PROJECT,
      job_id: `phase5-job-${now}-1`,
      channel: 'tiktok',
      campaign_id: 'beard-growth-q2',
      product_slug: 'beard-roller-pro',
      hook: '3-second beard transformation',
      metrics: {
        impressions: 12000,
        clicks: 540,
        engagement: 880,
        conversions: 46,
        revenue: 1780,
        cost: 420
      }
    },
    {
      project: TEST_PROJECT,
      job_id: `phase5-job-${now}-2`,
      channel: 'instagram',
      campaign_id: 'beard-growth-q2',
      product_slug: 'beard-growth-oil',
      hook: 'Patchy beard fix in 30 days',
      metrics: {
        impressions: 9800,
        clicks: 310,
        engagement: 420,
        conversions: 19,
        revenue: 820,
        cost: 390
      }
    },
    {
      project: TEST_PROJECT,
      job_id: `phase5-job-${now}-3`,
      channel: 'facebook',
      campaign_id: 'beard-care-bundle',
      product_slug: 'beard-care-kit',
      hook: 'Before and after beard routine',
      metrics: {
        impressions: 8300,
        clicks: 165,
        engagement: 140,
        conversions: 5,
        revenue: 210,
        cost: 360
      }
    },
    {
      project: TEST_PROJECT,
      job_id: `phase5-job-${now}-4`,
      channel: 'tiktok',
      campaign_id: 'beard-care-bundle',
      product_slug: 'beard-care-kit',
      hook: 'One routine for thick beard lines',
      metrics: {
        impressions: 15000,
        clicks: 700,
        engagement: 1100,
        conversions: 58,
        revenue: 2340,
        cost: 560
      }
    },
    {
      project: TEST_PROJECT,
      job_id: `phase5-job-${now}-5`,
      channel: 'youtube',
      campaign_id: 'premium-grooming-stack',
      product_slug: 'beard-trimmer-premium',
      hook: 'Barber-grade shape at home',
      metrics: {
        impressions: 6200,
        clicks: 115,
        engagement: 90,
        conversions: 2,
        revenue: 120,
        cost: 310
      }
    }
  ];
}

async function checkRecordFeedback(results) {
  const checkName = 'record_execution_feedback';

  try {
    const payloads = sampleFeedbackPayloads();
    const created = [];

    for (const payload of payloads) {
      const response = await req('POST', '/record_execution_feedback', payload);
      assert(response.status === 201, `Expected 201, got ${response.status}`);
      assert(response.body?.ok === true, 'Expected ok=true');
      assert(response.body?.feedback_record?.record_id, 'Expected feedback_record.record_id');
      created.push(response.body.feedback_record.record_id);
    }

    pass(results, checkName, {
      records_written: created.length,
      sample_record_id: created[0]
    });
  } catch (error) {
    fail(results, checkName, error.message);
  }
}

async function checkPerformanceSummary(results) {
  const checkName = 'get_performance_summary';

  try {
    const response = await req('GET', `/get_performance_summary?project=${TEST_PROJECT}`);
    assert(response.ok, `Expected success, got ${response.status}`);
    assert(response.body?.ok === true, 'Expected ok=true');

    const summary = response.body?.summary || {};
    assert(Array.isArray(summary.top_performing_campaigns), 'Missing top_performing_campaigns');
    assert(Array.isArray(summary.top_performing_products), 'Missing top_performing_products');
    assert(Array.isArray(summary.top_channels), 'Missing top_channels');
    assert(Array.isArray(summary.weak_channels), 'Missing weak_channels');
    assert(Array.isArray(summary.best_hooks), 'Missing best_hooks');
    assert(Array.isArray(summary.performance_trends), 'Missing performance_trends');

    pass(results, checkName, {
      tracked_records: summary.records_tracked,
      top_channel: summary.top_channels?.[0]?.key || null,
      weak_channel_count: summary.weak_channels.length
    });
  } catch (error) {
    fail(results, checkName, error.message);
  }
}

async function checkRecommendations(results) {
  const checkName = 'generate_optimization_recommendations';

  try {
    const response = await req('POST', '/generate_optimization_recommendations', {
      project: TEST_PROJECT
    });

    assert(response.ok, `Expected success, got ${response.status}`);
    assert(response.body?.ok === true, 'Expected ok=true');

    const rec = response.body?.recommendations || {};
    assert(Array.isArray(rec.what_to_stop), 'Missing what_to_stop');
    assert(Array.isArray(rec.what_to_scale), 'Missing what_to_scale');
    assert(Array.isArray(rec.what_to_improve), 'Missing what_to_improve');
    assert(Array.isArray(rec.new_angles_to_test), 'Missing new_angles_to_test');
    assert(Array.isArray(response.body?.risk_alerts), 'Missing risk_alerts');

    pass(results, checkName, {
      stop_count: rec.what_to_stop.length,
      scale_count: rec.what_to_scale.length,
      improve_count: rec.what_to_improve.length,
      angle_count: rec.new_angles_to_test.length,
      alert_count: response.body.risk_alerts.length
    });
  } catch (error) {
    fail(results, checkName, error.message);
  }
}

function checkLearningMemory(results) {
  const checkName = 'learning_memory_updated';

  try {
    const learningPath = getProjectPath('ai', 'learning.json');
    assert(fs.existsSync(learningPath), `learning.json missing at ${learningPath}`);

    const learning = readJson(learningPath, {});
    assert(Array.isArray(learning.patterns), 'learning.patterns must be an array');
    assert(Array.isArray(learning.history), 'learning.history must be an array');
    assert(learning.patterns.length > 0, 'Expected at least one learned pattern');
    assert(learning.history.length > 0, 'Expected learning history entries');

    const samplePattern = learning.patterns[0];
    assert(typeof samplePattern.pattern === 'string', 'pattern entry missing pattern text');

    pass(results, checkName, {
      learning_path: learningPath,
      pattern_count: learning.patterns.length,
      history_count: learning.history.length,
      sample_pattern: samplePattern.pattern
    });
  } catch (error) {
    fail(results, checkName, error.message);
  }
}

async function checkSmartSuggestions(results) {
  const checkName = 'get_smart_suggestions';

  try {
    const response = await req('GET', `/get_smart_suggestions?project=${TEST_PROJECT}`);
    assert(response.ok, `Expected success, got ${response.status}`);
    assert(response.body?.ok === true, 'Expected ok=true');

    const suggestions = response.body?.suggestions || {};
    assert(typeof suggestions.next_best_action === 'string', 'Missing next_best_action');
    assert(typeof suggestions.next_campaign_idea === 'string', 'Missing next_campaign_idea');
    assert(Object.prototype.hasOwnProperty.call(suggestions, 'best_channel_to_focus'), 'Missing best_channel_to_focus');
    assert(typeof suggestions.content_to_regenerate === 'string', 'Missing content_to_regenerate');
    assert(Array.isArray(suggestions.alerts), 'Missing alerts array');

    pass(results, checkName, {
      next_best_action: suggestions.next_best_action,
      best_channel_to_focus: suggestions.best_channel_to_focus
    });
  } catch (error) {
    fail(results, checkName, error.message);
  }
}

function checkIncrementalPersistence(results) {
  const checkName = 'incremental_persistence';

  try {
    const performancePath = getProjectPath('analytics', 'performance.json');
    const recommendationsPath = getProjectPath('ai', 'recommendations.json');

    assert(fs.existsSync(performancePath), `performance.json missing at ${performancePath}`);
    assert(fs.existsSync(recommendationsPath), `recommendations.json missing at ${recommendationsPath}`);

    const performance = readJson(performancePath, {});
    const recommendations = readJson(recommendationsPath, {});

    assert(Array.isArray(performance.records), 'performance.records must be an array');
    assert(performance.records.length >= 5, 'Expected at least 5 records in performance history');
    assert(Array.isArray(recommendations.history), 'recommendations.history must be an array');
    assert(recommendations.history.length >= 1, 'Expected recommendations history entries');

    pass(results, checkName, {
      performance_records: performance.records.length,
      recommendation_history_entries: recommendations.history.length,
      sample_performance_file: performancePath,
      sample_recommendations_file: recommendationsPath
    });
  } catch (error) {
    fail(results, checkName, error.message);
  }
}

async function main() {
  const results = [];

  await bootHost();

  process.stdout.write('\n=== Phase 5: Intelligence + Optimization Loop Verification ===\n');
  process.stdout.write(`Host: ${HOST}\nProject: ${TEST_PROJECT}\n\n`);

  await checkRecordFeedback(results);
  await checkPerformanceSummary(results);
  await checkRecommendations(results);
  checkLearningMemory(results);
  await checkSmartSuggestions(results);
  checkIncrementalPersistence(results);

  const passed = results.filter((item) => item.pass).length;
  const total = results.length;
  const intelligenceReadinessScore = Number(((passed / Math.max(1, total)) * 10).toFixed(1));

  const output = {
    timestamp: new Date().toISOString(),
    host: HOST,
    project: TEST_PROJECT,
    passed,
    total,
    all_passed: passed === total,
    intelligence_readiness_score: intelligenceReadinessScore,
    endpoints_tested: [
      '/record_execution_feedback',
      '/get_performance_summary',
      '/generate_optimization_recommendations',
      '/get_smart_suggestions'
    ],
    checks: results
  };

  process.stdout.write('--- Results ---\n');
  for (const result of results) {
    const icon = result.pass ? '✓' : '✗';
    const label = result.pass ? 'PASS' : 'FAIL';
    const detail = result.pass ? '' : ` - ${result.reason || 'Unknown failure'}`;
    process.stdout.write(`  ${icon} [${label}] ${result.check}${detail}\n`);
  }

  process.stdout.write(`\nPassed: ${passed}/${total}\n`);
  process.stdout.write(`Intelligence Readiness Score: ${intelligenceReadinessScore}/10\n\n`);
  process.stdout.write(JSON.stringify(output, null, 2) + '\n');

  await stopHost();

  if (!output.all_passed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  stopHost()
    .catch(() => null)
    .finally(() => {
      process.stderr.write(`Fatal: ${error.message}\n`);
      process.exitCode = 1;
    });
});
