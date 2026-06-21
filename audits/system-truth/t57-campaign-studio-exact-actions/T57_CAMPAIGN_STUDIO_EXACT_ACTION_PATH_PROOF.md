# T57 — Campaign Studio Exact Action Path Proof

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/campaign-studio.js

## Purpose
T56 found Campaign Studio API/write/action signals and zero confirmation gates. T57 verifies exact action paths before any patch:
- campaign save/build actions
- backend campaign mutation
- handoff creation
- intelligence refresh/read-only calls
- route-only actions
- publishing/send/ad labels
- shared context writes

## Exact Counts

| Area | First Line | Count |
|---|---:|---:|
| Function signature / injected APIs | 464 | 38 |
| saveProjectCampaign calls | 510 | 1 |
| createProjectHandoff calls | n/a | 0 |
| fetchProjectInsights calls | 1207 | 1 |
| fetchProjectLearning calls | 1208 | 1 |
| Shared campaign writes | 1 | 6 |
| Shared handoff writes | 1 | 3 |
| Local/session storage writes | n/a | 0 |
| Campaign save/build buttons | 1283 | 4 |
| Refresh intelligence button | 1429 | 2 |
| Route/action buttons | 325 | 37 |
| Publishing/send/ad labels | 17 | 137 |
| Confirmation gates | n/a | 0 |
| Disabled/review-only safety copy | 1 | 116 |
| Copy defect candidates | n/a | 0 |

## Focused Evidence

### Function signature / injected APIs

#### Match 1 — line 464

```js
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
  438: function buildCampaignRecordPayload(projectName, session) {
  439:   const values = asObject(session.values);
  440:   const timeline = [asString(values.startDate), asString(values.endDate)].filter(Boolean).join(" to ");
  441: 
  442:   return {
  443:     id: session.recordId || undefined,
  444:     name: asString(values.campaignName || projectName),
  445:     objective: asString(values.campaignGoal),
  446:     audience: asString(values.audiencePrimary),
  447:     channels: asString(values.channelPlan),
  448:     offer: asString(values.offerHeadline),
  449:     timeline,
  450:     budget: asString(values.budget),
  451:     status: "draft",
  452:     source_page: "campaign-studio",
  453:     owner: "Strategist",
  454:     owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  455:     review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  456:     service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  457:     linked_assets: [],
  458:     linked_tasks: [],
  459:     linked_approvals: [],
  460:     form_values: { ...values }
  461:   };
  462: }
  463: 
  464: function persistCampaignRouteHandoff({ projectName, session, destinationPage, createProjectHandoff }) {
  465:   const destination = CAMPAIGN_ROUTE_ROLES[destinationPage];
  466:   if (!projectName || !destination) return;
  467: 
  468:   const handoff = {
  469:     source_page: "campaign-studio",
  470:     destination_page: destinationPage,
  471:     source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  472:     destination_role: destination.role,
  473:     source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  474:     destination_service_domain: destination.domain,
  475:     linked_entity: {
  476:       entity_type: "campaign",
  477:       entity_id: session.recordId || "",
  478:       route: "campaign-studio",
  479:       label: asString(session.values.campaignName || projectName)
  480:     },
  481:     payload: {
  482:       campaign_id: session.recordId || "",
  483:       campaign_name: asString(session.values.campaignName || projectName),
  484:       owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  485:       review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  486:       service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  487:       draft_context: buildCampaignRecordPayload(projectName, session)
  488:     }
  489:   };
  490: 
  491:   setSharedHandoff(projectName, destinationPage, handoff);
  492:   createProjectHandoff?.(projectName, handoff).catch((error) => {
  493:     console.warn("Failed to persist campaign route handoff:", error.message);
  494:   });
  495: }
  496: 
  497: function scheduleCampaignPersistence(projectName, session, saveProjectCampaign) {
  498:   if (!projectName || typeof saveProjectCampaign !== "function") {
  499:     return;
  500:   }
  501: 
  502:   const key = projectName || "__default__";
  503:   const existing = campaignSaveTimers.get(key);
  504:   if (existing) {
  505:     clearTimeout(existing);
  506:   }
  507: 
  508:   const timer = setTimeout(async () => {
  509:     try {
```

#### Match 2 — line 492

```js
  447:     channels: asString(values.channelPlan),
  448:     offer: asString(values.offerHeadline),
  449:     timeline,
  450:     budget: asString(values.budget),
  451:     status: "draft",
  452:     source_page: "campaign-studio",
  453:     owner: "Strategist",
  454:     owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  455:     review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  456:     service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  457:     linked_assets: [],
  458:     linked_tasks: [],
  459:     linked_approvals: [],
  460:     form_values: { ...values }
  461:   };
  462: }
  463: 
  464: function persistCampaignRouteHandoff({ projectName, session, destinationPage, createProjectHandoff }) {
  465:   const destination = CAMPAIGN_ROUTE_ROLES[destinationPage];
  466:   if (!projectName || !destination) return;
  467: 
  468:   const handoff = {
  469:     source_page: "campaign-studio",
  470:     destination_page: destinationPage,
  471:     source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  472:     destination_role: destination.role,
  473:     source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  474:     destination_service_domain: destination.domain,
  475:     linked_entity: {
  476:       entity_type: "campaign",
  477:       entity_id: session.recordId || "",
  478:       route: "campaign-studio",
  479:       label: asString(session.values.campaignName || projectName)
  480:     },
  481:     payload: {
  482:       campaign_id: session.recordId || "",
  483:       campaign_name: asString(session.values.campaignName || projectName),
  484:       owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  485:       review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  486:       service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  487:       draft_context: buildCampaignRecordPayload(projectName, session)
  488:     }
  489:   };
  490: 
  491:   setSharedHandoff(projectName, destinationPage, handoff);
  492:   createProjectHandoff?.(projectName, handoff).catch((error) => {
  493:     console.warn("Failed to persist campaign route handoff:", error.message);
  494:   });
  495: }
  496: 
  497: function scheduleCampaignPersistence(projectName, session, saveProjectCampaign) {
  498:   if (!projectName || typeof saveProjectCampaign !== "function") {
  499:     return;
  500:   }
  501: 
  502:   const key = projectName || "__default__";
  503:   const existing = campaignSaveTimers.get(key);
  504:   if (existing) {
  505:     clearTimeout(existing);
  506:   }
  507: 
  508:   const timer = setTimeout(async () => {
  509:     try {
  510:       const result = await saveProjectCampaign(projectName, buildCampaignRecordPayload(projectName, session));
  511:       const campaign = result?.campaign || null;
  512:       if (campaign?.id) {
  513:         session.recordId = campaign.id;
  514:         setSharedCampaignRecord(projectName, campaign);
  515:       }
  516:     } catch (error) {
  517:       console.warn("Failed to persist campaign draft:", error.message);
  518:     }
  519:   }, 250);
  520: 
  521:   campaignSaveTimers.set(key, timer);
  522: }
  523: 
  524: function renderEmptyState(title, description, escapeHtml) {
  525:   return `
  526:     <div class="campaign-studio-empty-state">
  527:       <strong>${escapeHtml(title)}</strong>
  528:       <p>${escapeHtml(description)}</p>
  529:     </div>
  530:   `;
  531: }
  532: 
  533: function renderIntelligenceList(items, escapeHtml, title, description) {
  534:   if (!items.length) {
  535:     return renderEmptyState(title, description, escapeHtml);
  536:   }
  537: 
```

#### Match 3 — line 497

```js
  452:     source_page: "campaign-studio",
  453:     owner: "Strategist",
  454:     owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  455:     review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  456:     service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  457:     linked_assets: [],
  458:     linked_tasks: [],
  459:     linked_approvals: [],
  460:     form_values: { ...values }
  461:   };
  462: }
  463: 
  464: function persistCampaignRouteHandoff({ projectName, session, destinationPage, createProjectHandoff }) {
  465:   const destination = CAMPAIGN_ROUTE_ROLES[destinationPage];
  466:   if (!projectName || !destination) return;
  467: 
  468:   const handoff = {
  469:     source_page: "campaign-studio",
  470:     destination_page: destinationPage,
  471:     source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  472:     destination_role: destination.role,
  473:     source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  474:     destination_service_domain: destination.domain,
  475:     linked_entity: {
  476:       entity_type: "campaign",
  477:       entity_id: session.recordId || "",
  478:       route: "campaign-studio",
  479:       label: asString(session.values.campaignName || projectName)
  480:     },
  481:     payload: {
  482:       campaign_id: session.recordId || "",
  483:       campaign_name: asString(session.values.campaignName || projectName),
  484:       owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  485:       review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  486:       service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  487:       draft_context: buildCampaignRecordPayload(projectName, session)
  488:     }
  489:   };
  490: 
  491:   setSharedHandoff(projectName, destinationPage, handoff);
  492:   createProjectHandoff?.(projectName, handoff).catch((error) => {
  493:     console.warn("Failed to persist campaign route handoff:", error.message);
  494:   });
  495: }
  496: 
  497: function scheduleCampaignPersistence(projectName, session, saveProjectCampaign) {
  498:   if (!projectName || typeof saveProjectCampaign !== "function") {
  499:     return;
  500:   }
  501: 
  502:   const key = projectName || "__default__";
  503:   const existing = campaignSaveTimers.get(key);
  504:   if (existing) {
  505:     clearTimeout(existing);
  506:   }
  507: 
  508:   const timer = setTimeout(async () => {
  509:     try {
  510:       const result = await saveProjectCampaign(projectName, buildCampaignRecordPayload(projectName, session));
  511:       const campaign = result?.campaign || null;
  512:       if (campaign?.id) {
  513:         session.recordId = campaign.id;
  514:         setSharedCampaignRecord(projectName, campaign);
  515:       }
  516:     } catch (error) {
  517:       console.warn("Failed to persist campaign draft:", error.message);
  518:     }
  519:   }, 250);
  520: 
  521:   campaignSaveTimers.set(key, timer);
  522: }
  523: 
  524: function renderEmptyState(title, description, escapeHtml) {
  525:   return `
  526:     <div class="campaign-studio-empty-state">
  527:       <strong>${escapeHtml(title)}</strong>
  528:       <p>${escapeHtml(description)}</p>
  529:     </div>
  530:   `;
  531: }
  532: 
  533: function renderIntelligenceList(items, escapeHtml, title, description) {
  534:   if (!items.length) {
  535:     return renderEmptyState(title, description, escapeHtml);
  536:   }
  537: 
  538:   return `
  539:     <div class="insights-mini-list">
  540:       ${items.map((item) => `
  541:         <div class="insights-mini-item">
  542:           <strong>${escapeHtml(item.title || item.label || "Signal")}</strong>
```

#### Match 4 — line 498

```js
  453:     owner: "Strategist",
  454:     owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  455:     review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  456:     service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  457:     linked_assets: [],
  458:     linked_tasks: [],
  459:     linked_approvals: [],
  460:     form_values: { ...values }
  461:   };
  462: }
  463: 
  464: function persistCampaignRouteHandoff({ projectName, session, destinationPage, createProjectHandoff }) {
  465:   const destination = CAMPAIGN_ROUTE_ROLES[destinationPage];
  466:   if (!projectName || !destination) return;
  467: 
  468:   const handoff = {
  469:     source_page: "campaign-studio",
  470:     destination_page: destinationPage,
  471:     source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  472:     destination_role: destination.role,
  473:     source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  474:     destination_service_domain: destination.domain,
  475:     linked_entity: {
  476:       entity_type: "campaign",
  477:       entity_id: session.recordId || "",
  478:       route: "campaign-studio",
  479:       label: asString(session.values.campaignName || projectName)
  480:     },
  481:     payload: {
  482:       campaign_id: session.recordId || "",
  483:       campaign_name: asString(session.values.campaignName || projectName),
  484:       owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  485:       review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  486:       service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  487:       draft_context: buildCampaignRecordPayload(projectName, session)
  488:     }
  489:   };
  490: 
  491:   setSharedHandoff(projectName, destinationPage, handoff);
  492:   createProjectHandoff?.(projectName, handoff).catch((error) => {
  493:     console.warn("Failed to persist campaign route handoff:", error.message);
  494:   });
  495: }
  496: 
  497: function scheduleCampaignPersistence(projectName, session, saveProjectCampaign) {
  498:   if (!projectName || typeof saveProjectCampaign !== "function") {
  499:     return;
  500:   }
  501: 
  502:   const key = projectName || "__default__";
  503:   const existing = campaignSaveTimers.get(key);
  504:   if (existing) {
  505:     clearTimeout(existing);
  506:   }
  507: 
  508:   const timer = setTimeout(async () => {
  509:     try {
  510:       const result = await saveProjectCampaign(projectName, buildCampaignRecordPayload(projectName, session));
  511:       const campaign = result?.campaign || null;
  512:       if (campaign?.id) {
  513:         session.recordId = campaign.id;
  514:         setSharedCampaignRecord(projectName, campaign);
  515:       }
  516:     } catch (error) {
  517:       console.warn("Failed to persist campaign draft:", error.message);
  518:     }
  519:   }, 250);
  520: 
  521:   campaignSaveTimers.set(key, timer);
  522: }
  523: 
  524: function renderEmptyState(title, description, escapeHtml) {
  525:   return `
  526:     <div class="campaign-studio-empty-state">
  527:       <strong>${escapeHtml(title)}</strong>
  528:       <p>${escapeHtml(description)}</p>
  529:     </div>
  530:   `;
  531: }
  532: 
  533: function renderIntelligenceList(items, escapeHtml, title, description) {
  534:   if (!items.length) {
  535:     return renderEmptyState(title, description, escapeHtml);
  536:   }
  537: 
  538:   return `
  539:     <div class="insights-mini-list">
  540:       ${items.map((item) => `
  541:         <div class="insights-mini-item">
  542:           <strong>${escapeHtml(item.title || item.label || "Signal")}</strong>
  543:           <span>${escapeHtml(item.body || item.meta || item.description || "-")}</span>
```

#### Match 5 — line 510

```js
  465:   const destination = CAMPAIGN_ROUTE_ROLES[destinationPage];
  466:   if (!projectName || !destination) return;
  467: 
  468:   const handoff = {
  469:     source_page: "campaign-studio",
  470:     destination_page: destinationPage,
  471:     source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  472:     destination_role: destination.role,
  473:     source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  474:     destination_service_domain: destination.domain,
  475:     linked_entity: {
  476:       entity_type: "campaign",
  477:       entity_id: session.recordId || "",
  478:       route: "campaign-studio",
  479:       label: asString(session.values.campaignName || projectName)
  480:     },
  481:     payload: {
  482:       campaign_id: session.recordId || "",
  483:       campaign_name: asString(session.values.campaignName || projectName),
  484:       owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  485:       review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  486:       service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  487:       draft_context: buildCampaignRecordPayload(projectName, session)
  488:     }
  489:   };
  490: 
  491:   setSharedHandoff(projectName, destinationPage, handoff);
  492:   createProjectHandoff?.(projectName, handoff).catch((error) => {
  493:     console.warn("Failed to persist campaign route handoff:", error.message);
  494:   });
  495: }
  496: 
  497: function scheduleCampaignPersistence(projectName, session, saveProjectCampaign) {
  498:   if (!projectName || typeof saveProjectCampaign !== "function") {
  499:     return;
  500:   }
  501: 
  502:   const key = projectName || "__default__";
  503:   const existing = campaignSaveTimers.get(key);
  504:   if (existing) {
  505:     clearTimeout(existing);
  506:   }
  507: 
  508:   const timer = setTimeout(async () => {
  509:     try {
  510:       const result = await saveProjectCampaign(projectName, buildCampaignRecordPayload(projectName, session));
  511:       const campaign = result?.campaign || null;
  512:       if (campaign?.id) {
  513:         session.recordId = campaign.id;
  514:         setSharedCampaignRecord(projectName, campaign);
  515:       }
  516:     } catch (error) {
  517:       console.warn("Failed to persist campaign draft:", error.message);
  518:     }
  519:   }, 250);
  520: 
  521:   campaignSaveTimers.set(key, timer);
  522: }
  523: 
  524: function renderEmptyState(title, description, escapeHtml) {
  525:   return `
  526:     <div class="campaign-studio-empty-state">
  527:       <strong>${escapeHtml(title)}</strong>
  528:       <p>${escapeHtml(description)}</p>
  529:     </div>
  530:   `;
  531: }
  532: 
  533: function renderIntelligenceList(items, escapeHtml, title, description) {
  534:   if (!items.length) {
  535:     return renderEmptyState(title, description, escapeHtml);
  536:   }
  537: 
  538:   return `
  539:     <div class="insights-mini-list">
  540:       ${items.map((item) => `
  541:         <div class="insights-mini-item">
  542:           <strong>${escapeHtml(item.title || item.label || "Signal")}</strong>
  543:           <span>${escapeHtml(item.body || item.meta || item.description || "-")}</span>
  544:         </div>
  545:       `).join("")}
  546:     </div>
  547:   `;
  548: }
  549: 
  550: function getInsightSource(state, session) {
  551:   const activity = asObject(state.data.activity);
  552:   const overview = asObject(state.data.overview);
  553:   const fetchedInsights = asObject(session.intelligence?.insights);
  554:   const fetchedLearning = asObject(session.intelligence?.learning);
  555: 
```

#### Match 6 — line 1194

```js
 1149: }
 1150: 
 1151: function renderChannelRecommendationCards(items, escapeHtml) {
 1152:   if (!items.length) {
 1153:     return renderEmptyState(
 1154:       "No recommendation yet",
 1155:       "Connect more intelligence or lock the campaign inputs to tighten the channel recommendation.",
 1156:       escapeHtml
 1157:     );
 1158:   }
 1159: 
 1160:   return `
 1161:     <div class="campaign-channel-card-list">
 1162:       ${items.map((item) => `
 1163:         <div class="campaign-channel-card">
 1164:           <div class="campaign-channel-head">
 1165:             <strong>${escapeHtml(item.label)}</strong>
 1166:             <span class="card-badge ${item.confidence === "High" ? "success" : item.confidence === "Medium" ? "warning" : "neutral"}">${escapeHtml(item.confidence)}</span>
 1167:           </div>
 1168:           <p>${escapeHtml(item.rationale)}</p>
 1169:         </div>
 1170:       `).join("")}
 1171:     </div>
 1172:   `;
 1173: }
 1174: 
 1175: function renderBlockerGroup(title, items, escapeHtml, emptyBody) {
 1176:   return `
 1177:     <div class="campaign-readiness-block">
 1178:       <div class="campaign-readiness-head">
 1179:         <strong>${escapeHtml(title)}</strong>
 1180:         <span class="card-badge ${items.length ? "danger" : "success"}">${escapeHtml(items.length ? `${items.length} open` : "Clear")}</span>
 1181:       </div>
 1182:       ${
 1183:         items.length
 1184:           ? `<ul class="simple-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
 1185:           : `<div class="setup-helper">${escapeHtml(emptyBody)}</div>`
 1186:       }
 1187:     </div>
 1188:   `;
 1189: }
 1190: 
 1191: function startIntelligenceHydration({
 1192:   session,
 1193:   projectName,
 1194:   fetchProjectInsights,
 1195:   fetchProjectLearning,
 1196:   render,
 1197:   showError
 1198: }) {
 1199:   if (!projectName) return;
 1200:   if (session.intelligence.status === "loading" || session.intelligence.status === "loaded") return;
 1201:   if (typeof fetchProjectInsights !== "function" && typeof fetchProjectLearning !== "function") return;
 1202: 
 1203:   session.intelligence.status = "loading";
 1204:   session.intelligence.error = "";
 1205: 
 1206:   Promise.allSettled([
 1207:     typeof fetchProjectInsights === "function" ? fetchProjectInsights(projectName) : Promise.resolve(null),
 1208:     typeof fetchProjectLearning === "function" ? fetchProjectLearning(projectName) : Promise.resolve(null)
 1209:   ])
 1210:     .then(([insightsResult, learningResult]) => {
 1211:       const insightsMissing = insightsResult?.status === "rejected" && isMissingIntelligenceError(insightsResult.reason);
 1212:       const learningMissing = learningResult?.status === "rejected" && isMissingIntelligenceError(learningResult.reason);
 1213:       const insights = insightsResult?.status === "fulfilled"
 1214:         ? insightsResult.value
 1215:         : (insightsMissing ? { project: projectName, generated_at: new Date().toISOString(), data_coverage: {} } : null);
 1216:       const learning = learningResult?.status === "fulfilled"
 1217:         ? learningResult.value
 1218:         : (learningMissing ? { project: projectName, generated_at: new Date().toISOString(), learning_patterns: {}, recommendations: [] } : null);
 1219:       const errors = [
 1220:         insightsResult?.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
 1221:         learningResult?.status === "rejected" && !learningMissing ? learningResult.reason?.message : ""
 1222:       ].filter(Boolean);
 1223: 
 1224:       session.intelligence.status = (insights || learning) ? "loaded" : "error";
 1225:       session.intelligence.insights = insights;
 1226:       session.intelligence.learning = learning;
 1227:       session.intelligence.error = errors.join(" • ");
 1228: 
 1229:       if (session.intelligence.status === "error" && session.intelligence.error) {
 1230:         showError?.(`Campaign intelligence could not be refreshed: ${session.intelligence.error}`);
 1231:       }
 1232: 
 1233:       render();
 1234:     })
 1235:     .catch((error) => {
 1236:       session.intelligence.status = "error";
 1237:       session.intelligence.error = error?.message || "Failed to load campaign intelligence";
 1238:       showError?.(session.intelligence.error);
 1239:       render();
```

#### Match 7 — line 1195

```js
 1150: 
 1151: function renderChannelRecommendationCards(items, escapeHtml) {
 1152:   if (!items.length) {
 1153:     return renderEmptyState(
 1154:       "No recommendation yet",
 1155:       "Connect more intelligence or lock the campaign inputs to tighten the channel recommendation.",
 1156:       escapeHtml
 1157:     );
 1158:   }
 1159: 
 1160:   return `
 1161:     <div class="campaign-channel-card-list">
 1162:       ${items.map((item) => `
 1163:         <div class="campaign-channel-card">
 1164:           <div class="campaign-channel-head">
 1165:             <strong>${escapeHtml(item.label)}</strong>
 1166:             <span class="card-badge ${item.confidence === "High" ? "success" : item.confidence === "Medium" ? "warning" : "neutral"}">${escapeHtml(item.confidence)}</span>
 1167:           </div>
 1168:           <p>${escapeHtml(item.rationale)}</p>
 1169:         </div>
 1170:       `).join("")}
 1171:     </div>
 1172:   `;
 1173: }
 1174: 
 1175: function renderBlockerGroup(title, items, escapeHtml, emptyBody) {
 1176:   return `
 1177:     <div class="campaign-readiness-block">
 1178:       <div class="campaign-readiness-head">
 1179:         <strong>${escapeHtml(title)}</strong>
 1180:         <span class="card-badge ${items.length ? "danger" : "success"}">${escapeHtml(items.length ? `${items.length} open` : "Clear")}</span>
 1181:       </div>
 1182:       ${
 1183:         items.length
 1184:           ? `<ul class="simple-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
 1185:           : `<div class="setup-helper">${escapeHtml(emptyBody)}</div>`
 1186:       }
 1187:     </div>
 1188:   `;
 1189: }
 1190: 
 1191: function startIntelligenceHydration({
 1192:   session,
 1193:   projectName,
 1194:   fetchProjectInsights,
 1195:   fetchProjectLearning,
 1196:   render,
 1197:   showError
 1198: }) {
 1199:   if (!projectName) return;
 1200:   if (session.intelligence.status === "loading" || session.intelligence.status === "loaded") return;
 1201:   if (typeof fetchProjectInsights !== "function" && typeof fetchProjectLearning !== "function") return;
 1202: 
 1203:   session.intelligence.status = "loading";
 1204:   session.intelligence.error = "";
 1205: 
 1206:   Promise.allSettled([
 1207:     typeof fetchProjectInsights === "function" ? fetchProjectInsights(projectName) : Promise.resolve(null),
 1208:     typeof fetchProjectLearning === "function" ? fetchProjectLearning(projectName) : Promise.resolve(null)
 1209:   ])
 1210:     .then(([insightsResult, learningResult]) => {
 1211:       const insightsMissing = insightsResult?.status === "rejected" && isMissingIntelligenceError(insightsResult.reason);
 1212:       const learningMissing = learningResult?.status === "rejected" && isMissingIntelligenceError(learningResult.reason);
 1213:       const insights = insightsResult?.status === "fulfilled"
 1214:         ? insightsResult.value
 1215:         : (insightsMissing ? { project: projectName, generated_at: new Date().toISOString(), data_coverage: {} } : null);
 1216:       const learning = learningResult?.status === "fulfilled"
 1217:         ? learningResult.value
 1218:         : (learningMissing ? { project: projectName, generated_at: new Date().toISOString(), learning_patterns: {}, recommendations: [] } : null);
 1219:       const errors = [
 1220:         insightsResult?.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
 1221:         learningResult?.status === "rejected" && !learningMissing ? learningResult.reason?.message : ""
 1222:       ].filter(Boolean);
 1223: 
 1224:       session.intelligence.status = (insights || learning) ? "loaded" : "error";
 1225:       session.intelligence.insights = insights;
 1226:       session.intelligence.learning = learning;
 1227:       session.intelligence.error = errors.join(" • ");
 1228: 
 1229:       if (session.intelligence.status === "error" && session.intelligence.error) {
 1230:         showError?.(`Campaign intelligence could not be refreshed: ${session.intelligence.error}`);
 1231:       }
 1232: 
 1233:       render();
 1234:     })
 1235:     .catch((error) => {
 1236:       session.intelligence.status = "error";
 1237:       session.intelligence.error = error?.message || "Failed to load campaign intelligence";
 1238:       showError?.(session.intelligence.error);
 1239:       render();
 1240:     });
```

#### Match 8 — line 1201

```js
 1156:       escapeHtml
 1157:     );
 1158:   }
 1159: 
 1160:   return `
 1161:     <div class="campaign-channel-card-list">
 1162:       ${items.map((item) => `
 1163:         <div class="campaign-channel-card">
 1164:           <div class="campaign-channel-head">
 1165:             <strong>${escapeHtml(item.label)}</strong>
 1166:             <span class="card-badge ${item.confidence === "High" ? "success" : item.confidence === "Medium" ? "warning" : "neutral"}">${escapeHtml(item.confidence)}</span>
 1167:           </div>
 1168:           <p>${escapeHtml(item.rationale)}</p>
 1169:         </div>
 1170:       `).join("")}
 1171:     </div>
 1172:   `;
 1173: }
 1174: 
 1175: function renderBlockerGroup(title, items, escapeHtml, emptyBody) {
 1176:   return `
 1177:     <div class="campaign-readiness-block">
 1178:       <div class="campaign-readiness-head">
 1179:         <strong>${escapeHtml(title)}</strong>
 1180:         <span class="card-badge ${items.length ? "danger" : "success"}">${escapeHtml(items.length ? `${items.length} open` : "Clear")}</span>
 1181:       </div>
 1182:       ${
 1183:         items.length
 1184:           ? `<ul class="simple-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
 1185:           : `<div class="setup-helper">${escapeHtml(emptyBody)}</div>`
 1186:       }
 1187:     </div>
 1188:   `;
 1189: }
 1190: 
 1191: function startIntelligenceHydration({
 1192:   session,
 1193:   projectName,
 1194:   fetchProjectInsights,
 1195:   fetchProjectLearning,
 1196:   render,
 1197:   showError
 1198: }) {
 1199:   if (!projectName) return;
 1200:   if (session.intelligence.status === "loading" || session.intelligence.status === "loaded") return;
 1201:   if (typeof fetchProjectInsights !== "function" && typeof fetchProjectLearning !== "function") return;
 1202: 
 1203:   session.intelligence.status = "loading";
 1204:   session.intelligence.error = "";
 1205: 
 1206:   Promise.allSettled([
 1207:     typeof fetchProjectInsights === "function" ? fetchProjectInsights(projectName) : Promise.resolve(null),
 1208:     typeof fetchProjectLearning === "function" ? fetchProjectLearning(projectName) : Promise.resolve(null)
 1209:   ])
 1210:     .then(([insightsResult, learningResult]) => {
 1211:       const insightsMissing = insightsResult?.status === "rejected" && isMissingIntelligenceError(insightsResult.reason);
 1212:       const learningMissing = learningResult?.status === "rejected" && isMissingIntelligenceError(learningResult.reason);
 1213:       const insights = insightsResult?.status === "fulfilled"
 1214:         ? insightsResult.value
 1215:         : (insightsMissing ? { project: projectName, generated_at: new Date().toISOString(), data_coverage: {} } : null);
 1216:       const learning = learningResult?.status === "fulfilled"
 1217:         ? learningResult.value
 1218:         : (learningMissing ? { project: projectName, generated_at: new Date().toISOString(), learning_patterns: {}, recommendations: [] } : null);
 1219:       const errors = [
 1220:         insightsResult?.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
 1221:         learningResult?.status === "rejected" && !learningMissing ? learningResult.reason?.message : ""
 1222:       ].filter(Boolean);
 1223: 
 1224:       session.intelligence.status = (insights || learning) ? "loaded" : "error";
 1225:       session.intelligence.insights = insights;
 1226:       session.intelligence.learning = learning;
 1227:       session.intelligence.error = errors.join(" • ");
 1228: 
 1229:       if (session.intelligence.status === "error" && session.intelligence.error) {
 1230:         showError?.(`Campaign intelligence could not be refreshed: ${session.intelligence.error}`);
 1231:       }
 1232: 
 1233:       render();
 1234:     })
 1235:     .catch((error) => {
 1236:       session.intelligence.status = "error";
 1237:       session.intelligence.error = error?.message || "Failed to load campaign intelligence";
 1238:       showError?.(session.intelligence.error);
 1239:       render();
 1240:     });
 1241: }
 1242: 
 1243: function bindCampaignStudio({
 1244:   $,
 1245:   getState,
 1246:   navigateTo,
```

#### Match 9 — line 1207

```js
 1162:       ${items.map((item) => `
 1163:         <div class="campaign-channel-card">
 1164:           <div class="campaign-channel-head">
 1165:             <strong>${escapeHtml(item.label)}</strong>
 1166:             <span class="card-badge ${item.confidence === "High" ? "success" : item.confidence === "Medium" ? "warning" : "neutral"}">${escapeHtml(item.confidence)}</span>
 1167:           </div>
 1168:           <p>${escapeHtml(item.rationale)}</p>
 1169:         </div>
 1170:       `).join("")}
 1171:     </div>
 1172:   `;
 1173: }
 1174: 
 1175: function renderBlockerGroup(title, items, escapeHtml, emptyBody) {
 1176:   return `
 1177:     <div class="campaign-readiness-block">
 1178:       <div class="campaign-readiness-head">
 1179:         <strong>${escapeHtml(title)}</strong>
 1180:         <span class="card-badge ${items.length ? "danger" : "success"}">${escapeHtml(items.length ? `${items.length} open` : "Clear")}</span>
 1181:       </div>
 1182:       ${
 1183:         items.length
 1184:           ? `<ul class="simple-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
 1185:           : `<div class="setup-helper">${escapeHtml(emptyBody)}</div>`
 1186:       }
 1187:     </div>
 1188:   `;
 1189: }
 1190: 
 1191: function startIntelligenceHydration({
 1192:   session,
 1193:   projectName,
 1194:   fetchProjectInsights,
 1195:   fetchProjectLearning,
 1196:   render,
 1197:   showError
 1198: }) {
 1199:   if (!projectName) return;
 1200:   if (session.intelligence.status === "loading" || session.intelligence.status === "loaded") return;
 1201:   if (typeof fetchProjectInsights !== "function" && typeof fetchProjectLearning !== "function") return;
 1202: 
 1203:   session.intelligence.status = "loading";
 1204:   session.intelligence.error = "";
 1205: 
 1206:   Promise.allSettled([
 1207:     typeof fetchProjectInsights === "function" ? fetchProjectInsights(projectName) : Promise.resolve(null),
 1208:     typeof fetchProjectLearning === "function" ? fetchProjectLearning(projectName) : Promise.resolve(null)
 1209:   ])
 1210:     .then(([insightsResult, learningResult]) => {
 1211:       const insightsMissing = insightsResult?.status === "rejected" && isMissingIntelligenceError(insightsResult.reason);
 1212:       const learningMissing = learningResult?.status === "rejected" && isMissingIntelligenceError(learningResult.reason);
 1213:       const insights = insightsResult?.status === "fulfilled"
 1214:         ? insightsResult.value
 1215:         : (insightsMissing ? { project: projectName, generated_at: new Date().toISOString(), data_coverage: {} } : null);
 1216:       const learning = learningResult?.status === "fulfilled"
 1217:         ? learningResult.value
 1218:         : (learningMissing ? { project: projectName, generated_at: new Date().toISOString(), learning_patterns: {}, recommendations: [] } : null);
 1219:       const errors = [
 1220:         insightsResult?.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
 1221:         learningResult?.status === "rejected" && !learningMissing ? learningResult.reason?.message : ""
 1222:       ].filter(Boolean);
 1223: 
 1224:       session.intelligence.status = (insights || learning) ? "loaded" : "error";
 1225:       session.intelligence.insights = insights;
 1226:       session.intelligence.learning = learning;
 1227:       session.intelligence.error = errors.join(" • ");
 1228: 
 1229:       if (session.intelligence.status === "error" && session.intelligence.error) {
 1230:         showError?.(`Campaign intelligence could not be refreshed: ${session.intelligence.error}`);
 1231:       }
 1232: 
 1233:       render();
 1234:     })
 1235:     .catch((error) => {
 1236:       session.intelligence.status = "error";
 1237:       session.intelligence.error = error?.message || "Failed to load campaign intelligence";
 1238:       showError?.(session.intelligence.error);
 1239:       render();
 1240:     });
 1241: }
 1242: 
 1243: function bindCampaignStudio({
 1244:   $,
 1245:   getState,
 1246:   navigateTo,
 1247:   showMessage,
 1248:   showError,
 1249:   render,
 1250:   fetchProjectInsights,
 1251:   fetchProjectLearning,
 1252:   saveProjectCampaign,
```

#### Match 10 — line 1208

```js
 1163:         <div class="campaign-channel-card">
 1164:           <div class="campaign-channel-head">
 1165:             <strong>${escapeHtml(item.label)}</strong>
 1166:             <span class="card-badge ${item.confidence === "High" ? "success" : item.confidence === "Medium" ? "warning" : "neutral"}">${escapeHtml(item.confidence)}</span>
 1167:           </div>
 1168:           <p>${escapeHtml(item.rationale)}</p>
 1169:         </div>
 1170:       `).join("")}
 1171:     </div>
 1172:   `;
 1173: }
 1174: 
 1175: function renderBlockerGroup(title, items, escapeHtml, emptyBody) {
 1176:   return `
 1177:     <div class="campaign-readiness-block">
 1178:       <div class="campaign-readiness-head">
 1179:         <strong>${escapeHtml(title)}</strong>
 1180:         <span class="card-badge ${items.length ? "danger" : "success"}">${escapeHtml(items.length ? `${items.length} open` : "Clear")}</span>
 1181:       </div>
 1182:       ${
 1183:         items.length
 1184:           ? `<ul class="simple-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
 1185:           : `<div class="setup-helper">${escapeHtml(emptyBody)}</div>`
 1186:       }
 1187:     </div>
 1188:   `;
 1189: }
 1190: 
 1191: function startIntelligenceHydration({
 1192:   session,
 1193:   projectName,
 1194:   fetchProjectInsights,
 1195:   fetchProjectLearning,
 1196:   render,
 1197:   showError
 1198: }) {
 1199:   if (!projectName) return;
 1200:   if (session.intelligence.status === "loading" || session.intelligence.status === "loaded") return;
 1201:   if (typeof fetchProjectInsights !== "function" && typeof fetchProjectLearning !== "function") return;
 1202: 
 1203:   session.intelligence.status = "loading";
 1204:   session.intelligence.error = "";
 1205: 
 1206:   Promise.allSettled([
 1207:     typeof fetchProjectInsights === "function" ? fetchProjectInsights(projectName) : Promise.resolve(null),
 1208:     typeof fetchProjectLearning === "function" ? fetchProjectLearning(projectName) : Promise.resolve(null)
 1209:   ])
 1210:     .then(([insightsResult, learningResult]) => {
 1211:       const insightsMissing = insightsResult?.status === "rejected" && isMissingIntelligenceError(insightsResult.reason);
 1212:       const learningMissing = learningResult?.status === "rejected" && isMissingIntelligenceError(learningResult.reason);
 1213:       const insights = insightsResult?.status === "fulfilled"
 1214:         ? insightsResult.value
 1215:         : (insightsMissing ? { project: projectName, generated_at: new Date().toISOString(), data_coverage: {} } : null);
 1216:       const learning = learningResult?.status === "fulfilled"
 1217:         ? learningResult.value
 1218:         : (learningMissing ? { project: projectName, generated_at: new Date().toISOString(), learning_patterns: {}, recommendations: [] } : null);
 1219:       const errors = [
 1220:         insightsResult?.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
 1221:         learningResult?.status === "rejected" && !learningMissing ? learningResult.reason?.message : ""
 1222:       ].filter(Boolean);
 1223: 
 1224:       session.intelligence.status = (insights || learning) ? "loaded" : "error";
 1225:       session.intelligence.insights = insights;
 1226:       session.intelligence.learning = learning;
 1227:       session.intelligence.error = errors.join(" • ");
 1228: 
 1229:       if (session.intelligence.status === "error" && session.intelligence.error) {
 1230:         showError?.(`Campaign intelligence could not be refreshed: ${session.intelligence.error}`);
 1231:       }
 1232: 
 1233:       render();
 1234:     })
 1235:     .catch((error) => {
 1236:       session.intelligence.status = "error";
 1237:       session.intelligence.error = error?.message || "Failed to load campaign intelligence";
 1238:       showError?.(session.intelligence.error);
 1239:       render();
 1240:     });
 1241: }
 1242: 
 1243: function bindCampaignStudio({
 1244:   $,
 1245:   getState,
 1246:   navigateTo,
 1247:   showMessage,
 1248:   showError,
 1249:   render,
 1250:   fetchProjectInsights,
 1251:   fetchProjectLearning,
 1252:   saveProjectCampaign,
 1253:   createProjectHandoff
```

#### Match 11 — line 1250

```js
 1205: 
 1206:   Promise.allSettled([
 1207:     typeof fetchProjectInsights === "function" ? fetchProjectInsights(projectName) : Promise.resolve(null),
 1208:     typeof fetchProjectLearning === "function" ? fetchProjectLearning(projectName) : Promise.resolve(null)
 1209:   ])
 1210:     .then(([insightsResult, learningResult]) => {
 1211:       const insightsMissing = insightsResult?.status === "rejected" && isMissingIntelligenceError(insightsResult.reason);
 1212:       const learningMissing = learningResult?.status === "rejected" && isMissingIntelligenceError(learningResult.reason);
 1213:       const insights = insightsResult?.status === "fulfilled"
 1214:         ? insightsResult.value
 1215:         : (insightsMissing ? { project: projectName, generated_at: new Date().toISOString(), data_coverage: {} } : null);
 1216:       const learning = learningResult?.status === "fulfilled"
 1217:         ? learningResult.value
 1218:         : (learningMissing ? { project: projectName, generated_at: new Date().toISOString(), learning_patterns: {}, recommendations: [] } : null);
 1219:       const errors = [
 1220:         insightsResult?.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
 1221:         learningResult?.status === "rejected" && !learningMissing ? learningResult.reason?.message : ""
 1222:       ].filter(Boolean);
 1223: 
 1224:       session.intelligence.status = (insights || learning) ? "loaded" : "error";
 1225:       session.intelligence.insights = insights;
 1226:       session.intelligence.learning = learning;
 1227:       session.intelligence.error = errors.join(" • ");
 1228: 
 1229:       if (session.intelligence.status === "error" && session.intelligence.error) {
 1230:         showError?.(`Campaign intelligence could not be refreshed: ${session.intelligence.error}`);
 1231:       }
 1232: 
 1233:       render();
 1234:     })
 1235:     .catch((error) => {
 1236:       session.intelligence.status = "error";
 1237:       session.intelligence.error = error?.message || "Failed to load campaign intelligence";
 1238:       showError?.(session.intelligence.error);
 1239:       render();
 1240:     });
 1241: }
 1242: 
 1243: function bindCampaignStudio({
 1244:   $,
 1245:   getState,
 1246:   navigateTo,
 1247:   showMessage,
 1248:   showError,
 1249:   render,
 1250:   fetchProjectInsights,
 1251:   fetchProjectLearning,
 1252:   saveProjectCampaign,
 1253:   createProjectHandoff
 1254: }) {
 1255:   const state = getState();
 1256:   const projectName = state.context.currentProject || "";
 1257:   const session = ensureSession(projectName, buildDefaults(state));
 1258:   const durableCampaign = getSharedCampaignRecord(projectName, state.data.operations);
 1259:   if (durableCampaign) {
 1260:     session.recordId = asString(durableCampaign.id || session.recordId);
 1261:     session.values = hydrateValuesFromCampaignRecord(session.values, durableCampaign);
 1262:   }
 1263:   applyAiCampaignHandoff(projectName, state.data.operations, session);
 1264:   syncCampaignStudioBridge(projectName, session.values);
 1265: 
 1266:   const form = $("campaignStudioForm");
 1267:   if (form) {
 1268:     form.oninput = (event) => {
 1269:       const target = event.target;
 1270:       if (!target?.name) return;
 1271: 
 1272:       session.values[target.name] = target.value || "";
 1273:       syncCampaignStudioBridge(projectName, session.values);
 1274:       scheduleCampaignPersistence(projectName, session, saveProjectCampaign);
 1275: 
 1276:       // Do not rerender on every keystroke.
 1277:       // Rerendering here replaces the focused input and breaks typing/focus.
 1278:       // Explicit actions such as Save, Build, Refresh, and route handoffs still
 1279:       // persist the latest session values.
 1280:     };
 1281:   }
 1282: 
 1283:   const saveBtn = $("campaignSaveDraftBtn");
 1284:   if (saveBtn) {
 1285:     saveBtn.onclick = async () => {
 1286:       syncCampaignStudioBridge(projectName, session.values);
 1287:       try {
 1288:         const result = await saveProjectCampaign?.(projectName, buildCampaignRecordPayload(projectName, session));
 1289:         if (result?.campaign?.id) {
 1290:           session.recordId = result.campaign.id;
 1291:           setSharedCampaignRecord(projectName, result.campaign);
 1292:         }
 1293:         showMessage?.("Campaign draft saved to the shared operating backbone.");
 1294:       } catch (error) {
 1295:         showError?.(error.message || "Failed to save campaign plan.");
```

#### Match 12 — line 1251

```js
 1206:   Promise.allSettled([
 1207:     typeof fetchProjectInsights === "function" ? fetchProjectInsights(projectName) : Promise.resolve(null),
 1208:     typeof fetchProjectLearning === "function" ? fetchProjectLearning(projectName) : Promise.resolve(null)
 1209:   ])
 1210:     .then(([insightsResult, learningResult]) => {
 1211:       const insightsMissing = insightsResult?.status === "rejected" && isMissingIntelligenceError(insightsResult.reason);
 1212:       const learningMissing = learningResult?.status === "rejected" && isMissingIntelligenceError(learningResult.reason);
 1213:       const insights = insightsResult?.status === "fulfilled"
 1214:         ? insightsResult.value
 1215:         : (insightsMissing ? { project: projectName, generated_at: new Date().toISOString(), data_coverage: {} } : null);
 1216:       const learning = learningResult?.status === "fulfilled"
 1217:         ? learningResult.value
 1218:         : (learningMissing ? { project: projectName, generated_at: new Date().toISOString(), learning_patterns: {}, recommendations: [] } : null);
 1219:       const errors = [
 1220:         insightsResult?.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
 1221:         learningResult?.status === "rejected" && !learningMissing ? learningResult.reason?.message : ""
 1222:       ].filter(Boolean);
 1223: 
 1224:       session.intelligence.status = (insights || learning) ? "loaded" : "error";
 1225:       session.intelligence.insights = insights;
 1226:       session.intelligence.learning = learning;
 1227:       session.intelligence.error = errors.join(" • ");
 1228: 
 1229:       if (session.intelligence.status === "error" && session.intelligence.error) {
 1230:         showError?.(`Campaign intelligence could not be refreshed: ${session.intelligence.error}`);
 1231:       }
 1232: 
 1233:       render();
 1234:     })
 1235:     .catch((error) => {
 1236:       session.intelligence.status = "error";
 1237:       session.intelligence.error = error?.message || "Failed to load campaign intelligence";
 1238:       showError?.(session.intelligence.error);
 1239:       render();
 1240:     });
 1241: }
 1242: 
 1243: function bindCampaignStudio({
 1244:   $,
 1245:   getState,
 1246:   navigateTo,
 1247:   showMessage,
 1248:   showError,
 1249:   render,
 1250:   fetchProjectInsights,
 1251:   fetchProjectLearning,
 1252:   saveProjectCampaign,
 1253:   createProjectHandoff
 1254: }) {
 1255:   const state = getState();
 1256:   const projectName = state.context.currentProject || "";
 1257:   const session = ensureSession(projectName, buildDefaults(state));
 1258:   const durableCampaign = getSharedCampaignRecord(projectName, state.data.operations);
 1259:   if (durableCampaign) {
 1260:     session.recordId = asString(durableCampaign.id || session.recordId);
 1261:     session.values = hydrateValuesFromCampaignRecord(session.values, durableCampaign);
 1262:   }
 1263:   applyAiCampaignHandoff(projectName, state.data.operations, session);
 1264:   syncCampaignStudioBridge(projectName, session.values);
 1265: 
 1266:   const form = $("campaignStudioForm");
 1267:   if (form) {
 1268:     form.oninput = (event) => {
 1269:       const target = event.target;
 1270:       if (!target?.name) return;
 1271: 
 1272:       session.values[target.name] = target.value || "";
 1273:       syncCampaignStudioBridge(projectName, session.values);
 1274:       scheduleCampaignPersistence(projectName, session, saveProjectCampaign);
 1275: 
 1276:       // Do not rerender on every keystroke.
 1277:       // Rerendering here replaces the focused input and breaks typing/focus.
 1278:       // Explicit actions such as Save, Build, Refresh, and route handoffs still
 1279:       // persist the latest session values.
 1280:     };
 1281:   }
 1282: 
 1283:   const saveBtn = $("campaignSaveDraftBtn");
 1284:   if (saveBtn) {
 1285:     saveBtn.onclick = async () => {
 1286:       syncCampaignStudioBridge(projectName, session.values);
 1287:       try {
 1288:         const result = await saveProjectCampaign?.(projectName, buildCampaignRecordPayload(projectName, session));
 1289:         if (result?.campaign?.id) {
 1290:           session.recordId = result.campaign.id;
 1291:           setSharedCampaignRecord(projectName, result.campaign);
 1292:         }
 1293:         showMessage?.("Campaign draft saved to the shared operating backbone.");
 1294:       } catch (error) {
 1295:         showError?.(error.message || "Failed to save campaign plan.");
 1296:       }
```
### saveProjectCampaign calls

#### Match 1 — line 510

```js
  465:   const destination = CAMPAIGN_ROUTE_ROLES[destinationPage];
  466:   if (!projectName || !destination) return;
  467: 
  468:   const handoff = {
  469:     source_page: "campaign-studio",
  470:     destination_page: destinationPage,
  471:     source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  472:     destination_role: destination.role,
  473:     source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  474:     destination_service_domain: destination.domain,
  475:     linked_entity: {
  476:       entity_type: "campaign",
  477:       entity_id: session.recordId || "",
  478:       route: "campaign-studio",
  479:       label: asString(session.values.campaignName || projectName)
  480:     },
  481:     payload: {
  482:       campaign_id: session.recordId || "",
  483:       campaign_name: asString(session.values.campaignName || projectName),
  484:       owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  485:       review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  486:       service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  487:       draft_context: buildCampaignRecordPayload(projectName, session)
  488:     }
  489:   };
  490: 
  491:   setSharedHandoff(projectName, destinationPage, handoff);
  492:   createProjectHandoff?.(projectName, handoff).catch((error) => {
  493:     console.warn("Failed to persist campaign route handoff:", error.message);
  494:   });
  495: }
  496: 
  497: function scheduleCampaignPersistence(projectName, session, saveProjectCampaign) {
  498:   if (!projectName || typeof saveProjectCampaign !== "function") {
  499:     return;
  500:   }
  501: 
  502:   const key = projectName || "__default__";
  503:   const existing = campaignSaveTimers.get(key);
  504:   if (existing) {
  505:     clearTimeout(existing);
  506:   }
  507: 
  508:   const timer = setTimeout(async () => {
  509:     try {
  510:       const result = await saveProjectCampaign(projectName, buildCampaignRecordPayload(projectName, session));
  511:       const campaign = result?.campaign || null;
  512:       if (campaign?.id) {
  513:         session.recordId = campaign.id;
  514:         setSharedCampaignRecord(projectName, campaign);
  515:       }
  516:     } catch (error) {
  517:       console.warn("Failed to persist campaign draft:", error.message);
  518:     }
  519:   }, 250);
  520: 
  521:   campaignSaveTimers.set(key, timer);
  522: }
  523: 
  524: function renderEmptyState(title, description, escapeHtml) {
  525:   return `
  526:     <div class="campaign-studio-empty-state">
  527:       <strong>${escapeHtml(title)}</strong>
  528:       <p>${escapeHtml(description)}</p>
  529:     </div>
  530:   `;
  531: }
  532: 
  533: function renderIntelligenceList(items, escapeHtml, title, description) {
  534:   if (!items.length) {
  535:     return renderEmptyState(title, description, escapeHtml);
  536:   }
  537: 
  538:   return `
  539:     <div class="insights-mini-list">
  540:       ${items.map((item) => `
  541:         <div class="insights-mini-item">
  542:           <strong>${escapeHtml(item.title || item.label || "Signal")}</strong>
  543:           <span>${escapeHtml(item.body || item.meta || item.description || "-")}</span>
  544:         </div>
  545:       `).join("")}
  546:     </div>
  547:   `;
  548: }
  549: 
  550: function getInsightSource(state, session) {
  551:   const activity = asObject(state.data.activity);
  552:   const overview = asObject(state.data.overview);
  553:   const fetchedInsights = asObject(session.intelligence?.insights);
  554:   const fetchedLearning = asObject(session.intelligence?.learning);
  555: 
```
### createProjectHandoff calls

_No match found._

### fetchProjectInsights calls

#### Match 1 — line 1207

```js
 1162:       ${items.map((item) => `
 1163:         <div class="campaign-channel-card">
 1164:           <div class="campaign-channel-head">
 1165:             <strong>${escapeHtml(item.label)}</strong>
 1166:             <span class="card-badge ${item.confidence === "High" ? "success" : item.confidence === "Medium" ? "warning" : "neutral"}">${escapeHtml(item.confidence)}</span>
 1167:           </div>
 1168:           <p>${escapeHtml(item.rationale)}</p>
 1169:         </div>
 1170:       `).join("")}
 1171:     </div>
 1172:   `;
 1173: }
 1174: 
 1175: function renderBlockerGroup(title, items, escapeHtml, emptyBody) {
 1176:   return `
 1177:     <div class="campaign-readiness-block">
 1178:       <div class="campaign-readiness-head">
 1179:         <strong>${escapeHtml(title)}</strong>
 1180:         <span class="card-badge ${items.length ? "danger" : "success"}">${escapeHtml(items.length ? `${items.length} open` : "Clear")}</span>
 1181:       </div>
 1182:       ${
 1183:         items.length
 1184:           ? `<ul class="simple-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
 1185:           : `<div class="setup-helper">${escapeHtml(emptyBody)}</div>`
 1186:       }
 1187:     </div>
 1188:   `;
 1189: }
 1190: 
 1191: function startIntelligenceHydration({
 1192:   session,
 1193:   projectName,
 1194:   fetchProjectInsights,
 1195:   fetchProjectLearning,
 1196:   render,
 1197:   showError
 1198: }) {
 1199:   if (!projectName) return;
 1200:   if (session.intelligence.status === "loading" || session.intelligence.status === "loaded") return;
 1201:   if (typeof fetchProjectInsights !== "function" && typeof fetchProjectLearning !== "function") return;
 1202: 
 1203:   session.intelligence.status = "loading";
 1204:   session.intelligence.error = "";
 1205: 
 1206:   Promise.allSettled([
 1207:     typeof fetchProjectInsights === "function" ? fetchProjectInsights(projectName) : Promise.resolve(null),
 1208:     typeof fetchProjectLearning === "function" ? fetchProjectLearning(projectName) : Promise.resolve(null)
 1209:   ])
 1210:     .then(([insightsResult, learningResult]) => {
 1211:       const insightsMissing = insightsResult?.status === "rejected" && isMissingIntelligenceError(insightsResult.reason);
 1212:       const learningMissing = learningResult?.status === "rejected" && isMissingIntelligenceError(learningResult.reason);
 1213:       const insights = insightsResult?.status === "fulfilled"
 1214:         ? insightsResult.value
 1215:         : (insightsMissing ? { project: projectName, generated_at: new Date().toISOString(), data_coverage: {} } : null);
 1216:       const learning = learningResult?.status === "fulfilled"
 1217:         ? learningResult.value
 1218:         : (learningMissing ? { project: projectName, generated_at: new Date().toISOString(), learning_patterns: {}, recommendations: [] } : null);
 1219:       const errors = [
 1220:         insightsResult?.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
 1221:         learningResult?.status === "rejected" && !learningMissing ? learningResult.reason?.message : ""
 1222:       ].filter(Boolean);
 1223: 
 1224:       session.intelligence.status = (insights || learning) ? "loaded" : "error";
 1225:       session.intelligence.insights = insights;
 1226:       session.intelligence.learning = learning;
 1227:       session.intelligence.error = errors.join(" • ");
 1228: 
 1229:       if (session.intelligence.status === "error" && session.intelligence.error) {
 1230:         showError?.(`Campaign intelligence could not be refreshed: ${session.intelligence.error}`);
 1231:       }
 1232: 
 1233:       render();
 1234:     })
 1235:     .catch((error) => {
 1236:       session.intelligence.status = "error";
 1237:       session.intelligence.error = error?.message || "Failed to load campaign intelligence";
 1238:       showError?.(session.intelligence.error);
 1239:       render();
 1240:     });
 1241: }
 1242: 
 1243: function bindCampaignStudio({
 1244:   $,
 1245:   getState,
 1246:   navigateTo,
 1247:   showMessage,
 1248:   showError,
 1249:   render,
 1250:   fetchProjectInsights,
 1251:   fetchProjectLearning,
 1252:   saveProjectCampaign,
```
### fetchProjectLearning calls

#### Match 1 — line 1208

```js
 1163:         <div class="campaign-channel-card">
 1164:           <div class="campaign-channel-head">
 1165:             <strong>${escapeHtml(item.label)}</strong>
 1166:             <span class="card-badge ${item.confidence === "High" ? "success" : item.confidence === "Medium" ? "warning" : "neutral"}">${escapeHtml(item.confidence)}</span>
 1167:           </div>
 1168:           <p>${escapeHtml(item.rationale)}</p>
 1169:         </div>
 1170:       `).join("")}
 1171:     </div>
 1172:   `;
 1173: }
 1174: 
 1175: function renderBlockerGroup(title, items, escapeHtml, emptyBody) {
 1176:   return `
 1177:     <div class="campaign-readiness-block">
 1178:       <div class="campaign-readiness-head">
 1179:         <strong>${escapeHtml(title)}</strong>
 1180:         <span class="card-badge ${items.length ? "danger" : "success"}">${escapeHtml(items.length ? `${items.length} open` : "Clear")}</span>
 1181:       </div>
 1182:       ${
 1183:         items.length
 1184:           ? `<ul class="simple-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
 1185:           : `<div class="setup-helper">${escapeHtml(emptyBody)}</div>`
 1186:       }
 1187:     </div>
 1188:   `;
 1189: }
 1190: 
 1191: function startIntelligenceHydration({
 1192:   session,
 1193:   projectName,
 1194:   fetchProjectInsights,
 1195:   fetchProjectLearning,
 1196:   render,
 1197:   showError
 1198: }) {
 1199:   if (!projectName) return;
 1200:   if (session.intelligence.status === "loading" || session.intelligence.status === "loaded") return;
 1201:   if (typeof fetchProjectInsights !== "function" && typeof fetchProjectLearning !== "function") return;
 1202: 
 1203:   session.intelligence.status = "loading";
 1204:   session.intelligence.error = "";
 1205: 
 1206:   Promise.allSettled([
 1207:     typeof fetchProjectInsights === "function" ? fetchProjectInsights(projectName) : Promise.resolve(null),
 1208:     typeof fetchProjectLearning === "function" ? fetchProjectLearning(projectName) : Promise.resolve(null)
 1209:   ])
 1210:     .then(([insightsResult, learningResult]) => {
 1211:       const insightsMissing = insightsResult?.status === "rejected" && isMissingIntelligenceError(insightsResult.reason);
 1212:       const learningMissing = learningResult?.status === "rejected" && isMissingIntelligenceError(learningResult.reason);
 1213:       const insights = insightsResult?.status === "fulfilled"
 1214:         ? insightsResult.value
 1215:         : (insightsMissing ? { project: projectName, generated_at: new Date().toISOString(), data_coverage: {} } : null);
 1216:       const learning = learningResult?.status === "fulfilled"
 1217:         ? learningResult.value
 1218:         : (learningMissing ? { project: projectName, generated_at: new Date().toISOString(), learning_patterns: {}, recommendations: [] } : null);
 1219:       const errors = [
 1220:         insightsResult?.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
 1221:         learningResult?.status === "rejected" && !learningMissing ? learningResult.reason?.message : ""
 1222:       ].filter(Boolean);
 1223: 
 1224:       session.intelligence.status = (insights || learning) ? "loaded" : "error";
 1225:       session.intelligence.insights = insights;
 1226:       session.intelligence.learning = learning;
 1227:       session.intelligence.error = errors.join(" • ");
 1228: 
 1229:       if (session.intelligence.status === "error" && session.intelligence.error) {
 1230:         showError?.(`Campaign intelligence could not be refreshed: ${session.intelligence.error}`);
 1231:       }
 1232: 
 1233:       render();
 1234:     })
 1235:     .catch((error) => {
 1236:       session.intelligence.status = "error";
 1237:       session.intelligence.error = error?.message || "Failed to load campaign intelligence";
 1238:       showError?.(session.intelligence.error);
 1239:       render();
 1240:     });
 1241: }
 1242: 
 1243: function bindCampaignStudio({
 1244:   $,
 1245:   getState,
 1246:   navigateTo,
 1247:   showMessage,
 1248:   showError,
 1249:   render,
 1250:   fetchProjectInsights,
 1251:   fetchProjectLearning,
 1252:   saveProjectCampaign,
 1253:   createProjectHandoff
```
### Shared campaign writes

#### Match 1 — line 1

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
```

#### Match 2 — line 322

```js
  277:     session.intelligence = {
  278:       status: asString(session.intelligence?.status || "idle"),
  279:       insights: session.intelligence?.insights || null,
  280:       learning: session.intelligence?.learning || null,
  281:       error: asString(session.intelligence?.error)
  282:     };
  283:     session.generatedPackages = Number.isFinite(session.generatedPackages) ? session.generatedPackages : 0;
  284:     session.lastAiHandoffId = asString(session.lastAiHandoffId);
  285:   }
  286: 
  287:   return campaignSessions.get(key);
  288: }
  289: 
  290: function renderField({
  291:   name,
  292:   label,
  293:   value,
  294:   helper,
  295:   placeholder,
  296:   escapeHtml,
  297:   multiline = false,
  298:   rows = 3
  299: }) {
  300:   return `
  301:     <div class="setup-field-group">
  302:       <div class="setup-field-head">
  303:         <label class="setup-label" for="campaign-${escapeHtml(name)}">${escapeHtml(label)}</label>
  304:         <span class="setup-field-state is-optional">Draft</span>
  305:       </div>
  306:       ${
  307:         multiline
  308:           ? `<textarea id="campaign-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input setup-textarea" rows="${rows}" placeholder="${escapeHtml(placeholder || "")}">${escapeHtml(asString(value))}</textarea>`
  309:           : `<input id="campaign-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input" type="text" value="${escapeHtml(asString(value))}" placeholder="${escapeHtml(placeholder || "")}">`
  310:       }
  311:       <div class="setup-helper">${escapeHtml(helper)}</div>
  312:     </div>
  313:   `;
  314: }
  315: 
  316: function renderSummaryItem(label, value, escapeHtml) {
  317:   return `<div class="data-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(asString(value) || "-")}</strong></div>`;
  318: }
  319: 
  320: function syncCampaignStudioBridge(projectName, values) {
  321:   const current = getSharedCampaignRecord(projectName, null);
  322:   setSharedCampaignRecord(projectName, {
  323:     ...(current || {}),
  324:     project: projectName || "",
  325:     source_page: "campaign-studio",
  326:     name: asString(values?.campaignName),
  327:     objective: asString(values?.campaignGoal),
  328:     audience: asString(values?.audiencePrimary),
  329:     channels: asString(values?.channelPlan)
  330:       .split(",")
  331:       .map((item) => asString(item))
  332:       .filter(Boolean),
  333:     offer: asString(values?.offerHeadline),
  334:     timeline: [
  335:       asString(values?.startDate),
  336:       asString(values?.endDate)
  337:     ].filter(Boolean).join(" to "),
  338:     budget: asString(values?.budget),
  339:     status: "draft",
  340:     form_values: { ...asObject(values) },
  341:     updated_at: new Date().toISOString()
  342:   });
  343: }
  344: 
  345: function hydrateValuesFromCampaignRecord(defaults, campaign) {
  346:   const record = asObject(campaign);
  347:   const formValues = asObject(record.form_values);
  348: 
  349:   return {
  350:     ...defaults,
  351:     ...formValues,
  352:     campaignName: asString(formValues.campaignName || record.name || defaults.campaignName),
  353:     campaignGoal: asString(formValues.campaignGoal || record.objective || defaults.campaignGoal),
  354:     audiencePrimary: asString(formValues.audiencePrimary || record.audience || defaults.audiencePrimary),
  355:     channelPlan: asString(formValues.channelPlan || asArray(record.channels).join(", ") || defaults.channelPlan),
  356:     offerHeadline: asString(formValues.offerHeadline || record.offer || defaults.offerHeadline),
  357:     budget: asString(formValues.budget || record.budget || defaults.budget)
  358:   };
  359: }
  360: 
  361: function joinPackageList(value) {
  362:   if (!Array.isArray(value)) return readableValue(value);
  363:   return uniqueStrings(asArray(value).map((item) => {
  364:     if (typeof item === "string") return item;
  365:     const record = asObject(item);
  366:     return firstNonEmpty(record.name, record.title, record.label, record.channel, record.product, record.summary, record.action);
  367:   })).join(", ");
```

#### Match 3 — line 422

```js
  377: }
  378: 
  379: function applyAiCampaignHandoff(projectName, operations, session) {
  380:   const handoff = getSharedHandoff(projectName, "campaign-studio", operations, "ai-command");
  381:   const handoffId = asString(handoff?.id || handoff?.updated_at || handoff?.created_at || handoff?.payload?.prompt);
  382:   if (!handoffId || handoffId === asString(session.lastAiHandoffId)) return false;
  383: 
  384:   const payload = asObject(handoff.payload);
  385:   const output = asObject(payload.output);
  386:   const response = asObject(output.response || output);
  387:   const pkg = asObject(response.campaignPackage || response.campaign_package || payload.campaignPackage || payload.campaign_package);
  388:   if (!Object.keys(pkg).length) return false;
  389: 
  390:   const phases = asArray(pkg.launchPhases || pkg.launch_phases || pkg.phases);
  391:   session.values = {
  392:     ...session.values,
  393:     campaignName: firstNonEmpty(pkg.concept, pkg.campaignConcept, response.title, session.values.campaignName),
  394:     campaignGoal: firstNonEmpty(response.summary, pkg.goal, pkg.objective, session.values.campaignGoal),
  395:     productFocus: firstNonEmpty(joinPackageList(pkg.products), session.values.productFocus),
  396:     productAngle: firstNonEmpty(joinPackageList(pkg.contentAngles || pkg.content_angles), pkg.concept, session.values.productAngle),
  397:     audiencePrimary: firstNonEmpty(pkg.targetAudience, pkg.target_audience, pkg.audience, session.values.audiencePrimary),
  398:     audienceNeed: firstNonEmpty(pkg.audienceNeed, pkg.audience_need, session.values.audienceNeed),
  399:     channelPlan: firstNonEmpty(joinPackageList(pkg.channels), session.values.channelPlan),
  400:     offerHeadline: firstNonEmpty(pkg.offer, pkg.offerStrategy, pkg.offer_strategy, session.values.offerHeadline),
  401:     offerDetail: firstNonEmpty(joinPackageList(pkg.adAngles || pkg.ad_angles), session.values.offerDetail),
  402:     wave1Name: firstNonEmpty(phaseValue(phases, 0, "name"), session.values.wave1Name),
  403:     wave1Focus: firstNonEmpty(phaseValue(phases, 0, "focus"), session.values.wave1Focus),
  404:     wave1Channels: firstNonEmpty(phaseValue(phases, 0, "channels"), session.values.wave1Channels),
  405:     wave2Name: firstNonEmpty(phaseValue(phases, 1, "name"), session.values.wave2Name),
  406:     wave2Focus: firstNonEmpty(phaseValue(phases, 1, "focus"), session.values.wave2Focus),
  407:     wave2Channels: firstNonEmpty(phaseValue(phases, 1, "channels"), session.values.wave2Channels),
  408:     wave3Name: firstNonEmpty(phaseValue(phases, 2, "name"), session.values.wave3Name),
  409:     wave3Focus: firstNonEmpty(phaseValue(phases, 2, "focus"), session.values.wave3Focus),
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
  438: function buildCampaignRecordPayload(projectName, session) {
  439:   const values = asObject(session.values);
  440:   const timeline = [asString(values.startDate), asString(values.endDate)].filter(Boolean).join(" to ");
  441: 
  442:   return {
  443:     id: session.recordId || undefined,
  444:     name: asString(values.campaignName || projectName),
  445:     objective: asString(values.campaignGoal),
  446:     audience: asString(values.audiencePrimary),
  447:     channels: asString(values.channelPlan),
  448:     offer: asString(values.offerHeadline),
  449:     timeline,
  450:     budget: asString(values.budget),
  451:     status: "draft",
  452:     source_page: "campaign-studio",
  453:     owner: "Strategist",
  454:     owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  455:     review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  456:     service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  457:     linked_assets: [],
  458:     linked_tasks: [],
  459:     linked_approvals: [],
  460:     form_values: { ...values }
  461:   };
  462: }
  463: 
  464: function persistCampaignRouteHandoff({ projectName, session, destinationPage, createProjectHandoff }) {
  465:   const destination = CAMPAIGN_ROUTE_ROLES[destinationPage];
  466:   if (!projectName || !destination) return;
  467: 
```

#### Match 4 — line 514

```js
  469:     source_page: "campaign-studio",
  470:     destination_page: destinationPage,
  471:     source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  472:     destination_role: destination.role,
  473:     source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  474:     destination_service_domain: destination.domain,
  475:     linked_entity: {
  476:       entity_type: "campaign",
  477:       entity_id: session.recordId || "",
  478:       route: "campaign-studio",
  479:       label: asString(session.values.campaignName || projectName)
  480:     },
  481:     payload: {
  482:       campaign_id: session.recordId || "",
  483:       campaign_name: asString(session.values.campaignName || projectName),
  484:       owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  485:       review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  486:       service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  487:       draft_context: buildCampaignRecordPayload(projectName, session)
  488:     }
  489:   };
  490: 
  491:   setSharedHandoff(projectName, destinationPage, handoff);
  492:   createProjectHandoff?.(projectName, handoff).catch((error) => {
  493:     console.warn("Failed to persist campaign route handoff:", error.message);
  494:   });
  495: }
  496: 
  497: function scheduleCampaignPersistence(projectName, session, saveProjectCampaign) {
  498:   if (!projectName || typeof saveProjectCampaign !== "function") {
  499:     return;
  500:   }
  501: 
  502:   const key = projectName || "__default__";
  503:   const existing = campaignSaveTimers.get(key);
  504:   if (existing) {
  505:     clearTimeout(existing);
  506:   }
  507: 
  508:   const timer = setTimeout(async () => {
  509:     try {
  510:       const result = await saveProjectCampaign(projectName, buildCampaignRecordPayload(projectName, session));
  511:       const campaign = result?.campaign || null;
  512:       if (campaign?.id) {
  513:         session.recordId = campaign.id;
  514:         setSharedCampaignRecord(projectName, campaign);
  515:       }
  516:     } catch (error) {
  517:       console.warn("Failed to persist campaign draft:", error.message);
  518:     }
  519:   }, 250);
  520: 
  521:   campaignSaveTimers.set(key, timer);
  522: }
  523: 
  524: function renderEmptyState(title, description, escapeHtml) {
  525:   return `
  526:     <div class="campaign-studio-empty-state">
  527:       <strong>${escapeHtml(title)}</strong>
  528:       <p>${escapeHtml(description)}</p>
  529:     </div>
  530:   `;
  531: }
  532: 
  533: function renderIntelligenceList(items, escapeHtml, title, description) {
  534:   if (!items.length) {
  535:     return renderEmptyState(title, description, escapeHtml);
  536:   }
  537: 
  538:   return `
  539:     <div class="insights-mini-list">
  540:       ${items.map((item) => `
  541:         <div class="insights-mini-item">
  542:           <strong>${escapeHtml(item.title || item.label || "Signal")}</strong>
  543:           <span>${escapeHtml(item.body || item.meta || item.description || "-")}</span>
  544:         </div>
  545:       `).join("")}
  546:     </div>
  547:   `;
  548: }
  549: 
  550: function getInsightSource(state, session) {
  551:   const activity = asObject(state.data.activity);
  552:   const overview = asObject(state.data.overview);
  553:   const fetchedInsights = asObject(session.intelligence?.insights);
  554:   const fetchedLearning = asObject(session.intelligence?.learning);
  555: 
  556:   return {
  557:     insights: asObject(
  558:       fetchedInsights.insights ||
  559:       fetchedInsights.data ||
```

#### Match 5 — line 1291

```js
 1246:   navigateTo,
 1247:   showMessage,
 1248:   showError,
 1249:   render,
 1250:   fetchProjectInsights,
 1251:   fetchProjectLearning,
 1252:   saveProjectCampaign,
 1253:   createProjectHandoff
 1254: }) {
 1255:   const state = getState();
 1256:   const projectName = state.context.currentProject || "";
 1257:   const session = ensureSession(projectName, buildDefaults(state));
 1258:   const durableCampaign = getSharedCampaignRecord(projectName, state.data.operations);
 1259:   if (durableCampaign) {
 1260:     session.recordId = asString(durableCampaign.id || session.recordId);
 1261:     session.values = hydrateValuesFromCampaignRecord(session.values, durableCampaign);
 1262:   }
 1263:   applyAiCampaignHandoff(projectName, state.data.operations, session);
 1264:   syncCampaignStudioBridge(projectName, session.values);
 1265: 
 1266:   const form = $("campaignStudioForm");
 1267:   if (form) {
 1268:     form.oninput = (event) => {
 1269:       const target = event.target;
 1270:       if (!target?.name) return;
 1271: 
 1272:       session.values[target.name] = target.value || "";
 1273:       syncCampaignStudioBridge(projectName, session.values);
 1274:       scheduleCampaignPersistence(projectName, session, saveProjectCampaign);
 1275: 
 1276:       // Do not rerender on every keystroke.
 1277:       // Rerendering here replaces the focused input and breaks typing/focus.
 1278:       // Explicit actions such as Save, Build, Refresh, and route handoffs still
 1279:       // persist the latest session values.
 1280:     };
 1281:   }
 1282: 
 1283:   const saveBtn = $("campaignSaveDraftBtn");
 1284:   if (saveBtn) {
 1285:     saveBtn.onclick = async () => {
 1286:       syncCampaignStudioBridge(projectName, session.values);
 1287:       try {
 1288:         const result = await saveProjectCampaign?.(projectName, buildCampaignRecordPayload(projectName, session));
 1289:         if (result?.campaign?.id) {
 1290:           session.recordId = result.campaign.id;
 1291:           setSharedCampaignRecord(projectName, result.campaign);
 1292:         }
 1293:         showMessage?.("Campaign draft saved to the shared operating backbone.");
 1294:       } catch (error) {
 1295:         showError?.(error.message || "Failed to save campaign plan.");
 1296:       }
 1297:     };
 1298:   }
 1299: 
 1300:   const buildBtn = $("campaignBuildPlanBtn");
 1301:   if (buildBtn) {
 1302:     buildBtn.onclick = async () => {
 1303:       syncCampaignStudioBridge(projectName, session.values);
 1304:       try {
 1305:         const result = await saveProjectCampaign?.(projectName, {
 1306:           ...buildCampaignRecordPayload(projectName, session),
 1307:           status: "planned"
 1308:         });
 1309:         if (result?.campaign?.id) {
 1310:           session.recordId = result.campaign.id;
 1311:           setSharedCampaignRecord(projectName, result.campaign);
 1312:         }
 1313:         showMessage?.("Campaign plan saved as a durable shared record.");
 1314:       } catch (error) {
 1315:         showError?.(error.message || "Failed to structure the campaign plan.");
 1316:       }
 1317:     };
 1318:   }
 1319: 
 1320:   const askAiBtn = $("campaignAskAiBtn");
 1321:   if (askAiBtn) {
 1322:     askAiBtn.onclick = async () => {
 1323:       const prompt = `Build an execution plan for campaign ${session.values.campaignName || "this campaign"} with goal ${session.values.campaignGoal || "launch"}, channels ${session.values.channelPlan || "to be defined"}, and offer ${session.values.offerHeadline || "to be defined"}. Use current project intelligence, readiness blockers, and recommendation signals.`;
 1324:       const input = $("quickCommandInput");
 1325:       if (input) {
 1326:         input.value = prompt;
 1327:       }
 1328:       setSharedHandoff(projectName, "ai-command", {
 1329:         source_page: "campaign-studio",
 1330:         destination_page: "ai-command",
 1331:         payload: {
 1332:           prompt,
 1333:           campaign_id: session.recordId || "",
 1334:           campaign_name: session.values.campaignName || projectName,
 1335:           draft_context: buildCampaignRecordPayload(projectName, session)
 1336:         },
```

#### Match 6 — line 1311

```js
 1266:   const form = $("campaignStudioForm");
 1267:   if (form) {
 1268:     form.oninput = (event) => {
 1269:       const target = event.target;
 1270:       if (!target?.name) return;
 1271: 
 1272:       session.values[target.name] = target.value || "";
 1273:       syncCampaignStudioBridge(projectName, session.values);
 1274:       scheduleCampaignPersistence(projectName, session, saveProjectCampaign);
 1275: 
 1276:       // Do not rerender on every keystroke.
 1277:       // Rerendering here replaces the focused input and breaks typing/focus.
 1278:       // Explicit actions such as Save, Build, Refresh, and route handoffs still
 1279:       // persist the latest session values.
 1280:     };
 1281:   }
 1282: 
 1283:   const saveBtn = $("campaignSaveDraftBtn");
 1284:   if (saveBtn) {
 1285:     saveBtn.onclick = async () => {
 1286:       syncCampaignStudioBridge(projectName, session.values);
 1287:       try {
 1288:         const result = await saveProjectCampaign?.(projectName, buildCampaignRecordPayload(projectName, session));
 1289:         if (result?.campaign?.id) {
 1290:           session.recordId = result.campaign.id;
 1291:           setSharedCampaignRecord(projectName, result.campaign);
 1292:         }
 1293:         showMessage?.("Campaign draft saved to the shared operating backbone.");
 1294:       } catch (error) {
 1295:         showError?.(error.message || "Failed to save campaign plan.");
 1296:       }
 1297:     };
 1298:   }
 1299: 
 1300:   const buildBtn = $("campaignBuildPlanBtn");
 1301:   if (buildBtn) {
 1302:     buildBtn.onclick = async () => {
 1303:       syncCampaignStudioBridge(projectName, session.values);
 1304:       try {
 1305:         const result = await saveProjectCampaign?.(projectName, {
 1306:           ...buildCampaignRecordPayload(projectName, session),
 1307:           status: "planned"
 1308:         });
 1309:         if (result?.campaign?.id) {
 1310:           session.recordId = result.campaign.id;
 1311:           setSharedCampaignRecord(projectName, result.campaign);
 1312:         }
 1313:         showMessage?.("Campaign plan saved as a durable shared record.");
 1314:       } catch (error) {
 1315:         showError?.(error.message || "Failed to structure the campaign plan.");
 1316:       }
 1317:     };
 1318:   }
 1319: 
 1320:   const askAiBtn = $("campaignAskAiBtn");
 1321:   if (askAiBtn) {
 1322:     askAiBtn.onclick = async () => {
 1323:       const prompt = `Build an execution plan for campaign ${session.values.campaignName || "this campaign"} with goal ${session.values.campaignGoal || "launch"}, channels ${session.values.channelPlan || "to be defined"}, and offer ${session.values.offerHeadline || "to be defined"}. Use current project intelligence, readiness blockers, and recommendation signals.`;
 1324:       const input = $("quickCommandInput");
 1325:       if (input) {
 1326:         input.value = prompt;
 1327:       }
 1328:       setSharedHandoff(projectName, "ai-command", {
 1329:         source_page: "campaign-studio",
 1330:         destination_page: "ai-command",
 1331:         payload: {
 1332:           prompt,
 1333:           campaign_id: session.recordId || "",
 1334:           campaign_name: session.values.campaignName || projectName,
 1335:           draft_context: buildCampaignRecordPayload(projectName, session)
 1336:         },
 1337:         status: "available"
 1338:       });
 1339:       createProjectHandoff?.(projectName, {
 1340:         source_page: "campaign-studio",
 1341:         destination_page: "ai-command",
 1342:         source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
 1343:         destination_role: CAMPAIGN_ROUTE_ROLES["ai-command"].role,
 1344:         source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
 1345:         destination_service_domain: CAMPAIGN_ROUTE_ROLES["ai-command"].domain,
 1346:         linked_entity: {
 1347:           entity_type: "campaign",
 1348:           entity_id: session.recordId || ""
 1349:         },
 1350:         payload: {
 1351:           prompt,
 1352:           campaign_id: session.recordId || "",
 1353:           campaign_name: session.values.campaignName || projectName,
 1354:           owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
 1355:           review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
 1356:           service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
```
### Shared handoff writes

#### Match 1 — line 1

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
```

#### Match 2 — line 491

```js
  446:     audience: asString(values.audiencePrimary),
  447:     channels: asString(values.channelPlan),
  448:     offer: asString(values.offerHeadline),
  449:     timeline,
  450:     budget: asString(values.budget),
  451:     status: "draft",
  452:     source_page: "campaign-studio",
  453:     owner: "Strategist",
  454:     owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  455:     review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  456:     service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  457:     linked_assets: [],
  458:     linked_tasks: [],
  459:     linked_approvals: [],
  460:     form_values: { ...values }
  461:   };
  462: }
  463: 
  464: function persistCampaignRouteHandoff({ projectName, session, destinationPage, createProjectHandoff }) {
  465:   const destination = CAMPAIGN_ROUTE_ROLES[destinationPage];
  466:   if (!projectName || !destination) return;
  467: 
  468:   const handoff = {
  469:     source_page: "campaign-studio",
  470:     destination_page: destinationPage,
  471:     source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  472:     destination_role: destination.role,
  473:     source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  474:     destination_service_domain: destination.domain,
  475:     linked_entity: {
  476:       entity_type: "campaign",
  477:       entity_id: session.recordId || "",
  478:       route: "campaign-studio",
  479:       label: asString(session.values.campaignName || projectName)
  480:     },
  481:     payload: {
  482:       campaign_id: session.recordId || "",
  483:       campaign_name: asString(session.values.campaignName || projectName),
  484:       owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  485:       review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  486:       service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  487:       draft_context: buildCampaignRecordPayload(projectName, session)
  488:     }
  489:   };
  490: 
  491:   setSharedHandoff(projectName, destinationPage, handoff);
  492:   createProjectHandoff?.(projectName, handoff).catch((error) => {
  493:     console.warn("Failed to persist campaign route handoff:", error.message);
  494:   });
  495: }
  496: 
  497: function scheduleCampaignPersistence(projectName, session, saveProjectCampaign) {
  498:   if (!projectName || typeof saveProjectCampaign !== "function") {
  499:     return;
  500:   }
  501: 
  502:   const key = projectName || "__default__";
  503:   const existing = campaignSaveTimers.get(key);
  504:   if (existing) {
  505:     clearTimeout(existing);
  506:   }
  507: 
  508:   const timer = setTimeout(async () => {
  509:     try {
  510:       const result = await saveProjectCampaign(projectName, buildCampaignRecordPayload(projectName, session));
  511:       const campaign = result?.campaign || null;
  512:       if (campaign?.id) {
  513:         session.recordId = campaign.id;
  514:         setSharedCampaignRecord(projectName, campaign);
  515:       }
  516:     } catch (error) {
  517:       console.warn("Failed to persist campaign draft:", error.message);
  518:     }
  519:   }, 250);
  520: 
  521:   campaignSaveTimers.set(key, timer);
  522: }
  523: 
  524: function renderEmptyState(title, description, escapeHtml) {
  525:   return `
  526:     <div class="campaign-studio-empty-state">
  527:       <strong>${escapeHtml(title)}</strong>
  528:       <p>${escapeHtml(description)}</p>
  529:     </div>
  530:   `;
  531: }
  532: 
  533: function renderIntelligenceList(items, escapeHtml, title, description) {
  534:   if (!items.length) {
  535:     return renderEmptyState(title, description, escapeHtml);
  536:   }
```

#### Match 3 — line 1328

```js
 1283:   const saveBtn = $("campaignSaveDraftBtn");
 1284:   if (saveBtn) {
 1285:     saveBtn.onclick = async () => {
 1286:       syncCampaignStudioBridge(projectName, session.values);
 1287:       try {
 1288:         const result = await saveProjectCampaign?.(projectName, buildCampaignRecordPayload(projectName, session));
 1289:         if (result?.campaign?.id) {
 1290:           session.recordId = result.campaign.id;
 1291:           setSharedCampaignRecord(projectName, result.campaign);
 1292:         }
 1293:         showMessage?.("Campaign draft saved to the shared operating backbone.");
 1294:       } catch (error) {
 1295:         showError?.(error.message || "Failed to save campaign plan.");
 1296:       }
 1297:     };
 1298:   }
 1299: 
 1300:   const buildBtn = $("campaignBuildPlanBtn");
 1301:   if (buildBtn) {
 1302:     buildBtn.onclick = async () => {
 1303:       syncCampaignStudioBridge(projectName, session.values);
 1304:       try {
 1305:         const result = await saveProjectCampaign?.(projectName, {
 1306:           ...buildCampaignRecordPayload(projectName, session),
 1307:           status: "planned"
 1308:         });
 1309:         if (result?.campaign?.id) {
 1310:           session.recordId = result.campaign.id;
 1311:           setSharedCampaignRecord(projectName, result.campaign);
 1312:         }
 1313:         showMessage?.("Campaign plan saved as a durable shared record.");
 1314:       } catch (error) {
 1315:         showError?.(error.message || "Failed to structure the campaign plan.");
 1316:       }
 1317:     };
 1318:   }
 1319: 
 1320:   const askAiBtn = $("campaignAskAiBtn");
 1321:   if (askAiBtn) {
 1322:     askAiBtn.onclick = async () => {
 1323:       const prompt = `Build an execution plan for campaign ${session.values.campaignName || "this campaign"} with goal ${session.values.campaignGoal || "launch"}, channels ${session.values.channelPlan || "to be defined"}, and offer ${session.values.offerHeadline || "to be defined"}. Use current project intelligence, readiness blockers, and recommendation signals.`;
 1324:       const input = $("quickCommandInput");
 1325:       if (input) {
 1326:         input.value = prompt;
 1327:       }
 1328:       setSharedHandoff(projectName, "ai-command", {
 1329:         source_page: "campaign-studio",
 1330:         destination_page: "ai-command",
 1331:         payload: {
 1332:           prompt,
 1333:           campaign_id: session.recordId || "",
 1334:           campaign_name: session.values.campaignName || projectName,
 1335:           draft_context: buildCampaignRecordPayload(projectName, session)
 1336:         },
 1337:         status: "available"
 1338:       });
 1339:       createProjectHandoff?.(projectName, {
 1340:         source_page: "campaign-studio",
 1341:         destination_page: "ai-command",
 1342:         source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
 1343:         destination_role: CAMPAIGN_ROUTE_ROLES["ai-command"].role,
 1344:         source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
 1345:         destination_service_domain: CAMPAIGN_ROUTE_ROLES["ai-command"].domain,
 1346:         linked_entity: {
 1347:           entity_type: "campaign",
 1348:           entity_id: session.recordId || ""
 1349:         },
 1350:         payload: {
 1351:           prompt,
 1352:           campaign_id: session.recordId || "",
 1353:           campaign_name: session.values.campaignName || projectName,
 1354:           owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
 1355:           review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
 1356:           service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
 1357:           draft_context: buildCampaignRecordPayload(projectName, session)
 1358:         }
 1359:       }).catch((error) => {
 1360:         console.warn("Failed to persist campaign handoff:", error.message);
 1361:       });
 1362:       navigateTo("ai-command");
 1363:       showMessage?.("Campaign context sent to AI Command.");
 1364:     };
 1365:   }
 1366: 
 1367:   const publishingBtn = $("campaignOpenPublishingBtn");
 1368:   if (publishingBtn) {
 1369:     publishingBtn.onclick = () => {
 1370:       persistCampaignRouteHandoff({ projectName, session, destinationPage: "publishing", createProjectHandoff });
 1371:       navigateTo("publishing");
 1372:     };
 1373:   }
```
### Local/session storage writes

_No match found._

### Campaign save/build buttons

#### Match 1 — line 1283

```js
 1238:       showError?.(session.intelligence.error);
 1239:       render();
 1240:     });
 1241: }
 1242: 
 1243: function bindCampaignStudio({
 1244:   $,
 1245:   getState,
 1246:   navigateTo,
 1247:   showMessage,
 1248:   showError,
 1249:   render,
 1250:   fetchProjectInsights,
 1251:   fetchProjectLearning,
 1252:   saveProjectCampaign,
 1253:   createProjectHandoff
 1254: }) {
 1255:   const state = getState();
 1256:   const projectName = state.context.currentProject || "";
 1257:   const session = ensureSession(projectName, buildDefaults(state));
 1258:   const durableCampaign = getSharedCampaignRecord(projectName, state.data.operations);
 1259:   if (durableCampaign) {
 1260:     session.recordId = asString(durableCampaign.id || session.recordId);
 1261:     session.values = hydrateValuesFromCampaignRecord(session.values, durableCampaign);
 1262:   }
 1263:   applyAiCampaignHandoff(projectName, state.data.operations, session);
 1264:   syncCampaignStudioBridge(projectName, session.values);
 1265: 
 1266:   const form = $("campaignStudioForm");
 1267:   if (form) {
 1268:     form.oninput = (event) => {
 1269:       const target = event.target;
 1270:       if (!target?.name) return;
 1271: 
 1272:       session.values[target.name] = target.value || "";
 1273:       syncCampaignStudioBridge(projectName, session.values);
 1274:       scheduleCampaignPersistence(projectName, session, saveProjectCampaign);
 1275: 
 1276:       // Do not rerender on every keystroke.
 1277:       // Rerendering here replaces the focused input and breaks typing/focus.
 1278:       // Explicit actions such as Save, Build, Refresh, and route handoffs still
 1279:       // persist the latest session values.
 1280:     };
 1281:   }
 1282: 
 1283:   const saveBtn = $("campaignSaveDraftBtn");
 1284:   if (saveBtn) {
 1285:     saveBtn.onclick = async () => {
 1286:       syncCampaignStudioBridge(projectName, session.values);
 1287:       try {
 1288:         const result = await saveProjectCampaign?.(projectName, buildCampaignRecordPayload(projectName, session));
 1289:         if (result?.campaign?.id) {
 1290:           session.recordId = result.campaign.id;
 1291:           setSharedCampaignRecord(projectName, result.campaign);
 1292:         }
 1293:         showMessage?.("Campaign draft saved to the shared operating backbone.");
 1294:       } catch (error) {
 1295:         showError?.(error.message || "Failed to save campaign plan.");
 1296:       }
 1297:     };
 1298:   }
 1299: 
 1300:   const buildBtn = $("campaignBuildPlanBtn");
 1301:   if (buildBtn) {
 1302:     buildBtn.onclick = async () => {
 1303:       syncCampaignStudioBridge(projectName, session.values);
 1304:       try {
 1305:         const result = await saveProjectCampaign?.(projectName, {
 1306:           ...buildCampaignRecordPayload(projectName, session),
 1307:           status: "planned"
 1308:         });
 1309:         if (result?.campaign?.id) {
 1310:           session.recordId = result.campaign.id;
 1311:           setSharedCampaignRecord(projectName, result.campaign);
 1312:         }
 1313:         showMessage?.("Campaign plan saved as a durable shared record.");
 1314:       } catch (error) {
 1315:         showError?.(error.message || "Failed to structure the campaign plan.");
 1316:       }
 1317:     };
 1318:   }
 1319: 
 1320:   const askAiBtn = $("campaignAskAiBtn");
 1321:   if (askAiBtn) {
 1322:     askAiBtn.onclick = async () => {
 1323:       const prompt = `Build an execution plan for campaign ${session.values.campaignName || "this campaign"} with goal ${session.values.campaignGoal || "launch"}, channels ${session.values.channelPlan || "to be defined"}, and offer ${session.values.offerHeadline || "to be defined"}. Use current project intelligence, readiness blockers, and recommendation signals.`;
 1324:       const input = $("quickCommandInput");
 1325:       if (input) {
 1326:         input.value = prompt;
 1327:       }
 1328:       setSharedHandoff(projectName, "ai-command", {
```

#### Match 2 — line 1300

```js
 1255:   const state = getState();
 1256:   const projectName = state.context.currentProject || "";
 1257:   const session = ensureSession(projectName, buildDefaults(state));
 1258:   const durableCampaign = getSharedCampaignRecord(projectName, state.data.operations);
 1259:   if (durableCampaign) {
 1260:     session.recordId = asString(durableCampaign.id || session.recordId);
 1261:     session.values = hydrateValuesFromCampaignRecord(session.values, durableCampaign);
 1262:   }
 1263:   applyAiCampaignHandoff(projectName, state.data.operations, session);
 1264:   syncCampaignStudioBridge(projectName, session.values);
 1265: 
 1266:   const form = $("campaignStudioForm");
 1267:   if (form) {
 1268:     form.oninput = (event) => {
 1269:       const target = event.target;
 1270:       if (!target?.name) return;
 1271: 
 1272:       session.values[target.name] = target.value || "";
 1273:       syncCampaignStudioBridge(projectName, session.values);
 1274:       scheduleCampaignPersistence(projectName, session, saveProjectCampaign);
 1275: 
 1276:       // Do not rerender on every keystroke.
 1277:       // Rerendering here replaces the focused input and breaks typing/focus.
 1278:       // Explicit actions such as Save, Build, Refresh, and route handoffs still
 1279:       // persist the latest session values.
 1280:     };
 1281:   }
 1282: 
 1283:   const saveBtn = $("campaignSaveDraftBtn");
 1284:   if (saveBtn) {
 1285:     saveBtn.onclick = async () => {
 1286:       syncCampaignStudioBridge(projectName, session.values);
 1287:       try {
 1288:         const result = await saveProjectCampaign?.(projectName, buildCampaignRecordPayload(projectName, session));
 1289:         if (result?.campaign?.id) {
 1290:           session.recordId = result.campaign.id;
 1291:           setSharedCampaignRecord(projectName, result.campaign);
 1292:         }
 1293:         showMessage?.("Campaign draft saved to the shared operating backbone.");
 1294:       } catch (error) {
 1295:         showError?.(error.message || "Failed to save campaign plan.");
 1296:       }
 1297:     };
 1298:   }
 1299: 
 1300:   const buildBtn = $("campaignBuildPlanBtn");
 1301:   if (buildBtn) {
 1302:     buildBtn.onclick = async () => {
 1303:       syncCampaignStudioBridge(projectName, session.values);
 1304:       try {
 1305:         const result = await saveProjectCampaign?.(projectName, {
 1306:           ...buildCampaignRecordPayload(projectName, session),
 1307:           status: "planned"
 1308:         });
 1309:         if (result?.campaign?.id) {
 1310:           session.recordId = result.campaign.id;
 1311:           setSharedCampaignRecord(projectName, result.campaign);
 1312:         }
 1313:         showMessage?.("Campaign plan saved as a durable shared record.");
 1314:       } catch (error) {
 1315:         showError?.(error.message || "Failed to structure the campaign plan.");
 1316:       }
 1317:     };
 1318:   }
 1319: 
 1320:   const askAiBtn = $("campaignAskAiBtn");
 1321:   if (askAiBtn) {
 1322:     askAiBtn.onclick = async () => {
 1323:       const prompt = `Build an execution plan for campaign ${session.values.campaignName || "this campaign"} with goal ${session.values.campaignGoal || "launch"}, channels ${session.values.channelPlan || "to be defined"}, and offer ${session.values.offerHeadline || "to be defined"}. Use current project intelligence, readiness blockers, and recommendation signals.`;
 1324:       const input = $("quickCommandInput");
 1325:       if (input) {
 1326:         input.value = prompt;
 1327:       }
 1328:       setSharedHandoff(projectName, "ai-command", {
 1329:         source_page: "campaign-studio",
 1330:         destination_page: "ai-command",
 1331:         payload: {
 1332:           prompt,
 1333:           campaign_id: session.recordId || "",
 1334:           campaign_name: session.values.campaignName || projectName,
 1335:           draft_context: buildCampaignRecordPayload(projectName, session)
 1336:         },
 1337:         status: "available"
 1338:       });
 1339:       createProjectHandoff?.(projectName, {
 1340:         source_page: "campaign-studio",
 1341:         destination_page: "ai-command",
 1342:         source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
 1343:         destination_role: CAMPAIGN_ROUTE_ROLES["ai-command"].role,
 1344:         source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
 1345:         destination_service_domain: CAMPAIGN_ROUTE_ROLES["ai-command"].domain,
```

#### Match 3 — line 1581

```js
 1536:     const recommendedChannelCount = channelMix.organic.length + channelMix.paid.length + channelMix.support.length;
 1537:     const channelStateLabel = connectedChannels.length
 1538:       ? `${connectedChannels.length} connected`
 1539:       : recommendedChannelCount
 1540:         ? `${recommendedChannelCount} recommended`
 1541:         : "Needs signal";
 1542:     const channelTone = connectedChannels.length ? "success" : recommendedChannelCount ? "warning" : "neutral";
 1543:     const budgetValue = formatCurrency(values.budget, overviewData.currency || "USD");
 1544:     const budgetLabel = budgetValue === "-" ? "Budget pending" : budgetValue;
 1545:     const launchWindowLabel = [values.startDate, values.endDate].filter(Boolean).join(" to ") || "Window pending";
 1546:     const marketLabel = safeText(firstNonEmpty(values.market, overviewData.market), "Market pending");
 1547:     const productLabel = safeText(firstNonEmpty(values.productFocus, overviewData.project_name, projectName), "Product pending");
 1548:     const goalLabel = safeText(values.campaignGoal, "Goal pending");
 1549:     const strategistNextAction = safeText(strategyGuidance.nextAction, "Review campaign plan");
 1550:     const strategistMode = hasLiveIntelligence
 1551:       ? "Current intelligence is shaping campaign direction and readiness."
 1552:       : "Current draft data is projecting direction until live intelligence arrives.";
 1553: 
 1554:     root.innerHTML = `
 1555:       <div class="campaign-studio-wrapper">
 1556: 
 1557:         <section class="mhos-campaign-command-header mhos-context-ribbon" aria-label="Campaign command board">
 1558:           <div class="mhos-campaign-command-main mhos-context-main">
 1559:             <div class="mhos-campaign-kicker-row mhos-context-kicker">
 1560:               <span class="mhos-campaign-kicker mhos-context-kicker">Campaign Command Board</span>
 1561:               <span class="mhos-campaign-state mhos-campaign-state--${readinessTone}">${escapeHtml(executionReadiness.status)}</span>
 1562:             </div>
 1563:             <h2 class="mhos-campaign-title mhos-context-title">${escapeHtml(activeCampaignLabel)}</h2>
 1564:             <p class="mhos-campaign-summary mhos-context-description">${escapeHtml(goalLabel)}</p>
 1565:             <div class="mhos-campaign-context-row mhos-context-chip-row" aria-label="Campaign context">
 1566:               <span class="mhos-campaign-context-item mhos-context-chip">Market <strong class="mhos-campaign-context-value">${escapeHtml(marketLabel)}</strong></span>
 1567:               <span class="mhos-campaign-context-item mhos-context-chip">Product <strong class="mhos-campaign-context-value">${escapeHtml(productLabel)}</strong></span>
 1568:               <span class="mhos-campaign-context-item mhos-context-chip">Budget <strong class="mhos-campaign-context-value">${escapeHtml(budgetLabel)}</strong></span>
 1569:               <span class="mhos-campaign-context-item mhos-context-chip">Window <strong class="mhos-campaign-context-value">${escapeHtml(launchWindowLabel)}</strong></span>
 1570:             </div>
 1571:           </div>
 1572: 
 1573:           <aside class="mhos-campaign-strategist-panel mhos-context-actions mhos-executive-ai-panel" aria-label="Campaign strategist recommendation">
 1574:             <span class="mhos-campaign-panel-label">Strategist next move</span>
 1575:             <strong class="mhos-campaign-panel-action mhos-executive-guidance">${escapeHtml(strategistNextAction)}</strong>
 1576:             <p class="mhos-campaign-panel-copy mhos-executive-guidance">${escapeHtml(strategistMode)}</p>
 1577:           </aside>
 1578: 
 1579:           <div class="mhos-campaign-actions mhos-context-actions mhos-executive-action-row" aria-label="Campaign command actions">
 1580:             <button id="campaignRefreshIntelligenceBtn" class="btn btn-secondary mhos-context-action" type="button">Refresh campaign intelligence</button>
 1581:             <button id="campaignSaveDraftBtn" class="btn btn-secondary mhos-context-action" type="button">Save campaign draft</button>
 1582:             <button id="campaignBuildPlanBtn" class="btn btn-primary mhos-context-action" type="button">Save campaign plan</button>
 1583:           </div>
 1584: 
 1585:           <div class="mhos-campaign-operating-summary mhos-executive-summary-grid" aria-label="Campaign operating summary">
 1586:             <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${readinessTone} mhos-executive-summary-item">
 1587:               <span class="mhos-campaign-metric-label mhos-executive-metric-label">Readiness</span>
 1588:               <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(executionReadiness.status)}</strong>
 1589:               <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(executionReadiness.total ? `${executionReadiness.total} open gate${executionReadiness.total === 1 ? "" : "s"}` : "Launch gates clear")}</small>
 1590:             </article>
 1591:             <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${intelligenceTone} mhos-executive-summary-item">
 1592:               <span class="mhos-campaign-metric-label mhos-executive-metric-label">Intelligence</span>
 1593:               <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(intelligenceLabel)}</strong>
 1594:               <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(intelligenceError || (hasLiveIntelligence ? "Signals active" : "Projection mode"))}</small>
 1595:             </article>
 1596:             <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${blockerTone} mhos-executive-summary-item">
 1597:               <span class="mhos-campaign-metric-label mhos-executive-metric-label">Blockers</span>
 1598:               <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(String(executionReadiness.total))}</strong>
 1599:               <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(executionReadiness.total ? "Needs operator attention" : "No open launch blockers")}</small>
 1600:             </article>
 1601:             <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${channelTone} mhos-executive-summary-item">
 1602:               <span class="mhos-campaign-metric-label mhos-executive-metric-label">Channels</span>
 1603:               <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(channelStateLabel)}</strong>
 1604:               <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(recommendedChannelCount ? `${recommendedChannelCount} AI recommendations` : "Awaiting channel mix")}</small>
 1605:             </article>
 1606:           </div>
 1607:         </section>
 1608: 
 1609:         <div class="campaign-studio-layout">
 1610:           <form id="campaignStudioForm" class="campaign-studio-main">
 1611:             <section class="card">
 1612:               <div class="card-head">
 1613:                 <h3>Campaign Basics</h3>
 1614:                 <span class="card-badge neutral">Define</span>
 1615:               </div>
 1616:               <div class="campaign-section-copy">
 1617:                 Lock the core campaign definition first so planning, routing, and AI prompts all reference the same structure.
 1618:               </div>
 1619:               <div class="setup-form-grid setup-form-grid-2">
 1620:                 ${renderField({
 1621:                   name: "campaignName",
 1622:                   label: "Campaign name",
 1623:                   value: values.campaignName,
 1624:                   helper: "Use the shared name operators, AI, execution packages, and reporting should all reference.",
 1625:                   placeholder: "Spring launch wave 1",
 1626:                   escapeHtml
```

#### Match 4 — line 1582

```js
 1537:     const channelStateLabel = connectedChannels.length
 1538:       ? `${connectedChannels.length} connected`
 1539:       : recommendedChannelCount
 1540:         ? `${recommendedChannelCount} recommended`
 1541:         : "Needs signal";
 1542:     const channelTone = connectedChannels.length ? "success" : recommendedChannelCount ? "warning" : "neutral";
 1543:     const budgetValue = formatCurrency(values.budget, overviewData.currency || "USD");
 1544:     const budgetLabel = budgetValue === "-" ? "Budget pending" : budgetValue;
 1545:     const launchWindowLabel = [values.startDate, values.endDate].filter(Boolean).join(" to ") || "Window pending";
 1546:     const marketLabel = safeText(firstNonEmpty(values.market, overviewData.market), "Market pending");
 1547:     const productLabel = safeText(firstNonEmpty(values.productFocus, overviewData.project_name, projectName), "Product pending");
 1548:     const goalLabel = safeText(values.campaignGoal, "Goal pending");
 1549:     const strategistNextAction = safeText(strategyGuidance.nextAction, "Review campaign plan");
 1550:     const strategistMode = hasLiveIntelligence
 1551:       ? "Current intelligence is shaping campaign direction and readiness."
 1552:       : "Current draft data is projecting direction until live intelligence arrives.";
 1553: 
 1554:     root.innerHTML = `
 1555:       <div class="campaign-studio-wrapper">
 1556: 
 1557:         <section class="mhos-campaign-command-header mhos-context-ribbon" aria-label="Campaign command board">
 1558:           <div class="mhos-campaign-command-main mhos-context-main">
 1559:             <div class="mhos-campaign-kicker-row mhos-context-kicker">
 1560:               <span class="mhos-campaign-kicker mhos-context-kicker">Campaign Command Board</span>
 1561:               <span class="mhos-campaign-state mhos-campaign-state--${readinessTone}">${escapeHtml(executionReadiness.status)}</span>
 1562:             </div>
 1563:             <h2 class="mhos-campaign-title mhos-context-title">${escapeHtml(activeCampaignLabel)}</h2>
 1564:             <p class="mhos-campaign-summary mhos-context-description">${escapeHtml(goalLabel)}</p>
 1565:             <div class="mhos-campaign-context-row mhos-context-chip-row" aria-label="Campaign context">
 1566:               <span class="mhos-campaign-context-item mhos-context-chip">Market <strong class="mhos-campaign-context-value">${escapeHtml(marketLabel)}</strong></span>
 1567:               <span class="mhos-campaign-context-item mhos-context-chip">Product <strong class="mhos-campaign-context-value">${escapeHtml(productLabel)}</strong></span>
 1568:               <span class="mhos-campaign-context-item mhos-context-chip">Budget <strong class="mhos-campaign-context-value">${escapeHtml(budgetLabel)}</strong></span>
 1569:               <span class="mhos-campaign-context-item mhos-context-chip">Window <strong class="mhos-campaign-context-value">${escapeHtml(launchWindowLabel)}</strong></span>
 1570:             </div>
 1571:           </div>
 1572: 
 1573:           <aside class="mhos-campaign-strategist-panel mhos-context-actions mhos-executive-ai-panel" aria-label="Campaign strategist recommendation">
 1574:             <span class="mhos-campaign-panel-label">Strategist next move</span>
 1575:             <strong class="mhos-campaign-panel-action mhos-executive-guidance">${escapeHtml(strategistNextAction)}</strong>
 1576:             <p class="mhos-campaign-panel-copy mhos-executive-guidance">${escapeHtml(strategistMode)}</p>
 1577:           </aside>
 1578: 
 1579:           <div class="mhos-campaign-actions mhos-context-actions mhos-executive-action-row" aria-label="Campaign command actions">
 1580:             <button id="campaignRefreshIntelligenceBtn" class="btn btn-secondary mhos-context-action" type="button">Refresh campaign intelligence</button>
 1581:             <button id="campaignSaveDraftBtn" class="btn btn-secondary mhos-context-action" type="button">Save campaign draft</button>
 1582:             <button id="campaignBuildPlanBtn" class="btn btn-primary mhos-context-action" type="button">Save campaign plan</button>
 1583:           </div>
 1584: 
 1585:           <div class="mhos-campaign-operating-summary mhos-executive-summary-grid" aria-label="Campaign operating summary">
 1586:             <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${readinessTone} mhos-executive-summary-item">
 1587:               <span class="mhos-campaign-metric-label mhos-executive-metric-label">Readiness</span>
 1588:               <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(executionReadiness.status)}</strong>
 1589:               <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(executionReadiness.total ? `${executionReadiness.total} open gate${executionReadiness.total === 1 ? "" : "s"}` : "Launch gates clear")}</small>
 1590:             </article>
 1591:             <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${intelligenceTone} mhos-executive-summary-item">
 1592:               <span class="mhos-campaign-metric-label mhos-executive-metric-label">Intelligence</span>
 1593:               <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(intelligenceLabel)}</strong>
 1594:               <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(intelligenceError || (hasLiveIntelligence ? "Signals active" : "Projection mode"))}</small>
 1595:             </article>
 1596:             <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${blockerTone} mhos-executive-summary-item">
 1597:               <span class="mhos-campaign-metric-label mhos-executive-metric-label">Blockers</span>
 1598:               <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(String(executionReadiness.total))}</strong>
 1599:               <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(executionReadiness.total ? "Needs operator attention" : "No open launch blockers")}</small>
 1600:             </article>
 1601:             <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${channelTone} mhos-executive-summary-item">
 1602:               <span class="mhos-campaign-metric-label mhos-executive-metric-label">Channels</span>
 1603:               <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(channelStateLabel)}</strong>
 1604:               <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(recommendedChannelCount ? `${recommendedChannelCount} AI recommendations` : "Awaiting channel mix")}</small>
 1605:             </article>
 1606:           </div>
 1607:         </section>
 1608: 
 1609:         <div class="campaign-studio-layout">
 1610:           <form id="campaignStudioForm" class="campaign-studio-main">
 1611:             <section class="card">
 1612:               <div class="card-head">
 1613:                 <h3>Campaign Basics</h3>
 1614:                 <span class="card-badge neutral">Define</span>
 1615:               </div>
 1616:               <div class="campaign-section-copy">
 1617:                 Lock the core campaign definition first so planning, routing, and AI prompts all reference the same structure.
 1618:               </div>
 1619:               <div class="setup-form-grid setup-form-grid-2">
 1620:                 ${renderField({
 1621:                   name: "campaignName",
 1622:                   label: "Campaign name",
 1623:                   value: values.campaignName,
 1624:                   helper: "Use the shared name operators, AI, execution packages, and reporting should all reference.",
 1625:                   placeholder: "Spring launch wave 1",
 1626:                   escapeHtml
 1627:                 })}
```
### Refresh intelligence button

#### Match 1 — line 1429

```js
 1384:       navigateTo("content-studio");
 1385:     };
 1386:   }
 1387: 
 1388:   const mediaBtn = $("campaignOpenMediaStudioBtn");
 1389:   if (mediaBtn) {
 1390:     mediaBtn.onclick = () => {
 1391:       persistCampaignRouteHandoff({ projectName, session, destinationPage: "media-studio", createProjectHandoff });
 1392:       navigateTo("media-studio");
 1393:     };
 1394:   }
 1395: 
 1396:   const adsBtn = $("campaignOpenAdsManagerBtn");
 1397:   if (adsBtn) {
 1398:     adsBtn.onclick = () => {
 1399:       persistCampaignRouteHandoff({ projectName, session, destinationPage: "ads-manager", createProjectHandoff });
 1400:       navigateTo("ads-manager");
 1401:     };
 1402:   }
 1403: 
 1404:   const generatePackageBtn = $("campaignGeneratePackageBtn");
 1405:   if (generatePackageBtn) {
 1406:     generatePackageBtn.onclick = () => {
 1407:       session.generatedPackages += 1;
 1408:       showMessage?.("Campaign package drafted in this session. Backend export wiring can be connected next.");
 1409:       render();
 1410:     };
 1411:   }
 1412: 
 1413:   const dependenciesBtn = $("campaignReviewDependenciesBtn");
 1414:   if (dependenciesBtn) {
 1415:     dependenciesBtn.onclick = () => {
 1416:       const model = buildCampaignModel(state, session, session.values);
 1417:       if (model.executionReadiness.missingIntegrations.length) {
 1418:         navigateTo("integrations");
 1419:         return;
 1420:       }
 1421:       if (model.executionReadiness.missingAssets.length) {
 1422:         navigateTo("library");
 1423:         return;
 1424:       }
 1425:       navigateTo("insights");
 1426:     };
 1427:   }
 1428: 
 1429:   const refreshIntelligenceBtn = $("campaignRefreshIntelligenceBtn");
 1430:   if (refreshIntelligenceBtn) {
 1431:     refreshIntelligenceBtn.onclick = () => {
 1432:       session.intelligence.status = "idle";
 1433:       session.intelligence.error = "";
 1434:       startIntelligenceHydration({
 1435:         session,
 1436:         projectName,
 1437:         fetchProjectInsights,
 1438:         fetchProjectLearning,
 1439:         render,
 1440:         showError
 1441:       });
 1442:       render();
 1443:       showMessage?.("Refreshing campaign intelligence.");
 1444:     };
 1445:   }
 1446: }
 1447: 
 1448: export const campaignStudioRoute = {
 1449:   id: "campaign-studio",
 1450:   disableStandardLayout: true,
 1451:   meta: {
 1452:     eyebrow: "AI & Build",
 1453:     title: "Campaign Studio",
 1454:     description: "Plan campaign basics, launch waves, channel mix, and required assets in one execution-oriented workspace."
 1455:   },
 1456:   template: `
 1457:     <section class="page is-active" data-page="campaign-studio">
 1458:       <div id="campaignStudioRoot"></div>
 1459:     </section>
 1460:   `,
 1461:   render({
 1462:     getState,
 1463:     $,
 1464:     escapeHtml,
 1465:     safeText,
 1466:     navigateTo,
 1467:     showMessage,
 1468:     showError,
 1469:     fetchProjectInsights,
 1470:     fetchProjectLearning,
 1471:     saveProjectCampaign,
 1472:     createProjectHandoff
 1473:   }) {
 1474:     const state = getState();
```

#### Match 2 — line 1580

```js
 1535:     const blockerTone = executionReadiness.total ? "warning" : "success";
 1536:     const recommendedChannelCount = channelMix.organic.length + channelMix.paid.length + channelMix.support.length;
 1537:     const channelStateLabel = connectedChannels.length
 1538:       ? `${connectedChannels.length} connected`
 1539:       : recommendedChannelCount
 1540:         ? `${recommendedChannelCount} recommended`
 1541:         : "Needs signal";
 1542:     const channelTone = connectedChannels.length ? "success" : recommendedChannelCount ? "warning" : "neutral";
 1543:     const budgetValue = formatCurrency(values.budget, overviewData.currency || "USD");
 1544:     const budgetLabel = budgetValue === "-" ? "Budget pending" : budgetValue;
 1545:     const launchWindowLabel = [values.startDate, values.endDate].filter(Boolean).join(" to ") || "Window pending";
 1546:     const marketLabel = safeText(firstNonEmpty(values.market, overviewData.market), "Market pending");
 1547:     const productLabel = safeText(firstNonEmpty(values.productFocus, overviewData.project_name, projectName), "Product pending");
 1548:     const goalLabel = safeText(values.campaignGoal, "Goal pending");
 1549:     const strategistNextAction = safeText(strategyGuidance.nextAction, "Review campaign plan");
 1550:     const strategistMode = hasLiveIntelligence
 1551:       ? "Current intelligence is shaping campaign direction and readiness."
 1552:       : "Current draft data is projecting direction until live intelligence arrives.";
 1553: 
 1554:     root.innerHTML = `
 1555:       <div class="campaign-studio-wrapper">
 1556: 
 1557:         <section class="mhos-campaign-command-header mhos-context-ribbon" aria-label="Campaign command board">
 1558:           <div class="mhos-campaign-command-main mhos-context-main">
 1559:             <div class="mhos-campaign-kicker-row mhos-context-kicker">
 1560:               <span class="mhos-campaign-kicker mhos-context-kicker">Campaign Command Board</span>
 1561:               <span class="mhos-campaign-state mhos-campaign-state--${readinessTone}">${escapeHtml(executionReadiness.status)}</span>
 1562:             </div>
 1563:             <h2 class="mhos-campaign-title mhos-context-title">${escapeHtml(activeCampaignLabel)}</h2>
 1564:             <p class="mhos-campaign-summary mhos-context-description">${escapeHtml(goalLabel)}</p>
 1565:             <div class="mhos-campaign-context-row mhos-context-chip-row" aria-label="Campaign context">
 1566:               <span class="mhos-campaign-context-item mhos-context-chip">Market <strong class="mhos-campaign-context-value">${escapeHtml(marketLabel)}</strong></span>
 1567:               <span class="mhos-campaign-context-item mhos-context-chip">Product <strong class="mhos-campaign-context-value">${escapeHtml(productLabel)}</strong></span>
 1568:               <span class="mhos-campaign-context-item mhos-context-chip">Budget <strong class="mhos-campaign-context-value">${escapeHtml(budgetLabel)}</strong></span>
 1569:               <span class="mhos-campaign-context-item mhos-context-chip">Window <strong class="mhos-campaign-context-value">${escapeHtml(launchWindowLabel)}</strong></span>
 1570:             </div>
 1571:           </div>
 1572: 
 1573:           <aside class="mhos-campaign-strategist-panel mhos-context-actions mhos-executive-ai-panel" aria-label="Campaign strategist recommendation">
 1574:             <span class="mhos-campaign-panel-label">Strategist next move</span>
 1575:             <strong class="mhos-campaign-panel-action mhos-executive-guidance">${escapeHtml(strategistNextAction)}</strong>
 1576:             <p class="mhos-campaign-panel-copy mhos-executive-guidance">${escapeHtml(strategistMode)}</p>
 1577:           </aside>
 1578: 
 1579:           <div class="mhos-campaign-actions mhos-context-actions mhos-executive-action-row" aria-label="Campaign command actions">
 1580:             <button id="campaignRefreshIntelligenceBtn" class="btn btn-secondary mhos-context-action" type="button">Refresh campaign intelligence</button>
 1581:             <button id="campaignSaveDraftBtn" class="btn btn-secondary mhos-context-action" type="button">Save campaign draft</button>
 1582:             <button id="campaignBuildPlanBtn" class="btn btn-primary mhos-context-action" type="button">Save campaign plan</button>
 1583:           </div>
 1584: 
 1585:           <div class="mhos-campaign-operating-summary mhos-executive-summary-grid" aria-label="Campaign operating summary">
 1586:             <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${readinessTone} mhos-executive-summary-item">
 1587:               <span class="mhos-campaign-metric-label mhos-executive-metric-label">Readiness</span>
 1588:               <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(executionReadiness.status)}</strong>
 1589:               <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(executionReadiness.total ? `${executionReadiness.total} open gate${executionReadiness.total === 1 ? "" : "s"}` : "Launch gates clear")}</small>
 1590:             </article>
 1591:             <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${intelligenceTone} mhos-executive-summary-item">
 1592:               <span class="mhos-campaign-metric-label mhos-executive-metric-label">Intelligence</span>
 1593:               <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(intelligenceLabel)}</strong>
 1594:               <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(intelligenceError || (hasLiveIntelligence ? "Signals active" : "Projection mode"))}</small>
 1595:             </article>
 1596:             <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${blockerTone} mhos-executive-summary-item">
 1597:               <span class="mhos-campaign-metric-label mhos-executive-metric-label">Blockers</span>
 1598:               <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(String(executionReadiness.total))}</strong>
 1599:               <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(executionReadiness.total ? "Needs operator attention" : "No open launch blockers")}</small>
 1600:             </article>
 1601:             <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${channelTone} mhos-executive-summary-item">
 1602:               <span class="mhos-campaign-metric-label mhos-executive-metric-label">Channels</span>
 1603:               <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(channelStateLabel)}</strong>
 1604:               <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(recommendedChannelCount ? `${recommendedChannelCount} AI recommendations` : "Awaiting channel mix")}</small>
 1605:             </article>
 1606:           </div>
 1607:         </section>
 1608: 
 1609:         <div class="campaign-studio-layout">
 1610:           <form id="campaignStudioForm" class="campaign-studio-main">
 1611:             <section class="card">
 1612:               <div class="card-head">
 1613:                 <h3>Campaign Basics</h3>
 1614:                 <span class="card-badge neutral">Define</span>
 1615:               </div>
 1616:               <div class="campaign-section-copy">
 1617:                 Lock the core campaign definition first so planning, routing, and AI prompts all reference the same structure.
 1618:               </div>
 1619:               <div class="setup-form-grid setup-form-grid-2">
 1620:                 ${renderField({
 1621:                   name: "campaignName",
 1622:                   label: "Campaign name",
 1623:                   value: values.campaignName,
 1624:                   helper: "Use the shared name operators, AI, execution packages, and reporting should all reference.",
 1625:                   placeholder: "Spring launch wave 1",
```
### Route/action buttons

#### Match 1 — line 325

```js
  280:       learning: session.intelligence?.learning || null,
  281:       error: asString(session.intelligence?.error)
  282:     };
  283:     session.generatedPackages = Number.isFinite(session.generatedPackages) ? session.generatedPackages : 0;
  284:     session.lastAiHandoffId = asString(session.lastAiHandoffId);
  285:   }
  286: 
  287:   return campaignSessions.get(key);
  288: }
  289: 
  290: function renderField({
  291:   name,
  292:   label,
  293:   value,
  294:   helper,
  295:   placeholder,
  296:   escapeHtml,
  297:   multiline = false,
  298:   rows = 3
  299: }) {
  300:   return `
  301:     <div class="setup-field-group">
  302:       <div class="setup-field-head">
  303:         <label class="setup-label" for="campaign-${escapeHtml(name)}">${escapeHtml(label)}</label>
  304:         <span class="setup-field-state is-optional">Draft</span>
  305:       </div>
  306:       ${
  307:         multiline
  308:           ? `<textarea id="campaign-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input setup-textarea" rows="${rows}" placeholder="${escapeHtml(placeholder || "")}">${escapeHtml(asString(value))}</textarea>`
  309:           : `<input id="campaign-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input" type="text" value="${escapeHtml(asString(value))}" placeholder="${escapeHtml(placeholder || "")}">`
  310:       }
  311:       <div class="setup-helper">${escapeHtml(helper)}</div>
  312:     </div>
  313:   `;
  314: }
  315: 
  316: function renderSummaryItem(label, value, escapeHtml) {
  317:   return `<div class="data-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(asString(value) || "-")}</strong></div>`;
  318: }
  319: 
  320: function syncCampaignStudioBridge(projectName, values) {
  321:   const current = getSharedCampaignRecord(projectName, null);
  322:   setSharedCampaignRecord(projectName, {
  323:     ...(current || {}),
  324:     project: projectName || "",
  325:     source_page: "campaign-studio",
  326:     name: asString(values?.campaignName),
  327:     objective: asString(values?.campaignGoal),
  328:     audience: asString(values?.audiencePrimary),
  329:     channels: asString(values?.channelPlan)
  330:       .split(",")
  331:       .map((item) => asString(item))
  332:       .filter(Boolean),
  333:     offer: asString(values?.offerHeadline),
  334:     timeline: [
  335:       asString(values?.startDate),
  336:       asString(values?.endDate)
  337:     ].filter(Boolean).join(" to "),
  338:     budget: asString(values?.budget),
  339:     status: "draft",
  340:     form_values: { ...asObject(values) },
  341:     updated_at: new Date().toISOString()
  342:   });
  343: }
  344: 
  345: function hydrateValuesFromCampaignRecord(defaults, campaign) {
  346:   const record = asObject(campaign);
  347:   const formValues = asObject(record.form_values);
  348: 
  349:   return {
  350:     ...defaults,
  351:     ...formValues,
  352:     campaignName: asString(formValues.campaignName || record.name || defaults.campaignName),
  353:     campaignGoal: asString(formValues.campaignGoal || record.objective || defaults.campaignGoal),
  354:     audiencePrimary: asString(formValues.audiencePrimary || record.audience || defaults.audiencePrimary),
  355:     channelPlan: asString(formValues.channelPlan || asArray(record.channels).join(", ") || defaults.channelPlan),
  356:     offerHeadline: asString(formValues.offerHeadline || record.offer || defaults.offerHeadline),
  357:     budget: asString(formValues.budget || record.budget || defaults.budget)
  358:   };
  359: }
  360: 
  361: function joinPackageList(value) {
  362:   if (!Array.isArray(value)) return readableValue(value);
  363:   return uniqueStrings(asArray(value).map((item) => {
  364:     if (typeof item === "string") return item;
  365:     const record = asObject(item);
  366:     return firstNonEmpty(record.name, record.title, record.label, record.channel, record.product, record.summary, record.action);
  367:   })).join(", ");
  368: }
  369: 
  370: function phaseValue(phases, index, key) {
```

#### Match 2 — line 380

```js
  335:       asString(values?.startDate),
  336:       asString(values?.endDate)
  337:     ].filter(Boolean).join(" to "),
  338:     budget: asString(values?.budget),
  339:     status: "draft",
  340:     form_values: { ...asObject(values) },
  341:     updated_at: new Date().toISOString()
  342:   });
  343: }
  344: 
  345: function hydrateValuesFromCampaignRecord(defaults, campaign) {
  346:   const record = asObject(campaign);
  347:   const formValues = asObject(record.form_values);
  348: 
  349:   return {
  350:     ...defaults,
  351:     ...formValues,
  352:     campaignName: asString(formValues.campaignName || record.name || defaults.campaignName),
  353:     campaignGoal: asString(formValues.campaignGoal || record.objective || defaults.campaignGoal),
  354:     audiencePrimary: asString(formValues.audiencePrimary || record.audience || defaults.audiencePrimary),
  355:     channelPlan: asString(formValues.channelPlan || asArray(record.channels).join(", ") || defaults.channelPlan),
  356:     offerHeadline: asString(formValues.offerHeadline || record.offer || defaults.offerHeadline),
  357:     budget: asString(formValues.budget || record.budget || defaults.budget)
  358:   };
  359: }
  360: 
  361: function joinPackageList(value) {
  362:   if (!Array.isArray(value)) return readableValue(value);
  363:   return uniqueStrings(asArray(value).map((item) => {
  364:     if (typeof item === "string") return item;
  365:     const record = asObject(item);
  366:     return firstNonEmpty(record.name, record.title, record.label, record.channel, record.product, record.summary, record.action);
  367:   })).join(", ");
  368: }
  369: 
  370: function phaseValue(phases, index, key) {
  371:   const phase = asObject(asArray(phases)[index]);
  372:   if (!Object.keys(phase).length) return "";
  373:   if (key === "name") return firstNonEmpty(phase.name, phase.title, `Wave ${index + 1}`);
  374:   if (key === "focus") return firstNonEmpty(phase.goal, phase.objective, phase.focus, phase.summary, joinPackageList(phase.actions || phase.steps));
  375:   if (key === "channels") return joinPackageList(phase.channels);
  376:   return "";
  377: }
  378: 
  379: function applyAiCampaignHandoff(projectName, operations, session) {
  380:   const handoff = getSharedHandoff(projectName, "campaign-studio", operations, "ai-command");
  381:   const handoffId = asString(handoff?.id || handoff?.updated_at || handoff?.created_at || handoff?.payload?.prompt);
  382:   if (!handoffId || handoffId === asString(session.lastAiHandoffId)) return false;
  383: 
  384:   const payload = asObject(handoff.payload);
  385:   const output = asObject(payload.output);
  386:   const response = asObject(output.response || output);
  387:   const pkg = asObject(response.campaignPackage || response.campaign_package || payload.campaignPackage || payload.campaign_package);
  388:   if (!Object.keys(pkg).length) return false;
  389: 
  390:   const phases = asArray(pkg.launchPhases || pkg.launch_phases || pkg.phases);
  391:   session.values = {
  392:     ...session.values,
  393:     campaignName: firstNonEmpty(pkg.concept, pkg.campaignConcept, response.title, session.values.campaignName),
  394:     campaignGoal: firstNonEmpty(response.summary, pkg.goal, pkg.objective, session.values.campaignGoal),
  395:     productFocus: firstNonEmpty(joinPackageList(pkg.products), session.values.productFocus),
  396:     productAngle: firstNonEmpty(joinPackageList(pkg.contentAngles || pkg.content_angles), pkg.concept, session.values.productAngle),
  397:     audiencePrimary: firstNonEmpty(pkg.targetAudience, pkg.target_audience, pkg.audience, session.values.audiencePrimary),
  398:     audienceNeed: firstNonEmpty(pkg.audienceNeed, pkg.audience_need, session.values.audienceNeed),
  399:     channelPlan: firstNonEmpty(joinPackageList(pkg.channels), session.values.channelPlan),
  400:     offerHeadline: firstNonEmpty(pkg.offer, pkg.offerStrategy, pkg.offer_strategy, session.values.offerHeadline),
  401:     offerDetail: firstNonEmpty(joinPackageList(pkg.adAngles || pkg.ad_angles), session.values.offerDetail),
  402:     wave1Name: firstNonEmpty(phaseValue(phases, 0, "name"), session.values.wave1Name),
  403:     wave1Focus: firstNonEmpty(phaseValue(phases, 0, "focus"), session.values.wave1Focus),
  404:     wave1Channels: firstNonEmpty(phaseValue(phases, 0, "channels"), session.values.wave1Channels),
  405:     wave2Name: firstNonEmpty(phaseValue(phases, 1, "name"), session.values.wave2Name),
  406:     wave2Focus: firstNonEmpty(phaseValue(phases, 1, "focus"), session.values.wave2Focus),
  407:     wave2Channels: firstNonEmpty(phaseValue(phases, 1, "channels"), session.values.wave2Channels),
  408:     wave3Name: firstNonEmpty(phaseValue(phases, 2, "name"), session.values.wave3Name),
  409:     wave3Focus: firstNonEmpty(phaseValue(phases, 2, "focus"), session.values.wave3Focus),
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
```

#### Match 3 — line 381

```js
  336:       asString(values?.endDate)
  337:     ].filter(Boolean).join(" to "),
  338:     budget: asString(values?.budget),
  339:     status: "draft",
  340:     form_values: { ...asObject(values) },
  341:     updated_at: new Date().toISOString()
  342:   });
  343: }
  344: 
  345: function hydrateValuesFromCampaignRecord(defaults, campaign) {
  346:   const record = asObject(campaign);
  347:   const formValues = asObject(record.form_values);
  348: 
  349:   return {
  350:     ...defaults,
  351:     ...formValues,
  352:     campaignName: asString(formValues.campaignName || record.name || defaults.campaignName),
  353:     campaignGoal: asString(formValues.campaignGoal || record.objective || defaults.campaignGoal),
  354:     audiencePrimary: asString(formValues.audiencePrimary || record.audience || defaults.audiencePrimary),
  355:     channelPlan: asString(formValues.channelPlan || asArray(record.channels).join(", ") || defaults.channelPlan),
  356:     offerHeadline: asString(formValues.offerHeadline || record.offer || defaults.offerHeadline),
  357:     budget: asString(formValues.budget || record.budget || defaults.budget)
  358:   };
  359: }
  360: 
  361: function joinPackageList(value) {
  362:   if (!Array.isArray(value)) return readableValue(value);
  363:   return uniqueStrings(asArray(value).map((item) => {
  364:     if (typeof item === "string") return item;
  365:     const record = asObject(item);
  366:     return firstNonEmpty(record.name, record.title, record.label, record.channel, record.product, record.summary, record.action);
  367:   })).join(", ");
  368: }
  369: 
  370: function phaseValue(phases, index, key) {
  371:   const phase = asObject(asArray(phases)[index]);
  372:   if (!Object.keys(phase).length) return "";
  373:   if (key === "name") return firstNonEmpty(phase.name, phase.title, `Wave ${index + 1}`);
  374:   if (key === "focus") return firstNonEmpty(phase.goal, phase.objective, phase.focus, phase.summary, joinPackageList(phase.actions || phase.steps));
  375:   if (key === "channels") return joinPackageList(phase.channels);
  376:   return "";
  377: }
  378: 
  379: function applyAiCampaignHandoff(projectName, operations, session) {
  380:   const handoff = getSharedHandoff(projectName, "campaign-studio", operations, "ai-command");
  381:   const handoffId = asString(handoff?.id || handoff?.updated_at || handoff?.created_at || handoff?.payload?.prompt);
  382:   if (!handoffId || handoffId === asString(session.lastAiHandoffId)) return false;
  383: 
  384:   const payload = asObject(handoff.payload);
  385:   const output = asObject(payload.output);
  386:   const response = asObject(output.response || output);
  387:   const pkg = asObject(response.campaignPackage || response.campaign_package || payload.campaignPackage || payload.campaign_package);
  388:   if (!Object.keys(pkg).length) return false;
  389: 
  390:   const phases = asArray(pkg.launchPhases || pkg.launch_phases || pkg.phases);
  391:   session.values = {
  392:     ...session.values,
  393:     campaignName: firstNonEmpty(pkg.concept, pkg.campaignConcept, response.title, session.values.campaignName),
  394:     campaignGoal: firstNonEmpty(response.summary, pkg.goal, pkg.objective, session.values.campaignGoal),
  395:     productFocus: firstNonEmpty(joinPackageList(pkg.products), session.values.productFocus),
  396:     productAngle: firstNonEmpty(joinPackageList(pkg.contentAngles || pkg.content_angles), pkg.concept, session.values.productAngle),
  397:     audiencePrimary: firstNonEmpty(pkg.targetAudience, pkg.target_audience, pkg.audience, session.values.audiencePrimary),
  398:     audienceNeed: firstNonEmpty(pkg.audienceNeed, pkg.audience_need, session.values.audienceNeed),
  399:     channelPlan: firstNonEmpty(joinPackageList(pkg.channels), session.values.channelPlan),
  400:     offerHeadline: firstNonEmpty(pkg.offer, pkg.offerStrategy, pkg.offer_strategy, session.values.offerHeadline),
  401:     offerDetail: firstNonEmpty(joinPackageList(pkg.adAngles || pkg.ad_angles), session.values.offerDetail),
  402:     wave1Name: firstNonEmpty(phaseValue(phases, 0, "name"), session.values.wave1Name),
  403:     wave1Focus: firstNonEmpty(phaseValue(phases, 0, "focus"), session.values.wave1Focus),
  404:     wave1Channels: firstNonEmpty(phaseValue(phases, 0, "channels"), session.values.wave1Channels),
  405:     wave2Name: firstNonEmpty(phaseValue(phases, 1, "name"), session.values.wave2Name),
  406:     wave2Focus: firstNonEmpty(phaseValue(phases, 1, "focus"), session.values.wave2Focus),
  407:     wave2Channels: firstNonEmpty(phaseValue(phases, 1, "channels"), session.values.wave2Channels),
  408:     wave3Name: firstNonEmpty(phaseValue(phases, 2, "name"), session.values.wave3Name),
  409:     wave3Focus: firstNonEmpty(phaseValue(phases, 2, "focus"), session.values.wave3Focus),
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
```

#### Match 4 — line 382

```js
  337:     ].filter(Boolean).join(" to "),
  338:     budget: asString(values?.budget),
  339:     status: "draft",
  340:     form_values: { ...asObject(values) },
  341:     updated_at: new Date().toISOString()
  342:   });
  343: }
  344: 
  345: function hydrateValuesFromCampaignRecord(defaults, campaign) {
  346:   const record = asObject(campaign);
  347:   const formValues = asObject(record.form_values);
  348: 
  349:   return {
  350:     ...defaults,
  351:     ...formValues,
  352:     campaignName: asString(formValues.campaignName || record.name || defaults.campaignName),
  353:     campaignGoal: asString(formValues.campaignGoal || record.objective || defaults.campaignGoal),
  354:     audiencePrimary: asString(formValues.audiencePrimary || record.audience || defaults.audiencePrimary),
  355:     channelPlan: asString(formValues.channelPlan || asArray(record.channels).join(", ") || defaults.channelPlan),
  356:     offerHeadline: asString(formValues.offerHeadline || record.offer || defaults.offerHeadline),
  357:     budget: asString(formValues.budget || record.budget || defaults.budget)
  358:   };
  359: }
  360: 
  361: function joinPackageList(value) {
  362:   if (!Array.isArray(value)) return readableValue(value);
  363:   return uniqueStrings(asArray(value).map((item) => {
  364:     if (typeof item === "string") return item;
  365:     const record = asObject(item);
  366:     return firstNonEmpty(record.name, record.title, record.label, record.channel, record.product, record.summary, record.action);
  367:   })).join(", ");
  368: }
  369: 
  370: function phaseValue(phases, index, key) {
  371:   const phase = asObject(asArray(phases)[index]);
  372:   if (!Object.keys(phase).length) return "";
  373:   if (key === "name") return firstNonEmpty(phase.name, phase.title, `Wave ${index + 1}`);
  374:   if (key === "focus") return firstNonEmpty(phase.goal, phase.objective, phase.focus, phase.summary, joinPackageList(phase.actions || phase.steps));
  375:   if (key === "channels") return joinPackageList(phase.channels);
  376:   return "";
  377: }
  378: 
  379: function applyAiCampaignHandoff(projectName, operations, session) {
  380:   const handoff = getSharedHandoff(projectName, "campaign-studio", operations, "ai-command");
  381:   const handoffId = asString(handoff?.id || handoff?.updated_at || handoff?.created_at || handoff?.payload?.prompt);
  382:   if (!handoffId || handoffId === asString(session.lastAiHandoffId)) return false;
  383: 
  384:   const payload = asObject(handoff.payload);
  385:   const output = asObject(payload.output);
  386:   const response = asObject(output.response || output);
  387:   const pkg = asObject(response.campaignPackage || response.campaign_package || payload.campaignPackage || payload.campaign_package);
  388:   if (!Object.keys(pkg).length) return false;
  389: 
  390:   const phases = asArray(pkg.launchPhases || pkg.launch_phases || pkg.phases);
  391:   session.values = {
  392:     ...session.values,
  393:     campaignName: firstNonEmpty(pkg.concept, pkg.campaignConcept, response.title, session.values.campaignName),
  394:     campaignGoal: firstNonEmpty(response.summary, pkg.goal, pkg.objective, session.values.campaignGoal),
  395:     productFocus: firstNonEmpty(joinPackageList(pkg.products), session.values.productFocus),
  396:     productAngle: firstNonEmpty(joinPackageList(pkg.contentAngles || pkg.content_angles), pkg.concept, session.values.productAngle),
  397:     audiencePrimary: firstNonEmpty(pkg.targetAudience, pkg.target_audience, pkg.audience, session.values.audiencePrimary),
  398:     audienceNeed: firstNonEmpty(pkg.audienceNeed, pkg.audience_need, session.values.audienceNeed),
  399:     channelPlan: firstNonEmpty(joinPackageList(pkg.channels), session.values.channelPlan),
  400:     offerHeadline: firstNonEmpty(pkg.offer, pkg.offerStrategy, pkg.offer_strategy, session.values.offerHeadline),
  401:     offerDetail: firstNonEmpty(joinPackageList(pkg.adAngles || pkg.ad_angles), session.values.offerDetail),
  402:     wave1Name: firstNonEmpty(phaseValue(phases, 0, "name"), session.values.wave1Name),
  403:     wave1Focus: firstNonEmpty(phaseValue(phases, 0, "focus"), session.values.wave1Focus),
  404:     wave1Channels: firstNonEmpty(phaseValue(phases, 0, "channels"), session.values.wave1Channels),
  405:     wave2Name: firstNonEmpty(phaseValue(phases, 1, "name"), session.values.wave2Name),
  406:     wave2Focus: firstNonEmpty(phaseValue(phases, 1, "focus"), session.values.wave2Focus),
  407:     wave2Channels: firstNonEmpty(phaseValue(phases, 1, "channels"), session.values.wave2Channels),
  408:     wave3Name: firstNonEmpty(phaseValue(phases, 2, "name"), session.values.wave3Name),
  409:     wave3Focus: firstNonEmpty(phaseValue(phases, 2, "focus"), session.values.wave3Focus),
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
```

#### Match 5 — line 384

```js
  339:     status: "draft",
  340:     form_values: { ...asObject(values) },
  341:     updated_at: new Date().toISOString()
  342:   });
  343: }
  344: 
  345: function hydrateValuesFromCampaignRecord(defaults, campaign) {
  346:   const record = asObject(campaign);
  347:   const formValues = asObject(record.form_values);
  348: 
  349:   return {
  350:     ...defaults,
  351:     ...formValues,
  352:     campaignName: asString(formValues.campaignName || record.name || defaults.campaignName),
  353:     campaignGoal: asString(formValues.campaignGoal || record.objective || defaults.campaignGoal),
  354:     audiencePrimary: asString(formValues.audiencePrimary || record.audience || defaults.audiencePrimary),
  355:     channelPlan: asString(formValues.channelPlan || asArray(record.channels).join(", ") || defaults.channelPlan),
  356:     offerHeadline: asString(formValues.offerHeadline || record.offer || defaults.offerHeadline),
  357:     budget: asString(formValues.budget || record.budget || defaults.budget)
  358:   };
  359: }
  360: 
  361: function joinPackageList(value) {
  362:   if (!Array.isArray(value)) return readableValue(value);
  363:   return uniqueStrings(asArray(value).map((item) => {
  364:     if (typeof item === "string") return item;
  365:     const record = asObject(item);
  366:     return firstNonEmpty(record.name, record.title, record.label, record.channel, record.product, record.summary, record.action);
  367:   })).join(", ");
  368: }
  369: 
  370: function phaseValue(phases, index, key) {
  371:   const phase = asObject(asArray(phases)[index]);
  372:   if (!Object.keys(phase).length) return "";
  373:   if (key === "name") return firstNonEmpty(phase.name, phase.title, `Wave ${index + 1}`);
  374:   if (key === "focus") return firstNonEmpty(phase.goal, phase.objective, phase.focus, phase.summary, joinPackageList(phase.actions || phase.steps));
  375:   if (key === "channels") return joinPackageList(phase.channels);
  376:   return "";
  377: }
  378: 
  379: function applyAiCampaignHandoff(projectName, operations, session) {
  380:   const handoff = getSharedHandoff(projectName, "campaign-studio", operations, "ai-command");
  381:   const handoffId = asString(handoff?.id || handoff?.updated_at || handoff?.created_at || handoff?.payload?.prompt);
  382:   if (!handoffId || handoffId === asString(session.lastAiHandoffId)) return false;
  383: 
  384:   const payload = asObject(handoff.payload);
  385:   const output = asObject(payload.output);
  386:   const response = asObject(output.response || output);
  387:   const pkg = asObject(response.campaignPackage || response.campaign_package || payload.campaignPackage || payload.campaign_package);
  388:   if (!Object.keys(pkg).length) return false;
  389: 
  390:   const phases = asArray(pkg.launchPhases || pkg.launch_phases || pkg.phases);
  391:   session.values = {
  392:     ...session.values,
  393:     campaignName: firstNonEmpty(pkg.concept, pkg.campaignConcept, response.title, session.values.campaignName),
  394:     campaignGoal: firstNonEmpty(response.summary, pkg.goal, pkg.objective, session.values.campaignGoal),
  395:     productFocus: firstNonEmpty(joinPackageList(pkg.products), session.values.productFocus),
  396:     productAngle: firstNonEmpty(joinPackageList(pkg.contentAngles || pkg.content_angles), pkg.concept, session.values.productAngle),
  397:     audiencePrimary: firstNonEmpty(pkg.targetAudience, pkg.target_audience, pkg.audience, session.values.audiencePrimary),
  398:     audienceNeed: firstNonEmpty(pkg.audienceNeed, pkg.audience_need, session.values.audienceNeed),
  399:     channelPlan: firstNonEmpty(joinPackageList(pkg.channels), session.values.channelPlan),
  400:     offerHeadline: firstNonEmpty(pkg.offer, pkg.offerStrategy, pkg.offer_strategy, session.values.offerHeadline),
  401:     offerDetail: firstNonEmpty(joinPackageList(pkg.adAngles || pkg.ad_angles), session.values.offerDetail),
  402:     wave1Name: firstNonEmpty(phaseValue(phases, 0, "name"), session.values.wave1Name),
  403:     wave1Focus: firstNonEmpty(phaseValue(phases, 0, "focus"), session.values.wave1Focus),
  404:     wave1Channels: firstNonEmpty(phaseValue(phases, 0, "channels"), session.values.wave1Channels),
  405:     wave2Name: firstNonEmpty(phaseValue(phases, 1, "name"), session.values.wave2Name),
  406:     wave2Focus: firstNonEmpty(phaseValue(phases, 1, "focus"), session.values.wave2Focus),
  407:     wave2Channels: firstNonEmpty(phaseValue(phases, 1, "channels"), session.values.wave2Channels),
  408:     wave3Name: firstNonEmpty(phaseValue(phases, 2, "name"), session.values.wave3Name),
  409:     wave3Focus: firstNonEmpty(phaseValue(phases, 2, "focus"), session.values.wave3Focus),
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
```

#### Match 6 — line 421

```js
  376:   return "";
  377: }
  378: 
  379: function applyAiCampaignHandoff(projectName, operations, session) {
  380:   const handoff = getSharedHandoff(projectName, "campaign-studio", operations, "ai-command");
  381:   const handoffId = asString(handoff?.id || handoff?.updated_at || handoff?.created_at || handoff?.payload?.prompt);
  382:   if (!handoffId || handoffId === asString(session.lastAiHandoffId)) return false;
  383: 
  384:   const payload = asObject(handoff.payload);
  385:   const output = asObject(payload.output);
  386:   const response = asObject(output.response || output);
  387:   const pkg = asObject(response.campaignPackage || response.campaign_package || payload.campaignPackage || payload.campaign_package);
  388:   if (!Object.keys(pkg).length) return false;
  389: 
  390:   const phases = asArray(pkg.launchPhases || pkg.launch_phases || pkg.phases);
  391:   session.values = {
  392:     ...session.values,
  393:     campaignName: firstNonEmpty(pkg.concept, pkg.campaignConcept, response.title, session.values.campaignName),
  394:     campaignGoal: firstNonEmpty(response.summary, pkg.goal, pkg.objective, session.values.campaignGoal),
  395:     productFocus: firstNonEmpty(joinPackageList(pkg.products), session.values.productFocus),
  396:     productAngle: firstNonEmpty(joinPackageList(pkg.contentAngles || pkg.content_angles), pkg.concept, session.values.productAngle),
  397:     audiencePrimary: firstNonEmpty(pkg.targetAudience, pkg.target_audience, pkg.audience, session.values.audiencePrimary),
  398:     audienceNeed: firstNonEmpty(pkg.audienceNeed, pkg.audience_need, session.values.audienceNeed),
  399:     channelPlan: firstNonEmpty(joinPackageList(pkg.channels), session.values.channelPlan),
  400:     offerHeadline: firstNonEmpty(pkg.offer, pkg.offerStrategy, pkg.offer_strategy, session.values.offerHeadline),
  401:     offerDetail: firstNonEmpty(joinPackageList(pkg.adAngles || pkg.ad_angles), session.values.offerDetail),
  402:     wave1Name: firstNonEmpty(phaseValue(phases, 0, "name"), session.values.wave1Name),
  403:     wave1Focus: firstNonEmpty(phaseValue(phases, 0, "focus"), session.values.wave1Focus),
  404:     wave1Channels: firstNonEmpty(phaseValue(phases, 0, "channels"), session.values.wave1Channels),
  405:     wave2Name: firstNonEmpty(phaseValue(phases, 1, "name"), session.values.wave2Name),
  406:     wave2Focus: firstNonEmpty(phaseValue(phases, 1, "focus"), session.values.wave2Focus),
  407:     wave2Channels: firstNonEmpty(phaseValue(phases, 1, "channels"), session.values.wave2Channels),
  408:     wave3Name: firstNonEmpty(phaseValue(phases, 2, "name"), session.values.wave3Name),
  409:     wave3Focus: firstNonEmpty(phaseValue(phases, 2, "focus"), session.values.wave3Focus),
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
  438: function buildCampaignRecordPayload(projectName, session) {
  439:   const values = asObject(session.values);
  440:   const timeline = [asString(values.startDate), asString(values.endDate)].filter(Boolean).join(" to ");
  441: 
  442:   return {
  443:     id: session.recordId || undefined,
  444:     name: asString(values.campaignName || projectName),
  445:     objective: asString(values.campaignGoal),
  446:     audience: asString(values.audiencePrimary),
  447:     channels: asString(values.channelPlan),
  448:     offer: asString(values.offerHeadline),
  449:     timeline,
  450:     budget: asString(values.budget),
  451:     status: "draft",
  452:     source_page: "campaign-studio",
  453:     owner: "Strategist",
  454:     owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  455:     review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  456:     service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  457:     linked_assets: [],
  458:     linked_tasks: [],
  459:     linked_approvals: [],
  460:     form_values: { ...values }
  461:   };
  462: }
  463: 
  464: function persistCampaignRouteHandoff({ projectName, session, destinationPage, createProjectHandoff }) {
  465:   const destination = CAMPAIGN_ROUTE_ROLES[destinationPage];
  466:   if (!projectName || !destination) return;
```

#### Match 7 — line 425

```js
  380:   const handoff = getSharedHandoff(projectName, "campaign-studio", operations, "ai-command");
  381:   const handoffId = asString(handoff?.id || handoff?.updated_at || handoff?.created_at || handoff?.payload?.prompt);
  382:   if (!handoffId || handoffId === asString(session.lastAiHandoffId)) return false;
  383: 
  384:   const payload = asObject(handoff.payload);
  385:   const output = asObject(payload.output);
  386:   const response = asObject(output.response || output);
  387:   const pkg = asObject(response.campaignPackage || response.campaign_package || payload.campaignPackage || payload.campaign_package);
  388:   if (!Object.keys(pkg).length) return false;
  389: 
  390:   const phases = asArray(pkg.launchPhases || pkg.launch_phases || pkg.phases);
  391:   session.values = {
  392:     ...session.values,
  393:     campaignName: firstNonEmpty(pkg.concept, pkg.campaignConcept, response.title, session.values.campaignName),
  394:     campaignGoal: firstNonEmpty(response.summary, pkg.goal, pkg.objective, session.values.campaignGoal),
  395:     productFocus: firstNonEmpty(joinPackageList(pkg.products), session.values.productFocus),
  396:     productAngle: firstNonEmpty(joinPackageList(pkg.contentAngles || pkg.content_angles), pkg.concept, session.values.productAngle),
  397:     audiencePrimary: firstNonEmpty(pkg.targetAudience, pkg.target_audience, pkg.audience, session.values.audiencePrimary),
  398:     audienceNeed: firstNonEmpty(pkg.audienceNeed, pkg.audience_need, session.values.audienceNeed),
  399:     channelPlan: firstNonEmpty(joinPackageList(pkg.channels), session.values.channelPlan),
  400:     offerHeadline: firstNonEmpty(pkg.offer, pkg.offerStrategy, pkg.offer_strategy, session.values.offerHeadline),
  401:     offerDetail: firstNonEmpty(joinPackageList(pkg.adAngles || pkg.ad_angles), session.values.offerDetail),
  402:     wave1Name: firstNonEmpty(phaseValue(phases, 0, "name"), session.values.wave1Name),
  403:     wave1Focus: firstNonEmpty(phaseValue(phases, 0, "focus"), session.values.wave1Focus),
  404:     wave1Channels: firstNonEmpty(phaseValue(phases, 0, "channels"), session.values.wave1Channels),
  405:     wave2Name: firstNonEmpty(phaseValue(phases, 1, "name"), session.values.wave2Name),
  406:     wave2Focus: firstNonEmpty(phaseValue(phases, 1, "focus"), session.values.wave2Focus),
  407:     wave2Channels: firstNonEmpty(phaseValue(phases, 1, "channels"), session.values.wave2Channels),
  408:     wave3Name: firstNonEmpty(phaseValue(phases, 2, "name"), session.values.wave3Name),
  409:     wave3Focus: firstNonEmpty(phaseValue(phases, 2, "focus"), session.values.wave3Focus),
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
  438: function buildCampaignRecordPayload(projectName, session) {
  439:   const values = asObject(session.values);
  440:   const timeline = [asString(values.startDate), asString(values.endDate)].filter(Boolean).join(" to ");
  441: 
  442:   return {
  443:     id: session.recordId || undefined,
  444:     name: asString(values.campaignName || projectName),
  445:     objective: asString(values.campaignGoal),
  446:     audience: asString(values.audiencePrimary),
  447:     channels: asString(values.channelPlan),
  448:     offer: asString(values.offerHeadline),
  449:     timeline,
  450:     budget: asString(values.budget),
  451:     status: "draft",
  452:     source_page: "campaign-studio",
  453:     owner: "Strategist",
  454:     owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  455:     review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  456:     service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  457:     linked_assets: [],
  458:     linked_tasks: [],
  459:     linked_approvals: [],
  460:     form_values: { ...values }
  461:   };
  462: }
  463: 
  464: function persistCampaignRouteHandoff({ projectName, session, destinationPage, createProjectHandoff }) {
  465:   const destination = CAMPAIGN_ROUTE_ROLES[destinationPage];
  466:   if (!projectName || !destination) return;
  467: 
  468:   const handoff = {
  469:     source_page: "campaign-studio",
  470:     destination_page: destinationPage,
```

#### Match 8 — line 452

```js
  407:     wave2Channels: firstNonEmpty(phaseValue(phases, 1, "channels"), session.values.wave2Channels),
  408:     wave3Name: firstNonEmpty(phaseValue(phases, 2, "name"), session.values.wave3Name),
  409:     wave3Focus: firstNonEmpty(phaseValue(phases, 2, "focus"), session.values.wave3Focus),
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
  438: function buildCampaignRecordPayload(projectName, session) {
  439:   const values = asObject(session.values);
  440:   const timeline = [asString(values.startDate), asString(values.endDate)].filter(Boolean).join(" to ");
  441: 
  442:   return {
  443:     id: session.recordId || undefined,
  444:     name: asString(values.campaignName || projectName),
  445:     objective: asString(values.campaignGoal),
  446:     audience: asString(values.audiencePrimary),
  447:     channels: asString(values.channelPlan),
  448:     offer: asString(values.offerHeadline),
  449:     timeline,
  450:     budget: asString(values.budget),
  451:     status: "draft",
  452:     source_page: "campaign-studio",
  453:     owner: "Strategist",
  454:     owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  455:     review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  456:     service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  457:     linked_assets: [],
  458:     linked_tasks: [],
  459:     linked_approvals: [],
  460:     form_values: { ...values }
  461:   };
  462: }
  463: 
  464: function persistCampaignRouteHandoff({ projectName, session, destinationPage, createProjectHandoff }) {
  465:   const destination = CAMPAIGN_ROUTE_ROLES[destinationPage];
  466:   if (!projectName || !destination) return;
  467: 
  468:   const handoff = {
  469:     source_page: "campaign-studio",
  470:     destination_page: destinationPage,
  471:     source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  472:     destination_role: destination.role,
  473:     source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  474:     destination_service_domain: destination.domain,
  475:     linked_entity: {
  476:       entity_type: "campaign",
  477:       entity_id: session.recordId || "",
  478:       route: "campaign-studio",
  479:       label: asString(session.values.campaignName || projectName)
  480:     },
  481:     payload: {
  482:       campaign_id: session.recordId || "",
  483:       campaign_name: asString(session.values.campaignName || projectName),
  484:       owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  485:       review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  486:       service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  487:       draft_context: buildCampaignRecordPayload(projectName, session)
  488:     }
  489:   };
  490: 
  491:   setSharedHandoff(projectName, destinationPage, handoff);
  492:   createProjectHandoff?.(projectName, handoff).catch((error) => {
  493:     console.warn("Failed to persist campaign route handoff:", error.message);
  494:   });
  495: }
  496: 
  497: function scheduleCampaignPersistence(projectName, session, saveProjectCampaign) {
```

#### Match 9 — line 468

```js
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
  438: function buildCampaignRecordPayload(projectName, session) {
  439:   const values = asObject(session.values);
  440:   const timeline = [asString(values.startDate), asString(values.endDate)].filter(Boolean).join(" to ");
  441: 
  442:   return {
  443:     id: session.recordId || undefined,
  444:     name: asString(values.campaignName || projectName),
  445:     objective: asString(values.campaignGoal),
  446:     audience: asString(values.audiencePrimary),
  447:     channels: asString(values.channelPlan),
  448:     offer: asString(values.offerHeadline),
  449:     timeline,
  450:     budget: asString(values.budget),
  451:     status: "draft",
  452:     source_page: "campaign-studio",
  453:     owner: "Strategist",
  454:     owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  455:     review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  456:     service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  457:     linked_assets: [],
  458:     linked_tasks: [],
  459:     linked_approvals: [],
  460:     form_values: { ...values }
  461:   };
  462: }
  463: 
  464: function persistCampaignRouteHandoff({ projectName, session, destinationPage, createProjectHandoff }) {
  465:   const destination = CAMPAIGN_ROUTE_ROLES[destinationPage];
  466:   if (!projectName || !destination) return;
  467: 
  468:   const handoff = {
  469:     source_page: "campaign-studio",
  470:     destination_page: destinationPage,
  471:     source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  472:     destination_role: destination.role,
  473:     source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  474:     destination_service_domain: destination.domain,
  475:     linked_entity: {
  476:       entity_type: "campaign",
  477:       entity_id: session.recordId || "",
  478:       route: "campaign-studio",
  479:       label: asString(session.values.campaignName || projectName)
  480:     },
  481:     payload: {
  482:       campaign_id: session.recordId || "",
  483:       campaign_name: asString(session.values.campaignName || projectName),
  484:       owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  485:       review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  486:       service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  487:       draft_context: buildCampaignRecordPayload(projectName, session)
  488:     }
  489:   };
  490: 
  491:   setSharedHandoff(projectName, destinationPage, handoff);
  492:   createProjectHandoff?.(projectName, handoff).catch((error) => {
  493:     console.warn("Failed to persist campaign route handoff:", error.message);
  494:   });
  495: }
  496: 
  497: function scheduleCampaignPersistence(projectName, session, saveProjectCampaign) {
  498:   if (!projectName || typeof saveProjectCampaign !== "function") {
  499:     return;
  500:   }
  501: 
  502:   const key = projectName || "__default__";
  503:   const existing = campaignSaveTimers.get(key);
  504:   if (existing) {
  505:     clearTimeout(existing);
  506:   }
  507: 
  508:   const timer = setTimeout(async () => {
  509:     try {
  510:       const result = await saveProjectCampaign(projectName, buildCampaignRecordPayload(projectName, session));
  511:       const campaign = result?.campaign || null;
  512:       if (campaign?.id) {
  513:         session.recordId = campaign.id;
```

#### Match 10 — line 469

```js
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
  438: function buildCampaignRecordPayload(projectName, session) {
  439:   const values = asObject(session.values);
  440:   const timeline = [asString(values.startDate), asString(values.endDate)].filter(Boolean).join(" to ");
  441: 
  442:   return {
  443:     id: session.recordId || undefined,
  444:     name: asString(values.campaignName || projectName),
  445:     objective: asString(values.campaignGoal),
  446:     audience: asString(values.audiencePrimary),
  447:     channels: asString(values.channelPlan),
  448:     offer: asString(values.offerHeadline),
  449:     timeline,
  450:     budget: asString(values.budget),
  451:     status: "draft",
  452:     source_page: "campaign-studio",
  453:     owner: "Strategist",
  454:     owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  455:     review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  456:     service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  457:     linked_assets: [],
  458:     linked_tasks: [],
  459:     linked_approvals: [],
  460:     form_values: { ...values }
  461:   };
  462: }
  463: 
  464: function persistCampaignRouteHandoff({ projectName, session, destinationPage, createProjectHandoff }) {
  465:   const destination = CAMPAIGN_ROUTE_ROLES[destinationPage];
  466:   if (!projectName || !destination) return;
  467: 
  468:   const handoff = {
  469:     source_page: "campaign-studio",
  470:     destination_page: destinationPage,
  471:     source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  472:     destination_role: destination.role,
  473:     source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  474:     destination_service_domain: destination.domain,
  475:     linked_entity: {
  476:       entity_type: "campaign",
  477:       entity_id: session.recordId || "",
  478:       route: "campaign-studio",
  479:       label: asString(session.values.campaignName || projectName)
  480:     },
  481:     payload: {
  482:       campaign_id: session.recordId || "",
  483:       campaign_name: asString(session.values.campaignName || projectName),
  484:       owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  485:       review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  486:       service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  487:       draft_context: buildCampaignRecordPayload(projectName, session)
  488:     }
  489:   };
  490: 
  491:   setSharedHandoff(projectName, destinationPage, handoff);
  492:   createProjectHandoff?.(projectName, handoff).catch((error) => {
  493:     console.warn("Failed to persist campaign route handoff:", error.message);
  494:   });
  495: }
  496: 
  497: function scheduleCampaignPersistence(projectName, session, saveProjectCampaign) {
  498:   if (!projectName || typeof saveProjectCampaign !== "function") {
  499:     return;
  500:   }
  501: 
  502:   const key = projectName || "__default__";
  503:   const existing = campaignSaveTimers.get(key);
  504:   if (existing) {
  505:     clearTimeout(existing);
  506:   }
  507: 
  508:   const timer = setTimeout(async () => {
  509:     try {
  510:       const result = await saveProjectCampaign(projectName, buildCampaignRecordPayload(projectName, session));
  511:       const campaign = result?.campaign || null;
  512:       if (campaign?.id) {
  513:         session.recordId = campaign.id;
  514:         setSharedCampaignRecord(projectName, campaign);
```

#### Match 11 — line 470

```js
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
  438: function buildCampaignRecordPayload(projectName, session) {
  439:   const values = asObject(session.values);
  440:   const timeline = [asString(values.startDate), asString(values.endDate)].filter(Boolean).join(" to ");
  441: 
  442:   return {
  443:     id: session.recordId || undefined,
  444:     name: asString(values.campaignName || projectName),
  445:     objective: asString(values.campaignGoal),
  446:     audience: asString(values.audiencePrimary),
  447:     channels: asString(values.channelPlan),
  448:     offer: asString(values.offerHeadline),
  449:     timeline,
  450:     budget: asString(values.budget),
  451:     status: "draft",
  452:     source_page: "campaign-studio",
  453:     owner: "Strategist",
  454:     owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  455:     review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  456:     service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  457:     linked_assets: [],
  458:     linked_tasks: [],
  459:     linked_approvals: [],
  460:     form_values: { ...values }
  461:   };
  462: }
  463: 
  464: function persistCampaignRouteHandoff({ projectName, session, destinationPage, createProjectHandoff }) {
  465:   const destination = CAMPAIGN_ROUTE_ROLES[destinationPage];
  466:   if (!projectName || !destination) return;
  467: 
  468:   const handoff = {
  469:     source_page: "campaign-studio",
  470:     destination_page: destinationPage,
  471:     source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  472:     destination_role: destination.role,
  473:     source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  474:     destination_service_domain: destination.domain,
  475:     linked_entity: {
  476:       entity_type: "campaign",
  477:       entity_id: session.recordId || "",
  478:       route: "campaign-studio",
  479:       label: asString(session.values.campaignName || projectName)
  480:     },
  481:     payload: {
  482:       campaign_id: session.recordId || "",
  483:       campaign_name: asString(session.values.campaignName || projectName),
  484:       owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  485:       review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  486:       service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  487:       draft_context: buildCampaignRecordPayload(projectName, session)
  488:     }
  489:   };
  490: 
  491:   setSharedHandoff(projectName, destinationPage, handoff);
  492:   createProjectHandoff?.(projectName, handoff).catch((error) => {
  493:     console.warn("Failed to persist campaign route handoff:", error.message);
  494:   });
  495: }
  496: 
  497: function scheduleCampaignPersistence(projectName, session, saveProjectCampaign) {
  498:   if (!projectName || typeof saveProjectCampaign !== "function") {
  499:     return;
  500:   }
  501: 
  502:   const key = projectName || "__default__";
  503:   const existing = campaignSaveTimers.get(key);
  504:   if (existing) {
  505:     clearTimeout(existing);
  506:   }
  507: 
  508:   const timer = setTimeout(async () => {
  509:     try {
  510:       const result = await saveProjectCampaign(projectName, buildCampaignRecordPayload(projectName, session));
  511:       const campaign = result?.campaign || null;
  512:       if (campaign?.id) {
  513:         session.recordId = campaign.id;
  514:         setSharedCampaignRecord(projectName, campaign);
  515:       }
```

#### Match 12 — line 491

```js
  446:     audience: asString(values.audiencePrimary),
  447:     channels: asString(values.channelPlan),
  448:     offer: asString(values.offerHeadline),
  449:     timeline,
  450:     budget: asString(values.budget),
  451:     status: "draft",
  452:     source_page: "campaign-studio",
  453:     owner: "Strategist",
  454:     owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  455:     review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  456:     service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  457:     linked_assets: [],
  458:     linked_tasks: [],
  459:     linked_approvals: [],
  460:     form_values: { ...values }
  461:   };
  462: }
  463: 
  464: function persistCampaignRouteHandoff({ projectName, session, destinationPage, createProjectHandoff }) {
  465:   const destination = CAMPAIGN_ROUTE_ROLES[destinationPage];
  466:   if (!projectName || !destination) return;
  467: 
  468:   const handoff = {
  469:     source_page: "campaign-studio",
  470:     destination_page: destinationPage,
  471:     source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  472:     destination_role: destination.role,
  473:     source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  474:     destination_service_domain: destination.domain,
  475:     linked_entity: {
  476:       entity_type: "campaign",
  477:       entity_id: session.recordId || "",
  478:       route: "campaign-studio",
  479:       label: asString(session.values.campaignName || projectName)
  480:     },
  481:     payload: {
  482:       campaign_id: session.recordId || "",
  483:       campaign_name: asString(session.values.campaignName || projectName),
  484:       owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
  485:       review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
  486:       service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
  487:       draft_context: buildCampaignRecordPayload(projectName, session)
  488:     }
  489:   };
  490: 
  491:   setSharedHandoff(projectName, destinationPage, handoff);
  492:   createProjectHandoff?.(projectName, handoff).catch((error) => {
  493:     console.warn("Failed to persist campaign route handoff:", error.message);
  494:   });
  495: }
  496: 
  497: function scheduleCampaignPersistence(projectName, session, saveProjectCampaign) {
  498:   if (!projectName || typeof saveProjectCampaign !== "function") {
  499:     return;
  500:   }
  501: 
  502:   const key = projectName || "__default__";
  503:   const existing = campaignSaveTimers.get(key);
  504:   if (existing) {
  505:     clearTimeout(existing);
  506:   }
  507: 
  508:   const timer = setTimeout(async () => {
  509:     try {
  510:       const result = await saveProjectCampaign(projectName, buildCampaignRecordPayload(projectName, session));
  511:       const campaign = result?.campaign || null;
  512:       if (campaign?.id) {
  513:         session.recordId = campaign.id;
  514:         setSharedCampaignRecord(projectName, campaign);
  515:       }
  516:     } catch (error) {
  517:       console.warn("Failed to persist campaign draft:", error.message);
  518:     }
  519:   }, 250);
  520: 
  521:   campaignSaveTimers.set(key, timer);
  522: }
  523: 
  524: function renderEmptyState(title, description, escapeHtml) {
  525:   return `
  526:     <div class="campaign-studio-empty-state">
  527:       <strong>${escapeHtml(title)}</strong>
  528:       <p>${escapeHtml(description)}</p>
  529:     </div>
  530:   `;
  531: }
  532: 
  533: function renderIntelligenceList(items, escapeHtml, title, description) {
  534:   if (!items.length) {
  535:     return renderEmptyState(title, description, escapeHtml);
  536:   }
```
### Publishing/send/ad labels

#### Match 1 — line 17

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
```

#### Match 2 — line 37

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
```

#### Match 3 — line 38

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
```

#### Match 4 — line 39

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
```

#### Match 5 — line 40

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
```

#### Match 6 — line 41

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
```

#### Match 7 — line 45

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
   87: 
   88: function formatCurrency(value, currency = "USD") {
   89:   const parsed = Number(value);
   90:   if (!Number.isFinite(parsed)) return "-";
```

#### Match 8 — line 46

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
   87: 
   88: function formatCurrency(value, currency = "USD") {
   89:   const parsed = Number(value);
   90:   if (!Number.isFinite(parsed)) return "-";
   91:   try {
```

#### Match 9 — line 48

```js
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
   87: 
   88: function formatCurrency(value, currency = "USD") {
   89:   const parsed = Number(value);
   90:   if (!Number.isFinite(parsed)) return "-";
   91:   try {
   92:     return new Intl.NumberFormat(undefined, {
   93:       style: "currency",
```

#### Match 10 — line 54

```js
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
   87: 
   88: function formatCurrency(value, currency = "USD") {
   89:   const parsed = Number(value);
   90:   if (!Number.isFinite(parsed)) return "-";
   91:   try {
   92:     return new Intl.NumberFormat(undefined, {
   93:       style: "currency",
   94:       currency: currency || "USD",
   95:       maximumFractionDigits: 0
   96:     }).format(parsed);
   97:   } catch (_) {
   98:     return `${currency || "USD"} ${Math.round(parsed)}`;
   99:   }
```

#### Match 11 — line 56

```js
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
   87: 
   88: function formatCurrency(value, currency = "USD") {
   89:   const parsed = Number(value);
   90:   if (!Number.isFinite(parsed)) return "-";
   91:   try {
   92:     return new Intl.NumberFormat(undefined, {
   93:       style: "currency",
   94:       currency: currency || "USD",
   95:       maximumFractionDigits: 0
   96:     }).format(parsed);
   97:   } catch (_) {
   98:     return `${currency || "USD"} ${Math.round(parsed)}`;
   99:   }
  100: }
  101: 
```

#### Match 12 — line 65

```js
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
   87: 
   88: function formatCurrency(value, currency = "USD") {
   89:   const parsed = Number(value);
   90:   if (!Number.isFinite(parsed)) return "-";
   91:   try {
   92:     return new Intl.NumberFormat(undefined, {
   93:       style: "currency",
   94:       currency: currency || "USD",
   95:       maximumFractionDigits: 0
   96:     }).format(parsed);
   97:   } catch (_) {
   98:     return `${currency || "USD"} ${Math.round(parsed)}`;
   99:   }
  100: }
  101: 
  102: function formatPercent(value, digits = 0) {
  103:   const parsed = Number(value);
  104:   if (!Number.isFinite(parsed)) return "-";
  105:   return `${parsed.toFixed(digits)}%`;
  106: }
  107: 
  108: function titleCase(value) {
  109:   return asString(value)
  110:     .replace(/[_-]+/g, " ")
```
### Confirmation gates

_No match found._

### Disabled/review-only safety copy

#### Match 1 — line 1

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
```

#### Match 2 — line 4

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
```

#### Match 3 — line 60

```js
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
   87: 
   88: function formatCurrency(value, currency = "USD") {
   89:   const parsed = Number(value);
   90:   if (!Number.isFinite(parsed)) return "-";
   91:   try {
   92:     return new Intl.NumberFormat(undefined, {
   93:       style: "currency",
   94:       currency: currency || "USD",
   95:       maximumFractionDigits: 0
   96:     }).format(parsed);
   97:   } catch (_) {
   98:     return `${currency || "USD"} ${Math.round(parsed)}`;
   99:   }
  100: }
  101: 
  102: function formatPercent(value, digits = 0) {
  103:   const parsed = Number(value);
  104:   if (!Number.isFinite(parsed)) return "-";
  105:   return `${parsed.toFixed(digits)}%`;
```

#### Match 4 — line 62

```js
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
   87: 
   88: function formatCurrency(value, currency = "USD") {
   89:   const parsed = Number(value);
   90:   if (!Number.isFinite(parsed)) return "-";
   91:   try {
   92:     return new Intl.NumberFormat(undefined, {
   93:       style: "currency",
   94:       currency: currency || "USD",
   95:       maximumFractionDigits: 0
   96:     }).format(parsed);
   97:   } catch (_) {
   98:     return `${currency || "USD"} ${Math.round(parsed)}`;
   99:   }
  100: }
  101: 
  102: function formatPercent(value, digits = 0) {
  103:   const parsed = Number(value);
  104:   if (!Number.isFinite(parsed)) return "-";
  105:   return `${parsed.toFixed(digits)}%`;
  106: }
  107: 
```

#### Match 5 — line 67

```js
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
   87: 
   88: function formatCurrency(value, currency = "USD") {
   89:   const parsed = Number(value);
   90:   if (!Number.isFinite(parsed)) return "-";
   91:   try {
   92:     return new Intl.NumberFormat(undefined, {
   93:       style: "currency",
   94:       currency: currency || "USD",
   95:       maximumFractionDigits: 0
   96:     }).format(parsed);
   97:   } catch (_) {
   98:     return `${currency || "USD"} ${Math.round(parsed)}`;
   99:   }
  100: }
  101: 
  102: function formatPercent(value, digits = 0) {
  103:   const parsed = Number(value);
  104:   if (!Number.isFinite(parsed)) return "-";
  105:   return `${parsed.toFixed(digits)}%`;
  106: }
  107: 
  108: function titleCase(value) {
  109:   return asString(value)
  110:     .replace(/[_-]+/g, " ")
  111:     .replace(/\b\w/g, (match) => match.toUpperCase());
  112: }
```

#### Match 6 — line 119

```js
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
   87: 
   88: function formatCurrency(value, currency = "USD") {
   89:   const parsed = Number(value);
   90:   if (!Number.isFinite(parsed)) return "-";
   91:   try {
   92:     return new Intl.NumberFormat(undefined, {
   93:       style: "currency",
   94:       currency: currency || "USD",
   95:       maximumFractionDigits: 0
   96:     }).format(parsed);
   97:   } catch (_) {
   98:     return `${currency || "USD"} ${Math.round(parsed)}`;
   99:   }
  100: }
  101: 
  102: function formatPercent(value, digits = 0) {
  103:   const parsed = Number(value);
  104:   if (!Number.isFinite(parsed)) return "-";
  105:   return `${parsed.toFixed(digits)}%`;
  106: }
  107: 
  108: function titleCase(value) {
  109:   return asString(value)
  110:     .replace(/[_-]+/g, " ")
  111:     .replace(/\b\w/g, (match) => match.toUpperCase());
  112: }
  113: 
  114: function renderTeamOpsSummary(model, escapeHtml) {
  115:   return `
  116:     <div class="data-stack">
  117:       <div class="data-row"><span>Service lane</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.serviceDomain))}</strong></div>
  118:       <div class="data-row"><span>Owner role</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.ownerRole))}</strong></div>
  119:       <div class="data-row"><span>Review owner</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.reviewRole))}</strong></div>
  120:       <div class="data-row"><span>Route map</span><strong>${escapeHtml(`Content ${titleCase(CAMPAIGN_ROUTE_ROLES["content-studio"].role)} • Media ${titleCase(CAMPAIGN_ROUTE_ROLES["media-studio"].role)} • Publishing ${titleCase(CAMPAIGN_ROUTE_ROLES.publishing.role)} • Ads ${titleCase(CAMPAIGN_ROUTE_ROLES["ads-manager"].role)}`)}</strong></div>
  121:       <div class="data-row"><span>Readiness</span><strong>${escapeHtml(model.executionReadiness.status)}</strong></div>
  122:     </div>
  123:   `;
  124: }
  125: 
  126: function channelLabel(value) {
  127:   const key = asString(value).trim().toLowerCase();
  128:   return CHANNEL_LABELS[key] || titleCase(key) || "Unspecified";
  129: }
  130: 
  131: function uniqueStrings(values) {
  132:   return Array.from(new Set(
  133:     asArray(values)
  134:       .map((item) => asString(item).trim())
  135:       .filter(Boolean)
  136:   ));
  137: }
  138: 
  139: function uniqueBy(items, keyFn) {
  140:   const seen = new Set();
  141:   return asArray(items).filter((item) => {
  142:     const key = keyFn(item);
  143:     if (!key || seen.has(key)) return false;
  144:     seen.add(key);
  145:     return true;
  146:   });
  147: }
  148: 
  149: function firstNonEmpty(...values) {
  150:   for (const value of values) {
  151:     const normalized = asString(value).trim();
  152:     if (normalized && normalized !== "[object Object]") return normalized;
  153:   }
  154:   return "";
  155: }
  156: 
  157: function readableValue(value, fallback = "") {
  158:   if (value == null) return fallback;
  159:   if (typeof value === "string") return value.trim() === "[object Object]" ? fallback : value.trim();
  160:   if (typeof value === "number" || typeof value === "boolean") return String(value);
  161:   if (Array.isArray(value)) return uniqueStrings(value.map((item) => readableValue(item))).join(", ") || fallback;
  162:   const record = asObject(value);
  163:   return firstNonEmpty(
  164:     record.title,
```

#### Match 7 — line 120

```js
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
   87: 
   88: function formatCurrency(value, currency = "USD") {
   89:   const parsed = Number(value);
   90:   if (!Number.isFinite(parsed)) return "-";
   91:   try {
   92:     return new Intl.NumberFormat(undefined, {
   93:       style: "currency",
   94:       currency: currency || "USD",
   95:       maximumFractionDigits: 0
   96:     }).format(parsed);
   97:   } catch (_) {
   98:     return `${currency || "USD"} ${Math.round(parsed)}`;
   99:   }
  100: }
  101: 
  102: function formatPercent(value, digits = 0) {
  103:   const parsed = Number(value);
  104:   if (!Number.isFinite(parsed)) return "-";
  105:   return `${parsed.toFixed(digits)}%`;
  106: }
  107: 
  108: function titleCase(value) {
  109:   return asString(value)
  110:     .replace(/[_-]+/g, " ")
  111:     .replace(/\b\w/g, (match) => match.toUpperCase());
  112: }
  113: 
  114: function renderTeamOpsSummary(model, escapeHtml) {
  115:   return `
  116:     <div class="data-stack">
  117:       <div class="data-row"><span>Service lane</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.serviceDomain))}</strong></div>
  118:       <div class="data-row"><span>Owner role</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.ownerRole))}</strong></div>
  119:       <div class="data-row"><span>Review owner</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.reviewRole))}</strong></div>
  120:       <div class="data-row"><span>Route map</span><strong>${escapeHtml(`Content ${titleCase(CAMPAIGN_ROUTE_ROLES["content-studio"].role)} • Media ${titleCase(CAMPAIGN_ROUTE_ROLES["media-studio"].role)} • Publishing ${titleCase(CAMPAIGN_ROUTE_ROLES.publishing.role)} • Ads ${titleCase(CAMPAIGN_ROUTE_ROLES["ads-manager"].role)}`)}</strong></div>
  121:       <div class="data-row"><span>Readiness</span><strong>${escapeHtml(model.executionReadiness.status)}</strong></div>
  122:     </div>
  123:   `;
  124: }
  125: 
  126: function channelLabel(value) {
  127:   const key = asString(value).trim().toLowerCase();
  128:   return CHANNEL_LABELS[key] || titleCase(key) || "Unspecified";
  129: }
  130: 
  131: function uniqueStrings(values) {
  132:   return Array.from(new Set(
  133:     asArray(values)
  134:       .map((item) => asString(item).trim())
  135:       .filter(Boolean)
  136:   ));
  137: }
  138: 
  139: function uniqueBy(items, keyFn) {
  140:   const seen = new Set();
  141:   return asArray(items).filter((item) => {
  142:     const key = keyFn(item);
  143:     if (!key || seen.has(key)) return false;
  144:     seen.add(key);
  145:     return true;
  146:   });
  147: }
  148: 
  149: function firstNonEmpty(...values) {
  150:   for (const value of values) {
  151:     const normalized = asString(value).trim();
  152:     if (normalized && normalized !== "[object Object]") return normalized;
  153:   }
  154:   return "";
  155: }
  156: 
  157: function readableValue(value, fallback = "") {
  158:   if (value == null) return fallback;
  159:   if (typeof value === "string") return value.trim() === "[object Object]" ? fallback : value.trim();
  160:   if (typeof value === "number" || typeof value === "boolean") return String(value);
  161:   if (Array.isArray(value)) return uniqueStrings(value.map((item) => readableValue(item))).join(", ") || fallback;
  162:   const record = asObject(value);
  163:   return firstNonEmpty(
  164:     record.title,
  165:     record.label,
```

#### Match 8 — line 121

```js
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
   87: 
   88: function formatCurrency(value, currency = "USD") {
   89:   const parsed = Number(value);
   90:   if (!Number.isFinite(parsed)) return "-";
   91:   try {
   92:     return new Intl.NumberFormat(undefined, {
   93:       style: "currency",
   94:       currency: currency || "USD",
   95:       maximumFractionDigits: 0
   96:     }).format(parsed);
   97:   } catch (_) {
   98:     return `${currency || "USD"} ${Math.round(parsed)}`;
   99:   }
  100: }
  101: 
  102: function formatPercent(value, digits = 0) {
  103:   const parsed = Number(value);
  104:   if (!Number.isFinite(parsed)) return "-";
  105:   return `${parsed.toFixed(digits)}%`;
  106: }
  107: 
  108: function titleCase(value) {
  109:   return asString(value)
  110:     .replace(/[_-]+/g, " ")
  111:     .replace(/\b\w/g, (match) => match.toUpperCase());
  112: }
  113: 
  114: function renderTeamOpsSummary(model, escapeHtml) {
  115:   return `
  116:     <div class="data-stack">
  117:       <div class="data-row"><span>Service lane</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.serviceDomain))}</strong></div>
  118:       <div class="data-row"><span>Owner role</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.ownerRole))}</strong></div>
  119:       <div class="data-row"><span>Review owner</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.reviewRole))}</strong></div>
  120:       <div class="data-row"><span>Route map</span><strong>${escapeHtml(`Content ${titleCase(CAMPAIGN_ROUTE_ROLES["content-studio"].role)} • Media ${titleCase(CAMPAIGN_ROUTE_ROLES["media-studio"].role)} • Publishing ${titleCase(CAMPAIGN_ROUTE_ROLES.publishing.role)} • Ads ${titleCase(CAMPAIGN_ROUTE_ROLES["ads-manager"].role)}`)}</strong></div>
  121:       <div class="data-row"><span>Readiness</span><strong>${escapeHtml(model.executionReadiness.status)}</strong></div>
  122:     </div>
  123:   `;
  124: }
  125: 
  126: function channelLabel(value) {
  127:   const key = asString(value).trim().toLowerCase();
  128:   return CHANNEL_LABELS[key] || titleCase(key) || "Unspecified";
  129: }
  130: 
  131: function uniqueStrings(values) {
  132:   return Array.from(new Set(
  133:     asArray(values)
  134:       .map((item) => asString(item).trim())
  135:       .filter(Boolean)
  136:   ));
  137: }
  138: 
  139: function uniqueBy(items, keyFn) {
  140:   const seen = new Set();
  141:   return asArray(items).filter((item) => {
  142:     const key = keyFn(item);
  143:     if (!key || seen.has(key)) return false;
  144:     seen.add(key);
  145:     return true;
  146:   });
  147: }
  148: 
  149: function firstNonEmpty(...values) {
  150:   for (const value of values) {
  151:     const normalized = asString(value).trim();
  152:     if (normalized && normalized !== "[object Object]") return normalized;
  153:   }
  154:   return "";
  155: }
  156: 
  157: function readableValue(value, fallback = "") {
  158:   if (value == null) return fallback;
  159:   if (typeof value === "string") return value.trim() === "[object Object]" ? fallback : value.trim();
  160:   if (typeof value === "number" || typeof value === "boolean") return String(value);
  161:   if (Array.isArray(value)) return uniqueStrings(value.map((item) => readableValue(item))).join(", ") || fallback;
  162:   const record = asObject(value);
  163:   return firstNonEmpty(
  164:     record.title,
  165:     record.label,
  166:     record.name,
```

#### Match 9 — line 209

```js
  164:     record.title,
  165:     record.label,
  166:     record.name,
  167:     record.action,
  168:     record.summary,
  169:     record.description,
  170:     record.recommendation,
  171:     record.reason,
  172:     record.body,
  173:     fallback
  174:   );
  175: }
  176: 
  177: function isMissingIntelligenceError(error) {
  178:   const status = Number(error?.status);
  179:   if (status !== 404) return false;
  180:   const message = asString(error?.message).toLowerCase();
  181:   return message.includes("insights") || message.includes("learning") || message.includes("not found");
  182: }
  183: 
  184: function parseList(value) {
  185:   return uniqueStrings(asString(value).split(","));
  186: }
  187: 
  188: function normalizeRecommendation(item) {
  189:   if (typeof item === "string") {
  190:     return {
  191:       title: "Recommendation",
  192:       action: item,
  193:       domain: "",
  194:       meta: ""
  195:     };
  196:   }
  197: 
  198:   const record = asObject(item);
  199:   return {
  200:     title: readableValue(record.title || record.label || record.domain, "Recommendation"),
  201:     action: readableValue(record.action || record.summary || record.description || record.recommendation),
  202:     domain: asString(record.domain),
  203:     meta: readableValue(record.meta || record.reason || record.why || record.priority)
  204:   };
  205: }
  206: 
  207: function buildDefaults(state) {
  208:   const overviewData = asObject(state.data.overview?.overview);
  209:   const readiness = asObject(state.data.readiness?.dashboard);
  210:   const assets = asObject(state.data.assets);
  211:   const activity = asObject(state.data.activity);
  212:   const context = asObject(state.context);
  213: 
  214:   const market = context.currentMarket || overviewData.market || "";
  215:   const language = context.currentLanguage || overviewData.language || "";
  216:   const campaignName = context.activeCampaign || `${context.currentProject || "Campaign"} Launch`;
  217:   const missingAssets = getMissingAssetLabels(assets);
  218:   const requiredAssetTypes = getCategoryReadinessList(assets).map((item) => item.display_label || item.label || item.asset_type);
  219:   const scheduledJobs = asArray(activity.scheduled_jobs);
  220:   const channels = Array.from(new Set(
  221:     scheduledJobs
  222:       .map((item) => asString(item.channel).trim().toLowerCase())
  223:       .filter(Boolean)
  224:   ));
  225: 
  226:   return {
  227:     campaignName,
  228:     campaignGoal: overviewData.primary_goal || "Launch",
  229:     campaignType: overviewData.project_type || "Growth campaign",
  230:     market,
  231:     language,
  232:     productFocus: context.currentProject || overviewData.project_name || "",
  233:     productAngle: overviewData.offer_positioning || overviewData.brand_promise || "",
  234:     audiencePrimary: overviewData.audience_primary || overviewData.target_audience || "",
  235:     audienceNeed: overviewData.audience_problem || overviewData.customer_problem || "",
  236:     audienceStage: "Warm prospect",
  237:     channelPlan: channels.join(", "),
  238:     offerHeadline: overviewData.value_prop || overviewData.brand_promise || "",
  239:     offerDetail: overviewData.offer_positioning || "",
  240:     startDate: "",
  241:     endDate: "",
  242:     budget: "5000",
  243:     wave1Name: campaignName,
  244:     wave1Focus: "Launch announcement",
  245:     wave1Channels: channels.slice(0, 3).join(", "),
  246:     wave2Name: "Education wave",
  247:     wave2Focus: "Problem awareness and proof",
  248:     wave2Channels: channels.slice(0, 2).join(", "),
  249:     wave3Name: "Conversion wave",
  250:     wave3Focus: "Offer push and retargeting",
  251:     wave3Channels: channels.slice(0, 2).join(", "),
  252:     assetChecklist: missingAssets.length ? missingAssets.join(", ") : requiredAssetTypes.join(", "),
  253:     executionNotes: asArray(readiness.next_best_actions).join("; ")
  254:   };
```

#### Match 10 — line 218

```js
  173:     fallback
  174:   );
  175: }
  176: 
  177: function isMissingIntelligenceError(error) {
  178:   const status = Number(error?.status);
  179:   if (status !== 404) return false;
  180:   const message = asString(error?.message).toLowerCase();
  181:   return message.includes("insights") || message.includes("learning") || message.includes("not found");
  182: }
  183: 
  184: function parseList(value) {
  185:   return uniqueStrings(asString(value).split(","));
  186: }
  187: 
  188: function normalizeRecommendation(item) {
  189:   if (typeof item === "string") {
  190:     return {
  191:       title: "Recommendation",
  192:       action: item,
  193:       domain: "",
  194:       meta: ""
  195:     };
  196:   }
  197: 
  198:   const record = asObject(item);
  199:   return {
  200:     title: readableValue(record.title || record.label || record.domain, "Recommendation"),
  201:     action: readableValue(record.action || record.summary || record.description || record.recommendation),
  202:     domain: asString(record.domain),
  203:     meta: readableValue(record.meta || record.reason || record.why || record.priority)
  204:   };
  205: }
  206: 
  207: function buildDefaults(state) {
  208:   const overviewData = asObject(state.data.overview?.overview);
  209:   const readiness = asObject(state.data.readiness?.dashboard);
  210:   const assets = asObject(state.data.assets);
  211:   const activity = asObject(state.data.activity);
  212:   const context = asObject(state.context);
  213: 
  214:   const market = context.currentMarket || overviewData.market || "";
  215:   const language = context.currentLanguage || overviewData.language || "";
  216:   const campaignName = context.activeCampaign || `${context.currentProject || "Campaign"} Launch`;
  217:   const missingAssets = getMissingAssetLabels(assets);
  218:   const requiredAssetTypes = getCategoryReadinessList(assets).map((item) => item.display_label || item.label || item.asset_type);
  219:   const scheduledJobs = asArray(activity.scheduled_jobs);
  220:   const channels = Array.from(new Set(
  221:     scheduledJobs
  222:       .map((item) => asString(item.channel).trim().toLowerCase())
  223:       .filter(Boolean)
  224:   ));
  225: 
  226:   return {
  227:     campaignName,
  228:     campaignGoal: overviewData.primary_goal || "Launch",
  229:     campaignType: overviewData.project_type || "Growth campaign",
  230:     market,
  231:     language,
  232:     productFocus: context.currentProject || overviewData.project_name || "",
  233:     productAngle: overviewData.offer_positioning || overviewData.brand_promise || "",
  234:     audiencePrimary: overviewData.audience_primary || overviewData.target_audience || "",
  235:     audienceNeed: overviewData.audience_problem || overviewData.customer_problem || "",
  236:     audienceStage: "Warm prospect",
  237:     channelPlan: channels.join(", "),
  238:     offerHeadline: overviewData.value_prop || overviewData.brand_promise || "",
  239:     offerDetail: overviewData.offer_positioning || "",
  240:     startDate: "",
  241:     endDate: "",
  242:     budget: "5000",
  243:     wave1Name: campaignName,
  244:     wave1Focus: "Launch announcement",
  245:     wave1Channels: channels.slice(0, 3).join(", "),
  246:     wave2Name: "Education wave",
  247:     wave2Focus: "Problem awareness and proof",
  248:     wave2Channels: channels.slice(0, 2).join(", "),
  249:     wave3Name: "Conversion wave",
  250:     wave3Focus: "Offer push and retargeting",
  251:     wave3Channels: channels.slice(0, 2).join(", "),
  252:     assetChecklist: missingAssets.length ? missingAssets.join(", ") : requiredAssetTypes.join(", "),
  253:     executionNotes: asArray(readiness.next_best_actions).join("; ")
  254:   };
  255: }
  256: 
  257: function ensureSession(projectName, defaults) {
  258:   const key = projectName || "__default__";
  259: 
  260:   if (!campaignSessions.has(key)) {
  261:     campaignSessions.set(key, {
  262:       values: { ...defaults },
  263:       recordId: "",
```

#### Match 11 — line 253

```js
  208:   const overviewData = asObject(state.data.overview?.overview);
  209:   const readiness = asObject(state.data.readiness?.dashboard);
  210:   const assets = asObject(state.data.assets);
  211:   const activity = asObject(state.data.activity);
  212:   const context = asObject(state.context);
  213: 
  214:   const market = context.currentMarket || overviewData.market || "";
  215:   const language = context.currentLanguage || overviewData.language || "";
  216:   const campaignName = context.activeCampaign || `${context.currentProject || "Campaign"} Launch`;
  217:   const missingAssets = getMissingAssetLabels(assets);
  218:   const requiredAssetTypes = getCategoryReadinessList(assets).map((item) => item.display_label || item.label || item.asset_type);
  219:   const scheduledJobs = asArray(activity.scheduled_jobs);
  220:   const channels = Array.from(new Set(
  221:     scheduledJobs
  222:       .map((item) => asString(item.channel).trim().toLowerCase())
  223:       .filter(Boolean)
  224:   ));
  225: 
  226:   return {
  227:     campaignName,
  228:     campaignGoal: overviewData.primary_goal || "Launch",
  229:     campaignType: overviewData.project_type || "Growth campaign",
  230:     market,
  231:     language,
  232:     productFocus: context.currentProject || overviewData.project_name || "",
  233:     productAngle: overviewData.offer_positioning || overviewData.brand_promise || "",
  234:     audiencePrimary: overviewData.audience_primary || overviewData.target_audience || "",
  235:     audienceNeed: overviewData.audience_problem || overviewData.customer_problem || "",
  236:     audienceStage: "Warm prospect",
  237:     channelPlan: channels.join(", "),
  238:     offerHeadline: overviewData.value_prop || overviewData.brand_promise || "",
  239:     offerDetail: overviewData.offer_positioning || "",
  240:     startDate: "",
  241:     endDate: "",
  242:     budget: "5000",
  243:     wave1Name: campaignName,
  244:     wave1Focus: "Launch announcement",
  245:     wave1Channels: channels.slice(0, 3).join(", "),
  246:     wave2Name: "Education wave",
  247:     wave2Focus: "Problem awareness and proof",
  248:     wave2Channels: channels.slice(0, 2).join(", "),
  249:     wave3Name: "Conversion wave",
  250:     wave3Focus: "Offer push and retargeting",
  251:     wave3Channels: channels.slice(0, 2).join(", "),
  252:     assetChecklist: missingAssets.length ? missingAssets.join(", ") : requiredAssetTypes.join(", "),
  253:     executionNotes: asArray(readiness.next_best_actions).join("; ")
  254:   };
  255: }
  256: 
  257: function ensureSession(projectName, defaults) {
  258:   const key = projectName || "__default__";
  259: 
  260:   if (!campaignSessions.has(key)) {
  261:     campaignSessions.set(key, {
  262:       values: { ...defaults },
  263:       recordId: "",
  264:       intelligence: {
  265:         status: "idle",
  266:         insights: null,
  267:         learning: null,
  268:         error: ""
  269:       },
  270:       generatedPackages: 0,
  271:       lastAiHandoffId: ""
  272:     });
  273:   } else {
  274:     const session = campaignSessions.get(key);
  275:     session.values = { ...defaults, ...asObject(session.values) };
  276:     session.recordId = asString(session.recordId);
  277:     session.intelligence = {
  278:       status: asString(session.intelligence?.status || "idle"),
  279:       insights: session.intelligence?.insights || null,
  280:       learning: session.intelligence?.learning || null,
  281:       error: asString(session.intelligence?.error)
  282:     };
  283:     session.generatedPackages = Number.isFinite(session.generatedPackages) ? session.generatedPackages : 0;
  284:     session.lastAiHandoffId = asString(session.lastAiHandoffId);
  285:   }
  286: 
  287:   return campaignSessions.get(key);
  288: }
  289: 
  290: function renderField({
  291:   name,
  292:   label,
  293:   value,
  294:   helper,
  295:   placeholder,
  296:   escapeHtml,
  297:   multiline = false,
  298:   rows = 3
```

#### Match 12 — line 271

```js
  226:   return {
  227:     campaignName,
  228:     campaignGoal: overviewData.primary_goal || "Launch",
  229:     campaignType: overviewData.project_type || "Growth campaign",
  230:     market,
  231:     language,
  232:     productFocus: context.currentProject || overviewData.project_name || "",
  233:     productAngle: overviewData.offer_positioning || overviewData.brand_promise || "",
  234:     audiencePrimary: overviewData.audience_primary || overviewData.target_audience || "",
  235:     audienceNeed: overviewData.audience_problem || overviewData.customer_problem || "",
  236:     audienceStage: "Warm prospect",
  237:     channelPlan: channels.join(", "),
  238:     offerHeadline: overviewData.value_prop || overviewData.brand_promise || "",
  239:     offerDetail: overviewData.offer_positioning || "",
  240:     startDate: "",
  241:     endDate: "",
  242:     budget: "5000",
  243:     wave1Name: campaignName,
  244:     wave1Focus: "Launch announcement",
  245:     wave1Channels: channels.slice(0, 3).join(", "),
  246:     wave2Name: "Education wave",
  247:     wave2Focus: "Problem awareness and proof",
  248:     wave2Channels: channels.slice(0, 2).join(", "),
  249:     wave3Name: "Conversion wave",
  250:     wave3Focus: "Offer push and retargeting",
  251:     wave3Channels: channels.slice(0, 2).join(", "),
  252:     assetChecklist: missingAssets.length ? missingAssets.join(", ") : requiredAssetTypes.join(", "),
  253:     executionNotes: asArray(readiness.next_best_actions).join("; ")
  254:   };
  255: }
  256: 
  257: function ensureSession(projectName, defaults) {
  258:   const key = projectName || "__default__";
  259: 
  260:   if (!campaignSessions.has(key)) {
  261:     campaignSessions.set(key, {
  262:       values: { ...defaults },
  263:       recordId: "",
  264:       intelligence: {
  265:         status: "idle",
  266:         insights: null,
  267:         learning: null,
  268:         error: ""
  269:       },
  270:       generatedPackages: 0,
  271:       lastAiHandoffId: ""
  272:     });
  273:   } else {
  274:     const session = campaignSessions.get(key);
  275:     session.values = { ...defaults, ...asObject(session.values) };
  276:     session.recordId = asString(session.recordId);
  277:     session.intelligence = {
  278:       status: asString(session.intelligence?.status || "idle"),
  279:       insights: session.intelligence?.insights || null,
  280:       learning: session.intelligence?.learning || null,
  281:       error: asString(session.intelligence?.error)
  282:     };
  283:     session.generatedPackages = Number.isFinite(session.generatedPackages) ? session.generatedPackages : 0;
  284:     session.lastAiHandoffId = asString(session.lastAiHandoffId);
  285:   }
  286: 
  287:   return campaignSessions.get(key);
  288: }
  289: 
  290: function renderField({
  291:   name,
  292:   label,
  293:   value,
  294:   helper,
  295:   placeholder,
  296:   escapeHtml,
  297:   multiline = false,
  298:   rows = 3
  299: }) {
  300:   return `
  301:     <div class="setup-field-group">
  302:       <div class="setup-field-head">
  303:         <label class="setup-label" for="campaign-${escapeHtml(name)}">${escapeHtml(label)}</label>
  304:         <span class="setup-field-state is-optional">Draft</span>
  305:       </div>
  306:       ${
  307:         multiline
  308:           ? `<textarea id="campaign-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input setup-textarea" rows="${rows}" placeholder="${escapeHtml(placeholder || "")}">${escapeHtml(asString(value))}</textarea>`
  309:           : `<input id="campaign-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input" type="text" value="${escapeHtml(asString(value))}" placeholder="${escapeHtml(placeholder || "")}">`
  310:       }
  311:       <div class="setup-helper">${escapeHtml(helper)}</div>
  312:     </div>
  313:   `;
  314: }
  315: 
  316: function renderSummaryItem(label, value, escapeHtml) {
```
### Copy defect candidates

_No match found._


## Preliminary Verdict

| Area | Verdict |
|---|---|
| saveProjectCampaign calls | Found 1 - likely durable write, proof required |
| createProjectHandoff calls | Not found |
| fetchProjectInsights calls | Found 1 - verify read-only |
| fetchProjectLearning calls | Found 1 - verify read-only |
| Shared campaign writes | Found 6 - route/shared-state proof required |
| Shared handoff writes | Found 3 - route/shared-state proof required |
| Confirmation gates | Not found |
| Storage writes | Not found |

## Decision Guidance
- If saveProjectCampaign or createProjectHandoff are triggered by UI without confirmation, add minimal confirmation gates only after this proof.
- If refresh intelligence calls are read-only, document as no confirmation required.
- If publish/send/ad actions are route-only/handoff-only, document and do not patch.
- Do not patch from T57 alone unless the next step explicitly decides the minimal patch.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
