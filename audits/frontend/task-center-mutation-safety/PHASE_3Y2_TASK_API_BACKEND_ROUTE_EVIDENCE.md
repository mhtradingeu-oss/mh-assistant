# PHASE 3Y.2 — Task API / Backend Route Evidence

## Frontend API task functions
1595:export async function createProjectTask(projectName, payload = {}) {
1601:    `/media-manager/project/${encodeURIComponent(projectName)}/tasks`,
1608:export async function listProjectTasks(projectName, limit) {
1615:    `/media-manager/project/${encodeURIComponent(projectName)}/tasks${suffix}`,
1951:export async function fetchProjectTaskCenter(projectName) {
1957:    `/media-manager/project/${encodeURIComponent(projectName)}/task-center`,

## API task function ranges
1595:export async function createProjectTask(projectName, payload = {}) {
1608:export async function listProjectTasks(projectName, limit) {
1951:export async function fetchProjectTaskCenter(projectName) {

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
  );
}

export async function fetchProjectNotificationCenter(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/notification-center`,
    "Failed to load notification center"
  );
}

export async function fetchProjectTeam(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/team`,
    "Failed to load project team model"
  );
}

export async function saveProjectTeam(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/team`,
    "POST",
    payload,
    "Failed to update project team model"

## Backend task route markers
10804:function handleGetTaskCenter(req, res) {
10813:      error: error.message || 'Failed to build task center payload'
10860:app.get('/media-manager/project/:project/task-center', handleGetTaskCenter);
10861:app.get('/public/media-manager/project/:project/task-center', handleGetTaskCenter);
11446:function handleCreateTask(req, res) {
11455:      error: error.message || 'Failed to create task'
11460:app.get('/media-manager/project/:project/tasks', handleListTasks);
11461:app.get('/public/media-manager/project/:project/tasks', handleListTasks);
11462:app.post('/media-manager/project/:project/tasks', handleCreateTask);
11463:app.post('/public/media-manager/project/:project/tasks', handleCreateTask);
11464:app.get('/media-manager/project/:project/tasks/:taskId', (req, res) => {
11477:app.get('/public/media-manager/project/:project/tasks/:taskId', (req, res) => {

## Backend task route ranges
    return res.json({
      ...result,
      deleted: true,
      status: 'archived'
    });
  } catch (error) {
    return sendAssetMutationError(res, error, 'Failed to delete asset.');
  }
});

app.delete('/media-manager/project/:project/assets/:assetId', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const assetId = String(req.params.assetId || '').trim();
    const note = String(req.body?.note || '').trim();

    if (!assetId) {
      return res.status(400).json({ error: 'Missing assetId.' });
    }

    const result = mutateProjectAssetRegistry(req.params.project, assetId, (asset, now) => {
      asset.deleted = true;
      asset.deleted_at = now;
      asset.deleted_by = 'control_center';
      asset.delete_note = note || asset.delete_note || 'Soft deleted from Control Center Library.';
      asset.status = 'archived';
      asset.readiness_status = 'archived';
      asset.review_status = 'archived';
      asset.archived = true;
      asset.archived_at = asset.archived_at || now;
    });

    return res.json({
      ...result,
      deleted: true,
      status: 'archived'
    });
  } catch (error) {
    return sendAssetMutationError(res, error, 'Failed to delete asset.');
  }
});

app.post('/media-manager/project/:project/library/refresh', (req, res) => {
  try {
    return res.json(refreshProjectLibraryRegistry(req.params.project));
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to refresh project library'
    });
  }
});

app.post('/media-manager/project/:project/setup', (req, res) => {
  try {
    return res.json(updateProjectSetup(req.params.project, req.body || {}));
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to save project setup'
    });
  }
});

app.post('/public/media-manager/project/:project/setup', (req, res) => {
  try {
    return res.json(updateProjectSetup(req.params.project, req.body || {}));
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to save project setup'
    });
  }
});

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

app.get('/media-manager/project/:project/operations/schema', handleGetOperationsSchema);
app.get('/public/media-manager/project/:project/operations/schema', handleGetOperationsSchema);

function handleGetProjectTeam(req, res) {
  try {

app.post('/media-manager/project/:project/ai/guidance', handleExecuteAiGuidance);
app.post('/public/media-manager/project/:project/ai/guidance', handleExecuteAiGuidance);
app.post('/media-manager/project/:project/ai/workflows/:workflowId/run', handleExecuteAiWorkflow);
app.post('/public/media-manager/project/:project/ai/workflows/:workflowId/run', handleExecuteAiWorkflow);
app.get('/media-manager/project/:project/ai/artifacts', handleListAiArtifacts);
app.get('/public/media-manager/project/:project/ai/artifacts', handleListAiArtifacts);
app.get('/media-manager/project/:project/ai/recommendations', handleListAiRecommendations);
app.get('/public/media-manager/project/:project/ai/recommendations', handleListAiRecommendations);
app.get('/media-manager/project/:project/ai/memory', handleListAiMemory);
app.get('/public/media-manager/project/:project/ai/memory', handleListAiMemory);

function handleListTasks(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      items: listTasks(req.params.project, {
        limit: req.query?.limit
      })
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to list tasks'
    });
  }
}

function handleCreateTask(req, res) {
  try {
    const task = createTask(req.params.project, req.body || {});
    return res.json({
      task,
      operations: buildProjectOperationsPayload(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to create task'
    });
  }
}

app.get('/media-manager/project/:project/tasks', handleListTasks);
app.get('/public/media-manager/project/:project/tasks', handleListTasks);
app.post('/media-manager/project/:project/tasks', handleCreateTask);
app.post('/public/media-manager/project/:project/tasks', handleCreateTask);
app.get('/media-manager/project/:project/tasks/:taskId', (req, res) => {
  try {
    const task = getTask(req.params.project, req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.json({ task });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to load task'
    });
  }
});
app.get('/public/media-manager/project/:project/tasks/:taskId', (req, res) => {
  try {
    const task = getTask(req.params.project, req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.json({ task });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to load task'
    });
  }
});

