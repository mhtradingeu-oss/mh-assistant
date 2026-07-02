# LIB-FEATURE-5A — Reclassify Asset UI Audit Closeout

## Status
Closed as audit-only. Ready for controlled UI patch.

## Findings
- Action Panel is the correct location for Reclassify asset.
- The safest first UI is a small controlled action inside the existing Decisions section.
- Existing action contracts must remain unchanged.
- Reclassify must use the already validated backend route and API client.

## Decision
Proceed to LIB-FEATURE-5B with a narrow UI patch:
- import reclassifyProjectAsset
- add action-panel button
- add handler in library.js
- no CSS rewrite
- no physical file movement
