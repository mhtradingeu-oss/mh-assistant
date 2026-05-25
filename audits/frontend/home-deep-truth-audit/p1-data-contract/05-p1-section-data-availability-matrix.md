# P1 Section Data Availability Matrix

| Section | Expected Keys | Present Keys | Missing Keys | Recommendation |
|---|---|---|---|---|
| Executive System Authority Strip | overview, readiness | overview, readiness | - | Use existing projection |
| Next Best Action | readiness, recommendations | readiness | recommendations | Use safe fallback / handoff only |
| AI Team Command Center | ai, recommendations | - | ai, recommendations | Use safe fallback / handoff only |
| Operations Pulse | operations, tasks, approvals, notifications | operations | tasks, approvals, notifications | Use safe fallback / handoff only |
| Customer Operations Pulse | customer_ops, crm | - | customer_ops, crm | Use safe fallback / handoff only |
| Source of Truth Confidence | assets, source_of_truth | assets | source_of_truth | Use safe fallback / handoff only |
| Launch Readiness | campaign, publishing, media | - | campaign, publishing, media | Use safe fallback / handoff only |
| Release / Governance Readiness | governance, approvals | - | governance, approvals | Use safe fallback / handoff only |
| Research / Learning / Recommendations | learning, insights, recommendations | - | learning, insights, recommendations | Defer live metrics until backend projection exists |
| Voice / IVR / Communication Readiness | ivr, voice | - | ivr, voice | Defer live metrics until backend projection exists |
