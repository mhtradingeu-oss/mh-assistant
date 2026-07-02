# AI Command Team Regression Audit

## Purpose

Audit AI Command after discovering `languagePlan is not defined` during specialist chat.

The page previously appeared functional. Before applying a fix, this audit checks whether the issue is isolated to the chat submit handler or indicates broader AI Team damage.

## Scope

Inspect:

- Recent AI Command commits.
- `languagePlan` usage and scope.
- Shared specialist chat handler.
- Output action buttons.
- Route/handoff behavior.
- Specialist route mapping.
- Task Center handoff path.

## Evidence files

- `01-recent-ai-command-commits.txt`
- `02-language-plan-usage-map.txt`
- `03-chat-send-handler-map.txt`
- `04-output-buttons-handlers.txt`
- `05-specialist-route-map.txt`
- `06-shared-handoff-route-map.txt`

## Questions to answer

- Is `languagePlan` defined in render helpers only?
- Does the chat submit handler use `languagePlan` without local scope?
- Do all specialists share the same chat send handler?
- Are output buttons and route handlers still present?
- Can task outputs still target Task Center?
- Is the bug likely a scoped variable regression rather than broken AI team architecture?

## Expected safe fix if confirmed

Add a local scoped line in the chat submit handler:

`const languagePlan = getWorkspaceLanguagePlan(aiContext);`

before `executeProjectAiChat(...)`.

## Safety constraints

Do not change:

- specialist roster
- output routing
- handoff routing
- Task Center intake
- Workflows handoff path
- backend API behavior
