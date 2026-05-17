# Backend Guidance Routes

runtime/orchestrator-service/server.js:3038:    minimum_resolution_guidance: '>= 540x960',
runtime/orchestrator-service/server.js:3129:      max_duration_guidance: 'up to 3 minutes',
runtime/orchestrator-service/server.js:3136:      max_duration_guidance: 'long-form',
runtime/orchestrator-service/server.js:3184:    duration_guidance: rules.max_duration_guidance,
runtime/orchestrator-service/server.js:3326:      max_images_common_guidance: 24,
runtime/orchestrator-service/server.js:3440:      'Marketplace-safe image guidance',
runtime/orchestrator-service/server.js:8176:      guidance: {
runtime/orchestrator-service/server.js:8191:      description: 'Brand identity, voice, visual rules, and usage guidance.',
runtime/orchestrator-service/server.js:8192:      guidance: {
runtime/orchestrator-service/server.js:8193:        what_to_upload: 'Brand book, tone guide, design system notes, claim rules, and visual do/dont guidance.',
runtime/orchestrator-service/server.js:8208:      guidance: {
runtime/orchestrator-service/server.js:8224:      guidance: {
runtime/orchestrator-service/server.js:8240:      guidance: {
runtime/orchestrator-service/server.js:8256:      guidance: {
runtime/orchestrator-service/server.js:8272:      guidance: {
runtime/orchestrator-service/server.js:8288:      guidance: {
runtime/orchestrator-service/server.js:8304:      guidance: {
runtime/orchestrator-service/server.js:8320:      guidance: {
runtime/orchestrator-service/server.js:8336:      guidance: {
runtime/orchestrator-service/server.js:8352:      guidance: {
runtime/orchestrator-service/server.js:8368:      guidance: {
runtime/orchestrator-service/server.js:8914:      guidance: item.guidance,
runtime/orchestrator-service/server.js:8995:      guidance: item.guidance,
runtime/orchestrator-service/server.js:11210:  appLogger.info('ai_guidance_http_received', {
runtime/orchestrator-service/server.js:11211:    route: 'ai-guidance',
runtime/orchestrator-service/server.js:11219:    appLogger.info('ai_guidance_http_returned', {
runtime/orchestrator-service/server.js:11220:      route: 'ai-guidance',
runtime/orchestrator-service/server.js:11234:        error: error.message || 'Failed to execute AI guidance'
runtime/orchestrator-service/server.js:11237:    appLogger.error('ai_guidance_http_error', {
runtime/orchestrator-service/server.js:11238:      route: 'ai-guidance',
runtime/orchestrator-service/server.js:11350:app.post('/media-manager/project/:project/ai/guidance', handleExecuteAiGuidance);
runtime/orchestrator-service/server.js:11351:app.post('/public/media-manager/project/:project/ai/guidance', handleExecuteAiGuidance);
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:252:    'Provide practical guidance/content only.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:299:    provider.chat_answer,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:300:    raw.chat_answer,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1153:        throw new Error('Missing guidance request');
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1164:      const guidanceCommand = buildGuidancePrompt(input);
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1170:        logger.info('ai_guidance_received', {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1171:          route: 'ai-guidance',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1202:        logger.info('ai_guidance_provider_call_started', {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1203:          route: 'ai-guidance',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1210:          command: guidanceCommand,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1222:            guidance_only: true
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1246:        const guidancePayload = {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1258:          safety_label: 'guidance_only_no_operational_side_effects',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1274:          chat_answer: responseText,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1275:          response_text: responseText,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1280:            chat_answer: responseText,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1295:                'Review guidance output in AI Command.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1302:        logger.info('ai_guidance_response_returned', {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1303:          route: 'ai-guidance',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1305:          provider: guidancePayload.provider.id,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1306:          model: guidancePayload.provider.model,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1310:        return guidancePayload;
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1312:        logger.error('ai_guidance_error', {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1313:          route: 'ai-guidance',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1322:        const failureMessage = asString(error.message) || 'AI guidance execution failed';
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1324:        const guidanceError = createAiCommandExecutionError(failureMessage, {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1328:        guidanceError.payload = {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1342:          safety_label: 'guidance_only_no_operational_side_effects'
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1344:        throw guidanceError;
runtime/orchestrator-service/lib/ai/providers/openai.js:248:      chat_answer: humanizeValue(parsed.chat_answer || parsed.chatAnswer || content),
runtime/orchestrator-service/lib/ai/providers/openai.js:271:    chat_answer: asString(rawText),
runtime/orchestrator-service/lib/ai/providers/openai.js:395:        chat_answer: normalized.chat_answer,
runtime/orchestrator-service/lib/ai/provider-config.js:59:      'Produce ad ideas, paid strategy, targeting angles, budget guidance, and Meta, TikTok, Google, or Facebook ad copy.',
runtime/orchestrator-service/node_modules/readable-stream/GOVERNANCE.md:5:that is responsible for high-level guidance of the project.
runtime/orchestrator-service/node_modules/cookie/SECURITY.md:25:announcement, and may ask for additional information or guidance.
public/control-center/asset-library.js:12:    guidance: {
public/control-center/asset-library.js:27:    description: "Brand identity, voice, visual rules, and usage guidance.",
public/control-center/asset-library.js:28:    guidance: {
public/control-center/asset-library.js:29:      what_to_upload: "Brand book, tone guide, design system notes, claim rules, and visual do/dont guidance.",
public/control-center/asset-library.js:44:    guidance: {
public/control-center/asset-library.js:60:    guidance: {
public/control-center/asset-library.js:76:    guidance: {
public/control-center/asset-library.js:92:    guidance: {
public/control-center/asset-library.js:108:    guidance: {
public/control-center/asset-library.js:124:    guidance: {
public/control-center/asset-library.js:140:    guidance: {
public/control-center/asset-library.js:156:    guidance: {
public/control-center/asset-library.js:172:    guidance: {
public/control-center/asset-library.js:188:    guidance: {
public/control-center/asset-library.js:204:    guidance: {
public/control-center/asset-library.js:295:  const guidance = {
public/control-center/asset-library.js:296:    ...asObject(fallback.guidance),
public/control-center/asset-library.js:297:    ...asObject(category.guidance)
public/control-center/asset-library.js:312:    guidance
public/control-center/asset-library.js:446:            <span>${escapeHtml(asString(item.guidance?.used_in).replace(/,/g, ", ") || titleCaseAssetKey(item.asset_type))}</span>
public/control-center/styles/08-components-foundation.css:414::where(.mhos-ai-guidance) {
public/control-center/styles/08-components-foundation.css:427::where(.mhos-ai-guidance-title) {
public/control-center/styles/08-components-foundation.css:435::where(.mhos-ai-guidance-copy),
public/control-center/styles/08-components-foundation.css:436::where(.mhos-ai-guidance-reason) {
public/control-center/styles/08-components-foundation.css:443::where(.mhos-ai-guidance-actions) {
public/control-center/styles/12-pages.css:669:[data-page="setup"] .setup-guidance-strip {
public/control-center/styles/12-pages.css:676:[data-page="setup"] .setup-guidance-strip p {
public/control-center/styles/12-pages.css:4597:/* AI Team Phase 4.2 safe chat guidance polish */
public/control-center/styles/13-home-executive.css:452:.home-ai-guidance-panel {
public/control-center/pages/home.js:832:              <span class="home-action-meta">Get AI guidance on the next best action.</span>
public/control-center/pages/home.js:838:        <section class="card home-ai-guidance-panel">
public/control-center/pages/home.js:906:        strategist: `Act as the Strategist for ${projectLabel}. Review readiness, blockers, campaign state, and next best action. Give me the highest-impact strategic moves. Do not execute anything; prepare guidance only.`,
public/control-center/pages/home.js:907:        writer: `Act as the Content Writer for ${projectLabel}. Review the current project context and suggest the next best writing actions, messaging angles, and content priorities. Do not execute anything; prepare guidance only.`,
public/control-center/pages/home.js:908:        designer: `Act as the Media Director for ${projectLabel}. Review the visual/asset readiness and suggest the next best creative actions. Do not execute anything; prepare guidance only.`,
public/control-center/pages/home.js:909:        video_lead: `Act as the Video Lead for ${projectLabel}. Review the project context and suggest the next best short-form/video actions. Do not execute anything; prepare guidance only.`,
public/control-center/pages/home.js:910:        publisher: `Act as the Publisher for ${projectLabel}. Review publishing readiness, scheduled jobs, blockers, and what must be checked before publishing. Do not execute anything; prepare guidance only.`,
public/control-center/pages/home.js:911:        ads_operator: `Act as the Ads Optimizer for ${projectLabel}. Review campaign readiness, channels, and paid media opportunities. Suggest next ad actions safely. Do not execute anything; prepare guidance only.`,
public/control-center/pages/home.js:912:        analyst: `Act as the SEO & Insights Analyst for ${projectLabel}. Review readiness, signals, gaps, and recent activity. Tell me what data matters most and what to improve next. Do not execute anything; prepare guidance only.`,
public/control-center/pages/home.js:913:        compliance_reviewer: `Act as the Compliance Reviewer for ${projectLabel}. Review launch blockers, claims, approvals, and publishing safety. Tell me what must be checked before release. Do not execute anything; prepare guidance only.`,
public/control-center/pages/home.js:914:        admin: `Act as the Operations Lead for ${projectLabel}. Review tasks, blockers, failed jobs, and execution health. Give me the next operational steps. Do not execute anything; prepare guidance only.`
public/control-center/pages/home.js:917:      const prompt = rolePrompts[roleId] || `Act as the ${roleName} specialist for ${projectLabel}. Review the current project context and recommend the next best actions. Do not execute anything; prepare guidance only.`;
public/control-center/pages/ai-command.js:17:	executeProjectAiGuidance
public/control-center/pages/ai-command.js:41:                summary: "Visual direction, creative brief, format guidance, and brand consistency.",
public/control-center/pages/ai-command.js:139:		safetyNote: "All outputs are guidance and draft only. Execution requires explicit confirmation.",
public/control-center/pages/ai-command.js:160:		summary: "Visual direction, creative briefs, format guidance, and brand consistency.",
public/control-center/pages/ai-command.js:191:		safetyNote: "Publishing always requires explicit approval. No live publishing from AI guidance alone.",
public/control-center/pages/ai-command.js:269:		safetyNote: "Sales and CRM outputs are guidance and drafts only. CRM mutations and outreach sends require confirmation in the owning surface.",
public/control-center/pages/ai-command.js:356:	{ id: "draft", title: "Draft", description: "Generate guidance, copy, task, or handoff material." },
public/control-center/pages/ai-command.js:364:	{ id: "draft", label: "Draft", helper: "Latest draft or guidance preview" },
public/control-center/pages/ai-command.js:390:		{ id: "campaign-angle-generator", label: "Campaign Angle Generator", action: "preview", intent: "guidance", template: "Generate campaign angles for {project}. Include audience tension, promise, channel fit, and strongest first test." },
public/control-center/pages/ai-command.js:392:		{ id: "funnel-mapping", label: "Funnel Mapping", action: "preview", intent: "guidance", template: "Map the funnel for {project}. Include awareness, consideration, conversion, retention, and handoff points." },
public/control-center/pages/ai-command.js:396:		{ id: "hook-generator", label: "Hook Generator", action: "preview", intent: "guidance", template: "Write 5 German hook variants for {project}. Keep them concise, testable, and suitable for the Germany market." },
public/control-center/pages/ai-command.js:397:		{ id: "caption-builder", label: "Caption Builder", action: "preview", intent: "guidance", template: "Draft German captions for {project}. Include angle, body, CTA, and platform adaptation notes." },
public/control-center/pages/ai-command.js:403:		{ id: "format-mapper", label: "Format Mapper", action: "preview", intent: "guidance", template: "Map required creative formats for {project}. Include platform, aspect ratio, asset type, and usage context." },
public/control-center/pages/ai-command.js:405:		{ id: "visual-direction", label: "Visual Direction", action: "preview", intent: "guidance", template: "Review visual direction for {project}. Identify mismatches, improvements, and required references." },
public/control-center/pages/ai-command.js:409:		{ id: "write-video-hook", label: "Write video hook", action: "preview", intent: "guidance", template: "Write short-form video hooks for {project}. Include 3 opening variants and audience fit." },
public/control-center/pages/ai-command.js:410:		{ id: "draft-script", label: "Draft script", action: "preview", intent: "guidance", template: "Draft a short-form video script for {project}. Include hook, body, CTA, and visual cues." },
public/control-center/pages/ai-command.js:412:		{ id: "prepare-voiceover", label: "Prepare voiceover", action: "preview", intent: "guidance", template: "Prepare voiceover script options for {project}. Keep clean timing and emphasis notes." },
public/control-center/pages/ai-command.js:418:		{ id: "channel-formatting", label: "Channel Formatting", action: "preview", intent: "guidance", template: "Format the next output for {project} by channel. Include German copy, limits, CTA, and scheduling notes." },
public/control-center/pages/ai-command.js:423:		{ id: "ad-angle-generator", label: "Ad Angle Generator", action: "preview", intent: "guidance", template: "Draft ad angles for {project}. Include audience problem, value promise, German hook direction, and platform fit." },
public/control-center/pages/ai-command.js:424:		{ id: "copy-variants", label: "Copy Variants", action: "preview", intent: "guidance", template: "Prepare German ad copy variants for {project}. Include hooks, primary text, CTA, and creative notes." },
public/control-center/pages/ai-command.js:426:		{ id: "budget-notes", label: "Budget Notes", action: "preview", intent: "guidance", template: "Review budget notes for {project}. Summarize constraints and safe test allocation guidance." },
public/control-center/pages/ai-command.js:430:		{ id: "keyword-intent", label: "Keyword Intent", action: "preview", intent: "guidance", template: "Suggest keyword intent opportunities for {project}. Include Germany-market intent, content mapping, and priority." },
public/control-center/pages/ai-command.js:431:		{ id: "meta-direction", label: "Meta Direction", action: "preview", intent: "guidance", template: "Prepare meta direction for {project}. Include page angle, title direction, description direction, and CTA intent." },
public/control-center/pages/ai-command.js:437:		{ id: "claims-check", label: "Claims Check", action: "preview", intent: "guidance", template: "Review marketing claims for {project}. Flag unsupported, high-risk, or evidence-dependent wording." },
public/control-center/pages/ai-command.js:447:		{ id: "blocker-review", label: "Blocker Review", action: "preview", intent: "guidance", template: "Review operational blockers for {project}. Prioritize by risk and impact." },
public/control-center/pages/ai-command.js:451:		{ id: "review-unified-inbox", label: "Review Unified Inbox", action: "preview", intent: "guidance", template: "Review the Unified Inbox readiness for {project}. Summarize visible customer-operation signals, open gaps, and safe next review steps. Do not claim inbox actions happened." },
public/control-center/pages/ai-command.js:452:		{ id: "summarize-customer-thread", label: "Summarize Customer Thread", action: "preview", intent: "guidance", template: "Summarize this customer thread for {project}. Include customer issue, sentiment, reply goal, missing details, and safe next step." },
public/control-center/pages/ai-command.js:453:		{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },
public/control-center/pages/ai-command.js:455:		{ id: "check-sla-risk", label: "Check SLA Risk", action: "preview", intent: "guidance", template: "Check SLA risk for {project}. Flag urgency, risk level, missing runtime data, and escalation recommendation for review." },
public/control-center/pages/ai-command.js:457:		{ id: "customer-profile-snapshot", label: "Customer Profile Snapshot", action: "preview", intent: "guidance", template: "Prepare a customer profile snapshot for {project}. Include known context, purchase/support signals, missing fields, and safe follow-up questions." },
public/control-center/pages/ai-command.js:458:		{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
public/control-center/pages/ai-command.js:461:		{ id: "lead-qualification", label: "Lead Qualification", action: "preview", intent: "guidance", template: "Qualify the lead for {project}. Include fit, intent, urgency, missing CRM fields, and the safest next step." },
public/control-center/pages/ai-command.js:462:		{ id: "outreach-draft", label: "Outreach Draft", action: "preview", intent: "guidance", template: "Draft outreach for {project}. Include subject or opener, personalized message, CTA, and review notes before sending." },
public/control-center/pages/ai-command.js:464:		{ id: "crm-profile-summary", label: "CRM Profile Summary", action: "preview", intent: "guidance", template: "Summarize the CRM profile context for {project}. Include fit, history, open questions, and next sales action without mutating CRM data." },
public/control-center/pages/ai-command.js:466:		{ id: "dealer-salon-outreach", label: "Dealer / Salon Outreach", action: "preview", intent: "guidance", template: "Draft dealer or salon outreach for {project}. Include positioning, proof needs, offer angle, CTA, and follow-up note." },
public/control-center/pages/ai-command.js:528:		purpose: "Define creative direction, visual hierarchy, and asset guidance.",
public/control-center/pages/ai-command.js:1036:function getAiResponseBridgeStatus(executeProjectAiGuidanceFn) {
public/control-center/pages/ai-command.js:1037:	if (typeof executeProjectAiGuidanceFn !== "function") {
public/control-center/pages/ai-command.js:1040:			reason: "AI response guidance bridge is not connected yet (API function unavailable)."
public/control-center/pages/ai-command.js:1074:		"Return practical guidance and content only.",
public/control-center/pages/ai-command.js:1087:		response.chat_answer ||
public/control-center/pages/ai-command.js:1088:		response.response_text ||
public/control-center/pages/ai-command.js:1200:			summary: `Priority guidance prepared from: ${promptSnippet}`,
public/control-center/pages/ai-command.js:1246:			outputType: outputType === "guidance" ? "media_brief" : outputType,
public/control-center/pages/ai-command.js:1463:		guidance: "guidance",
public/control-center/pages/ai-command.js:1468:	const outputType = intentToType[intent] || "guidance";
public/control-center/pages/ai-command.js:1508:		guidance: "Guidance",
public/control-center/pages/ai-command.js:1514:	return labels[outputType] || titleCase(outputType || "guidance");
public/control-center/pages/ai-command.js:1768:		notes.push("Load project insights to unlock live intelligence guidance.");
public/control-center/pages/ai-command.js:1775:		notes.push("Search Console not synced — SEO guidance is limited.");
public/control-center/pages/ai-command.js:1778:		notes.push("Paid platform reporting not connected — ROAS guidance is limited.");
public/control-center/pages/ai-command.js:1791:		summary: summaryParts.join(" ") || "Project is loaded. Complete integrations to unlock stronger AI guidance.",
public/control-center/pages/ai-command.js:1859:			: "SEO visibility not live — connect Search Console to unlock guidance.",
public/control-center/pages/ai-command.js:2278:		safetyLabel: firstAiInboundText(preview.safetyLabel, preview.safety_label, "Guidance and draft only. No backend execution."),
public/control-center/pages/ai-command.js:3169:		guidance: "draft",
public/control-center/pages/ai-command.js:3196:		guidance: "Draft",
public/control-center/pages/ai-command.js:3208:	const outputType = tool.intent === "media" ? "guidance" : asString(tool.intent || "guidance");
public/control-center/pages/ai-command.js:3712:	const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
public/control-center/pages/ai-command.js:3871:                : "AI response bridge requires a guidance-only backend mode. Preview tools are available now.";
public/control-center/pages/ai-command.js:4027:	const destination = routeLabel(destinationRouteForSpecialist(session.modeId, asObject(session.outputPreview).outputType || "guidance"));
public/control-center/pages/ai-command.js:4101:					<span>Backend owns authority — AI Command prepares guidance and routes. It does not override execution controls.</span>
public/control-center/pages/ai-command.js:4222:		const responseBridge = getAiResponseBridgeStatus(executeProjectAiGuidance);
public/control-center/pages/ai-command.js:4482:					const result = await executeProjectAiGuidance(projectName, {
public/control-center/pages/ai-command.js:4500:						source: "ai-command-phase3b-specialist-guidance",
public/control-center/pages/ai-command.js:4507:						chat_answer: result?.chat_answer,
public/control-center/pages/ai-command.js:4508:						response_text: result?.response_text,
public/control-center/pages/ai-command.js:4517:					const safetyLabel = asString(result?.safety_label || "guidance_only");
public/control-center/pages/ai-command.js:4528:							safety_label: safetyLabel,
public/control-center/pages/ai-command.js:4531:						destinationRoute: asString(routeSuggestion?.route) || destinationRouteForSpecialist(session.modeId, "guidance")
public/control-center/pages/ai-command.js:4543:					updateStatus("Specialist guidance generated (no workflow/task/handoff created).");
public/control-center/pages/ai-command.js:4544:					showMessage?.("Specialist guidance generated. Guidance only — no workflow/task/handoff was created.");
public/control-center/pages/ai-command.js:4559:				const preview = setPreviewFromIntent("guidance", "", { switchTab: "preview" });
public/control-center/pages/ai-command.js:4562:				showMessage?.(`${specLabel} guidance preview prepared.`);
public/control-center/pages/ai-command.js:4647:					setPreviewFromIntent("guidance", preparedPrompt, { switchTab: "preview" });
public/control-center/pages/ai-command.js:4740:					intent: "guidance",
public/control-center/pages/ai-command.js:4771:				const destination = asString(latestResponse.destinationRoute || destinationRouteForSpecialist(session.modeId, "guidance"));
public/control-center/pages/media-studio-workspace.js:65:    suggestedPrompt: "Act as Voice Director. Create a voiceover script with opening hook, scene-aligned narration, cadence notes, and pronunciation guidance."
public/control-center/pages/media-studio-workspace.js:2227:          <h3>Specialist guidance and prompt actions</h3>
public/control-center/pages/setup.js:59:    description: "Map go-live channels and operator guidance.",
public/control-center/pages/setup.js:546:  if (positioning) positioning.textContent = compactListText([buildPositioningSuggestion(values)], "Generate positioning guidance from setup context.");
public/control-center/pages/setup.js:552:  if (tone) tone.textContent = compactListText([buildToneSuggestion(values)], "Suggest channel priorities and launch checklist guidance.");
public/control-center/pages/setup.js:1126:        input.value = `Suggest final setup completion for ${draftKeyName}. Missing fields: ${missingFields.length ? missingFields.join(", ") : "none"}. Include positioning, audience, and tone guidance.`;
public/control-center/pages/setup.js:1423:          <div class="setup-guidance-strip">
public/control-center/pages/campaign-studio.js:1854:                  helper: "Capture dependencies, packaging notes, approval guidance, or production instructions for the next operator.",
public/control-center/pages/library.js:701:      used_in: asArray(merged.used_in || catalogItem.guidance?.used_in || ["Library"]),
public/control-center/pages/library.js:869:    const usedIn = [...new Set(entries.flatMap((entry) => asArray(entry.guidance?.used_in)))];
public/control-center/pages/library.js:914:      used_in: [...new Set(entries.flatMap((entry) => asArray(entry.guidance?.used_in || [])))],
public/control-center/pages/settings.js:1617:          <button class="btn btn-secondary" type="button" data-settings-open-ai>Ask AI for guidance</button>
public/control-center/pages/library/ai-panel.js:77:      description: "Choose an asset to get clear source status, review status, and practical guidance.",
public/control-center/pages/workflows.js:49:    purpose: "Prepare media production inputs, format guidance, and downstream handoff steps.",
public/control-center/pages/workflows.js:2072:              <section class="mhos-ai-guidance">
public/control-center/pages/workflows.js:2073:                <h3 class="mhos-ai-guidance-title">AI Guidance</h3>
public/control-center/pages/workflows.js:2074:                <p class="mhos-ai-guidance-copy">AI prepares structure, sequencing, and missing-context prompts for ${escapeHtml(workflow.title)}.</p>
public/control-center/pages/workflows.js:2075:                <p class="mhos-ai-guidance-reason">Remaining gaps: ${escapeHtml(missing.map(titleCase).join(", ") || "No missing inputs")}. Safest next step: ${escapeHtml(nextAction)}</p>
public/control-center/pages/workflows.js:2076:                <div class="mhos-ai-guidance-actions">
public/control-center/legacy/styles.legacy-20260508.css:4870:.setup-guidance-strip {
public/control-center/legacy/styles.legacy-20260508.css:4882:.setup-guidance-strip p {
public/control-center/legacy/styles.legacy-20260508.css:4894:.setup-guidance-strip {
public/control-center/legacy/page-standard.legacy-20260508.js:187:    { label: "Generate image prompt", description: "Create a media job and attach prompt guidance.", action: "focus-new-media-image" },
public/control-center/legacy/page-standard.legacy-20260508.js:307:    description: "Use AI to turn campaign goals into paid briefs, variants, audiences, and budget guidance.",
public/control-center/legacy/page-standard.legacy-20260508.js:736:      card("Next step", "Build ad brief", "Prepare variants and budget guidance for Campaign Studio.", "success")
public/control-center/legacy/page-standard.legacy-20260508.js:758:    card("Next step", firstText([m.recommendations[0]], "Open AI Workspace for guidance"), "Recommended operating move.", m.recommendations.length ? "warning" : "neutral")
public/control-center/legacy/styles.legacy-full.css:6619:.setup-guidance-strip {
public/control-center/legacy/styles.legacy-full.css:6631:.setup-guidance-strip p {
public/control-center/legacy/styles.legacy-full.css:6643:  .setup-guidance-strip {
public/control-center/ai-team-model.js:63:    ownerSummary: "Paid media, ad packages, creative testing, budget guidance, and ROAS improvement.",
public/control-center/api.js:1566:export async function executeProjectAiGuidance(projectName, payload = {}) {
public/control-center/api.js:1572:    `/media-manager/project/${encodeURIComponent(projectName)}/ai/guidance`,
public/control-center/api.js:1575:    "Failed to request AI guidance",
