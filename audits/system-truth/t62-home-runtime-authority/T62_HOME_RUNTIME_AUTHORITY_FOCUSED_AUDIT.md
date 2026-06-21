# T62 — Home Runtime Authority Focused Audit

## Status
Audit-only. No production files changed.

## Scope
Focused audit of `public/control-center/pages/home.js` after T61 ranked Home as the highest remaining open frontend file.

## Why Home Ranked High
T61 used a heuristic model. Home has many projection, readiness, AI, operations, and action-copy terms. This does not automatically mean Home owns backend authority.

## File Summary
- File: `public/control-center/pages/home.js`
- Lines: 1164
- Render writes: 1
- Event bindings: 14
- Backend/write-like signals: 44
- Navigation signals: 24
- AI/handoff signals: 187
- Storage signals: 0
- Confirmation signals: 0

## Initial Risk Notes
- Backend/write-like terms exist and must be classified as projection/navigation/action-copy before patching.
- No confirmation dialogs found. This is acceptable only if Home has no destructive/write actions.
- No browser storage usage found.
- Home appears to use a limited render surface, not many scattered DOM writes.

## Render Writes
- L803: `root.innerHTML = \``

## Event Bindings
- L1101: `nextBtn.onclick = () => {`
- L1111: `askNextActionBtn.onclick = () => openAiWithPrompt(\`Explain this next best action and give me the exact steps: ${dashboard.nextBestAction.recommendation}\`);`
- L1115: `if (operationsBtn) operationsBtn.onclick = () => openRoute("operations-centers");`
- L1118: `if (aiTeamBtn) aiTeamBtn.onclick = () => openRoute("ai-command");`
- L1120: `if (fullAiTeamBtn) fullAiTeamBtn.onclick = () => openRoute("ai-command");`
- L1123: `if (quickCampaignBtn) quickCampaignBtn.onclick = () => openRoute("campaign-studio");`
- L1126: `if (quickAssetBtn) quickAssetBtn.onclick = () => openRoute("library");`
- L1129: `if (quickReadinessBtn) quickReadinessBtn.onclick = () => openRoute("setup");`
- L1133: `quickAiBtn.onclick = () => openAiWithPrompt(dashboard.nextBestAction.recommendation);`
- L1138: `promptNextBtn.onclick = () => openAiWithPrompt("What should I do next for this project? Prioritize the answer based on readiness, blockers, campaign state, and recent activity.");`
- L1143: `promptReadinessBtn.onclick = () => openAiWithPrompt("Why is readiness low? Explain the missing integrations, assets, failed jobs, and readiness gaps in simple steps.");`
- L1148: `promptLaunchBtn.onclick = () => openAiWithPrompt("Summarize the launch blockers and tell me what must be fixed before publishing.");`
- L1153: `promptPlanBtn.onclick = () => openAiWithPrompt("Prepare today's action plan from the current dashboard. Give me prioritized tasks with owners and expected outcomes.");`
- L1160: `card.onclick = () => handleAiRoleClick(roleId, roleName);`

## Backend / Write-like Signals
- L45: `function statusTone(input, score) {`
- L46: `const text = asString(input).toLowerCase();`
- L103: `const fields = ["updated_at", "completed_at", "executed_at", "scheduled_for", "created_at"];`
- L199: `title: "Publish / execute",`
- L200: `meta: launch.campaignReadiness === "Ready" ? "Execution path looks clear" : "Resolve blockers before publishing",`
- L234: `if (/(publish|schedule|queue)/.test(text)) return "publishing";`
- L272: `{ id: "publisher", name: "Publisher", fallback: "Prepare publishing packages, schedules, and manual handoffs." },`
- L275: `{ id: "compliance_reviewer", name: "Compliance Reviewer", fallback: "Review claims, approvals, and publish safety before release." },`
- L400: `: "Acting now keeps momentum and converts current readiness into measurable output.";`
- L450: `: "Needs input";`
- L459: `const publishingQueue = asArray(operations.queues?.items).filter((item) =>`
- L460: `asString(item.entity_type) === "publishing_job" || asString(item.queue_type) === "publishing"`
- L462: `const publishReadyCount = publishingQueue.filter((item) => {`
- L463: `const status = asString(item.status || item.publish_status || item.execution_status).toLowerCase();`
- L464: `return ["ready", "manual_publish_ready", "scheduled", "queued"].includes(status);`
- L487: `const when = formatRelativeDate(item?.executed_at || item?.updated_at || item?.created_at);`
- L513: `when: formatRelativeDate(item?.executed_at || item?.updated_at || item?.created_at),`
- L558: `confidenceLabel: intelligenceTone === "success" ? \`Signals: ${formatCount(intelligenceScore)}\` : "Needs Input",`
- L586: `intelligenceStatus: intelligenceScore > 0 ? "Active" : "Needs input",`
- L682: `: "No scheduled action yet — open Publishing or Campaign Studio to prepare the next launch step."`
- L692: `publishReadiness: publishReadyCount,`
- L713: `: "No execution recorded yet — start with a campaign or publishing package to create the first signal.",`
- L714: `recommendation: asString(recommendations[0]).trim() || asString(insightsRecommendations[0]).trim() || "Ask Executive AI to generate the next best action from readiness, blockers, and recent activity.",`
- L726: `lastExecution: latestExecution ? formatRelativeDate(latestExecution.executed_at || latestExecution.updated_at) : "Not available"`
- L737: `const input = $("quickCommandInput");`
- L738: `if (input) {`
- L739: `input.value = prompt;`
- L740: `input.focus?.();`
- L865: `<span class="mhos-os-chip">No approval, publishing, sending, or record changes here</span>`
- L930: `<span class="data-label">Publish Ready</span>`
- L931: `<strong>${escapeHtml(formatCount(dashboard.launchSnapshot.publishReadiness))}</strong>`
- L981: `<p class="mhos-os-panel-copy">These buttons open the right workspace. Home does not save, upload, approve, publish, send, or execute.</p>`
- L1032: `<p class="mhos-os-panel-copy">Prompt buttons fill AI Command with reviewed guidance requests. They do not execute actions.</p>`
- L1083: `strategist: \`Act as the Strategist for ${projectLabel}. Review readiness, blockers, campaign state, and next best action. Give me the highest-impact strategic moves. Do not execute anything; prepare guidance only.\`,`
- L1084: `writer: \`Act as the Content Writer for ${projectLabel}. Review the current project context and suggest the next best writing actions, messaging angles, and content priorities. Do not execute anything; prepare guidance only.\`,`
- L1085: `designer: \`Act as the Media Director for ${projectLabel}. Review the visual/asset readiness and suggest the next best creative actions. Do not execute anything; prepare guidance only.\`,`
- L1086: `video_lead: \`Act as the Video Lead for ${projectLabel}. Review the project context and suggest the next best short-form/video actions. Do not execute anything; prepare guidance only.\`,`
- L1087: `publisher: \`Act as the Publisher for ${projectLabel}. Review publishing readiness, scheduled jobs, blockers, and what must be checked before publishing. Do not execute anything; prepare guidance only.\`,`
- L1088: `ads_operator: \`Act as the Ads Optimizer for ${projectLabel}. Review campaign readiness, channels, and paid media opportunities. Suggest next ad actions safely. Do not execute anything; prepare guidance only.\`,`
- L1089: `analyst: \`Act as the SEO & Insights Analyst for ${projectLabel}. Review readiness, signals, gaps, and recent activity. Tell me what data matters most and what to improve next. Do not execute anything; prepare guidance only.\`,`
- L1090: `compliance_reviewer: \`Act as the Compliance Reviewer for ${projectLabel}. Review launch blockers, claims, approvals, and publishing safety. Tell me what must be checked before release. Do not execute anything; prepare guidance only.\`,`
- L1091: `admin: \`Act as the Operations Lead for ${projectLabel}. Review tasks, blockers, failed jobs, and execution health. Give me the next operational steps. Do not execute anything; prepare guidance only.\``
- L1094: `const prompt = rolePrompts[roleId] || \`Act as the ${roleName} specialist for ${projectLabel}. Review the current project context and recommend the next best actions. Do not execute anything; prepare guidance only.\`;`
- L1148: `promptLaunchBtn.onclick = () => openAiWithPrompt("Summarize the launch blockers and tell me what must be fixed before publishing.");`

## Navigation Signals
- L228: `function routeForAction(action) {`
- L394: `const nextActionRoute = routeForAction(rawNextAction || nextAction);`
- L574: `primaryActionLabel: nextActionRoute === "ai-command" ? "Prepare AI Guidance" : \`Open ${humanizeStatus(nextActionRoute)} Workspace\`,`
- L575: `primaryActionRoute: nextActionRoute,`
- L577: `secondaryActionRoute: "setup",`
- L594: `route: nextActionRoute,`
- L595: `buttonLabel: nextActionRoute === "ai-command" ? "Prepare AI Guidance" : \`Open ${humanizeStatus(nextActionRoute)} Workspace\`,`
- L669: `value: humanizeStatus(nextActionRoute),`
- L744: `export const homeRoute = {`
- L757: `render({ getState, $, escapeHtml, navigateTo, showMessage }) {`
- L819: `<span class="mhos-os-chip">Routes and AI guidance only</span>`
- L841: `<strong class="mhos-os-brief-value">${escapeHtml(dashboard.nextBestAction.route === "ai-command" ? "AI Guidance" : humanizeStatus(dashboard.nextBestAction.route))}</strong>`
- L863: `<span class="mhos-os-chip">Opens: ${escapeHtml(humanizeStatus(dashboard.nextBestAction.route))}</span>`
- L1068: `const openRoute = (route, message = "") => {`
- L1069: `navigateTo(route);`
- L1075: `navigateTo("ai-command");`
- L1102: `if (dashboard.nextBestAction.route === "ai-command") {`
- L1105: `openRoute(dashboard.nextBestAction.route, "Next best action opened.");`
- L1115: `if (operationsBtn) operationsBtn.onclick = () => openRoute("operations-centers");`
- L1118: `if (aiTeamBtn) aiTeamBtn.onclick = () => openRoute("ai-command");`
- L1120: `if (fullAiTeamBtn) fullAiTeamBtn.onclick = () => openRoute("ai-command");`
- L1123: `if (quickCampaignBtn) quickCampaignBtn.onclick = () => openRoute("campaign-studio");`
- L1126: `if (quickAssetBtn) quickAssetBtn.onclick = () => openRoute("library");`
- L1129: `if (quickReadinessBtn) quickReadinessBtn.onclick = () => openRoute("setup");`

## AI / Handoff Signals
- L3: `renderAiTeamCards,`
- L11: `getProjectedTeamMembers`
- L50: `text.includes("failed") ||`
- L117: `if (!Number.isFinite(stamp)) return "Not available";`
- L149: `"campaign studio": "Prepare the next campaign wave"`
- L169: `const campaign = asObject(dashboard.campaign);`
- L193: `title: "Build campaign",`
- L194: `meta: campaign.name ? \`Active: ${campaign.name}\` : "No active campaign selected",`
- L195: `tone: campaign.name ? "is-live" : "is-warning",`
- L196: `status: campaign.name ? "Active" : "Missing"`
- L200: `meta: launch.campaignReadiness === "Ready" ? "Execution path looks clear" : "Resolve blockers before publishing",`
- L201: `tone: launch.campaignReadiness === "Ready" ? "is-live" : "is-warning",`
- L202: `status: launch.campaignReadiness || "At risk"`
- L207: `function pickRecommendedSpecialist(aiTeamCards = [], dashboard = {}) {`
- L213: `aiTeamCards.find((card) => /video/i.test(card.name || card.id || "")) ||`
- L214: `aiTeamCards.find((card) => /media/i.test(card.name || card.id || "")) ||`
- L215: `aiTeamCards.find((card) => /creative|brand|content/i.test(card.name || card.id || "")) ||`
- L216: `aiTeamCards[0]`
- L221: `return aiTeamCards.find((card) => /operations|integrations|automation|system/i.test(card.name || card.id || "")) || aiTeamCards[0];`
- L224: `return aiTeamCards.find((card) => card.status === "Active role") || aiTeamCards[0] || null;`
- L233: `if (/(campaign|launch wave|brief)/.test(text)) return "campaign-studio";`
- L235: `if (/(ad|budget|paid)/.test(text)) return "ads-manager";`
- L238: `return "ai-command";`
- L241: `function buildAiTeamCards(state) {`
- L247: `const projectedMembers = getProjectedTeamMembers(state);`
- L259: `"AI Specialist"`
- L268: `{ id: "strategist", name: "Strategist", fallback: "Align campaign priorities and launch sequencing." },`
- L272: `{ id: "publisher", name: "Publisher", fallback: "Prepare publishing packages, schedules, and manual handoffs." },`
- L273: `{ id: "ads_operator", name: "Ads Optimizer", fallback: "Optimize paid testing, creative variants, and budget decisions." },`
- L275: `{ id: "compliance_reviewer", name: "Compliance Reviewer", fallback: "Review claims, approvals, and publish safety before release." },`
- L349: `const failedExecutions = sortedExecution.filter((item) => statusTone(item?.execution_status) === "danger");`
- L376: `const automationTone = failedExecutions.length`
- L388: `: failedExecutions.length`
- L389: `? "Recover failed execution items"`
- L393: `const nextAction = humanizeExecutiveAction(rawNextAction, "Ask AI Command");`
- L398: `: failedExecutions.length`
- L402: `const activeCampaignName =`
- L403: `asString(state.context.activeCampaign) ||`
- L434: `: failedExecutions.length`
- L440: `: failedExecutions.length`
- L441: `? \`Stabilizes ${formatCount(failedExecutions.length)} failed job${failedExecutions.length === 1 ? "" : "s"}\``
- L442: `: "Maintains operational flow";`
- L467: `const emailConnected = Boolean(`
- L468: `connectorChecks.email || connectorChecks.mailer || connectorChecks.smtp || connectorChecks.mailchimp`
- L481: `failedExecutions.length === 0 ? 1 : 0`
- L512: `detail: compact(item?.wave_name, "Execution result"),`
- L520: `detail: compact(item?.wave_name, "Scheduled job"),`
- L528: `detail: compact(item?.action || item?.status || item?.level, "Review required"),`
- L538: `failedJobs: failedExecutions.slice(0, 8).map((item) =>`
- L539: `\`${humanizeStatus(item?.channel, "Channel")}: ${humanizeStatus(item?.execution_status, "Failed")}\``
- L550: `blockers.failedJobs.length +`
- L553: `const campaignReadinessTone = totalBlockers ? "warning" : "success";`
- L557: `statusLabel: campaignReadinessTone === "success" ? "Healthy" : totalBlockers ? "Attention" : "Unknown",`
- L559: `escalationLabel: failedExecutions.length ? \`Escalations: ${formatCount(failedExecutions.length)}\` : "None",`
- L562: `escalations: formatCount(failedExecutions.length),`
- L563: `summary: \`${formatCount(pendingApprovals.length)} approvals pending, ${formatCount(failedExecutions.length)} escalations, ${formatCount(unreadNotifications.length)} notifications, system score ${formatPercent(systemScore)}.\``
- L573: `: "Select a project to see readiness, blockers, the next action, and the right AI specialist.",`
- L574: `primaryActionLabel: nextActionRoute === "ai-command" ? "Prepare AI Guidance" : \`Open ${humanizeStatus(nextActionRoute)} Workspace\`,`
- L588: `criticalAlerts: criticalGaps.length + failedExecutions.length + unreadNotifications.length`
- L595: `buttonLabel: nextActionRoute === "ai-command" ? "Prepare AI Guidance" : \`Open ${humanizeStatus(nextActionRoute)} Workspace\`,`
- L607: `detail: dashboardLabelFromScore(systemScore),`
- L613: `detail: criticalGaps.length ? \`${formatCount(criticalGaps.length)} blockers\` : "Ready for scale",`
- L619: `detail: \`${formatCount(failedExecutions.length)} failed jobs\`,`
- L625: `detail: intelligenceScore ? "Signals captured" : "Needs fresh feedback",`
- L629: `title: "Active Campaign",`
- L630: `value: activeCampaignName ? "Live" : "Missing",`
- L631: `detail: activeCampaignName || "No campaign selected",`
- L632: `tone: activeCampaignName ? "success" : "warning"`
- L650: `label: "Failed",`
- L651: `value: formatCount(failedExecutions.length),`
- L652: `hint: "Execution failures",`
- L653: `tone: failedExecutions.length ? "danger" : "success"`
- L675: `campaign: {`
- L676: `name: activeCampaignName,`
- L682: `: "No scheduled action yet — open Publishing or Campaign Studio to prepare the next launch step."`
- L694: `emailReadiness: emailConnected ? "Connected" : "Missing",`
- L696: `campaignReadiness: campaignReadinessTone === "success" ? "Ready" : "At risk"`
- L713: `: "No execution recorded yet — start with a campaign or publishing package to create the first signal.",`
- L714: `recommendation: asString(recommendations[0]).trim() || asString(insightsRecommendations[0]).trim() || "Ask Executive AI to generate the next best action from readiness, blockers, and recent activity.",`
- L715: `feedback: asString(learningLessons[0]).trim() || "Connect insights or run a reviewed campaign so the learning engine can capture feedback."`
- L725: `nextSchedule: nextScheduled ? formatRelativeDate(nextScheduled.scheduled_for || nextScheduled.updated_at) : "Not available",`
- L726: `lastExecution: latestExecution ? formatRelativeDate(latestExecution.executed_at || latestExecution.updated_at) : "Not available"`
- L736: `function setGlobalAiPrompt($, prompt) {`
- L737: `const input = $("quickCommandInput");`
- L739: `input.value = prompt;`
- L749: `title: "Executive Command Center",`
- L762: `const aiTeamCards = buildAiTeamCards(state);`
- L766: `const campaignChannels = asArray(dashboard.campaign.channels);`
- L770: `{ title: "Failed Jobs", items: dashboard.blockers.failedJobs, tone: "danger" },`
- L778: `detail: dashboard.blockers.assets.length`
- L785: `detail: dashboard.blockers.integrations.length`
- L792: `detail: dashboard.blockers.readinessGaps.length`
- L794: `: "No critical readiness gaps are currently blocking the main path.",`
- L800: `const recommendedSpecialist = pickRecommendedSpecialist(aiTeamCards, dashboard);`
- L804: `<div class="home-command-center mhos-os-page">`
- L806: `<section class="mhos-os-header" aria-label="Executive Command Brief">`
- L807: `<div class="mhos-os-header-main">`
- L810: `<h1 class="mhos-os-title">${escapeHtml(dashboard.projectName || "Project Command Center")}</h1>`
- L819: `<span class="mhos-os-chip">Routes and AI guidance only</span>`
- L841: `<strong class="mhos-os-brief-value">${escapeHtml(dashboard.nextBestAction.route === "ai-command" ? "AI Guidance" : humanizeStatus(dashboard.nextBestAction.route))}</strong>`
- L842: `<span class="mhos-os-brief-hint">Next handoff: ${escapeHtml(dashboard.nextBestAction.urgencyLabel)}</span>`
- L848: `<main class="mhos-os-main">`
- L872: `Prepare AI Explanation`
- L886: `${dashboard.totalBlockers ? "Only the blockers that affect the next handoff are shown here." : "The current path is clear. Continue with the recommended workspace or ask AI for guidance."}`
- L896: `<strong>${escapeHtml(item.detail)}</strong>`
- L897: `<span>${escapeHtml(item.tone === "is-live" ? "Ready for the current operating path." : "Review before the next handoff.")}</span>`
- L926: `<details class="mhos-os-evidence-panel">`
- L927: `<summary class="mhos-os-panel-title">System details and evidence</summary>`
- L938: `<span class="data-label">Email</span>`
- L939: `<strong>${escapeHtml(dashboard.launchSnapshot.emailReadiness)}</strong>`
- L954: `<p class="mhos-os-panel-copy">No detailed blockers are currently available for this project.</p>`
- L966: `</details>`
- L968: `<details class="mhos-os-evidence-panel">`
- L971: `</details>`
- L973: `</main>`
- L975: `<aside class="mhos-os-rail" aria-label="Action and AI Guidance">`
- L992: `<button id="homeQuickStartCampaignBtn" class="quick-action-btn" type="button">`
- L993: `<span class="home-action-title">Open Campaign Studio</span>`
- L994: `<span class="home-action-meta">Plan the next campaign wave in its workspace.</span>`
- L998: `<section class="mhos-os-ai-panel">`

## Storage Signals
- none

## Confirmation Signals
- none

## Required Manual Classification
Before any patch, classify every Home action into one of:

1. Navigation only
2. AI context handoff only
3. Projection/read-only refresh
4. Draft/local-only
5. Backend mutation/write
6. Unknown / needs deeper inspection

## Decision Rule
- If Home actions are only navigation/projection/AI-context, close T62 as safe with no runtime patch.
- If any backend mutation exists without clear confirmation/backend authority, create a narrow T63 patch.
- Do not redesign Home in this pass.
