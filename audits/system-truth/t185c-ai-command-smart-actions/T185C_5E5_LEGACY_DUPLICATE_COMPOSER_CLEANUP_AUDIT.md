# T185C.5E5 - AI Command Legacy / Duplicate Composer Cleanup Audit

## Status
Audit closed. No runtime cleanup patch applied in this phase.

## Scope
Classify AI Command legacy composer, duplicate output blocks, active tool drawer, source/attachment flows, session/history UX, specialist/team model, shared-context handoff wiring, and CSS selector risk before any deletion.

## Evidence Snapshot
Baseline:
- HEAD: `518642f Close AI Command composer source truth audit`
- Dirty files before and after scan were limited to known runtime data under `data/projects/hairoticmen/ops/`.
- No AI Command source file was dirty before this audit doc.

Validation:
- `node --check public/control-center/pages/ai-command.js`
- `node --check public/control-center/pages/ai-command/tool-dock.js`
- `node --check public/control-center/shared-context.js`
- `node --check public/control-center/api.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`
- `node --check runtime/orchestrator-service/server.js`

All syntax checks passed.

## Active Final Composer
Classification: ACTIVE / MUST KEEP.

Verified active markers:
- `aicmd-final-composer`
- `data-aicmd-open-plus`
- `data-aicmd-final-source-menu`
- `data-aicmd-final-specialist`
- `aicmdV2AskBtn`
- `aicmdV2VoiceBtn`

The active composer is rendered by `renderAiCommandChatComposer` and includes session controls, Smart Action Center, attachment/source menu, specialist selector, quick tool chips, language/market context, status line, and Campaign wizard.

## Active Tool Dock / Drawer
Classification: ACTIVE TOOL DRAWER / MUST KEEP.

Verified active wiring:
- `tool-dock.js` is imported by `public/control-center/pages/ai-command.js`.
- `bindAiToolDock` is called from the active AI Command render path.
- `renderAiToolDrawerShell` is imported and the drawer marker exists in `tool-dock.js`.
- `data-aicmd-tool-dock` buttons are bound by `bindAiToolDock`.
- `data-aicmd-tool-drawer` is the active prompt setup drawer.

Conclusion: the "old drawer" is not proven dead. It is the active guided prompt/tool drawer connected to source selection, Library return context, destination framing, prompt preparation, and composer prefill. It must not be removed as legacy.

## Dormant Legacy Composer
Classification: DORMANT / SAFE CANDIDATE FOR LATER NARROW REMOVAL.

Function call scan:
- `renderCommandComposer`: definitions=1, calls=0
- `renderPhase1Composer`: definitions=1, calls=0

Legacy markers:
- `ctrlSendBtn`: 1
- `ctrl-composer-textarea`: 1
- `aicmdV2AskBtnLegacy`: 1
- `aicmdV2VoiceBtnLegacy`: 1

These blocks are definition-only in the current scan. They should not be removed in this audit phase, but they are strong candidates for `T185C.5E5A - Legacy Composer Dormant Removal Patch`.

## Duplicate Preview / Output Blocks
Classification: DORMANT / SAFE CANDIDATE FOR LATER NARROW REMOVAL AFTER HANDLER CHECK.

Function call scan:
- `renderPhase2PreviewPanel`: definitions=1, calls=0
- `renderAiRoomOutputWorkspace`: definitions=1, calls=0
- `renderPhase2MediaStatusPanel`: definitions=1, calls=0

Legacy output markers:
- `aicmdV2PreviewSendBtnLegacy`: 1
- `aicmdV2PreviewCopyBtnLegacy`: 1
- `aicmdV2PreviewUseBtnLegacy`: 1
- `aicmdV2PreviewClearBtnLegacy`: 1

These render blocks are not active in the current route path. Before removal, the next patch should also verify any event handler references for these IDs and remove only paired dead handlers/selectors in the same narrow scope.

## Source / Attachment Flows
Classification: ACTIVE / NEEDS FUTURE SOURCE CONNECTION PATCHES.

Active:
- Upload option stages local file names as AI context.
- Library option routes through `openLibrarySourcePickerFromAiCommand`.
- Project context option is visible and status-backed.
- Attachment chips render staged files and selected Library source.

Follow-up:
- Product source selection is visible but still planned.
- Upload persistence/source storage remains future work.
- Library source path is connected but should remain part of a later source truth verification phase.

## History / Session UX
Classification: ACTIVE / NEEDS POLISH.

Active:
- `renderAiCommandComposerSessionControls`
- recent session selector
- New chat control
- session draft persistence

Follow-up:
- History labels are functional but still generic; this remains suitable for `T185C.5E6 - AI Command History Label Polish`.

## Specialist / Team Model
Classification: ACTIVE / MUST KEEP.

Active:
- final specialist selector
- full AI Team mode
- individual specialist options
- guarded connected-context language
- team and specialist tool chips derived from the current mode

No cleanup is recommended in this phase.

## Handoff / Shared-Context Wiring
Classification: ACTIVE / MUST KEEP.

Active tool drawer wiring uses shared context for:
- Library source selection bridge
- AI drawer return context
- selected source restoration
- composer prompt preparation

No backend authority or durable handoff creation was introduced by this audit.

## CSS Selectors
Classification: LEGACY BUT STILL REFERENCED / NEEDS LATER CSS SELECTOR AUDIT.

Legacy composer/output classes still exist in dormant render definitions. They may also have CSS selectors in global styles. Do not remove CSS selectors until the paired dormant render removal patch verifies there are no active references.

## Final Classification Matrix
| Surface | Classification | Decision |
| --- | --- | --- |
| Final composer | ACTIVE / MUST KEEP | Preserve |
| Tool dock / drawer | ACTIVE / MUST KEEP | Preserve; possible visual cleanup later |
| Old `ctrl-*` composer | DORMANT | Candidate for later removal |
| Legacy V2 composer | DORMANT | Candidate for later removal |
| Legacy preview panel | DORMANT | Candidate for later removal after handler check |
| Legacy output workspace | DORMANT | Candidate for later removal after handler check |
| Legacy media status panel | DORMANT | Candidate for later removal |
| Source menu | ACTIVE | Preserve |
| Upload staging | ACTIVE / PLANNED PERSISTENCE | Preserve; verify later |
| Library source bridge | ACTIVE | Preserve |
| Product source option | PLANNED | Patch later, do not overclaim |
| History/session controls | ACTIVE / NEEDS POLISH | Preserve; polish later |
| Specialist/team selector | ACTIVE | Preserve |

## Recommended Next Patch
`T185C.5E5A - Legacy Composer Dormant Removal Patch`

Narrow scope:
- remove `renderCommandComposer`
- remove `renderPhase1Composer`
- remove `renderPhase2PreviewPanel`
- remove `renderAiRoomOutputWorkspace`
- remove `renderPhase2MediaStatusPanel`
- remove only proven-dead paired legacy handlers/selectors after a fresh targeted reference scan

Do not remove:
- `tool-dock.js`
- `bindAiToolDock`
- `data-aicmd-tool-dock`
- `data-aicmd-tool-drawer`
- final composer IDs/data attributes
- shared-context source/handoff bridge helpers

## Final Result
AI Command has one active final composer and one active guided tool drawer. The scan found dormant legacy composer and duplicate preview/output render definitions, but no evidence that the active drawer is removable. No production code cleanup was applied in this phase; removal should happen only in a later narrow patch with a fresh reference and handler scan.
