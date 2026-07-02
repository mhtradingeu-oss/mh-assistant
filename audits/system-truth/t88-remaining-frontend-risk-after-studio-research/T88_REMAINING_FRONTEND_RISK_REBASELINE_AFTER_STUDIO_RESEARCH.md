# T88 — Remaining Frontend Risk Rebaseline After Studio + Research

## Status
Audit-only. No production files changed.

## Purpose
Rebaseline remaining active frontend runtime risk after closing:

- Media Studio
- Content Studio
- Research

## Summary
- Total page JS files scanned: 32
- Closed files: 7
- Open files: 25

## Closed / Reviewed Files
- public/control-center/pages/media-studio-workspace.js
- public/control-center/pages/content-studio-workspace.js
- public/control-center/pages/research.js
- public/control-center/pages/home.js
- public/control-center/pages/insights.js
- public/control-center/pages/setup.js
- public/control-center/pages/customer-center.js

## Top Remaining Open Files
### 1. public/control-center/pages/ai-command.js

- Score: 16641.86
- Lines: 6183
- Render writes: 1
- Event bindings: 40
- API calls/signals: 640
- AI signals: 1481
- Mutation signals: 392
- Handoff signals: 167
- Approval signals: 711
- Task signals: 153
- Confirmation signals: 0
- Risky terms: 1388

### 2. public/control-center/pages/library.js

- Score: 9027.16
- Lines: 3563
- Render writes: 26
- Event bindings: 60
- API calls/signals: 556
- AI signals: 172
- Mutation signals: 209
- Handoff signals: 7
- Approval signals: 336
- Task signals: 0
- Confirmation signals: 4
- Risky terms: 937

### 3. public/control-center/pages/publishing.js

- Score: 7998.3
- Lines: 2060
- Render writes: 1
- Event bindings: 20
- API calls/signals: 527
- AI signals: 173
- Mutation signals: 500
- Handoff signals: 28
- Approval signals: 128
- Task signals: 0
- Confirmation signals: 6
- Risky terms: 599

### 4. public/control-center/pages/ai-command/tool-dock.js

- Score: 6069.84
- Lines: 1867
- Render writes: 4
- Event bindings: 13
- API calls/signals: 395
- AI signals: 270
- Mutation signals: 98
- Handoff signals: 16
- Approval signals: 198
- Task signals: 22
- Confirmation signals: 0
- Risky terms: 565

### 5. public/control-center/pages/governance.js

- Score: 5690.62
- Lines: 1521
- Render writes: 2
- Event bindings: 7
- API calls/signals: 261
- AI signals: 181
- Mutation signals: 145
- Handoff signals: 10
- Approval signals: 533
- Task signals: 1
- Confirmation signals: 4
- Risky terms: 334

### 6. public/control-center/pages/operations-centers.js

- Score: 5081.26
- Lines: 2268
- Render writes: 5
- Event bindings: 36
- API calls/signals: 274
- AI signals: 307
- Mutation signals: 126
- Handoff signals: 16
- Approval signals: 157
- Task signals: 99
- Confirmation signals: 1
- Risky terms: 321

### 7. public/control-center/pages/workflows.js

- Score: 4606
- Lines: 2395
- Render writes: 1
- Event bindings: 39
- API calls/signals: 193
- AI signals: 298
- Mutation signals: 288
- Handoff signals: 72
- Approval signals: 76
- Task signals: 32
- Confirmation signals: 7
- Risky terms: 257

### 8. public/control-center/pages/settings.js

- Score: 4184.44
- Lines: 2057
- Render writes: 5
- Event bindings: 7
- API calls/signals: 224
- AI signals: 254
- Mutation signals: 175
- Handoff signals: 1
- Approval signals: 182
- Task signals: 0
- Confirmation signals: 1
- Risky terms: 289

### 9. public/control-center/pages/campaign-studio.js

- Score: 3318.76
- Lines: 2068
- Render writes: 1
- Event bindings: 13
- API calls/signals: 130
- AI signals: 602
- Mutation signals: 87
- Handoff signals: 34
- Approval signals: 32
- Task signals: 2
- Confirmation signals: 1
- Risky terms: 142

### 10. public/control-center/pages/integrations.js

- Score: 3159.94
- Lines: 1992
- Render writes: 1
- Event bindings: 16
- API calls/signals: 179
- AI signals: 243
- Mutation signals: 135
- Handoff signals: 5
- Approval signals: 35
- Task signals: 1
- Confirmation signals: 2
- Risky terms: 287

### 11. public/control-center/pages/integrations/builders.js

- Score: 850.76
- Lines: 818
- Render writes: 0
- Event bindings: 0
- API calls/signals: 47
- AI signals: 127
- Mutation signals: 30
- Handoff signals: 1
- Approval signals: 0
- Task signals: 1
- Confirmation signals: 0
- Risky terms: 54

### 12. public/control-center/pages/library/action-panel.js

- Score: 604.8
- Lines: 150
- Render writes: 0
- Event bindings: 0
- API calls/signals: 53
- AI signals: 4
- Mutation signals: 11
- Handoff signals: 0
- Approval signals: 10
- Task signals: 0
- Confirmation signals: 0
- Risky terms: 64

### 13. public/control-center/pages/ads-manager.js

- Score: 433.68
- Lines: 624
- Render writes: 1
- Event bindings: 5
- API calls/signals: 22
- AI signals: 61
- Mutation signals: 6
- Handoff signals: 0
- Approval signals: 3
- Task signals: 0
- Confirmation signals: 0
- Risky terms: 24

### 14. public/control-center/pages/publishing/publishing-payloads.js

- Score: 417.88
- Lines: 119
- Render writes: 0
- Event bindings: 0
- API calls/signals: 27
- AI signals: 15
- Mutation signals: 7
- Handoff signals: 13
- Approval signals: 6
- Task signals: 0
- Confirmation signals: 0
- Risky terms: 27

### 15. public/control-center/pages/library/ai-panel.js

- Score: 330.56
- Lines: 123
- Render writes: 0
- Event bindings: 0
- API calls/signals: 27
- AI signals: 8
- Mutation signals: 2
- Handoff signals: 0
- Approval signals: 9
- Task signals: 0
- Confirmation signals: 0
- Risky terms: 35

### 16. public/control-center/pages/integrations/cards.js

- Score: 268.58
- Lines: 414
- Render writes: 0
- Event bindings: 0
- API calls/signals: 15
- AI signals: 29
- Mutation signals: 17
- Handoff signals: 0
- Approval signals: 0
- Task signals: 0
- Confirmation signals: 0
- Risky terms: 17

### 17. public/control-center/pages/integrations/drawer.js

- Score: 197.48
- Lines: 439
- Render writes: 0
- Event bindings: 0
- API calls/signals: 12
- AI signals: 21
- Mutation signals: 6
- Handoff signals: 0
- Approval signals: 0
- Task signals: 0
- Confirmation signals: 0
- Risky terms: 19

### 18. public/control-center/pages/integrations/render.js

- Score: 113.42
- Lines: 206
- Render writes: 0
- Event bindings: 0
- API calls/signals: 3
- AI signals: 34
- Mutation signals: 2
- Handoff signals: 0
- Approval signals: 0
- Task signals: 0
- Confirmation signals: 0
- Risky terms: 3

### 19. public/control-center/pages/home/render-sections.js

- Score: 96.42
- Lines: 156
- Render writes: 0
- Event bindings: 0
- API calls/signals: 2
- AI signals: 14
- Mutation signals: 7
- Handoff signals: 0
- Approval signals: 3
- Task signals: 1
- Confirmation signals: 0
- Risky terms: 7

### 20. public/control-center/pages/integrations/diagnostics.js

- Score: 84.88
- Lines: 159
- Render writes: 0
- Event bindings: 0
- API calls/signals: 5
- AI signals: 6
- Mutation signals: 5
- Handoff signals: 0
- Approval signals: 0
- Task signals: 0
- Confirmation signals: 0
- Risky terms: 9


## Decision Rule
The next runtime-authority review should start from the highest-ranked open active routed page, unless it is proven inactive, duplicate, or helper-only.
