# Phase 9C AI Settings / Control Plane Authority Classification Draft

## Classification options

### A — Inactive orphan global file
File defines a global but is not loaded/imported by the active app.

### B — Passive loaded config only
Loaded but only stores local metadata; no active consumers or authority.

### C — Active authority risk
Loaded and consumed in a way that changes publish/ads/workflow/backend behavior.

### D — Compatibility artifact
Preserved for old runtime compatibility, no active authority.

## Phase 9C rule
No patch unless exact active load and authority risk are proven.
