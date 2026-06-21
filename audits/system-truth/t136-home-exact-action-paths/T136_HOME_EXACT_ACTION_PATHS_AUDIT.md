# T136 — Home Exact Action Path Audit

## Status
Generated.

## Scope
- `public/control-center/pages/home.js`

## Why this audit exists
T135 identified `home.js` as the highest remaining open runtime-risk file.

This audit does not patch anything. It inspects exact action paths to determine whether the score is caused by real authority actions or by UI labels/navigation text.

## Summary

- Total lines: 1164
- Event bindings: 28
- navigateTo calls: 3
- publish mentions: 17
- approval mentions: 11
- handoff mentions: 5
- confirm mentions: 1

## Imported / Direct Authority Call Counts

| Term | Count |
|---|---:|
| createProjectHandoff | 0 |
| createProjectApproval | 0 |
| createProjectTask | 0 |
| executeProjectAiCommand | 0 |
| saveProject | 0 |
| setSharedHandoff | 0 |
| setSharedAiDraft | 0 |

## Navigation Findings

### navigateTo at line 757

```js
753:     <section class="page is-active" data-page="home">
754:       <div id="homeExecRoot"></div>
755:     </section>
756:   `,
757:   render({ getState, $, escapeHtml, navigateTo, showMessage }) {
758:     const state = getState();
759:     const dashboard = buildExecutiveData(state);
760:     const root = $("homeExecRoot");
761:     if (!root) return;
```

### navigateTo at line 1069

```js
1065:       </div>
1066:     `;
1067:     
1068:     const openRoute = (route, message = "") => {
1069:       navigateTo(route);
1070:       if (message) showMessage?.(message);
1071:     };
1072: 
1073:     const openAiWithPrompt = (prompt) => {
```

### navigateTo at line 1075

```js
1071:     };
1072: 
1073:     const openAiWithPrompt = (prompt) => {
1074:       setGlobalAiPrompt($, prompt);
1075:       navigateTo("ai-command");
1076:       showMessage?.("Prompt prepared in AI Command.");
1077:     };
1078: 
1079: 
```


## Event Binding Findings

### .onclick at line 1101

```js
1097:     };
1098: 
1099:     const nextBtn = $("homePrimaryActionBtn");
1100:     if (nextBtn) {
1101:       nextBtn.onclick = () => {
1102:         if (dashboard.nextBestAction.route === "ai-command") {
1103:           setGlobalAiPrompt($, dashboard.nextBestAction.recommendation);
1104:         }
1105:         openRoute(dashboard.nextBestAction.route, "Next best action opened.");
```

### .onclick at line 1111

```js
1107:     }
1108: 
1109:     const askNextActionBtn = $("homeAskNextActionBtn");
1110:     if (askNextActionBtn) {
1111:       askNextActionBtn.onclick = () => openAiWithPrompt(`Explain this next best action and give me the exact steps: ${dashboard.nextBestAction.recommendation}`);
1112:     }
1113: 
1114:     const operationsBtn = $("homeOpenOperationsBtn");
1115:     if (operationsBtn) operationsBtn.onclick = () => openRoute("operations-centers");
```

### .onclick at line 1115

```js
1111:       askNextActionBtn.onclick = () => openAiWithPrompt(`Explain this next best action and give me the exact steps: ${dashboard.nextBestAction.recommendation}`);
1112:     }
1113: 
1114:     const operationsBtn = $("homeOpenOperationsBtn");
1115:     if (operationsBtn) operationsBtn.onclick = () => openRoute("operations-centers");
1116: 
1117:     const aiTeamBtn = $("homeOpenAiTeamBtn");
1118:     if (aiTeamBtn) aiTeamBtn.onclick = () => openRoute("ai-command");
1119:     const fullAiTeamBtn = $("homeOpenFullAiTeamBtn");
```

### .onclick at line 1118

```js
1114:     const operationsBtn = $("homeOpenOperationsBtn");
1115:     if (operationsBtn) operationsBtn.onclick = () => openRoute("operations-centers");
1116: 
1117:     const aiTeamBtn = $("homeOpenAiTeamBtn");
1118:     if (aiTeamBtn) aiTeamBtn.onclick = () => openRoute("ai-command");
1119:     const fullAiTeamBtn = $("homeOpenFullAiTeamBtn");
1120:     if (fullAiTeamBtn) fullAiTeamBtn.onclick = () => openRoute("ai-command");
1121: 
1122:     const quickCampaignBtn = $("homeQuickStartCampaignBtn");
```

### .onclick at line 1120

```js
1116: 
1117:     const aiTeamBtn = $("homeOpenAiTeamBtn");
1118:     if (aiTeamBtn) aiTeamBtn.onclick = () => openRoute("ai-command");
1119:     const fullAiTeamBtn = $("homeOpenFullAiTeamBtn");
1120:     if (fullAiTeamBtn) fullAiTeamBtn.onclick = () => openRoute("ai-command");
1121: 
1122:     const quickCampaignBtn = $("homeQuickStartCampaignBtn");
1123:     if (quickCampaignBtn) quickCampaignBtn.onclick = () => openRoute("campaign-studio");
1124: 
```

### .onclick at line 1123

```js
1119:     const fullAiTeamBtn = $("homeOpenFullAiTeamBtn");
1120:     if (fullAiTeamBtn) fullAiTeamBtn.onclick = () => openRoute("ai-command");
1121: 
1122:     const quickCampaignBtn = $("homeQuickStartCampaignBtn");
1123:     if (quickCampaignBtn) quickCampaignBtn.onclick = () => openRoute("campaign-studio");
1124: 
1125:     const quickAssetBtn = $("homeQuickAssetLibraryBtn") || $("homeQuickUploadAssetBtn");
1126:     if (quickAssetBtn) quickAssetBtn.onclick = () => openRoute("library");
1127: 
```

### .onclick at line 1126

```js
1122:     const quickCampaignBtn = $("homeQuickStartCampaignBtn");
1123:     if (quickCampaignBtn) quickCampaignBtn.onclick = () => openRoute("campaign-studio");
1124: 
1125:     const quickAssetBtn = $("homeQuickAssetLibraryBtn") || $("homeQuickUploadAssetBtn");
1126:     if (quickAssetBtn) quickAssetBtn.onclick = () => openRoute("library");
1127: 
1128:     const quickReadinessBtn = $("homeQuickReviewReadinessBtn");
1129:     if (quickReadinessBtn) quickReadinessBtn.onclick = () => openRoute("setup");
1130: 
```

### .onclick at line 1129

```js
1125:     const quickAssetBtn = $("homeQuickAssetLibraryBtn") || $("homeQuickUploadAssetBtn");
1126:     if (quickAssetBtn) quickAssetBtn.onclick = () => openRoute("library");
1127: 
1128:     const quickReadinessBtn = $("homeQuickReviewReadinessBtn");
1129:     if (quickReadinessBtn) quickReadinessBtn.onclick = () => openRoute("setup");
1130: 
1131:     const quickAiBtn = $("homeQuickOpenAiBtn");
1132:     if (quickAiBtn) {
1133:       quickAiBtn.onclick = () => openAiWithPrompt(dashboard.nextBestAction.recommendation);
```

### .onclick at line 1133

```js
1129:     if (quickReadinessBtn) quickReadinessBtn.onclick = () => openRoute("setup");
1130: 
1131:     const quickAiBtn = $("homeQuickOpenAiBtn");
1132:     if (quickAiBtn) {
1133:       quickAiBtn.onclick = () => openAiWithPrompt(dashboard.nextBestAction.recommendation);
1134:     }
1135: 
1136:     const promptNextBtn = $("homePromptNextBtn");
1137:     if (promptNextBtn) {
```

### .onclick at line 1138

```js
1134:     }
1135: 
1136:     const promptNextBtn = $("homePromptNextBtn");
1137:     if (promptNextBtn) {
1138:       promptNextBtn.onclick = () => openAiWithPrompt("What should I do next for this project? Prioritize the answer based on readiness, blockers, campaign state, and recent activity.");
1139:     }
1140: 
1141:     const promptReadinessBtn = $("homePromptReadinessBtn");
1142:     if (promptReadinessBtn) {
```

### .onclick at line 1143

```js
1139:     }
1140: 
1141:     const promptReadinessBtn = $("homePromptReadinessBtn");
1142:     if (promptReadinessBtn) {
1143:       promptReadinessBtn.onclick = () => openAiWithPrompt("Why is readiness low? Explain the missing integrations, assets, failed jobs, and readiness gaps in simple steps.");
1144:     }
1145: 
1146:     const promptLaunchBtn = $("homePromptLaunchBtn");
1147:     if (promptLaunchBtn) {
```

### .onclick at line 1148

```js
1144:     }
1145: 
1146:     const promptLaunchBtn = $("homePromptLaunchBtn");
1147:     if (promptLaunchBtn) {
1148:       promptLaunchBtn.onclick = () => openAiWithPrompt("Summarize the launch blockers and tell me what must be fixed before publishing.");
1149:     }
1150: 
1151:     const promptPlanBtn = $("homePromptPlanBtn");
1152:     if (promptPlanBtn) {
```


## Publish Mentions

### publish at line 200

```js
196:       status: campaign.name ? "Active" : "Missing"
197:     },
198:     {
199:       title: "Publish / execute",
200:       meta: launch.campaignReadiness === "Ready" ? "Execution path looks clear" : "Resolve blockers before publishing",
201:       tone: launch.campaignReadiness === "Ready" ? "is-live" : "is-warning",
202:       status: launch.campaignReadiness || "At risk"
203:     }
204:   ];
```

### publish at line 234

```js
230:   if (/(video|media|product video|asset|library|upload|brand file)/.test(text)) return "library";
231:   if (/(connector|integration|sync|platform)/.test(text)) return "integrations";
232:   if (/(setup|foundation)/.test(text)) return "setup";
233:   if (/(campaign|launch wave|brief)/.test(text)) return "campaign-studio";
234:   if (/(publish|schedule|queue)/.test(text)) return "publishing";
235:   if (/(ad|budget|paid)/.test(text)) return "ads-manager";
236:   if (/(content|copy)/.test(text)) return "content-studio";
237:   if (/(job|operation)/.test(text)) return "operations-centers";
238:   return "ai-command";
```

### publish at line 272

```js
268:     { id: "strategist", name: "Strategist", fallback: "Align campaign priorities and launch sequencing." },
269:     { id: "writer", name: "Content Writer", fallback: "Prepare high-conversion messaging for active channels." },
270:     { id: "designer", name: "Media Director", fallback: "Polish visual direction and creative consistency." },
271:     { id: "video_lead", name: "Video Lead", fallback: "Queue the next motion and short-form variants." },
272:     { id: "publisher", name: "Publisher", fallback: "Prepare publishing packages, schedules, and manual handoffs." },
273:     { id: "ads_operator", name: "Ads Optimizer", fallback: "Optimize paid testing, creative variants, and budget decisions." },
274:     { id: "analyst", name: "SEO & Insights Analyst", fallback: "Read weak signals and recommend measurable improvements." },
275:     { id: "compliance_reviewer", name: "Compliance Reviewer", fallback: "Review claims, approvals, and publish safety before release." },
276:     { id: "admin", name: "Operations Lead", fallback: "Clear blockers and keep execution flow healthy." }
```

### publish at line 275

```js
271:     { id: "video_lead", name: "Video Lead", fallback: "Queue the next motion and short-form variants." },
272:     { id: "publisher", name: "Publisher", fallback: "Prepare publishing packages, schedules, and manual handoffs." },
273:     { id: "ads_operator", name: "Ads Optimizer", fallback: "Optimize paid testing, creative variants, and budget decisions." },
274:     { id: "analyst", name: "SEO & Insights Analyst", fallback: "Read weak signals and recommend measurable improvements." },
275:     { id: "compliance_reviewer", name: "Compliance Reviewer", fallback: "Review claims, approvals, and publish safety before release." },
276:     { id: "admin", name: "Operations Lead", fallback: "Clear blockers and keep execution flow healthy." }
277:   ];
278: 
279:   return roles.map((role) => {
```

### publish at line 459

```js
455: 
456:   const mediaJobs = asArray(operations.media_jobs?.items);
457:   const mediaReadyCount = mediaJobs.filter((item) => statusTone(item?.status) === "success").length;
458: 
459:   const publishingQueue = asArray(operations.queues?.items).filter((item) =>
460:     asString(item.entity_type) === "publishing_job" || asString(item.queue_type) === "publishing"
461:   );
462:   const publishReadyCount = publishingQueue.filter((item) => {
463:     const status = asString(item.status || item.publish_status || item.execution_status).toLowerCase();
```

### publish at line 460

```js
456:   const mediaJobs = asArray(operations.media_jobs?.items);
457:   const mediaReadyCount = mediaJobs.filter((item) => statusTone(item?.status) === "success").length;
458: 
459:   const publishingQueue = asArray(operations.queues?.items).filter((item) =>
460:     asString(item.entity_type) === "publishing_job" || asString(item.queue_type) === "publishing"
461:   );
462:   const publishReadyCount = publishingQueue.filter((item) => {
463:     const status = asString(item.status || item.publish_status || item.execution_status).toLowerCase();
464:     return ["ready", "manual_publish_ready", "scheduled", "queued"].includes(status);
```

### publish at line 462

```js
458: 
459:   const publishingQueue = asArray(operations.queues?.items).filter((item) =>
460:     asString(item.entity_type) === "publishing_job" || asString(item.queue_type) === "publishing"
461:   );
462:   const publishReadyCount = publishingQueue.filter((item) => {
463:     const status = asString(item.status || item.publish_status || item.execution_status).toLowerCase();
464:     return ["ready", "manual_publish_ready", "scheduled", "queued"].includes(status);
465:   }).length + scheduledJobs.length;
466: 
```

### publish at line 463

```js
459:   const publishingQueue = asArray(operations.queues?.items).filter((item) =>
460:     asString(item.entity_type) === "publishing_job" || asString(item.queue_type) === "publishing"
461:   );
462:   const publishReadyCount = publishingQueue.filter((item) => {
463:     const status = asString(item.status || item.publish_status || item.execution_status).toLowerCase();
464:     return ["ready", "manual_publish_ready", "scheduled", "queued"].includes(status);
465:   }).length + scheduledJobs.length;
466: 
467:   const emailConnected = Boolean(
```

### publish at line 464

```js
460:     asString(item.entity_type) === "publishing_job" || asString(item.queue_type) === "publishing"
461:   );
462:   const publishReadyCount = publishingQueue.filter((item) => {
463:     const status = asString(item.status || item.publish_status || item.execution_status).toLowerCase();
464:     return ["ready", "manual_publish_ready", "scheduled", "queued"].includes(status);
465:   }).length + scheduledJobs.length;
466: 
467:   const emailConnected = Boolean(
468:     connectorChecks.email || connectorChecks.mailer || connectorChecks.smtp || connectorChecks.mailchimp
```

### publish at line 692

```js
688:     recentExecutionSummary,
689:     recentActivity,
690: 
691:     launchSnapshot: {
692:       publishReadiness: publishReadyCount,
693:       mediaReadiness: mediaReadyCount,
694:       emailReadiness: emailConnected ? "Connected" : "Missing",
695:       scheduledJobs: scheduledJobs.length,
696:       campaignReadiness: campaignReadinessTone === "success" ? "Ready" : "At risk"
```

### publish at line 713

```js
709: 
710:     recent: {
711:       execution: latestExecution
712:         ? `${humanizeStatus(latestExecution.execution_status, "Completed")} on ${humanizeStatus(latestExecution.channel, "Channel")}`
713:         : "No execution recorded yet — start with a campaign or publishing package to create the first signal.",
714:       recommendation: asString(recommendations[0]).trim() || asString(insightsRecommendations[0]).trim() || "Ask Executive AI to generate the next best action from readiness, blockers, and recent activity.",
715:       feedback: asString(learningLessons[0]).trim() || "Connect insights or run a reviewed campaign so the learning engine can capture feedback."
716:     },
717: 
```

### publish at line 865

```js
861:               <div class="mhos-os-chip-row">
862:                 <span class="mhos-os-chip">${escapeHtml(dashboard.nextBestAction.continuationSummary)}</span>
863:                 <span class="mhos-os-chip">Opens: ${escapeHtml(humanizeStatus(dashboard.nextBestAction.route))}</span>
864:                 <span class="mhos-os-chip">${escapeHtml(dashboard.nextBestAction.escalationSummary)}</span>
865:                 <span class="mhos-os-chip">No approval, publishing, sending, or record changes here</span>
866:               </div>
867:               <div class="mhos-os-action-row">
868:                 <button id="homePrimaryActionBtn" class="mhos-next-action-btn" type="button">
869:                   ${escapeHtml(dashboard.nextBestAction.buttonLabel)}
```


## Approval Mentions

### approval at line 245

```js
241: function buildAiTeamCards(state) {
242:   const operations = asObject(selectOperationsSnapshot(state));
243:   const notifications = asArray(operations.notifications?.items);
244:   const tasks = asArray(operations.tasks?.items);
245:   const approvals = asArray(operations.approvals?.items);
246: 
247:   const projectedMembers = getProjectedTeamMembers(state);
248:   const projectedActiveRole = asString(
249:     getProjectedActiveRole(state)
```

### approval at line 275

```js
271:     { id: "video_lead", name: "Video Lead", fallback: "Queue the next motion and short-form variants." },
272:     { id: "publisher", name: "Publisher", fallback: "Prepare publishing packages, schedules, and manual handoffs." },
273:     { id: "ads_operator", name: "Ads Optimizer", fallback: "Optimize paid testing, creative variants, and budget decisions." },
274:     { id: "analyst", name: "SEO & Insights Analyst", fallback: "Read weak signals and recommend measurable improvements." },
275:     { id: "compliance_reviewer", name: "Compliance Reviewer", fallback: "Review claims, approvals, and publish safety before release." },
276:     { id: "admin", name: "Operations Lead", fallback: "Clear blockers and keep execution flow healthy." }
277:   ];
278: 
279:   return roles.map((role) => {
```

### approval at line 282

```js
278: 
279:   return roles.map((role) => {
280:     const roleNotifications = notifications.filter((item) => asString(item?.owner_role).toLowerCase() === role.id);
281:     const roleTasks = tasks.filter((item) => asString(item?.owner_role).toLowerCase() === role.id);
282:     const roleApprovals = approvals.filter((item) => asString(item?.reviewer_role).toLowerCase() === role.id);
283: 
284:     const latest = roleNotifications[0] || roleTasks[0] || roleApprovals[0] || null;
285:     const statusRaw = asString(latest?.status || latest?.level || "idle");
286:     const tone = statusTone(statusRaw);
```

### approval at line 374

```js
370: 
371:   const insightsRecommendations = asArray(insights.recommendations);
372:   const learningLessons = asArray(learning.system_lessons);
373:   const tasks = asArray(operations.tasks?.items);
374:   const approvals = asArray(operations.approvals?.items);
375: 
376:   const automationTone = failedExecutions.length
377:     ? "danger"
378:     : scheduledJobs.length
```

### approval at line 427

```js
423:     const text = asString(item?.status || "").toLowerCase();
424:     return text.includes("pending") || text.includes("in_progress") || text.includes("review");
425:   });
426: 
427:   const pendingApprovals = approvals.filter((item) => {
428:     const text = asString(item?.status || "").toLowerCase();
429:     return !text || text.includes("pending") || text.includes("requested");
430:   });
431: 
```

### approval at line 453

```js
449:     ? `Signals: ${formatCount(intelligenceScore)}`
450:     : "Needs input";
451: 
452:   const escalationSummary = pendingApprovals.length
453:     ? `${formatCount(pendingApprovals.length)} approval${pendingApprovals.length === 1 ? "" : "s"} required`
454:     : "No escalations";
455: 
456:   const mediaJobs = asArray(operations.media_jobs?.items);
457:   const mediaReadyCount = mediaJobs.filter((item) => statusTone(item?.status) === "success").length;
```

### approval at line 560

```js
556:         executiveHealthStrip: {
557:           statusLabel: campaignReadinessTone === "success" ? "Healthy" : totalBlockers ? "Attention" : "Unknown",
558:           confidenceLabel: intelligenceTone === "success" ? `Signals: ${formatCount(intelligenceScore)}` : "Needs Input",
559:           escalationLabel: failedExecutions.length ? `Escalations: ${formatCount(failedExecutions.length)}` : "None",
560:           approvals: formatCount(pendingApprovals.length),
561:           confidence: formatPercent(systemScore),
562:           escalations: formatCount(failedExecutions.length),
563:           summary: `${formatCount(pendingApprovals.length)} approvals pending, ${formatCount(failedExecutions.length)} escalations, ${formatCount(unreadNotifications.length)} notifications, system score ${formatPercent(systemScore)}.`
564:         },
```

### approval at line 563

```js
559:           escalationLabel: failedExecutions.length ? `Escalations: ${formatCount(failedExecutions.length)}` : "None",
560:           approvals: formatCount(pendingApprovals.length),
561:           confidence: formatPercent(systemScore),
562:           escalations: formatCount(failedExecutions.length),
563:           summary: `${formatCount(pendingApprovals.length)} approvals pending, ${formatCount(failedExecutions.length)} escalations, ${formatCount(unreadNotifications.length)} notifications, system score ${formatPercent(systemScore)}.`
564:         },
565:     projectName,
566:     headerStatus: humanizeStatus(
567:       readinessData.readiness_status || overviewData.readiness_status || overviewData.status,
```

### approval at line 658

```js
654:       },
655:       {
656:         label: "Needs Attention",
657:         value: formatCount(unreadNotifications.length + pendingTasks.length + pendingApprovals.length),
658:         hint: "Notifications, tasks, approvals",
659:         tone: unreadNotifications.length + pendingTasks.length + pendingApprovals.length ? "warning" : "success"
660:       },
661:       {
662:         label: "Completed",
```

### approval at line 865

```js
861:               <div class="mhos-os-chip-row">
862:                 <span class="mhos-os-chip">${escapeHtml(dashboard.nextBestAction.continuationSummary)}</span>
863:                 <span class="mhos-os-chip">Opens: ${escapeHtml(humanizeStatus(dashboard.nextBestAction.route))}</span>
864:                 <span class="mhos-os-chip">${escapeHtml(dashboard.nextBestAction.escalationSummary)}</span>
865:                 <span class="mhos-os-chip">No approval, publishing, sending, or record changes here</span>
866:               </div>
867:               <div class="mhos-os-action-row">
868:                 <button id="homePrimaryActionBtn" class="mhos-next-action-btn" type="button">
869:                   ${escapeHtml(dashboard.nextBestAction.buttonLabel)}
```

### approval at line 1090

```js
1086:         video_lead: `Act as the Video Lead for ${projectLabel}. Review the project context and suggest the next best short-form/video actions. Do not execute anything; prepare guidance only.`,
1087:         publisher: `Act as the Publisher for ${projectLabel}. Review publishing readiness, scheduled jobs, blockers, and what must be checked before publishing. Do not execute anything; prepare guidance only.`,
1088:         ads_operator: `Act as the Ads Optimizer for ${projectLabel}. Review campaign readiness, channels, and paid media opportunities. Suggest next ad actions safely. Do not execute anything; prepare guidance only.`,
1089:         analyst: `Act as the SEO & Insights Analyst for ${projectLabel}. Review readiness, signals, gaps, and recent activity. Tell me what data matters most and what to improve next. Do not execute anything; prepare guidance only.`,
1090:         compliance_reviewer: `Act as the Compliance Reviewer for ${projectLabel}. Review launch blockers, claims, approvals, and publishing safety. Tell me what must be checked before release. Do not execute anything; prepare guidance only.`,
1091:         admin: `Act as the Operations Lead for ${projectLabel}. Review tasks, blockers, failed jobs, and execution health. Give me the next operational steps. Do not execute anything; prepare guidance only.`
1092:       };
1093: 
1094:       const prompt = rolePrompts[roleId] || `Act as the ${roleName} specialist for ${projectLabel}. Review the current project context and recommend the next best actions. Do not execute anything; prepare guidance only.`;
```


## Handoff Mentions

### handoff at line 272

```js
268:     { id: "strategist", name: "Strategist", fallback: "Align campaign priorities and launch sequencing." },
269:     { id: "writer", name: "Content Writer", fallback: "Prepare high-conversion messaging for active channels." },
270:     { id: "designer", name: "Media Director", fallback: "Polish visual direction and creative consistency." },
271:     { id: "video_lead", name: "Video Lead", fallback: "Queue the next motion and short-form variants." },
272:     { id: "publisher", name: "Publisher", fallback: "Prepare publishing packages, schedules, and manual handoffs." },
273:     { id: "ads_operator", name: "Ads Optimizer", fallback: "Optimize paid testing, creative variants, and budget decisions." },
274:     { id: "analyst", name: "SEO & Insights Analyst", fallback: "Read weak signals and recommend measurable improvements." },
275:     { id: "compliance_reviewer", name: "Compliance Reviewer", fallback: "Review claims, approvals, and publish safety before release." },
276:     { id: "admin", name: "Operations Lead", fallback: "Clear blockers and keep execution flow healthy." }
```

### handoff at line 842

```js
838:             </article>
839:             <article class="mhos-os-brief-card mhos-motion-soft">
840:               <span class="mhos-os-brief-label">Primary Focus</span>
841:               <strong class="mhos-os-brief-value">${escapeHtml(dashboard.nextBestAction.route === "ai-command" ? "AI Guidance" : humanizeStatus(dashboard.nextBestAction.route))}</strong>
842:               <span class="mhos-os-brief-hint">Next handoff: ${escapeHtml(dashboard.nextBestAction.urgencyLabel)}</span>
843:             </article>
844:           </div>
845:         </section>
846: 
```

### handoff at line 886

```js
882:                 <div>
883:                   <p class="mhos-os-kicker">Attention</p>
884:                   <h2 class="mhos-os-section-title">${dashboard.totalBlockers ? "Operating blockers" : "No critical blockers"}</h2>
885:                   <p class="mhos-os-section-copy">
886:                     ${dashboard.totalBlockers ? "Only the blockers that affect the next handoff are shown here." : "The current path is clear. Continue with the recommended workspace or ask AI for guidance."}
887:                   </p>
888:                 </div>
889:                 ${renderBadge(dashboard.totalBlockers ? "warning" : "success", dashboard.totalBlockers ? `${formatCount(dashboard.totalBlockers)} signals` : "Clear", escapeHtml)}
890:               </div>
```

### handoff at line 897

```js
893:                 ${topAttentionCards.map((item) => `
894:                   <article class="mhos-os-attention-card mhos-motion-soft">
895:                     <span class="mhos-os-chip ${escapeHtml(item.tone)}">${escapeHtml(item.title)}</span>
896:                     <strong>${escapeHtml(item.detail)}</strong>
897:                     <span>${escapeHtml(item.tone === "is-live" ? "Ready for the current operating path." : "Review before the next handoff.")}</span>
898:                   </article>
899:                 `).join("")}
900:               </div>
901:             </section>
```

### handoff at line 1037

```js
1033:               </div>
1034: 
1035:               <button id="homePromptNextBtn" class="home-ai-prompt-card" type="button">
1036:                 <span class="home-prompt-title">What is the next executive action?</span>
1037:                 <span class="home-prompt-meta">Prepare a short explanation and handoff path.</span>
1038:               </button>
1039:               <button id="homePromptReadinessBtn" class="home-ai-prompt-card" type="button">
1040:                 <span class="home-prompt-title">Why is readiness low?</span>
1041:                 <span class="home-prompt-meta">Explain blockers and readiness gaps in simple terms.</span>
```


## Confirmation Mentions

### confirm at line 390

```js
386:     criticalGaps[0]
387:       ? `Resolve: ${criticalGaps[0]}`
388:       : failedExecutions.length
389:         ? "Recover failed execution items"
390:         : "Review and confirm next launch move";
391: 
392:   const rawNextAction = asString(recommendations[0]).trim() || fallbackAction;
393:   const nextAction = humanizeExecutiveAction(rawNextAction, "Ask AI Command");
394:   const nextActionRoute = routeForAction(rawNextAction || nextAction);
```


## Shared Handoff / AI Draft Findings

No matches.

## Backend Authority Call Findings

No matches.

## Decision Placeholder

Classify after human review:

- Safe / route-only
- Needs confirmation copy
- Needs shared handoff guard
- Needs backend authority guard
- Needs no patch
