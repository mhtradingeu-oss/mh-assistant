# Recommendation Runtime Contract

## Purpose
The Recommendation Runtime is responsible for turning performance summaries, risk alerts, learning candidates, and execution signals into optimization recommendations and smart next actions.

## Current location
runtime/orchestrator-service/server.js

## Current function locations
- buildTrendSnapshot: around 20145
- buildRiskAlerts: around 20268
- generateOptimizationRecommendations: around 20315
- buildLearningCandidates: around 20414
- updateIntelligenceLoop: around 20458
- buildSmartSuggestions: around 20521

## Public routes connected to this runtime
- POST /generate_optimization_recommendations
- GET /get_smart_suggestions
- POST /run_scheduler_worker_once
- POST /record_execution_feedback

## Core responsibilities
- Generate optimization recommendations.
- Build smart suggestions.
- Detect risk alerts.
- Create learning candidates.
- Update learning patterns from performance and execution feedback.
- Feed suggestions back into the execution/intelligence loop.

## Dependencies
- buildPerformanceSummary
- readPerformanceStore
- readRecommendationsStore
- writeRecommendationsStore
- readLearningStore
- writeLearningStore
- collectExecutionSignals
- upsertLearningPattern
- normalizeProjectSlug
- toFiniteNumber

## Extraction rule
Do not extract updateIntelligenceLoop first.
Do not move public routes first.
Do not alter recommendation wording/shape during extraction.
Start by extracting pure builders only.

## Safe extraction order
1. Create this contract.
2. Extract pure builders:
   - buildRiskAlerts
   - buildLearningCandidates
3. Extract generateOptimizationRecommendations with injected storage dependencies.
4. Extract buildSmartSuggestions only after recommendation storage is stable.
5. Extract updateIntelligenceLoop last.
6. Move routes only after all runtime modules are stable.

## Safety requirements
- /get_smart_suggestions output shape must remain unchanged.
- /generate_optimization_recommendations output shape must remain unchanged.
- Learning store updates must remain unchanged.
- No route behavior changes.
- node --check must pass after each step.
- Live endpoint tests must pass after each extraction.
