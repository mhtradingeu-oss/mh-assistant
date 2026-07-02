# T185C.5E5C — AI Command Legacy CSS Selector Ownership Audit

## Status
Audit closed. No CSS cleanup patch applied in this phase.

## Scope
Classify AI Command CSS selectors after the dormant legacy render blocks were removed in T185C.5E5B.

## Baseline
- HEAD before this audit: `02b0d71 Remove dormant AI Command legacy render blocks`
- Runtime data files under `data/projects/hairoticmen/ops/` remained dirty and were not touched.
- No source patch was applied during this audit.

## Key Result
The active AI Command JavaScript no longer references the removed legacy v2 composer, preview, output workspace, or media status selectors.

## Orphan CSS Candidates
The following selectors have zero references in `public/control-center/pages/ai-command.js` but still exist in `public/control-center/styles/12-pages.css`:

- `aicmd-v2-composer`
- `aicmd-chatgpt-composer`
- `aicmd-room-output-workspace`
- `aicmd-v2-preview`
- `aicmd-v2-media-status`

Observed counts:
- `aicmd-v2-composer`: ai=0, css=40
- `aicmd-chatgpt-composer`: ai=0, css=6
- `aicmd-room-output-workspace`: ai=0, css=10
- `aicmd-v2-preview`: ai=0, css=57
- `aicmd-v2-media-status`: ai=0, css=18

## Active CSS Selectors Preserved
The active AI Command surface still uses and must preserve styling for:

- `aicmd-final-composer`
- `aicmd-final-source-menu`
- `aicmd-chatfirst-composer`
- `aicmd-smart-wizard`

Observed active counts:
- `aicmd-final-composer`: ai=1, css=10
- `aicmd-final-source-menu`: ai=3, css=15
- `aicmd-chatfirst-composer`: ai=2, css=19
- `aicmd-smart-wizard`: ai=37, css=56

## Important Notes
Some `ctrl-*` strings still exist in `ai-command.js`, but matching CSS selectors were not found in the scanned CSS files. They are not part of the orphan CSS removal target.

The active tool drawer uses `tool-dock.js` and its own `mhos-tool-drawer` / tool drawer data attributes. It was not part of this CSS removal audit and must not be removed as legacy.

## Decision
No CSS was removed in this phase.

Reason:
`12-pages.css` contains repeated historical AI Command CSS layers. A dedicated patch should remove only proven orphan selector blocks after reviewing exact ranges and ensuring no active final composer, wizard, source menu, or tool drawer styles are affected.

## Recommended Next Patch
`T185C.5E5D — Remove Orphan AI Command Legacy CSS Selectors`

Narrow scope:
- Remove only CSS blocks targeting:
  - `aicmd-v2-composer`
  - `aicmd-chatgpt-composer`
  - `aicmd-room-output-workspace`
  - `aicmd-v2-preview`
  - `aicmd-v2-media-status`
- Do not remove:
  - `aicmd-final-*`
  - `aicmd-chatfirst-*`
  - `aicmd-smart-wizard*`
  - `mhos-tool-drawer`
  - `aicmd-tool-dock`
  - shared page layout styles

## Validation
The audit scan completed successfully:
- AI Command selector counts were generated after JS cleanup.
- CSS selector counts were generated for `12-pages.css` and `14-page-standard.css`.
- Active CSS block locations were confirmed.
- Syntax checks passed for:
  - `public/control-center/pages/ai-command.js`
  - `public/control-center/pages/ai-command/tool-dock.js`
  - `public/control-center/shared-context.js`
  - `public/control-center/api.js`
  - `public/control-center/app.js`
  - `public/control-center/router.js`
  - `runtime/orchestrator-service/server.js`

## Final Result
AI Command JS is now free of legacy v2 composer/preview/output/media status references. CSS still contains orphan legacy selector blocks and should be cleaned only in a later narrow CSS patch.
