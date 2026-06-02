# PHASE 3AB.2 — Notification API / Backend Evidence

## Frontend API notification functions
451:  return new Promise((resolve) => {
453:      requestAnimationFrame(() => resolve());
457:    setTimeout(resolve, 0);
1262:  return new Promise((resolve) => {
1263:    setTimeout(resolve, 750);
1323:  normalized._optionalReady = Promise.resolve().then(optionalReady);
1984:export async function fetchProjectNotificationCenter(projectName) {
1990:    `/media-manager/project/${encodeURIComponent(projectName)}/notification-center`,
2276:export async function markProjectNotification(projectName, notificationId, payload = {}) {
2286:    `/media-manager/project/${encodeURIComponent(projectName)}/notifications/${encodeURIComponent(notificationId)}`,

## API function range around notification center and mark notification
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


  const suffix = limit ? `?limit=${encodeURIComponent(limit)}` : "";

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/events${suffix}`,
    "Failed to load event log"
  );
}

export async function markProjectNotification(projectName, notificationId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!notificationId) {
    throw new Error("Missing notification id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/notifications/${encodeURIComponent(notificationId)}`,
    "PATCH",
    payload,
    "Failed to update notification"
  );
}

export async function uploadProjectAsset(projectName, assetType, file) {
  if (!projectName) {
    throw new Error("Missing project name");

## Backend notification route markers
48:const { UnifiedDataPathResolver } = require('./lib/data/unified-data-path-resolver');
72:  resolveProjectPath,
431:  resolver: unifiedDataPathResolver,
441:function resolveMediaProjectName(req) {
452:  const projectName = resolveMediaProjectName(req);
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
2090:  const prepareFile = resolveEmailReadCandidate({
2212:  const rendersDir = resolveExecutionReadCandidate({
2501:  const preparedDir = resolveEmailReadCandidate({
2783:  const resolution = unifiedDataPathResolver.resolve(projectName, {
2787:  const outputDirResolution = resolveExecutionReadCandidate({
2820:  const resolution = unifiedDataPathResolver.resolve(projectName, {
2993:  const packagesDir = resolveExecutionReadCandidate({
3015:  const resolution = unifiedDataPathResolver.resolve(projectName, {
3114:  const tiktokDir = resolveExecutionReadCandidate({
3274:  const youtubeDir = resolveExecutionReadCandidate({
3296:  const resolution = unifiedDataPathResolver.resolve(projectName, {
3397:      'marketplace ready',
3502:      ? resolveExecutionReadCandidate({
3512:      ? resolveExecutionReadCandidate({
3540:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
3544:  const baseDir = resolveExecutionReadCandidate({
3845:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
3849:  const baseDir = resolveExecutionReadCandidate({
4302:  const schedulerDir = resolveExecutionReadCandidate({
4346:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
4350:  const baseDir = resolveExecutionReadCandidate({
4715:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
4719:  const baseDir = resolveExecutionReadCandidate({
4757:  const jobsDir = resolveExecutionReadCandidate({
4823:  const rendersDir = resolveExecutionReadCandidate({
4847:  const renderRecord = resolveExecutionReadCandidate({
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
10846:function handleGetNotificationCenter(req, res) {
10866:app.get('/media-manager/project/:project/notification-center', handleGetNotificationCenter);
10867:app.get('/public/media-manager/project/:project/notification-center', handleGetNotificationCenter);
11596:function handleListNotifications(req, res) {
11606:      error: error.message || 'Failed to list notifications'
11611:app.get('/media-manager/project/:project/notifications', handleListNotifications);
11612:app.get('/public/media-manager/project/:project/notifications', handleListNotifications);
11613:app.patch('/media-manager/project/:project/notifications/:notificationId', (req, res) => {
11626:app.patch('/public/media-manager/project/:project/notifications/:notificationId', (req, res) => {
12637:  const candidate = resolveExecutionReadCandidate({
12653:  const resolution = unifiedDataPathResolver.resolve(projectName, {
12980:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
12984:  const baseDir = resolveExecutionReadCandidate({
13066:  const filePath = resolveExecutionReadCandidate({
13129:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
13133:  const baseDir = resolveExecutionReadCandidate({
13282:  const mediaDir = resolveExecutionReadCandidate({
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
16299:      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
16348:      const profilePath = resolveLegacyExecutionProjectPaths(projectName).profilePath;
16370:      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
16448:      const queuePath = resolveLegacyExecutionProjectPaths(projectName).campaignStrategyQueuePath;
16475:      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
16530:  const profilePath = resolveLegacyExecutionProjectPaths(projectName).profilePath;
17147:      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
17873:      const resolution = unifiedDataPathResolver.resolve(projectName, {
17943:      const resolution = unifiedDataPathResolver.resolve(projectName, {
17968:      const resolution = unifiedDataPathResolver.resolve(projectName, {
18013:      const resolution = unifiedDataPathResolver.resolve(projectName, {
18810:    const deliveryDir = resolveEmailReadCandidate({
20955:  resolveProjectPath,
20971:  const projectRoot = resolveProjectPath(path.join(DATA_DIR, 'projects'), safeProject).projectRoot;
21298:  resolvePublishPackageForExecution,
21300:  resolveEmailPackageForExecution,
21303:  resolveCampaignPackageForAds,

## Backend notification route ranges
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

      policy: getGovernancePolicy(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to load governance policy'
    });
  }
}

app.get('/media-manager/project/:project/governance', handleGetGovernance);
app.get('/public/media-manager/project/:project/governance', handleGetGovernance);
app.get('/media-manager/project/:project/governance/policy', handleGetGovernancePolicy);
app.get('/public/media-manager/project/:project/governance/policy', handleGetGovernancePolicy);
app.post('/media-manager/project/:project/governance/policy', handleUpdateGovernancePolicy);
app.post('/public/media-manager/project/:project/governance/policy', handleUpdateGovernancePolicy);

function handleListNotifications(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      items: listNotifications(req.params.project, {
        limit: req.query?.limit
      })
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to list notifications'
    });
  }
}

app.get('/media-manager/project/:project/notifications', handleListNotifications);
app.get('/public/media-manager/project/:project/notifications', handleListNotifications);
app.patch('/media-manager/project/:project/notifications/:notificationId', (req, res) => {
  try {
    const notification = markNotification(req.params.project, req.params.notificationId, req.body || {});
    return res.json({
      notification,
      operations: buildProjectOperationsPayload(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to update notification'
    });
  }
});
app.patch('/public/media-manager/project/:project/notifications/:notificationId', (req, res) => {
  try {
    const notification = markNotification(req.params.project, req.params.notificationId, req.body || {});
    return res.json({
      notification,
      operations: buildProjectOperationsPayload(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to update notification'
