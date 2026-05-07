# Execution Runtime Contract

## Purpose
The Execution Runtime is responsible for scheduling, executing, logging, retrying, and learning from execution jobs.

## Current location
runtime/orchestrator-service/server.js

## Current line range
Approximately 19960-21290.

## Core responsibilities
- Schedule execution jobs.
- Expose scheduler queue state.
- Run due jobs with worker locking.
- Execute bridge jobs for publish, email, media, and ads.
- Record execution feedback.
- Update learning/intelligence loops after execution.
- Generate optimization recommendations.

## Public routes
- POST /schedule_execution_job
- GET /scheduler_queue
- POST /run_scheduler_worker_once
- POST /record_execution_feedback
- GET /get_performance_summary
- POST /generate_optimization_recommendations
- GET /get_smart_suggestions

## Internal scheduler functions
- readSchedulerJobs
- writeSchedulerJobs
- writeSchedulerAuditLog
- generateJobId
- generateWorkerId
- isJobDue
- isJobLockExpired
- buildSchedulerJobRecord
- executeJobBridge

## Package builder dependencies
- resolvePublishPackageForExecution
- buildSocialExecutionPayload
- resolveEmailPackageForExecution
- buildEmailReadyPayload
- buildMediaGenerationMock
- resolveCampaignPackageForAds
- buildAdExecutionPackage

## Intelligence dependencies
- updateIntelligenceLoop
- appendPerformanceRecord
- buildPerformanceSummary
- generateOptimizationRecommendations
- buildSmartSuggestions

## Shared helper dependencies
- requireProjectContext
- sendError
- getErrorStatusCode
- normalizeProjectSlug
- resolveProjectPath
- ensureDir
- readJsonFile
- writeJsonFile
- sanitizeValue
- sanitizeErrorMessage

## Extraction rule
Do not extract routes first.
First extract pure/internal functions into a module that receives dependencies explicitly.

## Safe extraction order
1. Create execution-runtime.contract.md.
2. Add tests/audit commands for current routes.
3. Extract scheduler pure helpers only.
4. Extract storage helpers only after tests pass.
5. Extract executeJobBridge only after package-builder dependency injection is ready.
6. Move Express routes last.

## Safety requirements
- No route behavior change.
- No path behavior change.
- No execution state behavior change.
- No job retry behavior change.
- No feedback loop behavior change.
- node --check must pass after each step.
- Git commit after each safe extraction step.
