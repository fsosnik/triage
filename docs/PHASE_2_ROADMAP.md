# Phase 2 Roadmap: Parallel Execution & Advanced Learning

**Planning Date:** 2026-06-11  
**Planned Start:** 2026-06-12  
**Estimated Duration:** 10 working days  
**Target Release:** 2026-06-25

---

## Overview

Phase 2 builds on Phase 1's validated architecture to add parallel agent execution, advanced validation gates, and multi-workflow checkpointing. The phase addresses 3 known Phase 1 issues while introducing new capabilities for concurrent decision-making and cross-workflow learning.

**Guiding Principle:** Reality still arbitrates all predictions, but now multiple agents can propose solutions in parallel, with the validation gate choosing the best real outcome.

---

## W6: Parallel Agent Execution

**Priority:** CRITICAL (blocks other workflows)  
**Effort:** 3 days  
**Dependencies:** Phase 1 completion  
**Success Criteria:**
- 4 agents execute in parallel for single task
- All agent outputs captured and compared
- Fastest agent completes <20% slower than current sequential time

### Implementation Spec

**Architecture Change:**
```
BEFORE (Sequential):
Task → Code Agent (30s) → QA Agent (20s) → Research Agent (15s) → Risk Agent (25s) = 90s total

AFTER (Parallel):
Task → [Code Agent (30s) || QA Agent (20s) || Research Agent (15s) || Risk Agent (25s)] = 30s total
       (parallel execution, all complete in time of slowest)
       ↓
       Validation Gate (compares all 4 results)
```

**New Components:**
1. **AgentPool** - Manage 4 concurrent agent workers
   - Location: `src/core/agent-pool.js` (new)
   - Responsibility: Spawn agents, distribute tasks, collect results, handle timeouts
   - Interface: `pool.execute(task, agents)` → Promise<Map<agentId, result>>

2. **ResultComparator** - Compare outputs from parallel agents
   - Location: `src/core/result-comparator.js` (new)
   - Responsibility: Score results, detect contradictions, flag divergence
   - Interface: `comparator.compare(results)` → {bestResult, warnings, conflicts}

3. **Agent Messaging** - IPC between agents
   - Location: `src/core/agent-messenger.js` (new)
   - Responsibility: Pass data between agents via event emitters
   - Interface: Pub/sub messaging with typed channels

**Modified Components:**
- `WorkflowBase.execute()` - Add parallel phase type
- `TriageOS` - Implement agent pool lifecycle

**Tests (new):**
- `tests/agent-pool.test.js` - 8 tests (setup, teardown, parallel execution, timeout)
- `tests/result-comparator.test.js` - 6 tests (scoring, conflict detection)
- `tests/parallel-workflows.integration.test.js` - 4 integration tests

**Estimated Lines:** 250 new lines + 80 modifications

---

## W7: Advanced Validation Gates

**Priority:** HIGH (enables real validation vs mock)  
**Effort:** 2 days  
**Dependencies:** W6 (parallel agents will produce divergent results to validate)  
**Success Criteria:**
- Validation runs against real execution, not mocks
- Database state validation implemented
- URL health check implemented
- Test execution validation functional

### Implementation Spec

**Current State:** Phase 5 validation is functional but uses mock test results and mocked endpoints.

**Required Changes:**
1. **Real Test Validation**
   - Location: `src/validation/test-validator.js` (enhance)
   - Current: Checks if tests exist
   - Required: Actually run tests, parse output, verify pass/fail
   - Impact: Adds ~30 seconds to validation phase

2. **Database State Validator**
   - Location: `src/validation/db-validator.js` (new)
   - Capability: Query database before/after changes, verify schema integrity
   - Scope: Check migration state, table existence, row counts
   - Implementation: Use knex for DB queries (already in package.json)
   - Tests: 4 tests for schema, migration, state validation

3. **URL Health Check (Real)**
   - Location: `src/validation/url-validator.js` (enhance)
   - Current: Prints "Health check would run: GET /health"
   - Required: Actually curl endpoints, check response codes
   - Added Dependency: curl (system binary) or node-fetch (npm)
   - Tests: 3 tests for 2xx, 4xx, 5xx responses

4. **Build Artifact Validator**
   - Location: `src/validation/build-validator.js` (enhance)
   - Current: Checks if dist/ or build/ exists
   - Required: Verify artifact contents, bundle size, minification
   - Tests: 3 tests

**New Validation Gate Phases:**
```
Phase 5.1: Unit Test Validation (run tests, parse output) — 5s
Phase 5.2: Database State Check (migrations, schema) — 2s
Phase 5.3: Build Artifact Inspection (size, contents) — 1s
Phase 5.4: Production URL Health (curl endpoints) — 2s
Phase 5.5: Git State Final Check (working tree clean) — 1s
Total: 11s (was <1s with mocks)
```

**Tests (new):**
- `tests/test-validator.test.js` - 5 tests
- `tests/db-validator.test.js` - 4 tests
- `tests/url-validator.test.js` - 3 tests
- `tests/build-validator.test.js` - 3 tests
- `tests/real-validation-gates.integration.test.js` - 5 integration tests

**Estimated Lines:** 350 new/modified

---

## W8: Multi-Workflow Checkpoints

**Priority:** HIGH (enables recovery across workflows)  
**Effort:** 2 days  
**Dependencies:** Phase 1 completion  
**Success Criteria:**
- Checkpoint created at end of each workflow
- Recovery from checkpoint restores exact state
- Cross-workflow state sharing functional

### Implementation Spec

**Current State:** Phase 5 creates single checkpoint after W5 completes. No recovery mechanism.

**Required Capabilities:**
1. **Checkpoint Structure**
   - Location: `src/core/checkpoint.js` (enhance)
   - Content: Workflow state, agent outputs, validation results, learned patterns
   - Format: JSON + binary snapshots
   - Storage: `.claude/checkpoints/ckpt-{timestamp}-{workflow-id}.json`

2. **Checkpoint Recovery**
   - Location: `src/core/checkpoint-recovery.js` (new)
   - Capability: Load checkpoint, restore execution state, resume from interruption point
   - Use Case: Resume W4 deployment after network failure
   - Interface: `recovery.restore(checkpointId)` → WorkflowState

3. **Cross-Workflow State**
   - Location: `src/core/workflow-state.js` (new)
   - Shared Data: Patterns discovered by W5 accessible to W1-W4
   - Mechanism: Central state store with versioning
   - Test: Verify W1 can access patterns from W5 across sessions

4. **Checkpoint Scheduling**
   - Location: `src/core/checkpoint-scheduler.js` (new)
   - Frequency: End of each workflow phase
   - Cleanup: Keep last 5 checkpoints per workflow, delete older
   - Tests: 3 tests for retention policy

**New Files:**
- `src/core/checkpoint-recovery.js` - 150 lines
- `src/core/workflow-state.js` - 120 lines
- `src/core/checkpoint-scheduler.js` - 100 lines

**Tests (new):**
- `tests/checkpoint-recovery.test.js` - 6 tests
- `tests/workflow-state.test.js` - 4 tests
- `tests/checkpoint-integration.test.js` - 5 integration tests

**Estimated Lines:** 370 new

---

## W9: Blocklist Evolution

**Priority:** MEDIUM (improves learning over time)  
**Effort:** 1.5 days  
**Dependencies:** W6 (parallel agents will identify conflicting patterns to block)  
**Success Criteria:**
- Blocklist automatically grows from detected failures
- Old blocklist entries expire after 30 days
- Manual blocklist override functional

### Implementation Spec

**Current State:** W2 creates static blocklist. No evolution mechanism.

**Required Capabilities:**
1. **Automatic Blocklist Growth**
   - Mechanism: When validation fails, capture failure pattern and add to blocklist
   - Storage: `src/knowledge/blocklist.json` (new/enhanced)
   - TTL: Entries expire after 30 days
   - Format: Pattern matcher + timestamp + failure count

2. **Conflict Detection**
   - From W6 parallel execution: When agents disagree, flag pattern as conflicted
   - Action: Add to blocklist with reason "AGENT_CONFLICT"
   - Example: Code Agent says "safe to deploy", Risk Agent says "wait for tests"
   - Resolution: Validation gate breaks tie (reality wins)

3. **Manual Overrides**
   - Location: `src/knowledge/blocklist-manual.json` (new)
   - Format: Patterns to always block or always allow
   - Priority: Manual entries override learned entries

4. **Blocklist Reporting**
   - CLI: `npm run blocklist:report` → Show active + expired entries, conflicts
   - Dashboard: Visual blocklist status and evolution over time

**Tests (new):**
- `tests/blocklist-evolution.test.js` - 6 tests
- `tests/blocklist-ttl.test.js` - 3 tests
- `tests/blocklist-conflict.test.js` - 4 tests

**Estimated Lines:** 200 new

---

## W10: Advanced Learning & Weight Updates

**Priority:** MEDIUM (enables continuous improvement)  
**Effort:** 1.5 days  
**Dependencies:** W6, W7, W8  
**Success Criteria:**
- Agent weights adjust based on validation outcomes
- Top-performing agent gets higher weight in future decisions
- Weights persist across sessions

### Implementation Spec

**Current State:** W5 captures patterns but does not update agent weights.

**Required Mechanism:**
1. **Outcome Scoring**
   - Location: `src/learning/outcome-scorer.js` (new)
   - Inputs: Agent output + validation result (pass/fail) + execution time
   - Formula: Score = (correctness_weight * 0.6) + (speed_weight * 0.3) + (confidence_weight * 0.1)
   - Range: [0, 1.0]

2. **Weight Update Algorithm**
   - Location: `src/learning/weight-updater.js` (enhance)
   - Rule: If agent output matches validation (reality), increase weight by 0.05
   - Rule: If agent fails validation, decrease weight by 0.10
   - Rule: If agent times out, decrease weight by 0.03 (learns to be faster)
   - Bounds: Keep weights in [0.1, 2.0] range (prevent any agent from being disabled)
   - Recalibration: Every 20 executions, normalize weights to sum to 1.0

3. **Weight Persistence**
   - Location: `.claude/knowledge/agent-weights.json` (new)
   - Format: { code_agent: 1.2, qa_agent: 0.95, research_agent: 1.1, risk_agent: 0.8 }
   - Update Frequency: After each validation cycle
   - History: Keep last 10 weight states for trending analysis

4. **Learning Dashboard**
   - Metric: Show which agent has highest weight and why
   - Trend: Visualize weight changes over 10 executions
   - Impact: Show correlation between agent weight and task success

**Algorithm Example:**
```
Execution 1:
  Code Agent output: "Ship v1.2"
  Validation result: PASS ✓ (code deploys successfully)
  Score: 0.95 (high correctness, moderate speed)
  Action: weight[code_agent] = 1.0 + 0.05 = 1.05

Execution 2:
  Code Agent output: "Deploy with breaking changes"
  Validation result: FAIL ✗ (tests fail)
  Score: 0.10 (low correctness)
  Action: weight[code_agent] = 1.05 - 0.10 = 0.95

After 20 executions:
  Normalize: sum(weights) = 4.0 → divide all by 4.0 to get [0.2-0.5] range
```

**Tests (new):**
- `tests/outcome-scorer.test.js` - 8 tests
- `tests/weight-updater.test.js` - 10 tests
- `tests/learning-trending.test.js` - 5 tests

**Estimated Lines:** 350 new

---

## Known Issue Remediation (Day 1)

### Fix 1: Rate Limiter Initialization
**File:** `src/middleware/rate-limiter.js`  
**Change:** Initialize limiter options before export  
**Lines:** ~20  
**Tests:** Verify rate-limiter.test.js passes 3/3

### Fix 2: Jest Worker Timeout
**File:** `jest.config.js` or test setup  
**Change:** Increase worker timeout or add isolation  
**Lines:** ~10  
**Tests:** Verify phase-10.test.js passes

### Fix 3: Console.log Refactor
**Priority:** LOWER (no functional impact)  
**File:** Multiple (src/)  
**Change:** Replace console.log with pino/winston logger  
**Lines:** ~150 (refactor existing)  
**Tests:** Verify no breaking changes in logging tests

---

## Phase 2 Schedule

| Week | Workflow | Effort | Status |
|------|----------|--------|--------|
| Week 1 (6/12-6/13) | **Known Issue Fixes** | 1 day | CRITICAL |
| Week 1 (6/12-6/14) | **W6: Parallel Agents** | 3 days | CRITICAL |
| Week 2 (6/16-6/17) | **W7: Advanced Validation** | 2 days | HIGH |
| Week 2 (6/17-6/18) | **W8: Multi-Checkpoints** | 2 days | HIGH |
| Week 2 (6/18-6/19) | **W9: Blocklist Evolution** | 1.5 days | MEDIUM |
| Week 3 (6/19-6/21) | **W10: Weight Updates** | 1.5 days | MEDIUM |
| Week 3 (6/21-6/25) | **Integration & Testing** | 3 days | CRITICAL |

**Total:** 10 working days

---

## Testing Strategy

### New Tests (Phase 2)
```
Agent Pool:                8 tests
Result Comparator:         6 tests
Parallel Workflows:        4 tests
Validators (real):        15 tests
Checkpoint Recovery:       6 tests
Workflow State:            4 tests
Blocklist Evolution:      13 tests
Weight Updater:           18 tests
Integration Tests:        12 tests
—————————————————————————————
Total New Tests:         86 tests
```

**Target:** 155 + 86 = 241 total tests, >95% pass rate

### Regression Testing
- Run Phase 1 tests (155) with each W6-W10 commit
- Verify no Phase 1 workflows broken by new code
- Test Matrix: Node 18 + 20

---

## Success Criteria

**Phase 2 Completion Requires:**
- ✅ All 3 known Phase 1 issues resolved
- ✅ 241+ total tests, >95% pass rate
- ✅ W6-W10 workflows implemented and validated
- ✅ 0 blocking issues
- ✅ Production-ready for parallel execution
- ✅ <50ms latency overhead from parallelization
- ✅ Documentation updated for all new workflows

---

## Risks & Mitigations

### Risk: Agent Conflicts in Parallel Execution
**Impact:** High (validation becomes ambiguous)  
**Mitigation:** Implement ResultComparator with conflict scoring. Validation gate always picks real outcome.  
**Test:** 3 conflict detection tests in W6

### Risk: Validation Gate Slowdown
**Impact:** Medium (adds 11s to phase time)  
**Mitigation:** Run real validators in parallel (similar to W6). Cache results for repeated checks.  
**Target:** <15s total validation time

### Risk: Checkpoint Storage Explosion
**Impact:** Low (disk usage grows)  
**Mitigation:** Implement retention policy (keep 5 per workflow, delete older than 30 days). Compress old checkpoints.  
**Limit:** <100MB total checkpoint storage

### Risk: Weight Oscillation
**Impact:** Low (weights swing wildly, not converging)  
**Mitigation:** Implement exponential moving average (EMA) instead of simple delta. Bounds prevent extreme swings.  
**Formula:** weight_new = 0.8 * weight_old + 0.2 * outcome_score

---

## Deliverables

### Code
- W6: AgentPool, ResultComparator, Agent Messaging (3 files, 250 lines)
- W7: Real validators enhanced (4 files, 350 lines)
- W8: Checkpoint recovery & state management (3 files, 370 lines)
- W9: Blocklist evolution & TTL (2 files, 200 lines)
- W10: Outcome scoring & weight updates (2 files, 350 lines)
- Fixes: Rate limiter, Jest, logging (3 files, 180 lines)

**Total New Code:** ~1,700 lines

### Documentation
- PHASE_2_COMPLETE.md (similar to PHASE_1_COMPLETE.md)
- AGENT_POOL_GUIDE.md (usage examples)
- VALIDATION_GATE_SPECIFICATION.md (detailed validator specs)
- LEARNING_ALGORITHM.md (weight update math)
- PHASE_3_ROADMAP.md (preview next phase)

### Tests
- 86 new tests across W6-W10
- 15 regression tests for Phase 1 workflows
- Integration tests for cross-workflow scenarios

---

## Go/No-Go Decision Points

| Checkpoint | Gate | Decision |
|-----------|------|----------|
| After Fixes | All 3 issues resolved + Phase 1 tests still pass | GO: Proceed to W6 |
| After W6 | Parallel execution functional, no slowdown >50ms | GO: Proceed to W7 |
| After W7 | Real validation gates work, tests pass | GO: Proceed to W8 |
| After W8 | Checkpoint recovery functional, cross-workflow state works | GO: Proceed to W9 |
| After W9 | Blocklist evolves automatically, old entries expire | GO: Proceed to W10 |
| After W10 | Weights update correctly, persist across sessions | GO: Release Phase 2 |

---

## Phase 3 Preview

Phase 3 will add:
- **W11: Multi-Tenant Isolation** - Separate knowledge bases per tenant
- **W12: Real-Time Dashboard** - Live workflow visualization
- **W13: Auto-Scaling** - Horizontal scaling of agent pool
- **W14: Observability** - Distributed tracing, metrics export

---

See PHASE_1_COMPLETE.md for Phase 1 summary and CHECKPOINT_P1_COMPLETE.json for current state.
