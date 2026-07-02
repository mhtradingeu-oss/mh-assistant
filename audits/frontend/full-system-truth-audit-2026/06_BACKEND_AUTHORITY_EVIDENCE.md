# Backend Authority / Ops Model Evidence

## Backend authority markers
runtime/orchestrator-service/lib/insights/learning-engine.js:40:    item.published_at ||
runtime/orchestrator-service/lib/insights/learning-engine.js:58:  ) || 'Published content';
runtime/orchestrator-service/lib/insights/learning-engine.js:259:      title: 'Rewrite weak content before publishing more of the same',
runtime/orchestrator-service/lib/insights/learning-engine.js:323:      domain: 'publishing',
runtime/orchestrator-service/lib/insights/learning-engine.js:327:      action: 'Sync Facebook, Instagram, TikTok, and YouTube feeds so the system can compare hooks, formats, and publishing windows across channels.',
runtime/orchestrator-service/lib/insights/learning-engine.js:328:      reason: 'Cross-platform learning depends on post-level metrics, not just publishing logs.'
runtime/orchestrator-service/lib/insights/learning-engine.js:353:    publishing_improvements: filterDomain('publishing'),
runtime/orchestrator-service/lib/insights/learning-engine.js:361:        title: 'Publishing window to test',
runtime/orchestrator-service/lib/insights/learning-engine.js:368:        prompt: `Review the latest learning patterns and recommendations for ${projectName}. Tell me the next highest-impact optimization across content, SEO, publishing, paid media, and website conversion.`
runtime/orchestrator-service/lib/insights/learning-engine.js:388:        prompt: `Summarize the strongest reusable performance pattern in ${projectName}, including hook, format, channel, CTA, and publishing window.`
runtime/orchestrator-service/lib/insights/ingestion-service.js:273:    label: asString(fields.label || fields.title || 'Published content'),
runtime/orchestrator-service/lib/insights/ingestion-service.js:280:    published_at: asString(fields.published_at || fields.created_at || fields.timestamp),
runtime/orchestrator-service/lib/insights/ingestion-service.js:311:          published_at: item.created_at,
runtime/orchestrator-service/lib/insights/ingestion-service.js:327:          published_at: item.timestamp,
runtime/orchestrator-service/lib/insights/ingestion-service.js:344:          published_at: item.create_time,
runtime/orchestrator-service/lib/insights/ingestion-service.js:361:          published_at: item.published_at,
runtime/orchestrator-service/lib/ops/backbone.js:18:// Any governance file that is missing policy_rules (or missing individual keys)
runtime/orchestrator-service/lib/ops/backbone.js:21:  approval_before_publish: true,
runtime/orchestrator-service/lib/ops/backbone.js:26:  freeze_publishing: false
runtime/orchestrator-service/lib/ops/backbone.js:38:  approvals: 300,
runtime/orchestrator-service/lib/ops/backbone.js:43:  handoffs: 250
runtime/orchestrator-service/lib/ops/backbone.js:52:    statuses: ['draft', 'in_review', 'approved', 'scheduled', 'published', 'archived'],
runtime/orchestrator-service/lib/ops/backbone.js:55:    publish_statuses: ['draft', 'scheduled', 'published', 'failed']
runtime/orchestrator-service/lib/ops/backbone.js:62:  workflow_runs: {
runtime/orchestrator-service/lib/ops/backbone.js:66:  ai_commands: {
runtime/orchestrator-service/lib/ops/backbone.js:76:    route_targets: ['campaign-studio', 'content-studio', 'media-studio', 'publishing', 'ads-manager', 'task-center', 'governance']
runtime/orchestrator-service/lib/ops/backbone.js:82:  approvals: {
runtime/orchestrator-service/lib/ops/backbone.js:95:  handoffs: {
runtime/orchestrator-service/lib/ops/backbone.js:100:    categories: ['entity', 'workflow', 'approval', 'sync', 'publish', 'ai_routing', 'system']
runtime/orchestrator-service/lib/ops/backbone.js:103:    statuses: ['draft', 'ready_for_review', 'manual_publish_ready', 'pending_execution', 'executed', 'failed'],
runtime/orchestrator-service/lib/ops/backbone.js:104:    bridge_actions: ['execute_publish_package', 'execute_email_package', 'generate_media_from_prompt', 'build_ad_execution_package']
runtime/orchestrator-service/lib/ops/backbone.js:121:    actions: ['draft_content', 'revise_copy', 'handoff_to_review', 'handoff_to_publishing']
runtime/orchestrator-service/lib/ops/backbone.js:138:    id: 'publisher',
runtime/orchestrator-service/lib/ops/backbone.js:139:    label: 'Publisher',
runtime/orchestrator-service/lib/ops/backbone.js:140:    routes: ['publishing', 'library', 'workflows'],
runtime/orchestrator-service/lib/ops/backbone.js:141:    service_domains: ['publishing'],
runtime/orchestrator-service/lib/ops/backbone.js:142:    actions: ['schedule_publish', 'publish', 'return_for_changes']
runtime/orchestrator-service/lib/ops/backbone.js:155:    service_domains: ['research', 'governance'],
runtime/orchestrator-service/lib/ops/backbone.js:161:    routes: ['governance', 'content-studio', 'media-studio', 'publishing'],
runtime/orchestrator-service/lib/ops/backbone.js:162:    service_domains: ['governance'],
runtime/orchestrator-service/lib/ops/backbone.js:168:    routes: ['home', 'settings', 'integrations', 'governance', 'workflows'],
runtime/orchestrator-service/lib/ops/backbone.js:169:    service_domains: ['governance'],
runtime/orchestrator-service/lib/ops/backbone.js:179:  publishing: ['publisher', 'compliance_reviewer', 'admin'],
runtime/orchestrator-service/lib/ops/backbone.js:181:  governance: ['compliance_reviewer', 'admin', 'analyst'],
runtime/orchestrator-service/lib/ops/backbone.js:186:  library: ['designer', 'video_lead', 'publisher', 'admin'],
runtime/orchestrator-service/lib/ops/backbone.js:203:    handoff_to: ['designer', 'video_lead', 'publisher', 'compliance_reviewer'],
runtime/orchestrator-service/lib/ops/backbone.js:205:    page_permissions: ['content-studio', 'workflows', 'publishing']
runtime/orchestrator-service/lib/ops/backbone.js:211:    handoff_to: ['publisher', 'ads_operator', 'compliance_reviewer'],
runtime/orchestrator-service/lib/ops/backbone.js:213:    page_permissions: ['media-studio', 'workflows', 'publishing']
runtime/orchestrator-service/lib/ops/backbone.js:215:  publishing: {
runtime/orchestrator-service/lib/ops/backbone.js:216:    label: 'Publishing',
runtime/orchestrator-service/lib/ops/backbone.js:217:    owner_role: 'publisher',
runtime/orchestrator-service/lib/ops/backbone.js:220:    route_target: 'publishing',
runtime/orchestrator-service/lib/ops/backbone.js:221:    page_permissions: ['publishing', 'governance']
runtime/orchestrator-service/lib/ops/backbone.js:231:  governance: {
runtime/orchestrator-service/lib/ops/backbone.js:232:    label: 'Governance',
runtime/orchestrator-service/lib/ops/backbone.js:236:    route_target: 'governance',
runtime/orchestrator-service/lib/ops/backbone.js:237:    page_permissions: ['governance', 'settings']
runtime/orchestrator-service/lib/ops/backbone.js:245:  publishing_job: 'publishing',
runtime/orchestrator-service/lib/ops/backbone.js:247:  approval: 'governance',
runtime/orchestrator-service/lib/ops/backbone.js:248:  task: 'governance'
runtime/orchestrator-service/lib/ops/backbone.js:389:        page_permissions: ['workflows', 'governance'],
runtime/orchestrator-service/lib/ops/backbone.js:391:        service_domains: ['campaign', 'content', 'media', 'publishing', 'research', 'governance']
runtime/orchestrator-service/lib/ops/backbone.js:403:    route_permissions: Object.entries(ROUTE_ROLE_ACCESS).map(([route, roles]) => ({
runtime/orchestrator-service/lib/ops/backbone.js:438:    route_permissions: defaults.route_permissions,
runtime/orchestrator-service/lib/ops/backbone.js:515:  if (routeTarget === 'publishing') return 'publishing';
runtime/orchestrator-service/lib/ops/backbone.js:517:  if (routeTarget === 'governance') return 'governance';
runtime/orchestrator-service/lib/ops/backbone.js:790:    approvalsPath: path.join(opsDir, 'approvals.json'),
runtime/orchestrator-service/lib/ops/backbone.js:794:    governancePath: path.join(opsDir, 'governance.json'),
runtime/orchestrator-service/lib/ops/backbone.js:796:    handoffsPath: path.join(opsDir, 'handoffs.json')
runtime/orchestrator-service/lib/ops/backbone.js:816:      'workflow_runs',
runtime/orchestrator-service/lib/ops/backbone.js:817:      'ai_commands',
runtime/orchestrator-service/lib/ops/backbone.js:822:      'approvals',
runtime/orchestrator-service/lib/ops/backbone.js:825:      'handoffs',
runtime/orchestrator-service/lib/ops/backbone.js:839:  ensureJsonFile(paths.approvalsPath, []);
runtime/orchestrator-service/lib/ops/backbone.js:842:  ensureJsonFile(paths.handoffsPath, []);
runtime/orchestrator-service/lib/ops/backbone.js:844:  ensureJsonFile(paths.governancePath, {
runtime/orchestrator-service/lib/ops/backbone.js:845:    approval_required_actions: ['publish', 'launch', 'budget_change', 'integration_reconnect', 'execution_mode_change'],
runtime/orchestrator-service/lib/ops/backbone.js:853:      approval_before_publish: true,
runtime/orchestrator-service/lib/ops/backbone.js:858:      freeze_publishing: false
runtime/orchestrator-service/lib/ops/backbone.js:864:      publishing: 'Publisher',
runtime/orchestrator-service/lib/ops/backbone.js:873:      approval_before_publish: true
runtime/orchestrator-service/lib/ops/backbone.js:905:      'workflow_runs',
runtime/orchestrator-service/lib/ops/backbone.js:906:      'ai_commands',
runtime/orchestrator-service/lib/ops/backbone.js:911:      'approvals',
runtime/orchestrator-service/lib/ops/backbone.js:914:      'handoffs',
runtime/orchestrator-service/lib/ops/backbone.js:971:  if (value.includes('publish')) return 'publish';
runtime/orchestrator-service/lib/ops/backbone.js:1182: * Normalizes a raw governance file object so that:
runtime/orchestrator-service/lib/ops/backbone.js:1185: *  - freeze_publishing and approval_before_publish are always explicit booleans
runtime/orchestrator-service/lib/ops/backbone.js:1190:function normalizeGovernancePolicy(raw) {
runtime/orchestrator-service/lib/ops/backbone.js:1204:    freeze_publishing: asBoolean(safeRules.freeze_publishing, DEFAULT_POLICY_RULES.freeze_publishing),
runtime/orchestrator-service/lib/ops/backbone.js:1205:    approval_before_publish: asBoolean(safeRules.approval_before_publish, DEFAULT_POLICY_RULES.approval_before_publish)
runtime/orchestrator-service/lib/ops/backbone.js:1214:function getGovernancePolicy(projectName) {
runtime/orchestrator-service/lib/ops/backbone.js:1218:    raw = readJsonFileDurable(paths.governancePath);
runtime/orchestrator-service/lib/ops/backbone.js:1220:    // Governance file is corrupt — do not silently bypass enforcement.
runtime/orchestrator-service/lib/ops/backbone.js:1221:    console.error(`[backbone] getGovernancePolicy: governance file corrupt for project ${projectName}: ${err.message}`);
runtime/orchestrator-service/lib/ops/backbone.js:1224:  // null means the file does not exist yet — normalizeGovernancePolicy({}) gives safe defaults
runtime/orchestrator-service/lib/ops/backbone.js:1225:  return normalizeGovernancePolicy(raw === null ? {} : raw);
runtime/orchestrator-service/lib/ops/backbone.js:1228:function updateGovernancePolicy(projectName, patch = {}, actor = 'mh-assistant') {
runtime/orchestrator-service/lib/ops/backbone.js:1230:  const current = getGovernancePolicy(projectName);
runtime/orchestrator-service/lib/ops/backbone.js:1258:  writeJsonFile(paths.governancePath, next);
runtime/orchestrator-service/lib/ops/backbone.js:1262:    type: 'governance_policy_updated',
runtime/orchestrator-service/lib/ops/backbone.js:1263:    entity_type: 'governance_policy',
runtime/orchestrator-service/lib/ops/backbone.js:1265:    title: 'Governance policy updated',
runtime/orchestrator-service/lib/ops/backbone.js:1266:    summary: 'Governance rules were updated and persisted.',
runtime/orchestrator-service/lib/ops/backbone.js:1277:function appendGovernanceOverride(projectName, input = {}) {
runtime/orchestrator-service/lib/ops/backbone.js:1278:  const policy = getGovernancePolicy(projectName);
runtime/orchestrator-service/lib/ops/backbone.js:1297:  return updateGovernancePolicy(projectName, {
runtime/orchestrator-service/lib/ops/backbone.js:1323:  if (normalizedType === 'publishing_job') {
runtime/orchestrator-service/lib/ops/backbone.js:1325:      asString(item.entity_type) === 'publishing_job' &&
runtime/orchestrator-service/lib/ops/backbone.js:1333:function buildPolicyFlags(record = {}, governance = {}) {
runtime/orchestrator-service/lib/ops/backbone.js:1344:  if (asBoolean(governance.policy_rules?.freeze_publishing) && asString(record.entity_type) === 'publishing_job') {
runtime/orchestrator-service/lib/ops/backbone.js:1346:      code: 'publishing_frozen',
runtime/orchestrator-service/lib/ops/backbone.js:1348:      message: 'Publishing is frozen by governance policy.'
runtime/orchestrator-service/lib/ops/backbone.js:1396:function buildBrandSafetyFlags(record = {}, governance = {}) {
runtime/orchestrator-service/lib/ops/backbone.js:1422:  if (asString(record.entity_type) === 'media_job' && asBoolean(governance.policy_rules?.brand_safety_review_required, true)) {
runtime/orchestrator-service/lib/ops/backbone.js:1435:function buildPublishGuardrails(record = {}, governance = {}) {
runtime/orchestrator-service/lib/ops/backbone.js:1444:  if (!asString(record.scheduled_for) && status !== 'published') {
runtime/orchestrator-service/lib/ops/backbone.js:1448:      message: 'Publishing item has no schedule locked.'
runtime/orchestrator-service/lib/ops/backbone.js:1452:  if (asBoolean(governance.policy_rules?.approval_before_publish, true) && !['approved', 'ready', 'published'].includes(status)) {
runtime/orchestrator-service/lib/ops/backbone.js:1456:      message: 'Publishing item is not marked approved/ready under current policy.'
runtime/orchestrator-service/lib/ops/backbone.js:1460:  if (asBoolean(governance.policy_rules?.freeze_publishing)) {
runtime/orchestrator-service/lib/ops/backbone.js:1464:      message: 'Publishing freeze is active.'
runtime/orchestrator-service/lib/ops/backbone.js:1471:function buildGovernanceSummary(projectName, options = {}) {
runtime/orchestrator-service/lib/ops/backbone.js:1473:  const governance = getGovernancePolicy(projectName);
runtime/orchestrator-service/lib/ops/backbone.js:1475:  const approvals = readCollection(paths.approvalsPath);
runtime/orchestrator-service/lib/ops/backbone.js:1481:  const pendingApprovals = approvals.filter((item) => asString(item.status) === 'pending');
runtime/orchestrator-service/lib/ops/backbone.js:1482:  const escalationApprovals = approvals.filter((item) => asString(item.status) === 'escalated');
runtime/orchestrator-service/lib/ops/backbone.js:1483:  const activeOverrides = asArray(governance.active_overrides).filter((item) => asString(item.status) === 'active');
runtime/orchestrator-service/lib/ops/backbone.js:1485:  const approvalQueue = pendingApprovals.map((approval) => ({
runtime/orchestrator-service/lib/ops/backbone.js:1488:    policy_flags: buildPolicyFlags(approval, governance)
runtime/orchestrator-service/lib/ops/backbone.js:1493:    ...approvals.filter((item) => ['pending', 'changes_requested', 'escalated'].includes(asString(item.status)))
runtime/orchestrator-service/lib/ops/backbone.js:1512:      brand_safety_flags: buildBrandSafetyFlags(item, governance)
runtime/orchestrator-service/lib/ops/backbone.js:1516:  const publishGuardrails = queueItems
runtime/orchestrator-service/lib/ops/backbone.js:1517:    .filter((item) => asString(item.entity_type) === 'publishing_job')
runtime/orchestrator-service/lib/ops/backbone.js:1520:      publish_guardrails: buildPublishGuardrails(item, governance)
runtime/orchestrator-service/lib/ops/backbone.js:1522:    .filter((item) => item.publish_guardrails.length || ['scheduled', 'ready', 'failed'].includes(asString(item.status)));
runtime/orchestrator-service/lib/ops/backbone.js:1558:    ...publishGuardrails.flatMap((item) =>
runtime/orchestrator-service/lib/ops/backbone.js:1559:      item.publish_guardrails.map((flag) => ({
runtime/orchestrator-service/lib/ops/backbone.js:1561:        source: 'publish_guardrails',
runtime/orchestrator-service/lib/ops/backbone.js:1562:        entity_type: 'publishing_job',
runtime/orchestrator-service/lib/ops/backbone.js:1575:    ...escalationApprovals,
runtime/orchestrator-service/lib/ops/backbone.js:1577:      asString(item.source_type) === 'approval' || asString(item.route_target) === 'governance'
runtime/orchestrator-service/lib/ops/backbone.js:1586:    policy: governance,
runtime/orchestrator-service/lib/ops/backbone.js:1592:        publishing: roleDisplay(team, 'publisher'),
runtime/orchestrator-service/lib/ops/backbone.js:1596:      escalation_chain: governance.escalation_chain || ESCALATION_CHAINS
runtime/orchestrator-service/lib/ops/backbone.js:1603:      publish_guardrails: publishGuardrails,
runtime/orchestrator-service/lib/ops/backbone.js:1607:        freeze_publishing: asBoolean(governance.policy_rules?.freeze_publishing),
runtime/orchestrator-service/lib/ops/backbone.js:1608:        allow_admin_override: asBoolean(governance.policy_rules?.allow_admin_override, true)
runtime/orchestrator-service/lib/ops/backbone.js:1616:      publishing_jobs: queueItems.filter((item) => asString(item.entity_type) === 'publishing_job').length,
runtime/orchestrator-service/lib/ops/backbone.js:1617:      pending_approvals: pendingApprovals.length
runtime/orchestrator-service/lib/ops/backbone.js:1628:    status: item.publish_status || item.approval_status || item.status || 'draft',
runtime/orchestrator-service/lib/ops/backbone.js:1637:      publish_status: item.publish_status,
runtime/orchestrator-service/lib/ops/backbone.js:1664:      publishing_job_id: job.publishing_job_id,
runtime/orchestrator-service/lib/ops/backbone.js:1710:    linked_approvals: normalizeStringList(input.linked_approvals || current.linked_approvals),
runtime/orchestrator-service/lib/ops/backbone.js:1771:  const status = asString(input.status || current.status || input.publish_status) || 'draft';
runtime/orchestrator-service/lib/ops/backbone.js:1773:  const approvalStatus = asString(input.approval_status || current.approval_status) || 'not_requested';
runtime/orchestrator-service/lib/ops/backbone.js:1774:  const publishStatus = asString(input.publish_status || current.publish_status) || 'draft';
runtime/orchestrator-service/lib/ops/backbone.js:1827:    approval_status: approvalStatus,
runtime/orchestrator-service/lib/ops/backbone.js:1833:    destination_type: asString(input.destination_type || current.destination_type || 'publishing'),
runtime/orchestrator-service/lib/ops/backbone.js:1835:    publishing_destination: asString(input.publishing_destination || current.publishing_destination || input.destination),
runtime/orchestrator-service/lib/ops/backbone.js:1836:    publish_status: publishStatus,
runtime/orchestrator-service/lib/ops/backbone.js:1839:      publishStatus === 'published' ? 'distribution' : approvalStatus === 'approved' ? 'approved' : 'draft'
runtime/orchestrator-service/lib/ops/backbone.js:1842:    linked_approvals: normalizeStringList(input.linked_approvals || current.linked_approvals),
runtime/orchestrator-service/lib/ops/backbone.js:1843:    linked_handoffs: normalizeStringList(input.linked_handoffs || current.linked_handoffs),
runtime/orchestrator-service/lib/ops/backbone.js:1848:    queue_status: asString(input.queue_status || current.queue_status || publishStatus || approvalStatus || status) || 'draft',
runtime/orchestrator-service/lib/ops/backbone.js:1857:        approval_status: approvalStatus,
runtime/orchestrator-service/lib/ops/backbone.js:1858:        publish_status: publishStatus,
runtime/orchestrator-service/lib/ops/backbone.js:1877:      approval_status: approvalStatus,
runtime/orchestrator-service/lib/ops/backbone.js:1878:      publish_status: publishStatus,
runtime/orchestrator-service/lib/ops/backbone.js:1969:    publishing_job_id: asString(input.publishing_job_id || current.publishing_job_id),
runtime/orchestrator-service/lib/ops/backbone.js:1976:    linked_approvals: normalizeStringList(input.linked_approvals || current.linked_approvals),
runtime/orchestrator-service/lib/ops/backbone.js:1977:    linked_handoffs: normalizeStringList(input.linked_handoffs || current.linked_handoffs),
runtime/orchestrator-service/lib/ops/backbone.js:2557:  const items = readCollection(paths.approvalsPath);
runtime/orchestrator-service/lib/ops/backbone.js:2558:  const governance = getGovernancePolicy(projectName);
runtime/orchestrator-service/lib/ops/backbone.js:2606:    route_target: asString(input.route_target || current.route_target || entityLink?.route || routing.route_target || 'governance'),
runtime/orchestrator-service/lib/ops/backbone.js:2616:    policy_flags: asArray(input.policy_flags || current.policy_flags || buildPolicyFlags(input, governance)),
runtime/orchestrator-service/lib/ops/backbone.js:2618:    brand_safety_flags: asArray(input.brand_safety_flags || current.brand_safety_flags || buildBrandSafetyFlags(input, governance)),
runtime/orchestrator-service/lib/ops/backbone.js:2619:    publish_guardrails: asArray(input.publish_guardrails || current.publish_guardrails || []),
runtime/orchestrator-service/lib/ops/backbone.js:2642:  writeCollection(paths.approvalsPath, upsertById(items, approval), MAX_ITEMS.approvals);
runtime/orchestrator-service/lib/ops/backbone.js:2683:    route: 'governance',
runtime/orchestrator-service/lib/ops/backbone.js:2695:    const nextApprovalStatus =
runtime/orchestrator-service/lib/ops/backbone.js:2699:    const nextApprovalState =
runtime/orchestrator-service/lib/ops/backbone.js:2706:      linked_approvals: [...new Set([approval.id, ...normalizeStringList(record.linked_approvals)])],
runtime/orchestrator-service/lib/ops/backbone.js:2715:      nextRecord.approval_status = nextApprovalStatus;
runtime/orchestrator-service/lib/ops/backbone.js:2721:      nextRecord.approval_state = nextApprovalState;
runtime/orchestrator-service/lib/ops/backbone.js:2736:function listApprovals(projectName, options = {}) {
runtime/orchestrator-service/lib/ops/backbone.js:2738:  return listItems(readCollection(paths.approvalsPath), options);
runtime/orchestrator-service/lib/ops/backbone.js:2743:  const items = readCollection(paths.approvalsPath);
runtime/orchestrator-service/lib/ops/backbone.js:2797:  writeJsonFile(paths.approvalsPath, items);
runtime/orchestrator-service/lib/ops/backbone.js:2842:      linked_approvals: [...new Set([next.id, ...normalizeStringList(record.linked_approvals)])],
runtime/orchestrator-service/lib/ops/backbone.js:2884:  if (next.entity_type === 'publishing_job') {
runtime/orchestrator-service/lib/ops/backbone.js:2885:    updateQueueEntity(paths.project, 'publishing_job', next.entity_id, {
runtime/orchestrator-service/lib/ops/backbone.js:2899:      description: next.decision_note || 'Governance escalation requires follow-up.',
runtime/orchestrator-service/lib/ops/backbone.js:2905:      service_domain: 'governance',
runtime/orchestrator-service/lib/ops/backbone.js:2906:      route_target: 'governance',
runtime/orchestrator-service/lib/ops/backbone.js:2918:    appendGovernanceOverride(paths.project, {
runtime/orchestrator-service/lib/ops/backbone.js:2933:  const items = readCollection(paths.handoffsPath);
runtime/orchestrator-service/lib/ops/backbone.js:3018:  writeCollection(paths.handoffsPath, upsertById(normalizedItems, handoff), MAX_ITEMS.handoffs);
runtime/orchestrator-service/lib/ops/backbone.js:3040:        linked_handoffs: [...new Set([handoff.id, ...normalizeStringList(record.linked_handoffs)])],
runtime/orchestrator-service/lib/ops/backbone.js:3053:        nextRecord.publish_status =
runtime/orchestrator-service/lib/ops/backbone.js:3054:          handoff.destination_page === 'publishing'
runtime/orchestrator-service/lib/ops/backbone.js:3056:            : nextRecord.publish_status;
runtime/orchestrator-service/lib/ops/backbone.js:3058:          handoff.destination_page === 'publishing'
runtime/orchestrator-service/lib/ops/backbone.js:3064:          handoff.destination_page === 'publishing'
runtime/orchestrator-service/lib/ops/backbone.js:3077:function listHandoffs(projectName, options = {}) {
runtime/orchestrator-service/lib/ops/backbone.js:3082:  let items = readCollection(paths.handoffsPath);
runtime/orchestrator-service/lib/ops/backbone.js:3101:  const items = readCollection(paths.handoffsPath);
runtime/orchestrator-service/lib/ops/backbone.js:3122:  writeJsonFile(paths.handoffsPath, items);
runtime/orchestrator-service/lib/ops/backbone.js:3142:function syncPublishingJob(projectName, job = {}, executionResult = null) {
runtime/orchestrator-service/lib/ops/backbone.js:3150:    throw new Error('Publishing job missing job_id');
runtime/orchestrator-service/lib/ops/backbone.js:3155:    queue_type: 'publishing',
runtime/orchestrator-service/lib/ops/backbone.js:3156:    entity_type: 'publishing_job',
runtime/orchestrator-service/lib/ops/backbone.js:3158:    title: asString(normalizedJob.title) || `Publishing ${jobId}`,
runtime/orchestrator-service/lib/ops/backbone.js:3162:    assignee: roleDisplay(team, 'publisher'),
runtime/orchestrator-service/lib/ops/backbone.js:3163:    role: 'publisher',
runtime/orchestrator-service/lib/ops/backbone.js:3164:    route: 'publishing',
runtime/orchestrator-service/lib/ops/backbone.js:3171:      service_domain: 'publishing',
runtime/orchestrator-service/lib/ops/backbone.js:3172:      owner_role: 'publisher',
runtime/orchestrator-service/lib/ops/backbone.js:3177:  if (status === 'ready' || status === 'ready_for_manual_publish' || status === 'ready_for_manual_send') {
runtime/orchestrator-service/lib/ops/backbone.js:3179:      category: 'publishing',
runtime/orchestrator-service/lib/ops/backbone.js:3180:      type: 'publishing',
runtime/orchestrator-service/lib/ops/backbone.js:3182:      message: 'The publishing item is waiting for operator approval or handoff.',
runtime/orchestrator-service/lib/ops/backbone.js:3183:      body: 'The publishing item is waiting for operator approval or handoff.',
runtime/orchestrator-service/lib/ops/backbone.js:3186:        entity_type: 'publishing_job',
runtime/orchestrator-service/lib/ops/backbone.js:3188:        route: 'publishing'
runtime/orchestrator-service/lib/ops/backbone.js:3190:      entity_type: 'publishing_job',
runtime/orchestrator-service/lib/ops/backbone.js:3195:  if (status === 'published') {
runtime/orchestrator-service/lib/ops/backbone.js:3197:      category: 'publishing',
runtime/orchestrator-service/lib/ops/backbone.js:3198:      type: 'publishing',
runtime/orchestrator-service/lib/ops/backbone.js:3199:      title: `${queueItem.title} published`,
runtime/orchestrator-service/lib/ops/backbone.js:3200:      message: 'Publishing execution completed and was recorded durably.',
runtime/orchestrator-service/lib/ops/backbone.js:3201:      body: 'Publishing execution completed and was recorded durably.',
runtime/orchestrator-service/lib/ops/backbone.js:3204:        entity_type: 'publishing_job',
runtime/orchestrator-service/lib/ops/backbone.js:3206:        route: 'publishing'
runtime/orchestrator-service/lib/ops/backbone.js:3208:      entity_type: 'publishing_job',
runtime/orchestrator-service/lib/ops/backbone.js:3215:      category: 'publishing',
runtime/orchestrator-service/lib/ops/backbone.js:3216:      type: 'publishing',
runtime/orchestrator-service/lib/ops/backbone.js:3218:      message: 'Publishing execution needs follow-up.',
runtime/orchestrator-service/lib/ops/backbone.js:3219:      body: 'Publishing execution needs follow-up.',
runtime/orchestrator-service/lib/ops/backbone.js:3222:        entity_type: 'publishing_job',
runtime/orchestrator-service/lib/ops/backbone.js:3224:        route: 'publishing'
runtime/orchestrator-service/lib/ops/backbone.js:3226:      entity_type: 'publishing_job',
runtime/orchestrator-service/lib/ops/backbone.js:3232:    category: 'publish',
runtime/orchestrator-service/lib/ops/backbone.js:3233:    type: 'publishing_job_synced',
runtime/orchestrator-service/lib/ops/backbone.js:3234:    entity_type: 'publishing_job',
runtime/orchestrator-service/lib/ops/backbone.js:3237:    summary: `Publishing job synced into the durable queue with status ${status}.`,
runtime/orchestrator-service/lib/ops/backbone.js:3248:function summarizeCurrentHandoffs(items = []) {
runtime/orchestrator-service/lib/ops/backbone.js:3290:    if (!['completed', 'published', 'closed', 'archived', 'cancelled'].includes(asString(item.status))) {
runtime/orchestrator-service/lib/ops/backbone.js:3321:  if (['completed', 'published', 'read', 'archived', 'cancelled', 'closed'].includes(normalized)) return 4;
runtime/orchestrator-service/lib/ops/backbone.js:3370:  if (normalizedType === 'approval') return 'governance';
runtime/orchestrator-service/lib/ops/backbone.js:3374:  if (normalizedType === 'publishing_job') return 'publishing';
runtime/orchestrator-service/lib/ops/backbone.js:3523:    publishing: normalizedQueue.filter((item) => item.queue_type === 'publishing'),
runtime/orchestrator-service/lib/ops/backbone.js:3544:    active_count: items.filter((item) => !['completed', 'published', 'read', 'archived', 'closed', 'cancelled'].includes(item.status)).length,
runtime/orchestrator-service/lib/ops/backbone.js:3548:      active: asArray(groupedItems).filter((item) => !['completed', 'published', 'closed', 'cancelled'].includes(asString(item.status))).length
runtime/orchestrator-service/lib/ops/backbone.js:3560:    publishing_queue: queueGroups.publishing,
runtime/orchestrator-service/lib/ops/backbone.js:3595:  const publishingJobs = asArray(queueItems)
runtime/orchestrator-service/lib/ops/backbone.js:3596:    .filter((item) => asString(item.entity_type) === 'publishing_job')
runtime/orchestrator-service/lib/ops/backbone.js:3599:      kind: 'publishing',
runtime/orchestrator-service/lib/ops/backbone.js:3600:      entity_type: 'publishing_job',
runtime/orchestrator-service/lib/ops/backbone.js:3602:      title: asString(item.title) || 'Publishing job',
runtime/orchestrator-service/lib/ops/backbone.js:3604:      route: inferRouteTarget('publishing_job', item),
runtime/orchestrator-service/lib/ops/backbone.js:3612:  return [...workflowJobs, ...mediaJobItems, ...publishingJobs]
runtime/orchestrator-service/lib/ops/backbone.js:3623:  const completedJobs = items.filter((item) => ['completed', 'published'].includes(asString(item.status)));
runtime/orchestrator-service/lib/ops/backbone.js:3627:    .filter((item) => ['workflow', 'publish', 'sync', 'system'].includes(asString(item.category)) || ['workflow_run', 'publishing_job', 'media_job'].includes(asString(item.entity_type)))
runtime/orchestrator-service/lib/ops/backbone.js:3676:  approvals = [],
runtime/orchestrator-service/lib/ops/backbone.js:3679:  governanceSummary = {},
runtime/orchestrator-service/lib/ops/backbone.js:3701:  const approvalPendingAlerts = asArray(approvals)
runtime/orchestrator-service/lib/ops/backbone.js:3714:  const publishAlerts = asArray(queueItems)
runtime/orchestrator-service/lib/ops/backbone.js:3715:    .filter((item) => asString(item.entity_type) === 'publishing_job' && ['ready', 'published', 'failed'].includes(asString(item.status)))
runtime/orchestrator-service/lib/ops/backbone.js:3717:      id: `publishing-${item.entity_id}-${item.status}`,
runtime/orchestrator-service/lib/ops/backbone.js:3718:      title: asString(item.title) || 'Publishing update',
runtime/orchestrator-service/lib/ops/backbone.js:3721:          ? 'Publishing execution needs follow-up.'
runtime/orchestrator-service/lib/ops/backbone.js:3722:          : asString(item.status) === 'published'
runtime/orchestrator-service/lib/ops/backbone.js:3723:            ? 'Publishing execution completed successfully.'
runtime/orchestrator-service/lib/ops/backbone.js:3724:            : 'Publishing item is waiting for approval or release.',
runtime/orchestrator-service/lib/ops/backbone.js:3728:          : asString(item.status) === 'published'
runtime/orchestrator-service/lib/ops/backbone.js:3731:      source: 'publish',
runtime/orchestrator-service/lib/ops/backbone.js:3732:      entity_type: 'publishing_job',
runtime/orchestrator-service/lib/ops/backbone.js:3757:    ...asArray(governanceSummary?.sections?.claim_review)
runtime/orchestrator-service/lib/ops/backbone.js:3767:    ...asArray(governanceSummary?.sections?.policy_violations)
runtime/orchestrator-service/lib/ops/backbone.js:3800:    ...publishAlerts,
runtime/orchestrator-service/lib/ops/backbone.js:3817:    publish_alerts: publishAlerts,
runtime/orchestrator-service/lib/ops/backbone.js:3828:  const governance = asObject(readJsonFile(paths.governancePath, {}));
runtime/orchestrator-service/lib/ops/backbone.js:3839:  const approvals = readCollection(paths.approvalsPath);
runtime/orchestrator-service/lib/ops/backbone.js:3842:  const handoffs = readCollection(paths.handoffsPath);
runtime/orchestrator-service/lib/ops/backbone.js:3844:  const governanceSummary = buildGovernanceSummary(paths.project, {
runtime/orchestrator-service/lib/ops/backbone.js:3862:    ...approvals,
runtime/orchestrator-service/lib/ops/backbone.js:3884:    approvals,
runtime/orchestrator-service/lib/ops/backbone.js:3887:    governanceSummary,
runtime/orchestrator-service/lib/ops/backbone.js:3901:    governance,
runtime/orchestrator-service/lib/ops/backbone.js:3906:    team_service_model: {
runtime/orchestrator-service/lib/ops/backbone.js:3909:      route_permissions: asArray(team.route_permissions),
runtime/orchestrator-service/lib/ops/backbone.js:3930:      route_permissions: asArray(team.route_permissions),
runtime/orchestrator-service/lib/ops/backbone.js:3937:      handoffs_by_role: asArray(handoffs)
runtime/orchestrator-service/lib/ops/backbone.js:3973:    workflow_runs: {
runtime/orchestrator-service/lib/ops/backbone.js:3977:    ai_commands: {
runtime/orchestrator-service/lib/ops/backbone.js:4001:    approvals: {
runtime/orchestrator-service/lib/ops/backbone.js:4002:      total: approvals.length,
runtime/orchestrator-service/lib/ops/backbone.js:4003:      pending_count: approvals.filter((item) => asString(item.status) === 'pending').length,
runtime/orchestrator-service/lib/ops/backbone.js:4004:      by_reviewer_role: summarizeOwnershipVisibility(team, approvals),
runtime/orchestrator-service/lib/ops/backbone.js:4005:      items: approvals.slice(0, approvalLimit)
runtime/orchestrator-service/lib/ops/backbone.js:4009:      active_count: queueItems.filter((item) => !['published', 'completed', 'closed'].includes(asString(item.status))).length,
runtime/orchestrator-service/lib/ops/backbone.js:4017:    handoffs: {
runtime/orchestrator-service/lib/ops/backbone.js:4018:      total: handoffs.length,
runtime/orchestrator-service/lib/ops/backbone.js:4019:      available_count: handoffs.filter((item) => asString(item.status) === 'available').length,
runtime/orchestrator-service/lib/ops/backbone.js:4020:      current: summarizeCurrentHandoffs(handoffs),
runtime/orchestrator-service/lib/ops/backbone.js:4021:      by_role: asArray(handoffs)
runtime/orchestrator-service/lib/ops/backbone.js:4033:      items: handoffs.slice(0, handoffLimit)
runtime/orchestrator-service/lib/ops/backbone.js:4048:  buildGovernanceSummary,
runtime/orchestrator-service/lib/ops/backbone.js:4051:  getGovernancePolicy,
runtime/orchestrator-service/lib/ops/backbone.js:4052:  updateGovernancePolicy,
runtime/orchestrator-service/lib/ops/backbone.js:4078:  listApprovals,
runtime/orchestrator-service/lib/ops/backbone.js:4085:  listHandoffs,
runtime/orchestrator-service/lib/ops/backbone.js:4088:  syncPublishingJob
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:144:  publisher: 'operations',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:164:  // Publishing/content output language: explicit override > project/market/setup language > fallback
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:177:// Backward-compatible alias — now resolves publishing/output language
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:227:    `Output/publishing language (language for publishable content, copy, hooks, captions, scripts): ${outputLanguage}`,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:233:    'If publishable content uses a different output language, do not make the entire answer that output language.',

## Ops backbone files
runtime/orchestrator-service/lib/ai/provider-config.js
runtime/orchestrator-service/lib/ai/provider-registry.js
runtime/orchestrator-service/lib/ai/providers/openai.js
runtime/orchestrator-service/lib/ops/ai-orchestrator.js
runtime/orchestrator-service/lib/ops/backbone.js
runtime/orchestrator-service/node_modules/busboy/bench/bench-urlencoded-fields-100pairs-small.js
runtime/orchestrator-service/node_modules/busboy/bench/bench-urlencoded-fields-900pairs-small-alt.js
