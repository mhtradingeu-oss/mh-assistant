# PHASE 3AD.1 — Operations Centers API Boundary Evidence

## Frontend API functions for operations centers
1951:export async function fetchProjectTaskCenter(projectName) {
1957:    `/media-manager/project/${encodeURIComponent(projectName)}/task-center`,
1962:export async function fetchProjectQueueCenter(projectName) {
1968:    `/media-manager/project/${encodeURIComponent(projectName)}/queue-center`,
1973:export async function fetchProjectJobMonitor(projectName) {
1979:    `/media-manager/project/${encodeURIComponent(projectName)}/job-monitor`,
1984:export async function fetchProjectNotificationCenter(projectName) {
1990:    `/media-manager/project/${encodeURIComponent(projectName)}/notification-center`,
2276:export async function markProjectNotification(projectName, notificationId, payload = {}) {
2286:    `/media-manager/project/${encodeURIComponent(projectName)}/notifications/${encodeURIComponent(notificationId)}`,

## Backend operations route markers
312:  /^\/scheduler_queue\/?$/i,
774:  DRAFT_QUEUE: 'email_draft_queue',
775:  MEDIA_QUEUE: 'email_media_queue'
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
1520:    tasks: path.join('tasks', 'task-board.json')
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
3970:  if (['queued', 'queue', 'scheduled', 'pending', 'pending_publish'].includes(normalized)) return 'scheduled';
4308:    requestedIdentifier: 'scheduled-jobs-list',
4728:  const jobsDir = path.join(baseDir, 'jobs');
4731:  const legacyJobsDir = path.join(legacyBaseDir, 'jobs');
4736:  ensureDir(jobsDir);
4746:    jobsDir,
4757:  const jobsDir = resolveExecutionReadCandidate({
4760:    relativePath: 'jobs',
4764:    requestedFile: 'generated/jobs/*.json'
4767:  const files = fs.readdirSync(jobsDir)
4773:    throw new Error('No generation jobs found');
4776:  const latestPath = path.join(jobsDir, files[0]);
4930:  const jobsDir = path.join(baseDir, 'jobs');
4932:  const legacyJobsDir = path.join(legacyBaseDir, 'jobs');
4936:  ensureDir(jobsDir);
4944:    jobsDir,
8463:  const queue = [rootDir];
8466:  while (queue.length) {
8467:    const current = queue.shift();
8474:          queue.push(fullPath);
9304:    const tasks = readLegacyContentQueue(projectName, 'tasks');
9306:    const pending = tasks.filter(t => t.status === 'pending');
9310:      today_tasks: pending.slice(0, 5)
9320:    const tasks = readLegacyContentQueue(projectName, 'tasks');
9322:    const next = tasks.find(t => t.status === 'pending');
10823:      queue_center: snapshot.queue_center || {}
10827:      error: error.message || 'Failed to build queue center payload'
10860:app.get('/media-manager/project/:project/task-center', handleGetTaskCenter);
10861:app.get('/public/media-manager/project/:project/task-center', handleGetTaskCenter);
10862:app.get('/media-manager/project/:project/queue-center', handleGetQueueCenter);
10863:app.get('/public/media-manager/project/:project/queue-center', handleGetQueueCenter);
10864:app.get('/media-manager/project/:project/job-monitor', handleGetJobMonitor);
10865:app.get('/public/media-manager/project/:project/job-monitor', handleGetJobMonitor);
10866:app.get('/media-manager/project/:project/notification-center', handleGetNotificationCenter);
10867:app.get('/public/media-manager/project/:project/notification-center', handleGetNotificationCenter);
11051:      error: error.message || 'Failed to list media jobs'
11084:app.get('/media-manager/project/:project/media-jobs', handleListMediaJobs);
11085:app.get('/public/media-manager/project/:project/media-jobs', handleListMediaJobs);
11086:app.post('/media-manager/project/:project/media-jobs', handleUpsertMediaJob);
11087:app.post('/public/media-manager/project/:project/media-jobs', handleUpsertMediaJob);
11088:app.patch('/media-manager/project/:project/media-jobs/:mediaJobId', (req, res) => {
11095:app.patch('/public/media-manager/project/:project/media-jobs/:mediaJobId', (req, res) => {
11102:app.get('/media-manager/project/:project/media-jobs/:mediaJobId', handleGetMediaJob);
11103:app.get('/public/media-manager/project/:project/media-jobs/:mediaJobId', handleGetMediaJob);
11441:      error: error.message || 'Failed to list tasks'
11460:app.get('/media-manager/project/:project/tasks', handleListTasks);
11461:app.get('/public/media-manager/project/:project/tasks', handleListTasks);
11462:app.post('/media-manager/project/:project/tasks', handleCreateTask);
11463:app.post('/public/media-manager/project/:project/tasks', handleCreateTask);
11464:app.get('/media-manager/project/:project/tasks/:taskId', (req, res) => {
11477:app.get('/public/media-manager/project/:project/tasks/:taskId', (req, res) => {
11606:      error: error.message || 'Failed to list notifications'
11611:app.get('/media-manager/project/:project/notifications', handleListNotifications);
11612:app.get('/public/media-manager/project/:project/notifications', handleListNotifications);
11613:app.patch('/media-manager/project/:project/notifications/:notificationId', (req, res) => {
11626:app.patch('/public/media-manager/project/:project/notifications/:notificationId', (req, res) => {
13143:  const mediaDir = path.join(baseDir, 'media-jobs');
13146:  const legacyMediaDir = path.join(legacyBaseDir, 'media-jobs');
13285:    relativePath: 'media-jobs',
13289:    requestedFile: `campaign-finalization/media-jobs/${safeName}*`
13319:    media_jobs_count: mediaFiles.length,
14589:    scheduled_jobs: hydratedScheduledJobs,
14591:    total_scheduled_jobs: hydratedScheduledJobs.length,
14628:    campaignStrategyQueuePath: path.join(projectDir, 'campaign-strategy-queue.json'),
14762:      const taskBoardPath = getLegacyContentQueuePath(commandProject, 'tasks');
14764:      const tasks = readJsonFile(taskBoardPath, []);
14765:      const contentTasks = tasks.filter(
14775:          marketing_tasks: contentTasks
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
15012:      const queuePath = getLegacyContentQueuePath(commandProject, 'ads');
15014:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
15015:      const item = queue.find(x => x.id === draftId);
15023:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
15037:      const queuePath = getLegacyContentQueuePath(commandProject, 'social');
15039:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
15040:      const item = queue.find(x => x.id === draftId);
15048:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
15062:      const queuePath = getLegacyContentQueuePath(commandProject, 'blog');
15064:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
15065:      const item = queue.find(x => x.id === draftId);
15073:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
15087:      const { data: queue } = readLiveEmailQueue(commandProject, draftId);
15088:      const item = queue.find(x => x.id === draftId);
15096:      writeLiveEmailQueue(commandProject, queue);
15110:      const queuePath = getLegacyContentQueuePath(commandProject, 'ads');
15112:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
15113:      const item = queue.find(x => x.id === draftId);
15136:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
15150:      const queuePath = getLegacyContentQueuePath(commandProject, 'social');
15152:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
15153:      const item = queue.find(x => x.id === draftId);
15176:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
15190:      const queuePath = getLegacyContentQueuePath(commandProject, 'blog');
15192:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
15193:      const item = queue.find(x => x.id === draftId);
15269:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
15283:      const { data: queue } = readLiveEmailQueue(commandProject, draftId);
15284:      const item = queue.find(x => x.id === draftId);
15300:      writeLiveEmailQueue(commandProject, queue);
15314:      const queuePath = getLegacyContentQueuePath(commandProject, 'ads');
15316:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
15317:      const item = queue.find(x => x.id === draftId);
15325:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
15340:      const queuePath = getLegacyContentQueuePath(commandProject, 'social');
15342:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
15343:      const item = queue.find(x => x.id === draftId);
15351:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
15366:      const queuePath = getLegacyContentQueuePath(commandProject, 'blog');
15368:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
15369:      const item = queue.find(x => x.id === draftId);
15377:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
15392:      const { data: queue } = readLiveEmailQueue(commandProject, draftId);
15393:      const item = queue.find(x => x.id === draftId);
15401:      writeLiveEmailQueue(commandProject, queue);
15433:      const queuePath = getLegacyContentQueuePath(commandProject, 'blog');
15435:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
15436:      const item = queue.find(x => x.id === draftId);
15462:      const queuePath = getLegacyContentQueuePath(commandProject, 'blog');
15464:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
15465:      const item = queue.find(x => x.id === draftId);
15507:      fs.mkdirSync(path.join(mediaDir, 'queue'), { recursive: true });
15943:      const { data: queue } = readLiveEmailQueue(commandProject, draftId);
15944:      const item = queue.find(x => x.id === draftId);
15987:      fs.mkdirSync(path.join(mediaDir, 'queue'), { recursive: true });
16374:      const queuePath = projectPaths.campaignStrategyQueuePath;
16381:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
16431:      queue.push(strategy);
16432:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
16448:      const queuePath = resolveLegacyExecutionProjectPaths(projectName).campaignStrategyQueuePath;
16450:      if (!fs.existsSync(queuePath)) {
16451:        return res.json({ error: 'Campaign strategy queue not found' });
16454:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
16455:      const strategy = queue.find(x => x.strategy_id === strategyId);
16480:        return res.json({ error: 'Campaign strategy queue not found' });
16655:    return res.json({ error: 'Blog queue not found' });
16709:    return res.json({ error: 'Email queue not found' });
16770:      const queuePath = path.join(
16772:        'intelligence/competitor-queue.json'
16775:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
16805:      queue.push(record);
16806:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
16822:      const queuePath = path.join(
16824:        'intelligence/trend-queue.json'
16827:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
16849:      queue.push(record);
16850:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
16866:      const queuePath = path.join(
16868:        'intelligence/keyword-queue.json'
16871:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
16901:      queue.push(record);
16902:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
16918:      const queuePath = path.join(
16920:        'intelligence/hashtag-queue.json'
16923:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
16940:      queue.push(record);
16941:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
16957:      const queuePath = path.join(
16959:        'intelligence/intelligence-brief-queue.json'
16962:      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
16980:      queue.push(record);
16981:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
16995:  const queuePath = path.join(
16997:    'intelligence/trend-queue.json'
17000:  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
17001:  const trend = queue.find(t => t.id === trendId);
17034:  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
17048:  const queuePath = path.join(
17050:    'intelligence/competitor-queue.json'
17053:  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
17054:  const comp = queue.find(c => c.id === compId);
17086:  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
17100:  const queuePath = path.join(
17102:    'intelligence/keyword-queue.json'
17105:  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
17106:  const kw = queue.find(k => k.id === keywordId);
17132:  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
17153:        'intelligence/trend-queue.json'
17158:        'intelligence/competitor-queue.json'
17163:        'intelligence/keyword-queue.json'
17168:        'intelligence/hashtag-queue.json'
17173:        'intelligence/campaign-brain-queue.json'
17278:        'intelligence/campaign-brain-queue.json'
17281:      const queue = JSON.parse(fs.readFileSync(campaignBrainPath, 'utf8'));
17282:      const latestBrain = [...queue].reverse().find(x => x.project_id === projectName);
17310:        'intelligence/campaign-brain-queue.json'
17313:      const queue = JSON.parse(fs.readFileSync(campaignBrainPath, 'utf8'));
17314:      const latestBrain = [...queue].reverse().find(x => x.project_id === projectName);
17345:        'intelligence/campaign-brain-queue.json'
17348:      const queue = JSON.parse(fs.readFileSync(campaignBrainPath, 'utf8'));
17349:      const latestBrain = [...queue].reverse().find(x => x.project_id === projectName);
17387:    'intelligence/campaign-brain-queue.json'
17392:    'campaign-output/campaign-output-queue.json'
17488:        'campaign-output/campaign-output-queue.json'
17694:        'campaign-output/campaign-output-queue.json'
17724:        'campaign-output/campaign-output-queue.json'
17781:        'campaign-output/campaign-output-queue.json'
17842:        'campaign-output/campaign-output-queue.json'
18563:    const files = fs.readdirSync(outputPaths.jobsDir)
18569:      return res.json({ error: 'No generation jobs found' });
18572:    const latestPath = path.join(outputPaths.jobsDir, files[0]);
19878:if (command === '/review_scheduled_jobs') {
19890:      error: 'Failed to review scheduled jobs',
20776:    const queuePath = getLegacyContentQueuePath(projectName, 'blog');
20778:    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
20779:    const item = queue.find(x => x.id === draftId);
20846:      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
21197:  const jobs = readSchedulerJobs(safeProject);
21198:  const completed = jobs.filter((job) => job.status === 'completed');
21199:  const failed = jobs.filter((job) => job.status === 'failed');
21200:  const retryable = jobs.filter((job) => job.status === 'retryable');
21203:  for (const job of jobs) {
21209:      total_jobs: 0,
21215:    current.total_jobs += 1;
21224:    failure_rate: entry.total_jobs > 0
21225:      ? Number(((entry.failed + entry.retryable) / entry.total_jobs).toFixed(4))
21230:    total_jobs: jobs.length,
21231:    completed_jobs: completed.length,
21232:    failed_jobs: failed.length,
21233:    retryable_jobs: retryable.length,
21447:    const jobs = readSchedulerJobs(projectName);
21448:    jobs.push(job);
21449:    writeSchedulerJobs(projectName, jobs);
21475:app.get('/scheduler_queue', (req, res) => {
21479:    const jobs = readSchedulerJobs(projectName);
21488:    for (const job of jobs) {
21525:      total: jobs.length,
21526:      queue: {
21534:      jobs: {
21547:      message: error.message || 'Failed to retrieve scheduler queue'
21561:    const jobs = readSchedulerJobs(projectName);
21563:    // Phase 1: lock all due jobs atomically
21564:    for (const job of jobs) {
21580:    writeSchedulerJobs(projectName, jobs);
21582:    // Phase 2: execute locked jobs and update status
21583:    for (const job of jobs) {
21664:    writeSchedulerJobs(projectName, jobs);

## Cross-page references to Operations routes
public/control-center/pages/ai-command/tool-dock.js:1044:      frontendOwnerPage: "operations-centers",
public/control-center/pages/ai-command/tool-dock.js:1045:      destinations: ["chat-preview", "operations-centers", "task", "governance"],
public/control-center/pages/ai-command/tool-dock.js:1057:      frontendOwnerPage: "operations-centers",
public/control-center/pages/ai-command/tool-dock.js:1058:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:1070:      frontendOwnerPage: "operations-centers",
public/control-center/pages/ai-command/tool-dock.js:1071:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:1083:      frontendOwnerPage: "operations-centers",
public/control-center/pages/ai-command/tool-dock.js:1084:      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1139:      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],
public/control-center/pages/operations-centers.js:172:  if (pageKey === "task-center") {
public/control-center/pages/operations-centers.js:202:  if (pageKey === "queue-center") {
public/control-center/pages/operations-centers.js:222:  if (pageKey === "job-monitor") {
public/control-center/pages/operations-centers.js:299:      route: "job-monitor"
public/control-center/pages/operations-centers.js:306:      route: "queue-center"
public/control-center/pages/operations-centers.js:313:      route: "job-monitor"
public/control-center/pages/operations-centers.js:320:      route: "notification-center"
public/control-center/pages/operations-centers.js:327:      route: "notification-center"
public/control-center/pages/operations-centers.js:355:      route: "notification-center"
public/control-center/pages/operations-centers.js:517:    <section class="page is-active" data-page="task-center">
public/control-center/pages/operations-centers.js:717:  const prompts = buildOpsAssistantPrompts("task-center", projectName, selectedItem, titleCase(session.focus || "all"));
public/control-center/pages/operations-centers.js:718:  const incomingHandoff = getSharedHandoff(projectName, "task-center", ops);
public/control-center/pages/operations-centers.js:888:    <section class="page is-active" data-page="queue-center">
public/control-center/pages/operations-centers.js:1061:  const prompts = buildOpsAssistantPrompts("queue-center", projectName, selectedItem, titleCase(session.focus || "all queues"));
public/control-center/pages/operations-centers.js:1179:    <section class="page is-active" data-page="job-monitor">
public/control-center/pages/operations-centers.js:1355:  const prompts = buildOpsAssistantPrompts("job-monitor", projectName, selectedItem, titleCase(session.focus || "all jobs"));
public/control-center/pages/operations-centers.js:1489:  const prompts = buildOpsAssistantPrompts("notification-center", projectName, selectedItem, titleCase(session.focus || "all"));
public/control-center/pages/operations-centers.js:1534:    <section class="page is-active" data-page="notification-center">
public/control-center/pages/operations-centers.js:1569:                <p>${escapeHtml(session.focus === "inbox" ? "Review durable inbox history. Mark Read updates read-state only where a backend notification id exists." : "Review route-aware alerts, then inspect the selected signal before routing or follow-up.")}</p>
public/control-center/pages/operations-centers.js:1631:                  <p>Active actions are refresh, route, AI guidance, and Mark Read only where supported. Lifecycle controls remain disabled until backend mutation safety checks are approved.</p>
public/control-center/pages/operations-centers.js:1637:                ${selectedItem?.notification_id ? `<button class="btn btn-secondary" type="button" data-mark-read="${escapeHtml(selectedItem.notification_id)}" title="Updates notification read-state only. Does not acknowledge, resolve, dismiss, delete, send, approve, publish, or execute.">Mark Read (read-state only)</button>` : ""}
public/control-center/pages/operations-centers.js:1733:      if (!notificationId || !context.markProjectNotification) return;
public/control-center/pages/operations-centers.js:1735:        await context.markProjectNotification(projectName, notificationId, { status: "read", read: true });
public/control-center/pages/operations-centers.js:1748:  id: "task-center",
public/control-center/pages/operations-centers.js:1755:  template: `<section class="page is-active" data-page="task-center"><div class="ops-shell"></div></section>`,
public/control-center/pages/operations-centers.js:1783:  id: "queue-center",
public/control-center/pages/operations-centers.js:1790:  template: `<section class="page is-active" data-page="queue-center"><div class="ops-shell"></div></section>`,
public/control-center/pages/operations-centers.js:1831:  id: "job-monitor",
public/control-center/pages/operations-centers.js:1838:  template: `<section class="page is-active" data-page="job-monitor"><div class="ops-shell"></div></section>`,
public/control-center/pages/operations-centers.js:1879:  id: "notification-center",
public/control-center/pages/operations-centers.js:1884:    description: "Review alerts, unread inbox state, approvals, provider health, publishing, claim risks, and workflow completion signals with Mark Read limited to notification read-state."
public/control-center/pages/operations-centers.js:1886:  template: `<section class="page is-active" data-page="notification-center"><div class="ops-shell"></div></section>`,
public/control-center/pages/operations-centers.js:1927:  const root = document.querySelector('[data-page="operations-centers"] .ops-shell');
public/control-center/pages/operations-centers.js:1941:      route: "task-center",
public/control-center/pages/operations-centers.js:1949:      route: "queue-center",
public/control-center/pages/operations-centers.js:1957:      route: "job-monitor",
public/control-center/pages/operations-centers.js:1965:      route: "notification-center",
public/control-center/pages/operations-centers.js:1975:    <section class="page is-active" data-page="operations-centers">
public/control-center/pages/operations-centers.js:2066:  id: "operations-centers",
public/control-center/pages/operations-centers.js:2073:  template: `<section class="page is-active" data-page="operations-centers"><div class="ops-shell"></div></section>`,
public/control-center/pages/ai-command.js:102:                routeHint: "operations-centers"
public/control-center/pages/ai-command.js:1270:	if (id === "operations") return outputType === "task" ? "task-center" : "workflows";
public/control-center/pages/ai-command.js:1271:	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
public/control-center/pages/ai-command.js:1313:                return { outputType, destinationRoute: "task-center" };
public/control-center/pages/ai-command.js:1369:		"operations-centers": "Operations Centers",
public/control-center/pages/ai-command.js:1370:		"task-center": "Task Center",
public/control-center/pages/ai-command.js:1717:		destinationRoute: outputType === "task" ? "task-center" : "workflows",
public/control-center/pages/ai-command.js:2355:	"operations-centers": "Operations Centers",
public/control-center/pages/ai-command.js:2356:	"task-center": "Task Center",
public/control-center/pages/ai-command.js:2357:	"queue-center": "Queue Center",
public/control-center/pages/ai-command.js:2358:	"job-monitor": "Job Monitor",
public/control-center/pages/ai-command.js:2359:	"notification-center": "Notification Center",
public/control-center/pages/ai-command.js:2377:	"operations-centers": "operations",
public/control-center/pages/ai-command.js:2378:	"task-center": "operations",
public/control-center/pages/ai-command.js:2379:	"queue-center": "operations",
public/control-center/pages/ai-command.js:2380:	"job-monitor": "operations",
public/control-center/pages/ai-command.js:2381:	"notification-center": "operations",
public/control-center/pages/ai-command.js:2410:	operation: "operations-centers",
public/control-center/pages/ai-command.js:2411:	operations: "operations-centers",
public/control-center/pages/ai-command.js:2412:	tasks: "task-center",
public/control-center/pages/ai-command.js:2413:	queue: "queue-center",
public/control-center/pages/ai-command.js:2414:	jobs: "job-monitor",
public/control-center/pages/ai-command.js:2415:	notifications: "notification-center",
public/control-center/pages/ai-command.js:3555:	if (session?.teamMode === "team") return tool.intent === "task" ? "task-center" : "workflows";
public/control-center/pages/home.js:1082:    if (operationsBtn) operationsBtn.onclick = () => openRoute("operations-centers");
public/control-center/pages/publishing.js:1989:                <button id="publishingApproveBtn" class="btn btn-secondary" type="button" title="Prepare publishing readiness review. Confirmation required. Backend approval rules apply.">Mark ready for manual review</button>
public/control-center/pages/workflows.js:1549:        destination_page: "task-center",
public/control-center/pages/workflows.js:1569:      setSharedHandoff(projectName, "task-center", handoff);
public/control-center/pages/workflows.js:1571:      navigateTo("task-center");
public/control-center/pages/workflows.js:2127:                      <button class="btn btn-ghost btn-sm" type="button" data-wf-open="task-center">Open Task Center</button>
public/control-center/pages/workflows.js:2303:            destination_page: "task-center",
public/control-center/pages/workflows.js:2315:          setSharedHandoff(projectName, "task-center", handoff);
public/control-center/pages/workflows.js:2319:          navigateTo("task-center");
public/control-center/pages/workflows.js:2326:          if (route === "task-center") {
public/control-center/pages/workflows.js:2329:              destination_page: "task-center",
public/control-center/pages/workflows.js:2341:            setSharedHandoff(projectName, "task-center", handoff);
public/control-center/pages/workflows.js:2344:          if (route !== "task-center") stateModel.openedDestination = true;
public/control-center/app.js:62:  markProjectNotification,
public/control-center/app.js:2102:      markProjectNotification,
public/control-center/router.js:19:} from "./pages/operations-centers.js";
