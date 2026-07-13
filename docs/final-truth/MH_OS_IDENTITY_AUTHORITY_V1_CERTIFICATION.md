# MH-OS Identity Authority v1 Certification

## Status

Phase certification document.

Identity Authority v1 implementation is complete for the defined scope.

This document records implemented behavior and remaining gaps.

---

# 1. Scope

Identity Authority v1 introduces:

- passive principal assertion
- request authority context
- runtime security decision observation
- shadow evidence capture

It does not replace existing security authority.

---

# 2. Implemented Components

## Identity Adapter

Location:


runtime/orchestrator-service/lib/security/identity-adapter.js


Status:


IMPLEMENTED


Provides:

- principal assertion
- authority context creation
- evidence sanitization
- shadow observation support

---

## Authentication Context Wiring

Location:


runtime/orchestrator-service/server.js


Status:


IMPLEMENTED


Existing authentication guards remain authoritative.

---

## Runtime Security Observation

Locations:


runtime/orchestrator-service/lib/security/runtime-security-enforcement.js
runtime/orchestrator-service/server.js


Status:


IMPLEMENTED


Runtime security decisions are observed without changing enforcement behavior.

---

# 3. Authority Model

Current model:


Authentication

↓

Identity Context

↓

Existing Runtime Security Authority

↓

Decision Observation


The identity layer explains and records context.

It does not authorize actions.

---

# 4. Security Guarantees

Identity Authority v1 guarantees:

- no credential storage
- no secret exposure
- no actor trust
- no frontend authority
- no RBAC replacement
- no authentication replacement
- no runtime decision override

---

# 5. Remaining Gaps

| Area | Status |
|---|---|
| Principal Foundation | COMPLETE |
| Workspace Membership Authority | OPEN |
| Permission Resolver | OPEN |
| Credential Scope Model | OPEN |
| Isolation Proof | OPEN |

---

# 6. Next Phase

BE-1.11:

Permission Resolver Design.

Goal:

Define a future decision model:


Principal

Action

Resource

Context

Policy

↓

Decision


without replacing current runtime authority before validation.

