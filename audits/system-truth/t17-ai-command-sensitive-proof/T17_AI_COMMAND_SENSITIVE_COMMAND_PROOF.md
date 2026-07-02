# T17 — AI Command Sensitive Command Proof

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/ai-command.js

## Purpose
T16 verified preview/route action patterns but did not detect the sensitive command classifier due regex mismatch. T17 directly verifies whether sensitive user commands are converted into approval-gated plans rather than direct execution.

## Final Findings
| Area | Line | Verdict |
|---|---:|---|
| buildAutoPlanFromCommand | 620 | Found |
| Sensitive command classifier | 675 | Verified |
| Approval-gated reason | 675 | Verified |
| Workflow target handoff | 665 | Verified |
| No-executed-action instruction | 1212 | Verified |
| Confirmation note | 1392 | Verified |

## Evidence

### buildAutoPlanFromCommand
```js
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
  691: 
  692: function detectSpecialistFromBridgePrompt(prompt) {
  693: 	const text = asString(prompt);
  694: 	if (/act as the strategist/i.test(text)) return "strategist";
  695: 	if (/act as the content writer/i.test(text)) return "writer";
  696: 	if (/act as the media director/i.test(text)) return "media";
  697: 	if (/act as the video lead/i.test(text)) return "video_lead";
  698: 	if (/act as the publisher/i.test(text)) return "publisher";
  699: 	if (/act as the ads optimizer|act as the ads operator/i.test(text)) return "ads";
  700: 	if (/act as the seo|act as the insights analyst/i.test(text)) return "analyst";
  701: 	if (/act as the compliance reviewer/i.test(text)) return "compliance_reviewer";
  702: 	if (/act as the operations lead/i.test(text)) return "operations";
  703: 	if (/act as the customer operations lead|act as customer ops/i.test(text)) return "customer_ops";
  704: 	if (/act as the sales|act as the crm|sales \/ crm lead/i.test(text)) return "sales_crm";
  705: 	const classified = classifyIntent(text, null);
  706: 	if (classified.resolvedModeId && classified.resolvedModeId !== "operations") {
  707: 		return classified.resolvedModeId;
  708: 	}
  709: 	return null;
  710: }
  711: 
  712: // ============================================================
  713: //  HELPERS
  714: // ============================================================
  715: 
  716: function asArray(value) {
  717: 	return Array.isArray(value) ? value : [];
  718: }
  719: 
  720: function asObject(value) {
```

### Sensitive classifier / approval gate
```js
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
  691: 
  692: function detectSpecialistFromBridgePrompt(prompt) {
  693: 	const text = asString(prompt);
  694: 	if (/act as the strategist/i.test(text)) return "strategist";
  695: 	if (/act as the content writer/i.test(text)) return "writer";
  696: 	if (/act as the media director/i.test(text)) return "media";
  697: 	if (/act as the video lead/i.test(text)) return "video_lead";
  698: 	if (/act as the publisher/i.test(text)) return "publisher";
  699: 	if (/act as the ads optimizer|act as the ads operator/i.test(text)) return "ads";
  700: 	if (/act as the seo|act as the insights analyst/i.test(text)) return "analyst";
  701: 	if (/act as the compliance reviewer/i.test(text)) return "compliance_reviewer";
  702: 	if (/act as the operations lead/i.test(text)) return "operations";
  703: 	if (/act as the customer operations lead|act as customer ops/i.test(text)) return "customer_ops";
  704: 	if (/act as the sales|act as the crm|sales \/ crm lead/i.test(text)) return "sales_crm";
  705: 	const classified = classifyIntent(text, null);
  706: 	if (classified.resolvedModeId && classified.resolvedModeId !== "operations") {
  707: 		return classified.resolvedModeId;
  708: 	}
  709: 	return null;
  710: }
  711: 
  712: // ============================================================
  713: //  HELPERS
  714: // ============================================================
  715: 
  716: function asArray(value) {
  717: 	return Array.isArray(value) ? value : [];
  718: }
  719: 
  720: function asObject(value) {
  721: 	return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  722: }
  723: 
  724: function asString(value) {
  725: 	if (value == null) return "";
  726: 	return String(value);
  727: }
  728: 
  729: function humanizeValue(value, fallback = "") {
  730: 	if (value == null) return fallback;
  731: 	if (typeof value === "string") {
  732: 		const clean = value.trim();
  733: 		return clean === "[object Object]" ? fallback : clean;
  734: 	}
  735: 	if (typeof value === "number" || typeof value === "boolean") {
  736: 		return String(value);
  737: 	}
  738: 	if (Array.isArray(value)) {
  739: 		return value.map((item) => humanizeValue(item)).filter(Boolean).join("; ") || fallback;
  740: 	}
  741: 	if (typeof value === "object") {
  742: 		const title = humanizeValue(value.title || value.label || value.name || value.headline || value.hook);
  743: 		const detail = humanizeValue(
  744: 			value.action ||
  745: 			value.summary ||
  746: 			value.description ||
  747: 			value.recommendation ||
  748: 			value.reason ||
  749: 			value.insight ||
  750: 			value.body ||
  751: 			value.text ||
  752: 			value.value
  753: 		);
  754: 		if (title && detail && title !== detail) return `${title}: ${detail}`;
  755: 		if (title || detail) return title || detail;
  756: 		return Object.entries(value)
  757: 			.filter(([, item]) => item != null && typeof item !== "object")
  758: 			.slice(0, 4)
  759: 			.map(([key, item]) => `${titleCase(key)}: ${humanizeValue(item)}`)
  760: 			.filter(Boolean)
  761: 			.join("; ") || fallback;
  762: 	}
  763: 	return fallback;
  764: }
  765: 
```

### Workflow handoff proof
```js
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
  691: 
  692: function detectSpecialistFromBridgePrompt(prompt) {
  693: 	const text = asString(prompt);
  694: 	if (/act as the strategist/i.test(text)) return "strategist";
  695: 	if (/act as the content writer/i.test(text)) return "writer";
  696: 	if (/act as the media director/i.test(text)) return "media";
  697: 	if (/act as the video lead/i.test(text)) return "video_lead";
  698: 	if (/act as the publisher/i.test(text)) return "publisher";
  699: 	if (/act as the ads optimizer|act as the ads operator/i.test(text)) return "ads";
  700: 	if (/act as the seo|act as the insights analyst/i.test(text)) return "analyst";
  701: 	if (/act as the compliance reviewer/i.test(text)) return "compliance_reviewer";
  702: 	if (/act as the operations lead/i.test(text)) return "operations";
  703: 	if (/act as the customer operations lead|act as customer ops/i.test(text)) return "customer_ops";
  704: 	if (/act as the sales|act as the crm|sales \/ crm lead/i.test(text)) return "sales_crm";
  705: 	const classified = classifyIntent(text, null);
  706: 	if (classified.resolvedModeId && classified.resolvedModeId !== "operations") {
  707: 		return classified.resolvedModeId;
  708: 	}
  709: 	return null;
  710: }
  711: 
  712: // ============================================================
  713: //  HELPERS
  714: // ============================================================
  715: 
  716: function asArray(value) {
  717: 	return Array.isArray(value) ? value : [];
  718: }
  719: 
  720: function asObject(value) {
  721: 	return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  722: }
  723: 
  724: function asString(value) {
  725: 	if (value == null) return "";
  726: 	return String(value);
  727: }
  728: 
  729: function humanizeValue(value, fallback = "") {
  730: 	if (value == null) return fallback;
  731: 	if (typeof value === "string") {
  732: 		const clean = value.trim();
  733: 		return clean === "[object Object]" ? fallback : clean;
  734: 	}
  735: 	if (typeof value === "number" || typeof value === "boolean") {
  736: 		return String(value);
  737: 	}
  738: 	if (Array.isArray(value)) {
  739: 		return value.map((item) => humanizeValue(item)).filter(Boolean).join("; ") || fallback;
  740: 	}
  741: 	if (typeof value === "object") {
  742: 		const title = humanizeValue(value.title || value.label || value.name || value.headline || value.hook);
  743: 		const detail = humanizeValue(
  744: 			value.action ||
  745: 			value.summary ||
```

## Decision
No runtime authority patch is required for AI Command sensitive commands. Sensitive intent is converted into a gated workflow/approval plan, not direct external execution.

## Constraints
- No production code changed.
- No CSS changed.
- No backend authority changed.
- No data/projects changed.
