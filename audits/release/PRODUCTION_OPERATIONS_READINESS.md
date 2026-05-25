# Production Operations Readiness

## Status

Operational, with one data-consistency release blocker.

The production service is running and health checks pass. The system should not be declared fully launch-ready until source-of-truth registry mismatch warnings are resolved or accepted as known migration debt.

---

## Evidence Source

Primary evidence:

- audits/release/final-proof/evidence/02-service-status.txt
- audits/release/final-proof/evidence/06-health-endpoint-discovery.txt
- audits/release/final-proof/evidence/10-live-health-checks.txt
- audits/release/final-proof/evidence/12-recent-service-warnings.txt
- audits/release/final-proof/evidence/14-health-result-recheck.txt
- audits/release/final-proof/evidence/15-public-ai-endpoint-read-checks.txt
- audits/release/final-proof/evidence/17-source-of-truth-mismatch-classification.txt

---

## Runtime Service

Service:

- `mh-orchestrator.service`

Runtime:

- Node process running `runtime/orchestrator-service/server.js`

Port:

- `3000`

Service state:

- active
- running
- enabled

---

## Health and Readiness

Confirmed endpoints:

- `/health`
- `/healthz`
- `/readyz`

All returned HTTP 200 in Phase 3A release proof.

Readiness confirms:

- write key configured
- data directory exists
- data directory writable
- project registry loads
- integration secret key configured
- protected write mode enabled

---

## Security / Protected Mode

Protected write mode is enabled.

AI read endpoints require a read/control key.

Unauthenticated calls to AI read endpoints return HTTP 401 with a clear read-key error. This is expected for protected operation.

Required future proof:

- test AI read endpoints with a valid read key
- test AI command execution with appropriate write/control authorization
- confirm no sensitive data is exposed through public unauthenticated routes

---

## Current Operational Warning

The service logs repeated `project_data_mismatch` warnings for the `hairoticmen` source-of-truth registry.

This is a data contract / migration issue between:

- canonical source-of-truth registry
- legacy sources registry

Classification:

P1 release blocker unless formally accepted.

---

## Backup / Restore Requirements

Before production launch, confirm:

- backup path for `data/projects`
- backup path for `data/execution`
- backup path for `data/system`
- restore procedure for project registry
- restore procedure for source-of-truth registry
- restore procedure for AI artifacts, tasks, workflows, handoffs, publishing jobs
- rollback path for backend service deployment

---

## Logging / Monitoring Requirements

Minimum production monitoring should track:

- service uptime
- `/health` and `/readyz`
- HTTP 4xx/5xx rates
- `project_data_mismatch`
- failed AI commands
- failed publishing jobs
- failed workflow runs
- failed handoffs
- protected write failures
- integration provider failures

---

## Deployment / Restart Requirements

Before final launch, document:

- deploy command
- restart command
- service status command
- logs command
- rollback command
- environment variable checklist
- secrets rotation process

Current known service commands:

```bash
systemctl status mh-orchestrator.service --no-pager
journalctl -u mh-orchestrator.service --since "2 hours ago" --no-pager
Production Readiness Matrix
Area	Status	Notes
Service running	Ready	Active systemd service
Health endpoint	Ready	HTTP 200
Readiness endpoint	Ready	ready true
Protected write mode	Ready	Enabled
AI read auth boundary	Ready / needs keyed proof	401 without key expected
Data directory	Ready	Exists and writable
Project registry	Ready	Loads successfully
Integration secret	Ready	Configured
Source-of-truth consistency	Blocked	P1 mismatch
Backup/restore runbook	Needs final proof	Must be verified
Browser QA	Pending	Needed before launch
Final release approval	Blocked	Await mismatch decision
Final Operations Decision

The system is operational, but not fully production-release approved.

Required next action:

Resolve or formally accept the source-of-truth registry mismatch, then run authenticated AI endpoint proof and browser QA closeout.
