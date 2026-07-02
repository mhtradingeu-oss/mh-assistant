# Setup P1 Data Availability Matrix

| Section | Expected Keys | Present Keys | Missing Keys | Recommendation |
|---|---|---|---|---|
| Project Identity / Setup Fields | project, overview | project, overview | - | Can use existing projection |
| Readiness Summary | readiness | readiness | - | Can use existing projection |
| Missing Fields / Requirements | readiness | readiness | - | Can use existing projection |
| Asset / Source-of-Truth Summary | assets, registry | assets, registry | - | Can use existing projection |
| Connector / Integration Summary | connectors, integrations | connectors | integrations | Use safe summary/handoff only |
| AI Setup Guidance Handoff | capabilities, operations | capabilities, operations | - | Can use existing projection |
| Governance Handoff | governance, operations | operations | governance | Use safe summary/handoff only |
| Publishing / Launch Readiness Handoff | publishing, operations, activity | operations, activity | publishing | Use safe summary/handoff only |
| CRM / IVR / Voice Readiness | customer_ops, crm, ivr, voice | - | customer_ops, crm, ivr, voice | Do not surface as live feature; planned only |
