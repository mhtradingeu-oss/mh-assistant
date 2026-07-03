# Phase 8 Classification Draft

## Purpose
Classify frontend contract residue before any patch.

## Categories

### A — Canonical API wrapper usage
Calls inside public/control-center/api.js using getJson/sendJson/sendRawJson are expected if backend route exists.

### B — Active page using api.js helper
Expected and preferred.

### C — Direct fetch in active page
Needs review. May be acceptable only for local assets, runtime static files, or browser-only resources.

### D — Public alias usage
Needs review. Prefer canonical non-public route unless compatibility requires otherwise.

### E — Legacy/dev/skeleton residue
Needs classification. Do not delete blindly.

### F — Suspicious contract mismatch
Requires exact backend route matching before patch.

## Phase 8 rule
No code changes until exact target and risk are proven.
