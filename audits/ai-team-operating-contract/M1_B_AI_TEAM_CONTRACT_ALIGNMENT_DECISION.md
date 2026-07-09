# M1-B — AI Team Contract Alignment Decision

## 0. Decision Status

Status: DECISION DOCUMENT
Mode: Documentation only
Runtime changes: none
UI changes: none
Backend changes: none

This document records the M1-A truth scan decision for the AI Team Operating Contract.

M1-A confirmed that the active AI Team Operating Contract exists, validates successfully, and conforms to the current runtime surfaces with zero failures.

The next work must be narrow alignment, not rebuild.

---

## 1. Master Operating Model Reference

The official project standard is defined in:

`audits/master-build-order/MH_OS_MASTER_GROWTH_OPERATING_MODEL_AND_BUILD_ORDER.md`

The master product flow is:

Project Truth → Research → Insights / Reports → Strategy → Content → Media / Creative Production → Publishing / Ads Execution → Analytics / Learning → Optimization → Back to Strategy.

The AI Team must operate as a living specialist team across this full flow.

---

## 2. M1-A Confirmed Active Contract State

M1-A confirmed:

- Active AI Team Operating Contract exists.
- Contract validation passes.
- Contract conformance check passes.
- Failures: 0.
- Handoff drift pairs: 0.
- Runtime output vocabulary is covered.
- Runtime request vocabulary is covered.
- AI Command covers canonical roles or aliases.
- Existing handoff pairs conform.
- Core validation remains clean.
- Working tree remains clean.

Therefore, the active contract is not broken.

---

## 3. Engineering Decision

Do not rebuild AI Command.

Do not rebuild the AI Team system.

Do not perform UI work in M1.

Do not modify runtime execution before alignment is documented and validated.

The correct next step is a narrow contract alignment patch only if the contract source needs canonical naming and alias normalization.

---

## 4. Alignment Gaps Found

M1-A found that the Master Growth Operating Model has wider role terminology than the active contract text.

Terms present in the Master Model but not fully aligned textually in the active contract include:

- Head Office
- Ads Operator
- Customer Ops
- Retention
- Data

Important interpretation:

This does not mean the system lacks those capabilities entirely.

Evidence from M1-A showed that AI Command already covers practical canonical roles such as:

- operations
- strategist
- writer
- media_director
- video_lead
- publisher
- ads_operator
- analyst
- researcher
- compliance_reviewer
- customer_ops
- sales_crm

Therefore, the gap is primarily naming, canonical role vocabulary, and alias normalization.

---

## 5. Alias Drift Decision

M1-A detected alias drift signals.

Examples include:

- admin
- executive
- campaign
- strategy
- copywriter
- content_writer
- content
- designer
- media
- creative
- visual
- video
- motion
- reel
- storyboard
- voiceover
- publish
- publishing
- schedule
- ads
- paid
- roas
- seo
- insights
- research
- researcher
- compliance
- governance
- safety
- approval
- customer_operations
- customer
- support
- inbox
- ticket
- sales
- crm
- lead

Decision:

Alias drift is not a blocker, but it must be normalized before the AI Team contract can be considered fully closed.

Aliases must resolve to canonical roles through one authoritative contract layer.

---

## 6. Unknown Route Candidate Decision

M1-A detected unknown route candidates:

- action
- analysis
- automation-engine
- command
- idle
- set-page

Decision:

Do not patch these blindly.

They must first be classified as one of:

1. real page route
2. internal state
3. command/action id
4. automation source
5. UI event marker
6. obsolete or accidental route-like token

Only true page routes require page owner mapping.

---

## 7. Required M1-C Patch Scope

The expected M1-C patch, if the next scan confirms exact source locations, must be limited to:

1. AI Team Operating Contract canonical role vocabulary.
2. Alias normalization mapping.
3. Optional owner/page mapping clarification for true route candidates.
4. Validator updates only if required by contract changes.
5. No UI redesign.
6. No backend behavior change.
7. No provider execution change.
8. No publishing behavior change.

Allowed target files may include:

- `public/control-center/runtime/ai-team/ai-team-operating-contract.js`
- `scripts/audit/validate-ai-team-operating-contract.mjs`
- `scripts/audit/ai-team-contract-conformance-check.mjs`

No other files should be changed unless a new truth scan proves necessity.

---

## 8. Canonical Role Alignment Target

The contract should align to this role model:

- operations
  - user-facing labels may include Head Office, Operations Lead, Executive Lead
- strategist
- researcher
- analyst
- writer
  - aliases may include Content Writer, Copywriter
- media_director
- video_lead
- publisher
- ads_operator
  - aliases may include Ads Operator, Paid Growth, Ads Manager
- compliance_reviewer
- customer_ops
  - aliases may include Customer Ops, Support, Inbox, Ticket
- sales_crm
  - aliases may include Sales, CRM, Leads
- retention
  - aliases may include Retention, Loyalty, Lifecycle
- data_reporting
  - aliases may include Data, Reporting Assistant, Metrics

M1-C must confirm whether retention and data_reporting should be new canonical roles or aliases under existing analyst/customer/sales roles.

No role should be added unless it has a clear owner, outputs, request types, and handoff responsibilities.

---

## 9. Handoff Alignment Target

The AI Team must support the master flow:

Project Truth → Research → Insights / Reports → Strategy → Content → Media → Publishing / Ads → Analytics / Learning → Optimization.

Required handoff concepts:

- Research → Insights
- Insights → Strategy
- Strategy → Content
- Content → Media
- Media → Publishing
- Publishing → Analytics
- Analytics → Optimization
- Optimization → Strategy

Existing handoffs already cover many practical page connections.

M1-C must avoid duplicating handoffs and should only normalize missing canonical terms.

---

## 10. Quality and Acceptance Criteria for M1 Closeout

M1 can close only when:

- Contract validator passes.
- Conformance checker passes.
- Failures remain 0.
- Unknown route candidates are classified or documented.
- Alias drift is reduced or explicitly normalized.
- Master role terminology is represented in the active contract.
- AI Command still covers canonical roles.
- Handoff pairs remain valid.
- No runtime behavior is broken.
- Core syntax validation passes.
- Working tree is clean.
- Commit and push are verified.

---

## 11. M1-B Final Decision

M1-A result: PASS WITH ALIGNMENT GAPS.

M1-B decision:

Proceed to M1-C with a narrow source-level truth scan for the AI Team contract exact patch targets.

No runtime patch is approved yet.

M1-C must inspect exact contract structures before editing.
