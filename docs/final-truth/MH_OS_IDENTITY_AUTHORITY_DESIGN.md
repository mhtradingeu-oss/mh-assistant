# MH-OS Identity Authority Design

## Status

Design proposal only.

Runtime implementation has not started.

No authentication, authorization, permission, or data behavior is changed by this document.

---

# 1. Purpose

Define a future identity and authority foundation for MH-OS without replacing existing runtime behavior until migration is approved.

The goal is:

Principal → Workspace → Project → Permission → Action → Evidence

---

# 2. Current Reality

Current runtime contains:

- access key protection
- route permissions
- role values
- project context
- ownership fields
- governance gates

These are existing mechanisms.

They are not yet a unified identity authority model.

---

# 3. Future Identity Model

## Principal

Principal represents the acting entity.

Types:

- human
- service
- system

Example:


principal_id
principal_type
status
created_at
metadata


---

# 4. Authority Context

Every controlled action should eventually resolve:


Principal

↓

Workspace Context

↓

Project Context

↓

Permissions

↓

Action

↓

Audit Evidence


Suggested fields:


principal_id
workspace_id
project_id
roles
permissions
source
decision_context
audit_reference


---

# 5. Compatibility Strategy

Existing mechanisms remain compatibility inputs.

Examples:

- access key
- existing role values
- project selectors
- legacy permission checks

Future flow:


Legacy Input

↓

Identity Adapter

↓

Authority Context

↓

Permission Decision


No destructive replacement.

---

# 6. Permission Resolver Direction

Future authorization should resolve:


can(
principal,
action,
resource,
context
)


instead of relying only on static role checks.

The resolver must preserve:

- explainability
- auditability
- project isolation
- governance compatibility

---

# 7. Workspace Authority

Future model:


Principal

↓

Workspace Membership

↓

Project Membership

↓

Allowed Actions


Workspace ownership must become explicit.

---

# 8. Non Goals

This phase does NOT create:

- user registration
- OAuth system
- SSO
- IAM replacement
- frontend authority
- new RBAC package
- database migration

---

# 9. Migration Principles

Mandatory:

- preserve existing runtime behavior
- introduce adapters before replacement
- shadow compare decisions
- avoid duplicate authority systems
- validate before migration

---


# 9.5 Current Ownership Candidates

| Concern | Current Source | Future Adapter Direction |
|---|---|---|
| Access protection | security modules and server guards | Identity adapter |
| Roles | route permissions and role projections | Principal role mapping |
| Project context | project loaders and data resolvers | Authority context |
| Frontend authority display | authority projection | Backend-owned projection |

These are observations only. They do not change current runtime ownership.

---

# 10. Next Steps

BE-1.3:

- inspect current security ownership
- define minimal adapter boundary
- identify implementation files
- prepare smallest safe patch
