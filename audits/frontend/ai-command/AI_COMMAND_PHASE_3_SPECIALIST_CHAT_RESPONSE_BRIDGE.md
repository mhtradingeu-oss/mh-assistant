# AI COMMAND PHASE 3 — Specialist Chat and Response Bridge Audit

Date: 2026-05-15  
Branch: architecture/frontend-consolidation-v1  
Mode: Controlled implementation with discovery-first safety gate

## Summary

Phase 3 adds a dedicated Specialist Conversation panel, Ask Specialist interaction flow, and safe response actions in the AI Team Command Center UI.

A real AI command API path exists, but it is not guidance-only under current backend behavior. The new Ask Specialist action is therefore wired with a strict availability guard and shows an explicit unavailable state instead of performing unsafe execution.

No backend files were modified. No runtime authority mutations were enabled from this phase implementation.

## Files Changed

- public/control-center/pages/ai-command.js
- public/control-center/styles/12-pages.css
- audits/frontend/ai-command/AI_COMMAND_PHASE_3_SPECIALIST_CHAT_RESPONSE_BRIDGE.md

## Existing API / Backend Path Discovered

Frontend API wrapper:
- public/control-center/api.js:1511
- Function: executeProjectAiCommand(projectName, payload)
- Route used: POST /media-manager/project/:project/ai/command

Backend route:
- runtime/orchestrator-service/server.js:11300
- app.post('/media-manager/project/:project/ai/command', handleExecuteAiCommand)
- Handler: runtime/orchestrator-service/server.js:11153

Backend orchestrator behavior:
- runtime/orchestrator-service/lib/ops/ai-orchestrator.js:673 (executeCommand)
- Persists AI artifact, recommendations, and memory on success
- Auto-creates handoff when routeTarget exists
- May create task/workflow/approval records when classified actionType is task/workflow/approval

## Was Real AI Response Bridge Connected?

Result: Not connected in Phase 3 runtime path.

Reason:
- Existing endpoint is operational, but current server-side execution is not guidance-only and can persist operational records (including handoff, and conditionally task/workflow/approval records).
- Phase 3 requirement was to avoid workflow/task/handoff/publish/approve side effects from Ask Specialist.

UI behavior now explicitly states:
- "AI response bridge is not connected yet. Existing backend AI command execution is not guidance-only for this phase."

## Request Payload / Prompt Shape (Prepared for Safe Bridge)

A specialist-aware prompt packager was added in frontend logic for when a safe backend mode becomes available.

Packaged prompt fields:
- Role: active specialist label
- Project: current project
- Mode: Solo Specialist or Full Team
- Language: current language context
- Safety constraints:
  - guidance/content only
  - never claim execution
  - never claim publish/approval/delete/archive/sync/operational runs
- User request body

Current Phase 3 guard prevents sending this to executeProjectAiCommand until backend adds a guidance-only mode.

## Specialist Conversation Panel Behavior

New panel: Specialist Conversation

Shows:
- user request
- active specialist
- generated response (when available)
- loading state ("Asking specialist…")
- error/unavailable state
- response timestamp
- guidance-only safety label
- bridge status chip (Connected / Unavailable)

Visual goals met:
- compact and readable
- clearly separated from Specialist Output Preview
- premium dark-surface treatment under page-scoped AI Command styles

## Ask Specialist Behavior

Added primary action button:
- Ask Specialist

Behavior:
- Requires composer text
- Keeps composer content
- Applies strict bridge safety gate
- If unavailable: shows clear unavailable message and keeps all local preview tools usable
- No workflow run, no task creation, no handoff creation, no publish/approve actions are initiated from this button in Phase 3

## Response Actions Added

Added response action row to Specialist Conversation panel:
- Copy response
- Use in composer
- Save local response
- Convert to preview
- Send to destination
- Read response (browser-local TTS)

Action rules:
- Copy response: clipboard only
- Use in composer: local textarea fill
- Save local response: local storage only
- Convert to preview: transforms to existing local Specialist Output Preview model
- Send to destination: shared-context handoff object + navigate only, message:
  - "Response context prepared. Review before saving or executing."
- Read response: browser SpeechSynthesis only

## Error / Unavailable Behavior

If bridge unavailable:
- Panel shows unavailable status and reason
- Composer text is preserved
- Ask Specialist does not crash page
- Local preview actions remain usable

If bridge were available and failed:
- Error is surfaced in panel state
- Composer text remains unchanged
- Retry stays possible via Ask Specialist
- Local preview remains intact

## What Remains Local-Only

Still local-only by design:
- Prepare Guidance
- Draft Task
- Draft Workflow
- Prepare Handoff
- Preview copy/use/save/clear/read
- Convert generated response to preview

No backend workflow execution was enabled by these controls.

## What Backend Execution Was Not Enabled

Not enabled in Phase 3 implementation:
- workflow run
- task creation
- approval creation
- publish actions
- authority mutation actions
- microphone / SpeechRecognition
- realtime voice chat
- media generation execution from this panel

## Voice / Media Safety

Voice behavior:
- Browser SpeechSynthesis for preview/response read is retained
- No microphone capture added
- No SpeechRecognition activation
- No backend audio execution added

Media behavior:
- No image/video execution bridge added here
- Existing capability panel remains informational and honest

## Validation Results

Commands run:
- node --check public/control-center/pages/ai-command.js
- node --check public/control-center/app.js
- node --check public/control-center/router.js
- node --check public/control-center/api.js
- grep -n '!important' public/control-center/styles/12-pages.css public/control-center/styles/14-page-standard.css public/control-center/styles/15-clean-operating-layer.css || true

Results:
- JS checks: PASS
- Existing !important entries found in 14-page-standard.css only; none added by this phase in changed scope

## Known Follow-up Items

1. Add backend guidance-only execution mode for AI command route:
- no createTask
- no recordWorkflowRun
- no createApproval
- no createHandoff
- optional no artifact/recommendation persistence mode if needed

2. Expose explicit backend flag contract in API (example: dry_run_guidance_only=true), then enable Ask Specialist real path.

3. Once safe mode is available, keep the same UI and flip bridge status to Connected using capability detection.

4. Optional: append conversation transcript view (multiple turns) with paging from local response history.
