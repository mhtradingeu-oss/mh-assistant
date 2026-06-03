# PHASE 3AF.1 — AI Command Copy / Safety Evidence

## Safety and boundary copy markers
public/control-center/pages/ai-command.js:39:                routeHint: "campaign-studio"
public/control-center/pages/ai-command.js:46:                routeHint: "content-studio"
public/control-center/pages/ai-command.js:53:                routeHint: "media-studio"
public/control-center/pages/ai-command.js:60:                routeHint: "media-studio"
public/control-center/pages/ai-command.js:66:                summary: "Publishing readiness, schedule review, and handoff preparation.",
public/control-center/pages/ai-command.js:67:                routeHint: "publishing"
public/control-center/pages/ai-command.js:74:                routeHint: "ads-manager"
public/control-center/pages/ai-command.js:81:                routeHint: "insights"
public/control-center/pages/ai-command.js:88:                routeHint: "governance"
public/control-center/pages/ai-command.js:94:                summary: "Tasks, timelines, handoffs, approvals, and execution plans.",
public/control-center/pages/ai-command.js:95:                routeHint: "workflows"
public/control-center/pages/ai-command.js:102:                routeHint: "operations-centers"
public/control-center/pages/ai-command.js:108:                summary: "Lead qualification, outreach drafts, follow-up cadence, and CRM handoff notes.",
public/control-center/pages/ai-command.js:109:                routeHint: "workflows"
public/control-center/pages/ai-command.js:150:		safetyNote: "All outputs are guidance and draft only. Execution requires explicit confirmation.",
public/control-center/pages/ai-command.js:160:		canHelp: ["Draft captions and hooks", "Write email copy", "Create landing page text", "Prepare publisher handoff", "Suggest message variants"],
public/control-center/pages/ai-command.js:163:		safetyNote: "Drafts require review before publishing. Cannot approve or publish without confirmation.",
public/control-center/pages/ai-command.js:173:		canHelp: ["Write creative briefs", "Advise on visual direction", "Map format requirements", "Review brand alignment", "Prepare media handoffs"],
public/control-center/pages/ai-command.js:174:		cannotDo: ["Generate images directly", "Upload assets without review", "Approve without confirmation", "Execute media jobs"],
public/control-center/pages/ai-command.js:176:		safetyNote: "Direction and briefs only. Media generation requires backend confirmation and explicit action.",
public/control-center/pages/ai-command.js:187:		cannotDo: ["Generate video directly", "Upload footage without review", "Approve without confirmation", "Run media jobs automatically"],
public/control-center/pages/ai-command.js:197:		summary: "Publishing readiness, schedule review, and handoff preparation.",
public/control-center/pages/ai-command.js:198:		placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",
public/control-center/pages/ai-command.js:199:		canHelp: ["Review publishing readiness", "Check scheduled jobs", "Prepare handoff packages", "Map publishing dependencies", "Flag pre-publish risks"],
public/control-center/pages/ai-command.js:241:		safetyNote: "Compliance review is advisory. Approvals always require human confirmation before execution.",
public/control-center/pages/ai-command.js:249:		summary: "Tasks, timelines, handoffs, approvals, and execution plans.",
public/control-center/pages/ai-command.js:250:		placeholder: "Ask the Operations Lead to turn this into tasks, workflow steps, or handoffs…",
public/control-center/pages/ai-command.js:251:		canHelp: ["Create task plans", "Map execution sequences", "Prepare workflow handoffs", "Review execution health", "Identify operational blockers"],
public/control-center/pages/ai-command.js:252:		cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],
public/control-center/pages/ai-command.js:254:		safetyNote: "Task plans and handoffs only. Workflow execution requires explicit user confirmation.",
public/control-center/pages/ai-command.js:263:		placeholder: "Ask the Customer Operations Lead to summarize a customer thread, draft a safe reply, prepare a ticket draft, check SLA risk, or route an escalation for review…",
public/control-center/pages/ai-command.js:265:		cannotDo: ["Send customer replies", "Create live tickets", "Change SLA policy", "Escalate without confirmation"],
public/control-center/pages/ai-command.js:267:		safetyNote: "Customer operations outputs are drafts only. Sending replies, ticket creation, and escalations require confirmation in the owning surface.",
public/control-center/pages/ai-command.js:275:		summary: "Lead qualification, outreach drafts, follow-up cadence, CRM profile summaries, and sales handoff notes.",
public/control-center/pages/ai-command.js:276:		placeholder: "Ask the Sales / CRM Lead to qualify a lead, draft outreach, plan follow-ups, summarize CRM context, or prepare a sales handoff for review…",
public/control-center/pages/ai-command.js:277:		canHelp: ["Qualify lead context", "Draft outreach", "Plan follow-up sequences", "Summarize CRM profiles", "Prepare sales handoffs"],
public/control-center/pages/ai-command.js:280:		safetyNote: "Sales and CRM outputs are guidance and drafts only. CRM mutations and outreach sends require confirmation in the owning surface.",
public/control-center/pages/ai-command.js:296:		{ label: "Prepare a Publisher handoff", sub: "Package ready content for review" },
public/control-center/pages/ai-command.js:303:		{ label: "Prepare a media handoff", sub: "Package direction for the team" }
public/control-center/pages/ai-command.js:315:		{ label: "Prepare a handoff package", sub: "For the approver review" }
public/control-center/pages/ai-command.js:337:		{ label: "Draft a workflow handoff", sub: "Prepare for the next owner" },
public/control-center/pages/ai-command.js:351:		{ label: "Prepare sales handoff", sub: "Route context to operations" }
public/control-center/pages/ai-command.js:359:	{ label: "Prepare a full handoff sequence", sub: "Strategy, creative, compliance, publishing, ops" },
public/control-center/pages/ai-command.js:363:const PHASE35_WORKSPACE_TABS = ["chat", "preview", "tools", "context", "history"];
public/control-center/pages/ai-command.js:367:	{ id: "draft", title: "Draft", description: "Generate guidance, copy, task, or handoff material." },
public/control-center/pages/ai-command.js:369:	{ id: "route", title: "Route", description: "Send context to the owning workspace." },
public/control-center/pages/ai-command.js:375:	{ id: "draft", label: "Draft", helper: "Latest draft or guidance preview" },
public/control-center/pages/ai-command.js:378:	{ id: "handoff", label: "Handoff Preview", helper: "Destination package" },
public/control-center/pages/ai-command.js:422:		summary: "Workflow blueprints and trigger maps will route to Workflows before execution."
public/control-center/pages/ai-command.js:428:		{ id: "campaign-angle-generator", label: "Campaign Angle Generator", action: "preview", intent: "guidance", template: "Generate campaign angles for {project}. Include audience tension, promise, channel fit, and strongest first test." },
public/control-center/pages/ai-command.js:429:		{ id: "launch-plan", label: "Launch Plan", action: "preview", intent: "workflow", template: "Build a launch plan for {project}. Include phases, channels, owners, blockers, and next move." },
public/control-center/pages/ai-command.js:430:		{ id: "funnel-mapping", label: "Funnel Mapping", action: "preview", intent: "guidance", template: "Map the funnel for {project}. Include awareness, consideration, conversion, retention, and handoff points." },
public/control-center/pages/ai-command.js:431:		{ id: "prioritize-next-move", label: "Priority Sort", action: "preview", intent: "task", template: "Prioritize the next moves for {project}. Rank by impact, urgency, dependencies, and safest first action." }
public/control-center/pages/ai-command.js:434:		{ id: "hook-generator", label: "Hook Generator", action: "preview", intent: "guidance", template: "Write 5 German hook variants for {project}. Keep them concise, testable, and suitable for the Germany market." },
public/control-center/pages/ai-command.js:435:		{ id: "caption-builder", label: "Caption Builder", action: "preview", intent: "guidance", template: "Draft German captions for {project}. Include angle, body, CTA, and platform adaptation notes." },
public/control-center/pages/ai-command.js:436:		{ id: "cta-refiner", label: "CTA Refiner", action: "preview", intent: "task", template: "Refine CTA options for {project}. Provide German variants for awareness, consideration, and action stages." },
public/control-center/pages/ai-command.js:437:		{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }
public/control-center/pages/ai-command.js:440:		{ id: "creative-brief-builder", label: "Creative Brief Builder", action: "preview", intent: "media", template: "Prepare a creative brief for {project}. Include concept, visual rules, subject, brand constraints, and production notes." },
public/control-center/pages/ai-command.js:441:		{ id: "format-mapper", label: "Format Mapper", action: "preview", intent: "guidance", template: "Map required creative formats for {project}. Include platform, aspect ratio, asset type, and usage context." },
public/control-center/pages/ai-command.js:442:		{ id: "asset-checklist", label: "Asset Checklist", action: "preview", intent: "task", template: "Create an asset checklist for {project}. List must-have files, missing references, usage context, and priority." },
public/control-center/pages/ai-command.js:443:		{ id: "visual-direction", label: "Visual Direction", action: "preview", intent: "guidance", template: "Review visual direction for {project}. Identify mismatches, improvements, and required references." },
public/control-center/pages/ai-command.js:444:		{ id: "open-media-studio", label: "Send prompt to Media Studio", action: "route", route: "media-studio" }
public/control-center/pages/ai-command.js:447:		{ id: "write-video-hook", label: "Write video hook", action: "preview", intent: "guidance", template: "Write short-form video hooks for {project}. Include 3 opening variants and audience fit." },
public/control-center/pages/ai-command.js:448:		{ id: "draft-script", label: "Draft script", action: "preview", intent: "guidance", template: "Draft a short-form video script for {project}. Include hook, body, CTA, and visual cues." },
public/control-center/pages/ai-command.js:449:		{ id: "build-storyboard", label: "Build storyboard", action: "preview", intent: "workflow", template: "Build storyboard beats for {project}. Sequence shots and key transitions." },
public/control-center/pages/ai-command.js:450:		{ id: "prepare-voiceover", label: "Prepare voiceover", action: "preview", intent: "guidance", template: "Prepare voiceover script options for {project}. Keep clean timing and emphasis notes." },
public/control-center/pages/ai-command.js:451:		{ id: "map-video-asset-needs", label: "Map video asset needs", action: "preview", intent: "task", template: "Map video asset needs for {project}. Include format, source, and production owner." }
public/control-center/pages/ai-command.js:454:		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
public/control-center/pages/ai-command.js:455:		{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },
public/control-center/pages/ai-command.js:456:		{ id: "channel-formatting", label: "Channel Formatting", action: "preview", intent: "guidance", template: "Format the next output for {project} by channel. Include German copy, limits, CTA, and scheduling notes." },
public/control-center/pages/ai-command.js:457:		{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },
public/control-center/pages/ai-command.js:458:		{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }
public/control-center/pages/ai-command.js:461:		{ id: "ad-angle-generator", label: "Ad Angle Generator", action: "preview", intent: "guidance", template: "Draft ad angles for {project}. Include audience problem, value promise, German hook direction, and platform fit." },
public/control-center/pages/ai-command.js:462:		{ id: "copy-variants", label: "Copy Variants", action: "preview", intent: "guidance", template: "Prepare German ad copy variants for {project}. Include hooks, primary text, CTA, and creative notes." },
public/control-center/pages/ai-command.js:463:		{ id: "test-ideas", label: "Test Ideas", action: "preview", intent: "task", template: "Suggest paid test ideas for {project}. Provide hypotheses, segments, creative variables, and measurement notes." },
public/control-center/pages/ai-command.js:464:		{ id: "budget-notes", label: "Budget Notes", action: "preview", intent: "guidance", template: "Review budget notes for {project}. Summarize constraints and safe test allocation guidance." },
public/control-center/pages/ai-command.js:465:		{ id: "open-ads-manager", label: "Open Ads Manager", action: "route", route: "ads-manager" }
public/control-center/pages/ai-command.js:468:		{ id: "keyword-intent", label: "Keyword Intent", action: "preview", intent: "guidance", template: "Suggest keyword intent opportunities for {project}. Include Germany-market intent, content mapping, and priority." },
public/control-center/pages/ai-command.js:469:		{ id: "meta-direction", label: "Meta Direction", action: "preview", intent: "guidance", template: "Prepare meta direction for {project}. Include page angle, title direction, description direction, and CTA intent." },
public/control-center/pages/ai-command.js:470:		{ id: "opportunity-summary", label: "Opportunity Summary", action: "preview", intent: "task", template: "Summarize SEO and insight opportunities for {project}. Focus on conversion, traffic quality, and content fit." },
public/control-center/pages/ai-command.js:471:		{ id: "analysis-plan", label: "Analysis Plan", action: "preview", intent: "workflow", template: "Draft an analysis plan for {project}. Define questions, datasets, cadence, and owners." },
public/control-center/pages/ai-command.js:472:		{ id: "open-insights", label: "Open Insights", action: "route", route: "insights" }
public/control-center/pages/ai-command.js:475:		{ id: "claims-check", label: "Claims Check", action: "preview", intent: "guidance", template: "Review marketing claims for {project}. Flag unsupported, high-risk, or evidence-dependent wording." },
public/control-center/pages/ai-command.js:476:		{ id: "approval-flags", label: "Approval Flags", action: "preview", intent: "task", template: "Check approval risks for {project}. List risk, impact, mitigation, and required owner." },
public/control-center/pages/ai-command.js:477:		{ id: "safety-checklist", label: "Safety Checklist", action: "preview", intent: "handoff", template: "Prepare a safety checklist for {project}. Include policy checks, evidence required, and approval notes." },
public/control-center/pages/ai-command.js:478:		{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },
public/control-center/pages/ai-command.js:479:		{ id: "open-governance", label: "Open Governance", action: "route", route: "governance" }
public/control-center/pages/ai-command.js:482:		{ id: "timeline-draft", label: "Timeline Draft", action: "preview", intent: "workflow", template: "Draft an execution timeline for {project}. Include milestones, owners, dependencies, and review gates." },
public/control-center/pages/ai-command.js:483:		{ id: "handoff-routing", label: "Handoff Routing", action: "preview", intent: "handoff", template: "Prepare handoff routing for {project}. Include source, destination, decision gates, and required confirmations." },
public/control-center/pages/ai-command.js:484:		{ id: "checklist", label: "Checklist", action: "preview", intent: "task", template: "Draft an operational checklist for {project}. Include owners, dependencies, priority, and first action." },
public/control-center/pages/ai-command.js:485:		{ id: "blocker-review", label: "Blocker Review", action: "preview", intent: "guidance", template: "Review operational blockers for {project}. Prioritize by risk and impact." },
public/control-center/pages/ai-command.js:486:		{ id: "open-workflows", label: "Open Workflows / Operations", action: "route", route: "workflows" }
public/control-center/pages/ai-command.js:489:		{ id: "review-unified-inbox", label: "Review Unified Inbox", action: "preview", intent: "guidance", template: "Review the Unified Inbox readiness for {project}. Summarize visible customer-operation signals, open gaps, and safe next review steps. Do not claim inbox actions happened." },
public/control-center/pages/ai-command.js:490:		{ id: "summarize-customer-thread", label: "Summarize Customer Thread", action: "preview", intent: "guidance", template: "Summarize this customer thread for {project}. Include customer issue, sentiment, reply goal, missing details, and safe next step." },
public/control-center/pages/ai-command.js:491:		{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },
public/control-center/pages/ai-command.js:492:		{ id: "create-ticket-draft", label: "Create Ticket Draft", action: "preview", intent: "task", template: "Create a ticket draft for {project}. Include issue, priority, owner suggestion, evidence needed, and next safe action." },
public/control-center/pages/ai-command.js:493:		{ id: "check-sla-risk", label: "Check SLA Risk", action: "preview", intent: "guidance", template: "Check SLA risk for {project}. Flag urgency, risk level, missing runtime data, and escalation recommendation for review." },
public/control-center/pages/ai-command.js:494:		{ id: "prepare-escalation", label: "Prepare Escalation", action: "preview", intent: "handoff", template: "Prepare an escalation draft for {project}. Include reason, customer impact, owner, confirmation needed, and destination team." },
public/control-center/pages/ai-command.js:495:		{ id: "customer-profile-snapshot", label: "Customer Profile Snapshot", action: "preview", intent: "guidance", template: "Prepare a customer profile snapshot for {project}. Include known context, purchase/support signals, missing fields, and safe follow-up questions." },
public/control-center/pages/ai-command.js:496:		{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
public/control-center/pages/ai-command.js:499:		{ id: "lead-qualification", label: "Lead Qualification", action: "preview", intent: "guidance", template: "Qualify the lead for {project}. Include fit, intent, urgency, missing CRM fields, and the safest next step." },
public/control-center/pages/ai-command.js:500:		{ id: "outreach-draft", label: "Outreach Draft", action: "preview", intent: "guidance", template: "Draft outreach for {project}. Include subject or opener, personalized message, CTA, and review notes before sending." },
public/control-center/pages/ai-command.js:501:		{ id: "follow-up-sequence", label: "Follow-up Sequence", action: "preview", intent: "workflow", template: "Build a follow-up sequence for {project}. Include timing, message angle, CTA, stop condition, and confirmation requirements." },
public/control-center/pages/ai-command.js:502:		{ id: "crm-profile-summary", label: "CRM Profile Summary", action: "preview", intent: "guidance", template: "Summarize the CRM profile context for {project}. Include fit, history, open questions, and next sales action without mutating CRM data." },
public/control-center/pages/ai-command.js:503:		{ id: "pipeline-next-step", label: "Pipeline Next Step", action: "preview", intent: "task", template: "Recommend the pipeline next step for {project}. Include stage, rationale, owner, risk, and required confirmation." },
public/control-center/pages/ai-command.js:504:		{ id: "dealer-salon-outreach", label: "Dealer / Salon Outreach", action: "preview", intent: "guidance", template: "Draft dealer or salon outreach for {project}. Include positioning, proof needs, offer angle, CTA, and follow-up note." },
public/control-center/pages/ai-command.js:505:		{ id: "influencer-lead-plan", label: "Influencer Lead Plan", action: "preview", intent: "workflow", template: "Prepare an influencer lead plan for {project}. Include target profile, outreach angle, qualification criteria, and handoff path." },
public/control-center/pages/ai-command.js:506:		{ id: "sales-handoff-draft", label: "Sales Handoff", action: "preview", intent: "handoff", template: "Prepare a sales handoff draft for {project}. Include lead context, recommended next action, owner, and confirmation needed." }
public/control-center/pages/ai-command.js:601:		purpose: "Translate intent into executable workflows and handoffs.",
public/control-center/pages/ai-command.js:784:    "Prepare a handoff summary for:",
public/control-center/pages/ai-command.js:938:			workspaceTab: "preview",
public/control-center/pages/ai-command.js:966:			routeSuggestions: [],
public/control-center/pages/ai-command.js:1138:                preview: session.outputPreview || null,
public/control-center/pages/ai-command.js:1161:        session.outputPreview = asObject(record.preview);
public/control-center/pages/ai-command.js:1213:		"Deliver a structured, review-ready answer.",
public/control-center/pages/ai-command.js:1297:                                : activeTab === "handoff"
public/control-center/pages/ai-command.js:1298:                                        ? "handoff"
public/control-center/pages/ai-command.js:1302:        const looksTaskLike = /\b(task|tasks|handoff|ticket|tickets|follow-up|follow up|owner|owners|assignee|assigned|due date|priority|priorities|backlog|checklist|next task|action item|action items)\b/.test(text);
public/control-center/pages/ai-command.js:1311:        if (outputType === "handoff" || outputType === "task" || looksTaskLike) {
public/control-center/pages/ai-command.js:1359:function routeLabel(route) {
public/control-center/pages/ai-command.js:1374:	return labels[route] || titleCase(route);
public/control-center/pages/ai-command.js:1381:	const route = destinationRouteForSpecialist(specialistId, outputType);
public/control-center/pages/ai-command.js:1390:		destinationRoute: route,
public/control-center/pages/ai-command.js:1391:		confirmationRequired: outputType === "handoff" || specialistId === "publisher" || specialistId === "compliance_reviewer",
public/control-center/pages/ai-command.js:1394:		status: "draft_preview",
public/control-center/pages/ai-command.js:1395:		safetyLabel: "Guidance and draft only. No backend execution.",
public/control-center/pages/ai-command.js:1396:		nextSafeAction: `Review in ${routeLabel(route)}`,
public/control-center/pages/ai-command.js:1397:		confirmationNote: "Execution, approvals, and publishing require explicit confirmation in the owning workspace."
public/control-center/pages/ai-command.js:1412:				nextSafeAction: "Review and refine the task draft before creating durable tasks"
public/control-center/pages/ai-command.js:1499:			title: outputType === "handoff" ? "Handoff Preview: Publishing package" : "Publishing Draft: Readiness checklist",
public/control-center/pages/ai-command.js:1509:				"Prepare handoff for publishing review"
public/control-center/pages/ai-command.js:1511:			confirmationRequired: true,
public/control-center/pages/ai-command.js:1512:			safetyLabel: "Confirmation required before publish. No publish action performed."
public/control-center/pages/ai-command.js:1554:			safetyLabel: "No analytics mutation or fake metrics. Guidance only."
public/control-center/pages/ai-command.js:1569:			confirmationRequired: true,
public/control-center/pages/ai-command.js:1579:			mainOutput: "Review the customer context, confirm missing details, then route the draft through the owning support, sales, or operations surface.",
public/control-center/pages/ai-command.js:1586:				"Priority: draft priority pending runtime inbox and SLA confirmation.",
public/control-center/pages/ai-command.js:1590:				"Unified Inbox is not duplicated here; this is a draft and routing preview only.",
public/control-center/pages/ai-command.js:1591:				"SLA and escalation decisions require confirmation in the owning operations surface."
public/control-center/pages/ai-command.js:1593:			nextStep: "Review the draft, confirm the destination team, then route through support, sales, or operations.",
public/control-center/pages/ai-command.js:1600:			confirmationRequired: true,
public/control-center/pages/ai-command.js:1608:			title: outputType === "handoff" ? "Sales Handoff" : "Sales / CRM Draft: Lead and outreach plan",
public/control-center/pages/ai-command.js:1609:			summary: "Sales and CRM draft prepared with lead qualification, outreach direction, follow-up cadence, and pipeline handoff notes.",
public/control-center/pages/ai-command.js:1628:				"Outreach and follow-ups require confirmation before sending."
public/control-center/pages/ai-command.js:1630:			nextStep: "Review the lead fit, confirm owner, then route the handoff to operations or the CRM surface.",
public/control-center/pages/ai-command.js:1635:				"Route sales handoff without mutating CRM data"
public/control-center/pages/ai-command.js:1637:			confirmationRequired: true,
public/control-center/pages/ai-command.js:1652:					"Stage 4: Destination handoff and confirmation"
public/control-center/pages/ai-command.js:1654:				safetyLabel: "Workflow run is not started. This is a draft preview only."
public/control-center/pages/ai-command.js:1659:			title: outputType === "handoff" ? "Handoff Preview: Operations package" : "Operations Draft: Task and handoff plan",
public/control-center/pages/ai-command.js:1660:			summary: "Operational plan drafted with next tasks, owners, and route.",
public/control-center/pages/ai-command.js:1664:				"Prepare destination handoff context",
public/control-center/pages/ai-command.js:1667:			safetyLabel: "No workflow run and no backend task creation executed."
public/control-center/pages/ai-command.js:1684:		handoff: "handoff"
public/control-center/pages/ai-command.js:1701:		summary: `Full team ${outputType.replace("_", " ")} preview prepared for ${projectName || "current project"}.`,
public/control-center/pages/ai-command.js:1714:			"Customer Ops / Sales: add reply, ticket, lead, outreach, or CRM handoff drafts when relevant",
public/control-center/pages/ai-command.js:1715:			"Operations: convert the reviewed output into safe tasks, workflow draft, or handoff context"
public/control-center/pages/ai-command.js:1718:		nextSafeAction: "Review the team draft, confirm owners, then route draft context to the destination workspace",
public/control-center/pages/ai-command.js:1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
public/control-center/pages/ai-command.js:1720:		safetyLabel: "Full Team output is a coordinated draft preview only."
public/control-center/pages/ai-command.js:1729:		handoff: "Handoff Preview",
public/control-center/pages/ai-command.js:1740:		`Status: ${humanizeValue(output.status, "draft_preview")}`,
public/control-center/pages/ai-command.js:1752:	lines.push(`Destination: ${routeLabel(output.destinationRoute)}`);
public/control-center/pages/ai-command.js:1754:	lines.push(`Confirmation: ${output.confirmationRequired ? "Required before execution" : "Required for execution actions"}`);
public/control-center/pages/ai-command.js:1790:function buildStructuredPreviewBlocks(preview = {}) {
public/control-center/pages/ai-command.js:1791:        const summary = humanizeValue(preview.summary, "");
public/control-center/pages/ai-command.js:1793:                preview.mainOutput ||
public/control-center/pages/ai-command.js:1794:                preview.output ||
public/control-center/pages/ai-command.js:1795:                preview.generatedOutput ||
public/control-center/pages/ai-command.js:1796:                preview.result ||
public/control-center/pages/ai-command.js:1811:        const bullets = normalizeUniqueDisplayList(preview.bullets, 8)
public/control-center/pages/ai-command.js:1818:        const steps = normalizeUniqueDisplayList(preview.steps, 8)
public/control-center/pages/ai-command.js:1823:        } else if (preview.nextStep) {
public/control-center/pages/ai-command.js:1824:                blocks.push({ label: "Next step", items: [compactPreviewText(preview.nextStep, 280)] });
public/control-center/pages/ai-command.js:1969:		operations: ["task plan", "workflow", "handoff", "approval", "timeline", "execution plan", "route", "publish", "status", "priority", "priorities", "blocking", "blocker", "readiness", "next", "do next"],
public/control-center/pages/ai-command.js:1986:	const actionRouting = /launch|build|reconnect|connect|improve|create|fix|route|plan|publish/.test(query);
public/control-center/pages/ai-command.js:1994:function routeSuggestion(label, route, reason) {
public/control-center/pages/ai-command.js:1995:	return { label, route, reason };
public/control-center/pages/ai-command.js:2047:		routeSuggestions: [
public/control-center/pages/ai-command.js:2048:			routeSuggestion("Setup", "setup", "Close missing project basics, goals, and audience inputs."),
public/control-center/pages/ai-command.js:2049:			routeSuggestion("Integrations", "integrations", "Reconnect data sources and improve intelligence coverage."),
public/control-center/pages/ai-command.js:2050:			routeSuggestion("Insights", "insights", "Review performance signals and the recommendation stack.")
public/control-center/pages/ai-command.js:2082:		routeSuggestions: [
public/control-center/pages/ai-command.js:2083:			routeSuggestion("Content Studio", "content-studio", "Rewrite weak posts and turn winning patterns into new drafts."),
public/control-center/pages/ai-command.js:2084:			routeSuggestion("Publishing", "publishing", "Schedule the next batch with stronger timing and approval control."),
public/control-center/pages/ai-command.js:2085:			routeSuggestion("Insights", "insights", "Compare top and weak content performance.")
public/control-center/pages/ai-command.js:2118:		routeSuggestions: [
public/control-center/pages/ai-command.js:2119:			routeSuggestion("Insights", "insights", "Review search and website performance together."),
public/control-center/pages/ai-command.js:2120:			routeSuggestion("Integrations", "integrations", "Reconnect GA4 or Search Console."),
public/control-center/pages/ai-command.js:2121:			routeSuggestion("Setup", "setup", "Refine positioning if traffic signal is weak or misaligned.")
public/control-center/pages/ai-command.js:2153:		routeSuggestions: [
public/control-center/pages/ai-command.js:2154:			routeSuggestion("Ads Manager", "ads-manager", "Review pacing, creative mapping, and paid operating view."),
public/control-center/pages/ai-command.js:2155:			routeSuggestion("Integrations", "integrations", "Connect or reconnect paid reporting platforms."),
public/control-center/pages/ai-command.js:2156:			routeSuggestion("Insights", "insights", "Compare paid vs organic and website results.")
public/control-center/pages/ai-command.js:2181:		routeSuggestions: [
public/control-center/pages/ai-command.js:2182:			routeSuggestion("Setup", "setup", "Strengthen project assumptions, goals, and audience context."),
public/control-center/pages/ai-command.js:2183:			routeSuggestion("Integrations", "integrations", "Increase data coverage and reduce blind spots."),
public/control-center/pages/ai-command.js:2184:			routeSuggestion("Insights", "insights", "See where evidence is strong and where it is thin.")
public/control-center/pages/ai-command.js:2214:	const routeSuggestions = [];
public/control-center/pages/ai-command.js:2215:	if (/campaign/.test(query)) routeSuggestions.push(routeSuggestion("Campaign Studio", "campaign-studio", "Turn this into a structured launch plan."));
public/control-center/pages/ai-command.js:2217:		routeSuggestions.push(routeSuggestion("Content Studio", "content-studio", "Draft, rewrite, or prepare the requested content outputs."));
public/control-center/pages/ai-command.js:2218:		routeSuggestions.push(routeSuggestion("Publishing", "publishing", "Schedule or approve if the next step is publishing."));
public/control-center/pages/ai-command.js:2220:	if (/reconnect|connect|integration|tool|sync/.test(query)) routeSuggestions.push(routeSuggestion("Integrations", "integrations", "Reconnect data sources and restore intelligence coverage."));
public/control-center/pages/ai-command.js:2221:	if (/ads|campaign scale|roas|creative/.test(query)) routeSuggestions.push(routeSuggestion("Ads Manager", "ads-manager", "Review live paid performance and action the next media move."));
public/control-center/pages/ai-command.js:2222:	if (!routeSuggestions.length) routeSuggestions.push(routeSuggestion("Workflows", "workflows", "Use Workflows when the task spans multiple execution areas."));
public/control-center/pages/ai-command.js:2235:		routeSuggestions,
public/control-center/pages/ai-command.js:2338:		routeSuggestions: asArray(response?.routeSuggestions),
public/control-center/pages/ai-command.js:2478:	const fallbackLabel = sourceLabel || routeLabel(fallbackRoute);
public/control-center/pages/ai-command.js:2481:		const rawRoute = firstAiInboundId(record.route, record.destination, record.page, record.targetPage, record.target_page);
public/control-center/pages/ai-command.js:2483:		const route = normalizeAiInboundSourcePage(rawRoute || stringRoute || fallbackRoute);
public/control-center/pages/ai-command.js:2484:		const label = firstAiInboundText(record.label, record.title, record.name) || routeLabel(route) || fallbackLabel;
public/control-center/pages/ai-command.js:2486:		return { route, label, reason };
public/control-center/pages/ai-command.js:2487:	}).filter((item) => item.route || item.label);
public/control-center/pages/ai-command.js:2491:		route: fallbackRoute,
public/control-center/pages/ai-command.js:2498:	const preview = asObject(rawPreview);
public/control-center/pages/ai-command.js:2499:	if (!Object.keys(preview).length) return null;
public/control-center/pages/ai-command.js:2500:	const outputType = asString(preview.outputType || preview.output_type || preview.type || "handoff").trim() || "handoff";
public/control-center/pages/ai-command.js:2502:		preview.destinationRoute ||
public/control-center/pages/ai-command.js:2503:		preview.destination_route ||
public/control-center/pages/ai-command.js:2504:		asArray(normalized.routeSuggestions)[0]?.route ||
public/control-center/pages/ai-command.js:2508:	const specialistId = normalizeAiInboundSpecialistId(preview.specialistId || preview.specialist_id || normalized.suggestedSpecialist, normalized.suggestedSpecialist);
public/control-center/pages/ai-command.js:2511:		...preview,
public/control-center/pages/ai-command.js:2513:		title: firstAiInboundText(preview.title, normalized.title, `Inbound handoff from ${normalized.sourceLabel}`),
public/control-center/pages/ai-command.js:2514:		summary: firstAiInboundText(preview.summary, preview.description, normalized.prompt),
public/control-center/pages/ai-command.js:2517:		generatedAt: asString(preview.generatedAt || preview.generated_at || nowIso()),
public/control-center/pages/ai-command.js:2518:		sourcePrompt: firstAiInboundText(preview.sourcePrompt, preview.source_prompt, normalized.prompt),
public/control-center/pages/ai-command.js:2519:		status: asString(preview.status || "draft_preview"),
public/control-center/pages/ai-command.js:2520:		safetyLabel: firstAiInboundText(preview.safetyLabel, preview.safety_label, "Guidance and draft only. No backend execution."),
public/control-center/pages/ai-command.js:2521:		confirmationNote: firstAiInboundText(preview.confirmationNote, preview.confirmation_note, "Execution, approvals, publishing, CRM updates, customer replies, and workflow runs require explicit confirmation in the owning workspace."),
public/control-center/pages/ai-command.js:2522:		confirmationRequired: preview.confirmationRequired ?? preview.confirmation_required ?? true
public/control-center/pages/ai-command.js:2526:function getAiInboundDurableHandoffId(handoff) {
public/control-center/pages/ai-command.js:2527:	const payload = asObject(handoff?.payload);
public/control-center/pages/ai-command.js:2529:		handoff?.id,
public/control-center/pages/ai-command.js:2530:		handoff?.handoff_id,
public/control-center/pages/ai-command.js:2531:		handoff?.handoffId,
public/control-center/pages/ai-command.js:2532:		payload.handoff_id,
public/control-center/pages/ai-command.js:2533:		payload.handoffId
public/control-center/pages/ai-command.js:2537:function getAiInboundHandoffId(handoff) {
public/control-center/pages/ai-command.js:2538:	const durableId = getAiInboundDurableHandoffId(handoff);
public/control-center/pages/ai-command.js:2540:	if (!handoff) return "";
public/control-center/pages/ai-command.js:2541:	const payload = asObject(handoff?.payload);
public/control-center/pages/ai-command.js:2542:	const stablePayloadId = firstAiInboundId(payload.handoff_id, payload.handoffId, payload.id, handoff?.created_at, handoff?.createdAt);
public/control-center/pages/ai-command.js:2545:		if (!aiInboundHandoffObjectIds.has(handoff)) {
public/control-center/pages/ai-command.js:2547:			aiInboundHandoffObjectIds.set(handoff, `cached-ai-handoff-${Date.now()}-${aiInboundHandoffCounter}`);
public/control-center/pages/ai-command.js:2549:		return aiInboundHandoffObjectIds.get(handoff);
public/control-center/pages/ai-command.js:2551:	return [handoff?.source_page, handoff?.destination_page, payload.prompt, payload.title]
public/control-center/pages/ai-command.js:2554:		.join("::") || `cached-ai-handoff-${Date.now()}`;
public/control-center/pages/ai-command.js:2557:function normalizeAiInboundHandoff(handoff, projectName) {
public/control-center/pages/ai-command.js:2558:	const payload = asObject(handoff?.payload);
public/control-center/pages/ai-command.js:2559:	const draftContext = firstAiInboundObject(payload.draft_context, payload.draftContext, handoff?.draft_context, handoff?.draftContext);
public/control-center/pages/ai-command.js:2563:		handoff?.source_page,
public/control-center/pages/ai-command.js:2564:		handoff?.sourcePage,
public/control-center/pages/ai-command.js:2568:	const sourceLabel = AI_INBOUND_SOURCE_LABELS[sourcePage] || routeLabel(sourcePage) || "Workspace";
public/control-center/pages/ai-command.js:2591:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
public/control-center/pages/ai-command.js:2597:		handoff?.title,
public/control-center/pages/ai-command.js:2598:		`Inbound handoff from ${sourceLabel}`
public/control-center/pages/ai-command.js:2600:	const routeSuggestions = normalizeAiInboundRouteSuggestions(
public/control-center/pages/ai-command.js:2601:		asAiInboundList(payload.routeSuggestions).length ? payload.routeSuggestions :
public/control-center/pages/ai-command.js:2602:		asAiInboundList(payload.route_suggestions).length ? payload.route_suggestions :
public/control-center/pages/ai-command.js:2603:		asAiInboundList(draftContext.routeSuggestions).length ? draftContext.routeSuggestions :
public/control-center/pages/ai-command.js:2604:		draftContext.route_suggestions,
public/control-center/pages/ai-command.js:2611:		draftContext.output_preview,
public/control-center/pages/ai-command.js:2612:		draftContext.phase2_output_preview,
public/control-center/pages/ai-command.js:2614:		payload.output_preview
public/control-center/pages/ai-command.js:2623:		routeSuggestions,
public/control-center/pages/ai-command.js:2630:		status: asString(handoff?.status || payload.status || "available"),
public/control-center/pages/ai-command.js:2631:		note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."
public/control-center/pages/ai-command.js:2638:	const handoff = getSharedHandoff(projectName, "ai-command", operations);
public/control-center/pages/ai-command.js:2639:	const handoffId = getAiInboundHandoffId(handoff);
public/control-center/pages/ai-command.js:2640:	if (!handoffId || handoffId === asString(session.lastAppliedHandoffId)) return;
public/control-center/pages/ai-command.js:2642:	const normalized = normalizeAiInboundHandoff(handoff, projectName);
public/control-center/pages/ai-command.js:2647:	session.routeSuggestions = normalized.routeSuggestions;
public/control-center/pages/ai-command.js:2649:		id: handoffId,
public/control-center/pages/ai-command.js:2653:		routeSuggestions: normalized.routeSuggestions
public/control-center/pages/ai-command.js:2662:			preview: session.outputPreview,
public/control-center/pages/ai-command.js:2676:		routeSuggestions: normalized.routeSuggestions,
public/control-center/pages/ai-command.js:2681:	session.lastAppliedHandoffId = handoffId;
public/control-center/pages/ai-command.js:2682:	persistSessionDraft(projectName, session, `Inbound handoff loaded from ${normalized.sourceLabel}`);
public/control-center/pages/ai-command.js:2684:	const durableHandoffId = getAiInboundDurableHandoffId(handoff);
public/control-center/pages/ai-command.js:2687:			console.warn("Failed to consume AI handoff:", error.message);
public/control-center/pages/ai-command.js:2690:	showMessage?.(`Inbound handoff loaded from ${normalized.sourceLabel}.`);
public/control-center/pages/ai-command.js:2741:			routeSuggestions: [],
public/control-center/pages/ai-command.js:2938:					placeholder="Ask ${escapeHtml(mode.label)} anything — what to do next, what content is working, which campaign to scale, or where to route the next action…"
public/control-center/pages/ai-command.js:2990:				<span style="font-size:11px;color:var(--color-text-2);">Prefill only — send prompt for preview</span>
public/control-center/pages/ai-command.js:3025:	const routeSuggestions = asArray(response.routeSuggestions || response.route_suggestions).map((item) => {
public/control-center/pages/ai-command.js:3028:			label: humanizeValue(record.label || record.title || record.route || item),
public/control-center/pages/ai-command.js:3029:			route: asString(record.route || record.destination || record.page),
public/control-center/pages/ai-command.js:3032:	}).filter((item) => item.label || item.route);
public/control-center/pages/ai-command.js:3089:			${routeSuggestions.length ? `
public/control-center/pages/ai-command.js:3092:					<div class="ctrl-route-row">
public/control-center/pages/ai-command.js:3093:						${routeSuggestions.map((item, index) => `
public/control-center/pages/ai-command.js:3094:							<button class="ctrl-route-btn" type="button" data-ctrl-route="${index}" data-ctrl-route-owner="${escapeHtml(ownerId || "")}" title="${escapeHtml(item.reason)}">
public/control-center/pages/ai-command.js:3338:                guidance: "review-ready draft",
public/control-center/pages/ai-command.js:3341:                handoff: "handoff package"
public/control-center/pages/ai-command.js:3350:                "Keep it review-ready and do not execute backend actions.",
public/control-center/pages/ai-command.js:3358:        const preview = buildPhase2OutputPreview({
public/control-center/pages/ai-command.js:3366:        preview.sourcePrompt = context.prompt || workPrompt;
public/control-center/pages/ai-command.js:3367:        preview.conversationContext = context.conversationText;
public/control-center/pages/ai-command.js:3370:        // The visible preview should stay clean and user-facing.
public/control-center/pages/ai-command.js:3372:                preview.summary = context.assistantText;
public/control-center/pages/ai-command.js:3373:                preview.mainOutput = context.assistantText;
public/control-center/pages/ai-command.js:3376:        preview.generatedAt = nowIso();
public/control-center/pages/ai-command.js:3377:        preview.safetyLabel = preview.safetyLabel || "Conversation converted into a review-ready draft. No backend action executed.";
public/control-center/pages/ai-command.js:3379:        session.outputPreview = preview;
public/control-center/pages/ai-command.js:3382:        session.workspaceTab = "preview";
public/control-center/pages/ai-command.js:3383:        return preview;
public/control-center/pages/ai-command.js:3503:	const preview = asObject(session.outputPreview);
public/control-center/pages/ai-command.js:3505:	if (preview.outputType === "workflow") return 2;
public/control-center/pages/ai-command.js:3506:	if (preview.outputType === "handoff") return 3;
public/control-center/pages/ai-command.js:3507:	if (preview.outputType === "task") return 1;
public/control-center/pages/ai-command.js:3508:	if (preview.outputType) return 2;
public/control-center/pages/ai-command.js:3517:		preview: "draft",
public/control-center/pages/ai-command.js:3520:		handoff: "handoff",
public/control-center/pages/ai-command.js:3526:function outputTabFromPreview(preview) {
public/control-center/pages/ai-command.js:3527:	const outputType = asString(preview?.outputType || "");
public/control-center/pages/ai-command.js:3530:	if (outputType === "handoff") return "handoff";
public/control-center/pages/ai-command.js:3545:		handoff: "Handoff Preview",
public/control-center/pages/ai-command.js:3554:	if (tool.route) return asString(tool.route || "workflows");
public/control-center/pages/ai-command.js:3561:	if (tool.safetyLevel === "confirmation_required") return "Destination confirmation required";
public/control-center/pages/ai-command.js:3563:	return "Local preview only";
public/control-center/pages/ai-command.js:3568:	if (tool.intent === "handoff") return "Prepare";
public/control-center/pages/ai-command.js:3581:	return "Prepare a review-ready output for the selected specialist lane.";
public/control-center/pages/ai-command.js:3613:				<p class="aicmd-room-subtitle mhos-context-description">One specialist or the full team turns requests into review-ready drafts, tasks, and handoffs.</p>
public/control-center/pages/ai-command.js:3683:			<span>Full Team prepares a coordinated, review-ready plan. It does <b>not</b> execute workflows or publish anything.</span>
public/control-center/pages/ai-command.js:3750:						<p class="aicmd-v2-profile-purpose">Coordinates specialists into one review-ready brief, workflow, or handoff.</p>
public/control-center/pages/ai-command.js:3794:        if (roleId === "operations" || roleId === "customer_ops") return `${label} is preparing your task handoff...`;
public/control-center/pages/ai-command.js:3837:	if (/handoff|route|destination_brief/.test(haystack)) return "handoff";
public/control-center/pages/ai-command.js:3844:	const preferred = destinations.find((item) => !["chat-preview", "composer", "preview", "ai-command"].includes(asString(item)));
public/control-center/pages/ai-command.js:3857:		action: "preview",
public/control-center/pages/ai-command.js:3859:		route: getCanonicalToolRoute(tool, session),
public/control-center/pages/ai-command.js:3861:		template: asString(tool.template || "Prepare a review-ready draft for {projectName}.")
public/control-center/pages/ai-command.js:3877:		{ id: "preview", label: "Preview", hint: "Draft output" },
public/control-center/pages/ai-command.js:3911:					<span class="aicmd-v2-tools-subtitle">Fast specialist actions for the current output. Review-only: prepares drafts, previews, or handoffs without backend execution.</span>
public/control-center/pages/ai-command.js:3920:					const destination = routeLabel(getToolDestinationRoute(tool, session));
public/control-center/pages/ai-command.js:3962:		{ label: "Read preview", value: "Ready", className: "is-available" },
public/control-center/pages/ai-command.js:4029:				<div class="aicmd-v2-composer-hint">Draft/review only · suggested prompts prefill this composer · execution happens in the owning workspace after confirmation.</div>
public/control-center/pages/ai-command.js:4036:	const preview = asObject(session.outputPreview);
public/control-center/pages/ai-command.js:4037:	const hasPreview = Boolean(preview.outputType && preview.title);
public/control-center/pages/ai-command.js:4040:			<section class="aicmd-v2-preview">
public/control-center/pages/ai-command.js:4041:				<div class="aicmd-v2-preview-head">
public/control-center/pages/ai-command.js:4043:						<h3 class="aicmd-v2-preview-title">Preview</h3>
public/control-center/pages/ai-command.js:4044:						<p class="aicmd-v2-preview-subtitle">Generated content, draft packages, and routed handoffs appear here.</p>
public/control-center/pages/ai-command.js:4046:					<span class="aicmd-v2-preview-status aicmd-v2-preview-status-empty">Waiting</span>
public/control-center/pages/ai-command.js:4048:				<div class="aicmd-v2-preview-empty-state">
public/control-center/pages/ai-command.js:4049:					<strong>No preview yet</strong>
public/control-center/pages/ai-command.js:4050:					<span>Ask a specialist or send the chat response to preview.</span>
public/control-center/pages/ai-command.js:4056:	const structuredPreview = buildStructuredPreviewBlocks(preview);
public/control-center/pages/ai-command.js:4057:	const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
public/control-center/pages/ai-command.js:4060:		: getPhase1SpecialistById(preview.specialistId || session.modeId);
public/control-center/pages/ai-command.js:4061:	const outputLabel = hasPreview ? formatOutputTypeLabel(preview.outputType) : titleCase(activeTab);
public/control-center/pages/ai-command.js:4062:	const routeActionLabel = destination === "Content Studio"
public/control-center/pages/ai-command.js:4067:	const confirmationLabel = hasPreview
public/control-center/pages/ai-command.js:4068:		? (preview.confirmationRequired ? "Confirmation required" : "Review before handoff route")
public/control-center/pages/ai-command.js:4072:		<section class="aicmd-v2-preview">
public/control-center/pages/ai-command.js:4073:			<div class="aicmd-v2-preview-head">
public/control-center/pages/ai-command.js:4075:					<h3 class="aicmd-v2-preview-title">Preview</h3>
public/control-center/pages/ai-command.js:4076:					<p class="aicmd-v2-preview-subtitle">${escapeHtml(humanizeValue(preview.sourcePrompt, "Review the generated specialist output."))}</p>
public/control-center/pages/ai-command.js:4078:				<span class="aicmd-v2-preview-status">${escapeHtml(titleCase(preview.status || "draft_preview"))}</span>
public/control-center/pages/ai-command.js:4081:			<div class="aicmd-v2-preview-meta">
public/control-center/pages/ai-command.js:4082:				<span class="aicmd-v2-preview-chip"><strong>Type:</strong> ${escapeHtml(formatOutputTypeLabel(preview.outputType))}</span>
public/control-center/pages/ai-command.js:4083:				<span class="aicmd-v2-preview-chip"><strong>Specialist:</strong> ${escapeHtml(specialist.label || "Specialist")}</span>
public/control-center/pages/ai-command.js:4084:				<span class="aicmd-v2-preview-chip"><strong>Destination:</strong> ${escapeHtml(destination)}</span>
public/control-center/pages/ai-command.js:4085:				<span class="aicmd-v2-preview-chip"><strong>Generated:</strong> ${escapeHtml(formatTime(preview.generatedAt))}</span>
public/control-center/pages/ai-command.js:4088:			<div class="aicmd-v2-preview-body">
public/control-center/pages/ai-command.js:4089:				<p class="aicmd-v2-preview-what-heading">Prepared output</p>
public/control-center/pages/ai-command.js:4090:				<h4 class="aicmd-v2-preview-output-title">${escapeHtml(humanizeValue(preview.title, "Draft output"))}</h4>
public/control-center/pages/ai-command.js:4091:				<p class="aicmd-v2-preview-summary">${escapeHtml(humanizeValue(preview.summary, "Guidance preview prepared."))}</p>
public/control-center/pages/ai-command.js:4094:					<div class="aicmd-v2-preview-draft">${escapeHtml(structuredPreview.draftText)}</div>
public/control-center/pages/ai-command.js:4098:					<div class="aicmd-v2-preview-structured-grid aicmd-room-output-blocks">
public/control-center/pages/ai-command.js:4100:							<div class="aicmd-v2-preview-section">
public/control-center/pages/ai-command.js:4101:								<span class="aicmd-v2-preview-label">${escapeHtml(block.label)}</span>
public/control-center/pages/ai-command.js:4102:								<${block.ordered ? "ol" : "ul"} class="${block.ordered ? "aicmd-v2-preview-steps" : "aicmd-v2-preview-list"}">
public/control-center/pages/ai-command.js:4110:				<div class="aicmd-v2-preview-section">
public/control-center/pages/ai-command.js:4111:					<span class="aicmd-v2-preview-label">What you can do next</span>
public/control-center/pages/ai-command.js:4112:					<p class="aicmd-v2-preview-next-action">${escapeHtml(humanizeValue(preview.nextSafeAction, `Review in ${destination}.`))}</p>
public/control-center/pages/ai-command.js:4115:				<div class="aicmd-v2-preview-section">
public/control-center/pages/ai-command.js:4116:					<span class="aicmd-v2-preview-label">What requires confirmation</span>
public/control-center/pages/ai-command.js:4117:					<p class="aicmd-v2-preview-confirmation">${escapeHtml(humanizeValue(preview.safetyLabel, "Guidance only. No backend execution."))}</p>
public/control-center/pages/ai-command.js:4118:					<p class="aicmd-v2-preview-safety">${escapeHtml(humanizeValue(preview.confirmationNote, "Execution requires explicit confirmation in the destination workspace."))}</p>
public/control-center/pages/ai-command.js:4122:			<div class="aicmd-v2-preview-actions">
public/control-center/pages/ai-command.js:4127:				<button id="aicmdV2LegacyPreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${typeof speechSynthesis === "undefined" ? "disabled" : ""}>Read preview</button>
public/control-center/pages/ai-command.js:4128:				<button id="aicmdV2LegacyPreviewClearBtn" class="aicmd-v2-btn-ghost" type="button">Clear preview</button>
public/control-center/pages/ai-command.js:4135:	const preview = asObject(session.outputPreview);
public/control-center/pages/ai-command.js:4136:	const hasPreview = Boolean(preview.outputType && preview.title);
public/control-center/pages/ai-command.js:4138:	const structuredPreview = hasPreview ? buildStructuredPreviewBlocks(preview) : { blocks: [], draftText: "", compactSummary: "" };
public/control-center/pages/ai-command.js:4140:	const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
public/control-center/pages/ai-command.js:4143:		: getPhase1SpecialistById(preview.specialistId || session.modeId);
public/control-center/pages/ai-command.js:4144:	const outputLabel = hasPreview ? formatOutputTypeLabel(preview.outputType) : titleCase(activeTab);
public/control-center/pages/ai-command.js:4145:	const routeActionLabel = destination === "Content Studio"
public/control-center/pages/ai-command.js:4150:	const confirmationLabel = hasPreview
public/control-center/pages/ai-command.js:4151:		? (preview.confirmationRequired ? "Confirmation required" : "Review before handoff route")
public/control-center/pages/ai-command.js:4159:					<h2>Drafts, task previews, workflow previews, handoffs</h2>
public/control-center/pages/ai-command.js:4160:                                        <p>${hasPreview ? "Review the result, then route draft context to the next workspace." : "Create a preview from the conversation before routing work to another workspace."}</p>
public/control-center/pages/ai-command.js:4162:				<span class="aicmd-room-output-state">${escapeHtml(confirmationLabel)}</span>
public/control-center/pages/ai-command.js:4195:					<h3>${escapeHtml(!humanizeValue(preview.title, "") || humanizeValue(preview.title, "").toLowerCase() === "chat reply" ? `${outputLabel} result` : humanizeValue(preview.title, "Draft output"))}</h3>
public/control-center/pages/ai-command.js:4196:					<p class="aicmd-room-output-summary">${escapeHtml(structuredPreview.compactSummary || humanizeValue(preview.summary, "Guidance preview prepared."))}</p>
public/control-center/pages/ai-command.js:4201:						<div class="aicmd-v2-preview-structured-grid aicmd-room-output-blocks">
public/control-center/pages/ai-command.js:4203:								<div class="aicmd-v2-preview-section">
public/control-center/pages/ai-command.js:4204:									<span class="aicmd-v2-preview-label">${escapeHtml(block.label)}</span>
public/control-center/pages/ai-command.js:4205:									<${block.ordered ? "ol" : "ul"} class="${block.ordered ? "aicmd-v2-preview-steps" : "aicmd-v2-preview-list"}">
public/control-center/pages/ai-command.js:4215:						<strong>${escapeHtml(humanizeValue(preview.nextSafeAction, `Review in ${destination}.`))}</strong>
public/control-center/pages/ai-command.js:4217:					<div class="aicmd-room-output-confirmation">
public/control-center/pages/ai-command.js:4218:						<strong>${escapeHtml(humanizeValue(preview.safetyLabel, "Guidance only. No backend execution."))}</strong>
public/control-center/pages/ai-command.js:4219:						<span>${escapeHtml(humanizeValue(preview.confirmationNote, "Execution requires explicit confirmation in the destination workspace."))}</span>
public/control-center/pages/ai-command.js:4224:                                        <strong>No preview yet</strong>
public/control-center/pages/ai-command.js:4225:                                        <span>Choose Draft, Task Preview, Workflow Preview, or Handoff Preview, then create a review-ready preview from the conversation.</span>
public/control-center/pages/ai-command.js:4231:                                        <button id="aicmdV2PreviewSendBtn" class="aicmd-v2-btn-primary" type="button">${escapeHtml(routeActionLabel)}</button>
public/control-center/pages/ai-command.js:4236:                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, external sends, durable task creation, and workflow runs happen only in the owning destination workspace after confirmation.</div>
public/control-center/pages/ai-command.js:4238:                                <div class="aicmd-room-planned-note">No routed preview yet. Create a Draft, Task Preview, Workflow Preview, or Handoff Preview from the conversation first.</div>
public/control-center/pages/ai-command.js:4245:	const preview = asObject(session.outputPreview);
public/control-center/pages/ai-command.js:4247:	const approval = preview.confirmationRequired ? "Confirmation required" : (preview.outputType ? "Review ready" : "No draft yet");
public/control-center/pages/ai-command.js:4250:	const recentAt = asArray(session.responseHistory)[0]?.generatedAt || preview.generatedAt || "";
public/control-center/pages/ai-command.js:4282:				<li><span>Read preview aloud (browser)</span><strong class="${speechSynthAvailable ? "is-available" : "is-planned"}">${speechSynthAvailable ? "Available in this browser" : "Not supported in this browser"}</strong></li>
public/control-center/pages/ai-command.js:4326:                ? "Chat only. No workflow run, durable task, external handoff action, approval, publishing action, CRM update, or customer action was created."
public/control-center/pages/ai-command.js:4327:                : "Preview-safe. Chat tools require the protected AI chat route.";
public/control-center/pages/ai-command.js:4330:                : "AI chat route is not connected yet. Preview tools remain available.";
public/control-center/pages/ai-command.js:4348:        const toolHint = selectedToolHints.length ? selectedToolHints.join(", ") : "Draft and route guidance";
public/control-center/pages/ai-command.js:4414:                                                <span>Home handoff</span>
public/control-center/pages/ai-command.js:4441:                                                                <small>Please wait while the specialist prepares a review-ready response.</small>
public/control-center/pages/ai-command.js:4520:						data-aicmdv2-prompt-text="${escapeHtml(p.prompt || `${p.label}. ${p.sub}. Prepare this as a review-ready draft only; do not execute anything.`)}"
public/control-center/pages/ai-command.js:4536:	const destination = routeLabel(destinationRouteForSpecialist(session.modeId, asObject(session.outputPreview).outputType || "guidance"));
public/control-center/pages/ai-command.js:4557:			{ label: "Escalations", value: "Requires confirmation", present: false, scoped: true },
public/control-center/pages/ai-command.js:4565:				{ label: "Follow-ups", value: "Requires confirmation", present: false, scoped: true },
public/control-center/pages/ai-command.js:4566:				{ label: "Pipeline", value: "Operations handoff", present: true, scoped: true }
public/control-center/pages/ai-command.js:4598:					<span>Guidance only — no execution happens from this workspace without confirmation.</span>
public/control-center/pages/ai-command.js:4606:					<span>Publishing, approval, and workflow runs require your explicit confirmation in the right workspace.</span>
public/control-center/pages/ai-command.js:4610:					<span>Backend owns authority — AI Command prepares guidance, previews, and handoff context. It does not override execution controls or mutate Operations records.</span>
public/control-center/pages/ai-command.js:4619:	const preview = asObject(session.outputPreview);
public/control-center/pages/ai-command.js:4627:		...(preview.outputType ? [{
public/control-center/pages/ai-command.js:4629:			title: preview.title || "Draft preview",
public/control-center/pages/ai-command.js:4630:			body: preview.sourcePrompt || preview.summary || "",
public/control-center/pages/ai-command.js:4631:			time: preview.generatedAt
public/control-center/pages/ai-command.js:4652:				<div class="aicmd-v2-chat-empty">Saved responses and previews appear here during this session.</div>
public/control-center/pages/ai-command.js:4666:		description: "Talk to your AI team, run structured tasks, and turn intelligence into review-ready plans and routed handoffs."
public/control-center/pages/ai-command.js:4700:			const preview = asObject(savedOutput.preview);
public/control-center/pages/ai-command.js:4701:			if (preview.outputType) {
public/control-center/pages/ai-command.js:4702:				session.outputPreview = preview;
public/control-center/pages/ai-command.js:4703:				session.outputWorkspaceTab = outputTabFromPreview(preview);
public/control-center/pages/ai-command.js:4747:			session.workspaceTab = bridgeStatus.available ? "chat" : "preview";
public/control-center/pages/ai-command.js:4751:			session.workspaceTab = bridgeStatus.available ? "chat" : "preview";
public/control-center/pages/ai-command.js:4805:			session.routeSuggestions = [];
public/control-center/pages/ai-command.js:4836:		                        preview: session.outputPreview,
public/control-center/pages/ai-command.js:4856:		                session.routeSuggestions = [];
public/control-center/pages/ai-command.js:4865:		                session.workspaceTab = bridgeStatus.available ? "chat" : "preview";
public/control-center/pages/ai-command.js:4872:		                        preview: null,
public/control-center/pages/ai-command.js:4962:				updateStatus("Quick action loaded into composer. Review it, then ask or preview.");
public/control-center/pages/ai-command.js:5042:		// ── ASK SPECIALIST (P0.3.2C1 chat route) ────────────────
public/control-center/pages/ai-command.js:5060:		                        showMessage?.("AI chat route is not connected yet.");
public/control-center/pages/ai-command.js:5087:		                        preview: session.outputPreview,
public/control-center/pages/ai-command.js:5116:		                                safetyInstruction: "Chat only. No task/workflow/handoff/approval/publish/customer/CRM execution.",
public/control-center/pages/ai-command.js:5130:		                                throw new Error("AI chat route returned no response text.");
public/control-center/pages/ai-command.js:5158:		                        const routeSuggestion = asArray(response.routeSuggestions || result?.routeSuggestions)[0];
public/control-center/pages/ai-command.js:5165:                                                destinationRoute: asString(routeSuggestion?.route)
public/control-center/pages/ai-command.js:5191:		                                preview: session.outputPreview,
public/control-center/pages/ai-command.js:5201:		                        updateStatus("Specialist reply generated. No workflow/task/handoff was created.");
public/control-center/pages/ai-command.js:5208:		                                preview: session.outputPreview,
public/control-center/pages/ai-command.js:5222:                // Phase 1: stages draft locally from conversation context. No backend execution.
public/control-center/pages/ai-command.js:5227:                                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5233:                                if (!preview) return;
public/control-center/pages/ai-command.js:5234:                                persistSessionDraft(sessionKey, session, "Guidance preview prepared from conversation");
public/control-center/pages/ai-command.js:5236:                                updateStatus("Guidance preview prepared from conversation context.");
public/control-center/pages/ai-command.js:5237:                                showMessage?.(`${specLabel} guidance preview prepared from conversation.`);
public/control-center/pages/ai-command.js:5243:                // Phase 1: converts the current conversation into a task preview. No backend execution.
public/control-center/pages/ai-command.js:5252:                                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5258:                                if (!preview) return;
public/control-center/pages/ai-command.js:5259:                                persistSessionDraft(sessionKey, session, "Task preview prepared from conversation");
public/control-center/pages/ai-command.js:5260:                                updateStatus("Task draft preview prepared from conversation context. Review before creating durable tasks.");
public/control-center/pages/ai-command.js:5261:                                showMessage?.("Task draft preview prepared from conversation.");
public/control-center/pages/ai-command.js:5275:                                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5281:                                if (!preview) return;
public/control-center/pages/ai-command.js:5282:                                persistSessionDraft(sessionKey, session, "Workflow preview prepared from conversation");
public/control-center/pages/ai-command.js:5283:                                updateStatus("Workflow draft preview prepared from conversation context. No workflow run started.");
public/control-center/pages/ai-command.js:5284:                                showMessage?.("Workflow draft preview prepared from conversation.");
public/control-center/pages/ai-command.js:5290:                // Phase 1: converts the current conversation into a handoff preview. No backend write.
public/control-center/pages/ai-command.js:5291:                const handoffBtn = $("aicmdV2HandoffBtn");
public/control-center/pages/ai-command.js:5292:                if (handoffBtn) {
public/control-center/pages/ai-command.js:5293:                        handoffBtn.onclick = () => {
public/control-center/pages/ai-command.js:5297:                                        ? `Prepare a handoff summary for: ${value}`
public/control-center/pages/ai-command.js:5298:                                        : `Prepare a handoff summary from ${spec.label} for the current project state of ${projectName || "this project"}.`;
public/control-center/pages/ai-command.js:5299:                                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5301:                                        intent: "handoff",
public/control-center/pages/ai-command.js:5305:                                if (!preview) return;
public/control-center/pages/ai-command.js:5306:                                persistSessionDraft(sessionKey, session, "Handoff preview prepared from conversation");
public/control-center/pages/ai-command.js:5307:                                updateStatus("Handoff preview prepared from conversation context. Review destination before sending.");
public/control-center/pages/ai-command.js:5308:                                showMessage?.("Handoff preview prepared from conversation.");
public/control-center/pages/ai-command.js:5370:				session.routeSuggestions = [];
public/control-center/pages/ai-command.js:5427:					preview: session.outputPreview,
public/control-center/pages/ai-command.js:5441:		                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5449:		                        preview.title = latestResponse.responseTitle || preview.title;
public/control-center/pages/ai-command.js:5450:		                        preview.summary = latestResponse.responseText;
public/control-center/pages/ai-command.js:5451:		                        preview.generatedAt = latestResponse.generatedAt || nowIso();
public/control-center/pages/ai-command.js:5455:		                        preview: session.outputPreview,
public/control-center/pages/ai-command.js:5462:		                updateStatus("Conversation converted into a draft preview.");
public/control-center/pages/ai-command.js:5463:		                showMessage?.("Draft preview ready from conversation.");
public/control-center/pages/ai-command.js:5479:					routeSuggestions: [{ route: destination, label: routeLabel(destination), reason: "Specialist response destination" }],
public/control-center/pages/ai-command.js:5519:		const previewCopyBtn = $("aicmdV2PreviewCopyBtn");
public/control-center/pages/ai-command.js:5520:		if (previewCopyBtn) {
public/control-center/pages/ai-command.js:5521:			previewCopyBtn.onclick = async () => {
public/control-center/pages/ai-command.js:5543:		const previewUseBtn = $("aicmdV2PreviewUseBtn");
public/control-center/pages/ai-command.js:5544:		if (previewUseBtn) {
public/control-center/pages/ai-command.js:5545:			previewUseBtn.onclick = () => {
public/control-center/pages/ai-command.js:5562:		const previewSendBtn = $("aicmdV2PreviewSendBtn");
public/control-center/pages/ai-command.js:5563:		if (previewSendBtn) {
public/control-center/pages/ai-command.js:5564:			previewSendBtn.onclick = () => {
public/control-center/pages/ai-command.js:5568:					updateStatus("No destination route is available for this preview.");
public/control-center/pages/ai-command.js:5572:				const handoffRecord = {
public/control-center/pages/ai-command.js:5573:					id: `aicmd-preview-${Date.now()}`,
public/control-center/pages/ai-command.js:5585:							routeSuggestions: [{ route: destination, label: routeLabel(destination), reason: "Phase 2 preview destination" }],
public/control-center/pages/ai-command.js:5586:							phase2_output_preview: output
public/control-center/pages/ai-command.js:5591:				setSharedAiDraft(projectName || "__default__", handoffRecord.payload.draft_context);
public/control-center/pages/ai-command.js:5592:				setSharedHandoff(projectName || "__default__", destination, handoffRecord);
public/control-center/pages/ai-command.js:5598:		const previewSaveBtn = $("aicmdV2PreviewSaveBtn");
public/control-center/pages/ai-command.js:5599:		if (previewSaveBtn) {
public/control-center/pages/ai-command.js:5600:			previewSaveBtn.onclick = () => {
public/control-center/pages/ai-command.js:5604:					preview: output,
public/control-center/pages/ai-command.js:5613:		const previewReadBtn = $("aicmdV2PreviewReadBtn");
public/control-center/pages/ai-command.js:5614:		if (previewReadBtn) {
public/control-center/pages/ai-command.js:5615:			previewReadBtn.onclick = () => {
public/control-center/pages/ai-command.js:5619:					updateStatus("Read preview is not supported in this browser.");
public/control-center/pages/ai-command.js:5622:				const previewText = [humanizeValue(output.title), humanizeValue(output.summary)]
public/control-center/pages/ai-command.js:5625:				const utterance = new SpeechSynthesisUtterance(previewText || "Draft preview ready.");
public/control-center/pages/ai-command.js:5628:				updateStatus("Reading preview locally in browser.");
public/control-center/pages/ai-command.js:5632:		const previewClearBtn = $("aicmdV2PreviewClearBtn");
public/control-center/pages/ai-command.js:5633:		if (previewClearBtn) {
public/control-center/pages/ai-command.js:5634:			previewClearBtn.onclick = () => {
public/control-center/pages/ai-command/tool-dock.js:195:  const preview = truncatePromptText(source.text_preview || source.preview || source.notes || "");
public/control-center/pages/ai-command/tool-dock.js:209:  if (preview) lines.push(`- Text preview: ${preview}`);
public/control-center/pages/ai-command/tool-dock.js:335:    template: "Translate or adapt the selected text for the project target market. Keep the explanation in the user's chat language and prepare only review-ready copy."
public/control-center/pages/ai-command/tool-dock.js:342:    template: "Improve this draft for clarity, stronger value, better structure, and a cleaner CTA. Keep it safe and review-ready."
public/control-center/pages/ai-command/tool-dock.js:356:      destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:359:      template: "Create a campaign plan for {projectName}. Include objective, audience, offer, channels, phases, risks, and next best actions. Keep it review-ready only."
public/control-center/pages/ai-command/tool-dock.js:369:      destinations: ["chat-preview", "campaign-studio", "workflows", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:382:      destinations: ["chat-preview", "campaign-studio", "content-studio", "insights"],
public/control-center/pages/ai-command/tool-dock.js:395:      destinations: ["chat-preview", "campaign-studio", "content-studio", "ads-manager"],
public/control-center/pages/ai-command/tool-dock.js:408:      destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:410:      outputTypes: ["funnel_map", "content_needs", "handoff_points", "retention_notes"],
public/control-center/pages/ai-command/tool-dock.js:411:      template: "Map a funnel for {projectName}. Include awareness, consideration, conversion, retention, content needs, and handoff points."
public/control-center/pages/ai-command/tool-dock.js:418:      actionType: "preview",
public/control-center/pages/ai-command/tool-dock.js:421:      destinations: ["chat-preview", "workflows", "task", "campaign-studio"],
public/control-center/pages/ai-command/tool-dock.js:437:      destinations: ["chat-preview", "content-studio", "library", "media-studio", "publishing", "compliance"],
public/control-center/pages/ai-command/tool-dock.js:440:      template: "Use the Content Writer to create a new written output for {projectName}. First ask or infer the output type: company profile, product copy, email, blog article, landing page, contract draft, presentation outline, speech, FAQ, proposal, social post, or ad copy. Ask for sources if needed. Keep it review-ready and do not publish or send anything."
public/control-center/pages/ai-command/tool-dock.js:466:      template: "Translate and localize the current text for {projectName}. Ask for target language and market if missing. Preserve brand tone, adapt CTA and wording for the target audience, and keep the result review-ready."
public/control-center/pages/ai-command/tool-dock.js:486:      actionType: "preview",
public/control-center/pages/ai-command/tool-dock.js:489:      destinations: ["preview", "content-studio", "compliance"],
public/control-center/pages/ai-command/tool-dock.js:528:      destinations: ["chat-preview", "content-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:538:      actionType: "route",
public/control-center/pages/ai-command/tool-dock.js:539:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:541:      destinations: ["content-studio", "library", "media-studio", "publishing", "compliance", "task", "handoff"],
public/control-center/pages/ai-command/tool-dock.js:542:      sourceTypes: ["current_draft", "preview", "current_chat"],
public/control-center/pages/ai-command/tool-dock.js:543:      outputTypes: ["content_studio_draft", "library_save", "media_brief", "publishing_package", "compliance_review", "task_preview", "handoff_preview"],
public/control-center/pages/ai-command/tool-dock.js:544:      template: "Prepare safe routing for this Content Writer output for {projectName}. Ask the destination: Content Studio, Save to Library, Prepare Media Brief, Publishing package, Compliance review, Task, or Handoff. Do not route or execute before review."
public/control-center/pages/ai-command/tool-dock.js:556:      destinations: ["chat-preview", "media-studio", "library", "content-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:569:      destinations: ["chat-preview", "media-studio", "library"],
public/control-center/pages/ai-command/tool-dock.js:582:      destinations: ["chat-preview", "media-studio", "library"],
public/control-center/pages/ai-command/tool-dock.js:595:      destinations: ["chat-preview", "media-studio", "library", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:608:      destinations: ["chat-preview", "media-studio", "content-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:621:      destinations: ["chat-preview", "media-studio", "governance", "library"],
public/control-center/pages/ai-command/tool-dock.js:637:      destinations: ["chat-preview", "media-studio", "content-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:650:      destinations: ["chat-preview", "media-studio", "library", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:663:      destinations: ["chat-preview", "media-studio", "workflows", "library"],
public/control-center/pages/ai-command/tool-dock.js:676:      destinations: ["chat-preview", "media-studio", "content-studio"],
public/control-center/pages/ai-command/tool-dock.js:689:      destinations: ["chat-preview", "media-studio", "publishing", "ads-manager"],
public/control-center/pages/ai-command/tool-dock.js:702:      actionType: "preview",
public/control-center/pages/ai-command/tool-dock.js:705:      destinations: ["chat-preview", "publishing", "governance", "content-studio", "media-studio"],
public/control-center/pages/ai-command/tool-dock.js:718:      destinations: ["chat-preview", "publishing", "content-studio", "media-studio"],
public/control-center/pages/ai-command/tool-dock.js:729:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:731:      destinations: ["chat-preview", "publishing", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:744:      destinations: ["chat-preview", "publishing", "content-studio", "insights"],
public/control-center/pages/ai-command/tool-dock.js:755:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:757:      destinations: ["chat-preview", "governance", "publishing", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:759:      outputTypes: ["approval_pack", "risk_summary", "asset_checklist", "confirmation_list"],
public/control-center/pages/ai-command/tool-dock.js:760:      template: "Prepare an approval package for {projectName}. Include final copy summary, risk notes, assets checklist, and required confirmations."
public/control-center/pages/ai-command/tool-dock.js:773:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
public/control-center/pages/ai-command/tool-dock.js:786:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
public/control-center/pages/ai-command/tool-dock.js:799:      destinations: ["chat-preview", "ads-manager", "insights", "campaign-studio"],
public/control-center/pages/ai-command/tool-dock.js:812:      destinations: ["chat-preview", "ads-manager", "media-studio", "insights", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:825:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
public/control-center/pages/ai-command/tool-dock.js:841:      destinations: ["chat-preview", "insights", "content-studio", "library"],
public/control-center/pages/ai-command/tool-dock.js:854:      destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:867:      destinations: ["chat-preview", "insights", "content-studio", "library"],
public/control-center/pages/ai-command/tool-dock.js:880:      destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:893:      destinations: ["chat-preview", "insights", "content-studio", "campaign-studio"],
public/control-center/pages/ai-command/tool-dock.js:909:      destinations: ["chat-preview", "governance", "content-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:922:      destinations: ["chat-preview", "governance", "content-studio"],
public/control-center/pages/ai-command/tool-dock.js:935:      destinations: ["chat-preview", "governance", "library", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:948:      destinations: ["chat-preview", "governance", "workflows", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:959:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:961:      destinations: ["chat-preview", "governance", "publishing", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:977:      destinations: ["chat-preview", "workflows", "task", "content-studio", "media-studio"],
public/control-center/pages/ai-command/tool-dock.js:978:      sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:988:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:990:      destinations: ["chat-preview", "workflows", "task", "handoff"],
public/control-center/pages/ai-command/tool-dock.js:991:      sourceTypes: ["current_chat", "handoff_summary", "operations_snapshot", "approval_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:996:      id: "handoff",
public/control-center/pages/ai-command/tool-dock.js:1001:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:1003:      destinations: ["chat-preview", "handoff", "workflows", "content-studio", "media-studio", "publishing", "governance"],
public/control-center/pages/ai-command/tool-dock.js:1004:      sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "publishing_package", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1005:      outputTypes: ["handoff_summary", "destination_brief", "required_inputs", "review_notes"],
public/control-center/pages/ai-command/tool-dock.js:1006:      template: "Prepare a handoff summary for {projectName}. Include context, destination workspace, owner, required inputs, and review notes."
public/control-center/pages/ai-command/tool-dock.js:1016:      destinations: ["chat-preview", "workflows", "campaign-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:1029:      destinations: ["chat-preview", "workflows", "governance", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:1043:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:1045:      destinations: ["chat-preview", "operations-centers", "task", "governance"],
public/control-center/pages/ai-command/tool-dock.js:1056:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:1058:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:1068:      actionType: "preview",
public/control-center/pages/ai-command/tool-dock.js:1071:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:1084:      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1100:      destinations: ["chat-preview", "workflows", "content-studio", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1111:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:1113:      destinations: ["chat-preview", "content-studio", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1126:      destinations: ["chat-preview", "workflows", "content-studio", "governance"],
public/control-center/pages/ai-command/tool-dock.js:1137:      safetyLevel: "confirmation_required",
public/control-center/pages/ai-command/tool-dock.js:1139:      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1287:          Preparation-only: this drawer creates a composer-ready instruction. It does not publish, send, route, create CRM records, run workflows, or mutate backend data.
public/control-center/pages/ai-command/tool-dock.js:1332:            data-aicmd-tool-dock-destinations="${safe(joinMetaList(getToolMetaList(tool, "destinations", ["chat-preview"])))}"
public/control-center/pages/ai-command/tool-dock.js:1446:  const destination = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-destination-select]", "Chat preview");
public/control-center/pages/ai-command/tool-dock.js:1484:    `Create the requested ${output.toLowerCase()} as review-ready content.`,
public/control-center/pages/ai-command/tool-dock.js:1503:    `Prepare the output for ${destination}, but do not send, save, route, publish, or create records automatically.`,
public/control-center/pages/ai-command/tool-dock.js:1506:    "- Prepare review-ready output only.",
public/control-center/pages/ai-command/tool-dock.js:1507:    "- Do not publish, send, route, save, overwrite, create CRM records, or run workflows.",
public/control-center/pages/ai-command/tool-dock.js:1521:  const destination = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-destination-select]", "Chat preview");
public/control-center/pages/ai-command/tool-dock.js:1624:    "data-aicmd-tool-dock-destinations": joinMetaList(getToolMetaList(tool, "destinations", tool.route ? [tool.route] : ["chat-preview"])),
public/control-center/pages/ai-command/tool-dock.js:1742:        updateStatus(`${label} loaded into composer from smart drawer. Review it, then ask or preview.`);
public/control-center/pages/ai-command/tool-dock.js:1788:        updateStatus(`${label} loaded into composer. Review it, then ask or preview.`);

## Output workspace copy
                                <div id="aicmdV2Status" class="aicmd-v2-composer-hint"></div>
			</div>
		`;
}

function renderPhase2PreviewPanel(session, escapeHtml) {
	const preview = asObject(session.outputPreview);
	const hasPreview = Boolean(preview.outputType && preview.title);
	if (!hasPreview) {
		return `
			<section class="aicmd-v2-preview">
				<div class="aicmd-v2-preview-head">
					<div>
						<h3 class="aicmd-v2-preview-title">Preview</h3>
						<p class="aicmd-v2-preview-subtitle">Generated content, draft packages, and routed handoffs appear here.</p>
					</div>
					<span class="aicmd-v2-preview-status aicmd-v2-preview-status-empty">Waiting</span>
				</div>
				<div class="aicmd-v2-preview-empty-state">
					<strong>No preview yet</strong>
					<span>Ask a specialist or send the chat response to preview.</span>
				</div>
			</section>
		`;
	}

	const structuredPreview = buildStructuredPreviewBlocks(preview);
	const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
	const specialist = session.teamMode === "team"
		? { id: "team", label: "Full Team" }
		: getPhase1SpecialistById(preview.specialistId || session.modeId);
	const outputLabel = hasPreview ? formatOutputTypeLabel(preview.outputType) : titleCase(activeTab);
	const routeActionLabel = destination === "Content Studio"
		? "Send Draft to Content Studio"
		: destination === "Publishing"
			? "Route Draft to Publishing"
			: `Route Draft to ${destination}`;
	const confirmationLabel = hasPreview
		? (preview.confirmationRequired ? "Confirmation required" : "Review before handoff route")
		: "Waiting for output";

	return `
		<section class="aicmd-v2-preview">
			<div class="aicmd-v2-preview-head">
				<div>
					<h3 class="aicmd-v2-preview-title">Preview</h3>
					<p class="aicmd-v2-preview-subtitle">${escapeHtml(humanizeValue(preview.sourcePrompt, "Review the generated specialist output."))}</p>
				</div>
				<span class="aicmd-v2-preview-status">${escapeHtml(titleCase(preview.status || "draft_preview"))}</span>
			</div>

			<div class="aicmd-v2-preview-meta">
				<span class="aicmd-v2-preview-chip"><strong>Type:</strong> ${escapeHtml(formatOutputTypeLabel(preview.outputType))}</span>
				<span class="aicmd-v2-preview-chip"><strong>Specialist:</strong> ${escapeHtml(specialist.label || "Specialist")}</span>
				<span class="aicmd-v2-preview-chip"><strong>Destination:</strong> ${escapeHtml(destination)}</span>
				<span class="aicmd-v2-preview-chip"><strong>Generated:</strong> ${escapeHtml(formatTime(preview.generatedAt))}</span>
			</div>

			<div class="aicmd-v2-preview-body">
				<p class="aicmd-v2-preview-what-heading">Prepared output</p>
				<h4 class="aicmd-v2-preview-output-title">${escapeHtml(humanizeValue(preview.title, "Draft output"))}</h4>
				<p class="aicmd-v2-preview-summary">${escapeHtml(humanizeValue(preview.summary, "Guidance preview prepared."))}</p>

				${structuredPreview.draftText ? `
					<div class="aicmd-v2-preview-draft">${escapeHtml(structuredPreview.draftText)}</div>
				` : ""}

				${structuredPreview.blocks.length ? `
					<div class="aicmd-v2-preview-structured-grid aicmd-room-output-blocks">
						${structuredPreview.blocks.map((block) => `
							<div class="aicmd-v2-preview-section">
								<span class="aicmd-v2-preview-label">${escapeHtml(block.label)}</span>
								<${block.ordered ? "ol" : "ul"} class="${block.ordered ? "aicmd-v2-preview-steps" : "aicmd-v2-preview-list"}">
									${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
								</${block.ordered ? "ol" : "ul"}>
							</div>
						`).join("")}
					</div>
				` : ""}

				<div class="aicmd-v2-preview-section">
					<span class="aicmd-v2-preview-label">What you can do next</span>
					<p class="aicmd-v2-preview-next-action">${escapeHtml(humanizeValue(preview.nextSafeAction, `Review in ${destination}.`))}</p>
				</div>

				<div class="aicmd-v2-preview-section">
					<span class="aicmd-v2-preview-label">What requires confirmation</span>
					<p class="aicmd-v2-preview-confirmation">${escapeHtml(humanizeValue(preview.safetyLabel, "Guidance only. No backend execution."))}</p>
					<p class="aicmd-v2-preview-safety">${escapeHtml(humanizeValue(preview.confirmationNote, "Execution requires explicit confirmation in the destination workspace."))}</p>
				</div>
			</div>

			<div class="aicmd-v2-preview-actions">
				<button id="aicmdV2LegacyPreviewCopyBtn" class="aicmd-v2-btn-secondary" type="button">Copy</button>
				<button id="aicmdV2LegacyPreviewUseBtn" class="aicmd-v2-btn-secondary" type="button">Use in Composer</button>
				<button id="aicmdV2LegacyPreviewSendBtn" class="aicmd-v2-btn-secondary" type="button">Route Draft</button>
				<button id="aicmdV2LegacyPreviewSaveBtn" class="aicmd-v2-btn-ghost" type="button">Save</button>
				<button id="aicmdV2LegacyPreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${typeof speechSynthesis === "undefined" ? "disabled" : ""}>Read preview</button>
				<button id="aicmdV2LegacyPreviewClearBtn" class="aicmd-v2-btn-ghost" type="button">Clear preview</button>
			</div>
		</section>
	`;
}

function renderAiRoomOutputWorkspace(session, aiContext, escapeHtml) {
	const preview = asObject(session.outputPreview);
	const hasPreview = Boolean(preview.outputType && preview.title);
	const activeTab = getOutputWorkspaceTab(session);
	const structuredPreview = hasPreview ? buildStructuredPreviewBlocks(preview) : { blocks: [], draftText: "", compactSummary: "" };
	const languagePlan = getWorkspaceLanguagePlan(aiContext);
	const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
	const specialist = session.teamMode === "team"
		? { id: "team", label: "Full Team" }
		: getPhase1SpecialistById(preview.specialistId || session.modeId);
	const outputLabel = hasPreview ? formatOutputTypeLabel(preview.outputType) : titleCase(activeTab);
	const routeActionLabel = destination === "Content Studio"
		? "Send Draft to Content Studio"
		: destination === "Publishing"
			? "Route Draft to Publishing"
			: `Route Draft to ${destination}`;
	const confirmationLabel = hasPreview
		? (preview.confirmationRequired ? "Confirmation required" : "Review before handoff route")
		: "Waiting for output";

	return `
		<section class="aicmd-room-output-workspace">
			<div class="aicmd-room-output-head">
				<div>
					<span class="aicmd-room-kicker">Output Workspace</span>
					<h2>Drafts, task previews, workflow previews, handoffs</h2>
                                        <p>${hasPreview ? "Review the result, then route draft context to the next workspace." : "Create a preview from the conversation before routing work to another workspace."}</p>
				</div>
				<span class="aicmd-room-output-state">${escapeHtml(confirmationLabel)}</span>
			</div>

						${hasPreview ? `
							<div class="aicmd-room-output-tabs mhos-workflow-chain" role="tablist" aria-label="Output workspace tabs">
								${AI_ROOM_OUTPUT_TABS.map((tab) => `
									<button
										type="button"
										class="aicmd-room-output-tab mhos-workflow-step${activeTab === tab.id ? " mhos-workflow-active is-active" : ""}"
										data-aicmdv2-output-tab="${escapeHtml(tab.id)}"
										role="tab"
										aria-selected="${activeTab === tab.id ? "true" : "false"}"
									>
										<strong>${escapeHtml(tab.label)}</strong>
										<span>${escapeHtml(tab.helper)}</span>
									</button>
								`).join("")}
							</div>

                                <div class="aicmd-room-output-meta">
                                        <span><strong>Market</strong>${escapeHtml(languagePlan.market)}</span>
                                        <span><strong>Language</strong>${escapeHtml(languagePlan.publishLanguage)}</span>
                                        <span><strong>Channel</strong>${escapeHtml(destination)}</span>
                                        <span><strong>Target</strong>${escapeHtml(aiContext.projectName || "Current project")}</span>
                                </div>
                        ` : ""}

			${hasPreview ? `
				<div class="aicmd-room-output-body">
					<div class="aicmd-room-output-title-row">
						<span>${escapeHtml(outputLabel)}</span>
						<span>${escapeHtml(specialist.label || "Specialist")}</span>
					</div>
					<h3>${escapeHtml(!humanizeValue(preview.title, "") || humanizeValue(preview.title, "").toLowerCase() === "chat reply" ? `${outputLabel} result` : humanizeValue(preview.title, "Draft output"))}</h3>
					<p class="aicmd-room-output-summary">${escapeHtml(structuredPreview.compactSummary || humanizeValue(preview.summary, "Guidance preview prepared."))}</p>

					

					${structuredPreview.blocks.length ? `
						<div class="aicmd-v2-preview-structured-grid aicmd-room-output-blocks">
							${structuredPreview.blocks.map((block) => `
								<div class="aicmd-v2-preview-section">
									<span class="aicmd-v2-preview-label">${escapeHtml(block.label)}</span>
									<${block.ordered ? "ol" : "ul"} class="${block.ordered ? "aicmd-v2-preview-steps" : "aicmd-v2-preview-list"}">
										${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
									</${block.ordered ? "ol" : "ul"}>
								</div>
							`).join("")}
						</div>
					` : ""}

					<div class="aicmd-room-output-next">
						<span>Next step</span>
						<strong>${escapeHtml(humanizeValue(preview.nextSafeAction, `Review in ${destination}.`))}</strong>
					</div>
					<div class="aicmd-room-output-confirmation">
						<strong>${escapeHtml(humanizeValue(preview.safetyLabel, "Guidance only. No backend execution."))}</strong>
						<span>${escapeHtml(humanizeValue(preview.confirmationNote, "Execution requires explicit confirmation in the destination workspace."))}</span>
					</div>
				</div>
			` : `
				<div class="aicmd-room-output-empty">
                                        <strong>No preview yet</strong>
                                        <span>Choose Draft, Task Preview, Workflow Preview, or Handoff Preview, then create a review-ready preview from the conversation.</span>
				</div>
			`}

                        ${hasPreview ? `
                                <div class="aicmd-room-output-actions">
                                        <button id="aicmdV2PreviewSendBtn" class="aicmd-v2-btn-primary" type="button">${escapeHtml(routeActionLabel)}</button>
                                        <button id="aicmdV2PreviewCopyBtn" class="aicmd-v2-btn-secondary" type="button">Copy</button>
                                        <button id="aicmdV2PreviewUseBtn" class="aicmd-v2-btn-secondary" type="button">Use in Composer</button>
                                        <button id="aicmdV2PreviewClearBtn" class="aicmd-v2-btn-ghost" type="button">Clear</button>
                                </div>
                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, external sends, durable task creation, and workflow runs happen only in the owning destination workspace after confirmation.</div>
                        ` : `
                                <div class="aicmd-room-planned-note">No routed preview yet. Create a Draft, Task Preview, Workflow Preview, or Handoff Preview from the conversation first.</div>
                        `}
		</section>
	`;
}

function renderAiRoomStatusStrip(aiContext, session, bridgeStatus, escapeHtml) {
	const preview = asObject(session.outputPreview);

## Safety panel copy
		<div class="aicmd-v2-safety">
			<div class="aicmd-v2-safety-head">
				<span class="aicmd-v2-safety-icon">🔒</span>
				<span class="aicmd-v2-safety-label">How this workspace operates</span>
			</div>
			<div class="aicmd-v2-safety-rules">
				<div class="aicmd-v2-safety-rule">
					<span class="aicmd-v2-safety-bullet">●</span>
					<span>Guidance only — no execution happens from this workspace without confirmation.</span>
				</div>
				<div class="aicmd-v2-safety-rule">
					<span class="aicmd-v2-safety-bullet">●</span>
					<span>Drafts are not execution — prepared content stays local until you act on it.</span>
				</div>
				<div class="aicmd-v2-safety-rule">
					<span class="aicmd-v2-safety-bullet">●</span>
					<span>Publishing, approval, and workflow runs require your explicit confirmation in the right workspace.</span>
				</div>
				<div class="aicmd-v2-safety-rule">
					<span class="aicmd-v2-safety-bullet">●</span>
					<span>Backend owns authority — AI Command prepares guidance, previews, and handoff context. It does not override execution controls or mutate Operations records.</span>
				</div>
			</div>
		</div>
	`;
}

function renderPhase4HistoryPanel(session, escapeHtml) {
	const responses = asArray(session.responseHistory);
	const preview = asObject(session.outputPreview);
	const items = [
