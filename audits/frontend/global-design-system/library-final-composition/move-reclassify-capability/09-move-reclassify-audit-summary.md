# LIB-FEATURE-1 — Move / Reclassify Asset Capability Audit Summary

## Status
Audit generated. Pending review.

## Key Question
Does the system currently support real asset moving or reclassification?

## What to Confirm From Evidence
- Whether frontend has a current Move/Reclassify button.
- Whether frontend has a current mutation handler for asset type/category.
- Whether API exposes update asset type/category.
- Whether backend routes support asset reclassification.
- Whether "folder" is only a UI filter or a persistent field.

## Current Safety Position
Do not add a "Move to folder" button until a real backend/API/data-model contract is confirmed.

## Likely Safe Direction
Add a future feature named:
- `Reclassify asset`

Only after confirming or adding a proper endpoint.

## Not In Scope Yet
- Physical file moving.
- Storage path updates.
- Protected media cache invalidation.
