# PHASE 3AA.2 — Job / Media API Backend Evidence

## Frontend API job/media functions
404:            message: fallbackError?.message || "JSON fallback failed"
451:  return new Promise((resolve) => {
453:      requestAnimationFrame(() => resolve());
457:    setTimeout(resolve, 0);
516:async function parseJson(response, fallbackMessage = "Request failed", requestMeta = {}) {
694:      message: error?.message || "Request failed"
741:        status: response.ok ? "failed" : "error",
752:    const message = String(payload?.error || payload?.message || fallbackMessage || "Request failed").trim();
1158:    const error = new Error(`Required project data failed: ${message}`);
1262:  return new Promise((resolve) => {
1263:    setTimeout(resolve, 750);
1323:  normalized._optionalReady = Promise.resolve().then(optionalReady);
1923:export async function failPublishingItem(projectName, jobId, payload = {}) {
1933:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/fail`,
1936:    "Failed to mark publishing item as failed"
1973:export async function fetchProjectJobMonitor(projectName) {
1979:    `/media-manager/project/${encodeURIComponent(projectName)}/job-monitor`,
2121:    `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs${suffix}`,
2133:      `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs/${encodeURIComponent(payload.id)}`,
2141:    `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs`,

## API function ranges around job monitor and media jobs
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
  );
}

export async function listProjectCampaigns(projectName, limit) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  const suffix = limit ? `?limit=${encodeURIComponent(limit)}` : "";

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/campaigns${suffix}`,
    "Failed to load campaigns"
  );
}

export async function saveProjectCampaign(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (payload?.id) {
    return sendJson(
      `/media-manager/project/${encodeURIComponent(projectName)}/campaigns/${encodeURIComponent(payload.id)}`,
      "PATCH",
      payload,
      "Failed to update campaign"
    );
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/campaigns`,
    "POST",
    payload,
    "Failed to create campaign"
  );
}

export async function listProjectContentItems(projectName, params = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  const search = new URLSearchParams();

  if (params.limit) {
    search.set("limit", String(params.limit));
  }

  if (params.campaign_id) {
    search.set("campaign_id", String(params.campaign_id));
  }

  const suffix = search.toString() ? `?${search.toString()}` : "";

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/content-items${suffix}`,
    "Failed to load content items"
  );
}

export async function saveProjectContentItem(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (payload?.id) {
    return sendJson(
      `/media-manager/project/${encodeURIComponent(projectName)}/content-items/${encodeURIComponent(payload.id)}`,
      "PATCH",
      payload,
      "Failed to update content item"
    );
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/content-items`,
    "POST",
    payload,
    "Failed to create content item"
  );
}

export async function listProjectMediaJobs(projectName, params = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  const search = new URLSearchParams();

  if (params.limit) {
    search.set("limit", String(params.limit));
  }

  if (params.campaign_id) {
    search.set("campaign_id", String(params.campaign_id));
  }

  if (params.content_item_id) {
    search.set("content_item_id", String(params.content_item_id));
  }

  const suffix = search.toString() ? `?${search.toString()}` : "";

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs${suffix}`,
    "Failed to load media jobs"
  );
}

export async function saveProjectMediaJob(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (payload?.id) {
    return sendJson(
      `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs/${encodeURIComponent(payload.id)}`,
      "PATCH",
      payload,
      "Failed to update media job"
    );
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs`,
    "POST",
    payload,
    "Failed to create media job"
  );
}

export async function improveMediaPrompt(payload = {}) {
  return sendJson(
    "/api/media/improve-prompt",
    "POST",
    payload,
    "Failed to improve media prompt"
  );
}

export async function brandCheckMedia(payload = {}) {
  return sendJson(
    "/api/media/brand-check",
    "POST",
    payload,
    "Failed to run media brand check"
  );
}


## Backend job-monitor and media-job route markers
48:const { UnifiedDataPathResolver } = require('./lib/data/unified-data-path-resolver');
72:  resolveProjectPath,
231:  /^\/run_scheduler_worker_once\/?$/i
416:    retryAfterMs: decision.retryAfterMs
419:  res.set('Retry-After', String(Math.ceil(decision.retryAfterMs / 1000)));
423:    message: 'Too many requests. Please retry shortly.'
431:  resolver: unifiedDataPathResolver,
441:function resolveMediaProjectName(req) {
452:  const projectName = resolveMediaProjectName(req);
467:      title: asString(req?.body?.title || `${requestType} media job`),
519:function resolveUploadTarget(projectName, type) {
557:function resolveMediaFilePath(projectName, type, filename) {
561:  const uploadTarget = resolveUploadTarget(project, normalizedType);
566:  const absoluteRoot = path.resolve(String(rootPath || ''));
567:  const absoluteTarget = path.resolve(String(targetPath || ''));
599:    .map((entry) => path.resolve(entry));
633:function resolveMediaFilePathFromQuery(projectName, requestedPath, assetId) {
639:  const resolveCandidate = (candidatePath) => {
640:    const candidate = path.resolve(String(candidatePath || ''));
675:      const resolved = resolveCandidate(candidate);
676:      if (resolved) {
678:          filePath: resolved,
693:    const resolved = resolveCandidate(byAssetId);
694:    if (resolved) {
696:        filePath: resolved,
741:        const uploadTarget = resolveUploadTarget(project, type);
761:const BASE_DIR = process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '../..');
1170:function resolveReadCandidateFromBases(options = {}) {
1180:  const resolution = options.resolution || unifiedDataPathResolver.resolve(projectName, {
1252:  appLogger.info('read_redirection_resolved', {
1254:    action: 'resolve_read_candidate',
1276:function resolveExecutionReadCandidate(options = {}) {
1286:  const resolution = unifiedDataPathResolver.resolve(projectName, {
1322:  return resolveReadCandidateFromBases({
1341:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
1430:function resolveEmailReadCandidate(options = {}) {
1438:  return resolveExecutionReadCandidate({
1454:  const candidate = resolveEmailReadCandidate({
1511:  return resolveProjectPath(EXECUTION_DIR, requireQueueProjectName(projectName)).projectRoot;
1672:      unresolved_risk: 0
1710:      const cause = classifyFallbackWithParityContext(entry, dualWriteIndex) || 'unresolved_risk';
1712:        stats.fallback_causes.unresolved_risk += 1;
1723:  let unresolvedStructuralMismatches = 0;
1736:    unresolvedStructuralMismatches += stats.fallback_causes.structural_mismatch;
1754:    unresolvedStructuralMismatches === 0 &&
1761:    unresolvedStructuralMismatches <= 3
1780:      unresolved_structural_mismatches: unresolvedStructuralMismatches,
1805:    unresolved_structural_mismatches: 0,
1813:    aggregate.unresolved_structural_mismatches += summary.totals.unresolved_structural_mismatches;
1834:  const outputsDir = resolveExecutionReadCandidate({
1907:  if (!renderRequest || renderRequest.status !== 'completed') {
1908:    throw new Error('No completed render request found');
2090:  const prepareFile = resolveEmailReadCandidate({
2212:  const rendersDir = resolveExecutionReadCandidate({
2461:  const updated = markRenderResult(projectName, renderId, 'completed', {
2501:  const preparedDir = resolveEmailReadCandidate({
2783:  const resolution = unifiedDataPathResolver.resolve(projectName, {
2787:  const outputDirResolution = resolveExecutionReadCandidate({
2820:  const resolution = unifiedDataPathResolver.resolve(projectName, {
2993:  const packagesDir = resolveExecutionReadCandidate({
3015:  const resolution = unifiedDataPathResolver.resolve(projectName, {
3114:  const tiktokDir = resolveExecutionReadCandidate({
3274:  const youtubeDir = resolveExecutionReadCandidate({
3296:  const resolution = unifiedDataPathResolver.resolve(projectName, {
3502:      ? resolveExecutionReadCandidate({
3512:      ? resolveExecutionReadCandidate({
3540:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
3544:  const baseDir = resolveExecutionReadCandidate({
3845:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
3849:  const baseDir = resolveExecutionReadCandidate({
3985:  if (['published', 'completed', 'complete', 'success', 'done', 'sent', 'live'].includes(normalized)) {
4302:  const schedulerDir = resolveExecutionReadCandidate({
4346:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
4350:  const baseDir = resolveExecutionReadCandidate({
4715:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
4719:  const baseDir = resolveExecutionReadCandidate({
4757:  const jobsDir = resolveExecutionReadCandidate({
4823:  const rendersDir = resolveExecutionReadCandidate({
4847:  const renderRecord = resolveExecutionReadCandidate({
4863:  renderRequest.completed_at = new Date().toISOString();
4917:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
4921:  const baseDir = resolveExecutionReadCandidate({
5108:function resolveSourceOfTruthAssets(projectName) {
5162:  const sourceOfTruth = resolveSourceOfTruthAssets(projectName);
5322:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
5713:function resolveRequestProjectName(req, options = {}) {
5733:  const projectName = resolveRequestProjectName(req, options);
6138:  const resolved = resolveProjectPath(path.join(DATA_DIR, 'projects'), projectName);
6139:  const safeProject = resolved.project;
6140:  const baseDir = resolved.projectRoot;
6164:  const resolved = resolveProjectPath(LEGACY_BRAND_ASSETS_DIR, projectName);
6166:    project: resolved.project,
6167:    baseDir: resolved.projectRoot,
6168:    brandProfilePath: path.join(resolved.projectRoot, 'brand-profile.json'),
6169:    assetsRegistryPath: path.join(resolved.projectRoot, 'assets-registry.json'),
6170:    mediaInputRegistryPath: path.join(resolved.projectRoot, 'media-input-registry.json')
6701:      'complete_project_profile',
6733:      starter_checklist: ['complete_artist_profile', 'upload_press_photos', 'add_music_links', 'define_fan_audience', 'create_release_campaign'],
7172:    setup_completeness: setupCompleteness,
7173:    brand_profile_completeness: brandProfileCompleteness,
7174:    source_of_truth_completeness: sourceOfTruthCompleteness,
7175:    assets_completeness: assetsCompleteness,
7176:    integrations_completeness: integrationsCompleteness,
7220:  if (domainScores.brand_profile_completeness < 100) missing.push('brand_profile_incomplete');
7221:  if (domainScores.source_of_truth_completeness < 100) missing.push('source_of_truth_incomplete');
7222:  if (domainScores.assets_completeness < 100) missing.push('assets_incomplete');
7223:  if (domainScores.integrations_completeness < 100) missing.push('integrations_incomplete');
7676:      healthSummary = 'Some connection data is saved, but required setup is still incomplete.';
9067:    status: missing.length ? 'connectors_incomplete' : 'connectors_ready'
9354:    const publishPackage = resolvePublishPackageForExecution(projectName, req.body || {});
9386:    const logProject = projectName || resolveProjectNameForLog(req);
9412:    const emailPackage = resolveEmailPackageForExecution(projectName, req.body || {});
9443:    const logProject = projectName || resolveProjectNameForLog(req);
9503:    const logProject = projectName || resolveProjectNameForLog(req);
9529:    const campaignPackage = resolveCampaignPackageForAds(projectName, req.body || {});
9556:    const logProject = projectName || resolveProjectNameForLog(req);
9599:    const projectName = resolveRequestProjectName(req);
9644:    const projectName = resolveRequestProjectName(req);
9813:    const projectName = resolveRequestProjectName(req);
9971:    const uploadTarget = resolveUploadTarget(project, type);
10043:  const queryResolution = resolveMediaFilePathFromQuery(project, requestedPath, requestedAssetId);
10053:    filePath = resolveMediaFilePath(project, type, filename);
10439:  const root = process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '../..');
10832:function handleGetJobMonitor(req, res) {
10864:app.get('/media-manager/project/:project/job-monitor', handleGetJobMonitor);
10865:app.get('/public/media-manager/project/:project/job-monitor', handleGetJobMonitor);
11051:      error: error.message || 'Failed to list media jobs'
11065:      error: error.message || 'Failed to save media job'
11079:      error: error.message || 'Failed to load media job'
11084:app.get('/media-manager/project/:project/media-jobs', handleListMediaJobs);
11085:app.get('/public/media-manager/project/:project/media-jobs', handleListMediaJobs);
11086:app.post('/media-manager/project/:project/media-jobs', handleUpsertMediaJob);
11087:app.post('/public/media-manager/project/:project/media-jobs', handleUpsertMediaJob);
11088:app.patch('/media-manager/project/:project/media-jobs/:mediaJobId', (req, res) => {
11095:app.patch('/public/media-manager/project/:project/media-jobs/:mediaJobId', (req, res) => {
11102:app.get('/media-manager/project/:project/media-jobs/:mediaJobId', handleGetMediaJob);
11103:app.get('/public/media-manager/project/:project/media-jobs/:mediaJobId', handleGetMediaJob);
11202:      status: result?.status || 'completed',
11248:      status: result?.status || 'completed',
11291:      status: result?.status || 'completed',
12433:      action_type: 'manual_publish_complete',
12434:      notes: req.body?.notes || ['Publishing completed from Control Center.']
12465:      action_type: 'manual_publish_complete',
12466:      notes: req.body?.notes || ['Publishing completed from Control Center.']
12637:  const candidate = resolveExecutionReadCandidate({
12653:  const resolution = unifiedDataPathResolver.resolve(projectName, {
12980:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
12984:  const baseDir = resolveExecutionReadCandidate({
13066:  const filePath = resolveExecutionReadCandidate({
13129:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
13133:  const baseDir = resolveExecutionReadCandidate({
13143:  const mediaDir = path.join(baseDir, 'media-jobs');
13146:  const legacyMediaDir = path.join(legacyBaseDir, 'media-jobs');
13282:  const mediaDir = resolveExecutionReadCandidate({
13285:    relativePath: 'media-jobs',
13289:    requestedFile: `campaign-finalization/media-jobs/${safeName}*`
13291:  const publishDir = resolveExecutionReadCandidate({
13300:  const emailFile = resolveExecutionReadCandidate({
13337:  const projectRoot = resolveProjectPath(path.join(DATA_DIR, 'projects'), safeProject).projectRoot;
13380:function resolveProjectNameForLog(req) {
13399:function resolvePublishPackageForExecution(projectName, input = {}) {
13466:function resolveEmailPackageForExecution(projectName, input = {}) {
13566:function resolveCampaignPackageForAds(projectName, input = {}) {
13631:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
13635:  const baseDir = resolveExecutionReadCandidate({
13717:  const filePath = resolveExecutionReadCandidate({
13928:  const executionResultPath = resolveExecutionReadCandidate({
14169:  const filePath = resolveExecutionReadCandidate({
14189:  const resultsDir = resolveExecutionReadCandidate({
14620:function resolveLegacyExecutionProjectPaths(projectName) {
14621:  const resolved = resolveProjectPath(path.join(EXECUTION_DIR, 'projects'), projectName);
14622:  const projectDir = resolved.projectRoot;
14625:    project: resolved.project,
14660:    const commandProject = resolveRequestProjectName(req, {
15868:        blogItem.enhancement_status = 'complete';
16299:      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
16348:      const profilePath = resolveLegacyExecutionProjectPaths(projectName).profilePath;
16370:      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
16448:      const queuePath = resolveLegacyExecutionProjectPaths(projectName).campaignStrategyQueuePath;
16475:      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
16530:  const profilePath = resolveLegacyExecutionProjectPaths(projectName).profilePath;
17147:      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
17666:      campaignExec.autogen_status = 'completed';
17668:      campaignExec.autogen_completed_at = new Date().toISOString();
17680:          autogen_status: 'completed',
17710:          autogen_completed_at: campaignExec.autogen_completed_at || null
17873:      const resolution = unifiedDataPathResolver.resolve(projectName, {
17943:      const resolution = unifiedDataPathResolver.resolve(projectName, {
17968:      const resolution = unifiedDataPathResolver.resolve(projectName, {
18013:      const resolution = unifiedDataPathResolver.resolve(projectName, {
18810:    const deliveryDir = resolveEmailReadCandidate({
19722:      error: 'Failed to build campaign media job',
20955:  resolveProjectPath,
20971:  const projectRoot = resolveProjectPath(path.join(DATA_DIR, 'projects'), safeProject).projectRoot;
21198:  const completed = jobs.filter((job) => job.status === 'completed');
21200:  const retryable = jobs.filter((job) => job.status === 'retryable');
21210:      completed: 0,
21212:      retryable: 0
21216:    if (job.status === 'completed') current.completed += 1;
21218:    if (job.status === 'retryable') current.retryable += 1;
21225:      ? Number(((entry.failed + entry.retryable) / entry.total_jobs).toFixed(4))
21231:    completed_jobs: completed.length,
21233:    retryable_jobs: retryable.length,
21298:  resolvePublishPackageForExecution,
21300:  resolveEmailPackageForExecution,
21303:  resolveCampaignPackageForAds,
21485:    const completed = [];
21486:    const retryable = [];
21489:      if (job.status === 'completed') {
21490:        completed.push(job);
21504:      if (job.status === 'retryable') {
21505:        retryable.push(job);
21531:        completed: completed.length,
21532:        retryable: retryable.length
21539:        completed,
21540:        retryable
21552:app.post('/run_scheduler_worker_once', (req, res) => {
21557:    const workerId = generateWorkerId(crypto);
21565:      if (job.status === 'completed') continue;
21575:      job.locked_by = workerId;
21584:      if (job.status !== 'running' || job.locked_by !== workerId) continue;
21590:        job.status = 'completed';
21591:        job.execution_state = result.execution_state || 'completed';
21600:          status: 'completed',
21607:            trigger: 'job_completed',
21623:          status: 'completed',
21633:        job.status = canRetry ? 'retryable' : 'failed';
21648:            can_retry: canRetry
21669:      worker_id: workerId,
21677:      message: error.message || 'Failed to run scheduler worker'
22057:      appLogger.info('shutdown_complete', { route: 'process', action: 'shutdown' });

## Backend job-monitor route range
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
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      team: readTeamModel(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to load project team model'
    });
  }
}

function handleUpdateProjectTeam(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      team: updateTeamModel(req.params.project, req.body || {}, req.body?.actor || 'control-center')
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to update project team model'
    });
  }
}

app.get('/media-manager/project/:project/team', handleGetProjectTeam);
app.get('/public/media-manager/project/:project/team', handleGetProjectTeam);
app.post('/media-manager/project/:project/team', handleUpdateProjectTeam);
app.post('/public/media-manager/project/:project/team', handleUpdateProjectTeam);

function handleListCampaigns(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      items: listCampaigns(req.params.project, {
        limit: req.query?.limit
      })
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to list campaigns'
    });
  }
}

function handleUpsertCampaign(req, res) {

## Backend media job route markers
11084:app.get('/media-manager/project/:project/media-jobs', handleListMediaJobs);
11085:app.get('/public/media-manager/project/:project/media-jobs', handleListMediaJobs);
11086:app.post('/media-manager/project/:project/media-jobs', handleUpsertMediaJob);
11087:app.post('/public/media-manager/project/:project/media-jobs', handleUpsertMediaJob);
11088:app.patch('/media-manager/project/:project/media-jobs/:mediaJobId', (req, res) => {
11095:app.patch('/public/media-manager/project/:project/media-jobs/:mediaJobId', (req, res) => {
11102:app.get('/media-manager/project/:project/media-jobs/:mediaJobId', handleGetMediaJob);
11103:app.get('/public/media-manager/project/:project/media-jobs/:mediaJobId', handleGetMediaJob);
13143:  const mediaDir = path.join(baseDir, 'media-jobs');
13146:  const legacyMediaDir = path.join(legacyBaseDir, 'media-jobs');
13285:    relativePath: 'media-jobs',
13289:    requestedFile: `campaign-finalization/media-jobs/${safeName}*`
