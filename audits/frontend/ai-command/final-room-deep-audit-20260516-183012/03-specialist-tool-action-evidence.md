# Specialist / Tool / Action Grep Evidence

## Specialist and tool anchors
```text
2941:				<button class="aicmd-v2-toggle-btn${session.teamMode !== "team" ? " is-active" : ""}" type="button" data-aicmdv2-team-mode="solo">
2944:				<button class="aicmd-v2-toggle-btn${session.teamMode === "team" ? " is-active" : ""}" type="button" data-aicmdv2-team-mode="team">
2949:			<div class="aicmd-v2-team-rail aicmd-room-member-list">
2957:							class="aicmd-v2-spec-btn aicmd-room-member${isActive ? " is-active" : ""}${isTeamActive ? " is-team-active" : ""}"
2959:							data-aicmdv2-specialist="${escapeHtml(spec.id)}"
2963:							<span class="aicmd-room-member-avatar" aria-hidden="true">${escapeHtml(getAiRoomInitials(spec))}</span>
2964:							<span class="aicmd-room-member-copy">
2966:								<span class="aicmd-room-member-role">${escapeHtml(spec.status || "Ready")} specialist</span>
2969:							<span class="aicmd-room-member-indicator" aria-hidden="true"></span>
3109:							class="aicmd-v2-tool-btn aicmd-room-tool-card"
3110:							data-aicmdv2-tool="${escapeHtml(tool.id)}"
3874:		Array.from(document.querySelectorAll("[data-aicmdv2-specialist]")).forEach((btn) => {
3876:				const specId = btn.getAttribute("data-aicmdv2-specialist") || "operations";
3889:		Array.from(document.querySelectorAll("[data-aicmdv2-team-mode]")).forEach((btn) => {
3891:				const mode = btn.getAttribute("data-aicmdv2-team-mode") || "solo";
4152:		const toolButtons = Array.from(document.querySelectorAll("[data-aicmdv2-tool]"));
4155:				const toolId = asString(btn.getAttribute("data-aicmdv2-tool") || "").trim();
```

## Output and route anchors
```text
320:		{ label: "Prepare escalation", sub: "Route support, sales, or operations" }
326:		{ label: "Prepare sales handoff", sub: "Route context to operations" }
344:	{ id: "route", title: "Route", description: "Send context to the owning workspace." },
443:		{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
1091:function destinationRouteForSpecialist(specialistId, outputType) {
1128:	const route = destinationRouteForSpecialist(specialistId, outputType);
1137:		destinationRoute: route,
1157:					"Route execution draft to Campaign Studio or Workflows"
1202:				"Route to Content Studio for refinement"
1237:				"Route to Media Studio for production planning"
1314:				"Route to Governance for formal review"
1382:				"Route sales handoff without mutating CRM data"
1454:		destinationRoute: outputType === "task" ? "task-center" : "workflows",
1487:	lines.push(`Destination: ${routeLabel(output.destinationRoute)}`);
1911:		return { title: "Content plan task block", owner: "Content Studio", steps: ["Use the strongest content pattern as the starting template.", "Map posts by platform, hook, format, and CTA.", "Route approved items into Publishing for scheduling."] };
2837:	if (tool.action === "route") return "Route";
2839:	if (tool.intent === "handoff") return "Route";
3246:	const destination = routeLabel(preview.destinationRoute);
3301:				<button id="aicmdV2LegacyPreviewUseBtn" class="aicmd-v2-btn-secondary" type="button">Use Above</button>
3302:				<button id="aicmdV2LegacyPreviewSendBtn" class="aicmd-v2-btn-secondary" type="button">Route</button>
3317:	const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
3325:			? "Route to Publishing"
3326:			: `Route to ${destination}`;
3347:						data-aicmdv2-output-tab="${escapeHtml(tab.id)}"
3406:				<button class="aicmd-v2-btn-secondary" type="button" disabled>Create Task</button>
3407:				<button class="aicmd-v2-btn-secondary" type="button" disabled>Export File</button>
3408:				<button id="aicmdV2PreviewSaveBtn" class="aicmd-v2-btn-secondary" type="button" ${hasPreview ? "" : "disabled"}>Save Draft</button>
3409:				<button id="aicmdV2PreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${(hasPreview && typeof speechSynthesis !== "undefined") ? "" : "disabled"}>Read Aloud</button>
3411:				<button id="aicmdV2PreviewUseBtn" class="aicmd-v2-btn-ghost" type="button" ${hasPreview ? "" : "disabled"}>Use Above</button>
3414:			<div class="aicmd-room-planned-note">Create Task and Export File are shown as planned controls until durable task/export handlers are connected.</div>
3517:										<button id="aicmdV3ResponseUseBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Use Above</button>
3518:										<button id="aicmdV3ResponseConvertBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Send to Draft</button>
3519:										<button id="aicmdV3ResponseSendBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Route</button>
3571:	const destination = routeLabel(destinationRouteForSpecialist(session.modeId, asObject(session.outputPreview).outputType || "guidance"));
3695:export const aiCommandRoute = {
3825:			aiCommandRoute.render(context);
3848:				aiCommandRoute.render(context);
3863:		Array.from(document.querySelectorAll("[data-aicmdv2-output-tab]")).forEach((btn) => {
3865:				const nextTab = asString(btn.getAttribute("data-aicmdv2-output-tab") || "draft").trim();
3869:				aiCommandRoute.render(context);
3884:				aiCommandRoute.render(context);
3894:				aiCommandRoute.render(context);
3994:					aiCommandRoute.render(context);
4001:				aiCommandRoute.render(context);
4067:						destinationRoute: asString(routeSuggestion?.route) || destinationRouteForSpecialist(session.modeId, "guidance")
4078:					aiCommandRoute.render(context);
4084:					aiCommandRoute.render(context);
4295:					aiCommandRoute.render(context);
4304:				const destination = asString(latestResponse.destinationRoute || destinationRouteForSpecialist(session.modeId, "guidance"));
4397:				const destination = asString(output.destinationRoute || "").trim();
4467:				aiCommandRoute.render(context);
4481:				rerender: () => aiCommandRoute.render(context)
```
