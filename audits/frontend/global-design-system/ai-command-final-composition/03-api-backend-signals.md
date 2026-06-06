# 03 — AI Command API / Backend Signals

Generated: Sat Jun  6 22:47:26 CEST 2026

## Frontend API
73:    // Ignore storage access errors in restricted contexts
78:  const empty = { key: "", source: "none" };
83:        { source: "window.__MH_CONTROL_CENTER_READ_KEY__", value: window.__MH_CONTROL_CENTER_READ_KEY__ },
84:        { source: "window.__MH_CONTROL_CENTER_WRITE_KEY__", value: window.__MH_CONTROL_CENTER_WRITE_KEY__ },
85:        { source: "window.__MH_CONTROL_WRITE_KEY__", value: window.__MH_CONTROL_WRITE_KEY__ },
86:        { source: "window.__MH_CONTROL_CENTER_ACCESS_KEY__", value: window.__MH_CONTROL_CENTER_ACCESS_KEY__ },
87:        { source: "window.__MH_CONTROL_ACCESS_KEY__", value: window.__MH_CONTROL_ACCESS_KEY__ },
88:        { source: "window.__MH_ACCESS_KEY__", value: window.__MH_ACCESS_KEY__ }
95:          return { key: normalized, source: candidate.source };
103:        return { key: canonical, source: `localStorage:${CONTROL_ACCESS_KEY_STORAGE_KEY}` };
110:          return { key: legacyValue, source: `localStorage:${legacyKey}` };
115:    // Ignore storage access errors in restricted contexts
125:    source: String(keyMeta?.source || "none")
146:export function isAccessKeyFailure(error) {
241:function emitApiRuntimeTrace(stage, details = {}) {
252:      detail: {
255:        endpoint: String(details.endpoint || ""),
256:        method: String(details.method || "GET"),
257:        status: Number.isFinite(details.status) ? Number(details.status) : null,
258:        contentType: String(details.contentType || ""),
259:        message: String(details.message || ""),
260:        bodyLength: Number(details.bodyLength || 0),
261:        durationMs: Number(details.durationMs || 0),
262:        timeoutMs: Number(details.timeoutMs || 0)
280:    keySource: keyMeta.source
299:    keySource: keyMeta.source
318:    const rawText = await Promise.race([
361:          const fallbackPayload = await Promise.race([
404:            message: fallbackError?.message || "JSON fallback failed"
439:      message: error?.message || "Failed to read response body"
477:    await nextFrame();
492:  } catch (parseFailure) {
499:      message: parseFailure?.message || "Invalid JSON payload"
516:async function parseJson(response, fallbackMessage = "Request failed", requestMeta = {}) {
521:  const bodyReadResult = await readResponseText(response, requestMeta);
535:      payload = await parseJsonTextSafely(rawText, response, requestMeta, bodyLength);
537:    } catch (parseFailure) {
539:      throw parseFailure;
668:    const response = await Promise.race([requestPromise, timeoutPromise]);
694:      message: error?.message || "Request failed"
707:  const response = await fetchWithTimeout(path, {
725:  const response = await fetchWithTimeout(path, {
731:  const rawText = await response.text();
741:        status: response.ok ? "failed" : "error",
752:    const message = String(payload?.error || payload?.message || fallbackMessage || "Request failed").trim();
765:  const response = await fetchWithTimeout(path, {
790:  const response = await fetchWithTimeout(path, {
799:    keySource: keyMeta.source,
821:  const response = await fetchWithTimeout(normalizedPath, {
827:    const rawText = await response.text().catch(() => "");
836:    const message = String(payload?.error || rawText || `Failed to load protected file (${response.status}).`).trim();
855:    blob: await response.blob(),
943:      sources: {}
1007:    const err = new Error(`Failed to load ${section}: ${panelError}`);
1023:  const response = await fetch("/media-manager/projects", {
1035:    data = await response.json();
1039:    const message = data?.details || data?.error || `Failed to create project (${response.status})`;
1049:    const payload = await getJson(
1051:      "Failed to load projects",
1080:    "Failed to load project startup dashboard",
1102:  const requiredResults = await Promise.allSettled(
1129:        const fallbackProjects = await fetchProjects();
1141:          warning: projectExists ? "Project details are still syncing." : "Project not found in projects index."
1149:          warning: "Project details are still syncing.",
1150:          message: String(fallbackError?.message || "Failed to verify project fallback")
1158:    const error = new Error(`Required project data failed: ${message}`);
1191:  const requiredDashboardPayload = await requiredDashboardPromise;
1331:    "Failed to load asset catalog"
1342:    "Failed to load project insights"
1353:    "Failed to load project learning"
1364:    "Failed to load project operations",
1374:  const response = await fetch(`/media-manager/project/${encodedProjectName}/apply-template`, {
1388:    data = await response.json();
1392:    const message = data?.details || data?.error || `Failed to apply project template (${response.status})`;
1409:    "Failed to save project setup"
1422:    "Failed to refresh project library"
1442:    "Failed to update asset status"
1464:    "Failed to rename asset"
1468:export async function setProjectAssetSourceOfTruth(projectName, assetId, sourceOfTruth) {
1478:    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/source-of-truth`,
1480:    { source_of_truth: Boolean(sourceOfTruth) },
1481:    "Failed to update source of truth"
1498:    "Failed to archive asset"
1515:    "Failed to delete asset"
1540:    "Failed to reclassify asset"
1544:export async function runProjectWorkflow(projectName, workflowId, payload = {}) {
1549:  if (!workflowId) {
1550:    throw new Error("Missing workflow id");
1554:    `/media-manager/project/${encodeURIComponent(projectName)}/workflows/${encodeURIComponent(workflowId)}/run`,
1557:    "Failed to record workflow run"
1561:export async function runProjectAiWorkflow(projectName, workflowId, payload = {}) {
1566:  if (!workflowId) {
1567:    throw new Error("Missing workflow id");
1571:    `/media-manager/project/${encodeURIComponent(projectName)}/ai/workflows/${encodeURIComponent(workflowId)}/run`,
1574:    "Failed to execute AI workflow"
1578:export async function executeProjectAiCommand(projectName, payload = {}) {
1584:    `/media-manager/project/${encodeURIComponent(projectName)}/ai/command`,
1587:    "Failed to execute AI command"
1591:export async function executeProjectAiChat(projectName, payload = {}) {
1597:    `/media-manager/project/${encodeURIComponent(projectName)}/ai/chat`,
1600:    "Failed to request AI chat",
1606:export async function executeProjectAiGuidance(projectName, payload = {}) {
1612:    `/media-manager/project/${encodeURIComponent(projectName)}/ai/guidance`,
1615:    "Failed to request AI guidance",
1626:    `/media-manager/project/${encodeURIComponent(projectName)}/tasks`,
1629:    "Failed to create project task"
1640:    `/media-manager/project/${encodeURIComponent(projectName)}/tasks${suffix}`,
1641:    "Failed to load project tasks"
1654:    "Failed to create approval request"
1666:    "Failed to load approvals"
1683:    "Failed to update approval"
1702:    "Failed to load governance summary"
1713:    "Failed to load governance policy"
1726:    "Failed to update governance policy"
1730:export async function saveProjectConnectorSource(projectName, sourceType, sourceValue) {
1735:  if (!sourceType) {
1736:    throw new Error("Missing source type");
1739:  if (!sourceValue) {
1740:    throw new Error("Missing source value");
1744:    `/media-manager/project/${encodeURIComponent(projectName)}/sources`,
1747:      source_type: sourceType,
1748:      source_value: sourceValue
1750:    "Failed to save project connector"
1754:export async function removeProjectConnectorSource(projectName, sourceType) {
1759:  if (!sourceType) {
1760:    throw new Error("Missing source type");
1764:    `/media-manager/project/${encodeURIComponent(projectName)}/sources/${encodeURIComponent(sourceType)}`,
1767:    "Failed to remove project connector"
1778:    "Failed to load integration control center"
1795:    "Failed to connect integration"
1812:    "Failed to reconnect integration"
1829:    "Failed to test integration"
1846:    "Failed to sync integration"
1863:    "Failed to import integration history"
1880:    "Failed to disconnect integration"
1893:    "Failed to save publishing schedule"
1910:    "Failed to reschedule publishing item"
1927:    "Failed to approve publishing item"
1944:    "Failed to publish item"
1948:export async function failPublishingItem(projectName, jobId, payload = {}) {
1958:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/fail`,
1961:    "Failed to mark publishing item as failed"
1972:    "Failed to load operations schema"
1982:    `/media-manager/project/${encodeURIComponent(projectName)}/task-center`,
1983:    "Failed to load task center"
1994:    "Failed to load queue center"
2005:    "Failed to load job monitor"
2016:    "Failed to load notification center"
2027:    "Failed to load project team model"
2040:    "Failed to update project team model"
2044:export async function listProjectCampaigns(projectName, limit) {
2052:    `/media-manager/project/${encodeURIComponent(projectName)}/campaigns${suffix}`,
2053:    "Failed to load campaigns"
2057:export async function saveProjectCampaign(projectName, payload = {}) {
2064:      `/media-manager/project/${encodeURIComponent(projectName)}/campaigns/${encodeURIComponent(payload.id)}`,
2067:      "Failed to update campaign"
2072:    `/media-manager/project/${encodeURIComponent(projectName)}/campaigns`,
2075:    "Failed to create campaign"
2090:  if (params.campaign_id) {
2091:    search.set("campaign_id", String(params.campaign_id));
2098:    "Failed to load content items"
2112:      "Failed to update content item"
2120:    "Failed to create content item"
2135:  if (params.campaign_id) {
2136:    search.set("campaign_id", String(params.campaign_id));
2147:    "Failed to load media jobs"
2161:      "Failed to update media job"
2169:    "Failed to create media job"
2178:    "Failed to improve media prompt"
2187:    "Failed to run media brand check"
2196:    "Failed to generate image"
2205:    "Failed to generate video brief"
2214:    "Failed to generate voice script"
2218:export async function generateMediaCampaignPack(payload = {}) {
2220:    "/api/media/generate-campaign-pack",
2223:    "Failed to generate campaign pack"
2242:  if (params.source_page) {
2243:    search.set("source_page", String(params.source_page));
2254:    "Failed to load handoffs"
2267:    "Failed to create handoff"
2284:    "Failed to consume handoff"
2297:    "Failed to load event log"
2314:    "Failed to update notification"
2345:    "Failed to upload asset"
2361:export async function fetchCustomerConversationDetail(projectName, conversationId) {
2369:export async function fetchCustomerProfilePreview(projectName, customerId) {

## Backend routes
1:// Deterministic source registry extraction for canonical/legacy compatibility
4:  if (value.sources && typeof value.sources === 'object' && !Array.isArray(value.sources)) {
5:    return value.sources;
8:  const omitKeys = new Set(['updated_at', 'statuses', 'required_sources', 'sources']);
66:const { executeAdapterAction } = require('./lib/integrations/adapter-manager');
71:} = require('./lib/integrations/provider-registry');
78:} = require('./lib/media/provider-layer');
92:  upsertCampaign,
93:  listCampaigns,
94:  getCampaign,
124:const { createAiOrchestrationService } = require('./lib/ops/ai-orchestrator');
140:} = require('./lib/media/native/providers/provider-model-catalog');
143:} = require('./lib/media/native/providers/provider-readiness');
217:    res.setHeader("X-MH-Public-Alias-Warning", "classification_failed");
228:    /^https:\/\/[a-z0-9-]+\.hairoticmen\.de$/i,
331:  /^\/task\/?$/i,
335:  /^\/telegram-command\/?$/i,
344:  /^\/execute_publish_package\/?$/i,
345:  /^\/execute_email_package\/?$/i,
421:  /^\/(?:public\/)?media-manager\/asset-catalog\/?$/i,
496:const aiRateLimiter = createInMemoryRateLimiter({
515:  return /\/ai(?:\/|$)/i.test(requestPath) || /^\/api\/media\//i.test(requestPath);
523:  if (/^\/telegram-command\/?$/i.test(requestPath)) {
525:    action = 'telegram_command';
527:    limiter = aiRateLimiter;
528:    action = 'ai_endpoint';
565:let aiOrchestrator = null;
580:  status = 'needs_review'
602:      provider: asString(req?.body?.provider || req?.body?.media_provider || ''),
604:      campaign_id: asString(req?.body?.campaign || req?.body?.campaign_id || ''),
609:        preview_url: asString(output?.images?.[0]?.url || output?.image_url || ''),
640:    product: 'product_source',
641:    packaging: 'packaging_source',
642:    reference: 'reference_source',
643:    video: 'video_source'
664:      assetType: canonicalType,
678:      assetRole: legacyRole,
684:  throw new Error('Unknown asset type');
734:function findProjectAssetFilePathById(projectName, assetId) {
736:  const requestedId = String(assetId || '').trim();
743:    const assetPaths = getProjectAssetPaths(project);
744:    const assets = readJsonFile(assetPaths.assetsRegistryPath, []);
745:    const match = assets.find((asset) => {
746:      const candidate = String(asset?.asset_id || asset?.assetId || asset?.id || '').trim();
763:function resolveMediaFilePathFromQuery(projectName, requestedPath, assetId) {
766:  const decodedAssetId = decodeMediaQueryPath(assetId);
809:          source: 'query_path'
816:      source: 'query_path',
827:        source: 'query_asset_id'
834:    source: decodedAssetId ? 'query_asset_id' : null
851:  // 4. Collapse repeated underscores/dots, strip leading/trailing punctuation.
892:const CONTEXTS_DIR = path.join(BASE_DIR, 'contexts');
896:const LEGACY_BRAND_ASSETS_DIR = path.join(DATA_DIR, 'brand-assets');
900:  PREPARE_PACKAGE: 'email_prepare_package',
901:  PREPARED_HTML: 'email_prepared_html',
902:  PREPARED_PACKAGE: 'email_prepared_package',
903:  DELIVERY_RECORD: 'email_delivery_record',
904:  DRAFT_QUEUE: 'email_draft_queue',
905:  MEDIA_QUEUE: 'email_media_queue'
910:  'executed',
911:  'failed'
914:  process.env.MH_NATIVE_MEDIA_DEFAULT_PROVIDER || 'openai'
915:).trim().toLowerCase() || 'openai';
920:  const fallback = String(fallbackMessage || 'Request failed').trim() || 'Request failed';
947:  message = 'Request failed'
953:      message: sanitizeErrorMessage(message, 'Request failed')
1051:    return sanitizeErrorMessage(payload, 'Request failed');
1057:function logCriticalFailure(action, req, error, context = {}) {
1058:  appLogger.error('critical_failure', {
1063:    ...sanitizeValue(context),
1103:        const plain = record.credentials
1106:        return encrypted || plain;
1150:    checks.project_registry_load.error = sanitizeErrorMessage(error.message, 'Failed to load project registry');
1196:  email: {
1204:  'campaign-execution': {
1205:    legacy: 'campaign-execution',
1206:    canonical: 'campaign-execution'
1208:  'campaign-finalization': {
1209:    legacy: 'campaign-finalization',
1210:    canonical: 'campaign-finalization'
1282:    appLogger.error('read_redirection_telemetry_write_failed', {
1286:      domain: entry.domain,
1303:  const domain = String(options.domain || '').trim().toLowerCase();
1312:    domain,
1315:  const readPolicy = options.readPolicy || unifiedDataPathResolver.getDomainReadPolicy(domain);
1359:    domain,
1372:      domain_flag_name: readPolicy.flagName,
1373:      domain_canonical_first: !!readPolicy.domainCanonicalFirst,
1387:    domain,
1409:  const domain = String(options.domain || '').trim().toLowerCase();
1418:    domain,
1422:  const domainConfig = EXECUTION_READ_DOMAIN_BASES[domain];
1426:  if (!domainConfig && !canonicalBaseOverride && !legacyBaseOverride) {
1436:        domain,
1438:        domainCanonicalFirst: false,
1446:  const canonicalBase = canonicalBaseOverride || (domainConfig.canonical
1447:    ? path.join(resolution.executionRoot, domainConfig.canonical)
1449:  const legacyBase = legacyBaseOverride || (domainConfig.legacy
1450:    ? path.join(resolution.legacyRoot, domainConfig.legacy)
1455:    domain,
1464:    readPolicy: unifiedDataPathResolver.getDomainReadPolicy(domain),
1470:function getEmailDomainPaths(projectName) {
1473:    domain: 'email',
1484:    canonicalEmailDir: path.join(resolution.executionRoot, 'email'),
1485:    legacyEmailDir: path.join(resolution.legacyRoot, 'email'),
1486:    canonicalLiveContentDir: path.join(EXECUTION_DIR, 'projects', safeProject, 'content', 'email'),
1487:    legacyLiveContentDir: path.join(EXECUTION_DIR, safeProject, 'content', 'email'),
1493:function getEmailArtifactContract(projectName, artifactType) {
1494:  const paths = getEmailDomainPaths(projectName);
1500:      relativePath: 'email-prepare-package.json',
1502:      requestedFile: 'email-prepare-package.json',
1503:      pathContract: 'execution/projects/<project>/email-prepare-package.json -> brand-assets/<project>/email-prepare-package.json'
1506:      canonicalBase: paths.canonicalEmailDir,
1507:      legacyBase: paths.legacyEmailDir,
1510:      requestedFile: 'email/html/*.html',
1511:      pathContract: 'execution/projects/<project>/email/html/<package>.html -> brand-assets/<project>/email/html/<package>.html'
1514:      canonicalBase: paths.canonicalEmailDir,
1515:      legacyBase: paths.legacyEmailDir,
1518:      requestedFile: 'email/prepared/*.json',
1519:      pathContract: 'execution/projects/<project>/email/prepared/<package>.json -> brand-assets/<project>/email/prepared/<package>.json'
1522:      canonicalBase: paths.canonicalEmailDir,
1523:      legacyBase: paths.legacyEmailDir,
1526:      requestedFile: 'email/delivery/*.json',
1527:      pathContract: 'execution/projects/<project>/email/delivery/<send>.json -> brand-assets/<project>/email/delivery/<send>.json'
1532:      relativePath: 'email-queue.json',
1534:      requestedFile: 'content/email/email-queue.json',
1535:      pathContract: 'execution/projects/<project>/content/email/email-queue.json -> execution/<project>/content/email/email-queue.json'
1540:      relativePath: 'email-image-queue.json',
1542:      requestedFile: 'media/queue/email-image-queue.json',
1543:      pathContract: 'execution/projects/<project>/media/queue/email-image-queue.json -> execution/<project>/media/queue/email-image-queue.json'
1550:    throw new Error(`Unsupported email artifact contract: ${artifactType}`);
1561:function resolveEmailReadCandidate(options = {}) {
1564:  const contract = getEmailArtifactContract(safeProject, artifactType);
1571:    domain: 'email',
1584:function readEmailArtifactArray(projectName, artifactType, requestedIdentifier) {
1585:  const candidate = resolveEmailReadCandidate({
1597:function writeEmailArtifactArray(projectName, artifactType, data) {
1598:  const contract = getEmailArtifactContract(projectName, artifactType);
1617:    throw Object.assign(new Error(`Missing project context. Set ${DEFAULT_PROJECT_ENV} or pass project explicitly.`), {
1625:function readLiveEmailQueue(projectName, requestedIdentifier = 'email-draft-queue') {
1626:  return readEmailArtifactArray(requireQueueProjectName(projectName), EMAIL_ARTIFACT_TYPES.DRAFT_QUEUE, requestedIdentifier);
1629:function writeLiveEmailQueue(projectName, queue = []) {
1630:  return writeEmailArtifactArray(requireQueueProjectName(projectName), EMAIL_ARTIFACT_TYPES.DRAFT_QUEUE, queue);
1633:function readLiveEmailMediaQueue(projectName, requestedIdentifier = 'email-media-queue') {
1634:  return readEmailArtifactArray(requireQueueProjectName(projectName), EMAIL_ARTIFACT_TYPES.MEDIA_QUEUE, requestedIdentifier);
1637:function writeLiveEmailMediaQueue(projectName, queue = []) {
1638:  return writeEmailArtifactArray(requireQueueProjectName(projectName), EMAIL_ARTIFACT_TYPES.MEDIA_QUEUE, queue);
1650:    reel: path.join('content', 'campaigns', 'reel-brief-queue.json'),
1651:    tasks: path.join('tasks', 'task-board.json')
1673:  const backupDir = path.join(getLegacyExecutionRoot(projectName), 'assets', 'backups');
1691:  'email',
1694:  'campaign-execution',
1695:  'campaign-finalization',
1727:    const domain = String(entry.domain || '').trim().toLowerCase();
1730:    if (!domain || !identifier) {
1734:    const key = `${domain}::${identifier}`;
1756:  const domain = String(readEntry.domain || '').trim().toLowerCase();
1760:  if (domain && identifier) {
1761:    const dualWriteEntry = dualWriteIndex.get(`${domain}::${identifier}`);
1767:      const canonicalFailed = dualWriteEntry.writes.some(
1768:        (item) => item.root === 'canonical' && item.status === 'failed'
1774:      if (canonicalFailed && legacySuccess) {
1791:function createDomainStats() {
1818:  const byDomain = {};
1821:    const domain = String(entry.domain || '').trim().toLowerCase();
1823:    if (!PHASE375_TARGET_DOMAINS.has(domain)) {
1827:    if (!byDomain[domain]) {
1828:      byDomain[domain] = createDomainStats();
1831:    const stats = byDomain[domain];
1857:  Object.keys(byDomain).forEach((domain) => {
1858:    const stats = byDomain[domain];
1914:    by_domain: byDomain,
1967:    domain: 'generated',
1987:function evaluateEmailReadiness(projectName) {
1988:  const context = buildPromptEngineContext(projectName);
1989:  const logo = context.source_of_truth.logo;
2007:    result.blocking_reasons.push('Missing logo source');
2012:    result.warnings.push('No rendered image available yet');
2018:function getEmailPreparePaths(projectName) {
2020:  const contract = getEmailArtifactContract(safeProject, EMAIL_ARTIFACT_TYPES.PREPARE_PACKAGE);
2054:    provider: renderRequest.result?.provider || renderRequest.provider || null,
2059:function buildEmailPreparePackage(projectName) {
2060:  const preparePaths = getEmailPreparePaths(projectName);
2061:  const readiness = evaluateEmailReadiness(projectName);
2071:    rendered_asset: rendered,
2072:    email_asset: {
2073:      subject: `New campaign visual for ${projectName}`,
2076:      body: `This campaign asset was auto-prepared by the system using the latest approved brand-controlled render.`,
2084:    domain: 'email',
2085:    artifactType: 'email_prepare_package',
2093:function buildEmailHtmlFromPreparePackage(packageData) {
2094:  const subject = packageData.email_asset.subject || 'Campaign Update';
2095:  const headline = packageData.email_asset.headline || 'New Campaign Asset';
2096:  const body = packageData.email_asset.body || '';
2097:  const cta = packageData.email_asset.cta || 'Learn More';
2098:  const imagePath = packageData.rendered_asset?.output_path || '';
2122:                Render source: ${imagePath}
2141:function autoPrepareEmailAsset(projectName, rawText = '') {
2142:  const preparePaths = getEmailPreparePaths(projectName);
2143:  const packageData = buildEmailPreparePackage(projectName);
2149:  const subject = extractFlagValue(rawText, 'subject') || packageData.email_asset.subject;
2150:  const headline = extractFlagValue(rawText, 'headline') || packageData.email_asset.headline;
2151:  const body = extractFlagValue(rawText, 'body') || packageData.email_asset.body;
2152:  const cta = extractFlagValue(rawText, 'cta') || packageData.email_asset.cta;
2155:  const publicImageUrl = buildPublicImageUrl(projectName, packageData.rendered_asset?.output_path || '');
2157:  packageData.email_asset.subject = subject;
2158:  packageData.email_asset.headline = headline;
2159:  packageData.email_asset.body = body;
2160:  packageData.email_asset.cta = cta;
2161:  packageData.email_asset.cta_url = ctaUrl;
2162:  packageData.email_asset.public_image_url = publicImageUrl;
2164:  packageData.email_asset.html = buildHardenedEmailHtml(packageData);
2166:  const htmlDir = path.join(preparePaths.legacyBaseDir, 'email', 'html');
2167:  const preparedDir = path.join(preparePaths.legacyBaseDir, 'email', 'prepared');
2171:  const packageId = `emailprep_${Date.now()}`;
2177:    domain: 'email',
2178:    artifactType: 'email_prepared_html',
2181:    payload: packageData.email_asset.html,
2185:  const validation = validateEmailPreparePackage(packageData);
2194:    packageData.email_asset.ready_for_send = true;
2196:    packageData.status = 'needs_manual_review';
2197:    packageData.email_asset.ready_for_send = false;
2202:    domain: 'email',
2203:    artifactType: 'email_prepared_package',
2210:    domain: 'email',
2211:    artifactType: 'email_prepare_package',
2220:function reviewEmailPreparePackage(projectName) {
2221:  const prepareFile = resolveEmailReadCandidate({
2225:    requestedFile: 'email-prepare-package.json'
2229:    throw new Error('Email prepare package not found');
2256:function validateEmailPreparePackage(packageData) {
2260:  const subject = String(packageData.email_asset?.subject || '').trim();
2261:  const headline = String(packageData.email_asset?.headline || '').trim();
2262:  const body = String(packageData.email_asset?.body || '').trim();
2263:  const cta = String(packageData.email_asset?.cta || '').trim();
2264:  const url = String(packageData.email_asset?.cta_url || '').trim();
2265:  const html = String(packageData.email_asset?.html || '').trim();
2266:  const publicImageUrl = String(packageData.email_asset?.public_image_url || '').trim();
2268:  if (!subject) errors.push('Missing email subject');
2269:  if (!headline) errors.push('Missing email headline');
2270:  if (!body) errors.push('Missing email body');
2298:function buildHardenedEmailHtml(packageData) {
2299:  const subject = packageData.email_asset.subject;
2300:  const headline = packageData.email_asset.headline;
2301:  const body = packageData.email_asset.body;
2302:  const cta = packageData.email_asset.cta;
2303:  const ctaUrl = packageData.email_asset.cta_url;
2304:  const publicImageUrl = packageData.email_asset.public_image_url;
2345:    domain: 'generated',
2366:function buildAssetFidelityRules(sourceOfTruth = {}, goal = '') {
2367:  const productIntel = inferProductIntelligenceFromSource(sourceOfTruth);
2374:      'Use the provided product image as the exact source of truth.',
2380:      'Do not invent new ingredients, claims, or visual brand marks.'
2407:  const mainBenefit =
2423:      hook: `${productName} builds a stronger ${productType} identity with ${mainBenefit}.`,
2437:      hook: `${productName} is ideal for promotional conversion-focused campaigns.`,
2444:      hook: `${productName} can be explained clearly through benefit, ingredient, and usage blocks.`,
2474:  const sourceOfTruth = renderRequest.source_of_truth || {};
2475:  const rules = buildAssetFidelityRules(sourceOfTruth, renderRequest.goal || '');
2496:- Use the provided product image EXACTLY as the main source of truth.
2498:- Keep the real product visually recognizable and faithful to the input.
2505:- Do NOT invent ingredients, claims, or decorative brand elements.
2517:Create a realistic, premium, cinematic, marketing-grade visual that supports the campaign objective while preserving the exact product identity.
2523:async function executeProviderRender(projectName) {
2536:  const sourceOfTruth = renderRequest.source_of_truth || {};
2539:  const productPath = sourceOfTruth.product;
2540:  const logoPath = sourceOfTruth.logo;
2543:    throw new Error('Missing real product source image');
2547:    throw new Error('Missing real logo source image');
2562:  const response = await axios.post(
2563:    'https://api.openai.com/v1/images/edits',
2578:    throw new Error('No image data returned from provider');
2585:    domain: 'generated',
2593:  provider: 'openai',
2596:  fidelity_mode: 'real_asset_locked',
2604:function getEmailDeliveryPaths(projectName) {
2606:  const emailPaths = getEmailDomainPaths(safeProject);
2607:  const baseDir = emailPaths.canonicalEmailDir;
2610:  const legacyBaseDir = emailPaths.legacyEmailDir;
2631:function getLatestPreparedEmailPackage(projectName) {
2632:  const preparedDir = resolveEmailReadCandidate({
2636:    requestedIdentifier: 'latest-prepared-email-package',
2637:    requestedFile: 'email/prepared/*.json'
2646:    throw new Error('No prepared email package found');
2653:function evaluatePreparedEmailForSend(projectName) {
2654:  const pkg = getLatestPreparedEmailPackage(projectName);
2665:    result.blocking_reasons.push('Prepared email package is not ready_for_send');
2670:    result.blocking_reasons.push('Prepared email package validation failed');
2673:  if (!pkg.email_asset || !pkg.email_asset.html) {
2675:    result.blocking_reasons.push('Missing email HTML');
2678:  if (!pkg.email_asset || !pkg.email_asset.public_image_url) {
2683:  if (!pkg.email_asset || !pkg.email_asset.cta_url) {
2691:function writeEmailDeliveryRecord(projectName, data) {
2692:  const paths = getEmailDeliveryPaths(projectName);
2693:  const deliveryId = `emailsend_${Date.now()}`;
2705:    domain: 'email',
2706:    artifactType: 'email_delivery_record',
2713:async function sendPreparedEmail(projectName, toEmail) {
2714:  const readiness = evaluatePreparedEmailForSend(projectName);
2717:    return writeEmailDeliveryRecord(projectName, {
2719:      to_email: toEmail,
2725:  const pkg = getLatestPreparedEmailPackage(projectName);
2729:  // مثل SMTP / WordPress mail bridge / provider API
2732:  return writeEmailDeliveryRecord(projectName, {
2733:    status: 'pending_provider_send',
2734:    to_email: toEmail,
2736:    subject: pkg.email_asset.subject,
2739:    note: 'Prepared and verified. Waiting for provider integration or send bridge.'
2751:  const response = await axios.get(
2771:  const response = await axios.get(
2840:    const products = await fetchWooProductsPage(page, perPage);
2915:    domain: 'generated',
2920:    domain: 'generated',
2952:    domain: 'channels',
3045:    '#campaigncreative',
3072:    image_available: !!imageInfo,
3075:      'Use real registered brand assets only.',
3078:      'Avoid misleading claims or non-verifiable promises.'
3080:    publish_status: imageInfo ? 'ready_for_publish' : 'needs_manual_review'
3114:    domain: 'channels',
3123:function reviewLatestMetaPackage(projectName) {
3126:    domain: 'channels',
3147:    domain: 'channels',
3184:    image_available: !!imageInfo,
3190:      'Do not make misleading or non-verifiable claims.'
3192:    publish_status: imageInfo ? 'ready_for_production' : 'needs_manual_review'
3235:    domain: 'channels',
3244:function reviewLatestTikTokPackage(projectName) {
3247:    domain: 'channels',
3281:      goal_style: 'title + thumbnail + structured value delivery'
3302:      : 'Use stronger promise-led positioning with thumbnail-title alignment.',
3311:      : 'CTR-first via title-thumbnail fit, then watch-time support through structure.',
3329:    image_available: !!imageInfo,
3333:      'Do not rely on claimed third-party content for Shorts over one minute.',
3334:      'Use clear thumbnail-title alignment for standard videos.',
3335:      'Avoid misleading claims or deceptive packaging presentation.'
3337:    publish_status: imageInfo ? 'ready_for_publish' : 'needs_manual_review'
3355:    ? 'A short-form premium visual built with real brand-controlled assets.'
3387:    thumbnail_brief: 'Use the strongest premium product frame with clean focal contrast and readable title alignment.',
3395:    domain: 'channels',
3404:function reviewLatestYouTubePackage(projectName) {
3407:    domain: 'channels',
3428:    domain: 'channels',
3453:      image_main_background: 'white',
3454:      image_main_product_fill: '>=85%',
3455:      image_main_text_overlay_allowed: false,
3456:      image_main_watermark_allowed: false,
3457:      image_main_logo_overlay_allowed: false,
3494:    conversion_angle: 'Real product, clean presentation, trustworthy copy, and compliant listing assets.',
3518:      'Brand-controlled real-asset presentation',
3524:    description: `This Amazon package is built for ${goal} using approved real assets and a conversion-oriented marketplace structure.`,
3535:      main_image_rules: {
3545:        'Main image should show only the product on white background.',
3546:        'Use no text overlays or decorative graphics on main image.',
3554:    domain: 'channels',
3587:    description: `This eBay package is built for ${goal} using approved brand-controlled assets and a trust-oriented listing structure.`,
3609:    domain: 'channels',
3630:function reviewLatestMarketplacePackage(projectName, marketplace) {
3635:          domain: 'channels',
3645:          domain: 'channels',
3672:    domain: 'german-launch',
3677:    domain: 'german-launch',
3747:function selectLaunchReadyProducts(products, projectName, context = 'launch') {
3750:      route: '/telegram-command',
3751:      action: context,
3790:      route: '/telegram-command',
3791:      action: context,
3836:      'email',
3841:      instagram: 'daily',
3842:      tiktok: 'daily',
3844:      email: '1x_per_week',
3858:      'limited-time campaign'
3867:    domain: 'german-launch',
3905:  if (safeWaveName.includes('hair')) {
3906:    launchReadyProducts = launchReadyProducts.filter((p) => productMatchesLaunchTheme(p, ['hair']));
3930:    campaign_type: 'launch',
3932:    channels: ['instagram', 'tiktok', 'facebook', 'email'],
3945:    domain: 'german-launch',
3977:    domain: 'publishing',
3982:    domain: 'publishing',
4022:    assets: []
4027:    const asset = channelPack[normalizedChannel] || null;
4029:    if (!asset) continue;
4031:    payload.assets.push({
4036:      channel_asset: asset
4047:    domain: 'publishing',
4076:    total_assets: payload.assets.length,
4083:    domain: 'publishing',
4108:      'ready_for_manual_review',
4111:      'manual_review'
4119:  if (['failed', 'error', 'blocked', 'rejected'].includes(normalized)) return 'failed';
4165:function buildPublishingPreviewBase(input = {}, existingPreview = null) {
4166:  const base = existingPreview && typeof existingPreview === 'object' ? existingPreview : {};
4178:    preview_type:
4179:      channel === 'email'
4180:        ? 'email'
4190:    cta: String(input.cta || base.cta || (channel === 'email' ? 'Review email' : 'Shop now')).trim(),
4197:    asset_count: Number(input.total_assets || base.asset_count || 0) || 0,
4198:    asset_preview_items: Array.isArray(base.asset_preview_items) ? base.asset_preview_items.slice(0, 3) : [],
4203:function buildPublishingPreviewFromConnectorPayload(payload, input = {}) {
4208:  const assets = Array.isArray(payload.assets) ? payload.assets : [];
4209:  const primary = assets[0] || {};
4210:  const channelAsset = primary.channel_asset || {};
4211:  const preview = buildPublishingPreviewBase(
4226:      total_assets: assets.length,
4229:    input.preview || null
4232:  preview.asset_preview_items = assets.slice(0, 3).map(item => ({
4236:    caption: item.channel_asset?.caption || '',
4237:    format: item.channel_asset?.format || '',
4238:    goal: item.channel_asset?.goal || ''
4241:  return preview;
4252:  let connectorPreview =
4253:    rawJob.connector_preview && typeof rawJob.connector_preview === 'object'
4254:      ? rawJob.connector_preview
4257:  if (!connectorPreview && rawJob.connector_file && fs.existsSync(rawJob.connector_file)) {
4259:    connectorPreview = buildPublishingPreviewFromConnectorPayload(connectorPayload, rawJob);
4262:  const preview = buildPublishingPreviewBase(
4264:      ...connectorPreview,
4269:    connectorPreview
4286:    total_assets: Number(rawJob.total_assets || connectorPreview?.asset_count || 0) || 0,
4292:    connector_preview: connectorPreview,
4293:    preview
4305:    domain: 'publishing',
4326:      connector_preview: null,
4327:      total_assets: 0,
4336:      connector_preview: buildPublishingPreviewFromConnectorPayload(payload, input),
4337:      total_assets: Array.isArray(payload.assets) ? payload.assets.length : 0,
4343:      connector_preview: null,
4344:      total_assets: 0,
4345:      connector_error: error.message || 'Connector payload unavailable'
4393:  const preview = buildPublishingPreviewBase(
4395:      ...(existing.preview || {}),
4396:      ...(connectorInfo.connector_preview || {}),
4397:      ...(input.preview && typeof input.preview === 'object' ? input.preview : {}),
4404:    connectorInfo.connector_preview || existing.preview || existing.connector_preview || null
4421:    total_assets: connectorInfo.total_assets || existing.total_assets || preview.asset_count || 0,
4423:    connector_preview: connectorInfo.connector_preview || existing.connector_preview || preview,
4428:    preview
4432:function reviewScheduledJobs(projectName) {
4435:    domain: 'publishing',
4478:    domain: 'optimization',
4483:    domain: 'optimization',
4491:  const reviewsDir = path.join(baseDir, 'reviews');
4494:  const legacyReviewsDir = path.join(legacyBaseDir, 'reviews');
4499:  ensureDir(reviewsDir);
4509:    reviewsDir,
4542:  const asset = getChannelAssetForProduct(product, channel);
4544:  if (!asset) {
4545:    throw new Error('Channel asset not found for product');
4549:    asset.caption || '',
4550:    asset.headline || '',
4551:    asset.body || '',
4552:    asset.subject || ''
4571:  if ((asset.caption || '').length > 220 && ['instagram', 'facebook'].includes(String(channel).toLowerCase())) {
4573:    recommendations.push('tighten the first line and move detail lower');
4577:  const review = {
4581:    reviewed_at: new Date().toISOString(),
4590:    asset_snapshot: asset
4601:    domain: 'optimization',
4602:    artifactType: 'optimization_review',
4605:    data: review
4609:    ...review,
4616:  const asset = getChannelAssetForProduct(product, channel);
4618:  if (!asset) {
4619:    throw new Error('Channel asset not found for product');
4626:  let improved = { ...asset };
4636:  if (normalizedChannel === 'email') {
4653:    original_asset: asset,
4654:    improved_asset: improved
4665:    domain: 'optimization',
4711:    domain: 'optimization',
4728:function reviewProductPerformance(projectName, productSlug) {
4754:function reviewChannelLearning(projectName, channel) {
4847:    domain: 'generated',
4852:    domain: 'generated',
4890:    domain: 'generated',
4916:    path.join(paths.legacyOutputsDir, `${renderId}_${job.asset_type}.png`);
4922:    asset_type: job.asset_type,
4926:    provider: 'provider_pending',
4927:    source_of_truth: job.source_of_truth,
4928:    guardrails: job.guardrails,
4944:    domain: 'generated',
4953:function reviewLatestRenderRequest(projectName) {
4956:    domain: 'generated',
4960:    requestedIdentifier: 'review-latest-render-request',
4980:    domain: 'generated',
4999:    domain: 'generated',
5008:function evaluateExecutionReadiness(projectName, assetType) {
5009:  const context = buildPromptEngineContext(projectName);
5010:  const readiness = context.readiness;
5014:    asset_type: assetType,
5023:    result.blocking_reasons.push('Missing real logo source');
5026:  if (assetType === 'ad' || assetType === 'blog_image' || assetType === 'email_hero') {
5028:      result.status = 'allowed_with_constraints';
5029:      result.warnings.push('No real product source available');
5033:      result.status = 'allowed_with_constraints';
5034:      result.warnings.push('No real packaging source available');
5049:    domain: 'generated',
5054:    domain: 'generated',
5083:function evaluateGenerationEligibility(projectName, assetType) {
5084:  const execution = evaluateExecutionReadiness(projectName, assetType);
5085:  const context = buildPromptEngineContext(projectName);
5086:  const truth = context.source_of_truth;
5090:    asset_type: assetType,
5099:    result.blocking_reasons.push('Logo source is required for generation');
5102:  if ((assetType === 'ad' || assetType === 'email_hero' || assetType === 'blog_visual') && !truth.product) {
5104:    result.warnings.push('Product source is missing for full-fidelity visual generation');
5107:  if ((assetType === 'ad' || assetType === 'email_hero' || assetType === 'blog_visual') && !truth.packaging) {
5109:    result.warnings.push('Packaging source is missing for full packaging-safe rendering');
5119:function buildGenerationPrompt(projectName, assetType, goal) {
5120:  const executionPackage = buildExecutionPackage(projectName, assetType, goal);
5125:  lines.push(`Create a brand-controlled ${assetType} visual for project ${projectName}.`);
5127:  lines.push(`Use the real registered logo source only.`);
5129:  if (execution.source_of_truth.product) {
5130:    lines.push(`Use the real registered product source only.`);
5132:    lines.push(`No product source is available. Do not invent a fake product.`);
5135:  if (execution.source_of_truth.packaging) {
5136:    lines.push(`Use the real registered packaging source only.`);
5137:    lines.push(`Do not alter packaging structure, label layout, brand marks, or container form.`);
5139:    lines.push(`No packaging source is available. Do not invent packaging.`);
5149:  if (execution.source_of_truth.references.length > 0) {
5150:    lines.push(`Reference assets may influence style direction only, never source-of-truth identity.`);
5156:function buildGenerationJob(projectName, assetType, goal) {
5157:  const eligibility = evaluateGenerationEligibility(projectName, assetType);
5158:  const executionPackage = buildExecutionPackage(projectName, assetType, goal);
5162:  const outputFilename = `${jobId}_${assetType}.json`;
5168:    asset_type: assetType,
5175:    source_of_truth: executionPackage.execution.source_of_truth,
5176:    guardrails: executionPackage.execution.guardrails,
5178:    final_generation_prompt: buildGenerationPrompt(projectName, assetType, goal),
5179:    suggested_output_path: path.join(outputPaths.legacyOutputsDir, `${jobId}_${assetType}.png`)
5184:    domain: 'generated',
5193:function buildExecutionInstructions(projectName, assetType, goal) {
5194:  const context = buildPromptEngineContext(projectName);
5195:  const truth = context.source_of_truth;
5196:  const readinessCheck = evaluateExecutionReadiness(projectName, assetType);
5197:  const promptPackage = generateBrandControlledPrompt(projectName, assetType, goal);
5200:    execution_type: assetType,
5207:    source_of_truth: {
5211:      references: truth.references.map(item => item.source_url || item.local_path || item.filename).filter(Boolean)
5213:    guardrails: context.guardrails,
5214:    allowed_transformations: context.guardrails.allowed_visual_improvements,
5221:function buildExecutionPackage(projectName, assetType, goal) {
5223:  const execution = buildExecutionInstructions(projectName, assetType, goal);
5227:    asset_type: assetType,
5248:      item => item.asset_role === role && item.use_as_source_of_truth === true
5256:    logo: pickFirst('logo_source'),
5257:    product: pickFirst('product_source'),
5258:    packaging: pickFirst('packaging_source'),
5260:    has_minimum_brand_truth: !!pickFirst('logo_source')
5264:function buildPromptGuardrails(projectName) {
5274:    no_generic_ai_packaging: true,
5293:  const sourceOfTruth = resolveSourceOfTruthAssets(projectName);
5294:  const guardrails = buildPromptGuardrails(projectName);
5296:  const context = {
5299:    brand_profile_available: Object.keys(brandProfile).length > 0,
5300:    source_of_truth: sourceOfTruth,
5301:    guardrails,
5303:      has_logo: !!sourceOfTruth.logo,
5304:      has_product: !!sourceOfTruth.product,
5305:      has_packaging: !!sourceOfTruth.packaging,
5306:      reference_count: sourceOfTruth.references.length
5310:  const contextPath = path.join(paths.baseDir, 'prompt-engine-context.json');
5311:  writeJsonFile(contextPath, context);
5313:  return context;
5316:function generateBrandControlledPrompt(projectName, assetType, goal) {
5317:  const context = buildPromptEngineContext(projectName);
5318:  const truth = context.source_of_truth;
5319:  const guardrails = context.guardrails;
5324:  lines.push(`Asset type: ${assetType}.`);
5326:  lines.push(`Use the real registered logo source only.`);
5329:    lines.push(`Registered logo source is available and must be used as source of truth.`);
5331:    lines.push(`No real logo source is available. Do not invent a logo.`);
5335:    lines.push(`Use the real registered product source only.`);
5337:    lines.push(`No real product source is available. Do not invent a fake product.`);
5341:    lines.push(`Use the real registered packaging source only.`);
5342:    lines.push(`Do not alter packaging structure, label design, or container shape.`);
5344:    lines.push(`No real packaging source is available. Do not invent packaging.`);
5351:  lines.push(`Allowed edits only: ${guardrails.allowed_visual_improvements.join(', ')}.`);
5354:    lines.push(`Reference assets may be used for inspiration only, never as source of truth.`);
5359:    asset_type: assetType,
5362:    readiness: context.readiness,
5426:      new Error(`[server] Atomic rename failed for ${filePath}: ${err.message}`),
5436:    product: 'product_source',
5437:    product_source: 'product_source',
5438:    logo: 'logo_source',
5439:    logo_source: 'logo_source',
5440:    packaging: 'packaging_source',
5441:    packaging_source: 'packaging_source',
5442:    reference: 'reference_source',
5443:    reference_source: 'reference_source',
5444:    video: 'video_source',
5445:    video_source: 'video_source'
5454:    domain: 'media',
5591:    total_assets: registry.length,
5592:    assets: registry
5607:      const assetPaths = getProjectAssetPaths(project);
5608:      const assets = readJsonFile(assetPaths.assetsRegistryPath, []);
5609:      const assetMatch = assets.find((asset) => {
5610:        const assetFilename = path.basename(String(asset.file_path || '').trim());
5611:        if (!assetFilename || assetFilename !== safeFilename) {
5615:        return !normalizedType || String(asset.asset_type || '').trim().toLowerCase() === normalizedType;
5618:      if (assetMatch && fs.existsSync(assetMatch.file_path)) {
5619:        return assetMatch.file_path;
5630:    const legacyMatch = registry.find((asset) => {
5631:      const assetFilename = path.basename(String(asset.local_path || asset.filename || '').trim());
5632:      if (!assetFilename || assetFilename !== safeFilename) {
5640:      return String(asset.asset_role || '').trim().toLowerCase() === expectedRole;
5667:    assets: null,
5678:      total_assets: 0,
5679:      assets: []
5699:    payload.errors.assets = message;
5709:    assets: buildProjectControlCenterAssets,
5727:function getAssetDirByRole(paths, assetRole) {
5728:  if (assetRole === 'logo_source') return paths.logoDir;
5729:  if (assetRole === 'packaging_source') return paths.packagingDir;
5730:  if (assetRole === 'product_source') return paths.productDir;
5731:  if (assetRole === 'reference_source') return paths.referenceDir;
5732:  if (assetRole === 'video_source') return paths.videoDir;
5743:    appLogger.error('audit_write_failed', {
5768:    appLogger.warn('project_detection_registry_failed', {
5769:      route: '/task',
5869:  const error = new Error(`Missing project context. Provide request project, query project, --project, or ${DEFAULT_PROJECT_ENV}.`);
5924:    text.includes('review') ||
5936:    text.includes('campaign') ||
5976:function inferProductIntelligenceFromSource(sourceOfTruth = {}) {
5977:  const productPath = String(sourceOfTruth.product || '');
6000:  if (filename.includes('hair')) {
6001:    intelligence.category = 'hair';
6002:    intelligence.content_family = 'hair care';
6027:      visual_style: 'campaign_thematic',
6098:  else if (text.includes('hair')) enrichment.product_type = 'hair';
6163:function selectAgent(taskType) {
6164:  switch (taskType) {
6180:  source = 'direct',
6184:  const taskId = `task_${Date.now()}`;
6186:  const taskType = detectTaskType(message);
6188:  const agent = selectAgent(taskType);
6190:  const contextPath =
6207:  const projectContext = contextPath ? readFileSafe(contextPath) : '';
6210:    task_id: taskId,
6211:    source,
6215:    task_type: taskType,
6220:    loaded_context: project !== 'unknown',
6223:      summary: `Task classified as ${taskType} for project ${project}.`,
6234:      project_context_loaded: projectContext.length > 0
6239:    task_id: taskId,
6240:    source,
6244:    task_type: taskType,
6276:    brandAssetsDir: path.join(baseDir, 'brand-assets'),
6280:    campaignsDir: path.join(baseDir, 'campaigns'),
6300:    assetsRegistryPath: path.join(resolved.projectRoot, 'assets-registry.json'),
6315:    assetsRegistryPath: path.join(base.baseDir, 'assets-registry.json'),
6316:    sourcesRegistryPath: path.join(base.baseDir, 'sources-registry.json'),
6317:    sourceOfTruthRegistryPath: path.join(base.baseDir, 'source-of-truth-registry.json'),
6319:    aiCommandsPath: path.join(opsDir, 'ai-commands.json'),
6320:    aiArtifactsPath: path.join(opsDir, 'ai-artifacts.json'),
6321:    aiRecommendationsPath: path.join(opsDir, 'ai-recommendations.json'),
6322:    aiMemoryPath: path.join(opsDir, 'ai-memory.json'),
6352:      domain: entry.domain || 'unknown',
6358:    appLogger.warn('project_data_mismatch_log_failed', {
6371:  const domain = String(options.domain || 'project-baseline').trim();
6387:        domain,
6400:      source: 'canonical',
6410:      domain,
6418:      source: 'legacy',
6428:    source: 'default',
6476:  return input.sources && typeof input.sources === 'object' && !Array.isArray(input.sources)
6477:    ? input.sources
6481:function buildSourceOfTruthRegistry(sources = {}) {
6482:  const normalizedSources = normalizeSourceRegistry(sources);
6487:    brand_assets: ['brand_assets', 'logo', 'brand_guideline'],
6490:    campaign_docs: ['campaign_docs', 'campaign_doc']
6510:      source: normalizeSetupTextValue(entry.source)
6518:  if (!updatedAt && sources && typeof sources === 'object' && sources.updated_at) {
6519:    updatedAt = sources.updated_at;
6528:    sources: normalizedSources,
6529:    required_sources: requiredSources
6561:    source: 'setup',
6590:    paths.campaignsDir,
6605:    domain: 'brand-profile',
6611:  const assetsRegistry = readCanonicalJsonWithLegacyFallback(safeProject, {
6612:    domain: 'assets-registry',
6613:    canonicalPath: paths.assetsRegistryPath,
6614:    legacyCandidates: [paths.legacy.assetsRegistryPath, paths.legacy.mediaInputRegistryPath],
6619:  const sourcesRegistry = readCanonicalJsonWithLegacyFallback(safeProject, {
6620:    domain: 'source-of-truth',
6621:    canonicalPath: paths.sourceOfTruthRegistryPath,
6622:    legacyCandidates: [paths.sourcesRegistryPath],
6627:  ensureJsonFile(paths.sourcesRegistryPath, normalizeSourceRegistry(sourcesRegistry.value));
6628:  ensureJsonFile(paths.aiCommandsPath, []);
6629:  ensureJsonFile(paths.aiArtifactsPath, []);
6630:  ensureJsonFile(paths.aiRecommendationsPath, []);
6631:  ensureJsonFile(paths.aiMemoryPath, []);
6663:        source: brandProfile.source,
6666:      assets_registry: {
6667:        path: paths.assetsRegistryPath,
6668:        exists: fs.existsSync(paths.assetsRegistryPath),
6669:        source: assetsRegistry.source,
6670:        migrated: assetsRegistry.migrated
6672:      source_of_truth_registry: {
6673:        path: paths.sourceOfTruthRegistryPath,
6674:        exists: fs.existsSync(paths.sourceOfTruthRegistryPath),
6675:        source: sourcesRegistry.source,
6676:        migrated: sourcesRegistry.migrated
6682:      ai_commands: {
6683:        path: paths.aiCommandsPath,
6684:        exists: fs.existsSync(paths.aiCommandsPath)
6686:      ai_artifacts: {
6687:        path: paths.aiArtifactsPath,
6688:        exists: fs.existsSync(paths.aiArtifactsPath)
6690:      ai_recommendations: {
6691:        path: paths.aiRecommendationsPath,
6692:        exists: fs.existsSync(paths.aiRecommendationsPath)
6694:      ai_memory: {
6695:        path: paths.aiMemoryPath,
6696:        exists: fs.existsSync(paths.aiMemoryPath)
6704:      campaigns: { path: paths.campaignsDir, exists: fs.existsSync(paths.campaignsDir) },
6724:  const currentSources = normalizeSourceRegistry(readJsonFile(paths.sourcesRegistryPath, {}));
6730:      source: 'setup',
6741:      source: 'setup',
6748:    brand_assets: projectData.brand_assets,
6751:    campaign_docs: projectData.campaign_docs
6754:  Object.entries(projectSourceAliases).forEach(([sourceKey, value]) => {
6760:    nextSources[sourceKey] = {
6763:      source: 'setup',
6768:  writeJsonFile(paths.sourcesRegistryPath, nextSources);
6769:  writeJsonFile(paths.sourceOfTruthRegistryPath, buildSourceOfTruthRegistry(nextSources));
6774:    assets_registry_path: paths.assetsRegistryPath,
6775:    source_of_truth_registry_path: paths.sourceOfTruthRegistryPath,
6776:    ai_memory_path: paths.aiMemoryPath,
6790:    paths.campaignsDir,
6826:    required_assets: ['logo', 'brand_profile', 'hero_images', 'legal_info'],
6827:    data_requirements: ['business_profile', 'target_audience', 'offers', 'contact_details'],
6829:    workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'publishing'],
6830:    ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'analyst'],
6833:      'upload_brand_assets',
6836:      'create_first_campaign'
6846:      required_assets: ['logo', 'product_photos', 'product_catalog', 'price_list', 'shipping_policy', 'legal_docs'],
6848:      content_categories: ['product_launch', 'before_after', 'offers', 'how_to_use', 'reviews'],
6849:      workspace_priorities: ['setup', 'library', 'campaign-studio', 'content-studio', 'media-studio', 'publishing', 'insights'],
6850:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'ads_operator', 'analyst', 'compliance_reviewer'],
6851:      starter_checklist: ['add_products', 'upload_product_media', 'define_shipping', 'connect_woocommerce', 'create_launch_campaign'],
6852:      recommended_integrations: ['woocommerce', 'google', 'meta', 'tiktok', 'email_crm']
6859:      required_assets: ['artist_photos', 'logo_or_signature', 'press_kit', 'music_links', 'video_clips'],
6862:      workspace_priorities: ['setup', 'library', 'media-studio', 'content-studio', 'campaign-studio', 'publishing'],
6863:      ai_team_defaults: ['strategist', 'writer', 'designer', 'video_lead', 'publisher', 'analyst'],
6864:      starter_checklist: ['complete_artist_profile', 'upload_press_photos', 'add_music_links', 'define_fan_audience', 'create_release_campaign'],
6872:      required_assets: ['logo', 'salon_photos', 'service_menu', 'price_list', 'before_after_media'],
6873:      data_requirements: ['services', 'staff', 'booking_info', 'location', 'offers', 'reviews'],
6874:      content_categories: ['services', 'before_after', 'offers', 'team', 'client_reviews'],
6875:      workspace_priorities: ['setup', 'library', 'media-studio', 'content-studio', 'publishing', 'insights'],
6876:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'analyst'],
6877:      starter_checklist: ['add_services', 'upload_before_after_media', 'add_booking_details', 'connect_google_business', 'create_local_campaign'],
6885:      required_assets: ['logo', 'property_photos', 'property_documents', 'location_media', 'agent_profile'],
6888:      workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'ads-manager', 'governance'],
6889:      ai_team_defaults: ['strategist', 'writer', 'designer', 'ads_operator', 'publisher', 'compliance_reviewer'],
6890:      starter_checklist: ['add_property_data', 'upload_property_media', 'define_lead_flow', 'connect_crm', 'create_listing_campaign'],
6891:      recommended_integrations: ['website', 'crm', 'google', 'meta', 'email_crm']
6898:      required_assets: ['logo', 'service_list', 'case_studies', 'testimonials'],
6901:      workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'publishing'],
6902:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'analyst'],
6903:      starter_checklist: ['define_services', 'add_service_area', 'upload_testimonials', 'connect_contact_flow', 'create_offer_campaign'],
6904:      recommended_integrations: ['website', 'google_business', 'meta', 'email_crm']
6911:      required_assets: ['logo', 'menu', 'food_photos', 'location_photos', 'offers'],
6913:      content_categories: ['menu_highlights', 'daily_specials', 'behind_the_kitchen', 'reviews', 'events'],
6914:      workspace_priorities: ['setup', 'library', 'media-studio', 'publishing', 'campaign-studio'],
6915:      ai_team_defaults: ['strategist', 'writer', 'designer', 'video_lead', 'publisher'],
6924:      required_assets: ['logo', 'case_studies', 'services_deck', 'client_testimonials'],
6927:      workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'insights', 'workflows'],
6928:      ai_team_defaults: ['strategist', 'writer', 'designer', 'ads_operator', 'analyst'],
6929:      starter_checklist: ['define_services', 'add_case_studies', 'define_lead_offer', 'connect_crm', 'create_lead_campaign'],
6937:      required_assets: ['logo', 'location_photos', 'service_or_product_list', 'reviews'],
6938:      data_requirements: ['opening_hours', 'location', 'offers', 'contact_details', 'reviews'],
6939:      content_categories: ['local_offers', 'reviews', 'services', 'community', 'faq'],
6940:      workspace_priorities: ['setup', 'library', 'content-studio', 'publishing', 'insights'],
6941:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher'],
6979:    required_assets: businessTemplate.required_assets,
6983:    ai_team_defaults: businessTemplate.ai_team_defaults,
6992:      brand_assets: paths.brandAssetsDir,
6996:      campaigns: paths.campaignsDir,
7051:    brand_assets: normalizeSetupTextValue(input.brand_assets),
7054:    campaign_docs: normalizeSetupTextValue(input.campaign_docs)
7146:function reviewProject(projectName) {
7156:function reviewProjectCanonicalParity(projectName) {
7162:  const domains = [
7164:      domain: 'brand_profile',
7169:      domain: 'assets_registry',
7170:      canonical_path: paths.assetsRegistryPath,
7171:      legacy_path: paths.legacy.assetsRegistryPath
7174:      domain: 'source_of_truth_registry',
7175:      canonical_path: paths.sourceOfTruthRegistryPath,
7176:      legacy_path: paths.sourcesRegistryPath
7180:  domains.forEach((item) => {
7186:    if (item.domain === 'source_of_truth_registry') {
7187:      // Deterministic: compare only flat sources map, ignore wrapper metadata
7200:        domain: item.domain,
7210:      domain: item.domain,
7231:      : 'Canonical files are aligned with available legacy data.'
7243:function reviewProjectReadiness(projectName) {
7254:  const sourceRegistry = buildSourceOfTruthRegistry(readJsonFile(paths.sourcesRegistryPath, {}));
7255:  const missingAssets = reviewProjectMissingAssets(safeProject);
7256:  const connectorReadiness = reviewProjectConnectorReadiness(safeProject);
7257:  const parityReport = reviewProjectCanonicalParity(safeProject);
7258:  const campaigns = listCampaigns(safeProject, { limit: 50 });
7259:  const aiMemoryItems = listAiMemory(safeProject, { limit: 20 });
7278:  const requiredSourceEntries = sourceRegistry.required_sources && typeof sourceRegistry.required_sources === 'object'
7279:    ? Object.values(sourceRegistry.required_sources)
7281:  const sourceCompleteCount = requiredSourceEntries
7284:  const sourceOfTruthCompleteness = requiredSourceEntries.length
7285:    ? Math.round((sourceCompleteCount / requiredSourceEntries.length) * 100)
7288:  const assetBlockers = Array.isArray(missingAssets.blockers) ? missingAssets.blockers.length : 0;
7289:  const requiredAssetCount = Array.isArray(missingAssets.required_asset_types) ? missingAssets.required_asset_types.length : 0;
7290:  const assetsCompleteness = requiredAssetCount
7291:    ? Math.max(0, Math.round(((requiredAssetCount - assetBlockers) / requiredAssetCount) * 100))
7295:  const campaignReadiness = campaigns.length > 0 ? 100 : 40;
7298:  const aiMemoryReadiness = fs.existsSync(paths.aiMemoryPath)
7299:    ? (aiMemoryItems.length > 0 ? 100 : 75)
7302:  const domainScores = {
7305:    source_of_truth_completeness: sourceOfTruthCompleteness,
