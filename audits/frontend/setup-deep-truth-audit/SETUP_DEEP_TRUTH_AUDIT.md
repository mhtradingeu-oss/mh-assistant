# SETUP DEEP TRUTH AUDIT — MH-OS / MH Assistant

## Executive Summary

This audit evaluates the Setup page as the project configuration, source-of-truth, readiness, connector, and launch foundation page for MH-OS. Setup is mostly complete as a foundation and handoff surface, but some visibility, clarity, and backend projection gaps remain. Setup must remain a configuration and verification surface, not a dashboard for every system. Backend = Authority; Frontend = Projection + Experience.

## Evidence References

This audit is based on the following evidence files:

- [evidence/01-git-baseline.txt](evidence/01-git-baseline.txt)
- [evidence/02-setup-file-map.txt](evidence/02-setup-file-map.txt)
- [evidence/03-setup-structure-map.txt](evidence/03-setup-structure-map.txt)
- [evidence/04-setup-api-data-dependency-map.txt](evidence/04-setup-api-data-dependency-map.txt)
- [evidence/05-connected-system-truth-references.txt](evidence/05-connected-system-truth-references.txt)
- [evidence/06-setup-runtime-accessibility-proof.txt](evidence/06-setup-runtime-accessibility-proof.txt)
- [evidence/08-evidence-index.txt](evidence/08-evidence-index.txt)

## Current Setup Truth

- Setup is implemented as a guided wizard with step-based configuration, readiness, and template application.
- All core project fields (identity, brand, market, audience, goals, competitors, channels) are present and mapped to backend data contracts.
- Readiness, asset, and connector gaps are surfaced with clear badges and summary chips.
- Save flows are confirmation-gated and protected; local draft and backend save are distinct.
- Setup hands off to Library, Integrations, AI Command, Governance, Publishing, and Home via explicit buttons and summary cards.
- Setup does not directly read or write source-of-truth files; it uses backend APIs for all persistence and reloads.
- Runtime accessibility is proven (status=200, backend orchestrator-service connected).

## Data / API Contract

- Setup reads backend-projected `overview`, `readiness`, `integrations`, and `assets`.
- Save calls `saveProjectSetup()` (POST to `/media-manager/project/:project/setup`), which persists to backend and triggers artifact updates.
- All readiness, asset, and connector states are backend-projected; Setup does not hardcode or fake live data.
- Data contract is consistent with Home, Library, Integrations, and Publishing.
- Source-of-truth registry is backend-owned; Setup does not mutate or read registry files directly.

## Source-of-Truth Visibility

- Setup surfaces project identity, brand, and asset status as projected by backend.
- Source-of-truth status is visible only as a summary or handoff ("Review in Library").
- No direct registry editing or fake source-of-truth claims.
- Library remains the authority for asset/source-of-truth management.

## Readiness / Connector Visibility

- Readiness is summarized with badges, completion percent, and missing field/asset/connector counts.
- Connector health is projected from backend; missing connectors are shown as gaps, not as live controls.
- No unsupported provider or CRM/IVR readiness is claimed unless backend data exists.
- All readiness and connector gaps are surfaced as summary, not as direct controls.

## Save / Draft / Protection Flow

- Local draft and backend save are clearly separated.
- Save is confirmation-gated and disables controls during persistence.
- Reset and validate actions are present and safe.
- No direct write controls for backend authority; all changes go through protected API.
- No direct asset, integration, or governance mutation from Setup.

## Connected Page Handoffs

- Library: asset/source-of-truth review and management
- Integrations: connector configuration and health
- AI Command: context-aware handoff for setup completion
- Governance: policy/approval handoff
- Publishing: campaign/publishing readiness handoff
- Home: executive summary and next best action
- All handoffs are explicit, not automatic or hidden

## UX / Density / Clarity Risks

- Setup is not overloaded, but risk exists if more fields or controls are added.
- Step-based wizard and summary chips keep density manageable.
- All advanced actions (asset, integration, campaign, governance) are handed off, not duplicated.
- No dense tables, raw logs, or direct workflow controls are present.
- Clarity risk if advanced features are surfaced without backend projection.

## Missing or Weak Areas

- No direct source-of-truth registry editing (correct by doctrine)
- CRM/IVR/advanced research readiness is not surfaced (correct; must wait for backend)
- No live campaign/ad/CRM metrics (correct; must wait for backend)
- Advanced recommendations and research are not present (P2/P3 only)
- Some summary/handoff cards could be clearer about what is partial vs. complete
- No direct error or rollback visibility for failed saves (could be improved)

## P1 Safe Improvement Plan

1. Clarify summary chips for partial/complete status ("Partial", "Planned", "Ready")
2. Add explicit handoff notes for CRM/IVR/advanced features ("Planned only", "See Library/Integrations")
3. Improve error/rollback feedback for failed saves
4. Ensure all readiness and connector gaps are surfaced as summary, not as controls
5. Review all handoff buttons for clarity and context
6. Run browser QA for all handoff and save flows

## P2 Deferred Improvements

- Add backend-projected CRM/IVR/research readiness when available
- Add advanced recommendation and research summary when backend supports
- Add more granular error/rollback feedback for all save/update flows
- Consider summary-only view for very large projects
- Defer any new field or control until backend projection exists

## Do Not Touch / Safety Rules

- Do not add live CRM, IVR, ticket, or advanced research controls
- Do not add dense tables, raw logs, or direct workflow execution
- Do not add direct asset, integration, or governance mutation
- Do not duplicate Home, Library, or Integrations content
- Do not bypass backend authority or protected save flows
- Do not add unsupported provider claims
- Do not rebuild Setup as a dashboard for every system

## Next Required Step

- Do not implement UI changes yet.
- First run Setup P1 Data Contract / Handoff Verification.
- Verify actual backend payload shape and current Setup handoff buttons.
- Confirm which P1 improvements can be done without backend changes.
- Only after that, implement a small Setup clarity/handoff patch if evidence supports it.

**Doctrines:**
- Backend = Authority.
- Frontend = Projection + Experience.
- Setup configures, verifies, explains, and hands off.
- Setup must not become Home, Library, Integrations, or Governance.
- No fake CRM/IVR/live metrics.
- No backend work unless evidence proves missing projection.

## Final Recommendation

Setup is mostly complete as a safe, backend-projected configuration and readiness foundation. Only summary, handoff, and protected save flows should be improved for clarity and error handling. All advanced features (CRM, IVR, research, advanced recommendations) must wait for backend projection and QA. Preserve Backend = Authority, Frontend = Projection. Do not expand Setup into a dashboard or add unsupported claims. Proceed with P1 clarity and handoff improvements only.
