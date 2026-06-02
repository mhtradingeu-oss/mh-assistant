# PHASE 3W.2 — Governance API / Backend Evidence

## API governance/approval functions
1620:export async function createProjectApproval(projectName, payload = {}) {
1626:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals`,
1629:    "Failed to create approval request"
1640:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals${suffix}`,
1641:    "Failed to load approvals"
1645:export async function decideProjectApproval(projectName, approvalId, payload = {}) {
1650:  if (!approvalId) {
1651:    throw new Error("Missing approval id");
1655:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals/${encodeURIComponent(approvalId)}/decision`,
1658:    "Failed to update approval"
1676:    `/media-manager/project/${encodeURIComponent(projectName)}/governance${suffix}`,
1677:    "Failed to load governance summary"
1687:    `/media-manager/project/${encodeURIComponent(projectName)}/governance/policy`,
1688:    "Failed to load governance policy"
1698:    `/media-manager/project/${encodeURIComponent(projectName)}/governance/policy`,
1701:    "Failed to update governance policy"

## Server approval/governance routes
406:  const decision = limiter.check(identity);
408:  if (decision.allowed) {
416:    retryAfterMs: decision.retryAfterMs
419:  res.set('Retry-After', String(Math.ceil(decision.retryAfterMs / 1000)));
1105:    return 'policy_or_config_mismatch';
1272:    policy: readPolicy
1304:      policy: {
1622:    return 'policy_or_config_mismatch';
1671:      policy_or_config_mismatch: 0,
1740:      stats.fallback_causes.policy_or_config_mismatch;
6018:    return 'approval_required';
6072:  const sharedPolicy = readFileSafe(path.join(PROMPTS_DIR, 'shared-policy.md'));
6087:    approval_required: mode === 'approval_required',
6094:        mode === 'approval_required'
6095:          ? 'Prepare execution summary and request approval.'
6101:      shared_policy_loaded: sharedPolicy.length > 0,
6715:      required_assets: ['logo', 'product_photos', 'product_catalog', 'price_list', 'shipping_policy', 'legal_docs'],
6757:      workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'ads-manager', 'governance'],
7302:    approval_note: normalizeSetupTextValue(asset.approval_note),
8266:        what_to_upload: 'Terms, privacy policy, disclaimers, compliance notes, claim restrictions, and regulated copy rules.',
8426:    record.approval_status ||
10593:        asset.approval_note = note || asset.approval_note || 'Approved from Control Center Library.';
11501:      error: error.message || 'Failed to list approvals'
11508:    const approval = createApproval(req.params.project, req.body || {});
11510:      approval,
11515:      error: error.message || 'Failed to create approval'
11522:    const approval = decideApproval(req.params.project, req.params.approvalId, {
11523:      decision: req.body?.decision,
11531:      approval,
11536:      error: error.message || 'Failed to update approval'
11541:app.get('/media-manager/project/:project/approvals', handleListApprovals);
11542:app.get('/public/media-manager/project/:project/approvals', handleListApprovals);
11543:app.post('/media-manager/project/:project/approvals', handleCreateApproval);
11544:app.post('/public/media-manager/project/:project/approvals', handleCreateApproval);
11545:app.post('/media-manager/project/:project/approvals/:approvalId/decision', handleApprovalDecision);
11546:app.post('/public/media-manager/project/:project/approvals/:approvalId/decision', handleApprovalDecision);
11557:      error: error.message || 'Failed to load governance summary'
11564:    const policy = updateGovernancePolicy(req.params.project, req.body || {}, req.body?.actor || 'operator');
11567:      policy
11571:      error: error.message || 'Failed to update governance policy'
11580:      policy: getGovernancePolicy(req.params.project)
11584:      error: error.message || 'Failed to load governance policy'
11589:app.get('/media-manager/project/:project/governance', handleGetGovernance);
11590:app.get('/public/media-manager/project/:project/governance', handleGetGovernance);
11591:app.get('/media-manager/project/:project/governance/policy', handleGetGovernancePolicy);
11592:app.get('/public/media-manager/project/:project/governance/policy', handleGetGovernancePolicy);
11593:app.post('/media-manager/project/:project/governance/policy', handleUpdateGovernancePolicy);
11594:app.post('/public/media-manager/project/:project/governance/policy', handleUpdateGovernancePolicy);
14050:  const governance = getGovernancePolicy(projectName);
14051:  // getGovernancePolicy always returns a normalized policy with policy_rules merged
14052:  // from DEFAULT_POLICY_RULES, so policy_rules is always a fully-populated object.
14054:  const policyRules = governance && typeof governance === 'object' && governance.policy_rules && typeof governance.policy_rules === 'object'
14055:    ? governance.policy_rules
14062:  const approvalSensitiveAction = ['ready', 'publish'].includes(actionKey)
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
14121:          rule: 'approval_before_publish',
14123:          approval_status: approvalStatus || 'missing'
16511:          'Generate assets from strategy, then run review -> approval -> media -> publish/send.',

## Publishing routes with governance relevance
