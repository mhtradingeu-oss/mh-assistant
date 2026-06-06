# 03 — Backend Route Capability Search

Generated: Sat Jun  6 11:05:56 CEST 2026

runtime/orchestrator-service/server.js:8:  const omitKeys = new Set(['updated_at', 'statuses', 'required_sources', 'sources']);
runtime/orchestrator-service/server.js:39:const { classifyPublicAliasAccess, buildPublicAliasHeaders } = require("./lib/security/public-alias-compatibility");
runtime/orchestrator-service/server.js:189:    const classification = classifyPublicAliasAccess(req.method, req.path || req.originalUrl || "", {
runtime/orchestrator-service/server.js:193:    const headers = buildPublicAliasHeaders(classification);
runtime/orchestrator-service/server.js:199:    if (classification && classification.publicAlias) {
runtime/orchestrator-service/server.js:203:    if (classification && classification.publicAlias && classification.allowed === false) {
runtime/orchestrator-service/server.js:204:      if (classification.code === 'route_permission_denied') {
runtime/orchestrator-service/server.js:205:        return res.status(403).json(buildRoutePermissionDeniedResponse());
runtime/orchestrator-service/server.js:208:      return res.status(410).json({
runtime/orchestrator-service/server.js:213:        reason: classification.reason
runtime/orchestrator-service/server.js:217:    res.setHeader("X-MH-Public-Alias-Warning", "classification_failed");
runtime/orchestrator-service/server.js:322:  error.statusCode = 500;
runtime/orchestrator-service/server.js:336:  /^\/media\/upload\/?$/i,
runtime/orchestrator-service/server.js:393:    return res.status(503).json({
runtime/orchestrator-service/server.js:400:    return res.status(401).json({
runtime/orchestrator-service/server.js:406:    return res.status(403).json({
runtime/orchestrator-service/server.js:418:  /^\/(?:public\/)?media-manager\/asset-catalog\/?$/i,
runtime/orchestrator-service/server.js:457:    return res.status(503).json({
runtime/orchestrator-service/server.js:464:    return res.status(401).json({
runtime/orchestrator-service/server.js:470:    return res.status(403).json({
runtime/orchestrator-service/server.js:548:    statusCode: 429,
runtime/orchestrator-service/server.js:577:  status = 'needs_review'
runtime/orchestrator-service/server.js:598:      status,
runtime/orchestrator-service/server.js:635:function buildAssetRoleFromType(type) {
runtime/orchestrator-service/server.js:654:  const canonicalType = getCanonicalAssetType(normalizedType);
runtime/orchestrator-service/server.js:657:    const { catalog_item, target_dir } = getTargetFolderForAssetType(project, canonicalType);
runtime/orchestrator-service/server.js:661:      assetType: canonicalType,
runtime/orchestrator-service/server.js:662:      requestedAssetType: normalizedType,
runtime/orchestrator-service/server.js:663:      target_folder: catalog_item.target_folder,
runtime/orchestrator-service/server.js:669:  const legacyRole = buildAssetRoleFromType(normalizedType);
runtime/orchestrator-service/server.js:675:      assetRole: legacyRole,
runtime/orchestrator-service/server.js:676:      target_folder: path.basename(getAssetDirByRole(paths, legacyRole)),
runtime/orchestrator-service/server.js:677:      dir: getAssetDirByRole(paths, legacyRole)
runtime/orchestrator-service/server.js:681:  throw new Error('Unknown asset type');
runtime/orchestrator-service/server.js:688:  const uploadTarget = resolveUploadTarget(project, normalizedType);
runtime/orchestrator-service/server.js:689:  return path.join(uploadTarget.dir, safeFilename);
runtime/orchestrator-service/server.js:718:    basePaths.brandAssetsDir,
runtime/orchestrator-service/server.js:731:function findProjectAssetFilePathById(projectName, assetId) {
runtime/orchestrator-service/server.js:733:  const requestedId = String(assetId || '').trim();
runtime/orchestrator-service/server.js:740:    const assetPaths = getProjectAssetPaths(project);
runtime/orchestrator-service/server.js:741:    const assets = readJsonFile(assetPaths.assetsRegistryPath, []);
runtime/orchestrator-service/server.js:742:    const match = assets.find((asset) => {
runtime/orchestrator-service/server.js:743:      const candidate = String(asset?.asset_id || asset?.assetId || asset?.id || '').trim();
runtime/orchestrator-service/server.js:760:function resolveMediaFilePathFromQuery(projectName, requestedPath, assetId) {
runtime/orchestrator-service/server.js:763:  const decodedAssetId = decodeMediaQueryPath(assetId);
runtime/orchestrator-service/server.js:818:  if (decodedAssetId) {
runtime/orchestrator-service/server.js:819:    const byAssetId = findProjectAssetFilePathById(project, decodedAssetId);
runtime/orchestrator-service/server.js:820:    const resolved = resolveCandidate(byAssetId);
runtime/orchestrator-service/server.js:824:        source: 'query_asset_id'
runtime/orchestrator-service/server.js:831:    source: decodedAssetId ? 'query_asset_id' : null
runtime/orchestrator-service/server.js:837:  const base = path.basename(String(originalName || '').trim()) || 'upload';
runtime/orchestrator-service/server.js:852:  stem = stem.slice(0, 128) || 'upload';
runtime/orchestrator-service/server.js:857:const upload = multer({
runtime/orchestrator-service/server.js:868:        const uploadTarget = resolveUploadTarget(project, type);
runtime/orchestrator-service/server.js:869:        const dir = uploadTarget.dir;
runtime/orchestrator-service/server.js:893:const LEGACY_BRAND_ASSETS_DIR = path.join(DATA_DIR, 'brand-assets');
runtime/orchestrator-service/server.js:926:  const statusCandidate = Number(
runtime/orchestrator-service/server.js:927:    error?.statusCode || error?.status || error?.response?.status || fallbackStatus
runtime/orchestrator-service/server.js:930:  if (!Number.isFinite(statusCandidate)) {
runtime/orchestrator-service/server.js:934:  if (statusCandidate < 400 || statusCandidate > 599) {
runtime/orchestrator-service/server.js:938:  return statusCandidate;
runtime/orchestrator-service/server.js:942:  statusCode = 500,
runtime/orchestrator-service/server.js:946:  return res.status(statusCode).json({
runtime/orchestrator-service/server.js:957:    statusCode: 400,
runtime/orchestrator-service/server.js:1059:    statusCode: getErrorStatusCode(error, 500),
runtime/orchestrator-service/server.js:1227:function classifyImmediateFallbackReason(telemetryEntry = {}) {
runtime/orchestrator-service/server.js:1376:  telemetryEntry.fallback_reason = classifyImmediateFallbackReason(telemetryEntry);
runtime/orchestrator-service/server.js:1500:      pathContract: 'execution/projects/<project>/email-prepare-package.json -> brand-assets/<project>/email-prepare-package.json'
runtime/orchestrator-service/server.js:1508:      pathContract: 'execution/projects/<project>/email/html/<package>.html -> brand-assets/<project>/email/html/<package>.html'
runtime/orchestrator-service/server.js:1516:      pathContract: 'execution/projects/<project>/email/prepared/<package>.json -> brand-assets/<project>/email/prepared/<package>.json'
runtime/orchestrator-service/server.js:1524:      pathContract: 'execution/projects/<project>/email/delivery/<send>.json -> brand-assets/<project>/email/delivery/<send>.json'
runtime/orchestrator-service/server.js:1615:      statusCode: 400,
runtime/orchestrator-service/server.js:1670:  const backupDir = path.join(getLegacyExecutionRoot(projectName), 'assets', 'backups');
runtime/orchestrator-service/server.js:1744:function classifyFallbackWithParityContext(readEntry, dualWriteIndex) {
runtime/orchestrator-service/server.js:1762:        (item) => item.root === 'canonical' && item.status === 'success'
runtime/orchestrator-service/server.js:1765:        (item) => item.root === 'canonical' && item.status === 'failed'
runtime/orchestrator-service/server.js:1768:        (item) => item.root === 'legacy' && item.status === 'success'
runtime/orchestrator-service/server.js:1838:      const cause = classifyFallbackWithParityContext(entry, dualWriteIndex) || 'unresolved_risk';
runtime/orchestrator-service/server.js:1986:  const logo = context.source_of_truth.logo;
runtime/orchestrator-service/server.js:1991:    status: 'ready',
runtime/orchestrator-service/server.js:2003:    result.status = 'blocked';
runtime/orchestrator-service/server.js:2008:    result.status = 'needs_prepare';
runtime/orchestrator-service/server.js:2035:  if (!renderRequest || renderRequest.status !== 'completed') {
runtime/orchestrator-service/server.js:2059:  const rendered = readiness.status !== 'blocked' ? getLatestRenderedOutput(projectName) : null;
runtime/orchestrator-service/server.js:2064:    status: readiness.status,
runtime/orchestrator-service/server.js:2068:    rendered_asset: rendered,
runtime/orchestrator-service/server.js:2069:    email_asset: {
runtime/orchestrator-service/server.js:2073:      body: `This campaign asset was auto-prepared by the system using the latest approved brand-controlled render.`,
runtime/orchestrator-service/server.js:2091:  const subject = packageData.email_asset.subject || 'Campaign Update';
runtime/orchestrator-service/server.js:2092:  const headline = packageData.email_asset.headline || 'New Campaign Asset';
runtime/orchestrator-service/server.js:2093:  const body = packageData.email_asset.body || '';
runtime/orchestrator-service/server.js:2094:  const cta = packageData.email_asset.cta || 'Learn More';
runtime/orchestrator-service/server.js:2095:  const imagePath = packageData.rendered_asset?.output_path || '';
runtime/orchestrator-service/server.js:2138:function autoPrepareEmailAsset(projectName, rawText = '') {
runtime/orchestrator-service/server.js:2142:  if (packageData.status === 'blocked') {
runtime/orchestrator-service/server.js:2146:  const subject = extractFlagValue(rawText, 'subject') || packageData.email_asset.subject;
runtime/orchestrator-service/server.js:2147:  const headline = extractFlagValue(rawText, 'headline') || packageData.email_asset.headline;
runtime/orchestrator-service/server.js:2148:  const body = extractFlagValue(rawText, 'body') || packageData.email_asset.body;
runtime/orchestrator-service/server.js:2149:  const cta = extractFlagValue(rawText, 'cta') || packageData.email_asset.cta;
runtime/orchestrator-service/server.js:2152:  const publicImageUrl = buildPublicImageUrl(projectName, packageData.rendered_asset?.output_path || '');
runtime/orchestrator-service/server.js:2154:  packageData.email_asset.subject = subject;
runtime/orchestrator-service/server.js:2155:  packageData.email_asset.headline = headline;
runtime/orchestrator-service/server.js:2156:  packageData.email_asset.body = body;
runtime/orchestrator-service/server.js:2157:  packageData.email_asset.cta = cta;
runtime/orchestrator-service/server.js:2158:  packageData.email_asset.cta_url = ctaUrl;
runtime/orchestrator-service/server.js:2159:  packageData.email_asset.public_image_url = publicImageUrl;
runtime/orchestrator-service/server.js:2161:  packageData.email_asset.html = buildHardenedEmailHtml(packageData);
runtime/orchestrator-service/server.js:2178:    payload: packageData.email_asset.html,
runtime/orchestrator-service/server.js:2190:    packageData.status = 'ready_for_send';
runtime/orchestrator-service/server.js:2191:    packageData.email_asset.ready_for_send = true;
runtime/orchestrator-service/server.js:2193:    packageData.status = 'needs_manual_review';
runtime/orchestrator-service/server.js:2194:    packageData.email_asset.ready_for_send = false;
runtime/orchestrator-service/server.js:2257:  const subject = String(packageData.email_asset?.subject || '').trim();
runtime/orchestrator-service/server.js:2258:  const headline = String(packageData.email_asset?.headline || '').trim();
runtime/orchestrator-service/server.js:2259:  const body = String(packageData.email_asset?.body || '').trim();
runtime/orchestrator-service/server.js:2260:  const cta = String(packageData.email_asset?.cta || '').trim();
runtime/orchestrator-service/server.js:2261:  const url = String(packageData.email_asset?.cta_url || '').trim();
runtime/orchestrator-service/server.js:2262:  const html = String(packageData.email_asset?.html || '').trim();
runtime/orchestrator-service/server.js:2263:  const publicImageUrl = String(packageData.email_asset?.public_image_url || '').trim();
runtime/orchestrator-service/server.js:2296:  const subject = packageData.email_asset.subject;
runtime/orchestrator-service/server.js:2297:  const headline = packageData.email_asset.headline;
runtime/orchestrator-service/server.js:2298:  const body = packageData.email_asset.body;
runtime/orchestrator-service/server.js:2299:  const cta = packageData.email_asset.cta;
runtime/orchestrator-service/server.js:2300:  const ctaUrl = packageData.email_asset.cta_url;
runtime/orchestrator-service/server.js:2301:  const publicImageUrl = packageData.email_asset.public_image_url;
runtime/orchestrator-service/server.js:2363:function buildAssetFidelityRules(sourceOfTruth = {}, goal = '') {
runtime/orchestrator-service/server.js:2371:      'Use the provided product image as the exact source of truth.',
runtime/orchestrator-service/server.js:2401:  const productType = mi.product_type || product.category || 'general';
runtime/orchestrator-service/server.js:2471:  const sourceOfTruth = renderRequest.source_of_truth || {};
runtime/orchestrator-service/server.js:2472:  const rules = buildAssetFidelityRules(sourceOfTruth, renderRequest.goal || '');
runtime/orchestrator-service/server.js:2482:- Category: ${productIntel.category || 'unknown'}
runtime/orchestrator-service/server.js:2493:- Use the provided product image EXACTLY as the main source of truth.
runtime/orchestrator-service/server.js:2527:  if (!renderRequest || renderRequest.status !== 'render_ready') {
runtime/orchestrator-service/server.js:2533:  const sourceOfTruth = renderRequest.source_of_truth || {};
runtime/orchestrator-service/server.js:2593:  fidelity_mode: 'real_asset_locked',
runtime/orchestrator-service/server.js:2655:    status: 'ready_for_send',
runtime/orchestrator-service/server.js:2660:  if (pkg.status !== 'ready_for_send') {
runtime/orchestrator-service/server.js:2661:    result.status = 'blocked';
runtime/orchestrator-service/server.js:2666:    result.status = 'blocked';
runtime/orchestrator-service/server.js:2670:  if (!pkg.email_asset || !pkg.email_asset.html) {
runtime/orchestrator-service/server.js:2671:    result.status = 'blocked';
runtime/orchestrator-service/server.js:2675:  if (!pkg.email_asset || !pkg.email_asset.public_image_url) {
runtime/orchestrator-service/server.js:2676:    result.status = 'blocked';
runtime/orchestrator-service/server.js:2680:  if (!pkg.email_asset || !pkg.email_asset.cta_url) {
runtime/orchestrator-service/server.js:2681:    result.status = 'blocked';
runtime/orchestrator-service/server.js:2713:  if (readiness.status !== 'ready_for_send') {
runtime/orchestrator-service/server.js:2715:      status: 'send_blocked',
runtime/orchestrator-service/server.js:2730:    status: 'pending_provider_send',
runtime/orchestrator-service/server.js:2733:    subject: pkg.email_asset.subject,
runtime/orchestrator-service/server.js:2789:    status: product?.status || null,
runtime/orchestrator-service/server.js:2800:    status: product?.status || null,
runtime/orchestrator-service/server.js:2857:      category: x.category,
runtime/orchestrator-service/server.js:2860:      status: x.status
runtime/orchestrator-service/server.js:2873:    by_category: {},
runtime/orchestrator-service/server.js:2880:    if (product.status === 'publish') summary.published_count += 1;
runtime/orchestrator-service/server.js:2881:    if (product.status === 'draft') summary.draft_count += 1;
runtime/orchestrator-service/server.js:2883:    const category = product.category || 'unknown';
runtime/orchestrator-service/server.js:2884:    summary.by_category[category] = (summary.by_category[category] || 0) + 1;
runtime/orchestrator-service/server.js:3072:      'Use real registered brand assets only.',
runtime/orchestrator-service/server.js:3077:    publish_status: imageInfo ? 'ready_for_publish' : 'needs_manual_review'
runtime/orchestrator-service/server.js:3097:    status: compliance.publish_status,
runtime/orchestrator-service/server.js:3189:    publish_status: imageInfo ? 'ready_for_production' : 'needs_manual_review'
runtime/orchestrator-service/server.js:3208:    status: compliance.publish_status,
runtime/orchestrator-service/server.js:3334:    publish_status: imageInfo ? 'ready_for_publish' : 'needs_manual_review'
runtime/orchestrator-service/server.js:3352:    ? 'A short-form premium visual built with real brand-controlled assets.'
runtime/orchestrator-service/server.js:3362:    status: compliance.publish_status,
runtime/orchestrator-service/server.js:3491:    conversion_angle: 'Real product, clean presentation, trustworthy copy, and compliant listing assets.',
runtime/orchestrator-service/server.js:3510:    status: 'ready_for_listing_build',
runtime/orchestrator-service/server.js:3515:      'Brand-controlled real-asset presentation',
runtime/orchestrator-service/server.js:3521:    description: `This Amazon package is built for ${goal} using approved real assets and a conversion-oriented marketplace structure.`,
runtime/orchestrator-service/server.js:3540:      listing_status: 'ready_for_listing_build',
runtime/orchestrator-service/server.js:3574:    status: 'ready_for_listing_build',
runtime/orchestrator-service/server.js:3584:    description: `This eBay package is built for ${goal} using approved brand-controlled assets and a trust-oriented listing structure.`,
runtime/orchestrator-service/server.js:3595:      listing_status: 'ready_for_listing_build',
runtime/orchestrator-service/server.js:3732:  const category = normalizeLaunchProductText(product?.category);
runtime/orchestrator-service/server.js:3734:  const haystack = `${category} ${productType}`.trim();
runtime/orchestrator-service/server.js:3738:    if (category === theme || productType === theme) return true;
runtime/orchestrator-service/server.js:3763:    const status = String(product.status || '').trim().toLowerCase();
runtime/orchestrator-service/server.js:3768:    if (status !== 'publish' || !slug || !name || !stableKey) {
runtime/orchestrator-service/server.js:3815:        category: p.category
runtime/orchestrator-service/server.js:3820:        category: p.category
runtime/orchestrator-service/server.js:3827:      validation_status: launchReadyProducts.length ? 'ready' : 'no_launch_ready_products'
runtime/orchestrator-service/server.js:3914:    category: p.category || null,
runtime/orchestrator-service/server.js:3915:    status: p.status || null,
runtime/orchestrator-service/server.js:4019:    assets: []
runtime/orchestrator-service/server.js:4024:    const asset = channelPack[normalizedChannel] || null;
runtime/orchestrator-service/server.js:4026:    if (!asset) continue;
runtime/orchestrator-service/server.js:4028:    payload.assets.push({
runtime/orchestrator-service/server.js:4032:      category: product.category || null,
runtime/orchestrator-service/server.js:4033:      channel_asset: asset
runtime/orchestrator-service/server.js:4059:    status: 'scheduled'
runtime/orchestrator-service/server.js:4072:    status: 'scheduled',
runtime/orchestrator-service/server.js:4073:    total_assets: payload.assets.length,
runtime/orchestrator-service/server.js:4194:    asset_count: Number(input.total_assets || base.asset_count || 0) || 0,
runtime/orchestrator-service/server.js:4195:    asset_preview_items: Array.isArray(base.asset_preview_items) ? base.asset_preview_items.slice(0, 3) : [],
runtime/orchestrator-service/server.js:4205:  const assets = Array.isArray(payload.assets) ? payload.assets : [];
runtime/orchestrator-service/server.js:4206:  const primary = assets[0] || {};
runtime/orchestrator-service/server.js:4207:  const channelAsset = primary.channel_asset || {};
runtime/orchestrator-service/server.js:4213:      caption: channelAsset.caption || channelAsset.body || '',
runtime/orchestrator-service/server.js:4214:      body: channelAsset.body || channelAsset.caption || '',
runtime/orchestrator-service/server.js:4215:      subject: channelAsset.subject || '',
runtime/orchestrator-service/server.js:4216:      headline: channelAsset.headline || primary.product_name || payload.wave_name || '',
runtime/orchestrator-service/server.js:4217:      cta: channelAsset.cta || '',
runtime/orchestrator-service/server.js:4218:      format: channelAsset.format || '',
runtime/orchestrator-service/server.js:4219:      goal: channelAsset.goal || '',
runtime/orchestrator-service/server.js:4220:      visual_prompt: channelAsset.visual_prompt || '',
runtime/orchestrator-service/server.js:4223:      total_assets: assets.length,
runtime/orchestrator-service/server.js:4229:  preview.asset_preview_items = assets.slice(0, 3).map(item => ({
runtime/orchestrator-service/server.js:4232:    category: item.category || '',
runtime/orchestrator-service/server.js:4233:    caption: item.channel_asset?.caption || '',
runtime/orchestrator-service/server.js:4234:    format: item.channel_asset?.format || '',
runtime/orchestrator-service/server.js:4235:    goal: item.channel_asset?.goal || ''
runtime/orchestrator-service/server.js:4279:    status: normalizePublishingJobStatus(
runtime/orchestrator-service/server.js:4280:      rawJob.status,
runtime/orchestrator-service/server.js:4283:    total_assets: Number(rawJob.total_assets || connectorPreview?.asset_count || 0) || 0,
runtime/orchestrator-service/server.js:4298:  delete payload.file_path;
runtime/orchestrator-service/server.js:4324:      total_assets: 0,
runtime/orchestrator-service/server.js:4334:      total_assets: Array.isArray(payload.assets) ? payload.assets.length : 0,
runtime/orchestrator-service/server.js:4341:      total_assets: 0,
runtime/orchestrator-service/server.js:4417:    status: normalizePublishingJobStatus(input.status, existing.status || fallbackStatus),
runtime/orchestrator-service/server.js:4418:    total_assets: connectorInfo.total_assets || existing.total_assets || preview.asset_count || 0,
runtime/orchestrator-service/server.js:4463:function updateScheduledJobStatus(projectName, jobId, status) {
runtime/orchestrator-service/server.js:4466:    status
runtime/orchestrator-service/server.js:4469:    status
runtime/orchestrator-service/server.js:4531:function getChannelAssetForProduct(product, channel) {
runtime/orchestrator-service/server.js:4539:  const asset = getChannelAssetForProduct(product, channel);
runtime/orchestrator-service/server.js:4541:  if (!asset) {
runtime/orchestrator-service/server.js:4542:    throw new Error('Channel asset not found for product');
runtime/orchestrator-service/server.js:4546:    asset.caption || '',
runtime/orchestrator-service/server.js:4547:    asset.headline || '',
runtime/orchestrator-service/server.js:4548:    asset.body || '',
runtime/orchestrator-service/server.js:4549:    asset.subject || ''
runtime/orchestrator-service/server.js:4568:  if ((asset.caption || '').length > 220 && ['instagram', 'facebook'].includes(String(channel).toLowerCase())) {
runtime/orchestrator-service/server.js:4570:    recommendations.push('tighten the first line and move detail lower');
runtime/orchestrator-service/server.js:4587:    asset_snapshot: asset
runtime/orchestrator-service/server.js:4613:  const asset = getChannelAssetForProduct(product, channel);
runtime/orchestrator-service/server.js:4615:  if (!asset) {
runtime/orchestrator-service/server.js:4616:    throw new Error('Channel asset not found for product');
runtime/orchestrator-service/server.js:4623:  let improved = { ...asset };
runtime/orchestrator-service/server.js:4650:    original_asset: asset,
runtime/orchestrator-service/server.js:4651:    improved_asset: improved
runtime/orchestrator-service/server.js:4913:    path.join(paths.legacyOutputsDir, `${renderId}_${job.asset_type}.png`);
runtime/orchestrator-service/server.js:4919:    asset_type: job.asset_type,
runtime/orchestrator-service/server.js:4922:    status: 'render_ready',
runtime/orchestrator-service/server.js:4924:    source_of_truth: job.source_of_truth,
runtime/orchestrator-service/server.js:4974:function markRenderResult(projectName, renderId, status, resultData = {}) {
runtime/orchestrator-service/server.js:4990:  renderRequest.status = status;
runtime/orchestrator-service/server.js:4997:    artifactType: 'render_status_record',
runtime/orchestrator-service/server.js:5005:function evaluateExecutionReadiness(projectName, assetType) {
runtime/orchestrator-service/server.js:5011:    asset_type: assetType,
runtime/orchestrator-service/server.js:5012:    status: 'allowed',
runtime/orchestrator-service/server.js:5019:    result.status = 'blocked';
runtime/orchestrator-service/server.js:5023:  if (assetType === 'ad' || assetType === 'blog_image' || assetType === 'email_hero') {
runtime/orchestrator-service/server.js:5025:      result.status = 'allowed_with_constraints';
runtime/orchestrator-service/server.js:5030:      result.status = 'allowed_with_constraints';
runtime/orchestrator-service/server.js:5080:function evaluateGenerationEligibility(projectName, assetType) {
runtime/orchestrator-service/server.js:5081:  const execution = evaluateExecutionReadiness(projectName, assetType);
runtime/orchestrator-service/server.js:5083:  const truth = context.source_of_truth;
runtime/orchestrator-service/server.js:5087:    asset_type: assetType,
runtime/orchestrator-service/server.js:5088:    status: 'ready_for_generation',
runtime/orchestrator-service/server.js:5095:    result.status = 'blocked';
runtime/orchestrator-service/server.js:5099:  if ((assetType === 'ad' || assetType === 'email_hero' || assetType === 'blog_visual') && !truth.product) {
runtime/orchestrator-service/server.js:5100:    result.status = 'restricted_generation';
runtime/orchestrator-service/server.js:5104:  if ((assetType === 'ad' || assetType === 'email_hero' || assetType === 'blog_visual') && !truth.packaging) {
runtime/orchestrator-service/server.js:5105:    result.status = 'restricted_generation';
runtime/orchestrator-service/server.js:5116:function buildGenerationPrompt(projectName, assetType, goal) {
runtime/orchestrator-service/server.js:5117:  const executionPackage = buildExecutionPackage(projectName, assetType, goal);
runtime/orchestrator-service/server.js:5122:  lines.push(`Create a brand-controlled ${assetType} visual for project ${projectName}.`);
runtime/orchestrator-service/server.js:5126:  if (execution.source_of_truth.product) {
runtime/orchestrator-service/server.js:5132:  if (execution.source_of_truth.packaging) {
runtime/orchestrator-service/server.js:5146:  if (execution.source_of_truth.references.length > 0) {
runtime/orchestrator-service/server.js:5147:    lines.push(`Reference assets may influence style direction only, never source-of-truth identity.`);
runtime/orchestrator-service/server.js:5153:function buildGenerationJob(projectName, assetType, goal) {
runtime/orchestrator-service/server.js:5154:  const eligibility = evaluateGenerationEligibility(projectName, assetType);
runtime/orchestrator-service/server.js:5155:  const executionPackage = buildExecutionPackage(projectName, assetType, goal);
runtime/orchestrator-service/server.js:5159:  const outputFilename = `${jobId}_${assetType}.json`;
runtime/orchestrator-service/server.js:5165:    asset_type: assetType,
runtime/orchestrator-service/server.js:5168:    status: eligibility.status,
runtime/orchestrator-service/server.js:5172:    source_of_truth: executionPackage.execution.source_of_truth,
runtime/orchestrator-service/server.js:5175:    final_generation_prompt: buildGenerationPrompt(projectName, assetType, goal),
runtime/orchestrator-service/server.js:5176:    suggested_output_path: path.join(outputPaths.legacyOutputsDir, `${jobId}_${assetType}.png`)
runtime/orchestrator-service/server.js:5190:function buildExecutionInstructions(projectName, assetType, goal) {
runtime/orchestrator-service/server.js:5192:  const truth = context.source_of_truth;
runtime/orchestrator-service/server.js:5193:  const readinessCheck = evaluateExecutionReadiness(projectName, assetType);
runtime/orchestrator-service/server.js:5194:  const promptPackage = generateBrandControlledPrompt(projectName, assetType, goal);
runtime/orchestrator-service/server.js:5197:    execution_type: assetType,
runtime/orchestrator-service/server.js:5200:    status: readinessCheck.status,
runtime/orchestrator-service/server.js:5204:    source_of_truth: {
runtime/orchestrator-service/server.js:5218:function buildExecutionPackage(projectName, assetType, goal) {
runtime/orchestrator-service/server.js:5220:  const execution = buildExecutionInstructions(projectName, assetType, goal);
runtime/orchestrator-service/server.js:5224:    asset_type: assetType,
runtime/orchestrator-service/server.js:5236:function resolveSourceOfTruthAssets(projectName) {
runtime/orchestrator-service/server.js:5241:  const activeAssets = registry.filter(item => item.status === 'active');
runtime/orchestrator-service/server.js:5244:    activeAssets.find(
runtime/orchestrator-service/server.js:5245:      item => item.asset_role === role && item.use_as_source_of_truth === true
runtime/orchestrator-service/server.js:5248:  const references = activeAssets.filter(
runtime/orchestrator-service/server.js:5290:  const sourceOfTruth = resolveSourceOfTruthAssets(projectName);
runtime/orchestrator-service/server.js:5297:    source_of_truth: sourceOfTruth,
runtime/orchestrator-service/server.js:5313:function generateBrandControlledPrompt(projectName, assetType, goal) {
runtime/orchestrator-service/server.js:5315:  const truth = context.source_of_truth;
runtime/orchestrator-service/server.js:5321:  lines.push(`Asset type: ${assetType}.`);
runtime/orchestrator-service/server.js:5326:    lines.push(`Registered logo source is available and must be used as source of truth.`);
runtime/orchestrator-service/server.js:5351:    lines.push(`Reference assets may be used for inspiration only, never as source of truth.`);
runtime/orchestrator-service/server.js:5356:    asset_type: assetType,
runtime/orchestrator-service/server.js:5419:    fs.renameSync(tmpPath, filePath);
runtime/orchestrator-service/server.js:5423:      new Error(`[server] Atomic rename failed for ${filePath}: ${err.message}`),
runtime/orchestrator-service/server.js:5429:function normalizeAssetRole(input) {
runtime/orchestrator-service/server.js:5570:    return { folder: type, files };
runtime/orchestrator-service/server.js:5588:    total_assets: registry.length,
runtime/orchestrator-service/server.js:5589:    assets: registry
runtime/orchestrator-service/server.js:5604:      const assetPaths = getProjectAssetPaths(project);
runtime/orchestrator-service/server.js:5605:      const assets = readJsonFile(assetPaths.assetsRegistryPath, []);
runtime/orchestrator-service/server.js:5606:      const assetMatch = assets.find((asset) => {
runtime/orchestrator-service/server.js:5607:        const assetFilename = path.basename(String(asset.file_path || '').trim());
runtime/orchestrator-service/server.js:5608:        if (!assetFilename || assetFilename !== safeFilename) {
runtime/orchestrator-service/server.js:5612:        return !normalizedType || String(asset.asset_type || '').trim().toLowerCase() === normalizedType;
runtime/orchestrator-service/server.js:5615:      if (assetMatch && fs.existsSync(assetMatch.file_path)) {
runtime/orchestrator-service/server.js:5616:        return assetMatch.file_path;
runtime/orchestrator-service/server.js:5626:    const expectedRole = buildAssetRoleFromType(normalizedType);
runtime/orchestrator-service/server.js:5627:    const legacyMatch = registry.find((asset) => {
runtime/orchestrator-service/server.js:5628:      const assetFilename = path.basename(String(asset.local_path || asset.filename || '').trim());
runtime/orchestrator-service/server.js:5629:      if (!assetFilename || assetFilename !== safeFilename) {
runtime/orchestrator-service/server.js:5637:      return String(asset.asset_role || '').trim().toLowerCase() === expectedRole;
runtime/orchestrator-service/server.js:5664:    assets: null,
runtime/orchestrator-service/server.js:5675:      total_assets: 0,
runtime/orchestrator-service/server.js:5676:      assets: []
runtime/orchestrator-service/server.js:5696:    payload.errors.assets = message;
runtime/orchestrator-service/server.js:5706:    assets: buildProjectControlCenterAssets,
runtime/orchestrator-service/server.js:5724:function getAssetDirByRole(paths, assetRole) {
runtime/orchestrator-service/server.js:5725:  if (assetRole === 'logo_source') return paths.logoDir;
runtime/orchestrator-service/server.js:5726:  if (assetRole === 'packaging_source') return paths.packagingDir;
runtime/orchestrator-service/server.js:5727:  if (assetRole === 'product_source') return paths.productDir;
runtime/orchestrator-service/server.js:5728:  if (assetRole === 'reference_source') return paths.referenceDir;
runtime/orchestrator-service/server.js:5729:  if (assetRole === 'video_source') return paths.videoDir;
runtime/orchestrator-service/server.js:5867:  error.statusCode = 400;
runtime/orchestrator-service/server.js:5962:    text.includes('status') ||
runtime/orchestrator-service/server.js:5980:    category: null,
runtime/orchestrator-service/server.js:5988:    intelligence.category = 'skin';
runtime/orchestrator-service/server.js:5993:    intelligence.category = 'beard';
runtime/orchestrator-service/server.js:5998:    intelligence.category = 'hair';
runtime/orchestrator-service/server.js:6144:    text.includes('delete')
runtime/orchestrator-service/server.js:6220:      summary: `Task classified as ${taskType} for project ${project}.`,
runtime/orchestrator-service/server.js:6273:    brandAssetsDir: path.join(baseDir, 'brand-assets'),
runtime/orchestrator-service/server.js:6286:    uploadsDir: path.join(baseDir, 'uploads'),
runtime/orchestrator-service/server.js:6297:    assetsRegistryPath: path.join(resolved.projectRoot, 'assets-registry.json'),
runtime/orchestrator-service/server.js:6311:    brandProfilePath: path.join(base.brandAssetsDir, 'brand-profile.json'),
runtime/orchestrator-service/server.js:6312:    assetsRegistryPath: path.join(base.baseDir, 'assets-registry.json'),
runtime/orchestrator-service/server.js:6314:    sourceOfTruthRegistryPath: path.join(base.baseDir, 'source-of-truth-registry.json'),
runtime/orchestrator-service/server.js:6431:function normalizeAssetsRegistry(value) {
runtime/orchestrator-service/server.js:6445:  const explicitStatus = normalizeSourceStatus(entry.status);
runtime/orchestrator-service/server.js:6484:    brand_assets: ['brand_assets', 'logo', 'brand_guideline'],
runtime/orchestrator-service/server.js:6500:    const status = computeSourceStatus(entry);
runtime/orchestrator-service/server.js:6503:      status,
runtime/orchestrator-service/server.js:6524:    statuses: ['missing', 'connected', 'verified', 'outdated'],
runtime/orchestrator-service/server.js:6583:    paths.brandAssetsDir,
runtime/orchestrator-service/server.js:6596:    paths.uploadsDir,
runtime/orchestrator-service/server.js:6608:  const assetsRegistry = readCanonicalJsonWithLegacyFallback(safeProject, {
runtime/orchestrator-service/server.js:6609:    domain: 'assets-registry',
runtime/orchestrator-service/server.js:6610:    canonicalPath: paths.assetsRegistryPath,
runtime/orchestrator-service/server.js:6611:    legacyCandidates: [paths.legacy.assetsRegistryPath, paths.legacy.mediaInputRegistryPath],
runtime/orchestrator-service/server.js:6613:    normalize: normalizeAssetsRegistry
runtime/orchestrator-service/server.js:6617:    domain: 'source-of-truth',
runtime/orchestrator-service/server.js:6663:      assets_registry: {
runtime/orchestrator-service/server.js:6664:        path: paths.assetsRegistryPath,
runtime/orchestrator-service/server.js:6665:        exists: fs.existsSync(paths.assetsRegistryPath),
runtime/orchestrator-service/server.js:6666:        source: assetsRegistry.source,
runtime/orchestrator-service/server.js:6667:        migrated: assetsRegistry.migrated
runtime/orchestrator-service/server.js:6669:      source_of_truth_registry: {
runtime/orchestrator-service/server.js:6700:    required_folders: {
runtime/orchestrator-service/server.js:6728:      status: 'connected'
runtime/orchestrator-service/server.js:6739:      status: 'connected'
runtime/orchestrator-service/server.js:6745:    brand_assets: projectData.brand_assets,
runtime/orchestrator-service/server.js:6761:      status: 'connected'
runtime/orchestrator-service/server.js:6771:    assets_registry_path: paths.assetsRegistryPath,
runtime/orchestrator-service/server.js:6772:    source_of_truth_registry_path: paths.sourceOfTruthRegistryPath,
runtime/orchestrator-service/server.js:6783:    paths.brandAssetsDir,
runtime/orchestrator-service/server.js:6796:    paths.uploadsDir
runtime/orchestrator-service/server.js:6823:    required_assets: ['logo', 'brand_profile', 'hero_images', 'legal_info'],
runtime/orchestrator-service/server.js:6826:    workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'publishing'],
runtime/orchestrator-service/server.js:6830:      'upload_brand_assets',
runtime/orchestrator-service/server.js:6843:      required_assets: ['logo', 'product_photos', 'product_catalog', 'price_list', 'shipping_policy', 'legal_docs'],
runtime/orchestrator-service/server.js:6846:      workspace_priorities: ['setup', 'library', 'campaign-studio', 'content-studio', 'media-studio', 'publishing', 'insights'],
runtime/orchestrator-service/server.js:6848:      starter_checklist: ['add_products', 'upload_product_media', 'define_shipping', 'connect_woocommerce', 'create_launch_campaign'],
runtime/orchestrator-service/server.js:6856:      required_assets: ['artist_photos', 'logo_or_signature', 'press_kit', 'music_links', 'video_clips'],
runtime/orchestrator-service/server.js:6859:      workspace_priorities: ['setup', 'library', 'media-studio', 'content-studio', 'campaign-studio', 'publishing'],
runtime/orchestrator-service/server.js:6861:      starter_checklist: ['complete_artist_profile', 'upload_press_photos', 'add_music_links', 'define_fan_audience', 'create_release_campaign'],
runtime/orchestrator-service/server.js:6869:      required_assets: ['logo', 'salon_photos', 'service_menu', 'price_list', 'before_after_media'],
runtime/orchestrator-service/server.js:6872:      workspace_priorities: ['setup', 'library', 'media-studio', 'content-studio', 'publishing', 'insights'],
runtime/orchestrator-service/server.js:6874:      starter_checklist: ['add_services', 'upload_before_after_media', 'add_booking_details', 'connect_google_business', 'create_local_campaign'],
runtime/orchestrator-service/server.js:6882:      required_assets: ['logo', 'property_photos', 'property_documents', 'location_media', 'agent_profile'],
runtime/orchestrator-service/server.js:6885:      workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'ads-manager', 'governance'],
runtime/orchestrator-service/server.js:6887:      starter_checklist: ['add_property_data', 'upload_property_media', 'define_lead_flow', 'connect_crm', 'create_listing_campaign'],
runtime/orchestrator-service/server.js:6895:      required_assets: ['logo', 'service_list', 'case_studies', 'testimonials'],
runtime/orchestrator-service/server.js:6898:      workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'publishing'],
runtime/orchestrator-service/server.js:6900:      starter_checklist: ['define_services', 'add_service_area', 'upload_testimonials', 'connect_contact_flow', 'create_offer_campaign'],
runtime/orchestrator-service/server.js:6908:      required_assets: ['logo', 'menu', 'food_photos', 'location_photos', 'offers'],
runtime/orchestrator-service/server.js:6911:      workspace_priorities: ['setup', 'library', 'media-studio', 'publishing', 'campaign-studio'],
runtime/orchestrator-service/server.js:6913:      starter_checklist: ['add_menu', 'upload_food_photos', 'add_opening_hours', 'connect_google_business', 'create_local_offer'],
runtime/orchestrator-service/server.js:6921:      required_assets: ['logo', 'case_studies', 'services_deck', 'client_testimonials'],
runtime/orchestrator-service/server.js:6924:      workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'insights', 'workflows'],
runtime/orchestrator-service/server.js:6934:      required_assets: ['logo', 'location_photos', 'service_or_product_list', 'reviews'],
runtime/orchestrator-service/server.js:6937:      workspace_priorities: ['setup', 'library', 'content-studio', 'publishing', 'insights'],
runtime/orchestrator-service/server.js:6939:      starter_checklist: ['add_location', 'add_opening_hours', 'upload_local_media', 'connect_google_business', 'create_local_post'],
runtime/orchestrator-service/server.js:6976:    required_assets: businessTemplate.required_assets,
runtime/orchestrator-service/server.js:6987:    status: 'initialized',
runtime/orchestrator-service/server.js:6988:    folders: {
runtime/orchestrator-service/server.js:6989:      brand_assets: paths.brandAssetsDir,
runtime/orchestrator-service/server.js:7002:      uploads: paths.uploadsDir
runtime/orchestrator-service/server.js:7048:    brand_assets: normalizeSetupTextValue(input.brand_assets),
runtime/orchestrator-service/server.js:7057:    status: normalizeSetupTextValue(input.project_status || input.status),
runtime/orchestrator-service/server.js:7090:    throw new Error('Project rename is not supported by Setup persistence');
runtime/orchestrator-service/server.js:7166:      domain: 'assets_registry',
runtime/orchestrator-service/server.js:7167:      canonical_path: paths.assetsRegistryPath,
runtime/orchestrator-service/server.js:7168:      legacy_path: paths.legacy.assetsRegistryPath
runtime/orchestrator-service/server.js:7171:      domain: 'source_of_truth_registry',
runtime/orchestrator-service/server.js:7183:    if (item.domain === 'source_of_truth_registry') {
runtime/orchestrator-service/server.js:7252:  const missingAssets = reviewProjectMissingAssets(safeProject);
runtime/orchestrator-service/server.js:7279:    .filter((entry) => ['connected', 'verified'].includes(normalizeSourceStatus(entry?.status)))
runtime/orchestrator-service/server.js:7285:  const assetBlockers = Array.isArray(missingAssets.blockers) ? missingAssets.blockers.length : 0;
runtime/orchestrator-service/server.js:7286:  const requiredAssetCount = Array.isArray(missingAssets.required_asset_types) ? missingAssets.required_asset_types.length : 0;
runtime/orchestrator-service/server.js:7287:  const assetsCompleteness = requiredAssetCount
runtime/orchestrator-service/server.js:7288:    ? Math.max(0, Math.round(((requiredAssetCount - assetBlockers) / requiredAssetCount) * 100))
runtime/orchestrator-service/server.js:7302:    source_of_truth_completeness: sourceOfTruthCompleteness,
runtime/orchestrator-service/server.js:7303:    assets_completeness: assetsCompleteness,
runtime/orchestrator-service/server.js:7313:    has_brand_assets_dir: fs.existsSync(paths.brandAssetsDir),
runtime/orchestrator-service/server.js:7326:    has_uploads_dir: fs.existsSync(paths.uploadsDir),
runtime/orchestrator-service/server.js:7328:    has_assets_registry: baselineValidation.required_files.assets_registry.exists,
runtime/orchestrator-service/server.js:7329:    has_source_of_truth_registry: baselineValidation.required_files.source_of_truth_registry.exists,
runtime/orchestrator-service/server.js:7349:  if (domainScores.source_of_truth_completeness < 100) missing.push('source_of_truth_incomplete');
runtime/orchestrator-service/server.js:7350:  if (domainScores.assets_completeness < 100) missing.push('assets_incomplete');
runtime/orchestrator-service/server.js:7376:    status: readinessScore >= 85 ? 'ready_for_data_upload' : 'needs_input'
runtime/orchestrator-service/server.js:7379:function getProjectAssetPaths(projectName) {
runtime/orchestrator-service/server.js:7386:function normalizeAssetTags(value) {
runtime/orchestrator-service/server.js:7396:function normalizeAssetRecord(projectName, asset = {}) {
runtime/orchestrator-service/server.js:7398:  const canonicalType = getCanonicalAssetType(asset.type || asset.asset_type) || normalizeSetupTextValue(asset.type || asset.asset_type).toLowerCase();
runtime/orchestrator-service/server.js:7399:  const filePath = normalizeSetupTextValue(asset.file_path || asset.path);
runtime/orchestrator-service/server.js:7400:  const fileName = normalizeSetupTextValue(asset.file_name || (filePath ? path.basename(filePath) : ''));
runtime/orchestrator-service/server.js:7401:  const displayName = normalizeSetupTextValue(asset.display_name || asset.name || asset.title || fileName);
runtime/orchestrator-service/server.js:7402:  const createdAt = normalizeSetupTextValue(asset.created_at || asset.registered_at) || now;
runtime/orchestrator-service/server.js:7403:  const status = normalizeSetupTextValue(asset.status)
runtime/orchestrator-service/server.js:7404:    || (normalizeSetupTextValue(asset.exists) === 'false' ? 'missing' : 'connected');
runtime/orchestrator-service/server.js:7405:  const source = normalizeSetupTextValue(asset.source || asset.scan_source || asset.metadata?.scan_source || 'project_upload');
runtime/orchestrator-service/server.js:7409:    id: normalizeSetupTextValue(asset.id || asset.asset_id) || `asset_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
runtime/orchestrator-service/server.js:7410:    asset_id: normalizeSetupTextValue(asset.asset_id || asset.id) || `asset_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
runtime/orchestrator-service/server.js:7414:    title: normalizeSetupTextValue(asset.title || displayName || fileName),
runtime/orchestrator-service/server.js:7417:    asset_type: canonicalType,
runtime/orchestrator-service/server.js:7420:    tags: normalizeAssetTags(asset.tags),
runtime/orchestrator-service/server.js:7421:    status,
runtime/orchestrator-service/server.js:7422:    readiness_status: normalizeSetupTextValue(asset.readiness_status || status) || status,
runtime/orchestrator-service/server.js:7423:    review_status: normalizeSetupTextValue(asset.review_status || asset.readiness_status || status) || status,
runtime/orchestrator-service/server.js:7426:    source_of_truth: Boolean(asset.source_of_truth || asset.use_as_source_of_truth),
runtime/orchestrator-service/server.js:7427:    use_as_source_of_truth: Boolean(asset.use_as_source_of_truth || asset.source_of_truth),
runtime/orchestrator-service/server.js:7428:    approved: Boolean(asset.approved),
runtime/orchestrator-service/server.js:7429:    approved_at: normalizeSetupTextValue(asset.approved_at),
runtime/orchestrator-service/server.js:7430:    approval_note: normalizeSetupTextValue(asset.approval_note),
runtime/orchestrator-service/server.js:7431:    rejected: Boolean(asset.rejected),
runtime/orchestrator-service/server.js:7432:    rejected_at: normalizeSetupTextValue(asset.rejected_at),
runtime/orchestrator-service/server.js:7433:    rejection_note: normalizeSetupTextValue(asset.rejection_note),
runtime/orchestrator-service/server.js:7434:    needs_review: Boolean(asset.needs_review),
runtime/orchestrator-service/server.js:7435:    reviewed_at: normalizeSetupTextValue(asset.reviewed_at),
runtime/orchestrator-service/server.js:7436:    reviewed_by: normalizeSetupTextValue(asset.reviewed_by),
runtime/orchestrator-service/server.js:7437:    archived: Boolean(asset.archived),
runtime/orchestrator-service/server.js:7438:    archived_at: normalizeSetupTextValue(asset.archived_at),
runtime/orchestrator-service/server.js:7439:    archive_note: normalizeSetupTextValue(asset.archive_note),
runtime/orchestrator-service/server.js:7440:    deleted: Boolean(asset.deleted),
runtime/orchestrator-service/server.js:7441:    deleted_at: normalizeSetupTextValue(asset.deleted_at),
runtime/orchestrator-service/server.js:7442:    deleted_by: normalizeSetupTextValue(asset.deleted_by),
runtime/orchestrator-service/server.js:7443:    delete_note: normalizeSetupTextValue(asset.delete_note),
runtime/orchestrator-service/server.js:7444:    source_of_truth_updated_at: normalizeSetupTextValue(asset.source_of_truth_updated_at),
runtime/orchestrator-service/server.js:7445:    source_of_truth_updated_by: normalizeSetupTextValue(asset.source_of_truth_updated_by),
runtime/orchestrator-service/server.js:7446:    renamed_at: normalizeSetupTextValue(asset.renamed_at),
runtime/orchestrator-service/server.js:7447:    renamed_by: normalizeSetupTextValue(asset.renamed_by),
runtime/orchestrator-service/server.js:7449:    metadata: asset.metadata && typeof asset.metadata === 'object' ? asset.metadata : {}
runtime/orchestrator-service/server.js:7453:function registerProjectAsset(projectName, assetType, filePath) {
runtime/orchestrator-service/server.js:7454:  const paths = getProjectAssetPaths(projectName);
runtime/orchestrator-service/server.js:7460:  const assets = readJsonFile(paths.assetsRegistryPath, [])
runtime/orchestrator-service/server.js:7461:    .map((item) => normalizeAssetRecord(projectName, item));
runtime/orchestrator-service/server.js:7463:  const record = normalizeAssetRecord(projectName, {
runtime/orchestrator-service/server.js:7464:    type: assetType,
runtime/orchestrator-service/server.js:7466:    source: 'project_upload',
runtime/orchestrator-service/server.js:7467:    status: 'connected'
runtime/orchestrator-service/server.js:7470:  const withoutExisting = assets.filter((item) => item.file_path !== record.file_path || item.type !== record.type);
runtime/orchestrator-service/server.js:7472:  writeJsonFile(paths.assetsRegistryPath, withoutExisting);
runtime/orchestrator-service/server.js:7476:    registry_path: paths.assetsRegistryPath
runtime/orchestrator-service/server.js:7480:function listProjectAssets(projectName) {
runtime/orchestrator-service/server.js:7481:  const paths = getProjectAssetPaths(projectName);
runtime/orchestrator-service/server.js:7487:  const normalized = readJsonFile(paths.assetsRegistryPath, [])
runtime/orchestrator-service/server.js:7488:    .map((item) => normalizeAssetRecord(projectName, item));
runtime/orchestrator-service/server.js:7489:  writeJsonFile(paths.assetsRegistryPath, normalized);
runtime/orchestrator-service/server.js:7494:  const paths = getProjectAssetPaths(projectName);
runtime/orchestrator-service/server.js:7506:    status: 'connected'
runtime/orchestrator-service/server.js:7520:function removeProjectSourceOfTruth(projectName, sourceType) {
runtime/orchestrator-service/server.js:7521:  const paths = getProjectAssetPaths(projectName);
runtime/orchestrator-service/server.js:7535:  delete sources[normalizedSourceType];
runtime/orchestrator-service/server.js:7542:    removed: Boolean(existing),
runtime/orchestrator-service/server.js:7548:  const paths = getProjectAssetPaths(projectName);
runtime/orchestrator-service/server.js:7557:    source_of_truth_registry: readJsonFile(paths.sourceOfTruthRegistryPath, buildSourceOfTruthRegistry({}))
runtime/orchestrator-service/server.js:7768:  const explicitStatus = normalizeTextValue(record.status).toLowerCase();
runtime/orchestrator-service/server.js:7770:  let statusKey = 'not_connected';
runtime/orchestrator-service/server.js:7773:    statusKey = 'token_expired';
runtime/orchestrator-service/server.js:7775:    statusKey = 'error';
runtime/orchestrator-service/server.js:7777:    statusKey = 'not_connected';
runtime/orchestrator-service/server.js:7783:    statusKey = 'connected';
runtime/orchestrator-service/server.js:7785:    statusKey = 'partial';
runtime/orchestrator-service/server.js:7788:  const statusLabelMap = {
runtime/orchestrator-service/server.js:7799:    if (statusKey === 'connected') {
runtime/orchestrator-service/server.js:7803:    } else if (statusKey === 'partial') {
runtime/orchestrator-service/server.js:7805:    } else if (statusKey === 'token_expired') {
runtime/orchestrator-service/server.js:7807:    } else if (statusKey === 'error') {
runtime/orchestrator-service/server.js:7813:    status: statusKey,
runtime/orchestrator-service/server.js:7814:    status_label: statusLabelMap[statusKey] || 'Not Connected',
runtime/orchestrator-service/server.js:7884:  const status = determineIntegrationStatus(normalizedRecord);
runtime/orchestrator-service/server.js:7886:    status: status.status,
runtime/orchestrator-service/server.js:7888:    health_summary: status.health_summary
runtime/orchestrator-service/server.js:7894:    status: status.status,
runtime/orchestrator-service/server.js:7895:    status_label: status.status_label,
runtime/orchestrator-service/server.js:7902:    missing_required: status.missing_required,
runtime/orchestrator-service/server.js:7919:    health_summary: status.health_summary,
runtime/orchestrator-service/server.js:7946:      status: 'connected',
runtime/orchestrator-service/server.js:7985:    connected: all.filter(item => item.status === 'connected').length,
runtime/orchestrator-service/server.js:7986:    partial: all.filter(item => item.status === 'partial').length,
runtime/orchestrator-service/server.js:7987:    error: all.filter(item => item.status === 'error').length,
runtime/orchestrator-service/server.js:7988:    token_expired: all.filter(item => item.status === 'token_expired').length,
runtime/orchestrator-service/server.js:7989:    not_connected: all.filter(item => item.status === 'not_connected').length
runtime/orchestrator-service/server.js:8021:      status: 'unsupported_provider'
runtime/orchestrator-service/server.js:8088:      status: providerResult.status,
runtime/orchestrator-service/server.js:8105:    const statusFromError = normalizeTextValue(error.status);
runtime/orchestrator-service/server.js:8109:    }).status;
runtime/orchestrator-service/server.js:8113:      status:
runtime/orchestrator-service/server.js:8114:        statusFromError === 'token_expired'
runtime/orchestrator-service/server.js:8116:          : statusFromError === 'reconnect_required'
runtime/orchestrator-service/server.js:8125:        status:
runtime/orchestrator-service/server.js:8126:          statusFromError === 'token_expired'
runtime/orchestrator-service/server.js:8128:            : statusFromError === 'reconnect_required'
runtime/orchestrator-service/server.js:8142:      status: normalizeTextValue(error.status || nextRecord.status)
runtime/orchestrator-service/server.js:8155:    ['connected', 'partial'].includes(String(nextRecord.status || '').toLowerCase())
runtime/orchestrator-service/server.js:8168:  const status = determineIntegrationStatus(record);
runtime/orchestrator-service/server.js:8170:  if (status.status === 'not_connected') {
runtime/orchestrator-service/server.js:8174:  if (status.status === 'partial') {
runtime/orchestrator-service/server.js:8178:  if (status.status === 'token_expired') {
runtime/orchestrator-service/server.js:8194:      status: 'unsupported_provider'
runtime/orchestrator-service/server.js:8212:    nextRecord.status = 'not_connected';
runtime/orchestrator-service/server.js:8217:      removeProjectSourceOfTruth(projectName, existing.source_key);
runtime/orchestrator-service/server.js:8232:      nextRecord.status = providerResult.status;
runtime/orchestrator-service/server.js:8254:      nextRecord.status =
runtime/orchestrator-service/server.js:8255:        normalizeTextValue(error.status) === 'token_expired'
runtime/orchestrator-service/server.js:8257:          : normalizeTextValue(error.status) === 'reconnect_required'
runtime/orchestrator-service/server.js:8264:        status: nextRecord.status,
runtime/orchestrator-service/server.js:8284:function reviewProjectMissingAssets(projectName) {
runtime/orchestrator-service/server.js:8285:  const paths = getProjectAssetPaths(projectName);
runtime/orchestrator-service/server.js:8291:  const assets = readJsonFile(paths.assetsRegistryPath, []);
runtime/orchestrator-service/server.js:8292:  const categoryReadiness = buildProjectAssetCategoryReadiness(projectName, assets);
runtime/orchestrator-service/server.js:8293:  const required = getAssetTypeCatalog()
runtime/orchestrator-service/server.js:8295:    .map(item => item.asset_type);
runtime/orchestrator-service/server.js:8296:  const assetTypes = assets
runtime/orchestrator-service/server.js:8297:    .map(item => getCanonicalAssetType(item.asset_type) || String(item.asset_type || '').trim().toLowerCase())
runtime/orchestrator-service/server.js:8299:  const missing = categoryReadiness.categories
runtime/orchestrator-service/server.js:8300:    .filter(item => item.required && item.status === 'Missing')
runtime/orchestrator-service/server.js:8301:    .map(item => item.asset_type);
runtime/orchestrator-service/server.js:8302:  const blockers = categoryReadiness.categories
runtime/orchestrator-service/server.js:8303:    .filter(item => item.required && ['Missing', 'Needs Review'].includes(item.status))
runtime/orchestrator-service/server.js:8304:    .map(item => item.asset_type);
runtime/orchestrator-service/server.js:8309:    required_asset_types: required,
runtime/orchestrator-service/server.js:8310:    registered_asset_types: [...new Set(assetTypes)].sort(),
runtime/orchestrator-service/server.js:8313:    category_readiness: categoryReadiness,
runtime/orchestrator-service/server.js:8314:    status: blockers.length ? 'asset_blockers' : 'assets_ready'
runtime/orchestrator-service/server.js:8317:function getAssetTypeCatalog() {
runtime/orchestrator-service/server.js:8320:      asset_type: 'logo',
runtime/orchestrator-service/server.js:8326:      target_folder: 'brand-assets',
runtime/orchestrator-service/server.js:8330:        what_to_upload: 'Primary logo files, transparent logo variants, and approved lockups.',
runtime/orchestrator-service/server.js:8336:      asset_type: 'brand_guideline',
runtime/orchestrator-service/server.js:8342:      target_folder: 'brand-assets',
runtime/orchestrator-service/server.js:8346:        what_to_upload: 'Brand book, tone guide, design system notes, claim rules, and visual do/dont guidance.',
runtime/orchestrator-service/server.js:8352:      asset_type: 'product_csv',
runtime/orchestrator-service/server.js:8358:      target_folder: 'products',
runtime/orchestrator-service/server.js:8362:        what_to_upload: 'SKU list, product names, descriptions, variants, ingredients, usage, and product URLs.',
runtime/orchestrator-service/server.js:8368:      asset_type: 'pricing_doc',
runtime/orchestrator-service/server.js:8374:      target_folder: 'content',
runtime/orchestrator-service/server.js:8378:        what_to_upload: 'Price lists, offer sheets, bundles, campaign discounts, coupons, and margin guardrails.',
runtime/orchestrator-service/server.js:8384:      asset_type: 'legal_doc',
runtime/orchestrator-service/server.js:8390:      target_folder: 'content',
runtime/orchestrator-service/server.js:8394:        what_to_upload: 'Terms, privacy policy, disclaimers, compliance notes, claim restrictions, and regulated copy rules.',
runtime/orchestrator-service/server.js:8400:      asset_type: 'product_photos',
runtime/orchestrator-service/server.js:8406:      target_folder: 'products',
runtime/orchestrator-service/server.js:8410:        what_to_upload: 'Clean product packshots, lifestyle product photos, before/after images where allowed, and hero crops.',
runtime/orchestrator-service/server.js:8416:      asset_type: 'product_videos',
runtime/orchestrator-service/server.js:8422:      target_folder: 'products',
runtime/orchestrator-service/server.js:8423:      aliases: ['product_video', 'product_video_assets', 'video'],
runtime/orchestrator-service/server.js:8426:        what_to_upload: 'Product demos, UGC clips, reels, explainers, usage videos, and source cutdowns.',
runtime/orchestrator-service/server.js:8432:      asset_type: 'social_assets',
runtime/orchestrator-service/server.js:8433:      label: 'Social Assets / Social-Media-Assets',
runtime/orchestrator-service/server.js:8438:      target_folder: 'campaigns',
runtime/orchestrator-service/server.js:8439:      aliases: ['social_asset', 'social_creatives', 'organic_social_assets'],
runtime/orchestrator-service/server.js:8440:      description: 'Organic social creative, post visuals, reels, stories, and channel-ready source assets.',
runtime/orchestrator-service/server.js:8442:        what_to_upload: 'Organic post images, story frames, reels, thumbnails, channel templates, and captions references.',
runtime/orchestrator-service/server.js:8443:        why_it_matters: 'Content Studio, Media Studio, Campaign Studio, and Publishing can reuse proven channel assets.',
runtime/orchestrator-service/server.js:8448:      asset_type: 'campaign_assets',
runtime/orchestrator-service/server.js:8449:      label: 'Campaign Assets / Kampagnenmaterial',
runtime/orchestrator-service/server.js:8454:      target_folder: 'campaigns',
runtime/orchestrator-service/server.js:8455:      aliases: ['campaign_asset', 'creative_assets', 'ad_assets'],
runtime/orchestrator-service/server.js:8458:        what_to_upload: 'Campaign banners, ad creative, landing-page assets, email hero files, export packs, and wave-specific files.',
runtime/orchestrator-service/server.js:8464:      asset_type: 'packaging_images',
runtime/orchestrator-service/server.js:8470:      target_folder: 'products',
runtime/orchestrator-service/server.js:8474:        what_to_upload: 'Packaging photos, label artwork, inserts, box shots, bottle/jar details, and compliance label references.',
runtime/orchestrator-service/server.js:8480:      asset_type: 'testimonials_reviews',
runtime/orchestrator-service/server.js:8486:      target_folder: 'content',
runtime/orchestrator-service/server.js:8490:        what_to_upload: 'Review exports, testimonial docs, approved screenshots, quote permissions, and proof notes.',
runtime/orchestrator-service/server.js:8496:      asset_type: 'certificates',
runtime/orchestrator-service/server.js:8502:      target_folder: 'content',
runtime/orchestrator-service/server.js:8506:        what_to_upload: 'Certificates, compliance proof, awards, lab reports, or official authorization documents.',
runtime/orchestrator-service/server.js:8512:      asset_type: 'partner_docs',
runtime/orchestrator-service/server.js:8518:      target_folder: 'content',
runtime/orchestrator-service/server.js:8522:        what_to_upload: 'Partner briefs, supplier docs, marketplace requirements, distributor notes, and collaboration agreements.',
runtime/orchestrator-service/server.js:8530:function getCanonicalAssetType(assetType) {
runtime/orchestrator-service/server.js:8531:  const normalized = String(assetType || '').trim().toLowerCase();
runtime/orchestrator-service/server.js:8534:  for (const item of getAssetTypeCatalog()) {
runtime/orchestrator-service/server.js:8535:    const values = [item.asset_type, ...(item.aliases || [])].map(value => String(value || '').trim().toLowerCase());
runtime/orchestrator-service/server.js:8537:      return item.asset_type;
runtime/orchestrator-service/server.js:8544:function getAssetCategoryDefinition(assetType) {
runtime/orchestrator-service/server.js:8545:  const canonicalType = getCanonicalAssetType(assetType);
runtime/orchestrator-service/server.js:8546:  return getAssetTypeCatalog().find(item => item.asset_type === canonicalType) || null;
runtime/orchestrator-service/server.js:8549:function getAssetCategoryStatus(asset, projectName) {
runtime/orchestrator-service/server.js:8550:  const record = asset || {};
runtime/orchestrator-service/server.js:8552:    record.readiness_status ||
runtime/orchestrator-service/server.js:8553:    record.review_status ||
runtime/orchestrator-service/server.js:8554:    record.approval_status ||
runtime/orchestrator-service/server.js:8555:    record.status ||
runtime/orchestrator-service/server.js:8570:    const folderInfo = getTargetFolderForAssetType(projectName, record.asset_type);
runtime/orchestrator-service/server.js:8571:    if (filePath && !filePath.startsWith(folderInfo.target_dir)) {
runtime/orchestrator-service/server.js:8739:    missing_image_folder_rows: 0,
runtime/orchestrator-service/server.js:8740:    csv_product_folders: [],
runtime/orchestrator-service/server.js:8765:      const imageFolderIndex = headers.findIndex(value => value.toLowerCase() === 'image folder');
runtime/orchestrator-service/server.js:8784:          csvValidation.missing_image_folder_rows += 1;
runtime/orchestrator-service/server.js:8788:          csvValidation.csv_product_folders.push(candidate);
runtime/orchestrator-service/server.js:8795:            expected_folder: expectedFolder,
runtime/orchestrator-service/server.js:8796:            matched_folder: matchedFolder
runtime/orchestrator-service/server.js:8804:          expected_folder: expectedFolder,
runtime/orchestrator-service/server.js:8805:          candidate_folders: candidates
runtime/orchestrator-service/server.js:8812:  const foldersMissingFront = imageFolders.filter((folderName) => !frontFolderSet.has(folderName));
runtime/orchestrator-service/server.js:8813:  const csvFolderSet = new Set(csvValidation.csv_product_folders.filter(Boolean));
runtime/orchestrator-service/server.js:8814:  const extraImageFolders = frontFolderNames.filter(folder => !csvFolderSet.has(folder));
runtime/orchestrator-service/server.js:8816:    .map((item) => item.expected_folder || item.product_name)
runtime/orchestrator-service/server.js:8822:  const scannedAssets = [];
runtime/orchestrator-service/server.js:8825:    scannedAssets.push({
runtime/orchestrator-service/server.js:8826:      asset_type: 'product_csv',
runtime/orchestrator-service/server.js:8834:    scannedAssets.push({
runtime/orchestrator-service/server.js:8835:      asset_type: 'product_photos',
runtime/orchestrator-service/server.js:8843:    scannedAssets.push({
runtime/orchestrator-service/server.js:8844:      asset_type: 'product_videos',
runtime/orchestrator-service/server.js:8867:      status: projectProductDataFiles.concat(mirrorProductDataFiles).length > 0 ? 'Uploaded' : 'Missing',
runtime/orchestrator-service/server.js:8878:        missing_image_folder_rows: csvValidation.missing_image_folder_rows
runtime/orchestrator-service/server.js:8882:      total_product_folders: imageFolders.length,
runtime/orchestrator-service/server.js:8883:      folders_with_front_image: frontFolderNames.length,
runtime/orchestrator-service/server.js:8884:      folders_missing_front_image: foldersMissingFront.length,
runtime/orchestrator-service/server.js:8885:      missing_front_folders: foldersMissingFront,
runtime/orchestrator-service/server.js:8889:      csv_missing_front_folders: missingImageFolders,
runtime/orchestrator-service/server.js:8890:      extra_image_folders: extraImageFolders,
runtime/orchestrator-service/server.js:8893:      status:
runtime/orchestrator-service/server.js:8900:        `Detected ${frontFolderNames.length} image folder(s) with front.png and ${extraImageFolders.length} extra folder(s) not referenced by the CSV.`
runtime/orchestrator-service/server.js:8906:      status: productVideoFiles.length ? 'Uploaded' : 'Missing',
runtime/orchestrator-service/server.js:8909:    scanned_assets: scannedAssets
runtime/orchestrator-service/server.js:8916:  const assetsRegistryPath = path.join(basePaths.baseDir, 'assets-registry.json');
runtime/orchestrator-service/server.js:8917:  const hasAssetRegistry = fs.existsSync(assetsRegistryPath);
runtime/orchestrator-service/server.js:8923:  const existingAssets = hasAssetRegistry
runtime/orchestrator-service/server.js:8924:    ? readJsonFile(assetsRegistryPath, []).map((asset) => normalizeAssetRecord(safeProject, asset))
runtime/orchestrator-service/server.js:8931:  existingAssets.forEach((asset) => {
runtime/orchestrator-service/server.js:8932:    const canonicalType = getCanonicalAssetType(asset.type || asset.asset_type) || String(asset.type || asset.asset_type || '').trim().toLowerCase();
runtime/orchestrator-service/server.js:8933:    const filePath = String(asset.file_path || '').trim();
runtime/orchestrator-service/server.js:8938:    existingByKey.set(key, asset);
runtime/orchestrator-service/server.js:8941:  const retained = existingAssets.filter((asset) => {
runtime/orchestrator-service/server.js:8942:    const canonicalType = getCanonicalAssetType(asset.type || asset.asset_type) || String(asset.type || asset.asset_type || '').trim().toLowerCase();
runtime/orchestrator-service/server.js:8943:    const managedByRefresh = String(asset?.metadata?.managed_by || '').trim().toLowerCase() === 'library_refresh';
runtime/orchestrator-service/server.js:8947:  const refreshedAssets = [];
runtime/orchestrator-service/server.js:8948:  scan.scanned_assets.forEach((scanned) => {
runtime/orchestrator-service/server.js:8949:    const canonicalType = getCanonicalAssetType(scanned.asset_type) || String(scanned.asset_type || '').trim().toLowerCase();
runtime/orchestrator-service/server.js:8958:    refreshedAssets.push(normalizeAssetRecord(safeProject, {
runtime/orchestrator-service/server.js:8960:      id: previous.id || previous.asset_id,
runtime/orchestrator-service/server.js:8963:      source: previous.source || scanned.scan_source || 'library_refresh',
runtime/orchestrator-service/server.js:8964:      source_of_truth: previous.source_of_truth,
runtime/orchestrator-service/server.js:8965:      status: fs.existsSync(filePath) ? 'connected' : 'missing',
runtime/orchestrator-service/server.js:8969:        managed_by: 'library_refresh',
runtime/orchestrator-service/server.js:8970:        scan_source: scanned.scan_source || 'library_refresh',
runtime/orchestrator-service/server.js:8976:  const nextAssets = retained.concat(refreshedAssets);
runtime/orchestrator-service/server.js:8978:  if (hasAssetRegistry) {
runtime/orchestrator-service/server.js:8979:    writeJsonFile(assetsRegistryPath, nextAssets);
runtime/orchestrator-service/server.js:8982:  const categoryReadiness = buildProjectAssetCategoryReadiness(safeProject, nextAssets, {
runtime/orchestrator-service/server.js:8989:    categories: categoryReadiness.categories,
runtime/orchestrator-service/server.js:8992:    missing_images: scan.product_photos?.csv_missing_front_folders || [],
runtime/orchestrator-service/server.js:8993:    extra_image_folders: scan.product_photos?.extra_image_folders || [],
runtime/orchestrator-service/server.js:8994:    registry_path: hasAssetRegistry ? assetsRegistryPath : null,
runtime/orchestrator-service/server.js:8995:    registry_updated: hasAssetRegistry,
runtime/orchestrator-service/server.js:8996:    previous_total_assets: existingAssets.length,
runtime/orchestrator-service/server.js:8997:    refreshed_assets_added: refreshedAssets.length,
runtime/orchestrator-service/server.js:8998:    total_assets: nextAssets.length,
runtime/orchestrator-service/server.js:9000:    category_readiness: categoryReadiness
runtime/orchestrator-service/server.js:9004:function buildProjectAssetCategoryReadiness(projectName, assetsInput = null, options = {}) {
runtime/orchestrator-service/server.js:9005:  const assets = Array.isArray(assetsInput) ? assetsInput : listProjectAssets(projectName);
runtime/orchestrator-service/server.js:9007:  const catalog = getAssetTypeCatalog();
runtime/orchestrator-service/server.js:9009:    const matchingAssets = assets.filter(asset => getCanonicalAssetType(asset.asset_type) === item.asset_type);
runtime/orchestrator-service/server.js:9010:    const statuses = matchingAssets.map(asset => getAssetCategoryStatus(asset, projectName));
