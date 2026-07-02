# STEP G1 — Global UI/UX Preservation Contract

**Purpose:**
This contract governs all redesign, migration, and refactor work for the MH-OS frontend. It is binding for all contributors and reviewers. No production code, CSS, JS, or backend changes are permitted under this contract. Documentation only.

---

## 1. System Identity
- **MH-OS is an AI Business Operating System, not a dashboard.**
- All UI/UX must reinforce this distinction in structure, language, and workflow.

## 2. Backend Authority
- **Backend remains the single source of truth and authority.**
- The frontend is a projection and experience layer only.
- No frontend change may override, bypass, or duplicate backend logic or authority.

## 3. Page Structure Requirements
Every page must include, in order:
- **Header**
- **Main Workspace**
- **Result Preview**
- **Action Panel**
- **AI Guidance**

## 4. Redesign Inviolables
No redesign or migration may change:
- Element IDs
- Data attributes
- Event handlers
- API call structure or endpoints
- Route behavior
- Backend authority or logic
- Approval, publish, or governance behavior

## 5. CSS Rules
- No duplicate selectors allowed.
- No new page CSS unless fully and explicitly scoped.
- No CSS-on-CSS patching (do not override existing selectors with new selectors).
- Use global primitives first; extend only if necessary.
- Legacy CSS must not be reused or imported into new modules.

## 6. Mandatory Result Preview
The **Result Preview** section is required for all pages involving:
- Content
- Media
- Publishing
- Campaigns
- Email
- Ads

## 7. Page Migration Workflow
All page migrations must follow this sequence:
1. **Audit** — Document current state and requirements.
2. **Confirm** — Validate audit with stakeholders.
3. **Decide** — Approve migration plan.
4. **Implement** — Make changes in a feature branch.
5. **Browser QA** — Validate in all supported browsers.
6. **Commit** — Stage and commit changes with audit reference.

## 8. Launch-Ready UX Criteria
A page is launch-ready only if:
- All required structure (see Section 3) is present.
- All interactive elements are accessible and labeled.
- No regressions in navigation, workflow, or data integrity.
- Result Preview is functional and accurate.
- All validation commands (see Section 11) pass without error.
- Stakeholder sign-off is recorded.

## 9. Rollback Rules
- Any migration or redesign must be fully reversible.
- Rollback must restore all IDs, data attributes, handlers, and CSS to pre-migration state.
- Rollback plan must be documented before implementation.

## 10. Required Validation Commands
Before commit, run and pass:
- `git status --short` (no uncommitted noise outside intended files)
- `git diff --stat` (review scope)
- `node --check public/control-center/pages/governance.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`
- `node --check public/control-center/shared-context.js`
- `node --check public/control-center/api.js`
- `grep -n "Header\|Main Workspace\|Result Preview\|Action Panel\|AI Guidance" public/control-center/pages/`
- Any additional project-specific QA commands

---

**This contract must be reviewed and signed by all contributors before any redesign or migration work begins.**
