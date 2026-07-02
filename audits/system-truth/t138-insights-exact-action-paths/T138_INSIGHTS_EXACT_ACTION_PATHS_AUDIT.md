# T138 — Insights Exact Action Path Audit

## Status
Generated.

## Scope
- `public/control-center/pages/insights.js`

## Why this audit exists
T135 identified `insights.js` as the next highest open runtime-risk file after closing Home.

This audit does not patch anything. It inspects exact action paths before deciding whether a patch is required.

## Summary

- Total lines: 1520
- Event bindings: 7
- navigateTo calls: 11
- createProjectHandoff calls: 9
- setSharedHandoff calls: 3
- publish mentions: 9
- approval mentions: 0
- handoff mentions: 5
- confirm mentions: 0

## Authority Call Counts

| Term | Count |
|---|---:|
| createProjectHandoff | 9 |
| createProjectApproval | 0 |
| createProjectTask | 0 |
| executeProjectAiCommand | 0 |
| saveProject | 0 |
| setSharedHandoff | 3 |
| setSharedAiDraft | 0 |

## Backend / Shared Authority Findings

### createProjectHandoff at line 947

```js
942:       }).join("")}
943:     </div>
944:   `;
945: }
946: 
947: function bindInsightsActions({ $, navigateTo, showMessage, prompts, projectName, createProjectHandoff }) {
948:   Array.from(document.querySelectorAll("[data-insights-open]")).forEach((button) => {
949:     button.onclick = () => {
950:       navigateTo("ai-command");
951:     };
952:   });
```

### createProjectHandoff at line 1016

```js
1011:               promptLabel: item.label
1012:             }
1013:           }
1014:         };
1015:         setSharedHandoff(projectName, "ai-command", handoff);
1016:         createProjectHandoff?.(projectName, handoff).catch((error) => {
1017:           console.warn("Failed to persist Insights handoff:", error.message);
1018:         });
1019:       }
1020: 
1021:       navigateTo("ai-command");
```

### createProjectHandoff at line 1049

```js
1044:     safeText,
1045:     navigateTo,
1046:     showMessage,
1047:     showError,
1048:     fetchProjectInsights,
1049:     createProjectHandoff
1050:   }) {
1051:     const state = getState();
1052:     const projectName = state.context.currentProject || "";
1053:     const refreshState = getInsightsRefreshState(projectName);
1054:     const overview = asObject(state.data.overview?.overview);
```

### createProjectHandoff at line 1420

```js
1415:       $,
1416:       navigateTo,
1417:       showMessage,
1418:       prompts: optimization.prompts,
1419:       projectName,
1420:       createProjectHandoff
1421:     });
1422: 
1423:     root.querySelector("#insightsRefreshBtn")?.addEventListener("click", () => {
1424:       if (!projectName) {
1425:         const message = "Insights: No active project selected.";
```

### createProjectHandoff at line 1437

```js
1432:           safeText,
1433:           navigateTo,
1434:           showMessage,
1435:           showError,
1436:           fetchProjectInsights,
1437:           createProjectHandoff
1438:         });
1439:         return;
1440:       }
1441: 
1442:       if (!fetchProjectInsights) {
```

### createProjectHandoff at line 1455

```js
1450:           safeText,
1451:           navigateTo,
1452:           showMessage,
1453:           showError,
1454:           fetchProjectInsights,
1455:           createProjectHandoff
1456:         });
1457:         return;
1458:       }
1459: 
1460:       setInsightsRefreshState(projectName, { loading: true, error: "" });
```

### createProjectHandoff at line 1470

```js
1465:         safeText,
1466:         navigateTo,
1467:         showMessage,
1468:         showError,
1469:         fetchProjectInsights,
1470:         createProjectHandoff
1471:       });
1472: 
1473:       fetchProjectInsights(projectName)
1474:         .then((liveData) => {
1475:           const currentState = getState();
```

### createProjectHandoff at line 1497

```js
1492:             safeText,
1493:             navigateTo,
1494:             showMessage,
1495:             showError,
1496:             fetchProjectInsights,
1497:             createProjectHandoff
1498:           });
1499:           showMessage?.("Insights refreshed.");
1500:         })
1501:         .catch((error) => {
1502:           const message = `Insights: ${error?.message || "Failed to refresh insights."}`;
```

### createProjectHandoff at line 1513

```js
1508:             safeText,
1509:             navigateTo,
1510:             showMessage,
1511:             showError,
1512:             fetchProjectInsights,
1513:             createProjectHandoff
1514:           });
1515:           showError?.(message);
1516:         });
1517:     });
1518:   }
```

### setSharedHandoff at line 1

```js
1: import { setSharedHandoff } from "../shared-context.js";
2: 
3: const PLATFORM_DEFS = [
4:   {
5:     id: "facebook",
6:     label: "Facebook",
```

### setSharedHandoff at line 960

```js
955:     button.onclick = () => {
956:       const route = button.getAttribute("data-insights-route") || "";
957:       if (!route) return;
958: 
959:       if (projectName) {
960:         setSharedHandoff(projectName, route, {
961:           source_page: "insights",
962:           destination_page: route,
963:           linked_entity: {
964:             entity_type: "project",
965:             entity_id: projectName,
```

### setSharedHandoff at line 1015

```js
1010:               projectName,
1011:               promptLabel: item.label
1012:             }
1013:           }
1014:         };
1015:         setSharedHandoff(projectName, "ai-command", handoff);
1016:         createProjectHandoff?.(projectName, handoff).catch((error) => {
1017:           console.warn("Failed to persist Insights handoff:", error.message);
1018:         });
1019:       }
1020: 
```

## Navigation Findings

### navigateTo at line 947

```js
942:       }).join("")}
943:     </div>
944:   `;
945: }
946: 
947: function bindInsightsActions({ $, navigateTo, showMessage, prompts, projectName, createProjectHandoff }) {
948:   Array.from(document.querySelectorAll("[data-insights-open]")).forEach((button) => {
949:     button.onclick = () => {
950:       navigateTo("ai-command");
951:     };
952:   });
```

### navigateTo at line 950

```js
945: }
946: 
947: function bindInsightsActions({ $, navigateTo, showMessage, prompts, projectName, createProjectHandoff }) {
948:   Array.from(document.querySelectorAll("[data-insights-open]")).forEach((button) => {
949:     button.onclick = () => {
950:       navigateTo("ai-command");
951:     };
952:   });
953: 
954:   Array.from(document.querySelectorAll("[data-insights-route]")).forEach((button) => {
955:     button.onclick = () => {
```

### navigateTo at line 980

```js
975:           },
976:           status: "available"
977:         });
978:       }
979: 
980:       navigateTo(route);
981:       showMessage?.(`Opened ${button.textContent?.trim() || "next workspace"}.`);
982:     };
983:   });
984: 
985:   Array.from(document.querySelectorAll("[data-insights-prompt]")).forEach((button) => {
```

### navigateTo at line 1021

```js
1016:         createProjectHandoff?.(projectName, handoff).catch((error) => {
1017:           console.warn("Failed to persist Insights handoff:", error.message);
1018:         });
1019:       }
1020: 
1021:       navigateTo("ai-command");
1022:       showMessage?.("Insight prompt added to AI Command.");
1023:     };
1024:   });
1025: }
1026: 
```

### navigateTo at line 1045

```js
1040:   render({
1041:     getState,
1042:     $,
1043:     escapeHtml,
1044:     safeText,
1045:     navigateTo,
1046:     showMessage,
1047:     showError,
1048:     fetchProjectInsights,
1049:     createProjectHandoff
1050:   }) {
```

### navigateTo at line 1416

```js
1411:       </div>
1412:     `;
1413: 
1414:     bindInsightsActions({
1415:       $,
1416:       navigateTo,
1417:       showMessage,
1418:       prompts: optimization.prompts,
1419:       projectName,
1420:       createProjectHandoff
1421:     });
```

### navigateTo at line 1433

```js
1428:         insightsRoute.render({
1429:           getState,
1430:           $,
1431:           escapeHtml,
1432:           safeText,
1433:           navigateTo,
1434:           showMessage,
1435:           showError,
1436:           fetchProjectInsights,
1437:           createProjectHandoff
1438:         });
```

### navigateTo at line 1451

```js
1446:         insightsRoute.render({
1447:           getState,
1448:           $,
1449:           escapeHtml,
1450:           safeText,
1451:           navigateTo,
1452:           showMessage,
1453:           showError,
1454:           fetchProjectInsights,
1455:           createProjectHandoff
1456:         });
```

### navigateTo at line 1466

```js
1461:       insightsRoute.render({
1462:         getState,
1463:         $,
1464:         escapeHtml,
1465:         safeText,
1466:         navigateTo,
1467:         showMessage,
1468:         showError,
1469:         fetchProjectInsights,
1470:         createProjectHandoff
1471:       });
```

### navigateTo at line 1493

```js
1488:           insightsRoute.render({
1489:             getState,
1490:             $,
1491:             escapeHtml,
1492:             safeText,
1493:             navigateTo,
1494:             showMessage,
1495:             showError,
1496:             fetchProjectInsights,
1497:             createProjectHandoff
1498:           });
```

### navigateTo at line 1509

```js
1504:           insightsRoute.render({
1505:             getState,
1506:             $,
1507:             escapeHtml,
1508:             safeText,
1509:             navigateTo,
1510:             showMessage,
1511:             showError,
1512:             fetchProjectInsights,
1513:             createProjectHandoff
1514:           });
```

## Event Binding Findings

### .onclick at line 949

```js
944:   `;
945: }
946: 
947: function bindInsightsActions({ $, navigateTo, showMessage, prompts, projectName, createProjectHandoff }) {
948:   Array.from(document.querySelectorAll("[data-insights-open]")).forEach((button) => {
949:     button.onclick = () => {
950:       navigateTo("ai-command");
951:     };
952:   });
953: 
954:   Array.from(document.querySelectorAll("[data-insights-route]")).forEach((button) => {
```

### .onclick at line 955

```js
950:       navigateTo("ai-command");
951:     };
952:   });
953: 
954:   Array.from(document.querySelectorAll("[data-insights-route]")).forEach((button) => {
955:     button.onclick = () => {
956:       const route = button.getAttribute("data-insights-route") || "";
957:       if (!route) return;
958: 
959:       if (projectName) {
960:         setSharedHandoff(projectName, route, {
```

### .onclick at line 986

```js
981:       showMessage?.(`Opened ${button.textContent?.trim() || "next workspace"}.`);
982:     };
983:   });
984: 
985:   Array.from(document.querySelectorAll("[data-insights-prompt]")).forEach((button) => {
986:     button.onclick = () => {
987:       const index = Number(button.getAttribute("data-insights-prompt"));
988:       const item = prompts[index];
989:       if (!item) return;
990: 
991:       const input = $("quickCommandInput");
```

### onclick at line 949

```js
944:   `;
945: }
946: 
947: function bindInsightsActions({ $, navigateTo, showMessage, prompts, projectName, createProjectHandoff }) {
948:   Array.from(document.querySelectorAll("[data-insights-open]")).forEach((button) => {
949:     button.onclick = () => {
950:       navigateTo("ai-command");
951:     };
952:   });
953: 
954:   Array.from(document.querySelectorAll("[data-insights-route]")).forEach((button) => {
```

### onclick at line 955

```js
950:       navigateTo("ai-command");
951:     };
952:   });
953: 
954:   Array.from(document.querySelectorAll("[data-insights-route]")).forEach((button) => {
955:     button.onclick = () => {
956:       const route = button.getAttribute("data-insights-route") || "";
957:       if (!route) return;
958: 
959:       if (projectName) {
960:         setSharedHandoff(projectName, route, {
```

### onclick at line 986

```js
981:       showMessage?.(`Opened ${button.textContent?.trim() || "next workspace"}.`);
982:     };
983:   });
984: 
985:   Array.from(document.querySelectorAll("[data-insights-prompt]")).forEach((button) => {
986:     button.onclick = () => {
987:       const index = Number(button.getAttribute("data-insights-prompt"));
988:       const item = prompts[index];
989:       if (!item) return;
990: 
991:       const input = $("quickCommandInput");
```

### addEventListener at line 1423

```js
1418:       prompts: optimization.prompts,
1419:       projectName,
1420:       createProjectHandoff
1421:     });
1422: 
1423:     root.querySelector("#insightsRefreshBtn")?.addEventListener("click", () => {
1424:       if (!projectName) {
1425:         const message = "Insights: No active project selected.";
1426:         setInsightsRefreshState(projectName, { loading: false, error: message });
1427:         showError?.(message);
1428:         insightsRoute.render({
```

## Confirmation Findings

No matches.

## Publish Mentions

### publish at line 199

```js
194:   }
195:   return "neutral";
196: }
197: 
198: function getTimestamp(item) {
199:   const fields = ["published_at", "executed_at", "scheduled_for", "updated_at", "created_at"];
200:   for (const field of fields) {
201:     const value = item?.[field];
202:     if (!value) continue;
203:     const time = Date.parse(value);
204:     if (Number.isFinite(time)) return time;
```

### publish at line 319

```js
314:     reach: toNumber(item.reach ?? metrics.reach ?? summary.reach),
315:     engagement: toNumber(item.engagement ?? metrics.engagement ?? summary.engagement),
316:     clicks: toNumber(item.clicks ?? metrics.clicks ?? summary.clicks),
317:     conversions: toNumber(item.conversions ?? metrics.conversions ?? summary.conversions),
318:     revenue: toNumber(item.revenue ?? metrics.revenue ?? summary.revenue),
319:     publishedAt: asString(item.published_at || item.executed_at || item.updated_at || item.created_at),
320:     whyItWorked: asString(item.why_it_worked || item.reason || item.insight || ""),
321:     likelyReason: asString(item.likely_reason || item.reason || ""),
322:     improveNext: asString(item.improve_next || item.recommendation || ""),
323:     hook: asString(item.hook || preview.headline || ""),
324:     topic: asString(item.topic || item.angle || preview.goal || ""),
```

### publish at line 410

```js
405:   const totalRevenue = totalRevenueValues.length ? totalRevenueValues.reduce((total, value) => total + value, 0) : null;
406:   const overallRoas = totalRevenue != null && totalSpend != null && totalSpend > 0
407:     ? totalRevenue / totalSpend
408:     : paidSummary.roas;
409: 
410:   const publishedCount = contentItems.filter((item) => item.hasMetrics).length;
411:   const connectedPlatformCount = PLATFORM_DEFS.filter((platform) => getConnectedValue(platform.sourceKeys, connections)).length;
412:   const seoVisibility = seoSummary.impressions != null
413:     ? `${formatCompact(seoSummary.impressions)} impressions`
414:     : getConnectedValue(["google", "analytics", "website"], connections)
415:       ? "Connected, awaiting feed"
```

### publish at line 423

```js
418:   return {
419:     kpis: [
420:       {
421:         label: "Total reach",
422:         value: totalReach == null ? "--" : formatCompact(totalReach),
423:         meta: totalReach == null ? "Awaiting social insight feeds" : `${publishedCount} measured content items`
424:       },
425:       {
426:         label: "Total engagement",
427:         value: totalEngagement == null ? "--" : formatCompact(totalEngagement),
428:         meta: totalEngagement == null ? "Awaiting social insight feeds" : "Cross-platform engagement signal"
```

### publish at line 630

```js
625:     add(formatScores, item.format);
626:     add(platformScores, item.platform);
627:     add(topicScores, item.topic);
628:     add(ctaScores, item.cta);
629: 
630:     const hour = item.publishedAt ? new Date(item.publishedAt).getHours() : null;
631:     if (hour != null && Number.isFinite(hour)) {
632:       const bucket = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
633:       add(postingWindows, bucket);
634:     }
635:   });
```

### publish at line 757

```js
752:   }
753: 
754:   const prompts = [
755:     {
756:       label: "What should we improve next?",
757:       prompt: `Review all available insights for ${projectName} and tell me the highest-impact improvement to make next across content, publishing, SEO, paid media, and website conversion.`
758:     },
759:     {
760:       label: "Which platform is strongest?",
761:       prompt: `Using the connected cross-platform performance signals for ${projectName}, identify the strongest platform, explain why it is strongest, and say what we should scale there.`
762:     },
```

### publish at line 765

```js
760:       label: "Which platform is strongest?",
761:       prompt: `Using the connected cross-platform performance signals for ${projectName}, identify the strongest platform, explain why it is strongest, and say what we should scale there.`
762:     },
763:     {
764:       label: "Which posts should we repurpose?",
765:       prompt: `From the best-performing published content for ${projectName}, identify which posts or videos should be repurposed next and how they should be adapted for other platforms.`
766:     },
767:     {
768:       label: "What SEO opportunities are most valuable?",
769:       prompt: `Review the SEO and Search Console signals for ${projectName}. Tell me the most valuable query, page, and CTR opportunities to act on next.`
770:     },
```

### publish at line 1188

```js
1183:           <p class="insights-section-copy">
1184:             The strongest measured signals, reusable patterns, and channels worth scaling or repurposing.
1185:           </p>
1186:           <div class="insights-workspace-grid">
1187:             <div>
1188:               <h4 class="insights-subtitle">Strongest published content</h4>
1189:               ${
1190:                 topContent.length
1191:                   ? renderRankedContent(topContent.slice(0, 3), "", escapeHtml)
1192:                   : renderFeedAwareEmptyState(
1193:                       "No measured content winners yet",
```

### publish at line 1349

```js
1344:           </div>
1345:           <div class="insights-assistant-toolbar" style="margin-top: 16px;">
1346:             <button class="btn btn-primary" type="button" data-insights-route="campaign-studio">Open Campaign Studio</button>
1347:             <button class="btn btn-secondary" type="button" data-insights-route="content-studio">Open Content Studio</button>
1348:             <button class="btn btn-secondary" type="button" data-insights-route="ads-manager">Open Ads Manager</button>
1349:             <button class="btn btn-secondary" type="button" data-insights-route="publishing">Open Publishing Workspace</button>
1350:           </div>
1351:         </section>
1352: 
1353:         <section class="card">
1354:           <div class="card-head">
```

## Approval Mentions

No matches.

## Handoff Mentions

### handoff at line 997

```js
992:       if (input) {
993:         input.value = item.prompt;
994:       }
995: 
996:       if (projectName && item.prompt) {
997:         const handoff = {
998:           source_page: "insights",
999:           destination_page: "ai-command",
1000:           linked_entity: {
1001:             entity_type: "project",
1002:             entity_id: projectName,
```

### handoff at line 1015

```js
1010:               projectName,
1011:               promptLabel: item.label
1012:             }
1013:           }
1014:         };
1015:         setSharedHandoff(projectName, "ai-command", handoff);
1016:         createProjectHandoff?.(projectName, handoff).catch((error) => {
1017:           console.warn("Failed to persist Insights handoff:", error.message);
1018:         });
1019:       }
1020: 
```

### handoff at line 1016

```js
1011:               promptLabel: item.label
1012:             }
1013:           }
1014:         };
1015:         setSharedHandoff(projectName, "ai-command", handoff);
1016:         createProjectHandoff?.(projectName, handoff).catch((error) => {
1017:           console.warn("Failed to persist Insights handoff:", error.message);
1018:         });
1019:       }
1020: 
1021:       navigateTo("ai-command");
```

### handoff at line 1017

```js
1012:             }
1013:           }
1014:         };
1015:         setSharedHandoff(projectName, "ai-command", handoff);
1016:         createProjectHandoff?.(projectName, handoff).catch((error) => {
1017:           console.warn("Failed to persist Insights handoff:", error.message);
1018:         });
1019:       }
1020: 
1021:       navigateTo("ai-command");
1022:       showMessage?.("Insight prompt added to AI Command.");
```

### handoff at line 1397

```js
1392:           <div class="card-head">
1393:             <h3>AI Intelligence Briefs</h3>
1394:             <span class="card-badge neutral">${escapeHtml(`${promptItems.length} prompt starters`)}</span>
1395:           </div>
1396:           <p class="insights-section-copy">
1397:             Use AI Workspace to turn current signals into a review-ready intelligence brief. Opening AI only navigates; sending a prompt prefills context and creates a handoff.
1398:           </p>
1399:           <div class="insights-assistant-toolbar">
1400:             <button class="btn ghost" type="button" data-insights-open>Open AI Workspace Review</button>
1401:           </div>
1402:           <div class="insights-prompt-list">
```

## Decision Placeholder

Classify after human review:

- Safe / read-only insights surface
- Needs confirmation before handoff
- Needs shared handoff guard
- Needs backend authority guard
- Needs no patch
