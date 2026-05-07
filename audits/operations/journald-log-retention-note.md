# Journald Log Retention Note

## Status
Configured systemd journald retention for production operations.

## Drop-in file
/etc/systemd/journald.conf.d/mh-assistant.conf

## Configuration
- SystemMaxUse=500M
- RuntimeMaxUse=100M
- MaxRetentionSec=14day
- Compress=yes

## Reason
The orchestrator emits structured runtime logs and telemetry. Retention limits reduce disk-growth risk while preserving recent operational visibility.

## Verification
- systemd-journald restarted successfully
- journalctl --disk-usage confirmed reduced journal usage

## Scope
Server operation configuration only. No application runtime code changed.
