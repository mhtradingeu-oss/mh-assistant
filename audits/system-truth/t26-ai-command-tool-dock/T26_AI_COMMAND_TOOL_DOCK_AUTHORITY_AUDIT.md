# T26 — AI Command Tool Dock Authority + Handoff Safety Audit

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/ai-command/tool-dock.js

## Why This Page Is Next
T19 ranked AI Command Tool Dock as the next remaining P1 review candidate after Integrations was closed.

T19 signals:
- Risk score: 57.6
- innerHTML: 4
- authority words: 70
- confirmations: 42
- likely prompt/template/handoff risk rather than direct execution risk

## Purpose
Verify whether Tool Dock is:
- a safe prompt/template/handoff surface
- not a direct execution surface
- not publishing, sending, approving, or running backend actions directly
- using escaped rendering for dynamic content
- clearly routing ownership to the correct workspace
- only needing UX/copy polish, if anything

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
| HTML render / innerHTML | 285 | 4 |
| Selected source render | 285 | 4 |
| Select options render | 1463 | 1 |
| Escape evidence | 36 | 19 |
| Publish / send / execute wording | 301 | 53 |
| Do not execute safeguards | 354 | 9 |
| Destination handoff | 381 | 134 |
| Action ids | 350 | 124 |
| Event handlers | 329 | 8 |
| Backend/API calls | n/a | 0 |
| Window/navigation | 1766 | 1 |
| Dangerous direct actions | 964 | 2 |
| Copy defects candidates | n/a | 0 |


## Evidence Zones

### HTML render / innerHTML

```js
  205:   const text = String(value || "").trim();
  206:   if (!text || text.length <= maxLength) return text;
  207:   const parts = text.split(/[\/]/).filter(Boolean);
  208:   const tail = parts.slice(-2).join("/");
  209:   if (tail && tail.length < maxLength) return `.../${tail}`;
  210:   return `${text.slice(0, maxLength - 3).trim()}...`;
  211: }
  212: 
  213: function buildSelectedSourceContextBlock(projectName = "") {
  214:   const source = getSelectedLibrarySource(projectName);
  215:   if (!source?.name) return "";
  216: 
  217:   const name = source.name || source.filename || source.fileName || "Selected Library source";
  218:   const type = source.asset_type || source.type || source.source_type || "Library asset";
  219:   const sourceId = source.asset_id || source.id || source.mutation_id || "";
  220:   const path = source.file_path || source.path || source.filename || source.fileName || "";
  221:   const preview = truncatePromptText(source.text_preview || source.preview || source.notes || "");
  222:   const sourceOfTruth = typeof source.source_of_truth === "boolean"
  223:     ? (source.source_of_truth ? "yes" : "no")
  224:     : (source.source_of_truth || "");
  225: 
  226:   const lines = [
  227:     "Selected Library source context:",
  228:     `- Source name: ${name}.`,
  229:     `- Source type: ${type}.`
  230:   ];
  231: 
  232:   if (sourceId) lines.push(`- Source id: ${compactSourceReference(sourceId, 80)}.`);
  233:   if (path) lines.push(`- Source path: ${compactSourceReference(path, 120)}.`);
  234:   if (sourceOfTruth) lines.push(`- Source-of-truth flag: ${sourceOfTruth}.`);
  235:   if (preview) lines.push(`- Text preview: ${preview}`);
  236: 
  237:   lines.push("Use this Library source as trusted context. Do not add unsupported claims.");
  238:   return lines.join("\n");
  239: }
  240: 
  241: function setDrawerSourceWarning(drawer, message = "") {
  242:   const warning = drawer?.querySelector?.("[data-aicmd-tool-drawer-source-warning]");
  243:   if (!warning) return;
  244:   const hasMessage = Boolean(message);
  245:   warning.hidden = !hasMessage;
  246:   warning.textContent = message;
  247: }
  248: 
  249: function sourceMetadataNeedsLibrarySource(rawValue = "") {
  250:   return /source_of_truth_assets|selected_asset|proof_doc|legal_doc|privacy_policy/i.test(String(rawValue || ""));
  251: }
  252: 
  253: function isDrawerSourceRequired(drawer) {
  254:   return drawer?.dataset?.sourceRequired === "true";
  255: }
  256: 
  257: function validateDrawerSourceRequirement(drawer, projectName = "") {
  258:   if (!isDrawerSourceRequired(drawer)) {
  259:     setDrawerSourceWarning(drawer, "");
  260:     return true;
  261:   }
  262: 
  263:   const source = getSelectedLibrarySource(projectName);
  264:   if (source?.name) {
  265:     setDrawerSourceWarning(drawer, "");
  266:     return true;
  267:   }
  268: 
  269:   setDrawerSourceWarning(
  270:     drawer,
  271:     "This prompt tool needs a trusted Library source first. Choose a source from Library, then return to prepare the composer prompt."
  272:   );
  273:   return false;
  274: }
  275: 
  276: export function applySharedAiSourceToDrawer(drawer, projectName = "") {
  277:   if (!drawer) return;
  278:   const source = getSelectedLibrarySource(projectName);
  279:   const selectedNode = drawer.querySelector("[data-aicmd-tool-drawer-selected-source]");
  280:   const sourceInput = drawer.querySelector("[data-aicmd-tool-drawer-source-details]");
  281:   const sourceSelect = drawer.querySelector("[data-aicmd-tool-drawer-source-select]");
  282: 
  283:   if (!source || !source.name) {
  284:     if (selectedNode) {
  285:       selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No trusted Library source selected yet.</span>`;
  286:     }
  287:     if (sourceInput && !sourceInput.value) {
  288:       sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  289:     }
  290:     validateDrawerSourceRequirement(drawer, projectName);
  291:     return;
  292:   }
  293: 
  294:   // Render compact selected source card
  295:   const { name, type, path } = formatSharedAiSource(source);
  296:   if (selectedNode) {
  297:     selectedNode.innerHTML = `
  298:       <div class=\"mhos-tool-drawer-source-card\">
  299:         <div class=\"mhos-tool-drawer-source-eyebrow\">Trusted AI context only</div>
  300:         <div class=\"mhos-tool-drawer-source-main\">${escapeHtml(name)}</div>
  301:         <div class=\"mhos-tool-drawer-source-meta\">${escapeHtml(type)} · Added from Library · Not approval or publish readiness</div>
  302:         ${path && path !== name ? `<div class=\"mhos-tool-drawer-source-path\" title=\"${escapeHtml(path)}\">${escapeHtml(path)}</div>` : ""}
  303:         <div class=\"mhos-tool-drawer-source-actions\">
  304:           <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-change-source>Change source</button>
  305:           <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-remove-source>Remove source</button>
  306:         </div>
  307:       </div>
  308:     `;
  309:   }
  310: 
  311:   // Set placeholder for Source Details if empty
  312:   if (sourceInput && !sourceInput.value) {
  313:     sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  314:   }
  315: 
  316:   // Set select value if possible
  317:   if (sourceSelect) {
  318:     const libraryOption = Array.from(sourceSelect.options || []).find((option) => {
  319:       const value = `${option.value || ""} ${option.textContent || ""}`;
  320:       return /library|source|asset|brand|product/i.test(value);
  321:     });
  322:     if (libraryOption) sourceSelect.value = libraryOption.value;
  323:   }
  324: 
  325:   // Attach actions
  326:   if (selectedNode) {
  327:     const changeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-change-source]');
  328:     if (changeBtn) {
  329:       changeBtn.onclick = () => {
  330:         drawer.querySelector('[data-aicmd-tool-drawer-open-library]')?.click();
  331:       };
  332:     }
  333:     const removeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-remove-source]');
  334:     if (removeBtn) {
  335:       removeBtn.onclick = () => {
  336:         clearSharedAiSource(projectName || "__default__");
  337:         clearSharedAiSource("__default__");
  338:         if (selectedNode) selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No trusted Library source selected yet.</span>`;
  339:         if (sourceInput) sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  340:         if (sourceSelect) sourceSelect.value = "";
  341:         validateDrawerSourceRequirement(drawer, projectName);
  342:       };
  343:     }
  344:   }
  345: 
  346:   validateDrawerSourceRequirement(drawer, projectName);
  347: }
  348: const BASE_TOOL_DOCK_TOOLS = [
  349:   {
  350:     id: "rewrite",
  351:     icon: "✍",
  352:     label: "Rewrite",
  353:     badge: "Text",
  354:     template: "Rewrite the latest response or selected text for {projectName}. Make it clearer, more professional, and easier to use. Do not publish or execute anything."
  355:   },
  356:   {
  357:     id: "translate",
  358:     icon: "🌍",
  359:     label: "Translate",
  360:     badge: "Market",
  361:     template: "Translate or adapt the selected text for the project target market. Keep the explanation in the user's chat language and prepare only review-ready copy."
  362:   },
  363:   {
  364:     id: "improve",
  365:     icon: "✨",
```

### Selected source render

```js
  205:   const text = String(value || "").trim();
  206:   if (!text || text.length <= maxLength) return text;
  207:   const parts = text.split(/[\/]/).filter(Boolean);
  208:   const tail = parts.slice(-2).join("/");
  209:   if (tail && tail.length < maxLength) return `.../${tail}`;
  210:   return `${text.slice(0, maxLength - 3).trim()}...`;
  211: }
  212: 
  213: function buildSelectedSourceContextBlock(projectName = "") {
  214:   const source = getSelectedLibrarySource(projectName);
  215:   if (!source?.name) return "";
  216: 
  217:   const name = source.name || source.filename || source.fileName || "Selected Library source";
  218:   const type = source.asset_type || source.type || source.source_type || "Library asset";
  219:   const sourceId = source.asset_id || source.id || source.mutation_id || "";
  220:   const path = source.file_path || source.path || source.filename || source.fileName || "";
  221:   const preview = truncatePromptText(source.text_preview || source.preview || source.notes || "");
  222:   const sourceOfTruth = typeof source.source_of_truth === "boolean"
  223:     ? (source.source_of_truth ? "yes" : "no")
  224:     : (source.source_of_truth || "");
  225: 
  226:   const lines = [
  227:     "Selected Library source context:",
  228:     `- Source name: ${name}.`,
  229:     `- Source type: ${type}.`
  230:   ];
  231: 
  232:   if (sourceId) lines.push(`- Source id: ${compactSourceReference(sourceId, 80)}.`);
  233:   if (path) lines.push(`- Source path: ${compactSourceReference(path, 120)}.`);
  234:   if (sourceOfTruth) lines.push(`- Source-of-truth flag: ${sourceOfTruth}.`);
  235:   if (preview) lines.push(`- Text preview: ${preview}`);
  236: 
  237:   lines.push("Use this Library source as trusted context. Do not add unsupported claims.");
  238:   return lines.join("\n");
  239: }
  240: 
  241: function setDrawerSourceWarning(drawer, message = "") {
  242:   const warning = drawer?.querySelector?.("[data-aicmd-tool-drawer-source-warning]");
  243:   if (!warning) return;
  244:   const hasMessage = Boolean(message);
  245:   warning.hidden = !hasMessage;
  246:   warning.textContent = message;
  247: }
  248: 
  249: function sourceMetadataNeedsLibrarySource(rawValue = "") {
  250:   return /source_of_truth_assets|selected_asset|proof_doc|legal_doc|privacy_policy/i.test(String(rawValue || ""));
  251: }
  252: 
  253: function isDrawerSourceRequired(drawer) {
  254:   return drawer?.dataset?.sourceRequired === "true";
  255: }
  256: 
  257: function validateDrawerSourceRequirement(drawer, projectName = "") {
  258:   if (!isDrawerSourceRequired(drawer)) {
  259:     setDrawerSourceWarning(drawer, "");
  260:     return true;
  261:   }
  262: 
  263:   const source = getSelectedLibrarySource(projectName);
  264:   if (source?.name) {
  265:     setDrawerSourceWarning(drawer, "");
  266:     return true;
  267:   }
  268: 
  269:   setDrawerSourceWarning(
  270:     drawer,
  271:     "This prompt tool needs a trusted Library source first. Choose a source from Library, then return to prepare the composer prompt."
  272:   );
  273:   return false;
  274: }
  275: 
  276: export function applySharedAiSourceToDrawer(drawer, projectName = "") {
  277:   if (!drawer) return;
  278:   const source = getSelectedLibrarySource(projectName);
  279:   const selectedNode = drawer.querySelector("[data-aicmd-tool-drawer-selected-source]");
  280:   const sourceInput = drawer.querySelector("[data-aicmd-tool-drawer-source-details]");
  281:   const sourceSelect = drawer.querySelector("[data-aicmd-tool-drawer-source-select]");
  282: 
  283:   if (!source || !source.name) {
  284:     if (selectedNode) {
  285:       selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No trusted Library source selected yet.</span>`;
  286:     }
  287:     if (sourceInput && !sourceInput.value) {
  288:       sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  289:     }
  290:     validateDrawerSourceRequirement(drawer, projectName);
  291:     return;
  292:   }
  293: 
  294:   // Render compact selected source card
  295:   const { name, type, path } = formatSharedAiSource(source);
  296:   if (selectedNode) {
  297:     selectedNode.innerHTML = `
  298:       <div class=\"mhos-tool-drawer-source-card\">
  299:         <div class=\"mhos-tool-drawer-source-eyebrow\">Trusted AI context only</div>
  300:         <div class=\"mhos-tool-drawer-source-main\">${escapeHtml(name)}</div>
  301:         <div class=\"mhos-tool-drawer-source-meta\">${escapeHtml(type)} · Added from Library · Not approval or publish readiness</div>
  302:         ${path && path !== name ? `<div class=\"mhos-tool-drawer-source-path\" title=\"${escapeHtml(path)}\">${escapeHtml(path)}</div>` : ""}
  303:         <div class=\"mhos-tool-drawer-source-actions\">
  304:           <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-change-source>Change source</button>
  305:           <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-remove-source>Remove source</button>
  306:         </div>
  307:       </div>
  308:     `;
  309:   }
  310: 
  311:   // Set placeholder for Source Details if empty
  312:   if (sourceInput && !sourceInput.value) {
  313:     sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  314:   }
  315: 
  316:   // Set select value if possible
  317:   if (sourceSelect) {
  318:     const libraryOption = Array.from(sourceSelect.options || []).find((option) => {
  319:       const value = `${option.value || ""} ${option.textContent || ""}`;
  320:       return /library|source|asset|brand|product/i.test(value);
  321:     });
  322:     if (libraryOption) sourceSelect.value = libraryOption.value;
  323:   }
  324: 
  325:   // Attach actions
  326:   if (selectedNode) {
  327:     const changeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-change-source]');
  328:     if (changeBtn) {
  329:       changeBtn.onclick = () => {
  330:         drawer.querySelector('[data-aicmd-tool-drawer-open-library]')?.click();
  331:       };
  332:     }
  333:     const removeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-remove-source]');
  334:     if (removeBtn) {
  335:       removeBtn.onclick = () => {
  336:         clearSharedAiSource(projectName || "__default__");
  337:         clearSharedAiSource("__default__");
  338:         if (selectedNode) selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No trusted Library source selected yet.</span>`;
  339:         if (sourceInput) sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  340:         if (sourceSelect) sourceSelect.value = "";
  341:         validateDrawerSourceRequirement(drawer, projectName);
  342:       };
  343:     }
  344:   }
  345: 
  346:   validateDrawerSourceRequirement(drawer, projectName);
  347: }
  348: const BASE_TOOL_DOCK_TOOLS = [
  349:   {
  350:     id: "rewrite",
  351:     icon: "✍",
  352:     label: "Rewrite",
  353:     badge: "Text",
  354:     template: "Rewrite the latest response or selected text for {projectName}. Make it clearer, more professional, and easier to use. Do not publish or execute anything."
  355:   },
  356:   {
  357:     id: "translate",
  358:     icon: "🌍",
  359:     label: "Translate",
  360:     badge: "Market",
  361:     template: "Translate or adapt the selected text for the project target market. Keep the explanation in the user's chat language and prepare only review-ready copy."
  362:   },
  363:   {
  364:     id: "improve",
  365:     icon: "✨",
```

### Select options render

```js
 1383:       </div>
 1384:       <div class="mhos-tool-dock-list">
 1385:         ${tools.map((tool) => `
 1386:           <button
 1387:             type="button"
 1388:             class="mhos-tool-dock-item"
 1389:             data-aicmd-tool-dock="${safe(tool.id)}"
 1390:             data-aicmd-tool-dock-label="${safe(tool.label)}"
 1391:             data-aicmd-tool-dock-icon="${safe(tool.icon)}"
 1392:             data-aicmd-tool-dock-badge="${safe(tool.badge)}"
 1393:             data-aicmd-tool-dock-action="${safe(tool.actionType || "guided")}"
 1394:             data-aicmd-tool-dock-safety="${safe(tool.safetyLevel || "review_only")}"
 1395:             data-aicmd-tool-dock-owner="${safe(tool.frontendOwnerPage || "ai-command")}"
 1396:             data-aicmd-tool-dock-destinations="${safe(joinMetaList(getToolMetaList(tool, "destinations", ["chat-preview"])))}"
 1397:             data-aicmd-tool-dock-sources="${safe(joinMetaList(getToolMetaList(tool, "sourceTypes", ["current_chat"])))}"
 1398:             data-aicmd-tool-dock-outputs="${safe(joinMetaList(getToolMetaList(tool, "outputTypes", [tool.id || "tool_output"])))}"
 1399:             data-aicmd-tool-dock-template="${safe(tool.template)}"
 1400:             title="${safe(tool.template)}"
 1401:           >
 1402:             <span class="mhos-tool-dock-icon" aria-hidden="true">${safe(tool.icon)}</span>
 1403:             <span class="mhos-tool-dock-label">${safe(tool.label)}</span>
 1404:             <span class="mhos-tool-dock-badge">${safe(tool.badge)}</span>
 1405:           </button>
 1406:         `).join("")}
 1407:       </div>
 1408:     </section>
 1409:     ${renderSmartToolDrawerShell(safe)}
 1410:   `;
 1411: }
 1412: 
 1413: function humanizeMeta(value = "") {
 1414:   const raw = String(value || "").trim();
 1415:   const normalized = raw.toLowerCase();
 1416: 
 1417:   const exactLabels = {
 1418:     ai: "AI",
 1419:     seo: "SEO",
 1420:     crm: "CRM",
 1421:     cta: "CTA",
 1422:     gdpr: "GDPR",
 1423:     faq: "FAQ"
 1424:   };
 1425: 
 1426:   if (exactLabels[normalized]) return exactLabels[normalized];
 1427: 
 1428:   return raw
 1429:     .split("_")
 1430:     .join(" ")
 1431:     .split("-")
 1432:     .join(" ")
 1433:     .replace(/\b\w/g, (char) => char.toUpperCase())
 1434:     .replace(/\bSeo\b/g, "SEO")
 1435:     .replace(/\bFaq\b/g, "FAQ")
 1436:     .replace(/\bCta\b/g, "CTA")
 1437:     .replace(/\bCrm\b/g, "CRM")
 1438:     .replace(/\bGdpr\b/g, "GDPR")
 1439:     .replace(/\bAi\b/g, "AI");
 1440: }
 1441: 
 1442: 
 1443: 
 1444: function getMetaValues(rawValue = "") {
 1445:   return String(rawValue || "")
 1446:     .split("|")
 1447:     .map((item) => item.trim())
 1448:     .filter(Boolean);
 1449: }
 1450: 
 1451: function populateDrawerSelect(select, rawValue = "", fallbackLabel = "Auto") {
 1452:   if (!select) return;
 1453: 
 1454:   const values = Array.isArray(rawValue)
 1455:     ? rawValue.map((item) => String(item || "").trim()).filter(Boolean)
 1456:     : String(rawValue || "")
 1457:       .split(/[|,]/)
 1458:       .map((item) => item.trim())
 1459:       .filter(Boolean);
 1460: 
 1461:   const options = values.length ? values : [String(fallbackLabel || "Auto").trim() || "Auto"];
 1462: 
 1463:   select.innerHTML = options.map((value, index) => {
 1464:     const safeValue = escapeHtml(value);
 1465:     const label = humanizeMeta(value || fallbackLabel || "Auto");
 1466:     return `<option value="${index === 0 && !values.length ? "" : safeValue}">${escapeHtml(label)}</option>`;
 1467:   }).join("");
 1468: }
 1469: 
 1470: function getSelectedLabel(drawer, selector, fallback = "Auto") {
 1471:   const select = drawer?.querySelector?.(selector);
 1472:   if (!select || !select.value) return fallback;
 1473:   return humanizeMeta(select.value);
 1474: }
 1475: 
 1476: function getDrawerFieldValue(drawer, selector) {
 1477:   const node = drawer?.querySelector?.(selector);
 1478:   return String(node?.value || "").trim();
 1479: }
 1480: 
 1481: function isSeoRelevantOutput(output = "") {
 1482:   const value = String(output || "").toLowerCase();
 1483:   return value.includes("blog") ||
 1484:     value.includes("seo") ||
 1485:     value.includes("meta") ||
 1486:     value.includes("landing page") ||
 1487:     value.includes("article");
 1488: }
 1489: 
 1490: function buildOutputSpecificRules(output = "") {
 1491:   if (!isSeoRelevantOutput(output)) return [];
 1492: 
 1493:   return [
 1494:     "SEO quality rules:",
 1495:     "- Start with a clear SEO title/H1.",
 1496:     "- Define search intent before writing.",
 1497:     "- Suggest a primary keyword and 3-6 secondary keyword ideas if not provided.",
 1498:     "- Use a clean H2/H3 structure.",
 1499:     "- Include a meta title and meta description.",
 1500:     "- Include FAQ ideas when useful.",
 1501:     "- Mention internal link opportunities if relevant.",
 1502:     "- Do not invent certifications, claims, ingredients, prices, guarantees, or statistics without source evidence."
 1503:   ];
 1504: }
 1505: 
 1506: function buildSmartToolComposerPrompt({ drawer, baseTemplate, projectName }) {
 1507:   const title = drawer?.querySelector?.("[data-aicmd-tool-drawer-title]")?.textContent || "Smart tool";
 1508:   const action = drawer?.querySelector?.("[data-aicmd-tool-drawer-action]")?.textContent || "Guided";
 1509:   const output = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-output-select]", "Auto / infer from request");
 1510:   const source = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-source-select]", "Current chat or ask if source is needed");
 1511:   const destination = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-destination-select]", "Chat preview");
 1512:   const language = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-language]", "Auto / project language");
 1513:   const tone = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-tone]", "Auto / brand tone");
 1514:   const sourceDetails = getDrawerFieldValue(drawer, "[data-aicmd-tool-drawer-source-details]");
 1515:   const extraBrief = getDrawerFieldValue(drawer, "[data-aicmd-tool-drawer-extra-brief]");
 1516: 
 1517:   const sourceInstruction = sourceDetails
 1518:     ? `${source}. Source details: ${sourceDetails}.`
 1519:     : `${source}. If the selected source is not available in the current context, ask me to choose, paste, upload, or open the relevant source before producing final content.`;
 1520:   const selectedSourceContext = buildSelectedSourceContextBlock(projectName);
 1521: 
 1522:   const lines = [
 1523:     `Use the ${title} tool for the active project${projectName ? ` (${projectName})` : ""}.`,
 1524:     "",
 1525:     "Selected setup:",
 1526:     `- Tool mode: ${action}.`,
 1527:     `- Output type: ${output}.`,
 1528:     `- Source/input: ${sourceInstruction}`,
 1529:     `- Destination: ${destination}.`,
 1530:     `- Language: ${language}.`,
 1531:     `- Tone: ${tone}.`
 1532:   ];
 1533: 
 1534:   if (baseTemplate) {
 1535:     lines.push("", "Tool instruction:", baseTemplate);
 1536:   }
 1537: 
 1538:   if (selectedSourceContext) {
 1539:     lines.push("", selectedSourceContext);
 1540:   }
 1541: 
 1542:   if (extraBrief) {
 1543:     lines.push(`- Extra brief: ${extraBrief}.`);
```

### Escape evidence

```js
    1: 
    2: import {
    3:   setSharedLibrarySourceBridge,
    4:   getSharedAiSource,
    5:   clearSharedAiSource,
    6:   getSourceTypeMapping,
    7:   setSharedAiDrawerReturn,
    8:   getSharedAiDrawerReturn,
    9:   clearSharedAiDrawerReturn
   10: } from "../../shared-context.js";
   11: 
   12: 
   13: 
   14: function moveFocusOutOfDrawer(drawer, fallbackTarget = null) {
   15:   if (!drawer || typeof document === "undefined") return;
   16: 
   17:   const active = document.activeElement;
   18:   if (active && drawer.contains(active)) {
   19:     if (fallbackTarget && typeof fallbackTarget.focus === "function") {
   20:       fallbackTarget.focus({ preventScroll: true });
   21:       return;
   22:     }
   23: 
   24:     const composer = document.querySelector("[data-aicmd-composer-input], textarea, input");
   25:     if (composer && typeof composer.focus === "function") {
   26:       composer.focus({ preventScroll: true });
   27:       return;
   28:     }
   29: 
   30:     if (typeof active.blur === "function") {
   31:       active.blur();
   32:     }
   33:   }
   34: }
   35: 
   36: function escapeHtml(value = "") {
   37:   return String(value ?? "").replace(/[&<>"']/g, (char) => ({
   38:     "&": "&amp;",
   39:     "<": "&lt;",
   40:     ">": "&gt;",
   41:     "\"": "&quot;",
   42:     "'": "&#39;"
   43:   })[char] || char);
   44: }
   45: 
   46: function tryAutoOpenDrawerAfterLibrary(projectName) {
   47:   const returnContext = getSharedAiDrawerReturn(projectName) || getSharedAiDrawerReturn("__default__");
   48:   if (!returnContext?.drawerOpen) return;
   49: 
   50:   const drawer = document.querySelector("[data-aicmd-tool-drawer]");
   51:   const root = drawer?.closest?.("[data-page='ai-command'], .ai-command-page, body") || document;
   52: 
   53:   let targetButton = null;
   54:   if (returnContext.toolId) {
   55:     targetButton = findToolButton(root, "data-aicmd-tool-dock", returnContext.toolId)
   56:       || findToolButton(root, "data-aicmdv2-tool", returnContext.toolId);
   57:   }
   58: 
   59:   if (!targetButton) {
   60:     targetButton = root.querySelector("[data-aicmd-tool-dock][data-aicmd-tool-dock-action='guided']")
   61:       || root.querySelector("[data-aicmd-tool-dock]")
   62:       || root.querySelector("[data-aicmdv2-tool]");
   63:   }
   64: 
   65:   if (targetButton && typeof targetButton.click === "function") {
   66:     targetButton.click();
   67:   }
   68: 
   69:   const activeDrawer = document.querySelector("[data-aicmd-tool-drawer]");
   70:   let drawerIsOpen = Boolean(
   71:     activeDrawer &&
   72:     activeDrawer.hidden === false &&
   73:     activeDrawer.getAttribute("aria-hidden") === "false" &&
   74:     activeDrawer.classList.contains("is-open")
   75:   );
   76: 
   77:   if (!drawerIsOpen && activeDrawer) {
   78:     const fallbackTool = findToolMetadataById(returnContext.toolId);
   79:     if (fallbackTool) {
   80:       drawerIsOpen = openToolDrawer({
   81:         drawer: activeDrawer,
   82:         btn: createToolButtonAdapter(fallbackTool),
   83:         tool: fallbackTool,
   84:         text: fallbackTool.template || "",
   85:         session: {
   86:           modeId: returnContext.modeId || returnContext.specialistId || "",
   87:           teamMode: returnContext.teamMode || "solo"
   88:         },
   89:         projectName
   90:       });
   91:     }
   92: 
   93:     if (!drawerIsOpen) {
   94:       if (returnContext.toolId) activeDrawer.dataset.pendingTool = returnContext.toolId;
   95:       if (returnContext.specialistId) activeDrawer.dataset.specialistId = returnContext.specialistId;
   96:       if (returnContext.modeId) activeDrawer.dataset.modeId = returnContext.modeId;
   97:       if (returnContext.teamMode) activeDrawer.dataset.teamMode = returnContext.teamMode;
   98: 
   99:       activeDrawer.hidden = false;
  100:       activeDrawer.setAttribute("aria-hidden", "false");
  101:       activeDrawer.classList.add("is-open");
  102: 
  103:       drawerIsOpen = true;
  104:     }
  105:   }
  106: 
  107:   if (drawerIsOpen && activeDrawer) {
  108:     applySharedAiSourceToDrawer(activeDrawer, projectName);
  109: 
  110:     const selectedSource = getSharedAiSource(projectName) || getSharedAiSource("__default__");
  111:     const msg = activeDrawer.querySelector("[data-aicmd-tool-drawer-status]") || document.querySelector("[data-aicmd-tool-drawer-status]");
  112:     if (msg) {
  113:       msg.textContent = selectedSource?.name
  114:         ? "Source added to drawer."
  115:         : "Returned to drawer. No source selected.";
  116:     }
```

### Publish / send / execute wording

```js
  221:   const preview = truncatePromptText(source.text_preview || source.preview || source.notes || "");
  222:   const sourceOfTruth = typeof source.source_of_truth === "boolean"
  223:     ? (source.source_of_truth ? "yes" : "no")
  224:     : (source.source_of_truth || "");
  225: 
  226:   const lines = [
  227:     "Selected Library source context:",
  228:     `- Source name: ${name}.`,
  229:     `- Source type: ${type}.`
  230:   ];
  231: 
  232:   if (sourceId) lines.push(`- Source id: ${compactSourceReference(sourceId, 80)}.`);
  233:   if (path) lines.push(`- Source path: ${compactSourceReference(path, 120)}.`);
  234:   if (sourceOfTruth) lines.push(`- Source-of-truth flag: ${sourceOfTruth}.`);
  235:   if (preview) lines.push(`- Text preview: ${preview}`);
  236: 
  237:   lines.push("Use this Library source as trusted context. Do not add unsupported claims.");
  238:   return lines.join("\n");
  239: }
  240: 
  241: function setDrawerSourceWarning(drawer, message = "") {
  242:   const warning = drawer?.querySelector?.("[data-aicmd-tool-drawer-source-warning]");
  243:   if (!warning) return;
  244:   const hasMessage = Boolean(message);
  245:   warning.hidden = !hasMessage;
  246:   warning.textContent = message;
  247: }
  248: 
  249: function sourceMetadataNeedsLibrarySource(rawValue = "") {
  250:   return /source_of_truth_assets|selected_asset|proof_doc|legal_doc|privacy_policy/i.test(String(rawValue || ""));
  251: }
  252: 
  253: function isDrawerSourceRequired(drawer) {
  254:   return drawer?.dataset?.sourceRequired === "true";
  255: }
  256: 
  257: function validateDrawerSourceRequirement(drawer, projectName = "") {
  258:   if (!isDrawerSourceRequired(drawer)) {
  259:     setDrawerSourceWarning(drawer, "");
  260:     return true;
  261:   }
  262: 
  263:   const source = getSelectedLibrarySource(projectName);
  264:   if (source?.name) {
  265:     setDrawerSourceWarning(drawer, "");
  266:     return true;
  267:   }
  268: 
  269:   setDrawerSourceWarning(
  270:     drawer,
  271:     "This prompt tool needs a trusted Library source first. Choose a source from Library, then return to prepare the composer prompt."
  272:   );
  273:   return false;
  274: }
  275: 
  276: export function applySharedAiSourceToDrawer(drawer, projectName = "") {
  277:   if (!drawer) return;
  278:   const source = getSelectedLibrarySource(projectName);
  279:   const selectedNode = drawer.querySelector("[data-aicmd-tool-drawer-selected-source]");
  280:   const sourceInput = drawer.querySelector("[data-aicmd-tool-drawer-source-details]");
  281:   const sourceSelect = drawer.querySelector("[data-aicmd-tool-drawer-source-select]");
  282: 
  283:   if (!source || !source.name) {
  284:     if (selectedNode) {
  285:       selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No trusted Library source selected yet.</span>`;
  286:     }
  287:     if (sourceInput && !sourceInput.value) {
  288:       sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  289:     }
  290:     validateDrawerSourceRequirement(drawer, projectName);
  291:     return;
  292:   }
  293: 
  294:   // Render compact selected source card
  295:   const { name, type, path } = formatSharedAiSource(source);
  296:   if (selectedNode) {
  297:     selectedNode.innerHTML = `
  298:       <div class=\"mhos-tool-drawer-source-card\">
  299:         <div class=\"mhos-tool-drawer-source-eyebrow\">Trusted AI context only</div>
  300:         <div class=\"mhos-tool-drawer-source-main\">${escapeHtml(name)}</div>
  301:         <div class=\"mhos-tool-drawer-source-meta\">${escapeHtml(type)} · Added from Library · Not approval or publish readiness</div>
  302:         ${path && path !== name ? `<div class=\"mhos-tool-drawer-source-path\" title=\"${escapeHtml(path)}\">${escapeHtml(path)}</div>` : ""}
  303:         <div class=\"mhos-tool-drawer-source-actions\">
  304:           <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-change-source>Change source</button>
  305:           <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-remove-source>Remove source</button>
  306:         </div>
  307:       </div>
  308:     `;
  309:   }
  310: 
  311:   // Set placeholder for Source Details if empty
  312:   if (sourceInput && !sourceInput.value) {
  313:     sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  314:   }
  315: 
  316:   // Set select value if possible
  317:   if (sourceSelect) {
  318:     const libraryOption = Array.from(sourceSelect.options || []).find((option) => {
  319:       const value = `${option.value || ""} ${option.textContent || ""}`;
  320:       return /library|source|asset|brand|product/i.test(value);
  321:     });
  322:     if (libraryOption) sourceSelect.value = libraryOption.value;
  323:   }
  324: 
  325:   // Attach actions
  326:   if (selectedNode) {
  327:     const changeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-change-source]');
  328:     if (changeBtn) {
  329:       changeBtn.onclick = () => {
  330:         drawer.querySelector('[data-aicmd-tool-drawer-open-library]')?.click();
  331:       };
  332:     }
  333:     const removeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-remove-source]');
  334:     if (removeBtn) {
  335:       removeBtn.onclick = () => {
  336:         clearSharedAiSource(projectName || "__default__");
  337:         clearSharedAiSource("__default__");
  338:         if (selectedNode) selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No trusted Library source selected yet.</span>`;
  339:         if (sourceInput) sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  340:         if (sourceSelect) sourceSelect.value = "";
  341:         validateDrawerSourceRequirement(drawer, projectName);
  342:       };
  343:     }
  344:   }
  345: 
  346:   validateDrawerSourceRequirement(drawer, projectName);
  347: }
  348: const BASE_TOOL_DOCK_TOOLS = [
  349:   {
  350:     id: "rewrite",
  351:     icon: "✍",
  352:     label: "Rewrite",
  353:     badge: "Text",
  354:     template: "Rewrite the latest response or selected text for {projectName}. Make it clearer, more professional, and easier to use. Do not publish or execute anything."
  355:   },
  356:   {
  357:     id: "translate",
  358:     icon: "🌍",
  359:     label: "Translate",
  360:     badge: "Market",
  361:     template: "Translate or adapt the selected text for the project target market. Keep the explanation in the user's chat language and prepare only review-ready copy."
  362:   },
  363:   {
  364:     id: "improve",
  365:     icon: "✨",
  366:     label: "Improve",
  367:     badge: "AI",
  368:     template: "Improve this draft for clarity, stronger value, better structure, and a cleaner CTA. Keep it safe and review-ready."
  369:   }
  370: ];
  371: 
  372: export const TOOL_DOCK_BY_SPECIALIST = {
  373:   strategist: [
  374:     {
  375:       id: "campaign-plan",
  376:       icon: "🎯",
  377:       label: "Campaign",
  378:       badge: "Plan",
  379:       actionType: "guided",
  380:       safetyLevel: "review_only",
  381:       frontendOwnerPage: "campaign-studio",
```

### Do not execute safeguards

```js
  274: }
  275: 
  276: export function applySharedAiSourceToDrawer(drawer, projectName = "") {
  277:   if (!drawer) return;
  278:   const source = getSelectedLibrarySource(projectName);
  279:   const selectedNode = drawer.querySelector("[data-aicmd-tool-drawer-selected-source]");
  280:   const sourceInput = drawer.querySelector("[data-aicmd-tool-drawer-source-details]");
  281:   const sourceSelect = drawer.querySelector("[data-aicmd-tool-drawer-source-select]");
  282: 
  283:   if (!source || !source.name) {
  284:     if (selectedNode) {
  285:       selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No trusted Library source selected yet.</span>`;
  286:     }
  287:     if (sourceInput && !sourceInput.value) {
  288:       sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  289:     }
  290:     validateDrawerSourceRequirement(drawer, projectName);
  291:     return;
  292:   }
  293: 
  294:   // Render compact selected source card
  295:   const { name, type, path } = formatSharedAiSource(source);
  296:   if (selectedNode) {
  297:     selectedNode.innerHTML = `
  298:       <div class=\"mhos-tool-drawer-source-card\">
  299:         <div class=\"mhos-tool-drawer-source-eyebrow\">Trusted AI context only</div>
  300:         <div class=\"mhos-tool-drawer-source-main\">${escapeHtml(name)}</div>
  301:         <div class=\"mhos-tool-drawer-source-meta\">${escapeHtml(type)} · Added from Library · Not approval or publish readiness</div>
  302:         ${path && path !== name ? `<div class=\"mhos-tool-drawer-source-path\" title=\"${escapeHtml(path)}\">${escapeHtml(path)}</div>` : ""}
  303:         <div class=\"mhos-tool-drawer-source-actions\">
  304:           <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-change-source>Change source</button>
  305:           <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-remove-source>Remove source</button>
  306:         </div>
  307:       </div>
  308:     `;
  309:   }
  310: 
  311:   // Set placeholder for Source Details if empty
  312:   if (sourceInput && !sourceInput.value) {
  313:     sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  314:   }
  315: 
  316:   // Set select value if possible
  317:   if (sourceSelect) {
  318:     const libraryOption = Array.from(sourceSelect.options || []).find((option) => {
  319:       const value = `${option.value || ""} ${option.textContent || ""}`;
  320:       return /library|source|asset|brand|product/i.test(value);
  321:     });
  322:     if (libraryOption) sourceSelect.value = libraryOption.value;
  323:   }
  324: 
  325:   // Attach actions
  326:   if (selectedNode) {
  327:     const changeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-change-source]');
  328:     if (changeBtn) {
  329:       changeBtn.onclick = () => {
  330:         drawer.querySelector('[data-aicmd-tool-drawer-open-library]')?.click();
  331:       };
  332:     }
  333:     const removeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-remove-source]');
  334:     if (removeBtn) {
  335:       removeBtn.onclick = () => {
  336:         clearSharedAiSource(projectName || "__default__");
  337:         clearSharedAiSource("__default__");
  338:         if (selectedNode) selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No trusted Library source selected yet.</span>`;
  339:         if (sourceInput) sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  340:         if (sourceSelect) sourceSelect.value = "";
  341:         validateDrawerSourceRequirement(drawer, projectName);
  342:       };
  343:     }
  344:   }
  345: 
  346:   validateDrawerSourceRequirement(drawer, projectName);
  347: }
  348: const BASE_TOOL_DOCK_TOOLS = [
  349:   {
  350:     id: "rewrite",
  351:     icon: "✍",
  352:     label: "Rewrite",
  353:     badge: "Text",
  354:     template: "Rewrite the latest response or selected text for {projectName}. Make it clearer, more professional, and easier to use. Do not publish or execute anything."
  355:   },
  356:   {
  357:     id: "translate",
  358:     icon: "🌍",
  359:     label: "Translate",
  360:     badge: "Market",
  361:     template: "Translate or adapt the selected text for the project target market. Keep the explanation in the user's chat language and prepare only review-ready copy."
  362:   },
  363:   {
  364:     id: "improve",
  365:     icon: "✨",
  366:     label: "Improve",
  367:     badge: "AI",
  368:     template: "Improve this draft for clarity, stronger value, better structure, and a cleaner CTA. Keep it safe and review-ready."
  369:   }
  370: ];
  371: 
  372: export const TOOL_DOCK_BY_SPECIALIST = {
  373:   strategist: [
  374:     {
  375:       id: "campaign-plan",
  376:       icon: "🎯",
  377:       label: "Campaign",
  378:       badge: "Plan",
  379:       actionType: "guided",
  380:       safetyLevel: "review_only",
  381:       frontendOwnerPage: "campaign-studio",
  382:       destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows"],
  383:       sourceTypes: ["current_chat", "campaign_notes", "market_notes", "audience_notes", "product_data", "library_source", "manual_input"],
  384:       outputTypes: ["campaign_plan", "campaign_brief", "channel_plan", "next_best_actions"],
  385:       template: "Create a campaign plan for {projectName}. Include objective, audience, offer, channels, phases, risks, and next best actions. Keep it review-ready only."
  386:     },
  387:     {
  388:       id: "launch-plan",
  389:       icon: "🚀",
  390:       label: "Launch",
  391:       badge: "Plan",
  392:       actionType: "guided",
  393:       safetyLevel: "review_only",
  394:       frontendOwnerPage: "campaign-studio",
  395:       destinations: ["chat-preview", "campaign-studio", "workflows", "publishing"],
  396:       sourceTypes: ["current_chat", "campaign_brief", "asset_requirements", "timeline_notes", "library_source", "manual_input"],
  397:       outputTypes: ["launch_plan", "readiness_plan", "timeline", "dependency_map"],
  398:       template: "Build a launch plan for {projectName}. Include timeline, required assets, owners, channels, readiness gaps, and safe next actions."
  399:     },
  400:     {
  401:       id: "audience",
  402:       icon: "◎",
  403:       label: "Audience",
  404:       badge: "Map",
  405:       actionType: "guided",
  406:       safetyLevel: "review_only",
  407:       frontendOwnerPage: "campaign-studio",
  408:       destinations: ["chat-preview", "campaign-studio", "content-studio", "insights"],
  409:       sourceTypes: ["current_chat", "market_notes", "customer_notes", "insights_report", "library_source", "manual_input"],
  410:       outputTypes: ["audience_map", "segment_notes", "objection_map", "message_angles"],
  411:       template: "Map the target audience for {projectName}. Include segments, needs, objections, buying triggers, and message angles."
  412:     },
  413:     {
  414:       id: "offer",
  415:       icon: "◆",
  416:       label: "Offer",
  417:       badge: "Value",
  418:       actionType: "guided",
  419:       safetyLevel: "review_only",
  420:       frontendOwnerPage: "campaign-studio",
  421:       destinations: ["chat-preview", "campaign-studio", "content-studio", "ads-manager"],
  422:       sourceTypes: ["current_chat", "product_data", "pricing_notes", "proof_points", "library_source", "manual_input"],
  423:       outputTypes: ["offer_brief", "value_proposition", "proof_points", "cta_options"],
  424:       template: "Create offer angles for {projectName}. Include value proposition, benefits, proof points, CTA ideas, and risk notes."
  425:     },
  426:     {
  427:       id: "funnel",
  428:       icon: "⌁",
  429:       label: "Funnel",
  430:       badge: "Flow",
  431:       actionType: "guided",
  432:       safetyLevel: "review_only",
  433:       frontendOwnerPage: "campaign-studio",
  434:       destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows", "publishing"],
```

### Destination handoff

```js
  301:         <div class=\"mhos-tool-drawer-source-meta\">${escapeHtml(type)} · Added from Library · Not approval or publish readiness</div>
  302:         ${path && path !== name ? `<div class=\"mhos-tool-drawer-source-path\" title=\"${escapeHtml(path)}\">${escapeHtml(path)}</div>` : ""}
  303:         <div class=\"mhos-tool-drawer-source-actions\">
  304:           <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-change-source>Change source</button>
  305:           <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-remove-source>Remove source</button>
  306:         </div>
  307:       </div>
  308:     `;
  309:   }
  310: 
  311:   // Set placeholder for Source Details if empty
  312:   if (sourceInput && !sourceInput.value) {
  313:     sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  314:   }
  315: 
  316:   // Set select value if possible
  317:   if (sourceSelect) {
  318:     const libraryOption = Array.from(sourceSelect.options || []).find((option) => {
  319:       const value = `${option.value || ""} ${option.textContent || ""}`;
  320:       return /library|source|asset|brand|product/i.test(value);
  321:     });
  322:     if (libraryOption) sourceSelect.value = libraryOption.value;
  323:   }
  324: 
  325:   // Attach actions
  326:   if (selectedNode) {
  327:     const changeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-change-source]');
  328:     if (changeBtn) {
  329:       changeBtn.onclick = () => {
  330:         drawer.querySelector('[data-aicmd-tool-drawer-open-library]')?.click();
  331:       };
  332:     }
  333:     const removeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-remove-source]');
  334:     if (removeBtn) {
  335:       removeBtn.onclick = () => {
  336:         clearSharedAiSource(projectName || "__default__");
  337:         clearSharedAiSource("__default__");
  338:         if (selectedNode) selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No trusted Library source selected yet.</span>`;
  339:         if (sourceInput) sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  340:         if (sourceSelect) sourceSelect.value = "";
  341:         validateDrawerSourceRequirement(drawer, projectName);
  342:       };
  343:     }
  344:   }
  345: 
  346:   validateDrawerSourceRequirement(drawer, projectName);
  347: }
  348: const BASE_TOOL_DOCK_TOOLS = [
  349:   {
  350:     id: "rewrite",
  351:     icon: "✍",
  352:     label: "Rewrite",
  353:     badge: "Text",
  354:     template: "Rewrite the latest response or selected text for {projectName}. Make it clearer, more professional, and easier to use. Do not publish or execute anything."
  355:   },
  356:   {
  357:     id: "translate",
  358:     icon: "🌍",
  359:     label: "Translate",
  360:     badge: "Market",
  361:     template: "Translate or adapt the selected text for the project target market. Keep the explanation in the user's chat language and prepare only review-ready copy."
  362:   },
  363:   {
  364:     id: "improve",
  365:     icon: "✨",
  366:     label: "Improve",
  367:     badge: "AI",
  368:     template: "Improve this draft for clarity, stronger value, better structure, and a cleaner CTA. Keep it safe and review-ready."
  369:   }
  370: ];
  371: 
  372: export const TOOL_DOCK_BY_SPECIALIST = {
  373:   strategist: [
  374:     {
  375:       id: "campaign-plan",
  376:       icon: "🎯",
  377:       label: "Campaign",
  378:       badge: "Plan",
  379:       actionType: "guided",
  380:       safetyLevel: "review_only",
  381:       frontendOwnerPage: "campaign-studio",
  382:       destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows"],
  383:       sourceTypes: ["current_chat", "campaign_notes", "market_notes", "audience_notes", "product_data", "library_source", "manual_input"],
  384:       outputTypes: ["campaign_plan", "campaign_brief", "channel_plan", "next_best_actions"],
  385:       template: "Create a campaign plan for {projectName}. Include objective, audience, offer, channels, phases, risks, and next best actions. Keep it review-ready only."
  386:     },
  387:     {
  388:       id: "launch-plan",
  389:       icon: "🚀",
  390:       label: "Launch",
  391:       badge: "Plan",
  392:       actionType: "guided",
  393:       safetyLevel: "review_only",
  394:       frontendOwnerPage: "campaign-studio",
  395:       destinations: ["chat-preview", "campaign-studio", "workflows", "publishing"],
  396:       sourceTypes: ["current_chat", "campaign_brief", "asset_requirements", "timeline_notes", "library_source", "manual_input"],
  397:       outputTypes: ["launch_plan", "readiness_plan", "timeline", "dependency_map"],
  398:       template: "Build a launch plan for {projectName}. Include timeline, required assets, owners, channels, readiness gaps, and safe next actions."
  399:     },
  400:     {
  401:       id: "audience",
  402:       icon: "◎",
  403:       label: "Audience",
  404:       badge: "Map",
  405:       actionType: "guided",
  406:       safetyLevel: "review_only",
  407:       frontendOwnerPage: "campaign-studio",
  408:       destinations: ["chat-preview", "campaign-studio", "content-studio", "insights"],
  409:       sourceTypes: ["current_chat", "market_notes", "customer_notes", "insights_report", "library_source", "manual_input"],
  410:       outputTypes: ["audience_map", "segment_notes", "objection_map", "message_angles"],
  411:       template: "Map the target audience for {projectName}. Include segments, needs, objections, buying triggers, and message angles."
  412:     },
  413:     {
  414:       id: "offer",
  415:       icon: "◆",
  416:       label: "Offer",
  417:       badge: "Value",
  418:       actionType: "guided",
  419:       safetyLevel: "review_only",
  420:       frontendOwnerPage: "campaign-studio",
  421:       destinations: ["chat-preview", "campaign-studio", "content-studio", "ads-manager"],
  422:       sourceTypes: ["current_chat", "product_data", "pricing_notes", "proof_points", "library_source", "manual_input"],
  423:       outputTypes: ["offer_brief", "value_proposition", "proof_points", "cta_options"],
  424:       template: "Create offer angles for {projectName}. Include value proposition, benefits, proof points, CTA ideas, and risk notes."
  425:     },
  426:     {
  427:       id: "funnel",
  428:       icon: "⌁",
  429:       label: "Funnel",
  430:       badge: "Flow",
  431:       actionType: "guided",
  432:       safetyLevel: "review_only",
  433:       frontendOwnerPage: "campaign-studio",
  434:       destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows", "publishing"],
  435:       sourceTypes: ["current_chat", "campaign_brief", "audience_notes", "content_inventory", "library_source", "manual_input"],
  436:       outputTypes: ["funnel_map", "content_needs", "handoff_points", "retention_notes"],
  437:       template: "Map a funnel for {projectName}. Include awareness, consideration, conversion, retention, content needs, and handoff points."
  438:     },
  439:     {
  440:       id: "priority",
  441:       icon: "✓",
  442:       label: "Priority",
  443:       badge: "Next",
  444:       actionType: "preview",
  445:       safetyLevel: "review_only",
  446:       frontendOwnerPage: "workflows",
  447:       destinations: ["chat-preview", "workflows", "task", "campaign-studio"],
  448:       sourceTypes: ["current_chat", "operations_snapshot", "readiness_gaps", "campaign_notes", "manual_input"],
  449:       outputTypes: ["next_best_action", "priority_list", "blocker_map", "action_sequence"],
  450:       template: "Prioritize the next best actions for {projectName}. Separate urgent, important, blocked, and later work."
  451:     }
  452:   ],
  453: 
  454:   writer: [
  455:     {
  456:       id: "write",
  457:       icon: "✍",
  458:       label: "Write",
  459:       badge: "Create",
  460:       actionType: "guided",
  461:       safetyLevel: "review_only",
```

### Action ids

```js
  270:     drawer,
  271:     "This prompt tool needs a trusted Library source first. Choose a source from Library, then return to prepare the composer prompt."
  272:   );
  273:   return false;
  274: }
  275: 
  276: export function applySharedAiSourceToDrawer(drawer, projectName = "") {
  277:   if (!drawer) return;
  278:   const source = getSelectedLibrarySource(projectName);
  279:   const selectedNode = drawer.querySelector("[data-aicmd-tool-drawer-selected-source]");
  280:   const sourceInput = drawer.querySelector("[data-aicmd-tool-drawer-source-details]");
  281:   const sourceSelect = drawer.querySelector("[data-aicmd-tool-drawer-source-select]");
  282: 
  283:   if (!source || !source.name) {
  284:     if (selectedNode) {
  285:       selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No trusted Library source selected yet.</span>`;
  286:     }
  287:     if (sourceInput && !sourceInput.value) {
  288:       sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  289:     }
  290:     validateDrawerSourceRequirement(drawer, projectName);
  291:     return;
  292:   }
  293: 
  294:   // Render compact selected source card
  295:   const { name, type, path } = formatSharedAiSource(source);
  296:   if (selectedNode) {
  297:     selectedNode.innerHTML = `
  298:       <div class=\"mhos-tool-drawer-source-card\">
  299:         <div class=\"mhos-tool-drawer-source-eyebrow\">Trusted AI context only</div>
  300:         <div class=\"mhos-tool-drawer-source-main\">${escapeHtml(name)}</div>
  301:         <div class=\"mhos-tool-drawer-source-meta\">${escapeHtml(type)} · Added from Library · Not approval or publish readiness</div>
  302:         ${path && path !== name ? `<div class=\"mhos-tool-drawer-source-path\" title=\"${escapeHtml(path)}\">${escapeHtml(path)}</div>` : ""}
  303:         <div class=\"mhos-tool-drawer-source-actions\">
  304:           <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-change-source>Change source</button>
  305:           <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-remove-source>Remove source</button>
  306:         </div>
  307:       </div>
  308:     `;
  309:   }
  310: 
  311:   // Set placeholder for Source Details if empty
  312:   if (sourceInput && !sourceInput.value) {
  313:     sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  314:   }
  315: 
  316:   // Set select value if possible
  317:   if (sourceSelect) {
  318:     const libraryOption = Array.from(sourceSelect.options || []).find((option) => {
  319:       const value = `${option.value || ""} ${option.textContent || ""}`;
  320:       return /library|source|asset|brand|product/i.test(value);
  321:     });
  322:     if (libraryOption) sourceSelect.value = libraryOption.value;
  323:   }
  324: 
  325:   // Attach actions
  326:   if (selectedNode) {
  327:     const changeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-change-source]');
  328:     if (changeBtn) {
  329:       changeBtn.onclick = () => {
  330:         drawer.querySelector('[data-aicmd-tool-drawer-open-library]')?.click();
  331:       };
  332:     }
  333:     const removeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-remove-source]');
  334:     if (removeBtn) {
  335:       removeBtn.onclick = () => {
  336:         clearSharedAiSource(projectName || "__default__");
  337:         clearSharedAiSource("__default__");
  338:         if (selectedNode) selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No trusted Library source selected yet.</span>`;
  339:         if (sourceInput) sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  340:         if (sourceSelect) sourceSelect.value = "";
  341:         validateDrawerSourceRequirement(drawer, projectName);
  342:       };
  343:     }
  344:   }
  345: 
  346:   validateDrawerSourceRequirement(drawer, projectName);
  347: }
  348: const BASE_TOOL_DOCK_TOOLS = [
  349:   {
  350:     id: "rewrite",
  351:     icon: "✍",
  352:     label: "Rewrite",
  353:     badge: "Text",
  354:     template: "Rewrite the latest response or selected text for {projectName}. Make it clearer, more professional, and easier to use. Do not publish or execute anything."
  355:   },
  356:   {
  357:     id: "translate",
  358:     icon: "🌍",
  359:     label: "Translate",
  360:     badge: "Market",
  361:     template: "Translate or adapt the selected text for the project target market. Keep the explanation in the user's chat language and prepare only review-ready copy."
  362:   },
  363:   {
  364:     id: "improve",
  365:     icon: "✨",
  366:     label: "Improve",
  367:     badge: "AI",
  368:     template: "Improve this draft for clarity, stronger value, better structure, and a cleaner CTA. Keep it safe and review-ready."
  369:   }
  370: ];
  371: 
  372: export const TOOL_DOCK_BY_SPECIALIST = {
  373:   strategist: [
  374:     {
  375:       id: "campaign-plan",
  376:       icon: "🎯",
  377:       label: "Campaign",
  378:       badge: "Plan",
  379:       actionType: "guided",
  380:       safetyLevel: "review_only",
  381:       frontendOwnerPage: "campaign-studio",
  382:       destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows"],
  383:       sourceTypes: ["current_chat", "campaign_notes", "market_notes", "audience_notes", "product_data", "library_source", "manual_input"],
  384:       outputTypes: ["campaign_plan", "campaign_brief", "channel_plan", "next_best_actions"],
  385:       template: "Create a campaign plan for {projectName}. Include objective, audience, offer, channels, phases, risks, and next best actions. Keep it review-ready only."
  386:     },
  387:     {
  388:       id: "launch-plan",
  389:       icon: "🚀",
  390:       label: "Launch",
  391:       badge: "Plan",
  392:       actionType: "guided",
  393:       safetyLevel: "review_only",
  394:       frontendOwnerPage: "campaign-studio",
  395:       destinations: ["chat-preview", "campaign-studio", "workflows", "publishing"],
  396:       sourceTypes: ["current_chat", "campaign_brief", "asset_requirements", "timeline_notes", "library_source", "manual_input"],
  397:       outputTypes: ["launch_plan", "readiness_plan", "timeline", "dependency_map"],
  398:       template: "Build a launch plan for {projectName}. Include timeline, required assets, owners, channels, readiness gaps, and safe next actions."
  399:     },
  400:     {
  401:       id: "audience",
  402:       icon: "◎",
  403:       label: "Audience",
  404:       badge: "Map",
  405:       actionType: "guided",
  406:       safetyLevel: "review_only",
  407:       frontendOwnerPage: "campaign-studio",
  408:       destinations: ["chat-preview", "campaign-studio", "content-studio", "insights"],
  409:       sourceTypes: ["current_chat", "market_notes", "customer_notes", "insights_report", "library_source", "manual_input"],
  410:       outputTypes: ["audience_map", "segment_notes", "objection_map", "message_angles"],
  411:       template: "Map the target audience for {projectName}. Include segments, needs, objections, buying triggers, and message angles."
  412:     },
  413:     {
  414:       id: "offer",
  415:       icon: "◆",
  416:       label: "Offer",
  417:       badge: "Value",
  418:       actionType: "guided",
  419:       safetyLevel: "review_only",
  420:       frontendOwnerPage: "campaign-studio",
  421:       destinations: ["chat-preview", "campaign-studio", "content-studio", "ads-manager"],
  422:       sourceTypes: ["current_chat", "product_data", "pricing_notes", "proof_points", "library_source", "manual_input"],
  423:       outputTypes: ["offer_brief", "value_proposition", "proof_points", "cta_options"],
  424:       template: "Create offer angles for {projectName}. Include value proposition, benefits, proof points, CTA ideas, and risk notes."
  425:     },
  426:     {
  427:       id: "funnel",
  428:       icon: "⌁",
  429:       label: "Funnel",
  430:       badge: "Flow",
```

### Event handlers

```js
  249: function sourceMetadataNeedsLibrarySource(rawValue = "") {
  250:   return /source_of_truth_assets|selected_asset|proof_doc|legal_doc|privacy_policy/i.test(String(rawValue || ""));
  251: }
  252: 
  253: function isDrawerSourceRequired(drawer) {
  254:   return drawer?.dataset?.sourceRequired === "true";
  255: }
  256: 
  257: function validateDrawerSourceRequirement(drawer, projectName = "") {
  258:   if (!isDrawerSourceRequired(drawer)) {
  259:     setDrawerSourceWarning(drawer, "");
  260:     return true;
  261:   }
  262: 
  263:   const source = getSelectedLibrarySource(projectName);
  264:   if (source?.name) {
  265:     setDrawerSourceWarning(drawer, "");
  266:     return true;
  267:   }
  268: 
  269:   setDrawerSourceWarning(
  270:     drawer,
  271:     "This prompt tool needs a trusted Library source first. Choose a source from Library, then return to prepare the composer prompt."
  272:   );
  273:   return false;
  274: }
  275: 
  276: export function applySharedAiSourceToDrawer(drawer, projectName = "") {
  277:   if (!drawer) return;
  278:   const source = getSelectedLibrarySource(projectName);
  279:   const selectedNode = drawer.querySelector("[data-aicmd-tool-drawer-selected-source]");
  280:   const sourceInput = drawer.querySelector("[data-aicmd-tool-drawer-source-details]");
  281:   const sourceSelect = drawer.querySelector("[data-aicmd-tool-drawer-source-select]");
  282: 
  283:   if (!source || !source.name) {
  284:     if (selectedNode) {
  285:       selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No trusted Library source selected yet.</span>`;
  286:     }
  287:     if (sourceInput && !sourceInput.value) {
  288:       sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  289:     }
  290:     validateDrawerSourceRequirement(drawer, projectName);
  291:     return;
  292:   }
  293: 
  294:   // Render compact selected source card
  295:   const { name, type, path } = formatSharedAiSource(source);
  296:   if (selectedNode) {
  297:     selectedNode.innerHTML = `
  298:       <div class=\"mhos-tool-drawer-source-card\">
  299:         <div class=\"mhos-tool-drawer-source-eyebrow\">Trusted AI context only</div>
  300:         <div class=\"mhos-tool-drawer-source-main\">${escapeHtml(name)}</div>
  301:         <div class=\"mhos-tool-drawer-source-meta\">${escapeHtml(type)} · Added from Library · Not approval or publish readiness</div>
  302:         ${path && path !== name ? `<div class=\"mhos-tool-drawer-source-path\" title=\"${escapeHtml(path)}\">${escapeHtml(path)}</div>` : ""}
  303:         <div class=\"mhos-tool-drawer-source-actions\">
  304:           <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-change-source>Change source</button>
  305:           <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-remove-source>Remove source</button>
  306:         </div>
  307:       </div>
  308:     `;
  309:   }
  310: 
  311:   // Set placeholder for Source Details if empty
  312:   if (sourceInput && !sourceInput.value) {
  313:     sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  314:   }
  315: 
  316:   // Set select value if possible
  317:   if (sourceSelect) {
  318:     const libraryOption = Array.from(sourceSelect.options || []).find((option) => {
  319:       const value = `${option.value || ""} ${option.textContent || ""}`;
  320:       return /library|source|asset|brand|product/i.test(value);
  321:     });
  322:     if (libraryOption) sourceSelect.value = libraryOption.value;
  323:   }
  324: 
  325:   // Attach actions
  326:   if (selectedNode) {
  327:     const changeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-change-source]');
  328:     if (changeBtn) {
  329:       changeBtn.onclick = () => {
  330:         drawer.querySelector('[data-aicmd-tool-drawer-open-library]')?.click();
  331:       };
  332:     }
  333:     const removeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-remove-source]');
  334:     if (removeBtn) {
  335:       removeBtn.onclick = () => {
  336:         clearSharedAiSource(projectName || "__default__");
  337:         clearSharedAiSource("__default__");
  338:         if (selectedNode) selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No trusted Library source selected yet.</span>`;
  339:         if (sourceInput) sourceInput.placeholder = "Optional: add source usage notes, audience, angle, or claims to avoid...";
  340:         if (sourceSelect) sourceSelect.value = "";
  341:         validateDrawerSourceRequirement(drawer, projectName);
  342:       };
  343:     }
  344:   }
  345: 
  346:   validateDrawerSourceRequirement(drawer, projectName);
  347: }
  348: const BASE_TOOL_DOCK_TOOLS = [
  349:   {
  350:     id: "rewrite",
  351:     icon: "✍",
  352:     label: "Rewrite",
  353:     badge: "Text",
  354:     template: "Rewrite the latest response or selected text for {projectName}. Make it clearer, more professional, and easier to use. Do not publish or execute anything."
  355:   },
  356:   {
  357:     id: "translate",
  358:     icon: "🌍",
  359:     label: "Translate",
  360:     badge: "Market",
  361:     template: "Translate or adapt the selected text for the project target market. Keep the explanation in the user's chat language and prepare only review-ready copy."
  362:   },
  363:   {
  364:     id: "improve",
  365:     icon: "✨",
  366:     label: "Improve",
  367:     badge: "AI",
  368:     template: "Improve this draft for clarity, stronger value, better structure, and a cleaner CTA. Keep it safe and review-ready."
  369:   }
  370: ];
  371: 
  372: export const TOOL_DOCK_BY_SPECIALIST = {
  373:   strategist: [
  374:     {
  375:       id: "campaign-plan",
  376:       icon: "🎯",
  377:       label: "Campaign",
  378:       badge: "Plan",
  379:       actionType: "guided",
  380:       safetyLevel: "review_only",
  381:       frontendOwnerPage: "campaign-studio",
  382:       destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows"],
  383:       sourceTypes: ["current_chat", "campaign_notes", "market_notes", "audience_notes", "product_data", "library_source", "manual_input"],
  384:       outputTypes: ["campaign_plan", "campaign_brief", "channel_plan", "next_best_actions"],
  385:       template: "Create a campaign plan for {projectName}. Include objective, audience, offer, channels, phases, risks, and next best actions. Keep it review-ready only."
  386:     },
  387:     {
  388:       id: "launch-plan",
  389:       icon: "🚀",
  390:       label: "Launch",
  391:       badge: "Plan",
  392:       actionType: "guided",
  393:       safetyLevel: "review_only",
  394:       frontendOwnerPage: "campaign-studio",
  395:       destinations: ["chat-preview", "campaign-studio", "workflows", "publishing"],
  396:       sourceTypes: ["current_chat", "campaign_brief", "asset_requirements", "timeline_notes", "library_source", "manual_input"],
  397:       outputTypes: ["launch_plan", "readiness_plan", "timeline", "dependency_map"],
  398:       template: "Build a launch plan for {projectName}. Include timeline, required assets, owners, channels, readiness gaps, and safe next actions."
  399:     },
  400:     {
  401:       id: "audience",
  402:       icon: "◎",
  403:       label: "Audience",
  404:       badge: "Map",
  405:       actionType: "guided",
  406:       safetyLevel: "review_only",
  407:       frontendOwnerPage: "campaign-studio",
  408:       destinations: ["chat-preview", "campaign-studio", "content-studio", "insights"],
  409:       sourceTypes: ["current_chat", "market_notes", "customer_notes", "insights_report", "library_source", "manual_input"],
```

### Backend/API calls

```js
_No match found._
```

### Window/navigation

```js
 1686:   input,
 1687:   session,
 1688:   projectName = "",
 1689:   persistSessionDraft,
 1690:   sessionKey,
 1691:   updateStatus
 1692: } = {}) {
 1693:   const drawer = root?.querySelector?.("[data-aicmd-tool-drawer]");
 1694:   const btn = createToolButtonAdapter(tool);
 1695: 
 1696:   return openToolDrawer({
 1697:     drawer,
 1698:     btn,
 1699:     tool,
 1700:     text: template || tool.template || tool.prompt || "",
 1701:     input,
 1702:     session,
 1703:     projectName,
 1704:     persistSessionDraft,
 1705:     sessionKey,
 1706:     updateStatus
 1707:   });
 1708: }
 1709: 
 1710: export function bindAiToolDock({
 1711:   root = document,
 1712:   session,
 1713:   input,
 1714:   projectName = "",
 1715:   aiContext = {},
 1716:   specialistLabel = "",
 1717:   persistSessionDraft,
 1718:   sessionKey,
 1719:   updateStatus
 1720: }) {
 1721:   if (!root || !session) return;
 1722: 
 1723:   const drawer = root.querySelector("[data-aicmd-tool-drawer]");
 1724: 
 1725:   Array.from(root.querySelectorAll("[data-aicmd-tool-drawer-close]")).forEach((btn) => {
 1726:     btn.onclick = () => closeToolDrawer(drawer);
 1727:   });
 1728: 
 1729:   const openLibraryBtn = root.querySelector("[data-aicmd-tool-drawer-open-library]");
 1730:   if (openLibraryBtn) {
 1731:     openLibraryBtn.onclick = () => {
 1732:       // Library Source Bridge workflow
 1733:       const project = projectName || "__default__";
 1734:       const drawerSourceSelect = root.querySelector("[data-aicmd-tool-drawer-source-select]");
 1735:       const selectedSourceType = drawerSourceSelect?.value || "auto";
 1736:       const mapping = getSourceTypeMapping(selectedSourceType);
 1737:       const drawerReturnContext = buildAiDrawerReturnContext({
 1738:         projectName: project,
 1739:         origin: "ai-command",
 1740:         drawerOpen: true,
 1741:         specialistId: drawer?.dataset?.specialistId || "",
 1742:         modeId: drawer?.dataset?.modeId || "",
 1743:         toolId: drawer?.dataset?.pendingTool || "",
 1744:         teamMode: session?.teamMode || "solo",
 1745:         sourceType: selectedSourceType,
 1746:         outputType: drawer?.querySelector?.("[data-aicmd-tool-drawer-output-select]")?.value || ""
 1747:       });
 1748: 
 1749:       const payload = {
 1750:         type: "library_source_selection",
 1751:         origin: "ai-command",
 1752:         returnTarget: "ai-command",
 1753:         sourceType: selectedSourceType,
 1754:         libraryFilter: mapping.libraryFilter,
 1755:         targetSection: "asset-workspace",
 1756:         drawerReturnContext,
 1757:         created_at: new Date().toISOString()
 1758:       };
 1759:       setSharedLibrarySourceBridge(project, payload);
 1760:       setSharedLibrarySourceBridge("__default__", payload);
 1761: 
 1762:       setSharedAiDrawerReturn(project, drawerReturnContext);
 1763:       setSharedAiDrawerReturn("__default__", drawerReturnContext);
 1764:       updateStatus?.("Library guide opened. Select an asset, click Use as Source in AI Command, then return to AI Command.");
 1765:       if (typeof window !== "undefined") {
 1766:         window.location.hash = "#library";
 1767:       }
 1768:     };
 1769:   }
 1770: 
 1771:   // Patch drawer population to apply source
 1772:   if (drawer) {
 1773:     applySharedAiSourceToDrawer(drawer, projectName);
 1774:   }
 1775: 
 1776:   const useBtn = root.querySelector("[data-aicmd-tool-drawer-use]");
 1777:   if (useBtn) {
 1778:     useBtn.onclick = () => {
 1779:       const template = drawer?.dataset?.pendingTemplate || "";
 1780:       const label = drawer?.dataset?.pendingTool || "tool";
 1781:       if (!template) return;
 1782:       if (!validateDrawerSourceRequirement(drawer, projectName)) {
 1783:         updateStatus?.("This prompt tool needs a trusted Library source first. Choose one from Library before continuing.");
 1784:         return;
 1785:       }
 1786: 
 1787:       const text = tokenReplace(
 1788:         buildSmartToolComposerPrompt({ drawer, baseTemplate: template, projectName }),
 1789:         {
 1790:           projectName,
 1791:           campaign: aiContext.campaign,
 1792:           specialistLabel: session.teamMode === "team" ? "Full Team" : specialistLabel || "active specialist"
 1793:         }
 1794:       );
 1795: 
 1796:       session.draftMessage = text;
 1797:       session.composerText = text;
 1798:       if (input) input.value = text;
 1799: 
 1800:       if (typeof persistSessionDraft === "function") {
 1801:         persistSessionDraft(sessionKey, session, `${label} drawer tool loaded`);
 1802:       }
 1803: 
 1804:       if (typeof updateStatus === "function") {
 1805:         updateStatus(`${label} prompt prepared in the composer. Review it, then ask or create a preview.`);
 1806:       }
 1807: 
 1808:       closeToolDrawer(drawer, input);
 1809:       input?.focus?.();
 1810:     };
 1811:   }
 1812: 
 1813: 
 1814:   Array.from(root.querySelectorAll("[data-aicmd-tool-dock]")).forEach((btn) => {
 1815:     btn.onclick = () => {
 1816:       const template = btn.getAttribute("data-aicmd-tool-dock-template") || "";
 1817:       const label = btn.getAttribute("data-aicmd-tool-dock") || "tool";
 1818:       const actionType = btn.getAttribute("data-aicmd-tool-dock-action") || "prefill";
 1819:       if (!template) return;
 1820: 
 1821:       if (actionType !== "prefill") {
 1822:         const tool = findToolMetadataById(label);
 1823:         const opened = openToolDrawer({
 1824:           drawer,
 1825:           btn,
 1826:           tool,
 1827:           text: template,
 1828:           input,
 1829:           session,
 1830:           projectName,
 1831:           persistSessionDraft,
 1832:           sessionKey,
 1833:           updateStatus
 1834:         });
 1835:         if (opened) return;
 1836:       }
 1837: 
 1838:       const text = tokenReplace(template, {
 1839:         projectName,
 1840:         campaign: aiContext.campaign,
 1841:         specialistLabel: session.teamMode === "team" ? "Full Team" : specialistLabel || "active specialist"
 1842:       });
 1843: 
 1844:       session.draftMessage = text;
 1845:       session.composerText = text;
 1846:       if (input) input.value = text;
```

### Dangerous direct actions

```js
  884:     },
  885:     {
  886:       id: "keywords",
  887:       icon: "⌕",
  888:       label: "Keywords",
  889:       badge: "SEO",
  890:       actionType: "guided",
  891:       safetyLevel: "review_only",
  892:       frontendOwnerPage: "insights",
  893:       destinations: ["chat-preview", "insights", "content-studio", "library"],
  894:       sourceTypes: ["topic", "market", "audience", "seo_brief", "library_source", "manual_input"],
  895:       outputTypes: ["keyword_groups", "commercial_keywords", "informational_keywords", "branded_keywords", "local_keywords"],
  896:       template: "Suggest keyword groups for {projectName}. Include commercial, informational, branded, product, and local intent clusters."
  897:     },
  898:     {
  899:       id: "performance",
  900:       icon: "↗",
  901:       label: "Performance",
  902:       badge: "Review",
  903:       actionType: "source_required",
  904:       safetyLevel: "review_only",
  905:       frontendOwnerPage: "insights",
  906:       destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
  907:       sourceTypes: ["analytics_summary", "performance_notes", "campaign_results", "content_inventory", "manual_input"],
  908:       outputTypes: ["performance_review", "wins", "risks", "experiment_recommendations"],
  909:       template: "Review performance signals for {projectName}. Identify wins, risks, gaps, and recommended next experiments."
  910:     },
  911:     {
  912:       id: "content-gap",
  913:       icon: "▥",
  914:       label: "Gaps",
  915:       badge: "Plan",
  916:       actionType: "guided",
  917:       safetyLevel: "review_only",
  918:       frontendOwnerPage: "insights",
  919:       destinations: ["chat-preview", "insights", "content-studio", "campaign-studio"],
  920:       sourceTypes: ["content_inventory", "seo_brief", "audience_notes", "competitor_notes", "library_source", "manual_input"],
  921:       outputTypes: ["content_gap_report", "missing_topics", "missing_pages", "priority_actions"],
  922:       template: "Identify content gaps for {projectName}. Include missing pages, missing topics, weak funnel stages, and priority actions."
  923:     }
  924:   ],
  925: 
  926:   compliance_reviewer: [
  927:     {
  928:       id: "claims-check",
  929:       icon: "🛡",
  930:       label: "Claims",
  931:       badge: "Check",
  932:       actionType: "source_required",
  933:       safetyLevel: "review_only",
  934:       frontendOwnerPage: "governance",
  935:       destinations: ["chat-preview", "governance", "content-studio", "publishing"],
  936:       sourceTypes: ["content_draft", "claim_list", "proof_doc", "product_data", "legal_doc", "manual_input"],
  937:       outputTypes: ["claims_check", "risk_flags", "proof_requirements", "safe_wording_notes"],
  938:       template: "Review claims for {projectName}. Flag unsupported, risky, health/performance, legal, or approval-sensitive statements."
  939:     },
  940:     {
  941:       id: "safe-rewrite",
  942:       icon: "♻",
  943:       label: "Safe Rewrite",
  944:       badge: "Copy",
  945:       actionType: "guided",
  946:       safetyLevel: "review_only",
  947:       frontendOwnerPage: "governance",
  948:       destinations: ["chat-preview", "governance", "content-studio"],
  949:       sourceTypes: ["content_draft", "claims_check", "legal_doc", "proof_doc", "manual_input"],
  950:       outputTypes: ["safe_rewrite", "risk_reduced_copy", "claim_softening", "review_notes"],
  951:       template: "Rewrite this content in a safer compliant way. Keep the value clear while reducing unsupported or risky claims."
  952:     },
  953:     {
  954:       id: "evidence",
  955:       icon: "📎",
  956:       label: "Evidence",
  957:       badge: "Need",
  958:       actionType: "source_required",
  959:       safetyLevel: "review_only",
  960:       frontendOwnerPage: "governance",
  961:       destinations: ["chat-preview", "governance", "library", "workflows"],
  962:       sourceTypes: ["content_draft", "claim_list", "product_data", "legal_doc", "research_proof_docs", "manual_input"],
  963:       outputTypes: ["evidence_needed", "required_proof", "recommended_proof", "optional_proof"],
  964:       template: "List the evidence needed before this content can be approved or published. Separate required, recommended, and optional proof."
  965:     },
  966:     {
  967:       id: "gdpr",
  968:       icon: "🔒",
  969:       label: "GDPR",
  970:       badge: "Review",
  971:       actionType: "source_required",
  972:       safetyLevel: "review_only",
  973:       frontendOwnerPage: "governance",
  974:       destinations: ["chat-preview", "governance", "workflows", "publishing"],
  975:       sourceTypes: ["workflow_draft", "privacy_policy", "tracking_plan", "data_use_notes", "manual_input"],
  976:       outputTypes: ["gdpr_review", "consent_risks", "tracking_notes", "disclosure_requirements"],
  977:       template: "Review GDPR/privacy considerations for this content or workflow. Flag consent, tracking, data use, and disclosure risks."
  978:     },
  979:     {
  980:       id: "approval-notes",
  981:       icon: "✓",
  982:       label: "Governance Notes",
  983:       badge: "Notes",
  984:       actionType: "source_required",
  985:       safetyLevel: "confirmation_required",
  986:       frontendOwnerPage: "governance",
  987:       destinations: ["chat-preview", "governance", "publishing", "workflows"],
  988:       sourceTypes: ["final_copy", "claims_check", "approval_context", "asset_checklist", "manual_input"],
  989:       outputTypes: ["approval_notes", "risk_summary", "reviewer_requirements", "unresolved_issues"],
  990:       template: "Prepare approval notes for {projectName}. Include risks, required reviewer, unresolved issues, and safe next actions."
  991:     }
  992:   ],
  993: 
  994:   operations: [
  995:     {
  996:       id: "task-plan",
  997:       icon: "☑",
  998:       label: "Task Plan",
  999:       badge: "Ops",
 1000:       actionType: "guided",
 1001:       safetyLevel: "review_only",
 1002:       frontendOwnerPage: "workflows",
 1003:       destinations: ["chat-preview", "workflows", "task", "content-studio", "media-studio"],
 1004:       sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "manual_input"],
 1005:       outputTypes: ["task_plan", "owner_map", "priority_list", "dependency_notes"],
 1006:       template: "Turn this into a task plan for {projectName}. Include owners, priorities, dependencies, risks, and next steps."
 1007:     },
 1008:     {
 1009:       id: "workflow",
 1010:       icon: "⚙",
 1011:       label: "Draft Workflow",
 1012:       badge: "Draft",
 1013:       actionType: "guided",
 1014:       safetyLevel: "confirmation_required",
 1015:       frontendOwnerPage: "workflows",
 1016:       destinations: ["chat-preview", "workflows", "task", "handoff"],
 1017:       sourceTypes: ["current_chat", "handoff_summary", "operations_snapshot", "approval_notes", "manual_input"],
 1018:       outputTypes: ["workflow_draft", "step_sequence", "trigger_notes", "review_gates", "execution_risks"],
 1019:       template: "Draft a workflow for {projectName}. Include steps, triggers, inputs, outputs, owners, review gates, and execution risks."
 1020:     },
 1021:     {
 1022:       id: "handoff",
 1023:       icon: "⇄",
 1024:       label: "Prepare Handoff",
 1025:       badge: "Route",
 1026:       actionType: "guided",
 1027:       safetyLevel: "confirmation_required",
 1028:       frontendOwnerPage: "workflows",
 1029:       destinations: ["chat-preview", "handoff", "workflows", "content-studio", "media-studio", "publishing", "governance"],
 1030:       sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "publishing_package", "manual_input"],
 1031:       outputTypes: ["handoff_summary", "destination_brief", "required_inputs", "review_notes"],
 1032:       template: "Prepare a handoff summary for {projectName}. Include context, destination workspace, owner, required inputs, and review notes."
 1033:     },
 1034:     {
 1035:       id: "timeline",
 1036:       icon: "⏱",
 1037:       label: "Timeline",
 1038:       badge: "Plan",
 1039:       actionType: "guided",
 1040:       safetyLevel: "review_only",
 1041:       frontendOwnerPage: "workflows",
 1042:       destinations: ["chat-preview", "workflows", "campaign-studio", "publishing"],
 1043:       sourceTypes: ["current_chat", "project_plan", "campaign_timeline", "dependency_notes", "manual_input"],
 1044:       outputTypes: ["timeline", "milestones", "blockers", "safe_sequence"],
```

### Copy defects candidates

```js
_No match found._
```


## Preliminary Verdict

| Area | Verdict |
|---|---|
| HTML rendering exists | Found - needs exact render safety review |
| Escaping evidence | Found |
| Do-not-execute safeguards | Found |
| Destination handoff model | Found |
| Direct backend/API calls | Not found |
| Dangerous direct project/provider actions | Not found |
| Copy defects candidates | Not found |

## Decision Guidance
- If Tool Dock only builds prompts/templates and routes destinations, no runtime authority patch is needed.
- If Tool Dock directly calls backend/project/provider actions, focused patch may be required.
- If innerHTML is limited to escaped/controlled local markup, no safety patch is needed.
- If copy defects are user-visible, schedule UX/copy polish after authority closeout.
- Do not patch from T26 alone.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
