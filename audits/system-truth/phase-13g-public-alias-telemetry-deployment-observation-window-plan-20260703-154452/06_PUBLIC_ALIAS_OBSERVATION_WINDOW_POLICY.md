
Phase 13G — Public Alias Observation Window Policy
Status

PLAN ONLY

Recommended observation duration
Local only

Local zero-hit is useful but not enough for retirement.

Staging

Minimum:

14 days after deployment

Recommended:

14 days with active Control Center usage
include publishing, governance, integrations, AI Command, workflows, tasks, and handoffs
Production

Minimum:

14 days after deployment

Recommended:

30 days if any external callers, scripts, older clients, or partner integrations may exist
Required deployment state

Observation window starts only after:

Phase 13B.1 telemetry patch is deployed.
The running service commit is known.
Logs are accessible.
The marker [MH][public_mutation_alias_deprecated] is searchable.
Frontend canonical caller scan remains zero-use for public aliases.
Window reset conditions

Restart the observation window if:

a public alias hit is found
a new frontend build is deployed
route compatibility middleware changes
external integration scripts change
proxy/rewrite rules change
logs were unavailable for part of the window
logging was disabled or rotated without retention
Retirement eligibility after observation

A selected alias can be retirement-eligible only if:

observation window completed
no hits for that alias
canonical equivalent was used successfully
no user reports related to missing legacy routes
rollback path is ready
selected patch scope is tiny
