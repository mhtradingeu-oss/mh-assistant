# PHASE 1E - Production Runbooks (MH Assistant)

Validated on: 2026-04-28 (UTC)
Host assumptions: Linux server with systemd, service name mh-orchestrator

All commands below were executed and validated in this environment unless explicitly marked as a production-only destructive action.

## 1. Deployment Runbook

### Locations
- Code root: /opt/mh-assistant
- Service runtime: /opt/mh-assistant/runtime/orchestrator-service
- Service unit: /etc/systemd/system/mh-orchestrator.service
- Env file: /opt/mh-assistant/.env
- Data root: /opt/mh-assistant/data

### Install dependencies
```bash
cd /opt/mh-assistant/runtime/orchestrator-service
npm ci --omit=dev
```

### Start service
```bash
sudo systemctl start mh-orchestrator
```

### Restart service
```bash
sudo systemctl restart mh-orchestrator
```

### Check status
```bash
systemctl status mh-orchestrator --no-pager | head -n 20
systemctl is-active mh-orchestrator
```

### Read logs
```bash
journalctl -u mh-orchestrator -n 100 --no-pager
journalctl -u mh-orchestrator -f --no-pager
```

### Post-deploy health verification
```bash
curl -sS -i http://127.0.0.1:3000/healthz
curl -sS -i http://127.0.0.1:3000/readyz
```

If restart is very recent, process can be active before HTTP listener is ready. Use this warm-up check:
```bash
for i in $(seq 1 50); do
  code=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/healthz || true)
  if [ "$code" = "200" ]; then
    echo "healthz_status=$code"
    break
  fi
done
[ "$code" = "200" ]
```

## 2. Environment Runbook

### Required environment variables
- NODE_ENV
- PORT
- MH_CONTROL_CENTER_WRITE_KEY
- MH_INTEGRATION_SECRET_KEY

### Env file location
- /opt/mh-assistant/.env

### Safe edit procedure
```bash
sudo cp /opt/mh-assistant/.env /opt/mh-assistant/.env.bak.$(date +%Y%m%d-%H%M%S)
sudoedit /opt/mh-assistant/.env
```

### Reload env into service
systemd reads EnvironmentFile at service start/restart. Reload by restarting:
```bash
sudo systemctl restart mh-orchestrator
```

### Validate env via readiness
```bash
curl -sS http://127.0.0.1:3000/readyz
```

Quick required-check filter:
```bash
curl -sS http://127.0.0.1:3000/readyz | grep -E '"ready"|"missing_required_env"|"control_write_key_configured"|"integration_secret_key"'
```

Expected healthy shape includes:
- "ready": true
- "missing_required_env": []
- checks.control_write_key_configured.ok: true
- checks.integration_secret_key.ok: true

## 3. Secrets Rotation Runbook

### Generate new MH_INTEGRATION_SECRET_KEY
```bash
openssl rand -base64 32
```

### Update .env
```bash
sudo cp /opt/mh-assistant/.env /opt/mh-assistant/.env.pre-integration-secret-rotation.$(date +%Y%m%d-%H%M%S)
sudoedit /opt/mh-assistant/.env
```
Replace MH_INTEGRATION_SECRET_KEY with the newly generated value.

### Restart service
```bash
sudo systemctl restart mh-orchestrator
```

### Impact
- Existing encrypted integration credentials become unreadable with the new key.
- Integrations must be re-entered/reconnected from Control Center Integrations.

### Verify after rotation
```bash
curl -sS -i http://127.0.0.1:3000/readyz
```
Then test integrations per project using Control Center integration test/sync actions.

## 4. Backup & Restore Runbook

### What to back up
- /opt/mh-assistant/data
- /opt/mh-assistant/.env

### Create backup
```bash
TS="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="/opt/mh-assistant/archive/backups"
BACKUP_FILE="${BACKUP_DIR}/mh-assistant-backup-${TS}.tar.gz"
mkdir -p "${BACKUP_DIR}"
sudo tar -czf "${BACKUP_FILE}" /opt/mh-assistant/data /opt/mh-assistant/.env
ls -lh "${BACKUP_FILE}"
```

### Restore rehearsal (non-destructive validation)
```bash
TS="$(date +%Y%m%d-%H%M%S)"
RESTORE_ROOT="/tmp/mh-assistant-restore-test-${TS}"
LATEST_BACKUP="$(ls -1t /opt/mh-assistant/archive/backups/mh-assistant-backup-*.tar.gz | head -n 1)"
mkdir -p "${RESTORE_ROOT}"
sudo tar -xzf "${LATEST_BACKUP}" -C "${RESTORE_ROOT}"
ls -la "${RESTORE_ROOT}/opt/mh-assistant" | head -n 20
```

### Actual restore (production)
1) Stop service before restore.
```bash
sudo systemctl stop mh-orchestrator
```

2) Restore backup into root filesystem.
```bash
LATEST_BACKUP="$(ls -1t /opt/mh-assistant/archive/backups/mh-assistant-backup-*.tar.gz | head -n 1)"
sudo tar -xzf "${LATEST_BACKUP}" -C /
```

3) Set expected ownership/permissions (if needed).
```bash
sudo chown -R mhadmin:mhadmin /opt/mh-assistant/data
sudo chown mhadmin:mhadmin /opt/mh-assistant/.env
sudo chmod 600 /opt/mh-assistant/.env
```

4) Start service and verify.
```bash
sudo systemctl start mh-orchestrator
systemctl is-active mh-orchestrator
curl -sS -i http://127.0.0.1:3000/healthz
curl -sS -i http://127.0.0.1:3000/readyz
```

## 5. Rollback Runbook

### Revert last git commit (safe rollback)
From repository root:
```bash
cd /opt/mh-assistant
git status
git log --oneline -n 5
git revert --no-edit HEAD
```

### Restart service
```bash
sudo systemctl restart mh-orchestrator
```

### Verify system works
```bash
systemctl is-active mh-orchestrator
curl -sS -i http://127.0.0.1:3000/healthz
curl -sS -i http://127.0.0.1:3000/readyz
node /opt/mh-assistant/scripts/verify-phase4-production-readiness.js
```

### Broken deployment handling
If rollback commit fails due to conflicts:
```bash
cd /opt/mh-assistant
git revert --abort
```
Then either:
- Revert a specific known-bad commit:
```bash
git log --oneline -n 10
# Copy the chosen commit SHA from the output and run:
# git revert --no-edit "$BAD_SHA"
```
- Or restore last known-good backup using section 4.

Note: rollback command syntax was validated in a disposable test repository on this host.

## 6. Health & Verification Runbook

### Service status
```bash
systemctl status mh-orchestrator --no-pager | head -n 20
systemctl is-active mh-orchestrator
```

### /healthz and /readyz
```bash
curl -sS -i http://127.0.0.1:3000/healthz
curl -sS -i http://127.0.0.1:3000/readyz
```

Expected:
- /healthz -> HTTP 200 and JSON with service/or pid details
- /readyz -> HTTP 200 when ready=true, HTTP 503 when required env/checks fail

### Run production readiness verifier
```bash
cd /opt/mh-assistant
node scripts/verify-phase4-production-readiness.js
```

Expected output:
- JSON with "passed": true
- Checks include readiness_shape and global_error_handler_shape as pass=true

## 7. Security Verification Runbook

### Prepare control key variable
```bash
CONTROL_KEY="$(grep '^MH_CONTROL_CENTER_WRITE_KEY=' /opt/mh-assistant/.env | cut -d= -f2-)"
```

### Write endpoint without key (must fail)
```bash
curl -sS -i -X POST \
  -H 'content-type: application/json' \
  -d '{"message":"phase1e"}' \
  http://127.0.0.1:3000/task
```
Expected: HTTP 401, message about missing protected write key.

### Write endpoint with key (must pass)
```bash
curl -sS -i -X POST \
  -H "x-mh-control-key: ${CONTROL_KEY}" \
  -H 'content-type: application/json' \
  -d '{"message":"phase1e"}' \
  http://127.0.0.1:3000/task
```
Expected: HTTP 200 and task JSON payload.

### Read endpoint without key (must fail)
```bash
curl -sS -i http://127.0.0.1:3000/media-manager/projects
```
Expected: HTTP 401, message about missing read key.

### Read endpoint with key (must pass)
```bash
curl -sS -i \
  -H "x-mh-control-key: ${CONTROL_KEY}" \
  http://127.0.0.1:3000/media-manager/projects
```
Expected: HTTP 200 and projects/items JSON.

## 8. Smoke Test Runbook

### A) Frontend availability checks
```bash
curl -I http://127.0.0.1:3000/control-center
curl -I http://127.0.0.1:3000/control-center/
curl -I http://127.0.0.1:3000/control-center/index.html
curl -I http://127.0.0.1:3000/control-center/app.js
curl -I http://127.0.0.1:3000/control-center/router.js
curl -I http://127.0.0.1:3000/control-center/styles.css
```
Expected: 302 for /control-center and 200 for assets.

### B) End-to-end API smoke (campaign -> content -> media -> publishing -> insights)
```bash
set -e
CONTROL_KEY="$(grep '^MH_CONTROL_CENTER_WRITE_KEY=' /opt/mh-assistant/.env | cut -d= -f2-)"
PROJECT='phase375smoke'
TS="$(date +%Y%m%d%H%M%S)"
CAMPAIGN_ID="phase1e-campaign-${TS}"
CONTENT_ID="phase1e-content-${TS}"
MEDIA_ID="phase1e-media-${TS}"

curl -sS -i -X POST \
  -H "x-mh-control-key: ${CONTROL_KEY}" -H 'content-type: application/json' \
  -d "{\"id\":\"${CAMPAIGN_ID}\",\"name\":\"Phase1E Smoke Campaign ${TS}\",\"objective\":\"Runbook verification\"}" \
  "http://127.0.0.1:3000/media-manager/project/${PROJECT}/campaigns"

curl -sS -i -X POST \
  -H "x-mh-control-key: ${CONTROL_KEY}" -H 'content-type: application/json' \
  -d "{\"id\":\"${CONTENT_ID}\",\"campaign_id\":\"${CAMPAIGN_ID}\",\"title\":\"Phase1E Smoke Content ${TS}\",\"type\":\"social\"}" \
  "http://127.0.0.1:3000/media-manager/project/${PROJECT}/content-items"

curl -sS -i -X POST \
  -H "x-mh-control-key: ${CONTROL_KEY}" -H 'content-type: application/json' \
  -d "{\"id\":\"${MEDIA_ID}\",\"campaign_id\":\"${CAMPAIGN_ID}\",\"content_item_id\":\"${CONTENT_ID}\",\"request_type\":\"image\",\"title\":\"Phase1E Media Job ${TS}\"}" \
  "http://127.0.0.1:3000/media-manager/project/${PROJECT}/media-jobs"

SCHEDULE_RESP="$(curl -sS -X POST \
  -H "x-mh-control-key: ${CONTROL_KEY}" -H 'content-type: application/json' \
  -d "{\"title\":\"Phase1E Publish ${TS}\",\"wave_name\":\"phase1e-${TS}\",\"channel\":\"email\",\"scheduled_for\":\"2026-05-01T09:00:00Z\",\"status\":\"scheduled\"}" \
  "http://127.0.0.1:3000/media-manager/project/${PROJECT}/publishing/schedule")"

echo "$SCHEDULE_RESP"

curl -sS -i -H "x-mh-control-key: ${CONTROL_KEY}" "http://127.0.0.1:3000/api/insights/${PROJECT}"
```

Observed in this environment:
- campaign/content/media creation passed.
- publishing schedule passed.
- publish action is governance-protected and returned 409 until approval exists.
- insights endpoint returned 200 JSON.

### C) UI operator flow
1) Open http://127.0.0.1:3000/control-center/
2) Create campaign
3) Create content item
4) Send to media (create media job)
5) Send to publishing (schedule)
6) Verify insights panel updates

If publishing is blocked, request/complete required approval first (policy approval_before_publish enabled).

## 9. Failure Scenarios

### 9.1 Service not starting
Cause:
- Node crash, bad env, missing dependency, permission issue.

Fix:
```bash
systemctl status mh-orchestrator --no-pager | head -n 40
journalctl -u mh-orchestrator -n 200 --no-pager
cd /opt/mh-assistant/runtime/orchestrator-service && npm ci --omit=dev
sudo systemctl restart mh-orchestrator
```

### 9.2 Required env missing
Cause:
- Missing NODE_ENV/PORT/MH_CONTROL_CENTER_WRITE_KEY/MH_INTEGRATION_SECRET_KEY in /opt/mh-assistant/.env

Fix:
```bash
sudoedit /opt/mh-assistant/.env
sudo systemctl restart mh-orchestrator
curl -sS http://127.0.0.1:3000/readyz
```

### 9.3 Port in use
Cause:
- Another process already bound to PORT (default 3000).

Fix:
```bash
sudo ss -ltnp | grep ':3000'
sudo lsof -iTCP:3000 -sTCP:LISTEN -n -P
```
Then stop conflicting process or change PORT in /opt/mh-assistant/.env and restart service.

### 9.4 Data corruption
Cause:
- Interrupted writes/manual edits/disk issues in /opt/mh-assistant/data.

Fix:
1) Stop service.
```bash
sudo systemctl stop mh-orchestrator
```
2) Restore known-good backup (section 4).
3) Start and validate:
```bash
sudo systemctl start mh-orchestrator
curl -sS -i http://127.0.0.1:3000/healthz
curl -sS -i http://127.0.0.1:3000/readyz
```

### 9.5 Integration failure
Cause:
- Invalid/expired external credentials, network issues, or secret key rotation side effects.

Fix:
- Re-enter integration credentials in Control Center Integrations.
- Re-test integration action for the project.
- Confirm readiness and logs:
```bash
curl -sS http://127.0.0.1:3000/readyz
journalctl -u mh-orchestrator -n 200 --no-pager
```

### 9.6 Auth failure
Cause:
- Missing or wrong MH_CONTROL_CENTER_WRITE_KEY on protected read/write routes.

Fix:
```bash
CONTROL_KEY="$(grep '^MH_CONTROL_CENTER_WRITE_KEY=' /opt/mh-assistant/.env | cut -d= -f2-)"
curl -sS -i -H "x-mh-control-key: ${CONTROL_KEY}" http://127.0.0.1:3000/media-manager/projects
```
If key was changed in env, restart service:
```bash
sudo systemctl restart mh-orchestrator
```
