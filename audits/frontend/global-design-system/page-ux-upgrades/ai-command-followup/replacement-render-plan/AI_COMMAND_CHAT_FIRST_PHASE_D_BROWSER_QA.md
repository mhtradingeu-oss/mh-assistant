# AI Command Chat-First Phase D Browser QA

## Status

Manual browser QA in progress.

## Observed improvements

- AI Command now uses a chat-first layout.
- Old left team rail is no longer visible in the primary layout.
- Old right output/tools aside is no longer visible in the primary layout.
- Old operating flow cards are no longer above the chat.
- Bottom visible tabs are now Tools / Output / Flow.
- Team selection remains available in the chat topbar.
- The page no longer shows the large Team tab list under the chat after Phase D.

## Observed issues to verify

- Confirm normal zoom desktop layout, not only zoomed-out view.
- Confirm mobile layout keeps one chat window first.
- Confirm Tools / Output / Flow tab switching works.
- Confirm composer input and send behavior still work.
- Confirm Tool Drawer still opens from Tools tab.
- Confirm Output tab preserves preview/handoff behavior.
- Confirm voice remains disabled/planned.
- Confirm planned specialists are not activated.
- Investigate visible `app-ui_required` message/status separately; do not treat it as a UI layout failure unless it blocks normal chat flow.

## Required QA screenshots

- Desktop normal zoom first viewport.
- Desktop chat window with composer.
- Desktop Tools tab.
- Desktop Output tab.
- Desktop Flow tab.
- Mobile first viewport.
- Mobile composer area.

## Commit decision

Do not commit until Browser QA passes and data/projects remains clean.
