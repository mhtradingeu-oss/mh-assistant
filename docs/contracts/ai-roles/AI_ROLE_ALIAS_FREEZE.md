# AI Role Alias Freeze

## Status

Version: `1`

State: `contract-design-candidate`

This document freezes canonical AI Role identity and compatibility labels.

## Rules

1. Canonical identity is the canonical snake-case ID.
2. Display labels are not identities.
3. Compatibility aliases must resolve to exactly one canonical ID.
4. A legacy alias must never create an additional runtime owner.
5. Unknown aliases fail closed during contract validation.
6. Alias removal requires usage proof and a migration decision.
7. New canonical roles require a contract version change.

## Frozen canonical IDs and labels

| Canonical ID | Preferred display label | Qualified compatibility labels | Alias state |
|---|---|---|---|
| `operations_lead` | Operations Lead | Head Office, Head Office / Operations Lead | qualified-compatibility |
| `strategist` | Strategist | Strategy Lead, Growth Strategist | qualified-compatibility |
| `researcher` | Researcher | Market Researcher, Research Lead | qualified-compatibility |
| `writer` | Content Writer | Writer, Copywriter, Content Specialist | qualified-compatibility |
| `media` | Media Director | Creative Director, Visual Lead | qualified-compatibility |
| `video_lead` | Video Lead | Video Director, Video Specialist | qualified-compatibility |
| `publisher` | Publisher | Publishing Lead, Organic Publisher | qualified-compatibility |
| `ads` | Ads Operator | Paid Media Operator, Performance Marketer | qualified-compatibility |
| `analyst` | Analyst | Data Analyst, Performance Analyst, Insights Analyst | qualified-compatibility |
| `compliance_reviewer` | Compliance Reviewer | Policy Reviewer, Safety Reviewer | qualified-compatibility |
| `customer_ops` | Customer Operations | Customer Ops, Customer Support Lead | qualified-compatibility |
| `sales_crm` | Sales and CRM | Sales CRM, CRM Specialist | qualified-compatibility |

## Alias classification

Alias classes are:

- `qualified-compatibility`: a role-specific historical or descriptive label that may resolve only when role context is explicit;
- `display-label-only`: visible UI copy that must never resolve identity by itself;
- `ambiguous-blocked`: a generic domain, page, route, capability, or module term that must not resolve directly to a role;
- `historical-only`: retained only for documentation and migration evidence.

Generic labels including `Operations`, `Media`, `Ads`, `Support`, and `Sales` are `ambiguous-blocked`.

They may describe pages, domains, capabilities, routes, or modules and must not resolve directly to canonical role identity.

## Deprecated identity behavior

The following forms are not valid canonical IDs:

- display labels;
- role titles containing spaces;
- page names;
- tool names;
- route names;
- provider names;
- capability IDs;
- mission IDs.

They may appear in UI copy or historical evidence but must resolve to a canonical role before contract validation.

## Conflict policy

An alias is conflicting when it:

- maps to multiple canonical roles;
- overlaps a capability ID and is used as identity;
- overlaps a route or page ID and is used as identity;
- changes ownership depending on UI surface;
- acts as a hidden runtime registry key.

Conflicting aliases must remain blocked until resolved by an explicit migration decision.

## Compatibility period

Legacy labels may remain visible during shadow adoption.

Compatibility does not authorize:

- duplicate registries;
- duplicate runtime owners;
- silent canonical-ID changes;
- removal of current callers without parity proof.

## Acceptance gate

The alias freeze may be finalized when:

1. every active alias resolves to one role;
2. no unresolved alias collision remains;
3. all active callers have compatibility coverage;
4. shadow comparison proves equivalent resolution;
5. removal candidates have producer and consumer evidence.
