# Patch 17 — AI Command / AI Team / Tool Drawer Authority Audit

## Status

Audit-only / no production change.

AI Command is the central AI operating room. It includes AI Team specialist selection, composer/chat behavior, session state, output workspace, Tool Drawer setup, Library selected source context, source/destination/output selection, quick command bridging, AI prompts, route handoffs, and review-only safety language.

## Production Decision

No production code was changed.

Reason:

- AI Command is the central interface for AI work.
- AI Command consumes prompts from other pages through `quickCommandInput`.
- AI Command manages AI Team specialist selection and team mode.
- AI Command manages chat/session state.
- AI Command can create preview/output cards and route responses.
- AI Command uses Tool Drawer for structured tool setup.
- Tool Drawer can require selected Library source context.
- Tool Drawer can open Library source selection flow.
- Tool Drawer can insert structured prompts into the composer.
- AI Command may call AI execution-related context functions.
- Any future production change must preserve AI review-only boundaries, source handoff behavior, composer/session behavior, output routing behavior, and Tool Drawer contracts.

## Current Active Files

- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/ai-command/tool-dock.js`

## Existing Strengths

Confirmed current AI Command capabilities:

- AI Command route and custom page surface.
- AI Team specialist selection.
- Team mode selection.
- Composer input.
- Chat/session state.
- Prompt buttons.
- Quick templates.
- Output tabs.
- Selected specialist output.
- Response convert / route / follow-up / copy controls.
- Voice input readiness.
- Tool buttons.
- Tool Drawer.
- Library selected source indicator.
- Source-required tool behavior.
- Library source selection return flow.
- Structured tool setup prompt generation.
- Source, output, destination, language, and tone setup.
- Review-only safety language in tool templates.

## AI Team Contract

AI Command uses specialist selection through:

- `data-aicmdv2-specialist`
- `data-aicmdv2-team-mode`

These controls change AI operating context and active specialist state.

They should not be changed without browser QA because they affect:

- selected specialist
- selected mode
- response ownership
- output grouping
- chat focus
- session persistence

## Composer / Chat Contract

AI Command composer behavior uses:

- `aicmdV2Input`
- `quickCommandInput`
- `session.draftMessage`
- prompt prefill buttons
- quick template buttons
- keyboard submit behavior
- session persistence

Other pages can prefill AI Command through `quickCommandInput`.

AI Command consumes that bridge and clears the global input to keep rerenders idempotent.

## Output Workspace Contract

AI Command can show selected specialist replies and output controls such as:

- Create Preview
- Route
- Follow Up
- Copy

These actions prepare output workflow and routing behavior. They must not be changed to imply direct publishing, approval, sending, or backend execution without a dedicated implementation patch.

## Tool Drawer Contract

Tool Drawer uses:

- `data-aicmd-tool-drawer`
- `data-aicmd-tool-dock`
- `data-aicmdv2-tool`
- `data-aicmd-tool-drawer-output-select`
- `data-aicmd-tool-drawer-source-select`
- `data-aicmd-tool-drawer-destination-select`
- `data-aicmd-tool-drawer-language`
- `data-aicmd-tool-drawer-tone`
- `data-aicmd-tool-drawer-source-details`
- `data-aicmd-tool-drawer-extra-brief`
- `data-aicmd-tool-drawer-use`
- `data-aicmd-tool-drawer-open-library`

Tool Drawer prepares structured prompt text for the composer.

It does not execute destination actions by itself.

## Library Source Contract

AI Command / Tool Drawer uses selected Library source context through:

- `getSelectedLibrarySource`
- `getSharedAiSource`
- selected source rendering
- selected source context block
- source-required warning
- Library open/return flow

The selected Library source is context for AI review/generation only.

It must not imply source approval, Governance approval, publish readiness, or execution.

## Tool Metadata Contract

Tool Drawer tools can define:

- source types
- output types
- destinations
- safety level
- owner page
- template text
- action type
- source required behavior

This metadata drives the Tool Drawer UI and composer prompt generation.

Future changes must preserve metadata semantics and avoid changing source/destination authority by accident.

## Route / Handoff Boundary

AI Command can prepare or route context toward other workspaces, but destination-owned behavior remains with the destination page:

- Library owns sources/assets.
- Campaign Studio owns campaign planning.
- Content Studio owns content production/review.
- Media Studio owns media production/review.
- Publishing owns publishing gates.
- Ads Manager owns paid growth planning.
- Governance owns approval/policy authority.
- Task/Queue/Operations own operational execution tracking.

AI Command should prepare, review, summarize, and hand off. It should not silently approve, publish, send, mutate, or execute destination-owned actions.

## Backend / AI Execution Boundary

AI Command may interact with AI execution-related functions, including AI command execution context.

Any future change must distinguish:

- AI generation / draft preparation
- local/session state
- route handoff
- backend execution
- governed approval or publishing

AI output is not automatically approved business action.

## Data Attribute Inventory

Observed high-value AI Command / Tool Drawer attributes include:

- `data-aicmdv2-specialist`
- `data-aicmdv2-team-mode`
- `data-aicmdv2-prompt`
- `data-aicmdv2-prompt-text`
- `data-aicmdv2-quick`
- `data-aicmdv2-quick-template`
- `data-aicmdv2-output-tab`
- `data-aicmdv2-tool`
- `data-aicmd-tool-drawer`
- `data-aicmd-tool-drawer-close`
- `data-aicmd-tool-drawer-status`
- `data-aicmd-tool-drawer-selected-source`
- `data-aicmd-tool-drawer-source-warning`
- `data-aicmd-tool-drawer-output-select`
- `data-aicmd-tool-drawer-source-select`
- `data-aicmd-tool-drawer-destination-select`
- `data-aicmd-tool-drawer-language`
- `data-aicmd-tool-drawer-tone`
- `data-aicmd-tool-drawer-source-details`
- `data-aicmd-tool-drawer-extra-brief`
- `data-aicmd-tool-drawer-open-library`
- `data-aicmd-tool-drawer-use`
- `data-aicmd-tool-dock`
- `data-aicmd-tool-dock-action`
- `data-aicmd-tool-dock-safety`
- `data-aicmd-tool-dock-owner`
- `data-aicmd-tool-dock-destinations`
- `data-aicmd-tool-dock-sources`
- `data-aicmd-tool-dock-outputs`
- `data-aicmd-tool-dock-template`

## High-Risk Areas For Future Changes

Do not change without dedicated implementation approval:

1. AI Team specialist selection
2. team mode selection
3. composer input behavior
4. quickCommandInput consumption
5. chat/session persistence
6. response routing buttons
7. output workspace state
8. Tool Drawer open/close behavior
9. Tool Drawer source/output/destination selects
10. Tool Drawer use-in-composer behavior
11. Library selected source context
12. source-required warning behavior
13. open Library source selection flow
14. return-to-drawer behavior
15. selected source removal/change behavior
16. tool metadata source types
17. tool metadata destinations
18. tool metadata output types
19. safety level text
20. any AI execution/backend command call
21. route/handoff behavior
22. voice input composer behavior

## Recommended Future Patch

### Patch 17B — AI Command Execution / Source / Tool Drawer Contract Audit

Before any production patch, map exact functions and payload behavior:

- AI composer submit path
- `executeProjectAiCommand` usage
- chat/session persistence
- selected specialist state
- selected source state
- Library source bridge
- Tool Drawer prompt generation
- Tool Drawer source-required rules
- output preview creation
- route/handoff destinations
- response copy/follow-up/route behavior
- quickCommandInput bridge consumption

Allowed scope:

- audit documentation only unless a very narrow copy guard is proven safe

Forbidden:

- handler changes
- API changes
- AI execution behavior changes
- Tool Drawer behavior changes
- source selection behavior changes
- route destination changes
- output routing behavior changes
- CSS
- backend
- project data

## Preserved Contracts

Because this was audit-only, the following remain unchanged:

- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/ai-command/tool-dock.js`
- route ID: `ai-command`
- `data-page="ai-command"`
- `#ctrlRoomRoot`
- all AI Command data attributes
- all Tool Drawer data attributes
- all AI Team selection behavior
- all composer behavior
- all chat/session behavior
- all output workspace behavior
- all Library source handoff behavior
- all Tool Drawer behavior
- all route/handoff behavior
- all backend/API behavior
- all project data behavior

## Validation Commands

```bash
node --check public/control-center/pages/ai-command.js
node --check public/control-center/pages/ai-command/tool-dock.js
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
git diff --stat
git status --short
```

## Browser QA Checklist For Future Patch

Before any future AI Command production patch:

- Open AI Command.
- Confirm page renders.
- Select AI specialist.
- Change team mode.
- Type in composer.
- Submit a prompt only in a safe test project.
- Confirm chat/session state remains stable.
- Use prompt cards.
- Use quick templates.
- Open Tool Drawer.
- Select output, source, destination, language, and tone.
- Use Tool Drawer in composer.
- Open Library source selection.
- Select a Library source.
- Return to AI Command and confirm selected source appears.
- Remove/change selected source.
- Create Preview.
- Route response.
- Follow up.
- Copy response.
- Confirm AI does not publish, approve, send, or execute destination actions by itself.
- Confirm no console errors.

## Rollback Path

Delete this audit file.

No production rollback is required.
