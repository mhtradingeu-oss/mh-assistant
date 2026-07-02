# Patch 17B — AI Command Execution / Source / Tool Drawer Contract Audit

## Status

Audit-only / no production change.

This audit maps the AI Command composer, execution-adjacent, selected source, Tool Drawer, source-required, metadata, route, and handoff contracts before any AI Command production polish is considered.

## Production Decision

No production code was changed.

Reason:

- AI Command is the central AI operating room.
- AI Command consumes cross-page prompts through `quickCommandInput`.
- AI Command manages specialist and team-mode state.
- AI Command manages composer input and chat/session state.
- AI Command can prepare response preview, route, follow-up, and copy actions.
- Tool Drawer generates structured prompts from selected output/source/destination/language/tone.
- Tool Drawer can require selected Library source context.
- Tool Drawer can open Library source selection flow.
- Tool Drawer can remove/change selected Library source context.
- Tool metadata includes source types, output types, destinations, safety levels, owner pages, and templates.
- Any future production change must preserve AI review-only boundaries, selected source behavior, Tool Drawer prompt generation, session stability, and destination-owned authority.

## Current Active Files

- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/ai-command/tool-dock.js`

## Composer / Input Contract

AI Command composer behavior includes:

- `aicmdV2Input`
- `quickCommandInput`
- `session.draftMessage`
- prompt cards
- quick templates
- keyboard submit behavior
- voice input readiness
- selected specialist context
- session draft persistence

Other pages can prefill AI Command through `quickCommandInput`.

AI Command consumes and clears the global input so rerenders are idempotent.

## AI Execution-Adjacent Contract

AI Command may interact with AI execution-related functions and AI command context.

Any future change must distinguish:

- AI generation / draft preparation
- local composer/session state
- output preview
- route/handoff preparation
- backend AI command execution
- governed approval/publishing authority

AI output is not automatically a business-approved action.

## Session Persistence Contract

AI Command uses session state for:

- selected specialist
- team mode
- draft message
- chat messages
- response history
- selected output tab
- loaded chat sessions
- current session key

Session persistence is high-risk because it affects operator continuity and cross-render stability.

## Output / Response Contract

AI Command response controls include:

- Create Preview
- Route
- Follow Up
- Copy

These controls prepare review, transformation, continuation, or routing behavior.

They must not be changed to imply direct publish, approval, send, or destination execution without a dedicated backend/governance implementation.

## Library Source Bridge Contract

AI Command / Tool Drawer uses selected Library source context through:

- `getSelectedLibrarySource`
- `getSharedAiSource`
- `clearSharedAiSource`
- `formatSharedAiSource`
- `buildSelectedSourceContextBlock`
- `applySharedAiSourceToDrawer`
- `validateDrawerSourceRequirement`

Selected Library source context can include:

- source name
- source type
- source id
- source path
- source-of-truth flag
- text preview / notes

The prompt explicitly says to use the Library source as trusted context and not add unsupported claims.

This is review context only. It is not source approval, Governance approval, publish readiness, or execution.

## Source-Required Contract

Tool Drawer can require a Library source when metadata indicates proof/source-sensitive work.

Source requirement logic includes:

- `sourceMetadataNeedsLibrarySource`
- `isDrawerSourceRequired`
- `validateDrawerSourceRequirement`
- `data-aicmd-tool-drawer-source-warning`

If a required source is missing, Tool Drawer warns the operator to choose one from Library before continuing.

## Tool Drawer Prompt Generation Contract

Tool Drawer prompt generation includes:

- `buildToolDrawerPrompt`
- output selection
- source selection
- destination selection
- language selection
- tone selection
- source details
- extra brief
- selected Library source context block
- review-only instructions
- destination ownership language

The generated text is inserted into the composer through:

- `data-aicmd-tool-drawer-use`

This prepares a structured AI prompt. It does not execute the destination workflow.

## Tool Drawer Open / Library Source Selection Contract

Tool Drawer can open Library source selection through:

- `data-aicmd-tool-drawer-open-library`

The Library source selection flow uses return context and shared AI source state so the operator can select a Library asset and return to AI Command.

This flow must preserve:

- selected tool id
- selected source type
- selected output type
- drawer status messaging
- return-to-drawer behavior
- selected source card rendering
- change source action
- remove source action

## Tool Metadata Contract

Tool metadata in `TOOL_DOCK_BY_SPECIALIST` includes:

- tool id
- label
- badge
- action type
- safety level
- owner page
- destinations
- source types
- output types
- template text
- source-required behavior

Tool groups include specialist domains such as:

- strategist
- writer
- media
- publisher
- ads
- insights
- governance
- operations
- customer
- sales

This metadata drives the UI and composer prompt generation. It must not be changed casually because it defines the perceived AI Team capability and destination ownership model.

## Destination Ownership Boundary

Tool Drawer destinations include pages and concepts such as:

- chat-preview
- campaign-studio
- content-studio
- media-studio
- publishing
- ads-manager
- insights
- library
- governance
- workflows
- task / handoff
- operations-centers

Destination ownership remains with destination pages.

AI Command prepares review-ready context and handoff prompts. It must not silently execute destination-owned behavior.

## High-Risk Areas For Future Changes

Do not change without dedicated implementation approval:

1. `executeProjectAiCommand` usage
2. `aicmdV2Input`
3. `quickCommandInput` bridge consumption
4. composer submit behavior
5. keyboard submit behavior
6. session draft persistence
7. loaded chat session behavior
8. specialist selection
9. team mode selection
10. response preview behavior
11. response route behavior
12. response follow-up behavior
13. response copy behavior
14. `getSelectedLibrarySource`
15. `getSharedAiSource`
16. `clearSharedAiSource`
17. `buildSelectedSourceContextBlock`
18. `validateDrawerSourceRequirement`
19. `applySharedAiSourceToDrawer`
20. `data-aicmd-tool-drawer-open-library`
21. `data-aicmd-tool-drawer-use`
22. Tool Drawer output/source/destination selects
23. Tool Drawer language/tone/source-details/extra-brief fields
24. `buildToolDrawerPrompt`
25. `TOOL_DOCK_BY_SPECIALIST`
26. tool source types
27. tool output types
28. tool destinations
29. source-required tools
30. safety level wording
31. route/handoff destination wording
32. any future backend command execution behavior

## Recommended Future Patch

### Patch 17C — AI Command Copy Guard Only

Only if needed, a future safe patch may clarify visible wording around:

- AI draft/review versus business execution
- Tool Drawer setup versus destination execution
- selected Library source versus Governance approval
- source-required warning clarity
- response Route versus publish/send/approve
- Create Preview versus durable save
- AI Team specialist output versus final approved output

Allowed:

- copy-only changes
- closeout documentation

Forbidden:

- handler changes
- API changes
- AI execution behavior changes
- Tool Drawer behavior changes
- Library source selection changes
- route destination changes
- output routing behavior changes
- session persistence changes
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
- all composer behavior
- all quickCommandInput behavior
- all chat/session behavior
- all AI Team behavior
- all output workspace behavior
- all Library source bridge behavior
- all Tool Drawer behavior
- all prompt generation behavior
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
- Confirm quickCommandInput bridge from another page still works.
- Open Tool Drawer.
- Select output, source, destination, language, and tone.
- Add source details and extra brief.
- Use Tool Drawer in composer.
- Open Library source selection.
- Select a Library source.
- Return to AI Command and confirm selected source appears.
- Trigger source-required warning with no source.
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
