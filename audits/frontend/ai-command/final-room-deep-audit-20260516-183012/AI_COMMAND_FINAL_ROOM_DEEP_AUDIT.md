# AI Command Final Room Deep Audit

## Scope

This audit reviews the AI Command / AI Team Command Center page after the Final Room V1 redesign.

Files reviewed:
- `public/control-center/pages/ai-command.js`
- `public/control-center/styles/12-pages.css`

This audit is read-only. It does not change runtime behavior.

## Executive Summary

- The page has a modern AI Team Command Center structure.
- The expected operating model is: Ask -> Draft -> Review -> Route -> Execute -> Monitor.
- The page separates Team selection, Chat/Conversation, Composer, Output Workspace, Tools, and Status.
- The next review should verify whether every specialist has the right role-specific tools and whether every output action is connected or clearly marked as planned.

## Required ID and Handler Coverage

| ID | Markup Count | Handler Found | Status |
|---|---:|---|---|
| `aicmdV2Input` | 1 | YES | OK |
| `aicmdV2AskBtn` | 1 | YES | OK |
| `aicmdV2PrepareBtn` | 1 | YES | OK |
| `aicmdV2DraftTaskBtn` | 1 | YES | OK |
| `aicmdV2DraftWorkflowBtn` | 1 | YES | OK |
| `aicmdV2HandoffBtn` | 1 | YES | OK |
| `aicmdV2VoiceBtn` | 1 | YES | OK |
| `aicmdV2SaveBtn` | 1 | YES | OK |
| `aicmdV2ClearBtn` | 1 | YES | OK |
| `aicmdV2PreviewSendBtn` | 1 | YES | OK |
| `aicmdV2PreviewSaveBtn` | 1 | YES | OK |
| `aicmdV2PreviewReadBtn` | 1 | YES | OK |
| `aicmdV2PreviewCopyBtn` | 1 | YES | OK |
| `aicmdV2PreviewUseBtn` | 1 | YES | OK |
| `aicmdV2PreviewClearBtn` | 1 | YES | OK |
| `aicmdV3ResponseCopyBtn` | 1 | YES | OK |
| `aicmdV3ResponseUseBtn` | 1 | YES | OK |
| `aicmdV3ResponseConvertBtn` | 1 | YES | OK |
| `aicmdV3ResponseSendBtn` | 1 | YES | OK |
| `aicmdV3ResponseContinueBtn` | 1 | YES | OK |
| `aicmdV3ResponseSaveBtn` | 1 | YES | OK |
| `aicmdV3ResponseReadBtn` | 1 | YES | OK |

## Duplicate ID Risk

No duplicate active IDs found. Legacy IDs are ignored only when explicitly renamed with `Legacy`.

## Data Attribute Interaction Coverage

| Data Attribute | Source Count | querySelectorAll Handler Present |
|---|---:|---|
| `data-aicmdv2-specialist` | 3 | YES |
| `data-aicmdv2-team-mode` | 4 | YES |
| `data-aicmdv2-tool` | 3 | YES |
| `data-aicmdv2-output-tab` | 3 | YES |
| `data-aicmdv2-prompt` | 4 | YES |
| `data-aicmdv2-quick` | 2 | YES |

## Core Render Function Presence

| Function / Logic | Present |
|---|---|
| `renderPhase1TeamRail` | YES |
| `renderAiRoomConversationHeader` | YES |
| `renderPhase1Composer` | YES |
| `renderPhase3SpecialistConversation` | YES |
| `renderAiRoomOutputWorkspace` | YES |
| `renderPhase35ToolsPanel` | YES |
| `renderAiRoomStatusStrip` | YES |
| `executeProjectAiGuidance` | YES |
| `setAiComposerValue` | YES |
| `normalizeAiComposerPrompt` | YES |

## Layout and UX Label Coverage

| Label / Concept | Present |
|---|---|
| `AI Team Command Center` | YES |
| `Ask AI Team` | YES |
| `Solo Specialist` | YES |
| `Full Team` | YES |
| `Draft` | YES |
| `Task` | YES |
| `Workflow` | YES |
| `Handoff` | YES |
| `Export` | YES |
| `Create Task` | YES |
| `Export File` | YES |
| `Save Draft` | YES |
| `Read Aloud` | YES |
| `Send to Content Studio` | YES |
| `Route to Publishing` | YES |

## Specialist / Team Surface Signals

- `data-aicmdv2-specialist` occurrences: 1
- `data-aicmdv2-team-mode` occurrences: 2
- `data-aicmdv2-tool` occurrences: 1
- `data-aicmdv2-output-tab` occurrences: 1

Likely specialist IDs detected:
- `ads`
- `media`
- `operations`
- `publisher`
- `strategist`
- `writer`

## CSS Final Room Blocks

- AI TEAM COMMAND CENTER FINAL ROOM V1 — Polish / Responsive Fix
- AI TEAM COMMAND CENTER FINAL ROOM V1 — Final Compact Composer / Output Polish
- AI TEAM COMMAND CENTER FINAL ROOM V1 — Content Column Output Fix

## Action Safety Review

The following lines include planned/disabled/future safety markers:

```text
159: safetyNote: "Direction and briefs only. Media generation requires backend confirmation and explicit action.",
3143: { label: "Voice input", value: "Coming", className: "is-planned" },
3144: { label: "Team chat", value: bridgeStatus.available ? "Ready" : "Coming", className: bridgeStatus.available ? "is-available" : "is-planned" },
3145: { label: "Media gen", value: "Coming", className: "is-planned" },
3146: { label: "GPU video", value: "Coming", className: "is-planned" },
3147: { label: "Image prompt generation", value: providerConfigured ? "Provider may be ready" : "Provider dependent", className: providerConfigured ? "is-available" : "is-planned" }
3187: <button class="aicmd-room-mini-btn" type="button" disabled title="Attachment intake is planned for a later backend step.">Attach</button>
3189: <button class="aicmd-room-mini-btn" type="button" disabled title="Context picker is planned for a later step.">Add Context</button>
3190: <button class="aicmd-room-mini-btn" type="button" disabled title="Template picker is planned for a later step.">Template</button>
3304: <button id="aicmdV2LegacyPreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${typeof speechSynthesis === "undefined" ? "disabled" : ""}>Read preview</button>
3405: <button id="aicmdV2PreviewSendBtn" class="aicmd-v2-btn-primary" type="button" ${hasPreview ? "" : "disabled"}>${escapeHtml(routeActionLabel)}</button>
3406: <button class="aicmd-v2-btn-secondary" type="button" disabled>Create Task</button>
3407: <button class="aicmd-v2-btn-secondary" type="button" disabled>Export File</button>
3408: <button id="aicmdV2PreviewSaveBtn" class="aicmd-v2-btn-secondary" type="button" ${hasPreview ? "" : "disabled"}>Save Draft</button>
3409: <button id="aicmdV2PreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${(hasPreview && typeof speechSynthesis !== "undefined") ? "" : "disabled"}>Read Aloud</button>
3410: <button id="aicmdV2PreviewCopyBtn" class="aicmd-v2-btn-ghost" type="button" ${hasPreview ? "" : "disabled"}>Copy</button>
3411: <button id="aicmdV2PreviewUseBtn" class="aicmd-v2-btn-ghost" type="button" ${hasPreview ? "" : "disabled"}>Use Above</button>
3412: <button id="aicmdV2PreviewClearBtn" class="aicmd-v2-btn-ghost" type="button" ${hasPreview ? "" : "disabled"}>Clear</button>
3414: <div class="aicmd-room-planned-note">Create Task and Export File are shown as planned controls until durable task/export handlers are connected.</div>
3453: <li><span>Image prompt generation</span><strong class="${providerConfigured ? "is-available" : "is-planned"}">${escapeHtml(providerConfigured ? "Provider configured" : "Needs provider connection")}</strong></li>
3455: <li><span>Native GPU video rendering</span><strong class="is-planned">Requires connected GPU worker</strong></li>
3457: <li><span>Read preview aloud (browser)</span><strong class="${speechSynthAvailable ? "is-available" : "is-planned"}">${speechSynthAvailable ? "Available in this browser" : "Not supported in this browser"}</strong></li>
3458: <li><span>Voice input (microphone)</span><strong class="is-planned">Planned — SpeechRecognition not enabled</strong></li>
3459: <li><span>Team chat execution bridge</span><strong class="is-planned">Planned — requires backend bridge</strong></li>
3460: <li><span>Realtime voice chat</span><strong class="is-planned">Future — needs provider + bridge</strong></li>
3516: <button id="aicmdV3ResponseCopyBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Copy</button>
3517: <button id="aicmdV3ResponseUseBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Use Above</button>
3518: <button id="aicmdV3ResponseConvertBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Send to Draft</button>
3519: <button id="aicmdV3ResponseSendBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Route</button>
3521: <button id="aicmdV3ResponseSaveBtn" class="aicmd-v2-btn-ghost" type="button" ${latest ? "" : "disabled"}>Save</button>
3522: <button id="aicmdV3ResponseReadBtn" class="aicmd-v2-btn-ghost" type="button" ${(latest && typeof speechSynthesis !== "undefined") ? "" : "disabled"}>Read</button>
```

## Output / Next Action Lines

```text
320: { label: "Prepare escalation", sub: "Route support, sales, or operations" }
326: { label: "Prepare sales handoff", sub: "Route context to operations" }
344: { id: "route", title: "Route", description: "Send context to the owning workspace." },
409: { id: "copy-variants", label: "Copy Variants", action: "preview", intent: "guidance", template: "Prepare German ad copy variants for {project}. Include hooks, primary text, CTA, and creative notes." },
443: { id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
1091: function destinationRouteForSpecialist(specialistId, outputType) {
1128: const route = destinationRouteForSpecialist(specialistId, outputType);
1137: destinationRoute: route,
1157: "Route execution draft to Campaign Studio or Workflows"
1202: "Route to Content Studio for refinement"
1237: "Route to Media Studio for production planning"
1314: "Route to Governance for formal review"
1382: "Route sales handoff without mutating CRM data"
1454: destinationRoute: outputType === "task" ? "task-center" : "workflows",
1487: lines.push(`Destination: ${routeLabel(output.destinationRoute)}`);
1911: return { title: "Content plan task block", owner: "Content Studio", steps: ["Use the strongest content pattern as the starting template.", "Map posts by platform, hook, format, and CTA.", "Route approved items into Publishing for scheduling."] };
2361: <button id="ctrlGlobalBtn" class="ctrl-secondary-btn" type="button">Copy to bar</button>
2837: if (tool.action === "route") return "Route";
2839: if (tool.intent === "handoff") return "Route";
3246: const destination = routeLabel(preview.destinationRoute);
3300: <button id="aicmdV2LegacyPreviewCopyBtn" class="aicmd-v2-btn-secondary" type="button">Copy</button>
3301: <button id="aicmdV2LegacyPreviewUseBtn" class="aicmd-v2-btn-secondary" type="button">Use Above</button>
3302: <button id="aicmdV2LegacyPreviewSendBtn" class="aicmd-v2-btn-secondary" type="button">Route</button>
3317: const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
3325: ? "Route to Publishing"
3326: : `Route to ${destination}`;
3406: <button class="aicmd-v2-btn-secondary" type="button" disabled>Create Task</button>
3407: <button class="aicmd-v2-btn-secondary" type="button" disabled>Export File</button>
3408: <button id="aicmdV2PreviewSaveBtn" class="aicmd-v2-btn-secondary" type="button" ${hasPreview ? "" : "disabled"}>Save Draft</button>
3409: <button id="aicmdV2PreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${(hasPreview && typeof speechSynthesis !== "undefined") ? "" : "disabled"}>Read Aloud</button>
3410: <button id="aicmdV2PreviewCopyBtn" class="aicmd-v2-btn-ghost" type="button" ${hasPreview ? "" : "disabled"}>Copy</button>
3411: <button id="aicmdV2PreviewUseBtn" class="aicmd-v2-btn-ghost" type="button" ${hasPreview ? "" : "disabled"}>Use Above</button>
3414: <div class="aicmd-room-planned-note">Create Task and Export File are shown as planned controls until durable task/export handlers are connected.</div>
3516: <button id="aicmdV3ResponseCopyBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Copy</button>
3517: <button id="aicmdV3ResponseUseBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Use Above</button>
3518: <button id="aicmdV3ResponseConvertBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Send to Draft</button>
3519: <button id="aicmdV3ResponseSendBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Route</button>
3571: const destination = routeLabel(destinationRouteForSpecialist(session.modeId, asObject(session.outputPreview).outputType || "guidance"));
3695: export const aiCommandRoute = {
3825: aiCommandRoute.render(context);
3848: aiCommandRoute.render(context);
3869: aiCommandRoute.render(context);
3884: aiCommandRoute.render(context);
3894: aiCommandRoute.render(context);
3994: aiCommandRoute.render(context);
4001: aiCommandRoute.render(context);
4067: destinationRoute: asString(routeSuggestion?.route) || destinationRouteForSpecialist(session.modeId, "guidance")
4078: aiCommandRoute.render(context);
4084: aiCommandRoute.render(context);
4224: const responseCopyBtn = $("aicmdV3ResponseCopyBtn");
4225: if (responseCopyBtn) {
4226: responseCopyBtn.onclick = async () => {
4235: updateStatus("Copy failed. Clipboard access may be blocked.");
4295: aiCommandRoute.render(context);
4304: const destination = asString(latestResponse.destinationRoute || destinationRouteForSpecialist(session.modeId, "guidance"));
4350: const previewCopyBtn = $("aicmdV2PreviewCopyBtn");
4351: if (previewCopyBtn) {
4352: previewCopyBtn.onclick = async () => {
4369: updateStatus("Copy failed. Clipboard access may be blocked.");
4397: const destination = asString(output.destinationRoute || "").trim();
4467: aiCommandRoute.render(context);
4481: rerender: () => aiCommandRoute.render(context)
```

## Render Root / Mounting Evidence

```text
2921: function renderPhase1TeamRail(session, bridgeStatus, escapeHtml) {
3161: function renderPhase1Composer(session, aiContext, escapeHtml) {
3311: function renderAiRoomOutputWorkspace(session, aiContext, escapeHtml) {
3466: function renderPhase3SpecialistConversation(session, bridgeStatus, escapeHtml) {
3777: root.innerHTML = `
3780: <div class="aicmd-v2-body aicmd-room-grid">
3781: ${renderPhase1TeamRail(session, responseBridge, escapeHtml)}
3785: ${renderPhase3SpecialistConversation(session, responseBridge, escapeHtml)}
3786: ${renderPhase1Composer(session, aiContext, escapeHtml)}
3790: ${renderAiRoomOutputWorkspace(session, aiContext, escapeHtml)}
```

## UX Audit Questions

Use browser QA to answer these:

- Can the user instantly understand who they are talking to?
- Can the user switch between Solo Specialist and Full Team without losing context?
- Does each specialist show a clear role, purpose, tools, and output type?
- Does the conversation remain the main center of the page?
- Are outputs separated from chat?
- Can the user move from answer to Draft / Task / Workflow / Handoff / Export?
- Are planned actions clearly disabled or marked as planned?
- Is there any action that looks real but is not connected?
- Does the AI Team page communicate the full power of MH-OS?
- Does the user know the next right action after receiving an answer?

## Browser QA Console Snippet

```js
(() => {
  const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];

  const required = [
    "aicmdV2Input",
    "aicmdV2AskBtn",
    "aicmdV2PrepareBtn",
    "aicmdV2DraftTaskBtn",
    "aicmdV2DraftWorkflowBtn",
    "aicmdV2HandoffBtn",
    "aicmdV2VoiceBtn",
    "aicmdV2PreviewSendBtn",
    "aicmdV2PreviewSaveBtn",
    "aicmdV2PreviewReadBtn",
    "aicmdV2PreviewCopyBtn",
    "aicmdV2PreviewUseBtn",
    "aicmdV2PreviewClearBtn"
  ];

  console.table({
    duplicateIds: duplicates.join(", ") || "none",
    missingRequired: required.filter((id) => !document.getElementById(id)).join(", ") || "none",
    teamMembers: document.querySelectorAll("[data-aicmdv2-specialist]").length,
    tools: document.querySelectorAll("[data-aicmdv2-tool]").length,
    outputTabs: document.querySelectorAll("[data-aicmdv2-output-tab]").length,
    teamModeButtons: document.querySelectorAll("[data-aicmdv2-team-mode]").length,
    bodyHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
  });
})();
```

## Preliminary Recommendation

Do not start new feature work until this audit is reviewed in browser.

Recommended next steps:
1. Run browser QA using the snippet above.
2. Click every specialist and verify role/tools/output changes.
3. Test Ask AI Team, Draft, Task, Workflow, Handoff, Copy, Use Above, Save Draft, Read Aloud.
4. Confirm planned actions are disabled and honest.
5. Create a follow-up patch only for missing specialist tools, unclear copy, or broken routing.
