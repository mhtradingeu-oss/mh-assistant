# Runtime Dependency Graph

## Stable extracted modules

### scheduler-helpers.js
Pure scheduler helper logic.
Dependencies:
- crypto
- lock timeout config

Exports:
- generateJobId
- generateWorkerId
- isJobDue
- isJobLockExpired
- buildSchedulerJobRecord

Risk level:
LOW

---

### scheduler-storage.js
Scheduler persistence layer.

Dependencies:
- fs
- path
- ensureDir
- readJsonFile
- writeJsonFile
- normalizeProjectSlug
- resolveProjectPath

Exports:
- getSchedulerFilePath
- readSchedulerJobs
- writeSchedulerJobs
- writeSchedulerAuditLog

Risk level:
MEDIUM

---

### execution-job-bridge.js
Execution dispatch bridge.

Dependencies:
- publish package builders
- email package builders
- media generation builders
- ads package builders

Exports:
- executeJobBridge

Risk level:
HIGH

---

### performance-metrics.js
Pure metrics/statistics logic.

Exports:
- toFiniteNumber
- normalizeFeedbackMetrics
- derivePerformanceStats

Risk level:
LOW

---

### performance-storage.js
Performance persistence layer.

Dependencies:
- getIntelligencePaths
- readJsonFile
- writeJsonFile

Exports:
- readPerformanceStore
- writePerformanceStore
- readLearningStore
- writeLearningStore
- readRecommendationsStore
- writeRecommendationsStore

Risk level:
MEDIUM

---

### recommendation-builders.js
Pure recommendation helper builders.

Dependencies:
- toFiniteNumber injection

Exports:
- buildRiskAlerts
- buildLearningCandidates

Risk level:
LOW

---

## Remaining high-risk runtime areas

### generateOptimizationRecommendations
Status:
NOT extracted

Reason:
Depends on:
- performance summary
- recommendations store
- risk alerts
- learning candidates

Risk:
MEDIUM-HIGH

---

### buildSmartSuggestions
Status:
NOT extracted

Reason:
Connected to:
- recommendations
- learning signals
- alerts
- runtime outputs

Risk:
HIGH

---

### updateIntelligenceLoop
Status:
NOT extracted

Reason:
Central intelligence mutation loop.

Connected to:
- learning store
- recommendations store
- scheduler execution
- feedback recording

Risk:
VERY HIGH

---

## Runtime safety barriers

Protected by:
- smoke-tests.sh
- route contract snapshots
- runtime contracts
- checkpoints
- phase2-runtime-stable git tag

