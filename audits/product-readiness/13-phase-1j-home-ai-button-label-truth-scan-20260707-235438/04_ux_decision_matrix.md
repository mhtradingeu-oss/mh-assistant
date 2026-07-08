# Phase 1J — Home AI Button Label UX Decision

## Current truth

The Home button label currently says:

- Ask Head Office AI

But the button is bound to the dynamic recommended specialist via `data-role-id`.

Browser proof showed a successful Home -> AI Command bridge where the active specialist became:

- Video Lead

This means the current label can be misleading.

## Product interpretation

There are two valid product meanings:

### Meaning 1 — Head Office as universal front door

If "Head Office AI" means the executive front door that routes internally to the right specialist, the current label can stay.

Risk:
- User sees "Ask Head Office AI" but lands in Video Lead.
- This may feel inconsistent unless AI Command explains that Head Office routed to Video Lead.

### Meaning 2 — Ask the actual recommended specialist

If the button directly opens the recommended specialist, the label should not say Head Office.

Better labels:
- Ask Recommended AI
- Ask Video Lead
- Ask Operations Lead
- Ask Publisher
- Ask Ads Optimizer

## Best UX

Use a dynamic label:

- Ask {recommendedSpecialist.label}

Fallback:
- Ask Recommended AI

## Safe implementation candidate for next phase

Patch Home only:

- Compute `recommendedSpecialistLabel`
- Replace visible label `Ask Head Office AI`
- Use `Ask ${recommendedSpecialistLabel}` when recommended specialist exists
- Keep existing prompt and click behavior unchanged
- No AI Command changes
- No backend changes

## Do not do

- Do not change routing.
- Do not change prompt generation.
- Do not change specialist selection.
- Do not touch AI Command.
- Do not touch contract.
- Do not touch backend.
