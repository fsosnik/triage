# TRIAGE OS — Architecture

## 7 Layers

Layer 7: Knowledge Base (auto-evolución)
Layer 6: Checkpoint automático
Layer 5: Validation Gate (verdad)
Layer 4: Execution Tools (Git, Bash, Tests)
Layer 3: Agent Mesh (Code, QA, Research, Risk)
Layer 2: Core OS (orquestador)
Layer 1: Input (tarea)

## Implemented: Layers 1-6

**Layer 1 Input**: taskType, agents, prediction
**Layer 2 Core**: TriageOS, TriageOSCore
**Layer 3 Agents**: Mocked, ready for real Claude
**Layer 4 Tools**: npm test, npm build, git status, curl
**Layer 5 Validation**: Compare prediction vs reality (reality wins)
**Layer 6 Checkpoint**: Auto-save to .claude/checkpoints/

## Data Flow

Task → classifyTaskType() → selectAgents()
  → ValidationGate.validate() (tests, build, git, production)
  → ComparisonEngine.compare() (reality > prediction)
  → FeedbackEngine.process()
    ├─ Success → LearningLoop (capture pattern)
    └─ Failure → RollbackLoop (penalize, rollback)
  → AutoCheckpoint.save()

## Modules (14 total)

Core (2): TriageOS, TriageOSCore
Learning (8): LearningLoop, MetricsCollector, PatternExtractor, PatternStorage, HistoryManager, WeightCalculator, AgentAnalyzer, FailureClassifier
Validation (5): ValidationGate, TestValidator, BuildValidator, GitValidator, ComparisonEngine
Feedback (3): FeedbackEngine, RollbackLoop, AutoCheckpoint, BlocklistManager

## All Modules: CC < 10 ✅

## Storage

.claude/patterns/successes.json — learned patterns
.claude/patterns/blocklist.json — dangerous patterns
.claude/learning/weights.json — agent weights
.claude/checkpoints/ — auto-saved state per cycle

## Checkpoint Example

```json
{
  "timestamp": "2026-06-08T15:40:00Z",
  "task": "oauth2",
  "status": "VALIDATED",
  "validations": {
    "tests_passed": 24,
    "build_success": true,
    "git_clean": true
  },
  "patterns_stored": 1
}
```

## Pattern Example

```json
{
  "id": "pattern-timestamp",
  "name": "oauth2",
  "category": "authentication",
  "agents_used": ["code", "qa", "risk"],
  "success_rate": 100,
  "execution_time_ms": 50000,
  "tokens_avg": 1500,
  "tools": ["npm", "jest", "git"]
}
```

## Agent Weights

Base: 0.1 - 1.0
Success: +0.08
Failure: -0.25

Stored per cycle, evolves over time.

## Next: Phase 4 (CLI)

triage cycle --task "..." --agents "..."
