# T185C.5D3C1 — Premium Campaign Brief Fields

## Status
Implemented.

## Scope
Upgrade Campaign Builder from a minimal Source/Goal/Channel wizard into a premium campaign brief wizard.

## Added Fields
- Market
- Language
- Creative format
- Deadline / priority
- Audience
- Offer
- Product focus
- Compliance sensitivity

## Lifecycle
The added fields are preserved through:
- wizard state
- backend preview-only payload
- backend preview-only response
- normalized frontend preview
- `session.outputPreview`
- local/session handoff object

## Safety Boundary
This remains preview-only.
No publish, send, CRM mutation, provider execution, durable handoff creation, task creation, approval creation, or workflow mutation is performed.
