# PHASE 3X.2 — Workflows API / Backend / Automation Evidence

## API workflow/handoff functions
1519:export async function runProjectWorkflow(projectName, workflowId, payload = {}) {
1524:  if (!workflowId) {
1525:    throw new Error("Missing workflow id");
1529:    `/media-manager/project/${encodeURIComponent(projectName)}/workflows/${encodeURIComponent(workflowId)}/run`,
1532:    "Failed to record workflow run"
1536:export async function runProjectAiWorkflow(projectName, workflowId, payload = {}) {
1541:  if (!workflowId) {
1542:    throw new Error("Missing workflow id");
1546:    `/media-manager/project/${encodeURIComponent(projectName)}/ai/workflows/${encodeURIComponent(workflowId)}/run`,
1549:    "Failed to execute AI workflow"
2228:    `/media-manager/project/${encodeURIComponent(projectName)}/handoffs${suffix}`,
2229:    "Failed to load handoffs"
2233:export async function createProjectHandoff(projectName, payload = {}) {
2239:    `/media-manager/project/${encodeURIComponent(projectName)}/handoffs`,
2242:    "Failed to create handoff"
2246:export async function consumeProjectHandoff(projectName, handoffId, payload = {}) {
2251:  if (!handoffId) {
2252:    throw new Error("Missing handoff id");
2256:    `/media-manager/project/${encodeURIComponent(projectName)}/handoffs/${encodeURIComponent(handoffId)}/consume`,
2259:    "Failed to consume handoff"

## Server workflow/handoff routes
219:  /^\/publish-clone\/[^/]+\/?$/i,
222:  /^\/publish-blog\/[^/]+\/?$/i,
226:  /^\/execute_publish_package\/?$/i,
780:  'manual_publish_ready',
1061:  publishing: {
1063:    canonical: 'publishing'
1095:    canonical: 'publishing/results'
1562:  'publishing',
2743:    published_count: 0,
2752:    if (product.status === 'publish') summary.published_count += 1;
2949:    publish_status: imageInfo ? 'ready_for_publish' : 'needs_manual_review'
2969:    status: compliance.publish_status,
3061:    publish_status: imageInfo ? 'ready_for_production' : 'needs_manual_review'
3080:    status: compliance.publish_status,
3206:    publish_status: imageInfo ? 'ready_for_publish' : 'needs_manual_review'
3234:    status: compliance.publish_status,
3640:    if (status !== 'publish' || !slug || !name || !stableKey) {
3696:      published_count: launchReadyProducts.length,
3846:    domain: 'publishing',
3851:    domain: 'publishing',
3854:    requestedIdentifier: 'publishing-root',
3855:    requestedFile: 'publishing'
3916:    domain: 'publishing',
3917:    artifactType: 'publishing_connector_payload',
3952:    domain: 'publishing',
3953:    artifactType: 'publishing_scheduler_job',
3970:  if (['queued', 'queue', 'scheduled', 'pending', 'pending_publish'].includes(normalized)) return 'scheduled';
3974:      'ready_for_manual_publish',
3976:      'ready_for_manual_handoff',
3978:      'manual_publish',
3985:  if (['published', 'completed', 'complete', 'success', 'done', 'sent', 'live'].includes(normalized)) {
3986:    return 'published';
4030:  if (safeChannel) return `${safeChannel} publish`;
4174:    domain: 'publishing',
4175:    artifactType: 'publishing_scheduler_job',
4304:    domain: 'publishing',
4309:    requestedFile: 'publishing/scheduler/*.json'
4430:    recommendations.push('rewrite copy in natural German for German-market publishing');
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
6757:      workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'ads-manager', 'governance'],
6758:      ai_team_defaults: ['strategist', 'writer', 'designer', 'ads_operator', 'publisher', 'compliance_reviewer'],
6770:      workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'publishing'],
6771:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'analyst'],
6783:      workspace_priorities: ['setup', 'library', 'media-studio', 'publishing', 'campaign-studio'],
6784:      ai_team_defaults: ['strategist', 'writer', 'designer', 'video_lead', 'publisher'],
6796:      workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'insights', 'workflows'],
6809:      workspace_priorities: ['setup', 'library', 'content-studio', 'publishing', 'insights'],
6810:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher'],
6866:      publishing: paths.publishingDir,
7166:  const publishingReadiness = fs.existsSync(paths.publishingDir) ? 100 : 0;
7179:    publishing_readiness: publishingReadiness,
7190:    has_publishing_dir: fs.existsSync(paths.publishingDir),
7226:  if (domainScores.publishing_readiness < 100) missing.push('publishing_readiness');
7302:    approval_note: normalizeSetupTextValue(asset.approval_note),
8203:        why_it_matters: 'Keeps setup, media creation, publishing previews, and AI output visually tied to the right brand.',
8280:      description: 'Approved product photography for content, media, ads, and publishing.',
8426:    record.approval_status ||
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
9800:        'Use the cloned draft product for safe content updates before publishing.'
9915:        'Review the updated draft clone in WooCommerce before any publish action.'
10593:        asset.approval_note = note || asset.approval_note || 'Approved from Control Center Library.';
10860:app.get('/media-manager/project/:project/task-center', handleGetTaskCenter);
10861:app.get('/public/media-manager/project/:project/task-center', handleGetTaskCenter);
11115:      error: error.message || 'Failed to list workflow runs'
11120:app.get('/media-manager/project/:project/workflows/runs', handleListWorkflowRuns);
11121:app.get('/public/media-manager/project/:project/workflows/runs', handleListWorkflowRuns);
11132:      error: error.message || 'Failed to load workflow run'
11137:app.get('/media-manager/project/:project/workflows/runs/:runId', handleGetWorkflowRun);
11138:app.get('/public/media-manager/project/:project/workflows/runs/:runId', handleGetWorkflowRun);
11144:      workflow_id: req.params.workflowId,
11157:        type: 'workflow_output',
11158:        title: req.body?.title || req.params.workflowId,
11161:        source_type: 'workflow_run',
11175:      error: error.message || 'Failed to record workflow run'
11180:app.post('/media-manager/project/:project/workflows/:workflowId/run', handleRunWorkflow);
11181:app.post('/public/media-manager/project/:project/workflows/:workflowId/run', handleRunWorkflow);
11321:      req.params.workflowId,
11330:      error: error.message || 'Failed to execute AI workflow'
11422:app.post('/media-manager/project/:project/ai/workflows/:workflowId/run', handleExecuteAiWorkflow);
11423:app.post('/public/media-manager/project/:project/ai/workflows/:workflowId/run', handleExecuteAiWorkflow);
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
11557:      error: error.message || 'Failed to load governance summary'
11571:      error: error.message || 'Failed to update governance policy'
11584:      error: error.message || 'Failed to load governance policy'
11589:app.get('/media-manager/project/:project/governance', handleGetGovernance);
11590:app.get('/public/media-manager/project/:project/governance', handleGetGovernance);
11591:app.get('/media-manager/project/:project/governance/policy', handleGetGovernancePolicy);
11592:app.get('/public/media-manager/project/:project/governance/policy', handleGetGovernancePolicy);
11593:app.post('/media-manager/project/:project/governance/policy', handleUpdateGovernancePolicy);
11594:app.post('/public/media-manager/project/:project/governance/policy', handleUpdateGovernancePolicy);
11653:      error: error.message || 'Failed to list handoffs'
11660:    const handoff = createHandoff(req.params.project, req.body || {});
11662:      handoff,
11667:      error: error.message || 'Failed to create handoff'
11674:    const handoff = consumeHandoff(req.params.project, req.params.handoffId, req.body || {});
11676:      handoff,
11681:      error: error.message || 'Failed to consume handoff'
11686:app.get('/media-manager/project/:project/handoffs', handleListHandoffs);
11687:app.get('/public/media-manager/project/:project/handoffs', handleListHandoffs);
11688:app.post('/media-manager/project/:project/handoffs', handleCreateHandoff);
11689:app.post('/public/media-manager/project/:project/handoffs', handleCreateHandoff);
11690:app.post('/media-manager/project/:project/handoffs/:handoffId/consume', handleConsumeHandoff);
11691:app.post('/public/media-manager/project/:project/handoffs/:handoffId/consume', handleConsumeHandoff);
12253:app.post('/media-manager/project/:project/publishing/schedule', (req, res) => {
12276:    logCriticalFailure('publishing_schedule', req, error, {
12280:      error: error.message || 'Failed to save publishing schedule',
12286:app.post('/public/media-manager/project/:project/publishing/schedule', (req, res) => {
12309:    logCriticalFailure('publishing_schedule', req, error, {
12313:      error: error.message || 'Failed to save publishing schedule',
12319:app.post('/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
12342:      error: error.message || 'Failed to reschedule publishing item',
12348:app.post('/public/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
12371:      error: error.message || 'Failed to reschedule publishing item',
12377:app.post('/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
12393:      error: error.message || 'Failed to approve publishing item',
12399:app.post('/public/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
12415:      error: error.message || 'Failed to approve publishing item',
12421:app.post('/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
12423:    assertPublishingMutationAllowed(req.params.project, 'publish', {
12425:      status: 'published'
12428:      status: 'published',
12432:      execution_status: 'published',
12433:      action_type: 'manual_publish_complete',
12442:    logCriticalFailure('publishing_publish', req, error, {
12447:      error: error.message || 'Failed to publish item',
12453:app.post('/public/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
12455:    assertPublishingMutationAllowed(req.params.project, 'publish', {
12457:      status: 'published'
12460:      status: 'published',
12464:      execution_status: 'published',
12465:      action_type: 'manual_publish_complete',
12474:    logCriticalFailure('publishing_publish', req, error, {
12479:      error: error.message || 'Failed to publish item',
12485:app.post('/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
12497:      action_type: 'manual_publish_failed',
12506:    logCriticalFailure('publishing_fail', req, error, {
12511:      error: error.message || 'Failed to mark publishing item as failed',
12517:app.post('/public/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
12529:      action_type: 'manual_publish_failed',
12538:    logCriticalFailure('publishing_fail', req, error, {
12543:      error: error.message || 'Failed to mark publishing item as failed',
13144:  const publishDir = path.join(baseDir, 'publish-packages');
13147:  const legacyPublishDir = path.join(legacyBaseDir, 'publish-packages');
13152:  ensureDir(publishDir);
13162:    publishDir,
13210:  const packageId = `publish_${Date.now()}`;
13222:    ready_for_publish: payload.assets.length > 0,
13230:    artifactType: 'campaign_publish_package',
13291:  const publishDir = resolveExecutionReadCandidate({
13294:    relativePath: 'publish-packages',
13298:    requestedFile: `campaign-finalization/publish-packages/${safeName}*`
13312:  const publishFiles = fs.existsSync(publishDir)
13313:    ? fs.readdirSync(publishDir).filter(x => x.startsWith(safeName))
13320:    publish_packages_count: publishFiles.length,
13322:    ready: mediaFiles.length > 0 || publishFiles.length > 0 || fs.existsSync(emailFile)
13400:  const inlinePackage = input.publish_package && typeof input.publish_package === 'object'
13401:    ? input.publish_package
13410:    const error = new Error('Missing publish package. Provide publish_package or campaign_name + channel');
13419:function buildSocialExecutionPayload(publishPackage) {
13420:  const assets = assertExecutionPackageAssets(publishPackage, 'publish package');
13421:  const channel = String(publishPackage.channel || '').trim().toLowerCase();
13427:    || `${String(primaryAsset.product_name || publishPackage.campaign_name || 'Campaign').trim()} update`;
13719:    domain: 'publishing',
13723:    requestedFile: `publishing/scheduler/${jobId}.json`
13741:    assertPublishingMutationAllowed(projectName, 'publish', {
13743:      status: 'published'
13762:    external_publish: normalizedMode !== 'semi_auto',
13772:      result.execution_status = 'ready_for_manual_publish';
13773:      result.action_type = 'manual_publish';
13774:      result.notes.push('Social payload is ready for operator-controlled publishing.');
13776:      result.execution_status = 'ready_for_manual_handoff';
13777:      result.action_type = 'manual_marketplace_handoff';
13778:      result.notes.push('Marketplace payload is ready for manual listing handoff.');
13790:      result.execution_status = 'auto_publish_pending';
13791:      result.action_type = 'auto_publish';
13792:      result.notes.push('Full-auto mode enabled. Social publish adapter should consume this.');
13808:    artifactType: 'publishing_execution_result',
13878:    const error = new Error('Manual publish recording is allowed only in semi_auto mode.');
13902:  const manualPublishDir = path.join(projectPaths.executionDir, 'manual-publish');
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
13979:    manual_publish_recorded: true,
13980:    external_publish: false,
13981:    manual_publish: true,
14017:    artifactType: 'publishing_execution_result',
14039:      String(item?.entity_type || '').trim() === 'publishing_job'
14050:  const governance = getGovernancePolicy(projectName);
14054:  const policyRules = governance && typeof governance === 'object' && governance.policy_rules && typeof governance.policy_rules === 'object'
14055:    ? governance.policy_rules
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
14076:    appLogger.warn('governance_blocked', {
14077:      route: '/governance/publishing',
14087:    logGovernanceBlock('freeze_publishing');
14089:      'Publishing is frozen by governance policy. The requested publishing mutation was blocked.',
14092:        rule: 'freeze_publishing'
14097:  if (approvalSensitiveAction && approvalBeforePublish) {
14099:      logGovernanceBlock('approval_before_publish', { reason: 'job_id_missing' });
14101:        'Approval before publish is enabled. This publishing action requires a durable publishing job with an approved governance decision.',
14104:          rule: 'approval_before_publish'
14109:    const approval = getLatestPublishingApproval(projectName, jobId);
14110:    const approvalStatus = String(approval?.status || '').trim().toLowerCase();
14112:    if (!['approved', 'overridden'].includes(approvalStatus)) {
14113:      logGovernanceBlock('approval_before_publish', {
14115:        approval_status: approvalStatus || 'missing'
14118:        'Approval before publish is enabled. The publishing job is not approved for ready/publish mutation.',
14121:          rule: 'approval_before_publish',
14123:          approval_status: approvalStatus || 'missing'
15349:      item.status = 'ready_for_publish';
15356:        note: 'Post draft is now ready_for_publish. Social publishing connector is the next layer.'
15375:      item.status = 'ready_for_publish';
15382:        note: 'Blog draft is now ready_for_publish. Website/blog publishing connector is the next layer.'
15409:if (command === '/publish_blog') {
15416:    `http://localhost:${PORT}/publish-blog/${draftId}?project=${encodeURIComponent(commandProject)}`,
15673:  if (!blogItem || !blogItem.published_post_id) {
15674:    return res.json({ error: 'Blog not published or not found' });
15709:      `${process.env.WP_BASE_URL}/posts/${blogItem.published_post_id}`,
15726:    asset.attached_post_id = blogItem.published_post_id;
15749:        post_id: blogItem.published_post_id,
15766:    if (command === '/enhance_published_blog') {
15778:      if (!blogItem || !blogItem.published_post_id) {
15788:        const postId = blogItem.published_post_id;
15899:    if (command === '/review_published_blog') {
15921:          published_post_id: blogItem.published_post_id || null,
16511:          'Generate assets from strategy, then run review -> approval -> media -> publish/send.',
17251:          'publish landing/product/blog asset',
17360:          'publish one authority blog',
17362:          'publish three social assets',
17715:    if (command === '/campaign_publish_blog') {
17742:          `http://localhost:${PORT}/publish-blog/${blogId}?project=${encodeURIComponent(commandProject)}`
17745:        campaignExec.controlled_publish = campaignExec.controlled_publish || {};
17746:        campaignExec.controlled_publish.blog = {
17747:          status: 'published',
17750:          published_at: new Date().toISOString()
17761:          result: campaignExec.controlled_publish.blog
17765:          error: 'Campaign blog publish failed',
17806:        campaignExec.controlled_publish = campaignExec.controlled_publish || {};
17807:        campaignExec.controlled_publish.email = {
17823:          result: campaignExec.controlled_publish.email
17833:    if (command === '/campaign_review_publish_state') {
17858:          controlled_publish: campaignExec.controlled_publish || {},
17860:            blog: campaignExec.controlled_publish?.blog?.status || 'not_published',
17861:            email: campaignExec.controlled_publish?.email?.status || 'not_sent'
19748:if (command === '/build_campaign_publish_package') {
19765:      error: 'Failed to build campaign publish package',
19914:if (command === '/record_manual_publish') {
19925:      error: 'Missing required args. Usage: /record_manual_publish <project> <campaign> <channel> <job_id> <operator> <post_url> [notes...]'
19934:      error: 'Failed to record manual publish',
20589:app.post('/publish-clone/:cloneId', async (req, res) => {
20592:    assertPublishingMutationAllowed(projectName, 'publish', {
20593:      status: 'published'
20600:        status: 'publish'
20610:    const publishedProduct = response.data;
20613:      mode: 'publish_clone',
20614:      product_id: publishedProduct.id,
20615:      name: publishedProduct.name,
20616:      status: publishedProduct.status,
20617:      permalink: publishedProduct.permalink,
20620:        'This action published a draft product. Original product was not modified.'
20623:    logCriticalFailure('publish_clone', req, error, {
20627:      error: sanitizeErrorPayloadForClient(error.response?.data || error.message) || 'Failed to publish clone product'
20635:    assertPublishingMutationAllowed(projectName, 'publish', {
20636:      status: 'published'
20676:      status: 'publish'
20768:app.post('/publish-blog/:draftId', async (req, res) => {
20771:    assertPublishingMutationAllowed(projectName, 'publish', {
20772:      status: 'published'
20820:        status: 'publish'
20830:        message: `WordPress publish failed with status ${response.status}`
20834:    item.status = 'published';
20835:    item.published_post_id = data.id || null;
20838:    item.date_published = data.date || '';
20860:      note: 'Blog published successfully'
20863:    logCriticalFailure('publish_blog', req, err, {
20869:      message: 'Failed to publish blog draft'
20877:    assertPublishingMutationAllowed(projectName, 'publish', {
20878:      status: 'published'
20906:      status: backupData.status || 'publish'
20945:const SCHEDULER_VALID_JOB_TYPES = Object.freeze(['publish', 'email', 'media', 'ads']);
21005:  const publishPackage = payload.publish_package && typeof payload.publish_package === 'object'
21006:    ? payload.publish_package
21008:  const assets = Array.isArray(publishPackage.assets) ? publishPackage.assets : [];
21014:      || publishPackage.campaign_id

## Automation engine evidence
import { buildSystemIntelligence } from "./system-intelligence.js";
import { setSharedAiDraft, setSharedHandoff } from "./shared-context.js";

const AUTO_MODE_STORAGE_KEY = "mh-auto-mode-state-v1";
const AUTO_MODE_MAX_LOGS = 80;
const AUTO_SAFE_TYPES = new Set([
  "navigate",
  "create_draft",
  "save_local_draft",
  "create_handoff",
  "generate_prompt",
  "prepare_workflow",
  "prepare_publishing_draft"
]);

const AUTO_BLOCK_PATTERNS = [
  { test: /publish\s*now|go\s*live|send\s*live|execute\s*publish|push\s*live/i, reason: "Publishing requires approval and manual confirmation." },
  { test: /\bdelete\b|\bremove\b|\bdestroy\b|\berase\b/i, reason: "Destructive actions are blocked in Auto Mode." },
  { test: /\boverwrite\b|\breplace\b|\btruncate\b/i, reason: "Overwrite actions are blocked in Auto Mode." },
  { test: /disconnect|revoke|unlink/i, reason: "Connection removal is blocked in Auto Mode." },
  { test: /approve\s*final\s*asset|final\s*approval/i, reason: "Final approvals require a human decision." },
  { test: /spend\s*money|charge|billing|payment|purchase/i, reason: "Spending actions require explicit manual approval." },
  { test: /send\s*external|send\s*email|send\s*message|dm\b|sms\b/i, reason: "External sending requires approval." },
  { test: /paid\s*ads|launch\s*ads|ad\s*spend|budget/i, reason: "Paid promotion requires approval." },
  { test: /credential|api\s*key|secret|token|auth/i, reason: "Credential and provider connection actions require approval." }
];

const autoModeListeners = new Set();

const autoModeRuntime = {
  context: {},
  runToken: 0
};

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asString(value) {
  if (value == null) return "";
  return String(value);
}

function normalizeText(value) {
  return asString(value).trim().toLowerCase();
}

function nowIso() {
  return new Date().toISOString();
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildDefaultAutoModeState() {
  return {
    enabled: false,
    mode: "off",
    currentPlan: [],
    currentStepIndex: 0,
    status: "idle",
    logs: [],
    lastRunAt: "",
    approvalRequiredStep: null
  };
}

function normalizeAutoModeState(raw) {
  const parsed = asObject(raw);
  const next = {
    enabled: Boolean(parsed.enabled),
    mode: ["off", "guided", "auto_until_approval"].includes(normalizeText(parsed.mode))
      ? normalizeText(parsed.mode)
      : "off",
    currentPlan: asArray(parsed.currentPlan),
    currentStepIndex: Math.max(0, Number(parsed.currentStepIndex) || 0),
    status: ["idle", "running", "paused", "waiting_approval", "completed", "failed"].includes(normalizeText(parsed.status))
      ? normalizeText(parsed.status)
      : "idle",
    logs: asArray(parsed.logs).slice(-AUTO_MODE_MAX_LOGS),
    lastRunAt: asString(parsed.lastRunAt),
    approvalRequiredStep: parsed.approvalRequiredStep == null ? null : asObject(parsed.approvalRequiredStep)
  };
  return next;
}

function readPersistedAutoModeState() {
  if (typeof window === "undefined") return buildDefaultAutoModeState();
  try {
    const raw = window.sessionStorage?.getItem(AUTO_MODE_STORAGE_KEY);
    if (!raw) return buildDefaultAutoModeState();
    const parsed = JSON.parse(raw);
    const state = normalizeAutoModeState(parsed);
    if (state.status === "running" || state.status === "waiting_approval") {
      state.status = "paused";
      state.enabled = false;
      state.mode = "off";
      state.logs = [
        ...state.logs,
        {
          at: nowIso(),
          level: "warning",
          message: "Auto Mode did not continue after reload. Resume manually if needed."
        }
      ].slice(-AUTO_MODE_MAX_LOGS);
    }
    return state;
  } catch (_) {
    return buildDefaultAutoModeState();
  }
}

function persistAutoModeState(state) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage?.setItem(AUTO_MODE_STORAGE_KEY, JSON.stringify(state));
  } catch (_) {}
}

let autoModeState = readPersistedAutoModeState();

function pushAutoLog(message, level = "info", extra = {}) {
  autoModeState.logs = [
    ...asArray(autoModeState.logs),
    {
      at: nowIso(),
      level,
      message: asString(message),
      ...asObject(extra)
    }
  ].slice(-AUTO_MODE_MAX_LOGS);
}

function emitAutoModeState() {
  persistAutoModeState(autoModeState);
  const snapshot = clone(autoModeState);
  autoModeListeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch (_) {}
  });
}

function resolveControllerContext(override = {}) {
  return {
    ...asObject(autoModeRuntime.context),
    ...asObject(override)
  };
}

function stepActionText(step) {
  return asString(step?.action || step?.type || "step");
}

function stepTextFingerprint(step) {
  return [
    asString(step?.type),
    stepActionText(step),
    asString(step?.targetPage),
    asString(step?.payload?.intent),
    asString(step?.payload?.prompt)
  ].join(" ");
}

function priorityRank(priority) {
  if (priority === "critical") return 3;
  if (priority === "recommended") return 2;
  return 1;
}

function normalizePriority(value) {
  const normalized = normalizeText(value);
  if (["critical", "recommended", "optional"].includes(normalized)) return normalized;
  return "recommended";
}

function defaultPromptForStep(step) {
  return asString(step?.payload?.prompt || step?.payload?.reason || `Prepare ${asString(step?.targetPage || "next action")}`);
}

function createStep({
  type,
  targetPage,
  action,
  payload = {},
  priority = "recommended"
}) {
  return {
    id: `${type}:${targetPage}:${Math.random().toString(36).slice(2, 8)}`,
    type,
    targetPage,
    action,
    payload: asObject(payload),
    priority: normalizePriority(priority)
  };
}

export function isSafeAction(step) {
  const type = normalizeText(step?.type);
  const fingerprint = normalizeText(stepTextFingerprint(step));

  if (!AUTO_SAFE_TYPES.has(type)) return false;

  for (const rule of AUTO_BLOCK_PATTERNS) {
    if (rule.test.test(fingerprint)) return false;
  }

  return true;
}

function gateForStep(step) {
  const type = normalizeText(step?.type);
  const action = stepActionText(step);
  const fingerprint = normalizeText(stepTextFingerprint(step));

  for (const rule of AUTO_BLOCK_PATTERNS) {
    if (rule.test.test(fingerprint)) {
      return {
        required: true,
        reason: rule.reason,
        whatWillHappen: `${action} is not executed automatically. A human must approve the next move.`
      };
    }
  }

  if (type === "prepare_publishing_draft") {
    return { required: false, reason: "", whatWillHappen: "" };
  }

  if (fingerprint.includes("publishing") && /publish/.test(fingerprint)) {
    return {
      required: true,
      reason: "Publishing actions require manual approval before execution.",
      whatWillHappen: "Auto Mode will stop at this step and wait for approval."
    };
  }

  return { required: false, reason: "", whatWillHappen: "" };
}

export function buildAutomationPlan(state) {
  const intelligence = buildSystemIntelligence(state);
  const recommendations = asArray(intelligence.recommendations);

  const steps = recommendations.map((rec) => {
    const targetPage = asString(rec?.targetPage || "ai-command");
    const reason = asString(rec?.reason);
    const prompt = asString(rec?.draftPayload?.prompt || `Plan and execute: ${asString(rec?.title)}`);

    return createStep({
      type: "create_handoff",
      targetPage,
      action: `Prepare ${targetPage} step from system intelligence`,
      payload: {
        recommendationId: asString(rec?.id),
        title: asString(rec?.title),
        reason,
        prompt,
        impactChips: asArray(rec?.impactChips),
        blockerType: asString(rec?.blockerType)
      },
      priority: asString(rec?.priority)
    });
  });

  steps.sort((a, b) => priorityRank(b.priority) - priorityRank(a.priority));
  return steps;
}

export function getAutoFixPlan(state) {
  return buildAutomationPlan(state).filter((step) => step.priority === "critical");
}

export function getAutoFlowPlan(state) {
  const intelligence = buildSystemIntelligence(state);
  const projectName = asString(intelligence.projectName || state?.context?.currentProject || "");

  return [
    createStep({
      type: "create_draft",
      targetPage: "content-studio",
      action: "Create content draft",
      payload: {
        projectName,
        prompt: "Create a conversion-ready content draft from campaign context and current blockers.",
        source: "automation-flow"
      },
      priority: "recommended"
    }),
    createStep({
      type: "create_handoff",
      targetPage: "media-studio",
      action: "Create content-to-media handoff",
      payload: {
        projectName,
        prompt: "Prepare media generation plan from content draft.",
        source_page: "content-studio"
      },
      priority: "recommended"
    }),
    createStep({
      type: "create_handoff",
      targetPage: "library",
      action: "Create media-to-library handoff",
      payload: {
        projectName,
        prompt: "Save approved media as managed library assets.",
        source_page: "media-studio"
      },
      priority: "recommended"
    }),
    createStep({
      type: "create_handoff",
      targetPage: "publishing",
      action: "Create library-to-publishing handoff",
      payload: {
        projectName,
        prompt: "Prepare publishing draft with approved content/media and schedule-safe checklist.",
        source_page: "library"
      },
      priority: "recommended"
    })
  ];
}

export async function runAutomationStep(step, context = {}) {
  const safe = isSafeAction(step);
  if (!safe) {
    return { status: "skipped", reason: "Blocked by safety rules.", step };
  }

  const state = typeof context.getState === "function" ? context.getState() : asObject(context.state);
  const projectName = asString(context.projectName || state?.context?.currentProject || step?.payload?.projectName || "__default__");
  const destination = asString(step?.targetPage || "ai-command");

  try {
    if (normalizeText(step.type) === "navigate") {
      if (typeof context.navigateTo === "function") {
        context.navigateTo(destination);
      }
      return { status: "success", reason: "Navigation completed.", step };
    }

    if (normalizeText(step.type) === "generate_prompt") {
      const prompt = defaultPromptForStep(step);
      setSharedAiDraft(projectName, {
        projectName,
        modeId: "operations",
        lastCommand: prompt,
        lastResponseTitle: asString(step?.payload?.title || "Automation suggestion"),
        routeSuggestions: [{ route: destination, label: destination }],
        updatedAt: new Date().toISOString()
      });
      return { status: "success", reason: "Prompt generated.", step };
    }
