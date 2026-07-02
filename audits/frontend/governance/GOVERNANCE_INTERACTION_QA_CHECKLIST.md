# Governance Interaction QA Checklist

## Purpose

Verify that every interactive element on the Governance page still works after visual polish passes.

This QA does not change code.  
It validates that visual CSS polish did not break handlers, selectors, inputs, buttons, or AI handoff.

## Interactive elements to test

### 1. Executive action buttons

- [ ] View Full Queue
  - Selector: `data-governance-focus="all"`
  - Expected: focus changes to All queue.

- [ ] Open Approvals
  - Selector: `data-governance-focus="approvals"`
  - Expected: focus changes to Approvals queue.

- [ ] Ask AI for Guidance
  - Selector: `data-governance-open-ai`
  - Expected: opens AI workspace/context for Governance.

- [ ] Refresh Governance Data
  - Selector: `data-governance-action="refresh"`
  - Expected: refreshes Governance data without page error.

- [ ] Open AI Context
  - Selector: `data-governance-open-ai`
  - Expected: opens AI workspace/context for Governance.

- [ ] Focus Approvals
  - Selector: `data-governance-focus="approvals"`
  - Expected: focus changes to Approvals queue.

### 2. Decision queue filters

- [ ] All
- [ ] Approvals
- [ ] Claims
- [ ] Brand
- [ ] Publish
- [ ] Escalations

Selector:
`data-governance-focus`

Expected:
- clicked tab becomes active
- queue state updates
- no console error
- no route change error

### 3. Decision selection

Selector:
`data-governance-select`

Expected:
- if queue contains items, selecting an item updates Selected decision panel
- if queue is empty, no selection button is visible and no error occurs

### 4. Policy controls

Selectors:
- `data-governance-policy`
- `data-governance-owner`

Expected:
- toggles can be changed
- owner fields accept typing
- values remain readable
- no visual overlap
- no console error

### 5. Governance actions

- [ ] Refresh
  - Selector: `data-governance-action="refresh"`
  - Expected: refreshes state safely.

- [ ] Save Governance Policy
  - Selector: `data-governance-action="save-policy"`
  - Expected: saves current policy draft or shows expected success/error message.

- [ ] Review & Sync Settings Rules
  - Selector: `data-governance-action="sync-settings"`
  - Expected: disabled when no settings draft exists; if enabled, triggers expected sync flow.

### 6. Approval decision buttons

Selectors:
- `data-governance-decision="approved"`
- `data-governance-decision="rejected"`
- `data-governance-decision="changes_requested"`
- `data-governance-decision="escalated"`
- `data-governance-decision="overridden"`

Expected:
- only visible when selected governance item supports approval decision
- clicking requires valid selected item / approval id
- no button appears for empty queue
- no console error

### 7. Request approval buttons

Selector:
`data-governance-request-approval`

Expected:
- only visible where request approval is available
- clicking follows expected request approval flow
- no console error

### 8. AI preparation panel

- [ ] Open AI: Review in AI Workspace
  - Selector: `data-governance-open-ai`
  - Expected: opens AI workspace/context.

- [ ] Summarize governance state
- [ ] Review selected decision
- [ ] Find governance gaps

Selector:
`data-governance-ai-prompt`

Expected:
- sends/loads correct AI prompt context
- no console error
- no route break

## Non-interactive informational sections

These sections are currently informational and do not require click behavior:

- Ownership and escalation chain cards
- Escalation route rows
- Supporting signal cards
- Evidence summary cards
- Intake/source cards

Expected:
- readable
- no overflow
- no misleading button styling

## Browser QA result

- [ ] Passed
- [ ] Needs fixes

## Issues found

Add any issue here:

- None yet.

## Final recommendation

Do not mark Governance final until this checklist is manually tested in browser after the visual passes.
