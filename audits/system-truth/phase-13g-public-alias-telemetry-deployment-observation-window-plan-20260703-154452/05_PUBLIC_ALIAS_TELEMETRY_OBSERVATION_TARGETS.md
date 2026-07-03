# Phase 13G — Public Alias Telemetry Observation Targets

## Status
PLAN ONLY

## Telemetry marker to observe

The exact marker to observe is:

```text
[MH][public_mutation_alias_deprecated]

A hit means a mutation request reached a /public/media-manager/... compatibility alias.

Headers to confirm during compatibility response

Expected headers on public mutation alias requests:

X-MH-Public-Alias: true
X-MH-Public-Alias-Status: deprecate
X-MH-Public-Alias-Recommendation: use-canonical-media-manager-route
X-MH-Public-Alias-Canonical-Prefix: /media-manager
Observation locations

Depending on runtime environment, check:

Local development terminal output
Orchestrator service stdout/stderr
PM2 logs, if PM2 is used
Docker container logs, if Docker is used
systemd / journald logs, if service is installed
Reverse proxy logs, if request traces are available
Application log directory, if the runtime writes logs to file
Deployment platform logs, if hosted externally
Minimum evidence to collect

For each environment:

environment name: local / staging / production
deployed commit hash
observation start time
observation end time
log source path or command
hit count for [MH][public_mutation_alias_deprecated]
sample hit lines if any
confirmation whether frontend was actively used during the window
confirmation whether external integrations/scripts were active during the window
Zero-hit definition

Zero-hit means:

no [MH][public_mutation_alias_deprecated] runtime log entries
no /public/media-manager/... mutation access traces
no frontend direct public alias callers
canonical frontend callers remain in use
no error reports from compatibility callers after deployment
Non-zero-hit definition

Non-zero-hit means at least one runtime log entry or access trace shows usage of a public mutation alias.

If non-zero-hit occurs:

do not retire the alias
identify caller
migrate caller to canonical /media-manager/...
keep alias compatibility until caller is gone
