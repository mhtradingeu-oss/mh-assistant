# MH-OS Next Development Plan
Date: 2026-05-10
Purpose: Controlled page-by-page frontend development order after audit

## Core Rules (Must Stay Enforced)
1. Required UX pattern: Header + Main View + Action Panel + AI Panel.
2. Required AI pattern: contextual AI + AI Team + Next Best Action.
3. Required safety rule: no heavy runtime in render.
4. Required architecture rule: frontend projects backend authority.

## Delivery Algorithm Per Page
For each page in sequence, always run this cycle:
1. Audit: confirm current page code, API contracts, listeners, and authority boundaries.
2. Confirm: validate backend payload shape and projection-only mapping.
3. Decide: finalize what moves to backend projections vs UI-only presentation.
4. Implement plan: execute scoped UI and architecture changes only for that page.

## Page-by-Page Development Order
1. Library
- Reason: high complexity, global listeners, and core asset dependency for downstream pages.

2. Media Studio
- Reason: largest route and high coupling with approvals, publishing, and AI media tooling.

3. Publishing
- Reason: safety-critical lane with governance and manual/ready execution states.

4. Workflows
- Reason: automation bridge route that currently holds significant orchestration logic.

5. Governance
- Reason: central policy and approval UX must be canonical before scaling execution UX.

6. Settings
- Reason: role/team/policy configuration should consume canonical projections before wider UI standardization.

7. Operations Centers
- Reason: task/queue/job/notification centers should become stable operational side surfaces.

8. AI Command
- Reason: replace page-local role authority with backend projected team model.

9. Content Studio
- Reason: major handoff lane after governance/workflow/publishing models are stabilized.

10. Campaign Studio
- Reason: campaign planning should then become pure projection and routing surface.

11. Integrations
- Reason: expose supported/unsupported states and connection readiness with cleaner UX contract.

12. Insights
- Reason: align recommendation provenance and next-best-action with finalized operating pattern.

13. Research
- Reason: normalize research-to-action routing using durable tasks/handoffs.

14. Setup
- Reason: finalize upstream onboarding UX with stable backend projection contracts.

15. Home
- Reason: finalize executive surface after dependent lane consistency is complete.

16. Ads Manager
- Reason: complete paid lane as projection-driven operating page after core platform is stable.

## Guardrail Checklist For Every Implementation Step
1. No hardcoded authority rules in page modules.
2. No frontend-owned approval, permission, governance, or role truth.
3. No new global listeners without lifecycle ownership and teardown strategy.
4. No heavy computation directly inside render loops.
5. No bypass of backend publish/governance safety.

## Readiness Gate To Start Each Next Page
1. Route syntax checks pass.
2. Page loads with no blocking overlay conflict.
3. Action panel and AI panel both present and route-aware.
4. Next best action derived from backend-projected data.
5. Handoffs/approvals/ownership visible from durable backend payloads.
