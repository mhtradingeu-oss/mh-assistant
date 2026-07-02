# STEP 41E Governance Final Shell/Header Adoption Audit

## Executive Summary
Governance is a strong structural match for the final shell/header model, but it is still on a custom page scaffold and has not adopted the shared standard shell primitives yet. The page already separates header, overview metrics, queue/table content, selected-item detail, policy controls, action controls, and AI handoff, so a future additive adoption is plausible without changing behavior. The safest classification is conditional: suitable as the first non-Operations adoption candidate only if STEP 41F stays class-only and preserves every existing handler, ID, data attribute, and API call.

## Files Inspected
- [public/control-center/pages/governance.js](/opt/mh-assistant/public/control-center/pages/governance.js)
- [public/control-center/ui/page-standard.js](/opt/mh-assistant/public/control-center/ui/page-standard.js)
- [public/control-center/styles/14-page-standard.css](/opt/mh-assistant/public/control-center/styles/14-page-standard.css)
- [public/control-center/styles/15-clean-operating-layer.css](/opt/mh-assistant/public/control-center/styles/15-clean-operating-layer.css)
- [public/control-center/styles/09-operations-centers.css](/opt/mh-assistant/public/control-center/styles/09-operations-centers.css)

## Current Governance Structure
Governance renders through a custom route with `disableStandardLayout: true` and a bespoke `governance-shell` / `governance-workspace` wrapper. The page uses repeated `panel` sections for its top-level layout, including a command-surface header, system-signal summary, policy summary, decision queue, selected decision detail, review ownership, governance actions, and an AI assistant section.

The current top-level structure is:
- Command surface header panel with project-specific title and description.
- System signals panel with metrics and recent activity.
- Two-column work area built from `governance-workspace-grid` and `governance-action-stack` wrappers.
- Left-side policy and decision stack.
- Right-side selected decision, ownership, and actions stack.
- Bottom AI assistant panel with prompt shortcuts and AI handoff.

## Current Action / API / Handler Inventory
The page currently depends on these backend and orchestration calls:
- `fetchProjectGovernance(projectName, { timeline_limit: 60 })`
- `updateProjectGovernancePolicy(projectName, payload)`
- `createProjectApproval(projectName, payload)`
- `decideProjectApproval(projectName, approvalId, payload)`

The main interactive controls currently preserved by the page are:
- Approval decision buttons using `data-governance-decision` and `data-approval-id`.
- Focus tabs using `data-governance-focus`.
- Queue selection rows using `data-governance-select`.
- Approval request buttons using `data-governance-request-approval`.
- Governance action buttons using `data-governance-action` for refresh, save-policy, and sync-settings.
- Policy toggles using `data-governance-policy`.
- Policy owner inputs using `data-governance-owner`.
- AI open button using `data-governance-open-ai`.
- AI prompt shortcut buttons using `data-governance-ai-prompt`.

Relevant preserved IDs include:
- `governanceDecisionNote`
- `governance-approval-before-publish`
- `governance-claim-review`
- `governance-brand-safety`
- `governance-auto-escalate`
- `governance-admin-override`
- `governance-freeze-publishing`
- `governance-owner-content`
- `governance-owner-media`
- `governance-owner-publishing`

## Current Safety / Confirmation Coverage
Governance already includes durable interaction safety around its existing controls:
- Save-policy requires an explicit `window.confirm(...)` confirmation before calling `updateProjectGovernancePolicy`.
- Sync-settings validates that a durable settings snapshot exists before updating governance policy.
- Approval decisions derive the escalation target from the review model instead of hardcoding a branch decision.
- AI handoff is context-only and routes to AI Workspace rather than executing governance changes directly.
- Request-approval actions build a concrete approval payload from the selected item and ownership model.

## Gap to Final Shell/Header Model
Compared with the final shell/header target, Governance is missing the shared shell primitives and their explicit layout semantics:
- No `std-page-shell` adoption in the route itself.
- No `std-context-ribbon` header surface.
- No standard `std-main-column` and `std-right-rail` adoption.
- No `std-detail-card`, `std-action-panel`, or `std-ai-panel` adoption.
- No `std-action-row`, `std-deferred-actions`, or `std-quick-actions` adoption.
- The page still encodes layout with custom governance-specific wrappers instead of the shared shell vocabulary.

The current page does, however, already contain the logical content buckets that map cleanly to the target model:
- Context Ribbon / Header: command surface header and page description.
- Main View: system signals, policy summary, queue table, and selected decision detail.
- Right Rail: review ownership and governance actions.
- Detail Card: selected decision content and linked approval state.
- Action Panel: policy save, sync, refresh, approval actions, and request approval controls.
- AI Panel: governance AI assistant and prompt shortcuts.
- Readiness / Blockers: policy violations, queue status, and selected-item flags.
- Next Best Action: AI prompt shortcuts and the page-standard next-action pattern, though not yet represented by the shell primitives.

## Proposed Future Adoption Scope
The smallest future STEP 41F should be additive only and should not change runtime behavior. The likely scope is:
- Add shared shell classes to existing governance containers where the semantic fit is already obvious.
- Reuse existing markup and handlers; do not rename or remove current IDs.
- Keep all current `data-governance-*` attributes intact.
- Keep all current approval, policy, and AI calls intact.
- Do not change the approval workflow, payload shape, or escalation logic.
- Do not change copy in a way that weakens policy provenance or confirmation language.

Most likely additive mapping:
- Existing top-level governance workspace wrapper to `std-page-shell` compatible grouping in future, if the route is later moved into the standard shell.
- Existing decision and policy blocks to `std-main-column`.
- Existing ownership and action blocks to `std-right-rail`.
- Existing selected-decision and policy-summary blocks to `std-detail-card`.
- Existing action groupings to `std-action-panel` and `std-action-row`.
- Existing AI assistant section to `std-ai-panel` and `std-quick-actions`.

## Risk Classification
Risk level: medium.

Reasoning:
- The page is structurally compatible with the final model, which reduces layout risk.
- The page is action-dense and policy-sensitive, which increases behavioral risk if markup is reorganized carelessly.
- The current route uses custom scaffolding and many preserved IDs/data attributes, so even class-only adoption needs a precise mapping.
- The page already guards important mutations with confirmation and payload validation, so the main risk is layout regression rather than business-logic regression.

## Preservation Requirements
Any implementation step after this audit must preserve:
- All approval decision buttons and `data-governance-decision` values.
- All request-approval attributes and approval payload fields.
- All policy toggle IDs and `data-governance-policy` bindings.
- All policy owner input IDs and `data-governance-owner` bindings.
- The save-policy confirmation flow.
- The settings sync validation flow.
- The AI open and AI prompt shortcut behavior.
- The backend API call set used by the page today.
- The governance copy that communicates policy pressure, risk, and authority.

## Recommended STEP 41F
Proceed only with an additive shell-adoption pass that:
- Adds shared shell classes to existing governance containers where they already match the target semantics.
- Leaves all handlers, IDs, data attributes, and backend calls unchanged.
- Avoids any copy rewrite beyond neutral structural labeling.
- Avoids any CSS file changes unless a later layout mapping requires a separate styles-only step.

The safest implementation direction is a class-only mapping pass, not a functional rewrite.

## Explicit No-Code-Change Statement
This audit changed no production code. No CSS, JavaScript, backend, or data/project files were modified. This document is analysis only.