# T16 — AI Command Exact Action Path Audit

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/ai-command.js

## Purpose
T15 showed many authority and execution signals. T16 verifies exact action paths:
- preview actions stay drafts/guidance
- route actions only navigate
- sensitive commands create gated plans, not direct execution
- AI guidance/chat APIs are used as response surfaces, not protected action executors
- copy defects are identified separately from runtime safety

## Exact Findings
| Area | First Line | Count |
|---|---:|---:|
| Quick tools / action definitions | 429 | 60 |
| Auto plan builder | 620 | 1 |
| Sensitive command classifier | n/a | 0 |
| AI guidance API bridge | 27 | 6 |
| Safety instructions | 1212 | 2 |
| Confirmation requirement output | 1392 | 22 |
| Command submit handler | 511 | 114 |
| Route-only actions | 445 | 15 |
| Preview-only actions | 429 | 57 |
| Copy defects | n/a | 0 |


## Evidence Zones

### Quick tools / action definitions

```js
  359: 	{ label: "Map the next launch wave", sub: "Strategist to Publisher to Operations" },
  360: 	{ label: "Prepare a full handoff sequence", sub: "Strategy, creative, compliance, publishing, ops" },
  361: 	{ label: "Review customer and sales impact", sub: "Customer Ops, Sales / CRM, Operations" }
  362: ];
  363: 
  364: const PHASE35_WORKSPACE_TABS = ["chat", "preview", "tools", "context", "history"];
  365: 
  366: const AI_ROOM_FLOW_STEPS = [
  367: 	{ id: "ask", title: "Ask", description: "Choose a specialist or the full team." },
  368: 	{ id: "draft", title: "Prepare", description: "Create guidance, copy, task, or handoff context." },
  369: 	{ id: "review", title: "Review", description: "Check safety, scope, language, and source." },
  370: 	{ id: "route", title: "Handoff", description: "Open the owning workspace with draft context." },
  371: 	{ id: "execute", title: "Confirm", description: "Execution stays gated in backend-owned surfaces." },
  372: 	{ id: "monitor", title: "Monitor", description: "Track readiness, integrations, and recent activity." }
  373: ];
  374: 
  375: const AI_ROOM_OUTPUT_TABS = [
  376: 	{ id: "draft", label: "Draft", helper: "Latest draft or guidance preview" },
  377: 	{ id: "task", label: "Task", helper: "Task-shaped output" },
  378: 	{ id: "workflow", label: "Workflow Preview", helper: "Operating sequence" },
  379: 	{ id: "handoff", label: "Handoff Preview", helper: "Destination package" },
  380: 	{ id: "export", label: "Export", helper: "File-ready package" }
  381: ];
  382: 
  383: const AI_ROOM_TEAM_CHAIN = ["Strategist", "Writer", "Media / Video", "Compliance", "Publisher", "Operations"];
  384: const AI_ROOM_BUSINESS_BRANCH = ["Customer Ops", "Sales / CRM", "Operations"];
  385: 
  386: const AI_ROOM_ROLE_INITIALS = {
  387: 	strategist: "ST",
  388: 	writer: "CW",
  389: 	media: "MD",
  390: 	video_lead: "VL",
  391: 	publisher: "PB",
  392: 	ads: "AO",
  393: 	analyst: "SI",
  394: 	compliance_reviewer: "CR",
  395: 	operations: "OL",
  396: 	customer_ops: "CO",
  397: 	sales_crm: "SC"
  398: };
  399: 
  400: const AI_ROOM_BACKEND_ROLE_ALIASES = {
  401: 	ads: "ads_operator",
  402: 	media: "designer",
  403: 	compliance_reviewer: "compliance_reviewer"
  404: };
  405: 
  406: const AI_ROOM_PLANNED_SPECIALISTS = [
  407: 	{
  408: 		label: "Admin / Governance",
  409: 		initials: "AG",
  410: 		status: "Planned",
  411: 		summary: "Policy, approvals, roles, and audit controls stay destination-owned."
  412: 	},
  413: 	{
  414: 		label: "Researcher",
  415: 		initials: "RS",
  416: 		status: "Planned",
  417: 		summary: "Market, evidence, competitor, and proof research will prepare source packs only."
  418: 	},
  419: 	{
  420: 		label: "Automation Architect",
  421: 		initials: "AA",
  422: 		status: "Planned",
  423: 		summary: "Workflow blueprints and trigger maps will route to Workflows before execution."
  424: 	}
  425: ];
  426: 
  427: const PHASE35_SPECIALIST_TOOLS = {
  428: 	strategist: [
  429: 		{ id: "campaign-angle-generator", label: "Campaign Angle Generator", action: "preview", intent: "guidance", template: "Generate campaign angles for {project}. Include audience tension, promise, channel fit, and strongest first test." },
  430: 		{ id: "launch-plan", label: "Launch Plan", action: "preview", intent: "workflow", template: "Build a launch plan for {project}. Include phases, channels, owners, blockers, and next move." },
  431: 		{ id: "funnel-mapping", label: "Funnel Mapping", action: "preview", intent: "guidance", template: "Map the funnel for {project}. Include awareness, consideration, conversion, retention, and handoff points." },
  432: 		{ id: "prioritize-next-move", label: "Priority Sort", action: "preview", intent: "task", template: "Prioritize the next moves for {project}. Rank by impact, urgency, dependencies, and safest first action." }
  433: 	],
  434: 	writer: [
  435: 		{ id: "hook-generator", label: "Hook Generator", action: "preview", intent: "guidance", template: "Write 5 German hook variants for {project}. Keep them concise, testable, and suitable for the Germany market." },
  436: 		{ id: "caption-builder", label: "Caption Builder", action: "preview", intent: "guidance", template: "Draft German captions for {project}. Include angle, body, CTA, and platform adaptation notes." },
  437: 		{ id: "cta-refiner", label: "CTA Refiner", action: "preview", intent: "task", template: "Refine CTA options for {project}. Provide German variants for awareness, consideration, and action stages." },
  438: 		{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }
  439: 	],
  440: 	media: [
  441: 		{ id: "creative-brief-builder", label: "Creative Brief Builder", action: "preview", intent: "media", template: "Prepare a creative brief for {project}. Include concept, visual rules, subject, brand constraints, and production notes." },
  442: 		{ id: "format-mapper", label: "Format Mapper", action: "preview", intent: "guidance", template: "Map required creative formats for {project}. Include platform, aspect ratio, asset type, and usage context." },
  443: 		{ id: "asset-checklist", label: "Asset Checklist", action: "preview", intent: "task", template: "Create an asset checklist for {project}. List must-have files, missing references, usage context, and priority." },
  444: 		{ id: "visual-direction", label: "Visual Direction", action: "preview", intent: "guidance", template: "Review visual direction for {project}. Identify mismatches, improvements, and required references." },
  445: 		{ id: "open-media-studio", label: "Send prompt to Media Studio", action: "route", route: "media-studio" }
  446: 	],
  447: 	video_lead: [
  448: 		{ id: "write-video-hook", label: "Write video hook", action: "preview", intent: "guidance", template: "Write short-form video hooks for {project}. Include 3 opening variants and audience fit." },
  449: 		{ id: "draft-script", label: "Draft script", action: "preview", intent: "guidance", template: "Draft a short-form video script for {project}. Include hook, body, CTA, and visual cues." },
  450: 		{ id: "build-storyboard", label: "Build storyboard", action: "preview", intent: "workflow", template: "Build storyboard beats for {project}. Sequence shots and key transitions." },
  451: 		{ id: "prepare-voiceover", label: "Prepare voiceover", action: "preview", intent: "guidance", template: "Prepare voiceover script options for {project}. Keep clean timing and emphasis notes." },
  452: 		{ id: "map-video-asset-needs", label: "Map video asset needs", action: "preview", intent: "task", template: "Map video asset needs for {project}. Include format, source, and production owner." }
  453: 	],
  454: 	publisher: [
  455: 		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
  456: 		{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },
  457: 		{ id: "channel-formatting", label: "Channel Formatting", action: "preview", intent: "guidance", template: "Format the next output for {project} by channel. Include German copy, limits, CTA, and scheduling notes." },
  458: 		{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },
  459: 		{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }
  460: 	],
  461: 	ads: [
  462: 		{ id: "ad-angle-generator", label: "Ad Angle Generator", action: "preview", intent: "guidance", template: "Draft ad angles for {project}. Include audience problem, value promise, German hook direction, and platform fit." },
  463: 		{ id: "copy-variants", label: "Copy Variants", action: "preview", intent: "guidance", template: "Prepare German ad copy variants for {project}. Include hooks, primary text, CTA, and creative notes." },
  464: 		{ id: "test-ideas", label: "Test Ideas", action: "preview", intent: "task", template: "Suggest paid test ideas for {project}. Provide hypotheses, segments, creative variables, and measurement notes." },
  465: 		{ id: "budget-notes", label: "Budget Notes", action: "preview", intent: "guidance", template: "Review budget notes for {project}. Summarize constraints and safe test allocation guidance." },
  466: 		{ id: "open-ads-manager", label: "Open Ads Manager", action: "route", route: "ads-manager" }
  467: 	],
  468: 	analyst: [
  469: 		{ id: "keyword-intent", label: "Keyword Intent", action: "preview", intent: "guidance", template: "Suggest keyword intent opportunities for {project}. Include Germany-market intent, content mapping, and priority." },
  470: 		{ id: "meta-direction", label: "Meta Direction", action: "preview", intent: "guidance", template: "Prepare meta direction for {project}. Include page angle, title direction, description direction, and CTA intent." },
  471: 		{ id: "opportunity-summary", label: "Opportunity Summary", action: "preview", intent: "task", template: "Summarize SEO and insight opportunities for {project}. Focus on conversion, traffic quality, and content fit." },
  472: 		{ id: "analysis-plan", label: "Analysis Plan", action: "preview", intent: "workflow", template: "Draft an analysis plan for {project}. Define questions, datasets, cadence, and owners." },
  473: 		{ id: "open-insights", label: "Open Insights", action: "route", route: "insights" }
  474: 	],
  475: 	compliance_reviewer: [
  476: 		{ id: "claims-check", label: "Claims Check", action: "preview", intent: "guidance", template: "Review marketing claims for {project}. Flag unsupported, high-risk, or evidence-dependent wording." },
  477: 		{ id: "approval-flags", label: "Approval Flags", action: "preview", intent: "task", template: "Check approval risks for {project}. List risk, impact, mitigation, and required owner." },
  478: 		{ id: "safety-checklist", label: "Safety Checklist", action: "preview", intent: "handoff", template: "Prepare a safety checklist for {project}. Include policy checks, evidence required, and approval notes." },
  479: 		{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },
  480: 		{ id: "open-governance", label: "Open Governance", action: "route", route: "governance" }
  481: 	],
  482: 	operations: [
  483: 		{ id: "timeline-draft", label: "Timeline Draft", action: "preview", intent: "workflow", template: "Draft an execution timeline for {project}. Include milestones, owners, dependencies, and review gates." },
  484: 		{ id: "handoff-routing", label: "Handoff Routing", action: "preview", intent: "handoff", template: "Prepare handoff routing for {project}. Include source, destination, decision gates, and required confirmations." },
  485: 		{ id: "checklist", label: "Checklist", action: "preview", intent: "task", template: "Draft an operational checklist for {project}. Include owners, dependencies, priority, and first action." },
  486: 		{ id: "blocker-review", label: "Blocker Review", action: "preview", intent: "guidance", template: "Review operational blockers for {project}. Prioritize by risk and impact." },
  487: 		{ id: "open-workflows", label: "Open Workflows / Operations", action: "route", route: "workflows" }
  488: 	],
  489: 	customer_ops: [
  490: 		{ id: "review-unified-inbox", label: "Review Unified Inbox", action: "preview", intent: "guidance", template: "Review the Unified Inbox readiness for {project}. Summarize visible customer-operation signals, open gaps, and safe next review steps. Do not claim inbox actions happened." },
  491: 		{ id: "summarize-customer-thread", label: "Summarize Customer Thread", action: "preview", intent: "guidance", template: "Summarize this customer thread for {project}. Include customer issue, sentiment, reply goal, missing details, and safe next step." },
  492: 		{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },
  493: 		{ id: "create-ticket-draft", label: "Create Ticket Draft", action: "preview", intent: "task", template: "Create a ticket draft for {project}. Include issue, priority, owner suggestion, evidence needed, and next safe action." },
  494: 		{ id: "check-sla-risk", label: "Check SLA Risk", action: "preview", intent: "guidance", template: "Check SLA risk for {project}. Flag urgency, risk level, missing runtime data, and escalation recommendation for review." },
  495: 		{ id: "prepare-escalation", label: "Prepare Escalation", action: "preview", intent: "handoff", template: "Prepare an escalation draft for {project}. Include reason, customer impact, owner, confirmation needed, and destination team." },
  496: 		{ id: "customer-profile-snapshot", label: "Customer Profile Snapshot", action: "preview", intent: "guidance", template: "Prepare a customer profile snapshot for {project}. Include known context, purchase/support signals, missing fields, and safe follow-up questions." },
  497: 		{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
  498: 	],
  499: 	sales_crm: [
```

### Auto plan builder

```js
  550: 	{
  551: 		id: "strategist",
  552: 		name: "Strategist",
  553: 		purpose: "Build high-leverage decisions for launch sequencing and channel focus.",
  554: 		bestUse: "When priorities compete and you need the best next move.",
  555: 		suggestedPrompt: "Act as Strategist and propose the next campaign move based on current readiness and integrations."
  556: 	},
  557: 	{
  558: 		id: "writer",
  559: 		name: "Writer",
  560: 		purpose: "Transform strategy into high-converting copy and scripts.",
  561: 		bestUse: "When campaigns need content batches fast.",
  562: 		suggestedPrompt: "Act as Writer and generate content angles for the current project and active campaign."
  563: 	},
  564: 	{
  565: 		id: "designer",
  566: 		name: "Designer",
  567: 		purpose: "Define creative direction, visual hierarchy, and asset guidance.",
  568: 		bestUse: "When briefs need clear visual standards.",
  569: 		suggestedPrompt: "Act as Designer and propose creative directions tied to current campaign goals."
  570: 	},
  571: 	{
  572: 		id: "media",
  573: 		name: "Media Planner",
  574: 		purpose: "Align media formats with channels, cadence, and readiness.",
  575: 		bestUse: "When planning image/video requirements across channels.",
  576: 		suggestedPrompt: "Act as Media Planner and map media needs by platform for this launch cycle."
  577: 	},
  578: 	{
  579: 		id: "ads",
  580: 		name: "Ads Specialist",
  581: 		purpose: "Optimize paid opportunities, creative testing, and budget decisions.",
  582: 		bestUse: "When preparing or fixing paid performance.",
  583: 		suggestedPrompt: "Act as Ads Specialist and propose paid experiments based on current readiness and data coverage."
  584: 	},
  585: 	{
  586: 		id: "analyst",
  587: 		name: "Analyst",
  588: 		purpose: "Turn multi-channel signals into prioritized actions.",
  589: 		bestUse: "When you need evidence-backed recommendations.",
  590: 		suggestedPrompt: "Act as Analyst and summarize what is working, what is weak, and what to do next."
  591: 	},
  592: 	{
  593: 		id: "researcher",
  594: 		name: "Researcher",
  595: 		purpose: "Strengthen decisions with market, competitor, and audience insight.",
  596: 		bestUse: "When strategy needs stronger external evidence.",
  597: 		suggestedPrompt: "Act as Researcher and identify high-confidence market opportunities for this project."
  598: 	},
  599: 	{
  600: 		id: "operations",
  601: 		name: "Operations Assistant",
  602: 		purpose: "Translate intent into executable workflows and handoffs.",
  603: 		bestUse: "When actions span multiple pages and teams.",
  604: 		suggestedPrompt: "Act as Operations Assistant and convert priorities into a practical execution sequence."
  605: 	}
  606: ];
  607: 
  608: const aiSessions = new Map();
  609: const AI_COMMAND_CHAT_SESSIONS_KEY = "mh_ai_command_chat_sessions_v1";
  610: const aiInboundHandoffObjectIds = typeof WeakMap !== "undefined" ? new WeakMap() : null;
  611: let aiInboundHandoffCounter = 0;
  612: let lastRenderContext = null;
  613: let aiCommandBridgeRegistered = false;
  614: let aiAutoModeUnsubscribe = null;
  615: const aiAutomationState = {
  616: 	progress: "",
  617: 	result: ""
  618: };
  619: 
  620: function buildAutoPlanFromCommand(commandText, session) {
  621: 	function getSpecialistById(id) {
  622: 		const resolvedId = MODE_ID_ALIASES[id] || id;
  623: 		return SPECIALIST_DEFS.find((s) => s.id === resolvedId) ||
  624: 			SPECIALIST_DEFS.find((s) => s.id === "operations") ||
  625: 			SPECIALIST_DEFS[0];
  626: 	}
  627: 
  628: 	function detectSpecialistFromBridgePrompt(prompt) {
  629: 		const text = asString(prompt);
  630: 		if (/act as the strategist/i.test(text)) return "strategist";
  631: 		if (/act as the content writer/i.test(text)) return "writer";
  632: 		if (/act as the media director/i.test(text)) return "media";
  633: 		if (/act as the video lead/i.test(text)) return "video_lead";
  634: 		if (/act as the publisher/i.test(text)) return "publisher";
  635: 		if (/act as the ads optimizer|act as the ads operator/i.test(text)) return "ads";
  636: 		if (/act as the seo|act as the insights analyst/i.test(text)) return "analyst";
  637: 		if (/act as the compliance reviewer/i.test(text)) return "compliance_reviewer";
  638: 		if (/act as the operations lead/i.test(text)) return "operations";
  639: 		if (/act as the customer operations lead|act as customer ops/i.test(text)) return "customer_ops";
  640: 		if (/act as the sales|act as the crm|sales \/ crm lead/i.test(text)) return "sales_crm";
  641: 		// Fallback: use keyword scoring from existing classifyIntent
  642: 		const classified = classifyIntent(text, null);
  643: 		if (classified.resolvedModeId && classified.resolvedModeId !== "operations") {
  644: 			return classified.resolvedModeId;
  645: 		}
  646: 		return null;
  647: 	}
  648: 
  649: 	const command = humanizeValue(commandText || session?.draftMessage, "Prepare workflow action from AI command.");
  650: 	const plan = [
  651: 		{
  652: 			id: `auto-generate-${Date.now()}`,
  653: 			type: "generate_prompt",
  654: 			targetPage: "ai-command",
  655: 			action: "Generate prompt from AI command",
  656: 			payload: {
  657: 				prompt: command,
  658: 				title: "AI command auto plan"
  659: 			},
  660: 			priority: "recommended"
  661: 		},
  662: 		{
  663: 			id: `auto-workflow-${Date.now()}`,
  664: 			type: "prepare_workflow",
  665: 			targetPage: "workflows",
  666: 			action: "Prepare workflow from AI command",
  667: 			payload: {
  668: 				prompt: command,
  669: 				reason: "AI command prepared for workflow execution."
  670: 			},
  671: 			priority: "recommended"
  672: 		}
  673: 	];
  674: 
  675: 	if (/publish\s*now|send\s*external|paid\s*ads|final\s*approval/i.test(command)) {
  676: 		plan.push({
  677: 			id: `auto-gated-${Date.now()}`,
  678: 			type: "publish_now",
  679: 			targetPage: "publishing",
  680: 			action: "Publish now to external channels",
  681: 			payload: {
  682: 				prompt: command,
  683: 				reason: "Requires approval gate before external publishing actions."
  684: 			},
  685: 			priority: "critical"
  686: 		});
  687: 	}
  688: 
  689: 	return plan;
  690: }
```

### Sensitive command classifier

```js
_No match found._
```

### AI guidance API bridge

```js
    1: import {
    2:         bindAiToolDock,
    3:         getAiToolDockTools,
    4:         getSelectedLibrarySource,
    5:         openAiToolDrawerFromMetadata,
    6:         renderAiToolDrawerShell
    7: } from "./ai-command/tool-dock.js";
    8: import { getProjectedActiveRole, getProjectedTeamMembers } from "../runtime/authority/authority-projection.js";
    9: 
   10: import {
   11:         selectCurrentProject,
   12:         selectOperationsSnapshot,
   13:         selectProjectPayload
   14: } from "../state.js";
   15: 
   16: import {
   17:         getSharedHandoff,
   18:         setSharedAiDraft,
   19:         setSharedHandoff
   20: } from "../shared-context.js";
   21: 
   22: import {
   23:         getCategoryReadinessList
   24: } from "../asset-library.js";
   25: 
   26: import {
   27:         executeProjectAiChat,
   28:         executeProjectAiGuidance
   29: } from "../api.js";
   30: 
   31: //  AI TEAM DEFINITIONS
   32: // ============================================================
   33: 
   34: const MODE_DEFS = [
   35:         {
   36:                 id: "strategist",
   37:                 label: "Strategist",
   38:                 icon: "🎯",
   39:                 summary: "Campaign concepts, launch plans, channel mix, and offer strategy.",
   40:                 routeHint: "campaign-studio"
   41:         },
   42:         {
   43:                 id: "writer",
   44:                 label: "Content Writer",
   45:                 icon: "✍️",
   46:                 summary: "Captions, hooks, scripts, emails, and landing page copy.",
   47:                 routeHint: "content-studio"
   48:         },
   49:         {
   50:                 id: "media",
   51:                 label: "Media Director",
   52:                 icon: "🎨",
   53:                 summary: "Visual direction, creative brief, format guidance, and brand consistency.",
   54:                 routeHint: "media-studio"
   55:         },
   56:         {
   57:                 id: "video_lead",
   58:                 label: "Video Lead",
   59:                 icon: "🎬",
   60:                 summary: "Short-form video scripts, motion direction, and reel strategy.",
   61:                 routeHint: "media-studio"
   62:         },
   63:         {
   64:                 id: "publisher",
   65:                 label: "Publisher",
   66:                 icon: "📤",
   67:                 summary: "Publishing readiness, schedule review, and handoff preparation.",
   68:                 routeHint: "publishing"
   69:         },
   70:         {
   71:                 id: "ads",
   72:                 label: "Ads Optimizer",
   73:                 icon: "📣",
   74:                 summary: "Ad concepts, targeting angles, platform copy, and paid strategy.",
   75:                 routeHint: "ads-manager"
   76:         },
   77:         {
   78:                 id: "analyst",
   79:                 label: "SEO & Insights Analyst",
   80:                 icon: "📊",
   81:                 summary: "SEO signals, performance data, content insights, and traffic patterns.",
   82:                 routeHint: "insights"
   83:         },
   84:         {
   85:                 id: "compliance_reviewer",
   86:                 label: "Compliance Reviewer",
   87:                 icon: "🛡️",
   88:                 summary: "Claims review, approvals, safety language, and governance checks.",
   89:                 routeHint: "governance"
   90:         },
   91:         {
   92:                 id: "operations",
   93:                 label: "Operations Lead",
   94:                 icon: "⚙️",
   95:                 summary: "Tasks, timelines, handoffs, approvals, and execution plans.",
   96:                 routeHint: "workflows"
   97:         },
```

### Safety instructions

```js
 1142:         };
 1143: 
 1144:         const nextSessions = [record, ...sessions.filter((item) => asString(item.id) !== sessionId)].slice(0, 20);
 1145:         map[key] = nextSessions;
 1146:         writeAiChatSessionsMap(map);
 1147: 
 1148:         session.activeChatSessionId = sessionId;
 1149:         session.activeChatSessionCreatedAt = record.createdAt;
 1150:         session.chatSessions = nextSessions;
 1151:         return record;
 1152: }
 1153: 
 1154: function loadAiChatSessionIntoState(projectName, session, sessionId) {
 1155:         const record = getAiChatSessions(projectName).find((item) => asString(item.id) === asString(sessionId));
 1156:         if (!record) return null;
 1157: 
 1158:         session.modeId = asString(record.modeId || session.modeId || "operations");
 1159:         session.teamMode = asString(record.teamMode || "solo");
 1160:         session.messages = asArray(record.messages).slice(-40);
 1161:         session.responseHistory = asArray(record.responses).slice(0, 12);
 1162:         session.outputPreview = asObject(record.preview);
 1163:         session.outputWorkspaceTab = outputTabFromPreview(session.outputPreview);
 1164:         session.activeOutputTab = session.outputWorkspaceTab;
 1165:         session.draftMessage = "";
 1166:         session.composerText = "";
 1167:         session.responseError = "";
 1168:         session.responseLoading = false;
 1169:         session.activeChatSessionId = asString(record.id);
 1170:         session.activeChatSessionCreatedAt = asString(record.createdAt || record.updatedAt || nowIso());
 1171:         session.bridgeContext = null;
 1172:         session.chatSessions = getAiChatSessions(projectName);
 1173:         return record;
 1174: }
 1175: 
 1176: function refreshAiChatSessions(projectName, session) {
 1177:         session.chatSessions = getAiChatSessions(projectName);
 1178:         return session.chatSessions;
 1179: }
 1180: 
 1181: 
 1182: function buildSpecialistChatPrompt({ prompt, specialistLabel, modeLabel, projectName, language, outputLanguage, market }) {
 1183: 	const cleanPrompt = asString(prompt).trim();
 1184: 	const safeProject = asString(projectName || "current project").trim();
 1185: 	const safeSpecialist = asString(specialistLabel || "Specialist").trim();
 1186: 	const safeMode = asString(modeLabel || "Solo Specialist").trim();
 1187: 	const safeLanguage = asString(language || "user language").trim();
 1188: 	const safeOutputLanguage = asString(outputLanguage || "German").trim();
 1189: 	const safeMarket = asString(market || "Germany").trim();
 1190: 	const teamWorkflowLines = safeMode === "Full Team"
 1191: 		? [
 1192: 			"Full Team workflow: Strategist -> Writer -> Media/Video -> Compliance -> Publisher -> Operations.",
 1193: 			"When the request touches inbox, tickets, leads, outreach, or CRM, include Customer Ops -> Sales/CRM -> Operations.",
 1194: 			"Name the specialist owner for each next action and destination."
 1195: 		]
 1196: 		: [];
 1197: 
 1198: 	return [
 1199: 		`Role: ${safeSpecialist}`,
 1200: 		`Project: ${safeProject}`,
 1201: 		`Mode: ${safeMode}`,
 1202: 		`User conversation language: ${safeLanguage}`,
 1203: 		`Publishable output language: ${safeOutputLanguage}`,
 1204: 		`Target market: ${safeMarket}`,
 1205:                 "Reply to the user in the same language as the latest user request.",
 1206:                 "If the user writes Arabic, reply in Arabic. If the user writes English, reply in English. If the user writes German, reply in German.",
 1207:                 `Use ${safeOutputLanguage} only for customer-facing or publishable copy such as captions, ads, emails, landing pages, final campaign text, or publishing packages.`,
 1208:                 "When you include publishable copy, label it clearly as publishable content and keep the explanation in the user chat language.",
 1209: 		...teamWorkflowLines,
 1210: 		"Return practical guidance and content only.",
 1211: 		`When drafting publishable copy, write it in ${safeOutputLanguage}.`,
 1212: 		"Never claim actions were executed.",
 1213: 		"Never claim publish, approval, deletion, archival, sync, or operational runs happened.",
 1214: 		"Deliver a structured, review-ready answer.",
 1215: 		"",
 1216: 		"User request:",
 1217: 		cleanPrompt
 1218: 	].join("\n");
 1219: }
 1220: 
 1221: function extractGeneratedResponseText(response = {}) {
 1222: 	const direct = humanizeValue(
 1223: 		response.chat_answer ||
 1224: 		response.response_text ||
 1225: 		response.content ||
 1226: 		response.summary ||
 1227: 		response.analysis ||
 1228: 		response.title
 1229: 	);
 1230: 	if (direct) return direct;
 1231: 
 1232: 	const bullets = normalizeDisplayList(response.bullets, 6)
 1233: 		.map((item) => `- ${item}`)
 1234: 		.join("\n");
 1235: 
 1236: 	if (bullets) return bullets;
 1237: 
 1238: 	const recommendationLine = normalizeDisplayList(response.recommendations, 4)
 1239: 		.map((item, index) => `${index + 1}. ${item}`)
 1240: 		.join("\n");
 1241: 
 1242: 	const findingLine = normalizeDisplayList(response.findings, 4)
 1243: 		.map((item) => `- ${item}`)
 1244: 		.join("\n");
 1245: 
 1246: 	const sectionLine = asArray(response.sections)
 1247: 		.map((section) => {
 1248: 			const title = humanizeValue(section?.title);
 1249: 			const items = normalizeDisplayList(section?.items, 4);
 1250: 			if (!items.length) return "";
 1251: 			return [title ? `${title}:` : "", ...items.map((item) => `- ${item}`)].filter(Boolean).join("\n");
 1252: 		})
 1253: 		.filter(Boolean)
 1254: 		.join("\n\n");
 1255: 
 1256: 	return [recommendationLine, findingLine, sectionLine].filter(Boolean).join("\n\n");
 1257: }
 1258: 
 1259: function destinationRouteForSpecialist(specialistId, outputType) {
 1260: 	const rawId = getAiRoomRoleId(specialistId || "operations");
 1261: 	const id = MODE_ID_ALIASES[rawId] || rawId;
 1262: 	if (outputType === "workflow") return "workflows";
 1263: 	if (id === "strategist") return outputType === "task" ? "campaign-studio" : "workflows";
 1264: 	if (id === "writer") return "content-studio";
 1265: 	if (id === "media") return "media-studio";
 1266: 	if (id === "video_lead") return "media-studio";
 1267: 	if (id === "publisher") return "publishing";
 1268: 	if (id === "ads") return "ads-manager";
 1269: 	if (id === "analyst") return "insights";
 1270: 	if (id === "compliance_reviewer") return "governance";
 1271: 	if (id === "operations") return outputType === "task" ? "task-center" : "workflows";
 1272: 	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
 1273: 	if (id === "sales_crm") return "workflows";
 1274: 	return "workflows";
 1275: }
 1276: 
 1277: 
 1278: function resolveAiResponseOutputRoute(session, response = {}) {
 1279:         const activeTab = getOutputWorkspaceTab(session);
 1280:         const specialistId = getAiRoomRoleId(session?.modeId || "operations");
 1281:         const explicitDestination = asString(response.destinationRoute || "").trim();
 1282: 
```

### Confirmation requirement output

```js
 1322:         if (/content|copy|draft|caption|email|blog|article|script/.test(outputType) || looksContentLike) {
 1323:                 outputType = "content";
 1324:                 return { outputType, destinationRoute: explicitDestination || "content-studio" };
 1325:         }
 1326: 
 1327:         if (/media|video|visual|asset|creative/.test(outputType) || looksMediaLike) {
 1328:                 outputType = "media";
 1329:                 return { outputType, destinationRoute: explicitDestination || "media-studio" };
 1330:         }
 1331: 
 1332:         if (/publishing|publish|schedule/.test(outputType) || looksPublishingLike) {
 1333:                 outputType = "publishing";
 1334:                 return { outputType, destinationRoute: explicitDestination || "publishing" };
 1335:         }
 1336: 
 1337:         if (/governance|compliance|risk|approval/.test(outputType) || looksGovernanceLike) {
 1338:                 outputType = "governance";
 1339:                 return { outputType, destinationRoute: explicitDestination || "governance" };
 1340:         }
 1341: 
 1342:         if (/insight|research|seo|analytics/.test(outputType) || looksInsightLike) {
 1343:                 outputType = "insight";
 1344:                 return { outputType, destinationRoute: explicitDestination || "insights" };
 1345:         }
 1346: 
 1347:         if (/campaign|strategy|launch/.test(outputType) || looksCampaignLike) {
 1348:                 outputType = "campaign";
 1349:                 return {
 1350:                         outputType,
 1351:                         destinationRoute: explicitDestination || (session?.teamMode === "team" ? "workflows" : "campaign-studio")
 1352:                 };
 1353:         }
 1354: 
 1355:         const destinationRoute = explicitDestination || destinationRouteForSpecialist(session?.modeId || "operations", outputType);
 1356:         return { outputType, destinationRoute };
 1357: }
 1358: 
 1359: 
 1360: function routeLabel(route) {
 1361: 	const labels = {
 1362: 		"campaign-studio": "Campaign Studio",
 1363: 		"content-studio": "Content Studio",
 1364: 		"media-studio": "Media Studio",
 1365: 		publishing: "Publishing",
 1366: 		"ads-manager": "Ads Manager",
 1367: 		insights: "Insights",
 1368: 		integrations: "Integrations",
 1369: 		governance: "Governance",
 1370: 		"operations-centers": "Operations Centers",
 1371: 		"task-center": "Task Center",
 1372: 		setup: "Setup",
 1373: 		workflows: "Workflows"
 1374: 	};
 1375: 	return labels[route] || titleCase(route);
 1376: }
 1377: 
 1378: function specialistTemplateForOutput({ specialist, outputType, prompt, projectName }) {
 1379: 	const cleanPrompt = asString(prompt).trim();
 1380: 	const promptSnippet = cleanPrompt || `Project request for ${projectName || "current project"}`;
 1381: 	const specialistId = asString(specialist?.id || "operations");
 1382: 	const route = destinationRouteForSpecialist(specialistId, outputType);
 1383: 
 1384: 	const base = {
 1385: 		specialistId,
 1386: 		outputType,
 1387: 		title: "Draft output",
 1388: 		summary: "Guidance prepared for review.",
 1389: 		bullets: [],
 1390: 		steps: [],
 1391: 		destinationRoute: route,
 1392: 		confirmationRequired: outputType === "handoff" || specialistId === "publisher" || specialistId === "compliance_reviewer",
 1393: 		generatedAt: nowIso(),
 1394: 		sourcePrompt: promptSnippet,
 1395: 		status: "draft_preview",
 1396: 		safetyLabel: "Guidance and draft only. No backend execution.",
 1397: 		nextSafeAction: `Review in ${routeLabel(route)}`,
 1398: 		confirmationNote: "Execution, approvals, and publishing require explicit confirmation in the owning workspace."
 1399: 	};
 1400: 
 1401: 	if (specialistId === "strategist") {
 1402: 		if (outputType === "task") {
 1403: 			return {
 1404: 				...base,
 1405: 				title: `Task: Strategic plan for ${projectName || "current project"}`,
 1406: 				summary: "Strategic task draft prepared with priorities, blockers, and operating sequence.",
 1407: 				steps: [
 1408: 					"Define top 3 strategic priorities for this cycle",
 1409: 					"List blockers and dependency owners",
 1410: 					"Map next operating move by channel",
 1411: 					"Route execution draft to Campaign Studio or Workflows"
 1412: 				],
 1413: 				nextSafeAction: "Review and refine the task draft before creating durable tasks"
 1414: 			};
 1415: 		}
 1416: 		return {
 1417: 			...base,
 1418: 			title: `Strategist Guidance: Next operating move`,
 1419: 			summary: `Priority guidance prepared from: ${promptSnippet}`,
 1420: 			bullets: [
 1421: 				"Strategic priorities aligned to current readiness",
 1422: 				"Key blockers and risk dependencies identified",
 1423: 				"Next operating move drafted with destination routing"
 1424: 			]
 1425: 		};
 1426: 	}
 1427: 
 1428: 	if (specialistId === "writer") {
 1429: 		return {
 1430: 			...base,
 1431: 			title: outputType === "task" ? "Task: Draft campaign copy" : "Content Guidance: Messaging draft",
 1432: 			summary: "Content draft prepared with hooks, captions, CTA flow, and review checkpoint.",
 1433: 			hooks: [
 1434: 				`Problem-aware hook direction for ${projectName || "this project"}`,
 1435: 				"Outcome-led hook direction for a German publishing draft",
 1436: 				"Proof-led hook direction with claims marked for review"
 1437: 			],
 1438: 			captions: [
 1439: 				"Caption opens with the audience problem, then moves into the practical value promise.",
 1440: 				"German caption version should keep the CTA direct and easy to approve."
 1441: 			],
 1442: 			ctas: [
 1443: 				"Jetzt mehr erfahren",
 1444: 				"Mehr Details ansehen",
 1445: 				"Zum Angebot"
 1446: 			],
 1447: 			notes: [
 1448: 				"Use Arabic freely in the conversation; publishable copy should be reviewed in German.",
 1449: 				"Claims, health, or performance promises need evidence before publishing."
 1450: 			],
 1451: 			nextStep: "Send this package to Content Studio or Publisher after review.",
 1452: 			steps: [
 1453: 				"Draft 3 hook variants",
 1454: 				"Draft captions with CTA",
 1455: 				"Prepare review notes and claims check",
 1456: 				"Route to Content Studio for refinement"
 1457: 			],
 1458: 			safetyLabel: "Claims require review before publishing. No direct publish action."
 1459: 		};
 1460: 	}
 1461: 
 1462: 	if (specialistId === "media") {
```

### Command submit handler

```js
  441: 		{ id: "creative-brief-builder", label: "Creative Brief Builder", action: "preview", intent: "media", template: "Prepare a creative brief for {project}. Include concept, visual rules, subject, brand constraints, and production notes." },
  442: 		{ id: "format-mapper", label: "Format Mapper", action: "preview", intent: "guidance", template: "Map required creative formats for {project}. Include platform, aspect ratio, asset type, and usage context." },
  443: 		{ id: "asset-checklist", label: "Asset Checklist", action: "preview", intent: "task", template: "Create an asset checklist for {project}. List must-have files, missing references, usage context, and priority." },
  444: 		{ id: "visual-direction", label: "Visual Direction", action: "preview", intent: "guidance", template: "Review visual direction for {project}. Identify mismatches, improvements, and required references." },
  445: 		{ id: "open-media-studio", label: "Send prompt to Media Studio", action: "route", route: "media-studio" }
  446: 	],
  447: 	video_lead: [
  448: 		{ id: "write-video-hook", label: "Write video hook", action: "preview", intent: "guidance", template: "Write short-form video hooks for {project}. Include 3 opening variants and audience fit." },
  449: 		{ id: "draft-script", label: "Draft script", action: "preview", intent: "guidance", template: "Draft a short-form video script for {project}. Include hook, body, CTA, and visual cues." },
  450: 		{ id: "build-storyboard", label: "Build storyboard", action: "preview", intent: "workflow", template: "Build storyboard beats for {project}. Sequence shots and key transitions." },
  451: 		{ id: "prepare-voiceover", label: "Prepare voiceover", action: "preview", intent: "guidance", template: "Prepare voiceover script options for {project}. Keep clean timing and emphasis notes." },
  452: 		{ id: "map-video-asset-needs", label: "Map video asset needs", action: "preview", intent: "task", template: "Map video asset needs for {project}. Include format, source, and production owner." }
  453: 	],
  454: 	publisher: [
  455: 		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
  456: 		{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },
  457: 		{ id: "channel-formatting", label: "Channel Formatting", action: "preview", intent: "guidance", template: "Format the next output for {project} by channel. Include German copy, limits, CTA, and scheduling notes." },
  458: 		{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },
  459: 		{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }
  460: 	],
  461: 	ads: [
  462: 		{ id: "ad-angle-generator", label: "Ad Angle Generator", action: "preview", intent: "guidance", template: "Draft ad angles for {project}. Include audience problem, value promise, German hook direction, and platform fit." },
  463: 		{ id: "copy-variants", label: "Copy Variants", action: "preview", intent: "guidance", template: "Prepare German ad copy variants for {project}. Include hooks, primary text, CTA, and creative notes." },
  464: 		{ id: "test-ideas", label: "Test Ideas", action: "preview", intent: "task", template: "Suggest paid test ideas for {project}. Provide hypotheses, segments, creative variables, and measurement notes." },
  465: 		{ id: "budget-notes", label: "Budget Notes", action: "preview", intent: "guidance", template: "Review budget notes for {project}. Summarize constraints and safe test allocation guidance." },
  466: 		{ id: "open-ads-manager", label: "Open Ads Manager", action: "route", route: "ads-manager" }
  467: 	],
  468: 	analyst: [
  469: 		{ id: "keyword-intent", label: "Keyword Intent", action: "preview", intent: "guidance", template: "Suggest keyword intent opportunities for {project}. Include Germany-market intent, content mapping, and priority." },
  470: 		{ id: "meta-direction", label: "Meta Direction", action: "preview", intent: "guidance", template: "Prepare meta direction for {project}. Include page angle, title direction, description direction, and CTA intent." },
  471: 		{ id: "opportunity-summary", label: "Opportunity Summary", action: "preview", intent: "task", template: "Summarize SEO and insight opportunities for {project}. Focus on conversion, traffic quality, and content fit." },
  472: 		{ id: "analysis-plan", label: "Analysis Plan", action: "preview", intent: "workflow", template: "Draft an analysis plan for {project}. Define questions, datasets, cadence, and owners." },
  473: 		{ id: "open-insights", label: "Open Insights", action: "route", route: "insights" }
  474: 	],
  475: 	compliance_reviewer: [
  476: 		{ id: "claims-check", label: "Claims Check", action: "preview", intent: "guidance", template: "Review marketing claims for {project}. Flag unsupported, high-risk, or evidence-dependent wording." },
  477: 		{ id: "approval-flags", label: "Approval Flags", action: "preview", intent: "task", template: "Check approval risks for {project}. List risk, impact, mitigation, and required owner." },
  478: 		{ id: "safety-checklist", label: "Safety Checklist", action: "preview", intent: "handoff", template: "Prepare a safety checklist for {project}. Include policy checks, evidence required, and approval notes." },
  479: 		{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },
  480: 		{ id: "open-governance", label: "Open Governance", action: "route", route: "governance" }
  481: 	],
  482: 	operations: [
  483: 		{ id: "timeline-draft", label: "Timeline Draft", action: "preview", intent: "workflow", template: "Draft an execution timeline for {project}. Include milestones, owners, dependencies, and review gates." },
  484: 		{ id: "handoff-routing", label: "Handoff Routing", action: "preview", intent: "handoff", template: "Prepare handoff routing for {project}. Include source, destination, decision gates, and required confirmations." },
  485: 		{ id: "checklist", label: "Checklist", action: "preview", intent: "task", template: "Draft an operational checklist for {project}. Include owners, dependencies, priority, and first action." },
  486: 		{ id: "blocker-review", label: "Blocker Review", action: "preview", intent: "guidance", template: "Review operational blockers for {project}. Prioritize by risk and impact." },
  487: 		{ id: "open-workflows", label: "Open Workflows / Operations", action: "route", route: "workflows" }
  488: 	],
  489: 	customer_ops: [
  490: 		{ id: "review-unified-inbox", label: "Review Unified Inbox", action: "preview", intent: "guidance", template: "Review the Unified Inbox readiness for {project}. Summarize visible customer-operation signals, open gaps, and safe next review steps. Do not claim inbox actions happened." },
  491: 		{ id: "summarize-customer-thread", label: "Summarize Customer Thread", action: "preview", intent: "guidance", template: "Summarize this customer thread for {project}. Include customer issue, sentiment, reply goal, missing details, and safe next step." },
  492: 		{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },
  493: 		{ id: "create-ticket-draft", label: "Create Ticket Draft", action: "preview", intent: "task", template: "Create a ticket draft for {project}. Include issue, priority, owner suggestion, evidence needed, and next safe action." },
  494: 		{ id: "check-sla-risk", label: "Check SLA Risk", action: "preview", intent: "guidance", template: "Check SLA risk for {project}. Flag urgency, risk level, missing runtime data, and escalation recommendation for review." },
  495: 		{ id: "prepare-escalation", label: "Prepare Escalation", action: "preview", intent: "handoff", template: "Prepare an escalation draft for {project}. Include reason, customer impact, owner, confirmation needed, and destination team." },
  496: 		{ id: "customer-profile-snapshot", label: "Customer Profile Snapshot", action: "preview", intent: "guidance", template: "Prepare a customer profile snapshot for {project}. Include known context, purchase/support signals, missing fields, and safe follow-up questions." },
  497: 		{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
  498: 	],
  499: 	sales_crm: [
  500: 		{ id: "lead-qualification", label: "Lead Qualification", action: "preview", intent: "guidance", template: "Qualify the lead for {project}. Include fit, intent, urgency, missing CRM fields, and the safest next step." },
  501: 		{ id: "outreach-draft", label: "Outreach Draft", action: "preview", intent: "guidance", template: "Draft outreach for {project}. Include subject or opener, personalized message, CTA, and review notes before sending." },
  502: 		{ id: "follow-up-sequence", label: "Follow-up Sequence", action: "preview", intent: "workflow", template: "Build a follow-up sequence for {project}. Include timing, message angle, CTA, stop condition, and confirmation requirements." },
  503: 		{ id: "crm-profile-summary", label: "CRM Profile Summary", action: "preview", intent: "guidance", template: "Summarize the CRM profile context for {project}. Include fit, history, open questions, and next sales action without mutating CRM data." },
  504: 		{ id: "pipeline-next-step", label: "Pipeline Next Step", action: "preview", intent: "task", template: "Recommend the pipeline next step for {project}. Include stage, rationale, owner, risk, and required confirmation." },
  505: 		{ id: "dealer-salon-outreach", label: "Dealer / Salon Outreach", action: "preview", intent: "guidance", template: "Draft dealer or salon outreach for {project}. Include positioning, proof needs, offer angle, CTA, and follow-up note." },
  506: 		{ id: "influencer-lead-plan", label: "Influencer Lead Plan", action: "preview", intent: "workflow", template: "Prepare an influencer lead plan for {project}. Include target profile, outreach angle, qualification criteria, and handoff path." },
  507: 		{ id: "sales-handoff-draft", label: "Sales Handoff", action: "preview", intent: "handoff", template: "Prepare a sales handoff draft for {project}. Include lead context, recommended next action, owner, and confirmation needed." }
  508: 	]
  509: };
  510: 
  511: // 4 quick-action prompts shown in the composer
  512: const QUICK_ACTIONS = [
  513: 	{ icon: "🚀", label: "Launch Campaign", sub: "Build a campaign plan", template: "Build a launch campaign for {project}. Map the channels, offer, phases, and required assets." },
  514: 	{ icon: "✍️", label: "Generate Content", sub: "Write hooks, captions & scripts", template: "Generate content for {project}. Create hooks, caption ideas, and a reel script for the next product push." },
  515: 	{ icon: "📊", label: "Analyze Performance", sub: "Review what's working", template: "Analyze current performance for {project}. What content, campaigns, and channels are working best right now?" },
  516: 	{ icon: "🔧", label: "Fix Readiness", sub: "Close critical gaps", template: "What are the critical readiness gaps for {project} and what exactly needs to be done to fix them?" }
  517: ];
  518: 
  519: const AI_COMMAND_LOCAL_DRAFTS_KEY = "mh-ai-command-local-drafts-v1";
  520: const AI_COMMAND_LOCAL_OUTPUTS_KEY = "mh-ai-command-local-outputs-v1";
  521: 
  522: const COMMAND_TYPES = [
  523: 	{ id: "strategy", label: "Strategy" },
  524: 	{ id: "content", label: "Content" },
  525: 	{ id: "campaign", label: "Campaign" },
  526: 	{ id: "integration", label: "Integration" },
  527: 	{ id: "asset", label: "Asset" },
  528: 	{ id: "research", label: "Research" },
  529: 	{ id: "report", label: "Report" },
  530: 	{ id: "automation", label: "Automation" }
  531: ];
  532: 
  533: const TARGET_TYPES = [
  534: 	{ id: "current-project", label: "Current project" },
  535: 	{ id: "selected-context", label: "Selected page/context" },
  536: 	{ id: "campaign", label: "Campaign" },
  537: 	{ id: "product", label: "Product" }
  538: ];
  539: 
  540: const IMPACT_CHIP_LABELS = [
  541: 	"Launch readiness",
  542: 	"Content",
  543: 	"Campaign",
  544: 	"Integrations",
  545: 	"Assets",
  546: 	"Automation"
  547: ];
  548: 
  549: const AGENT_CARDS = [
  550: 	{
  551: 		id: "strategist",
  552: 		name: "Strategist",
  553: 		purpose: "Build high-leverage decisions for launch sequencing and channel focus.",
  554: 		bestUse: "When priorities compete and you need the best next move.",
  555: 		suggestedPrompt: "Act as Strategist and propose the next campaign move based on current readiness and integrations."
  556: 	},
  557: 	{
  558: 		id: "writer",
  559: 		name: "Writer",
  560: 		purpose: "Transform strategy into high-converting copy and scripts.",
  561: 		bestUse: "When campaigns need content batches fast.",
  562: 		suggestedPrompt: "Act as Writer and generate content angles for the current project and active campaign."
  563: 	},
  564: 	{
  565: 		id: "designer",
  566: 		name: "Designer",
  567: 		purpose: "Define creative direction, visual hierarchy, and asset guidance.",
  568: 		bestUse: "When briefs need clear visual standards.",
  569: 		suggestedPrompt: "Act as Designer and propose creative directions tied to current campaign goals."
  570: 	},
  571: 	{
  572: 		id: "media",
  573: 		name: "Media Planner",
  574: 		purpose: "Align media formats with channels, cadence, and readiness.",
  575: 		bestUse: "When planning image/video requirements across channels.",
  576: 		suggestedPrompt: "Act as Media Planner and map media needs by platform for this launch cycle."
  577: 	},
  578: 	{
  579: 		id: "ads",
  580: 		name: "Ads Specialist",
  581: 		purpose: "Optimize paid opportunities, creative testing, and budget decisions.",
```

### Route-only actions

```js
  375: const AI_ROOM_OUTPUT_TABS = [
  376: 	{ id: "draft", label: "Draft", helper: "Latest draft or guidance preview" },
  377: 	{ id: "task", label: "Task", helper: "Task-shaped output" },
  378: 	{ id: "workflow", label: "Workflow Preview", helper: "Operating sequence" },
  379: 	{ id: "handoff", label: "Handoff Preview", helper: "Destination package" },
  380: 	{ id: "export", label: "Export", helper: "File-ready package" }
  381: ];
  382: 
  383: const AI_ROOM_TEAM_CHAIN = ["Strategist", "Writer", "Media / Video", "Compliance", "Publisher", "Operations"];
  384: const AI_ROOM_BUSINESS_BRANCH = ["Customer Ops", "Sales / CRM", "Operations"];
  385: 
  386: const AI_ROOM_ROLE_INITIALS = {
  387: 	strategist: "ST",
  388: 	writer: "CW",
  389: 	media: "MD",
  390: 	video_lead: "VL",
  391: 	publisher: "PB",
  392: 	ads: "AO",
  393: 	analyst: "SI",
  394: 	compliance_reviewer: "CR",
  395: 	operations: "OL",
  396: 	customer_ops: "CO",
  397: 	sales_crm: "SC"
  398: };
  399: 
  400: const AI_ROOM_BACKEND_ROLE_ALIASES = {
  401: 	ads: "ads_operator",
  402: 	media: "designer",
  403: 	compliance_reviewer: "compliance_reviewer"
  404: };
  405: 
  406: const AI_ROOM_PLANNED_SPECIALISTS = [
  407: 	{
  408: 		label: "Admin / Governance",
  409: 		initials: "AG",
  410: 		status: "Planned",
  411: 		summary: "Policy, approvals, roles, and audit controls stay destination-owned."
  412: 	},
  413: 	{
  414: 		label: "Researcher",
  415: 		initials: "RS",
  416: 		status: "Planned",
  417: 		summary: "Market, evidence, competitor, and proof research will prepare source packs only."
  418: 	},
  419: 	{
  420: 		label: "Automation Architect",
  421: 		initials: "AA",
  422: 		status: "Planned",
  423: 		summary: "Workflow blueprints and trigger maps will route to Workflows before execution."
  424: 	}
  425: ];
  426: 
  427: const PHASE35_SPECIALIST_TOOLS = {
  428: 	strategist: [
  429: 		{ id: "campaign-angle-generator", label: "Campaign Angle Generator", action: "preview", intent: "guidance", template: "Generate campaign angles for {project}. Include audience tension, promise, channel fit, and strongest first test." },
  430: 		{ id: "launch-plan", label: "Launch Plan", action: "preview", intent: "workflow", template: "Build a launch plan for {project}. Include phases, channels, owners, blockers, and next move." },
  431: 		{ id: "funnel-mapping", label: "Funnel Mapping", action: "preview", intent: "guidance", template: "Map the funnel for {project}. Include awareness, consideration, conversion, retention, and handoff points." },
  432: 		{ id: "prioritize-next-move", label: "Priority Sort", action: "preview", intent: "task", template: "Prioritize the next moves for {project}. Rank by impact, urgency, dependencies, and safest first action." }
  433: 	],
  434: 	writer: [
  435: 		{ id: "hook-generator", label: "Hook Generator", action: "preview", intent: "guidance", template: "Write 5 German hook variants for {project}. Keep them concise, testable, and suitable for the Germany market." },
  436: 		{ id: "caption-builder", label: "Caption Builder", action: "preview", intent: "guidance", template: "Draft German captions for {project}. Include angle, body, CTA, and platform adaptation notes." },
  437: 		{ id: "cta-refiner", label: "CTA Refiner", action: "preview", intent: "task", template: "Refine CTA options for {project}. Provide German variants for awareness, consideration, and action stages." },
  438: 		{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }
  439: 	],
  440: 	media: [
  441: 		{ id: "creative-brief-builder", label: "Creative Brief Builder", action: "preview", intent: "media", template: "Prepare a creative brief for {project}. Include concept, visual rules, subject, brand constraints, and production notes." },
  442: 		{ id: "format-mapper", label: "Format Mapper", action: "preview", intent: "guidance", template: "Map required creative formats for {project}. Include platform, aspect ratio, asset type, and usage context." },
  443: 		{ id: "asset-checklist", label: "Asset Checklist", action: "preview", intent: "task", template: "Create an asset checklist for {project}. List must-have files, missing references, usage context, and priority." },
  444: 		{ id: "visual-direction", label: "Visual Direction", action: "preview", intent: "guidance", template: "Review visual direction for {project}. Identify mismatches, improvements, and required references." },
  445: 		{ id: "open-media-studio", label: "Send prompt to Media Studio", action: "route", route: "media-studio" }
  446: 	],
  447: 	video_lead: [
  448: 		{ id: "write-video-hook", label: "Write video hook", action: "preview", intent: "guidance", template: "Write short-form video hooks for {project}. Include 3 opening variants and audience fit." },
  449: 		{ id: "draft-script", label: "Draft script", action: "preview", intent: "guidance", template: "Draft a short-form video script for {project}. Include hook, body, CTA, and visual cues." },
  450: 		{ id: "build-storyboard", label: "Build storyboard", action: "preview", intent: "workflow", template: "Build storyboard beats for {project}. Sequence shots and key transitions." },
  451: 		{ id: "prepare-voiceover", label: "Prepare voiceover", action: "preview", intent: "guidance", template: "Prepare voiceover script options for {project}. Keep clean timing and emphasis notes." },
  452: 		{ id: "map-video-asset-needs", label: "Map video asset needs", action: "preview", intent: "task", template: "Map video asset needs for {project}. Include format, source, and production owner." }
  453: 	],
  454: 	publisher: [
  455: 		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
  456: 		{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },
  457: 		{ id: "channel-formatting", label: "Channel Formatting", action: "preview", intent: "guidance", template: "Format the next output for {project} by channel. Include German copy, limits, CTA, and scheduling notes." },
  458: 		{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },
  459: 		{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }
  460: 	],
  461: 	ads: [
  462: 		{ id: "ad-angle-generator", label: "Ad Angle Generator", action: "preview", intent: "guidance", template: "Draft ad angles for {project}. Include audience problem, value promise, German hook direction, and platform fit." },
  463: 		{ id: "copy-variants", label: "Copy Variants", action: "preview", intent: "guidance", template: "Prepare German ad copy variants for {project}. Include hooks, primary text, CTA, and creative notes." },
  464: 		{ id: "test-ideas", label: "Test Ideas", action: "preview", intent: "task", template: "Suggest paid test ideas for {project}. Provide hypotheses, segments, creative variables, and measurement notes." },
  465: 		{ id: "budget-notes", label: "Budget Notes", action: "preview", intent: "guidance", template: "Review budget notes for {project}. Summarize constraints and safe test allocation guidance." },
  466: 		{ id: "open-ads-manager", label: "Open Ads Manager", action: "route", route: "ads-manager" }
  467: 	],
  468: 	analyst: [
  469: 		{ id: "keyword-intent", label: "Keyword Intent", action: "preview", intent: "guidance", template: "Suggest keyword intent opportunities for {project}. Include Germany-market intent, content mapping, and priority." },
  470: 		{ id: "meta-direction", label: "Meta Direction", action: "preview", intent: "guidance", template: "Prepare meta direction for {project}. Include page angle, title direction, description direction, and CTA intent." },
  471: 		{ id: "opportunity-summary", label: "Opportunity Summary", action: "preview", intent: "task", template: "Summarize SEO and insight opportunities for {project}. Focus on conversion, traffic quality, and content fit." },
  472: 		{ id: "analysis-plan", label: "Analysis Plan", action: "preview", intent: "workflow", template: "Draft an analysis plan for {project}. Define questions, datasets, cadence, and owners." },
  473: 		{ id: "open-insights", label: "Open Insights", action: "route", route: "insights" }
  474: 	],
  475: 	compliance_reviewer: [
  476: 		{ id: "claims-check", label: "Claims Check", action: "preview", intent: "guidance", template: "Review marketing claims for {project}. Flag unsupported, high-risk, or evidence-dependent wording." },
  477: 		{ id: "approval-flags", label: "Approval Flags", action: "preview", intent: "task", template: "Check approval risks for {project}. List risk, impact, mitigation, and required owner." },
  478: 		{ id: "safety-checklist", label: "Safety Checklist", action: "preview", intent: "handoff", template: "Prepare a safety checklist for {project}. Include policy checks, evidence required, and approval notes." },
  479: 		{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },
  480: 		{ id: "open-governance", label: "Open Governance", action: "route", route: "governance" }
  481: 	],
  482: 	operations: [
  483: 		{ id: "timeline-draft", label: "Timeline Draft", action: "preview", intent: "workflow", template: "Draft an execution timeline for {project}. Include milestones, owners, dependencies, and review gates." },
  484: 		{ id: "handoff-routing", label: "Handoff Routing", action: "preview", intent: "handoff", template: "Prepare handoff routing for {project}. Include source, destination, decision gates, and required confirmations." },
  485: 		{ id: "checklist", label: "Checklist", action: "preview", intent: "task", template: "Draft an operational checklist for {project}. Include owners, dependencies, priority, and first action." },
  486: 		{ id: "blocker-review", label: "Blocker Review", action: "preview", intent: "guidance", template: "Review operational blockers for {project}. Prioritize by risk and impact." },
  487: 		{ id: "open-workflows", label: "Open Workflows / Operations", action: "route", route: "workflows" }
  488: 	],
  489: 	customer_ops: [
  490: 		{ id: "review-unified-inbox", label: "Review Unified Inbox", action: "preview", intent: "guidance", template: "Review the Unified Inbox readiness for {project}. Summarize visible customer-operation signals, open gaps, and safe next review steps. Do not claim inbox actions happened." },
  491: 		{ id: "summarize-customer-thread", label: "Summarize Customer Thread", action: "preview", intent: "guidance", template: "Summarize this customer thread for {project}. Include customer issue, sentiment, reply goal, missing details, and safe next step." },
  492: 		{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },
  493: 		{ id: "create-ticket-draft", label: "Create Ticket Draft", action: "preview", intent: "task", template: "Create a ticket draft for {project}. Include issue, priority, owner suggestion, evidence needed, and next safe action." },
  494: 		{ id: "check-sla-risk", label: "Check SLA Risk", action: "preview", intent: "guidance", template: "Check SLA risk for {project}. Flag urgency, risk level, missing runtime data, and escalation recommendation for review." },
  495: 		{ id: "prepare-escalation", label: "Prepare Escalation", action: "preview", intent: "handoff", template: "Prepare an escalation draft for {project}. Include reason, customer impact, owner, confirmation needed, and destination team." },
  496: 		{ id: "customer-profile-snapshot", label: "Customer Profile Snapshot", action: "preview", intent: "guidance", template: "Prepare a customer profile snapshot for {project}. Include known context, purchase/support signals, missing fields, and safe follow-up questions." },
  497: 		{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
  498: 	],
  499: 	sales_crm: [
  500: 		{ id: "lead-qualification", label: "Lead Qualification", action: "preview", intent: "guidance", template: "Qualify the lead for {project}. Include fit, intent, urgency, missing CRM fields, and the safest next step." },
  501: 		{ id: "outreach-draft", label: "Outreach Draft", action: "preview", intent: "guidance", template: "Draft outreach for {project}. Include subject or opener, personalized message, CTA, and review notes before sending." },
  502: 		{ id: "follow-up-sequence", label: "Follow-up Sequence", action: "preview", intent: "workflow", template: "Build a follow-up sequence for {project}. Include timing, message angle, CTA, stop condition, and confirmation requirements." },
  503: 		{ id: "crm-profile-summary", label: "CRM Profile Summary", action: "preview", intent: "guidance", template: "Summarize the CRM profile context for {project}. Include fit, history, open questions, and next sales action without mutating CRM data." },
  504: 		{ id: "pipeline-next-step", label: "Pipeline Next Step", action: "preview", intent: "task", template: "Recommend the pipeline next step for {project}. Include stage, rationale, owner, risk, and required confirmation." },
  505: 		{ id: "dealer-salon-outreach", label: "Dealer / Salon Outreach", action: "preview", intent: "guidance", template: "Draft dealer or salon outreach for {project}. Include positioning, proof needs, offer angle, CTA, and follow-up note." },
  506: 		{ id: "influencer-lead-plan", label: "Influencer Lead Plan", action: "preview", intent: "workflow", template: "Prepare an influencer lead plan for {project}. Include target profile, outreach angle, qualification criteria, and handoff path." },
  507: 		{ id: "sales-handoff-draft", label: "Sales Handoff", action: "preview", intent: "handoff", template: "Prepare a sales handoff draft for {project}. Include lead context, recommended next action, owner, and confirmation needed." }
  508: 	]
  509: };
  510: 
  511: // 4 quick-action prompts shown in the composer
  512: const QUICK_ACTIONS = [
  513: 	{ icon: "🚀", label: "Launch Campaign", sub: "Build a campaign plan", template: "Build a launch campaign for {project}. Map the channels, offer, phases, and required assets." },
  514: 	{ icon: "✍️", label: "Generate Content", sub: "Write hooks, captions & scripts", template: "Generate content for {project}. Create hooks, caption ideas, and a reel script for the next product push." },
  515: 	{ icon: "📊", label: "Analyze Performance", sub: "Review what's working", template: "Analyze current performance for {project}. What content, campaigns, and channels are working best right now?" },
```

### Preview-only actions

```js
  359: 	{ label: "Map the next launch wave", sub: "Strategist to Publisher to Operations" },
  360: 	{ label: "Prepare a full handoff sequence", sub: "Strategy, creative, compliance, publishing, ops" },
  361: 	{ label: "Review customer and sales impact", sub: "Customer Ops, Sales / CRM, Operations" }
  362: ];
  363: 
  364: const PHASE35_WORKSPACE_TABS = ["chat", "preview", "tools", "context", "history"];
  365: 
  366: const AI_ROOM_FLOW_STEPS = [
  367: 	{ id: "ask", title: "Ask", description: "Choose a specialist or the full team." },
  368: 	{ id: "draft", title: "Prepare", description: "Create guidance, copy, task, or handoff context." },
  369: 	{ id: "review", title: "Review", description: "Check safety, scope, language, and source." },
  370: 	{ id: "route", title: "Handoff", description: "Open the owning workspace with draft context." },
  371: 	{ id: "execute", title: "Confirm", description: "Execution stays gated in backend-owned surfaces." },
  372: 	{ id: "monitor", title: "Monitor", description: "Track readiness, integrations, and recent activity." }
  373: ];
  374: 
  375: const AI_ROOM_OUTPUT_TABS = [
  376: 	{ id: "draft", label: "Draft", helper: "Latest draft or guidance preview" },
  377: 	{ id: "task", label: "Task", helper: "Task-shaped output" },
  378: 	{ id: "workflow", label: "Workflow Preview", helper: "Operating sequence" },
  379: 	{ id: "handoff", label: "Handoff Preview", helper: "Destination package" },
  380: 	{ id: "export", label: "Export", helper: "File-ready package" }
  381: ];
  382: 
  383: const AI_ROOM_TEAM_CHAIN = ["Strategist", "Writer", "Media / Video", "Compliance", "Publisher", "Operations"];
  384: const AI_ROOM_BUSINESS_BRANCH = ["Customer Ops", "Sales / CRM", "Operations"];
  385: 
  386: const AI_ROOM_ROLE_INITIALS = {
  387: 	strategist: "ST",
  388: 	writer: "CW",
  389: 	media: "MD",
  390: 	video_lead: "VL",
  391: 	publisher: "PB",
  392: 	ads: "AO",
  393: 	analyst: "SI",
  394: 	compliance_reviewer: "CR",
  395: 	operations: "OL",
  396: 	customer_ops: "CO",
  397: 	sales_crm: "SC"
  398: };
  399: 
  400: const AI_ROOM_BACKEND_ROLE_ALIASES = {
  401: 	ads: "ads_operator",
  402: 	media: "designer",
  403: 	compliance_reviewer: "compliance_reviewer"
  404: };
  405: 
  406: const AI_ROOM_PLANNED_SPECIALISTS = [
  407: 	{
  408: 		label: "Admin / Governance",
  409: 		initials: "AG",
  410: 		status: "Planned",
  411: 		summary: "Policy, approvals, roles, and audit controls stay destination-owned."
  412: 	},
  413: 	{
  414: 		label: "Researcher",
  415: 		initials: "RS",
  416: 		status: "Planned",
  417: 		summary: "Market, evidence, competitor, and proof research will prepare source packs only."
  418: 	},
  419: 	{
  420: 		label: "Automation Architect",
  421: 		initials: "AA",
  422: 		status: "Planned",
  423: 		summary: "Workflow blueprints and trigger maps will route to Workflows before execution."
  424: 	}
  425: ];
  426: 
  427: const PHASE35_SPECIALIST_TOOLS = {
  428: 	strategist: [
  429: 		{ id: "campaign-angle-generator", label: "Campaign Angle Generator", action: "preview", intent: "guidance", template: "Generate campaign angles for {project}. Include audience tension, promise, channel fit, and strongest first test." },
  430: 		{ id: "launch-plan", label: "Launch Plan", action: "preview", intent: "workflow", template: "Build a launch plan for {project}. Include phases, channels, owners, blockers, and next move." },
  431: 		{ id: "funnel-mapping", label: "Funnel Mapping", action: "preview", intent: "guidance", template: "Map the funnel for {project}. Include awareness, consideration, conversion, retention, and handoff points." },
  432: 		{ id: "prioritize-next-move", label: "Priority Sort", action: "preview", intent: "task", template: "Prioritize the next moves for {project}. Rank by impact, urgency, dependencies, and safest first action." }
  433: 	],
  434: 	writer: [
  435: 		{ id: "hook-generator", label: "Hook Generator", action: "preview", intent: "guidance", template: "Write 5 German hook variants for {project}. Keep them concise, testable, and suitable for the Germany market." },
  436: 		{ id: "caption-builder", label: "Caption Builder", action: "preview", intent: "guidance", template: "Draft German captions for {project}. Include angle, body, CTA, and platform adaptation notes." },
  437: 		{ id: "cta-refiner", label: "CTA Refiner", action: "preview", intent: "task", template: "Refine CTA options for {project}. Provide German variants for awareness, consideration, and action stages." },
  438: 		{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }
  439: 	],
  440: 	media: [
  441: 		{ id: "creative-brief-builder", label: "Creative Brief Builder", action: "preview", intent: "media", template: "Prepare a creative brief for {project}. Include concept, visual rules, subject, brand constraints, and production notes." },
  442: 		{ id: "format-mapper", label: "Format Mapper", action: "preview", intent: "guidance", template: "Map required creative formats for {project}. Include platform, aspect ratio, asset type, and usage context." },
  443: 		{ id: "asset-checklist", label: "Asset Checklist", action: "preview", intent: "task", template: "Create an asset checklist for {project}. List must-have files, missing references, usage context, and priority." },
  444: 		{ id: "visual-direction", label: "Visual Direction", action: "preview", intent: "guidance", template: "Review visual direction for {project}. Identify mismatches, improvements, and required references." },
  445: 		{ id: "open-media-studio", label: "Send prompt to Media Studio", action: "route", route: "media-studio" }
  446: 	],
  447: 	video_lead: [
  448: 		{ id: "write-video-hook", label: "Write video hook", action: "preview", intent: "guidance", template: "Write short-form video hooks for {project}. Include 3 opening variants and audience fit." },
  449: 		{ id: "draft-script", label: "Draft script", action: "preview", intent: "guidance", template: "Draft a short-form video script for {project}. Include hook, body, CTA, and visual cues." },
  450: 		{ id: "build-storyboard", label: "Build storyboard", action: "preview", intent: "workflow", template: "Build storyboard beats for {project}. Sequence shots and key transitions." },
  451: 		{ id: "prepare-voiceover", label: "Prepare voiceover", action: "preview", intent: "guidance", template: "Prepare voiceover script options for {project}. Keep clean timing and emphasis notes." },
  452: 		{ id: "map-video-asset-needs", label: "Map video asset needs", action: "preview", intent: "task", template: "Map video asset needs for {project}. Include format, source, and production owner." }
  453: 	],
  454: 	publisher: [
  455: 		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
  456: 		{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },
  457: 		{ id: "channel-formatting", label: "Channel Formatting", action: "preview", intent: "guidance", template: "Format the next output for {project} by channel. Include German copy, limits, CTA, and scheduling notes." },
  458: 		{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },
  459: 		{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }
  460: 	],
  461: 	ads: [
  462: 		{ id: "ad-angle-generator", label: "Ad Angle Generator", action: "preview", intent: "guidance", template: "Draft ad angles for {project}. Include audience problem, value promise, German hook direction, and platform fit." },
  463: 		{ id: "copy-variants", label: "Copy Variants", action: "preview", intent: "guidance", template: "Prepare German ad copy variants for {project}. Include hooks, primary text, CTA, and creative notes." },
  464: 		{ id: "test-ideas", label: "Test Ideas", action: "preview", intent: "task", template: "Suggest paid test ideas for {project}. Provide hypotheses, segments, creative variables, and measurement notes." },
  465: 		{ id: "budget-notes", label: "Budget Notes", action: "preview", intent: "guidance", template: "Review budget notes for {project}. Summarize constraints and safe test allocation guidance." },
  466: 		{ id: "open-ads-manager", label: "Open Ads Manager", action: "route", route: "ads-manager" }
  467: 	],
  468: 	analyst: [
  469: 		{ id: "keyword-intent", label: "Keyword Intent", action: "preview", intent: "guidance", template: "Suggest keyword intent opportunities for {project}. Include Germany-market intent, content mapping, and priority." },
  470: 		{ id: "meta-direction", label: "Meta Direction", action: "preview", intent: "guidance", template: "Prepare meta direction for {project}. Include page angle, title direction, description direction, and CTA intent." },
  471: 		{ id: "opportunity-summary", label: "Opportunity Summary", action: "preview", intent: "task", template: "Summarize SEO and insight opportunities for {project}. Focus on conversion, traffic quality, and content fit." },
  472: 		{ id: "analysis-plan", label: "Analysis Plan", action: "preview", intent: "workflow", template: "Draft an analysis plan for {project}. Define questions, datasets, cadence, and owners." },
  473: 		{ id: "open-insights", label: "Open Insights", action: "route", route: "insights" }
  474: 	],
  475: 	compliance_reviewer: [
  476: 		{ id: "claims-check", label: "Claims Check", action: "preview", intent: "guidance", template: "Review marketing claims for {project}. Flag unsupported, high-risk, or evidence-dependent wording." },
  477: 		{ id: "approval-flags", label: "Approval Flags", action: "preview", intent: "task", template: "Check approval risks for {project}. List risk, impact, mitigation, and required owner." },
  478: 		{ id: "safety-checklist", label: "Safety Checklist", action: "preview", intent: "handoff", template: "Prepare a safety checklist for {project}. Include policy checks, evidence required, and approval notes." },
  479: 		{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },
  480: 		{ id: "open-governance", label: "Open Governance", action: "route", route: "governance" }
  481: 	],
  482: 	operations: [
  483: 		{ id: "timeline-draft", label: "Timeline Draft", action: "preview", intent: "workflow", template: "Draft an execution timeline for {project}. Include milestones, owners, dependencies, and review gates." },
  484: 		{ id: "handoff-routing", label: "Handoff Routing", action: "preview", intent: "handoff", template: "Prepare handoff routing for {project}. Include source, destination, decision gates, and required confirmations." },
  485: 		{ id: "checklist", label: "Checklist", action: "preview", intent: "task", template: "Draft an operational checklist for {project}. Include owners, dependencies, priority, and first action." },
  486: 		{ id: "blocker-review", label: "Blocker Review", action: "preview", intent: "guidance", template: "Review operational blockers for {project}. Prioritize by risk and impact." },
  487: 		{ id: "open-workflows", label: "Open Workflows / Operations", action: "route", route: "workflows" }
  488: 	],
  489: 	customer_ops: [
  490: 		{ id: "review-unified-inbox", label: "Review Unified Inbox", action: "preview", intent: "guidance", template: "Review the Unified Inbox readiness for {project}. Summarize visible customer-operation signals, open gaps, and safe next review steps. Do not claim inbox actions happened." },
  491: 		{ id: "summarize-customer-thread", label: "Summarize Customer Thread", action: "preview", intent: "guidance", template: "Summarize this customer thread for {project}. Include customer issue, sentiment, reply goal, missing details, and safe next step." },
  492: 		{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },
  493: 		{ id: "create-ticket-draft", label: "Create Ticket Draft", action: "preview", intent: "task", template: "Create a ticket draft for {project}. Include issue, priority, owner suggestion, evidence needed, and next safe action." },
  494: 		{ id: "check-sla-risk", label: "Check SLA Risk", action: "preview", intent: "guidance", template: "Check SLA risk for {project}. Flag urgency, risk level, missing runtime data, and escalation recommendation for review." },
  495: 		{ id: "prepare-escalation", label: "Prepare Escalation", action: "preview", intent: "handoff", template: "Prepare an escalation draft for {project}. Include reason, customer impact, owner, confirmation needed, and destination team." },
  496: 		{ id: "customer-profile-snapshot", label: "Customer Profile Snapshot", action: "preview", intent: "guidance", template: "Prepare a customer profile snapshot for {project}. Include known context, purchase/support signals, missing fields, and safe follow-up questions." },
  497: 		{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
  498: 	],
  499: 	sales_crm: [
```

### Copy defects

```js
_No match found._
```


## Preliminary Verdict

| Area | Verdict |
|---|---|
| Preview actions | Found 54; expected guidance/draft-only behavior. |
| Route actions | Found 6; expected navigation-only behavior. |
| Direct execution labels | No obvious direct execution action labels found. |
| Safety instructions | Verified: explicit no-executed-action claims present. |
| Sensitive command gate | Verified: sensitive publish/send/ad/final approval commands are routed to approval-gated plan. |
| Copy defects | No compacted copy defects detected by this audit. |

## Decision Rules
- If no direct execution labels are found and sensitive commands are approval-gated: no runtime patch required.
- If copy defects are present: use a copy-only polish patch, not an architecture patch.
- If route actions only navigate: no authority patch required.
- If preview actions only generate drafts/guidance: no authority patch required.
- Do not change CSS in this phase.
- Do not change backend authority.
- Do not change data/projects.
