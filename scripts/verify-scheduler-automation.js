#!/usr/bin/env node
'use strict';

/**
 * Phase 4: Scheduler Automation Verification Script
 *
 * Tests:
 *  1. Create job (POST /schedule_execution_job)
 *  2. List queue (GET /scheduler_queue)
 *  3. Run worker once (POST /run_scheduler_worker_once)
 *  4. Verify lock mechanism
 *  5. Verify completed status
 *  6. Verify execution log written
 *  7. Verify retry on invalid job
 *  8. Verify no project fallback
 */

const fs = require('fs');
const path = require('path');

if (process.env.ALLOW_MUTATING_TESTS !== '1') {
  console.error('Refusing to run mutating scheduler automation verification. Set ALLOW_MUTATING_TESTS=1 to create scheduler jobs and execution logs.');
  process.exit(1);
}

const HOST = String(process.env.MH_HOST || 'http://127.0.0.1:3000').replace(/\/$/, '');
const TEST_PROJECT = 'hairoticmen';
const DATA_BASE = path.join(process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '..'), 'data');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function req(method, url, body) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
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
  return { status: response.status, ok: response.ok, body: json };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function pass(results, check, details = {}) {
  results.push({ check, pass: true, ...details });
}

function fail(results, check, reason) {
  results.push({ check, pass: false, reason });
}

// A media job that will succeed (uses prompt_pack directly)
function buildMediaPayload() {
  return {
    project: TEST_PROJECT,
    type: 'media',
    channel: 'instagram',
    scheduled_at: new Date(Date.now() - 1000).toISOString(), // due immediately
    mode: 'semi_auto',
    package_payload: {
      prompt_pack: {
        branding: {
          visual_prompt: 'Premium grooming hero shot with clean white background',
          hook: 'Tired of bad hair days?',
          cta: 'Shop now at hairoticmen.com'
        },
        reel: {
          hook: 'Tired of bad hair days?',
          video_prompt: 'Show man running fingers through perfectly styled hair',
          cta: 'Shop now at hairoticmen.com'
        },
        feature: {
          visual_prompt: 'Close-up of product texture with luxury lighting'
        }
      }
    }
  };
}

// An invalid job payload — missing prompt_pack — causes bridge failure
function buildBrokenMediaPayload() {
  return {
    project: TEST_PROJECT,
    type: 'media',
    channel: 'instagram',
    scheduled_at: new Date(Date.now() - 1000).toISOString(),
    mode: 'semi_auto',
    package_payload: {
      prompt_pack: {} // empty prompt_pack → bridge should throw PROMPT_PACK_MISSING
    }
  };
}

// ---------------------------------------------------------------------------
// Check 1: No project fallback
// ---------------------------------------------------------------------------

async function checkNoProjectFallback(results) {
  const checkName = 'no_project_fallback';

  try {
    // POST without project field
    const r1 = await req('POST', '/schedule_execution_job', {
      type: 'media',
      scheduled_at: new Date().toISOString(),
      mode: 'semi_auto',
      package_payload: { prompt_pack: { branding: {} } }
    });

    if (r1.status !== 400 || r1.body?.error?.code !== 'PROJECT_CONTEXT_MISSING') {
      fail(results, checkName,
        `Expected 400/PROJECT_CONTEXT_MISSING, got ${r1.status} / ${r1.body?.error?.code}`);
      return;
    }

    // GET without project field
    const r2 = await req('GET', '/scheduler_queue');
    if (r2.status !== 400 || r2.body?.error?.code !== 'PROJECT_CONTEXT_MISSING') {
      fail(results, checkName,
        `scheduler_queue: Expected 400/PROJECT_CONTEXT_MISSING, got ${r2.status} / ${r2.body?.error?.code}`);
      return;
    }

    // POST worker without project field
    const r3 = await req('POST', '/run_scheduler_worker_once', {});
    if (r3.status !== 400 || r3.body?.error?.code !== 'PROJECT_CONTEXT_MISSING') {
      fail(results, checkName,
        `run_scheduler_worker_once: Expected 400/PROJECT_CONTEXT_MISSING, got ${r3.status} / ${r3.body?.error?.code}`);
      return;
    }

    pass(results, checkName, {
      schedule_job: r1.body?.error?.code,
      scheduler_queue: r2.body?.error?.code,
      run_worker: r3.body?.error?.code
    });
  } catch (err) {
    fail(results, checkName, err.message);
  }
}

// ---------------------------------------------------------------------------
// Check 2: Validation — invalid type
// ---------------------------------------------------------------------------

async function checkValidationType(results) {
  const checkName = 'validation_invalid_type';

  try {
    const r = await req('POST', '/schedule_execution_job', {
      project: TEST_PROJECT,
      type: 'invalid_type',
      scheduled_at: new Date().toISOString(),
      mode: 'semi_auto',
      package_payload: { foo: 'bar' }
    });

    if (r.status !== 400 || r.body?.error?.code !== 'INVALID_JOB_TYPE') {
      fail(results, checkName,
        `Expected 400/INVALID_JOB_TYPE, got ${r.status} / ${r.body?.error?.code}`);
      return;
    }

    pass(results, checkName, { code: r.body.error.code });
  } catch (err) {
    fail(results, checkName, err.message);
  }
}

// ---------------------------------------------------------------------------
// Check 3: Validation — missing scheduled_at
// ---------------------------------------------------------------------------

async function checkValidationScheduledAt(results) {
  const checkName = 'validation_missing_scheduled_at';

  try {
    const r = await req('POST', '/schedule_execution_job', {
      project: TEST_PROJECT,
      type: 'media',
      mode: 'semi_auto',
      package_payload: { prompt_pack: { branding: {} } }
    });

    if (r.status !== 400 || r.body?.error?.code !== 'SCHEDULED_AT_MISSING') {
      fail(results, checkName,
        `Expected 400/SCHEDULED_AT_MISSING, got ${r.status} / ${r.body?.error?.code}`);
      return;
    }

    pass(results, checkName, { code: r.body.error.code });
  } catch (err) {
    fail(results, checkName, err.message);
  }
}

// ---------------------------------------------------------------------------
// Check 4: Validation — missing package_payload
// ---------------------------------------------------------------------------

async function checkValidationPackagePayload(results) {
  const checkName = 'validation_missing_package_payload';

  try {
    const r = await req('POST', '/schedule_execution_job', {
      project: TEST_PROJECT,
      type: 'media',
      scheduled_at: new Date().toISOString(),
      mode: 'semi_auto'
    });

    if (r.status !== 400 || r.body?.error?.code !== 'PACKAGE_PAYLOAD_MISSING') {
      fail(results, checkName,
        `Expected 400/PACKAGE_PAYLOAD_MISSING, got ${r.status} / ${r.body?.error?.code}`);
      return;
    }

    pass(results, checkName, { code: r.body.error.code });
  } catch (err) {
    fail(results, checkName, err.message);
  }
}

// ---------------------------------------------------------------------------
// Check 5: Create job successfully
// ---------------------------------------------------------------------------

async function checkCreateJob(results) {
  const checkName = 'create_job';

  try {
    const r = await req('POST', '/schedule_execution_job', buildMediaPayload());

    if (r.status !== 201 || r.body?.ok !== true) {
      fail(results, checkName, `Expected 201/ok=true, got ${r.status} / ok=${r.body?.ok}`);
      return;
    }

    const job = r.body.job;
    const required = [
      'id', 'project', 'type', 'channel', 'execution_endpoint', 'execution_state',
      'scheduled_at', 'status', 'attempts', 'max_attempts', 'locked_at', 'locked_by',
      'last_error', 'created_at', 'updated_at', 'mode', 'package_payload'
    ];

    for (const field of required) {
      if (!Object.prototype.hasOwnProperty.call(job, field)) {
        fail(results, checkName, `Job missing required field: ${field}`);
        return;
      }
    }

    assert(job.status === 'pending', 'New job should have status=pending');
    assert(job.attempts === 0, 'New job should have attempts=0');
    assert(job.locked_at === null, 'New job should have locked_at=null');
    assert(job.locked_by === null, 'New job should have locked_by=null');
    assert(job.last_error === null, 'New job should have last_error=null');
    assert(job.project === TEST_PROJECT, 'Job project should match');
    assert(job.type === 'media', 'Job type should be media');
    assert(job.execution_endpoint === '/generate_media_from_prompt', 'Execution endpoint should match type');

    pass(results, checkName, { job_id: job.id, status: job.status });
    return job.id;
  } catch (err) {
    fail(results, checkName, err.message);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Check 6: List queue shows the created job
// ---------------------------------------------------------------------------

async function checkListQueue(results, expectedJobId) {
  const checkName = 'list_queue';

  try {
    const r = await req('GET', `/scheduler_queue?project=${TEST_PROJECT}`);

    if (!r.ok || r.body?.ok !== true) {
      fail(results, checkName, `Expected ok=true, got ${r.status} / ok=${r.body?.ok}`);
      return;
    }

    const { queue, jobs } = r.body;
    assert(typeof queue === 'object', 'Response should have queue object');
    assert(typeof queue.pending === 'number', 'queue.pending should be a number');
    assert(typeof queue.due === 'number', 'queue.due should be a number');
    assert(typeof queue.running === 'number', 'queue.running should be a number');
    assert(typeof queue.failed === 'number', 'queue.failed should be a number');
    assert(typeof queue.completed === 'number', 'queue.completed should be a number');
    assert(typeof queue.retryable === 'number', 'queue.retryable should be a number');

    assert(typeof jobs === 'object', 'Response should have jobs object');
    assert(Array.isArray(jobs.pending), 'jobs.pending should be an array');
    assert(Array.isArray(jobs.due), 'jobs.due should be an array');

    if (expectedJobId) {
      const allJobs = [
        ...jobs.pending, ...jobs.due, ...jobs.running,
        ...jobs.failed, ...jobs.completed, ...jobs.retryable
      ];
      const found = allJobs.some((j) => j.id === expectedJobId);
      assert(found, `Expected job ${expectedJobId} to appear in queue`);
      assert(queue.due >= 1, 'Queue should have at least 1 due job (scheduled in the past)');
    }

    pass(results, checkName, {
      total: r.body.total,
      queue_counts: queue
    });
  } catch (err) {
    fail(results, checkName, err.message);
  }
}

// ---------------------------------------------------------------------------
// Check 7: Run worker once — processes due job, produces completed status
// ---------------------------------------------------------------------------

async function checkRunWorkerOnce(results) {
  const checkName = 'run_worker_once';

  try {
    const r = await req('POST', '/run_scheduler_worker_once', {
      project: TEST_PROJECT
    });

    if (!r.ok || r.body?.ok !== true) {
      fail(results, checkName, `Expected ok=true, got ${r.status} / ok=${r.body?.ok}`);
      return null;
    }

    assert(typeof r.body.worker_id === 'string', 'Response should include worker_id');
    assert(typeof r.body.processed === 'number', 'Response should include processed count');
    assert(Array.isArray(r.body.results), 'Response should include results array');

    const workerResults = r.body.results;
    const completed = workerResults.filter((r2) => r2.status === 'completed');

    if (completed.length === 0) {
      fail(results, checkName, 'Worker processed 0 completed jobs — expected at least 1');
      return null;
    }

    pass(results, checkName, {
      worker_id: r.body.worker_id,
      processed: r.body.processed,
      completed_count: completed.length
    });

    return { workerId: r.body.worker_id, completedResults: completed };
  } catch (err) {
    fail(results, checkName, err.message);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Check 8: Verify completed status persisted in scheduler.json
// ---------------------------------------------------------------------------

function checkCompletedStatusPersisted(results, expectedJobId) {
  const checkName = 'completed_status_persisted';

  try {
    const schedulerPath = path.join(
      DATA_BASE, 'projects', TEST_PROJECT, 'execution', 'scheduler.json'
    );

    assert(fs.existsSync(schedulerPath), `scheduler.json not found at ${schedulerPath}`);

    const jobs = JSON.parse(fs.readFileSync(schedulerPath, 'utf8'));
    assert(Array.isArray(jobs), 'scheduler.json should be an array');

    if (expectedJobId) {
      const job = jobs.find((j) => j.id === expectedJobId);
      assert(job, `Job ${expectedJobId} not found in scheduler.json`);
      assert(job.status === 'completed', `Job status should be completed, got ${job.status}`);
      assert(job.locked_at === null, 'Completed job should have locked_at=null');
      assert(job.locked_by === null, 'Completed job should have locked_by=null');
    }

    pass(results, checkName, {
      scheduler_file: schedulerPath,
      job_count: jobs.length
    });
  } catch (err) {
    fail(results, checkName, err.message);
  }
}

// ---------------------------------------------------------------------------
// Check 9: Verify execution log written
// ---------------------------------------------------------------------------

function checkExecutionLogWritten(results) {
  const checkName = 'execution_log_written';

  try {
    const logsDir = path.join(
      DATA_BASE, 'projects', TEST_PROJECT, 'execution', 'logs'
    );

    assert(fs.existsSync(logsDir), `logs dir not found at ${logsDir}`);

    const logFiles = fs.readdirSync(logsDir).filter((f) => f.startsWith('scheduler-'));
    assert(logFiles.length > 0, 'No scheduler-*.jsonl log files found');

    // Verify at least one log file is valid JSONL
    const lastLog = path.join(logsDir, logFiles[logFiles.length - 1]);
    const lines = fs.readFileSync(lastLog, 'utf8').trim().split('\n').filter(Boolean);
    assert(lines.length > 0, 'Log file has no entries');

    const firstEntry = JSON.parse(lines[0]);
    const requiredFields = ['timestamp', 'job_id', 'action', 'status'];
    for (const field of requiredFields) {
      assert(
        Object.prototype.hasOwnProperty.call(firstEntry, field),
        `Log entry missing field: ${field}`
      );
    }

    pass(results, checkName, {
      log_files_found: logFiles.length,
      latest_log: lastLog,
      entries_in_latest: lines.length
    });
  } catch (err) {
    fail(results, checkName, err.message);
  }
}

// ---------------------------------------------------------------------------
// Check 10: Verify lock — completed job cannot rerun
// ---------------------------------------------------------------------------

async function checkCompletedJobCannotRerun(results, expectedJobId) {
  const checkName = 'completed_job_cannot_rerun';

  try {
    // Run worker again — completed jobs should not be reprocessed
    const r = await req('POST', '/run_scheduler_worker_once', {
      project: TEST_PROJECT
    });

    assert(r.ok, 'Worker run should succeed');

    const workerResults = r.body.results || [];
    const reprocessed = workerResults.find(
      (wr) => wr.job_id === expectedJobId
    );

    assert(!reprocessed, `Completed job ${expectedJobId} was reprocessed — it should be skipped`);

    pass(results, checkName, {
      worker_results: workerResults.length,
      completed_job_skipped: true
    });
  } catch (err) {
    fail(results, checkName, err.message);
  }
}

// ---------------------------------------------------------------------------
// Check 11: Verify retry on invalid job (max_attempts exhaustion)
// ---------------------------------------------------------------------------

async function checkRetryOnInvalidJob(results) {
  const checkName = 'retry_on_invalid_job';

  try {
    // Create a broken job (empty prompt_pack) with max_attempts=2
    const createR = await req('POST', '/schedule_execution_job', {
      ...buildBrokenMediaPayload(),
      max_attempts: 2
    });

    if (createR.status !== 201) {
      fail(results, checkName, `Could not create broken job: ${createR.status}`);
      return;
    }

    const brokenJobId = createR.body.job.id;

    // Run worker once — should fail and set retryable (attempts=1, max=2)
    const run1 = await req('POST', '/run_scheduler_worker_once', {
      project: TEST_PROJECT
    });
    assert(run1.ok, 'First worker run should succeed');

    const schedulerPath = path.join(
      DATA_BASE, 'projects', TEST_PROJECT, 'execution', 'scheduler.json'
    );
    const jobsAfterRun1 = JSON.parse(fs.readFileSync(schedulerPath, 'utf8'));
    const jobAfterRun1 = jobsAfterRun1.find((j) => j.id === brokenJobId);
    assert(jobAfterRun1, 'Broken job not found after first run');
    assert(
      jobAfterRun1.status === 'retryable',
      `After 1 attempt (max=2): expected retryable, got ${jobAfterRun1.status}`
    );
    assert(jobAfterRun1.attempts === 1, `Expected attempts=1, got ${jobAfterRun1.attempts}`);
    assert(typeof jobAfterRun1.last_error === 'string', 'last_error should be set after failure');

    // Wait just a moment to ensure the scheduled_at in past stays in past,
    // then run worker again — now attempts=2, which equals max_attempts → should become failed
    const run2 = await req('POST', '/run_scheduler_worker_once', {
      project: TEST_PROJECT
    });
    assert(run2.ok, 'Second worker run should succeed');

    const jobsAfterRun2 = JSON.parse(fs.readFileSync(schedulerPath, 'utf8'));
    const jobAfterRun2 = jobsAfterRun2.find((j) => j.id === brokenJobId);
    assert(jobAfterRun2, 'Broken job not found after second run');
    assert(
      jobAfterRun2.status === 'failed',
      `After 2 attempts (max=2): expected failed, got ${jobAfterRun2.status}`
    );
    assert(jobAfterRun2.attempts === 2, `Expected attempts=2, got ${jobAfterRun2.attempts}`);

    // Run a third time — should not reprocess a failed+exhausted job
    const run3 = await req('POST', '/run_scheduler_worker_once', {
      project: TEST_PROJECT
    });
    assert(run3.ok, 'Third worker run should succeed');

    const workerResults3 = run3.body.results || [];
    const reprocessed3 = workerResults3.find((wr) => wr.job_id === brokenJobId);
    assert(!reprocessed3, 'Exhausted failed job should not be reprocessed');

    pass(results, checkName, {
      broken_job_id: brokenJobId,
      final_status: jobAfterRun2.status,
      attempts: jobAfterRun2.attempts,
      max_attempts: jobAfterRun2.max_attempts,
      last_error: jobAfterRun2.last_error
    });
  } catch (err) {
    fail(results, checkName, err.message);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const results = [];
  let createdJobId = null;

  process.stdout.write(`\n=== Phase 4: Scheduler Automation Verification ===\n`);
  process.stdout.write(`Host: ${HOST}\nProject: ${TEST_PROJECT}\n\n`);

  // Ordered checks
  await checkNoProjectFallback(results);
  await checkValidationType(results);
  await checkValidationScheduledAt(results);
  await checkValidationPackagePayload(results);

  // Create a valid job and capture its ID
  const createJobResult = await (async () => {
    const r = results;
    // Use inline version to capture job ID
    try {
      const res2 = await req('POST', '/schedule_execution_job', buildMediaPayload());
      if (res2.status !== 201 || res2.body?.ok !== true) {
        fail(r, 'create_job', `Expected 201/ok=true, got ${res2.status}`);
        return null;
      }
      const job = res2.body.job;
      const required = [
        'id', 'project', 'type', 'channel', 'execution_endpoint', 'execution_state',
        'scheduled_at', 'status', 'attempts', 'max_attempts', 'locked_at', 'locked_by',
        'last_error', 'created_at', 'updated_at', 'mode', 'package_payload'
      ];
      for (const field of required) {
        if (!Object.prototype.hasOwnProperty.call(job, field)) {
          fail(r, 'create_job', `Job missing required field: ${field}`);
          return null;
        }
      }
      if (job.status !== 'pending' || job.attempts !== 0 || job.locked_at !== null
        || job.locked_by !== null || job.last_error !== null || job.project !== TEST_PROJECT
        || job.type !== 'media' || job.execution_endpoint !== '/generate_media_from_prompt') {
        fail(r, 'create_job', 'Job fields do not match expected values');
        return null;
      }
      pass(r, 'create_job', { job_id: job.id, status: job.status });
      return job.id;
    } catch (err) {
      fail(r, 'create_job', err.message);
      return null;
    }
  })();

  createdJobId = createJobResult;

  await checkListQueue(results, createdJobId);
  const workerResult = await checkRunWorkerOnce(results);
  checkCompletedStatusPersisted(results, createdJobId);
  checkExecutionLogWritten(results);

  if (createdJobId) {
    await checkCompletedJobCannotRerun(results, createdJobId);
  }

  await checkRetryOnInvalidJob(results);

  // Score calculation
  const passed = results.filter((r) => r.pass).length;
  const total = results.length;
  const automationReadinessScore = Math.round((passed / total) * 10 * 10) / 10;

  const summary = {
    timestamp: new Date().toISOString(),
    host: HOST,
    project: TEST_PROJECT,
    passed,
    total,
    all_passed: passed === total,
    automation_readiness_score: automationReadinessScore,
    checks: results
  };

  process.stdout.write(`\n--- Results ---\n`);
  for (const r of results) {
    const icon = r.pass ? '✓' : '✗';
    const label = r.pass ? 'PASS' : 'FAIL';
    const detail = r.pass
      ? (r.reason ? ` — ${r.reason}` : '')
      : ` — ${r.reason || 'no reason'}`;
    process.stdout.write(`  ${icon} [${label}] ${r.check}${detail}\n`);
  }

  process.stdout.write(
    `\nPassed: ${passed}/${total} | Automation Readiness Score: ${automationReadinessScore}/10\n\n`
  );
  process.stdout.write(JSON.stringify(summary, null, 2) + '\n');

  if (!summary.all_passed) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err.message}\n`);
  process.exitCode = 1;
});
