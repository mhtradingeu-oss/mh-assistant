# 03 — Current Backend Asset Route Search

Generated: Sat Jun  6 13:41:28 CEST 2026

1:// Deterministic source registry extraction for canonical/legacy compatibility
189:    const classification = classifyPublicAliasAccess(req.method, req.path || req.originalUrl || "", {
193:    const headers = buildPublicAliasHeaders(classification);
199:    if (classification && classification.publicAlias) {
203:    if (classification && classification.publicAlias && classification.allowed === false) {
204:      if (classification.code === 'route_permission_denied') {
211:        message: "This public compatibility route is retired. Use the canonical API route.",
212:        canonicalRequired: true,
213:        reason: classification.reason
217:    res.setHeader("X-MH-Public-Alias-Warning", "classification_failed");
654:  const canonicalType = getCanonicalAssetType(normalizedType);
656:  if (canonicalType) {
657:    const { catalog_item, target_dir } = getTargetFolderForAssetType(project, canonicalType);
661:      assetType: canonicalType,
1187:    canonical: 'generated'
1191:    canonical: 'publishing'
1195:    canonical: ''
1199:    canonical: 'channels'
1203:    canonical: 'campaign-execution'
1207:    canonical: 'campaign-finalization'
1211:    canonical: 'execution'
1215:    canonical: 'german-launch'
1219:    canonical: 'optimization'
1223:    canonical: 'publishing/results'
1232:  if (telemetryEntry.canonical_hit) {
1237:    return 'canonical_miss';
1289:function buildCandidatePaths(canonicalBase, legacyBase, relativePath = '') {
1293:    canonicalPath: safeRelativePath ? path.join(canonicalBase, safeRelativePath) : canonicalBase,
1313:  const candidatePaths = buildCandidatePaths(options.canonicalBase, options.legacyBase, relativePath);
1315:  const canonicalHit =
1317:      ? hasMatchingEntries(candidatePaths.canonicalPath, matcher)
1318:      : fs.existsSync(candidatePaths.canonicalPath);
1324:  const canonicalFirstEnabled = !!readPolicy.effectiveCanonicalFirst;
1330:  if (canonicalFirstEnabled) {
1331:    if (canonicalHit) {
1332:      selectedPath = candidatePaths.canonicalPath;
1333:      selectedRoot = 'canonical';
1341:      selectedPath = candidatePaths.canonicalPath;
1342:      selectedRoot = 'canonical';
1347:  } else if (canonicalHit) {
1348:    selectedPath = candidatePaths.canonicalPath;
1349:    selectedRoot = 'canonical';
1361:    canonical_candidate: candidatePaths.canonicalPath,
1363:    canonical_hit: canonicalHit,
1368:      execution_canonical_read: !!readPolicy.executionCanonicalReadMaster,
1370:      domain_canonical_first: !!readPolicy.domainCanonicalFirst,
1371:      effective_canonical_first: !!readPolicy.effectiveCanonicalFirst,
1388:    canonicalHit,
1395:    canonicalPath: candidatePaths.canonicalPath,
1397:    canonicalHit,
1420:  const canonicalBaseOverride = options.canonicalBaseOverride || null;
1423:  if (!domainConfig && !canonicalBaseOverride && !legacyBaseOverride) {
1427:      canonicalPath: passthroughPath,
1429:      canonicalHit: fs.existsSync(passthroughPath),
1436:        executionCanonicalReadMaster: !!resolution.featureFlags.execution_canonical_read,
1443:  const canonicalBase = canonicalBaseOverride || (domainConfig.canonical
1444:    ? path.join(resolution.executionRoot, domainConfig.canonical)
1462:    canonicalBase,
1477:    canonicalWriteRoot: resolution.executionRoot,
1479:    canonicalReadRoot: resolution.executionRoot,
1481:    canonicalEmailDir: path.join(resolution.executionRoot, 'email'),
1483:    canonicalLiveContentDir: path.join(EXECUTION_DIR, 'projects', safeProject, 'content', 'email'),
1485:    canonicalLiveMediaQueueDir: path.join(EXECUTION_DIR, 'projects', safeProject, 'media', 'queue'),
1495:      canonicalBase: paths.canonicalReadRoot,
1503:      canonicalBase: paths.canonicalEmailDir,
1511:      canonicalBase: paths.canonicalEmailDir,
1519:      canonicalBase: paths.canonicalEmailDir,
1527:      canonicalBase: paths.canonicalLiveContentDir,
1535:      canonicalBase: paths.canonicalLiveMediaQueueDir,
1576:    canonicalBaseOverride: contract.canonicalBase,
1597:    contract.canonicalBase,
1603:  ensureDir(path.dirname(candidatePaths.canonicalPath));
1605:  fs.writeFileSync(candidatePaths.canonicalPath, payload, 'utf8');
1749:  if (readEntry.canonical_hit) {
1761:      const canonicalSuccess = dualWriteEntry.writes.some(
1762:        (item) => item.root === 'canonical' && item.status === 'success'
1764:      const canonicalFailed = dualWriteEntry.writes.some(
1765:        (item) => item.root === 'canonical' && item.status === 'failed'
1771:      if (canonicalFailed && legacySuccess) {
1772:        return 'missing_canonical_write';
1775:      if (canonicalSuccess) {
1791:    canonical_hit_count: 0,
1798:      missing_canonical_write: 0,
1831:    if (entry.selected_root === 'canonical') {
1832:      stats.canonical_hit_count += 1;
1848:  let canonicalHits = 0;
1861:    canonicalHits += stats.canonical_hit_count;
1867:      stats.fallback_causes.missing_canonical_write +
1871:  const canonicalHitRate = totalReads > 0 ? canonicalHits / totalReads : 0;
1879:    canonicalHitRate >= 0.85 &&
1887:    canonicalHitRate >= 0.6 &&
1903:      canonical_hit_count: canonicalHits,
1905:      canonical_hit_rate: Number(canonicalHitRate.toFixed(4)),
1931:    canonical_hit_count: 0,
1939:    aggregate.canonical_hit_count += summary.totals.canonical_hit_count;
1946:  aggregate.canonical_hit_rate = totalReads > 0
1947:    ? Number((aggregate.canonical_hit_count / totalReads).toFixed(4))
2018:  const baseDir = contract.canonicalBase;
2604:  const baseDir = emailPaths.canonicalEmailDir;
4913:    path.join(paths.legacyOutputsDir, `${renderId}_${job.asset_type}.png`);
4919:    asset_type: job.asset_type,
5011:    asset_type: assetType,
5087:    asset_type: assetType,
5165:    asset_type: assetType,
5224:    asset_type: assetType,
5356:    asset_type: assetType,
5612:        return !normalizedType || String(asset.asset_type || '').trim().toLowerCase() === normalizedType;
6346:      route: '/media-manager/project/:project/setup',
6350:      canonicalPath: entry.canonical_path,
6356:      route: '/media-manager/project/:project/setup',
6365:  const canonicalPath = String(options.canonicalPath || '').trim();
6370:  const canonicalExists = fs.existsSync(canonicalPath);
6371:  const canonicalValue = canonicalExists ? normalize(readJsonFile(canonicalPath, fallback)) : null;
6382:    if (canonicalExists && stableJsonHash(canonicalValue) !== stableJsonHash(legacyValue)) {
6385:        reason: 'canonical_legacy_value_mismatch',
6386:        canonical_path: canonicalPath,
6388:        canonical_hash: stableJsonHash(canonicalValue),
6394:  if (canonicalExists) {
6396:      value: canonicalValue,
6397:      source: 'canonical',
6398:      path: canonicalPath,
6404:    ensureDir(path.dirname(canonicalPath));
6405:    writeJsonFile(canonicalPath, firstLegacy.value);
6408:      reason: 'canonical_missing_migrated_from_legacy',
6409:      canonical_path: canonicalPath,
6421:  ensureDir(path.dirname(canonicalPath));
6422:  writeJsonFile(canonicalPath, fallback);
6426:    path: canonicalPath,
6603:    canonicalPath: paths.brandProfilePath,
6610:    canonicalPath: paths.assetsRegistryPath,
6618:    canonicalPath: paths.sourceOfTruthRegistryPath,
7162:      canonical_path: paths.brandProfilePath,
7167:      canonical_path: paths.assetsRegistryPath,
7172:      canonical_path: paths.sourceOfTruthRegistryPath,
7178:    const canonicalExists = fs.existsSync(item.canonical_path);
7180:    const canonicalRaw = canonicalExists ? readJsonFile(item.canonical_path, null) : null;
7182:    let canonicalValue, legacyValue;
7185:      canonicalValue = extractSourceRegistryEntries(canonicalRaw);
7188:      canonicalValue = canonicalRaw;
7191:    const parity = canonicalExists && legacyExists
7192:      ? stableJsonHash(canonicalValue) === stableJsonHash(legacyValue)
7193:      : canonicalExists;
7195:    if (canonicalExists && legacyExists && !parity) {
7198:        reason: 'canonical_legacy_parity_check_mismatch',
7199:        canonical_path: item.canonical_path,
7201:        canonical_hash: stableJsonHash(canonicalValue),
7208:      canonical_path: item.canonical_path,
7210:      canonical_exists: canonicalExists,
7213:      fallback_in_use: !canonicalExists && legacyExists
7227:      ? 'Reduce fallback dependencies by keeping canonical files in sync before disabling legacy reads.'
7231:  const reportPath = path.join(paths.reportsDir, 'canonical-migration-report.json');
7286:  const requiredAssetCount = Array.isArray(missingAssets.required_asset_types) ? missingAssets.required_asset_types.length : 0;
7375:    canonical_parity: parityReport,
7398:  const canonicalType = getCanonicalAssetType(asset.type || asset.asset_type) || normalizeSetupTextValue(asset.type || asset.asset_type).toLowerCase();
7416:    type: canonicalType,
7417:    asset_type: canonicalType,
8295:    .map(item => item.asset_type);
8297:    .map(item => getCanonicalAssetType(item.asset_type) || String(item.asset_type || '').trim().toLowerCase())
8301:    .map(item => item.asset_type);
8304:    .map(item => item.asset_type);
8309:    required_asset_types: required,
8310:    registered_asset_types: [...new Set(assetTypes)].sort(),
8320:      asset_type: 'logo',
8336:      asset_type: 'brand_guideline',
8352:      asset_type: 'product_csv',
8368:      asset_type: 'pricing_doc',
8384:      asset_type: 'legal_doc',
8400:      asset_type: 'product_photos',
8416:      asset_type: 'product_videos',
8432:      asset_type: 'social_assets',
8448:      asset_type: 'campaign_assets',
8464:      asset_type: 'packaging_images',
8480:      asset_type: 'testimonials_reviews',
8496:      asset_type: 'certificates',
8512:      asset_type: 'partner_docs',
8535:    const values = [item.asset_type, ...(item.aliases || [])].map(value => String(value || '').trim().toLowerCase());
8537:      return item.asset_type;
8545:  const canonicalType = getCanonicalAssetType(assetType);
8546:  return getAssetTypeCatalog().find(item => item.asset_type === canonicalType) || null;
8570:    const folderInfo = getTargetFolderForAssetType(projectName, record.asset_type);
8826:      asset_type: 'product_csv',
8835:      asset_type: 'product_photos',
8844:      asset_type: 'product_videos',
8861:      canonical_files: projectProductDataFiles,
8932:    const canonicalType = getCanonicalAssetType(asset.type || asset.asset_type) || String(asset.type || asset.asset_type || '').trim().toLowerCase();
8934:    if (!canonicalType || !filePath) {
8937:    const key = `${canonicalType}::${filePath}`;
8942:    const canonicalType = getCanonicalAssetType(asset.type || asset.asset_type) || String(asset.type || asset.asset_type || '').trim().toLowerCase();
8944:    return !(managedTypes.has(canonicalType) && managedByRefresh);
8949:    const canonicalType = getCanonicalAssetType(scanned.asset_type) || String(scanned.asset_type || '').trim().toLowerCase();
8951:    if (!managedTypes.has(canonicalType) || !filePath) {
8955:    const key = `${canonicalType}::${filePath}`;
8961:      type: canonicalType,
9009:    const matchingAssets = assets.filter(asset => getCanonicalAssetType(asset.asset_type) === item.asset_type);
9026:    if (item.asset_type === 'product_csv') {
9034:    } else if (item.asset_type === 'product_photos') {
9055:      asset_type: item.asset_type,
9056:      internal_key: item.asset_type,
9072:        item.asset_type === 'product_csv'
9074:          : item.asset_type === 'product_photos'
9085:        item.asset_type === 'product_photos' && status === 'Needs Review'
9090:            ? `Review ${item.label} classification, file availability, or folder placement.`
9140:      asset_type: item.asset_type,
9201:  const canonicalType = getCanonicalAssetType(assetType);
9202:  const item = catalog.find(x => x.asset_type === canonicalType);
9256:    asset_type: assetType,
9278:      const folderInfo = getTargetFolderForAssetType(projectName, asset.asset_type);
9288:      asset_type: asset.asset_type,
9377:app.get('/media-manager/project/:project/storage/parity-readiness', (req, res) => {
9388:app.get('/public/media-manager/project/:project/storage/parity-readiness', (req, res) => {
10606:app.post('/media-manager/project/:project/rename', express.json({ limit: '1mb' }), handleRenameMediaManagerProject);
10608:app.post('/public/media-manager/project/:project/rename', express.json({ limit: '1mb' }), handleRenameMediaManagerProject);
10610:app.post('/media-manager/project/:project/apply-template', express.json({ limit: '1mb' }), handleApplyBusinessTemplateToProject);
10612:app.post('/public/media-manager/project/:project/apply-template', express.json({ limit: '1mb' }), handleApplyBusinessTemplateToProject);
10614:app.post('/media-manager/projects', express.json({ limit: '1mb' }), handleCreateMediaManagerProject);
10616:app.post('/public/media-manager/projects', express.json({ limit: '1mb' }), handleCreateMediaManagerProject);
10618:app.get('/media-manager/projects', (req, res) => {
10622:app.get('/public/media-manager/projects', (req, res) => {
10638:app.get('/media-manager/project/:project/startup', (req, res) => {
10648:app.get('/public/media-manager/project/:project/startup', (req, res) => {
10658:app.get('/media-manager/project/:project', (req, res) => {
10668:app.get('/public/media-manager/project/:project', (req, res) => {
10805:app.post('/media-manager/project/:project/assets/:assetId/status', express.json({ limit: '1mb' }), (req, res) => {
10859:app.post('/media-manager/project/:project/assets/:assetId/rename', express.json({ limit: '1mb' }), (req, res) => {
10889:app.post('/media-manager/project/:project/assets/:assetId/source-of-truth', express.json({ limit: '1mb' }), (req, res) => {
10914:app.post('/media-manager/project/:project/assets/:assetId/archive', express.json({ limit: '1mb' }), (req, res) => {
10942:app.post('/media-manager/project/:project/assets/:assetId/delete', express.json({ limit: '1mb' }), (req, res) => {
10973:app.delete('/media-manager/project/:project/assets/:assetId', express.json({ limit: '1mb' }), (req, res) => {
11004:app.post('/media-manager/project/:project/library/refresh', (req, res) => {
11014:app.post('/media-manager/project/:project/setup', (req, res) => {
11053:app.post('/public/media-manager/project/:project/setup', (req, res) => {
11102:app.get('/media-manager/project/:project/operations', handleGetProjectOperations);
11103:app.get('/public/media-manager/project/:project/operations', handleGetProjectOperations);
11161:app.get('/media-manager/project/:project/task-center', handleGetTaskCenter);
11162:app.get('/public/media-manager/project/:project/task-center', handleGetTaskCenter);
11163:app.get('/media-manager/project/:project/queue-center', handleGetQueueCenter);
11164:app.get('/public/media-manager/project/:project/queue-center', handleGetQueueCenter);
11165:app.get('/media-manager/project/:project/job-monitor', handleGetJobMonitor);
11166:app.get('/public/media-manager/project/:project/job-monitor', handleGetJobMonitor);
11167:app.get('/media-manager/project/:project/notification-center', handleGetNotificationCenter);
11168:app.get('/public/media-manager/project/:project/notification-center', handleGetNotificationCenter);
11177:app.get('/media-manager/project/:project/operations/schema', handleGetOperationsSchema);
11178:app.get('/public/media-manager/project/:project/operations/schema', handleGetOperationsSchema);
11234:app.get('/media-manager/project/:project/team', handleGetProjectTeam);
11235:app.get('/public/media-manager/project/:project/team', handleGetProjectTeam);
11236:app.post('/media-manager/project/:project/team', handleUpdateProjectTeam);
11237:app.post('/public/media-manager/project/:project/team', handleUpdateProjectTeam);
11282:app.get('/media-manager/project/:project/campaigns', handleListCampaigns);
11283:app.get('/public/media-manager/project/:project/campaigns', handleListCampaigns);
11284:app.post('/media-manager/project/:project/campaigns', handleUpsertCampaign);
11285:app.post('/public/media-manager/project/:project/campaigns', handleUpsertCampaign);
11286:app.patch('/media-manager/project/:project/campaigns/:campaignId', (req, res) => {
11293:app.patch('/public/media-manager/project/:project/campaigns/:campaignId', (req, res) => {
11300:app.get('/media-manager/project/:project/campaigns/:campaignId', handleGetCampaign);
11301:app.get('/public/media-manager/project/:project/campaigns/:campaignId', handleGetCampaign);
11347:app.get('/media-manager/project/:project/content-items', handleListContentItems);
11348:app.get('/public/media-manager/project/:project/content-items', handleListContentItems);
11349:app.post('/media-manager/project/:project/content-items', handleUpsertContentItem);
11350:app.post('/public/media-manager/project/:project/content-items', handleUpsertContentItem);
11351:app.patch('/media-manager/project/:project/content-items/:contentItemId', (req, res) => {
11358:app.patch('/public/media-manager/project/:project/content-items/:contentItemId', (req, res) => {
11365:app.get('/media-manager/project/:project/content-items/:contentItemId', handleGetContentItem);
11366:app.get('/public/media-manager/project/:project/content-items/:contentItemId', handleGetContentItem);
11413:app.get('/media-manager/project/:project/media-jobs', handleListMediaJobs);
11414:app.get('/public/media-manager/project/:project/media-jobs', handleListMediaJobs);
11415:app.post('/media-manager/project/:project/media-jobs', handleUpsertMediaJob);
11416:app.post('/public/media-manager/project/:project/media-jobs', handleUpsertMediaJob);
11417:app.patch('/media-manager/project/:project/media-jobs/:mediaJobId', (req, res) => {
11424:app.patch('/public/media-manager/project/:project/media-jobs/:mediaJobId', (req, res) => {
11431:app.get('/media-manager/project/:project/media-jobs/:mediaJobId', handleGetMediaJob);
11432:app.get('/public/media-manager/project/:project/media-jobs/:mediaJobId', handleGetMediaJob);
11449:app.get('/media-manager/project/:project/workflows/runs', handleListWorkflowRuns);
11450:app.get('/public/media-manager/project/:project/workflows/runs', handleListWorkflowRuns);
11466:app.get('/media-manager/project/:project/workflows/runs/:runId', handleGetWorkflowRun);
11467:app.get('/public/media-manager/project/:project/workflows/runs/:runId', handleGetWorkflowRun);
11536:app.post('/media-manager/project/:project/workflows/:workflowId/run', handleRunWorkflow);
11537:app.post('/public/media-manager/project/:project/workflows/:workflowId/run', handleRunWorkflow);
11876:app.get('/media-manager/project/:project/ai/commands', handleListAiCommands);
11877:app.get('/public/media-manager/project/:project/ai/commands', handleListAiCommands);
11878:app.get('/media-manager/project/:project/ai/commands/:commandId', handleGetAiCommand);
11879:app.get('/public/media-manager/project/:project/ai/commands/:commandId', handleGetAiCommand);
11880:app.post('/media-manager/project/:project/ai/command', handleExecuteAiCommand);
11881:app.post('/public/media-manager/project/:project/ai/command', handleExecuteAiCommand);
11882:app.post('/media-manager/project/:project/ai/chat', handleExecuteAiChat);
11883:app.post('/public/media-manager/project/:project/ai/chat', handleExecuteAiChat);
11884:app.post('/media-manager/project/:project/ai/guidance', handleExecuteAiGuidance);
11885:app.post('/public/media-manager/project/:project/ai/guidance', handleExecuteAiGuidance);
11886:app.post('/media-manager/project/:project/ai/workflows/:workflowId/run', handleExecuteAiWorkflow);
11887:app.post('/public/media-manager/project/:project/ai/workflows/:workflowId/run', handleExecuteAiWorkflow);
11888:app.get('/media-manager/project/:project/ai/artifacts', handleListAiArtifacts);
11889:app.get('/public/media-manager/project/:project/ai/artifacts', handleListAiArtifacts);
11890:app.get('/media-manager/project/:project/ai/recommendations', handleListAiRecommendations);
11891:app.get('/public/media-manager/project/:project/ai/recommendations', handleListAiRecommendations);
11892:app.get('/media-manager/project/:project/ai/memory', handleListAiMemory);
11893:app.get('/public/media-manager/project/:project/ai/memory', handleListAiMemory);
11924:app.get('/media-manager/project/:project/tasks', handleListTasks);
11925:app.get('/public/media-manager/project/:project/tasks', handleListTasks);
11926:app.post('/media-manager/project/:project/tasks', handleCreateTask);
11927:app.post('/public/media-manager/project/:project/tasks', handleCreateTask);
11928:app.get('/media-manager/project/:project/tasks/:taskId', (req, res) => {
11941:app.get('/public/media-manager/project/:project/tasks/:taskId', (req, res) => {
12015:app.get('/media-manager/project/:project/approvals', handleListApprovals);
12016:app.get('/public/media-manager/project/:project/approvals', handleListApprovals);
12017:app.post('/media-manager/project/:project/approvals', handleCreateApproval);
12018:app.post('/public/media-manager/project/:project/approvals', handleCreateApproval);
12019:app.post('/media-manager/project/:project/approvals/:approvalId/decision', handleApprovalDecision);
12020:app.post('/public/media-manager/project/:project/approvals/:approvalId/decision', handleApprovalDecision);
12073:app.get('/media-manager/project/:project/governance', handleGetGovernance);
12074:app.get('/public/media-manager/project/:project/governance', handleGetGovernance);
12075:app.get('/media-manager/project/:project/governance/policy', handleGetGovernancePolicy);
12076:app.get('/public/media-manager/project/:project/governance/policy', handleGetGovernancePolicy);
12077:app.post('/media-manager/project/:project/governance/policy', handleUpdateGovernancePolicy);
12078:app.post('/public/media-manager/project/:project/governance/policy', handleUpdateGovernancePolicy);
12095:app.get('/media-manager/project/:project/notifications', handleListNotifications);
12096:app.get('/public/media-manager/project/:project/notifications', handleListNotifications);
12097:app.patch('/media-manager/project/:project/notifications/:notificationId', (req, res) => {
12110:app.patch('/public/media-manager/project/:project/notifications/:notificationId', (req, res) => {
12170:app.get('/media-manager/project/:project/handoffs', handleListHandoffs);
12171:app.get('/public/media-manager/project/:project/handoffs', handleListHandoffs);
12172:app.post('/media-manager/project/:project/handoffs', handleCreateHandoff);
12173:app.post('/public/media-manager/project/:project/handoffs', handleCreateHandoff);
12174:app.post('/media-manager/project/:project/handoffs/:handoffId/consume', handleConsumeHandoff);
12175:app.post('/public/media-manager/project/:project/handoffs/:handoffId/consume', handleConsumeHandoff);
12192:app.get('/media-manager/project/:project/events', handleListEvents);
12193:app.get('/public/media-manager/project/:project/events', handleListEvents);
12220:app.post('/media-manager/project/:project/sources', (req, res) => {
12274:app.post('/public/media-manager/project/:project/sources', (req, res) => {
12328:app.delete('/media-manager/project/:project/sources/:sourceType', (req, res) => {
12367:app.delete('/public/media-manager/project/:project/sources/:sourceType', (req, res) => {
12599:app.get('/media-manager/project/:project/integrations/control-center', handleGetProjectIntegrationControlCenter);
12763:  '/media-manager/project/:project/customer-operations/health',
12768:  '/public/media-manager/project/:project/customer-operations/health',
12773:  '/media-manager/project/:project/customer-operations/readiness',
12778:  '/public/media-manager/project/:project/customer-operations/readiness',
12783:  '/media-manager/project/:project/customer-operations/channels',
12788:  '/public/media-manager/project/:project/customer-operations/channels',
12793:  '/media-manager/project/:project/customer-operations/inbox',
12798:  '/public/media-manager/project/:project/customer-operations/inbox',
12876:  '/media-manager/project/:project/customer-operations/conversations',
12881:  '/public/media-manager/project/:project/customer-operations/conversations',
12886:  '/media-manager/project/:project/customer-operations/messages',
12891:  '/public/media-manager/project/:project/customer-operations/messages',
12896:  '/media-manager/project/:project/customer-operations/customers',
12901:  '/public/media-manager/project/:project/customer-operations/customers',
12906:  '/media-manager/project/:project/customer-operations/sla',
12911:  '/public/media-manager/project/:project/customer-operations/sla',
12916:  '/media-manager/project/:project/customer-operations/escalations',
12921:  '/public/media-manager/project/:project/customer-operations/escalations',
12926:app.get('/media-manager/project/:project/native-media/providers', handleGetNativeMediaProviders);
12927:app.get('/public/media-manager/project/:project/native-media/providers', handleGetNativeMediaProviders);
12928:app.get('/media-manager/project/:project/native-media/providers/readiness', handleGetNativeMediaProviderReadiness);
12929:app.get('/public/media-manager/project/:project/native-media/providers/readiness', handleGetNativeMediaProviderReadiness);
12971:app.post('/media-manager/project/:project/native-media/generate', handleNativeMediaGenerate);
12975:app.get('/public/media-manager/project/:project/integrations/control-center', handleGetProjectIntegrationControlCenter);
12977:app.post('/media-manager/project/:project/integrations/:integrationId/connect', async (req, res) => {
12983:app.post('/public/media-manager/project/:project/integrations/:integrationId/connect', async (req, res) => {
12989:app.post('/media-manager/project/:project/integrations/:integrationId', async (req, res) => {
12995:app.post('/public/media-manager/project/:project/integrations/:integrationId', async (req, res) => {
13001:app.post('/media-manager/project/:project/integrations/:integrationId/reconnect', async (req, res) => {
13007:app.post('/public/media-manager/project/:project/integrations/:integrationId/reconnect', async (req, res) => {
13013:app.post('/media-manager/project/:project/integrations/:integrationId/test', async (req, res) => {
13017:app.post('/public/media-manager/project/:project/integrations/:integrationId/test', async (req, res) => {
13021:app.post('/media-manager/project/:project/integrations/:integrationId/sync', async (req, res) => {
13025:app.post('/public/media-manager/project/:project/integrations/:integrationId/sync', async (req, res) => {
13029:app.post('/media-manager/project/:project/integrations/:integrationId/import-history', async (req, res) => {
13033:app.post('/public/media-manager/project/:project/integrations/:integrationId/import-history', async (req, res) => {
13037:app.post('/media-manager/project/:project/integrations/:integrationId/disconnect', async (req, res) => {
13041:app.post('/public/media-manager/project/:project/integrations/:integrationId/disconnect', async (req, res) => {
13047:app.post('/media-manager/project/:project/publishing/schedule', (req, res) => {
13090:app.post('/public/media-manager/project/:project/publishing/schedule', (req, res) => {
13133:app.post('/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
13172:app.post('/public/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
13211:app.post('/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
13243:app.post('/public/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
13275:app.post('/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
13317:app.post('/public/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
13359:app.post('/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
13401:app.post('/public/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
13530:  // Use canonical-first candidate resolution with fallback instrumentation
14021:  // canonical reads are preferred when present, with legacy brand-assets as
14542:    execution_backend: 'canonical_publish_runtime',
14558:    execution_backend: 'canonical_email_runtime',
15325:  const requiredAssetTypes = new Set(getAssetTypeCatalog().filter(item => item.required).map(item => item.asset_type));
15564:        asset_type: category.asset_type,
21403:if (command === '/list_asset_type_catalog') {
