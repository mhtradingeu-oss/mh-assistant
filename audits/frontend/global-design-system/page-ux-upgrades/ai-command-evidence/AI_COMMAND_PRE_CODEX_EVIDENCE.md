# AI Command International UX Upgrade — Pre-Codex Evidence

## Branch
architecture/frontend-consolidation-v1

## Current HEAD
0f4fd50 Upgrade Library finder UX safely

## Git Status
?? audits/frontend/global-design-system/page-ux-upgrades/ai-command-evidence/

## Syntax Baseline
- node --check public/control-center/pages/ai-command.js: pass if command above had no output
- node --check public/control-center/pages/ai-command/tool-dock.js: pass if command above had no output
- node --check app/router/api: pass if command above had no output

## Key AI Command Contracts
- route id: ai-command
- AI Command owns AI prompt preparation, specialist/team selection, composer/session, output review, and Tool Drawer prompt setup
- selected Library source is trusted context only
- AI output is not approval, publishing, sending, or execution
- Tool Drawer prepares structured prompts only
- destination pages own destination behavior

## Required Controls / Signals To Preserve
public/control-center/pages/ai-command.js:4:        getSelectedLibrarySource,
public/control-center/pages/ai-command.js:40:                routeHint: "campaign-studio"
public/control-center/pages/ai-command.js:46:                summary: "Captions, hooks, scripts, emails, and landing page copy.",
public/control-center/pages/ai-command.js:47:                routeHint: "content-studio"
public/control-center/pages/ai-command.js:54:                routeHint: "media-studio"
public/control-center/pages/ai-command.js:61:                routeHint: "media-studio"
public/control-center/pages/ai-command.js:68:                routeHint: "publishing"
public/control-center/pages/ai-command.js:74:                summary: "Ad concepts, targeting angles, platform copy, and paid strategy.",
public/control-center/pages/ai-command.js:75:                routeHint: "ads-manager"
public/control-center/pages/ai-command.js:82:                routeHint: "insights"
public/control-center/pages/ai-command.js:89:                routeHint: "governance"
public/control-center/pages/ai-command.js:96:                routeHint: "workflows"
public/control-center/pages/ai-command.js:103:                routeHint: "operations-centers"
public/control-center/pages/ai-command.js:109:                summary: "Lead qualification, outreach drafts, follow-up cadence, and CRM handoff notes.",
public/control-center/pages/ai-command.js:110:                routeHint: "workflows"
public/control-center/pages/ai-command.js:159:		summary: "Captions, hooks, scripts, emails, and landing page copy.",
public/control-center/pages/ai-command.js:160:		placeholder: "Ask the Content Writer to draft captions, hooks, landing copy, or campaign messages…",
public/control-center/pages/ai-command.js:161:		canHelp: ["Draft captions and hooks", "Write email copy", "Create landing page text", "Prepare publisher handoff", "Suggest message variants"],
public/control-center/pages/ai-command.js:211:		summary: "Ad concepts, targeting angles, platform copy, and paid strategy.",
public/control-center/pages/ai-command.js:212:		placeholder: "Ask the Ads Optimizer to draft ad copy, review targeting angles, or plan a paid campaign structure…",
public/control-center/pages/ai-command.js:213:		canHelp: ["Draft ad concepts and copy", "Review targeting angles", "Plan paid campaign structure", "Suggest creative variants", "Map platform-specific strategy"],
public/control-center/pages/ai-command.js:216:		safetyNote: "Ad concepts and copy only. Live ad actions require platform integration and explicit approval.",
public/control-center/pages/ai-command.js:264:		placeholder: "Ask the Customer Operations Lead to summarize a customer thread, draft a safe reply, prepare a ticket draft, check SLA risk, or route an escalation for review…",
public/control-center/pages/ai-command.js:276:		summary: "Lead qualification, outreach drafts, follow-up cadence, CRM profile summaries, and sales handoff notes.",
public/control-center/pages/ai-command.js:277:		placeholder: "Ask the Sales / CRM Lead to qualify a lead, draft outreach, plan follow-ups, summarize CRM context, or prepare a sales handoff for review…",
public/control-center/pages/ai-command.js:278:		canHelp: ["Qualify lead context", "Draft outreach", "Plan follow-up sequences", "Summarize CRM profiles", "Prepare sales handoffs"],
public/control-center/pages/ai-command.js:279:		cannotDo: ["Send outreach", "Mutate CRM records", "Advance pipeline stages", "Confirm follow-ups without review"],
public/control-center/pages/ai-command.js:346:		{ label: "Prepare escalation", sub: "Route support, sales, or operations" }
public/control-center/pages/ai-command.js:351:		{ label: "Build follow-up sequence", sub: "Multi-step sales cadence" },
public/control-center/pages/ai-command.js:352:		{ label: "Prepare sales handoff", sub: "Route context to operations" }
public/control-center/pages/ai-command.js:368:	{ id: "draft", title: "Draft", description: "Generate guidance, copy, task, or handoff material." },
public/control-center/pages/ai-command.js:370:	{ id: "route", title: "Route", description: "Send context to the owning workspace." },
public/control-center/pages/ai-command.js:417:		summary: "Market, evidence, competitor, and proof research will prepare source packs only."
public/control-center/pages/ai-command.js:423:		summary: "Workflow blueprints and trigger maps will route to Workflows before execution."
public/control-center/pages/ai-command.js:438:		{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }
public/control-center/pages/ai-command.js:442:		{ id: "format-mapper", label: "Format Mapper", action: "preview", intent: "guidance", template: "Map required creative formats for {project}. Include platform, aspect ratio, asset type, and usage context." },
public/control-center/pages/ai-command.js:444:		{ id: "visual-direction", label: "Visual Direction", action: "preview", intent: "guidance", template: "Review visual direction for {project}. Identify mismatches, improvements, and required references." },
public/control-center/pages/ai-command.js:445:		{ id: "open-media-studio", label: "Send prompt to Media Studio", action: "route", route: "media-studio" }
public/control-center/pages/ai-command.js:452:		{ id: "map-video-asset-needs", label: "Map video asset needs", action: "preview", intent: "task", template: "Map video asset needs for {project}. Include format, source, and production owner." }
public/control-center/pages/ai-command.js:455:		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
public/control-center/pages/ai-command.js:456:		{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },
public/control-center/pages/ai-command.js:457:		{ id: "channel-formatting", label: "Channel Formatting", action: "preview", intent: "guidance", template: "Format the next output for {project} by channel. Include German copy, limits, CTA, and scheduling notes." },
public/control-center/pages/ai-command.js:459:		{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }
public/control-center/pages/ai-command.js:463:		{ id: "copy-variants", label: "Copy Variants", action: "preview", intent: "guidance", template: "Prepare German ad copy variants for {project}. Include hooks, primary text, CTA, and creative notes." },
public/control-center/pages/ai-command.js:466:		{ id: "open-ads-manager", label: "Open Ads Manager", action: "route", route: "ads-manager" }
public/control-center/pages/ai-command.js:473:		{ id: "open-insights", label: "Open Insights", action: "route", route: "insights" }
public/control-center/pages/ai-command.js:477:		{ id: "approval-flags", label: "Approval Flags", action: "preview", intent: "task", template: "Check approval risks for {project}. List risk, impact, mitigation, and required owner." },
public/control-center/pages/ai-command.js:478:		{ id: "safety-checklist", label: "Safety Checklist", action: "preview", intent: "handoff", template: "Prepare a safety checklist for {project}. Include policy checks, evidence required, and approval notes." },
public/control-center/pages/ai-command.js:480:		{ id: "open-governance", label: "Open Governance", action: "route", route: "governance" }
public/control-center/pages/ai-command.js:484:		{ id: "handoff-routing", label: "Handoff Routing", action: "preview", intent: "handoff", template: "Prepare handoff routing for {project}. Include source, destination, decision gates, and required confirmations." },
public/control-center/pages/ai-command.js:487:		{ id: "open-workflows", label: "Open Workflows / Operations", action: "route", route: "workflows" }
public/control-center/pages/ai-command.js:496:		{ id: "customer-profile-snapshot", label: "Customer Profile Snapshot", action: "preview", intent: "guidance", template: "Prepare a customer profile snapshot for {project}. Include known context, purchase/support signals, missing fields, and safe follow-up questions." },
public/control-center/pages/ai-command.js:497:		{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
public/control-center/pages/ai-command.js:502:		{ id: "follow-up-sequence", label: "Follow-up Sequence", action: "preview", intent: "workflow", template: "Build a follow-up sequence for {project}. Include timing, message angle, CTA, stop condition, and confirmation requirements." },
public/control-center/pages/ai-command.js:504:		{ id: "pipeline-next-step", label: "Pipeline Next Step", action: "preview", intent: "task", template: "Recommend the pipeline next step for {project}. Include stage, rationale, owner, risk, and required confirmation." },
public/control-center/pages/ai-command.js:505:		{ id: "dealer-salon-outreach", label: "Dealer / Salon Outreach", action: "preview", intent: "guidance", template: "Draft dealer or salon outreach for {project}. Include positioning, proof needs, offer angle, CTA, and follow-up note." },
public/control-center/pages/ai-command.js:513:	{ icon: "🚀", label: "Launch Campaign", sub: "Build a campaign plan", template: "Build a launch campaign for {project}. Map the channels, offer, phases, and required assets." },
public/control-center/pages/ai-command.js:560:		purpose: "Transform strategy into high-converting copy and scripts.",
public/control-center/pages/ai-command.js:604:		suggestedPrompt: "Act as Operations Assistant and convert priorities into a practical execution sequence."
public/control-center/pages/ai-command.js:967:			routeSuggestions: [],
public/control-center/pages/ai-command.js:1207:                `Use ${safeOutputLanguage} only for customer-facing or publishable copy such as captions, ads, emails, landing pages, final campaign text, or publishing packages.`,
public/control-center/pages/ai-command.js:1208:                "When you include publishable copy, label it clearly as publishable content and keep the explanation in the user chat language.",
public/control-center/pages/ai-command.js:1211:		`When drafting publishable copy, write it in ${safeOutputLanguage}.`,
public/control-center/pages/ai-command.js:1259:function destinationRouteForSpecialist(specialistId, outputType) {
public/control-center/pages/ai-command.js:1278:function resolveAiResponseOutputRoute(session, response = {}) {
public/control-center/pages/ai-command.js:1281:        const explicitDestination = asString(response.destinationRoute || "").trim();
public/control-center/pages/ai-command.js:1286:                response.destinationRoute,
public/control-center/pages/ai-command.js:1303:        const looksTaskLike = /\b(task|tasks|handoff|ticket|tickets|follow-up|follow up|owner|owners|assignee|assigned|due date|priority|priorities|backlog|checklist|next task|action item|action items)\b/.test(text);
public/control-center/pages/ai-command.js:1305:        const looksContentLike = /\b(content|caption|captions|post|posts|email|blog|article|copy|headline|landing page|script|message|cta|product copy|social post)\b/.test(text);
public/control-center/pages/ai-command.js:1314:                return { outputType, destinationRoute: "task-center" };
public/control-center/pages/ai-command.js:1319:                return { outputType, destinationRoute: explicitDestination || "workflows" };
public/control-center/pages/ai-command.js:1322:        if (/content|copy|draft|caption|email|blog|article|script/.test(outputType) || looksContentLike) {
public/control-center/pages/ai-command.js:1324:                return { outputType, destinationRoute: explicitDestination || "content-studio" };
public/control-center/pages/ai-command.js:1329:                return { outputType, destinationRoute: explicitDestination || "media-studio" };
public/control-center/pages/ai-command.js:1334:                return { outputType, destinationRoute: explicitDestination || "publishing" };
public/control-center/pages/ai-command.js:1339:                return { outputType, destinationRoute: explicitDestination || "governance" };
public/control-center/pages/ai-command.js:1344:                return { outputType, destinationRoute: explicitDestination || "insights" };
public/control-center/pages/ai-command.js:1351:                        destinationRoute: explicitDestination || (session?.teamMode === "team" ? "workflows" : "campaign-studio")
public/control-center/pages/ai-command.js:1355:        const destinationRoute = explicitDestination || destinationRouteForSpecialist(session?.modeId || "operations", outputType);
public/control-center/pages/ai-command.js:1356:        return { outputType, destinationRoute };
public/control-center/pages/ai-command.js:1360:function routeLabel(route) {
public/control-center/pages/ai-command.js:1375:	return labels[route] || titleCase(route);
public/control-center/pages/ai-command.js:1382:	const route = destinationRouteForSpecialist(specialistId, outputType);
public/control-center/pages/ai-command.js:1391:		destinationRoute: route,
public/control-center/pages/ai-command.js:1392:		confirmationRequired: outputType === "handoff" || specialistId === "publisher" || specialistId === "compliance_reviewer",
public/control-center/pages/ai-command.js:1394:		sourcePrompt: promptSnippet,
public/control-center/pages/ai-command.js:1397:		nextSafeAction: `Review in ${routeLabel(route)}`,
public/control-center/pages/ai-command.js:1411:					"Route execution draft to Campaign Studio or Workflows"
public/control-center/pages/ai-command.js:1431:			title: outputType === "task" ? "Task: Draft campaign copy" : "Content Guidance: Messaging draft",
public/control-center/pages/ai-command.js:1448:				"Use Arabic freely in the conversation; publishable copy should be reviewed in German.",
public/control-center/pages/ai-command.js:1456:				"Route to Content Studio for refinement"
public/control-center/pages/ai-command.js:1467:			summary: "Media brief prepared with visual direction, prompt ideas, and required assets.",
public/control-center/pages/ai-command.js:1475:				"Required assets and missing assets listed"
public/control-center/pages/ai-command.js:1491:				"Route to Media Studio for production planning"
public/control-center/pages/ai-command.js:1503:				"Final copy should be German for the Germany market unless a destination overrides it.",
public/control-center/pages/ai-command.js:1507:				"Validate asset and copy readiness",
public/control-center/pages/ai-command.js:1512:			confirmationRequired: true,
public/control-center/pages/ai-command.js:1513:			safetyLabel: "Confirmation required before publish. No publish action performed."
public/control-center/pages/ai-command.js:1534:				"Use this as copy and testing direction only."
public/control-center/pages/ai-command.js:1539:				"Platform-specific copy recommendations"
public/control-center/pages/ai-command.js:1552:				"Coverage gaps mapped for follow-up",
public/control-center/pages/ai-command.js:1568:				"Route to Governance for formal review"
public/control-center/pages/ai-command.js:1570:			confirmationRequired: true,
public/control-center/pages/ai-command.js:1578:			title: outputType === "task" ? "Ticket Draft: Customer operations follow-up" : "Customer Ops Draft: Thread, reply, and routing",
public/control-center/pages/ai-command.js:1580:			mainOutput: "Review the customer context, confirm missing details, then route the draft through the owning support, sales, or operations surface.",
public/control-center/pages/ai-command.js:1594:			nextStep: "Review the draft, confirm the destination team, then route through support, sales, or operations.",
public/control-center/pages/ai-command.js:1601:			confirmationRequired: true,
public/control-center/pages/ai-command.js:1610:			summary: "Sales and CRM draft prepared with lead qualification, outreach direction, follow-up cadence, and pipeline handoff notes.",
public/control-center/pages/ai-command.js:1617:			followUps: [
public/control-center/pages/ai-command.js:1618:				"Follow-up 1: clarify value and ask for interest.",
public/control-center/pages/ai-command.js:1619:				"Follow-up 2: add proof or relevant context.",
public/control-center/pages/ai-command.js:1629:				"Outreach and follow-ups require confirmation before sending."
public/control-center/pages/ai-command.js:1631:			nextStep: "Review the lead fit, confirm owner, then route the handoff to operations or the CRM surface.",
public/control-center/pages/ai-command.js:1635:				"Prepare follow-up sequence",
public/control-center/pages/ai-command.js:1636:				"Route sales handoff without mutating CRM data"
public/control-center/pages/ai-command.js:1638:			confirmationRequired: true,
public/control-center/pages/ai-command.js:1639:			safetyLabel: "No outreach sent, CRM record changed, follow-up scheduled, or pipeline stage advanced."
public/control-center/pages/ai-command.js:1661:			summary: "Operational plan drafted with next tasks, owners, and route.",
public/control-center/pages/ai-command.js:1711:			"Writer: draft hooks, captions, messages, email, or outreach copy",
public/control-center/pages/ai-command.js:1714:			"Publisher: package channel-ready copy, assets, schedule notes, and publish checks",
public/control-center/pages/ai-command.js:1716:			"Operations: convert the reviewed output into safe tasks, workflow draft, or handoff context"
public/control-center/pages/ai-command.js:1718:		destinationRoute: outputType === "task" ? "task-center" : "workflows",
public/control-center/pages/ai-command.js:1719:		nextSafeAction: "Review the team draft, confirm owners, then route draft context to the destination workspace",
public/control-center/pages/ai-command.js:1745:		`Source Prompt: ${humanizeValue(output.sourcePrompt)}`,
public/control-center/pages/ai-command.js:1753:	lines.push(`Destination: ${routeLabel(output.destinationRoute)}`);
public/control-center/pages/ai-command.js:1755:	lines.push(`Confirmation: ${output.confirmationRequired ? "Required before execution" : "Required for execution actions"}`);
public/control-center/pages/ai-command.js:1793:        const sourceText = humanizeValue(
public/control-center/pages/ai-command.js:1802:        const compactSummary = compactPreviewText(sourceText || summary, 420);
public/control-center/pages/ai-command.js:1805:        const mainLines = splitPreviewLines(sourceText || summary, 14)
public/control-center/pages/ai-command.js:1949:		sourceSummary: asObject(insights.source_summary || learning.source_summary),
public/control-center/pages/ai-command.js:1964:		writer: ["content", "post", "caption", "blog", "script", "email", "landing page section", "reel script", "copy", "write", "hooks"],
public/control-center/pages/ai-command.js:1967:		ads: ["ad ideas", "ad copy", "facebook ads", "meta ads", "tiktok ads", "google ads", "cta", "paid", "targeting angle", "ad creative"],
public/control-center/pages/ai-command.js:1970:		operations: ["task plan", "workflow", "handoff", "approval", "timeline", "execution plan", "route", "publish", "status", "priority", "priorities", "blocking", "blocker", "readiness", "next", "do next"],
public/control-center/pages/ai-command.js:1972:		sales_crm: ["lead", "leads", "crm", "sales", "outreach", "follow-up", "follow up", "pipeline", "dealer", "salon", "influencer"]
public/control-center/pages/ai-command.js:1987:	const actionRouting = /launch|build|reconnect|connect|improve|create|fix|route|plan|publish/.test(query);
public/control-center/pages/ai-command.js:1995:function routeSuggestion(label, route, reason) {
public/control-center/pages/ai-command.js:1996:	return { label, route, reason };
public/control-center/pages/ai-command.js:2048:		routeSuggestions: [
public/control-center/pages/ai-command.js:2049:			routeSuggestion("Setup", "setup", "Close missing project basics, goals, and audience inputs."),
public/control-center/pages/ai-command.js:2050:			routeSuggestion("Integrations", "integrations", "Reconnect data sources and improve intelligence coverage."),
public/control-center/pages/ai-command.js:2051:			routeSuggestion("Insights", "insights", "Review performance signals and the recommendation stack.")
public/control-center/pages/ai-command.js:2079:			top ? `Create a follow-up asset using ${extractTopMessage(top)}'s pattern.` : "Load social insight data before expanding content queue.",
public/control-center/pages/ai-command.js:2080:			weak ? `Move ${extractTopMessage(weak)} into a rewrite workflow.` : "Audit current content for posts not converting attention to clicks.",
public/control-center/pages/ai-command.js:2083:		routeSuggestions: [
public/control-center/pages/ai-command.js:2084:			routeSuggestion("Content Studio", "content-studio", "Rewrite weak posts and turn winning patterns into new drafts."),
public/control-center/pages/ai-command.js:2085:			routeSuggestion("Publishing", "publishing", "Schedule the next batch with stronger timing and approval control."),
public/control-center/pages/ai-command.js:2086:			routeSuggestion("Insights", "insights", "Compare top and weak content performance.")
public/control-center/pages/ai-command.js:2119:		routeSuggestions: [
public/control-center/pages/ai-command.js:2120:			routeSuggestion("Insights", "insights", "Review search and website performance together."),
public/control-center/pages/ai-command.js:2121:			routeSuggestion("Integrations", "integrations", "Reconnect GA4 or Search Console."),
public/control-center/pages/ai-command.js:2122:			routeSuggestion("Setup", "setup", "Refine positioning if traffic signal is weak or misaligned.")
public/control-center/pages/ai-command.js:2154:		routeSuggestions: [
public/control-center/pages/ai-command.js:2155:			routeSuggestion("Ads Manager", "ads-manager", "Review pacing, creative mapping, and paid operating view."),
public/control-center/pages/ai-command.js:2156:			routeSuggestion("Integrations", "integrations", "Connect or reconnect paid reporting platforms."),
public/control-center/pages/ai-command.js:2157:			routeSuggestion("Insights", "insights", "Compare paid vs organic and website results.")
public/control-center/pages/ai-command.js:2182:		routeSuggestions: [
public/control-center/pages/ai-command.js:2183:			routeSuggestion("Setup", "setup", "Strengthen project assumptions, goals, and audience context."),
public/control-center/pages/ai-command.js:2184:			routeSuggestion("Integrations", "integrations", "Increase data coverage and reduce blind spots."),
public/control-center/pages/ai-command.js:2185:			routeSuggestion("Insights", "insights", "See where evidence is strong and where it is thin.")
public/control-center/pages/ai-command.js:2198:		return { title: "Campaign launch task block", owner: "Campaign Studio", steps: ["Define the campaign objective, audience, and offer.", "Choose channels and budget based on current intelligence.", "List required assets and publishing dependencies before launch."] };
public/control-center/pages/ai-command.js:2201:		return { title: "Content plan task block", owner: "Content Studio", steps: ["Use the strongest content pattern as the starting template.", "Map posts by platform, hook, format, and CTA.", "Route approved items into Publishing for scheduling."] };
public/control-center/pages/ai-command.js:2209:	return { title: "Execution task block", owner: "Workflows", steps: ["Confirm the goal and required output.", "Identify which workspace owns the work.", "Move into the correct page and review the first step in the owning workspace."] };
public/control-center/pages/ai-command.js:2215:	const routeSuggestions = [];
public/control-center/pages/ai-command.js:2216:	if (/campaign/.test(query)) routeSuggestions.push(routeSuggestion("Campaign Studio", "campaign-studio", "Turn this into a structured launch plan."));
public/control-center/pages/ai-command.js:2218:		routeSuggestions.push(routeSuggestion("Content Studio", "content-studio", "Draft, rewrite, or prepare the requested content outputs."));
public/control-center/pages/ai-command.js:2219:		routeSuggestions.push(routeSuggestion("Publishing", "publishing", "Schedule or approve if the next step is publishing."));
public/control-center/pages/ai-command.js:2221:	if (/reconnect|connect|integration|tool|sync/.test(query)) routeSuggestions.push(routeSuggestion("Integrations", "integrations", "Reconnect data sources and restore intelligence coverage."));
public/control-center/pages/ai-command.js:2222:	if (/ads|campaign scale|roas|creative/.test(query)) routeSuggestions.push(routeSuggestion("Ads Manager", "ads-manager", "Review live paid performance and action the next media move."));
public/control-center/pages/ai-command.js:2223:	if (!routeSuggestions.length) routeSuggestions.push(routeSuggestion("Workflows", "workflows", "Use Workflows when the task spans multiple execution areas."));
public/control-center/pages/ai-command.js:2236:		routeSuggestions,
public/control-center/pages/ai-command.js:2339:		routeSuggestions: asArray(response?.routeSuggestions),
public/control-center/pages/ai-command.js:2345:const AI_INBOUND_SOURCE_LABELS = {
public/control-center/pages/ai-command.js:2367:const AI_INBOUND_SPECIALIST_BY_SOURCE = {
public/control-center/pages/ai-command.js:2399:const AI_INBOUND_SOURCE_ALIASES = {
public/control-center/pages/ai-command.js:2453:function normalizeAiInboundSourcePage(value) {
public/control-center/pages/ai-command.js:2460:	return AI_INBOUND_SOURCE_ALIASES[clean] || clean || "workspace";
public/control-center/pages/ai-command.js:2477:function normalizeAiInboundRouteSuggestions(rawSuggestions, sourcePage, sourceLabel) {
public/control-center/pages/ai-command.js:2478:	const fallbackRoute = sourcePage === "workspace" ? "workflows" : sourcePage;
public/control-center/pages/ai-command.js:2479:	const fallbackLabel = sourceLabel || routeLabel(fallbackRoute);
public/control-center/pages/ai-command.js:2482:		const rawRoute = firstAiInboundId(record.route, record.destination, record.page, record.targetPage, record.target_page);
public/control-center/pages/ai-command.js:2483:		const stringRoute = rawRoute ? "" : firstAiInboundId(item);
public/control-center/pages/ai-command.js:2484:		const route = normalizeAiInboundSourcePage(rawRoute || stringRoute || fallbackRoute);
public/control-center/pages/ai-command.js:2485:		const label = firstAiInboundText(record.label, record.title, record.name) || routeLabel(route) || fallbackLabel;
public/control-center/pages/ai-command.js:2487:		return { route, label, reason };
public/control-center/pages/ai-command.js:2488:	}).filter((item) => item.route || item.label);
public/control-center/pages/ai-command.js:2492:		route: fallbackRoute,
public/control-center/pages/ai-command.js:2502:	const destinationRoute = normalizeAiInboundSourcePage(
public/control-center/pages/ai-command.js:2503:		preview.destinationRoute ||
public/control-center/pages/ai-command.js:2504:		preview.destination_route ||
public/control-center/pages/ai-command.js:2505:		asArray(normalized.routeSuggestions)[0]?.route ||
public/control-center/pages/ai-command.js:2506:		normalized.sourcePage ||
public/control-center/pages/ai-command.js:2514:		title: firstAiInboundText(preview.title, normalized.title, `Inbound handoff from ${normalized.sourceLabel}`),
public/control-center/pages/ai-command.js:2516:		destinationRoute,
public/control-center/pages/ai-command.js:2519:		sourcePrompt: firstAiInboundText(preview.sourcePrompt, preview.source_prompt, normalized.prompt),
public/control-center/pages/ai-command.js:2523:		confirmationRequired: preview.confirmationRequired ?? preview.confirmation_required ?? true
public/control-center/pages/ai-command.js:2552:	return [handoff?.source_page, handoff?.destination_page, payload.prompt, payload.title]
public/control-center/pages/ai-command.js:2561:	const sourcePage = normalizeAiInboundSourcePage(firstAiInboundId(
public/control-center/pages/ai-command.js:2562:		payload.source_page,
public/control-center/pages/ai-command.js:2563:		payload.sourcePage,
public/control-center/pages/ai-command.js:2564:		handoff?.source_page,
public/control-center/pages/ai-command.js:2565:		handoff?.sourcePage,
public/control-center/pages/ai-command.js:2566:		draftContext.source_page,
public/control-center/pages/ai-command.js:2567:		draftContext.sourcePage
public/control-center/pages/ai-command.js:2569:	const sourceLabel = AI_INBOUND_SOURCE_LABELS[sourcePage] || routeLabel(sourcePage) || "Workspace";
public/control-center/pages/ai-command.js:2573:		AI_INBOUND_SPECIALIST_BY_SOURCE[sourcePage] ||
public/control-center/pages/ai-command.js:2592:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
public/control-center/pages/ai-command.js:2599:		`Inbound handoff from ${sourceLabel}`
public/control-center/pages/ai-command.js:2601:	const routeSuggestions = normalizeAiInboundRouteSuggestions(
public/control-center/pages/ai-command.js:2602:		asAiInboundList(payload.routeSuggestions).length ? payload.routeSuggestions :
public/control-center/pages/ai-command.js:2603:		asAiInboundList(payload.route_suggestions).length ? payload.route_suggestions :
public/control-center/pages/ai-command.js:2604:		asAiInboundList(draftContext.routeSuggestions).length ? draftContext.routeSuggestions :
public/control-center/pages/ai-command.js:2605:		draftContext.route_suggestions,
public/control-center/pages/ai-command.js:2606:		sourcePage,
public/control-center/pages/ai-command.js:2607:		sourceLabel
public/control-center/pages/ai-command.js:2618:		sourcePage,
public/control-center/pages/ai-command.js:2619:		sourceLabel,
public/control-center/pages/ai-command.js:2624:		routeSuggestions,
public/control-center/pages/ai-command.js:2628:			source_page: sourcePage,
public/control-center/pages/ai-command.js:2629:			sourcePage
public/control-center/pages/ai-command.js:2648:	session.routeSuggestions = normalized.routeSuggestions;
public/control-center/pages/ai-command.js:2651:		sourcePage: normalized.sourcePage,
public/control-center/pages/ai-command.js:2652:		sourceLabel: normalized.sourceLabel,
public/control-center/pages/ai-command.js:2654:		routeSuggestions: normalized.routeSuggestions
public/control-center/pages/ai-command.js:2677:		routeSuggestions: normalized.routeSuggestions,
public/control-center/pages/ai-command.js:2683:	persistSessionDraft(projectName, session, `Inbound handoff loaded from ${normalized.sourceLabel}`);
public/control-center/pages/ai-command.js:2691:	showMessage?.(`Inbound handoff loaded from ${normalized.sourceLabel}.`);
public/control-center/pages/ai-command.js:2700:	source,
public/control-center/pages/ai-command.js:2717:			source,
public/control-center/pages/ai-command.js:2742:			routeSuggestions: [],
public/control-center/pages/ai-command.js:2757:		source
public/control-center/pages/ai-command.js:2765:		source: "durable-ai-response",
public/control-center/pages/ai-command.js:2774:		source,
public/control-center/pages/ai-command.js:2939:					placeholder="Ask ${escapeHtml(mode.label)} anything — what to do next, what content is working, which campaign to scale, or where to route the next action…"
public/control-center/pages/ai-command.js:2973:					<button id="ctrlGlobalBtn" class="ctrl-secondary-btn" type="button">Copy to bar</button>
public/control-center/pages/ai-command.js:3026:	const routeSuggestions = asArray(response.routeSuggestions || response.route_suggestions).map((item) => {
public/control-center/pages/ai-command.js:3029:			label: humanizeValue(record.label || record.title || record.route || item),
public/control-center/pages/ai-command.js:3030:			route: asString(record.route || record.destination || record.page),
public/control-center/pages/ai-command.js:3033:	}).filter((item) => item.label || item.route);
public/control-center/pages/ai-command.js:3090:			${routeSuggestions.length ? `
public/control-center/pages/ai-command.js:3093:					<div class="ctrl-route-row">
public/control-center/pages/ai-command.js:3094:						${routeSuggestions.map((item, index) => `
public/control-center/pages/ai-command.js:3095:							<button class="ctrl-route-btn" type="button" data-ctrl-route="${index}" data-ctrl-route-owner="${escapeHtml(ownerId || "")}" title="${escapeHtml(item.reason)}">
public/control-center/pages/ai-command.js:3348:                `Convert this AI Team conversation into a ${typeLabel}.`,
public/control-center/pages/ai-command.js:3367:        preview.sourcePrompt = context.prompt || workPrompt;
public/control-center/pages/ai-command.js:3378:        preview.safetyLabel = preview.safetyLabel || "Conversation converted into a review-ready draft. No backend action executed.";
public/control-center/pages/ai-command.js:3451://  ROUTE EXPORT
public/control-center/pages/ai-command.js:3554:function getToolDestinationRoute(tool, session) {
public/control-center/pages/ai-command.js:3555:	if (tool.route) return asString(tool.route || "workflows");
public/control-center/pages/ai-command.js:3558:	return destinationRouteForSpecialist(session?.modeId || "operations", outputType);
public/control-center/pages/ai-command.js:3562:	if (tool.safetyLevel === "confirmation_required") return "Destination confirmation required";
public/control-center/pages/ai-command.js:3563:	if (tool.actionType === "source_required") return "Source required";
public/control-center/pages/ai-command.js:3673:			<span class="aicmd-room-member-copy">
public/control-center/pages/ai-command.js:3724:							<span class="aicmd-room-member-copy">
public/control-center/pages/ai-command.js:3818:			<div class="aicmd-room-active-copy">
public/control-center/pages/ai-command.js:3838:	if (/handoff|route|destination_brief/.test(haystack)) return "handoff";
public/control-center/pages/ai-command.js:3843:function getCanonicalToolRoute(tool = {}, session) {
public/control-center/pages/ai-command.js:3847:	return destinationRouteForSpecialist(session?.modeId || "operations", getCanonicalToolIntent(tool));
public/control-center/pages/ai-command.js:3850:function canonicalToolNeedsSelectedSource(tool = {}) {
public/control-center/pages/ai-command.js:3851:	const sourceMeta = asArray(tool.sourceTypes).join(" ");
public/control-center/pages/ai-command.js:3852:	return tool.actionType === "source_required" || /source_of_truth_assets|selected_asset|proof_doc|legal_doc|privacy_policy/i.test(sourceMeta);
public/control-center/pages/ai-command.js:3860:		route: getCanonicalToolRoute(tool, session),
public/control-center/pages/ai-command.js:3861:		requiresSelectedSource: canonicalToolNeedsSelectedSource(tool),
public/control-center/pages/ai-command.js:3921:					const destination = routeLabel(getToolDestinationRoute(tool, session));
public/control-center/pages/ai-command.js:3937:								<span>Route: ${escapeHtml(destination)}</span>
public/control-center/pages/ai-command.js:3960:function renderAiCommandMainSourceIndicator(projectName, escapeHtml) {
public/control-center/pages/ai-command.js:3961:	const source = getSelectedLibrarySource(projectName);
public/control-center/pages/ai-command.js:3962:	if (!source) return "";
public/control-center/pages/ai-command.js:3963:	const name = asString(source.name || source.filename || source.fileName || "Selected Library source");
public/control-center/pages/ai-command.js:3965:	const type = asString(source.asset_type || source.type || source.source_type || "Library asset");
public/control-center/pages/ai-command.js:3966:	const sourceOfTruth = typeof source.source_of_truth === "boolean"
public/control-center/pages/ai-command.js:3967:		? (source.source_of_truth ? "Source of truth" : "")
public/control-center/pages/ai-command.js:3968:		: asString(source.source_of_truth || "");
public/control-center/pages/ai-command.js:3969:	const status = asString(source.review_status || source.status_label || source.status || "");
public/control-center/pages/ai-command.js:3970:	const meta = [type, sourceOfTruth, status]
public/control-center/pages/ai-command.js:3977:		<div class="aicmd-main-source-indicator" title="${escapeHtml(name)}">
public/control-center/pages/ai-command.js:3978:			<span>AI Source</span>
public/control-center/pages/ai-command.js:4053:					${renderAiCommandMainSourceIndicator(aiContext.projectName || "", escapeHtml)}
public/control-center/pages/ai-command.js:4071:						<p class="aicmd-v2-preview-subtitle">Generated content, draft packages, and routed handoffs appear here.</p>
public/control-center/pages/ai-command.js:4084:	const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
public/control-center/pages/ai-command.js:4089:	const routeActionLabel = destination === "Content Studio"
public/control-center/pages/ai-command.js:4092:			? "Route Draft to Publishing"
public/control-center/pages/ai-command.js:4093:			: `Route Draft to ${destination}`;
public/control-center/pages/ai-command.js:4095:		? (preview.confirmationRequired ? "Confirmation required" : "Review before handoff route")
public/control-center/pages/ai-command.js:4103:					<p class="aicmd-v2-preview-subtitle">${escapeHtml(humanizeValue(preview.sourcePrompt, "Review the generated specialist output."))}</p>
public/control-center/pages/ai-command.js:4150:				<button id="aicmdV2LegacyPreviewCopyBtn" class="aicmd-v2-btn-secondary" type="button">Copy</button>
public/control-center/pages/ai-command.js:4152:				<button id="aicmdV2LegacyPreviewSendBtn" class="aicmd-v2-btn-secondary" type="button">Route Draft</button>
public/control-center/pages/ai-command.js:4167:	const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
public/control-center/pages/ai-command.js:4172:	const routeActionLabel = destination === "Content Studio"
public/control-center/pages/ai-command.js:4175:			? "Route Draft to Publishing"
public/control-center/pages/ai-command.js:4176:			: `Route Draft to ${destination}`;
public/control-center/pages/ai-command.js:4178:		? (preview.confirmationRequired ? "Confirmation required" : "Review before handoff route")
public/control-center/pages/ai-command.js:4187:                                        <p>${hasPreview ? "Review the result, then route draft context to the next workspace." : "Output appears here after a response or tool setup."}</p>
public/control-center/pages/ai-command.js:4258:                                        <button id="aicmdV2PreviewSendBtn" class="aicmd-v2-btn-primary" type="button">${escapeHtml(routeActionLabel)}</button>
public/control-center/pages/ai-command.js:4259:                                        <button id="aicmdV2PreviewCopyBtn" class="aicmd-v2-btn-secondary" type="button">Copy</button>
public/control-center/pages/ai-command.js:4265:                                <div class="aicmd-room-planned-note">No routed preview yet. Create a Draft, Task Preview, Workflow Preview, or Handoff Preview from the conversation first.</div>
public/control-center/pages/ai-command.js:4274:	const approval = preview.confirmationRequired ? "Confirmation required" : (preview.outputType ? "Review ready" : "No draft yet");
public/control-center/pages/ai-command.js:4354:                : "Preview-safe. Chat tools require the protected AI chat route.";
public/control-center/pages/ai-command.js:4359:                bridgeContext.source &&
public/control-center/pages/ai-command.js:4373:        const toolHint = selectedToolHints.length ? selectedToolHints.join(", ") : "Draft and route guidance";
public/control-center/pages/ai-command.js:4376:        const inboundSourceLabel = asString(inbound.sourceLabel || "");
public/control-center/pages/ai-command.js:4434:                                        <strong>${escapeHtml(inboundSourceLabel ? `Inbound from ${inboundSourceLabel}` : "Project session")}</strong>
public/control-center/pages/ai-command.js:4493:                                                <button id="aicmdV3ResponseConvertBtn" class="aicmd-v2-btn-primary" type="button">Create Preview</button>
public/control-center/pages/ai-command.js:4494:                                                <button id="aicmdV3ResponseSendBtn" class="aicmd-v2-btn-secondary" type="button">Route</button>
public/control-center/pages/ai-command.js:4495:                                                <button id="aicmdV3ResponseContinueBtn" class="aicmd-v2-btn-secondary" type="button">Follow Up</button>
public/control-center/pages/ai-command.js:4496:                                                <button id="aicmdV3ResponseCopyBtn" class="aicmd-v2-btn-ghost" type="button">Copy</button>
public/control-center/pages/ai-command.js:4561:	const destination = routeLabel(destinationRouteForSpecialist(session.modeId, asObject(session.outputPreview).outputType || "guidance"));
public/control-center/pages/ai-command.js:4590:				{ label: "Follow-ups", value: "Requires confirmation", present: false, scoped: true },
public/control-center/pages/ai-command.js:4655:			body: preview.sourcePrompt || preview.summary || "",
public/control-center/pages/ai-command.js:4685:export const aiCommandRoute = {
public/control-center/pages/ai-command.js:4691:		description: "Talk to your AI team, run structured tasks, and turn intelligence into review-ready plans and routed handoffs."
public/control-center/pages/ai-command.js:4703:			navigateTo,
public/control-center/pages/ai-command.js:4737:		// Consume prompt set by home.js handleAiRoleClick via quickCommandInput.
public/control-center/pages/ai-command.js:4739:		const globalInput = $("quickCommandInput");
public/control-center/pages/ai-command.js:4747:					source: "Home",
public/control-center/pages/ai-command.js:4830:			session.routeSuggestions = [];
public/control-center/pages/ai-command.js:4844:			aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:4870:		                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:4881:		                session.routeSuggestions = [];
public/control-center/pages/ai-command.js:4906:		                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:4914:				navigateTo("settings");
public/control-center/pages/ai-command.js:4927:				aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:4937:                                const shouldReplaceRoleDraft = Boolean(previousBridgeContext.source) ||
public/control-center/pages/ai-command.js:4952:                                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:4963:				aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5067:		// ── ASK SPECIALIST (P0.3.2C1 chat route) ────────────────
public/control-center/pages/ai-command.js:5083:		                        aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5085:		                        showMessage?.("AI chat route is not connected yet.");
public/control-center/pages/ai-command.js:5102:		                        source: "ai-command-chat"
public/control-center/pages/ai-command.js:5119:		                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5131:		                                language: languagePlan.conversationLanguage === "Auto" ? "Auto - follow the latest user message language" : languagePlan.conversationLanguage,
public/control-center/pages/ai-command.js:5142:		                                source: "ai-command-specialist-chat",
public/control-center/pages/ai-command.js:5155:		                                throw new Error("AI chat route returned no response text.");
public/control-center/pages/ai-command.js:5168:		                                source: "ai-chat-response",
public/control-center/pages/ai-command.js:5183:		                        const routeSuggestion = asArray(response.routeSuggestions || result?.routeSuggestions)[0];
public/control-center/pages/ai-command.js:5184:                                        const responseRoute = resolveAiResponseOutputRoute(session, {
public/control-center/pages/ai-command.js:5190:                                                destinationRoute: asString(routeSuggestion?.route)
public/control-center/pages/ai-command.js:5206:		                                outputType: responseRoute.outputType,
public/control-center/pages/ai-command.js:5208:		                                destinationRoute: responseRoute.destinationRoute
public/control-center/pages/ai-command.js:5225:                                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5240:		                        aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5263:                                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5268:                // Phase 1: converts the current conversation into a task preview. No backend execution.
public/control-center/pages/ai-command.js:5287:                                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5310:                                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5315:                // Phase 1: converts the current conversation into a handoff preview. No backend write.
public/control-center/pages/ai-command.js:5334:                                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5354:					actionType: tool.requiresSelectedSource ? "source_required" : (tool.actionType || "guided"),
public/control-center/pages/ai-command.js:5355:					destinations: asArray(tool.destinations).length ? tool.destinations : [getToolDestinationRoute(tool, session)],
public/control-center/pages/ai-command.js:5356:					sourceTypes: asArray(tool.sourceTypes).length ? tool.sourceTypes : ["current_chat"],
public/control-center/pages/ai-command.js:5395:				session.routeSuggestions = [];
public/control-center/pages/ai-command.js:5416:		const responseCopyBtn = $("aicmdV3ResponseCopyBtn");
public/control-center/pages/ai-command.js:5417:		if (responseCopyBtn) {
public/control-center/pages/ai-command.js:5418:			responseCopyBtn.onclick = async () => {
public/control-center/pages/ai-command.js:5429:					updateStatus("Copy failed. Clipboard access may be blocked.");
public/control-center/pages/ai-command.js:5462:		const responseConvertBtn = $("aicmdV3ResponseConvertBtn");
public/control-center/pages/ai-command.js:5463:		if (responseConvertBtn) {
public/control-center/pages/ai-command.js:5464:		        responseConvertBtn.onclick = () => {
public/control-center/pages/ai-command.js:5487:		                updateStatus("Conversation converted into a draft preview.");
public/control-center/pages/ai-command.js:5489:		                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5497:				const responseRoute = resolveAiResponseOutputRoute(session, latestResponse);
public/control-center/pages/ai-command.js:5498:				const destination = asString(latestResponse.destinationRoute || responseRoute.destinationRoute || destinationRouteForSpecialist(session.modeId, responseRoute.outputType || "guidance"));
public/control-center/pages/ai-command.js:5504:					routeSuggestions: [{ route: destination, label: routeLabel(destination), reason: "Specialist response destination" }],
public/control-center/pages/ai-command.js:5510:					source_page: "ai-command",
public/control-center/pages/ai-command.js:5524:				navigateTo(destination);
public/control-center/pages/ai-command.js:5544:		const previewCopyBtn = $("aicmdV2PreviewCopyBtn");
public/control-center/pages/ai-command.js:5545:		if (previewCopyBtn) {
public/control-center/pages/ai-command.js:5546:			previewCopyBtn.onclick = async () => {
public/control-center/pages/ai-command.js:5563:					updateStatus("Copy failed. Clipboard access may be blocked.");
public/control-center/pages/ai-command.js:5591:				const destination = asString(output.destinationRoute || "").trim();
public/control-center/pages/ai-command.js:5593:					updateStatus("No destination route is available for this preview.");
public/control-center/pages/ai-command.js:5599:					source_page: "ai-command",
public/control-center/pages/ai-command.js:5604:						prompt: output.sourcePrompt,
public/control-center/pages/ai-command.js:5608:							lastCommand: output.sourcePrompt || "",
public/control-center/pages/ai-command.js:5610:							routeSuggestions: [{ route: destination, label: routeLabel(destination), reason: "Phase 2 preview destination" }],
public/control-center/pages/ai-command.js:5619:				navigateTo(destination);
public/control-center/pages/ai-command.js:5661:				aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5675:				rerender: () => aiCommandRoute.render(context)
public/control-center/pages/ai-command/tool-dock.js:3:  setSharedLibrarySourceBridge,
public/control-center/pages/ai-command/tool-dock.js:4:  getSharedAiSource,
public/control-center/pages/ai-command/tool-dock.js:5:  clearSharedAiSource,
public/control-center/pages/ai-command/tool-dock.js:6:  getSourceTypeMapping,
public/control-center/pages/ai-command/tool-dock.js:108:    applySharedAiSourceToDrawer(activeDrawer, projectName);
public/control-center/pages/ai-command/tool-dock.js:110:    const selectedSource = getSharedAiSource(projectName) || getSharedAiSource("__default__");
public/control-center/pages/ai-command/tool-dock.js:113:      msg.textContent = selectedSource?.name
public/control-center/pages/ai-command/tool-dock.js:114:        ? "Source added to drawer."
public/control-center/pages/ai-command/tool-dock.js:115:        : "Returned to drawer. No source selected.";
public/control-center/pages/ai-command/tool-dock.js:139:  sourceType = "",
public/control-center/pages/ai-command/tool-dock.js:152:    sourceType,
public/control-center/pages/ai-command/tool-dock.js:166:  sourceType = "",
public/control-center/pages/ai-command/tool-dock.js:178:    sourceType,
public/control-center/pages/ai-command/tool-dock.js:182:  // Also set library source bridge context if needed (existing logic)
public/control-center/pages/ai-command/tool-dock.js:186:function formatSharedAiSource(source = {}) {
public/control-center/pages/ai-command/tool-dock.js:187:  if (!source || !source.name) return null;
public/control-center/pages/ai-command/tool-dock.js:188:  const name = source.name || "(no name)";
public/control-center/pages/ai-command/tool-dock.js:189:  const type = source.asset_type || source.type || "asset";
public/control-center/pages/ai-command/tool-dock.js:190:  const path = source.file_path || source.filename || source.fileName || "";
public/control-center/pages/ai-command/tool-dock.js:194:export function getSelectedLibrarySource(projectName = "") {
public/control-center/pages/ai-command/tool-dock.js:195:  return getSharedAiSource(projectName) || getSharedAiSource("__default__");
public/control-center/pages/ai-command/tool-dock.js:204:function compactSourceReference(value = "", maxLength = 120) {
public/control-center/pages/ai-command/tool-dock.js:213:function buildSelectedSourceContextBlock(projectName = "") {
public/control-center/pages/ai-command/tool-dock.js:214:  const source = getSelectedLibrarySource(projectName);
public/control-center/pages/ai-command/tool-dock.js:215:  if (!source?.name) return "";
public/control-center/pages/ai-command/tool-dock.js:217:  const name = source.name || source.filename || source.fileName || "Selected Library source";
public/control-center/pages/ai-command/tool-dock.js:218:  const type = source.asset_type || source.type || source.source_type || "Library asset";
public/control-center/pages/ai-command/tool-dock.js:219:  const sourceId = source.asset_id || source.id || source.mutation_id || "";
public/control-center/pages/ai-command/tool-dock.js:220:  const path = source.file_path || source.path || source.filename || source.fileName || "";
public/control-center/pages/ai-command/tool-dock.js:221:  const preview = truncatePromptText(source.text_preview || source.preview || source.notes || "");
public/control-center/pages/ai-command/tool-dock.js:222:  const sourceOfTruth = typeof source.source_of_truth === "boolean"
public/control-center/pages/ai-command/tool-dock.js:223:    ? (source.source_of_truth ? "yes" : "no")
public/control-center/pages/ai-command/tool-dock.js:224:    : (source.source_of_truth || "");
public/control-center/pages/ai-command/tool-dock.js:227:    "Selected Library source context:",
public/control-center/pages/ai-command/tool-dock.js:228:    `- Source name: ${name}.`,
public/control-center/pages/ai-command/tool-dock.js:229:    `- Source type: ${type}.`
public/control-center/pages/ai-command/tool-dock.js:232:  if (sourceId) lines.push(`- Source id: ${compactSourceReference(sourceId, 80)}.`);
public/control-center/pages/ai-command/tool-dock.js:233:  if (path) lines.push(`- Source path: ${compactSourceReference(path, 120)}.`);
public/control-center/pages/ai-command/tool-dock.js:234:  if (sourceOfTruth) lines.push(`- Source-of-truth flag: ${sourceOfTruth}.`);
public/control-center/pages/ai-command/tool-dock.js:237:  lines.push("Use this Library source as trusted context. Do not add unsupported claims.");
public/control-center/pages/ai-command/tool-dock.js:241:function setDrawerSourceWarning(drawer, message = "") {
public/control-center/pages/ai-command/tool-dock.js:242:  const warning = drawer?.querySelector?.("[data-aicmd-tool-drawer-source-warning]");
public/control-center/pages/ai-command/tool-dock.js:249:function sourceMetadataNeedsLibrarySource(rawValue = "") {
public/control-center/pages/ai-command/tool-dock.js:250:  return /source_of_truth_assets|selected_asset|proof_doc|legal_doc|privacy_policy/i.test(String(rawValue || ""));
public/control-center/pages/ai-command/tool-dock.js:253:function isDrawerSourceRequired(drawer) {
public/control-center/pages/ai-command/tool-dock.js:254:  return drawer?.dataset?.sourceRequired === "true";
public/control-center/pages/ai-command/tool-dock.js:257:function validateDrawerSourceRequirement(drawer, projectName = "") {
public/control-center/pages/ai-command/tool-dock.js:258:  if (!isDrawerSourceRequired(drawer)) {
public/control-center/pages/ai-command/tool-dock.js:259:    setDrawerSourceWarning(drawer, "");
public/control-center/pages/ai-command/tool-dock.js:263:  const source = getSelectedLibrarySource(projectName);
public/control-center/pages/ai-command/tool-dock.js:264:  if (source?.name) {
public/control-center/pages/ai-command/tool-dock.js:265:    setDrawerSourceWarning(drawer, "");
public/control-center/pages/ai-command/tool-dock.js:269:  setDrawerSourceWarning(
public/control-center/pages/ai-command/tool-dock.js:271:    "This tool needs a source. Choose one from Library before continuing."
public/control-center/pages/ai-command/tool-dock.js:276:export function applySharedAiSourceToDrawer(drawer, projectName = "") {
public/control-center/pages/ai-command/tool-dock.js:278:  const source = getSelectedLibrarySource(projectName);
public/control-center/pages/ai-command/tool-dock.js:279:  const selectedNode = drawer.querySelector("[data-aicmd-tool-drawer-selected-source]");
public/control-center/pages/ai-command/tool-dock.js:280:  const sourceInput = drawer.querySelector("[data-aicmd-tool-drawer-source-details]");
public/control-center/pages/ai-command/tool-dock.js:281:  const sourceSelect = drawer.querySelector("[data-aicmd-tool-drawer-source-select]");
public/control-center/pages/ai-command/tool-dock.js:283:  if (!source || !source.name) {
public/control-center/pages/ai-command/tool-dock.js:285:      selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No AI source selected yet.</span>`;
public/control-center/pages/ai-command/tool-dock.js:287:    if (sourceInput && !sourceInput.value) {
public/control-center/pages/ai-command/tool-dock.js:288:      sourceInput.placeholder = "Optional: add usage notes, audience, angle, or claims to avoid...";
public/control-center/pages/ai-command/tool-dock.js:290:    validateDrawerSourceRequirement(drawer, projectName);
public/control-center/pages/ai-command/tool-dock.js:294:  // Render compact selected source card
public/control-center/pages/ai-command/tool-dock.js:295:  const { name, type, path } = formatSharedAiSource(source);
public/control-center/pages/ai-command/tool-dock.js:298:      <div class=\"mhos-tool-drawer-source-card\">
public/control-center/pages/ai-command/tool-dock.js:299:        <div class=\"mhos-tool-drawer-source-eyebrow\">AI Source</div>
public/control-center/pages/ai-command/tool-dock.js:300:        <div class=\"mhos-tool-drawer-source-main\">${escapeHtml(name)}</div>
public/control-center/pages/ai-command/tool-dock.js:301:        <div class=\"mhos-tool-drawer-source-meta\">${escapeHtml(type)} · Added from Library</div>
public/control-center/pages/ai-command/tool-dock.js:302:        ${path && path !== name ? `<div class=\"mhos-tool-drawer-source-path\" title=\"${escapeHtml(path)}\">${escapeHtml(path)}</div>` : ""}
public/control-center/pages/ai-command/tool-dock.js:303:        <div class=\"mhos-tool-drawer-source-actions\">
public/control-center/pages/ai-command/tool-dock.js:304:          <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-change-source>Change source</button>
public/control-center/pages/ai-command/tool-dock.js:305:          <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-remove-source>Remove source</button>
public/control-center/pages/ai-command/tool-dock.js:311:  // Set placeholder for Source Details if empty
public/control-center/pages/ai-command/tool-dock.js:312:  if (sourceInput && !sourceInput.value) {
public/control-center/pages/ai-command/tool-dock.js:313:    sourceInput.placeholder = "Optional: add usage notes, audience, angle, or claims to avoid...";
public/control-center/pages/ai-command/tool-dock.js:317:  if (sourceSelect) {
public/control-center/pages/ai-command/tool-dock.js:318:    const libraryOption = Array.from(sourceSelect.options || []).find((option) => {
public/control-center/pages/ai-command/tool-dock.js:320:      return /library|source|asset|brand|product/i.test(value);
public/control-center/pages/ai-command/tool-dock.js:322:    if (libraryOption) sourceSelect.value = libraryOption.value;
public/control-center/pages/ai-command/tool-dock.js:327:    const changeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-change-source]');
public/control-center/pages/ai-command/tool-dock.js:333:    const removeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-remove-source]');
public/control-center/pages/ai-command/tool-dock.js:336:        clearSharedAiSource(projectName || "__default__");
public/control-center/pages/ai-command/tool-dock.js:337:        clearSharedAiSource("__default__");
public/control-center/pages/ai-command/tool-dock.js:338:        if (selectedNode) selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No AI source selected yet.</span>`;
public/control-center/pages/ai-command/tool-dock.js:339:        if (sourceInput) sourceInput.placeholder = "Optional: add usage notes, audience, angle, or claims to avoid...";
public/control-center/pages/ai-command/tool-dock.js:340:        if (sourceSelect) sourceSelect.value = "";
public/control-center/pages/ai-command/tool-dock.js:341:        validateDrawerSourceRequirement(drawer, projectName);
public/control-center/pages/ai-command/tool-dock.js:346:  validateDrawerSourceRequirement(drawer, projectName);
public/control-center/pages/ai-command/tool-dock.js:348:const BASE_TOOL_DOCK_TOOLS = [
public/control-center/pages/ai-command/tool-dock.js:361:    template: "Translate or adapt the selected text for the project target market. Keep the explanation in the user's chat language and prepare only review-ready copy."
public/control-center/pages/ai-command/tool-dock.js:372:export const TOOL_DOCK_BY_SPECIALIST = {
public/control-center/pages/ai-command/tool-dock.js:383:      sourceTypes: ["current_chat", "campaign_notes", "market_notes", "audience_notes", "product_data", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:396:      sourceTypes: ["current_chat", "campaign_brief", "asset_requirements", "timeline_notes", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:398:      template: "Build a launch plan for {projectName}. Include timeline, required assets, owners, channels, readiness gaps, and safe next actions."
public/control-center/pages/ai-command/tool-dock.js:409:      sourceTypes: ["current_chat", "market_notes", "customer_notes", "insights_report", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:422:      sourceTypes: ["current_chat", "product_data", "pricing_notes", "proof_points", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:435:      sourceTypes: ["current_chat", "campaign_brief", "audience_notes", "content_inventory", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:448:      sourceTypes: ["current_chat", "operations_snapshot", "readiness_gaps", "campaign_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:464:      sourceTypes: ["current_chat", "library_folder", "brand_profile", "product_data", "legal_pricing_docs", "research_proof_docs", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:465:      outputTypes: ["company_profile", "product_copy", "email", "blog_article", "landing_page", "contract_draft", "presentation_outline", "speech", "faq", "proposal", "social_post", "ad_copy"],
public/control-center/pages/ai-command/tool-dock.js:466:      template: "Use the Content Writer to create a new written output for {projectName}. First ask or infer the output type: company profile, product copy, email, blog article, landing page, contract draft, presentation outline, speech, FAQ, proposal, social post, or ad copy. Ask for sources if needed. Keep it review-ready and do not publish or send anything."
public/control-center/pages/ai-command/tool-dock.js:477:      sourceTypes: ["composer_text", "selected_text", "last_response", "current_chat"],
public/control-center/pages/ai-command/tool-dock.js:490:      sourceTypes: ["composer_text", "selected_text", "current_chat"],
public/control-center/pages/ai-command/tool-dock.js:503:      sourceTypes: ["composer_text", "selected_text", "last_response", "current_chat"],
public/control-center/pages/ai-command/tool-dock.js:516:      sourceTypes: ["composer_text", "selected_text", "content_draft", "current_chat"],
public/control-center/pages/ai-command/tool-dock.js:521:      id: "sources",
public/control-center/pages/ai-command/tool-dock.js:523:      label: "Sources",
public/control-center/pages/ai-command/tool-dock.js:525:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:529:      sourceTypes: ["current_chat", "library_folder", "brand_profile", "product_data", "legal_pricing_docs", "research_proof_docs", "source_of_truth_assets", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:530:      outputTypes: ["source_bundle", "fact_extraction", "proof_summary", "context_brief"],
public/control-center/pages/ai-command/tool-dock.js:531:      template: "Prepare source context for the next Content Writer task for {projectName}. Ask which source should be used: current chat, Library folder, brand profile, product data, legal/pricing documents, research/proof documents, source-of-truth assets, or manual input."
public/control-center/pages/ai-command/tool-dock.js:542:      sourceTypes: ["topic", "market", "language", "audience", "current_chat", "library_folder"],
public/control-center/pages/ai-command/tool-dock.js:555:      sourceTypes: ["existing_content", "composer_text", "content_draft", "current_chat", "library_folder"],
public/control-center/pages/ai-command/tool-dock.js:556:      outputTypes: ["blog_to_social", "profile_to_pitch", "product_to_ad_copy", "transcript_to_article", "notes_to_presentation", "long_text_to_email_sequence"],
public/control-center/pages/ai-command/tool-dock.js:557:      template: "Repurpose existing content for {projectName}. Ask or infer the source format and target format: blog to posts, profile to pitch, product page to ad copy, transcript to article, notes to presentation outline, or long text to email sequence."
public/control-center/pages/ai-command/tool-dock.js:563:      badge: "Route",
public/control-center/pages/ai-command/tool-dock.js:564:      actionType: "route",
public/control-center/pages/ai-command/tool-dock.js:565:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:568:      sourceTypes: ["current_draft", "preview", "current_chat"],
public/control-center/pages/ai-command/tool-dock.js:570:      template: "Prepare safe routing for this Content Writer output for {projectName}. Ask the destination: Content Studio, Save to Library, Prepare Media Brief, Publishing package, Compliance review, Task, or Handoff. Do not route or execute before review."
public/control-center/pages/ai-command/tool-dock.js:583:      sourceTypes: ["current_chat", "campaign_brief", "brand_guidelines", "product_images", "reference_asset", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:585:      template: "Prepare a visual brief for {projectName}. Include concept, format, composition, colors, typography, visual mood, required assets, and CTA."
public/control-center/pages/ai-command/tool-dock.js:596:      sourceTypes: ["current_chat", "brand_guidelines", "reference_asset", "campaign_mood", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:609:      sourceTypes: ["current_chat", "visual_brief", "brand_guidelines", "product_data", "reference_asset", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:618:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:622:      sourceTypes: ["current_chat", "campaign_brief", "library_folder", "brand_assets", "product_images", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:635:      sourceTypes: ["current_chat", "content_draft", "visual_brief", "brand_guidelines", "reference_asset", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:644:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:648:      sourceTypes: ["current_chat", "brand_guidelines", "visual_brief", "selected_asset", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:664:      sourceTypes: ["current_chat", "campaign_brief", "content_draft", "product_data", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:665:      outputTypes: ["reel_script", "short_video_script", "hook_variants", "overlay_copy"],
public/control-center/pages/ai-command/tool-dock.js:677:      sourceTypes: ["current_chat", "script_draft", "visual_brief", "reference_asset", "product_images", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:690:      sourceTypes: ["current_chat", "storyboard", "visual_brief", "product_data", "production_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:692:      template: "Create a shot list for {projectName}. Include product shots, lifestyle shots, closeups, transitions, and required props."
public/control-center/pages/ai-command/tool-dock.js:703:      sourceTypes: ["current_chat", "script_draft", "campaign_brief", "brand_voice", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:716:      sourceTypes: ["current_chat", "campaign_brief", "offer_data", "video_script", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:732:      sourceTypes: ["content_draft", "media_asset", "publishing_package", "approval_notes", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:734:      template: "Review publishing readiness for {projectName}. Check copy, assets, channel fit, schedule, approvals, and missing items. Do not publish."
public/control-center/pages/ai-command/tool-dock.js:745:      sourceTypes: ["content_draft", "media_asset", "campaign_brief", "channel_notes", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:755:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:758:      sourceTypes: ["publishing_package", "campaign_timeline", "channel_notes", "approval_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:771:      sourceTypes: ["content_draft", "topic", "market", "channel_notes", "seo_brief", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:780:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:781:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:784:      sourceTypes: ["final_copy", "media_asset", "approval_notes", "claim_review", "publishing_package", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:786:      template: "Prepare an approval package for {projectName}. Include final copy summary, risk notes, assets checklist, and required confirmations."
public/control-center/pages/ai-command/tool-dock.js:800:      sourceTypes: ["campaign_brief", "audience_notes", "offer_data", "proof_points", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:805:      id: "ad-copy",
public/control-center/pages/ai-command/tool-dock.js:807:      label: "Ad Copy",
public/control-center/pages/ai-command/tool-dock.js:813:      sourceTypes: ["ad_angle", "campaign_brief", "landing_page_copy", "product_data", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:814:      outputTypes: ["ad_copy", "headline_variants", "primary_text_variants", "cta_variants"],
public/control-center/pages/ai-command/tool-dock.js:815:      template: "Draft paid ad copy variants for {projectName}. Include primary text, headline, CTA, and angle notes."
public/control-center/pages/ai-command/tool-dock.js:826:      sourceTypes: ["audience_notes", "insights_report", "campaign_brief", "customer_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:839:      sourceTypes: ["creative_assets", "campaign_brief", "ad_copy", "performance_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:848:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:852:      sourceTypes: ["ad_copy", "landing_page_copy", "offer_data", "proof_points", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:868:      sourceTypes: ["topic", "market", "language", "audience", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:877:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:881:      sourceTypes: ["insights_data", "analytics_summary", "performance_notes", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:894:      sourceTypes: ["topic", "market", "audience", "seo_brief", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:903:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:907:      sourceTypes: ["analytics_summary", "performance_notes", "campaign_results", "content_inventory", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:920:      sourceTypes: ["content_inventory", "seo_brief", "audience_notes", "competitor_notes", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:932:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:936:      sourceTypes: ["content_draft", "claim_list", "proof_doc", "product_data", "legal_doc", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:944:      badge: "Copy",
public/control-center/pages/ai-command/tool-dock.js:949:      sourceTypes: ["content_draft", "claims_check", "legal_doc", "proof_doc", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:950:      outputTypes: ["safe_rewrite", "risk_reduced_copy", "claim_softening", "review_notes"],
public/control-center/pages/ai-command/tool-dock.js:958:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:962:      sourceTypes: ["content_draft", "claim_list", "product_data", "legal_doc", "research_proof_docs", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:963:      outputTypes: ["evidence_needed", "required_proof", "recommended_proof", "optional_proof"],
public/control-center/pages/ai-command/tool-dock.js:964:      template: "List the evidence needed before this content can be approved or published. Separate required, recommended, and optional proof."
public/control-center/pages/ai-command/tool-dock.js:971:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:975:      sourceTypes: ["workflow_draft", "privacy_policy", "tracking_plan", "data_use_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:984:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:985:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:988:      sourceTypes: ["final_copy", "claims_check", "approval_context", "asset_checklist", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:990:      template: "Prepare approval notes for {projectName}. Include risks, required reviewer, unresolved issues, and safe next actions."
public/control-center/pages/ai-command/tool-dock.js:1004:      sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1014:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:1017:      sourceTypes: ["current_chat", "handoff_summary", "operations_snapshot", "approval_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1025:      badge: "Route",
public/control-center/pages/ai-command/tool-dock.js:1027:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:1030:      sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "publishing_package", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1031:      outputTypes: ["handoff_summary", "destination_brief", "required_inputs", "review_notes"],
public/control-center/pages/ai-command/tool-dock.js:1032:      template: "Prepare a handoff summary for {projectName}. Include context, destination workspace, owner, required inputs, and review notes."
public/control-center/pages/ai-command/tool-dock.js:1043:      sourceTypes: ["current_chat", "project_plan", "campaign_timeline", "dependency_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1056:      sourceTypes: ["current_chat", "readiness_gaps", "asset_requirements", "approval_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1058:      template: "Create an execution checklist for {projectName}. Include required approvals, assets, content, integrations, and QA steps."
public/control-center/pages/ai-command/tool-dock.js:1069:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:1072:      sourceTypes: ["customer_thread", "support_notes", "policy_doc", "faq_source", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1082:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:1085:      sourceTypes: ["customer_thread", "support_notes", "order_case_summary", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1098:      sourceTypes: ["customer_thread", "sla_policy", "support_notes", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1111:      sourceTypes: ["customer_thread", "support_notes", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1127:      sourceTypes: ["lead_context", "sales_notes", "product_data", "offer_data", "proof_points", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1129:      template: "Create a sales pitch for {projectName}. Include value proposition, customer pain, proof, offer, CTA, and follow-up note."
public/control-center/pages/ai-command/tool-dock.js:1132:      id: "follow-up",
public/control-center/pages/ai-command/tool-dock.js:1134:      label: "Follow-up",
public/control-center/pages/ai-command/tool-dock.js:1137:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:1140:      sourceTypes: ["lead_context", "meeting_notes", "sales_notes", "offer_data", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1141:      outputTypes: ["follow_up_email", "follow_up_sequence", "value_reminder", "next_step_prompt"],
public/control-center/pages/ai-command/tool-dock.js:1142:      template: "Draft a sales follow-up for {projectName}. Include context, value reminder, question, CTA, and next step."
public/control-center/pages/ai-command/tool-dock.js:1153:      sourceTypes: ["lead_context", "sales_notes", "product_data", "proof_points", "objection_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1163:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:1166:      sourceTypes: ["lead_context", "crm_profile_summary", "sales_notes", "customer_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1174:  return TOOL_DOCK_BY_SPECIALIST[specialistId] || TOOL_DOCK_BY_SPECIALIST.operations;
public/control-center/pages/ai-command/tool-dock.js:1180:      ...TOOL_DOCK_BY_SPECIALIST.strategist.slice(0, 2),
public/control-center/pages/ai-command/tool-dock.js:1181:      ...TOOL_DOCK_BY_SPECIALIST.writer.slice(0, 2),
public/control-center/pages/ai-command/tool-dock.js:1182:      ...TOOL_DOCK_BY_SPECIALIST.operations.slice(0, 2)
public/control-center/pages/ai-command/tool-dock.js:1192:      ...TOOL_DOCK_BY_SPECIALIST.strategist.slice(0, 2),
public/control-center/pages/ai-command/tool-dock.js:1193:      ...TOOL_DOCK_BY_SPECIALIST.writer.slice(0, 2),
public/control-center/pages/ai-command/tool-dock.js:1194:      ...TOOL_DOCK_BY_SPECIALIST.operations.slice(0, 2)
public/control-center/pages/ai-command/tool-dock.js:1221:  return Object.values(TOOL_DOCK_BY_SPECIALIST)
public/control-center/pages/ai-command/tool-dock.js:1233:  const actionType = tool.requiresSelectedSource && !tool.actionType ? "source_required" : (tool.actionType || tool.action || "guided");
public/control-center/pages/ai-command/tool-dock.js:1243:    "data-aicmd-tool-dock-destinations": joinMetaList(getToolMetaList(tool, "destinations", tool.route ? [tool.route] : ["chat-preview"])),
public/control-center/pages/ai-command/tool-dock.js:1244:    "data-aicmd-tool-dock-sources": joinMetaList(getToolMetaList(tool, "sourceTypes", ["current_chat", "library_source", "manual_input"])),
public/control-center/pages/ai-command/tool-dock.js:1272:          Choose the output, source, and destination before preparing a review-only composer prompt.
public/control-center/pages/ai-command/tool-dock.js:1282:            <span class="mhos-tool-drawer-section-label">2. Source / input</span>
public/control-center/pages/ai-command/tool-dock.js:1283:            <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-source-select></select>
public/control-center/pages/ai-command/tool-dock.js:1284:            <div class="mhos-tool-drawer-selected-source" data-aicmd-tool-drawer-selected-source></div>
public/control-center/pages/ai-command/tool-dock.js:1285:            <div class="mhos-tool-drawer-warning" data-aicmd-tool-drawer-source-warning role="alert" hidden></div>
public/control-center/pages/ai-command/tool-dock.js:1319:              <span>Source details</span>
public/control-center/pages/ai-command/tool-dock.js:1322:                data-aicmd-tool-drawer-source-details
public/control-center/pages/ai-command/tool-dock.js:1347:          <p data-aicmd-tool-drawer-summary>Choose output, source, destination, language, and tone.</p>
public/control-center/pages/ai-command/tool-dock.js:1351:          Preparation-only: this drawer creates a composer-ready instruction. It does not publish, send, route, create CRM records, run workflows, or mutate backend data.
public/control-center/pages/ai-command/tool-dock.js:1355:          <button class="btn btn-secondary" type="button" data-aicmd-tool-drawer-open-library>Change source</button>
public/control-center/pages/ai-command/tool-dock.js:1382:        <span class="mhos-tool-dock-copy">Guided setup · output, source, destination, then use in composer</span>
public/control-center/pages/ai-command/tool-dock.js:1397:            data-aicmd-tool-dock-sources="${safe(joinMetaList(getToolMetaList(tool, "sourceTypes", ["current_chat"])))}"
public/control-center/pages/ai-command/tool-dock.js:1502:    "- Do not invent certifications, claims, ingredients, prices, guarantees, or statistics without source evidence."
public/control-center/pages/ai-command/tool-dock.js:1510:  const source = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-source-select]", "Current chat or ask if source is needed");
public/control-center/pages/ai-command/tool-dock.js:1514:  const sourceDetails = getDrawerFieldValue(drawer, "[data-aicmd-tool-drawer-source-details]");
public/control-center/pages/ai-command/tool-dock.js:1517:  const sourceInstruction = sourceDetails
public/control-center/pages/ai-command/tool-dock.js:1518:    ? `${source}. Source details: ${sourceDetails}.`
public/control-center/pages/ai-command/tool-dock.js:1519:    : `${source}. If the selected source is not available in the current context, ask me to choose, paste, upload, or open the relevant source before producing final content.`;
public/control-center/pages/ai-command/tool-dock.js:1520:  const selectedSourceContext = buildSelectedSourceContextBlock(projectName);
public/control-center/pages/ai-command/tool-dock.js:1528:    `- Source/input: ${sourceInstruction}`,
public/control-center/pages/ai-command/tool-dock.js:1538:  if (selectedSourceContext) {
public/control-center/pages/ai-command/tool-dock.js:1539:    lines.push("", selectedSourceContext);
public/control-center/pages/ai-command/tool-dock.js:1550:    "Use only the available context and selected source details.",
public/control-center/pages/ai-command/tool-dock.js:1551:    "If required facts are missing, ask concise follow-up questions before writing the final version.",
public/control-center/pages/ai-command/tool-dock.js:1568:    `Prepare the output for ${destination}, but do not send, save, route, publish, or create records automatically.`,
public/control-center/pages/ai-command/tool-dock.js:1572:    "- Do not publish, send, route, save, overwrite, create CRM records, or run workflows.",
public/control-center/pages/ai-command/tool-dock.js:1585:  const source = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-source-select]", "Auto");
public/control-center/pages/ai-command/tool-dock.js:1589:  const sourceDetails = getDrawerFieldValue(drawer, "[data-aicmd-tool-drawer-source-details]");
public/control-center/pages/ai-command/tool-dock.js:1593:  if (source !== "Auto" && source !== "Current chat or ask if source is needed") summaryParts.push("Library source selected");
public/control-center/pages/ai-command/tool-dock.js:1633:    `Prepare ${btn.getAttribute("data-aicmd-tool-dock-label") || "this tool"} for the active project. Choose the output, source, destination, language, and tone before using it in the composer.`
public/control-center/pages/ai-command/tool-dock.js:1639:    || btn.getAttribute("data-tool-id")
public/control-center/pages/ai-command/tool-dock.js:1643:  const hardSourceDefaults = ["current_chat", "market_notes", "customer_notes", "library_source", "manual_input"];
public/control-center/pages/ai-command/tool-dock.js:1648:  const rawSources = joinMetaList(getToolMetaList(tool, "sourceTypes", []))
public/control-center/pages/ai-command/tool-dock.js:1649:    || btn.getAttribute("data-aicmd-tool-dock-sources")
public/control-center/pages/ai-command/tool-dock.js:1650:    || joinMetaList(hardSourceDefaults);
public/control-center/pages/ai-command/tool-dock.js:1654:  drawer.dataset.sourceRequired = actionType === "source_required" || sourceMetadataNeedsLibrarySource(rawSources) ? "true" : "false";
public/control-center/pages/ai-command/tool-dock.js:1658:  populateDrawerSelect(drawer.querySelector("[data-aicmd-tool-drawer-source-select]"), rawSources, "Choose source / input");
public/control-center/pages/ai-command/tool-dock.js:1664:      validateDrawerSourceRequirement(drawer, projectName);
public/control-center/pages/ai-command/tool-dock.js:1668:      validateDrawerSourceRequirement(drawer, projectName);
public/control-center/pages/ai-command/tool-dock.js:1671:  applySharedAiSourceToDrawer(drawer, projectName);
public/control-center/pages/ai-command/tool-dock.js:1673:  validateDrawerSourceRequirement(drawer, projectName);
public/control-center/pages/ai-command/tool-dock.js:1732:      // Library Source Bridge workflow
public/control-center/pages/ai-command/tool-dock.js:1734:      const drawerSourceSelect = root.querySelector("[data-aicmd-tool-drawer-source-select]");
public/control-center/pages/ai-command/tool-dock.js:1735:      const selectedSourceType = drawerSourceSelect?.value || "auto";
public/control-center/pages/ai-command/tool-dock.js:1736:      const mapping = getSourceTypeMapping(selectedSourceType);
public/control-center/pages/ai-command/tool-dock.js:1745:        sourceType: selectedSourceType,
public/control-center/pages/ai-command/tool-dock.js:1750:        type: "library_source_selection",
public/control-center/pages/ai-command/tool-dock.js:1753:        sourceType: selectedSourceType,
public/control-center/pages/ai-command/tool-dock.js:1759:      setSharedLibrarySourceBridge(project, payload);
public/control-center/pages/ai-command/tool-dock.js:1760:      setSharedLibrarySourceBridge("__default__", payload);
public/control-center/pages/ai-command/tool-dock.js:1764:      updateStatus?.("Library guide opened. Select an asset, click Use as Source in AI Command, then return to AI Command.");
public/control-center/pages/ai-command/tool-dock.js:1771:  // Patch drawer population to apply source
public/control-center/pages/ai-command/tool-dock.js:1773:    applySharedAiSourceToDrawer(drawer, projectName);
public/control-center/pages/ai-command/tool-dock.js:1782:      if (!validateDrawerSourceRequirement(drawer, projectName)) {
public/control-center/pages/ai-command/tool-dock.js:1783:        updateStatus?.("This tool needs a source. Choose one from Library before continuing.");
