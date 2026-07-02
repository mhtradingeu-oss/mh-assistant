# T13 — Library Exact Code Path Proof

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/library.js

## Purpose
T12 showed Library is likely covered, but required exact code-path proof for open/download, object URL lifecycle, fallbackMarkup, and upload/drop handling.

## Exact Path Findings
| Area | First Line | Verdict |
|---|---:|---|
| Object URL creation | 439 | Verified |
| Object URL revocation | 366 | Verified |
| Open asset action | 481 | Verified |
| Download asset action | 487 | Verified |
| fallbackMarkup assignment | 1446 | Review: missing nearby renderUnsupportedPreviewCard |
| Upload delegation | 46 | Review: missing nearby uploadType |
| Drop/file handler | 187 | Review: missing nearby files, uploadProjectAsset |


## Evidence

### Object URL creation

```js
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
  484:   }
  485: 
  486:   const anchor = document.createElement("a");
  487:   anchor.href = objectUrl;
  488:   anchor.download = safeFilename;
  489:   document.body.appendChild(anchor);
  490:   anchor.click();
  491:   anchor.remove();
  492: }
  493: 
  494: function mountLibraryGlobalListeners() {
  495:   if (disposeLibraryGlobalListeners) {
  496:     return;
  497:   }
  498: 
  499:   disposeLibraryGlobalListeners = mountLibraryListeners({
  500:     handlers: {
  501:       onBeforeUnload: () => {
  502:         Array.from(libraryProtectedUrlCache.keys()).forEach((key) => revokeLibraryProtectedUrl(key));
  503:       },
  504:       onDocumentClickHandlers: [
```

### Object URL revocation

```js
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
```

### Open asset action

```js
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
  484:   }
  485: 
  486:   const anchor = document.createElement("a");
  487:   anchor.href = objectUrl;
  488:   anchor.download = safeFilename;
  489:   document.body.appendChild(anchor);
  490:   anchor.click();
  491:   anchor.remove();
  492: }
  493: 
  494: function mountLibraryGlobalListeners() {
  495:   if (disposeLibraryGlobalListeners) {
  496:     return;
  497:   }
  498: 
  499:   disposeLibraryGlobalListeners = mountLibraryListeners({
  500:     handlers: {
  501:       onBeforeUnload: () => {
  502:         Array.from(libraryProtectedUrlCache.keys()).forEach((key) => revokeLibraryProtectedUrl(key));
  503:       },
  504:       onDocumentClickHandlers: [
  505:         async (event) => {
  506:           const button = event.target.closest?.("[data-copy-asset-path]");
  507:           if (!button || !button.closest(".library-workspace")) return;
  508: 
  509:           event.preventDefault();
  510: 
  511:           const value = button.getAttribute("data-copy-asset-path") || "";
  512:           if (!value) return;
  513: 
  514:           try {
  515:             await navigator.clipboard.writeText(value);
  516:             _libraryFeedback?.("Asset path copied.");
  517:           } catch {
  518:             window.prompt("Copy asset path:", value);
  519:           }
  520:         },
  521:         (event) => {
  522:           const link = event.target.closest?.("a.library-link-btn");
  523:           if (!link || !link.closest(".library-workspace")) return;
  524: 
  525:           const fileUrl = link.getAttribute("href") || "";
  526:           if (!fileUrl.includes("/media/file/")) return;
  527: 
  528:           event.preventDefault();
  529: 
  530:           const assetName = link.getAttribute("data-asset-name") || decodeURIComponent(fileUrl.split("/").pop() || "download");
  531:           openLibraryAsset("", {
  532:             preview_url: fileUrl,
  533:             filename: assetName,
  534:             name: assetName
  535:           }).catch((error) => {
  536:             const message = error instanceof AccessKeyError
  537:               ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
  538:               : `Could not open file: ${error.message || "Unknown error."}`;
  539:             alert(message);
  540:           });
  541:         },
  542:         (event) => {
  543:           const root = event.target?.closest?.(".library-workspace");
  544:           if (!root) return;
  545: 
  546:           if (event.target?.closest?.(".library-action-menu")) {
```

### Download asset action

```js
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
  484:   }
  485: 
  486:   const anchor = document.createElement("a");
  487:   anchor.href = objectUrl;
  488:   anchor.download = safeFilename;
  489:   document.body.appendChild(anchor);
  490:   anchor.click();
  491:   anchor.remove();
  492: }
  493: 
  494: function mountLibraryGlobalListeners() {
  495:   if (disposeLibraryGlobalListeners) {
  496:     return;
  497:   }
  498: 
  499:   disposeLibraryGlobalListeners = mountLibraryListeners({
  500:     handlers: {
  501:       onBeforeUnload: () => {
  502:         Array.from(libraryProtectedUrlCache.keys()).forEach((key) => revokeLibraryProtectedUrl(key));
  503:       },
  504:       onDocumentClickHandlers: [
  505:         async (event) => {
  506:           const button = event.target.closest?.("[data-copy-asset-path]");
  507:           if (!button || !button.closest(".library-workspace")) return;
  508: 
  509:           event.preventDefault();
  510: 
  511:           const value = button.getAttribute("data-copy-asset-path") || "";
  512:           if (!value) return;
  513: 
  514:           try {
  515:             await navigator.clipboard.writeText(value);
  516:             _libraryFeedback?.("Asset path copied.");
  517:           } catch {
  518:             window.prompt("Copy asset path:", value);
  519:           }
  520:         },
  521:         (event) => {
  522:           const link = event.target.closest?.("a.library-link-btn");
  523:           if (!link || !link.closest(".library-workspace")) return;
  524: 
  525:           const fileUrl = link.getAttribute("href") || "";
  526:           if (!fileUrl.includes("/media/file/")) return;
  527: 
  528:           event.preventDefault();
  529: 
  530:           const assetName = link.getAttribute("data-asset-name") || decodeURIComponent(fileUrl.split("/").pop() || "download");
  531:           openLibraryAsset("", {
  532:             preview_url: fileUrl,
  533:             filename: assetName,
  534:             name: assetName
  535:           }).catch((error) => {
  536:             const message = error instanceof AccessKeyError
  537:               ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
  538:               : `Could not open file: ${error.message || "Unknown error."}`;
  539:             alert(message);
  540:           });
  541:         },
  542:         (event) => {
  543:           const root = event.target?.closest?.(".library-workspace");
  544:           if (!root) return;
  545: 
  546:           if (event.target?.closest?.(".library-action-menu")) {
  547:             return;
  548:           }
  549: 
  550:           closeAllLibraryActionDropdowns();
  551:         }
  552:       ]
```

### fallbackMarkup assignment

```js
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
 1397:     }
 1398: 
 1399:     const resolved = await getProtectedAssetObjectUrl(projectName, asset, {
 1400:       timeoutMs: 45000
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
 1492:     assetsData.records,
 1493:     registry.assets,
 1494:     registry.items,
 1495:     registry.records
 1496:   ];
 1497: 
 1498:   for (const candidate of candidates) {
 1499:     if (Array.isArray(candidate) && candidate.length) return candidate;
 1500:   }
 1501: 
 1502:   return [];
 1503: }
 1504: 
 1505: function buildAiPrompt(projectName, mode, payload = {}) {
 1506:   const project = asString(projectName).trim() || "this project";
 1507:   if (mode === "classify") {
 1508:     return `Classify the current library assets for ${project}, propose best category keys, and flag items that should be source-of-truth.`;
 1509:   }
 1510:   if (mode === "missing") {
 1511:     const missing = asArray(payload.missing).join(", ") || "none";
```

### Upload delegation

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
   92:   { key: "product_images", label: "Product Images", types: ["product_photos", "packaging_images"] },
   93:   { key: "videos", label: "Videos", types: ["product_videos"] },
   94:   { key: "documents", label: "Documents", types: ["brand_guideline", "partner_docs", "testimonials_reviews", "certificates"] },
   95:   { key: "legal", label: "Legal", types: ["legal_doc"] },
   96:   { key: "pricing", label: "Pricing", types: ["pricing_doc", "product_csv"] },
   97:   { key: "campaign_materials", label: "Campaign Materials", types: ["social_assets", "campaign_assets"] }
   98: ];
   99: 
  100: const REQUIRED_ASSET_REQUIREMENTS = [
  101:   {
  102:     key: "logos",
  103:     label: "Logos",
  104:     types: ["logo"],
  105:     why: "Logos keep brand identity consistent across setup, media generation, and publishing.",
  106:     uploadType: "logo"
  107:   },
  108:   {
  109:     key: "brand_guidelines",
  110:     label: "Brand Guidelines",
  111:     types: ["brand_guideline"],
```

### Drop/file handler

```js
  122:   {
  123:     key: "product_images",
  124:     label: "Product Images",
  125:     types: ["product_photos", "packaging_images"],
  126:     why: "Approved product and packaging visuals are required for high-trust creative production.",
  127:     uploadType: "product_photos"
  128:   },
  129:   {
  130:     key: "videos",
  131:     label: "Videos",
  132:     types: ["product_videos"],
  133:     why: "Video source assets are required for reels, demos, and cutdowns.",
  134:     uploadType: "product_videos"
  135:   },
  136:   {
  137:     key: "legal_pricing",
  138:     label: "Legal / Pricing Documents",
  139:     types: ["legal_doc", "pricing_doc"],
  140:     why: "Legal and pricing documents prevent non-compliant copy and invented offers.",
  141:     uploadType: "legal_doc"
  142:   },
  143:   {
  144:     key: "research_documents",
  145:     label: "Research Documents",
  146:     types: ["partner_docs", "testimonials_reviews", "certificates"],
  147:     why: "Research and proof documents support claims, trust signals, and strategy decisions.",
  148:     uploadType: "partner_docs"
  149:   }
  150: ];
  151: 
  152: function getCleanLibraryTypeLabel(type, fallback = "") {
  153:   const key = String(type || "").trim().toLowerCase();
  154:   return LIBRARY_UPLOAD_TYPE_LABELS[key] || String(fallback || key || "Asset").trim();
  155: }
  156: 
  157: const LIBRARY_FOLDERS = [
  158:   { key: "all_assets", label: "All Assets" },
  159:   { key: "logos", label: "Logos", types: ["logo"] },
  160:   { key: "product_data", label: "Product Data", types: ["product_csv"] },
  161:   { key: "product_images", label: "Product Images", types: ["product_photos", "packaging_images"] },
  162:   { key: "packaging_images", label: "Packaging Images", types: ["packaging_images"] },
  163:   { key: "videos", label: "Videos", types: ["product_videos"] },
  164:   { key: "legal_pricing", label: "Legal & Pricing", types: ["legal_doc", "pricing_doc"] },
  165:   { key: "brand_guidelines", label: "Brand Guidelines", types: ["brand_guideline"] },
  166:   { key: "research_certificates", label: "Research / Certificates", types: ["partner_docs", "testimonials_reviews", "certificates"] },
  167:   { key: "uploaded_session", label: "Uploaded This Session" },
  168:   { key: "source_of_truth", label: "Source of Truth" },
  169:   { key: "archived", label: "Archived" }
  170: ];
  171: 
  172: function asArray(value) {
  173:   return Array.isArray(value) ? value : [];
  174: }
  175: 
  176: function asObject(value) {
  177:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  178: }
  179: 
  180: function asString(value) {
  181:   if (value == null) return "";
  182:   return String(value);
  183: }
  184: 
  185: function isLibraryInteractiveElement(target) {
  186:   return Boolean(target?.closest?.(
  187:     "button, a, input, select, textarea, label, option, [role='button'], .library-action-menu, .library-action-dropdown, .library-drop-zone"
  188:   ));
  189: }
  190: 
  191: function bindLibraryControlEventShield(scope) {
  192:   // No-op by design.
  193:   // Do not stop events on native controls. Select/input/file controls must
  194:   // receive pointer/click/input events directly from the browser.
  195:   return;
  196: }
  197: 
  198: function titleCase(value = "") {
  199:   return asString(value)
  200:     .replace(/[_-]+/g, " ")
  201:     .replace(/\b\w/g, (letter) => letter.toUpperCase());
  202: }
  203: 
  204: function toKey(value = "") {
  205:   return asString(value).trim().toLowerCase();
  206: }
  207: 
  208: function projectKey(projectName) {
  209:   return toKey(projectName) || "__default__";
  210: }
  211: 
  212: function readManagedMediaAssetMap() {
  213:   if (typeof window === "undefined") return {};
  214:   try {
  215:     const parsed = JSON.parse(window.localStorage?.getItem(MEDIA_LIBRARY_LOCAL_ASSETS_KEY) || "{}");
  216:     return parsed && typeof parsed === "object" ? parsed : {};
  217:   } catch (_) {
  218:     return {};
  219:   }
  220: }
  221: 
  222: function loadLocalManagedMediaAssets(projectName) {
  223:   const map = readManagedMediaAssetMap();
  224:   const primary = asArray(map[projectKey(projectName)]);
  225:   if (primary.length) return primary;
  226:   if (!toKey(projectName)) {
  227:     return asArray(map.workspace || map.Workspace || map.__default__);
  228:   }
  229:   return primary;
  230: }
  231: 
  232: function basename(filePath = "") {
  233:   const value = asString(filePath);
  234:   if (!value) return "";
  235:   const parts = value.split("/");
  236:   return parts[parts.length - 1] || value;
  237: }
  238: 
  239: function getFileExtension(name = "") {
  240:   const value = basename(name);
  241:   const index = value.lastIndexOf(".");
  242:   return index >= 0 ? value.slice(index + 1).toLowerCase() : "";
  243: }
  244: 
  245: function shortPath(filePath = "", maxSegments = 4) {
  246:   const value = asString(filePath).trim();
  247:   if (!value) return "-";
  248:   const parts = value.split("/").filter(Boolean);
  249:   if (parts.length <= maxSegments) return `/${parts.join("/")}`;
  250:   return `.../${parts.slice(parts.length - maxSegments).join("/")}`;
  251: }
  252: 
```

## Closeout Decision Rules
- If all areas are Verified, Library does not need a safety patch now.
- If only upload/drop remains Review because of broad matching, inspect exact handler before patch.
- If open/download uses getProtectedAssetObjectUrl and noopener/download attributes, no URL patch is needed.
- If fallbackMarkup comes from renderUnsupportedPreviewCard with escapeHtml, no innerHTML patch is needed.
- If object URLs are cached and revoked, no lifecycle patch is needed.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
