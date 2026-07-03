# Phase 10A AI Command Exact Action Path Classification Draft

## Categories

### A — Explicit Ask backend chat
executeProjectAiChat is called only from Ask button / intentional user submit.

### B — Explicit durable AI command
executeProjectAiCommand is called only from explicit external command or confirmed command path.

### C — Local-only AI decision router
Autonomous/AI runtime tick mutates session metadata only and does not call backend.

### D — Backend preview only
Backend helper returns preview-only content and verifies no mutation/provider execution.

### E — Suspicious programmatic submit
sendBtn.click or event dispatch can call backend without direct user intent.

### F — Unsafe active authority
Any path can publish, approve, send external message, run workflow, create durable task, or mutate CRM without confirmation.

## Phase 10A rule
No patch unless exact active unsafe authority is proven.
