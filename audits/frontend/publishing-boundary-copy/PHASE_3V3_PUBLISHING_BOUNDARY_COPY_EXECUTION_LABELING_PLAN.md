# PHASE 3V.3 — Publishing Boundary Copy / Execution Labeling Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3V.2 — Publishing Execution Safety Audit`
- Previous commit: `26f61fc Add Publishing execution safety audit`

## Purpose
Plan safe copy/label changes for Publishing after execution safety audit confirmed that Publishing contains backend-mutating actions.

The goal is to prevent operators from confusing:
- draft preparation
- manual queueing
- backend job status updates
- manual publish completion records
- actual external provider publishing

## Evidence From PHASE 3V.2
Confirmed:
- Publishing has UI-only actions.
- Publishing has local/localStorage draft actions.
- Publishing has backend-mutating schedule/reschedule/ready/publish/fail actions.
- No evidence currently proves live external social publishing from the frontend page alone.
- Publish route records a `published` status / manual publish completion outcome.
- Auto mode remains high risk and requires careful labeling.

## Copy Risk Areas

### 1. Publish Now / Publish action
Risk:
Operator may think the app posts directly to external channels.

Recommended copy direction:
Use safer terms such as:
- Record manual publish completion
- Mark manual publish complete
- Prepare publishing package
- Manual publish status update

Avoid unsupported claims:
- Published live
- Sent to Instagram
- Sent to Facebook
- External publish complete

### 2. Ready to publish
Risk:
Operator may think all provider and Governance gates are complete.

Recommended copy direction:
- Ready for manual publishing review
- Ready for manual queue
- Backend readiness state
- Requires provider/Governance confirmation where applicable

### 3. Queue for Manual Publishing / Schedule
Risk:
Operator may think schedule triggers automatic external posting.

Recommended copy direction:
- Queue manual publish job
- Save scheduled manual publishing record
- Manual schedule record

### 4. Execution Handoff
Risk:
Operator may think execution occurred.

Recommended copy direction:
- Manual execution handoff
- Publishing handoff review
- Completion record handoff
- External execution requires provider proof

### 5. Approval labels
Risk:
Operator may confuse Publishing approval with Governance approval.

Recommended copy direction:
- Publishing readiness approval
- Governance proof required
- Approval state does not replace Governance authority unless linked to proof

### 6. Auto Approve / Auto Skip
Risk:
These labels imply autonomous approval or skipping authority.

Recommended copy direction:
- Auto mode approval candidate
- Review auto approval gate
- Skip candidate gate after confirmation
- Do not imply Governance bypass

## Allowed Future Patch Scope
A future patch may change:
- Button labels.
- Helper copy.
- Confirmation copy.
- Section headings.
- Status text that overclaims execution.

A future patch must not change:
- Handlers.
- API calls.
- Backend routes.
- CSS.
- Data files.
- Automation behavior.
- Approval logic.
- Provider execution.

## Required Browser QA After Patch
Check:
- Publishing page loads.
- Queue still displays.
- Builder still displays.
- Labels no longer imply live external publishing.
- Schedule actions still require confirmation where expected.
- Publish/manual completion action still requires confirmation.
- AI review handoff remains review-only.
- Auto mode labels do not imply authority bypass.

## Recommended Next Phase
`PHASE 3V.4 — Publishing Copy-Only Boundary Label Safe Patch`

Do not implement until this plan is reviewed and committed.
