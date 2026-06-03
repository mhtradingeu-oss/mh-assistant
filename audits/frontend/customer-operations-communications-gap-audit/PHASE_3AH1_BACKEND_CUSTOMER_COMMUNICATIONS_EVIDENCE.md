# PHASE 3AH.1 — Backend Customer / Communications Evidence

## Backend customer/CRM/message/call/IVR route evidence
runtime/orchestrator-service/server.js:60:  isSupportedProvider,
runtime/orchestrator-service/server.js:61:  getUnsupportedProviderMessage
runtime/orchestrator-service/server.js:121:  createCustomerOperationsRuntime
runtime/orchestrator-service/server.js:122:} = require('./lib/customer-operations/customer-operations-runtime');
runtime/orchestrator-service/server.js:227:  /^\/execute_email_package\/?$/i,
runtime/orchestrator-service/server.js:423:    message: 'Too many requests. Please retry shortly.'
runtime/orchestrator-service/server.js:769:const EMAIL_ARTIFACT_TYPES = Object.freeze({
runtime/orchestrator-service/server.js:770:  PREPARE_PACKAGE: 'email_prepare_package',
runtime/orchestrator-service/server.js:771:  PREPARED_HTML: 'email_prepared_html',
runtime/orchestrator-service/server.js:772:  PREPARED_PACKAGE: 'email_prepared_package',
runtime/orchestrator-service/server.js:773:  DELIVERY_RECORD: 'email_delivery_record',
runtime/orchestrator-service/server.js:774:  DRAFT_QUEUE: 'email_draft_queue',
runtime/orchestrator-service/server.js:775:  MEDIA_QUEUE: 'email_media_queue'
runtime/orchestrator-service/server.js:788:function sanitizeErrorMessage(rawMessage, fallbackMessage) {
runtime/orchestrator-service/server.js:789:  const fallback = String(fallbackMessage || 'Request failed').trim() || 'Request failed';
runtime/orchestrator-service/server.js:790:  const value = String(rawMessage || '').replace(/[\r\n\t]+/g, ' ').trim();
runtime/orchestrator-service/server.js:816:  message = 'Request failed'
runtime/orchestrator-service/server.js:822:      message: sanitizeErrorMessage(message, 'Request failed')
runtime/orchestrator-service/server.js:831:    message: 'Invalid project slug'
runtime/orchestrator-service/server.js:895:    if (req.body && Object.prototype.hasOwnProperty.call(req.body, 'project')) {
runtime/orchestrator-service/server.js:899:    if (req.query && Object.prototype.hasOwnProperty.call(req.query, 'project')) {
runtime/orchestrator-service/server.js:920:    return sanitizeErrorMessage(payload, 'Request failed');
runtime/orchestrator-service/server.js:1019:    checks.project_registry_load.error = sanitizeErrorMessage(error.message, 'Failed to load project registry');
runtime/orchestrator-service/server.js:1065:  email: {
runtime/orchestrator-service/server.js:1339:function getEmailDomainPaths(projectName) {
runtime/orchestrator-service/server.js:1342:    domain: 'email',
runtime/orchestrator-service/server.js:1353:    canonicalEmailDir: path.join(resolution.executionRoot, 'email'),
runtime/orchestrator-service/server.js:1354:    legacyEmailDir: path.join(resolution.legacyRoot, 'email'),
runtime/orchestrator-service/server.js:1355:    canonicalLiveContentDir: path.join(EXECUTION_DIR, 'projects', safeProject, 'content', 'email'),
runtime/orchestrator-service/server.js:1356:    legacyLiveContentDir: path.join(EXECUTION_DIR, safeProject, 'content', 'email'),
runtime/orchestrator-service/server.js:1357:    canonicalLiveMediaQueueDir: path.join(EXECUTION_DIR, 'projects', safeProject, 'media', 'queue'),
runtime/orchestrator-service/server.js:1362:function getEmailArtifactContract(projectName, artifactType) {
runtime/orchestrator-service/server.js:1363:  const paths = getEmailDomainPaths(projectName);
runtime/orchestrator-service/server.js:1366:    [EMAIL_ARTIFACT_TYPES.PREPARE_PACKAGE]: {
runtime/orchestrator-service/server.js:1369:      relativePath: 'email-prepare-package.json',
runtime/orchestrator-service/server.js:1371:      requestedFile: 'email-prepare-package.json',
runtime/orchestrator-service/server.js:1372:      pathContract: 'execution/projects/<project>/email-prepare-package.json -> brand-assets/<project>/email-prepare-package.json'
runtime/orchestrator-service/server.js:1374:    [EMAIL_ARTIFACT_TYPES.PREPARED_HTML]: {
runtime/orchestrator-service/server.js:1375:      canonicalBase: paths.canonicalEmailDir,
runtime/orchestrator-service/server.js:1376:      legacyBase: paths.legacyEmailDir,
runtime/orchestrator-service/server.js:1379:      requestedFile: 'email/html/*.html',
runtime/orchestrator-service/server.js:1380:      pathContract: 'execution/projects/<project>/email/html/<package>.html -> brand-assets/<project>/email/html/<package>.html'
runtime/orchestrator-service/server.js:1382:    [EMAIL_ARTIFACT_TYPES.PREPARED_PACKAGE]: {
runtime/orchestrator-service/server.js:1383:      canonicalBase: paths.canonicalEmailDir,
runtime/orchestrator-service/server.js:1384:      legacyBase: paths.legacyEmailDir,
runtime/orchestrator-service/server.js:1387:      requestedFile: 'email/prepared/*.json',
runtime/orchestrator-service/server.js:1388:      pathContract: 'execution/projects/<project>/email/prepared/<package>.json -> brand-assets/<project>/email/prepared/<package>.json'
runtime/orchestrator-service/server.js:1390:    [EMAIL_ARTIFACT_TYPES.DELIVERY_RECORD]: {
runtime/orchestrator-service/server.js:1391:      canonicalBase: paths.canonicalEmailDir,
runtime/orchestrator-service/server.js:1392:      legacyBase: paths.legacyEmailDir,
runtime/orchestrator-service/server.js:1395:      requestedFile: 'email/delivery/*.json',
runtime/orchestrator-service/server.js:1396:      pathContract: 'execution/projects/<project>/email/delivery/<send>.json -> brand-assets/<project>/email/delivery/<send>.json'
runtime/orchestrator-service/server.js:1398:    [EMAIL_ARTIFACT_TYPES.DRAFT_QUEUE]: {
runtime/orchestrator-service/server.js:1399:      canonicalBase: paths.canonicalLiveContentDir,
runtime/orchestrator-service/server.js:1401:      relativePath: 'email-queue.json',
runtime/orchestrator-service/server.js:1403:      requestedFile: 'content/email/email-queue.json',
runtime/orchestrator-service/server.js:1404:      pathContract: 'execution/projects/<project>/content/email/email-queue.json -> execution/<project>/content/email/email-queue.json'
runtime/orchestrator-service/server.js:1406:    [EMAIL_ARTIFACT_TYPES.MEDIA_QUEUE]: {
runtime/orchestrator-service/server.js:1407:      canonicalBase: paths.canonicalLiveMediaQueueDir,
runtime/orchestrator-service/server.js:1409:      relativePath: 'email-image-queue.json',
runtime/orchestrator-service/server.js:1411:      requestedFile: 'media/queue/email-image-queue.json',
runtime/orchestrator-service/server.js:1412:      pathContract: 'execution/projects/<project>/media/queue/email-image-queue.json -> execution/<project>/media/queue/email-image-queue.json'
runtime/orchestrator-service/server.js:1419:    throw new Error(`Unsupported email artifact contract: ${artifactType}`);
runtime/orchestrator-service/server.js:1430:function resolveEmailReadCandidate(options = {}) {
runtime/orchestrator-service/server.js:1433:  const contract = getEmailArtifactContract(safeProject, artifactType);
runtime/orchestrator-service/server.js:1440:    domain: 'email',
runtime/orchestrator-service/server.js:1453:function readEmailArtifactArray(projectName, artifactType, requestedIdentifier) {
runtime/orchestrator-service/server.js:1454:  const candidate = resolveEmailReadCandidate({
runtime/orchestrator-service/server.js:1466:function writeEmailArtifactArray(projectName, artifactType, data) {
runtime/orchestrator-service/server.js:1467:  const contract = getEmailArtifactContract(projectName, artifactType);
runtime/orchestrator-service/server.js:1494:function readLiveEmailQueue(projectName, requestedIdentifier = 'email-draft-queue') {
runtime/orchestrator-service/server.js:1495:  return readEmailArtifactArray(requireQueueProjectName(projectName), EMAIL_ARTIFACT_TYPES.DRAFT_QUEUE, requestedIdentifier);
runtime/orchestrator-service/server.js:1498:function writeLiveEmailQueue(projectName, queue = []) {
runtime/orchestrator-service/server.js:1499:  return writeEmailArtifactArray(requireQueueProjectName(projectName), EMAIL_ARTIFACT_TYPES.DRAFT_QUEUE, queue);
runtime/orchestrator-service/server.js:1502:function readLiveEmailMediaQueue(projectName, requestedIdentifier = 'email-media-queue') {
runtime/orchestrator-service/server.js:1503:  return readEmailArtifactArray(requireQueueProjectName(projectName), EMAIL_ARTIFACT_TYPES.MEDIA_QUEUE, requestedIdentifier);
runtime/orchestrator-service/server.js:1506:function writeLiveEmailMediaQueue(projectName, queue = []) {
runtime/orchestrator-service/server.js:1507:  return writeEmailArtifactArray(requireQueueProjectName(projectName), EMAIL_ARTIFACT_TYPES.MEDIA_QUEUE, queue);
runtime/orchestrator-service/server.js:1560:  'email',
runtime/orchestrator-service/server.js:1711:      if (!Object.prototype.hasOwnProperty.call(stats.fallback_causes, cause)) {
runtime/orchestrator-service/server.js:1856:function evaluateEmailReadiness(projectName) {
runtime/orchestrator-service/server.js:1887:function getEmailPreparePaths(projectName) {
runtime/orchestrator-service/server.js:1889:  const contract = getEmailArtifactContract(safeProject, EMAIL_ARTIFACT_TYPES.PREPARE_PACKAGE);
runtime/orchestrator-service/server.js:1928:function buildEmailPreparePackage(projectName) {
runtime/orchestrator-service/server.js:1929:  const preparePaths = getEmailPreparePaths(projectName);
runtime/orchestrator-service/server.js:1930:  const readiness = evaluateEmailReadiness(projectName);
runtime/orchestrator-service/server.js:1941:    email_asset: {
runtime/orchestrator-service/server.js:1953:    domain: 'email',
runtime/orchestrator-service/server.js:1954:    artifactType: 'email_prepare_package',
runtime/orchestrator-service/server.js:1962:function buildEmailHtmlFromPreparePackage(packageData) {
runtime/orchestrator-service/server.js:1963:  const subject = packageData.email_asset.subject || 'Campaign Update';
runtime/orchestrator-service/server.js:1964:  const headline = packageData.email_asset.headline || 'New Campaign Asset';
runtime/orchestrator-service/server.js:1965:  const body = packageData.email_asset.body || '';
runtime/orchestrator-service/server.js:1966:  const cta = packageData.email_asset.cta || 'Learn More';
runtime/orchestrator-service/server.js:2010:function autoPrepareEmailAsset(projectName, rawText = '') {
runtime/orchestrator-service/server.js:2011:  const preparePaths = getEmailPreparePaths(projectName);
runtime/orchestrator-service/server.js:2012:  const packageData = buildEmailPreparePackage(projectName);
runtime/orchestrator-service/server.js:2018:  const subject = extractFlagValue(rawText, 'subject') || packageData.email_asset.subject;
runtime/orchestrator-service/server.js:2019:  const headline = extractFlagValue(rawText, 'headline') || packageData.email_asset.headline;
runtime/orchestrator-service/server.js:2020:  const body = extractFlagValue(rawText, 'body') || packageData.email_asset.body;
runtime/orchestrator-service/server.js:2021:  const cta = extractFlagValue(rawText, 'cta') || packageData.email_asset.cta;
runtime/orchestrator-service/server.js:2026:  packageData.email_asset.subject = subject;
runtime/orchestrator-service/server.js:2027:  packageData.email_asset.headline = headline;
runtime/orchestrator-service/server.js:2028:  packageData.email_asset.body = body;
runtime/orchestrator-service/server.js:2029:  packageData.email_asset.cta = cta;
runtime/orchestrator-service/server.js:2030:  packageData.email_asset.cta_url = ctaUrl;
runtime/orchestrator-service/server.js:2031:  packageData.email_asset.public_image_url = publicImageUrl;
runtime/orchestrator-service/server.js:2033:  packageData.email_asset.html = buildHardenedEmailHtml(packageData);
runtime/orchestrator-service/server.js:2035:  const htmlDir = path.join(preparePaths.legacyBaseDir, 'email', 'html');
runtime/orchestrator-service/server.js:2036:  const preparedDir = path.join(preparePaths.legacyBaseDir, 'email', 'prepared');
runtime/orchestrator-service/server.js:2040:  const packageId = `emailprep_${Date.now()}`;
runtime/orchestrator-service/server.js:2046:    domain: 'email',
runtime/orchestrator-service/server.js:2047:    artifactType: 'email_prepared_html',
runtime/orchestrator-service/server.js:2050:    payload: packageData.email_asset.html,
runtime/orchestrator-service/server.js:2054:  const validation = validateEmailPreparePackage(packageData);
runtime/orchestrator-service/server.js:2063:    packageData.email_asset.ready_for_send = true;
runtime/orchestrator-service/server.js:2066:    packageData.email_asset.ready_for_send = false;
runtime/orchestrator-service/server.js:2071:    domain: 'email',
runtime/orchestrator-service/server.js:2072:    artifactType: 'email_prepared_package',
runtime/orchestrator-service/server.js:2079:    domain: 'email',
runtime/orchestrator-service/server.js:2080:    artifactType: 'email_prepare_package',
runtime/orchestrator-service/server.js:2089:function reviewEmailPreparePackage(projectName) {
runtime/orchestrator-service/server.js:2090:  const prepareFile = resolveEmailReadCandidate({
runtime/orchestrator-service/server.js:2092:    artifactType: EMAIL_ARTIFACT_TYPES.PREPARE_PACKAGE,
runtime/orchestrator-service/server.js:2094:    requestedFile: 'email-prepare-package.json'
runtime/orchestrator-service/server.js:2098:    throw new Error('Email prepare package not found');
runtime/orchestrator-service/server.js:2125:function validateEmailPreparePackage(packageData) {
runtime/orchestrator-service/server.js:2129:  const subject = String(packageData.email_asset?.subject || '').trim();
runtime/orchestrator-service/server.js:2130:  const headline = String(packageData.email_asset?.headline || '').trim();
runtime/orchestrator-service/server.js:2131:  const body = String(packageData.email_asset?.body || '').trim();
runtime/orchestrator-service/server.js:2132:  const cta = String(packageData.email_asset?.cta || '').trim();
runtime/orchestrator-service/server.js:2133:  const url = String(packageData.email_asset?.cta_url || '').trim();
runtime/orchestrator-service/server.js:2134:  const html = String(packageData.email_asset?.html || '').trim();
runtime/orchestrator-service/server.js:2135:  const publicImageUrl = String(packageData.email_asset?.public_image_url || '').trim();
runtime/orchestrator-service/server.js:2137:  if (!subject) errors.push('Missing email subject');
runtime/orchestrator-service/server.js:2138:  if (!headline) errors.push('Missing email headline');
runtime/orchestrator-service/server.js:2139:  if (!body) errors.push('Missing email body');
runtime/orchestrator-service/server.js:2167:function buildHardenedEmailHtml(packageData) {
runtime/orchestrator-service/server.js:2168:  const subject = packageData.email_asset.subject;
runtime/orchestrator-service/server.js:2169:  const headline = packageData.email_asset.headline;
runtime/orchestrator-service/server.js:2170:  const body = packageData.email_asset.body;
runtime/orchestrator-service/server.js:2171:  const cta = packageData.email_asset.cta;
runtime/orchestrator-service/server.js:2172:  const ctaUrl = packageData.email_asset.cta_url;
runtime/orchestrator-service/server.js:2173:  const publicImageUrl = packageData.email_asset.public_image_url;
runtime/orchestrator-service/server.js:2386:Create a realistic, premium, cinematic, marketing-grade visual that supports the campaign objective while preserving the exact product identity.
runtime/orchestrator-service/server.js:2473:function getEmailDeliveryPaths(projectName) {
runtime/orchestrator-service/server.js:2475:  const emailPaths = getEmailDomainPaths(safeProject);
runtime/orchestrator-service/server.js:2476:  const baseDir = emailPaths.canonicalEmailDir;
runtime/orchestrator-service/server.js:2479:  const legacyBaseDir = emailPaths.legacyEmailDir;
runtime/orchestrator-service/server.js:2500:function getLatestPreparedEmailPackage(projectName) {
runtime/orchestrator-service/server.js:2501:  const preparedDir = resolveEmailReadCandidate({
runtime/orchestrator-service/server.js:2503:    artifactType: EMAIL_ARTIFACT_TYPES.PREPARED_PACKAGE,
runtime/orchestrator-service/server.js:2505:    requestedIdentifier: 'latest-prepared-email-package',
runtime/orchestrator-service/server.js:2506:    requestedFile: 'email/prepared/*.json'
runtime/orchestrator-service/server.js:2515:    throw new Error('No prepared email package found');
runtime/orchestrator-service/server.js:2522:function evaluatePreparedEmailForSend(projectName) {
runtime/orchestrator-service/server.js:2523:  const pkg = getLatestPreparedEmailPackage(projectName);
runtime/orchestrator-service/server.js:2534:    result.blocking_reasons.push('Prepared email package is not ready_for_send');
runtime/orchestrator-service/server.js:2539:    result.blocking_reasons.push('Prepared email package validation failed');
runtime/orchestrator-service/server.js:2542:  if (!pkg.email_asset || !pkg.email_asset.html) {
runtime/orchestrator-service/server.js:2544:    result.blocking_reasons.push('Missing email HTML');
runtime/orchestrator-service/server.js:2547:  if (!pkg.email_asset || !pkg.email_asset.public_image_url) {
runtime/orchestrator-service/server.js:2552:  if (!pkg.email_asset || !pkg.email_asset.cta_url) {
runtime/orchestrator-service/server.js:2560:function writeEmailDeliveryRecord(projectName, data) {
runtime/orchestrator-service/server.js:2561:  const paths = getEmailDeliveryPaths(projectName);
runtime/orchestrator-service/server.js:2562:  const deliveryId = `emailsend_${Date.now()}`;
runtime/orchestrator-service/server.js:2574:    domain: 'email',
runtime/orchestrator-service/server.js:2575:    artifactType: 'email_delivery_record',
runtime/orchestrator-service/server.js:2582:async function sendPreparedEmail(projectName, toEmail) {
runtime/orchestrator-service/server.js:2583:  const readiness = evaluatePreparedEmailForSend(projectName);
runtime/orchestrator-service/server.js:2586:    return writeEmailDeliveryRecord(projectName, {
runtime/orchestrator-service/server.js:2588:      to_email: toEmail,
runtime/orchestrator-service/server.js:2594:  const pkg = getLatestPreparedEmailPackage(projectName);
runtime/orchestrator-service/server.js:2598:  // مثل SMTP / WordPress mail bridge / provider API
runtime/orchestrator-service/server.js:2601:  return writeEmailDeliveryRecord(projectName, {
runtime/orchestrator-service/server.js:2603:    to_email: toEmail,
runtime/orchestrator-service/server.js:2605:    subject: pkg.email_asset.subject,
runtime/orchestrator-service/server.js:2703:async function syncAllWooProducts(projectName) {
runtime/orchestrator-service/server.js:2838:    instagram_post: {
runtime/orchestrator-service/server.js:2839:      platform: 'instagram',
runtime/orchestrator-service/server.js:2846:    instagram_reel: {
runtime/orchestrator-service/server.js:2847:      platform: 'instagram',
runtime/orchestrator-service/server.js:2879:    throw new Error('Unsupported Meta placement');
runtime/orchestrator-service/server.js:2932:    throw new Error('Unsupported Meta placement');
runtime/orchestrator-service/server.js:3161:    throw new Error('Unsupported YouTube format');
runtime/orchestrator-service/server.js:3180:      : 'CTR-first via title-thumbnail fit, then watch-time support through structure.',
runtime/orchestrator-service/server.js:3189:    throw new Error('Unsupported YouTube format');
runtime/orchestrator-service/server.js:3246:          '10-20s: premium message',
runtime/orchestrator-service/server.js:3351:    throw new Error('Unsupported marketplace');
runtime/orchestrator-service/server.js:3496:  throw new Error('Unsupported marketplace');
runtime/orchestrator-service/server.js:3524:    throw new Error('Unsupported marketplace');
runtime/orchestrator-service/server.js:3673:  const supportProducts = launchReadyProducts.slice(3, 10);
runtime/orchestrator-service/server.js:3689:      support_products: supportProducts.map(p => ({
runtime/orchestrator-service/server.js:3698:      support_count: supportProducts.length,
runtime/orchestrator-service/server.js:3702:      'instagram',
runtime/orchestrator-service/server.js:3705:      'email',
runtime/orchestrator-service/server.js:3710:      instagram: 'daily',
runtime/orchestrator-service/server.js:3713:      email: '1x_per_week',
runtime/orchestrator-service/server.js:3801:    channels: ['instagram', 'tiktok', 'facebook', 'email'],
runtime/orchestrator-service/server.js:4048:      channel === 'email'
runtime/orchestrator-service/server.js:4049:        ? 'email'
runtime/orchestrator-service/server.js:4050:        : ['instagram', 'facebook', 'tiktok', 'youtube'].includes(channel)
runtime/orchestrator-service/server.js:4059:    cta: String(input.cta || base.cta || (channel === 'email' ? 'Review email' : 'Shop now')).trim(),
runtime/orchestrator-service/server.js:4214:      connector_error: error.message || 'Connector payload unavailable'
runtime/orchestrator-service/server.js:4440:  if ((asset.caption || '').length > 220 && ['instagram', 'facebook'].includes(String(channel).toLowerCase())) {
runtime/orchestrator-service/server.js:4497:  if (normalizedChannel === 'instagram' || normalizedChannel === 'facebook') {
runtime/orchestrator-service/server.js:4505:  if (normalizedChannel === 'email') {
runtime/orchestrator-service/server.js:4895:  if (assetType === 'ad' || assetType === 'blog_image' || assetType === 'email_hero') {
runtime/orchestrator-service/server.js:4971:  if ((assetType === 'ad' || assetType === 'email_hero' || assetType === 'blog_visual') && !truth.product) {
runtime/orchestrator-service/server.js:4976:  if ((assetType === 'ad' || assetType === 'email_hero' || assetType === 'blog_visual') && !truth.packaging) {
runtime/orchestrator-service/server.js:5256:    console.warn(`[server] readJsonFile: non-fatal read/parse error for ${filePath}, returning fallback. Error: ${err.message}`);
runtime/orchestrator-service/server.js:5295:      new Error(`[server] Atomic rename failed for ${filePath}: ${err.message}`),
runtime/orchestrator-service/server.js:5556:    payload.errors.tree = error.message;
runtime/orchestrator-service/server.js:5562:    payload.errors.registry = error.message;
runtime/orchestrator-service/server.js:5566:    const message = 'Project profile not found';
runtime/orchestrator-service/server.js:5567:    payload.errors.overview = message;
runtime/orchestrator-service/server.js:5568:    payload.errors.assets = message;
runtime/orchestrator-service/server.js:5569:    payload.errors.connectors = message;
runtime/orchestrator-service/server.js:5570:    payload.errors.readiness = message;
runtime/orchestrator-service/server.js:5571:    payload.errors.activity = message;
runtime/orchestrator-service/server.js:5572:    payload.errors.operations = message;
runtime/orchestrator-service/server.js:5589:      payload.errors[key] = error.message;
runtime/orchestrator-service/server.js:5620:function detectProject(message) {
runtime/orchestrator-service/server.js:5621:  const text = String(message || '').toLowerCase();
runtime/orchestrator-service/server.js:5782:function detectTaskType(message) {
runtime/orchestrator-service/server.js:5783:  const text = String(message || '').toLowerCase();
runtime/orchestrator-service/server.js:6007:function decideMode(message) {
runtime/orchestrator-service/server.js:6008:  const text = String(message || '').toLowerCase();
runtime/orchestrator-service/server.js:6048:  message,
runtime/orchestrator-service/server.js:6054:  const project = detectProject(message);
runtime/orchestrator-service/server.js:6055:  const taskType = detectTaskType(message);
runtime/orchestrator-service/server.js:6056:  const mode = decideMode(message);
runtime/orchestrator-service/server.js:6088:    message_received: message,
runtime/orchestrator-service/server.js:6116:    message
runtime/orchestrator-service/server.js:6354:    social_links: ['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin', 'x', 'pinterest'],
runtime/orchestrator-service/server.js:6414:    tone: projectData.tone || projectData.brand_voice || '',
runtime/orchestrator-service/server.js:6415:    brand_voice: projectData.brand_voice || '',
runtime/orchestrator-service/server.js:6694:    default_channels: ['website', 'instagram', 'facebook'],
runtime/orchestrator-service/server.js:6714:      default_channels: ['website', 'woocommerce', 'instagram', 'facebook', 'google', 'tiktok'],
runtime/orchestrator-service/server.js:6721:      recommended_integrations: ['woocommerce', 'google', 'meta', 'tiktok', 'email_crm']
runtime/orchestrator-service/server.js:6727:      default_channels: ['instagram', 'tiktok', 'youtube', 'spotify', 'website'],
runtime/orchestrator-service/server.js:6734:      recommended_integrations: ['youtube', 'instagram', 'tiktok', 'spotify', 'website']
runtime/orchestrator-service/server.js:6740:      default_channels: ['instagram', 'tiktok', 'google_business', 'website', 'facebook'],
runtime/orchestrator-service/server.js:6747:      recommended_integrations: ['google_business', 'instagram', 'tiktok', 'website', 'booking']
runtime/orchestrator-service/server.js:6753:      default_channels: ['website', 'facebook', 'instagram', 'google', 'crm'],
runtime/orchestrator-service/server.js:6759:      starter_checklist: ['add_property_data', 'upload_property_media', 'define_lead_flow', 'connect_crm', 'create_listing_campaign'],
runtime/orchestrator-service/server.js:6760:      recommended_integrations: ['website', 'crm', 'google', 'meta', 'email_crm']
runtime/orchestrator-service/server.js:6766:      default_channels: ['website', 'google_business', 'instagram', 'facebook'],
runtime/orchestrator-service/server.js:6773:      recommended_integrations: ['website', 'google_business', 'meta', 'email_crm']
runtime/orchestrator-service/server.js:6779:      default_channels: ['instagram', 'tiktok', 'google_business', 'website', 'facebook'],
runtime/orchestrator-service/server.js:6786:      recommended_integrations: ['google_business', 'instagram', 'tiktok', 'website', 'delivery']
runtime/orchestrator-service/server.js:6792:      default_channels: ['website', 'linkedin', 'instagram', 'facebook'],
runtime/orchestrator-service/server.js:6798:      starter_checklist: ['define_services', 'add_case_studies', 'define_lead_offer', 'connect_crm', 'create_lead_campaign'],
runtime/orchestrator-service/server.js:6799:      recommended_integrations: ['website', 'linkedin', 'meta', 'google', 'crm']
runtime/orchestrator-service/server.js:6805:      default_channels: ['google_business', 'website', 'instagram', 'facebook'],
runtime/orchestrator-service/server.js:6913:    tone: normalizeSetupTextValue(input.tone || input.brand_voice),
runtime/orchestrator-service/server.js:6933:    brand_voice: normalizeSetupTextValue(input.brand_voice),
runtime/orchestrator-service/server.js:6962:    throw new Error('Project rename is not supported by Setup persistence');
runtime/orchestrator-service/server.js:7436:  instagram: 'instagram',
runtime/orchestrator-service/server.js:7440:  email: 'smtp',
runtime/orchestrator-service/server.js:7891:  if (!isSupportedProvider(normalizedId)) {
runtime/orchestrator-service/server.js:7892:    throw Object.assign(new Error(getUnsupportedProviderMessage(normalizedId)), {
runtime/orchestrator-service/server.js:7893:      status: 'unsupported_provider'
runtime/orchestrator-service/server.js:7993:      last_error: normalizeTextValue(error.message || 'Integration validation failed'),
runtime/orchestrator-service/server.js:7994:      notes: normalizeTextValue(error.message || nextRecord.notes),
runtime/orchestrator-service/server.js:7995:      health_summary: normalizeTextValue(error.message || ''),
runtime/orchestrator-service/server.js:8005:        last_error: normalizeTextValue(error.message || 'Integration validation failed'),
runtime/orchestrator-service/server.js:8006:        health_summary: normalizeTextValue(error.message || '')
runtime/orchestrator-service/server.js:8013:    throw Object.assign(new Error(normalizeTextValue(error.message || 'Integration validation failed')), {
runtime/orchestrator-service/server.js:8064:  if (actionType !== 'disconnect' && !isSupportedProvider(normalizedId)) {
runtime/orchestrator-service/server.js:8065:    throw Object.assign(new Error(getUnsupportedProviderMessage(normalizedId)), {
runtime/orchestrator-service/server.js:8066:      status: 'unsupported_provider'
runtime/orchestrator-service/server.js:8123:        throw new Error('Unsupported integration action');
runtime/orchestrator-service/server.js:8132:      nextRecord.last_error = normalizeTextValue(error.message || 'Provider action failed');
runtime/orchestrator-service/server.js:8133:      nextRecord.notes = normalizeTextValue(error.message || nextRecord.notes);
runtime/orchestrator-service/server.js:8134:      nextRecord.health_summary = normalizeTextValue(error.message || '');
runtime/orchestrator-service/server.js:8216:      description: 'Brand identity, voice, visual rules, and usage guidance.',
runtime/orchestrator-service/server.js:8330:        what_to_upload: 'Campaign banners, ad creative, landing-page assets, email hero files, export packs, and wave-specific files.',
runtime/orchestrator-service/server.js:8360:      description: 'Customer proof, reviews, testimonial exports, and approved quotes.',
runtime/orchestrator-service/server.js:9046:    instagram: hasSource('instagram'),
runtime/orchestrator-service/server.js:9050:    email: hasSource('email'),
runtime/orchestrator-service/server.js:9255:      error: error.message || 'Failed to summarize project parity readiness'
runtime/orchestrator-service/server.js:9266:      error: error.message || 'Failed to summarize project parity readiness'
runtime/orchestrator-service/server.js:9277:      error: error.message || 'Failed to summarize storage parity readiness'
runtime/orchestrator-service/server.js:9288:      error: error.message || 'Failed to summarize storage parity readiness'
runtime/orchestrator-service/server.js:9294:  const message = req.body.message || '';
runtime/orchestrator-service/server.js:9295:  const result = buildTaskResult({ message });
runtime/orchestrator-service/server.js:9313:    res.json({ error: err.message });
runtime/orchestrator-service/server.js:9329:    res.json({ error: err.message });
runtime/orchestrator-service/server.js:9334:  const message = req.body.message || req.body.text || req.body.input || '';
runtime/orchestrator-service/server.js:9340:    message,
runtime/orchestrator-service/server.js:9366:      supported_execution_states: EXECUTION_BRIDGE_STATES
runtime/orchestrator-service/server.js:9392:        error: error.message,
runtime/orchestrator-service/server.js:9402:      message: error.message || 'Failed to execute publish package'
runtime/orchestrator-service/server.js:9407:app.post('/execute_email_package', (req, res) => {
runtime/orchestrator-service/server.js:9412:    const emailPackage = resolveEmailPackageForExecution(projectName, req.body || {});
runtime/orchestrator-service/server.js:9413:    const readyPayload = buildEmailReadyPayload(emailPackage);
runtime/orchestrator-service/server.js:9418:      campaign_name: String(emailPackage.campaign_name || req.body?.campaign_name || '').trim(),
runtime/orchestrator-service/server.js:9424:      supported_execution_states: EXECUTION_BRIDGE_STATES
runtime/orchestrator-service/server.js:9427:    const log = writeExecutionBridgeLog(projectName, 'execute_email_package', {
runtime/orchestrator-service/server.js:9446:      writeExecutionBridgeLog(logProject, 'execute_email_package', {
runtime/orchestrator-service/server.js:9449:        error: error.message,
runtime/orchestrator-service/server.js:9458:      code: error.code || 'EMAIL_EXECUTION_FAILED',
runtime/orchestrator-service/server.js:9459:      message: error.message || 'Failed to execute email package'
runtime/orchestrator-service/server.js:9494:      supported_execution_states: EXECUTION_BRIDGE_STATES,
runtime/orchestrator-service/server.js:9509:        error: error.message,
runtime/orchestrator-service/server.js:9519:      message: error.message || 'Failed to generate media from prompt'
runtime/orchestrator-service/server.js:9546:      supported_execution_states: EXECUTION_BRIDGE_STATES,
runtime/orchestrator-service/server.js:9562:        error: error.message,
runtime/orchestrator-service/server.js:9572:      message: error.message || 'Failed to build ad execution package'
runtime/orchestrator-service/server.js:9591:      error: error.message
runtime/orchestrator-service/server.js:9636:      error: error.message
runtime/orchestrator-service/server.js:9722:      error: error.message
runtime/orchestrator-service/server.js:9806:      message: 'Failed to back up and clone product'
runtime/orchestrator-service/server.js:9921:      message: 'Failed to apply prepared copy to clone'
runtime/orchestrator-service/server.js:9938:    return res.json({ error: error.message || 'Project not found' });
runtime/orchestrator-service/server.js:9955:      message: 'Upload request rejected'
runtime/orchestrator-service/server.js:10025:      details: error.message
runtime/orchestrator-service/server.js:10186:    const message = error?.message || 'Failed to rename project';
runtime/orchestrator-service/server.js:10187:    const notFound = /not found/i.test(message);
runtime/orchestrator-service/server.js:10188:    const conflict = /already exists|already uses/i.test(message);
runtime/orchestrator-service/server.js:10193:      details: message
runtime/orchestrator-service/server.js:10286:    const message = error?.message || 'Failed to apply project template';
runtime/orchestrator-service/server.js:10287:    const notFound = /not found/i.test(message);
runtime/orchestrator-service/server.js:10292:      details: message
runtime/orchestrator-service/server.js:10348:    const message = error?.message || "Failed to create project";
runtime/orchestrator-service/server.js:10349:    const duplicate = /already exists/i.test(message);
runtime/orchestrator-service/server.js:10354:      details: message
runtime/orchestrator-service/server.js:10400:      error: error.message || 'Failed to build media manager startup payload'
runtime/orchestrator-service/server.js:10410:      error: error.message || 'Failed to build media manager startup payload'
runtime/orchestrator-service/server.js:10420:      error: error.message || 'Failed to build media manager payload'
runtime/orchestrator-service/server.js:10430:      error: error.message || 'Failed to build media manager payload'
runtime/orchestrator-service/server.js:10545:function sendAssetMutationError(res, error, fallbackMessage) {
runtime/orchestrator-service/server.js:10548:    error: error?.message || fallbackMessage,
runtime/orchestrator-service/server.js:10557:    error: fallbackMessage,
runtime/orchestrator-service/server.js:10558:    details: error?.message || String(error)
runtime/orchestrator-service/server.js:10766:      error: error.message || 'Failed to refresh project library'
runtime/orchestrator-service/server.js:10776:      error: error.message || 'Failed to save project setup'
runtime/orchestrator-service/server.js:10786:      error: error.message || 'Failed to save project setup'
runtime/orchestrator-service/server.js:10796:      error: error.message || 'Failed to build project operations payload'
runtime/orchestrator-service/server.js:10813:      error: error.message || 'Failed to build task center payload'
runtime/orchestrator-service/server.js:10827:      error: error.message || 'Failed to build queue center payload'
runtime/orchestrator-service/server.js:10841:      error: error.message || 'Failed to build job monitor payload'
runtime/orchestrator-service/server.js:10855:      error: error.message || 'Failed to build notification center payload'
runtime/orchestrator-service/server.js:10887:      error: error.message || 'Failed to load project team model'
runtime/orchestrator-service/server.js:10900:      error: error.message || 'Failed to update project team model'
runtime/orchestrator-service/server.js:10920:      error: error.message || 'Failed to list campaigns'
runtime/orchestrator-service/server.js:10934:      error: error.message || 'Failed to save campaign'
runtime/orchestrator-service/server.js:10948:      error: error.message || 'Failed to load campaign'
runtime/orchestrator-service/server.js:10985:      error: error.message || 'Failed to list content items'
runtime/orchestrator-service/server.js:10999:      error: error.message || 'Failed to save content item'
runtime/orchestrator-service/server.js:11013:      error: error.message || 'Failed to load content item'
runtime/orchestrator-service/server.js:11051:      error: error.message || 'Failed to list media jobs'
runtime/orchestrator-service/server.js:11065:      error: error.message || 'Failed to save media job'
runtime/orchestrator-service/server.js:11079:      error: error.message || 'Failed to load media job'
runtime/orchestrator-service/server.js:11115:      error: error.message || 'Failed to list workflow runs'
runtime/orchestrator-service/server.js:11132:      error: error.message || 'Failed to load workflow run'
runtime/orchestrator-service/server.js:11175:      error: error.message || 'Failed to record workflow run'
runtime/orchestrator-service/server.js:11216:        error: error.message || 'Failed to execute AI command'
runtime/orchestrator-service/server.js:11259:        error: error.message || 'Failed to execute AI chat'
runtime/orchestrator-service/server.js:11302:        error: error.message || 'Failed to execute AI guidance'
runtime/orchestrator-service/server.js:11330:      error: error.message || 'Failed to execute AI workflow'
runtime/orchestrator-service/server.js:11345:      error: error.message || 'Failed to list AI commands'
runtime/orchestrator-service/server.js:11359:      error: error.message || 'Failed to load AI command'
runtime/orchestrator-service/server.js:11375:      error: error.message || 'Failed to list AI artifacts'
runtime/orchestrator-service/server.js:11391:      error: error.message || 'Failed to list AI recommendations'
runtime/orchestrator-service/server.js:11407:      error: error.message || 'Failed to list AI memory'
runtime/orchestrator-service/server.js:11441:      error: error.message || 'Failed to list tasks'
runtime/orchestrator-service/server.js:11455:      error: error.message || 'Failed to create task'
runtime/orchestrator-service/server.js:11473:      error: error.message || 'Failed to load task'
runtime/orchestrator-service/server.js:11486:      error: error.message || 'Failed to load task'
runtime/orchestrator-service/server.js:11501:      error: error.message || 'Failed to list approvals'
runtime/orchestrator-service/server.js:11515:      error: error.message || 'Failed to create approval'
runtime/orchestrator-service/server.js:11536:      error: error.message || 'Failed to update approval'
runtime/orchestrator-service/server.js:11557:      error: error.message || 'Failed to load governance summary'
runtime/orchestrator-service/server.js:11571:      error: error.message || 'Failed to update governance policy'
runtime/orchestrator-service/server.js:11584:      error: error.message || 'Failed to load governance policy'
runtime/orchestrator-service/server.js:11606:      error: error.message || 'Failed to list notifications'
runtime/orchestrator-service/server.js:11622:      error: error.message || 'Failed to update notification'
runtime/orchestrator-service/server.js:11635:      error: error.message || 'Failed to update notification'
runtime/orchestrator-service/server.js:11653:      error: error.message || 'Failed to list handoffs'
runtime/orchestrator-service/server.js:11667:      error: error.message || 'Failed to create handoff'
runtime/orchestrator-service/server.js:11681:      error: error.message || 'Failed to consume handoff'
runtime/orchestrator-service/server.js:11703:      error: error.message || 'Failed to list events'
runtime/orchestrator-service/server.js:11716:      error: error.message || 'Failed to build project insights'
runtime/orchestrator-service/server.js:11726:      error: error.message || 'Failed to build project learning'
runtime/orchestrator-service/server.js:11757:      error: error.message || 'Failed to save project source'
runtime/orchestrator-service/server.js:11783:      error: error.message || 'Failed to save project source'
runtime/orchestrator-service/server.js:11794:      error: error.message || 'Failed to remove project source'
runtime/orchestrator-service/server.js:11805:      error: error.message || 'Failed to remove project source'
runtime/orchestrator-service/server.js:11815:      error: error.message || 'Failed to load integration control center'
runtime/orchestrator-service/server.js:11825:  if (status === 'unsupported_provider') {
runtime/orchestrator-service/server.js:11867:      error: error.message || 'Failed to save integration connection'
runtime/orchestrator-service/server.js:11889:      error: error.message || 'Failed to update integration'
runtime/orchestrator-service/server.js:11895:const customerOperationsRuntime =
runtime/orchestrator-service/server.js:11896:  createCustomerOperationsRuntime();
runtime/orchestrator-service/server.js:11915:      message: error.message
runtime/orchestrator-service/server.js:11930:      message: error.message
runtime/orchestrator-service/server.js:11937:function handleCustomerOperationsHealth(req, res) {
runtime/orchestrator-service/server.js:11940:      customerOperationsRuntime.health()
runtime/orchestrator-service/server.js:11944:      error: 'customer_operations_health_failed',
runtime/orchestrator-service/server.js:11945:      message: error.message
runtime/orchestrator-service/server.js:11950:function handleCustomerOperationsReadiness(req, res) {
runtime/orchestrator-service/server.js:11953:      customerOperationsRuntime.readiness.snapshot()
runtime/orchestrator-service/server.js:11957:      error: 'customer_operations_readiness_failed',
runtime/orchestrator-service/server.js:11958:      message: error.message
runtime/orchestrator-service/server.js:11963:function handleCustomerOperationsChannels(req, res) {
runtime/orchestrator-service/server.js:11967:        customerOperationsRuntime.channels.list()
runtime/orchestrator-service/server.js:11971:      error: 'customer_operations_channels_failed',
runtime/orchestrator-service/server.js:11972:      message: error.message
runtime/orchestrator-service/server.js:11977:function handleCustomerOperationsInbox(req, res) {
runtime/orchestrator-service/server.js:11980:      inbox:
runtime/orchestrator-service/server.js:11981:        customerOperationsRuntime.unifiedInbox.list()
runtime/orchestrator-service/server.js:11985:      error: 'customer_operations_inbox_failed',
runtime/orchestrator-service/server.js:11986:      message: error.message
runtime/orchestrator-service/server.js:11992:  '/media-manager/project/:project/customer-operations/health',
runtime/orchestrator-service/server.js:11993:  handleCustomerOperationsHealth
runtime/orchestrator-service/server.js:11997:  '/public/media-manager/project/:project/customer-operations/health',
runtime/orchestrator-service/server.js:11998:  handleCustomerOperationsHealth
runtime/orchestrator-service/server.js:12002:  '/media-manager/project/:project/customer-operations/readiness',
runtime/orchestrator-service/server.js:12003:  handleCustomerOperationsReadiness
runtime/orchestrator-service/server.js:12007:  '/public/media-manager/project/:project/customer-operations/readiness',
runtime/orchestrator-service/server.js:12008:  handleCustomerOperationsReadiness
runtime/orchestrator-service/server.js:12012:  '/media-manager/project/:project/customer-operations/channels',
runtime/orchestrator-service/server.js:12013:  handleCustomerOperationsChannels
runtime/orchestrator-service/server.js:12017:  '/public/media-manager/project/:project/customer-operations/channels',
runtime/orchestrator-service/server.js:12018:  handleCustomerOperationsChannels
runtime/orchestrator-service/server.js:12022:  '/media-manager/project/:project/customer-operations/inbox',
runtime/orchestrator-service/server.js:12023:  handleCustomerOperationsInbox
runtime/orchestrator-service/server.js:12027:  '/public/media-manager/project/:project/customer-operations/inbox',
runtime/orchestrator-service/server.js:12028:  handleCustomerOperationsInbox
runtime/orchestrator-service/server.js:12034:function handleCustomerOperationsConversations(req, res) {
runtime/orchestrator-service/server.js:12037:      conversations:
runtime/orchestrator-service/server.js:12038:        customerOperationsRuntime.conversations.list()
runtime/orchestrator-service/server.js:12042:      error: 'customer_operations_conversations_failed',
runtime/orchestrator-service/server.js:12043:      message: error.message
runtime/orchestrator-service/server.js:12048:function handleCustomerOperationsMessages(req, res) {
runtime/orchestrator-service/server.js:12051:      messages:
runtime/orchestrator-service/server.js:12052:        customerOperationsRuntime.messages.list()
runtime/orchestrator-service/server.js:12056:      error: 'customer_operations_messages_failed',
runtime/orchestrator-service/server.js:12057:      message: error.message
runtime/orchestrator-service/server.js:12062:function handleCustomerOperationsCustomers(req, res) {
runtime/orchestrator-service/server.js:12065:      customers:
runtime/orchestrator-service/server.js:12066:        customerOperationsRuntime.customers.list()
runtime/orchestrator-service/server.js:12070:      error: 'customer_operations_customers_failed',
runtime/orchestrator-service/server.js:12071:      message: error.message
runtime/orchestrator-service/server.js:12076:function handleCustomerOperationsSla(req, res) {
runtime/orchestrator-service/server.js:12080:        customerOperationsRuntime.sla.list()
runtime/orchestrator-service/server.js:12084:      error: 'customer_operations_sla_failed',
runtime/orchestrator-service/server.js:12085:      message: error.message
runtime/orchestrator-service/server.js:12090:function handleCustomerOperationsEscalations(req, res) {
runtime/orchestrator-service/server.js:12094:        customerOperationsRuntime.escalation.list()
runtime/orchestrator-service/server.js:12098:      error: 'customer_operations_escalations_failed',
runtime/orchestrator-service/server.js:12099:      message: error.message
runtime/orchestrator-service/server.js:12105:  '/media-manager/project/:project/customer-operations/conversations',
runtime/orchestrator-service/server.js:12106:  handleCustomerOperationsConversations
runtime/orchestrator-service/server.js:12110:  '/public/media-manager/project/:project/customer-operations/conversations',
runtime/orchestrator-service/server.js:12111:  handleCustomerOperationsConversations
runtime/orchestrator-service/server.js:12115:  '/media-manager/project/:project/customer-operations/messages',
runtime/orchestrator-service/server.js:12116:  handleCustomerOperationsMessages
runtime/orchestrator-service/server.js:12120:  '/public/media-manager/project/:project/customer-operations/messages',
runtime/orchestrator-service/server.js:12121:  handleCustomerOperationsMessages
runtime/orchestrator-service/server.js:12125:  '/media-manager/project/:project/customer-operations/customers',
runtime/orchestrator-service/server.js:12126:  handleCustomerOperationsCustomers
runtime/orchestrator-service/server.js:12130:  '/public/media-manager/project/:project/customer-operations/customers',
runtime/orchestrator-service/server.js:12131:  handleCustomerOperationsCustomers
runtime/orchestrator-service/server.js:12135:  '/media-manager/project/:project/customer-operations/sla',
runtime/orchestrator-service/server.js:12136:  handleCustomerOperationsSla
runtime/orchestrator-service/server.js:12140:  '/public/media-manager/project/:project/customer-operations/sla',
runtime/orchestrator-service/server.js:12141:  handleCustomerOperationsSla
runtime/orchestrator-service/server.js:12145:  '/media-manager/project/:project/customer-operations/escalations',
runtime/orchestrator-service/server.js:12146:  handleCustomerOperationsEscalations
runtime/orchestrator-service/server.js:12150:  '/public/media-manager/project/:project/customer-operations/escalations',
runtime/orchestrator-service/server.js:12151:  handleCustomerOperationsEscalations
runtime/orchestrator-service/server.js:12184:      message: error.message
runtime/orchestrator-service/server.js:12280:      error: error.message || 'Failed to save publishing schedule',
runtime/orchestrator-service/server.js:12313:      error: error.message || 'Failed to save publishing schedule',
runtime/orchestrator-service/server.js:12342:      error: error.message || 'Failed to reschedule publishing item',
runtime/orchestrator-service/server.js:12371:      error: error.message || 'Failed to reschedule publishing item',
runtime/orchestrator-service/server.js:12393:      error: error.message || 'Failed to approve publishing item',
runtime/orchestrator-service/server.js:12415:      error: error.message || 'Failed to approve publishing item',
runtime/orchestrator-service/server.js:12447:      error: error.message || 'Failed to publish item',
runtime/orchestrator-service/server.js:12479:      error: error.message || 'Failed to publish item',
runtime/orchestrator-service/server.js:12511:      error: error.message || 'Failed to mark publishing item as failed',
runtime/orchestrator-service/server.js:12543:      error: error.message || 'Failed to mark publishing item as failed',
runtime/orchestrator-service/server.js:12852:    const hook = map.hook || `${productName} supports ${category} care with ${benefitText}.`;
runtime/orchestrator-service/server.js:12885:        'Avoid unsupported medical or misleading claims.'
runtime/orchestrator-service/server.js:12957:  function email() {
runtime/orchestrator-service/server.js:12969:    instagram: ig(),
runtime/orchestrator-service/server.js:12975:    email: email()
runtime/orchestrator-service/server.js:13116:          : normalizedChannel === 'email'
runtime/orchestrator-service/server.js:13145:  const emailDir = path.join(baseDir, 'email');
runtime/orchestrator-service/server.js:13148:  const legacyEmailDir = path.join(legacyBaseDir, 'email');
runtime/orchestrator-service/server.js:13153:  ensureDir(emailDir);
runtime/orchestrator-service/server.js:13157:  ensureDir(legacyEmailDir);
runtime/orchestrator-service/server.js:13163:    emailDir,
runtime/orchestrator-service/server.js:13167:    legacyEmailDir
runtime/orchestrator-service/server.js:13242:function buildCampaignEmailPackage(projectName, campaignName) {
runtime/orchestrator-service/server.js:13243:  const payload = buildChannelExecutionPayload(projectName, campaignName, 'email');
runtime/orchestrator-service/server.js:13246:  const packageId = `campemail_${Date.now()}`;
runtime/orchestrator-service/server.js:13248:    paths.legacyEmailDir,
runtime/orchestrator-service/server.js:13254:  const emailPackage = {
runtime/orchestrator-service/server.js:13258:    channel: 'email',
runtime/orchestrator-service/server.js:13268:    artifactType: 'campaign_email_package',
runtime/orchestrator-service/server.js:13271:    data: emailPackage
runtime/orchestrator-service/server.js:13275:    ...emailPackage,
runtime/orchestrator-service/server.js:13300:  const emailFile = resolveExecutionReadCandidate({
runtime/orchestrator-service/server.js:13303:    relativePath: path.join('email', `${safeName}.json`),
runtime/orchestrator-service/server.js:13306:    requestedFile: `campaign-finalization/email/${safeName}.json`
runtime/orchestrator-service/server.js:13321:    has_email_package: fs.existsSync(emailFile),
runtime/orchestrator-service/server.js:13322:    ready: mediaFiles.length > 0 || publishFiles.length > 0 || fs.existsSync(emailFile)
runtime/orchestrator-service/server.js:13365:    record.error = sanitizeErrorMessage(payload.error, 'Execution bridge failed');
runtime/orchestrator-service/server.js:13444:      instagram: {
runtime/orchestrator-service/server.js:13451:        message: caption,
runtime/orchestrator-service/server.js:13466:function resolveEmailPackageForExecution(projectName, input = {}) {
runtime/orchestrator-service/server.js:13467:  const inlinePackage = input.email_package && typeof input.email_package === 'object'
runtime/orchestrator-service/server.js:13468:    ? input.email_package
runtime/orchestrator-service/server.js:13476:    const error = new Error('Missing email package. Provide email_package or campaign_name');
runtime/orchestrator-service/server.js:13478:    error.code = 'EMAIL_PACKAGE_MISSING';
runtime/orchestrator-service/server.js:13482:  return buildCampaignEmailPackage(projectName, campaignName);
runtime/orchestrator-service/server.js:13485:function buildEmailReadyPayload(emailPackage) {
runtime/orchestrator-service/server.js:13486:  const primaryAsset = emailPackage.primary_asset && typeof emailPackage.primary_asset === 'object'
runtime/orchestrator-service/server.js:13487:    ? emailPackage.primary_asset
runtime/orchestrator-service/server.js:13491:    const error = new Error('Email package does not include a primary channel asset');
runtime/orchestrator-service/server.js:13493:    error.code = 'EMAIL_PACKAGE_INVALID';
runtime/orchestrator-service/server.js:13498:  const campaignName = String(emailPackage.campaign_name || '').trim();
runtime/orchestrator-service/server.js:13560:        direction: String(reel.cta || branding.cta || 'Close with CTA and brand recall.').trim()
runtime/orchestrator-service/server.js:13767:    if (job.channel === 'email') {
runtime/orchestrator-service/server.js:13770:      result.notes.push('Email package is ready for operator-controlled sending.');
runtime/orchestrator-service/server.js:13771:    } else if (['instagram', 'facebook', 'tiktok', 'youtube'].includes(job.channel)) {
runtime/orchestrator-service/server.js:13785:    if (job.channel === 'email') {
runtime/orchestrator-service/server.js:13788:      result.notes.push('Full-auto mode enabled. Email send bridge should consume this.');
runtime/orchestrator-service/server.js:13789:    } else if (['instagram', 'facebook', 'tiktok', 'youtube'].includes(job.channel)) {
runtime/orchestrator-service/server.js:14029:function buildPublishingGovernanceError(message, details = {}) {
runtime/orchestrator-service/server.js:14030:  const error = new Error(message);
runtime/orchestrator-service/server.js:14053:  // We still guard defensively here in case of unexpected call paths.
runtime/orchestrator-service/server.js:14252:    if (['website', 'ecommerce', 'instagram', 'facebook'].includes(item)) {
runtime/orchestrator-service/server.js:14254:    } else if (['tiktok', 'youtube', 'email'].includes(item)) {
runtime/orchestrator-service/server.js:14345:      brand_voice: project.brand_voice,
runtime/orchestrator-service/server.js:14356:      customer_problem: project.audience_problem,
runtime/orchestrator-service/server.js:14565:      error: error.message || 'Failed to build project insights'
runtime/orchestrator-service/server.js:14653:        message: 'No command text provided'
runtime/orchestrator-service/server.js:14694:          message: 'Missing product_id'
runtime/orchestrator-service/server.js:14711:          message: 'Missing product_id'
runtime/orchestrator-service/server.js:14728:          message: 'Missing product_id'
runtime/orchestrator-service/server.js:14747:          message: 'Missing original_id or clone_id'
runtime/orchestrator-service/server.js:14768:          ['content_plan', 'content', 'blog', 'email', 'ads'].includes(t.type)
runtime/orchestrator-service/server.js:14786:        platform: 'instagram',
runtime/orchestrator-service/server.js:14802:          `Create a premium social media image for ${topic}, focused on masculine grooming, luxury styling, dark elegant brand mood, high-end product presentation, suitable for Instagram and Facebook feed.`,
runtime/orchestrator-service/server.js:14913:   if (command === '/create_email') {
runtime/orchestrator-service/server.js:14916:      const emailDraft = {
runtime/orchestrator-service/server.js:14917:        id: `email_${Date.now()}`,
runtime/orchestrator-service/server.js:14920:        format: 'campaign email',
runtime/orchestrator-service/server.js:14930:      const { data: queue } = readLiveEmailQueue(commandProject, emailDraft.id);
runtime/orchestrator-service/server.js:14931:      queue.push(emailDraft);
runtime/orchestrator-service/server.js:14932:      writeLiveEmailQueue(commandProject, queue);
runtime/orchestrator-service/server.js:14936:        result: emailDraft
runtime/orchestrator-service/server.js:14997:    if (command === '/review_emails') {
runtime/orchestrator-service/server.js:14998:      const { data: queue } = readLiveEmailQueue(commandProject, 'review-emails');
runtime/orchestrator-service/server.js:15081:    if (command === '/approve_email') {
runtime/orchestrator-service/server.js:15084:        return res.json({ error: 'Missing email draft id' });
runtime/orchestrator-service/server.js:15087:      const { data: queue } = readLiveEmailQueue(commandProject, draftId);
runtime/orchestrator-service/server.js:15091:        return res.json({ error: 'Email draft not found' });
runtime/orchestrator-service/server.js:15096:      writeLiveEmailQueue(commandProject, queue);
runtime/orchestrator-service/server.js:15169:      item.visual_format = 'feed post / reel support';
runtime/orchestrator-service/server.js:15173:        `Create a premium social creative for ${item.topic}, suitable for Instagram and Facebook, masculine luxury grooming aesthetic, clean composition, strong product focus, elegant contrast, Germany-market premium brand feel.`;
runtime/orchestrator-service/server.js:15225:        'Add one high-authority source only if it supports trust and relevance'
runtime/orchestrator-service/server.js:15277:    if (command === '/improve_email') {
runtime/orchestrator-service/server.js:15280:        return res.json({ error: 'Missing email draft id' });
runtime/orchestrator-service/server.js:15283:      const { data: queue } = readLiveEmailQueue(commandProject, draftId);
runtime/orchestrator-service/server.js:15287:        return res.json({ error: 'Email draft not found' });
runtime/orchestrator-service/server.js:15291:      item.format = 'campaign email';
runtime/orchestrator-service/server.js:15300:      writeLiveEmailQueue(commandProject, queue);
runtime/orchestrator-service/server.js:15386:    if (command === '/execute_email') {
runtime/orchestrator-service/server.js:15389:        return res.json({ error: 'Missing email draft id' });
runtime/orchestrator-service/server.js:15392:      const { data: queue } = readLiveEmailQueue(commandProject, draftId);
runtime/orchestrator-service/server.js:15396:        return res.json({ error: 'Email draft not found' });
runtime/orchestrator-service/server.js:15401:      writeLiveEmailQueue(commandProject, queue);
runtime/orchestrator-service/server.js:15406:        note: 'Email draft is now ready_for_send. Email connector is the next layer.'
runtime/orchestrator-service/server.js:15649:        message: 'Image generated successfully'
runtime/orchestrator-service/server.js:15656:      details: error.message
runtime/orchestrator-service/server.js:15754:        message: 'Featured image attached successfully'
runtime/orchestrator-service/server.js:15761:      details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
runtime/orchestrator-service/server.js:15894:          details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
runtime/orchestrator-service/server.js:15937:    if (command === '/review_email_asset') {
runtime/orchestrator-service/server.js:15940:        return res.json({ error: 'Missing email draft id' });
runtime/orchestrator-service/server.js:15943:      const { data: queue } = readLiveEmailQueue(commandProject, draftId);
runtime/orchestrator-service/server.js:15947:        return res.json({ error: 'Email draft not found' });
runtime/orchestrator-service/server.js:15962:          format: item.format || 'campaign email',
runtime/orchestrator-service/server.js:15973:    if (command === '/generate_email_image') {
runtime/orchestrator-service/server.js:15976:        return res.json({ error: 'Missing email draft id' });
runtime/orchestrator-service/server.js:15979:      const { data: emailQueue } = readLiveEmailQueue(commandProject, draftId);
runtime/orchestrator-service/server.js:15980:      const emailItem = emailQueue.find(x => x.id === draftId);
runtime/orchestrator-service/server.js:15982:      if (!emailItem) {
runtime/orchestrator-service/server.js:15983:        return res.json({ error: 'Email draft not found' });
runtime/orchestrator-service/server.js:15988:      fs.mkdirSync(path.join(mediaDir, 'email'), { recursive: true });
runtime/orchestrator-service/server.js:15990:      const { data: mediaQueue } = readLiveEmailMediaQueue(commandProject, draftId);
runtime/orchestrator-service/server.js:15992:      const assetId = `emailimg_${Date.now()}`;
runtime/orchestrator-service/server.js:15993:      const safeSlug = String(emailItem.topic || 'email-image')
runtime/orchestrator-service/server.js:16001:        'email',
runtime/orchestrator-service/server.js:16006:        `Create a premium email hero image for ${emailItem.topic}, focused on luxury men’s grooming, strong masculine branding, refined product presentation, elegant dark premium styling, suitable for a high-conversion campaign email for the German market.`;
runtime/orchestrator-service/server.js:16009:        `${emailItem.topic} – Premium Kampagne von ${commandBrandName}`;
runtime/orchestrator-service/server.js:16013:        type: 'email_hero_image',
runtime/orchestrator-service/server.js:16015:        linked_email_id: emailItem.id,
runtime/orchestrator-service/server.js:16016:        email_subject: emailItem.subject || '',
runtime/orchestrator-service/server.js:16017:        topic: emailItem.topic,
runtime/orchestrator-service/server.js:16022:        style: 'premium masculine campaign email',
runtime/orchestrator-service/server.js:16030:      writeLiveEmailMediaQueue(commandProject, mediaQueue);
runtime/orchestrator-service/server.js:16038:    if (command === '/review_email_media') {
runtime/orchestrator-service/server.js:16041:        return res.json({ error: 'Missing email draft id or asset id' });
runtime/orchestrator-service/server.js:16044:      const { data: mediaQueue } = readLiveEmailMediaQueue(commandProject, ref);
runtime/orchestrator-service/server.js:16050:          .filter(x => x.linked_email_id === ref)
runtime/orchestrator-service/server.js:16057:        return res.json({ error: 'Email media asset not found' });
runtime/orchestrator-service/server.js:16066:    if (command === '/attach_email_image') {
runtime/orchestrator-service/server.js:16069:    return res.json({ error: 'Missing email draft id' });
runtime/orchestrator-service/server.js:16072:  const { data: emailQueue } = readLiveEmailQueue(commandProject, draftId);
runtime/orchestrator-service/server.js:16073:  const emailItem = emailQueue.find(x => x.id === draftId);
runtime/orchestrator-service/server.js:16075:  if (!emailItem) {
runtime/orchestrator-service/server.js:16076:    return res.json({ error: 'Email draft not found' });
runtime/orchestrator-service/server.js:16079:  const { data: mediaQueue } = readLiveEmailMediaQueue(commandProject, draftId);
runtime/orchestrator-service/server.js:16082:    .filter(x => x.linked_email_id === draftId && x.status === 'generated')
runtime/orchestrator-service/server.js:16088:    return res.json({ error: 'No generated email image found' });
runtime/orchestrator-service/server.js:16117:    emailItem.hero_image_asset_id = asset.asset_id;
runtime/orchestrator-service/server.js:16118:    emailItem.hero_image_path = asset.output_path;
runtime/orchestrator-service/server.js:16119:    emailItem.hero_image_url = publicImageUrl;
runtime/orchestrator-service/server.js:16120:    emailItem.hero_image_alt = asset.alt_text;
runtime/orchestrator-service/server.js:16121:    emailItem.hero_image_wp_media_id = mediaId;
runtime/orchestrator-service/server.js:16124:    emailItem.html_body =
runtime/orchestrator-service/server.js:16128:      `<h2 style="margin:0 0 12px 0;color:#111;">${emailItem.subject || ''}</h2>` +
runtime/orchestrator-service/server.js:16129:      `<p style="margin:0 0 16px 0;color:#444;">${emailItem.preheader || ''}</p>` +
runtime/orchestrator-service/server.js:16130:      `<p style="margin:0 0 24px 0;color:#222;line-height:1.6;">${emailItem.body || ''}</p>` +
runtime/orchestrator-service/server.js:16131:      `<a href="${projectWebsiteUrl}" style="display:inline-block;padding:14px 24px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">${emailItem.cta || 'Jetzt entdecken'}</a>` +
runtime/orchestrator-service/server.js:16134:    writeLiveEmailMediaQueue(commandProject, mediaQueue);
runtime/orchestrator-service/server.js:16135:    writeLiveEmailQueue(commandProject, emailQueue);
runtime/orchestrator-service/server.js:16140:        draft_id: emailItem.id,
runtime/orchestrator-service/server.js:16141:        subject: emailItem.subject,
runtime/orchestrator-service/server.js:16142:        hero_image_asset_id: emailItem.hero_image_asset_id,
runtime/orchestrator-service/server.js:16143:        hero_image_url: emailItem.hero_image_url,
runtime/orchestrator-service/server.js:16144:        hero_image_wp_media_id: emailItem.hero_image_wp_media_id,
runtime/orchestrator-service/server.js:16146:        status: emailItem.status
runtime/orchestrator-service/server.js:16151:      error: 'Attach email image failed',
runtime/orchestrator-service/server.js:16152:      details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
runtime/orchestrator-service/server.js:16157:    if (command === '/generate_email_image_real') {
runtime/orchestrator-service/server.js:16161:        return res.json({ error: 'Missing email draft id or asset id' });
runtime/orchestrator-service/server.js:16164:      const { data: mediaQueue } = readLiveEmailMediaQueue(commandProject, ref);
runtime/orchestrator-service/server.js:16170:          .filter(x => x.linked_email_id === ref)
runtime/orchestrator-service/server.js:16177:        return res.json({ error: 'Email media asset not found' });
runtime/orchestrator-service/server.js:16208:        writeLiveEmailMediaQueue(commandProject, mediaQueue);
runtime/orchestrator-service/server.js:16216:            message: 'Email image generated successfully'
runtime/orchestrator-service/server.js:16222:          error: 'Email image generation failed',
runtime/orchestrator-service/server.js:16223:          details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
runtime/orchestrator-service/server.js:16228:     if (command === '/send_email_draft') {
runtime/orchestrator-service/server.js:16230:      const toEmail = args[1];
runtime/orchestrator-service/server.js:16233:        return res.json({ error: 'Missing email draft id' });
runtime/orchestrator-service/server.js:16236:      if (!toEmail) {
runtime/orchestrator-service/server.js:16237:        return res.json({ error: 'Missing recipient email' });
runtime/orchestrator-service/server.js:16240:        const { data: emailQueue } = readLiveEmailQueue(commandProject, draftId);
runtime/orchestrator-service/server.js:16241:      const emailItem = emailQueue.find(x => x.id === draftId);
runtime/orchestrator-service/server.js:16243:      if (!emailItem) {
runtime/orchestrator-service/server.js:16244:        return res.json({ error: 'Email draft not found' });
runtime/orchestrator-service/server.js:16247:      if (!emailItem.html_body) {
runtime/orchestrator-service/server.js:16248:        return res.json({ error: 'Email HTML not prepared' });
runtime/orchestrator-service/server.js:16253:          process.env.MH_EMAIL_BRIDGE_URL,
runtime/orchestrator-service/server.js:16255:            to: toEmail,
runtime/orchestrator-service/server.js:16256:            subject: emailItem.subject,
runtime/orchestrator-service/server.js:16257:            preheader: emailItem.preheader || '',
runtime/orchestrator-service/server.js:16258:            html_body: emailItem.html_body
runtime/orchestrator-service/server.js:16262:              'x-mh-token': process.env.MH_EMAIL_BRIDGE_TOKEN,
runtime/orchestrator-service/server.js:16268:        emailItem.status = 'sent';
runtime/orchestrator-service/server.js:16269:        emailItem.sent_to = toEmail;
runtime/orchestrator-service/server.js:16270:        emailItem.sent_at = new Date().toISOString();
runtime/orchestrator-service/server.js:16271:        emailItem.send_result = response.data;
runtime/orchestrator-service/server.js:16273:        writeLiveEmailQueue(commandProject, emailQueue);
runtime/orchestrator-service/server.js:16278:            draft_id: emailItem.id,
runtime/orchestrator-service/server.js:16279:            status: emailItem.status,
runtime/orchestrator-service/server.js:16280:            sent_to: emailItem.sent_to,
runtime/orchestrator-service/server.js:16281:            sent_at: emailItem.sent_at,
runtime/orchestrator-service/server.js:16287:          error: 'Email send failed',
runtime/orchestrator-service/server.js:16288:          details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
runtime/orchestrator-service/server.js:16318:          'email',
runtime/orchestrator-service/server.js:16319:          'instagram',
runtime/orchestrator-service/server.js:16403:          'email',
runtime/orchestrator-service/server.js:16411:          'email hero image',
runtime/orchestrator-service/server.js:16497:          email: 1,
runtime/orchestrator-service/server.js:16505:          'email follow-up',
runtime/orchestrator-service/server.js:16508:          'reel/tiktok support'
runtime/orchestrator-service/server.js:16606:      instagram: "visual + reels + transformation",
runtime/orchestrator-service/server.js:16608:      email: "conversion + retention",
runtime/orchestrator-service/server.js:16670:        platform: 'instagram',
runtime/orchestrator-service/server.js:16699:if (command === '/reuse_email_to_social') {
runtime/orchestrator-service/server.js:16700:  const emailId = args[0];
runtime/orchestrator-service/server.js:16702:  if (!emailId) {
runtime/orchestrator-service/server.js:16703:    return res.json({ error: 'Missing email ID' });
runtime/orchestrator-service/server.js:16706:  const { candidate, data: emailQueue } = readLiveEmailQueue(commandProject, emailId);
runtime/orchestrator-service/server.js:16709:    return res.json({ error: 'Email queue not found' });
runtime/orchestrator-service/server.js:16712:  const email = emailQueue.find(e => e.id === emailId);
runtime/orchestrator-service/server.js:16714:  if (!email) {
runtime/orchestrator-service/server.js:16715:    return res.json({ error: 'Email not found' });
runtime/orchestrator-service/server.js:16719:    source: emailId,
runtime/orchestrator-service/server.js:16720:    type: 'email_to_social',
runtime/orchestrator-service/server.js:16721:    instagram: {
runtime/orchestrator-service/server.js:16722:      caption: email.body,
runtime/orchestrator-service/server.js:16723:      cta: email.cta
runtime/orchestrator-service/server.js:16726:      headline: email.subject,
runtime/orchestrator-service/server.js:16727:      primary_text: email.body,
runtime/orchestrator-service/server.js:16728:      cta: email.cta
runtime/orchestrator-service/server.js:16837:          'Instagram/TikTok trend observation'
runtime/orchestrator-service/server.js:17024:      instagram: "visual transformation",
runtime/orchestrator-service/server.js:17027:      email: "conversion"
runtime/orchestrator-service/server.js:17228:          'email',
runtime/orchestrator-service/server.js:17229:          'instagram',
runtime/orchestrator-service/server.js:17236:          '1 conversion email',
runtime/orchestrator-service/server.js:17252:          'send launch email',
runtime/orchestrator-service/server.js:17326:            instagram: 'visual storytelling + reels + hooks',
runtime/orchestrator-service/server.js:17328:            email: 'conversion + retention',
runtime/orchestrator-service/server.js:17361:          'launch one conversion email',
runtime/orchestrator-service/server.js:17427:    email: {
runtime/orchestrator-service/server.js:17435:        platform: 'instagram',
runtime/orchestrator-service/server.js:17500:      const { data: emailQueue } = readLiveEmailQueue(commandProject, execId);
runtime/orchestrator-service/server.js:17513:        email_id: null,
runtime/orchestrator-service/server.js:17557:      // EMAIL
runtime/orchestrator-service/server.js:17558:      if (campaignExec.email) {
runtime/orchestrator-service/server.js:17559:        const emailDraft = {
runtime/orchestrator-service/server.js:17560:          id: `email_${Date.now() + 1}`,
runtime/orchestrator-service/server.js:17561:          topic: campaignExec.blog?.topic || campaignExec.email.subject || 'campaign email',
runtime/orchestrator-service/server.js:17563:          format: 'campaign email',
runtime/orchestrator-service/server.js:17566:          subject: campaignExec.email.subject,
runtime/orchestrator-service/server.js:17568:          body: campaignExec.email.body,
runtime/orchestrator-service/server.js:17569:          cta: campaignExec.email.cta || 'Jetzt entdecken',
runtime/orchestrator-service/server.js:17573:        emailQueue.push(emailDraft);
runtime/orchestrator-service/server.js:17574:        created.email_id = emailDraft.id;
runtime/orchestrator-service/server.js:17583:            platform: post.platform || 'instagram',
runtime/orchestrator-service/server.js:17593:            visual_format: post.platform === 'instagram' ? 'feed post / reel support' : 'social post',
runtime/orchestrator-service/server.js:17594:            aspect_ratio: post.platform === 'instagram' ? '4:5 or 9:16' : '1:1',
runtime/orchestrator-service/server.js:17636:          platform: 'instagram_reel',
runtime/orchestrator-service/server.js:17661:      writeLiveEmailQueue(commandProject, emailQueue);
runtime/orchestrator-service/server.js:17766:          details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
runtime/orchestrator-service/server.js:17771:    if (command === '/campaign_send_email') {
runtime/orchestrator-service/server.js:17773:      const toEmail = args[1];
runtime/orchestrator-service/server.js:17775:      if (!execId || !toEmail) {
runtime/orchestrator-service/server.js:17776:        return res.json({ error: 'Missing campaign execution ID or recipient email' });
runtime/orchestrator-service/server.js:17791:      const emailId = campaignExec.autogen_created_assets?.email_id;
runtime/orchestrator-service/server.js:17793:      if (!emailId) {
runtime/orchestrator-service/server.js:17794:        return res.json({ error: 'No generated email asset linked to this campaign' });
runtime/orchestrator-service/server.js:17802:            text: `/send_email_draft ${emailId} ${toEmail}`
runtime/orchestrator-service/server.js:17807:        campaignExec.controlled_publish.email = {
runtime/orchestrator-service/server.js:17809:          draft_id: emailId,
runtime/orchestrator-service/server.js:17810:          recipient: toEmail,
runtime/orchestrator-service/server.js:17823:          result: campaignExec.controlled_publish.email
runtime/orchestrator-service/server.js:17827:          error: 'Campaign email send failed',
runtime/orchestrator-service/server.js:17828:          details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
runtime/orchestrator-service/server.js:17861:            email: campaignExec.controlled_publish?.email?.status || 'not_sent'
runtime/orchestrator-service/server.js:18167:      details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
runtime/orchestrator-service/server.js:18214:        message: 'Asset already registered',
runtime/orchestrator-service/server.js:18272:        message: 'Reference already registered',
runtime/orchestrator-service/server.js:18356:      details: error.message
runtime/orchestrator-service/server.js:18393:      details: error.message
runtime/orchestrator-service/server.js:18415:      details: error.message
runtime/orchestrator-service/server.js:18437:      details: error.message
runtime/orchestrator-service/server.js:18460:      details: error.message
runtime/orchestrator-service/server.js:18487:      details: error.message
runtime/orchestrator-service/server.js:18508:      details: error.message
runtime/orchestrator-service/server.js:18512:if (command === '/generate_email_hero') {
runtime/orchestrator-service/server.js:18521:    const result = buildGenerationJob(projectName, 'email_hero', goal);
runtime/orchestrator-service/server.js:18528:      error: 'Failed to generate email hero job',
runtime/orchestrator-service/server.js:18529:      details: error.message
runtime/orchestrator-service/server.js:18550:      details: error.message
runtime/orchestrator-service/server.js:18582:      details: error.message
runtime/orchestrator-service/server.js:18602:      details: error.message
runtime/orchestrator-service/server.js:18622:      details: error.message
runtime/orchestrator-service/server.js:18648:      details: error.message
runtime/orchestrator-service/server.js:18669:      details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
runtime/orchestrator-service/server.js:18673:if (command === '/evaluate_email_readiness') {
runtime/orchestrator-service/server.js:18681:    const result = evaluateEmailReadiness(projectName);
runtime/orchestrator-service/server.js:18688:      error: 'Failed to evaluate email readiness',
runtime/orchestrator-service/server.js:18689:      details: error.message
runtime/orchestrator-service/server.js:18693:if (command === '/auto_prepare_email_asset') {
runtime/orchestrator-service/server.js:18702:    const result = autoPrepareEmailAsset(projectName, rawText);
runtime/orchestrator-service/server.js:18710:      error: 'Failed to auto prepare email asset',
runtime/orchestrator-service/server.js:18711:      details: error.message
runtime/orchestrator-service/server.js:18715:if (command === '/review_email_prepare_package') {
runtime/orchestrator-service/server.js:18723:    const result = reviewEmailPreparePackage(projectName);
runtime/orchestrator-service/server.js:18730:      error: 'Failed to review email prepare package',
runtime/orchestrator-service/server.js:18731:      details: error.message
runtime/orchestrator-service/server.js:18735:if (command === '/validate_email_prepare_package') {
runtime/orchestrator-service/server.js:18743:    const result = reviewEmailPreparePackage(projectName);
runtime/orchestrator-service/server.js:18756:      error: 'Failed to validate email prepare package',
runtime/orchestrator-service/server.js:18757:      details: error.message
runtime/orchestrator-service/server.js:18761:if (command === '/evaluate_prepared_email_for_send') {
runtime/orchestrator-service/server.js:18769:    const result = evaluatePreparedEmailForSend(projectName);
runtime/orchestrator-service/server.js:18776:      error: 'Failed to evaluate prepared email for send',
runtime/orchestrator-service/server.js:18777:      details: error.message
runtime/orchestrator-service/server.js:18781:if (command === '/send_prepared_email') {
runtime/orchestrator-service/server.js:18783:  const toEmail = (args[1] || '').trim();
runtime/orchestrator-service/server.js:18785:  if (!projectName || !toEmail) {
runtime/orchestrator-service/server.js:18786:    return res.json({ error: 'Missing project name or recipient email' });
runtime/orchestrator-service/server.js:18790:    const result = await sendPreparedEmail(projectName, toEmail);
runtime/orchestrator-service/server.js:18797:      error: 'Failed to send prepared email',
runtime/orchestrator-service/server.js:18798:      details: error.message
runtime/orchestrator-service/server.js:18802:if (command === '/review_email_delivery') {
runtime/orchestrator-service/server.js:18810:    const deliveryDir = resolveEmailReadCandidate({
runtime/orchestrator-service/server.js:18812:      artifactType: EMAIL_ARTIFACT_TYPES.DELIVERY_RECORD,
runtime/orchestrator-service/server.js:18814:      requestedIdentifier: 'latest-email-delivery',
runtime/orchestrator-service/server.js:18815:      requestedFile: 'email/delivery/*.json'
runtime/orchestrator-service/server.js:18824:      return res.json({ error: 'No email delivery records found' });
runtime/orchestrator-service/server.js:18836:      error: 'Failed to review email delivery',
runtime/orchestrator-service/server.js:18837:      details: error.message
runtime/orchestrator-service/server.js:18859:      details: error.message
runtime/orchestrator-service/server.js:18880:      details: error.message
runtime/orchestrator-service/server.js:18898:      details: error.message
runtime/orchestrator-service/server.js:18916:      details: error.message
runtime/orchestrator-service/server.js:18936:      details: error.message
runtime/orchestrator-service/server.js:18954:      details: error.message
runtime/orchestrator-service/server.js:18976:      details: error.message
runtime/orchestrator-service/server.js:18998:      details: error.message
runtime/orchestrator-service/server.js:19023:      details: error.message
runtime/orchestrator-service/server.js:19047:      details: error.message
runtime/orchestrator-service/server.js:19098:      details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
runtime/orchestrator-service/server.js:19120:      details: error.message
runtime/orchestrator-service/server.js:19152:      details: error.message
runtime/orchestrator-service/server.js:19175:      details: error.message
runtime/orchestrator-service/server.js:19201:      details: error.message
runtime/orchestrator-service/server.js:19214:    const result = await syncAllWooProducts(projectName);
runtime/orchestrator-service/server.js:19222:      details: error.message
runtime/orchestrator-service/server.js:19243:      details: error.message
runtime/orchestrator-service/server.js:19288:      details: error.message
runtime/orchestrator-service/server.js:19329:      details: error.message
runtime/orchestrator-service/server.js:19370:      details: error.message
runtime/orchestrator-service/server.js:19405:      details: error.message
runtime/orchestrator-service/server.js:19432:      details: error.message
runtime/orchestrator-service/server.js:19473:      details: error.message
runtime/orchestrator-service/server.js:19508:      details: error.message
runtime/orchestrator-service/server.js:19535:      details: error.message
runtime/orchestrator-service/server.js:19567:    return res.json({ error: 'Failed', details: e.message });
runtime/orchestrator-service/server.js:19597:    return res.json({ error: 'Failed bulk', details: e.message });
runtime/orchestrator-service/server.js:19619:    return res.json({ error: 'Failed review', details: e.message });
runtime/orchestrator-service/server.js:19652:      details: error.message
runtime/orchestrator-service/server.js:19674:      details: error.message
runtime/orchestrator-service/server.js:19701:      details: error.message
runtime/orchestrator-service/server.js:19723:      details: error.message
runtime/orchestrator-service/server.js:19727:if (command === '/prepare_campaign_email') {
runtime/orchestrator-service/server.js:19736:    const result = buildCampaignEmailPackage(projectName, campaignName);
runtime/orchestrator-service/server.js:19743:      error: 'Failed to prepare campaign email package',
runtime/orchestrator-service/server.js:19744:      details: error.message
runtime/orchestrator-service/server.js:19766:      details: error.message
runtime/orchestrator-service/server.js:19787:      details: error.message
runtime/orchestrator-service/server.js:19798:    return res.json({ error: 'Failed to build launch plan', details: error.message });
runtime/orchestrator-service/server.js:19811:    return res.json({ error: 'Failed to review launch plan', details: error.message });
runtime/orchestrator-service/server.js:19822:    return res.json({ error: 'Failed to build launch wave', details: error.message });
runtime/orchestrator-service/server.js:19836:    return res.json({ error: 'Failed to review launch wave', details: error.message });
runtime/orchestrator-service/server.js:19854:      details: error.message
runtime/orchestrator-service/server.js:19874:      details: error.message
runtime/orchestrator-service/server.js:19891:      details: error.message
runtime/orchestrator-service/server.js:19910:      details: error.message
runtime/orchestrator-service/server.js:19935:      details: error.message
runtime/orchestrator-service/server.js:19953:      details: error.message
runtime/orchestrator-service/server.js:19970:      details: error.message
runtime/orchestrator-service/server.js:19988:      details: error.message
runtime/orchestrator-service/server.js:20006:      details: error.message
runtime/orchestrator-service/server.js:20023:      details: error.message
runtime/orchestrator-service/server.js:20042:      details: error.message
runtime/orchestrator-service/server.js:20061:      details: error.message
runtime/orchestrator-service/server.js:20081:      details: error.message
runtime/orchestrator-service/server.js:20099:      details: error.message
runtime/orchestrator-service/server.js:20117:      details: error.message
runtime/orchestrator-service/server.js:20128:      details: error.message
runtime/orchestrator-service/server.js:20146:      details: error.message
runtime/orchestrator-service/server.js:20174:      details: error.message
runtime/orchestrator-service/server.js:20186:      details: error.message
runtime/orchestrator-service/server.js:20204:      details: error.message
runtime/orchestrator-service/server.js:20222:      details: error.message
runtime/orchestrator-service/server.js:20241:      details: error.message
runtime/orchestrator-service/server.js:20259:    details: error.message
runtime/orchestrator-service/server.js:20279:      details: error.message
runtime/orchestrator-service/server.js:20297:      details: error.message
runtime/orchestrator-service/server.js:20315:      details: error.message
runtime/orchestrator-service/server.js:20326:      details: error.message
runtime/orchestrator-service/server.js:20344:      details: error.message
runtime/orchestrator-service/server.js:20362:      details: error.message
runtime/orchestrator-service/server.js:20381:      details: error.message
runtime/orchestrator-service/server.js:20399:      details: error.message
runtime/orchestrator-service/server.js:20417:      details: error.message
runtime/orchestrator-service/server.js:20434:      details: error.message
runtime/orchestrator-service/server.js:20452:      details: error.message
runtime/orchestrator-service/server.js:20470:      details: error.message
runtime/orchestrator-service/server.js:20487:      details: error.message
runtime/orchestrator-service/server.js:20505:      details: error.message
runtime/orchestrator-service/server.js:20523:      details: error.message
runtime/orchestrator-service/server.js:20541:      details: error.message
runtime/orchestrator-service/server.js:20559:      details: error.message
runtime/orchestrator-service/server.js:20577:      code: 'UNSUPPORTED_COMMAND',
runtime/orchestrator-service/server.js:20578:      message: `Unsupported command: ${command}`
runtime/orchestrator-service/server.js:20584:      message: 'Failed to execute telegram command'
runtime/orchestrator-service/server.js:20627:      error: sanitizeErrorPayloadForClient(error.response?.data || error.message) || 'Failed to publish clone product'
runtime/orchestrator-service/server.js:20716:      error: sanitizeErrorPayloadForClient(error.response?.data || error.message) || 'Failed to replace original product'
runtime/orchestrator-service/server.js:20763:      message: 'Failed to cleanup clone product'
runtime/orchestrator-service/server.js:20785:        message: 'Blog draft not found'
runtime/orchestrator-service/server.js:20793:        message: 'Blog draft has no body content'
runtime/orchestrator-service/server.js:20805:        message: 'WordPress environment variables are missing'
runtime/orchestrator-service/server.js:20830:        message: `WordPress publish failed with status ${response.status}`
runtime/orchestrator-service/server.js:20869:      message: 'Failed to publish blog draft'
runtime/orchestrator-service/server.js:20893:        message: 'No backup found for this product'
runtime/orchestrator-service/server.js:20937:      message: 'Failed to rollback product'
runtime/orchestrator-service/server.js:20945:const SCHEDULER_VALID_JOB_TYPES = Object.freeze(['publish', 'email', 'media', 'ads']);
runtime/orchestrator-service/server.js:20959:  sanitizeErrorMessage,
runtime/orchestrator-service/server.js:21300:  resolveEmailPackageForExecution,
runtime/orchestrator-service/server.js:21301:  buildEmailReadyPayload,
runtime/orchestrator-service/server.js:21470:      message: error.message || 'Failed to schedule execution job'
runtime/orchestrator-service/server.js:21547:      message: error.message || 'Failed to retrieve scheduler queue'
runtime/orchestrator-service/server.js:21563:    // Phase 1: lock all due jobs atomically
runtime/orchestrator-service/server.js:21616:            error: intelligenceError.message || 'Intelligence loop update failed'
runtime/orchestrator-service/server.js:21629:        const errorMessage = sanitizeErrorMessage(err.message, 'Job execution failed');
runtime/orchestrator-service/server.js:21635:        job.last_error = errorMessage;
runtime/orchestrator-service/server.js:21644:          error: errorMessage,
runtime/orchestrator-service/server.js:21658:          last_error: errorMessage,
runtime/orchestrator-service/server.js:21677:      message: error.message || 'Failed to run scheduler worker'
runtime/orchestrator-service/server.js:21712:      if (!Object.prototype.hasOwnProperty.call(metrics, key)) {
runtime/orchestrator-service/server.js:21749:      message: error.message || 'Failed to record execution feedback'
runtime/orchestrator-service/server.js:21768:      message: error.message || 'Failed to build performance summary'
runtime/orchestrator-service/server.js:21796:      message: error.message || 'Failed to generate optimization recommendations'
runtime/orchestrator-service/server.js:21826:      message: error.message || 'Failed to improve media prompt'
runtime/orchestrator-service/server.js:21856:      message: error.message || 'Failed to run media brand check'
runtime/orchestrator-service/server.js:21886:      message: error.message || 'Failed to generate image'
runtime/orchestrator-service/server.js:21916:      message: error.message || 'Failed to generate video brief'
runtime/orchestrator-service/server.js:21921:app.post('/api/media/generate-voice-script', async (req, res) => {
runtime/orchestrator-service/server.js:21923:    const result = await mediaProviderLayer.generateVoiceScript(req.body || {});
runtime/orchestrator-service/server.js:21930:      output: { voice_script: result.voice_script },
runtime/orchestrator-service/server.js:21939:      voice_script: result.voice_script,
runtime/orchestrator-service/server.js:21945:      code: error.code || 'MEDIA_GENERATE_VOICE_SCRIPT_FAILED',
runtime/orchestrator-service/server.js:21946:      message: error.message || 'Failed to generate voice script'
runtime/orchestrator-service/server.js:21976:      message: error.message || 'Failed to generate campaign pack'
runtime/orchestrator-service/server.js:21995:      message: error.message || 'Failed to get smart suggestions'
runtime/orchestrator-service/server.js:22012:  const responseMessage = statusCode >= 500 && isProduction
runtime/orchestrator-service/server.js:22014:    : sanitizeErrorMessage(err?.message, 'Request failed');
runtime/orchestrator-service/server.js:22032:      message: responseMessage
runtime/orchestrator-service/server.js:22084:    buildCampaignEmailPackage,
runtime/orchestrator-service/package-lock.json:107:    "node_modules/call-bind-apply-helpers": {
runtime/orchestrator-service/package-lock.json:109:      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
runtime/orchestrator-service/package-lock.json:120:    "node_modules/call-bound": {
runtime/orchestrator-service/package-lock.json:122:      "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
runtime/orchestrator-service/package-lock.json:126:        "call-bind-apply-helpers": "^1.0.2",
runtime/orchestrator-service/package-lock.json:286:        "supports-color": {
runtime/orchestrator-service/package-lock.json:315:        "call-bind-apply-helpers": "^1.0.1",
runtime/orchestrator-service/package-lock.json:552:        "call-bind-apply-helpers": "^1.0.2",
runtime/orchestrator-service/package-lock.json:1008:          "url": "https://feross.org/support"
runtime/orchestrator-service/package-lock.json:1092:      "integrity": "sha512-FCLHtRD/gnpCiCHEiJLOwdmFP+wzCmDEkc9y7NsYxeF4u7Btsn1ZuwgwJGxImImHicJArLP4R0yX4c2KCrMrTA==",
runtime/orchestrator-service/package-lock.json:1111:        "call-bound": "^1.0.2",
runtime/orchestrator-service/package-lock.json:1129:        "call-bound": "^1.0.2",
runtime/orchestrator-service/lib/insights/learning-engine.js:55:    item.message ||
runtime/orchestrator-service/lib/insights/learning-engine.js:295:      reason: 'Low CTR usually means the ad message is not matching audience interest strongly enough.'
runtime/orchestrator-service/lib/insights/learning-engine.js:327:      action: 'Sync Facebook, Instagram, TikTok, and YouTube feeds so the system can compare hooks, formats, and publishing windows across channels.',
runtime/orchestrator-service/lib/insights/ingestion-service.js:202:    return `${platformLabel} is already producing conversion signal. Reuse the strongest message pattern and push that learning into future campaigns.`;
runtime/orchestrator-service/lib/insights/ingestion-service.js:294:    instagram: { items: [], meta: [] },
runtime/orchestrator-service/lib/insights/ingestion-service.js:308:          label: item.message || item.id,
runtime/orchestrator-service/lib/insights/ingestion-service.js:312:          why_it_worked: item.message ? 'Facebook post copy is earning visible engagement.' : '',
runtime/orchestrator-service/lib/insights/ingestion-service.js:313:          hook: item.message
runtime/orchestrator-service/lib/insights/ingestion-service.js:319:    if (provider === 'instagram') {
runtime/orchestrator-service/lib/insights/ingestion-service.js:321:        platforms.instagram.items.push(buildContentItem({
runtime/orchestrator-service/lib/insights/ingestion-service.js:323:          platform: 'instagram',
runtime/orchestrator-service/lib/insights/ingestion-service.js:332:      platforms.instagram.meta.push(snapshot);
runtime/orchestrator-service/lib/insights/ingestion-service.js:954:      status: evaluate(['facebook', 'instagram', 'tiktok', 'youtube']),
runtime/orchestrator-service/lib/insights/ingestion-service.js:955:      integrations: ['facebook', 'instagram', 'tiktok', 'youtube']
runtime/orchestrator-service/lib/insights/ingestion-service.js:973:    email_crm: {
runtime/orchestrator-service/lib/insights/ingestion-service.js:974:      status: evaluate(['smtp', 'mailchimp', 'crm']),
runtime/orchestrator-service/lib/insights/ingestion-service.js:975:      integrations: ['smtp', 'mailchimp', 'crm']
runtime/orchestrator-service/lib/insights/ingestion-service.js:995:      platform: 'Instagram',
runtime/orchestrator-service/lib/insights/ingestion-service.js:996:      performance_level: asString(social.instagram?.summary?.performance_level),
runtime/orchestrator-service/lib/insights/ingestion-service.js:997:      strongest_metric: asString(social.instagram?.summary?.strongest_metric),
runtime/orchestrator-service/lib/insights/ingestion-service.js:998:      weakest_metric: asString(social.instagram?.summary?.weakest_metric),
runtime/orchestrator-service/lib/insights/ingestion-service.js:999:      trend_direction: asString(social.instagram?.summary?.trend_direction),
runtime/orchestrator-service/lib/insights/ingestion-service.js:1000:      recommendation: asString(social.instagram?.summary?.recommendation)
runtime/orchestrator-service/lib/insights/ingestion-service.js:1080:    social.instagram?.summary?.reach,
runtime/orchestrator-service/lib/insights/ingestion-service.js:1086:    social.instagram?.summary?.engagement,
runtime/orchestrator-service/lib/insights/ingestion-service.js:1092:    social.instagram?.summary?.clicks,
runtime/orchestrator-service/lib/insights/ingestion-service.js:1101:    social.instagram?.summary?.conversions,
runtime/orchestrator-service/lib/insights/ingestion-service.js:1110:    social.instagram?.summary?.revenue,
runtime/orchestrator-service/lib/security/project-isolation.js:6:function createProjectIsolationError(message, code) {
runtime/orchestrator-service/lib/security/project-isolation.js:7:  const error = new Error(message);
runtime/orchestrator-service/lib/observability/logger.js:40:    return { message: 'Unknown error' };
runtime/orchestrator-service/lib/observability/logger.js:45:    message: String(error.message || 'Unknown error'),
runtime/orchestrator-service/lib/observability/logger.js:54:  function write(level, message, context = {}) {
runtime/orchestrator-service/lib/observability/logger.js:58:      message: String(message || 'log'),
runtime/orchestrator-service/lib/observability/logger.js:79:    info(message, context = {}) {
runtime/orchestrator-service/lib/observability/logger.js:80:      write('info', message, context);
runtime/orchestrator-service/lib/observability/logger.js:82:    warn(message, context = {}) {
runtime/orchestrator-service/lib/observability/logger.js:83:      write('warn', message, context);
runtime/orchestrator-service/lib/observability/logger.js:85:    error(message, context = {}) {
runtime/orchestrator-service/lib/observability/logger.js:86:      write('error', message, context);
runtime/orchestrator-service/lib/observability/logger.js:111:    const message = typeof first === 'string' ? first : 'runtime_log';
runtime/orchestrator-service/lib/observability/logger.js:118:      logger.error(message, context);
runtime/orchestrator-service/lib/observability/logger.js:123:      logger.warn(message, context);
runtime/orchestrator-service/lib/observability/logger.js:127:    logger.info(message, context);
runtime/orchestrator-service/lib/integrations/insights-contract.js:26:  if (/email|audience|contact|crm/.test(scopeText)) return 'crm_email';
runtime/orchestrator-service/lib/integrations/http-client.js:32:function buildProviderError(provider, error, fallbackMessage = 'Provider request failed') {
runtime/orchestrator-service/lib/integrations/http-client.js:35:      message: fallbackMessage,
runtime/orchestrator-service/lib/integrations/http-client.js:42:    const message =
runtime/orchestrator-service/lib/integrations/http-client.js:43:      body?.error?.message ||
runtime/orchestrator-service/lib/integrations/http-client.js:44:      body?.message ||
runtime/orchestrator-service/lib/integrations/http-client.js:46:      `${fallbackMessage} (${error.response.status})`;
runtime/orchestrator-service/lib/integrations/http-client.js:58:      message
runtime/orchestrator-service/lib/integrations/http-client.js:65:    message: error.message || fallbackMessage
runtime/orchestrator-service/lib/integrations/http-client.js:69:function buildResponseError(provider, response, fallbackMessage = 'Provider request failed') {
runtime/orchestrator-service/lib/integrations/http-client.js:76:  }, fallbackMessage);
runtime/orchestrator-service/lib/integrations/provider-registry.js:9:const { createUnsupportedAdapter } = require('./providers/unsupported');
runtime/orchestrator-service/lib/integrations/provider-registry.js:12:const UNSUPPORTED_INTEGRATION_IDS = ['amazon', 'smtp', 'mailer', 'crm'];
runtime/orchestrator-service/lib/integrations/provider-registry.js:13:const unsupportedAdapter = {
runtime/orchestrator-service/lib/integrations/provider-registry.js:14:  ...createUnsupportedAdapter(
runtime/orchestrator-service/lib/integrations/provider-registry.js:15:    UNSUPPORTED_INTEGRATION_IDS,
runtime/orchestrator-service/lib/integrations/provider-registry.js:18:  unsupported: true
runtime/orchestrator-service/lib/integrations/provider-registry.js:30:  unsupportedAdapter
runtime/orchestrator-service/lib/integrations/provider-registry.js:41:function isSupportedProvider(integrationId) {
runtime/orchestrator-service/lib/integrations/provider-registry.js:43:  return Boolean(adapter) && adapter.unsupported !== true;
runtime/orchestrator-service/lib/integrations/provider-registry.js:46:function getUnsupportedProviderMessage(integrationId) {
runtime/orchestrator-service/lib/integrations/provider-registry.js:48:  if (!adapter || adapter.unsupported !== true) {
runtime/orchestrator-service/lib/integrations/provider-registry.js:53:    adapter.unsupportedMessage ||
runtime/orchestrator-service/lib/integrations/provider-registry.js:59:  UNSUPPORTED_INTEGRATION_IDS,
runtime/orchestrator-service/lib/integrations/provider-registry.js:61:  isSupportedProvider,
runtime/orchestrator-service/lib/integrations/provider-registry.js:62:  getUnsupportedProviderMessage
runtime/orchestrator-service/lib/integrations/providers/ebay.js:16:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/woocommerce.js:23:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/woocommerce.js:146:    throw Object.assign(new Error(providerError.message), providerError);
runtime/orchestrator-service/lib/integrations/providers/google.js:25:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/google.js:40:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/google.js:59:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/google.js:84:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/google.js:106:    throw Object.assign(new Error(searchError.message), searchError);
runtime/orchestrator-service/lib/integrations/providers/google.js:130:    throw Object.assign(new Error(videosError.message), videosError);
runtime/orchestrator-service/lib/integrations/providers/google.js:136:async function fetchGoogleAdsCustomer(ctx) {
runtime/orchestrator-service/lib/integrations/providers/google.js:137:  const customerId = asString(ctx.config.customerId);
runtime/orchestrator-service/lib/integrations/providers/google.js:144:    headers['login-customer-id'] = asString(ctx.config.managerId).replace(/-/g, '');
runtime/orchestrator-service/lib/integrations/providers/google.js:149:    url: `https://googleads.googleapis.com/v18/customers/${customerId.replace(/-/g, '')}`,
runtime/orchestrator-service/lib/integrations/providers/google.js:155:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/google.js:174:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/google.js:193:    throw Object.assign(new Error(accountsError.message), accountsError);
runtime/orchestrator-service/lib/integrations/providers/google.js:452:  requireFields(ctx.config, ['customerId']);
runtime/orchestrator-service/lib/integrations/providers/google.js:462:  const customer = await fetchGoogleAdsCustomer(ctx);
runtime/orchestrator-service/lib/integrations/providers/google.js:466:    metadata: customer,
runtime/orchestrator-service/lib/integrations/providers/google.js:471:      account: customer
runtime/orchestrator-service/lib/integrations/providers/google.js:475:    permissionScope: 'Google Ads developer token + customer OAuth access',
runtime/orchestrator-service/lib/integrations/providers/google.js:481:      id: ctx.config.customerId,
runtime/orchestrator-service/lib/integrations/providers/google.js:482:      name: ctx.config.customerId
runtime/orchestrator-service/lib/integrations/providers/google.js:564:    throw new Error(`Unsupported Google integration: ${ctx.integrationId}`);
runtime/orchestrator-service/lib/integrations/providers/google.js:567:    throw Object.assign(new Error(providerError.message), providerError);
runtime/orchestrator-service/lib/integrations/providers/shopify.js:21:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/shopify.js:25:    throw new Error(response.data.errors.map(item => item.message).join(', '));
runtime/orchestrator-service/lib/integrations/providers/shopify.js:44:        email
runtime/orchestrator-service/lib/integrations/providers/unsupported.js:1:function createUnsupportedAdapter(integrationIds = [], message) {
runtime/orchestrator-service/lib/integrations/providers/unsupported.js:2:  async function unsupported(ctx) {
runtime/orchestrator-service/lib/integrations/providers/unsupported.js:3:    const error = new Error(message);
runtime/orchestrator-service/lib/integrations/providers/unsupported.js:4:    error.status = 'unsupported_provider';
runtime/orchestrator-service/lib/integrations/providers/unsupported.js:10:    unsupportedMessage: message,
runtime/orchestrator-service/lib/integrations/providers/unsupported.js:11:    connect: unsupported,
runtime/orchestrator-service/lib/integrations/providers/unsupported.js:12:    testConnection: unsupported,
runtime/orchestrator-service/lib/integrations/providers/unsupported.js:13:    syncCurrent: unsupported,
runtime/orchestrator-service/lib/integrations/providers/unsupported.js:14:    importHistory: unsupported
runtime/orchestrator-service/lib/integrations/providers/unsupported.js:19:  createUnsupportedAdapter
runtime/orchestrator-service/lib/integrations/providers/website.js:16:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/website.js:93:      throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/website.js:119:    throw Object.assign(new Error(providerError.message), providerError);
runtime/orchestrator-service/lib/integrations/providers/meta.js:18:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/meta.js:32:    fields: 'id,name,link,fan_count,followers_count,instagram_business_account{id,username,name,followers_count,media_count}'
runtime/orchestrator-service/lib/integrations/providers/meta.js:47:async function fetchInstagramAccount(accessToken, businessAccountId, profileUrl) {
runtime/orchestrator-service/lib/integrations/providers/meta.js:55:    fields: 'id,name,instagram_business_account{id,username,name,followers_count,media_count}'
runtime/orchestrator-service/lib/integrations/providers/meta.js:59:    const account = page.instagram_business_account;
runtime/orchestrator-service/lib/integrations/providers/meta.js:69:  throw new Error('No Instagram business account found for the provided token');
runtime/orchestrator-service/lib/integrations/providers/meta.js:115:    fields: 'id,message,created_time,permalink_url,likes.summary(true),comments.summary(true)',
runtime/orchestrator-service/lib/integrations/providers/meta.js:130:        message: item.message || '',
runtime/orchestrator-service/lib/integrations/providers/meta.js:146:async function connectInstagram(ctx) {
runtime/orchestrator-service/lib/integrations/providers/meta.js:148:  const account = await fetchInstagramAccount(
runtime/orchestrator-service/lib/integrations/providers/meta.js:157:    health: 'Instagram business access validated successfully.',
runtime/orchestrator-service/lib/integrations/providers/meta.js:160:      provider: 'instagram',
runtime/orchestrator-service/lib/integrations/providers/meta.js:169:    notes: 'Connected through the Instagram Graph API.',
runtime/orchestrator-service/lib/integrations/providers/meta.js:171:    permissionScope: 'Instagram business insights and publishing access',
runtime/orchestrator-service/lib/integrations/providers/meta.js:183:async function syncInstagram(ctx) {
runtime/orchestrator-service/lib/integrations/providers/meta.js:184:  const account = await fetchInstagramAccount(
runtime/orchestrator-service/lib/integrations/providers/meta.js:199:    health: 'Instagram media data synced successfully.',
runtime/orchestrator-service/lib/integrations/providers/meta.js:202:      provider: 'instagram',
runtime/orchestrator-service/lib/integrations/providers/meta.js:214:    notes: 'Synced recent Instagram media and engagement counts.',
runtime/orchestrator-service/lib/integrations/providers/meta.js:328:    if (ctx.integrationId === 'instagram') {
runtime/orchestrator-service/lib/integrations/providers/meta.js:329:      return type === 'sync' || type === 'import' ? syncInstagram(ctx) : connectInstagram(ctx);
runtime/orchestrator-service/lib/integrations/providers/meta.js:338:    throw new Error(`Unsupported Meta integration: ${ctx.integrationId}`);
runtime/orchestrator-service/lib/integrations/providers/meta.js:341:    throw Object.assign(new Error(providerError.message), providerError);
runtime/orchestrator-service/lib/integrations/providers/meta.js:346:  integrationIds: ['facebook', 'instagram', 'meta-ads', 'meta-pixel'],
runtime/orchestrator-service/lib/integrations/providers/ops.js:15:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/ops.js:55:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/ops.js:95:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/ops.js:137:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/ops.js:183:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/ops.js:226:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/ops.js:265:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/ops.js:273:      scope: 'email',
runtime/orchestrator-service/lib/integrations/providers/ops.js:277:        email: response.data.email
runtime/orchestrator-service/lib/integrations/providers/ops.js:283:    readScopes: ['email'],
runtime/orchestrator-service/lib/integrations/providers/ops.js:284:    writeScopes: ['email'],
runtime/orchestrator-service/lib/integrations/providers/ops.js:303:    throw new Error(`Unsupported Ops integration: ${ctx.integrationId}`);
runtime/orchestrator-service/lib/integrations/providers/ops.js:306:    throw Object.assign(new Error(providerError.message), providerError);
runtime/orchestrator-service/lib/integrations/providers/tiktok.js:16:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/tiktok.js:35:    throw Object.assign(new Error(error.message), error);
runtime/orchestrator-service/lib/integrations/providers/tiktok.js:256:    throw new Error(`Unsupported TikTok integration: ${ctx.integrationId}`);
runtime/orchestrator-service/lib/integrations/providers/tiktok.js:259:    throw Object.assign(new Error(providerError.message), providerError);
runtime/orchestrator-service/lib/integrations/token-manager.js:20: *      Legacy path: key was auto-generated and stored locally.
runtime/orchestrator-service/lib/integrations/adapter-manager.js:70:    throw new Error(`Provider adapter for ${integrationId} does not support ${actionType}`);
runtime/orchestrator-service/lib/integrations/adapter-manager.js:146:      note: providerError.message
runtime/orchestrator-service/lib/integrations/adapter-manager.js:149:    throw Object.assign(new Error(providerError.message), providerError);
runtime/orchestrator-service/lib/integrations/storage.js:26: * not abort the caller. Logs a console.warn on parse failure so it is never
runtime/orchestrator-service/lib/integrations/storage.js:42:    console.warn(`[storage] readJsonFile: non-fatal read/parse error for ${filePath}, returning fallback. Error: ${err.message}`);
runtime/orchestrator-service/lib/integrations/storage.js:50: * - If the file does not exist: returns null (caller decides the default).
runtime/orchestrator-service/lib/integrations/storage.js:53: *   The caller must handle the thrown error — it must NOT silently fall back.
runtime/orchestrator-service/lib/integrations/storage.js:67:      new Error(`[storage] Failed to read durable file ${filePath}: ${err.message}`),
runtime/orchestrator-service/lib/integrations/storage.js:88:      new Error(`[storage] Corrupt JSON quarantined to ${corruptPath} — ${parseErr.message}`),
runtime/orchestrator-service/lib/integrations/storage.js:122:    // fsync is best-effort — some filesystems (e.g. network mounts) may not support it
runtime/orchestrator-service/lib/integrations/storage.js:143:      new Error(`[storage] Atomic rename failed for ${filePath}: ${err.message}`),
runtime/orchestrator-service/lib/execution/performance-metrics.js:17:  if (Object.prototype.hasOwnProperty.call(input || {}, 'cost')) {
runtime/orchestrator-service/lib/execution/learning-patterns.js:25:        support_count: Number(current.support_count || 0) + Number(pattern.support_count || 1),
runtime/orchestrator-service/lib/execution/learning-patterns.js:37:      support_count: Number(pattern.support_count || 1),
runtime/orchestrator-service/lib/execution/scheduler-helpers.js:34:    email: '/execute_email_package',
runtime/orchestrator-service/lib/execution/scheduler-storage.js:13:    sanitizeErrorMessage,
runtime/orchestrator-service/lib/execution/scheduler-storage.js:52:      error: entry.error ? sanitizeErrorMessage(entry.error, 'Worker error') : null,
runtime/orchestrator-service/lib/execution/execution-job-bridge.js:7:    resolveEmailPackageForExecution,
runtime/orchestrator-service/lib/execution/execution-job-bridge.js:8:    buildEmailReadyPayload,
runtime/orchestrator-service/lib/execution/execution-job-bridge.js:31:    if (job.type === 'email') {
runtime/orchestrator-service/lib/execution/execution-job-bridge.js:32:      const emailPackage = resolveEmailPackageForExecution(project, payload);
runtime/orchestrator-service/lib/execution/execution-job-bridge.js:33:      const emailPayload = buildEmailReadyPayload(emailPackage);
runtime/orchestrator-service/lib/execution/execution-job-bridge.js:36:        subject: emailPayload.subject,
runtime/orchestrator-service/lib/execution/recommendation-builders.js:14:        message: `${trend.channel} is declining (${trend.change_pct}% recent score trend).`
runtime/orchestrator-service/lib/execution/recommendation-builders.js:32:        message: `Low engagement detected on ${record.channel} (ER ${Number((engagementRate * 100).toFixed(2))}%).`
runtime/orchestrator-service/lib/execution/recommendation-builders.js:46:        message: `Budget inefficiency on ${record.channel} (cost ${cost}, conversions ${conversions}, roas ${roas == null ? 'n/a' : roas}).`
runtime/orchestrator-service/lib/execution/recommendation-builders.js:63:        support_count: channel.count,
runtime/orchestrator-service/lib/execution/recommendation-builders.js:75:        support_count: hook.count,
runtime/orchestrator-service/lib/execution/recommendation-builders.js:88:        support_count: 2,
runtime/orchestrator-service/lib/ai/provider-registry.js:23:function isAiProviderSupported(providerId) {
runtime/orchestrator-service/lib/ai/provider-registry.js:33:  isAiProviderSupported,
runtime/orchestrator-service/lib/ai/providers/openai.js:70:  const emailCopy = normalizeReadableList(pack.emailCopy || pack.email_copy || pack.emails, 6);
runtime/orchestrator-service/lib/ai/providers/openai.js:84:  if (emailCopy.length) {
runtime/orchestrator-service/lib/ai/providers/openai.js:85:    blocks.push(['Email Copy:', renderNumberedLines(emailCopy)].join('\n'));
runtime/orchestrator-service/lib/ai/providers/openai.js:112:    const cta = humanizeValue(record.cta || record.CTA || record.callToAction || record.call_to_action);
runtime/orchestrator-service/lib/ai/providers/openai.js:191:function extractMessageContent(payload = {}) {
runtime/orchestrator-service/lib/ai/providers/openai.js:192:  const content = payload?.choices?.[0]?.message?.content;
runtime/orchestrator-service/lib/ai/providers/openai.js:217:    let content = humanizeValue(parsed.content || parsed.message || parsed.output);
runtime/orchestrator-service/lib/ai/providers/openai.js:288:        messages: [
runtime/orchestrator-service/lib/ai/providers/openai.js:294:              'Use the supplied project context, market, brand voice, readiness blockers, integrations, learning, and research notes.',
runtime/orchestrator-service/lib/ai/providers/openai.js:300:              `Set outputType to "${requestedOutputType}" unless the command clearly requires a better supported output type.`,
runtime/orchestrator-service/lib/ai/providers/openai.js:303:              'For outputType "content_pack", include contentPack with hooks, captions, scripts, emailCopy, landingPageSections, or postIdeas as relevant.',
runtime/orchestrator-service/lib/ai/providers/openai.js:344:        const providerMessage =
runtime/orchestrator-service/lib/ai/providers/openai.js:348:          error?.response?.data?.error?.message ||
runtime/orchestrator-service/lib/ai/providers/openai.js:349:          error?.response?.data?.message ||
runtime/orchestrator-service/lib/ai/providers/openai.js:350:          error?.message ||
runtime/orchestrator-service/lib/ai/providers/openai.js:352:        const providerError = new Error(`OpenAI provider failed: ${providerMessage}`);
runtime/orchestrator-service/lib/ai/providers/openai.js:363:      const rawText = extractMessageContent(response.data);
runtime/orchestrator-service/lib/ai/provider-config.js:14:function createProviderConfigError(message, details = {}) {
runtime/orchestrator-service/lib/ai/provider-config.js:15:  const error = new Error(String(message || 'AI provider configuration is invalid'));
runtime/orchestrator-service/lib/ai/provider-config.js:45:    purpose: 'captions, hooks, scripts, post ideas, email copy, and landing page sections',
runtime/orchestrator-service/lib/ai/provider-config.js:49:      'Produce direct content outputs: captions, hooks, scripts, post ideas, emails, and landing page sections.',
runtime/orchestrator-service/lib/ops/backbone.js:104:    bridge_actions: ['execute_publish_package', 'execute_email_package', 'generate_media_from_prompt', 'build_ad_execution_package']
runtime/orchestrator-service/lib/ops/backbone.js:455:    console.error(`[backbone] readTeamModel: team file corrupt for project ${projectName}: ${err.message}`);
runtime/orchestrator-service/lib/ops/backbone.js:467:    console.error(`[backbone] updateTeamModel: team file corrupt for project ${projectName}: ${err.message}`);
runtime/orchestrator-service/lib/ops/backbone.js:890:    // System file is corrupt — log and re-throw so the caller sees a 500
runtime/orchestrator-service/lib/ops/backbone.js:891:    console.error(`[backbone] updateSystem: system file is corrupt for project ${paths.project}: ${err.message}`);
runtime/orchestrator-service/lib/ops/backbone.js:939:    console.error(`[backbone] readCollection: corrupt file quarantined: ${filePath} — ${err.message}`);
runtime/orchestrator-service/lib/ops/backbone.js:1011:    message: asString(input.message || input.body || input.summary),
runtime/orchestrator-service/lib/ops/backbone.js:1013:    body: asString(input.body || input.summary || input.message),
runtime/orchestrator-service/lib/ops/backbone.js:1221:    console.error(`[backbone] getGovernancePolicy: governance file corrupt for project ${projectName}: ${err.message}`);
runtime/orchestrator-service/lib/ops/backbone.js:1348:      message: 'Publishing is frozen by governance policy.'
runtime/orchestrator-service/lib/ops/backbone.js:1352:  if (/guarantee|clinically|regrow|cure|instant results|100%/i.test(text)) {
runtime/orchestrator-service/lib/ops/backbone.js:1356:      message: 'Potentially unsupported or regulated claim language detected.'
runtime/orchestrator-service/lib/ops/backbone.js:1364:      message: 'Brand safety review recommended before release.'
runtime/orchestrator-service/lib/ops/backbone.js:1382:    { regex: /clinically|dermatologist|doctor recommended/i, label: 'Clinical authority claim detected', severity: 'high' },
runtime/orchestrator-service/lib/ops/backbone.js:1392:      message: item.label
runtime/orchestrator-service/lib/ops/backbone.js:1410:      message: 'Third-party identity or trademark risk detected.'
runtime/orchestrator-service/lib/ops/backbone.js:1418:      message: 'Content pattern may violate brand safety expectations.'
runtime/orchestrator-service/lib/ops/backbone.js:1427:        message: 'Media asset has not completed brand safety review.'
runtime/orchestrator-service/lib/ops/backbone.js:1448:      message: 'Publishing item has no schedule locked.'
runtime/orchestrator-service/lib/ops/backbone.js:1456:      message: 'Publishing item is not marked approved/ready under current policy.'
runtime/orchestrator-service/lib/ops/backbone.js:1464:      message: 'Publishing freeze is active.'
runtime/orchestrator-service/lib/ops/backbone.js:1533:        message: flag.message
runtime/orchestrator-service/lib/ops/backbone.js:1544:        message: flag.message
runtime/orchestrator-service/lib/ops/backbone.js:1555:        message: flag.message
runtime/orchestrator-service/lib/ops/backbone.js:1566:        message: flag.message
runtime/orchestrator-service/lib/ops/backbone.js:2124:    message:
runtime/orchestrator-service/lib/ops/backbone.js:2519:    message: 'The task is now available for team execution and follow-up.',
runtime/orchestrator-service/lib/ops/backbone.js:2662:    message: approval.summary || 'Review and decide on the requested operation.',
runtime/orchestrator-service/lib/ops/backbone.js:2816:    message: next.decision_note || `Approval was ${decision}.`,
runtime/orchestrator-service/lib/ops/backbone.js:3182:      message: 'The publishing item is waiting for operator approval or handoff.',
runtime/orchestrator-service/lib/ops/backbone.js:3200:      message: 'Publishing execution completed and was recorded durably.',
runtime/orchestrator-service/lib/ops/backbone.js:3218:      message: 'Publishing execution needs follow-up.',
runtime/orchestrator-service/lib/ops/backbone.js:3661:    message: asString(input.message || input.body || input.summary),
runtime/orchestrator-service/lib/ops/backbone.js:3706:      message: asString(item.summary) || 'Approval requires review.',
runtime/orchestrator-service/lib/ops/backbone.js:3719:      message:
runtime/orchestrator-service/lib/ops/backbone.js:3761:        message: asString(flag.message),
runtime/orchestrator-service/lib/ops/backbone.js:3772:        message: asString(item.message),
runtime/orchestrator-service/lib/ops/backbone.js:3786:      message:
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:13:  isAiProviderSupported,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:95:function createAiCommandExecutionError(message, details = {}) {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:96:  const error = new Error(asString(message) || 'AI command execution failed');
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:153:function inferConversationLanguage(input = {}) {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:198:  const conversationLanguage = inferConversationLanguage(input);
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:201:  const languagesDiffer = outputLanguage !== 'user language' && outputLanguage !== conversationLanguage;
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:210:    ? 'As Content Writer, return actual copy now: hooks, captions, CTA lines, emails, scripts, and landing copy. Never answer with only a description of what the copy could be.'
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:226:    `Conversation language (language the user is writing in): ${conversationLanguage}`,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:232:    'Language separation rule: explanations, notes, and next-step guidance must stay in the conversation language.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:234:    'Start with one brief sentence in the conversation language, then add a clearly labeled publishable content section in the output language.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:235:    conversationLanguage !== 'user language'
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:236:      ? `Always respond to the user, explain, and interact in ${conversationLanguage}.`
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:239:      ? `Generate all publishable content (hooks, captions, scripts, emails, copy, headlines) in ${outputLanguage} because that is the project publishing language.`
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:240:      : 'Generate publishable content in the same language as your conversation.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:242:      ? `When the output language differs from the conversation language, label the publishable section clearly, for example: "${outputLanguage} hooks for the ${market || outputLanguage} market:".`
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:247:    'If the user asks for hooks, captions, scripts, emails, headlines, tasks, workflow steps, or checklists, produce the actual requested items.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:255:    'The next-step suggestion must be in the conversation language, not the publishing/output language, unless they are the same.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:283:      "Focus on captions, hooks, scripts, emails, landing page copy, tone, clarity, and conversion.",
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:314:      "When asked to approve or publish, do not approve automatically; prepare review guidance only."
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:319:      "When asked to turn conversation into work, prepare a task/workflow-ready draft but do not execute it."
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:321:    customer_ops: [
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:322:      "Specialist role: Customer Experience Operations Lead.",
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:323:      "Focus on inbox review, reply drafts, customer service, SLA thinking, escalation paths, and support tone.",
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:324:      "Do not send customer replies or mutate tickets from chat; prepare safe drafts and guidance only."
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:327:      "Specialist role: Sales and CRM Lead.",
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:328:      "Focus on leads, follow-up drafts, CRM notes, offers, pipeline thinking, and relationship management.",
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:329:      "Do not update CRM, send outreach, or schedule follow-ups from chat; prepare drafts and next-step guidance only."
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:333:      "Think across strategy, content, media, publishing, ads, SEO, compliance, operations, customer operations, and sales.",
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:341:    "Be conversational, helpful, and safe. Prepare work only when requested; do not claim backend actions were executed."
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:349:  const request = asString(input.request || input.prompt || input.message || input.command);
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:353:  const conversationLanguage = inferConversationLanguage(input);
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:357:  const messages = Array.isArray(input.messages) ? input.messages.slice(-8) : [];
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:359:  const messageContext = messages.map((message, index) => {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:360:    const role = asString(message.role || message.type || 'message');
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:361:    const author = asString(message.specialistLabel || message.author || message.name || role);
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:362:    const content = humanizeValue(message.content || message.text || message.message || message.responseText || message.prompt);
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:366:  const languagesDiffer = conversationLanguage && outputLanguage && conversationLanguage !== outputLanguage;
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:370:    'Chat-only live specialist conversation for MH Assistant OS.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:374:    `Conversation language: ${conversationLanguage}`,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:380:    '- Reply directly to the latest user message.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:381:    '- Strict language separation: interaction, explanations, framing, notes, and next-step guidance must stay in the conversation language.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:382:    '- If conversation language is Arabic, the first sentence must be Arabic and the next-step guidance must be Arabic.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:384:    '- MANDATORY FORMAT when conversation language differs from publishable output language: first write one short opening sentence in the conversation language.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:386:    '- Then write a final section titled Next step in the conversation language, not the publishable output language.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:387:    '- For Arabic conversations, the opening sentence and final next step must use Arabic script.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:391:    '- If the user asks for copy, caption, script, plan, task, workflow, handoff, or route, help prepare it conversationally.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:393:    '- You may suggest another specialist or page, but do not claim that anything was transferred automatically.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:395:    conversationLanguage !== 'user language'
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:396:      ? `Use ${conversationLanguage} for interaction and explanations.`
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:400:      : 'Use the conversation language for publishable content unless the user asks otherwise.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:404:    '- Do not claim that publishing, approval, deletion, sync, CRM update, customer reply, workflow run, export, task creation, handoff creation, or backend action happened.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:410:    messageContext ? `Recent chat context:\n${messageContext}` : '',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:412:    'Latest user message:',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:427:    provider.message,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:432:    raw.message,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:454:  const conversationLanguage = inferConversationLanguage(input);
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:458:  const needsArabicFrame = conversationLanguage === 'Arabic'
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:484:    provider.message,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:488:    raw.message,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:513:    provider.message,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:518:    raw.message,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:581:      pattern: /\b(caption|post|reel script|script|email|landing page section|landing page copy|content pack|content ideas?|copy|blog intro|social post)\b/
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:803:      cta: humanizeValue(record.cta || record.CTA || record.callToAction || record.call_to_action),
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:871:    emailCopy: normalizeReadableList(record.emailCopy || record.email_copy || record.emails, 5),
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1070:      const command = asString(input.command || input.message);
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1092:        if (!isAiProviderSupported(providerConfig.provider)) {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1094:            `Unsupported AI provider "${providerConfig.provider}". Supported providers: ${listAiProviders().join(', ')}`,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1096:              code: 'AI_PROVIDER_UNSUPPORTED',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1113:        logger.info('ai_provider_call_started', {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1301:        const failureMessage = asString(error.message) || 'AI command execution failed';
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1306:          error: failureMessage,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1343:          error: failureMessage,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1350:        const executionError = createAiCommandExecutionError(failureMessage, {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1360:      const request = asString(input.request || input.prompt || input.message || input.command);
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1368:      const conversationLanguage = inferConversationLanguage(input);
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1388:        if (!isAiProviderSupported(providerConfig.provider)) {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1390:            `Unsupported AI provider "${providerConfig.provider}". Supported providers: ${listAiProviders().join(', ')}`,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1392:              code: 'AI_PROVIDER_UNSUPPORTED',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1409:        logger.info('ai_chat_provider_call_started', {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1425:            conversation_language: conversationLanguage,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1448:            conversationLanguage,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1462:            sent_customer_reply: false,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1463:            mutated_crm: false,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1502:        const failureMessage = asString(error.message) || 'AI chat execution failed';
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1504:        const chatError = createAiCommandExecutionError(failureMessage, {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1511:          error: failureMessage,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1530:      const conversationLanguage = inferConversationLanguage(input);
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1552:        if (!isAiProviderSupported(providerConfig.provider)) {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1554:            `Unsupported AI provider "${providerConfig.provider}". Supported providers: ${listAiProviders().join(', ')}`,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1556:              code: 'AI_PROVIDER_UNSUPPORTED',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1573:        logger.info('ai_guidance_provider_call_started', {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1590:            conversation_language: conversationLanguage,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1625:            conversationLanguage,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1693:        const failureMessage = asString(error.message) || 'AI guidance execution failed';
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1695:        const guidanceError = createAiCommandExecutionError(failureMessage, {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1701:          error: failureMessage,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1709:            conversationLanguage,
runtime/orchestrator-service/lib/data/execution-artifact-writer-adapter.js:17:  email: {
runtime/orchestrator-service/lib/data/execution-artifact-writer-adapter.js:168:          error: error.message
runtime/orchestrator-service/lib/data/execution-artifact-writer-adapter.js:190:      throw new Error(`Unsupported dual-write domain: ${input.domain}`);
runtime/orchestrator-service/lib/data/execution-artifact-writer-adapter.js:231:        `[ExecutionArtifactWriterAdapter] failed to persist telemetry: ${error.message}`
runtime/orchestrator-service/lib/data/unified-data-path-resolver.js:53:      email_read_canonical_first: parseBooleanFlag(
runtime/orchestrator-service/lib/data/unified-data-path-resolver.js:54:        process.env.EMAIL_READ_CANONICAL_FIRST,
runtime/orchestrator-service/lib/data/unified-data-path-resolver.js:112:      email: 'email_read_canonical_first',
runtime/orchestrator-service/lib/data/unified-data-path-resolver.js:259:      'email',
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:4:  createCustomerProfileContract
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:5:} = require('../../contracts/customer-profile-contract');
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:7:const customers = new Map();
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:9:function createCustomerProfile(input = {}) {
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:10:  const profile = createCustomerProfileContract(input);
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:12:  if (!profile.customer_id) {
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:13:    throw new Error('customer_id is required');
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:16:  customers.set(profile.customer_id, profile);
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:21:function getCustomerProfile(customerId) {
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:22:  return customers.get(String(customerId || '')) || null;
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:25:function listCustomerProfiles() {
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:26:  return Array.from(customers.values());
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:29:function updateCustomerProfile(customerId, updates = {}) {
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:30:  const current = getCustomerProfile(customerId);
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:45:  customers.set(current.customer_id, updated);
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:51:  createCustomerProfile,
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:52:  getCustomerProfile,
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:53:  listCustomerProfiles,
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js:54:  updateCustomerProfile
runtime/orchestrator-service/lib/customer-operations/tickets/README.md:1:# Tickets Runtime
runtime/orchestrator-service/lib/customer-operations/tickets/README.md:3:Ticket lifecycle authority.
runtime/orchestrator-service/lib/customer-operations/tickets/README.md:6:- ticket creation
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:4:  createTicketContract
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:5:} = require('../../contracts/ticket-contract');
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:7:const tickets = new Map();
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:9:function createTicket(input = {}) {
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:10:  const ticket = createTicketContract(input);
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:12:  if (!ticket.ticket_id) {
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:13:    throw new Error('ticket_id is required');
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:16:  tickets.set(ticket.ticket_id, ticket);
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:18:  return ticket;
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:21:function getTicket(ticketId) {
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:22:  return tickets.get(String(ticketId || '')) || null;
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:25:function listTickets() {
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:26:  return Array.from(tickets.values());
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:29:function updateTicket(ticketId, updates = {}) {
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:30:  const current = getTicket(ticketId);
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:45:  tickets.set(current.ticket_id, updated);
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:51:  createTicket,
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:52:  getTicket,
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:53:  listTickets,
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:54:  updateTicket
runtime/orchestrator-service/lib/customer-operations/contracts/message-contract.js:3:function createMessageContract(input = {}) {
runtime/orchestrator-service/lib/customer-operations/contracts/message-contract.js:5:    message_id: String(input.message_id || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/message-contract.js:6:    conversation_id: String(input.conversation_id || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/message-contract.js:13:      type: String(input.sender?.type || 'customer'),
runtime/orchestrator-service/lib/customer-operations/contracts/message-contract.js:39:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/contracts/message-contract.js:45:  createMessageContract
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:3:function createUnifiedInboxContract(input = {}) {
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:5:    inbox_id: String(input.inbox_id || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:12:    conversation: {
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:13:      conversation_id: String(
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:14:        input.conversation?.conversation_id || ''
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:17:      customer_id: String(
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:18:        input.conversation?.customer_id || ''
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:24:        input.assignment?.assigned_team || 'customer-care'
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:57:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:63:  createUnifiedInboxContract
runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js:3:function createConversationContract(input = {}) {
runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js:5:    conversation_id: String(input.conversation_id || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js:7:    customer_id: String(input.customer_id || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js:17:    last_message_at: input.last_message_at || new Date().toISOString(),
runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js:32:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js:38:  createConversationContract
runtime/orchestrator-service/lib/customer-operations/contracts/README.md:1:# Customer Operations Contracts
runtime/orchestrator-service/lib/customer-operations/contracts/README.md:4:- conversation contracts
runtime/orchestrator-service/lib/customer-operations/contracts/README.md:5:- ticket contracts
runtime/orchestrator-service/lib/customer-operations/contracts/README.md:6:- customer profile contracts
runtime/orchestrator-service/lib/customer-operations/contracts/README.md:7:- channel message contracts
runtime/orchestrator-service/lib/customer-operations/contracts/ticket-contract.js:3:function createTicketContract(input = {}) {
runtime/orchestrator-service/lib/customer-operations/contracts/ticket-contract.js:5:    ticket_id: String(input.ticket_id || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/ticket-contract.js:6:    conversation_id: String(input.conversation_id || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/ticket-contract.js:8:    type: String(input.type || 'support'),
runtime/orchestrator-service/lib/customer-operations/contracts/ticket-contract.js:12:    customer_id: String(input.customer_id || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/ticket-contract.js:33:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/contracts/ticket-contract.js:39:  createTicketContract
runtime/orchestrator-service/lib/customer-operations/contracts/escalation-contract.js:8:      type: String(input.source?.type || 'conversation'),
runtime/orchestrator-service/lib/customer-operations/contracts/escalation-contract.js:16:        input.routing?.assigned_team || 'customer-care'
runtime/orchestrator-service/lib/customer-operations/contracts/escalation-contract.js:55:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:3:function createCustomerProfileContract(input = {}) {
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:5:    customer_id: String(input.customer_id || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:9:      email: String(input.profile?.email || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:16:      instagram: String(input.channels?.instagram || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:17:      whatsapp: String(input.channels?.whatsapp || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:29:    crm: {
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:30:      owner: String(input.crm?.owner || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:31:      stage: String(input.crm?.stage || 'new'),
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:32:      source: String(input.crm?.source || '')
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:43:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:49:  createCustomerProfileContract
runtime/orchestrator-service/lib/customer-operations/contracts/sla-policy-contract.js:9:      customer_type: String(input.scope?.customer_type || 'default'),
runtime/orchestrator-service/lib/customer-operations/contracts/sla-policy-contract.js:36:        input.escalation?.escalation_queue || 'customer-care'
runtime/orchestrator-service/lib/customer-operations/contracts/sla-policy-contract.js:41:      auto_reply_enabled: Boolean(
runtime/orchestrator-service/lib/customer-operations/contracts/sla-policy-contract.js:42:        input.ai?.auto_reply_enabled ?? true
runtime/orchestrator-service/lib/customer-operations/contracts/sla-policy-contract.js:53:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:3:const conversationStore = require('./conversations/store/conversation-store');
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:4:const ticketStore = require('./tickets/store/ticket-store');
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:6:const messageStore = require('./conversations/messages/message-store');
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:8:const customerProfileStore = require('./customers/store/customer-profile-store');
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:14:const unifiedInboxStore = require('./unified-inbox/store/unified-inbox-store');
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:17:  createIntegrationInboxSeed
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:18:} = require('./unified-inbox/register-integration-inbox');
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:40:  createCustomerOperationsReadinessSnapshot
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:41:} = require('./readiness/customer-operations-readiness-snapshot');
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:43:function createCustomerOperationsRuntime() {
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:48:    conversations: {
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:49:      create: conversationStore.createConversation,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:50:      get: conversationStore.getConversation,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:51:      list: conversationStore.listConversations,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:52:      update: conversationStore.updateConversation
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:61:    unifiedInbox: {
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:62:      create: unifiedInboxStore.createInboxEntry,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:63:      get: unifiedInboxStore.getInboxEntry,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:64:      list: unifiedInboxStore.listInboxEntries,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:65:      update: unifiedInboxStore.updateInboxEntry,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:66:      createFromIntegration: createIntegrationInboxSeed
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:83:    customers: {
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:84:      create: customerProfileStore.createCustomerProfile,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:85:      get: customerProfileStore.getCustomerProfile,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:86:      list: customerProfileStore.listCustomerProfiles,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:87:      update: customerProfileStore.updateCustomerProfile
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:90:    messages: {
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:91:      create: messageStore.createMessage,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:92:      get: messageStore.getMessage,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:93:      list: messageStore.listMessages,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:94:      listByConversation:
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:95:        messageStore.listConversationMessages
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:103:    tickets: {
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:104:      create: ticketStore.createTicket,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:105:      get: ticketStore.getTicket,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:106:      list: ticketStore.listTickets,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:107:      update: ticketStore.updateTicket
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:111:      snapshot: () => createCustomerOperationsReadinessSnapshot(runtime)
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:116:        runtime: 'mh-os-customer-operations',
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:119:          conversations: true,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:120:          tickets: true,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:123:          messages: true,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:124:          customers: true,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:127:          unified_inbox: true,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:128:          integration_inbox_bridge: true,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:129:          voice: false,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:130:          ivr: false,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:132:          crm: false
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:142:  createCustomerOperationsRuntime
runtime/orchestrator-service/lib/customer-operations/README.md:1:# Customer Operations Runtime
runtime/orchestrator-service/lib/customer-operations/README.md:5:- customer conversations
runtime/orchestrator-service/lib/customer-operations/README.md:6:- tickets
runtime/orchestrator-service/lib/customer-operations/README.md:7:- unified inbox
runtime/orchestrator-service/lib/customer-operations/README.md:10:- customer profiles
runtime/orchestrator-service/lib/customer-operations/README.md:12:- voice / IVR
runtime/orchestrator-service/lib/customer-operations/README.md:13:- AI customer operations
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:4:  createMessageContract
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:5:} = require('../../contracts/message-contract');
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:7:const messages = new Map();
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:9:function createMessage(input = {}) {
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:10:  const message = createMessageContract(input);
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:12:  if (!message.message_id) {
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:13:    throw new Error('message_id is required');
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:16:  messages.set(message.message_id, message);
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:18:  return message;
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:21:function getMessage(messageId) {
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:22:  return messages.get(String(messageId || '')) || null;
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:25:function listMessages() {
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:26:  return Array.from(messages.values());
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:29:function listConversationMessages(conversationId) {
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:30:  const id = String(conversationId || '');
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:32:  return listMessages().filter(
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:33:    (message) => message.conversation_id === id
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:38:  createMessage,
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:39:  getMessage,
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:40:  listMessages,
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js:41:  listConversationMessages
runtime/orchestrator-service/lib/customer-operations/conversations/README.md:1:# Conversations Runtime
runtime/orchestrator-service/lib/customer-operations/conversations/README.md:3:Conversation lifecycle authority.
runtime/orchestrator-service/lib/customer-operations/conversations/README.md:6:- inbox threads
runtime/orchestrator-service/lib/customer-operations/conversations/README.md:7:- AI/human messages
runtime/orchestrator-service/lib/customer-operations/conversations/README.md:9:- conversation state
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:4:  createIntegrationInboxSeed
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:5:} = require('../unified-inbox/register-integration-inbox');
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:8:  createConversation
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:9:} = require('./store/conversation-store');
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:12:  createMessage
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:13:} = require('./messages/message-store');
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:19:function createIntegrationConversationSession(
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:24:  const inboxSeed = createIntegrationInboxSeed(
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:30:  if (!inboxSeed.created) {
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:33:      reason: inboxSeed.reason,
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:38:  const inbox = inboxSeed.inbox;
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:40:  const conversation = createConversation({
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:41:    conversation_id: inbox.conversation.conversation_id,
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:42:    channel: inbox.channel.channel_id,
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:43:    customer_id: inbox.conversation.customer_id,
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:44:    assigned_ai_agent: inbox.assignment.assigned_ai_agent,
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:45:    priority: inbox.state.priority,
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:49:  const message = createMessage({
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:50:    message_id: asString(
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:51:      payload.message_id ||
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:52:      `${conversation.conversation_id}_message_1`
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:54:    conversation_id: conversation.conversation_id,
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:55:    channel_id: inbox.channel.channel_id,
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:58:      id: asString(payload.customer_id || ''),
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:59:      type: 'customer',
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:64:        payload.message ||
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:65:        'New customer conversation started.'
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:75:    inbox,
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:76:    conversation,
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:77:    message
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js:82:  createIntegrationConversationSession
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:4:  createConversationContract
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:5:} = require('../../contracts/conversation-contract');
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:7:const conversations = new Map();
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:9:function createConversation(input = {}) {
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:10:  const conversation = createConversationContract(input);
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:12:  if (!conversation.conversation_id) {
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:13:    throw new Error('conversation_id is required');
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:16:  conversations.set(conversation.conversation_id, conversation);
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:18:  return conversation;
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:21:function getConversation(conversationId) {
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:22:  return conversations.get(String(conversationId || '')) || null;
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:25:function listConversations() {
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:26:  return Array.from(conversations.values());
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:29:function updateConversation(conversationId, updates = {}) {
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:30:  const current = getConversation(conversationId);
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:45:  conversations.set(current.conversation_id, updated);
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:51:  createConversation,
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:52:  getConversation,
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:53:  listConversations,
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:54:  updateConversation
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:17:function createCustomerOperationsReadinessSnapshot(runtime = {}) {
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:19:  const conversations = safeList(runtime.conversations?.list);
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:20:  const tickets = safeList(runtime.tickets?.list);
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:21:  const messages = safeList(runtime.messages?.list);
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:22:  const customers = safeList(runtime.customers?.list);
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:25:  const inboxEntries = safeList(runtime.unifiedInbox?.list);
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:32:    runtime: 'mh-os-customer-operations',
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:38:      integration_inbox_seed: typeof runtime.unifiedInbox?.createFromIntegration === 'function'
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:44:      conversations: conversations.length,
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:45:      messages: messages.length,
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:46:      tickets: tickets.length,
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:47:      customers: customers.length,
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:50:      unified_inbox_entries: inboxEntries.length
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:55:      inbox_ready: Boolean(capabilities.unified_inbox),
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:56:      tickets_ready: Boolean(capabilities.tickets),
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:57:      customer_profiles_ready: Boolean(capabilities.customers),
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:61:      integration_inbox_bridge_ready: Boolean(capabilities.integration_inbox_bridge)
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:72:        voice: Boolean(channel.capabilities?.voice),
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:80:      creates_tickets: false,
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js:89:  createCustomerOperationsReadinessSnapshot
runtime/orchestrator-service/lib/customer-operations/registry/README.md:1:# Customer Operations Registry
runtime/orchestrator-service/lib/customer-operations/registry/README.md:5:- AI customer agents
runtime/orchestrator-service/lib/customer-operations/registry/README.md:8:- conversation providers
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:8:  createInboxEntry
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:9:} = require('./store/unified-inbox-store');
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:15:function createIntegrationInboxSeed(
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:35:  const inboxId = asString(
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:36:    options.inbox_id ||
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:37:    `inbox_${channel.channel_id}`
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:40:  const entry = createInboxEntry({
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:41:    inbox_id: inboxId,
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:48:    conversation: {
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:49:      conversation_id: asString(
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:50:        options.conversation_id ||
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:51:        `${channel.channel_id}_conversation`
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:54:      customer_id: asString(
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:55:        options.customer_id || ''
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:61:        options.assigned_team || 'customer-care'
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:81:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:88:    inbox: entry
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js:93:  createIntegrationInboxSeed
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:4:  createUnifiedInboxContract
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:5:} = require('../../contracts/unified-inbox-contract');
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:7:const inboxEntries = new Map();
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:9:function createInboxEntry(input = {}) {
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:10:  const entry = createUnifiedInboxContract(input);
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:12:  if (!entry.inbox_id) {
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:13:    throw new Error('inbox_id is required');
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:16:  inboxEntries.set(entry.inbox_id, entry);
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:21:function getInboxEntry(inboxId) {
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:22:  return inboxEntries.get(String(inboxId || '')) || null;
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:25:function listInboxEntries() {
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:26:  return Array.from(inboxEntries.values());
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:29:function updateInboxEntry(inboxId, updates = {}) {
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:30:  const current = getInboxEntry(inboxId);
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:45:  inboxEntries.set(current.inbox_id, updated);
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:51:  createInboxEntry,
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:52:  getInboxEntry,
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:53:  listInboxEntries,
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:54:  updateInboxEntry
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:15:      voice: false,
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:20:  instagram: {
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:21:    channel_id: 'instagram',
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:27:      voice: false,
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:39:      voice: false,
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:45:    channel_id: 'email',
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:47:    type: 'email',
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:51:      voice: false,
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:56:  smtp: {
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:57:    channel_id: 'email',
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:58:    provider: 'smtp',
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:59:    type: 'email',
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:63:      voice: false,
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:75:      voice: false,
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:87:      voice: false,
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:119:    customer_operations: {
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:120:      supports_inbox: Boolean(base.capabilities.messaging),
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:121:      supports_messages: Boolean(base.capabilities.messaging),
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:122:      supports_leads: ['instagram', 'facebook', 'website', 'telegram'].includes(base.channel_id),
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:123:      supports_outreach: ['email', 'instagram', 'telegram'].includes(base.channel_id),
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:124:      supports_voice: Boolean(base.capabilities.voice)
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js:128:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/channels/README.md:7:- whatsapp
runtime/orchestrator-service/lib/customer-operations/channels/README.md:8:- instagram
runtime/orchestrator-service/lib/customer-operations/channels/README.md:9:- messenger
runtime/orchestrator-service/lib/customer-operations/channels/README.md:10:- email
runtime/orchestrator-service/lib/customer-operations/channels/README.md:11:- voice/ivr
runtime/orchestrator-service/lib/customer-operations/channels/register-integration-channel.js:33:      customer_operations: channel.customer_operations
runtime/orchestrator-service/lib/customer-operations/channels/registry/default-channels.js:20:    channel_id: 'email',
runtime/orchestrator-service/lib/customer-operations/channels/registry/default-channels.js:21:    provider: 'smtp',
runtime/orchestrator-service/lib/customer-operations/channels/registry/default-channels.js:30:    channel_id: 'instagram',
runtime/orchestrator-service/lib/customer-operations/channels/registry/default-channels.js:40:    channel_id: 'voice',
runtime/orchestrator-service/lib/customer-operations/channels/registry/default-channels.js:41:    provider: 'ivr',
runtime/orchestrator-service/lib/customer-operations/channels/registry/default-channels.js:44:      voice: true,
runtime/orchestrator-service/lib/customer-operations/channels/registry/channel-registry-store.js:21:      voice: Boolean(input.capabilities?.voice),
runtime/orchestrator-service/lib/customer-operations/channels/registry/channel-registry-store.js:27:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/media/native/capabilities/local-rendering-capabilities.js:42:      voice_chat: hasPython && hasFfmpeg
runtime/orchestrator-service/lib/media/native/intelligence/native-media-intelligence.js:19:        brand_voice_audio: knowledge.brandVoiceAudioGuide?.version || 'unknown'
runtime/orchestrator-service/lib/media/native/intelligence/media-quality-scorer.js:13:  const prompt = asText(plan.prompt || plan.video_brief || plan.voice_script || plan.description);
runtime/orchestrator-service/lib/media/native/intelligence/media-quality-scorer.js:54:      passed: includesAny(prompt, ['cta', 'call to action', 'discover', 'shop', 'learn more', 'jetzt']),
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:10:  const key = asText(platform, 'instagram').toLowerCase();
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:11:  return knowledge.platformVideoRules?.platforms?.[key] || knowledge.platformVideoRules?.platforms?.instagram || {};
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:37:  const platform = asText(input.platform || input.channel, 'instagram').toLowerCase();
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:40:  const audience = asText(input.audience, 'German-market customers');
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:41:  const brandVoice = asText(input.brand_voice || input.tone, 'premium, clear, trustworthy');
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:60:    brand_voice: brandVoice,
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:72:    audio_direction: knowledge.brandVoiceAudioGuide?.voice_style || {},
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:75:      ...(knowledge.brandVoiceAudioGuide?.avoid || [])
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:90:    `Brand voice: ${brief.brand_voice}`,
runtime/orchestrator-service/lib/media/native/intelligence/media-knowledge-loader.js:20:    brandVoiceAudioGuide: readJsonSafe('brand-voice-audio-guide.json'),
runtime/orchestrator-service/lib/media/native/intelligence/media-knowledge-loader.js:24:    voiceToneProfiles: readJsonSafe('voice-tone-profiles.json', { profiles: {} }),
runtime/orchestrator-service/lib/media/native/providers/provider-model-catalog.js:140:    media_type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/providers/provider-model-catalog.js:141:    category: 'realtime-voice',
runtime/orchestrator-service/lib/media/native/providers/provider-model-catalog.js:146:    notes: 'OpenAI realtime voice provider target. Exact model/version depends on API availability.'
runtime/orchestrator-service/lib/media/native/providers/README.md:13:This layer does not call provider APIs yet.
runtime/orchestrator-service/lib/media/native/providers/README.md:16:Create provider adapters that transform MH-OS worker jobs into provider-specific API calls.
runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js:23:        message: 'OPENAI_API_KEY is not configured.'
runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js:34:        message: 'Prompt is required.'
runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js:69:        message: error.message,
runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js:75:  async function createRealtimeVoiceSession() {
runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js:79:      media_type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js:81:      message: 'Realtime voice execution adapter is registered but not implemented yet.'
runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js:89:    createRealtimeVoiceSession
runtime/orchestrator-service/lib/media/native/providers/adapters/README.md:7:- OpenAI realtime voice placeholder
runtime/orchestrator-service/lib/media/native/providers/adapters/README.md:11:- It does not call paid generation APIs automatically.
runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router-demo.js:10:    media_type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router-demo.js:11:    prompt: 'Start realtime voice session placeholder'
runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router-demo.js:18:    platform: 'instagram',
runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router-demo.js:30:    openai_voice_check: openAiImageDryCheck,
runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router.js:23:          message: 'OpenAI adapter is not registered.'
runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router.js:31:      if (mediaType === 'voice_chat') {
runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router.js:32:        return adapter.createRealtimeVoiceSession(job);
runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router.js:39:        status: 'unsupported_media_type',
runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router.js:40:        message: `OpenAI adapter does not yet support media type: ${mediaType}`
runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router.js:53:      message: `No provider execution adapter registered for provider: ${provider}`
runtime/orchestrator-service/lib/media/native/providers/router/README.md:7:- openai/voice_chat -> OpenAI realtime placeholder
runtime/orchestrator-service/lib/media/native/providers/router/README.md:14:- support future Google Nano Banana, Veo, Runway, Kling, Pika adapters
runtime/orchestrator-service/lib/media/native/native-audio-runtime.js:8:    prompt: String(payload.prompt || payload.voice_script || ''),
runtime/orchestrator-service/lib/media/native/native-audio-runtime.js:9:    voice_script: String(payload.voice_script || ''),
runtime/orchestrator-service/lib/media/native/lifecycle/README.md:15:- retry support
runtime/orchestrator-service/lib/media/native/models/model-registry-store.js:19:    supports_realtime: Boolean(model.supports_realtime),
runtime/orchestrator-service/lib/media/native/models/model-registry-store.js:20:    supports_streaming: Boolean(model.supports_streaming),
runtime/orchestrator-service/lib/media/native/models/model-registry-store.js:21:    supported_resolutions: Array.isArray(model.supported_resolutions)
runtime/orchestrator-service/lib/media/native/models/model-registry-store.js:22:      ? model.supported_resolutions
runtime/orchestrator-service/lib/media/native/models/README.md:8:- quality tier support
runtime/orchestrator-service/lib/media/native/models/default-models.js:14:      supported_resolutions: ['1024x1024']
runtime/orchestrator-service/lib/media/native/models/default-models.js:20:      media_type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/models/default-models.js:21:      category: 'realtime-voice',
runtime/orchestrator-service/lib/media/native/models/default-models.js:24:      supports_realtime: true,
runtime/orchestrator-service/lib/media/native/models/default-models.js:25:      supports_streaming: true
runtime/orchestrator-service/lib/media/native/models/default-models.js:35:      supported_resolutions: ['1024x1024', '2048x2048']
runtime/orchestrator-service/lib/media/native/models/default-models.js:45:      supported_resolutions: ['1024x1024']
runtime/orchestrator-service/lib/media/native/models/default-models.js:55:      supported_resolutions: ['720p', '1080p']
runtime/orchestrator-service/lib/media/native/models/default-models.js:65:      supported_resolutions: ['720p']
runtime/orchestrator-service/lib/media/native/models/default-models.js:75:      supports_streaming: true
runtime/orchestrator-service/lib/media/native/models/default-models.js:81:      media_type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/models/default-models.js:85:      supports_realtime: true
runtime/orchestrator-service/lib/media/native/models/model-selection-engine.js:5:function modelSupportsRequest(model, request = {}) {
runtime/orchestrator-service/lib/media/native/models/model-selection-engine.js:24:    .filter(model => modelSupportsRequest(model, request))
runtime/orchestrator-service/lib/media/native/protocol/worker-progress-contract.js:8:    message: String(input.message || ''),
runtime/orchestrator-service/lib/media/native/protocol/README.md:18:- distributed rendering support
runtime/orchestrator-service/lib/media/native/README.md:10:- Voice chat runtime skeleton
runtime/orchestrator-service/lib/media/native/native-engine-registry.js:6:const { createNativeVoiceChatRuntime } = require('./native-voice-chat-runtime');
runtime/orchestrator-service/lib/media/native/native-engine-registry.js:13:    voiceChat: createNativeVoiceChatRuntime(options)
runtime/orchestrator-service/lib/media/native/knowledge/brand-voice-audio-guide.json:3:  "purpose": "Defines voice and audio direction for generated voiceovers and audio assets.",
runtime/orchestrator-service/lib/media/native/knowledge/brand-voice-audio-guide.json:4:  "voice_style": {
runtime/orchestrator-service/lib/media/native/knowledge/brand-voice-audio-guide.json:7:    "delivery": "natural commercial voice, not robotic, not exaggerated",
runtime/orchestrator-service/lib/media/native/knowledge/brand-voice-audio-guide.json:14:    "cta": "end with a clear but not aggressive call to action"
runtime/orchestrator-service/lib/media/native/knowledge/platform-video-rules.json:4:    "instagram": {
runtime/orchestrator-service/lib/media/native/knowledge/platform-video-rules.json:26:      "notes": "Avoid unsupported claims and distracting backgrounds."
runtime/orchestrator-service/lib/media/native/knowledge/video-shot-patterns.json:21:      "best_for": ["TikTok", "Instagram reels"],
runtime/orchestrator-service/lib/media/native/knowledge/brand-video-style-guide.json:22:    "instagram_reel": "9:16, 15-30 seconds, hook first, product closeup, CTA ending",
runtime/orchestrator-service/lib/media/native/knowledge/voice-tone-profiles.json:9:      "tone": "friendly, direct, conversational",
runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js:3:async function createVoiceChatSession(payload = {}) {
runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js:5:    type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js:14:      runtime: 'native-voice-chat-runtime'
runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js:19:function createNativeVoiceChatRuntime() {
runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js:21:    id: 'native-voice-chat',
runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js:22:    type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js:24:    createSession: createVoiceChatSession
runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js:29:  createNativeVoiceChatRuntime
runtime/orchestrator-service/lib/media/native/execution/README.md:16:- realtime voice
runtime/orchestrator-service/lib/media/native/execution/native-runtime-demo.js:14:    platform: 'instagram',
runtime/orchestrator-service/lib/media/native/execution/native-runtime-demo.js:18:    brand_voice: 'premium, clean, trustworthy',
runtime/orchestrator-service/lib/media/native/execution/native-runtime-executor.js:60:          message: `No renderer available for media type: ${prepared.brief.media_type}`
runtime/orchestrator-service/lib/media/native/registry/worker-selection-engine.js:5:function workerSupports(worker, mediaType) {
runtime/orchestrator-service/lib/media/native/registry/worker-selection-engine.js:6:  const supported = worker.capabilities?.supported_media_types;
runtime/orchestrator-service/lib/media/native/registry/worker-selection-engine.js:8:  if (!Array.isArray(supported)) {
runtime/orchestrator-service/lib/media/native/registry/worker-selection-engine.js:12:  return supported.includes(mediaType);
runtime/orchestrator-service/lib/media/native/registry/worker-selection-engine.js:19:    .filter(worker => workerSupports(worker, mediaType))
runtime/orchestrator-service/lib/media/native/provider-bridge.js:11:    if (type === 'audio' || type === 'voice') return nativeRegistry.audio;
runtime/orchestrator-service/lib/media/native/provider-bridge.js:12:    if (type === 'voice_chat') return nativeRegistry.voiceChat;
runtime/orchestrator-service/lib/media/native/workers/external-gpu-worker-adapter.js:17:        message: 'External GPU worker is not configured.',
runtime/orchestrator-service/lib/media/native/workers/external-gpu-worker-adapter.js:28:      message: 'External GPU worker adapter is configured but HTTP submission is not enabled yet.',
runtime/orchestrator-service/lib/media/native/rendering/rendering-voice-chat-adapter.js:3:async function renderVoiceChat(request = {}) {
runtime/orchestrator-service/lib/media/native/rendering/rendering-voice-chat-adapter.js:6:    engine: 'native-voice-chat-renderer',
runtime/orchestrator-service/lib/media/native/rendering/rendering-voice-chat-adapter.js:8:    output_type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/rendering/rendering-voice-chat-adapter.js:9:    message: 'Native voice chat rendering engine is not connected yet.',
runtime/orchestrator-service/lib/media/native/rendering/rendering-voice-chat-adapter.js:19:function createVoiceChatRenderingAdapter() {
runtime/orchestrator-service/lib/media/native/rendering/rendering-voice-chat-adapter.js:21:    id: 'native-voice-chat-renderer',
runtime/orchestrator-service/lib/media/native/rendering/rendering-voice-chat-adapter.js:22:    type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/rendering/rendering-voice-chat-adapter.js:24:    render: renderVoiceChat
runtime/orchestrator-service/lib/media/native/rendering/rendering-voice-chat-adapter.js:29:  createVoiceChatRenderingAdapter
runtime/orchestrator-service/lib/media/native/rendering/rendering-image-adapter.js:9:    message: 'Native image rendering engine is not connected yet.',
runtime/orchestrator-service/lib/media/native/rendering/rendering-audio-adapter.js:9:    message: 'Native audio rendering engine is not connected yet.',
runtime/orchestrator-service/lib/media/native/rendering/rendering-audio-adapter.js:10:    required_next_step: 'Connect XTTS, Coqui, Piper, OpenVoice, or another audio/TTS renderer.',
runtime/orchestrator-service/lib/media/native/rendering/rendering-audio-adapter.js:13:      voice_script: request.voice_script || '',
runtime/orchestrator-service/lib/media/native/rendering/rendering-engine-registry.js:6:const { createVoiceChatRenderingAdapter } = require('./rendering-voice-chat-adapter');
runtime/orchestrator-service/lib/media/native/rendering/rendering-engine-registry.js:13:    voice_chat: createVoiceChatRenderingAdapter(options)
runtime/orchestrator-service/lib/media/native/rendering/README.md:11:Supported future rendering targets:
runtime/orchestrator-service/lib/media/native/rendering/README.md:14:- Audio: XTTS, Coqui, Piper, OpenVoice
runtime/orchestrator-service/lib/media/native/rendering/README.md:15:- Voice Chat: STT + AI agent + TTS + realtime session runtime
runtime/orchestrator-service/lib/media/native/rendering/rendering-video-adapter.js:9:    message: 'Native video rendering engine is not connected yet.',
runtime/orchestrator-service/lib/media/native/orchestrator/orchestrator-demo.js:19:      supported_media_types: ['image', 'video']
runtime/orchestrator-service/lib/media/native/orchestrator/orchestrator-demo.js:27:    platform: 'instagram',
runtime/orchestrator-service/lib/media/provider-layer.js:3:const PROVIDER_NOT_CONFIGURED_MESSAGE = 'Generator backend not connected yet — prompt/job is ready.';
runtime/orchestrator-service/lib/media/provider-layer.js:26:    message: PROVIDER_NOT_CONFIGURED_MESSAGE
runtime/orchestrator-service/lib/media/provider-layer.js:30:function extractMessageContent(message) {
runtime/orchestrator-service/lib/media/provider-layer.js:31:  if (typeof message === 'string') return message;
runtime/orchestrator-service/lib/media/provider-layer.js:32:  if (!Array.isArray(message)) return '';
runtime/orchestrator-service/lib/media/provider-layer.js:34:  return message
runtime/orchestrator-service/lib/media/provider-layer.js:56:function normalizeOpenAiError(error, fallbackMessage) {
runtime/orchestrator-service/lib/media/provider-layer.js:58:  const providerMessage =
runtime/orchestrator-service/lib/media/provider-layer.js:59:    asString(error?.response?.data?.error?.message) ||
runtime/orchestrator-service/lib/media/provider-layer.js:60:    asString(error?.message) ||
runtime/orchestrator-service/lib/media/provider-layer.js:61:    fallbackMessage;
runtime/orchestrator-service/lib/media/provider-layer.js:63:  const wrapped = new Error(providerMessage || fallbackMessage);
runtime/orchestrator-service/lib/media/provider-layer.js:82:  const voiceProvider = firstText(env.MEDIA_VOICE_PROVIDER, 'openai').toLowerCase();
runtime/orchestrator-service/lib/media/provider-layer.js:100:    voiceProvider: {
runtime/orchestrator-service/lib/media/provider-layer.js:101:      id: voiceProvider,
runtime/orchestrator-service/lib/media/provider-layer.js:102:      configured: voiceProvider === 'elevenlabs' ? Boolean(elevenLabsApiKey) : openAiConfigured
runtime/orchestrator-service/lib/media/provider-layer.js:124:          messages: [
runtime/orchestrator-service/lib/media/provider-layer.js:139:      const text = extractMessageContent(response?.data?.choices?.[0]?.message?.content);
runtime/orchestrator-service/lib/media/provider-layer.js:337:  async function generateVoiceScript(payload = {}) {
runtime/orchestrator-service/lib/media/provider-layer.js:346:    if (!availability.voiceProvider.configured) {
runtime/orchestrator-service/lib/media/provider-layer.js:351:      systemPrompt: 'You are a voice director. Return only a voiceover script with scene timing markers.',
runtime/orchestrator-service/lib/media/provider-layer.js:355:        `Format: ${firstText(payload.format, 'short-form video voiceover')}`,
runtime/orchestrator-service/lib/media/provider-layer.js:360:        'Generate a usable voice script with hook, timed beats, and close CTA.'
runtime/orchestrator-service/lib/media/provider-layer.js:373:      voice_script: asString(result.text)
runtime/orchestrator-service/lib/media/provider-layer.js:393:        'Return JSON with keys: image_prompt, video_brief, voice_script, channel_notes, publishing_notes.',
runtime/orchestrator-service/lib/media/provider-layer.js:419:        voice_script: asString(parsed.voice_script),
runtime/orchestrator-service/lib/media/provider-layer.js:433:    generateVoiceScript,
runtime/orchestrator-service/lib/media/provider-layer.js:440:  PROVIDER_NOT_CONFIGURED_MESSAGE
public/control-center/api.js:16:  constructor(message, diagnostics = {}) {
public/control-center/api.js:17:    super(String(message || "Project data requires a valid access key."));
public/control-center/api.js:35:  constructor(message, diagnostics = {}) {
public/control-center/api.js:36:    super(String(message || "Project response was received but could not be processed."));
public/control-center/api.js:129:function isMissingReadKeyErrorMessage(message) {
public/control-center/api.js:130:  return /missing\s+read\s+key/i.test(String(message || ""));
public/control-center/api.js:133:function isAccessKeyRelatedMessage(message) {
public/control-center/api.js:134:  const normalized = String(message || "").toLowerCase();
public/control-center/api.js:156:  const message = String(
public/control-center/api.js:157:    error?.message
public/control-center/api.js:159:      || error?.payload?.message
public/control-center/api.js:163:  if ((status === 401 || status === 403) && isAccessKeyRelatedMessage(message)) {
public/control-center/api.js:167:  return isAccessKeyRelatedMessage(message);
public/control-center/api.js:259:        message: String(details.message || ""),
public/control-center/api.js:355:        message: error?.message || "Response body read timed out"
public/control-center/api.js:404:            message: fallbackError?.message || "JSON fallback failed"
public/control-center/api.js:439:      message: error?.message || "Failed to read response body"
public/control-center/api.js:499:      message: parseFailure?.message || "Invalid JSON payload"
public/control-center/api.js:516:async function parseJson(response, fallbackMessage = "Request failed", requestMeta = {}) {
public/control-center/api.js:550:    const message =
public/control-center/api.js:552:      payload?.message ||
public/control-center/api.js:553:      `${fallbackMessage} (${response.status})`;
public/control-center/api.js:555:    if (isMissingReadKeyErrorMessage(message)) {
public/control-center/api.js:556:      throw new AccessKeyError(message, diagnostics);
public/control-center/api.js:559:    const error = new Error(message);
public/control-center/api.js:577:    const message = String(payload.error || fallbackMessage);
public/control-center/api.js:579:    if (isMissingReadKeyErrorMessage(message)) {
public/control-center/api.js:580:      throw new AccessKeyError(message, diagnostics);
public/control-center/api.js:583:    const error = new Error(message);
public/control-center/api.js:647:        message: timeoutError.message
public/control-center/api.js:694:      message: error?.message || "Request failed"
public/control-center/api.js:705:async function getJson(path, fallbackMessage, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS, requestOptions = {}) {
public/control-center/api.js:712:  return parseJson(response, fallbackMessage, {
public/control-center/api.js:723:async function sendRawJson(path, method, body, fallbackMessage, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
public/control-center/api.js:738:      const parseError = new Error(fallbackMessage || "Response was not valid JSON.");
public/control-center/api.js:752:    const message = String(payload?.error || payload?.message || fallbackMessage || "Request failed").trim();
public/control-center/api.js:753:    const error = new Error(message);
public/control-center/api.js:763:async function sendJson(path, method, body, fallbackMessage, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
public/control-center/api.js:771:  return parseJson(response, fallbackMessage, {
public/control-center/api.js:781:async function sendForm(path, formData, fallbackMessage, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
public/control-center/api.js:796:  return parseJson(response, fallbackMessage, {
public/control-center/api.js:836:    const message = String(payload?.error || rawText || `Failed to load protected file (${response.status}).`).trim();
public/control-center/api.js:837:    const lowerMessage = message.toLowerCase();
public/control-center/api.js:839:    if (response.status === 401 || response.status === 403 || /read key|access key|invalid.*key/.test(lowerMessage)) {
public/control-center/api.js:840:      throw new AccessKeyError(message, {
public/control-center/api.js:851:    throw new Error(message);
public/control-center/api.js:971:    message: isOptionalNotFound
public/control-center/api.js:973:      : String(error?.message || error || "Unknown error"),
public/control-center/api.js:1039:    const message = data?.details || data?.error || `Failed to create project (${response.status})`;
public/control-center/api.js:1040:    throw new Error(message);
public/control-center/api.js:1057:    console.warn("Using fallback projects list:", error.message);
public/control-center/api.js:1150:          message: String(fallbackError?.message || "Failed to verify project fallback")
public/control-center/api.js:1155:    const message = requiredDiagnostics
public/control-center/api.js:1156:      .map((item) => `${item.section}: ${item.message}`)
public/control-center/api.js:1158:    const error = new Error(`Required project data failed: ${message}`);
public/control-center/api.js:1392:    const message = data?.details || data?.error || `Failed to apply project template (${response.status})`;
public/control-center/api.js:1393:    throw new Error(message);
public/control-center/api.js:2184:export async function generateMediaVoiceScript(payload = {}) {
public/control-center/api.js:2186:    "/api/media/generate-voice-script",
public/control-center/api.js:2189:    "Failed to generate voice script"

## Express route markers for communication-like routes
9407:app.post('/execute_email_package', (req, res) => {
10866:app.get('/media-manager/project/:project/notification-center', handleGetNotificationCenter);
10867:app.get('/public/media-manager/project/:project/notification-center', handleGetNotificationCenter);
11611:app.get('/media-manager/project/:project/notifications', handleListNotifications);
11612:app.get('/public/media-manager/project/:project/notifications', handleListNotifications);
11613:app.patch('/media-manager/project/:project/notifications/:notificationId', (req, res) => {
11626:app.patch('/public/media-manager/project/:project/notifications/:notificationId', (req, res) => {
21921:app.post('/api/media/generate-voice-script', async (req, res) => {

## API helpers related to customer/communication
16:  constructor(message, diagnostics = {}) {
17:    super(String(message || "Project data requires a valid access key."));
35:  constructor(message, diagnostics = {}) {
36:    super(String(message || "Project response was received but could not be processed."));
129:function isMissingReadKeyErrorMessage(message) {
130:  return /missing\s+read\s+key/i.test(String(message || ""));
133:function isAccessKeyRelatedMessage(message) {
134:  const normalized = String(message || "").toLowerCase();
156:  const message = String(
157:    error?.message
159:      || error?.payload?.message
163:  if ((status === 401 || status === 403) && isAccessKeyRelatedMessage(message)) {
167:  return isAccessKeyRelatedMessage(message);
259:        message: String(details.message || ""),
355:        message: error?.message || "Response body read timed out"
404:            message: fallbackError?.message || "JSON fallback failed"
439:      message: error?.message || "Failed to read response body"
499:      message: parseFailure?.message || "Invalid JSON payload"
550:    const message =
552:      payload?.message ||
555:    if (isMissingReadKeyErrorMessage(message)) {
556:      throw new AccessKeyError(message, diagnostics);
559:    const error = new Error(message);
577:    const message = String(payload.error || fallbackMessage);
579:    if (isMissingReadKeyErrorMessage(message)) {
580:      throw new AccessKeyError(message, diagnostics);
583:    const error = new Error(message);
647:        message: timeoutError.message
694:      message: error?.message || "Request failed"
752:    const message = String(payload?.error || payload?.message || fallbackMessage || "Request failed").trim();
753:    const error = new Error(message);
836:    const message = String(payload?.error || rawText || `Failed to load protected file (${response.status}).`).trim();
837:    const lowerMessage = message.toLowerCase();
840:      throw new AccessKeyError(message, {
851:    throw new Error(message);
971:    message: isOptionalNotFound
973:      : String(error?.message || error || "Unknown error"),
1039:    const message = data?.details || data?.error || `Failed to create project (${response.status})`;
1040:    throw new Error(message);
1057:    console.warn("Using fallback projects list:", error.message);
1150:          message: String(fallbackError?.message || "Failed to verify project fallback")
1155:    const message = requiredDiagnostics
1156:      .map((item) => `${item.section}: ${item.message}`)
1158:    const error = new Error(`Required project data failed: ${message}`);
1392:    const message = data?.details || data?.error || `Failed to apply project template (${response.status})`;
1393:    throw new Error(message);
1990:    `/media-manager/project/${encodeURIComponent(projectName)}/notification-center`,
1991:    "Failed to load notification center"
2186:    "/api/media/generate-voice-script",
2189:    "Failed to generate voice script"
2276:export async function markProjectNotification(projectName, notificationId, payload = {}) {
2281:  if (!notificationId) {
2282:    throw new Error("Missing notification id");
2286:    `/media-manager/project/${encodeURIComponent(projectName)}/notifications/${encodeURIComponent(notificationId)}`,
2289:    "Failed to update notification"
