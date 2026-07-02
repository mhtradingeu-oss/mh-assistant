# Phase 2 — Route Matrix Regeneration Note

## Status

Route matrix regeneration produced a real documentation delta.

## What changed

The route permission matrix now includes:

- `POST /media-manager/project/:project/integrations/:integrationId`
- `POST /public/media-manager/project/:project/integrations/:integrationId`

## Why this matters

This route belongs to the integrations domain and is a write/mutation route.

The canonical route is classified as:

- domain: integrations
- operation: write
- auth: write_key
- provider risk: critical
- recommendation: require_provider_scope_audit_and_idempotency

The public alias is classified as:

- status: retire
- recommendation: retire_public_mutation_alias

## Decision

Keep the regenerated route matrix because it reflects current backend route inventory and improves permission documentation accuracy.

This is documentation/evidence alignment only. No runtime behavior is changed by this matrix update.
