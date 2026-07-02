# MH-OS Production Readiness Checklist

Status: Canonical
Created: 2026-05-17

## Definition Of 100 Percent Ready

MH-OS is 100 percent ready only when the operating model, page quality, frontend architecture, AI handoff contract, governance safety, backend mutation boundaries, browser QA, responsive QA, planned/disabled action review, and rollback path are all validated.

A system can be usable before it is 100 percent ready. Do not call it complete while planned, disabled, hybrid, or unverified execution paths remain unclear.

## Route Checks

- Every expected route is registered once in `router.js`.
- Every registered route has one owning page module.
- Every route has a matching `data-page` root where applicable.
- Unknown or planned pages are not silently linked as real pages.
- Composite routes such as Operations Centers are documented.
- Route access is projected from backend authority or clearly marked as compatibility fallback.

## Page Checks

For every page:

- Purpose is clear.
- Primary action is clear or deferred.
- Next best action is visible.
- AI Team handoff exists or is explicitly deferred.
- Page-to-page transitions are clear.
- Empty/loading/error states exist.
- Action Panel and AI Panel are present or documented as deferred.
- Real/planned/disabled actions are visibly distinct.
- Page does not duplicate backend authority.
- Page has final audit evidence.

## AI Handoff Checks

- Handoff includes `source_page`, `title`, `summary`, `prompt`, specialist/mode, route suggestions, draft context, and safety note.
- Source-to-specialist default is correct.
- Missing destination routes are marked planned.
- AI Team does not claim execution it cannot perform.
- Customer Ops/Sales/CRM handoffs remain draft-only unless audited.

## Duplicate Checks

Run search checks for duplicate route IDs, duplicate `data-page` roots, duplicate active DOM IDs, duplicate page files for the same workspace, duplicate role/team maps where backend projection exists, duplicate CSS systems, and duplicate canonical docs outside `docs/mh-os/`.

## Backend Mutation Safety

Before release:

- Protected read/write middleware remains intact.
- Project slug validation remains intact.
- Project-isolated path resolution remains intact.
- Publishing guardrails remain intact.
- Governance approval-before-publish remains enforced.
- L3 and L4 actions have safety/authority audits and confirmation UX.
- No page performs backend mutation during render.
- No customer-facing action executes without explicit confirmation and approved handler.
- No CRM mutation or outreach send executes without approved handler.

## Governance Confirmations

- Approval policy is backend-owned.
- Freeze/publishing guardrails cannot be bypassed from frontend.
- Compliance Reviewer and Governance routes are used for claim/brand/publish risk.
- Settings does not become a second canonical policy source.
- Governance summaries are projected from backend state.

## Responsive QA

Check representative widths: 1600px, 1366px, 1024px, 768px, and 390px.

Confirm no horizontal overflow, no overlapping text, clean rail stacking, reachable action controls, and no content hidden by assistant/dock controls.

## Browser QA

For each finalized page:

- Load with selected project.
- Load with no selected project if supported.
- Exercise primary filters/tabs/search.
- Verify empty and filtered-empty states.
- Verify loading/error handling when possible.
- Verify AI handoff or prompt route.
- Verify route buttons open expected destinations.
- Verify planned/disabled controls do not fire.
- Verify console has no expected-flow errors.

## Planned / Disabled Action Review

Before release, inspect every visible action that implies create task, export file, publish, schedule, approve/reject, execute workflow, generate media, send customer reply, create ticket, change SLA, trigger escalation, mutate CRM, or send outreach.

If not fully wired, audited, confirmed, and validated, label it planned/disabled/draft-only.

## Release Blocker List

Release is blocked by any of these:

- Modified application source files outside intended scope.
- Dirty `data/projects` caused by UX/layout work.
- Failing `node --check` on required files.
- Duplicate active IDs or route IDs.
- Hidden or unlabeled planned execution controls.
- Backend mutation without confirmation.
- Governance bypass.
- Customer-facing action without approved handler.
- Missing rollback path.
- Unreviewed Customer Operations or P0.3 stash application.

## Launch Checklist

- Confirm branch and clean intended diff.
- Run validation commands.
- Verify canonical docs are current.
- Verify page final audits exist for release-critical pages.
- Verify backend readiness endpoints and protected access.
- Verify integrations required for the release scope.
- Verify semi-auto vs full-auto execution mode.
- Verify backup/snapshot plan.
- Verify rollback owner and command path.
- Verify release notes list planned/disabled capabilities honestly.

## Rollback Checklist

- Identify last known good commit/tag.
- Preserve runtime/data backups before migration.
- Do not reset or delete user/runtime data without explicit approval.
- Revert only the scoped change when possible.
- Re-run node checks and smoke checks after rollback.
- Document the reason, impact, and follow-up in an audit note.
