# Performance Feedback Runtime Contract

## Purpose
The Performance Feedback Runtime is responsible for recording execution feedback, storing performance signals, summarizing results, generating optimization recommendations, and producing smart suggestions for future execution.

## Current location
runtime/orchestrator-service/server.js

## Current line range
Approximately 20000-20670 for core functions, plus public routes around 21072-21374.

## Public routes
- POST /record_execution_feedback
- GET /get_performance_summary
- POST /generate_optimization_recommendations
- GET /get_smart_suggestions

## Core functions
- normalizeFeedbackMetrics
- appendPerformanceRecord
- buildPerformanceSummary
- generateOptimizationRecommendations
- buildSmartSuggestions
- updateIntelligenceLoop

## Related functions
- collectExecutionSignals
- buildTrendSnapshot
- buildRiskAlerts
- buildLearningCandidates
- upsertLearningPattern
- inferPerformanceContextFromJob
- derivePerformanceStats
- calculateEntityPerformance

## Storage dependencies
- getIntelligencePaths
- readPerformanceStore
- writePerformanceStore
- readLearningStore
- writeLearningStore
- readRecommendationsStore
- writeRecommendationsStore
- readSchedulerJobs

## Shared helper dependencies
- normalizeProjectSlug
- ensureDir
- readJsonFile
- writeJsonFile
- toFiniteNumber
- average

## Extraction rule
Do not move public routes first.
Do not split updateIntelligenceLoop before performance store contracts are stable.
First extract pure helpers and storage access through dependency injection.

## Safe extraction order
1. Create performance-feedback-runtime.contract.md.
2. Extract pure metrics helpers only.
3. Extract performance store read/write helpers.
4. Extract recommendation builders.
5. Extract updateIntelligenceLoop only after store contracts are stable.
6. Move public routes last.

## Safety requirements
- No feedback metric behavior change.
- No recommendations behavior change.
- No learning loop behavior change.
- No scheduler queue interaction change.
- node --check must pass after each step.
- Live endpoint sanity test must pass after extraction.
- Commit after each safe extraction step.

## Current risk level
MEDIUM

## Recommended first extraction
Extract pure metric helpers:
- toFiniteNumber if local to this domain, otherwise keep shared.
- average if local to this domain, otherwise keep shared.
- normalizeFeedbackMetrics
- derivePerformanceStats
- calculateEntityPerformance
