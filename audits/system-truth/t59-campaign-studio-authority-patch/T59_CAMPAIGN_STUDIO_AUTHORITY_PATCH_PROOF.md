# T59 — Campaign Studio Authority Patch Proof

## Status
Patch proof.

## Target
- `public/control-center/pages/campaign-studio.js`

## Purpose
Verify that T58 added minimal authority protections for Campaign Studio backend writes and handoff creation.

## Exact Counts

| Area | Count |
|---|---:|
| confirmCampaignStudioAuthorityAction references | 5 |
| saveProjectCampaign calls | 2 |
| createProjectHandoff calls | 2 |
| autosave backend saveProjectCampaign pattern | 0 |
| local/session storage writes | 0 |

## Required Snippet Check

| Snippet | Present |
|---|---|
| function confirmCampaignStudioAuthorityAction | yes |
| Create campaign route handoff | yes |
| Campaign Studio autosave is local/shared-state only | yes |
| Save backend campaign draft | yes |
| Save backend campaign plan | yes |
| Create AI Command campaign handoff | yes |
| This does not publish, send externally, schedule ads, or approve anything automatically. | yes |

## Evidence

### Confirmation helper

```js
  410:     wave3Channels: firstNonEmpty(phaseValue(phases, 2, "channels"), session.values.wave3Channels),
  411:     assetChecklist: firstNonEmpty(joinPackageList(pkg.requiredAssets || pkg.required_assets), session.values.assetChecklist),
  412:     executionNotes: firstNonEmpty(
  413:       joinPackageList([
  414:         ...asArray(pkg.missingBlockers || pkg.missing_blockers || pkg.blockers),
  415:         ...asArray(pkg.nextActions || pkg.next_actions)
  416:       ]),
  417:       session.values.executionNotes
  418:     )
  419:   };
  420:   session.generatedPackages += 1;
  421:   session.lastAiHandoffId = handoffId;
  422:   setSharedCampaignRecord(projectName, {
  423:     ...(getSharedCampaignRecord(projectName, operations) || {}),
  424:     project: projectName,
  425:     source_page: "ai-command",
  426:     name: session.values.campaignName,
  427:     objective: session.values.campaignGoal,
  428:     audience: session.values.audiencePrimary,
  429:     channels: parseList(session.values.channelPlan),
  430:     offer: session.values.offerHeadline,
  431:     status: "draft",
  432:     form_values: { ...session.values },
  433:     updated_at: new Date().toISOString()
  434:   });
  435:   return true;
  436: }
  437: 
  438: function confirmCampaignStudioAuthorityAction(action, detail = "") {
  439:   if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
  440: 
  441:   const message = [
  442:     `Confirm Campaign Studio action: ${action}`,
  443:     "",
  444:     detail || "This action may create or update backend campaign records or route handoffs.",
  445:     "",
  446:     "Authority: This does not publish, send externally, schedule ads, or approve anything automatically.",
  447:     "Select Cancel to review the campaign plan, evidence, and destination before continuing."
  448:   ].join("\n");
  449: 
  450:   return window.confirm(message);
  451: }
  452: 
  453: function buildCampaignRecordPayload(projectName, session) {
  454:   const values = asObject(session.values);
  455:   const timeline = [asString(values.startDate), asString(values.endDate)].filter(Boolean).join(" to ");
  456: 
  457:   return {
  458:     id: session.recordId || undefined,
  459:     name: asString(values.campaignName || projectName),
  460:     objective: asString(values.campaignGoal),
  461:     audience: asString(values.audiencePrimary),
  462:     channels: asString(values.channelPlan),
  463:     offer: asString(values.offerHeadline),
  464:     timeline,
  465:     budget: asString(values.budget),
  466:     status: "draft",
```

### Route handoff confirmation

```js
  481:   if (!projectName || !destination) return;
  482: 
  483:   const handoff = {
  484:     source_page: "campaign-studio",
  485:     destination_page: destinationPage,
  486:     source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  487:     destination_role: destination.role,
  488:     source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  489:     destination_service_domain: destination.domain,
  490:     linked_entity: {
  491:       entity_type: "campaign",
  492:       entity_id: session.recordId || "",
  493:       route: "campaign-studio",
  494:       label: asString(session.values.campaignName || projectName)
  495:     },
  496:     payload: {
  497:       campaign_id: session.recordId || "",
  498:       campaign_name: asString(session.values.campaignName || projectName),
  499:       owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  500:       review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  501:       service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  502:       draft_context: buildCampaignRecordPayload(projectName, session)
  503:     }
  504:   };
  505: 
  506:   setSharedHandoff(projectName, destinationPage, handoff);
  507: 
  508:   if (!confirmCampaignStudioAuthorityAction(
  509:     "Create campaign route handoff",
  510:     `This will create a backend handoff from Campaign Studio to ${destinationPage} for review and execution preparation.`
  511:   )) {
  512:     return;
  513:   }
  514: 
  515:   createProjectHandoff?.(projectName, handoff).catch((error) => {
  516:     console.warn("Failed to persist campaign route handoff:", error.message);
  517:   });
  518: }
  519: 
  520: function scheduleCampaignPersistence(projectName, session, saveProjectCampaign) {
  521:   if (!projectName || typeof saveProjectCampaign !== "function") {
  522:     return;
  523:   }
  524: 
  525:   const key = projectName || "__default__";
  526:   const existing = campaignSaveTimers.get(key);
  527:   if (existing) {
  528:     clearTimeout(existing);
  529:   }
  530: 
  531:   const timer = setTimeout(() => {
  532:     const draft = {
  533:       ...buildCampaignRecordPayload(projectName, session),
  534:       local_only: true,
  535:       autosave_note: "Campaign Studio autosave is local/shared-state only. Use Save campaign draft or Save campaign plan for backend persistence."
  536:     };
  537:     setSharedCampaignRecord(projectName, draft);
```

### Autosave local/shared-state only

```js
  507: 
  508:   if (!confirmCampaignStudioAuthorityAction(
  509:     "Create campaign route handoff",
  510:     `This will create a backend handoff from Campaign Studio to ${destinationPage} for review and execution preparation.`
  511:   )) {
  512:     return;
  513:   }
  514: 
  515:   createProjectHandoff?.(projectName, handoff).catch((error) => {
  516:     console.warn("Failed to persist campaign route handoff:", error.message);
  517:   });
  518: }
  519: 
  520: function scheduleCampaignPersistence(projectName, session, saveProjectCampaign) {
  521:   if (!projectName || typeof saveProjectCampaign !== "function") {
  522:     return;
  523:   }
  524: 
  525:   const key = projectName || "__default__";
  526:   const existing = campaignSaveTimers.get(key);
  527:   if (existing) {
  528:     clearTimeout(existing);
  529:   }
  530: 
  531:   const timer = setTimeout(() => {
  532:     const draft = {
  533:       ...buildCampaignRecordPayload(projectName, session),
  534:       local_only: true,
  535:       autosave_note: "Campaign Studio autosave is local/shared-state only. Use Save campaign draft or Save campaign plan for backend persistence."
  536:     };
  537:     setSharedCampaignRecord(projectName, draft);
  538:   }, 250);
  539: 
  540:   campaignSaveTimers.set(key, timer);
  541: }
  542: 
  543: function renderEmptyState(title, description, escapeHtml) {
  544:   return `
  545:     <div class="campaign-studio-empty-state">
  546:       <strong>${escapeHtml(title)}</strong>
  547:       <p>${escapeHtml(description)}</p>
  548:     </div>
  549:   `;
  550: }
  551: 
  552: function renderIntelligenceList(items, escapeHtml, title, description) {
  553:   if (!items.length) {
  554:     return renderEmptyState(title, description, escapeHtml);
  555:   }
  556: 
  557:   return `
  558:     <div class="insights-mini-list">
  559:       ${items.map((item) => `
  560:         <div class="insights-mini-item">
  561:           <strong>${escapeHtml(item.title || item.label || "Signal")}</strong>
  562:           <span>${escapeHtml(item.body || item.meta || item.description || "-")}</span>
  563:         </div>
```

### Save draft confirmation

```js
 1280:     session.values = hydrateValuesFromCampaignRecord(session.values, durableCampaign);
 1281:   }
 1282:   applyAiCampaignHandoff(projectName, state.data.operations, session);
 1283:   syncCampaignStudioBridge(projectName, session.values);
 1284: 
 1285:   const form = $("campaignStudioForm");
 1286:   if (form) {
 1287:     form.oninput = (event) => {
 1288:       const target = event.target;
 1289:       if (!target?.name) return;
 1290: 
 1291:       session.values[target.name] = target.value || "";
 1292:       syncCampaignStudioBridge(projectName, session.values);
 1293:       scheduleCampaignPersistence(projectName, session, saveProjectCampaign);
 1294: 
 1295:       // Do not rerender on every keystroke.
 1296:       // Rerendering here replaces the focused input and breaks typing/focus.
 1297:       // Explicit actions such as Save, Build, Refresh, and route handoffs still
 1298:       // persist the latest session values.
 1299:     };
 1300:   }
 1301: 
 1302:   const saveBtn = $("campaignSaveDraftBtn");
 1303:   if (saveBtn) {
 1304:     saveBtn.onclick = async () => {
 1305:       syncCampaignStudioBridge(projectName, session.values);
 1306: 
 1307:       if (!confirmCampaignStudioAuthorityAction(
 1308:         "Save backend campaign draft",
 1309:         `This will save or update the Campaign Studio draft for ${projectName}.`
 1310:       )) {
 1311:         showMessage?.("Campaign draft save cancelled.");
 1312:         return;
 1313:       }
 1314: 
 1315:       try {
 1316:         const result = await saveProjectCampaign?.(projectName, buildCampaignRecordPayload(projectName, session));
 1317:         if (result?.campaign?.id) {
 1318:           session.recordId = result.campaign.id;
 1319:           setSharedCampaignRecord(projectName, result.campaign);
 1320:         }
 1321:         showMessage?.("Campaign draft saved to the shared operating backbone.");
 1322:       } catch (error) {
 1323:         showError?.(error.message || "Failed to save campaign plan.");
 1324:       }
 1325:     };
 1326:   }
 1327: 
 1328:   const buildBtn = $("campaignBuildPlanBtn");
 1329:   if (buildBtn) {
 1330:     buildBtn.onclick = async () => {
 1331:       syncCampaignStudioBridge(projectName, session.values);
 1332: 
 1333:       if (!confirmCampaignStudioAuthorityAction(
 1334:         "Save backend campaign plan",
 1335:         `This will save or update the Campaign Studio plan for ${projectName}.`
 1336:       )) {
```

### Save plan confirmation

```js
 1306: 
 1307:       if (!confirmCampaignStudioAuthorityAction(
 1308:         "Save backend campaign draft",
 1309:         `This will save or update the Campaign Studio draft for ${projectName}.`
 1310:       )) {
 1311:         showMessage?.("Campaign draft save cancelled.");
 1312:         return;
 1313:       }
 1314: 
 1315:       try {
 1316:         const result = await saveProjectCampaign?.(projectName, buildCampaignRecordPayload(projectName, session));
 1317:         if (result?.campaign?.id) {
 1318:           session.recordId = result.campaign.id;
 1319:           setSharedCampaignRecord(projectName, result.campaign);
 1320:         }
 1321:         showMessage?.("Campaign draft saved to the shared operating backbone.");
 1322:       } catch (error) {
 1323:         showError?.(error.message || "Failed to save campaign plan.");
 1324:       }
 1325:     };
 1326:   }
 1327: 
 1328:   const buildBtn = $("campaignBuildPlanBtn");
 1329:   if (buildBtn) {
 1330:     buildBtn.onclick = async () => {
 1331:       syncCampaignStudioBridge(projectName, session.values);
 1332: 
 1333:       if (!confirmCampaignStudioAuthorityAction(
 1334:         "Save backend campaign plan",
 1335:         `This will save or update the Campaign Studio plan for ${projectName}.`
 1336:       )) {
 1337:         showMessage?.("Campaign plan save cancelled.");
 1338:         return;
 1339:       }
 1340: 
 1341:       try {
 1342:         const result = await saveProjectCampaign?.(projectName, {
 1343:           ...buildCampaignRecordPayload(projectName, session),
 1344:           status: "planned"
 1345:         });
 1346:         if (result?.campaign?.id) {
 1347:           session.recordId = result.campaign.id;
 1348:           setSharedCampaignRecord(projectName, result.campaign);
 1349:         }
 1350:         showMessage?.("Campaign plan saved as a durable shared record.");
 1351:       } catch (error) {
 1352:         showError?.(error.message || "Failed to structure the campaign plan.");
 1353:       }
 1354:     };
 1355:   }
 1356: 
 1357:   const askAiBtn = $("campaignAskAiBtn");
 1358:   if (askAiBtn) {
 1359:     askAiBtn.onclick = async () => {
 1360:       const prompt = `Build an execution plan for campaign ${session.values.campaignName || "this campaign"} with goal ${session.values.campaignGoal || "launch"}, channels ${session.values.channelPlan || "to be defined"}, and offer ${session.values.offerHeadline || "to be defined"}. Use current project intelligence, readiness blockers, and recommendation signals.`;
 1361:       const input = $("quickCommandInput");
 1362:       if (input) {
```

### AI Command handoff confirmation

```js
 1349:         }
 1350:         showMessage?.("Campaign plan saved as a durable shared record.");
 1351:       } catch (error) {
 1352:         showError?.(error.message || "Failed to structure the campaign plan.");
 1353:       }
 1354:     };
 1355:   }
 1356: 
 1357:   const askAiBtn = $("campaignAskAiBtn");
 1358:   if (askAiBtn) {
 1359:     askAiBtn.onclick = async () => {
 1360:       const prompt = `Build an execution plan for campaign ${session.values.campaignName || "this campaign"} with goal ${session.values.campaignGoal || "launch"}, channels ${session.values.channelPlan || "to be defined"}, and offer ${session.values.offerHeadline || "to be defined"}. Use current project intelligence, readiness blockers, and recommendation signals.`;
 1361:       const input = $("quickCommandInput");
 1362:       if (input) {
 1363:         input.value = prompt;
 1364:       }
 1365:       setSharedHandoff(projectName, "ai-command", {
 1366:         source_page: "campaign-studio",
 1367:         destination_page: "ai-command",
 1368:         payload: {
 1369:           prompt,
 1370:           campaign_id: session.recordId || "",
 1371:           campaign_name: session.values.campaignName || projectName,
 1372:           draft_context: buildCampaignRecordPayload(projectName, session)
 1373:         },
 1374:         status: "available"
 1375:       });
 1376:       if (!confirmCampaignStudioAuthorityAction(
 1377:         "Create AI Command campaign handoff",
 1378:         "This will create a backend handoff from Campaign Studio to AI Command for review and planning support."
 1379:       )) {
 1380:         showMessage?.("AI Command handoff cancelled.");
 1381:         return;
 1382:       }
 1383: 
 1384:       createProjectHandoff?.(projectName, {
 1385:         source_page: "campaign-studio",
 1386:         destination_page: "ai-command",
 1387:         source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
 1388:         destination_role: CAMPAIGN_ROUTE_ROLES["ai-command"].role,
 1389:         source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
 1390:         destination_service_domain: CAMPAIGN_ROUTE_ROLES["ai-command"].domain,
 1391:         linked_entity: {
 1392:           entity_type: "campaign",
 1393:           entity_id: session.recordId || ""
 1394:         },
 1395:         payload: {
 1396:           prompt,
 1397:           campaign_id: session.recordId || "",
 1398:           campaign_name: session.values.campaignName || projectName,
 1399:           owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
 1400:           review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
 1401:           service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
 1402:           draft_context: buildCampaignRecordPayload(projectName, session)
 1403:         }
 1404:       }).catch((error) => {
 1405:         console.warn("Failed to persist campaign handoff:", error.message);
```


## Verdict
Patch proof complete. Campaign Studio backend save and handoff paths are confirmation-gated, and autosave no longer performs backend persistence.

## What Changed
- Added Campaign Studio authority confirmation helper.
- Added confirmation before route handoff backend creation.
- Changed autosave to local/shared-state projection only.
- Added confirmation before backend campaign draft save.
- Added confirmation before backend campaign plan save.
- Added confirmation before AI Command backend handoff creation.

## What Did Not Change
- No CSS changed.
- No backend code changed.
- No data/projects changed.
- No direct publishing/sending/ad scheduling/approval was added.
