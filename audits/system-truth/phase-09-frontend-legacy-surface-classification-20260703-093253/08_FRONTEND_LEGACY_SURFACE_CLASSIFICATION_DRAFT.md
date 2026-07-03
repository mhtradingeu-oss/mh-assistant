# Phase 9 Frontend Legacy Surface Classification Draft

## Categories

### A — Harmless compatibility marker
Legacy wording is used for compatibility, migration, display, or browser storage fallback.

### B — Neutralized inactive legacy artifact
File exists intentionally, is not router-loaded, and does not call backend.

### C — Runtime skeleton
Needs classification by load path and behavior. No patch unless active risk is proven.

### D — Active route marker but safe text/UI copy
Marker is user-facing explanation, placeholder text, or guidance only.

### E — Suspicious active runtime risk
Requires exact source context and route/load proof before patch.

## Phase 9 rule
No delete or patch until exact active risk is proven.
