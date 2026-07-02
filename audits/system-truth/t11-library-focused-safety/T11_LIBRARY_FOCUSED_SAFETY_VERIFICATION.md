# T11 — Library Focused Safety Verification

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/library.js

## Purpose
T10 showed Library has high signal density. T11 focuses only on the concrete safety surfaces that can justify a patch:
1. Preview/Object URL safety
2. fallbackMarkup/innerHTML source safety
3. File picker/drop validation
4. Object URL cleanup lifecycle

## Focused Findings
| Area | First Line | Verdict |
|---|---:|---|
| buildPreviewUrl | 311 | Safety evidence present; verify exact source boundaries |
| getAssetPreviewUrl | 341 | Safety evidence present; verify exact source boundaries |
| requiresProtectedMediaFetch | 333 | Safety evidence present; verify exact source boundaries |
| fetchProtectedMediaBlob | 438 | P1: object URL lifecycle cleanup needs confirmation |
| getProtectedAssetObjectUrl | 404 | P1: object URL lifecycle cleanup needs confirmation |
| open/download asset action | 406 | P1: object URL lifecycle cleanup needs confirmation |
| fallbackMarkup | 1446 | P1: object URL lifecycle cleanup needs confirmation |
| hydrateProtectedAssetPreview | 1351 | Safety evidence present; verify exact source boundaries |
| upload handler | 46 | Safety evidence present; verify exact source boundaries |
| object URL cleanup | 366 | Safety evidence present; verify exact source boundaries |

## Detailed Evidence

### buildPreviewUrl

```js
  266:   if (!id) return "-";
  267:   if (id.length <= 20) return id;
  268:   return `${id.slice(0, 10)}...${id.slice(-8)}`;
  269: }
  270: 
  271: function truncateMiddle(value = "", maxLength = 44) {
  272:   const text = asString(value).trim();
  273:   if (!text || text.length <= maxLength) return text || "-";
  274:   const keep = Math.max(6, Math.floor((maxLength - 3) / 2));
  275:   return `${text.slice(0, keep)}...${text.slice(-keep)}`;
  276: }
  277: 
  278: function formatCount(value) {
  279:   const parsed = Number(value);
  280:   if (!Number.isFinite(parsed)) return "0";
  281:   return String(Math.max(0, Math.round(parsed)));
  282: }
  283: 
  284: function normalizeLibrarySelectionIds(value) {
  285:   return [...new Set(asArray(value).map((item) => asString(item).trim()).filter(Boolean))];
  286: }
  287: 
  288: function formatDate(value) {
  289:   if (!value) return "-";
  290:   const date = new Date(value);
  291:   if (Number.isNaN(date.getTime())) return "-";
  292:   return date.toLocaleString();
  293: }
  294: 
  295: function isImageExtension(extension = "") {
  296:   return ["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"].includes(extension);
  297: }
  298: 
  299: function isVideoExtension(extension = "") {
  300:   return ["mp4", "mov", "webm", "m4v"].includes(extension);
  301: }
  302: 
  303: function isOfficePreviewExtension(extension = "") {
  304:   return ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(asString(extension).toLowerCase());
  305: }
  306: 
  307: function isTextPreviewExtension(extension = "") {
  308:   return ["txt", "md", "csv", "json"].includes(asString(extension).toLowerCase());
  309: }
  310: 
  311: function buildPreviewUrl(projectName, asset) {
  312:   if (!projectName) return "";
  313:   const fullPath = asString(asset.file_path || asset.local_path || asset.path || "").trim();
  314:   const fileName = basename(fullPath || asset.filename || asset.file_name || asset.name || "");
  315:   const assetId = asString(asset.asset_id || asset.assetId || asset.id || "").trim();
  316:   const assetType = asString(asset.asset_type || asset.type || "asset").trim().toLowerCase();
  317:   if (!fileName || !assetType) return "";
  318: 
  319:   const base = `/media/file/${encodeURIComponent(projectName)}/${encodeURIComponent(assetType)}/${encodeURIComponent(fileName)}`;
  320:   const params = [];
  321: 
  322:   if (fullPath) {
  323:     params.push(`path=${encodeURIComponent(fullPath)}`);
  324:   }
  325: 
  326:   if (assetId) {
  327:     params.push(`assetId=${encodeURIComponent(assetId)}`);
  328:   }
  329: 
  330:   return params.length ? `${base}?${params.join("&")}` : base;
  331: }
  332: 
  333: function requiresProtectedMediaFetch(fileUrl = "") {
  334:   const value = asString(fileUrl).trim();
  335:   if (!value) return false;
  336:   if (/^blob:/i.test(value) || /^data:/i.test(value)) return false;
  337:   if (/^https?:\/\//i.test(value) && !value.includes("/media/file/")) return false;
  338:   return value.includes("/media/file/");
  339: }
  340: 
  341: function getAssetPreviewUrl(asset) {
  342:   if (!asset) return "";
  343:   return asString(
  344:     asset.preview_url
  345:     || asset.image_url
  346:     || asset.video_url
  347:     || asset.audio_url
  348:     || ""
  349:   ).trim();
  350: }
  351: 
  352: function buildProtectedCacheKey(projectName, asset) {
  353:   const resolvedAssetId = asString(asset.asset_id || asset.assetId || asset.id || "").trim();
  354:   const resolvedFilePath = asString(asset.file_path || asset.local_path || asset.path || "").trim();
  355:   return [
  356:     projectKey(projectName),
```

### getAssetPreviewUrl

```js
  296:   return ["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"].includes(extension);
  297: }
  298: 
  299: function isVideoExtension(extension = "") {
  300:   return ["mp4", "mov", "webm", "m4v"].includes(extension);
  301: }
  302: 
  303: function isOfficePreviewExtension(extension = "") {
  304:   return ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(asString(extension).toLowerCase());
  305: }
  306: 
  307: function isTextPreviewExtension(extension = "") {
  308:   return ["txt", "md", "csv", "json"].includes(asString(extension).toLowerCase());
  309: }
  310: 
  311: function buildPreviewUrl(projectName, asset) {
  312:   if (!projectName) return "";
  313:   const fullPath = asString(asset.file_path || asset.local_path || asset.path || "").trim();
  314:   const fileName = basename(fullPath || asset.filename || asset.file_name || asset.name || "");
  315:   const assetId = asString(asset.asset_id || asset.assetId || asset.id || "").trim();
  316:   const assetType = asString(asset.asset_type || asset.type || "asset").trim().toLowerCase();
  317:   if (!fileName || !assetType) return "";
  318: 
  319:   const base = `/media/file/${encodeURIComponent(projectName)}/${encodeURIComponent(assetType)}/${encodeURIComponent(fileName)}`;
  320:   const params = [];
  321: 
  322:   if (fullPath) {
  323:     params.push(`path=${encodeURIComponent(fullPath)}`);
  324:   }
  325: 
  326:   if (assetId) {
  327:     params.push(`assetId=${encodeURIComponent(assetId)}`);
  328:   }
  329: 
  330:   return params.length ? `${base}?${params.join("&")}` : base;
  331: }
  332: 
  333: function requiresProtectedMediaFetch(fileUrl = "") {
  334:   const value = asString(fileUrl).trim();
  335:   if (!value) return false;
  336:   if (/^blob:/i.test(value) || /^data:/i.test(value)) return false;
  337:   if (/^https?:\/\//i.test(value) && !value.includes("/media/file/")) return false;
  338:   return value.includes("/media/file/");
  339: }
  340: 
  341: function getAssetPreviewUrl(asset) {
  342:   if (!asset) return "";
  343:   return asString(
  344:     asset.preview_url
  345:     || asset.image_url
  346:     || asset.video_url
  347:     || asset.audio_url
  348:     || ""
  349:   ).trim();
  350: }
  351: 
  352: function buildProtectedCacheKey(projectName, asset) {
  353:   const resolvedAssetId = asString(asset.asset_id || asset.assetId || asset.id || "").trim();
  354:   const resolvedFilePath = asString(asset.file_path || asset.local_path || asset.path || "").trim();
  355:   return [
  356:     projectKey(projectName),
  357:     resolvedAssetId || "no-asset-id",
  358:     resolvedFilePath || "no-file-path",
  359:     getAssetPreviewUrl(asset)
  360:   ].join("::");
  361: }
  362: 
  363: function revokeLibraryProtectedUrl(key) {
  364:   const entry = libraryProtectedUrlCache.get(key);
  365:   if (entry?.objectUrl) {
  366:     URL.revokeObjectURL(entry.objectUrl);
  367:   }
  368:   libraryProtectedUrlCache.delete(key);
  369: }
  370: 
  371: function runNextLibraryThumbLoad() {
  372:   if (libraryThumbLoadsInFlight >= MAX_CONCURRENT_LIBRARY_THUMB_LOADS) {
  373:     return;
  374:   }
  375: 
  376:   const nextJob = libraryThumbLoadQueue.shift();
  377:   if (!nextJob) {
  378:     return;
  379:   }
  380: 
  381:   libraryThumbLoadsInFlight += 1;
  382:   Promise.resolve()
  383:     .then(nextJob)
  384:     .finally(() => {
  385:       libraryThumbLoadsInFlight = Math.max(0, libraryThumbLoadsInFlight - 1);
  386:       runNextLibraryThumbLoad();
```

### requiresProtectedMediaFetch

```js
  288: function formatDate(value) {
  289:   if (!value) return "-";
  290:   const date = new Date(value);
  291:   if (Number.isNaN(date.getTime())) return "-";
  292:   return date.toLocaleString();
  293: }
  294: 
  295: function isImageExtension(extension = "") {
  296:   return ["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"].includes(extension);
  297: }
  298: 
  299: function isVideoExtension(extension = "") {
  300:   return ["mp4", "mov", "webm", "m4v"].includes(extension);
  301: }
  302: 
  303: function isOfficePreviewExtension(extension = "") {
  304:   return ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(asString(extension).toLowerCase());
  305: }
  306: 
  307: function isTextPreviewExtension(extension = "") {
  308:   return ["txt", "md", "csv", "json"].includes(asString(extension).toLowerCase());
  309: }
  310: 
  311: function buildPreviewUrl(projectName, asset) {
  312:   if (!projectName) return "";
  313:   const fullPath = asString(asset.file_path || asset.local_path || asset.path || "").trim();
  314:   const fileName = basename(fullPath || asset.filename || asset.file_name || asset.name || "");
  315:   const assetId = asString(asset.asset_id || asset.assetId || asset.id || "").trim();
  316:   const assetType = asString(asset.asset_type || asset.type || "asset").trim().toLowerCase();
  317:   if (!fileName || !assetType) return "";
  318: 
  319:   const base = `/media/file/${encodeURIComponent(projectName)}/${encodeURIComponent(assetType)}/${encodeURIComponent(fileName)}`;
  320:   const params = [];
  321: 
  322:   if (fullPath) {
  323:     params.push(`path=${encodeURIComponent(fullPath)}`);
  324:   }
  325: 
  326:   if (assetId) {
  327:     params.push(`assetId=${encodeURIComponent(assetId)}`);
  328:   }
  329: 
  330:   return params.length ? `${base}?${params.join("&")}` : base;
  331: }
  332: 
  333: function requiresProtectedMediaFetch(fileUrl = "") {
  334:   const value = asString(fileUrl).trim();
  335:   if (!value) return false;
  336:   if (/^blob:/i.test(value) || /^data:/i.test(value)) return false;
  337:   if (/^https?:\/\//i.test(value) && !value.includes("/media/file/")) return false;
  338:   return value.includes("/media/file/");
  339: }
  340: 
  341: function getAssetPreviewUrl(asset) {
  342:   if (!asset) return "";
  343:   return asString(
  344:     asset.preview_url
  345:     || asset.image_url
  346:     || asset.video_url
  347:     || asset.audio_url
  348:     || ""
  349:   ).trim();
  350: }
  351: 
  352: function buildProtectedCacheKey(projectName, asset) {
  353:   const resolvedAssetId = asString(asset.asset_id || asset.assetId || asset.id || "").trim();
  354:   const resolvedFilePath = asString(asset.file_path || asset.local_path || asset.path || "").trim();
  355:   return [
  356:     projectKey(projectName),
  357:     resolvedAssetId || "no-asset-id",
  358:     resolvedFilePath || "no-file-path",
  359:     getAssetPreviewUrl(asset)
  360:   ].join("::");
  361: }
  362: 
  363: function revokeLibraryProtectedUrl(key) {
  364:   const entry = libraryProtectedUrlCache.get(key);
  365:   if (entry?.objectUrl) {
  366:     URL.revokeObjectURL(entry.objectUrl);
  367:   }
  368:   libraryProtectedUrlCache.delete(key);
  369: }
  370: 
  371: function runNextLibraryThumbLoad() {
  372:   if (libraryThumbLoadsInFlight >= MAX_CONCURRENT_LIBRARY_THUMB_LOADS) {
  373:     return;
  374:   }
  375: 
  376:   const nextJob = libraryThumbLoadQueue.shift();
  377:   if (!nextJob) {
  378:     return;
```

### fetchProtectedMediaBlob

```js
  393:       try {
  394:         resolve(await job());
  395:       } catch (error) {
  396:         reject(error);
  397:       }
  398:     });
  399: 
  400:     runNextLibraryThumbLoad();
  401:   });
  402: }
  403: 
  404: async function getProtectedAssetObjectUrl(projectName, asset, options = {}) {
  405:   const previewUrl = getAssetPreviewUrl(asset);
  406:   const fileName = asString(asset?.filename || asset?.name || basename(previewUrl) || "download");
  407: 
  408:   if (!requiresProtectedMediaFetch(previewUrl)) {
  409:     return {
  410:       objectUrl: previewUrl,
  411:       contentType: "",
  412:       fileName,
  413:       fromProtectedFetch: false
  414:     };
  415:   }
  416: 
  417:   const cacheKey = buildProtectedCacheKey(projectName, asset);
  418:   const cached = libraryProtectedUrlCache.get(cacheKey);
  419:   if (cached?.objectUrl && !options.force) {
  420:     return {
  421:       objectUrl: cached.objectUrl,
  422:       contentType: cached.contentType,
  423:       fileName,
  424:       fromProtectedFetch: true
  425:     };
  426:   }
  427: 
  428:   if (options.force) {
  429:     revokeLibraryProtectedUrl(cacheKey);
  430:   }
  431: 
  432:   const inFlight = libraryProtectedUrlPromiseCache.get(cacheKey);
  433:   if (inFlight && !options.force) {
  434:     return inFlight;
  435:   }
  436: 
  437:   const loadPromise = (async () => {
  438:     const { blob, contentType } = await fetchProtectedMediaBlob(previewUrl, Number(options.timeoutMs) || undefined);
  439:     const objectUrl = URL.createObjectURL(blob);
  440:     libraryProtectedUrlCache.set(cacheKey, {
  441:       objectUrl,
  442:       contentType,
  443:       createdAt: Date.now()
  444:     });
  445: 
  446:     return {
  447:       objectUrl,
  448:       contentType,
  449:       fileName,
  450:       fromProtectedFetch: true
  451:     };
  452:   })();
  453: 
  454:   libraryProtectedUrlPromiseCache.set(cacheKey, loadPromise);
  455: 
  456:   try {
  457:     return await loadPromise;
  458:   } finally {
  459:     if (libraryProtectedUrlPromiseCache.get(cacheKey) === loadPromise) {
  460:       libraryProtectedUrlPromiseCache.delete(cacheKey);
  461:     }
  462:   }
  463: }
  464: 
  465: async function openLibraryAsset(projectName, asset) {
  466:   if (!asset) {
  467:     throw new Error("Select an asset before opening.");
  468:   }
  469: 
  470:   const resolved = await getProtectedAssetObjectUrl(projectName, asset);
  471:   const objectUrl = resolved.objectUrl;
  472:   const contentType = asString(resolved.contentType);
  473:   const safeFilename = asString(resolved.fileName || "download");
  474: 
  475:   if (
  476:     contentType.startsWith("image/") ||
  477:     contentType.startsWith("video/") ||
  478:     contentType.includes("pdf") ||
  479:     /\.(png|jpg|jpeg|webp|gif|svg|avif|mp4|mov|webm|m4v|pdf)$/i.test(safeFilename)
  480:   ) {
  481:     window.open(objectUrl, "_blank", "noopener,noreferrer");
  482:    
  483:     return;
```

### getProtectedAssetObjectUrl

```js
  359:     getAssetPreviewUrl(asset)
  360:   ].join("::");
  361: }
  362: 
  363: function revokeLibraryProtectedUrl(key) {
  364:   const entry = libraryProtectedUrlCache.get(key);
  365:   if (entry?.objectUrl) {
  366:     URL.revokeObjectURL(entry.objectUrl);
  367:   }
  368:   libraryProtectedUrlCache.delete(key);
  369: }
  370: 
  371: function runNextLibraryThumbLoad() {
  372:   if (libraryThumbLoadsInFlight >= MAX_CONCURRENT_LIBRARY_THUMB_LOADS) {
  373:     return;
  374:   }
  375: 
  376:   const nextJob = libraryThumbLoadQueue.shift();
  377:   if (!nextJob) {
  378:     return;
  379:   }
  380: 
  381:   libraryThumbLoadsInFlight += 1;
  382:   Promise.resolve()
  383:     .then(nextJob)
  384:     .finally(() => {
  385:       libraryThumbLoadsInFlight = Math.max(0, libraryThumbLoadsInFlight - 1);
  386:       runNextLibraryThumbLoad();
  387:     });
  388: }
  389: 
  390: function enqueueLibraryThumbLoad(job) {
  391:   return new Promise((resolve, reject) => {
  392:     libraryThumbLoadQueue.push(async () => {
  393:       try {
  394:         resolve(await job());
  395:       } catch (error) {
  396:         reject(error);
  397:       }
  398:     });
  399: 
  400:     runNextLibraryThumbLoad();
  401:   });
  402: }
  403: 
  404: async function getProtectedAssetObjectUrl(projectName, asset, options = {}) {
  405:   const previewUrl = getAssetPreviewUrl(asset);
  406:   const fileName = asString(asset?.filename || asset?.name || basename(previewUrl) || "download");
  407: 
  408:   if (!requiresProtectedMediaFetch(previewUrl)) {
  409:     return {
  410:       objectUrl: previewUrl,
  411:       contentType: "",
  412:       fileName,
  413:       fromProtectedFetch: false
  414:     };
  415:   }
  416: 
  417:   const cacheKey = buildProtectedCacheKey(projectName, asset);
  418:   const cached = libraryProtectedUrlCache.get(cacheKey);
  419:   if (cached?.objectUrl && !options.force) {
  420:     return {
  421:       objectUrl: cached.objectUrl,
  422:       contentType: cached.contentType,
  423:       fileName,
  424:       fromProtectedFetch: true
  425:     };
  426:   }
  427: 
  428:   if (options.force) {
  429:     revokeLibraryProtectedUrl(cacheKey);
  430:   }
  431: 
  432:   const inFlight = libraryProtectedUrlPromiseCache.get(cacheKey);
  433:   if (inFlight && !options.force) {
  434:     return inFlight;
  435:   }
  436: 
  437:   const loadPromise = (async () => {
  438:     const { blob, contentType } = await fetchProtectedMediaBlob(previewUrl, Number(options.timeoutMs) || undefined);
  439:     const objectUrl = URL.createObjectURL(blob);
  440:     libraryProtectedUrlCache.set(cacheKey, {
  441:       objectUrl,
  442:       contentType,
  443:       createdAt: Date.now()
  444:     });
  445: 
  446:     return {
  447:       objectUrl,
  448:       contentType,
  449:       fileName,
```

### open/download asset action

```js
  361: }
  362: 
  363: function revokeLibraryProtectedUrl(key) {
  364:   const entry = libraryProtectedUrlCache.get(key);
  365:   if (entry?.objectUrl) {
  366:     URL.revokeObjectURL(entry.objectUrl);
  367:   }
  368:   libraryProtectedUrlCache.delete(key);
  369: }
  370: 
  371: function runNextLibraryThumbLoad() {
  372:   if (libraryThumbLoadsInFlight >= MAX_CONCURRENT_LIBRARY_THUMB_LOADS) {
  373:     return;
  374:   }
  375: 
  376:   const nextJob = libraryThumbLoadQueue.shift();
  377:   if (!nextJob) {
  378:     return;
  379:   }
  380: 
  381:   libraryThumbLoadsInFlight += 1;
  382:   Promise.resolve()
  383:     .then(nextJob)
  384:     .finally(() => {
  385:       libraryThumbLoadsInFlight = Math.max(0, libraryThumbLoadsInFlight - 1);
  386:       runNextLibraryThumbLoad();
  387:     });
  388: }
  389: 
  390: function enqueueLibraryThumbLoad(job) {
  391:   return new Promise((resolve, reject) => {
  392:     libraryThumbLoadQueue.push(async () => {
  393:       try {
  394:         resolve(await job());
  395:       } catch (error) {
  396:         reject(error);
  397:       }
  398:     });
  399: 
  400:     runNextLibraryThumbLoad();
  401:   });
  402: }
  403: 
  404: async function getProtectedAssetObjectUrl(projectName, asset, options = {}) {
  405:   const previewUrl = getAssetPreviewUrl(asset);
  406:   const fileName = asString(asset?.filename || asset?.name || basename(previewUrl) || "download");
  407: 
  408:   if (!requiresProtectedMediaFetch(previewUrl)) {
  409:     return {
  410:       objectUrl: previewUrl,
  411:       contentType: "",
  412:       fileName,
  413:       fromProtectedFetch: false
  414:     };
  415:   }
  416: 
  417:   const cacheKey = buildProtectedCacheKey(projectName, asset);
  418:   const cached = libraryProtectedUrlCache.get(cacheKey);
  419:   if (cached?.objectUrl && !options.force) {
  420:     return {
  421:       objectUrl: cached.objectUrl,
  422:       contentType: cached.contentType,
  423:       fileName,
  424:       fromProtectedFetch: true
  425:     };
  426:   }
  427: 
  428:   if (options.force) {
  429:     revokeLibraryProtectedUrl(cacheKey);
  430:   }
  431: 
  432:   const inFlight = libraryProtectedUrlPromiseCache.get(cacheKey);
  433:   if (inFlight && !options.force) {
  434:     return inFlight;
  435:   }
  436: 
  437:   const loadPromise = (async () => {
  438:     const { blob, contentType } = await fetchProtectedMediaBlob(previewUrl, Number(options.timeoutMs) || undefined);
  439:     const objectUrl = URL.createObjectURL(blob);
  440:     libraryProtectedUrlCache.set(cacheKey, {
  441:       objectUrl,
  442:       contentType,
  443:       createdAt: Date.now()
  444:     });
  445: 
  446:     return {
  447:       objectUrl,
  448:       contentType,
  449:       fileName,
  450:       fromProtectedFetch: true
  451:     };
```

### fallbackMarkup

```js
 1401:     });
 1402:     if (!previewNode.isConnected) {
 1403:       return;
 1404:     }
 1405: 
 1406:     if (asset.is_image) {
 1407:       previewNode.innerHTML = `<img src="${escapeHtml(resolved.objectUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image">`;
 1408:       return;
 1409:     }
 1410: 
 1411:     if (asset.is_video) {
 1412:       previewNode.innerHTML = `<video class="library-preview-video" controls src="${escapeHtml(resolved.objectUrl)}"></video>`;
 1413:       return;
 1414:     }
 1415: 
 1416:     if (getPreviewExtensionForAsset(asset) === "pdf") {
 1417:       previewNode.outerHTML = `
 1418:         <div class="library-pdf-preview">
 1419:           <iframe src="${escapeHtml(resolved.objectUrl)}" title="${escapeHtml(asset.name || "PDF preview")}"></iframe>
 1420:         </div>
 1421:       `;
 1422:     }
 1423:   } catch (error) {
 1424:     if (!previewNode.isConnected) {
 1425:       return;
 1426:     }
 1427: 
 1428:     const message = error instanceof AccessKeyError
 1429:       ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
 1430:       : `Preview unavailable: ${error.message || "Could not load this file."}`;
 1431: 
 1432:     previewNode.innerHTML = `<div class="library-preview-fallback">${escapeHtml(message)}</div>`;
 1433: 
 1434:     if (!(error instanceof AccessKeyError)) {
 1435:       showError?.(message);
 1436:     }
 1437:   }
 1438: }
 1439: 
 1440: async function hydrateProtectedImageNode({
 1441:   node,
 1442:   projectName,
 1443:   asset,
 1444:   className,
 1445:   alt,
 1446:   fallbackMarkup,
 1447:   showError
 1448: }) {
 1449:   if (!node || !asset) return;
 1450: 
 1451:   try {
 1452:     const resolved = await enqueueLibraryThumbLoad(() => getProtectedAssetObjectUrl(projectName, asset, {
 1453:       timeoutMs: 30000
 1454:     }));
 1455:     if (!node.isConnected) return;
 1456: 
 1457:     const image = document.createElement("img");
 1458:     image.className = className;
 1459:     image.alt = alt || asset.name || "Asset preview";
 1460:     image.src = resolved.objectUrl;
 1461:     image.onerror = () => {
 1462:       if (!node.isConnected) return;
 1463:       node.innerHTML = fallbackMarkup;
 1464:     };
 1465: 
 1466:     node.innerHTML = "";
 1467:     node.appendChild(image);
 1468:   } catch (error) {
 1469:     if (!node.isConnected) return;
 1470:     node.innerHTML = fallbackMarkup;
 1471: 
 1472:     if (error instanceof AccessKeyError) {
 1473:       return;
 1474:     }
 1475: 
 1476:     const rawErrorMessage = String(error?.message || "").trim();
 1477:     const isInvalidMediaPath = /invalid media path/i.test(rawErrorMessage);
 1478:     if (!isInvalidMediaPath) {
 1479:       showError?.(`Could not load asset preview: ${rawErrorMessage || "Unknown error."}`);
 1480:     }
 1481:   }
 1482: }
 1483: 
 1484: function protectLibraryInteractiveControls(scope) {
 1485:   return;
 1486: }
 1487: 
 1488: function getWorkspaceAssetItems(assetsData, registry) {
 1489:   const candidates = [
 1490:     assetsData.assets,
 1491:     assetsData.items,
```

### hydrateProtectedAssetPreview

```js
 1306: 
 1307:       return renderUnsupportedPreviewCard(asset, escapeHtml, {
 1308:         extension: previewExtension,
 1309:         label,
 1310:         message: "Preview shows what the browser can safely render. Inline text preview is not available for this file source, but the asset can still be opened or sent to AI review context."
 1311:       });
 1312:     }
 1313: 
 1314:     if (isOfficePreviewExtension(previewExtension)) {
 1315:       return renderUnsupportedPreviewCard(asset, escapeHtml, {
 1316:         extension: previewExtension,
 1317:         label,
 1318:         message: "Office files cannot be previewed inline in this browser panel without a document conversion service. Preview shows what the browser can safely render; this asset can still be opened or sent to AI review context."
 1319:       });
 1320:     }
 1321: 
 1322:     return `
 1323:       <div class="library-preview-fallback library-document-preview">
 1324:         <div class="library-preview-extension">${escapeHtml((previewExtension || "doc").toUpperCase())}</div>
 1325:         <strong>${escapeHtml(label)}</strong>
 1326:         <div class="library-preview-copy">Preview shows what the browser can safely render. Unsupported files can still be opened or sent to AI review context.</div>
 1327:         ${renderPreviewActionButtons(asset, escapeHtml, { openLabel: "Open document" })}
 1328:       </div>
 1329:     `;
 1330:   }
 1331: 
 1332: 
 1333:   if (asset.text_preview) {
 1334:     return `<div class="library-preview-fallback library-preview-text-fallback">${escapeHtml(asset.text_preview)}</div>`;
 1335:   }
 1336: 
 1337:   const jsonFallback = JSON.stringify(asset.json_preview || asset.media_payload || {}, null, 2);
 1338:   if (jsonFallback && jsonFallback !== "{}") {
 1339:     return `<div class="library-preview-fallback library-preview-text-fallback">${escapeHtml(jsonFallback)}</div>`;
 1340:   }
 1341: 
 1342:   return `
 1343:     ${renderUnsupportedPreviewCard(asset, escapeHtml, {
 1344:       extension: asset.extension || previewExtension || "file",
 1345:       label: "Unknown file type",
 1346:       message: "Preview shows what the browser can safely render. Unsupported files can still be opened or sent to AI review context."
 1347:     })}
 1348:   `;
 1349: }
 1350: 
 1351: async function hydrateProtectedAssetPreview({
 1352:   previewNode,
 1353:   projectName,
 1354:   asset,
 1355:   escapeHtml,
 1356:   showError
 1357: }) {
 1358:   if (!previewNode || !asset) {
 1359:     return;
 1360:   }
 1361: 
 1362:   const expectedId = asString(asset.id || asset.asset_id || "");
 1363: 
 1364:   try {
 1365:     const currentId = previewNode.getAttribute("data-preview-asset-id") || "";
 1366:     if (currentId && expectedId && currentId !== expectedId) {
 1367:       return;
 1368:     }
 1369: 
 1370:     const previewExtension = getPreviewExtensionForAsset(asset);
 1371:     if (isTextPreviewExtension(previewExtension)) {
 1372:       const previewUrl = getAssetPreviewUrl(asset);
 1373:       const { blob } = await fetchProtectedMediaBlob(previewUrl, 45000);
 1374:       if (!previewNode.isConnected) {
 1375:         return;
 1376:       }
 1377:       if (blob.size > 1024 * 1024) {
 1378:         previewNode.outerHTML = renderUnsupportedPreviewCard(asset, escapeHtml, {
 1379:           extension: previewExtension,
 1380:           label: toDocumentPreviewLabel(previewExtension),
 1381:           message: "Preview shows what the browser can safely render. This text-like file is too large for a safe inline preview, but it can still be opened or sent to AI review context."
 1382:         });
 1383:         return;
 1384:       }
 1385: 
 1386:       const text = await blob.text();
 1387:       const previewText = text.length > 12000
 1388:         ? `${text.slice(0, 12000)}\n\n[Preview truncated for safe browser rendering.]`
 1389:         : text;
 1390:       previewNode.outerHTML = `
 1391:         <div class="library-preview-fallback library-preview-text-fallback library-preview-text-card">
 1392:           <div class="library-preview-copy">Preview shows what the browser can safely render.</div>
 1393:           <pre>${escapeHtml(previewText || "This text-like file is empty.")}</pre>
 1394:         </div>
 1395:       `;
 1396:       return;
```

### upload handler

```js
    1: import { renderGuideBox } from "../components/guide-box.js";
    2: import { getSourceTypeMapping } from "../shared-context.js";
    3: import {
    4:   setSharedAiSource,
    5:   getSharedLibrarySourceBridge,
    6:   clearSharedLibrarySourceBridge,
    7:   setSharedAiDrawerReturn,
    8:   getSharedAiDrawerReturn
    9: } from "../shared-context.js";
   10: 
   11: function buildAiSourcePayloadFromAsset(asset = {}) {
   12:   if (!asset) return null;
   13:   return {
   14:     id: asset.id,
   15:     asset_id: asset.asset_id,
   16:     name: asset.name,
   17:     filename: asset.filename,
   18:     file_path: asset.file_path,
   19:     asset_type: asset.asset_type,
   20:     source_label: asset.source_label || asset.name || "Library asset",
   21:     source_of_truth: asset.source_of_truth,
   22:     text_preview: (asset.text_preview || asset.notes || "").slice(0, 1200),
   23:     selected_at: new Date().toISOString()
   24:   };
   25: }
   26: 
   27: // --- Library Source Bridge Guide Box ---
   28: // This must be run inside the render() function, after projectName is defined.
   29: 
   30: import { renderLibraryActionPanel } from "./library/action-panel.js";
   31: import { renderLibraryAiPanel } from "./library/ai-panel.js";
   32: import { normalizeLibraryAsset } from "./library/projection-adapter.js";
   33: import { normalizeLibrarySession } from "./library/session-store.js";
   34: import { createLibraryCommand, routeLibraryCommand } from "./library/command-router.js";
   35: import { mountLibraryListeners } from "./library/listener-lifecycle.js";
   36: import {
   37:   AccessKeyError,
   38:   archiveProjectAsset,
   39:   deleteProjectAsset,
   40:   fetchProtectedMediaBlob,
   41:   refreshProjectLibrary,
   42:   reclassifyProjectAsset,
   43:   renameProjectAsset,
   44:   setProjectAssetSourceOfTruth,
   45:   updateProjectAssetStatus,
   46:   uploadProjectAsset
   47: } from "../api.js";
   48: import {
   49:   getAssetCatalog,
   50:   getCanonicalAssetType,
   51:   getCategoryReadinessList,
   52:   getMissingAssetLabels,
   53:   getAssetStatusTone
   54: } from "../asset-library.js";
   55: 
   56: const librarySessionStore = new Map();
   57: let librarySearchRenderTimer = null;
   58: const MEDIA_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   59: const LIBRARY_UPLOAD_TYPE_LABELS = {
   60:   logo: "Logos",
   61:   brand_guideline: "Brand Guidelines",
   62:   product_csv: "Product Data",
   63:   pricing_doc: "Pricing & Offers",
   64:   legal_doc: "Legal Documents",
   65:   product_photos: "Product Photos",
   66:   product_videos: "Product Videos",
   67:   social_assets: "Social Assets",
   68:   campaign_assets: "Campaign Assets",
   69:   packaging_images: "Packaging Images",
   70:   testimonials_reviews: "Testimonials & Reviews",
   71:   certificates: "Certificates",
   72:   partner_docs: "Partner Documents"
   73: };
   74: 
   75: function getLibraryUploadTypeLabel(assetType = "") {
   76:   const key = String(assetType || "").trim().toLowerCase();
   77:   return LIBRARY_UPLOAD_TYPE_LABELS[key] || titleCase(key || "asset");
   78: }
   79: 
   80: const libraryProtectedUrlCache = new Map();
   81: const LIBRARY_PAGE_SIZE = 10;
   82: const libraryProtectedUrlPromiseCache = new Map();
   83: let disposeLibraryGlobalListeners = null;
   84: let _libraryFeedback = null;
   85: const MAX_CONCURRENT_LIBRARY_THUMB_LOADS = 4;
   86: const LIBRARY_THUMB_BATCH_LIMIT = 18;
   87: let libraryThumbLoadsInFlight = 0;
   88: const libraryThumbLoadQueue = [];
   89: 
   90: const SMART_CATEGORY_BUCKETS = [
   91:   { key: "logos", label: "Logos", types: ["logo"] },
```

### object URL cleanup

```js
  321: 
  322:   if (fullPath) {
  323:     params.push(`path=${encodeURIComponent(fullPath)}`);
  324:   }
  325: 
  326:   if (assetId) {
  327:     params.push(`assetId=${encodeURIComponent(assetId)}`);
  328:   }
  329: 
  330:   return params.length ? `${base}?${params.join("&")}` : base;
  331: }
  332: 
  333: function requiresProtectedMediaFetch(fileUrl = "") {
  334:   const value = asString(fileUrl).trim();
  335:   if (!value) return false;
  336:   if (/^blob:/i.test(value) || /^data:/i.test(value)) return false;
  337:   if (/^https?:\/\//i.test(value) && !value.includes("/media/file/")) return false;
  338:   return value.includes("/media/file/");
  339: }
  340: 
  341: function getAssetPreviewUrl(asset) {
  342:   if (!asset) return "";
  343:   return asString(
  344:     asset.preview_url
  345:     || asset.image_url
  346:     || asset.video_url
  347:     || asset.audio_url
  348:     || ""
  349:   ).trim();
  350: }
  351: 
  352: function buildProtectedCacheKey(projectName, asset) {
  353:   const resolvedAssetId = asString(asset.asset_id || asset.assetId || asset.id || "").trim();
  354:   const resolvedFilePath = asString(asset.file_path || asset.local_path || asset.path || "").trim();
  355:   return [
  356:     projectKey(projectName),
  357:     resolvedAssetId || "no-asset-id",
  358:     resolvedFilePath || "no-file-path",
  359:     getAssetPreviewUrl(asset)
  360:   ].join("::");
  361: }
  362: 
  363: function revokeLibraryProtectedUrl(key) {
  364:   const entry = libraryProtectedUrlCache.get(key);
  365:   if (entry?.objectUrl) {
  366:     URL.revokeObjectURL(entry.objectUrl);
  367:   }
  368:   libraryProtectedUrlCache.delete(key);
  369: }
  370: 
  371: function runNextLibraryThumbLoad() {
  372:   if (libraryThumbLoadsInFlight >= MAX_CONCURRENT_LIBRARY_THUMB_LOADS) {
  373:     return;
  374:   }
  375: 
  376:   const nextJob = libraryThumbLoadQueue.shift();
  377:   if (!nextJob) {
  378:     return;
  379:   }
  380: 
  381:   libraryThumbLoadsInFlight += 1;
  382:   Promise.resolve()
  383:     .then(nextJob)
  384:     .finally(() => {
  385:       libraryThumbLoadsInFlight = Math.max(0, libraryThumbLoadsInFlight - 1);
  386:       runNextLibraryThumbLoad();
  387:     });
  388: }
  389: 
  390: function enqueueLibraryThumbLoad(job) {
  391:   return new Promise((resolve, reject) => {
  392:     libraryThumbLoadQueue.push(async () => {
  393:       try {
  394:         resolve(await job());
  395:       } catch (error) {
  396:         reject(error);
  397:       }
  398:     });
  399: 
  400:     runNextLibraryThumbLoad();
  401:   });
  402: }
  403: 
  404: async function getProtectedAssetObjectUrl(projectName, asset, options = {}) {
  405:   const previewUrl = getAssetPreviewUrl(asset);
  406:   const fileName = asString(asset?.filename || asset?.name || basename(previewUrl) || "download");
  407: 
  408:   if (!requiresProtectedMediaFetch(previewUrl)) {
  409:     return {
  410:       objectUrl: previewUrl,
  411:       contentType: "",
```

## Decision Checklist
- If Preview/Object URL path already requires protected fetch and has revoke cleanup: likely close or minor doc-only closeout.
- If fallbackMarkup is generated only by trusted render helper and escaped content: no patch.
- If upload/drop path validates upload type and delegates to backend upload API: no patch.
- If any user-controlled URL reaches iframe/window.open/download without guard: patch narrowly.
- If object URLs are not revoked on selection/change/route cleanup: patch cleanup narrowly.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
