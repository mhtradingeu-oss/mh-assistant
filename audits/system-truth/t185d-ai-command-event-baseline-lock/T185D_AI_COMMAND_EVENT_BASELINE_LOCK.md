# T185D — AI Command Event Baseline Lock

## Status
Baseline locked after failed experimental router/controller branch was removed.

## Current Truth
AI Command is currently running on the legacy event system only.

## Event Counts
- onclick handlers: 43
- addEventListener handlers: 1
- data-aicmd-smart markers: 26
- data-aicmdv2-tool markers: 6
- ai-command.js line count: 7948

## Confirmed Absent
The current ai-command.js must not reference:
- bindToolController
- event.router
- tool.controller
- AI_EVENT_LOG
- __AI_OS

## Doctrine
No new event router should be activated until the legacy event map is classified and one safe migration slice is chosen.

## Migration Rule
Future migration must be one event group at a time:
1. Tool events
2. Smart action events
3. Output preview/response events
4. Chat composer events
5. Global click handler

## Hard Constraint
No regex injection into large render blocks.
No global event override.
No deleting legacy handlers until the replacement is active and validated.
No UI or behavior changes in this baseline lock.
