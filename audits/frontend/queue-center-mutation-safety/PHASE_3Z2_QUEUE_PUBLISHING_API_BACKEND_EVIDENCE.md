# PHASE 3Z.2 — Queue / Publishing API Backend Evidence

## Frontend API queue/publishing functions
1859:export async function savePublishingSchedule(projectName, payload = {}) {
1872:export async function reschedulePublishingItem(projectName, jobId, payload = {}) {
1889:export async function approvePublishingItem(projectName, jobId, payload = {}) {
1899:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/ready`,
1906:export async function publishPublishingItem(projectName, jobId, payload = {}) {
1916:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/publish`,
1923:export async function failPublishingItem(projectName, jobId, payload = {}) {
1933:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/fail`,
1962:export async function fetchProjectQueueCenter(projectName) {
1968:    `/media-manager/project/${encodeURIComponent(projectName)}/queue-center`,

## API function ranges around publishing mutations and queue-center
}

export async function disconnectProjectIntegration(projectName, integrationId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!integrationId) {
    throw new Error("Missing integration id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/integrations/${encodeURIComponent(integrationId)}/disconnect`,
    "POST",
    payload,
    "Failed to disconnect integration"
  );
}

export async function savePublishingSchedule(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/schedule`,
    "POST",
    payload,
    "Failed to save publishing schedule"
  );
}

export async function reschedulePublishingItem(projectName, jobId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!jobId) {
    throw new Error("Missing job id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/reschedule`,
    "POST",
    payload,
    "Failed to reschedule publishing item"
  );
}

export async function approvePublishingItem(projectName, jobId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!jobId) {
    throw new Error("Missing job id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/ready`,
    "POST",
    payload,
    "Failed to approve publishing item"
  );
}

export async function publishPublishingItem(projectName, jobId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!jobId) {
    throw new Error("Missing job id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/publish`,
    "POST",
    payload,
    "Failed to publish item"
  );
}

export async function failPublishingItem(projectName, jobId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!jobId) {
    throw new Error("Missing job id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/fail`,
    "POST",
    payload,
    "Failed to mark publishing item as failed"
  );
}

export async function fetchProjectOperationsSchema(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/operations/schema`,
    "Failed to load operations schema"
  );
}

export async function fetchProjectTaskCenter(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/task-center`,
    "Failed to load task center"
  );
}

export async function fetchProjectQueueCenter(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/queue-center`,
    "Failed to load queue center"
  );
}

export async function fetchProjectJobMonitor(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/job-monitor`,
    "Failed to load job monitor"

## Backend queue-center and publishing mutation route markers
3930:  assertPublishingMutationAllowed(projectName, 'schedule', {
4336:  assertPublishingMutationAllowed(projectName, 'reschedule', {
10818:function handleGetQueueCenter(req, res) {
10862:app.get('/media-manager/project/:project/queue-center', handleGetQueueCenter);
10863:app.get('/public/media-manager/project/:project/queue-center', handleGetQueueCenter);
12255:    assertPublishingMutationAllowed(req.params.project, 'schedule', {
12288:    assertPublishingMutationAllowed(req.params.project, 'schedule', {
12319:app.post('/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
12321:    assertPublishingMutationAllowed(req.params.project, 'reschedule', {
12348:app.post('/public/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
12350:    assertPublishingMutationAllowed(req.params.project, 'reschedule', {
12377:app.post('/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
12379:    assertPublishingMutationAllowed(req.params.project, 'ready', {
12399:app.post('/public/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
12401:    assertPublishingMutationAllowed(req.params.project, 'ready', {
12421:app.post('/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
12423:    assertPublishingMutationAllowed(req.params.project, 'publish', {
12453:app.post('/public/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
12455:    assertPublishingMutationAllowed(req.params.project, 'publish', {
12485:app.post('/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
12487:    assertPublishingMutationAllowed(req.params.project, 'fail', {
12517:app.post('/public/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
12519:    assertPublishingMutationAllowed(req.params.project, 'fail', {
13741:    assertPublishingMutationAllowed(projectName, 'publish', {
14049:function assertPublishingMutationAllowed(projectName, action, options = {}) {
14066:  //   freeze_publishing  → default false (permissive — freeze is opt-in)
14067:  //   approval_before_publish → default true (restrictive — approval is required by default)
14068:  const freezePublishing = typeof policyRules.freeze_publishing === 'boolean'
14069:    ? policyRules.freeze_publishing
14070:    : policyRules.freeze_publishing == null ? false : Boolean(policyRules.freeze_publishing);
14071:  const approvalBeforePublish = typeof policyRules.approval_before_publish === 'boolean'
14072:    ? policyRules.approval_before_publish
14073:    : policyRules.approval_before_publish == null ? true : Boolean(policyRules.approval_before_publish);
14087:    logGovernanceBlock('freeze_publishing');
14092:        rule: 'freeze_publishing'
14099:      logGovernanceBlock('approval_before_publish', { reason: 'job_id_missing' });
14104:          rule: 'approval_before_publish'
14113:      logGovernanceBlock('approval_before_publish', {
14121:          rule: 'approval_before_publish',
20592:    assertPublishingMutationAllowed(projectName, 'publish', {
20635:    assertPublishingMutationAllowed(projectName, 'publish', {
20771:    assertPublishingMutationAllowed(projectName, 'publish', {
20877:    assertPublishingMutationAllowed(projectName, 'publish', {

## Backend queue-center route range

function handleGetProjectOperations(req, res) {
  try {
    return res.json(buildProjectOperationsPayload(req.params.project));
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to build project operations payload'
    });
  }
}

app.get('/media-manager/project/:project/operations', handleGetProjectOperations);
app.get('/public/media-manager/project/:project/operations', handleGetProjectOperations);

function handleGetTaskCenter(req, res) {
  try {
    const snapshot = buildProjectOperationsPayload(req.params.project);
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      task_center: snapshot.task_center || {}
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to build task center payload'
    });
  }
}

function handleGetQueueCenter(req, res) {
  try {
    const snapshot = buildProjectOperationsPayload(req.params.project);
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      queue_center: snapshot.queue_center || {}
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to build queue center payload'
    });
  }
}

function handleGetJobMonitor(req, res) {
  try {
    const snapshot = buildProjectOperationsPayload(req.params.project);
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      job_monitor: snapshot.job_monitor || {}
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to build job monitor payload'
    });
  }
}

function handleGetNotificationCenter(req, res) {
  try {
    const snapshot = buildProjectOperationsPayload(req.params.project);
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      notification_center: snapshot.notification_center || {}
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to build notification center payload'
    });
  }
}

app.get('/media-manager/project/:project/task-center', handleGetTaskCenter);
app.get('/public/media-manager/project/:project/task-center', handleGetTaskCenter);
app.get('/media-manager/project/:project/queue-center', handleGetQueueCenter);
app.get('/public/media-manager/project/:project/queue-center', handleGetQueueCenter);
app.get('/media-manager/project/:project/job-monitor', handleGetJobMonitor);
app.get('/public/media-manager/project/:project/job-monitor', handleGetJobMonitor);
app.get('/media-manager/project/:project/notification-center', handleGetNotificationCenter);
app.get('/public/media-manager/project/:project/notification-center', handleGetNotificationCenter);

function handleGetOperationsSchema(req, res) {
  return res.json({
    project: String(req.params.project || '').trim().toLowerCase(),
    status_models: STATUS_MODELS
  });
}


## Backend publishing mutation route range
  await handleProjectIntegrationAction(req, res, 'import-history');
});

app.post('/media-manager/project/:project/integrations/:integrationId/disconnect', async (req, res) => {
  await handleProjectIntegrationAction(req, res, 'disconnect');
});

app.post('/public/media-manager/project/:project/integrations/:integrationId/disconnect', async (req, res) => {
  await handleProjectIntegrationAction(req, res, 'disconnect');
});

// TODO(phase4a): Keep `/public/media-manager/...` write aliases for active frontend compatibility.
// They remain protected by the same centralized write-key middleware as `/media-manager/...`.
app.post('/media-manager/project/:project/publishing/schedule', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'schedule', {
      status: req.body?.status
    });
    const result = upsertScheduledJob(req.params.project, {
      title: req.body?.title,
      wave_name: req.body?.wave_name,
      channel: req.body?.channel,
      scheduled_for: req.body?.scheduled_for,
      status: req.body?.status,
      mode: req.body?.mode,
      offer: req.body?.offer,
      notes: req.body?.notes,
      preview: req.body?.preview
    }, {
      createIfMissing: true
    });

    return res.json({
      job: result
    });
  } catch (error) {
    logCriticalFailure('publishing_schedule', req, error, {
      project: req.params.project
    });
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to save publishing schedule',
      details: error.details || undefined
    });
  }
});

app.post('/public/media-manager/project/:project/publishing/schedule', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'schedule', {
      status: req.body?.status
    });
    const result = upsertScheduledJob(req.params.project, {
      title: req.body?.title,
      wave_name: req.body?.wave_name,
      channel: req.body?.channel,
      scheduled_for: req.body?.scheduled_for,
      status: req.body?.status,
      mode: req.body?.mode,
      offer: req.body?.offer,
      notes: req.body?.notes,
      preview: req.body?.preview
    }, {
      createIfMissing: true
    });

    return res.json({
      job: result
    });
  } catch (error) {
    logCriticalFailure('publishing_schedule', req, error, {
      project: req.params.project
    });
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to save publishing schedule',
      details: error.details || undefined
    });
  }
});

app.post('/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'reschedule', {
      jobId: req.params.jobId,
      status: req.body?.status || 'scheduled'
    });
    const result = updateScheduledJobRecord(req.params.project, req.params.jobId, {
      title: req.body?.title,
      wave_name: req.body?.wave_name,
      channel: req.body?.channel,
      scheduled_for: req.body?.scheduled_for,
      status: req.body?.status || 'scheduled',
      mode: req.body?.mode,
      offer: req.body?.offer,
      notes: req.body?.notes,
      preview: req.body?.preview
    });

    return res.json({
      job: result
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to reschedule publishing item',
      details: error.details || undefined
    });
  }
});

app.post('/public/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'reschedule', {
      jobId: req.params.jobId,
      status: req.body?.status || 'scheduled'
    });
    const result = updateScheduledJobRecord(req.params.project, req.params.jobId, {
      title: req.body?.title,
      wave_name: req.body?.wave_name,
      channel: req.body?.channel,
      scheduled_for: req.body?.scheduled_for,
      status: req.body?.status || 'scheduled',
      mode: req.body?.mode,
      offer: req.body?.offer,
      notes: req.body?.notes,
      preview: req.body?.preview
    });

    return res.json({
      job: result
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to reschedule publishing item',
      details: error.details || undefined
    });
  }
});

app.post('/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'ready', {
      jobId: req.params.jobId,
      status: 'ready'
    });
    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
      status: 'ready',
      notes: req.body?.notes
    });

    return res.json({
      job
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to approve publishing item',
      details: error.details || undefined
    });
  }
});

app.post('/public/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'ready', {
      jobId: req.params.jobId,
      status: 'ready'
    });
    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
      status: 'ready',
      notes: req.body?.notes
    });

    return res.json({
      job
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to approve publishing item',
      details: error.details || undefined
    });
  }
});

app.post('/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'publish', {
      jobId: req.params.jobId,
      status: 'published'
    });
    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
      status: 'published',
      notes: req.body?.notes
    });
    const result = recordPublishingExecutionOutcome(req.params.project, req.params.jobId, {
      execution_status: 'published',
      action_type: 'manual_publish_complete',
      notes: req.body?.notes || ['Publishing completed from Control Center.']
    });

    return res.json({
      job,
      result
    });
  } catch (error) {
    logCriticalFailure('publishing_publish', req, error, {
      project: req.params.project,
      jobId: req.params.jobId
    });
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to publish item',
      details: error.details || undefined
    });
  }
});

app.post('/public/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'publish', {
      jobId: req.params.jobId,
      status: 'published'
    });
    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
      status: 'published',
      notes: req.body?.notes
    });
    const result = recordPublishingExecutionOutcome(req.params.project, req.params.jobId, {
      execution_status: 'published',
      action_type: 'manual_publish_complete',
      notes: req.body?.notes || ['Publishing completed from Control Center.']
    });

    return res.json({
      job,
      result
    });
  } catch (error) {
    logCriticalFailure('publishing_publish', req, error, {
      project: req.params.project,
      jobId: req.params.jobId
    });
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to publish item',
      details: error.details || undefined
    });
  }
});

app.post('/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'fail', {
      jobId: req.params.jobId,
      status: 'failed'
    });
    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
      status: 'failed',
      notes: req.body?.notes
    });
    const result = recordPublishingExecutionOutcome(req.params.project, req.params.jobId, {
      execution_status: 'failed',
      action_type: 'manual_publish_failed',
      notes: req.body?.notes || ['Publishing failed and needs follow-up.']
    });

    return res.json({
      job,
      result
    });
  } catch (error) {
    logCriticalFailure('publishing_fail', req, error, {
      project: req.params.project,
      jobId: req.params.jobId
    });
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to mark publishing item as failed',
      details: error.details || undefined
    });
  }
});

app.post('/public/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'fail', {
      jobId: req.params.jobId,
      status: 'failed'
    });
    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
      status: 'failed',
      notes: req.body?.notes
    });
    const result = recordPublishingExecutionOutcome(req.params.project, req.params.jobId, {
      execution_status: 'failed',
      action_type: 'manual_publish_failed',
      notes: req.body?.notes || ['Publishing failed and needs follow-up.']
    });

    return res.json({
      job,
      result
    });
  } catch (error) {
    logCriticalFailure('publishing_fail', req, error, {
      project: req.params.project,
      jobId: req.params.jobId
    });
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to mark publishing item as failed',
      details: error.details || undefined
    });

## Backend publishing governance guard range
      String(item?.entity_type || '').trim() === 'publishing_job'
      && String(item?.entity_id || '').trim() === String(jobId || '').trim()
    )
    .sort((a, b) => {
      const aTime = new Date(a?.updated_at || a?.created_at || 0).getTime();
      const bTime = new Date(b?.updated_at || b?.created_at || 0).getTime();
      return bTime - aTime;
    })[0] || null;
}

function assertPublishingMutationAllowed(projectName, action, options = {}) {
  const governance = getGovernancePolicy(projectName);
  // getGovernancePolicy always returns a normalized policy with policy_rules merged
  // from DEFAULT_POLICY_RULES, so policy_rules is always a fully-populated object.
  // We still guard defensively here in case of unexpected call paths.
  const policyRules = governance && typeof governance === 'object' && governance.policy_rules && typeof governance.policy_rules === 'object'
    ? governance.policy_rules
    : {};
  const jobId = String(options.jobId || '').trim();
  const requestedStatus = normalizePublishingJobStatus(options.status, '');
  const actionKey = String(action || '').trim().toLowerCase();
  const freezeSensitiveAction = ['schedule', 'reschedule', 'ready', 'publish'].includes(actionKey)
    || ['ready', 'published'].includes(requestedStatus);
  const approvalSensitiveAction = ['ready', 'publish'].includes(actionKey)
    || ['ready', 'published'].includes(requestedStatus);

  // Use explicit boolean coercion with safe defaults matching DEFAULT_POLICY_RULES:
  //   freeze_publishing  → default false (permissive — freeze is opt-in)
  //   approval_before_publish → default true (restrictive — approval is required by default)
  const freezePublishing = typeof policyRules.freeze_publishing === 'boolean'
    ? policyRules.freeze_publishing
    : policyRules.freeze_publishing == null ? false : Boolean(policyRules.freeze_publishing);
  const approvalBeforePublish = typeof policyRules.approval_before_publish === 'boolean'
    ? policyRules.approval_before_publish
    : policyRules.approval_before_publish == null ? true : Boolean(policyRules.approval_before_publish);

  function logGovernanceBlock(rule, extra = {}) {
    appLogger.warn('governance_blocked', {
      route: '/governance/publishing',
      action: actionKey || 'unknown',
      project: projectName,
      status: requestedStatus || null,
      rule,
      ...sanitizeValue(extra)
    });
  }

  if (freezeSensitiveAction && freezePublishing) {
    logGovernanceBlock('freeze_publishing');
    throw buildPublishingGovernanceError(
      'Publishing is frozen by governance policy. The requested publishing mutation was blocked.',
      {
        action: actionKey,
        rule: 'freeze_publishing'
      }
    );
  }

  if (approvalSensitiveAction && approvalBeforePublish) {
    if (!jobId) {
      logGovernanceBlock('approval_before_publish', { reason: 'job_id_missing' });
      throw buildPublishingGovernanceError(
        'Approval before publish is enabled. This publishing action requires a durable publishing job with an approved governance decision.',
        {
          action: actionKey,
          rule: 'approval_before_publish'
        }
      );
    }

    const approval = getLatestPublishingApproval(projectName, jobId);
    const approvalStatus = String(approval?.status || '').trim().toLowerCase();

    if (!['approved', 'overridden'].includes(approvalStatus)) {
      logGovernanceBlock('approval_before_publish', {
        job_id: jobId,
        approval_status: approvalStatus || 'missing'
      });
      throw buildPublishingGovernanceError(
        'Approval before publish is enabled. The publishing job is not approved for ready/publish mutation.',
        {
          action: actionKey,
          rule: 'approval_before_publish',
          job_id: jobId,
          approval_status: approvalStatus || 'missing'
        }
      );
    }
  }
}

function hydratePublishingExecutionResult(projectName, result, scheduledJobs = []) {
