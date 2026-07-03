# Phase 13D — Frontend Public Alias Zero-Use Confirmation Matrix

## Verdict target
Confirm that Control Center frontend mutation callers use canonical `/media-manager/...` routes and do not call legacy `/public/media-manager/...` mutation aliases.

## Matrix

| Area | Public alias caller found? | Canonical caller found? | Notes | Verdict |
|---|---:|---:|---|---|
| API helper layer | TBD from scan | TBD from scan | `public/control-center/api.js` should use `/media-manager/...` | Await review |
| AI Command | TBD from scan | Uses AI helper imports / preview guards | Should not call `/public/media-manager/...` | Await review |
| Publishing page | TBD from scan | Should use api.js publishing helpers | No direct public alias expected | Await review |
| Integrations flows | TBD from scan | Should use api.js integration helpers | No direct public alias expected | Await review |
| Governance / approvals | TBD from scan | Should use canonical approval/governance helpers | No direct public alias expected | Await review |
| Tasks / workflows / handoffs | TBD from scan | Should use canonical helpers | No direct public alias expected | Await review |
| Notifications | TBD from scan | Should use canonical notification helper | No direct public alias expected | Await review |
| Backend public aliases | Exist | Canonical also exists | Compatibility only; deprecated/telemetry headers present | Await review |

## Lock criteria

PASS if:
- frontend `/public/media-manager` scan is empty
- api.js canonical mutation route inventory is present
- AI Command has no public alias mutation calls
- backend public aliases remain compatibility-only
- no production diff exists
