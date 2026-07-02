# MH-OS Safe Upgrade Protocol

Status: Canonical
Created: 2026-05-17

## Purpose

This protocol is mandatory for every future Codex prompt that changes MH-OS. It protects the repo from duplicate routes, authority drift, unsafe backend mutation, stale stashes, and unverified page work.

## Required Precheck

Always start with:

```bash
git status --short
git diff --name-only
```

If application source files are modified unexpectedly, stop and report before changing files.

Application source includes:

- `public/control-center/**`
- `runtime/**`
- `data/**`
- package files
- server/router/app/api files

## Audit First

Before patching:

- Read relevant canonical docs under `docs/mh-os/`.
- Read current page/source audit evidence.
- Identify owner page, route, API, and safety level.
- State whether the task is documentation-only, frontend-only, backend-only, runtime-only, or data-touching.
- Confirm the allowed changed paths.

## Search Before Create

Before creating any file, route, page, CSS block, handler, doc, or source-of-truth definition:

```bash
rg "target-name-or-route" .
rg "data-page=\"route-id\"" public/control-center
rg "id: \"route-id\"" public/control-center
```

Create only when a real gap is confirmed and the task scope allows it.

## No Duplicate Pages / Routes / Files

Never create duplicate route IDs, page modules, active DOM IDs, CSS ownership layers, backend authority models, or canonical documentation sets.

If the target appears missing but related functionality exists under a composite route, use or extend the existing route only after approval.

## Backend Mutation Rules

No backend mutation unless all are true:

- The task explicitly asks for it.
- The relevant API/backend handler already exists or is being created under approved scope.
- The action is classified as L3 or L4 and audited.
- The UI requires explicit user confirmation.
- Backend guardrails remain intact.
- Validation proves no unintended data mutation.

Never mutate backend data during render.

## Planned Stays Planned

If an action is not fully connected and audited, keep it planned, disabled, draft-only, preview-only, provider-dependent, or needs confirmation.

Do not turn a planned label into a working button without the required implementation and safety audit.

## Protected Files And Areas

Treat these as protected unless the task explicitly allows them:

- Customer Operations stashes.
- P0.3 AI Team inbound handoff stashes.
- `data/projects/**` and runtime-generated data.
- Backend publishing guardrails.
- Governance policy and approval authority.
- Route access and backend authority projection.
- Package/dependency files.
- Existing audits/history files during documentation-only runs.

## Validation Commands

Baseline validation for documentation or frontend-adjacent work:

```bash
git status --short
git diff --name-only
node --check public/control-center/pages/ai-command.js
node --check public/control-center/pages/operations-centers.js
node --check public/control-center/router.js
node --check public/control-center/app.js
node --check public/control-center/api.js
node --check runtime/orchestrator-service/server.js
```

For page work, also run `node --check` on every touched page file. For backend/runtime work, run the relevant test/smoke/contract commands documented in the task or audit.

## Browser QA

Required when UI or CSS changes:

- Verify target route loads.
- Verify expected interactions.
- Verify empty/loading/error states.
- Verify planned/disabled controls do not fire.
- Verify no console errors in expected flows.
- Verify desktop and mobile widths.
- Verify no horizontal overflow or overlapping text.
- Verify assistant/dock controls do not cover content.

## Commit Rules

- Do not commit automatically unless asked.
- One page or one concern per commit.
- Commit message must describe the real scope.
- Include validation evidence in final response or audit doc.
- Do not include unrelated dirty files.
- Never revert user changes unless explicitly requested.

## Stash Handling

- Do not apply stashes by default.
- Do not inspect or apply Customer Operations or P0.3 stashes unless the task explicitly opens that phase.
- If asked to use a stash, inspect its file list first.
- If stash scope touches unrelated protected files, stop and ask.
- Never mix stash application with unrelated documentation or page finalization.

## Missing Pages

If a page is missing:

1. Search route registry and page files.
2. Search composite surfaces such as Operations Centers.
3. Search docs and audits.
4. Mark it planned if no route exists.
5. Add it to backlog or page registry.
6. Create it only in a task explicitly scoped to that page.

## Final Response Requirements

For every future implementation response, include files changed, what changed, what stayed planned/disabled, validation results, git status summary, and confirmation that protected files were not touched unless explicitly allowed.
