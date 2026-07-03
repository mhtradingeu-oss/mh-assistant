
Phase 13G — Public Alias Telemetry Log Command Runbook
Status

PLAN ONLY

Use the commands that match the actual deployment environment.

Local terminal

If the orchestrator is run in a terminal:

grep -RIn "public_mutation_alias_deprecated" ./data ./logs ./runtime 2>/dev/null || true
PM2

If PM2 is used:

pm2 logs --lines 5000 | grep "public_mutation_alias_deprecated" || true
pm2 logs --lines 5000 | grep "/public/media-manager" || true
Docker

If Docker is used:

docker ps
docker logs <container_name_or_id> 2>&1 | grep "public_mutation_alias_deprecated" || true
docker logs <container_name_or_id> 2>&1 | grep "/public/media-manager" || true
Docker Compose
docker compose ps
docker compose logs orchestrator 2>&1 | grep "public_mutation_alias_deprecated" || true
docker compose logs orchestrator 2>&1 | grep "/public/media-manager" || true
systemd / journald
systemctl status <service-name>
journalctl -u <service-name> --since "14 days ago" | grep "public_mutation_alias_deprecated" || true
journalctl -u <service-name> --since "14 days ago" | grep "/public/media-manager" || true
Generic filesystem logs
find . -type f \( -iname "*.log" -o -iname "*access*" -o -iname "*error*" \) -print | sort
grep -RIn "public_mutation_alias_deprecated" ./logs ./data ./runtime 2>/dev/null || true
grep -RIn "/public/media-manager" ./logs ./data ./runtime 2>/dev/null || true
Required output file for future Phase 13H

Save the future observation evidence to:

audits/system-truth/phase-13h-public-alias-telemetry-zero-hit-confirmation-<STAMP>/

Required files:

01_deployed_commit.txt
02_log_source_inventory.txt
03_public_alias_marker_hits.txt
04_public_media_manager_access_traces.txt
05_frontend_zero_use_recheck.txt
06_observation_window_summary.md

