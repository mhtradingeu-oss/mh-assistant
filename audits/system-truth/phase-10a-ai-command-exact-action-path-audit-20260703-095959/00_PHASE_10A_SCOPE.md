# PHASE 10A — AI Command Exact Action Path Audit

Date: 20260703-095959

Mode:
- SCAN ONLY
- No production code edit
- No backend edit
- No frontend edit
- No route change
- No delete
- No CSS change
- No feature implementation

Goal:
Verify exact AI Command execution paths before locking Phase 10.

Targets:
- aicmdV2AskBtn onclick
- sendBtn.click?.()
- executeProjectAiCommand call path
- executeProjectAiChat call path
- __AI_RUNTIME_TICK
- submitDurableCommand / external command paths if present
- mh:submit-ai-command listener/dispatcher
- campaign preview backend helper
- confirmation-gated handoff/publishing/workflow behavior
