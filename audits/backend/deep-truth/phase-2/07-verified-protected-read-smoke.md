# Phase 2 — Verified Protected Read Smoke

Generated: 2026-06-04T17:12:58
Branch: architecture/frontend-consolidation-v1
HEAD: 043803c

## Security
- READ and WRITE keys were loaded from local environment for smoke testing.
- Key values were not printed or stored.
- READ key length: 50
- WRITE key length: 50
- READ key sha256: 4542a9c73e89d889add05f5cc1e36e35e3f2a052d269d1c244126ad23fac1118
- WRITE key sha256: 4542a9c73e89d889add05f5cc1e36e35e3f2a052d269d1c244126ad23fac1118
- Any key previously pasted into chat must be rotated before production use.

## Smoke test results

### Global storage parity readiness

- URL: `http://localhost:3000/media-manager/storage/parity-readiness`
- HTTP status: `200`
- JSON: valid
- top-level keys: generated_at, project_count, aggregate, projects
- project_count: 1
- canonical_hit_rate: 1
- result: PASS

### Project storage parity readiness

- URL: `http://localhost:3000/media-manager/project/hairoticmen/storage/parity-readiness`
- HTTP status: `200`
- JSON: valid
- top-level keys: project, generated_at, telemetry_files, totals, by_domain, readiness
- project: hairoticmen
- readiness: partial_more_stabilization_needed
- result: PASS

### Project operations

- URL: `http://localhost:3000/media-manager/project/hairoticmen/operations`
- HTTP status: `200`
- JSON: valid
- top-level keys: project, generated_at, backbone, status_models, governance, task_center, queue_center, job_monitor, notification_center, team_service_model, ownership, team
- project: hairoticmen
- task_center.total: 0
- queue_center.total: 14
- job_monitor.total: 1
- notification_center.total: 2
- event_log.total: 58
- timeline.items: 12
- result: PASS

### Project task center

- URL: `http://localhost:3000/media-manager/project/hairoticmen/task-center`
- HTTP status: `200`
- JSON: valid
- top-level keys: project, task_center
- project: hairoticmen
- task_center.total: 0
- result: PASS

### Project queue center

- URL: `http://localhost:3000/media-manager/project/hairoticmen/queue-center`
- HTTP status: `200`
- JSON: valid
- top-level keys: project, queue_center
- project: hairoticmen
- queue_center.total: 14
- result: PASS

### Project job monitor

- URL: `http://localhost:3000/media-manager/project/hairoticmen/job-monitor`
- HTTP status: `200`
- JSON: valid
- top-level keys: project, job_monitor
- project: hairoticmen
- job_monitor.total: 1
- result: PASS

### Project notification center

- URL: `http://localhost:3000/media-manager/project/hairoticmen/notification-center`
- HTTP status: `200`
- JSON: valid
- top-level keys: project, total, unread_count, critical_count, notification_items, sync_failure_alerts, approval_pending_alerts, publish_alerts, provider_disconnect_alerts, claim_risk_alerts, workflow_completion_alerts, items
- project: hairoticmen
- result: PASS

## Write key fallback check

### Project task center with WRITE key

- URL: `http://localhost:3000/media-manager/project/hairoticmen/task-center`
- HTTP status: `200`
- JSON: valid
- top-level keys: project, task_center
- project: hairoticmen
- task_center.total: 0
- result: PASS

## Decision

Phase 2 protected read smoke is verified for all tested endpoints.
