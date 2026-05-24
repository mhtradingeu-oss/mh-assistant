# AI Command Pass 2 Roster Clarity Readiness Audit

## Executive conclusion

AI Command is now a credible frontend Meeting Room shell, but the left roster does not yet feel like a real team roster. Pass 2 should be a minimal, frontend-only improvement: clarify the visible roster using only existing specialist, tool, and session data. No backend, no new persistence, no autonomous execution, no tool-dock or CSS file changes. Only improve the visible metadata and clarity of the left roster.

## Current roster truth

- Ready specialists are rendered from `SPECIALIST_DEFS` in `ai-command.js`.
- Planned specialists are rendered from a separate static array.
- The active specialist is tracked in session state (`session.modeId`) and visually highlighted.
- The left roster shows label, position, summary, and static status for each specialist.
- Tools for the selected specialist are shown in the right panel, not in the roster.
- Active task and next action are not consistently shown in the roster.

## Existing usable data

- `SPECIALIST_DEFS` contains: id, label, position, summary, status, canHelp, cannotDo, destinations, safetyNote.
- `PHASE35_SPECIALIST_TOOLS` maps specialist id to available tools (label, id, intent, template).
- `SPECIALIST_SUGGESTED_PROMPTS` provides next recommended actions per specialist.
- Session state tracks the active specialist, current draft, and recent output previews.
- The current draft/preview can be associated with the active specialist.

## Current gaps

- The roster does not show available tool count or top tool labels for each specialist.
- The roster does not show the active task for each specialist (only the selected specialist's draft is visible in the center).
- The roster does not show the next recommended action for each specialist.
- Planned specialists are visually separated but lack clarity on their status and summary.
- The roster does not surface a minimal room history or previous outputs.

## Smallest safe Pass 2

1. For each ready specialist in the left roster:
   - Show static role, position, and status (from `SPECIALIST_DEFS`).
   - Show available tool count and top 1-2 tool labels (from `PHASE35_SPECIALIST_TOOLS`).
   - Show active task if the current draft/preview belongs to that specialist; otherwise, show "No active task".
   - Show next recommended action (from `SPECIALIST_SUGGESTED_PROMPTS`).
2. For planned specialists:
   - Show label, status ("Planned"), and summary.
3. Do not add new data, backend calls, or persistence.
4. Do not change handlers, IDs, or data attributes.
5. Do not add autonomous execution, backend, or tool-dock changes.
6. Only adjust CSS in `12-pages.css` if absolutely necessary for roster readability.

## Allowed files

- `public/control-center/pages/ai-command.js`
- `public/control-center/styles/12-pages.css` (minor readability tweaks only)

## Forbidden files

- Backend files
- `data/projects/**`
- `public/control-center/app.js`, router, state, API, runtime, shared-context
- New CSS files
- `public/control-center/pages/ai-command/tool-dock.js`
- Any file not listed above

## Handler and safety preservation

- Preserve all existing IDs, data attributes, and click handlers.
- Do not change prompt parsing, Home handoff, or session logic.
- Do not add any autonomous execution, backend, or persistent state.
- All output remains draft, preview, or route-only.

## Browser QA checklist

- Home loads without errors.
- AI Command left roster shows ready specialists with role, position, status, tool count/top tools, active task, and next action.
- Planned specialists are clearly separated and show label, status, and summary.
- Active specialist is visually highlighted.
- Selecting a specialist updates the active state and visible draft.
- No backend, persistence, or tool-dock changes are present.
- No autonomous execution is possible.
- Mobile and desktop layouts remain readable.

## Recommended implementation prompt

Implement the smallest safe Meeting Room roster clarity pass:
- In `public/control-center/pages/ai-command.js`, update the left roster to show for each ready specialist: role, position, status, available tool count/top tools, active task (if any), and next recommended action, using only existing frontend data.
- For planned specialists, show label, status, and summary.
- Do not add backend, persistence, or autonomous execution.
- Do not change handlers, IDs, or data attributes.
- Only adjust `public/control-center/styles/12-pages.css` if needed for roster readability.
- Do not touch any forbidden files.
- All output remains draft, preview, or route-only.
