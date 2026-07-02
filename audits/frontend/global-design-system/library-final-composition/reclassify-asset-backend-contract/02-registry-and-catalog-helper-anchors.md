# 02 — Registry Helpers and Asset Catalog Helpers

Generated: Sat Jun  6 13:44:58 CEST 2026

## Helpers around project asset paths and registry
654:  const canonicalType = getCanonicalAssetType(normalizedType);
657:    const { catalog_item, target_dir } = getTargetFolderForAssetType(project, canonicalType);
740:    const assetPaths = getProjectAssetPaths(project);
741:    const assets = readJsonFile(assetPaths.assetsRegistryPath, []);
1087:      const registry = readJsonFile(paths.controlCenterRegistryPath, {});
1590:    data: readJsonFile(candidate.selectedPath, [])
1662:  return readJsonFile(getLegacyContentQueuePath(projectName, queueType), []);
1666:  writeJsonFile(getLegacyContentQueuePath(projectName, queueType), Array.isArray(queue) ? queue : []);
2229:  return readJsonFile(prepareFile.selectedPath, {});
2360:  return readJsonFile(latestPath, {});
2647:  return readJsonFile(latestPath, {});
3140:  return readJsonFile(path.join(packagesDir, files[0]), {});
3261:  return readJsonFile(path.join(tiktokDir, files[0]), {});
3421:  return readJsonFile(path.join(youtubeDir, files[0]), {});
3664:  return readJsonFile(path.join(dir, files[0]), {});
3798:  const products = readJsonFile(productPaths.productsPath, []);
3886:    ...readJsonFile(filePath, {}),
3893:  const products = readJsonFile(productPaths.productsPath, []);
3967:    ...readJsonFile(filePath, {}),
4255:    const connectorPayload = readJsonFile(rawJob.connector_file, {});
4358:  const existing = hasExisting ? readJsonFile(existingFilePath, {}) : {};
4446:    return hydrateScheduledJobRecord(projectName, readJsonFile(filePath, {}));
4518:  const products = readJsonFile(paths.productsPath, []);
4694:    history = readJsonFile(filePath, []);
4738:    const history = readJsonFile(filePath, []);
4763:    const history = readJsonFile(filePath, []);
4905:  return readJsonFile(latestPath, {});
4913:    path.join(paths.legacyOutputsDir, `${renderId}_${job.asset_type}.png`);
4919:    asset_type: job.asset_type,
4971:  return readJsonFile(latestPath, {});
4989:  const renderRequest = readJsonFile(renderPath, {});
5011:    asset_type: assetType,
5087:    asset_type: assetType,
5165:    asset_type: assetType,
5224:    asset_type: assetType,
5231:  writeJsonFile(packagePath, executionPackage);
5239:  const registry = readJsonFile(paths.registryPath, []);
5289:  const brandProfile = readJsonFile(paths.brandProfilePath, {});
5308:  writeJsonFile(contextPath, context);
5356:    asset_type: assetType,
5373:    writeJsonFile(filePath, defaultValue);
5377:function readJsonFile(filePath, fallback = []) {
5393:function writeJsonFile(filePath, data) {
5584:  const registry = readJsonFile(paths.registryPath, []);
5604:      const assetPaths = getProjectAssetPaths(project);
5605:      const assets = readJsonFile(assetPaths.assetsRegistryPath, []);
5612:        return !normalizedType || String(asset.asset_type || '').trim().toLowerCase() === normalizedType;
5625:    const registry = readJsonFile(brandPaths.registryPath, []);
5886:    const projectData = readJsonFile(getProjectBasePaths(safeProject).projectFilePath, {});
5903:    const projectData = readJsonFile(getProjectBasePaths(safeProject).projectFilePath, {});
6256:    writeJsonFile(registryPath, []);
6297:    assetsRegistryPath: path.join(resolved.projectRoot, 'assets-registry.json'),
6312:    assetsRegistryPath: path.join(base.baseDir, 'assets-registry.json'),
6337:    const current = readJsonFile(logPath, []);
6344:    writeJsonFile(logPath, next.slice(-200));
6371:  const canonicalValue = canonicalExists ? normalize(readJsonFile(canonicalPath, fallback)) : null;
6379:    const legacyValue = normalize(readJsonFile(legacyPath, fallback));
6405:    writeJsonFile(canonicalPath, firstLegacy.value);
6422:  writeJsonFile(canonicalPath, fallback);
6577:    ...readJsonFile(paths.projectFilePath, {}),
6610:    canonicalPath: paths.assetsRegistryPath,
6611:    legacyCandidates: [paths.legacy.assetsRegistryPath, paths.legacy.mediaInputRegistryPath],
6638:  const integrationSnapshot = readJsonFile(paths.integrationControlCenterPath, {
6642:  writeJsonFile(paths.integrationsRegistryPath, {
6664:        path: paths.assetsRegistryPath,
6665:        exists: fs.existsSync(paths.assetsRegistryPath),
6717:  const existingBrandProfile = readJsonFile(paths.brandProfilePath, {});
6719:  writeJsonFile(paths.brandProfilePath, brandProfile);
6721:  const currentSources = normalizeSourceRegistry(readJsonFile(paths.sourcesRegistryPath, {}));
6765:  writeJsonFile(paths.sourcesRegistryPath, nextSources);
6766:  writeJsonFile(paths.sourceOfTruthRegistryPath, buildSourceOfTruthRegistry(nextSources));
6771:    assets_registry_path: paths.assetsRegistryPath,
6955:  const projects = readJsonFile(registry.registryPath, []);
7007:  writeJsonFile(registry.registryPath, projects);
7008:  writeJsonFile(paths.projectFilePath, projectData);
7100:  const projects = readJsonFile(registry.registryPath, []);
7101:  const current = readJsonFile(paths.projectFilePath, {});
7110:  writeJsonFile(paths.projectFilePath, nextProject);
7122:    writeJsonFile(registry.registryPath, projects);
7140:  return readJsonFile(registry.registryPath, []);
7150:  return readJsonFile(paths.projectFilePath, {});
7167:      canonical_path: paths.assetsRegistryPath,
7168:      legacy_path: paths.legacy.assetsRegistryPath
7180:    const canonicalRaw = canonicalExists ? readJsonFile(item.canonical_path, null) : null;
7181:    const legacyRaw = legacyExists ? readJsonFile(item.legacy_path, null) : null;
7232:  writeJsonFile(reportPath, report);
7248:  const projectData = readJsonFile(paths.projectFilePath, {});
7250:  const brandProfile = readJsonFile(paths.brandProfilePath, {});
7251:  const sourceRegistry = buildSourceOfTruthRegistry(readJsonFile(paths.sourcesRegistryPath, {}));
7286:  const requiredAssetCount = Array.isArray(missingAssets.required_asset_types) ? missingAssets.required_asset_types.length : 0;
7379:function getProjectAssetPaths(projectName) {
7398:  const canonicalType = getCanonicalAssetType(asset.type || asset.asset_type) || normalizeSetupTextValue(asset.type || asset.asset_type).toLowerCase();
7417:    asset_type: canonicalType,
7454:  const paths = getProjectAssetPaths(projectName);
7460:  const assets = readJsonFile(paths.assetsRegistryPath, [])
7472:  writeJsonFile(paths.assetsRegistryPath, withoutExisting);
7476:    registry_path: paths.assetsRegistryPath
7481:  const paths = getProjectAssetPaths(projectName);
7487:  const normalized = readJsonFile(paths.assetsRegistryPath, [])
7489:  writeJsonFile(paths.assetsRegistryPath, normalized);
7494:  const paths = getProjectAssetPaths(projectName);
7502:  const sources = readJsonFile(paths.sourcesRegistryPath, {});
7509:  writeJsonFile(paths.sourcesRegistryPath, sources);
7510:  writeJsonFile(paths.sourceOfTruthRegistryPath, buildSourceOfTruthRegistry(sources));
7521:  const paths = getProjectAssetPaths(projectName);
7528:  const sources = readJsonFile(paths.sourcesRegistryPath, {});
7536:  writeJsonFile(paths.sourcesRegistryPath, sources);
7537:  writeJsonFile(paths.sourceOfTruthRegistryPath, buildSourceOfTruthRegistry(sources));
7548:  const paths = getProjectAssetPaths(projectName);
7556:    sources: readJsonFile(paths.sourcesRegistryPath, {}),
7557:    source_of_truth_registry: readJsonFile(paths.sourceOfTruthRegistryPath, buildSourceOfTruthRegistry({}))
7632:  const raw = readJsonFile(paths.controlCenterRegistryPath, {
7651:  writeJsonFile(paths.controlCenterRegistryPath, payload);
7652:  writeJsonFile(paths.integrationsRegistryPath, payload);
8285:  const paths = getProjectAssetPaths(projectName);
8291:  const assets = readJsonFile(paths.assetsRegistryPath, []);
8293:  const required = getAssetTypeCatalog()
8295:    .map(item => item.asset_type);
8297:    .map(item => getCanonicalAssetType(item.asset_type) || String(item.asset_type || '').trim().toLowerCase())
8301:    .map(item => item.asset_type);
8304:    .map(item => item.asset_type);
8309:    required_asset_types: required,
8310:    registered_asset_types: [...new Set(assetTypes)].sort(),
8317:function getAssetTypeCatalog() {
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
8530:function getCanonicalAssetType(assetType) {
8534:  for (const item of getAssetTypeCatalog()) {
8535:    const values = [item.asset_type, ...(item.aliases || [])].map(value => String(value || '').trim().toLowerCase());
8537:      return item.asset_type;
8545:  const canonicalType = getCanonicalAssetType(assetType);
8546:  return getAssetTypeCatalog().find(item => item.asset_type === canonicalType) || null;
8570:    const folderInfo = getTargetFolderForAssetType(projectName, record.asset_type);
8826:      asset_type: 'product_csv',
8835:      asset_type: 'product_photos',
8844:      asset_type: 'product_videos',
8916:  const assetsRegistryPath = path.join(basePaths.baseDir, 'assets-registry.json');
8917:  const hasAssetRegistry = fs.existsSync(assetsRegistryPath);
8924:    ? readJsonFile(assetsRegistryPath, []).map((asset) => normalizeAssetRecord(safeProject, asset))
8932:    const canonicalType = getCanonicalAssetType(asset.type || asset.asset_type) || String(asset.type || asset.asset_type || '').trim().toLowerCase();
8942:    const canonicalType = getCanonicalAssetType(asset.type || asset.asset_type) || String(asset.type || asset.asset_type || '').trim().toLowerCase();
8949:    const canonicalType = getCanonicalAssetType(scanned.asset_type) || String(scanned.asset_type || '').trim().toLowerCase();
8979:    writeJsonFile(assetsRegistryPath, nextAssets);
8994:    registry_path: hasAssetRegistry ? assetsRegistryPath : null,
9007:  const catalog = getAssetTypeCatalog();
9009:    const matchingAssets = assets.filter(asset => getCanonicalAssetType(asset.asset_type) === item.asset_type);
9026:    if (item.asset_type === 'product_csv') {
9034:    } else if (item.asset_type === 'product_photos') {
9055:      asset_type: item.asset_type,
9056:      internal_key: item.asset_type,
9072:        item.asset_type === 'product_csv'
9074:          : item.asset_type === 'product_photos'
9085:        item.asset_type === 'product_photos' && status === 'Needs Review'
9128:  const paths = getProjectAssetPaths(projectName);
9134:  const catalog = getAssetTypeCatalog();
9140:      asset_type: item.asset_type,
9155:  const paths = getProjectAssetPaths(projectName);
9161:  const sources = normalizeSourceRegistry(readJsonFile(paths.sourcesRegistryPath, {}));
9198:function getTargetFolderForAssetType(projectName, assetType) {
9200:  const catalog = getAssetTypeCatalog();
9201:  const canonicalType = getCanonicalAssetType(assetType);
9202:  const item = catalog.find(x => x.asset_type === canonicalType);
9233:  const paths = getProjectAssetPaths(projectName);
9244:  const { catalog_item, target_dir } = getTargetFolderForAssetType(projectName, assetType);
9256:    asset_type: assetType,
9265:  const paths = getProjectAssetPaths(projectName);
9271:  const assets = readJsonFile(paths.assetsRegistryPath, []);
9278:      const folderInfo = getTargetFolderForAssetType(projectName, asset.asset_type);
9288:      asset_type: asset.asset_type,
10222:      const registry = readJsonFile(paths.registryPath, []);
10245:        writeJsonFile(paths.registryPath, registry);
10343:  const projects = readJsonFile(registry.registryPath, []);
10356:  const projectData = readJsonFile(projectFile, {});
10367:  writeJsonFile(projectFile, updatedProject);
10385:  writeJsonFile(registry.registryPath, nextRegistry);
10450:  const existing = readJsonFile(paths.projectFilePath, {});
10470:  writeJsonFile(paths.projectFilePath, updated);
10473:  const projects = readJsonFile(registry.registryPath, []);
10498:  writeJsonFile(registry.registryPath, nextProjects);
10628:    asset_catalog: getAssetTypeCatalog()
10634:    asset_catalog: getAssetTypeCatalog()
10776:  writeJsonFile(registryPath, registry);
13681:  const products = readJsonFile(paths.productsPath, []);
13705:  writeJsonFile(paths.productsPath, products);
13711:  return readJsonFile(paths.productsPath, []);
13716:  const products = readJsonFile(paths.productsPath, []);
13906:  const products = readJsonFile(paths.productsPath, []);
13973:  const data = readJsonFile(filePath, {});
14266:  writeJsonFile(filePath, record);
14726:    ...readJsonFile(filePath, {}),
14746:    ...readJsonFile(filePath, {}),
14938:  writeJsonFile(recordFilePath, record);
14953:    const existingResult = readJsonFile(executionResultPath, {});
15010:  const existing = fs.existsSync(filePath) ? readJsonFile(filePath, {}) : {};
15267:    ...readJsonFile(filePath, {}),
15289:    return readJsonFile(filePath, {});
15325:  const requiredAssetTypes = new Set(getAssetTypeCatalog().filter(item => item.required).map(item => item.asset_type));
15559:    asset_catalog: getAssetTypeCatalog(),
15564:        asset_type: category.asset_type,
15848:      const tasks = readJsonFile(taskBoardPath, []);
16594:      const mediaQueue = readJsonFile(mediaQueuePath, []);
16646:      const mediaQueue = readJsonFile(getProjectBlogImageQueuePath(commandProject), []);
16675:  const mediaQueue = readJsonFile(mediaQueuePath, []);
16762:  const mediaQueue = readJsonFile(mediaQueuePath, []);
19142:  const brandProfile = readJsonFile(paths.brandProfilePath, {});
19143:  const registry = readJsonFile(paths.registryPath, []);
19234:    writeJsonFile(paths.registryPath, registry);
19235:    writeJsonFile(paths.brandProfilePath, brandProfile);
19273:  const registry = readJsonFile(paths.registryPath, []);
19318:  writeJsonFile(paths.registryPath, registry);
19343:  const registry = readJsonFile(paths.registryPath, []);
19377:  writeJsonFile(paths.registryPath, registry);
19393:  const registry = readJsonFile(paths.registryPath, []);
19563:    const data = readJsonFile(packagePath, {});
19657:    const data = readJsonFile(latestPath, {});
19912:    const result = readJsonFile(latestPath, {});
20342:    const products = readJsonFile(paths.productsPath, []);
20359:    writeJsonFile(paths.productsPath, products);
20386:    const products = readJsonFile(paths.productsPath, []);
20401:    writeJsonFile(paths.productsPath, products);
20427:    const products = readJsonFile(paths.productsPath, []);
20441:    writeJsonFile(paths.productsPath, products);
20467:    const products = readJsonFile(paths.productsPath, []);
20477:    writeJsonFile(paths.productsPath, products);
20530:    const products = readJsonFile(paths.productsPath, []);
20544:    writeJsonFile(paths.productsPath, products);
20570:    const products = readJsonFile(paths.productsPath, []);
20580:    writeJsonFile(paths.productsPath, products);
20633:    const products = readJsonFile(paths.productsPath, []);
20641:    writeJsonFile(paths.productsPath, products);
20661:    const products = readJsonFile(paths.productsPath, []);
20671:    writeJsonFile(paths.productsPath, products);
20892:    const data = readJsonFile(filePath, {});
20917:    const data = readJsonFile(filePath, {});
21403:if (command === '/list_asset_type_catalog') {
21405:    const result = getAssetTypeCatalog();

## Catalog and canonical helper excerpt
    control_center: reviewProjectIntegrationControlCenter(projectName)
  };
}

function reviewProjectMissingAssets(projectName) {
  const paths = getProjectAssetPaths(projectName);

  if (!fs.existsSync(paths.projectFilePath)) {
    throw new Error('Project not found');
  }

  const assets = readJsonFile(paths.assetsRegistryPath, []);
  const categoryReadiness = buildProjectAssetCategoryReadiness(projectName, assets);
  const required = getAssetTypeCatalog()
    .filter(item => item.required)
    .map(item => item.asset_type);
  const assetTypes = assets
    .map(item => getCanonicalAssetType(item.asset_type) || String(item.asset_type || '').trim().toLowerCase())
    .filter(Boolean);
  const missing = categoryReadiness.categories
    .filter(item => item.required && item.status === 'Missing')
    .map(item => item.asset_type);
  const blockers = categoryReadiness.categories
    .filter(item => item.required && ['Missing', 'Needs Review'].includes(item.status))
    .map(item => item.asset_type);

  return {
    project: projectName,
    reviewed_at: new Date().toISOString(),
    required_asset_types: required,
    registered_asset_types: [...new Set(assetTypes)].sort(),
    missing,
    blockers,
    category_readiness: categoryReadiness,
    status: blockers.length ? 'asset_blockers' : 'assets_ready'
  };
}
function getAssetTypeCatalog() {
  return [
    {
      asset_type: 'logo',
      label: 'Logo / Logo',
      purpose: 'brand_foundation',
      purpose_label: 'Brand foundation',
      required: true,
      allowed_extensions: ['.png', '.svg', '.jpg', '.jpeg', '.webp'],
      target_folder: 'brand-assets',
      aliases: [],
      description: 'Official brand logo.',
      guidance: {
        what_to_upload: 'Primary logo files, transparent logo variants, and approved lockups.',
        why_it_matters: 'Keeps setup, media creation, publishing previews, and AI output visually tied to the right brand.',
        used_in: ['Setup', 'Media Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'brand_guideline',
      label: 'Brand Guideline / Markenrichtlinie',
      purpose: 'brand_foundation',
      purpose_label: 'Brand foundation',
      required: true,
      allowed_extensions: ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.md', '.txt'],
      target_folder: 'brand-assets',
      aliases: ['brand_guidelines', 'brand_guide', 'brand_reference_doc'],
      description: 'Brand identity, voice, visual rules, and usage guidance.',
      guidance: {
        what_to_upload: 'Brand book, tone guide, design system notes, claim rules, and visual do/dont guidance.',
        why_it_matters: 'Gives Setup, Content Studio, Media Studio, and AI Command the guardrails they need.',
        used_in: ['Setup', 'Campaign Studio', 'Content Studio', 'Media Studio', 'AI Command']
      }
    },
    {
      asset_type: 'product_csv',
      label: 'Product Data / Produktdaten',
      purpose: 'product_offers',
      purpose_label: 'Product and offers',
      required: true,
      allowed_extensions: ['.csv', '.xlsx', '.xls', '.json'],
      target_folder: 'products',
      aliases: ['product_data', 'product_feed', 'product_sheet'],
      description: 'Structured product data for planning, content, and campaign packaging.',
      guidance: {
        what_to_upload: 'SKU list, product names, descriptions, variants, ingredients, usage, and product URLs.',
        why_it_matters: 'Campaign Studio, Content Studio, Publishing, and AI Command need accurate product facts.',
        used_in: ['Campaign Studio', 'Content Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'pricing_doc',
      label: 'Pricing & Offers / Preise & Angebote',
      purpose: 'product_offers',
      purpose_label: 'Product and offers',
      required: true,
      allowed_extensions: ['.pdf', '.doc', '.docx', '.csv', '.xlsx', '.xls', '.txt', '.md'],
      target_folder: 'content',
      aliases: ['pricing', 'price_list', 'offers', 'offer_doc'],
      description: 'Pricing, bundles, discounts, and commercial offer rules.',
      guidance: {
        what_to_upload: 'Price lists, offer sheets, bundles, campaign discounts, coupons, and margin guardrails.',
        why_it_matters: 'Prevents Campaign Studio, Publishing, and AI Command from inventing prices or offers.',
        used_in: ['Campaign Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'legal_doc',
      label: 'Legal Documents / Rechtliche Dokumente',
      purpose: 'proof_compliance',
      purpose_label: 'Proof and compliance',
      required: true,
      allowed_extensions: ['.pdf', '.doc', '.docx', '.txt', '.md'],
      target_folder: 'content',
      aliases: ['legal', 'compliance_doc', 'terms_doc'],
      description: 'Policies, legal terms, disclaimers, and claim restrictions.',
      guidance: {
        what_to_upload: 'Terms, privacy policy, disclaimers, compliance notes, claim restrictions, and regulated copy rules.',
        why_it_matters: 'Publishing and AI Command need legal context before release or generated claims.',
        used_in: ['Content Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'product_photos',
      label: 'Product Photos / Produktfotos',
      purpose: 'visual_media',
      purpose_label: 'Visual media',
      required: true,
      allowed_extensions: ['.png', '.jpg', '.jpeg', '.webp', '.avif'],
      target_folder: 'products',
      aliases: ['product_image', 'product_images', 'product_photo', 'product'],
      description: 'Approved product photography for content, media, ads, and publishing.',
      guidance: {
        what_to_upload: 'Clean product packshots, lifestyle product photos, before/after images where allowed, and hero crops.',
        why_it_matters: 'Content Studio, Media Studio, Campaign Studio, and Publishing need real product visuals.',
        used_in: ['Campaign Studio', 'Content Studio', 'Media Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'product_videos',
      label: 'Product Videos / Produktvideos',
      purpose: 'visual_media',
      purpose_label: 'Visual media',
      required: true,
      allowed_extensions: ['.mp4', '.mov', '.webm', '.m4v'],
      target_folder: 'products',
      aliases: ['product_video', 'product_video_assets', 'video'],
      description: 'Approved product videos, demos, UGC clips, and cutdowns.',
      guidance: {
        what_to_upload: 'Product demos, UGC clips, reels, explainers, usage videos, and source cutdowns.',
        why_it_matters: 'Media Studio, Content Studio, Campaign Studio, and Publishing use video as creative source material.',
        used_in: ['Campaign Studio', 'Content Studio', 'Media Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'social_assets',
      label: 'Social Assets / Social-Media-Assets',
      purpose: 'campaign_social',
      purpose_label: 'Campaign and social',
      required: true,
      allowed_extensions: ['.png', '.jpg', '.jpeg', '.webp', '.mp4', '.mov', '.pdf', '.psd', '.ai', '.fig'],
      target_folder: 'campaigns',
      aliases: ['social_asset', 'social_creatives', 'organic_social_assets'],
      description: 'Organic social creative, post visuals, reels, stories, and channel-ready source assets.',
      guidance: {
        what_to_upload: 'Organic post images, story frames, reels, thumbnails, channel templates, and captions references.',
        why_it_matters: 'Content Studio, Media Studio, Campaign Studio, and Publishing can reuse proven channel assets.',
        used_in: ['Campaign Studio', 'Content Studio', 'Media Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'campaign_assets',
      label: 'Campaign Assets / Kampagnenmaterial',
      purpose: 'campaign_social',
      purpose_label: 'Campaign and social',
      required: true,
      allowed_extensions: ['.png', '.jpg', '.jpeg', '.webp', '.mp4', '.mov', '.pdf', '.doc', '.docx', '.html', '.zip'],
      target_folder: 'campaigns',
      aliases: ['campaign_asset', 'creative_assets', 'ad_assets'],
      description: 'Campaign-specific creative, copy, export packs, banners, and channel packages.',
      guidance: {
        what_to_upload: 'Campaign banners, ad creative, landing-page assets, email hero files, export packs, and wave-specific files.',
        why_it_matters: 'Campaign Studio and Publishing need a reusable package for each campaign or wave.',
        used_in: ['Campaign Studio', 'Content Studio', 'Media Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'packaging_images',
      label: 'Packaging Images / Verpackungsbilder',
      purpose: 'visual_media',
      purpose_label: 'Visual media',
      required: true,
      allowed_extensions: ['.png', '.jpg', '.jpeg', '.webp', '.pdf'],
      target_folder: 'products',
      aliases: ['packaging_doc', 'packaging_image', 'packaging', 'label_image'],
      description: 'Packaging photos, labels, inserts, and box or bottle references.',
      guidance: {
        what_to_upload: 'Packaging photos, label artwork, inserts, box shots, bottle/jar details, and compliance label references.',
        why_it_matters: 'Media Studio and Publishing need packaging truth for product visuals and compliance checks.',
        used_in: ['Campaign Studio', 'Media Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'testimonials_reviews',
      label: 'Testimonials & Reviews / Kundenstimmen & Bewertungen',
      purpose: 'proof_compliance',
      purpose_label: 'Proof and compliance',
      required: true,
      allowed_extensions: ['.pdf', '.doc', '.docx', '.txt', '.md', '.csv', '.xlsx', '.png', '.jpg', '.jpeg'],
      target_folder: 'content',
      aliases: ['testimonial', 'testimonials', 'review', 'reviews'],
      description: 'Customer proof, reviews, testimonial exports, and approved quotes.',
      guidance: {
        what_to_upload: 'Review exports, testimonial docs, approved screenshots, quote permissions, and proof notes.',
        why_it_matters: 'Content Studio, Campaign Studio, Publishing, and AI Command need trusted proof points.',
        used_in: ['Campaign Studio', 'Content Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'certificates',
      label: 'Certificates / Zertifikate',
      purpose: 'proof_compliance',
      purpose_label: 'Proof and compliance',
      required: true,
      allowed_extensions: ['.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx'],
      target_folder: 'content',
      aliases: ['certificate', 'certification', 'certifications', 'cert'],
      description: 'Certifications, lab reports, awards, and official proof documents.',
      guidance: {
        what_to_upload: 'Certificates, compliance proof, awards, lab reports, or official authorization documents.',
        why_it_matters: 'Publishing and AI Command can use only approved proof when making trust or compliance claims.',
        used_in: ['Content Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'partner_docs',
      label: 'Partner Documents / Partnerdokumente',
      purpose: 'partnerships',
      purpose_label: 'Partnerships',
      required: true,
      allowed_extensions: ['.pdf', '.doc', '.docx', '.txt', '.md', '.csv', '.xlsx'],
      target_folder: 'content',
      aliases: ['partner_doc', 'partner_document', 'supplier_doc', 'partner_material'],
      description: 'Partner, supplier, distributor, marketplace, and collaboration documents.',
      guidance: {
        what_to_upload: 'Partner briefs, supplier docs, marketplace requirements, distributor notes, and collaboration agreements.',
        why_it_matters: 'Campaign Studio, Publishing, and AI Command need partner constraints before reuse or release.',
        used_in: ['Campaign Studio', 'Publishing', 'AI Command']
      }
    }
  ];
}

function getCanonicalAssetType(assetType) {
  const normalized = String(assetType || '').trim().toLowerCase();
  if (!normalized) return '';

  for (const item of getAssetTypeCatalog()) {
    const values = [item.asset_type, ...(item.aliases || [])].map(value => String(value || '').trim().toLowerCase());
    if (values.includes(normalized)) {
      return item.asset_type;
    }
  }

  return '';
}

function getAssetCategoryDefinition(assetType) {
  const canonicalType = getCanonicalAssetType(assetType);
  return getAssetTypeCatalog().find(item => item.asset_type === canonicalType) || null;
}

function getAssetCategoryStatus(asset, projectName) {
  const record = asset || {};
  const explicitStatus = String(
    record.readiness_status ||
    record.review_status ||
    record.approval_status ||
    record.status ||
    ''
  ).trim().toLowerCase();

  if (record.approved === true || ['approved', 'ready_approved'].includes(explicitStatus)) {
    return 'Approved';
  }

  const filePath = String(record.file_path || record.local_path || '').trim();
  const exists = filePath ? fs.existsSync(filePath) : record.exists === true;
  if (!exists || record.exists === false) {
    return 'Needs Review';
  }

  try {
    const folderInfo = getTargetFolderForAssetType(projectName, record.asset_type);
    if (filePath && !filePath.startsWith(folderInfo.target_dir)) {
      return 'Needs Review';
    }
  } catch (_) {
    return 'Needs Review';
  }

  if (['needs_review', 'review', 'blocked', 'rejected'].includes(explicitStatus)) {
    return 'Needs Review';
  }

  return 'Uploaded';
}

function listFilesByExtensions(rootDir, extensions = [], recursive = true) {
