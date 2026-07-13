# MH-OS Membership and Scope Contract Design

## Status

Design proposal only.

No membership runtime is implemented.

Existing AI roles, security boundaries, and permissions remain authoritative.

---

# 1. Objective

Define the future Membership and Scope model for MH-OS.

Membership connects principals to workspaces and defines scoped participation.

---

# 2. Membership Model

Future membership:


Membership

principal_id
workspace_id
membership_type
status
scopes
evidence

---

# 3. Membership Types

Future membership types:


OWNER

ADMIN

OPERATOR

COLLABORATOR

AI_AGENT

SERVICE


---

# 4. Scope Model

Scopes are defined by boundary:


Workspace Scope

Project Scope

Capability Scope

Data Scope


---

# 5. AI Agent Relationship

AI agents are not human users.

Future model:


Workspace

↓

AI Agent Membership

↓

Capability Scope

↓

Policy Decision


---

# 6. Current Foundations

Existing foundations:

| Area | Current Capability |
|---|---|
| AI Roles | Team role definitions |
| Permissions | Route and action vocabulary |
| Governance | Protected decisions |
| Identity | Principal context |

---

# 7. Safety Rules

Membership design must:

- preserve workspace authority
- preserve existing security gates
- avoid RBAC replacement
- validate before enforcement

---

# 8. Non Goals

This phase does not create:

- login system
- user database
- RBAC replacement
- permission runtime
- membership enforcement

---

# 9. Next Step

BE-3.4:

Scope Authority Validation Design.
