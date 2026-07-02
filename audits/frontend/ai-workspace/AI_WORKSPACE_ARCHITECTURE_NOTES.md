# AI Workspace Architecture Notes

## Current Reality

AI Workspace is NOT a true operating room yet.

It currently acts as:
- prompt preparation shell
- orchestration entry point
- recommendation surface
- workflow bridge
- command routing layer

## Existing strengths

Already implemented:
- specialist concepts
- recommendation awareness
- next-best-action awareness
- workflow bridge
- governance awareness
- readiness awareness
- campaign context
- learning context
- route suggestions
- AI command execution integration

## Main architectural issue

The workspace renders orchestration as response content instead of runtime operating state.

Current UX:
command -> response

Target UX:
operating context -> specialists -> orchestration -> approvals -> artifacts -> execution

## Confirmed dependency issue

AI Workspace still depends heavily on:
- global AI command bar
- global command runtime

Evidence:
"Command prepared in the global AI bar"

## Canonical future role

AI Workspace should become:
- operating room
- orchestrator surface
- specialist collaboration layer
- approval coordination layer
- artifact command center
- workflow launch surface

NOT:
- prompt helper page

## Immediate engineering doctrine

Do NOT:
- rewrite ai-command.js
- split randomly
- redesign visually first

Do:
- separate operating layers gradually
- preserve orchestration runtime
- preserve command execution compatibility
- preserve workflow bridge
- preserve governance compatibility

## Future separation targets

1. specialist-runtime
2. orchestration-runtime
3. artifact-runtime
4. recommendation-runtime
5. approval-runtime
6. command-runtime bridge
7. execution-launch bridge

## Priority

Medium-high

Reason:
AI Workspace is central to final MH-OS identity.
