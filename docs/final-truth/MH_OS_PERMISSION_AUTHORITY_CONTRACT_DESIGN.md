# MH-OS Permission Authority Contract Design

## Status

Design proposal only.

No permission authority runtime is implemented.

Existing security gates, governance decisions, and execution controls remain authoritative.

---

# 1. Objective

Define the future Permission Authority model for MH-OS.

Permission Authority describes whether a principal may perform an action on a resource under specific workspace, scope, capability, policy, and evidence context.

---

# 2. Permission Model

Future permission:


Permission

permission_id
principal_context
workspace_context
scope
capability
action
resource
policy
evidence
decision

---

# 3. Permission Types

Future permission categories:


READ

WRITE

EXECUTE

APPROVE

MANAGE


---

# 4. Permission Relationship

Future model:


Principal

↓

Workspace

↓

Membership

↓

Scope

↓

Capability

↓

Permission

↓

Policy

↓

Evidence

↓

Decision


---

# 5. Decision States

Possible decisions:


ALLOW

DENY

REVIEW_REQUIRED

POLICY_BLOCKED

UNTRUSTED


---

# 6. Current Foundations

Existing foundations:

| Area | Current Capability |
|---|---|
| Routes | Permission catalog |
| Providers | Execution gates |
| Governance | Policy decisions |
| Security | Runtime enforcement |
| Evidence | Authority context |

---

# 7. Safety Rules

Permission Authority:

- cannot execute actions
- cannot replace runtime security
- cannot bypass governance
- cannot override provider gates
- cannot become RBAC replacement

---

# 8. Non Goals

This phase does not create:

- permission runtime
- authorization migration
- RBAC system
- security replacement
- provider bypass

---

# 9. Next Step

BE-5.3:

Permission Validation Design.
