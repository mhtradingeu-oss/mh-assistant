'use strict';

function generateJobId(crypto) {
  return `job-${crypto.randomBytes(8).toString('hex')}`;
}

function generateWorkerId(crypto) {
  return `worker-${crypto.randomBytes(4).toString('hex')}`;
}

function isJobDue(job) {
  if (job.status !== 'pending' && job.status !== 'retryable') return false;
  const scheduledAt = new Date(job.scheduled_at).getTime();
  return !isNaN(scheduledAt) && scheduledAt <= Date.now();
}

function isJobLockExpired(job, lockTimeoutMs) {
  if (!job.locked_at) return false;
  const lockedAt = new Date(job.locked_at).getTime();
  return !isNaN(lockedAt) && (Date.now() - lockedAt) > lockTimeoutMs;
}

function buildSchedulerJobRecord(params, options = {}) {
  const now = new Date().toISOString();
  const crypto = options.crypto;
  const defaultMaxAttempts = options.defaultMaxAttempts;

  if (!crypto || typeof crypto.randomBytes !== 'function') {
    throw new Error('buildSchedulerJobRecord requires options.crypto.randomBytes');
  }

  const typeMap = {
    publish: '/execute_publish_package',
    email: '/execute_email_package',
    media: '/generate_media_from_prompt',
    ads: '/build_ad_execution_package'
  };

  return {
    id: generateJobId(crypto),
    project: String(params.project || '').trim(),
    type: String(params.type || '').trim(),
    source_package_id: String(params.source_package_id || '').trim() || null,
    channel: String(params.channel || '').trim() || null,
    execution_endpoint: typeMap[String(params.type || '').trim()] || null,
    execution_state: 'pending',
    scheduled_at: String(params.scheduled_at || '').trim(),
    mode: String(params.mode || 'semi_auto').trim(),
    package_payload: params.package_payload || null,
    status: 'pending',
    attempts: 0,
    max_attempts: Number(params.max_attempts) > 0
      ? Number(params.max_attempts)
      : defaultMaxAttempts,
    locked_at: null,
    locked_by: null,
    last_error: null,
    created_at: now,
    updated_at: now
  };
}

module.exports = {
  generateJobId,
  generateWorkerId,
  isJobDue,
  isJobLockExpired,
  buildSchedulerJobRecord
};
