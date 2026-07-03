
Phase 13E — Decision Record
Decision

Do not retire any public mutation alias now.

Reason

Phase 13D confirmed frontend zero-use, and Phase 13C proved write-key coverage at module/static middleware level.

However, public aliases may still exist for unknown external compatibility callers.

The safe decision is to plan selective retirement only after a compatibility window and telemetry review.

Approved direction
Keep all public aliases temporarily.
Keep Phase 13B.1 deprecation telemetry active.
Observe telemetry for a compatibility window.
Retire only selected Tier 1 aliases after zero-use proof.
Start future retirement with approval decision and governance policy aliases.
Keep canonical routes untouched.
Keep rollback ready.
Not approved
No immediate route removal.
No broad wildcard retirement.
No frontend change.
No AI Command change.
No canonical route change.
No live execution behavior change.
