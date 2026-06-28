# T185C.5E5B — Dormant Legacy AI Command Render Removal

## Status
Closed.

## Scope
Remove only proven-dormant AI Command render blocks after T185C.5E5 and T185C.5E5A scans confirmed they had no active calls and that their legacy IDs were owned only by dormant blocks.

## Removed From public/control-center/pages/ai-command.js
- renderCommandComposer
- renderPhase1Composer
- renderPhase2PreviewPanel
- renderAiRoomOutputWorkspace
- renderPhase2MediaStatusPanel

## Removed Legacy Markers
- ctrlComposerInput
- ctrlSendBtn
- ctrlClearBtn
- ctrlGlobalBtn
- ctrlBuildTaskBtn
- ctrlTaskType
- ctrlProductSelect
- ctrlChannelSelect
- aicmdV2InputLegacy
- aicmdV2VoiceBtnLegacy
- aicmdV2AskBtnLegacy
- aicmdV2StatusLegacy
- aicmdV2PreviewSendBtnLegacy
- aicmdV2PreviewCopyBtnLegacy
- aicmdV2PreviewUseBtnLegacy
- aicmdV2PreviewClearBtnLegacy

## Preserved Active Surfaces
The active AI Command surface remains intact:
- renderAiCommandChatComposer
- aicmd-final-composer
- data-aicmd-open-plus
- data-aicmd-final-source-menu
- data-aicmd-final-specialist
- aicmdV2AskBtn
- aicmdV2VoiceBtn
- renderAiCommandSmartActionCenter

## Preserved Active Tool Dock
No changes were made to:
- tool-dock.js
- bindAiToolDock
- data-aicmd-tool-dock
- data-aicmd-tool-drawer
- shared-context drawer/source bridge behavior

The active guided prompt drawer remains preserved.

## CSS Decision
No CSS was removed in this phase.

Reason:
The CSS scan showed many selectors for older v2 composer/preview/output classes. CSS cleanup should be handled in a later dedicated CSS selector ownership phase after confirming no active surfaces or future fallback use those selectors.

## Safety Guarantees
This phase did not change:
- backend routes
- api.js
- app.js
- router.js
- runtime data
- provider execution
- publish/send/approval/destructive behavior
- workflow execution
- CRM/customer mutation behavior

## Validation
Validation included:
- syntax checks for AI Command, tool dock, shared context, API, app, router, and orchestrator server
- active marker preservation checks
- removed legacy marker absence checks

## Final Result
AI Command now has less dormant legacy UI code while preserving the active final composer, active Smart Action Center, active tool drawer, source/context flows, and all safety boundaries.
