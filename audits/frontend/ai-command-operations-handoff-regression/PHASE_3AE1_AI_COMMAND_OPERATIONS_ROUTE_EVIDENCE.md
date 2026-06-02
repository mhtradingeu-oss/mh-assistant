# PHASE 3AE.1 — AI Command Operations Route Evidence

## AI Command operations route references
91:                id: "operations",
102:                routeHint: "operations-centers"
115:	executive: "operations",
126:	customer_operations: "customer_ops",
132:	admin: "operations"
245:		id: "operations",
252:		cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],
253:		destinations: ["Workflows", "Operations Centers", "AI Command"],
266:		destinations: ["Unified Inbox", "Operations Centers", "Integrations"],
267:		safetyNote: "Customer operations outputs are drafts only. Sending replies, ticket creation, and escalations require confirmation in the owning surface.",
279:		destinations: ["CRM", "Workflows", "Operations Centers"],
335:	operations: [
345:		{ label: "Prepare escalation", sub: "Route support, sales, or operations" }
351:		{ label: "Prepare sales handoff", sub: "Route context to operations" }
394:	operations: "OL",
481:	operations: [
599:		id: "operations",
623:			SPECIALIST_DEFS.find((s) => s.id === "operations") ||
637:		if (/act as the operations lead/i.test(text)) return "operations";
638:		if (/act as the customer operations lead|act as customer ops/i.test(text)) return "customer_ops";
642:		if (classified.resolvedModeId && classified.resolvedModeId !== "operations") {
701:	if (/act as the operations lead/i.test(text)) return "operations";
702:	if (/act as the customer operations lead|act as customer ops/i.test(text)) return "customer_ops";
705:	if (classified.resolvedModeId && classified.resolvedModeId !== "operations") {
936:			modeId: "operations",
1157:        session.modeId = asString(record.modeId || session.modeId || "operations");
1259:	const rawId = getAiRoomRoleId(specialistId || "operations");
1270:	if (id === "operations") return outputType === "task" ? "task-center" : "workflows";
1271:	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
1279:        const specialistId = getAiRoomRoleId(session?.modeId || "operations");
1313:                return { outputType, destinationRoute: "task-center" };
1354:        const destinationRoute = explicitDestination || destinationRouteForSpecialist(session?.modeId || "operations", outputType);
1369:		"operations-centers": "Operations Centers",
1370:		"task-center": "Task Center",
1380:	const specialistId = asString(specialist?.id || "operations");
1577:			title: outputType === "task" ? "Ticket Draft: Customer operations follow-up" : "Customer Ops Draft: Thread, reply, and routing",
1578:			summary: "Customer operations draft prepared with safe reply language, ticket notes, SLA review, and escalation guardrails.",
1579:			mainOutput: "Review the customer context, confirm missing details, then route the draft through the owning support, sales, or operations surface.",
1587:				"Owner: support, sales, or operations to be confirmed before creation."
1591:				"SLA and escalation decisions require confirmation in the owning operations surface."
1593:			nextStep: "Review the draft, confirm the destination team, then route through support, sales, or operations.",
1630:			nextStep: "Review the lead fit, confirm owner, then route the handoff to operations or the CRM surface.",
1642:	if (specialistId === "operations") {
1677:		? { id: "operations", label: "Full Team" }
1717:		destinationRoute: outputType === "task" ? "task-center" : "workflows",
1969:		operations: ["task plan", "workflow", "handoff", "approval", "timeline", "execution plan", "route", "publish", "status", "priority", "priorities", "blocking", "blocker", "readiness", "next", "do next"],
1984:	const top = scores[0] || { modeId: selectedModeId || "operations" };
1989:		resolvedModeId: top.modeId || selectedModeId || "operations",
2255:		case "operations":
2355:	"operations-centers": "Operations Centers",
2356:	"task-center": "Task Center",
2357:	"queue-center": "Queue Center",
2358:	"job-monitor": "Job Monitor",
2359:	"notification-center": "Notification Center",
2371:	workflows: "operations",
2374:	integrations: "operations",
2375:	settings: "operations",
2377:	"operations-centers": "operations",
2378:	"task-center": "operations",
2379:	"queue-center": "operations",
2380:	"job-monitor": "operations",
2381:	"notification-center": "operations",
2384:	setup: "operations",
2385:	workspace: "operations"
2410:	operation: "operations-centers",
2411:	operations: "operations-centers",
2412:	tasks: "task-center",
2413:	queue: "queue-center",
2414:	jobs: "job-monitor",
2415:	notifications: "notification-center",
2462:function normalizeAiInboundSpecialistId(value, fallback = "operations") {
2579:		"operations",
2580:		"operations"
2637:function applyDurableAiHandoff(projectName, operations, session, consumeProjectHandoff, showMessage) {
2638:	const handoff = getSharedHandoff(projectName, "ai-command", operations);
2800:      AGENT_CARDS.find((agent) => agent.id === "operations") ||
3485:	return asString(value || "operations")
3488:		.replace(/[^a-z0-9_]+/g, "_") || "operations";
3555:	if (session?.teamMode === "team") return tool.intent === "task" ? "task-center" : "workflows";
3557:	return destinationRouteForSpecialist(session?.modeId || "operations", outputType);
3794:        if (roleId === "operations" || roleId === "customer_ops") return `${label} is preparing your task handoff...`;
3809:		? "Team orchestration across strategy, writing, media/video, compliance, publishing, customer operations, sales/CRM, and operations"
3846:	return destinationRouteForSpecialist(session?.modeId || "operations", getCanonicalToolIntent(tool));
4346:                : (SPECIALIST_SUGGESTED_PROMPTS[promptModeId] || SPECIALIST_SUGGESTED_PROMPTS.operations);
4507:		: (SPECIALIST_SUGGESTED_PROMPTS[promptModeId] || SPECIALIST_SUGGESTED_PROMPTS.operations);
4550:		{ label: "Operations", value: state.data.operations ? "Snapshot available" : "No operations snapshot", present: Boolean(state.data.operations) }
4739:		const operations = asObject(selectOperationsSnapshot(state));
4740:		applyDurableAiHandoff(sessionKey, operations, session, consumeProjectHandoff, showMessage);
4909:                                const specId = btn.getAttribute("data-aicmdv2-specialist") || "operations";

## AI Command tool dock operations references
355:      frontendOwnerPage: "campaign-studio",
356:      destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows"],
368:      frontendOwnerPage: "campaign-studio",
369:      destinations: ["chat-preview", "campaign-studio", "workflows", "publishing"],
381:      frontendOwnerPage: "campaign-studio",
382:      destinations: ["chat-preview", "campaign-studio", "content-studio", "insights"],
394:      frontendOwnerPage: "campaign-studio",
395:      destinations: ["chat-preview", "campaign-studio", "content-studio", "ads-manager"],
407:      frontendOwnerPage: "campaign-studio",
408:      destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows", "publishing"],
420:      frontendOwnerPage: "workflows",
421:      destinations: ["chat-preview", "workflows", "task", "campaign-studio"],
436:      frontendOwnerPage: "content-studio",
437:      destinations: ["chat-preview", "content-studio", "library", "media-studio", "publishing", "compliance"],
449:      frontendOwnerPage: "ai-command",
450:      destinations: ["composer", "content-studio"],
462:      frontendOwnerPage: "content-studio",
463:      destinations: ["composer", "content-studio"],
475:      frontendOwnerPage: "ai-command",
476:      destinations: ["composer", "content-studio"],
488:      frontendOwnerPage: "ai-command",
489:      destinations: ["preview", "content-studio", "compliance"],
501:      frontendOwnerPage: "library",
502:      destinations: ["library", "ai-command", "content-studio"],
514:      frontendOwnerPage: "content-studio",
515:      destinations: ["content-studio", "insights", "library"],
527:      frontendOwnerPage: "content-studio",
528:      destinations: ["chat-preview", "content-studio", "publishing"],
540:      frontendOwnerPage: "ai-command",
541:      destinations: ["content-studio", "library", "media-studio", "publishing", "compliance", "task", "handoff"],
555:      frontendOwnerPage: "media-studio",
556:      destinations: ["chat-preview", "media-studio", "library", "content-studio", "publishing"],
568:      frontendOwnerPage: "media-studio",
569:      destinations: ["chat-preview", "media-studio", "library"],
581:      frontendOwnerPage: "media-studio",
582:      destinations: ["chat-preview", "media-studio", "library"],
594:      frontendOwnerPage: "media-studio",
595:      destinations: ["chat-preview", "media-studio", "library", "workflows"],
607:      frontendOwnerPage: "media-studio",
608:      destinations: ["chat-preview", "media-studio", "content-studio", "publishing"],
620:      frontendOwnerPage: "media-studio",
621:      destinations: ["chat-preview", "media-studio", "governance", "library"],
636:      frontendOwnerPage: "media-studio",
637:      destinations: ["chat-preview", "media-studio", "content-studio", "publishing"],
649:      frontendOwnerPage: "media-studio",
650:      destinations: ["chat-preview", "media-studio", "library", "publishing"],
662:      frontendOwnerPage: "media-studio",
663:      destinations: ["chat-preview", "media-studio", "workflows", "library"],
675:      frontendOwnerPage: "media-studio",
676:      destinations: ["chat-preview", "media-studio", "content-studio"],
688:      frontendOwnerPage: "media-studio",
689:      destinations: ["chat-preview", "media-studio", "publishing", "ads-manager"],
704:      frontendOwnerPage: "publishing",
705:      destinations: ["chat-preview", "publishing", "governance", "content-studio", "media-studio"],
717:      frontendOwnerPage: "publishing",
718:      destinations: ["chat-preview", "publishing", "content-studio", "media-studio"],
730:      frontendOwnerPage: "publishing",
731:      destinations: ["chat-preview", "publishing", "workflows"],
743:      frontendOwnerPage: "publishing",
744:      destinations: ["chat-preview", "publishing", "content-studio", "insights"],
756:      frontendOwnerPage: "governance",
757:      destinations: ["chat-preview", "governance", "publishing", "workflows"],
772:      frontendOwnerPage: "ads-manager",
773:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
785:      frontendOwnerPage: "ads-manager",
786:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
798:      frontendOwnerPage: "ads-manager",
799:      destinations: ["chat-preview", "ads-manager", "insights", "campaign-studio"],
811:      frontendOwnerPage: "ads-manager",
812:      destinations: ["chat-preview", "ads-manager", "media-studio", "insights", "workflows"],
824:      frontendOwnerPage: "ads-manager",
825:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
840:      frontendOwnerPage: "insights",
841:      destinations: ["chat-preview", "insights", "content-studio", "library"],
853:      frontendOwnerPage: "insights",
854:      destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
866:      frontendOwnerPage: "insights",
867:      destinations: ["chat-preview", "insights", "content-studio", "library"],
879:      frontendOwnerPage: "insights",
880:      destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
892:      frontendOwnerPage: "insights",
893:      destinations: ["chat-preview", "insights", "content-studio", "campaign-studio"],
908:      frontendOwnerPage: "governance",
909:      destinations: ["chat-preview", "governance", "content-studio", "publishing"],
921:      frontendOwnerPage: "governance",
922:      destinations: ["chat-preview", "governance", "content-studio"],
934:      frontendOwnerPage: "governance",
935:      destinations: ["chat-preview", "governance", "library", "workflows"],
947:      frontendOwnerPage: "governance",
948:      destinations: ["chat-preview", "governance", "workflows", "publishing"],
960:      frontendOwnerPage: "governance",
961:      destinations: ["chat-preview", "governance", "publishing", "workflows"],
976:      frontendOwnerPage: "workflows",
977:      destinations: ["chat-preview", "workflows", "task", "content-studio", "media-studio"],
989:      frontendOwnerPage: "workflows",
990:      destinations: ["chat-preview", "workflows", "task", "handoff"],
1002:      frontendOwnerPage: "workflows",
1003:      destinations: ["chat-preview", "handoff", "workflows", "content-studio", "media-studio", "publishing", "governance"],
1015:      frontendOwnerPage: "workflows",
1016:      destinations: ["chat-preview", "workflows", "campaign-studio", "publishing"],
1028:      frontendOwnerPage: "workflows",
1029:      destinations: ["chat-preview", "workflows", "governance", "publishing"],
1044:      frontendOwnerPage: "operations-centers",
1045:      destinations: ["chat-preview", "operations-centers", "task", "governance"],
1057:      frontendOwnerPage: "operations-centers",
1058:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
1070:      frontendOwnerPage: "operations-centers",
1071:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
1083:      frontendOwnerPage: "operations-centers",
1084:      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
1099:      frontendOwnerPage: "workflows",
1100:      destinations: ["chat-preview", "workflows", "content-studio", "sales-crm-draft"],
1112:      frontendOwnerPage: "workflows",
1113:      destinations: ["chat-preview", "content-studio", "workflows", "sales-crm-draft"],
1125:      frontendOwnerPage: "workflows",
1126:      destinations: ["chat-preview", "workflows", "content-studio", "governance"],
1138:      frontendOwnerPage: "workflows",
1139:      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],
1331:            data-aicmd-tool-dock-owner="${safe(tool.frontendOwnerPage || "ai-command")}"
1332:            data-aicmd-tool-dock-destinations="${safe(joinMetaList(getToolMetaList(tool, "destinations", ["chat-preview"])))}"
1574:  const rawDestinations = btn.getAttribute("data-aicmd-tool-dock-destinations") || "";
1623:    "data-aicmd-tool-dock-owner": tool.frontendOwnerPage || tool.owner || "ai-command",
1624:    "data-aicmd-tool-dock-destinations": joinMetaList(getToolMetaList(tool, "destinations", tool.route ? [tool.route] : ["chat-preview"])),

## Cross-page references after Operations closeout
public/control-center/pages/ai-command.js:102:                routeHint: "operations-centers"
public/control-center/pages/ai-command.js:1270:	if (id === "operations") return outputType === "task" ? "task-center" : "workflows";
public/control-center/pages/ai-command.js:1271:	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
public/control-center/pages/ai-command.js:1313:                return { outputType, destinationRoute: "task-center" };
public/control-center/pages/ai-command.js:1369:		"operations-centers": "Operations Centers",
public/control-center/pages/ai-command.js:1370:		"task-center": "Task Center",
public/control-center/pages/ai-command.js:1717:		destinationRoute: outputType === "task" ? "task-center" : "workflows",
public/control-center/pages/ai-command.js:2355:	"operations-centers": "Operations Centers",
public/control-center/pages/ai-command.js:2356:	"task-center": "Task Center",
public/control-center/pages/ai-command.js:2357:	"queue-center": "Queue Center",
public/control-center/pages/ai-command.js:2358:	"job-monitor": "Job Monitor",
public/control-center/pages/ai-command.js:2359:	"notification-center": "Notification Center",
public/control-center/pages/ai-command.js:2377:	"operations-centers": "operations",
public/control-center/pages/ai-command.js:2378:	"task-center": "operations",
public/control-center/pages/ai-command.js:2379:	"queue-center": "operations",
public/control-center/pages/ai-command.js:2380:	"job-monitor": "operations",
public/control-center/pages/ai-command.js:2381:	"notification-center": "operations",
public/control-center/pages/ai-command.js:2410:	operation: "operations-centers",
public/control-center/pages/ai-command.js:2411:	operations: "operations-centers",
public/control-center/pages/ai-command.js:2412:	tasks: "task-center",
public/control-center/pages/ai-command.js:2413:	queue: "queue-center",
public/control-center/pages/ai-command.js:2414:	jobs: "job-monitor",
public/control-center/pages/ai-command.js:2415:	notifications: "notification-center",
public/control-center/pages/ai-command.js:3555:	if (session?.teamMode === "team") return tool.intent === "task" ? "task-center" : "workflows";
public/control-center/pages/ai-command/tool-dock.js:1044:      frontendOwnerPage: "operations-centers",
public/control-center/pages/ai-command/tool-dock.js:1045:      destinations: ["chat-preview", "operations-centers", "task", "governance"],
public/control-center/pages/ai-command/tool-dock.js:1057:      frontendOwnerPage: "operations-centers",
public/control-center/pages/ai-command/tool-dock.js:1058:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:1070:      frontendOwnerPage: "operations-centers",
public/control-center/pages/ai-command/tool-dock.js:1071:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:1083:      frontendOwnerPage: "operations-centers",
public/control-center/pages/ai-command/tool-dock.js:1084:      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1139:      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],
public/control-center/pages/workflows.js:1549:        destination_page: "task-center",
public/control-center/pages/workflows.js:1569:      setSharedHandoff(projectName, "task-center", handoff);
public/control-center/pages/workflows.js:1571:      navigateTo("task-center");
public/control-center/pages/workflows.js:2127:                      <button class="btn btn-ghost btn-sm" type="button" data-wf-open="task-center">Open Task Center</button>
public/control-center/pages/workflows.js:2303:            destination_page: "task-center",
public/control-center/pages/workflows.js:2315:          setSharedHandoff(projectName, "task-center", handoff);
public/control-center/pages/workflows.js:2319:          navigateTo("task-center");
public/control-center/pages/workflows.js:2326:          if (route === "task-center") {
public/control-center/pages/workflows.js:2329:              destination_page: "task-center",
public/control-center/pages/workflows.js:2341:            setSharedHandoff(projectName, "task-center", handoff);
public/control-center/pages/workflows.js:2344:          if (route !== "task-center") stateModel.openedDestination = true;
public/control-center/pages/home.js:1082:    if (operationsBtn) operationsBtn.onclick = () => openRoute("operations-centers");
public/control-center/router.js:19:} from "./pages/operations-centers.js";
