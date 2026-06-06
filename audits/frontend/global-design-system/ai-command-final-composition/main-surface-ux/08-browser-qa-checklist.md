# 08 — Browser QA Checklist

Scope: manual QA for AI Command main surface after the next approved patch. Do not change command execution behavior during QA.

## Open AI Command

- Open the Control Center.
- Navigate to `#ai-command`.
- Confirm the page renders one AI Command shell, not multiple stacked shells.
- Confirm visible regions:
  - header / command room
  - AI Team / specialist rail
  - conversation surface
  - composer
  - right output workspace
  - Tool actions
  - footer status strip
- Confirm no console error appears on initial render.

## Switch Specialist / Team

- Click several solo specialists in the left rail.
- Confirm selected state moves correctly.
- Confirm the conversation header and composer label update to the selected specialist.
- Confirm switching specialist does not erase a manually typed composer draft unless it is a generated role draft.
- Toggle `Full Team`.
- Confirm the team state is clear and the composer targets the team.
- Toggle back to `Ask Specialist`.
- Confirm the selected specialist is usable and no duplicate panels appear.

## Write In Composer

- Type a short message.
- Confirm draft state changes from empty to saved.
- Press `Shift+Enter`.
- Confirm a newline is inserted.
- Press `Enter`.
- Confirm the send action is triggered only when the send button is enabled.
- Confirm the composer remains visually primary and text does not overlap the toolbar.

## Open Tool Drawer

- Click a right-column Tool action.
- Confirm one Tool Drawer opens.
- Confirm output, source/input, destination, language, tone, source details, and extra brief controls are visible.
- Confirm `Use in Composer` is visually primary in the drawer.
- Close the drawer and confirm focus returns to the composer or a sensible fallback.

## Use Library Source

- Open a source-required Tool action.
- Click `Change source`.
- Confirm navigation to Library.
- Select an asset using `Use as Source in AI Command`.
- Return to AI Command.
- Confirm the drawer reopens when expected.
- Confirm selected source is visible inside the drawer.
- After the next approved source-visibility patch, confirm selected source is also visible on the main AI Command surface.

## Use In Composer

- With a selected Library source, click `Use in Composer`.
- Confirm the drawer closes.
- Confirm the composer receives a structured prompt.
- Confirm the prompt includes selected source context.
- Confirm the status text says the tool loaded into composer.
- Confirm no backend execution, publishing, CRM mutation, workflow run, or external send occurs.

## Status / History / Results

- Send a normal chat request if the AI chat route is available.
- Confirm loading state is readable.
- Confirm assistant response appears in the focused conversation.
- Confirm latest response actions appear: Create Preview, Route, Follow Up, Copy.
- Click `Create Preview`.
- Confirm the right output workspace shows the preview.
- Confirm preview actions are readable and route/copy/use/clear are visually distinct.
- Switch specialists after a response.
- Confirm prior specialist replies appear only in shared history and do not confuse the active specialist conversation.
- Confirm footer status strip remains readable.

## Responsive / Density Check

Check at minimum:
- desktop wide: 1440px
- laptop: 1280px
- tablet: 900px
- mobile: 390px

For each width:
- Composer remains visible and usable.
- Send button is not clipped.
- Specialist rail does not crowd the composer.
- Right output/tools column stacks or scrolls cleanly.
- Tool cards do not overlap or truncate into unreadable labels.
- Status strip does not create horizontal overflow.
- Drawer fits viewport and action buttons are reachable.
- Long specialist names, source names, and output titles truncate or wrap cleanly.

## Regression Guard

- Re-run syntax checks.
- Re-run Library source handoff path.
- Re-run Tool Drawer source-required validation.
- Confirm no backend/API files changed unless explicitly approved.
