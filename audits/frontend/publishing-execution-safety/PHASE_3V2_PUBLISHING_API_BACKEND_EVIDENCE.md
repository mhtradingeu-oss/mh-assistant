# PHASE 3V.2 — Publishing API / Backend Evidence

## API publishing functions
913:      scheduled_jobs: [],
1626:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals`,
1629:    "Failed to create approval request"
1640:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals${suffix}`,
1641:    "Failed to load approvals"
1645:export async function decideProjectApproval(projectName, approvalId, payload = {}) {
1650:  if (!approvalId) {
1651:    throw new Error("Missing approval id");
1655:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals/${encodeURIComponent(approvalId)}/decision`,
1658:    "Failed to update approval"
1865:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/schedule`,
1868:    "Failed to save publishing schedule"
1872:export async function reschedulePublishingItem(projectName, jobId, payload = {}) {
1877:  if (!jobId) {
1878:    throw new Error("Missing job id");
1882:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/reschedule`,
1885:    "Failed to reschedule publishing item"
1889:export async function approvePublishingItem(projectName, jobId, payload = {}) {
1894:  if (!jobId) {
1895:    throw new Error("Missing job id");
1899:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/ready`,
1902:    "Failed to approve publishing item"
1906:export async function publishPublishingItem(projectName, jobId, payload = {}) {
1911:  if (!jobId) {
1912:    throw new Error("Missing job id");
1916:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/publish`,
1919:    "Failed to publish item"
1923:export async function failPublishingItem(projectName, jobId, payload = {}) {
1928:  if (!jobId) {
1929:    throw new Error("Missing job id");
1933:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/fail`,
1936:    "Failed to mark publishing item as failed"
1968:    `/media-manager/project/${encodeURIComponent(projectName)}/queue-center`,
1969:    "Failed to load queue center"
1979:    `/media-manager/project/${encodeURIComponent(projectName)}/job-monitor`,
1980:    "Failed to load job monitor"
2121:    `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs${suffix}`,
2122:    "Failed to load media jobs"
2133:      `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs/${encodeURIComponent(payload.id)}`,
2136:      "Failed to update media job"
2141:    `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs`,
2144:    "Failed to create media job"

## Server publishing/publication routes
21:} = require('./lib/execution/scheduler-helpers');
22:const { createSchedulerStorage } = require('./lib/execution/scheduler-storage');
23:const { createExecutionJobBridge } = require('./lib/execution/execution-job-bridge');
118:} = require('./lib/media/native/orchestrator/job-dispatch-orchestrator');
219:  /^\/publish-clone\/[^/]+\/?$/i,
222:  /^\/publish-blog\/[^/]+\/?$/i,
226:  /^\/execute_publish_package\/?$/i,
230:  /^\/schedule_execution_job\/?$/i,
231:  /^\/run_scheduler_worker_once\/?$/i
312:  /^\/scheduler_queue\/?$/i,
455:  const mediaJobId = asString(req?.body?.media_job_id || req?.body?.id || '');
467:      title: asString(req?.body?.title || `${requestType} media job`),
500:      media_job: mediaJob,
774:  DRAFT_QUEUE: 'email_draft_queue',
775:  MEDIA_QUEUE: 'email_media_queue'
780:  'manual_publish_ready',
1061:  publishing: {
1063:    canonical: 'publishing'
1095:    canonical: 'publishing/results'
1357:    canonicalLiveMediaQueueDir: path.join(EXECUTION_DIR, 'projects', safeProject, 'media', 'queue'),
1358:    legacyLiveMediaQueueDir: path.join(EXECUTION_DIR, safeProject, 'media', 'queue')
1401:      relativePath: 'email-queue.json',
1403:      requestedFile: 'content/email/email-queue.json',
1404:      pathContract: 'execution/projects/<project>/content/email/email-queue.json -> execution/<project>/content/email/email-queue.json'
1409:      relativePath: 'email-image-queue.json',
1411:      requestedFile: 'media/queue/email-image-queue.json',
1412:      pathContract: 'execution/projects/<project>/media/queue/email-image-queue.json -> execution/<project>/media/queue/email-image-queue.json'
1494:function readLiveEmailQueue(projectName, requestedIdentifier = 'email-draft-queue') {
1498:function writeLiveEmailQueue(projectName, queue = []) {
1499:  return writeEmailArtifactArray(requireQueueProjectName(projectName), EMAIL_ARTIFACT_TYPES.DRAFT_QUEUE, queue);
1502:function readLiveEmailMediaQueue(projectName, requestedIdentifier = 'email-media-queue') {
1506:function writeLiveEmailMediaQueue(projectName, queue = []) {
1507:  return writeEmailArtifactArray(requireQueueProjectName(projectName), EMAIL_ARTIFACT_TYPES.MEDIA_QUEUE, queue);
1514:function getLegacyContentQueuePath(projectName, queueType) {
1515:  const queueMap = {
1516:    ads: path.join('content', 'ads', 'ad-queue.json'),
1517:    social: path.join('content', 'social', 'post-queue.json'),
1518:    blog: path.join('content', 'blog', 'blog-queue.json'),
1519:    reel: path.join('content', 'campaigns', 'reel-brief-queue.json'),
1522:  const relativePath = queueMap[queueType];
1525:    throw new Error(`Unknown content queue type: ${queueType}`);
1528:  const queuePath = path.join(getLegacyExecutionRoot(projectName), relativePath);
1529:  ensureJsonFile(queuePath, []);
1530:  return queuePath;
1533:function readLegacyContentQueue(projectName, queueType) {
1534:  return readJsonFile(getLegacyContentQueuePath(projectName, queueType), []);
1537:function writeLegacyContentQueue(projectName, queueType, queue = []) {
1538:  writeJsonFile(getLegacyContentQueuePath(projectName, queueType), Array.isArray(queue) ? queue : []);
1554:  const queuePath = path.join(getProjectMediaDir(projectName), 'queue', 'blog-image-queue.json');
1555:  ensureJsonFile(queuePath, []);
1556:  return queuePath;
1562:  'publishing',
1945:      body: `This campaign asset was auto-prepared by the system using the latest approved brand-controlled render.`,
2743:    published_count: 0,
2752:    if (product.status === 'publish') summary.published_count += 1;
2949:    publish_status: imageInfo ? 'ready_for_publish' : 'needs_manual_review'
2969:    status: compliance.publish_status,
3061:    publish_status: imageInfo ? 'ready_for_production' : 'needs_manual_review'
3080:    status: compliance.publish_status,
3206:    publish_status: imageInfo ? 'ready_for_publish' : 'needs_manual_review'
3225:    : `This video package is designed for ${goal} using approved brand-controlled creative, with emphasis on product credibility, premium presentation, and visual trust.`;
3234:    status: compliance.publish_status,
3393:    description: `This Amazon package is built for ${goal} using approved real assets and a conversion-oriented marketplace structure.`,
3456:    description: `This eBay package is built for ${goal} using approved brand-controlled assets and a trust-oriented listing structure.`,
3640:    if (status !== 'publish' || !slug || !name || !stableKey) {
3696:      published_count: launchReadyProducts.length,
3846:    domain: 'publishing',
3851:    domain: 'publishing',
3854:    requestedIdentifier: 'publishing-root',
3855:    requestedFile: 'publishing'
3858:  const connectorsDir = path.join(baseDir, 'connectors');
3859:  const schedulerDir = path.join(baseDir, 'scheduler');
3860:  const legacyConnectorsDir = path.join(legacyBaseDir, 'connectors');
3861:  const legacySchedulerDir = path.join(legacyBaseDir, 'scheduler');
3864:  ensureDir(connectorsDir);
3865:  ensureDir(schedulerDir);
3872:    connectorsDir,
3873:    schedulerDir,
3916:    domain: 'publishing',
3917:    artifactType: 'publishing_connector_payload',
3929:function scheduleLaunchJob(projectName, waveName, channel, scheduledFor) {
3930:  assertPublishingMutationAllowed(projectName, 'schedule', {
3931:    status: 'scheduled'
3936:  const jobId = `sched_${Date.now()}`;
3937:  const job = {
3938:    job_id: jobId,
3942:    scheduled_for: scheduledFor,
3944:    status: 'scheduled',
3946:    connector_file: payload.file_path
3949:  const filePath = path.join(paths.legacySchedulerDir, `${jobId}.json`);
3952:    domain: 'publishing',
3953:    artifactType: 'publishing_scheduler_job',
3954:    identifier: jobId,
3956:    data: job
3960:    ...job,
3970:  if (['queued', 'queue', 'scheduled', 'pending', 'pending_publish'].includes(normalized)) return 'scheduled';
3974:      'ready_for_manual_publish',
3978:      'manual_publish',
3985:  if (['published', 'completed', 'complete', 'success', 'done', 'sent', 'live'].includes(normalized)) {
3986:    return 'published';
4030:  if (safeChannel) return `${safeChannel} publish`;
4113:function getPublishingJobFilePath(projectName, jobId) {
4115:  return path.join(paths.legacySchedulerDir, `${String(jobId || '').trim()}.json`);
4118:function hydrateScheduledJobRecord(projectName, job) {
4119:  const rawJob = job && typeof job === 'object' ? { ...job } : {};
4121:  let connectorPreview =
4122:    rawJob.connector_preview && typeof rawJob.connector_preview === 'object'
4123:      ? rawJob.connector_preview
4126:  if (!connectorPreview && rawJob.connector_file && fs.existsSync(rawJob.connector_file)) {
4127:    const connectorPayload = readJsonFile(rawJob.connector_file, {});
4128:    connectorPreview = buildPublishingPreviewFromConnectorPayload(connectorPayload, rawJob);
4133:      ...connectorPreview,
4138:    connectorPreview
4144:    job_id: String(rawJob.job_id || '').trim(),
4148:    scheduled_for: String(rawJob.scheduled_for || '').trim(),
4153:      rawJob.scheduled_for ? 'scheduled' : 'draft'
4155:    total_assets: Number(rawJob.total_assets || connectorPreview?.asset_count || 0) || 0,
4156:    connector_file: rawJob.connector_file || null,
4157:    connector_error: rawJob.connector_error || null,
4161:    connector_preview: connectorPreview,
4166:function saveScheduledJobRecord(projectName, job) {
4167:  const hydrated = hydrateScheduledJobRecord(projectName, job);
4168:  const filePath = getPublishingJobFilePath(projectName, hydrated.job_id);
4174:    domain: 'publishing',
4175:    artifactType: 'publishing_scheduler_job',
4176:    identifier: hydrated.job_id,
4194:      connector_file: null,
4195:      connector_preview: null,
4197:      connector_error: null
4204:      connector_file: payload.file_path,
4205:      connector_preview: buildPublishingPreviewFromConnectorPayload(payload, input),
4207:      connector_error: null
4211:      connector_file: null,
4212:      connector_preview: null,
4214:      connector_error: error.message || 'Connector payload unavailable'
4221:  const requestedJobId = String(input.job_id || '').trim().replace(/[^a-z0-9_-]/gi, '');
4227:    throw new Error('Scheduled job not found');
4237:  const scheduledForInput =
4238:    input.scheduled_for !== undefined
4239:      ? String(input.scheduled_for || '').trim()
4240:      : String(existing.scheduled_for || '').trim();
4242:  let scheduledFor = '';
4243:  if (scheduledForInput) {
4244:    const parsed = new Date(scheduledForInput);
4246:      throw new Error('Invalid scheduled_for value');
4248:    scheduledFor = parsed.toISOString();
4256:  const connectorInfo = tryBuildPublishingConnector(safeProject, waveName, channel, {
4265:      ...(connectorInfo.connector_preview || {}),
4273:    connectorInfo.connector_preview || existing.preview || existing.connector_preview || null
4276:  const jobId = hasExisting ? existing.job_id : (requestedJobId || `sched_${Date.now()}`);
4277:  const fallbackStatus = scheduledFor ? 'scheduled' : 'draft';
4281:    job_id: jobId,
4286:    scheduled_for: scheduledFor,
4290:    total_assets: connectorInfo.total_assets || existing.total_assets || preview.asset_count || 0,
4291:    connector_file: connectorInfo.connector_file || existing.connector_file || null,
4292:    connector_preview: connectorInfo.connector_preview || existing.connector_preview || preview,
4293:    connector_error: connectorInfo.connector_error || existing.connector_error || null,
4302:  const schedulerDir = resolveExecutionReadCandidate({
4304:    domain: 'publishing',
4305:    relativePath: 'scheduler',
4308:    requestedIdentifier: 'scheduled-jobs-list',
4309:    requestedFile: 'publishing/scheduler/*.json'
4312:  const files = fs.readdirSync(schedulerDir)
4317:    const filePath = path.join(schedulerDir, name);
4326:function updateScheduledJobRecord(projectName, jobId, updates = {}) {
4329:    job_id: jobId
4335:function updateScheduledJobStatus(projectName, jobId, status) {
4336:  assertPublishingMutationAllowed(projectName, 'reschedule', {
4337:    jobId,
4340:  return updateScheduledJobRecord(projectName, jobId, {
4430:    recommendations.push('rewrite copy in natural German for German-market publishing');
4540:  syncPublishingJob(safeProject, job, result);
4728:  const jobsDir = path.join(baseDir, 'jobs');
4731:  const legacyJobsDir = path.join(legacyBaseDir, 'jobs');
4736:  ensureDir(jobsDir);
4746:    jobsDir,
4757:  const jobsDir = resolveExecutionReadCandidate({
4760:    relativePath: 'jobs',
4763:    requestedIdentifier: 'latest-generation-job',
4764:    requestedFile: 'generated/jobs/*.json'
4767:  const files = fs.readdirSync(jobsDir)
4773:    throw new Error('No generation jobs found');
4776:  const latestPath = path.join(jobsDir, files[0]);
4780:function buildRenderRequestFromJob(projectName, job) {
4784:  const outputPath = job.suggested_output_path ||
4785:    path.join(paths.legacyOutputsDir, `${renderId}_${job.asset_type}.png`);
4790:    job_id: job.job_id,
4791:    asset_type: job.asset_type,
4792:    goal: job.goal,
4796:    source_of_truth: job.source_of_truth,
4797:    guardrails: job.guardrails,
4798:    allowed_transformations: job.allowed_transformations,
4799:    final_generation_prompt: job.final_generation_prompt,
4805:  const job = getLatestGenerationJob(projectName);
4806:  const request = buildRenderRequestFromJob(projectName, job);
4930:  const jobsDir = path.join(baseDir, 'jobs');
4932:  const legacyJobsDir = path.join(legacyBaseDir, 'jobs');
4936:  ensureDir(jobsDir);
4944:    jobsDir,
5030:  const jobId = `gen_${Date.now()}`;
5031:  const outputFilename = `${jobId}_${assetType}.json`;
5034:  const job = {
5035:    job_id: jobId,
5048:    suggested_output_path: path.join(outputPaths.legacyOutputsDir, `${jobId}_${assetType}.png`)
5054:    artifactType: 'generation_job_record',
5055:    identifier: jobId,
5057:    data: job
5060:  return job;
5537:    connectors: null,
5569:    payload.errors.connectors = message;
5579:    connectors: buildProjectControlCenterConnectors,
5980:  if (text.includes('jojoba')) enrichment.ingredients.push('jojoba oil');
6012:    text.includes('publish') ||
6018:    return 'approval_required';
6087:    approval_required: mode === 'approval_required',
6094:        mode === 'approval_required'
6095:          ? 'Prepare execution summary and request approval.'
6150:    publishingDir: path.join(baseDir, 'publishing'),
6460:    paths.publishingDir,
6576:      publishing: { path: paths.publishingDir, exists: fs.existsSync(paths.publishingDir) },
6660:    paths.publishingDir,
6698:    workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'publishing'],
6699:    ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'analyst'],
6718:      workspace_priorities: ['setup', 'library', 'campaign-studio', 'content-studio', 'media-studio', 'publishing', 'insights'],
6719:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'ads_operator', 'analyst', 'compliance_reviewer'],
6731:      workspace_priorities: ['setup', 'library', 'media-studio', 'content-studio', 'campaign-studio', 'publishing'],
6732:      ai_team_defaults: ['strategist', 'writer', 'designer', 'video_lead', 'publisher', 'analyst'],
6744:      workspace_priorities: ['setup', 'library', 'media-studio', 'content-studio', 'publishing', 'insights'],
6745:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'analyst'],
6758:      ai_team_defaults: ['strategist', 'writer', 'designer', 'ads_operator', 'publisher', 'compliance_reviewer'],
6770:      workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'publishing'],
6771:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'analyst'],
6783:      workspace_priorities: ['setup', 'library', 'media-studio', 'publishing', 'campaign-studio'],
6784:      ai_team_defaults: ['strategist', 'writer', 'designer', 'video_lead', 'publisher'],
6809:      workspace_priorities: ['setup', 'library', 'content-studio', 'publishing', 'insights'],
6810:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher'],
6866:      publishing: paths.publishingDir,
7125:  const connectorReadiness = reviewProjectConnectorReadiness(safeProject);
7163:  const integrationsCompleteness = Number(connectorReadiness.readiness_score || 0);
7166:  const publishingReadiness = fs.existsSync(paths.publishingDir) ? 100 : 0;
7179:    publishing_readiness: publishingReadiness,
7190:    has_publishing_dir: fs.existsSync(paths.publishingDir),
7226:  if (domainScores.publishing_readiness < 100) missing.push('publishing_readiness');
7300:    approved: Boolean(asset.approved),
7301:    approved_at: normalizeSetupTextValue(asset.approved_at),
7302:    approval_note: normalizeSetupTextValue(asset.approval_note),
8202:        what_to_upload: 'Primary logo files, transparent logo variants, and approved lockups.',
8203:        why_it_matters: 'Keeps setup, media creation, publishing previews, and AI output visually tied to the right brand.',
8280:      description: 'Approved product photography for content, media, ads, and publishing.',
8360:      description: 'Customer proof, reviews, testimonial exports, and approved quotes.',
8362:        what_to_upload: 'Review exports, testimonial docs, approved screenshots, quote permissions, and proof notes.',
8379:        why_it_matters: 'Publishing and AI Command can use only approved proof when making trust or compliance claims.',
8426:    record.approval_status ||
8431:  if (record.approved === true || ['approved', 'ready_approved'].includes(explicitStatus)) {
8463:  const queue = [rootDir];
8466:  while (queue.length) {
8467:    const current = queue.shift();
8474:          queue.push(fullPath);
8894:    let approvedCount = statuses.filter(value => value === 'Approved').length;
8903:      approvedCount = 0;
8911:      approvedCount = 0;
8921:    const approvedAssets = matchingAssets
8950:      approved_count: approvedCount,
8955:      approved_assets: approvedAssets,
8964:              ? `Review and approve ${item.label} when ready.`
8965:              : `${item.label} is approved.`
8979:    approved: 0,
9067:    status: missing.length ? 'connectors_incomplete' : 'connectors_ready'
9349:app.post('/execute_publish_package', (req, res) => {
9354:    const publishPackage = resolvePublishPackageForExecution(projectName, req.body || {});
9355:    const payload = buildSocialExecutionPayload(publishPackage);
9356:    const executionState = 'manual_publish_ready';
9360:      campaign_name: String(publishPackage.campaign_name || req.body?.campaign_name || '').trim(),
9369:    const log = writeExecutionBridgeLog(projectName, 'execute_publish_package', {
9389:      writeExecutionBridgeLog(logProject, 'execute_publish_package', {
9402:      message: error.message || 'Failed to execute publish package'
9471:      : req.body?.publish_package?.assets?.[0]?.fallback_prompt_pack;
9474:      const error = new Error('Missing prompt_pack. Provide prompt_pack or publish_package.assets[0].fallback_prompt_pack');
9716:        'Review this prepared draft, then approve before applying any product update to WooCommerce.'
9800:        'Use the cloned draft product for safe content updates before publishing.'
9915:        'Review the updated draft clone in WooCommerce before any publish action.'
10568:    const allowed = new Set(['approved', 'needs_review', 'rejected', 'archived']);
10585:      asset.approved = status === 'approved';
10591:      if (status === 'approved') {
10592:        asset.approved_at = now;
10593:        asset.approval_note = note || asset.approval_note || 'Approved from Control Center Library.';
10823:      queue_center: snapshot.queue_center || {}
10827:      error: error.message || 'Failed to build queue center payload'
10837:      job_monitor: snapshot.job_monitor || {}
10841:      error: error.message || 'Failed to build job monitor payload'
10862:app.get('/media-manager/project/:project/queue-center', handleGetQueueCenter);
10863:app.get('/public/media-manager/project/:project/queue-center', handleGetQueueCenter);
10864:app.get('/media-manager/project/:project/job-monitor', handleGetJobMonitor);
10865:app.get('/public/media-manager/project/:project/job-monitor', handleGetJobMonitor);
11051:      error: error.message || 'Failed to list media jobs'
11060:      media_job: mediaJob,
11065:      error: error.message || 'Failed to save media job'
11074:      return res.status(404).json({ error: 'Media job not found' });
11076:    return res.json({ media_job: mediaJob });
11079:      error: error.message || 'Failed to load media job'
11084:app.get('/media-manager/project/:project/media-jobs', handleListMediaJobs);
11085:app.get('/public/media-manager/project/:project/media-jobs', handleListMediaJobs);
11086:app.post('/media-manager/project/:project/media-jobs', handleUpsertMediaJob);
11087:app.post('/public/media-manager/project/:project/media-jobs', handleUpsertMediaJob);
11088:app.patch('/media-manager/project/:project/media-jobs/:mediaJobId', (req, res) => {
11095:app.patch('/public/media-manager/project/:project/media-jobs/:mediaJobId', (req, res) => {
11102:app.get('/media-manager/project/:project/media-jobs/:mediaJobId', handleGetMediaJob);
11103:app.get('/public/media-manager/project/:project/media-jobs/:mediaJobId', handleGetMediaJob);
11501:      error: error.message || 'Failed to list approvals'
11508:    const approval = createApproval(req.params.project, req.body || {});
11510:      approval,
11515:      error: error.message || 'Failed to create approval'
11522:    const approval = decideApproval(req.params.project, req.params.approvalId, {
11531:      approval,
11536:      error: error.message || 'Failed to update approval'
11541:app.get('/media-manager/project/:project/approvals', handleListApprovals);
11542:app.get('/public/media-manager/project/:project/approvals', handleListApprovals);
11543:app.post('/media-manager/project/:project/approvals', handleCreateApproval);
11544:app.post('/public/media-manager/project/:project/approvals', handleCreateApproval);
11545:app.post('/media-manager/project/:project/approvals/:approvalId/decision', handleApprovalDecision);
11546:app.post('/public/media-manager/project/:project/approvals/:approvalId/decision', handleApprovalDecision);
12253:app.post('/media-manager/project/:project/publishing/schedule', (req, res) => {
12255:    assertPublishingMutationAllowed(req.params.project, 'schedule', {
12262:      scheduled_for: req.body?.scheduled_for,
12273:      job: result
12276:    logCriticalFailure('publishing_schedule', req, error, {
12280:      error: error.message || 'Failed to save publishing schedule',
12286:app.post('/public/media-manager/project/:project/publishing/schedule', (req, res) => {
12288:    assertPublishingMutationAllowed(req.params.project, 'schedule', {
12295:      scheduled_for: req.body?.scheduled_for,
12306:      job: result
12309:    logCriticalFailure('publishing_schedule', req, error, {
12313:      error: error.message || 'Failed to save publishing schedule',
12319:app.post('/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
12321:    assertPublishingMutationAllowed(req.params.project, 'reschedule', {
12322:      jobId: req.params.jobId,
12323:      status: req.body?.status || 'scheduled'
12325:    const result = updateScheduledJobRecord(req.params.project, req.params.jobId, {
12329:      scheduled_for: req.body?.scheduled_for,
12330:      status: req.body?.status || 'scheduled',
12338:      job: result
12342:      error: error.message || 'Failed to reschedule publishing item',
12348:app.post('/public/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
12350:    assertPublishingMutationAllowed(req.params.project, 'reschedule', {
12351:      jobId: req.params.jobId,
12352:      status: req.body?.status || 'scheduled'
12354:    const result = updateScheduledJobRecord(req.params.project, req.params.jobId, {
12358:      scheduled_for: req.body?.scheduled_for,
12359:      status: req.body?.status || 'scheduled',
12367:      job: result
12371:      error: error.message || 'Failed to reschedule publishing item',
12377:app.post('/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
12380:      jobId: req.params.jobId,
12383:    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
12389:      job
12393:      error: error.message || 'Failed to approve publishing item',
12399:app.post('/public/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
12402:      jobId: req.params.jobId,
12405:    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
12411:      job
12415:      error: error.message || 'Failed to approve publishing item',
12421:app.post('/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
12423:    assertPublishingMutationAllowed(req.params.project, 'publish', {
12424:      jobId: req.params.jobId,
12425:      status: 'published'
12427:    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
12428:      status: 'published',
12431:    const result = recordPublishingExecutionOutcome(req.params.project, req.params.jobId, {
12432:      execution_status: 'published',
12433:      action_type: 'manual_publish_complete',
12438:      job,
12442:    logCriticalFailure('publishing_publish', req, error, {
12444:      jobId: req.params.jobId
12447:      error: error.message || 'Failed to publish item',
12453:app.post('/public/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
12455:    assertPublishingMutationAllowed(req.params.project, 'publish', {
12456:      jobId: req.params.jobId,
12457:      status: 'published'
12459:    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
12460:      status: 'published',
12463:    const result = recordPublishingExecutionOutcome(req.params.project, req.params.jobId, {
12464:      execution_status: 'published',
12465:      action_type: 'manual_publish_complete',
12470:      job,
12474:    logCriticalFailure('publishing_publish', req, error, {
12476:      jobId: req.params.jobId
12479:      error: error.message || 'Failed to publish item',
12485:app.post('/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
12488:      jobId: req.params.jobId,
12491:    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
12495:    const result = recordPublishingExecutionOutcome(req.params.project, req.params.jobId, {
12497:      action_type: 'manual_publish_failed',
12502:      job,
12506:    logCriticalFailure('publishing_fail', req, error, {
12508:      jobId: req.params.jobId
12511:      error: error.message || 'Failed to mark publishing item as failed',
12517:app.post('/public/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
12520:      jobId: req.params.jobId,
12523:    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
12527:    const result = recordPublishingExecutionOutcome(req.params.project, req.params.jobId, {
12529:      action_type: 'manual_publish_failed',
12534:      job,
12538:    logCriticalFailure('publishing_fail', req, error, {
12540:      jobId: req.params.jobId
12543:      error: error.message || 'Failed to mark publishing item as failed',
13143:  const mediaDir = path.join(baseDir, 'media-jobs');
13144:  const publishDir = path.join(baseDir, 'publish-packages');
13146:  const legacyMediaDir = path.join(legacyBaseDir, 'media-jobs');
13147:  const legacyPublishDir = path.join(legacyBaseDir, 'publish-packages');
13152:  ensureDir(publishDir);
13162:    publishDir,
13175:  const jobId = `mediajob_${Date.now()}`;
13181:  const job = {
13182:    job_id: jobId,
13194:    artifactType: 'campaign_media_job',
13195:    identifier: jobId,
13197:    data: job
13201:    ...job,
13210:  const packageId = `publish_${Date.now()}`;
13222:    ready_for_publish: payload.assets.length > 0,
13230:    artifactType: 'campaign_publish_package',
13285:    relativePath: 'media-jobs',
13289:    requestedFile: `campaign-finalization/media-jobs/${safeName}*`
13291:  const publishDir = resolveExecutionReadCandidate({
13294:    relativePath: 'publish-packages',
13298:    requestedFile: `campaign-finalization/publish-packages/${safeName}*`
13312:  const publishFiles = fs.existsSync(publishDir)
13313:    ? fs.readdirSync(publishDir).filter(x => x.startsWith(safeName))
13319:    media_jobs_count: mediaFiles.length,
13320:    publish_packages_count: publishFiles.length,
13322:    ready: mediaFiles.length > 0 || publishFiles.length > 0 || fs.existsSync(emailFile)
13400:  const inlinePackage = input.publish_package && typeof input.publish_package === 'object'
13401:    ? input.publish_package
13410:    const error = new Error('Missing publish package. Provide publish_package or campaign_name + channel');
13419:function buildSocialExecutionPayload(publishPackage) {
13420:  const assets = assertExecutionPackageAssets(publishPackage, 'publish package');
13421:  const channel = String(publishPackage.channel || '').trim().toLowerCase();
13427:    || `${String(primaryAsset.product_name || publishPackage.campaign_name || 'Campaign').trim()} update`;
13716:function getScheduledJobById(projectName, jobId) {
13719:    domain: 'publishing',
13720:    relativePath: path.join('scheduler', `${jobId}.json`),
13722:    requestedIdentifier: jobId,
13723:    requestedFile: `publishing/scheduler/${jobId}.json`
13727:    throw new Error('Scheduled job not found');
13736:function executeScheduledJob(projectName, jobId) {
13741:    assertPublishingMutationAllowed(projectName, 'publish', {
13742:      jobId,
13743:      status: 'published'
13747:  const job = getScheduledJobById(projectName, jobId);
13753:    job_id: jobId,
13754:    campaign_name: job.campaign_name || null,
13755:    wave_name: job.wave_name,
13756:    channel: job.channel,
13759:    source_status: job.status,
13762:    external_publish: normalizedMode !== 'semi_auto',
13767:    if (job.channel === 'email') {
13771:    } else if (['instagram', 'facebook', 'tiktok', 'youtube'].includes(job.channel)) {
13772:      result.execution_status = 'ready_for_manual_publish';
13773:      result.action_type = 'manual_publish';
13774:      result.notes.push('Social payload is ready for operator-controlled publishing.');
13775:    } else if (['amazon', 'ebay'].includes(job.channel)) {
13785:    if (job.channel === 'email') {
13789:    } else if (['instagram', 'facebook', 'tiktok', 'youtube'].includes(job.channel)) {
13790:      result.execution_status = 'auto_publish_pending';
13791:      result.action_type = 'auto_publish';
13792:      result.notes.push('Full-auto mode enabled. Social publish adapter should consume this.');
13793:    } else if (['amazon', 'ebay'].includes(job.channel)) {
13800:      result.notes.push('Unknown channel type. Review connector mapping.');
13804:  const filePath = path.join(execPaths.legacyResultsDir, `${jobId}.json`);
13808:    artifactType: 'publishing_execution_result',
13809:    identifier: jobId,
13829:function recordManualPublish(projectName, campaignName, channel, jobId, operator, postUrl, notes = '') {
13833:  const safeJobId = String(jobId || '').trim();
13854:    const error = new Error('Missing job_id');
13878:    const error = new Error('Manual publish recording is allowed only in semi_auto mode.');
13902:  const manualPublishDir = path.join(projectPaths.executionDir, 'manual-publish');
13909:    job_id: safeJobId,
13911:    published_at: nowIso,
13914:    external_publish: false,
13915:    manual_publish: true,
13941:      manual_publish_recorded: true,
13942:      manual_publish_url: safePostUrl,
13943:      manual_publish_operator: safeOperator,
13944:      manual_publish_recorded_at: nowIso,
13945:      final_status: 'manually_published',
13946:      manual_publish: true,
13947:      external_publish: false,
13962:      artifactType: 'publishing_execution_result',
13971:    warnings.push('Execution result file not found for job_id. Manual publish record saved without execution-result update.');
13978:    job_id: safeJobId,
13979:    manual_publish_recorded: true,
13980:    external_publish: false,
13981:    manual_publish: true,
13990:function recordPublishingExecutionOutcome(projectName, jobId, options = {}) {
13992:  const job = hydrateScheduledJobRecord(safeProject, getScheduledJobById(safeProject, jobId));
13994:  const filePath = path.join(execPaths.legacyResultsDir, `${jobId}.json`);
14001:    job_id: jobId,
14002:    title: job.title,
14003:    wave_name: job.wave_name,
14004:    channel: job.channel,
14005:    mode: String(options.mode || job.mode || readExecutionMode(safeProject).mode || 'semi_auto').trim(),
14007:    source_status: job.status,
14008:    execution_status: String(options.execution_status || existing.execution_status || job.status || 'pending').trim(),
14011:    preview: job.preview || job.connector_preview || null
14017:    artifactType: 'publishing_execution_result',
14018:    identifier: jobId,
14036:function getLatestPublishingApproval(projectName, jobId) {
14039:      String(item?.entity_type || '').trim() === 'publishing_job'
14040:      && String(item?.entity_id || '').trim() === String(jobId || '').trim()
14057:  const jobId = String(options.jobId || '').trim();
14060:  const freezeSensitiveAction = ['schedule', 'reschedule', 'ready', 'publish'].includes(actionKey)
14061:    || ['ready', 'published'].includes(requestedStatus);
14062:  const approvalSensitiveAction = ['ready', 'publish'].includes(actionKey)
14063:    || ['ready', 'published'].includes(requestedStatus);
14066:  //   freeze_publishing  → default false (permissive — freeze is opt-in)
14067:  //   approval_before_publish → default true (restrictive — approval is required by default)
14068:  const freezePublishing = typeof policyRules.freeze_publishing === 'boolean'
14069:    ? policyRules.freeze_publishing
14070:    : policyRules.freeze_publishing == null ? false : Boolean(policyRules.freeze_publishing);
14071:  const approvalBeforePublish = typeof policyRules.approval_before_publish === 'boolean'
14072:    ? policyRules.approval_before_publish
14073:    : policyRules.approval_before_publish == null ? true : Boolean(policyRules.approval_before_publish);
14077:      route: '/governance/publishing',
14087:    logGovernanceBlock('freeze_publishing');
14089:      'Publishing is frozen by governance policy. The requested publishing mutation was blocked.',
14092:        rule: 'freeze_publishing'
14097:  if (approvalSensitiveAction && approvalBeforePublish) {
14098:    if (!jobId) {
14099:      logGovernanceBlock('approval_before_publish', { reason: 'job_id_missing' });
14101:        'Approval before publish is enabled. This publishing action requires a durable publishing job with an approved governance decision.',
14104:          rule: 'approval_before_publish'
14109:    const approval = getLatestPublishingApproval(projectName, jobId);
14110:    const approvalStatus = String(approval?.status || '').trim().toLowerCase();
14112:    if (!['approved', 'overridden'].includes(approvalStatus)) {
14113:      logGovernanceBlock('approval_before_publish', {
14114:        job_id: jobId,
14115:        approval_status: approvalStatus || 'missing'
14118:        'Approval before publish is enabled. The publishing job is not approved for ready/publish mutation.',
14121:          rule: 'approval_before_publish',
14122:          job_id: jobId,
14123:          approval_status: approvalStatus || 'missing'
14130:function hydratePublishingExecutionResult(projectName, result, scheduledJobs = []) {
14133:    scheduledJobs.find(item => item.job_id === rawResult.job_id) ||
14136:        return hydrateScheduledJobRecord(projectName, getScheduledJobById(projectName, rawResult.job_id));
14151:    scheduled_for: relatedJob?.scheduled_for || '',
14163:      relatedJob?.connector_preview ||
14168:function reviewExecutionResult(projectName, jobId) {
14172:    relativePath: `${jobId}.json`,
14174:    requestedIdentifier: jobId,
14175:    requestedFile: `execution-results/${jobId}.json`
14233:  const connectorReadiness = reviewProjectConnectorReadiness(projectName);
14240:  const connectorMissing = connectorReadiness.missing || [];
14251:  for (const item of connectorMissing) {
14253:      critical.push(`connector:${item}`);
14255:      important.push(`connector:${item}`);
14257:      optional.push(`connector:${item}`);
14275:  const connectorReadiness = reviewProjectConnectorReadiness(projectName);
14282:    connectorReadiness.readiness_score || 0
14311:      connectors: connectorReadiness,
14328:  const connectorReadiness = reviewProjectConnectorReadiness(projectName);
14373:      connector_readiness_score: connectorReadiness.readiness_score
14477:    approved_assets: categoryReadiness.categories
14478:      .flatMap(category => category.approved_assets.map(assetId => ({
14538:  let scheduledJobs = [];
14543:    scheduledJobs = reviewScheduledJobs(projectName);
14545:    scheduledJobs = [];
14554:  const hydratedScheduledJobs = scheduledJobs.map(item => hydrateScheduledJobRecord(projectName, item));
14589:    scheduled_jobs: hydratedScheduledJobs,
14591:    total_scheduled_jobs: hydratedScheduledJobs.length,
14628:    campaignStrategyQueuePath: path.join(projectDir, 'campaign-strategy-queue.json'),
14807:      const queuePath = getLegacyContentQueuePath(commandProject, 'social');
14809:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
14810:      queue.push(postDraft);
14811:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
14901:      const queuePath = getLegacyContentQueuePath(commandProject, 'blog');
14903:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
14904:      queue.push(blogDraft);
14905:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
14930:      const { data: queue } = readLiveEmailQueue(commandProject, emailDraft.id);
14931:      queue.push(emailDraft);
14932:      writeLiveEmailQueue(commandProject, queue);
14952:      const queuePath = getLegacyContentQueuePath(commandProject, 'ads');
14954:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
14955:      queue.push(adDraft);
14956:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
14965:      const queuePath = getLegacyContentQueuePath(commandProject, 'ads');
14967:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
14971:        result: queue
14976:      const queuePath = getLegacyContentQueuePath(commandProject, 'social');
14978:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
14982:        result: queue
14987:      const queuePath = getLegacyContentQueuePath(commandProject, 'blog');
14989:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
14993:        result: queue
14998:      const { data: queue } = readLiveEmailQueue(commandProject, 'review-emails');
15002:        result: queue
15006:    if (command === '/approve_ad') {
15012:      const queuePath = getLegacyContentQueuePath(commandProject, 'ads');
15014:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
15015:      const item = queue.find(x => x.id === draftId);
15021:      item.status = 'approved';
15023:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
15031:    if (command === '/approve_post') {
15037:      const queuePath = getLegacyContentQueuePath(commandProject, 'social');
15039:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
15040:      const item = queue.find(x => x.id === draftId);
15046:      item.status = 'approved';
15048:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
15056:    if (command === '/approve_blog') {
15062:      const queuePath = getLegacyContentQueuePath(commandProject, 'blog');
15064:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
15065:      const item = queue.find(x => x.id === draftId);
15071:      item.status = 'approved';
15073:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
15081:    if (command === '/approve_email') {
15087:      const { data: queue } = readLiveEmailQueue(commandProject, draftId);
15088:      const item = queue.find(x => x.id === draftId);
15094:      item.status = 'approved';
15096:      writeLiveEmailQueue(commandProject, queue);
15110:      const queuePath = getLegacyContentQueuePath(commandProject, 'ads');

## Publishing payload helpers

### public/control-center/pages/publishing/publishing-payloads.js
function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asString(value) {
  if (value == null) return "";
  return String(value);
}

function clean(value) {
  return asString(value).trim();
}

function firstText(...values) {
  for (const value of values) {
    const text = clean(value);
    if (text) return text;
  }
  return "";
}

function nowIso() {
  return new Date().toISOString();
}

function buildScheduleTime(form) {
  const date = clean(form.publishDate);
  if (!date) return "";
  return `${date}T${clean(form.publishTime) || "09:00"}:00Z`;
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function normalizeNotes(...values) {
  return values
    .flatMap((value) => {
      if (Array.isArray(value)) return value;
      if (typeof value === "string") return value.split(/\n+/);
      return [];
    })
    .map((item) => clean(item))
    .filter(Boolean);
}

function summarizeText(value, fallback = "No content payload available yet.") {
  const text = clean(value);
  if (!text) return fallback;
  return text.length > 180 ? `${text.slice(0, 177)}...` : text;
}

function extractHandoffSummary(handoff) {
  const payload = asObject(handoff?.payload);
  const output = asObject(payload.output);
  const draftContext = asObject(payload.draft_context);
  return {
    id: asString(handoff?.id || payload.workflow_id || payload.prompt || payload.workflow_title),
    sourcePage: asString(handoff?.source_page || "workflows"),
    workflowId: asString(payload.workflow_id),
    title: firstText(output.title, payload.workflow_title, draftContext.lastResponseTitle, "Workflow output"),
    project: firstText(draftContext.projectName, payload.project_name, output.project),
    campaign: firstText(payload.campaign_name, output.campaign, output.campaignName),
    channel: firstText(output.channel, payload.channel),
    contentItem: firstText(output.content_item, output.contentItem, output.summary, payload.prompt),
    summary: firstText(output.summary, output.description, payload.prompt, draftContext.lastCommand),
    output
  };
}

export function buildSchedulePayload(session, status = "scheduled") {
  return {
    title: firstText(session.form.title, session.form.contentItem, "Publishing item"),
    wave_name: session.form.campaign,
    campaign: session.form.campaign,
    channel: session.form.channel,
    content_item: session.form.contentItem,
    scheduled_for: buildScheduleTime(session.form),
    status,
    approval_status: session.form.approvalStatus,
    mode: "semi_auto",
    offer: "",
    notes: session.form.notes
  };
}

export function buildLocalDraftPayload(session, status = "draft") {
  return {
    id: session.formSourceId || session.selectedId || "",
    title: firstText(session.form.title, session.form.contentItem, "Publishing draft"),
    project: session.form.project,
    campaign: session.form.campaign,
    channel: session.form.channel,
    contentItem: session.form.contentItem,
    scheduledFor: buildScheduleTime(session.form),
    approvalStatus: session.form.approvalStatus,
    status,
    notes: session.form.notes,
    updatedAt: nowIso()
  };
}

export function buildPublishingAiPrompt(projectName, selectedItem, session, handoff) {
  const handoffSummary = handoff ? extractHandoffSummary(handoff) : null;
  return [
    `Review this publishing execution plan for ${projectName || "the current project"}.`,
    `Project: ${session.form.project || projectName || "not set"}`,
    `Campaign: ${session.form.campaign || "not set"}`,
    `Channel: ${session.form.channel || selectedItem?.channel || "not set"}`,
    `Content item: ${session.form.contentItem || selectedItem?.contentItem || "not set"}`,
    `Publish window: ${session.form.publishDate ? `${session.form.publishDate} ${session.form.publishTime || "09:00"}` : "not scheduled"}`,
    `Approval: ${titleCase(session.form.approvalStatus || selectedItem?.approvalStatus || "draft")}`,
    handoffSummary ? `Workflow handoff: ${handoffSummary.title} - ${summarizeText(handoffSummary.summary)}` : "Workflow handoff: none",
    `Notes: ${session.form.notes || normalizeNotes(selectedItem?.notes).join("; ") || "none"}`
  ].join("\n");
}
