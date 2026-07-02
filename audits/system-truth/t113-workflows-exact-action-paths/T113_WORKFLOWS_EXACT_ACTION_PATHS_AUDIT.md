# T113 — Workflows Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Classify exact user-facing and event-driven runtime authority paths in:

- `public/control-center/pages/workflows.js`

This follows T112, which confirmed Workflows contains workflow execution, automation, AI, handoff, local draft, and possible backend mutation signals.

## Paths to classify

### 1. Local draft save / clear / input changes
Expected classification:
- Local/session draft only.
- No backend mutation.
- No confirmation required unless durable backend mutation occurs.

### 2. Prepare Review Package
Expected classification:
- Either local/session package generation or backend workflow preparation.
- If `runProjectWorkflow` / `runProjectAiWorkflow` is called, must require confirmation or be clearly review-package-only.

### 3. Catalog Prepare / Save Draft / Open in AI
Expected classification:
- Prepare/save should be local or confirmation-gated if backend.
- Open in AI should be prompt/context only unless persistent handoff is created.

### 4. Send to AI for Review / Open in AI Command
Expected classification:
- Shared AI context only or persistent handoff.
- If `createProjectHandoff` is used, must be intentional and confirmation-gated.

### 5. Prepare Task Review Handoff
Expected classification:
- If `createProjectTask` or durable handoff is used, must require confirmation.
- If shared-context/local-only, document and close.

### 6. Build Custom Workflow / Recommend Review Workflow
Expected classification:
- Local/session recommendation only unless backend mutation occurs.

### 7. Automation buttons
Expected classification:
- `runAutomationPlan`, `startAutoMode`, `approveCurrentGate`, `skipCurrentStep`.
- Must be confirmation-gated if they advance automation state or create handoffs/tasks.

### 8. `mh:submit-workflow` event bridge
Expected classification:
- Event-driven path can call workflow run APIs.
- Must be protected against silent backend execution.
- If no confirmation exists, patch.

### 9. Durable incoming handoff consumption
Expected classification:
- `consumeProjectHandoff` marks handoff consumed.
- Must be reviewed: if automatic backend mutation occurs on render, patch or document if safe/non-authoritative.

## Decision Rule
- If workflow run APIs are called without explicit operator confirmation, patch.
- If persistent handoff/task creation occurs without explicit confirmation, patch.
- If automation gate actions run without confirmation, patch.
- If handoff consumption is automatic durable mutation, patch or gate.
- If actions are local/session/shared-context only, document and close.
- Do not redesign Workflows.
